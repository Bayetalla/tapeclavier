import React, { useState, useEffect } from 'react';
import {
  KeyboardLayoutType,
  SwitchSoundType,
  TypingResult,
  UserProfile,
  LessonLevel,
  LessonStep,
} from './types';
import { COURSE_LEVELS } from './data/courseData';
import { PRACTICE_CATEGORIES } from './data/practiceTexts';
import { generateWeakKeyDrill } from './utils/adaptiveEngine';
import { TopBar, MainViewTab } from './components/TopBar';
import { LandingPage } from './components/LandingPage';
import { TypingEngine } from './components/TypingEngine';
import { SpeedTestModal } from './components/SpeedTestModal';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { GamesHub } from './components/GamesHub';
import { AICoachPanel } from './components/AICoachPanel';
import { TeacherStudentPortal } from './components/TeacherStudentPortal';
import { CustomTextModal } from './components/CustomTextModal';
import { OnboardingModal } from './components/OnboardingModal';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Code2,
  FileText,
  Flame,
  Hash,
  Quote,
  Sparkles,
  Trophy,
  Zap,
} from 'lucide-react';

const INITIAL_PROFILE: UserProfile = {
  name: 'Apprenant Dactylo',
  avatar: '👤',
  levelTitle: 'Niveau 1 — Ligne de repos',
  animalRank: 'hare',
  xp: 120,
  streakDays: 3,
  lastPracticeDate: new Date().toISOString(),
  preferredLayout: 'azerty',
  preferredSound: 'cherry-blue',
  theme: 'slate',
  dailyGoalMinutes: 15,
  todayPracticeMinutes: 8,
  targetWpm: 50,
  firstTryAccuracyMode: true,
  showHands: true,
  showKeyboard: true,
  soundEnabled: true,
};

