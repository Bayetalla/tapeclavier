import React, { useState } from 'react';
import { Bot, Loader2, Sparkles, Target, Zap, ArrowRight } from 'lucide-react';
import { TypingResult } from '../types';

interface AICoachPanelProps {
  recentResults: TypingResult[];
  onStartCoachDrill: (text: string, title: string) => void;
}

export const AICoachPanel: React.FC<AICoachPanelProps> = ({
  recentResults,
  onStartCoachDrill,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [coachData, setCoachData] = useState<{
    diagnosis: string;
    actionPlan: string;
    recommendedDrillKeys?: string[];
    customExerciseText?: string;
  } | null>(null);

  // Derive basic stats
  const lastResult = recentResults[recentResults.length - 1] || null;
  const currentWpm = lastResult?.wpm || 38;
  const currentAcc = lastResult?.accuracy || 92;
  const weakKeys = lastResult?.weakKeys || ['r', 't', 'e'];

  const handleConsultCoach = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/gemini/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wpm: currentWpm,
          accuracy: currentAcc,
          weakKeys,
          history: recentResults.slice(-5),
        }),
      });

      const data = await response.json();
      setCoachData(data);
    } catch {
      setCoachData({
        diagnosis: `Bonne cadence à ${currentWpm} WPM avec ${currentAcc}% de précision.`,
        actionPlan: 'Focalise-toi sur la fluidité des index pour éviter les hésitations.',
        customExerciseText: 'les dix doigts s\'alignent sur la ligne centrale pour une vitesse constante et souple',
        recommendedDrillKeys: ['r', 't', 'f', 'j'],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Bot className="w-6 h-6 text-indigo-400" />
            Coach Dactylographique IA
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Diagnostic personnalisé en temps réel et recommandations neuromotrices adaptatives.
          </p>
        </div>

        <button
          onClick={handleConsultCoach}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all shrink-0"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Analyser mes performances
        </button>
      </div>

      {/* Main Coach Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {!coachData ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto mb-4">
              <Bot className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Prêt pour votre bilan personnalisé</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6">
              Le coach IA analyse votre vitesse, votre précision, vos touches faibles et le rythme de vos doigts pour composer votre plan d'entraînement idéal.
            </p>
            <button
              onClick={handleConsultCoach}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
            >
              Lancer le bilan IA
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {/* Diagnosis */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 block mb-1">
                Diagnostic Moteur
              </span>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
                {coachData.diagnosis}
              </p>
            </div>

            {/* Action Plan */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 block mb-1">
                Plan d'action du jour
              </span>
              <p className="text-sm text-slate-200 leading-relaxed font-sans">
                {coachData.actionPlan}
              </p>
            </div>

            {/* Recommended Drill keys */}
            {coachData.recommendedDrillKeys && coachData.recommendedDrillKeys.length > 0 && (
              <div>
                <span className="text-xs text-slate-400 block mb-2">Touches cibles identifiées :</span>
                <div className="flex gap-2">
                  {coachData.recommendedDrillKeys.map((k) => (
                    <span
                      key={k}
                      className="px-3 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 font-mono font-bold text-sm uppercase shadow-sm"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Start generated custom drill */}
            {coachData.customExerciseText && (
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-white block">
                    Exercice sur-mesure préparé par le coach
                  </span>
                  <p className="text-xs text-slate-400 truncate max-w-md font-mono mt-0.5">
                    "{coachData.customExerciseText}"
                  </p>
                </div>
                <button
                  onClick={() =>
                    onStartCoachDrill(
                      coachData.customExerciseText || 'exercice coach',
                      'Entraînement Recommandé par le Coach IA'
                    )
                  }
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all shrink-0"
                >
                  <Target className="w-4 h-4" />
                  Pratiquer cet exercice
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
