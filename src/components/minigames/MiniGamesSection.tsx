import React from "react";
import { motion } from "framer-motion";

type Props = {
  onOpenMusicalRecipe: () => void;
};

export default function MiniGamesSection({
  onOpenMusicalRecipe,
}: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-black text-slate-800 tracking-tight">
        Minijuegos
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">

        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={onOpenMusicalRecipe}
          className="min-w-[220px] bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3 cursor-pointer"
        >
          <div className="w-full aspect-video rounded-2xl bg-cyan-100 flex items-center justify-center text-5xl">
            🧪🎵
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-500">
              Música + Matemáticas
            </span>

            <h3 className="font-bold text-slate-800 leading-tight">
              Receta Musical
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Cambia el nivel del agua para crear notas musicales.
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}