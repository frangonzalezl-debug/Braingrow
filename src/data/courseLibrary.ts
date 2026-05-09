import { Course } from "../types/learning";

/**
 * Brain Grow Course Library
 * Contains the mock database of educational courses.
 */

export const courseLibrary: Course[] = [
  {
    id: "science_attention_experiments",
    title: "Detectives de Experimentos",
    subtitle: "Observa y descubre",
    description: "Un curso para entrenar tu atención mirando experimentos científicos increíbles.",
    world: "science",
    strand: "experiments",
    goals: ["attention"],
    ageRange: [6, 12],
    detoxCompatibility: ["soft", "medium", "intense"],
    difficulty: 2,
    estimatedMinutes: 10,
    coverEmoji: "🧪",
    status: "published",
    modules: [
      {
        id: "m1",
        title: "El laboratorio secreto",
        lessons: [
          {
            id: "l1",
            title: "Mezclas mágicas",
            activities: [
              {
                id: "a1",
                title: "Observación de burbujas",
                contentType: "observation_challenge",
                prompt: "Mira cuántas burbujas cambian de color.",
                questions: [
                  {
                    id: "q1",
                    type: "multiple_choice",
                    question: "¿De qué color era la última burbuja?",
                    options: ["Roja", "Azul", "Verde"],
                    correctAnswer: "Azul"
                  }
                ]
              }
            ]
          },
          {
            id: "l2",
            title: "Cambios de estado",
            activities: [
              {
                id: "a2",
                title: "Hielo derretido",
                prompt: "Observa el hielo con cuidado.",
                contentType: "video_question"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "science_patience_experiments",
    title: "Experimentos sin Prisa",
    subtitle: "La ciencia toma tiempo",
    description: "Aprende a esperar el momento perfecto en el laboratorio.",
    world: "science",
    strand: "experiments",
    goals: ["patience"],
    ageRange: [6, 12],
    detoxCompatibility: ["soft", "medium", "intense"],
    difficulty: 1,
    estimatedMinutes: 15,
    coverEmoji: "⏳",
    status: "published",
    modules: [
      {
        id: "m1",
        title: "Paciencia científica",
        lessons: [
          {
            id: "l1",
            title: "La reacción lenta",
            activities: [
              {
                id: "a1",
                title: "Espera el color",
                contentType: "breathing_pause",
                prompt: "Respira mientras esperamos la reacción química.",
                questions: [
                  {
                    id: "q1",
                    type: "wait_before_answer",
                    question: "¿Qué color apareció después de la pausa?",
                    minWaitSeconds: 5
                  }
                ]
              }
            ]
          },
          {
            id: "l2",
            title: "Cristales creciendo",
            activities: [
              {
                id: "a2",
                title: "Observación lenta",
                prompt: "Mira cómo crecen los cristales.",
                contentType: "guided_activity"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "science_reasoning_experiments",
    title: "Pequeños Investigadores",
    subtitle: "Piensa y predice",
    description: "Usa la lógica para entender por qué suceden las cosas en la ciencia.",
    world: "science",
    strand: "experiments",
    goals: ["reasoning"],
    ageRange: [6, 12],
    detoxCompatibility: ["soft", "medium", "intense"],
    difficulty: 3,
    estimatedMinutes: 12,
    coverEmoji: "🧠",
    status: "published",
    modules: [
      {
        id: "m1",
        title: "Hipótesis y pruebas",
        lessons: [
          {
            id: "l1",
            title: "¿Flota o se hunde?",
            activities: [
              {
                id: "a1",
                title: "Predicción de densidad",
                contentType: "observation_challenge",
                prompt: "Adivina qué pasará con el objeto.",
                questions: [
                  {
                    id: "q1",
                    type: "prediction",
                    question: "¿Crees que este objeto flotará?"
                  }
                ]
              }
            ]
          },
          {
            id: "l2",
            title: "Causa y efecto",
            activities: [
              {
                id: "a2",
                title: "El motor de aire",
                prompt: "Piensa qué mueve a este carrito.",
                contentType: "video_question"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "art_attention_color",
    title: "Detectives del Color",
    subtitle: "Ojos de artista",
    description: "Entrena tu atención encontrando detalles ocultos en las pinturas.",
    world: "art",
    strand: "color",
    goals: ["attention"],
    ageRange: [6, 12],
    detoxCompatibility: ["soft", "medium", "intense"],
    difficulty: 2,
    estimatedMinutes: 8,
    coverEmoji: "🎨",
    status: "published",
    modules: [
      {
        id: "m1",
        title: "Percepción visual",
        lessons: [
          {
            id: "l1",
            title: "Mezclas escondidas",
            activities: [
              {
                id: "a1",
                title: "Búsqueda cromática",
                contentType: "observation_challenge",
                prompt: "Encuentra el tono que no pertenece.",
                questions: [
                  {
                    id: "q1",
                    type: "spot_difference",
                    question: "¿Qué color estaba repetido?",
                    options: ["Rojo", "Amarillo", "Verde"],
                    correctAnswer: "Rojo"
                  }
                ]
              }
            ]
          },
          {
            id: "l2",
            title: "Detalles en el cuadro",
            activities: [
              {
                id: "a2",
                title: "La lupa mágica",
                prompt: "Encuentra el pincel escondido.",
                contentType: "observation_challenge"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "art_patience_composition",
    title: "Arte sin Prisa",
    subtitle: "Crea con calma",
    description: "Construye obras maestras paso a paso, disfrutando cada trazo.",
    world: "art",
    strand: "composition",
    goals: ["patience"],
    ageRange: [6, 12],
    detoxCompatibility: ["soft", "medium", "intense"],
    difficulty: 1,
    estimatedMinutes: 15,
    coverEmoji: "🖼️",
    status: "published",
    modules: [
      {
        id: "m1",
        title: "Composición paciente",
        lessons: [
          {
            id: "l1",
            title: "Capas de color",
            activities: [
              {
                id: "a1",
                title: "Pausa creativa",
                contentType: "breathing_pause",
                prompt: "Respira antes de elegir la siguiente forma.",
                questions: [
                  {
                    id: "q1",
                    type: "wait_before_answer",
                    question: "¿Qué forma quieres usar ahora?",
                    minWaitSeconds: 3
                  }
                ]
              }
            ]
          },
          {
            id: "l2",
            title: "El collage lento",
            activities: [
              {
                id: "a2",
                title: "Armando el cuadro",
                prompt: "Coloca cada pieza en su lugar.",
                contentType: "story_sequence"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "logic_reasoning_patterns",
    title: "Maestro de Patrones",
    subtitle: "Conecta las formas",
    description: "Descubre las reglas secretas que unen a los objetos.",
    world: "logic",
    strand: "patterns",
    goals: ["reasoning"],
    ageRange: [6, 12],
    detoxCompatibility: ["soft", "medium", "intense"],
    difficulty: 3,
    estimatedMinutes: 10,
    coverEmoji: "🧩",
    status: "published",
    modules: [
      {
        id: "m1",
        title: "Reglas lógicas",
        lessons: [
          {
            id: "l1",
            title: "Secuencias infinitas",
            activities: [
              {
                id: "a1",
                title: "El patrón perdido",
                contentType: "pattern_challenge",
                prompt: "Adivina qué figura sigue en la fila.",
                questions: [
                  {
                    id: "q1",
                    type: "sequence_order",
                    question: "¿Cómo sigue esta serie?",
                    correctAnswer: ["Triángulo", "Círculo", "Cuadrado"]
                  }
                ]
              }
            ]
          },
          {
            id: "l2",
            title: "Clasificación inteligente",
            activities: [
              {
                id: "a2",
                title: "Agrupando ideas",
                prompt: "Separa los objetos por su forma.",
                contentType: "mini_game"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "nature_patience_plants",
    title: "La Planta Paciente",
    subtitle: "Crecer toma tiempo",
    description: "Acompaña a una semilla en su viaje para convertirse en flor.",
    world: "nature",
    strand: "plants",
    goals: ["patience"],
    ageRange: [6, 12],
    detoxCompatibility: ["soft", "medium", "intense"],
    difficulty: 1,
    estimatedMinutes: 20,
    coverEmoji: "🌱",
    status: "published",
    modules: [
      {
        id: "m1",
        title: "Ciclo de vida",
        lessons: [
          {
            id: "l1",
            title: "La germinación",
            activities: [
              {
                id: "a1",
                title: "Espera la lluvia",
                contentType: "breathing_pause",
                prompt: "Respira mientras la semilla absorbe agua.",
                questions: [
                  {
                    id: "q1",
                    type: "wait_before_answer",
                    question: "¿Sientes cómo crece la raíz?",
                    minWaitSeconds: 10
                  }
                ]
              }
            ]
          },
          {
            id: "l2",
            title: "Hacia el sol",
            activities: [
              {
                id: "a2",
                title: "Crecimiento guiado",
                prompt: "Ayuda a la planta a buscar la luz.",
                contentType: "guided_activity"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "cinema_attention_emotions",
    title: "Mira la Escena",
    subtitle: "Director de atención",
    description: "Detecta hasta el más mínimo detalle en las grandes historias.",
    world: "cinema",
    strand: "emotions",
    goals: ["attention"],
    ageRange: [6, 12],
    detoxCompatibility: ["soft", "medium", "intense"],
    difficulty: 2,
    estimatedMinutes: 8,
    coverEmoji: "🎬",
    status: "published",
    modules: [
      {
        id: "m1",
        title: "Observación de cine",
        lessons: [
          {
            id: "l1",
            title: "Caras y gestos",
            activities: [
              {
                id: "a1",
                title: "Detective de emociones",
                contentType: "observation_challenge",
                prompt: "Mira el cambio en la cara del personaje.",
                questions: [
                  {
                    id: "q1",
                    type: "multiple_choice",
                    question: "¿Qué emoción sintió al final?",
                    options: ["Susto", "Alegría", "Duda"],
                    correctAnswer: "Duda"
                  }
                ]
              }
            ]
          },
          {
            id: "l2",
            title: "El sonido secreto",
            activities: [
              {
                id: "a2",
                title: "Escucha con cuidado",
                prompt: "Identifica el instrumento que suena.",
                contentType: "video_question"
              }
            ]
          }
        ]
      }
    ]
  }
];
