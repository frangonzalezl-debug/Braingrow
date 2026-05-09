// ============================================================
//  REGISTRO DE ÍCONOS — edita SOLO este archivo para cambiar
//  cualquier ícono por tu propio dibujo.
//
//  Cómo hacerlo:
//  1. Pon tu imagen en  src/assets/icons/  (png, jpg, svg, webp)
//  2. Impórtala aquí:
//       import miFlama from "./assets/icons/flama.png";
//  3. Cambia  custom: null  →  custom: miFlama  en el ícono que quieras
// ============================================================

import type { LucideIcon } from "lucide-react";
import {
  Home,
  Play,
  BookOpen,
  Trophy,
  Sparkles,
  Gamepad2,
  Flame,
  LayoutGrid,
  ChevronLeft,
  Volume2,
  VolumeX,
  CheckCircle2,
  ArrowRight,
  Star,
  Clock,
  Zap,
  Brain,
  MessageCircle,
  Hash,
} from "lucide-react";

// --- Importa tus dibujos aquí cuando los tengas, por ejemplo: ---
// import miFlama      from "./assets/icons/flama.png";
// import miTrofeo     from "./assets/icons/trofeo.png";
// import miCasa       from "./assets/icons/casa.png";
// ----------------------------------------------------------------

export type IconName =
  | "home"
  | "play"
  | "bookOpen"
  | "trophy"
  | "sparkles"
  | "gamepad"
  | "flame"
  | "layoutGrid"
  | "chevronLeft"
  | "volume"
  | "volumeOff"
  | "checkCircle"
  | "arrowRight"
  | "star"
  | "clock"
  | "zap"
  | "brain"
  | "messageCircle"
  | "hash";

type IconConfig = {
  lucide: LucideIcon;
  custom: string | null; // pon aquí la variable importada, o null para usar lucide
};

export const icons: Record<IconName, IconConfig> = {
  home:          { lucide: Home,          custom: null },
  play:          { lucide: Play,          custom: null },
  bookOpen:      { lucide: BookOpen,      custom: null },
  trophy:        { lucide: Trophy,        custom: null },
  sparkles:      { lucide: Sparkles,      custom: null },
  gamepad:       { lucide: Gamepad2,      custom: null },
  flame:         { lucide: Flame,         custom: null },
  layoutGrid:    { lucide: LayoutGrid,    custom: null },
  chevronLeft:   { lucide: ChevronLeft,   custom: null },
  volume:        { lucide: Volume2,       custom: null },
  volumeOff:     { lucide: VolumeX,       custom: null },
  checkCircle:   { lucide: CheckCircle2,  custom: null },
  arrowRight:    { lucide: ArrowRight,    custom: null },
  star:          { lucide: Star,          custom: null },
  clock:         { lucide: Clock,         custom: null },
  zap:           { lucide: Zap,           custom: null },
  brain:         { lucide: Brain,         custom: null },
  messageCircle: { lucide: MessageCircle, custom: null },
  hash:          { lucide: Hash,          custom: null },
};