export default function App() {
  // App Navigation
  const [currentTab, setCurrentTab] = useState<MainViewTab>('landing');

  // User Profile & Settings
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('dactylo_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  // History & Results
  const [historyResults, setHistoryResults] = useState<TypingResult[]>(() => {
    const saved = localStorage.getItem('dactylo_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [
      {
        id: 'init-1',
        date: 'Hier',
        wpm: 42,
        cpm: 210,
        accuracy: 94,
        firstTryAccuracy: 92,
        errorCount: 4,
        timeSpentSeconds: 60,
        mode: 'Course',
        title: 'Niveau 1 — Ligne de repos',
        weakKeys: ['r', 't'],
      },
      {
        id: 'init-2',
        date: 'Aujourd\'hui',
        wpm: 47,
        cpm: 235,
        accuracy: 96,
        firstTryAccuracy: 95,
        errorCount: 2,
        timeSpentSeconds: 90,
        mode: 'Course',
        title: 'Niveau 2 — Rangée supérieure',
        weakKeys: ['p', 'o'],
      },
    ];
  });

  // Active Typing Session state (when inside Course or Practice)
  const [activeSession, setActiveSession] = useState<{
    text: string;
    title: string;
    modeName: string;
  } | null>(null);

  // Modals state
  const [isSpeedTestOpen, setIsSpeedTestOpen] = useState<boolean>(false);
  const [isCustomTextOpen, setIsCustomTextOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);

  // Selected Level / Step in Course view
  const [selectedLevel, setSelectedLevel] = useState<LessonLevel>(COURSE_LEVELS[1]);

  // Selected practice category
  const [selectedPracticeCat, setSelectedPracticeCat] = useState<string>('literature');

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('dactylo_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('dactylo_history', JSON.stringify(historyResults));
  }, [historyResults]);

  // Handle typing session complete
  const handleSessionComplete = (result: TypingResult) => {
    setHistoryResults((prev) => [...prev, result]);

    // Award XP and increment minutes
    setProfile((prev) => ({
      ...prev,
      xp: prev.xp + Math.round(result.wpm * 2 + result.accuracy),
      todayPracticeMinutes: prev.todayPracticeMinutes + Math.round(result.timeSpentSeconds / 60),
    }));
  };

  // Launch targeted drill on specific weak keys
  const handleLaunchTargetedDrill = (keys: string[]) => {
    const drillText = generateWeakKeyDrill(keys);
    setActiveSession({
      text: drillText,
      title: `Entraînement Ciblé : ${keys.slice(0, 3).join(', ').toUpperCase()}`,
      modeName: 'Adaptatif',
    });
    setCurrentTab('practice');
  };

  // Start a step from the Course
  const handleStartLessonStep = (step: LessonStep, levelTitle: string) => {
    setActiveSession({
      text: step.text,
      title: `${levelTitle} · ${step.title}`,
      modeName: 'Cours',
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Strict Top Bar Contract */}
      <TopBar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'practice' && tab !== 'course') {
            setActiveSession(null);
          }
        }}
        profile={profile}
        layout={profile.preferredLayout}
        onChangeLayout={(layout) => setProfile((p) => ({ ...p, preferredLayout: layout }))}
        onOpenSpeedTest={() => setIsSpeedTestOpen(true)}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 w-full pb-16">
        {/* 1. Landing Page */}
        {currentTab === 'landing' && (
          <LandingPage
            onStartCourse={() => {
              setCurrentTab('course');
              setSelectedLevel(COURSE_LEVELS[1]);
            }}
            onOpenSpeedTest={() => setIsSpeedTestOpen(true)}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
          />
        )}

        {/* 2. Course View (10 Levels Syllabus + Active Engine) */}
        {currentTab === 'course' && (
          <div className="w-full max-w-5xl mx-auto py-6 px-4">
            {activeSession ? (
              <div>
                <button
                  onClick={() => setActiveSession(null)}
                  className="mb-4 text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  ← Retour au programme des cours
                </button>
                <TypingEngine
                  textToType={activeSession.text}
                  title={activeSession.title}
                  modeName={activeSession.modeName}
                  layout={profile.preferredLayout}
                  soundType={profile.preferredSound}
                  onSoundChange={(s) => setProfile((p) => ({ ...p, preferredSound: s }))}
                  firstTryAccuracyMode={profile.firstTryAccuracyMode}
                  onComplete={handleSessionComplete}
                  showKeyboardInitial={profile.showKeyboard}
                  showHandsInitial={profile.showHands}
                />
              </div>
            ) : (
              <div>
                {/* Course Syllabus Overview */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
                      Parcours de Dactylographie (10 Niveaux)
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Progressez étape par étape de la ligne de repos jusqu'à l'endurance professionnelle.
                    </p>
                  </div>
                </div>

                {/* Level selection cards list */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Column: Levels 0 to 10 list */}
                  <div className="md:col-span-1 space-y-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                      Niveaux d'apprentissage
                    </span>
                    {COURSE_LEVELS.map((lvl) => (
                      <button
                        key={lvl.level}
                        onClick={() => setSelectedLevel(lvl)}
                        className={`w-full p-3.5 rounded-2xl text-left border transition-all flex items-center justify-between ${
                          selectedLevel.level === lvl.level
                            ? 'bg-indigo-950/50 border-indigo-500 text-white shadow-md'
                            : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center font-mono font-bold text-xs text-indigo-400">
                            {lvl.level}
                          </span>
                          <span className="text-xs sm:text-sm font-semibold truncate max-w-[170px]">
                            {lvl.title.replace(/Niveau \d+ — /, '')}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                      </button>
                    ))}
                  </div>

                  {/* Right Column: Selected Level Steps & Objectives */}
                  <div className="md:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800">
                    <div className="pb-4 border-b border-slate-800 mb-6">
                      <span className="text-xs text-indigo-400 font-mono font-semibold">
                        Niveau {selectedLevel.level} sur 10
                      </span>
                      <h3 className="text-xl font-bold text-white mt-0.5">{selectedLevel.title}</h3>
                      <p className="text-xs text-slate-400 mt-1">{selectedLevel.description}</p>
                    </div>

                    <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">
                      Étapes et exercices pratiques
                    </h4>

                    <div className="space-y-3">
                      {selectedLevel.steps.map((step, idx) => (
                        <div
                          key={step.id}
                          className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-indigo-500/50 transition-colors"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-indigo-400">
                                Étape {idx + 1}
                              </span>
                              <h5 className="text-sm font-semibold text-white">{step.title}</h5>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">{step.instruction}</p>
                            <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2">
                              <span>Objectif : {step.targetWpm} WPM</span>
                              <span>·</span>
                              <span>Précision : {step.targetAccuracy}%</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleStartLessonStep(step, selectedLevel.title)}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shrink-0"
                          >
                            Démarrer
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. Practice View (Categories, Code Mode, Custom Texts) */}
        {currentTab === 'practice' && (
          <div className="w-full max-w-5xl mx-auto py-6 px-4">
            {activeSession ? (
              <div>
                <button
                  onClick={() => setActiveSession(null)}
                  className="mb-4 text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  ← Retour au catalogue d'exercices
                </button>
                <TypingEngine
                  textToType={activeSession.text}
                  title={activeSession.title}
                  modeName={activeSession.modeName}
                  layout={profile.preferredLayout}
                  soundType={profile.preferredSound}
                  onSoundChange={(s) => setProfile((p) => ({ ...p, preferredSound: s }))}
                  firstTryAccuracyMode={profile.firstTryAccuracyMode}
                  onComplete={handleSessionComplete}
                  showKeyboardInitial={profile.showKeyboard}
                  showHandsInitial={profile.showHands}
                />
              </div>
            ) : (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
                      Bibliothèque d'Exercices & Textes Réels
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Littérature, programmation, chiffres, ponctuation et textes personnalisés.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCustomTextOpen(true)}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all shrink-0"
                  >
                    <Sparkles className="w-4 h-4" />
                    Importer ou Créer un texte (OCR / Actualités)
                  </button>
                </div>

                {/* Category navigation tabs */}
                <div className="flex gap-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl mb-8 overflow-x-auto">
                  {PRACTICE_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedPracticeCat(cat.id)}
                      className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                        selectedPracticeCat === cat.id
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {cat.title}
                    </button>
                  ))}
                </div>

                {/* Selected Category Items Grid */}
                {(() => {
                  const currentCategory =
                    PRACTICE_CATEGORIES.find((c) => c.id === selectedPracticeCat) ||
                    PRACTICE_CATEGORIES[0];
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentCategory.items.map((item) => (
                        <div
                          key={item.id}
                          className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-indigo-500/50 transition-all"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-mono text-indigo-400 font-semibold">
                                {item.difficulty}
                              </span>
                              <span className="text-[10px] uppercase font-bold text-slate-500">
                                {item.language || 'fr'}
                              </span>
                            </div>
                            <h4 className="text-base font-bold text-white mb-2">{item.title}</h4>
                            <p className="text-xs text-slate-400 font-mono line-clamp-3 mb-6 bg-slate-950/60 p-3 rounded-xl border border-slate-850">
                              {item.content}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              setActiveSession({
                                text: item.content,
                                title: item.title,
                                modeName: currentCategory.title,
                              })
                            }
                            className="w-full py-2 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                          >
                            Pratiquer ce texte
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* 4. Games Hub */}
        {currentTab === 'games' && (
          <GamesHub
            layout={profile.preferredLayout}
            soundType={profile.preferredSound}
            onSoundChange={(s) => setProfile((p) => ({ ...p, preferredSound: s }))}
            onAwardXp={(xp) => setProfile((p) => ({ ...p, xp: p.xp + xp }))}
          />
        )}

        {/* 5. Coach IA */}
        {currentTab === 'coach' && (
          <AICoachPanel
            recentResults={historyResults}
            onStartCoachDrill={(text, title) => {
              setActiveSession({ text, title, modeName: 'Coach IA' });
              setCurrentTab('practice');
            }}
          />
        )}

        {/* 6. Analytics & Heatmap */}
        {currentTab === 'stats' && (
          <AnalyticsDashboard
            results={historyResults}
            layout={profile.preferredLayout}
            onLaunchTargetedDrill={handleLaunchTargetedDrill}
          />
        )}

        {/* 7. Teacher / Student Portal */}
        {currentTab === 'teacher' && (
          <TeacherStudentPortal
            onStartAssignment={(text, title) => {
              setActiveSession({ text, title, modeName: 'Devoir Élève' });
              setCurrentTab('practice');
            }}
          />
        )}
      </main>

      {/* Global Modals */}
      <SpeedTestModal
        isOpen={isSpeedTestOpen}
        onClose={() => setIsSpeedTestOpen(false)}
        layout={profile.preferredLayout}
        soundType={profile.preferredSound}
        onSoundChange={(s) => setProfile((p) => ({ ...p, preferredSound: s }))}
        userName={profile.name}
      />

      <CustomTextModal
        isOpen={isCustomTextOpen}
        onClose={() => setIsCustomTextOpen(false)}
        onSelectText={(text, title) => {
          setActiveSession({ text, title, modeName: 'Personnalisé' });
          setCurrentTab('practice');
        }}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        initialLayout={profile.preferredLayout}
        onComplete={(data) => {
          setProfile((p) => ({
            ...p,
            preferredLayout: data.layout,
            dailyGoalMinutes: data.dailyMinutes,
          }));
          setIsOnboardingOpen(false);
          setCurrentTab('course');
        }}
      />
    </div>
  );
}
