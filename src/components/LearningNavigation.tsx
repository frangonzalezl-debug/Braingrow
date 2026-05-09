import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AppIcon } from "./AppIcon";
import { 
  playTap, 
  playSelect, 
  playOpen, 
  playCorrect, 
  playWrong, 
  playComplete 
} from "../lib/soundEngine";
import { UserProfile, WorldId } from "../types";
import { 
  Course, 
  CourseModule, 
  Lesson, 
  LessonActivity, 
  Question 
} from "../types/learning";
import { 
  getWorldByKey, 
  getStrandsByWorld 
} from "../data/worldTaxonomy";
import { 
  getPrimaryAdaptationForUser 
} from "../data/cognitiveAdaptations";
import { 
  getCoursesForWorld, 
  getCourseById,
  getModuleById,
  getLessonById,
  getActivityById,
  getNextActivity,
  getNextLesson
} from "../logic/courseEngine";

/**
 * --- WORLD DETAIL VIEW ---
 */
export const WorldDetailView: React.FC<{
  userProfile: UserProfile;
  worldKey: WorldId;
  onBack: () => void;
  onSelectCourse: (courseId: string) => void;
}> = ({ userProfile, worldKey, onBack, onSelectCourse }) => {
  const world = getWorldByKey(worldKey);
  const adaptation = getPrimaryAdaptationForUser(userProfile, worldKey);
  const strands = getStrandsByWorld(worldKey);
  const recommendedCourses = getCoursesForWorld(userProfile, worldKey);

  if (!world) return null;

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      <div className="p-6 bg-white border-b border-slate-100 sticky top-0 z-10 flex items-center gap-4">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-slate-50 text-slate-400">
          <AppIcon name="chevronLeft" size={24} />
        </button>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{world.icon}</span>
          <h2 className="text-xl font-bold text-slate-800">{world.label}</h2>
        </div>
      </div>

      <div className="p-6 space-y-8 pb-24">
        {/* Adaptation Focus */}
        <div className="bg-primary/5 border border-primary/10 p-6 rounded-3xl space-y-3">
          <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-widest">
            <AppIcon name="zap" size={14} />
            Enfoque de Hoy
          </div>
          <h3 className="text-2xl font-black text-slate-900 leading-tight">
            {adaptation.title}
          </h3>
          <p className="text-slate-600 leading-relaxed font-medium italic">
            "{adaptation.description}"
          </p>
        </div>

        {/* Strands */}
        <div className="space-y-4">
          <h4 className="text-slate-400 font-bold uppercase text-xs tracking-widest px-1">Temas de {world.label}</h4>
          <div className="grid grid-cols-1 gap-3">
            {strands.map(strand => (
              <div key={strand.key} className="bg-white p-4 rounded-2xl border border-slate-100 flex gap-4 items-start">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <div>
                  <h5 className="font-bold text-slate-800">{strand.label}</h5>
                  <p className="text-sm text-slate-500 leading-relaxed">{strand.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Courses */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-slate-400 font-bold uppercase text-xs tracking-widest">Cursos Disponibles</h4>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {recommendedCourses.map(course => (
              <button
                key={course.id}
                onClick={() => { playOpen(); onSelectCourse(course.id); }}
                className="bg-white p-5 rounded-3xl border border-slate-100 text-left hover:shadow-xl hover:border-primary/20 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl group-hover:bg-primary/10 transition-colors">
                    {course.coverEmoji}
                  </div>
                  <div className="flex gap-2">
                    <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                      {course.estimatedMinutes} min
                    </span>
                    <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                      NV. {course.difficulty}
                    </span>
                  </div>
                </div>
                <h5 className="text-lg font-black text-slate-900 group-hover:text-primary transition-colors">{course.title}</h5>
                <p className="text-sm text-slate-500 line-clamp-2 mt-1">{course.subtitle}</p>
              </button>
            ))}
            {recommendedCourses.length === 0 && (
              <div className="text-center py-12 text-slate-400 italic">
                Aún no hay cursos para este nivel.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * --- COURSE DETAIL VIEW ---
 */
export const CourseDetailView: React.FC<{
  courseId: string;
  onBack: () => void;
  onSelectModule: (moduleId: string) => void;
}> = ({ courseId, onBack, onSelectModule }) => {
  const course = getCourseById(courseId);

  if (!course) return null;

  return (
    <div className="flex flex-col min-h-full bg-white">
      <div className="p-6 flex items-center gap-4">
        <button onClick={() => { playTap(); onBack(); }} className="p-2 rounded-xl hover:bg-slate-50 text-slate-400">
          <AppIcon name="chevronLeft" size={24} />
        </button>
        <h2 className="text-xl font-bold text-slate-800">Detalle del Curso</h2>
      </div>

      <div className="p-6 space-y-8 pb-24 max-w-2xl mx-auto w-full">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 rounded-[2.5rem] bg-primary/10 flex items-center justify-center text-5xl mx-auto shadow-inner border border-primary/5">
            {course.coverEmoji}
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{course.title}</h1>
            <p className="text-lg font-medium text-slate-500 italic">{course.subtitle}</p>
          </div>
          <div className="flex items-center justify-center gap-6">
            <div className="flex flex-col items-center">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Duración</span>
              <span className="font-bold text-slate-700 flex items-center gap-1"><AppIcon name="clock" size={14}/> {course.estimatedMinutes}m</span>
            </div>
            <div className="w-px h-6 bg-slate-100" />
            <div className="flex flex-col items-center">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Nivel</span>
              <span className="font-bold text-slate-700 flex items-center gap-1"><AppIcon name="star" size={14}/> {course.difficulty}</span>
            </div>
            <div className="w-px h-6 bg-slate-100" />
            <div className="flex flex-col items-center">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Módulos</span>
              <span className="font-bold text-slate-700 flex items-center gap-1"><AppIcon name="bookOpen" size={14}/> {course.modules.length}</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <p className="text-slate-600 text-center leading-relaxed">
                {course.description}
            </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-slate-400 font-bold uppercase text-xs tracking-widest px-1">Plan de Entrenamiento</h4>
          <div className="space-y-3">
            {course.modules.map((module, idx) => (
              <button
                key={module.id}
                onClick={() => { playOpen(); onSelectModule(module.id); }}
                className="w-full p-6 rounded-3xl border border-slate-100 bg-white flex items-center justify-between group hover:border-primary hover:shadow-xl transition-all"
              >
                <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center font-black text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors">
                        {idx + 1}
                    </div>
                    <div className="text-left">
                        <h5 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{module.title}</h5>
                        <p className="text-xs text-slate-400">{module.lessons.length} lecciones disponibles</p>
                    </div>
                </div>
                <AppIcon name="arrowRight" size={20} className="text-slate-300 group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * --- MODULE DETAIL VIEW ---
 */
export const ModuleDetailView: React.FC<{
  courseId: string;
  moduleId: string;
  onBack: () => void;
  onSelectLesson: (lessonId: string) => void;
}> = ({ courseId, moduleId, onBack, onSelectLesson }) => {
  const module = getModuleById(courseId, moduleId);

  if (!module) return null;

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      <div className="p-6 bg-white border-b border-slate-100 sticky top-0 z-10 flex items-center gap-4">
        <button onClick={() => { playTap(); onBack(); }} className="p-2 rounded-xl hover:bg-slate-50 text-slate-400">
          <AppIcon name="chevronLeft" size={24} />
        </button>
        <h2 className="text-xl font-bold text-slate-800">{module.title}</h2>
      </div>

      <div className="p-6 space-y-4 pb-24 max-w-xl mx-auto w-full">
        {module.subtitle && <p className="text-slate-500 font-medium italic px-2">{module.subtitle}</p>}
        
        <div className="space-y-3">
            {module.lessons.map((lesson, idx) => (
                <button
                    key={lesson.id}
                    onClick={() => { playOpen(); onSelectLesson(lesson.id); }}
                    className="w-full bg-white p-5 rounded-3xl border border-slate-100 flex items-center gap-4 text-left group hover:shadow-md transition-all"
                >
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 font-black">
                        {idx + 1}
                    </div>
                    <div className="flex-1">
                        <h5 className="font-bold text-slate-800 group-hover:text-primary transition-colors">{lesson.title}</h5>
                        <p className="text-xs text-slate-400">{lesson.activities.length} actividades</p>
                    </div>
                    <AnimatePresence>
                        <div className="w-8 h-8 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-100 group-hover:border-primary/20 group-hover:text-primary/20">
                            <AppIcon name="play" size={14} fill="currentColor" />
                        </div>
                    </AnimatePresence>
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

/**
 * --- LESSON DETAIL VIEW ---
 */
export const LessonDetailView: React.FC<{
  courseId: string;
  moduleId: string;
  lessonId: string;
  onBack: () => void;
  onSelectActivity: (activityId: string) => void;
}> = ({ courseId, moduleId, lessonId, onBack, onSelectActivity }) => {
  const lesson = getLessonById(courseId, moduleId, lessonId);

  if (!lesson) return null;

  return (
    <div className="flex flex-col min-h-full bg-white">
      <div className="p-6 sticky top-0 z-10 flex items-center gap-4 bg-white/80 backdrop-blur-md">
        <button onClick={() => { playTap(); onBack(); }} className="p-2 rounded-xl hover:bg-slate-50 text-slate-400">
          <AppIcon name="chevronLeft" size={24} />
        </button>
        <h2 className="text-xl font-bold text-slate-800">Contenido</h2>
      </div>

      <div className="p-6 space-y-6 pb-24 max-w-xl mx-auto w-full">
        <div className="space-y-1 px-2">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{lesson.title}</h1>
            {lesson.subtitle && <p className="text-slate-500">{lesson.subtitle}</p>}
        </div>

        <div className="space-y-4">
            {lesson.activities.map((activity, idx) => (
                <button
                    key={activity.id}
                    onClick={() => { playOpen(); onSelectActivity(activity.id); }}
                    className="w-full bg-slate-50 p-6 rounded-[2rem] border-2 border-transparent hover:border-primary hover:bg-white hover:shadow-xl transition-all text-left flex gap-5 group"
                >
                    <div className="w-14 h-14 rounded-3xl bg-white shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        {activity.contentType === "breathing_pause" ? "🧘" : 
                         activity.contentType === "video_question" ? "🎞️" :
                         activity.contentType === "mini_game" ? "🎮" : "🧩"}
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Actividad {idx + 1}</span>
                        <h5 className="font-bold text-lg text-slate-800 leading-tight">{activity.title}</h5>
                        <p className="text-sm text-slate-500">{activity.prompt}</p>
                    </div>
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

/**
 * --- ACTIVITY PLAYER VIEW ---
 */
export const ActivityPlayerView: React.FC<{
  courseId: string;
  moduleId: string;
  lessonId: string;
  activityId: string;
  onBack: () => void;
  onComplete: () => void;
}> = ({ courseId, moduleId, lessonId, activityId, onBack, onComplete }) => {
  const activity = getActivityById(courseId, moduleId, lessonId, activityId);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "none", message: string }>({ type: "none", message: "" });
  const [isCompleted, setIsCompleted] = useState(false);
  const [waitProgress, setWaitProgress] = useState(0);
  const [canAnswer, setCanAnswer] = useState(true);

  const currentQuestion = activity?.questions?.[currentQuestionIdx];

  useEffect(() => {
    if (currentQuestion?.type === "wait_before_answer" && currentQuestion.minWaitSeconds) {
      setCanAnswer(false);
      setWaitProgress(0);
      const waitTime = currentQuestion.minWaitSeconds * 1000;
      const interval = 100;
      let elapsed = 0;

      const timer = setInterval(() => {
        elapsed += interval;
        setWaitProgress(Math.min((elapsed / waitTime) * 100, 100));
        if (elapsed >= waitTime) {
          clearInterval(timer);
          setCanAnswer(true);
        }
      }, interval);

      return () => clearInterval(timer);
    } else {
      setCanAnswer(true);
      setWaitProgress(100);
    }
  }, [currentQuestionIdx, currentQuestion]);

  if (!activity) return null;

  const handleAnswer = (answer: string) => {
    if (!currentQuestion || !canAnswer) return;

    const isCorrect = Array.isArray(currentQuestion.correctAnswer) 
      ? currentQuestion.correctAnswer.includes(answer)
      : currentQuestion.correctAnswer === answer || currentQuestion.type === "open_reflection" || currentQuestion.type === "prediction";

    if (isCorrect) {
      if (currentQuestion.type === "open_reflection" || currentQuestion.type === "prediction") {
        playSelect();
      } else {
        playCorrect();
      }
      
      setFeedback({ 
        type: "success", 
        message: currentQuestion.type === "open_reflection" ? "¡Buena idea! Pensar también es entrenar. ✨" : "¡Correcto! ¡Lo lograste! 🌟" 
      });
      
      setTimeout(() => {
        setFeedback({ type: "none", message: "" });
        if (activity.questions && currentQuestionIdx < activity.questions.length - 1) {
          setCurrentQuestionIdx(prev => prev + 1);
        } else {
          playComplete();
          setIsCompleted(true);
        }
      }, 2000);
    } else {
      playWrong();
      setFeedback({ 
        type: "error", 
        message: currentQuestion.explanation || "Intenta otra vez, ¡tú puedes! 💪" 
      });
      setTimeout(() => {
        setFeedback({ type: "none", message: "" });
      }, 2000);
    }
  };

  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full bg-white p-6 text-center space-y-8">
        <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center text-primary"
        >
            <AppIcon name="checkCircle" size={64} />
        </motion.div>
        
        <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">¡Misión Cumplida!</h2>
            <p className="text-xl text-slate-500 font-medium italic">Tu mente acaba de subir de nivel.</p>
        </div>

        <div className="w-full max-w-xs space-y-3">
            <button
                onClick={onComplete}
                className="w-full bg-primary text-white font-black py-5 rounded-[2rem] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
                Continuar <AppIcon name="arrowRight" size={20} />
            </button>
        </div>

        <p className="text-slate-400 text-xs mt-4">
            Esta navegación es funcional/mock. El progreso se guardará en Firestore próximamente.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-slate-50 relative">
      <div className="p-6 bg-white flex items-center justify-between border-b border-slate-100">
        <button onClick={() => { playTap(); onBack(); }} className="p-2 rounded-xl hover:bg-slate-50 text-slate-400">
          <AppIcon name="chevronLeft" size={24} />
        </button>
        <div className="flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Actividad</span>
            <span className="font-bold text-slate-700">{activity.title}</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-black text-slate-400">
            {activity.questions ? `${currentQuestionIdx + 1}/${activity.questions.length}` : "1/1"}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
        {/* Intro */}
        <div className="space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-white shadow-sm flex items-center justify-center text-3xl mx-auto">
                {activity.contentType === "breathing_pause" ? "🧘" : "🎮"}
            </div>
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 text-center shadow-lg shadow-slate-100/50">
                <p className="text-xl font-bold text-slate-800 leading-relaxed italic">
                    "{activity.prompt}"
                </p>
            </div>
        </div>

        {/* Question Area */}
        {currentQuestion && (
            <div className="space-y-6">
                <div className="flex gap-3 items-start bg-slate-100 p-4 rounded-3xl">
                    <AppIcon name="messageCircle" size={20} className="text-slate-400 shrink-0 mt-1" />
                    <h3 className="text-lg font-bold text-slate-700 leading-tight">{currentQuestion.question}</h3>
                </div>

                {currentQuestion.type === "wait_before_answer" && !canAnswer && (
                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Espera la señal...</span>
                            <span className="text-xs font-bold text-primary">{Math.round(waitProgress)}%</span>
                        </div>
                        <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                            <motion.div 
                                className="h-full bg-primary"
                                initial={{ width: 0 }}
                                animate={{ width: `${waitProgress}%` }}
                            />
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-3">
                    {currentQuestion.type === "multiple_choice" || currentQuestion.type === "prediction" ? (
                        (currentQuestion.options || ["Opción A", "Opción B", "Opción C"]).map((opt, idx) => (
                            <button
                                key={idx}
                                disabled={!canAnswer || feedback.type !== "none"}
                                onClick={() => handleAnswer(opt)}
                                className={`p-5 rounded-[1.5rem] border-2 font-bold text-lg text-left transition-all ${
                                    !canAnswer 
                                    ? "bg-slate-50 border-slate-100 text-slate-300 opacity-50" 
                                    : "bg-white border-slate-100 text-slate-700 hover:border-primary active:scale-95"
                                }`}
                            >
                                {opt}
                            </button>
                        ))
                    ) : currentQuestion.type === "wait_before_answer" ? (
                        <button
                            disabled={!canAnswer || feedback.type !== "none"}
                            onClick={() => handleAnswer("done")}
                            className={`p-5 rounded-[1.5rem] border-2 font-bold text-lg text-center transition-all ${
                                !canAnswer 
                                ? "bg-slate-50 border-slate-100 text-slate-300 opacity-50" 
                                : "bg-primary text-white border-primary shadow-lg shadow-primary/20 active:scale-95"
                            }`}
                        >
                            {canAnswer ? "¡Ahora responde!" : "Espera..."}
                        </button>
                    ) : (
                        <div className="space-y-3">
                            <textarea 
                                className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-primary outline-none text-slate-700 font-medium"
                                placeholder="Escribe tu respuesta aquí..."
                                rows={4}
                            />
                            <button
                                onClick={() => handleAnswer("done")}
                                className="w-full bg-primary text-white font-black py-4 rounded-2xl shadow-lg"
                            >
                                Listo
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* No questions activity */}
        {!currentQuestion && (
             <div className="flex justify-center">
                <button
                    onClick={() => { playComplete(); setIsCompleted(true); }}
                    className="bg-primary text-white font-black py-5 px-12 rounded-[2rem] shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all flex items-center gap-2"
                >
                    Hecho <AppIcon name="arrowRight" size={20} />
                </button>
             </div>
        )}
      </div>

      {/* Feedback Overlay */}
      <AnimatePresence>
        {feedback.type !== "none" && (
            <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className={`absolute bottom-6 left-6 right-6 p-6 rounded-[2rem] border-2 z-50 flex items-center gap-4 shadow-2xl ${
                    feedback.type === "success" ? "bg-emerald-50 border-emerald-100 text-emerald-800" : "bg-red-50 border-red-100 text-red-800"
                }`}
            >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    feedback.type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                }`}>
                    {feedback.type === "success" ? <AppIcon name="checkCircle" size={24} /> : <AppIcon name="zap" size={24} />}
                </div>
                <p className="font-bold text-lg leading-tight">{feedback.message}</p>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
