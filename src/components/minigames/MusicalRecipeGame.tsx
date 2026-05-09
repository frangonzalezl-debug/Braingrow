import React, { useState } from "react";
import { motion } from "framer-motion";
import * as Tone from "tone";

const initialTubes = [
  { id: 1, level: 80 },
  { id: 2, level: 50 },
  { id: 3, level: 20 },
];

const synth = new Tone.PolySynth(Tone.Synth).toDestination();

function getNoteData(level: number) {
  if (level <= 10)
    return {
      note: "C4",
      label: "Do",
      color: "bg-red-400 shadow-red-400/60",
    };

  if (level <= 20)
    return {
      note: "D4",
      label: "Re",
      color: "bg-orange-400 shadow-orange-400/60",
    };

  if (level <= 30)
    return {
      note: "E4",
      label: "Mi",
      color: "bg-yellow-400 shadow-yellow-400/60",
    };

  if (level <= 40)
    return {
      note: "F4",
      label: "Fa",
      color: "bg-green-400 shadow-green-400/60",
    };

  if (level <= 50)
    return {
      note: "G4",
      label: "Sol",
      color: "bg-cyan-400 shadow-cyan-400/60",
    };

  if (level <= 60)
    return {
      note: "A4",
      label: "La",
      color: "bg-blue-400 shadow-blue-400/60",
    };

  if (level <= 70)
    return {
      note: "B4",
      label: "Si",
      color: "bg-fuchsia-400 shadow-fuchsia-400/60",
    };

  if (level <= 80)
    return {
      note: "C5",
      label: "Do+",
      color: "bg-pink-400 shadow-pink-400/60",
    };

  if (level <= 90)
    return {
      note: "D5",
      label: "Re+",
      color: "bg-purple-400 shadow-purple-400/60",
    };

  return {
    note: "E5",
    label: "Mi+",
    color: "bg-emerald-300 shadow-emerald-300/60",
  };
}

