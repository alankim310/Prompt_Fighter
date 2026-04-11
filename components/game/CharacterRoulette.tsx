"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type RouletteCharacter = { id: string; name: string };

export function CharacterRoulette({
  characters,
  selectedId,
  onComplete,
}: {
  characters: RouletteCharacter[];
  selectedId: string;
  onComplete: () => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [landed, setLanded] = useState(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (characters.length === 0) return;

    const targetIndex = characters.findIndex((c) => c.id === selectedId);
    if (targetIndex === -1) return;

    const totalDuration = 3000;
    const startDelay = 60;
    const endDelay = 360;
    const fullCycles = 3;
    const totalSteps =
      fullCycles * characters.length +
      ((targetIndex - 0 + characters.length) % characters.length) +
      characters.length;

    let step = 0;
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = () => {
      if (cancelled) return;
      step += 1;
      setActiveIndex((prev) => (prev + 1) % characters.length);

      if (step >= totalSteps) {
        setActiveIndex(targetIndex);
        setLanded(true);
        timeoutId = setTimeout(() => {
          if (!cancelled) onCompleteRef.current();
        }, 600);
        return;
      }

      const progress = step / totalSteps;
      const eased = easeOut(progress);
      const delay = startDelay + (endDelay - startDelay) * eased;
      const remainingBudget = totalDuration - (startDelay * step);
      const nextDelay = remainingBudget > 0 ? delay : endDelay;
      timeoutId = setTimeout(tick, nextDelay);
    };

    timeoutId = setTimeout(tick, startDelay);

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [characters, selectedId]);

  if (characters.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden py-8">
      <div className="pointer-events-none absolute inset-y-0 left-1/2 w-32 -translate-x-1/2 rounded-xl border-2 border-yellow-400/80 shadow-[0_0_40px_rgba(250,204,21,0.6)]" />
      <div className="flex items-center justify-center gap-4">
        {characters.map((character, index) => {
          const offset = index - activeIndex;
          const isActive = index === activeIndex;
          return (
            <div
              key={character.id}
              className="flex shrink-0 flex-col items-center transition-all duration-150 ease-out"
              style={{
                transform: `translateX(${offset * 140}px) scale(${
                  isActive ? (landed ? 1.35 : 1.1) : 0.75
                })`,
                opacity: Math.max(0.2, 1 - Math.abs(offset) * 0.35),
                filter: isActive && landed ? "drop-shadow(0 0 24px #facc15)" : "none",
                zIndex: isActive ? 10 : 0,
              }}
            >
              <div
                className={`relative h-28 w-28 overflow-hidden rounded-xl border-2 ${
                  isActive
                    ? landed
                      ? "border-yellow-400 bg-yellow-400/10"
                      : "border-white bg-white/10"
                    : "border-white/20 bg-white/5"
                }`}
              >
                <Image
                  src={`/characters/${character.id}.png`}
                  alt={character.name}
                  fill
                  sizes="112px"
                  className="object-contain"
                  priority={isActive}
                />
              </div>
              <p
                className={`mt-2 text-center text-xs font-semibold uppercase tracking-wider ${
                  isActive && landed ? "text-yellow-300" : "text-white/80"
                }`}
              >
                {character.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
