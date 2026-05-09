/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppIcon } from "./components/AppIcon";
import type { IconName } from "./icons";
import { 
  UserProfile, 
  CognitiveProfile, 
  ContentItem, 
  AgeGroup, 
  SessionStyle, 
  ParentGoal, 
  WorldId, 
  DetoxLevel 
} from "./types";
import { contentLibrary, mockAchievements } from "./contentLibrary";
import { getSelectableWorldOptions } from "./data/worldTaxonomy";
import { 
  WorldDetailView, 
  CourseDetailView, 
  ModuleDetailView, 
  LessonDetailView, 
  ActivityPlayerView 
} from "./components/LearningNavigation";
import { recommendCourses } from "./logic/courseEngine";
import { 
  preloadSounds, 
  playTap, 
  playSelect, 
  playOpen, 
  getSoundEnabled, 
  toggleSound 
} from "./lib/soundEngine";
import MiniGamesSection from "./components/minigames/MiniGamesSection";
import MusicLabGame from "./components/minigames/MusicalRecipeGame";
import bgMusic, { toggleMusic, isMusicEnabled } from "./lib/musicManager";

/**
 * --- VISUAL THEME ENGINE ---
 */
const cognitiveThemeConfig = {
  attention: {
    pathName: "Cerebro Explorador",
    shortLabel: "Atención",
    subtitle: "Entrena tu atención y aprende a detectar detalles.",
    missionTitle: "Misión Actual ✨",
    missionText: "Completa el desafío visual de hoy",
    mainColor: "#42D600",
    mainColorTailwind: "text-[#42D600]",
    mainBgTailwind: "bg-[#42D600]",
    softColor: "#ECFBE8",
    softBgTailwind: "bg-[#ECFBE8]",
    secondaryColor: "#2F80ED",
    icon: "👀",
    visualMotifs: ["lupa", "radar", "ojo", "destellos"],
    toneWords: ["observa", "detecta", "encuentra", "recuerda"]
  },
  patience: {
    pathName: "Templo de la Calma",
    shortLabel: "Calma",
    subtitle: "Aprende a esperar, respirar y avanzar sin prisa.",
    missionTitle: "Misión de Calma 🌿",
    missionText: "Completa una pausa guiada de hoy",
    mainColor: "#54C7A0",
    mainColorTailwind: "text-[#54C7A0]",
    mainBgTailwind: "bg-[#54C7A0]",
    softColor: "#EAFBF5",
    softBgTailwind: "bg-[#EAFBF5]",
    secondaryColor: "#7CB7A5",
    icon: "🌿",
    visualMotifs: ["respiración", "círculos suaves", "naturaleza", "ondas"],
    toneWords: ["respira", "espera", "observa", "avanza"]
  },
  reasoning: {
    pathName: "Laboratorio de Ideas",
    shortLabel: "Lógica",
    subtitle: "Piensa, predice y resuelve retos inteligentes.",
    missionTitle: "Reto Mental 🧩",
    missionText: "Completa un desafío de lógica de hoy",
    mainColor: "#7C5CFF",
    mainColorTailwind: "text-[#7C5CFF]",
    mainBgTailwind: "bg-[#7C5CFF]",
    softColor: "#F1EDFF",
    softBgTailwind: "bg-[#F1EDFF]",
    secondaryColor: "#FFB020",
    icon: "🧩",
    visualMotifs: ["puzzle", "laboratorio", "mapas", "conexiones"],
    toneWords: ["piensa", "predice", "resuelve", "conecta"]
  }
};

function getCognitiveTheme(profile: UserProfile) {
  const goal = profile.cognitiveProfile?.primaryGoal || "attention";
  return cognitiveThemeConfig[goal as keyof typeof cognitiveThemeConfig] || cognitiveThemeConfig.attention;
}

function getDynamicCopy(profile: UserProfile) {
  const goal = profile.cognitiveProfile?.primaryGoal || "attention";
  const copies = {
    attention: {
      exploreSubtitle: "Elige una misión para entrenar tu enfoque.",
      focusPrompt: "Observa con cuidado",
      actionButtonText: "Detectar",
      achievementsSubtitle: "Hoy entrenaste tu enfoque y atención visual."
    },
    patience: {
      exploreSubtitle: "Elige un mundo para avanzar sin prisa.",
      focusPrompt: "Respira antes de seguir",
      actionButtonText: "Calma",
      achievementsSubtitle: "Hoy practicaste calma y control del impulso."
    },
    reasoning: {
      exploreSubtitle: "Elige un reto para pensar como explorador.",
      focusPrompt: "Piensa antes de responder",
      actionButtonText: "Resolver",
      achievementsSubtitle: "Hoy resolviste retos y pensaste más profundo."
    }
  };
  return copies[goal as keyof typeof copies] || copies.attention;
}

/**
 * --- COGNITIVE ENGINE ---
 * This motor builds the user's cognitive profile and handles content recommendations
 * based on parent goals, child interests, age, and detox level.
 */

