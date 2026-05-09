/**
 * Brain Grow World Taxonomy
 * This file defines the core taxonomy for the application's educational worlds and their specific strands (vertientes).
 * It is used for content categorization and personalization logic.
 */

export type WorldKey = "nature" | "space" | "art" | "science" | "history" | "logic" | "cinema" | "lab";
export type StrandKey = string; // More specific keys could be added if needed

export interface Strand {
  label: string;
  description: string;
}

export interface WorldDefinition {
  label: string;
  icon: string;
  description: string;
  isSupportWorld?: boolean;
  strands: Record<StrandKey, Strand>;
}

export const worldTaxonomy: Record<WorldKey, WorldDefinition> = {
  nature: {
    label: "Naturaleza",
    icon: "🌱",
    description: "Explora animales, plantas, ecosistemas y fenómenos naturales.",
    strands: {
      animals: { label: "Animales", description: "Comportamiento, movimiento, comunicación y protección animal." },
      plants: { label: "Plantas", description: "Crecimiento, ciclos de vida, germinación y cambios lentos." },
      ecosystems: { label: "Ecosistemas", description: "Bosques, mares, desiertos, selvas y cadenas alimenticias." },
      weather: { label: "Clima", description: "Lluvia, viento, nubes, tormentas y volcanes." }
    }
  },
  space: {
    label: "Espacio",
    icon: "🚀",
    description: "Explora planetas, astronautas, estrellas y física espacial simple.",
    strands: {
      planets: { label: "Planetas", description: "Tamaños, órbitas, características y comparaciones." },
      missions: { label: "Astronautas y misiones", description: "Cohetes, trajes espaciales, estaciones espaciales y exploración." },
      stars: { label: "Estrellas y galaxias", description: "Sol, constelaciones, nebulosas y agujeros negros a nivel infantil." },
      gravity: { label: "Gravedad", description: "Movimiento, distancia, rotación y gravedad básica." }
    }
  },
  art: {
    label: "Arte",
    icon: "🎨",
    description: "Explora color, formas, estilos y observación visual.",
    strands: {
      color: { label: "Color", description: "Colores primarios, mezclas, contrastes y emociones del color." },
      composition: { label: "Formas y composición", description: "Equilibrio visual, simetría, espacio negativo y orden visual." },
      styles: { label: "Estilos artísticos", description: "Pintura, collage, arte digital y escultura sencilla." },
      visualObservation: { label: "Observación visual", description: "Detalles escondidos, diferencias, secuencias visuales e interpretación emocional." }
    }
  },
  science: {
    label: "Ciencia",
    icon: "🧪",
    description: "Explora experimentos, cuerpo humano, máquinas y fenómenos cotidianos.",
    strands: {
      experiments: { label: "Experimentos", description: "Mezclas, reacciones seguras, cambios de estado y densidad básica." },
      humanBody: { label: "Cuerpo humano", description: "Sentidos, cerebro, movimiento y respiración." },
      simpleMachines: { label: "Máquinas simples", description: "Palancas, ruedas, poleas y engranes." },
      everydayPhenomena: { label: "Fenómenos cotidianos", description: "Flotar, derretirse, volar, rebotar y otros fenómenos diarios." }
    }
  },
  history: {
    label: "Historia",
    icon: "📜",
    description: "Explora civilizaciones, inventos, personajes y líneas del tiempo.",
    strands: {
      civilizations: { label: "Civilizaciones", description: "Egipto, Grecia, Roma, Mayas, Vikingos y culturas del mundo." },
      inventions: { label: "Inventos", description: "Rueda, imprenta, teléfono, avión, internet y tecnología histórica." },
      people: { label: "Personajes", description: "Exploradores, inventores, artistas y líderes." },
      timeline: { label: "Línea del tiempo", description: "Antes, después, orden de eventos y cambios entre épocas." }
    }
  },
  logic: {
    label: "Lógica",
    icon: "🧩",
    description: "Explora patrones, clasificación, problemas visuales y decisiones.",
    strands: {
      patterns: { label: "Patrones", description: "Secuencias, colores, figuras y sonidos." },
      classification: { label: "Clasificación", description: "Agrupar objetos, categorías, diferencias, semejanzas y reglas." },
      visualProblems: { label: "Problemas visuales", description: "Laberintos, rompecabezas, piezas faltantes y rutas." },
      decisions: { label: "Decisiones", description: "Elegir la mejor ruta, resolver dilemas simples y priorizar pasos." }
    }
  },
  cinema: {
    label: "Cine",
    icon: "🎬",
    description: "Explora escenas, emociones, cámara, sonido e historias.",
    strands: {
      emotions: { label: "Escenas y emociones", description: "Identificar emoción, expresiones, música y ambiente." },
      narrative: { label: "Secuencia narrativa", description: "Inicio, problema, solución y final." },
      camera: { label: "Cámara y encuadre", description: "Primer plano, plano general, movimiento y punto de vista." },
      sound: { label: "Sonido e imagen", description: "Efectos, música, silencio y ritmo." }
    }
  },
  lab: {
    label: "Lab",
    icon: "🔬",
    description: "Entrenamiento mental Brain Grow.",
    isSupportWorld: true,
    strands: {
      attentionLab: { label: "Cerebro y atención", description: "Enfoque, distractores, memoria de trabajo y observación." },
      calmLab: { label: "Calma y autocontrol", description: "Respiración, espera, control del impulso y pausas." },
      mentalChallenges: { label: "Retos mentales", description: "Memoria, lógica, predicción y toma de decisiones." },
      experimentMode: { label: "Modo Experimento", description: "Mini pruebas, comparación de resultados y misiones personalizadas." }
    }
  }
};

/**
 * Returns a world definition by its key.
 */
export function getWorldByKey(worldKey: WorldKey): WorldDefinition | undefined {
  return worldTaxonomy[worldKey];
}

/**
 * Returns all world options as an array.
 */
export function getWorldOptions() {
  return (Object.keys(worldTaxonomy) as WorldKey[]).map((key) => ({
    key,
    ...worldTaxonomy[key]
  }));
}

/**
 * Returns the strands of a world as an array.
 */
export function getStrandsByWorld(worldKey: WorldKey) {
  const world = worldTaxonomy[worldKey];
  if (!world) return [];
  return (Object.keys(world.strands) as StrandKey[]).map((key) => ({
    key,
    ...world.strands[key]
  }));
}

/**
 * Returns all worlds except those marked as support worlds.
 * Useful for onboarding where children pick their favorite worlds.
 */
export function getSelectableWorldOptions() {
  return getWorldOptions().filter((world) => !world.isSupportWorld);
}
