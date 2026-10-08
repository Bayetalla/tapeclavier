import React, { useState } from 'react';
import { CertificateData, KeyboardLayoutType, SwitchSoundType, TypingResult } from '../types';
import { calculateCertificateTier } from '../utils/adaptiveEngine';
import { TypingEngine } from './TypingEngine';
import { Award, Check, Download, Printer, Timer, X } from 'lucide-react';

interface SpeedTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  layout: KeyboardLayoutType;
  soundType: SwitchSoundType;
  onSoundChange: (s: SwitchSoundType) => void;
  userName: string;
}

const TEST_TEXTS: Record<number, string> = {
  15: "La precision est la mere de la vitesse. Chaque doigt doit trouver sa place sans hesitation.",
  30: "Apprendre la frappe a dix doigts transforme radicalement votre productivite au quotidien. En cessant de regarder les touches, votre cerveau se concentre exclusivement sur vos idees.",
  60: "La memoire musculaire est une faculte fascinante du corps humain. Lorsque vous repetez patiemment les bons gestes sans precipitation, les circuits neuronaux s'automatisent. Bientot, les mots s'ecrivent a la meme vitesse que votre pensee. C'est la beaute et la puissance de la dactylographie.",
  120: "Depuis l'apparition des premiers claviers mecaniques jusqu'aux ecrans modernes, la communication ecrite reste le pilier fondamental de notre societe numerique. Maitriser cet outil indispensable ne represente pas seulement un gain de temps inestimable, mais egalement une source de confort physique durable.",
  300: "L'art de la frappe dactylographique repose sur une discipline millimetree. Les index s'ancrent fermement sur les reperes F et J, veritables balises de la ligne de repos. Les epaules demeurent relachees, les poignets flottent legerement sans s'affaisser contre le bureau, et le regard reste fixe sur le texte cible.",
};

export const SpeedTestModal: React.FC<SpeedTestModalProps> = ({
  isOpen,
  onClose,
  layout,
  soundType,
  onSoundChange,
  userName,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(30);
  const [certificate, setCertificate] = useState<CertificateData | null>(null);

  if (!isOpen) return null;

  const currentText = TEST_TEXTS[selectedDuration] || TEST_TEXTS[30];

  const handleTestComplete = (result: TypingResult) => {
    const tier = calculateCertificateTier(result.wpm, result.accuracy) || 'Bronze';
    setCertificate({
      tier,
      wpm: result.wpm,
      accuracy: result.accuracy,
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      userName: userName || 'Dactylographe Pro',
      durationSeconds: selectedDuration,
    });
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!certificate ? (
          <div>
            {/* Header & Duration picker */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <Timer className="w-6 h-6 text-indigo-400" />
                  Test Officiel de Vitesse
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Mesurez votre cadence réelle et débloquez votre diplôme de dactylographie certifié.
                </p>
              </div>

              {/* Duration selector tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-xl border border-slate-700/60">
                {[15, 30, 60, 120].map((dur) => (
                  <button
                    key={dur}
                    onClick={() => setSelectedDuration(dur)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      selectedDuration === dur
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {dur < 60 ? `${dur}s` : `${dur / 60}m`}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Typing Engine */}
            <TypingEngine
              key={`test-${selectedDuration}`}
              textToType={currentText}
              title={`Test Officiel · ${selectedDuration < 60 ? `${selectedDuration} secondes` : `${selectedDuration / 60} minute`}`}
              modeName="Speed Test"
              layout={layout}
              soundType={soundType}
              onSoundChange={onSoundChange}
              firstTryAccuracyMode={true}
              onComplete={handleTestComplete}
              showKeyboardInitial={true}
              showHandsInitial={false}
            />
          </div>
        ) : (
          /* Certificate View */
          <div className="flex flex-col items-center text-center p-4 sm:p-6 animate-fade-in">
            {/* Diploma Frame */}
            <div className="w-full max-w-xl p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border-2 border-indigo-500/40 shadow-2xl relative overflow-hidden mb-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                  <Award className="w-8 h-8" />
                </div>
              </div>

              <span className="text-xs uppercase tracking-widest text-indigo-400 font-semibold">
                Certificat de Dactylographie
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif mt-2 mb-1">
                Mention {certificate.tier}
              </h2>
              <p className="text-xs text-slate-400 mb-6">Délivré par la plateforme DactyloPro</p>

              <div className="py-4 border-y border-slate-800 my-4">
                <p className="text-xs text-slate-400">Ce diplôme atteste que</p>
                <p className="text-xl font-bold text-white mt-1 mb-2 font-sans">{certificate.userName}</p>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  a démontré une maîtrise rigoureuse de la frappe à dix doigts sur clavier{' '}
                  <strong className="text-indigo-300">{layout.toUpperCase()}</strong>.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Vitesse homologuée</span>
                  <span className="text-2xl font-bold text-indigo-400 font-mono tabular-nums">
                    {certificate.wpm} WPM
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Précision validée</span>
                  <span className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">
                    {certificate.accuracy}%
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-500 mt-6 pt-4 border-t border-slate-800/80">
                <span>Date : {certificate.date}</span>
                <span>Authenticité certifiée DactyloPro</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handlePrintCertificate}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
              >
                <Printer className="w-4 h-4" />
                Imprimer le certificat
              </button>
              <button
                onClick={() => setCertificate(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-all"
              >
                Passer un autre test
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
