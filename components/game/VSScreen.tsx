"use client";

import Image from "next/image";
import { useEffect } from "react";

interface VSScreenProps {
  player1Name: string;
  player2Name: string;
  player1CharacterId: string;
  player1CharacterName: string;
  player2CharacterId: string;
  player2CharacterName: string;
  onComplete?: () => void;
  durationMs?: number;
}

export function VSScreen({
  player1Name,
  player2Name,
  player1CharacterId,
  player1CharacterName,
  player2CharacterId,
  player2CharacterName,
  onComplete,
  durationMs = 2000,
}: VSScreenProps) {
  useEffect(() => {
    if (!onComplete) return;
    const id = window.setTimeout(onComplete, durationMs);
    return () => window.clearTimeout(id);
  }, [onComplete, durationMs]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.08)_0%,transparent_50%,rgba(6,182,212,0.08)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.9)_80%)]" />

      <div className="relative flex w-full max-w-6xl items-center justify-between px-8">
        <div className="flex flex-col items-center gap-3 animate-[vsSlideInLeft_0.5s_ease-out]">
          <div className="relative h-64 w-64 md:h-80 md:w-80">
            <Image
              src={`/characters/${player1CharacterId}.png`}
              alt={player1CharacterName}
              fill
              sizes="320px"
              className="object-contain drop-shadow-[0_0_40px_rgba(245,158,11,0.6)]"
              priority
            />
          </div>
          <div className="text-xs uppercase tracking-[0.3em] text-amber-400">
            Player 1 — {player1CharacterName}
          </div>
          <div className="text-2xl font-black text-zinc-300 md:text-3xl">
            {player1Name}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-8xl font-black md:text-9xl animate-pulse">
            <span className="bg-gradient-to-r from-amber-400 to-cyan-400 bg-clip-text text-transparent">
              VS
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 animate-[vsSlideInRight_0.5s_ease-out]">
          <div className="relative h-64 w-64 md:h-80 md:w-80">
            <Image
              src={`/characters/${player2CharacterId}.png`}
              alt={player2CharacterName}
              fill
              sizes="320px"
              className="object-contain drop-shadow-[0_0_40px_rgba(6,182,212,0.6)]"
              style={{ transform: "scaleX(-1)" }}
              priority
            />
          </div>
          <div className="text-xs uppercase tracking-[0.3em] text-cyan-400">
            Player 2 — {player2CharacterName}
          </div>
          <div className="text-2xl font-black text-zinc-300 md:text-3xl">
            {player2Name}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes vsSlideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes vsSlideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
