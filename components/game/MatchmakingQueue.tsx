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

export function MatchmakingQueue({ userId }: MatchmakingQueueProps) {
  const router = useRouter();
  const [status, setStatus] = useState("Finding opponent...");
  const [dots, setDots] = useState(0);
  const matchedRef = useRef(false);

  useEffect(() => {
    const id = setInterval(() => setDots((d) => (d + 1) % 4), 400);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const supabase = createClient();
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
      if (matchedRef.current) return;
      const state = channel.presenceState() as RealtimePresenceState<QueuePresence>;
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
      supabase.removeChannel(channel);
    };
  }, [userId, router]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-8 p-8">
      <div className="relative">
        <div className="w-32 h-32 rounded-full border-4 border-zinc-800 border-t-fuchsia-500 animate-spin" />
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
        <p className="text-zinc-400 mt-2 text-sm">
          Waiting for another challenger to join the queue
        </p>
      </div>
      <button
        onClick={() => router.push("/")}
        className="px-6 py-2 rounded-md border border-zinc-700 text-zinc-300 hover:bg-zinc-900 transition"
      >
        Cancel
      </button>
    </div>
  );
}