export default function MusicalRecipeGame({
  onBack,
}: {
  onBack: () => void;
}) {
    const [tubes, setTubes] = useState(initialTubes);

    const [audioStarted, setAudioStarted] = useState(false);

    const startAudio = async () => {
        if (!audioStarted) {
        await Tone.start();
        setAudioStarted(true);
        }
    };

  const transferWater = (fromId: number, toId: number) => {
    if (fromId === toId) return;

    setTubes((prev) => {
    const updated = prev.map((tube) => ({
        ...tube,
    }));

      const from = updated.find((t) => t.id === fromId);
      const to = updated.find((t) => t.id === toId);

      if (!from || !to) return prev;

      if (from.level <= 0 || to.level >= 100) return prev;

      const amount = Math.min(10, from.level, 100 - to.level);

        from.level -= amount;
        to.level += amount;

        const fromNote = getNoteData(from.level).note;
        const toNote = getNoteData(to.level).note;

        synth.triggerAttackRelease(fromNote, "16n");

        setTimeout(() => {
        synth.triggerAttackRelease(toNote, "8n");
        }, 120);

      return updated;
    });
  };

  return (
    <div
    className="
        min-h-screen
        text-white
        p-6
        flex
        flex-col
        bg-cover
        bg-center
        bg-no-repeat
        relative
        overflow-hidden
    "
    style={{
        backgroundImage: "url('/backgrounds/music-lab.jpg')",
    }}
    >

        <div className="absolute inset-0 bg-black/30 pointer-events-none" />
      
        <button
        onClick={onBack}
        className="
            relative
            z-50
            mb-6
            px-5
            py-3
            rounded-2xl
            bg-white/15
            backdrop-blur-md
            border
            border-white/20
            text-white
            text-sm
            font-black
            shadow-[0_0_20px_rgba(255,255,255,0.15)]
            hover:bg-white/25
            hover:scale-105
            transition-all
            duration-300
            w-fit
        "
        >
        ← Volver
        </button>
    
      <div
        className="
            self-center
            mb-6
            px-8
            py-4
            rounded-[2rem]
            bg-black/25
            backdrop-blur-xl
            border
            border-white/10
            shadow-[0_0_40px_rgba(0,0,0,0.25)]
            text-center
        "
        >
        <h1
            className="
            text-3xl
            font-black
            tracking-tight
            text-white
            drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]
            "
        >
            🎵 Receta Musical
        </h1>

        <p
            className="
            text-slate-200
            mt-1
            font-medium
            drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]
            "
        >
            Mezcla niveles de agua para crear música.
        </p>
        </div>

        <div className="flex-1 flex items-center justify-center">
            <div className="
                    flex
                    flex-col
                    md:flex-row
                    justify-center
                    items-center
                    gap-12
                    w-full
                  ">
                {tubes.map((tube) => (
                <div
                    key={tube.id}
                      className="
                        flex
                        flex-col
                        md:flex-row
                        items-center
                        gap-4
                      "
                >
                    <motion.div
                    whileTap={{ scale: 0.95 }}
                    className="
                      relative
                      w-24
                      md:w-36
                      h-[18rem]
                      md:h-[28rem]
                      flex
                      items-end
                      justify-center
                    "
                    >
                    {/* SOMBRA */}
                    <div className="absolute bottom-0 w-28 h-6 bg-black/40 blur-2xl rounded-full" />

                    {/* CUERPO BOTELLA */}
                    <div
                        className="
                        relative
                        w-16
                        md:w-28
                        h-[18rem]
                        md:h-[29rem]
                        rounded-b-[3.5rem]
                        rounded-t-[2rem]
                        overflow-hidden
                        border-[5px]
                        border-white/20
                        bg-white/10
                        backdrop-blur-xl
                        shadow-[0_0_40px_rgba(255,255,255,0.08)]
                        "
                    >
                        {/* CUELLO */}
                        <div
                        className="
                            absolute
                            -top-8
                            left-1/2
                            -translate-x-1/2
                            w-14
                            h-10
                            rounded-t-[1rem]
                            border-[5px]
                            border-b-0
                            border-white/20
                            bg-white/10
                            backdrop-blur-xl
                        "
                        />

                        {/* BRILLO IZQUIERDO */}
                        <div className="absolute left-3 top-6 bottom-6 w-2 bg-white/20 rounded-full z-30" />

                        {/* BRILLO SUPERIOR */}
                        <div className="absolute top-3 left-4 right-4 h-3 bg-white/10 blur-sm rounded-full z-30" />

                        {/* LIQUIDO */}
                        <motion.div
                        animate={{
                            height: tube.level <= 0 ? "0%" : `${tube.level}%`,
                        }}
                        transition={{
                            duration: 0.3,
                            ease: "easeOut",
                        }}
                        className={`
                        absolute
                        bottom-0
                        left-0
                        right-0
                        rounded-b-[3rem]
                        shadow-[0_0_30px_rgba(255,255,255,0.3)]
                        ${getNoteData(tube.level).color}
                        `}
                        >
                        {/* SUPERFICIE LIQUIDO */}
                        <div className="absolute top-0 left-0 right-0 h-4 bg-white/20 blur-sm rounded-full" />

                        {/* BURBUJAS */}
                        <div className="absolute left-3 bottom-10 w-2 h-2 bg-white/40 rounded-full animate-bounce" />
                        <div className="absolute right-4 bottom-20 w-3 h-3 bg-white/30 rounded-full animate-pulse" />
                        </motion.div>
                    </div>

                    {/* TEXTO */}
                    <div className="absolute inset-0 flex items-center justify-center z-40">
                        <span className="text-2xl md:text-4xl font-black text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]">
                        {getNoteData(tube.level).label}
                        </span>
                    </div>
                    </motion.div>

                    <div className="flex flex-col gap-3 w-28 md:w-40">
                    {tubes
                        .filter((t) => t.id !== tube.id)
                        .map((target) => (
                            <motion.button
                            key={target.id}
                            whileHover={{
                                scale: 1.08,
                                y: -2,
                            }}
                            whileTap={{
                                scale: 0.92,
                            }}
                            onClick={async () => {
                                await startAudio();

                                transferWater(tube.id, target.id);
                            }}
                            className={`
                                relative
                                overflow-hidden
                                w-full
                                py-4
                                rounded-3xl
                                text-base
                                font-black
                                text-white
                                backdrop-blur-md
                                border
                                border-white/20
                                shadow-lg
                                transition-all
                                duration-300
                                hover:shadow-2xl
                                hover:brightness-110
                                active:scale-95
                                ${getNoteData(target.level).color}
                            `}
                            >
                            {/* BRILLO */}
                            <div className="absolute inset-0 bg-white/10 opacity-40" />

                            {/* CONTENIDO */}
                            <div className="relative z-10 flex items-center justify-center gap-2 w-full">
                                <span className="text-lg">🎵</span>

                                <span>
                                {getNoteData(target.level).label}
                                </span>
                            </div>
                            </motion.button>
                        ))}
                    </div>
                </div>
                ))}
            </div>
        </div>
    </div>
  );
}