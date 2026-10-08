import React from 'react';
import { FingerId, KeyboardLayoutType, TypingResult } from '../types';
import { FINGER_NAMES } from '../utils/keyboardLayouts';
import { VirtualKeyboard } from './VirtualKeyboard';
import { BarChart3, TrendingUp, AlertTriangle, Play, Sparkles } from 'lucide-react';

interface AnalyticsDashboardProps {
  results: TypingResult[];
  layout: KeyboardLayoutType;
  onLaunchTargetedDrill: (drillKeys: string[]) => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  results,
  layout,
  onLaunchTargetedDrill,
}) => {
  // Aggregate stats
  const totalSessions = results.length;
  const avgWpm = totalSessions > 0 ? Math.round(results.reduce((acc, r) => acc + r.wpm, 0) / totalSessions) : 0;
  const bestWpm = totalSessions > 0 ? Math.max(...results.map((r) => r.wpm)) : 0;
  const avgAccuracy = totalSessions > 0 ? Math.round(results.reduce((acc, r) => acc + r.accuracy, 0) / totalSessions) : 100;
  const totalMinutes = totalSessions > 0 ? Math.round(results.reduce((acc, r) => acc + r.timeSpentSeconds, 0) / 60) : 0;

  // Aggregate key errors
  const keyErrorCounts: Record<string, number> = {};
  results.forEach((r) => {
    r.weakKeys.forEach((k) => {
      keyErrorCounts[k.toLowerCase()] = (keyErrorCounts[k.toLowerCase()] || 0) + 1;
    });
  });

  // Top weak keys
  const sortedWeakKeys = Object.entries(keyErrorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Simulated heatmap error percentages for the virtual keyboard
  const heatmapData: Record<string, number> = {};
  Object.entries(keyErrorCounts).forEach(([k, count]) => {
    heatmapData[k] = Math.min(25, count * 5);
  });

  // Finger stats representation
  const fingersList: { id: FingerId; label: string; accuracy: number; count: number }[] = [
    { id: 'leftPinky', label: 'Auriculaire G', accuracy: 91, count: 140 },
    { id: 'leftRing', label: 'Annulaire G', accuracy: 94, count: 210 },
    { id: 'leftMiddle', label: 'Majeur G', accuracy: 97, count: 350 },
    { id: 'leftIndex', label: 'Index G', accuracy: 98, count: 480 },
    { id: 'leftThumb', label: 'Pouces', accuracy: 99, count: 520 },
    { id: 'rightIndex', label: 'Index D', accuracy: 97, count: 470 },
    { id: 'rightMiddle', label: 'Majeur D', accuracy: 96, count: 340 },
    { id: 'rightRing', label: 'Annulaire D', accuracy: 93, count: 200 },
    { id: 'rightPinky', label: 'Auriculaire D', accuracy: 89, count: 130 },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-400" />
          Statistiques & Analyse des Erreurs
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Visualisez vos progrès, la carte thermique de vos touches et la précision par doigt.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Vitesse Moyenne</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-mono mt-1 tabular-nums">
            {avgWpm} WPM
          </p>
          <span className="text-[10px] text-slate-500">Record : {bestWpm} WPM</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Précision Moyenne</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono mt-1 tabular-nums">
            {avgAccuracy}%
          </p>
          <span className="text-[10px] text-slate-500">Sans faute</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Temps Pratiqué</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-200 font-mono mt-1 tabular-nums">
            {totalMinutes} min
          </p>
          <span className="text-[10px] text-slate-500">{totalSessions} sessions</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Touches Vulnérables</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono mt-1 tabular-nums">
            {sortedWeakKeys.length}
          </p>
          <span className="text-[10px] text-slate-500">identifiées</span>
        </div>
      </div>

      {/* Keyboard Heatmap Section */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-white">Carte Thermique du Clavier (Heatmap)</h3>
            <p className="text-xs text-slate-400">
              Touches colorées selon le taux d'erreur : vert (excellent), jaune (moyen), rouge (à travailler).
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> &lt; 5%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> 5-15%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> &gt; 15%
            </span>
          </div>
        </div>

        <VirtualKeyboard
          layout={layout}
          nextChar={null}
          heatMapData={heatmapData}
          showFingerColors={false}
        />
      </div>

      {/* Targeted Weak Keys Drill Launcher */}
      {sortedWeakKeys.length > 0 && (
        <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Exercice Recommandé sur vos Touches Faibles</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Touches ciblées :{' '}
                {sortedWeakKeys.map(([k, c]) => (
                  <strong key={k} className="text-indigo-300 font-mono uppercase mr-2">
                    {k} ({c} err)
                  </strong>
                ))}
              </p>
            </div>
          </div>
          <button
            onClick={() => onLaunchTargetedDrill(sortedWeakKeys.map(([k]) => k))}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all shrink-0"
          >
            <Play className="w-3.5 h-3.5" />
            Lancer l'entraînement ciblé
          </button>
        </div>
      )}

      {/* 10-Finger Precision Breakdown */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 mb-8">
        <h3 className="text-base font-semibold text-white mb-1">Précision par Doigt</h3>
        <p className="text-xs text-slate-400 mb-4">
          Surveillez la faiblesse naturelle des auriculaires pour équilibrer la force de frappe.
        </p>

        <div className="space-y-3">
          {fingersList.map((f) => (
            <div key={f.id} className="flex items-center gap-3">
              <span className="w-28 text-xs text-slate-300 truncate font-medium">{f.label}</span>
              <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    f.accuracy >= 95 ? 'bg-emerald-500' : f.accuracy >= 90 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${f.accuracy}%` }}
                />
              </div>
              <span className="w-10 text-right text-xs font-mono font-bold text-slate-200 tabular-nums">
                {f.accuracy}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent History Table */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <h3 className="text-base font-semibold text-white mb-4">Historique des Sessions Récentes</h3>
        {results.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            Aucun historique enregistré pour l'instant. Terminez un cours ou un test de vitesse !
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Exercice</th>
                  <th className="pb-2 font-medium">Mode</th>
                  <th className="pb-2 font-medium">Vitesse</th>
                  <th className="pb-2 font-medium">Précision</th>
                  <th className="pb-2 font-medium">Durée</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {results.slice(-8).reverse().map((r) => (
                  <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 text-slate-400 font-sans">{r.date}</td>
                    <td className="py-2.5 text-white font-sans font-medium">{r.title}</td>
                    <td className="py-2.5 text-indigo-300 font-sans">{r.mode}</td>
                    <td className="py-2.5 text-indigo-400 font-bold tabular-nums">{r.wpm} WPM</td>
                    <td className="py-2.5 text-emerald-400 font-bold tabular-nums">{r.accuracy}%</td>
                    <td className="py-2.5 text-slate-400 tabular-nums">{r.timeSpentSeconds}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
