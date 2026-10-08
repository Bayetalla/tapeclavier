import React from 'react';
import { KeyboardLayoutType, UserProfile } from '../types';
import { Flame, Sparkles, User, Settings } from 'lucide-react';

export type MainViewTab =
  | 'landing'
  | 'course'
  | 'practice'
  | 'games'
  | 'speedtest'
  | 'stats'
  | 'coach'
  | 'teacher';

interface TopBarProps {
  currentTab: MainViewTab;
  onSelectTab: (tab: MainViewTab) => void;
  profile: UserProfile;
  layout: KeyboardLayoutType;
  onChangeLayout: (l: KeyboardLayoutType) => void;
  onOpenSpeedTest: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  onSelectTab,
  profile,
  layout,
  onChangeLayout,
  onOpenSpeedTest,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between select-none">
      {/* Zone 1: Single text element wordmark in display face */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onSelectTab('landing')}
          className="text-lg font-bold tracking-tight text-white hover:text-indigo-400 transition-colors font-display"
        >
          DactyloPro
        </button>

        {/* Keyboard layout pill switch */}
        <div className="hidden lg:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
          {(['azerty', 'qwerty', 'qwertz'] as KeyboardLayoutType[]).map((l) => (
            <button
              key={l}
              onClick={() => onChangeLayout(l)}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase transition-colors ${
                layout === l ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Zone 2: 4–6 text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
        <button
          onClick={() => onSelectTab('course')}
          className={`hover:text-white transition-colors ${
            currentTab === 'course' ? 'text-indigo-400 font-semibold' : ''
          }`}
        >
          Cours (10 Niveaux)
        </button>
        <button
          onClick={() => onSelectTab('practice')}
          className={`hover:text-white transition-colors ${
            currentTab === 'practice' ? 'text-indigo-400 font-semibold' : ''
          }`}
        >
          Exercices & Textes
        </button>
        <button
          onClick={() => onSelectTab('games')}
          className={`hover:text-white transition-colors ${
            currentTab === 'games' ? 'text-indigo-400 font-semibold' : ''
          }`}
        >
          Jeux
        </button>
        <button
          onClick={() => onSelectTab('coach')}
          className={`hover:text-white transition-colors ${
            currentTab === 'coach' ? 'text-indigo-400 font-semibold' : ''
          }`}
        >
          Coach IA
        </button>
        <button
          onClick={() => onSelectTab('stats')}
          className={`hover:text-white transition-colors ${
            currentTab === 'stats' ? 'text-indigo-400 font-semibold' : ''
          }`}
        >
          Statistiques
        </button>
        <button
          onClick={() => onSelectTab('teacher')}
          className={`hover:text-white transition-colors ${
            currentTab === 'teacher' ? 'text-indigo-400 font-semibold' : ''
          }`}
        >
          Classes & Devoirs
        </button>
      </nav>

      {/* Zone 3: 1–2 primary actions */}
      <div className="flex items-center gap-3">
        {/* Streak indicator */}
        <div
          title={`${profile.streakDays} jours de pratique consécutifs !`}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold"
        >
          <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
          <span>{profile.streakDays}j</span>
        </div>

        {/* Speed Test CTA button */}
        <button
          onClick={onOpenSpeedTest}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-all whitespace-nowrap"
        >
          Test de Vitesse
        </button>
      </div>
    </header>
  );
};
