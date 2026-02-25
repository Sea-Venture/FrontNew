import { useState } from 'react';
import SelectLocationPage from './select-location';
import ModelOutput from './model-output';

export default function ModelDataPage() {
  const [selected, setSelected] = useState<{ id: number; name: string } | null>(null);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-green-950 via-green-800 to-green-900 flex items-center justify-center p-8 font-serif">

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-green-400 opacity-5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-lime-400 opacity-5 blur-3xl" />
      </div>

      <span className="absolute top-[8%] left-[5%] text-4xl opacity-30 pointer-events-none select-none animate-bounce" style={{ animationDuration: '4s', animationDelay: '0s' }}>🌿</span>
      <span className="absolute top-[15%] right-[7%] text-3xl opacity-25 pointer-events-none select-none animate-bounce" style={{ animationDuration: '5s', animationDelay: '1.2s' }}>🍃</span>
      <span className="absolute bottom-[12%] left-[8%] text-3xl opacity-25 pointer-events-none select-none animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '2.4s' }}>🍀</span>
      <span className="absolute bottom-[18%] right-[5%] text-2xl opacity-20 pointer-events-none select-none animate-bounce" style={{ animationDuration: '3.8s', animationDelay: '0.8s' }}>🌱</span>

      <div className="relative z-10 w-full max-w-xl animate-[fadeSlideUp_0.7s_ease_both]">

        <header className="text-center mb-2">
          <div className="text-green-400 text-lg opacity-75">✦</div>
          <h1 className="my-1 text-4xl font-bold tracking-widest text-lime-200 drop-shadow-lg">
            Weather Data
          </h1>
          <div className="text-green-400 text-lg opacity-75">✦</div>
          <p className="mt-1 text-xs uppercase tracking-[0.15em] italic text-green-300 opacity-80">
            Forest Intelligence Laboratory
          </p>
        </header>

        <div className="flex items-center gap-3 my-5">
          <span className="text-xl opacity-60">🌿</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-60" />
          <span className="text-xl opacity-60">🌿</span>
        </div>

        <section className="rounded-2xl overflow-visible">
          <SelectLocationPage onSelect={(loc) => setSelected(loc)} />
          <ModelOutput city={selected?.name ?? null} />
        </section>

        <footer className="text-center mt-6">
          <span className="text-xs uppercase tracking-[0.12em] text-green-600 opacity-60">
            ⬡ Enchanted Data Repository ⬡
          </span>
        </footer>
      </div>

      <style>{`@keyframes fadeSlideUp { from { opacity: 0; transform: translateY(24px); } to   { opacity: 1; transform: translateY(0);    } }`}</style>
    </div>
  );
}