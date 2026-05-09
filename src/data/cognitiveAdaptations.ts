import { WorldKey } from "./worldTaxonomy";
import { UserProfile, ParentGoal } from "../types";

/**
 * Brain Grow Cognitive Adaptations
 * This file defines how each world is adapted based on the user's cognitive goal.
 * It provides specialized descriptors, activity types, and UI tones for a personalized experience.
 */

export type CognitiveGoal = "attention" | "patience" | "reasoning";

export interface CognitiveAdaptation {
  title: string;
  description: string;
  activityTypes: string[];
  questionTypes: string[];
  uiTone: string;
  microcopyExamples: string[];
}

export type CognitiveAdaptationsMap = Record<CognitiveGoal, Record<WorldKey, CognitiveAdaptation>>;

export const cognitiveAdaptations: CognitiveAdaptationsMap = {
  attention: {
    nature: {
      title: "Naturaleza para observar",
      description: "Explora animales, plantas y paisajes encontrando detalles que casi nadie nota.",
      activityTypes: ["buscar animales ocultos", "detectar cambios en plantas", "recordar patrones naturales"],
      questionTypes: ["¿Qué viste primero?", "¿Qué detalle cambió?", "¿Qué animal estaba escondido?"],
      uiTone: "curioso y explorador",
      microcopyExamples: ["Mira con ojos de explorador.", "Encuentra el detalle secreto.", "Observa antes de tocar."]
    },
    space: {
      title: "Espacio para enfocar",
      description: "Observa planetas, estrellas y misiones espaciales para entrenar tu atención.",
      activityTypes: ["recordar el orden de planetas", "detectar cambios en constelaciones", "seguir trayectorias espaciales"],
      questionTypes: ["¿Qué planeta apareció primero?", "¿Qué estrella cambió de lugar?", "¿Qué objeto iba más rápido?"],
      uiTone: "aventura espacial",
      microcopyExamples: ["Activa tu radar espacial.", "Observa como astronauta.", "No pierdas de vista la misión."]
    },
    art: {
      title: "Arte para entrenar el ojo",
      description: "Juega con colores, formas e imágenes encontrando detalles escondidos.",
      activityTypes: ["encontrar diferencias", "recordar colores", "detectar formas escondidas"],
      questionTypes: ["¿Qué color cambió?", "¿Qué forma faltaba?", "¿Dónde estaba el detalle?"],
      uiTone: "creativo y visual",
      microcopyExamples: ["Tu ojo de artista está listo.", "Busca el color secreto.", "Mira cada rincón."]
    },
    science: {
      title: "Ciencia para observar mejor",
      description: "Mira experimentos y fenómenos para detectar cambios, pasos y resultados.",
      activityTypes: ["observar reacciones", "recordar pasos", "detectar variables"],
      questionTypes: ["¿Qué cambió en el experimento?", "¿Qué pasó primero?", "¿Qué objeto reaccionó?"],
      uiTone: "investigador curioso",
      microcopyExamples: ["Observa como científico.", "Detecta el cambio.", "Mira el experimento completo."]
    },
    history: {
      title: "Historia para encontrar pistas",
      description: "Explora objetos, épocas y personajes encontrando pistas del pasado.",
      activityTypes: ["buscar objetos históricos", "recordar detalles de una época", "comparar antes y después"],
      questionTypes: ["¿Qué objeto viste?", "¿Qué cambió entre épocas?", "¿Qué pista era importante?"],
      uiTone: "detective del tiempo",
      microcopyExamples: ["Busca pistas del pasado.", "Observa como detective.", "Cada detalle cuenta."]
    },
    logic: {
      title: "Lógica para detectar patrones",
      description: "Encuentra secuencias, formas y reglas usando atención visual.",
      activityTypes: ["detectar patrones", "encontrar errores", "recordar secuencias"],
      questionTypes: ["¿Qué pieza sigue?", "¿Cuál no pertenece?", "¿Qué patrón cambió?"],
      uiTone: "reto mental rápido",
      microcopyExamples: ["Encuentra la regla secreta.", "Mira el patrón completo.", "No te dejes distraer."]
    },
    cinema: {
      title: "Cine para mirar escenas",
      description: "Observa escenas, sonidos y gestos para notar detalles importantes.",
      activityTypes: ["recordar escenas", "detectar cambios de plano", "observar expresiones"],
      questionTypes: ["¿Qué pasó en la escena?", "¿Qué gesto cambió?", "¿Qué apareció al final?"],
      uiTone: "observador de historias",
      microcopyExamples: ["Mira como director.", "No pierdas el detalle.", "Observa la escena completa."]
    },
    lab: {
      title: "Lab de enfoque",
      description: "Entrena tu mente con retos de atención, memoria y observación.",
      activityTypes: ["filtro de distractores", "memoria visual", "atención sostenida"],
      questionTypes: ["¿Qué viste?", "¿Qué faltaba?", "¿Qué cambió?"],
      uiTone: "entrenamiento mental",
      microcopyExamples: ["Activa tu modo enfoque.", "Tu cerebro está entrenando.", "Una misión más."]
    }
  },
  patience: {
    nature: {
      title: "Naturaleza sin prisa",
      description: "Observa procesos naturales con calma, como plantas que crecen y animales que aparecen poco a poco.",
      activityTypes: ["observar crecimiento", "esperar animales", "respirar con paisajes"],
      questionTypes: ["¿Qué apareció al final?", "¿Qué cambió lentamente?", "¿Qué pasó después de esperar?"],
      uiTone: "tranquilo y natural",
      microcopyExamples: ["Respira con el bosque.", "Espera el momento.", "La naturaleza avanza sin prisa."]
    },
    space: {
      title: "Espacio en calma",
      description: "Sigue órbitas, estrellas y viajes espaciales aprendiendo a esperar y observar.",
      activityTypes: ["seguir órbitas lentas", "esperar alineaciones", "respiración de astronauta"],
      questionTypes: ["¿Qué ocurrió después?", "¿Qué planeta llegó al final?", "¿Qué pasó cuando esperaste?"],
      uiTone: "calma cósmica",
      microcopyExamples: ["Respira como astronauta.", "Sigue la órbita con calma.", "Espera la señal espacial."]
    },
    art: {
      title: "Arte sin prisa",
      description: "Crea, observa y completa imágenes paso a paso, sin correr.",
      activityTypes: ["colorear lentamente", "completar por partes", "observar antes de elegir"],
      questionTypes: ["¿Qué parte apareció después?", "¿Qué emoción transmite?", "¿Qué elegiste después de mirar?"],
      uiTone: "suave y creativo",
      microcopyExamples: ["Tómate tu tiempo.", "Mira antes de elegir.", "Cada trazo cuenta."]
    },
    science: {
      title: "Ciencia con calma",
      description: "Sigue experimentos que requieren esperar, observar y responder sin prisa.",
      activityTypes: ["esperar una reacción", "seguir pasos", "pausa antes de responder"],
      questionTypes: ["¿Qué pasó al final?", "¿Qué cambió lentamente?", "¿Qué ocurrió después de esperar?"],
      uiTone: "curioso y paciente",
      microcopyExamples: ["Espera la reacción.", "Observa hasta el final.", "La respuesta aparece con calma."]
    },
    history: {
      title: "Historia paso a paso",
      description: "Ordena eventos, observa cambios y descubre cómo las cosas toman tiempo.",
      activityTypes: ["ordenar líneas del tiempo", "reconstruir procesos", "comparar épocas con calma"],
      questionTypes: ["¿Qué ocurrió después?", "¿Cuál fue el primer paso?", "¿Qué cambió con el tiempo?"],
      uiTone: "viaje tranquilo en el tiempo",
      microcopyExamples: ["Un paso a la vez.", "Viaja sin prisa.", "El tiempo cuenta historias."]
    },
    logic: {
      title: "Lógica sin impulsos",
      description: "Resuelve patrones y problemas aprendiendo a pensar antes de tocar.",
      activityTypes: ["esperar antes de responder", "resolver sin presión", "evitar distractores"],
      questionTypes: ["¿Cuál eliges después de pensar?", "¿Qué opción conviene más?", "¿Qué pasa si esperas?"],
      uiTone: "reto calmado",
      microcopyExamples: ["Piensa antes de tocar.", "No corras, observa.", "La mejor respuesta espera."]
    },
    cinema: {
      title: "Cine con calma",
      description: "Mira escenas completas, escucha sonidos y espera el final antes de responder.",
      activityTypes: ["ver escena completa", "escuchar en silencio", "esperar el final"],
      questionTypes: ["¿Qué pasó al final?", "¿Qué sonido apareció después?", "¿Qué emoción cambió?"],
      uiTone: "pausa cinematográfica",
      microcopyExamples: ["Mira hasta el final.", "Escucha la escena.", "La historia necesita tiempo."]
    },
    lab: {
      title: "Lab de calma",
      description: "Practica pausas, respiración y control del impulso con retos breves.",
      activityTypes: ["respiración guiada", "espera activa", "control del impulso"],
      questionTypes: ["¿Esperaste antes de tocar?", "¿Qué pasó después de respirar?", "¿Qué elegiste con calma?"],
      uiTone: "entrenamiento tranquilo",
      microcopyExamples: ["Respira y avanza.", "Tu calma también sube de nivel.", "Espera la señal."]
    }
  },
  reasoning: {
    nature: {
      title: "Naturaleza para pensar",
      description: "Descubre causas, consecuencias y conexiones entre animales, plantas y ecosistemas.",
      activityTypes: ["cadena alimenticia", "predecir cambios", "comparar ecosistemas"],
      questionTypes: ["¿Qué pasaría si cambia el clima?", "¿Por qué ocurrió eso?", "¿Qué consecuencia tendría?"],
      uiTone: "explorador inteligente",
      microcopyExamples: ["Conecta las pistas.", "Piensa qué pasaría después.", "La naturaleza tiene razones."]
    },
    space: {
      title: "Espacio para predecir",
      description: "Usa planetas, gravedad y trayectorias para pensar en causas y resultados.",
      activityTypes: ["predecir órbitas", "comparar planetas", "causa y efecto espacial"],
      questionTypes: ["¿Qué pasaría si cambia la gravedad?", "¿Cuál llegará primero?", "¿Por qué se mueve así?"],
      uiTone: "científico espacial",
      microcopyExamples: ["Predice la órbita.", "Piensa como astronauta.", "Cada movimiento tiene una razón."]
    },
    art: {
      title: "Arte para interpretar",
      description: "Compara colores, estilos y composiciones para explicar ideas visuales.",
      activityTypes: ["comparar estilos", "explicar decisiones visuales", "ordenar pasos creativos"],
      questionTypes: ["¿Por qué ese color cambia la emoción?", "¿Qué estilo se parece más?", "¿Qué decisión visual funciona mejor?"],
      uiTone: "creativo reflexivo",
      microcopyExamples: ["Elige y explica.", "Cada color cuenta algo.", "Piensa como artista."]
    },
    science: {
      title: "Ciencia para pensar como investigador",
      description: "Predice resultados, compara causas y explica qué ocurrió en cada experimento.",
      activityTypes: ["formular hipótesis", "predecir resultados", "comparar variables"],
      questionTypes: ["¿Qué crees que pasará?", "¿Por qué ocurrió?", "¿Qué variable cambió?"],
      uiTone: "investigador lógico",
      microcopyExamples: ["Haz tu hipótesis.", "Predice el resultado.", "Explica como científico."]
    },
    history: {
      title: "Historia para conectar causas",
      description: "Entiende decisiones, inventos y eventos pensando en causas y consecuencias.",
      activityTypes: ["causa y consecuencia", "decisiones históricas", "ordenar eventos"],
      questionTypes: ["¿Por qué pasó eso?", "¿Qué cambió después?", "¿Qué decisión fue más importante?"],
      uiTone: "pensador del tiempo",
      microcopyExamples: ["Conecta el antes y después.", "Cada decisión cambia algo.", "Piensa como historiador."]
    },
    logic: {
      title: "Lógica para resolver",
      description: "Resuelve patrones, clasifica información y elige la mejor estrategia.",
      activityTypes: ["resolver patrones", "clasificar reglas", "tomar decisiones"],
      questionTypes: ["¿Cuál es la regla?", "¿Qué opción conviene más?", "¿Qué paso sigue?"],
      uiTone: "reto estratégico",
      microcopyExamples: ["Encuentra la estrategia.", "Resuelve paso a paso.", "Conecta la respuesta."]
    },
    cinema: {
      title: "Cine para entender historias",
      description: "Analiza escenas, personajes y decisiones para predecir lo que pasará.",
      activityTypes: ["predecir finales", "ordenar historia", "explicar decisiones"],
      questionTypes: ["¿Por qué actuó así?", "¿Qué pasará después?", "¿Cuál fue la causa del problema?"],
      uiTone: "director de historias",
      microcopyExamples: ["Piensa como director.", "Predice la escena.", "Cada personaje tiene razones."]
    },
    lab: {
      title: "Lab de ideas",
      description: "Entrena lógica, predicción y toma de decisiones con retos mentales.",
      activityTypes: ["hipótesis", "patrones", "decisiones"],
      questionTypes: ["¿Qué pasará después?", "¿Cuál es la mejor opción?", "¿Por qué elegiste eso?"],
      uiTone: "entrenamiento inteligente",
      microcopyExamples: ["Activa tu modo ideas.", "Piensa dos veces.", "Tu mente conecta pistas."]
    }
  }
};

