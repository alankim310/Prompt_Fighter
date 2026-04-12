"use client";

import Image from "next/image";
import { useState } from "react";

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
  onSubmit: (prompt: string) => void;
}

export function MultiRound({
  roundNumber,
  totalRounds = 3,
  myCharacter,
  opponentCharacter,
  myWins,
  oppWins,
  submitted,
  onSubmit,
}: MultiRoundProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = () => {
    const trimmed = prompt.trim();
    if (!trimmed || submitted) return;
    onSubmit(trimmed);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
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

      <div className="pointer-events-none absolute bottom-16 left-4 flex flex-col items-center md:left-12">
        <div className="relative h-64 w-64 md:h-96 md:w-96">
          <Image
            src={`/characters/${myCharacter.id}.png`}
            alt={myCharacter.displayName}
            fill
            sizes="384px"
            className="object-contain drop-shadow-[0_0_40px_rgba(217,70,239,0.6)]"
            priority
          />
        </div>
        <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-fuchsia-300">
          You — {myCharacter.displayName}
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
              className="object-contain drop-shadow-[0_0_40px_rgba(34,211,238,0.6)]"
              style={{ transform: "scaleX(-1)" }}
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="h-20 w-20 animate-spin rounded-full border-2 border-zinc-800 border-t-cyan-500" />
            </div>
          )}
        </div>
        <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-cyan-300">
          {opponentCharacter
            ? `Opponent — ${opponentCharacter.displayName}`
            : "Opponent — ???"}
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col gap-6 p-6">
        <header className="flex items-center justify-between rounded-lg border border-white/10 bg-black/60 px-5 py-3 backdrop-blur">
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-fuchsia-400">
              Round {roundNumber} / {totalRounds}
            </div>
            <div className="text-xl font-black">{myCharacter.displayName}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-400">
              Score
            </div>
            <div className="font-mono text-lg font-bold">
              <span className="text-fuchsia-400">{myWins}</span>
              <span className="mx-2 text-zinc-600">—</span>
              <span className="text-cyan-400">{oppWins}</span>
            </div>
          </div>
        </header>

        {myCharacter.traits && myCharacter.traits.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {myCharacter.traits.map((trait) => (
              <span
                key={trait}
                className="rounded-full border border-fuchsia-400/40 bg-fuchsia-500/10 px-3 py-1 text-xs uppercase tracking-wider text-fuchsia-200"
              >
                {trait}
              </span>
            ))}
          </div>
        )}

        <div className="flex-1" />

        <div className="rounded-xl border border-white/10 bg-black/70 p-4 backdrop-blur">
          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-fuchsia-500" />
              <div className="text-sm uppercase tracking-widest text-zinc-400">
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
                className="h-32 w-full resize-none rounded-lg border border-white/10 bg-zinc-950/80 p-3 font-mono text-sm text-white placeholder:text-zinc-600 focus:border-fuchsia-500 focus:outline-none"
                maxLength={500}
              />
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-zinc-500">
                  {prompt.length} / 500
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={!prompt.trim()}
                  className="rounded-lg bg-fuchsia-600 px-6 py-2 font-bold uppercase tracking-wider text-white transition hover:bg-fuchsia-500 disabled:cursor-not-allowed disabled:opacity-40"
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
