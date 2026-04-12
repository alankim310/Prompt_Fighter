"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type { MultiRoundRecord } from "@/lib/game/types";
import { CHARACTERS, getCharacter } from "@/lib/claude/characters";
import { CharacterRoulette } from "./CharacterRoulette";
import { VSScreen } from "./VSScreen";
import { MultiRound } from "./MultiRound";
import { RoundResult } from "./RoundResult";
import { MatchResult } from "./MatchResult";

type Phase =
  | "loading"
  | "roulette"
  | "vs"
  | "prompt"
  | "waiting"
  | "judging"
  | "result"
  | "void"
  | "disconnected"
  | "complete";

interface MultiBattleProps {
  matchId: string;
  userId: string;
}

const PHASE_RESULT_HOLD_MS = 7000;
const PHASE_VOID_HOLD_MS = 3000;
const PROMPT_TIMEOUT_MS = 30_000;
const DISCONNECT_GRACE_MS = 10_000;
const MAX_ROUNDS = 6;

function pickRandomCharacterId(): string {
  return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)].id;
}

export function MultiBattle({ matchId, userId }: MultiBattleProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("loading");
  const [error, setError] = useState<string | null>(null);
  const [isPlayer1, setIsPlayer1] = useState(false);
  const [player1Id, setPlayer1Id] = useState<string>("");
  const [player2Id, setPlayer2Id] = useState<string>("");
  const [roundNumber, setRoundNumber] = useState(1);
  const [p1Wins, setP1Wins] = useState(0);
  const [p2Wins, setP2Wins] = useState(0);
  const [myCharacterId, setMyCharacterId] = useState<string | null>(null);
  const [opponentCharacterId, setOpponentCharacterId] = useState<string | null>(
    null,
  );
  const [lastRecord, setLastRecord] = useState<MultiRoundRecord | null>(null);
  const [voidReason, setVoidReason] = useState<string>("");
  const [finalWinnerId, setFinalWinnerId] = useState<string | null>(null);
  const [rounds, setRounds] = useState<MultiRoundRecord[]>([]);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const myPromptRef = useRef<string | null>(null);
  const oppPromptRef = useRef<string | null>(null);
  const myTimedOutRef = useRef(false);
  const oppTimedOutRef = useRef(false);
  const resolvingRef = useRef(false);
  const isPlayer1Ref = useRef(false);
  const myCharacterRef = useRef<string | null>(null);
  const opponentCharacterRef = useRef<string | null>(null);
  const roundNumberRef = useRef(1);
  const subscribedRef = useRef(false);
  const disconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const matchOverRef = useRef(false);
  const totalRoundsPlayedRef = useRef(0);
  const player1IdRef = useRef<string>("");
  const player2IdRef = useRef<string>("");

  const rosterForRoulette = useMemo(
    () => CHARACTERS.map((c) => ({ id: c.id, name: c.displayName })),
    [],
  );

  const broadcastMyPick = useCallback(
    (characterId: string, rn: number) => {
      const channel = channelRef.current;
      if (!channel) return;
      const send = () => {
        void channel.send({
          type: "broadcast",
          event: "character_pick",
          payload: { userId, characterId, roundNumber: rn },
        });
      };
      send();
      window.setTimeout(send, 400);
      window.setTimeout(send, 900);
    },
    [userId],
  );

  const startLocalRound = useCallback(
    (nextRoundNumber: number) => {
      myPromptRef.current = null;
      oppPromptRef.current = null;
      myTimedOutRef.current = false;
      oppTimedOutRef.current = false;
      resolvingRef.current = false;
      setLastRecord(null);
      setVoidReason("");

      const pick = pickRandomCharacterId();
      myCharacterRef.current = pick;
      setMyCharacterId(pick);
      opponentCharacterRef.current = null;
      setOpponentCharacterId(null);

      setRoundNumber(nextRoundNumber);
      roundNumberRef.current = nextRoundNumber;
      setPhase("roulette");

      broadcastMyPick(pick, nextRoundNumber);
    },
    [broadcastMyPick],
  );

  const finalizeMatch = useCallback(
    async (winnerId: string | null, reason?: string) => {
      if (matchOverRef.current) return;
      matchOverRef.current = true;
      setFinalWinnerId(winnerId);
      setPhase("complete");
      if (isPlayer1Ref.current) {
        const supabase = createClient();
        await supabase
          .from("matches")
          .update({ status: "completed", winner_id: winnerId })
          .eq("id", matchId);
        const channel = channelRef.current;
        if (channel) {
          await channel.send({
            type: "broadcast",
            event: "match_complete",
            payload: { winnerId, reason: reason ?? null },
          });
        }
      }
    },
    [matchId],
  );

  const applyRoundRecord = useCallback(
    (record: MultiRoundRecord) => {
      setLastRecord(record);
      setRounds((prev) => [...prev, record]);
      totalRoundsPlayedRef.current += 1;

      if (record.winner === "void") {
        setVoidReason(record.voidReason ?? "Round voided.");
        setPhase("void");
        window.setTimeout(() => {
          if (matchOverRef.current) return;
          if (totalRoundsPlayedRef.current >= MAX_ROUNDS) {
            const p1 = player1IdRef.current;
            const p2 = player2IdRef.current;
            const winnerId =
              p1Wins > p2Wins ? p1 : p2Wins > p1Wins ? p2 : null;
            void finalizeMatch(winnerId, "max-rounds");
            return;
          }
          startLocalRound(roundNumberRef.current + 1);
        }, PHASE_VOID_HOLD_MS);
        return;
      }

      setPhase("result");
      setP1Wins((prev) => {
        const next = record.winner === "player1" ? prev + 1 : prev;
        setP2Wins((prev2) => {
          const next2 = record.winner === "player2" ? prev2 + 1 : prev2;
          const reachedWinThreshold = next >= 2 || next2 >= 2;
          const reachedCap = totalRoundsPlayedRef.current >= MAX_ROUNDS;
          if (reachedWinThreshold || reachedCap) {
            const p1 = player1IdRef.current;
            const p2 = player2IdRef.current;
            const winnerId = next > next2 ? p1 : next2 > next ? p2 : null;
            window.setTimeout(() => {
              void finalizeMatch(winnerId);
            }, PHASE_RESULT_HOLD_MS);
          } else {
            window.setTimeout(() => {
              if (matchOverRef.current) return;
              startLocalRound(roundNumberRef.current + 1);
            }, PHASE_RESULT_HOLD_MS);
          }
          return next2;
        });
        return next;
      });
    },
    [startLocalRound, finalizeMatch, p1Wins, p2Wins],
  );

  const persistSyntheticRound = useCallback(
    async (record: MultiRoundRecord) => {
      if (!isPlayer1Ref.current) return;
      const supabase = createClient();
      const { data } = await supabase
        .from("matches")
        .select("rounds")
        .eq("id", matchId)
        .single();
      const existing = ((data?.rounds as MultiRoundRecord[] | null) ?? []).filter(
        (r) => r.roundNumber !== record.roundNumber,
      );
      await supabase
        .from("matches")
        .update({ rounds: [...existing, record] })
        .eq("id", matchId);
    },
    [matchId],
  );

  const broadcastRecord = useCallback(async (record: MultiRoundRecord) => {
    const channel = channelRef.current;
    if (!channel) return;
    await channel.send({
      type: "broadcast",
      event: "round_record",
      payload: { record },
    });
  }, []);

  const tryResolveRound = useCallback(async () => {
    if (!isPlayer1Ref.current) return;
    if (resolvingRef.current) return;

    const iHavePrompt = myPromptRef.current !== null;
    const iTimedOut = myTimedOutRef.current;
    const oppHasPrompt = oppPromptRef.current !== null;
    const oppTimedOut = oppTimedOutRef.current;

    const iReady = iHavePrompt || iTimedOut;
    const oppReady = oppHasPrompt || oppTimedOut;
    if (!iReady || !oppReady) return;

    if (!myCharacterRef.current || !opponentCharacterRef.current) return;

    resolvingRef.current = true;
    const rn = roundNumberRef.current;
    const character1Id = myCharacterRef.current;
    const character2Id = opponentCharacterRef.current;
    const prompt1 = myPromptRef.current ?? "";
    const prompt2 = oppPromptRef.current ?? "";

    // Case A: both timed out → void
    if (iTimedOut && oppTimedOut) {
      const record: MultiRoundRecord = {
        roundNumber: rn,
        character1Id,
        character2Id,
        prompt1,
        prompt2,
        winner: "void",
        narrative: "Both fighters hesitated. The round is voided.",
        reasoning: "Both players ran out of time.",
        voidReason: "Both players timed out",
      };
      await broadcastRecord(record);
      applyRoundRecord(record);
      return;
    }

    // Case B: one timed out → synthetic auto-loss
    if (iTimedOut || oppTimedOut) {
      const p1Lost = iTimedOut;
      const winner = p1Lost ? "player2" : "player1";
      const record: MultiRoundRecord = {
        roundNumber: rn,
        character1Id,
        character2Id,
        prompt1,
        prompt2,
        winner,
        narrative: p1Lost
          ? "Player 1 froze in place as time ran out. Player 2 lands a free strike."
          : "Player 2 froze in place as time ran out. Player 1 lands a free strike.",
        reasoning: "Auto-loss: one player ran out of time.",
      };
      setPhase("judging");
      await persistSyntheticRound(record);
      await broadcastRecord(record);
      applyRoundRecord(record);
      return;
    }

    // Case C: both submitted → call judge API
    setPhase("judging");
    try {
      const res = await fetch("/api/multi-battle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt1,
          prompt2,
          character1Id,
          character2Id,
          matchId,
          roundNumber: rn,
        }),
      });
      if (!res.ok) throw new Error(`judge failed: ${res.status}`);
      const { record } = (await res.json()) as { record: MultiRoundRecord };
      await broadcastRecord(record);
      applyRoundRecord(record);
    } catch (e) {
      // Void the round on judge failure
      const reason =
        e instanceof Error ? e.message : "judge unavailable";
      const record: MultiRoundRecord = {
        roundNumber: rn,
        character1Id,
        character2Id,
        prompt1,
        prompt2,
        winner: "void",
        narrative: "The judge's scroll goes blank. This round does not count.",
        reasoning: `Judge error: ${reason}`,
        voidReason: "Judge API failure",
      };
      await broadcastRecord(record);
      applyRoundRecord(record);
    }
  }, [matchId, applyRoundRecord, broadcastRecord, persistSyntheticRound]);

  const handlePromptTimeout = useCallback(async () => {
    if (myTimedOutRef.current) return;
    if (myPromptRef.current !== null) return;
    myTimedOutRef.current = true;
    setPhase("waiting");
    const channel = channelRef.current;
    if (channel) {
      await channel.send({
        type: "broadcast",
        event: "prompt_timeout",
        payload: { userId, roundNumber: roundNumberRef.current },
      });
    }
    if (isPlayer1Ref.current) {
      void tryResolveRound();
    }
  }, [userId, tryResolveRound]);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    (async () => {
      const { data: match, error: matchError } = await supabase
        .from("matches")
        .select("player1_id, player2_id, rounds, status, winner_id")
        .eq("id", matchId)
        .single();

      if (cancelled) return;

      if (matchError || !match) {
        setError("Match not found");
        return;
      }

      const p1 = match.player1_id as string;
      const p2 = match.player2_id as string;
      if (userId !== p1 && userId !== p2) {
        setError("Not a participant in this match");
        return;
      }

      setPlayer1Id(p1);
      setPlayer2Id(p2);
      player1IdRef.current = p1;
      player2IdRef.current = p2;
      const amP1 = userId === p1;
      setIsPlayer1(amP1);
      isPlayer1Ref.current = amP1;

      const existingRounds = (match.rounds as MultiRoundRecord[]) ?? [];
      const p1WinsExisting = existingRounds.filter(
        (r) => r.winner === "player1",
      ).length;
      const p2WinsExisting = existingRounds.filter(
        (r) => r.winner === "player2",
      ).length;
      setP1Wins(p1WinsExisting);
      setP2Wins(p2WinsExisting);
      setRounds(existingRounds);
      totalRoundsPlayedRef.current = existingRounds.length;

      if (match.status === "completed" || match.status === "abandoned") {
        matchOverRef.current = true;
        setFinalWinnerId((match.winner_id as string | null) ?? null);
        setPhase("complete");
        return;
      }

      const channel = supabase.channel(`match:${matchId}`, {
        config: {
          broadcast: { self: false },
          presence: { key: userId },
        },
      });
      channelRef.current = channel;

      channel.on("broadcast", { event: "character_pick" }, ({ payload }) => {
        const {
          userId: fromId,
          characterId,
          roundNumber: rn,
        } = payload as {
          userId: string;
          characterId: string;
          roundNumber: number;
        };
        if (fromId === userId) return;
        if (rn !== roundNumberRef.current) return;
        if (opponentCharacterRef.current === characterId) return;
        opponentCharacterRef.current = characterId;
        setOpponentCharacterId(characterId);
        if (myCharacterRef.current) {
          void channel.send({
            type: "broadcast",
            event: "character_pick",
            payload: {
              userId,
              characterId: myCharacterRef.current,
              roundNumber: roundNumberRef.current,
            },
          });
        }
      });

      channel.on("broadcast", { event: "prompt_submit" }, ({ payload }) => {
        const {
          userId: fromId,
          prompt,
          characterId,
        } = payload as {
          userId: string;
          prompt: string;
          characterId?: string;
        };
        if (fromId === userId) return;
        oppPromptRef.current = prompt;
        if (characterId && !opponentCharacterRef.current) {
          opponentCharacterRef.current = characterId;
          setOpponentCharacterId(characterId);
        }
        void tryResolveRound();
      });

      channel.on("broadcast", { event: "prompt_timeout" }, ({ payload }) => {
        const { userId: fromId, roundNumber: rn } = payload as {
          userId: string;
          roundNumber: number;
        };
        if (fromId === userId) return;
        if (rn !== roundNumberRef.current) return;
        oppTimedOutRef.current = true;
        void tryResolveRound();
      });

      channel.on("broadcast", { event: "round_record" }, ({ payload }) => {
        const { record } = payload as { record: MultiRoundRecord };
        applyRoundRecord(record);
      });

      channel.on("broadcast", { event: "match_complete" }, ({ payload }) => {
        const { winnerId } = payload as { winnerId: string | null };
        matchOverRef.current = true;
        setFinalWinnerId(winnerId);
        setPhase("complete");
      });

      channel.on("presence", { event: "join" }, ({ newPresences }) => {
        for (const p of newPresences as Array<{ userId?: string }>) {
          if (p.userId && p.userId !== userId) {
            if (disconnectTimerRef.current) {
              clearTimeout(disconnectTimerRef.current);
              disconnectTimerRef.current = null;
            }
          }
        }
      });

      channel.on("presence", { event: "leave" }, ({ leftPresences }) => {
        for (const p of leftPresences as Array<{ userId?: string }>) {
          if (p.userId && p.userId !== userId) {
            if (matchOverRef.current) return;
            if (disconnectTimerRef.current) {
              clearTimeout(disconnectTimerRef.current);
            }
            disconnectTimerRef.current = setTimeout(() => {
              if (matchOverRef.current) return;
              setPhase("disconnected");
              void finalizeMatch(userId, "opponent-disconnect");
            }, DISCONNECT_GRACE_MS);
          }
        }
      });

      channel.subscribe(async (status) => {
        if (status !== "SUBSCRIBED" || subscribedRef.current) return;
        subscribedRef.current = true;
        await channel.track({ userId });
        const nextRoundNumber = existingRounds.length + 1;
        startLocalRound(nextRoundNumber);
      });
    })();

    return () => {
      cancelled = true;
      if (disconnectTimerRef.current) {
        clearTimeout(disconnectTimerRef.current);
        disconnectTimerRef.current = null;
      }
      const channel = channelRef.current;
      if (channel) {
        const supabase = createClient();
        supabase.removeChannel(channel);
        channelRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchId, userId]);

  const submitPrompt = useCallback(
    async (prompt: string) => {
      const channel = channelRef.current;
      if (!channel) return;
      const trimmed = prompt.trim();
      if (!trimmed) return;
      if (myTimedOutRef.current) return;
      myPromptRef.current = trimmed;
      setPhase("waiting");
      await channel.send({
        type: "broadcast",
        event: "prompt_submit",
        payload: {
          userId,
          prompt: trimmed,
          characterId: myCharacterRef.current,
        },
      });
      if (isPlayer1Ref.current) {
        void tryResolveRound();
      }
    },
    [userId, tryResolveRound],
  );

  const myCharacter = useMemo(
    () => (myCharacterId ? getCharacter(myCharacterId) : null),
    [myCharacterId],
  );
  const opponentCharacter = useMemo(
    () => (opponentCharacterId ? getCharacter(opponentCharacterId) : null),
    [opponentCharacterId],
  );

  const handleRouletteComplete = useCallback(() => {
    setPhase((p) => (p === "roulette" ? "vs" : p));
  }, []);

  const handleVsComplete = useCallback(() => {
    setPhase((p) => (p === "vs" ? "prompt" : p));
  }, []);

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black p-8 text-white">
        <h1 className="text-2xl font-bold text-red-400">Error</h1>
        <p className="text-zinc-400">{error}</p>
        <button
          onClick={() => router.push("/")}
          className="rounded border border-zinc-700 px-4 py-2"
        >
          Home
        </button>
      </main>
    );
  }

  const myWins = isPlayer1 ? p1Wins : p2Wins;
  const oppWins = isPlayer1 ? p2Wins : p1Wins;

  if (phase === "disconnected") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-black p-8 text-white">
        <div className="text-xs uppercase tracking-[0.4em] text-zinc-500">
          Opponent Disconnected
        </div>
        <div className="bg-gradient-to-b from-yellow-300 to-fuchsia-500 bg-clip-text text-6xl font-black text-transparent">
          YOU WIN
        </div>
        <p className="max-w-md text-center text-sm text-zinc-400">
          Your opponent left the arena and did not return. Victory is yours by
          default.
        </p>
        <button
          onClick={() => router.push("/multi")}
          className="rounded-lg bg-fuchsia-600 px-6 py-2 font-bold uppercase tracking-wider text-white hover:bg-fuchsia-500"
        >
          Back to Matchmaking
        </button>
      </main>
    );
  }

  if (phase === "complete") {
    return (
      <MatchResult
        iWon={finalWinnerId === userId}
        iAmPlayer1={isPlayer1}
        rounds={rounds}
      />
    );
  }

  if (phase === "loading" || !myCharacter) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-fuchsia-500" />
          <div className="text-sm uppercase tracking-widest text-zinc-400">
            Loading match…
          </div>
        </div>
      </main>
    );
  }

  const player1Char = isPlayer1
    ? myCharacter
    : (opponentCharacter ?? myCharacter);
  const player2Char = isPlayer1
    ? (opponentCharacter ?? myCharacter)
    : myCharacter;

  if (phase === "void" && lastRecord) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-black p-8 text-white">
        <div className="text-xs uppercase tracking-[0.4em] text-zinc-500">
          Round {lastRecord.roundNumber}
        </div>
        <div className="text-6xl font-black text-amber-400 drop-shadow-[0_0_30px_rgba(251,191,36,0.5)]">
          VOIDED
        </div>
        <p className="max-w-md text-center text-sm text-zinc-400">
          {voidReason || lastRecord.voidReason || "Round voided."}
        </p>
        <div className="rounded-lg border border-white/10 bg-black/60 px-6 py-3 font-mono text-2xl font-black">
          <span className="text-fuchsia-400">{myWins}</span>
          <span className="mx-2 text-zinc-600">—</span>
          <span className="text-cyan-400">{oppWins}</span>
        </div>
      </main>
    );
  }

  if (phase === "roulette") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <div className="mb-6 text-xs uppercase tracking-[0.3em] text-zinc-500">
          Round {roundNumber} — Rolling your fighter
        </div>
        <CharacterRoulette
          characters={rosterForRoulette}
          selectedId={myCharacter.id}
          onComplete={handleRouletteComplete}
        />
      </main>
    );
  }

  if (phase === "vs") {
    return (
      <VSScreen
        player1Name={isPlayer1 ? "You" : "Opponent"}
        player2Name={isPlayer1 ? "Opponent" : "You"}
        player1CharacterId={player1Char.id}
        player1CharacterName={player1Char.displayName}
        player2CharacterId={player2Char.id}
        player2CharacterName={player2Char.displayName}
        onComplete={handleVsComplete}
      />
    );
  }

  if (phase === "result" && lastRecord && lastRecord.winner !== "void") {
    return (
      <RoundResult
        roundNumber={roundNumber}
        record={lastRecord}
        iAmPlayer1={isPlayer1}
        myWins={myWins}
        oppWins={oppWins}
      />
    );
  }

  return (
    <MultiRound
      roundNumber={roundNumber}
      myCharacter={{
        id: myCharacter.id,
        displayName: myCharacter.displayName,
        traits: myCharacter.traits,
      }}
      opponentCharacter={
        opponentCharacter
          ? {
              id: opponentCharacter.id,
              displayName: opponentCharacter.displayName,
              traits: opponentCharacter.traits,
            }
          : null
      }
      myWins={myWins}
      oppWins={oppWins}
      submitted={phase === "waiting" || phase === "judging"}
      timerMs={PROMPT_TIMEOUT_MS}
      onSubmit={submitPrompt}
      onTimeout={handlePromptTimeout}
    />
  );
}