function buildCognitiveProfile(profile: Omit<UserProfile, 'cognitiveProfile'>): CognitiveProfile {
  const primaryGoal = profile.parentGoals[0] as ParentGoal;
  const secondaryGoals = profile.parentGoals.slice(1) as ParentGoal[];
  
  let ageGroup: AgeGroup = "8-10";
  if (profile.age <= 7) ageGroup = "6-7";
  else if (profile.age >= 11) ageGroup = "11-12";

  let sessionStyle: SessionStyle = "balanced_training";
  if (profile.detoxLevel === "soft") sessionStyle = "dynamic_transition";
  else if (profile.detoxLevel === "intense") sessionStyle = "deep_focus";

  return { primaryGoal, secondaryGoals, ageGroup, sessionStyle };
}

function recommendContent(profile: UserProfile, section: ContentItem["section"]): ContentItem[] {
  if (!profile.cognitiveProfile) return [];
  
  const { primaryGoal, secondaryGoals, ageGroup } = profile.cognitiveProfile;
  
  return contentLibrary
    .filter(item => item.section === section)
    .filter(item => item.ageRange[0] <= profile.age && item.ageRange[1] >= profile.age)
    .filter(item => item.detoxCompatibility.includes(profile.detoxLevel))
    .map(item => {
      let score = 0;
      
      // +3 if matches a favorite world
      if (item.world !== "general" && profile.favoriteWorlds.includes(item.world as WorldId)) score += 3;
      
      // +3 if matches primary goal
      if (item.goals.includes(primaryGoal)) score += 3;
      
      // +2 if matches any secondary goal
      const hasSecondary = secondaryGoals.some(g => item.goals.includes(g));
      if (hasSecondary) score += 2;
      
      // +2 if matches detox level (already filtered, but can weigh if we had more info)
      score += 2; 

      // +1 if difficulty is appropriate for age group
      // Simple logic: lower difficulty for younger kids
      if (ageGroup === "6-7" && item.difficulty <= 3) score += 1;
      if (ageGroup === "8-10" && item.difficulty >= 2 && item.difficulty <= 4) score += 1;
      if (ageGroup === "11-12" && item.difficulty >= 4) score += 1;

      return { item, score };
    })
    .sort((a, b) => b.score - a.score)
    .map(entry => entry.item);
}

const WORLD_DATA: Record<WorldId, { label: string; icon: string; color: string }> = {
  nature: { label: "Naturaleza", icon: "🌱", color: "bg-green-100" },
  space: { label: "Espacio", icon: "🚀", color: "bg-blue-100" },
  art: { label: "Arte", icon: "🎨", color: "bg-purple-100" },
  science: { label: "Ciencia", icon: "🧪", color: "bg-cyan-100" },
  history: { label: "Historia", icon: "📜", color: "bg-orange-100" },
  logic: { label: "Lógica", icon: "🧩", color: "bg-emerald-100" },
  cinema: { label: "Cine", icon: "🎬", color: "bg-indigo-100" },
  lab: { label: "Lab", icon: "🔬", color: "bg-amber-100" },
};

type View =
  | "onboarding"
  | "hub"
  | "feed"
  | "academy"
  | "profile"
  | "musicLab";

// --- Components ---

