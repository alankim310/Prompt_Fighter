"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type {
  RealtimeChannel,
  RealtimePresenceState,
} from "@supabase/supabase-js";

interface MatchmakingQueueProps {
  userId: string;
}

type QueuePresence = { userId: string };

const MATCHMAKING_TIMEOUT_MS = 180_000;

export function MatchmakingQueue({ userId }: MatchmakingQueueProps) {
  const router = useRouter();
  const [status, setStatus] = useState("Finding opponent...");
  const [dots, setDots] = useState(0);
  const [timedOut, setTimedOut] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(MATCHMAKING_TIMEOUT_MS / 1000);
  const matchedRef = useRef(false);
  const [sessionKey, setSessionKey] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setDots((d) => (d + 1) % 4), 400);
    return () => clearInterval(id);
  }, []);

  // Countdown ticker
  useEffect(() => {
    if (timedOut) return;
    setSecondsLeft(MATCHMAKING_TIMEOUT_MS / 1000);
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(
        0,
        Math.ceil((MATCHMAKING_TIMEOUT_MS - elapsed) / 1000),
      );
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        if (!matchedRef.current) setTimedOut(true);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [timedOut, sessionKey]);

  useEffect(() => {
    if (timedOut) return;

    const supabase = createClient();
    let cancelled = false;

    // Cleanup any of my abandoned in_progress matches before queueing.
    (async () => {
      await supabase
        .from("matches")
        .update({ status: "abandoned" })
        .eq("status", "in_progress")
        .or(`player1_id.eq.${userId},player2_id.eq.${userId}`);
    })();

    const channel: RealtimeChannel = supabase.channel("matchmaking-queue", {
      config: { presence: { key: userId } },
    });

    const goToMatch = (matchId: string) => {
      if (matchedRef.current) return;
      matchedRef.current = true;
      supabase.removeChannel(channel);
      router.push(`/multi/battle/${matchId}`);
    };

    const tryPair = async () => {
      if (matchedRef.current || cancelled) return;
      const state =
        channel.presenceState() as RealtimePresenceState<QueuePresence>;
      const userIds = Object.keys(state).filter((k) => k && k.length > 0);
      if (userIds.length < 2) return;

      const sorted = [...userIds].sort();
      const player1 = sorted[0];
      const player2 = sorted[1];

      if (userId !== player1 && userId !== player2) return;
      if (userId !== player1) {
        setStatus("Opponent found! Creating match");
        return;
      }

      setStatus("Opponent found! Creating match");
      const { data, error } = await supabase
        .from("matches")
        .insert({
          player1_id: player1,
          player2_id: player2,
          rounds: [],
          status: "in_progress",
        })
        .select("id")
        .single();

      if (error || !data) {
        setStatus("Failed to create match. Retrying...");
        matchedRef.current = false;
        return;
      }

      await channel.send({
        type: "broadcast",
        event: "match_found",
        payload: { matchId: data.id, player1, player2 },
      });

      goToMatch(data.id);
    };

    channel.on("broadcast", { event: "match_found" }, ({ payload }) => {
      const { matchId, player1, player2 } = payload as {
        matchId: string;
        player1: string;
        player2: string;
      };
      if (userId === player1 || userId === player2) {
        goToMatch(matchId);
      }
    });

    channel.on("presence", { event: "sync" }, () => {
      void tryPair();
    });
    channel.on("presence", { event: "join" }, () => {
      void tryPair();
    });

    channel.subscribe(async (subStatus) => {
      if (subStatus === "SUBSCRIBED") {
        await channel.track({ userId } satisfies QueuePresence);
      }
    });

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [userId, router, timedOut, sessionKey]);

  if (timedOut) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-black p-8 text-white">
        <div className="text-xs uppercase tracking-[0.4em] text-zinc-500">
          No Opponent Found
        </div>
        <div className="bg-gradient-to-b from-yellow-300 to-fuchsia-500 bg-clip-text text-5xl font-black text-transparent md:text-6xl">
          TRY AGAIN LATER
        </div>
        <p className="max-w-md text-center text-sm text-zinc-400">
          We couldn&apos;t find a challenger in 3 minutes. The arena is quiet
          right now.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => {
              matchedRef.current = false;
              setTimedOut(false);
              setStatus("Finding opponent...");
              setSessionKey((k) => k + 1);
            }}
            className="rounded-lg bg-fuchsia-600 px-6 py-2 font-bold uppercase tracking-wider text-white hover:bg-fuchsia-500"
          >
            Retry
          </button>
          <button
            onClick={() => router.push("/")}
            className="rounded-lg border border-zinc-700 px-6 py-2 font-bold uppercase tracking-wider text-zinc-300 hover:bg-zinc-900"
          >
            Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-black p-8 text-white">
      <div className="relative">
        <div className="h-32 w-32 animate-spin rounded-full border-4 border-zinc-800 border-t-fuchsia-500" />
        <div className="absolute inset-0 flex items-center justify-center text-4xl">
          ⚔️
        </div>
      </div>
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {status}
          <span className="inline-block w-8 text-left">
            {".".repeat(dots)}
          </span>
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Waiting for another challenger to join the queue
        </p>
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.3em] text-zinc-500">
          Timeout in {Math.floor(secondsLeft / 60)}:
          {String(secondsLeft % 60).padStart(2, "0")}
        </p>
      </div>
      <button
        onClick={() => router.push("/")}
        className="rounded-md border border-zinc-700 px-6 py-2 text-zinc-300 transition hover:bg-zinc-900"
      >
        Cancel
      </button>
    </div>
  );
}
