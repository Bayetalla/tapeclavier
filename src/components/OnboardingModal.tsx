import React, { useState } from 'react';
import { KeyboardLayoutType } from '../types';
import { Sparkles, Check, ArrowRight, Keyboard, Target, Clock, Compass, X } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onComplete: (data: {
    level: string;
    goal: string[];
    dailyMinutes: number;
    layout: KeyboardLayoutType;
  }) => void;
  initialLayout: KeyboardLayoutType;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  initialLayout,
}) => {
  const [step, setStep] = useState<number>(1);
  const [level, setLevel] = useState<string>('Débutant');
  const [goals, setGoals] = useState<string[]>(['Productivité', 'Programmation']);
  const [dailyMinutes, setDailyMinutes] = useState<number>(15);
  const [layout, setLayout] = useState<KeyboardLayoutType>(initialLayout);

  if (!isOpen) return null;

  const toggleGoal = (g: string) => {
    setGoals((prev) => (prev.includes(g) ? prev.filter((item) => item !== g) : [...prev, g]));
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      onComplete({ level, goal: goals, dailyMinutes, layout });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        {/* Progress step bars */}
        <div className="flex gap-1.5 mb-6">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                s <= step ? 'bg-indigo-500' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Level */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <span className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">
              Étape 1 sur 5
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Quel est ton niveau actuel en dactylographie ?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Nous calibrons les leçons initiales pour que vous ne perdiez pas de temps.
            </p>

            <div className="space-y-2.5 pt-2">
              {[
                { id: 'Débutant complet', desc: 'Je regarde constamment mon clavier et tape avec 2 ou 3 doigts.' },
                { id: 'Débutant', desc: 'Je connais vaguement les touches mais je fais beaucoup d\'erreurs.' },
                { id: 'Intermédiaire', desc: 'Je tape à une vitesse correcte mais sans utiliser tous mes 10 doigts.' },
                { id: 'Avancé', desc: 'Je tape sans regarder mais je veux dépasser 70 WPM et maîtriser le code.' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setLevel(item.id)}
                  className={`w-full p-3.5 rounded-2xl text-left border transition-all flex items-center justify-between ${
                    level === item.id
                      ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <h4 className="text-sm font-semibold">{item.id}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                  {level === item.id && <Check className="w-5 h-5 text-indigo-400 shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Current speed */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <span className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">
              Étape 2 sur 5
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Quelle est votre vitesse approximative estimée ?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Pas d'inquiétude, vous pourrez passer un test de vitesse précis à tout moment.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { title: '< 20 WPM', sub: 'Rythme débutant' },
                { title: '20 - 40 WPM', sub: 'Cadence bureautique standard' },
                { title: '40 - 65 WPM', sub: 'Frappe fluide et rapide' },
                { title: '65+ WPM', sub: 'Vitesse professionnelle' },
              ].map((s) => (
                <div
                  key={s.title}
                  className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 text-center hover:border-indigo-500 transition-colors"
                >
                  <span className="text-lg font-bold text-indigo-400 font-mono">{s.title}</span>
                  <p className="text-xs text-slate-400 mt-1">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Motivation / Goals */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <span className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">
              Étape 3 sur 5
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Pourquoi souhaitez-vous apprendre ?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Sélectionnez un ou plusieurs objectifs pour adapter vos exercices.
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              {[
                'Productivité au travail',
                'Programmation & Code',
                'Études & Rédaction',
                'Gaming & Réactivité',
                'Concours administratifs',
                'Confort physique & Ergonomie',
              ].map((g) => {
                const active = goals.includes(g);
                return (
                  <button
                    key={g}
                    onClick={() => toggleGoal(g)}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                      active
                        ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-sm'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Daily commitment */}
        {step === 4 && (
          <div className="space-y-4 animate-fade-in">
            <span className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">
              Étape 4 sur 5
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Combien de temps souhaitez-vous vous entraîner ?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              La régularité quotidienne prime sur la durée d'une seule session.
            </p>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 pt-2">
              {[5, 10, 15, 20, 30].map((m) => (
                <button
                  key={m}
                  onClick={() => setDailyMinutes(m)}
                  className={`p-3.5 rounded-2xl border text-center transition-all ${
                    dailyMinutes === m
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xl font-bold font-mono">{m}</span>
                  <span className="text-[10px] block text-slate-300">min/jour</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Layout selector */}
        {step === 5 && (
          <div className="space-y-4 animate-fade-in">
            <span className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">
              Étape 5 sur 5
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Quel type de clavier utilisez-vous ?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              La disposition physique détermine le positionnement exact de vos 10 doigts.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { id: 'azerty', label: 'AZERTY', desc: 'France, Belgique' },
                { id: 'qwerty', label: 'QWERTY', desc: 'États-Unis, UK, Monde' },
                { id: 'qwertz', label: 'QWERTZ', desc: 'Allemagne, Suisse' },
              ].map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLayout(l.id as KeyboardLayoutType)}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    layout === l.id
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-base font-bold font-mono">{l.label}</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">{l.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Next / Finish button */}
        <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-800">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Précédent
            </button>
          ) : <div />}

          <button
            onClick={handleNext}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
          >
            {step < 5 ? (
              <>
                Suivant <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              'Créer mon plan personnalisé'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
