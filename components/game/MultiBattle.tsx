"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type { MultiBattleResult, MultiRoundRecord } from "@/lib/game/types";
import { CHARACTERS } from "@/lib/claude/characters";
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
  | "complete";

interface MultiBattleProps {
  matchId: string;
  userId: string;
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
  const [currentCharacterId, setCurrentCharacterId] = useState<string | null>(
    null,
  );
  const [lastResult, setLastResult] = useState<MultiBattleResult | null>(null);
  const [finalWinnerId, setFinalWinnerId] = useState<string | null>(null);
  const [rounds, setRounds] = useState<MultiRoundRecord[]>([]);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const myPromptRef = useRef<string | null>(null);
  const oppPromptRef = useRef<string | null>(null);
  const judgingRef = useRef(false);
  const isPlayer1Ref = useRef(false);
  const currentCharacterRef = useRef<string | null>(null);
  const roundNumberRef = useRef(1);
  const subscribedRef = useRef(false);

  const rosterForRoulette = useMemo(
    () => CHARACTERS.map((c) => ({ id: c.id, name: c.displayName })),
    [],
  );

  const pickRandomCharacter = useCallback(() => {
    return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)].id;
  }, []);

  const applyRoundStart = useCallback(
    (characterId: string, nextRoundNumber: number) => {
      myPromptRef.current = null;
      oppPromptRef.current = null;
      judgingRef.current = false;
      setLastResult(null);
      setCurrentCharacterId(characterId);
      currentCharacterRef.current = characterId;
      setRoundNumber(nextRoundNumber);
      roundNumberRef.current = nextRoundNumber;
      setPhase("roulette");
    },
    [],
  );

  const startRound = useCallback(
    async (nextRoundNumber: number) => {
      if (!isPlayer1Ref.current) return;
      const channel = channelRef.current;
      if (!channel) return;
      const characterId = pickRandomCharacter();
      await channel.send({
        type: "broadcast",
        event: "round_start",
        payload: { characterId, roundNumber: nextRoundNumber },
      });
      applyRoundStart(characterId, nextRoundNumber);
    },
    [pickRandomCharacter, applyRoundStart],
  );

  const applyRoundResult = useCallback(
    (result: MultiBattleResult) => {
      setLastResult(result);
      setPhase("result");
      setRounds((prev) => [
        ...prev,
        {
          ...result,
          roundNumber: roundNumberRef.current,
          characterId: currentCharacterRef.current ?? "",
        },
      ]);
      setP1Wins((prev) => {
        const next = result.winner === "player1" ? prev + 1 : prev;
        setP2Wins((prev2) => {
          const next2 = result.winner === "player2" ? prev2 + 1 : prev2;
          const matchOver = next >= 2 || next2 >= 2;
          if (matchOver) {
            const winnerId = next > next2 ? player1Id : player2Id;
            window.setTimeout(() => {
              void finalizeMatch(winnerId);
            }, 3500);
          } else {
            window.setTimeout(() => {
              void startRound(roundNumberRef.current + 1);
            }, 3500);
          }
          return next2;
        });
        return next;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [player1Id, player2Id, startRound],
  );

  const tryJudge = useCallback(async () => {
    if (!isPlayer1Ref.current) return;
    if (judgingRef.current) return;
    if (myPromptRef.current === null || oppPromptRef.current === null) return;
    judgingRef.current = true;
    setPhase("judging");
    const channel = channelRef.current;
    if (!channel) return;

    try {
      const res = await fetch("/api/multi-battle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt1: myPromptRef.current,
          prompt2: oppPromptRef.current,
          characterId: currentCharacterRef.current,
          matchId,
          roundNumber: roundNumberRef.current,
        }),
      });
      if (!res.ok) throw new Error(`judge failed: ${res.status}`);
      const result = (await res.json()) as MultiBattleResult;
      await channel.send({
        type: "broadcast",
        event: "round_result",
        payload: { result, roundNumber: roundNumberRef.current },
      });
      applyRoundResult(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "judge error");
      judgingRef.current = false;
    }
  }, [matchId, applyRoundResult]);

  const finalizeMatch = useCallback(
    async (winnerId: string) => {
      setFinalWinnerId(winnerId);
      setPhase("complete");
      if (isPlayer1Ref.current) {
        const supabase = createClient();
        await supabase
          .from("matches")
          .update({ status: "complete", winner_id: winnerId })
          .eq("id", matchId);
        const channel = channelRef.current;
        if (channel) {
          await channel.send({
            type: "broadcast",
            event: "match_complete",
            payload: { winnerId },
          });
        }
      }
    },
    [matchId],
  );

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

      if (match.status === "complete") {
        setFinalWinnerId((match.winner_id as string | null) ?? null);
        setPhase("complete");
        return;
      }

      const channel = supabase.channel(`match:${matchId}`, {
        config: { broadcast: { self: false } },
      });
      channelRef.current = channel;

      channel.on("broadcast", { event: "round_start" }, ({ payload }) => {
        const { characterId, roundNumber: rn } = payload as {
          characterId: string;
          roundNumber: number;
        };
        applyRoundStart(characterId, rn);
      });

      channel.on("broadcast", { event: "prompt_submit" }, ({ payload }) => {
        const { userId: fromId, prompt } = payload as {
          userId: string;
          prompt: string;
        };
        if (fromId === userId) return;
        oppPromptRef.current = prompt;
        void tryJudge();
      });

      channel.on("broadcast", { event: "round_result" }, ({ payload }) => {
        const { result } = payload as { result: MultiBattleResult };
        applyRoundResult(result);
      });

      channel.on("broadcast", { event: "match_complete" }, ({ payload }) => {
        const { winnerId } = payload as { winnerId: string };
        setFinalWinnerId(winnerId);
        setPhase("complete");
      });

      channel.subscribe((status) => {
        if (status !== "SUBSCRIBED" || subscribedRef.current) return;
        subscribedRef.current = true;
        const nextRoundNumber = existingRounds.length + 1;
        if (amP1) {
          void startRound(nextRoundNumber);
        } else {
          setPhase("loading");
        }
      });
    })();

    return () => {
      cancelled = true;
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
      myPromptRef.current = trimmed;
      setPhase("waiting");
      await channel.send({
        type: "broadcast",
        event: "prompt_submit",
        payload: { userId, prompt: trimmed },
      });
      if (isPlayer1Ref.current) {
        void tryJudge();
      }
    },
    [userId, tryJudge],
  );

  const currentCharacter = useMemo(
    () => CHARACTERS.find((c) => c.id === currentCharacterId) ?? null,
    [currentCharacterId],
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

  if (phase === "loading" || !currentCharacter) {
    if (phase === "complete") {
      return (
        <MatchResult
          iWon={finalWinnerId === userId}
          iAmPlayer1={isPlayer1}
          rounds={rounds}
        />
      );
    }
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

  if (phase === "complete") {
    return (
      <MatchResult
        iWon={finalWinnerId === userId}
        iAmPlayer1={isPlayer1}
        rounds={rounds}
      />
    );
  }

  if (phase === "roulette") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <div className="mb-6 text-xs uppercase tracking-[0.3em] text-zinc-500">
          Round {roundNumber} / 3 — Selecting Fighter
        </div>
        <CharacterRoulette
          characters={rosterForRoulette}
          selectedId={currentCharacter.id}
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
        characterId={currentCharacter.id}
        characterName={currentCharacter.displayName}
        onComplete={handleVsComplete}
      />
    );
  }

  if (phase === "result" && lastResult) {
    return (
      <RoundResult
        roundNumber={roundNumber}
        result={lastResult}
        iAmPlayer1={isPlayer1}
        myWins={myWins}
        oppWins={oppWins}
      />
    );
  }

  return (
    <MultiRound
      roundNumber={roundNumber}
      character={{
        id: currentCharacter.id,
        displayName: currentCharacter.displayName,
        traits: currentCharacter.traits,
      }}
      myWins={myWins}
      oppWins={oppWins}
      submitted={phase === "waiting" || phase === "judging"}
      onSubmit={submitPrompt}
    />
  );
}
