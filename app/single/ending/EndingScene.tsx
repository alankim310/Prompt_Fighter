import Link from "next/link";

export function EndingScene({ imageUrl }: { imageUrl: string }) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050406] text-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt="Veyrune at dawn after the End-Bringer's defeat"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,3,7,0.24)_0%,rgba(4,3,7,0.48)_34%,rgba(4,3,7,0.9)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,208,102,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(120,61,255,0.12),transparent_24%)]" />

      <div className="relative z-10 flex min-h-screen flex-col px-4 py-4 sm:px-6 sm:py-6">
        <div className="flex flex-1 items-end justify-center py-6 sm:py-10">
          <div className="w-full max-w-4xl">
            <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/12 bg-black/55 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.5)] sm:p-8">
              <div className="text-center text-[11px] uppercase tracking-[0.35em] text-amber-200/75">
                Story Complete
              </div>
              <h1 className="mt-4 text-center text-4xl font-black leading-tight text-white sm:text-5xl">
                Dawn Returns to Veyrune
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-center text-base leading-8 text-zinc-100 sm:text-lg">
                The End-Bringer is gone. Princess Carolyn is free, and the first
                light over Blackwake Keep reaches a kingdom that can finally
                remember itself again. The journey that began as a rescue ends
                with Veyrune ready to rebuild.
              </p>

              <div className="mt-8 flex justify-center">
                <Link
                  href="/single"
                  className="rounded-full border border-amber-300/50 bg-amber-300 px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-black shadow-[0_10px_30px_rgba(251,191,36,0.35)] transition hover:bg-amber-200"
                >
                  Return to Map
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
