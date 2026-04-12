"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface MultiRoundCharacter {
  id: string;
  displayName: string;
  traits?: string[];
}

interface MultiRoundProps {
  roundNumber: number;
  totalRounds?: number;
  myCharacter: MultiRoundCharacter;
  opponentCharacter: MultiRoundCharacter | null;
  myWins: number;
  oppWins: number;
  submitted: boolean;
  timerMs: number;
  onSubmit: (prompt: string) => void;
  onTimeout: () => void;
}

export function MultiRound({
  roundNumber,
  totalRounds = 3,
  myCharacter,
  opponentCharacter,
  myWins,
  oppWins,
  submitted,
  timerMs,
  onSubmit,
  onTimeout,
}: MultiRoundProps) {
  const [prompt, setPrompt] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(Math.floor(timerMs / 1000));
  const firedTimeoutRef = useRef(false);
  const onTimeoutRef = useRef(onTimeout);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  useEffect(() => {
    setPrompt("");
    setSecondsLeft(Math.floor(timerMs / 1000));
    firedTimeoutRef.current = false;
  }, [roundNumber, timerMs]);

  useEffect(() => {
    const start = Date.now();
    const interval = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, Math.ceil((timerMs - elapsed) / 1000));
      setSecondsLeft(remaining);
      if (remaining <= 0 && !firedTimeoutRef.current) {
        firedTimeoutRef.current = true;
        window.clearInterval(interval);
        if (!submitted) {
          onTimeoutRef.current();
        }
      }
    }, 200);
    return () => window.clearInterval(interval);
  }, [submitted, timerMs, roundNumber]);

  const handleSubmit = () => {
    const trimmed = prompt.trim();
    if (!trimmed || submitted) return;
    onSubmit(trimmed);
  };

  const timerDanger = secondsLeft <= 10;
  const timerPct = Math.max(0, Math.min(100, (secondsLeft / (timerMs / 1000)) * 100));

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0a] text-white">
      <div className="absolute inset-0">
        <Image
          src="/backgrounds/arena.png"
          alt="Arena"
          fill
          sizes="100vw"
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
      </div>

      {/* Characters */}
      <div className="pointer-events-none absolute bottom-16 left-4 flex flex-col items-center md:left-12">
        <div className="relative h-64 w-64 md:h-96 md:w-96">
          <Image
            src={`/characters/${myCharacter.id}.png`}
            alt={myCharacter.displayName}
            fill
            sizes="384px"
            className="object-contain drop-shadow-[0_0_40px_rgba(245,158,11,0.6)]"
            priority
          />
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-16 right-4 flex flex-col items-center md:right-12">
        <div className="relative h-64 w-64 md:h-96 md:w-96">
          {opponentCharacter ? (
            <Image
              src={`/characters/${opponentCharacter.id}.png`}
              alt={opponentCharacter.displayName}
              fill
              sizes="384px"
              className="object-contain drop-shadow-[0_0_40px_rgba(6,182,212,0.6)]"
              style={{ transform: "scaleX(-1)" }}
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="h-20 w-20 animate-spin rounded-full border-2 border-zinc-800 border-t-cyan-500" />
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col gap-6 p-6">
        {/* Round indicator */}
        <div className="text-center">
          <div className="inline-block rounded-full border border-amber-500/40 bg-amber-500/10 px-5 py-1.5 text-sm font-bold uppercase tracking-[0.3em] text-amber-300">
            Round {roundNumber} / {totalRounds}
          </div>
        </div>

        {/* Header: Score — Timer — Score */}
        <header className="rounded-2xl border-b border-zinc-800 bg-zinc-950/90 px-5 py-3 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            {/* Left: my score + name */}
            <div className="flex items-center gap-3">
              <div className="font-mono text-4xl font-black text-amber-400">
                {myWins}
              </div>
              <div className="text-xs uppercase tracking-widest text-amber-300">
                {myCharacter.displayName}
              </div>
            </div>

            {/* Center: timer */}
            <div className="flex flex-col items-center">
              <div
                className={`font-mono text-3xl font-black tabular-nums ${
                  timerDanger
                    ? "animate-pulse text-red-500 drop-shadow-[0_0_16px_rgba(239,68,68,0.7)]"
                    : "text-amber-400"
                }`}
              >
                {secondsLeft}s
              </div>
            </div>

            {/* Right: opponent score + name */}
            <div className="flex items-center gap-3">
              <div className="text-right text-xs uppercase tracking-widest text-cyan-300">
                {opponentCharacter?.displayName ?? "???"}
              </div>
              <div className="font-mono text-4xl font-black text-cyan-400">
                {oppWins}
              </div>
            </div>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-zinc-900">
            <div
              className={`h-full transition-[width] duration-200 ease-linear ${
                timerDanger
                  ? "bg-red-500 shadow-[0_0_16px_rgba(239,68,68,0.7)]"
                  : "bg-gradient-to-r from-amber-500 to-orange-600"
              }`}
              style={{ width: `${timerPct}%` }}
            />
          </div>
        </header>

        <div className="flex-1" />

        {/* Prompt input */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-4 backdrop-blur-sm">
          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <div className="relative h-8 w-8">
                <div className="absolute inset-0 animate-spin rounded-full border-2 border-zinc-800 border-t-amber-500" />
                <div
                  className="absolute inset-0.5 animate-spin rounded-full border border-zinc-900 border-b-cyan-500"
                  style={{ animationDirection: "reverse", animationDuration: "1.2s" }}
                />
              </div>
              <div className="text-sm uppercase tracking-widest text-zinc-400 animate-pulse">
                Waiting for opponent...
              </div>
            </div>
          ) : (
            <>
              <label className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-zinc-400">
                Your prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`Write your attack as ${myCharacter.displayName}...`}
                className="h-32 w-full resize-none rounded-xl border border-zinc-700 bg-zinc-900/90 p-3 font-mono text-sm text-white placeholder:text-zinc-600 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 focus:outline-none transition-all duration-200"
                maxLength={500}
              />
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-zinc-500">
                  {prompt.length} / 500
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={!prompt.trim()}
                  className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-2 font-bold uppercase tracking-wider text-white hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                >
                  Attack
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
