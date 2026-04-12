"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type RouletteCharacter = { id: string; name: string };

const LOADING_MS = 2200;
const REVEAL_HOLD_MS = 900;

export function CharacterRoulette({
  characters,
  selectedId,
  onComplete,
}: {
  characters: RouletteCharacter[];
  selectedId: string;
  onComplete: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setRevealed(false);
    const revealTimeout = setTimeout(() => setRevealed(true), LOADING_MS);
    const completeTimeout = setTimeout(
      () => onCompleteRef.current(),
      LOADING_MS + REVEAL_HOLD_MS,
    );
    return () => {
      clearTimeout(revealTimeout);
      clearTimeout(completeTimeout);
    };
  }, [selectedId]);

  const selected = characters.find((c) => c.id === selectedId);
  if (!selected) return null;

  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center gap-8 bg-black">
      {!revealed ? (
        <div className="flex flex-col items-center gap-6">
          <div className="relative h-32 w-32">
            <div className="absolute inset-0 rounded-full border-4 border-zinc-800 border-t-amber-400 animate-spin" />
            <div
              className="absolute inset-2 rounded-full border-2 border-zinc-900 border-b-cyan-500 animate-spin"
              style={{ animationDirection: "reverse", animationDuration: "1.2s" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-amber-400/10 blur-xl" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center text-3xl">
              ⚔️
            </div>
          </div>
          <div className="text-sm uppercase tracking-[0.4em] text-zinc-400 animate-pulse">
            Rolling your fighter
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 reveal-pop">
          <div className="text-xs uppercase tracking-[0.4em] text-amber-400/80">
            Your Fighter
          </div>
          <div
            className="relative h-56 w-56 overflow-hidden rounded-2xl border-2 border-amber-400 bg-gradient-to-b from-amber-400/15 to-cyan-500/10"
            style={{ filter: "drop-shadow(0 0 40px rgba(245,158,11,0.5))" }}
          >
            <Image
              src={`/characters/${selected.id}.png`}
              alt={selected.name}
              fill
              sizes="224px"
              className="object-contain"
              priority
            />
          </div>
          <div className="text-3xl font-black uppercase tracking-wider text-amber-300">
            {selected.name}
          </div>
        </div>
      )}
      <style jsx>{`
        .reveal-pop {
          animation: revealPop 0.7s cubic-bezier(0.2, 1.4, 0.4, 1) both;
        }
        @keyframes revealPop {
          0% {
            transform: scale(0.2) rotate(-8deg);
            opacity: 0;
            filter: blur(8px);
          }
          55% {
            transform: scale(1.18) rotate(2deg);
            opacity: 1;
            filter: blur(0);
          }
          100% {
            transform: scale(1) rotate(0);
            opacity: 1;
            filter: blur(0);
          }
        }
      `}</style>
    </div>
  );
}