// Onboarding View
const OnboardingView = ({ onComplete }: { onComplete: (profile: UserProfile) => void }) => {
  const [stage, setStage] = useState<"parent" | "child">("parent");
  const [step, setStep] = useState(1);
  
  // Parent Data
  const [goals, setGoals] = useState<ParentGoal[]>([]);
  const [detoxLevel, setDetoxLevel] = useState<DetoxLevel>('medium');

  // Child Data
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [favoriteWorlds, setFavoriteWorlds] = useState<WorldId[]>([]);
  const [avatar, setAvatar] = useState("🦊");

  const avatars = ["🦊", "🐻", "🦖", "🦄", "🎨", "🚀", "🤖", "🐱"];

  const handleBack = () => {
    playTap();
    if (stage === "child") {
      if (step > 1) {
        setStep(step - 1);
      } else {
        setStage("parent");
        setStep(1);
      }
    }
  };

  const handleParentComplete = () => {
    playTap();
    setStage("child");
    setStep(1);
  };

  const handleChildComplete = () => {
    playOpen();
    const rawProfile: Omit<UserProfile, 'cognitiveProfile'> = {
      name, 
      age: Number(age), 
      favoriteWorlds,
      avatar,
      parentGoals: goals,
      detoxLevel
    };

    onComplete({
      ...rawProfile,
      cognitiveProfile: buildCognitiveProfile(rawProfile)
    });
  };

  const toggleGoal = (goal: string) => {
    playSelect();
    setGoals(prev => prev.includes(goal as ParentGoal) ? prev.filter(g => g !== goal) : [...prev, goal as ParentGoal]);
  };

  const toggleWorld = (worldId: WorldId) => {
    playSelect();
    setFavoriteWorlds(prev => prev.includes(worldId) ? prev.filter(w => w !== worldId) : [...prev, worldId]);
  };

  return (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col p-8 overflow-y-auto no-scrollbar">
      {/* Back Button */}
      {(stage === "child" || (stage === "parent" && step > 1)) && (
        <button 
          onClick={handleBack}
          className="fixed top-8 left-8 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors z-[110]"
        >
          <AppIcon name="chevronLeft" size={24} className="w-6 h-6" />
        </button>
      )}

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full gap-8 py-10">
        <AnimatePresence mode="wait">
          {stage === "parent" && (
            <motion.div
              key="parent-setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              <div className="bg-slate-900 p-6 rounded-3xl text-white space-y-4">
                <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest">
                  <AppIcon name="flame" size={16} className="w-4 h-4" /> Zona de Padres
                </div>
                <div className="space-y-1">
                  <h1 className="text-2xl font-black tracking-tight">Configura el entorno de aprendizaje</h1>
                  <p className="text-slate-400 text-xs font-medium leading-relaxed italic">
                    Tus elecciones personalizarán el algoritmo de Brain Grow. Priorizaremos contenidos que entrenen las áreas seleccionadas y ajustaremos los estímulos visuales para mejorar la concentración de tu hijo.
                  </p>
                </div>
              </div>

              {/* Goal Selection */}
              <div className="space-y-4">
                <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">¿Qué quieres mejorar?</p>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: "attention", label: "Capacidad de Atención", desc: "Combatir la distracción constante" },
                    { id: "patience", label: "Paciencia y Calma", desc: "Reducir la gratificación instantánea" },
                    { id: "reasoning", label: "Razonamiento Profundo", desc: "Fomentar el pensamiento crítico" }
                  ].map(goal => (
                    <button
                      key={goal.id}
                      onClick={() => toggleGoal(goal.id)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${
                        goals.includes(goal.id as ParentGoal) ? "bg-primary/10 border-primary" : "bg-white border-slate-100"
                      }`}
                    >
                      <div className="font-bold text-slate-800">{goal.label}</div>
                      <div className="text-xs text-slate-400 font-medium">{goal.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Detox Level */}
              <div className="space-y-4">
                <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">Nivel de Detox Digital</p>
                <div className="flex bg-slate-50 p-1 rounded-2xl gap-1">
                  {(['soft', 'medium', 'intense'] as const).map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => setDetoxLevel(lvl)}
                      className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                        detoxLevel === lvl ? "bg-white shadow-md text-primary" : "text-slate-400"
                      }`}
                    >
                      {lvl === 'soft' ? 'Suave' : lvl === 'medium' ? 'Medio' : 'Intenso'}
                    </button>
                  ))}
                </div>
                <p className="min-h-8 text-[10px] text-slate-400 text-center font-medium italic px-4">
                  {detoxLevel === 'soft' ? "Ideal para mantener hábitos saludables con contenido variado." : 
                   detoxLevel === 'medium' ? "Equilibrio perfecto: filtra distracciones y fomenta el enfoque prolongado." : 
                   "Máxima restricción de dopamina barata. Recomendado para niños con alta dependencia a videos cortos."}
                </p>
              </div>

              <button
                onClick={handleParentComplete}
                disabled={goals.length === 0}
                className="w-full bg-slate-800 text-white py-5 rounded-2xl font-black text-xl uppercase tracking-wider shadow-xl disabled:opacity-50"
              >
                Listo, pasar al niño
              </button>
            </motion.div>
          )}

          {stage === "child" && (
            <div className="space-y-8">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight text-center">¡Hola!</h1>
                    <p className="text-slate-500 font-medium text-lg italic text-center">Escoge tu avatar:</p>
                    <div className="flex flex-wrap justify-center gap-3 py-4">
                      {avatars.map((av) => (
                        <button
                          key={av}
                          onClick={() => { playSelect(); setAvatar(av); }}
                          className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all border-4 ${
                            avatar === av ? "bg-white border-primary shadow-xl scale-110" : "bg-slate-50 border-transparent opacity-60"
                          }`}
                        >
                          {av}
                        </button>
                      ))}
                    </div>
                    <p className="text-slate-500 font-medium text-lg italic text-center pt-4">¿Cómo te llamas tú?</p>
                  </div>
                  <input
                    type="text"
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre aquí..."
                    className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-primary focus:outline-none text-xl font-bold transition-all text-center"
                  />
                  <button
                    onClick={() => setStep(2)}
                    disabled={!name}
                    className="w-full bg-primary hover:bg-primary-dark text-white py-5 rounded-2xl font-black text-xl btn-duo uppercase tracking-wider disabled:opacity-50 transition-all shadow-xl"
                  >
                    ¡Siguiente!
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">¡Genial, {name}!</h1>
                    <p className="text-slate-500 font-medium text-lg italic mt-2">¿Cuántas velas has soplado en tu último pastel?</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[6, 7, 8, 9, 10, 11, 12].map((num) => (
                      <button
                        key={num}
                        onClick={() => { playSelect(); setAge(num); }}
                        className={`p-4 rounded-2xl border-2 font-black text-xl transition-all ${
                          age === num ? "bg-primary border-primary-dark text-white" : "bg-white border-slate-100 text-slate-400 shadow-sm"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!age}
                    className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xl btn-duo uppercase tracking-wider disabled:opacity-50 transition-all shadow-xl"
                  >
                    ¡Adelante!
                  </button>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tighter">¿Qué te hace sonreír?</h1>
                    <p className="text-slate-500 font-medium text-lg italic tracking-tight">Escoge al menos 2 mundos favoritos para empezar tu aventura.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pb-4">
                    {getSelectableWorldOptions().map((world) => (
                      <button
                        key={world.key}
                        onClick={() => toggleWorld(world.key as WorldId)}
                        className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                          favoriteWorlds.includes(world.key as WorldId) ? "bg-primary border-primary-dark text-white shadow-lg" : "bg-white border-slate-100 text-slate-400"
                        }`}
                      >
                        <span className="text-3xl drop-shadow-sm">{world.icon}</span>
                        <span className="font-bold text-xs uppercase tracking-wide">{world.label}</span>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleChildComplete}
                    disabled={favoriteWorlds.length < 2}
                    className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xl btn-duo uppercase tracking-wider disabled:opacity-50 transition-all shadow-xl"
                  >
                    ¡Comenzar Brain Grow!
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Top Bar with Streak
const TopBar = ({ streak, profile }: { streak: number, profile?: UserProfile }) => {
  const [isMuted, setIsMuted] = useState(
    !(getSoundEnabled() && isMusicEnabled())
  );

  const handleToggleMute = () => {
    const soundState = toggleSound();
    const musicState = toggleMusic();

    const enabled = soundState && musicState;

    setIsMuted(!enabled);

    if (musicState) {
      bgMusic.play().catch(() => {});
    } else {
      bgMusic.pause();
    }

    playTap();
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 z-50">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center overflow-hidden">
          <img src="/input_file_0.png" alt="Brain Grow Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
        </div>
        <span className="font-bold text-slate-700 text-lg">Brain Grow</span>
      </div>
      
      <div className="flex items-center gap-3">
        <button 
          onClick={handleToggleMute}
          className="p-2 rounded-full hover:bg-slate-50 text-slate-400 transition-colors"
        >
          <AppIcon name={isMuted ? "volumeOff" : "volume"} size={20} />
        </button>
        <div className="bg-amber-50 rounded-full px-3 py-1 flex items-center gap-1 racha-glow border border-amber-100">
          <AppIcon name="flame" size={20} className="w-5 h-5 text-amber-500" fill="#f59e0b" />
          <span className="font-bold text-amber-700 text-sm">{streak}</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-secondary/30 border border-secondary/50 flex items-center justify-center text-xl overflow-hidden grayscale-[0.2]">
          {profile?.avatar || '👤'}
        </div>
      </div>
    </div>
  );
};

// Bottom Navigation
const BottomNav = ({ active, setView }: { active: View; setView: (v: View) => void }) => {
  const tabs: { id: string; icon: IconName; label: string }[] = [
    { id: "hub", icon: "layoutGrid", label: "Explora" },
    { id: "feed", icon: "play",      label: "Focus" },
    { id: "academy", icon: "bookOpen", label: "Aprende" },
    { id: "profile", icon: "trophy", label: "Logros" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-100 flex items-center justify-around px-2 pb-2 z-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => { playTap(); setView(tab.id as View); }}
          className={`flex flex-col items-center gap-1 relative px-4 py-2 transition-colors ${
            active === tab.id ? "text-primary" : "text-slate-400"
          }`}
        >
          {active === tab.id && (
            <motion.div
              layoutId="nav-bg"
              className="absolute inset-0 bg-primary/10 rounded-2xl"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <AppIcon name={tab.icon} size={24} className="w-6 h-6 z-10" />
          <span className="text-[10px] font-bold uppercase tracking-wider z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

// --- Views ---

// 1. Hub (Roblox Style)
const HubView = ({
  profile,
  onSelectWorld,
  onSelectCourse,
  onOpenGame
}: {
  profile: UserProfile;
  onSelectWorld: (worldKey: WorldId) => void;
  onSelectCourse: (courseId: string) => void;
  onOpenGame: () => void;
}) => {
  const theme = getCognitiveTheme(profile);
  const copy = getDynamicCopy(profile);
  
  const recommendedIslands = Object.keys(WORLD_DATA)
    .map(key => ({ id: key as WorldId, ...WORLD_DATA[key as WorldId] }))
    .sort((a, b) => {
      const aFav = profile.favoriteWorlds.includes(a.id) ? 1 : 0;
      const bFav = profile.favoriteWorlds.includes(b.id) ? 1 : 0;
      return bFav - aFav;
    });

  const exploreContent = recommendContent(profile, "explore");
  const topRecommended = exploreContent[0];
  const recommendedCourses = recommendCourses(profile, 4);

  return (
    <div className="pt-24 pb-24 px-6 overflow-y-auto h-full space-y-8 no-scrollbar bg-slate-50/50">
      <header className="space-y-1">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">¡Hola, {profile.name}!</h1>
        <p className="text-slate-500 font-medium italic">{copy.exploreSubtitle}</p>
      </header>

      {/* Recommended Mission Top Card */}
      {topRecommended && (
        <motion.div 
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            // Simplified: top recommended could be a course if we match IDs
            // For now, let's keep it as is or link if possible
          }}
          className="relative overflow-hidden bg-white rounded-[2.5rem] p-6 shadow-xl border-2 border-slate-100 flex items-center gap-5 group cursor-pointer"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-6xl">{theme.icon}</span>
          </div>
          
          <div className={`w-20 h-20 rounded-3xl ${theme.softBgTailwind} flex items-center justify-center text-4xl shadow-inner`}>
            {WORLD_DATA[topRecommended.world as WorldId]?.icon || theme.icon}
          </div>
          
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black uppercase tracking-widest ${theme.mainColorTailwind}`}>
                Misión Recomendada
              </span>
              <span className="text-[10px] font-bold text-slate-300">•</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {theme.shortLabel}
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-800 leading-tight">
              {topRecommended.title}
            </h3>
            <p className="text-xs text-slate-500 font-medium italic line-clamp-1">
              {topRecommended.subtitle}
            </p>
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-black text-slate-800 tracking-tight">Tus Mundos</h2>
        <div className="grid grid-cols-2 gap-8 py-4">
          {recommendedIslands.slice(0, 4).map((island) => (
            <div key={island.id} className="flex flex-col items-center gap-3">
              <motion.button
                onClick={() => { playOpen(); onSelectWorld(island.id); }}
                whileHover={{ 
                  y: -8,
                  rotate: 2,
                  transition: { type: "spring", stiffness: 300, damping: 10 }
                }}
                whileTap={{ scale: 0.9, rotate: -2 }}
                className={`w-32 h-32 aspect-square rounded-full ${island.color} flex items-center justify-center text-5xl border-b-8 border-black/10 shadow-xl cursor-pointer`}
              >
                <span className="drop-shadow-md">{island.icon}</span>
              </motion.button>
              <div className="text-center">
                <h3 className="font-black text-slate-800 uppercase tracking-tight text-xs">{island.label}</h3>
                <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-slate-400">
                  <AppIcon name="gamepad" size={12} className="w-3 h-3" /> {Math.floor(Math.random() * 2000) + 500}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <section className="space-y-4">
        

        <MiniGamesSection
          onOpenMusicalRecipe={onOpenGame}
        />
      </section>

      <div className="space-y-4">
        <h2 className="text-xl font-black text-slate-800 tracking-tight">Cursos Sugeridos</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {recommendedCourses.map(course => (
            <motion.div 
              key={course.id}
              onClick={() => { playOpen(); onSelectCourse(course.id); }}
              whileTap={{ scale: 0.98 }}
              className="min-w-[240px] bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3 cursor-pointer"
            >
              <div className={`w-full aspect-video rounded-2xl ${WORLD_DATA[course.world as WorldId]?.color || "bg-slate-100"} flex items-center justify-center text-4xl`}>
                {course.coverEmoji || "🧩"}
              </div>
              <div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${theme.mainColorTailwind}`}>{course.strand}</span>
                <h3 className="font-bold text-slate-800 leading-tight">{course.title}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{course.subtitle}</p>
              </div>
            </motion.div>
          ))}
          {recommendedCourses.length === 0 && (
              <p className="text-slate-400 italic text-sm py-4">Sigue completando el onboarding para ver cursos.</p>
          )}
        </div>
      </div>


      <div className="glass-panel p-6 overflow-hidden relative group shadow-sm bg-white border border-slate-200 shadow-xl rounded-[2.5rem]">
        <div className="absolute -right-4 -top-4 opacity-10 rotate-12">
          <AppIcon name="sparkles" size={96} className="w-24 h-24 text-amber-400" />
        </div>
        <div className="relative z-10">
          <h2 className="text-xl font-bold flex items-center gap-2">
            {theme.missionTitle}
          </h2>
          <p className="text-slate-500 text-sm mt-1 tracking-tight">{theme.missionText}</p>
          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "33%" }}
                className={`h-full ${theme.mainBgTailwind}`} 
              />
            </div>
            <span className="font-bold text-slate-400">33%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Feed (TikTok Style)
const FeedView = ({ profile }: { profile: UserProfile }) => {
  const theme = getCognitiveTheme(profile);
  const copy = getDynamicCopy(profile);
  const focusContent = recommendContent(profile, "focus");

  if (focusContent.length === 0) {
    return <div className="h-full flex items-center justify-center text-slate-400 font-bold">No hay retos disponibles para tu edad ahora mismo.</div>;
  }

  return (
    <div className="h-full pt-16 pb-20 no-scrollbar overflow-y-scroll snap-y snap-mandatory bg-black">
      {focusContent.map((clip) => (
        <div 
          key={clip.id}
          className={`h-full w-full snap-start relative flex items-center justify-center ${WORLD_DATA[clip.world as WorldId]?.color || "bg-slate-800"}`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80" />
          
          <div className="text-9xl opacity-10 filter blur-sm">
             {WORLD_DATA[clip.world as WorldId]?.icon || theme.icon}
          </div>

          <div className="absolute bottom-10 left-6 right-20 text-white space-y-3">
             <div className="flex items-center gap-2">
               <span className={`bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white`}>
                 {WORLD_DATA[clip.world as WorldId]?.label || "General"}
               </span>
               <span className={`${theme.mainBgTailwind} px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-lg`}>
                 {theme.toneWords[0]}
               </span>
             </div>
             
             <div className="space-y-1">
               <span className="text-xs font-bold text-primary italic">{copy.focusPrompt}</span>
               <h2 className="text-3xl font-black leading-tight tracking-tighter shadow-sm">{clip.title}</h2>
               <p className="text-sm opacity-70 font-medium line-clamp-2">{clip.subtitle}</p>
             </div>

             <div className="flex items-center gap-3 pt-4">
                <div className={`w-8 h-8 rounded-full ${theme.mainBgTailwind} flex items-center justify-center shadow-lg`}>
                   <AppIcon name="sparkles" size={16} className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest opacity-80">Reto de {theme.shortLabel}</span>
             </div>
          </div>

          <div className="absolute right-4 bottom-10 flex flex-col gap-8 text-white items-center">
             <button 
               onClick={() => playOpen()}
               className="flex flex-col items-center gap-1 group"
             >
               <motion.div 
                 whileHover={{ scale: 1.1 }}
                 whileTap={{ scale: 0.9 }}
                 className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border-2 border-white/20 shadow-xl group-hover:bg-primary group-hover:border-primary transition-all overflow-hidden"
               >
                 <AppIcon name="play" size={28} className="w-7 h-7" fill="white" />
               </motion.div>
               <span className="text-[10px] font-black uppercase tracking-tighter">Entrar</span>
             </button>
             
             <button 
               onClick={() => playSelect()}
               className="flex flex-col items-center gap-1 group"
             >
               <motion.div 
                 whileHover={{ scale: 1.1 }}
                 whileTap={{ scale: 0.9 }}
                 className={`w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border-2 border-white/20 shadow-xl group-hover:${theme.mainBgTailwind} group-hover:border-transparent transition-all overflow-hidden`}
                >
                 <AppIcon name="trophy" size={28} className="w-7 h-7" />
               </motion.div>
               <span className="text-[10px] font-black uppercase tracking-tighter">{copy.actionButtonText}</span>
             </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// 3. Learning Path (Growth Path Style)
const AcademyView = ({ 
  profile, 
  onSelectCourse 
}: { 
  profile: UserProfile;
  onSelectCourse: (courseId: string) => void;
}) => {
  const theme = getCognitiveTheme(profile);
  const recommendedCourses = recommendCourses(profile);
  
  return (
    <div className="pt-24 pb-24 px-6 overflow-y-auto h-full scroll-smooth no-scrollbar bg-slate-50">
      <div className="max-w-md mx-auto space-y-16 py-4 relative">
        {/* Central Growth Stem */}
        <div className="absolute left-1/2 top-4 bottom-4 w-1.5 bg-slate-200 -translate-x-1/2 rounded-full overflow-hidden">
          <div className={`w-full h-1/4 ${theme.mainBgTailwind} rounded-full transition-all duration-1000`} />
        </div>

        <div className="relative z-10 space-y-10">
          {/* Unit Header Card */}
          <div className="glass-panel p-6 text-center shadow-md relative bg-white rounded-[2rem] border-2 border-slate-100">
            <span className={`absolute -top-3 left-1/2 -translate-x-1/2 ${theme.mainBgTailwind} text-white text-[10px] font-black px-5 py-1.5 rounded-full uppercase tracking-widest shadow-lg`}>
              {theme.pathName}
            </span>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight mt-2">{theme.pathName}</h2>
            <p className="text-xs font-medium text-slate-400 mt-2 italic px-8">{theme.subtitle}</p>
          </div>

          <div className="space-y-16">
            {recommendedCourses.map((course, idx) => {
              const isActive = idx === 0;
              const isLocked = false; // Simplified for now
              const worldInfo = WORLD_DATA[course.world as WorldId];

              return (
                <div 
                  key={course.id} 
                  className={`flex items-center gap-6 ${idx % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                >
                  {/* Lesson Bubble */}
                  <motion.div 
                    onClick={() => { playOpen(); onSelectCourse(course.id); }}
                    whileHover={!isLocked ? { scale: 1.05 } : {}}
                    whileTap={!isLocked ? { scale: 0.95 } : {}}
                    className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-xl border-4 relative cursor-pointer transition-all
                      ${isActive ? `bg-accent border-amber-500 racha-glow` : 
                        !isLocked ? `bg-white border-primary/20 ${theme.mainColorTailwind}` : 
                        "bg-white border-slate-100 text-slate-200"}`}
                  >
                    <span className={`drop-shadow-sm ${isLocked ? "grayscale opacity-50" : ""}`}>
                      {course.coverEmoji || worldInfo?.icon || "📚"}
                    </span>
                    
                    {/* Connection Branch */}
                    <div className={`absolute top-1/2 -translate-y-1/2 w-8 h-1 bg-slate-200 
                      ${idx % 2 === 0 ? "-right-8" : "-left-8"}`} 
                    />
                  </motion.div>

                  {/* Lesson Info Card */}
                  <div className={`flex-1 space-y-1 ${idx % 2 === 0 ? "text-left" : "text-right"}`}>
                    <h4 className={`font-black uppercase tracking-tighter text-sm ${!isLocked ? "text-slate-800" : "text-slate-400"}`}>
                      {course.title}
                    </h4>
                    <p className="text-[10px] font-medium text-slate-400 leading-tight">
                      {course.subtitle}
                    </p>
                    <div className={`flex items-center gap-1 opacity-60 mt-2 ${idx % 2 === 0 ? "justify-start" : "justify-end"}`}>
                       <span className={`text-[9px] font-black tracking-widest uppercase ${isActive ? "text-amber-500" : "text-slate-400"}`}>
                         {isActive ? "¡EMPIEZA AQUÍ!" : isLocked ? "BLOQUEADO" : "DISPONIBLE"}
                       </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Final Reward Node */}
        <div className="flex flex-col items-center gap-4 relative z-10 pt-10">
          <div className="w-32 h-32 bg-slate-800 rounded-full flex items-center justify-center border-8 border-slate-700 shadow-2xl relative">
             <AppIcon name="trophy" size={64} className="w-16 h-16 text-amber-400 drop-shadow-lg" />
             <div className="absolute -top-2 -right-2 bg-primary w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black shadow-lg">?</div>
          </div>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest text-center mt-2 px-10">
            Gran Tesoro: {theme.pathName}
          </p>
        </div>
      </div>
    </div>
  );
};

// 4. Achievements View
const AchievementsView = ({ profile }: { profile: UserProfile }) => {
  const theme = getCognitiveTheme(profile);
  const copy = getDynamicCopy(profile);
  const primaryGoal = profile.cognitiveProfile?.primaryGoal || "attention";

  const goalAchievements = {
    attention: [
      { id: "a1", title: "Ojo de Águila", desc: "Respondiste retos de observación.", icon: "🦅" },
      { id: "a2", title: "Detective Visual", desc: "Encontraste detalles escondidos.", icon: "🔍" },
      { id: "a3", title: "Memoria Activa", desc: "Recordaste una secuencia completa.", icon: "🧠" }
    ],
    patience: [
      { id: "p1", title: "Modo Tortuga", desc: "Terminaste una misión sin apresurarte.", icon: "🐢" },
      { id: "p2", title: "Respiración Pro", desc: "Completaste una pausa guiada.", icon: "🌬️" },
      { id: "p3", title: "Espera Inteligente", desc: "Esperaste antes de responder.", icon: "⏳" }
    ],
    reasoning: [
      { id: "r1", title: "Mente Lógica", desc: "Resolviste un patrón.", icon: "🧩" },
      { id: "r2", title: "Mini Científico", desc: "Predijiste un resultado.", icon: "🧪" },
      { id: "r3", title: "Pensador Profundo", desc: "Explicaste una respuesta.", icon: "💡" }
    ]
  }[primaryGoal] || [];

  return (
    <div className="pt-24 pb-24 px-8 overflow-y-auto h-full space-y-10 no-scrollbar bg-slate-50">
      <header className="text-center space-y-3">
        <div className={`w-20 h-20 ${theme.softBgTailwind} rounded-full flex items-center justify-center text-4xl mx-auto shadow-inner border border-white`}>
          {theme.icon}
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Tu mente está creciendo</h1>
          <p className="text-slate-500 text-sm font-medium italic px-4 leading-snug">
            {copy.achievementsSubtitle}
          </p>
        </div>
      </header>

      <section className="space-y-4">
        <h2 className={`text-xs font-black ${theme.mainColorTailwind} uppercase tracking-widest flex items-center gap-2`}>
          Tus Triunfos de {theme.shortLabel}
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {goalAchievements.map(ach => (
            <motion.div 
              key={ach.id} 
              whileHover={{ x: 5 }}
              className="bg-white p-5 rounded-[2.5rem] border-2 border-slate-100 shadow-sm flex items-center gap-5 transition-shadow hover:shadow-md"
            >
              <div className={`w-16 h-16 rounded-3xl ${theme.softBgTailwind} flex items-center justify-center text-4xl shadow-inner`}>
                {ach.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-black text-slate-800 leading-tight tracking-tight">{ach.title}</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter mt-0.5">{ach.desc}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
                 <AppIcon name="trophy" size={16} className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className={`p-6 rounded-[2.5rem] ${theme.mainBgTailwind} text-white flex items-center gap-4 shadow-xl`}>
         <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">
            🎁
         </div>
         <div className="flex-1">
            <h4 className="font-black text-sm uppercase tracking-wider">Cofre de Meta</h4>
            <p className="text-[10px] opacity-80 font-bold uppercase tracking-widest">Siguiente premio en 2 niveles</p>
         </div>
      </div>
    </div>
  );
};


export default function App() {
  const [view, setView] = useState<View>("onboarding");
  const [streak, setStreak] = useState(3);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Learning Navigation State
  const [learningNav, setLearningNav] = useState({
    view: "main" as "main" | "world" | "course" | "module" | "lesson" | "activity",
    worldKey: null as WorldId | null,
    courseId: null as string | null,
    moduleId: null as string | null,
    lessonId: null as string | null,
    activityId: null as string | null,
  });

  const navigateTo = (navUpdate: Partial<typeof learningNav>) => {
    setLearningNav(prev => ({ ...prev, ...navUpdate }));
  };

  useEffect(() => {
    preloadSounds();
  }, []);

  useEffect(() => {
  const shouldPlayMusic =
    view !== "onboarding" &&
    learningNav.view === "main";

  if (shouldPlayMusic && isMusicEnabled()) {
    bgMusic.play().catch((err) => {
      console.log("Autoplay bloqueado:", err);
    });
  } else {
    bgMusic.pause();
  }
}, [view, learningNav.view]);

  const handleOnboardingComplete = (data: UserProfile) => {
    setProfile(data);
    setView("hub");
  };

  // Content rendering helper
  const renderMainContent = () => {
    if (!profile) return null;

    if (learningNav.view !== "main") {
        return (
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full w-full z-50 bg-white"
            >
                {learningNav.view === "world" && learningNav.worldKey && (
                    <WorldDetailView 
                        userProfile={profile} 
                        worldKey={learningNav.worldKey}
                        onBack={() => navigateTo({ view: "main", worldKey: null })}
                        onSelectCourse={(id) => navigateTo({ view: "course", courseId: id })}
                    />
                )}
                {learningNav.view === "course" && learningNav.courseId && (
                    <CourseDetailView 
                        courseId={learningNav.courseId}
                        onBack={() => navigateTo({ view: "world" })}
                        onSelectModule={(id) => navigateTo({ view: "module", moduleId: id })}
                    />
                )}
                {learningNav.view === "module" && learningNav.courseId && learningNav.moduleId && (
                    <ModuleDetailView 
                        courseId={learningNav.courseId}
                        moduleId={learningNav.moduleId}
                        onBack={() => navigateTo({ view: "course" })}
                        onSelectLesson={(id) => navigateTo({ view: "lesson", lessonId: id })}
                    />
                )}
                {learningNav.view === "lesson" && learningNav.courseId && learningNav.moduleId && learningNav.lessonId && (
                    <LessonDetailView 
                        courseId={learningNav.courseId}
                        moduleId={learningNav.moduleId}
                        lessonId={learningNav.lessonId}
                        onBack={() => navigateTo({ view: "module" })}
                        onSelectActivity={(id) => navigateTo({ view: "activity", activityId: id })}
                    />
                )}
                {learningNav.view === "activity" && learningNav.courseId && learningNav.moduleId && learningNav.lessonId && learningNav.activityId && (
                    <ActivityPlayerView 
                        courseId={learningNav.courseId}
                        moduleId={learningNav.moduleId}
                        lessonId={learningNav.lessonId}
                        activityId={learningNav.activityId}
                        onBack={() => navigateTo({ view: "lesson" })}
                        onComplete={() => navigateTo({ view: "main", worldKey: null, courseId: null, moduleId: null, lessonId: null, activityId: null })}
                    />
                )}
            </motion.div>
        );
    }

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={view}
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.02, y: -10 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="h-full w-full"
            >
                {view === "hub" && (
                  <HubView
                    profile={profile}
                    onSelectWorld={(key) =>
                      navigateTo({ view: "world", worldKey: key })
                    }
                    onSelectCourse={(id) =>
                      navigateTo({ view: "course", courseId: id })
                    }
                    onOpenGame={() => setView("musicLab")}
                  />
                )}
                {view === "feed" && <FeedView profile={profile} />}
                {view === "academy" && <AcademyView profile={profile} onSelectCourse={(id) => navigateTo({ view: "course", courseId: id })} />}
                {view === "profile" && <AchievementsView profile={profile} />}
                {view === "musicLab" && (
                  <MusicLabGame onBack={() => setView("hub")} />
                )}
            </motion.div>
        </AnimatePresence>
    );
  };

  return (
    <div className="fixed inset-0 select-none overflow-hidden touch-none font-sans bg-bg">
      {view !== "onboarding" &&
      view !== "musicLab" &&
      learningNav.view === "main" && (
        <TopBar streak={streak} profile={profile || undefined} />
      )}
      
      <main className="h-full w-full">
          {view === "onboarding" ? (
            <OnboardingView onComplete={handleOnboardingComplete} />
          ) : (
            renderMainContent()
          )}
      </main>

      {view !== "onboarding" &&
      view !== "musicLab" &&
      learningNav.view === "main" && (
        <BottomNav active={view} setView={setView} />
      )}
    </div>
  );
}