/**
 * Returns the adaptation for a specific goal and world.
 */
export function getAdaptation(goalKey: CognitiveGoal, worldKey: WorldKey): CognitiveAdaptation | undefined {
  return cognitiveAdaptations[goalKey]?.[worldKey];
}

/**
 * Returns all adaptations for a specific goal.
 */
export function getAdaptationsByGoal(goalKey: CognitiveGoal) {
  return cognitiveAdaptations[goalKey];
}

/**
 * Returns the adaptations for a world across all goals.
 */
export function getAdaptationsForWorld(worldKey: WorldKey) {
  return {
    attention: cognitiveAdaptations.attention[worldKey],
    patience: cognitiveAdaptations.patience[worldKey],
    reasoning: cognitiveAdaptations.reasoning[worldKey]
  };
}

/**
 * Derives the primary goal from user profile and returns the adaptation for a world.
 */
export function getPrimaryAdaptationForUser(userProfile: UserProfile, worldKey: WorldKey): CognitiveAdaptation {
  const goalKey = (userProfile.cognitiveProfile?.primaryGoal || 
                   (userProfile.parentGoals && userProfile.parentGoals.length > 0 ? userProfile.parentGoals[0] : "attention")) as CognitiveGoal;
  
  return cognitiveAdaptations[goalKey][worldKey];
}

/**
 * Returns the adapted title for a specific world based on the user's focus.
 */
export function getAdaptedWorldTitle(userProfile: UserProfile, worldKey: WorldKey): string {
  return getPrimaryAdaptationForUser(userProfile, worldKey).title;
}

/**
 * Returns the adapted description for a specific world based on the user's focus.
 */
export function getAdaptedWorldDescription(userProfile: UserProfile, worldKey: WorldKey): string {
  return getPrimaryAdaptationForUser(userProfile, worldKey).description;
}
