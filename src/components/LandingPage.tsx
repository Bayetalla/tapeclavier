import React from 'react';
import { ArrowRight, Award, CheckCircle, Code2, Cpu, Flame, Gamepad2, GraduationCap, Keyboard, ShieldCheck, Sparkles, Timer, Zap } from 'lucide-react';
import { COURSE_LEVELS } from '../data/courseData';

interface LandingPageProps {
  onStartCourse: () => void;
  onOpenSpeedTest: () => void;
  onOpenOnboarding: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartCourse,
  onOpenSpeedTest,
  onOpenOnboarding,
}) => {
  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Hero Section */}
      <section className="relative w-full py-16 sm:py-24 px-4 sm:px-8 max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Plateforme EdTech de Dactylographie Nouvelle Génération</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl text-balance font-display mb-6">
          Apprends à taper plus vite. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-200 to-emerald-400">
            Sans regarder ton clavier.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mb-8">
          Apprends les dix doigts, améliore ta précision et transforme progressivement ta vitesse de frappe. Du débutant complet à la maîtrise du code et des symboles.
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-12">
          <button
            onClick={onOpenOnboarding}
            className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            Commencer gratuitement
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenSpeedTest}
            className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
          >
            <Timer className="w-4 h-4 text-indigo-400" />
            Faire un test de vitesse (30s)
          </button>
          <button
            onClick={onStartCourse}
            className="px-5 py-3.5 text-slate-400 hover:text-white text-sm font-medium transition-colors"
          >
            Voir les 10 niveaux du cours
          </button>
        </div>

        {/* Global verified metrics strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl pt-8 border-t border-slate-800/80">
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">68 WPM</span>
            <span className="block text-xs text-slate-400 mt-0.5">Vitesse moyenne après 3 sem.</span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">98.4%</span>
            <span className="block text-xs text-slate-400 mt-0.5">Précision moyenne visée</span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-mono">10</span>
            <span className="block text-xs text-slate-400 mt-0.5">Niveaux progressifs complets</span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">100%</span>
            <span className="block text-xs text-slate-400 mt-0.5">AZERTY, QWERTY, QWERTZ</span>
          </div>
        </div>
      </section>

      {/* Section 1: Pourquoi apprendre ? */}
      <section className="w-full py-16 bg-slate-900/40 border-y border-slate-850 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans">
              Pourquoi apprendre la dactylographie à dix doigts ?
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
              Le clavier est l'interface principale entre vos pensées et le monde numérique.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <Zap className="w-8 h-8 text-indigo-400 mb-4" />
              <h3 className="text-base font-semibold text-white mb-2">Gain de 21 jours par an</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Passer de 30 WPM à 70 WPM divise par deux le temps passé à taper emails, rapports et code, soit des centaines d'heures libérées chaque année.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <Cpu className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-base font-semibold text-white mb-2">Charge mentale allégée</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ne plus chercher les touches libère 100% de votre attention pour la créativité, la rigueur de raisonnement et la qualité rédactionnelle.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <ShieldCheck className="w-8 h-8 text-amber-400 mb-4" />
              <h3 className="text-base font-semibold text-white mb-2">Ergonomie & Santé</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Fini les douleurs cervicales dues aux allers-retours incessants entre écran et clavier. Les mains flottent naturellement sans tension.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Comment ça fonctionne ? */}
      <section className="w-full py-16 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans">
            La Méthode DactyloPro en 3 Piliers
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Inspirée des neurosciences motrices et du bio-feedback en temps réel.
          </p>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-mono font-bold text-lg shrink-0">
              1
            </div>
            <div>
              <h3 className="text-base font-semibold text-white mb-1">
                Ancrage tactile de la ligne de repos
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Repérez instantanément les index sur F et J grâce aux saillies tactiles. Vos 8 autres doigts se placent automatiquement sans effort visuel.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-lg shrink-0">
              2
            </div>
            <div>
              <h3 className="text-base font-semibold text-white mb-1">
                Retour visuel & mains virtuelles interactives
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pendant chaque exercice, le clavier virtuel et les mains animées vous indiquent quel doigt utiliser et quelle rangée atteindre en temps réel.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center font-mono font-bold text-lg shrink-0">
              3
            </div>
            <div>
              <h3 className="text-base font-semibold text-white mb-1">
                Algorithme adaptatif ciblant vos erreurs
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Si vous hésitez ou confondez deux lettres (ex. R et T), le système génère instantanément des exercices sur-mesure pour ancrer le réflexe moteur.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Aperçu des 10 Niveaux */}
      <section className="w-full py-16 bg-slate-900/40 border-y border-slate-850 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans">
                Parcours Pédagogique Complet
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                10 niveaux progressifs pour atteindre le niveau professionnel.
              </p>
            </div>
            <button
              onClick={onStartCourse}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md"
            >
              Accéder au cours complet
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {COURSE_LEVELS.slice(0, 6).map((lvl) => (
              <div
                key={lvl.level}
                onClick={onStartCourse}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all flex items-start gap-3.5 group"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-800 group-hover:bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-mono font-bold text-sm shrink-0 transition-colors">
                  {lvl.level}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                    {lvl.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                    {lvl.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-16 px-4 sm:px-8 max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8 font-sans">
          Foire Aux Questions
        </h2>
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <h4 className="text-sm font-semibold text-white mb-1">
              Combien de temps faut-il pour apprendre à taper sans regarder ?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              En pratiquant 10 à 15 minutes par jour, la plupart des élèves maîtrisent l'ensemble de l'alphabet à l'aveugle en 2 à 3 semaines, et doublent leur vitesse en 1 mois.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <h4 className="text-sm font-semibold text-white mb-1">
              Puis-je utiliser un clavier AZERTY, QWERTY ou QWERTZ ?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Oui ! DactyloPro intègre un moteur multi-claviers avec mapping précis des doigts, touches Shift et AltGr pour AZERTY français, QWERTY international et QWERTZ suisse/allemand.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <h4 className="text-sm font-semibold text-white mb-1">
              Comment fonctionne le Coach IA ?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Le coach analyse vos temps de réaction, vos fautes par touche et vos doigts les plus lents, puis génère des leçons ciblées avec des mots réels pour combler rapidement vos lacunes.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full py-16 px-4 sm:px-8 max-w-4xl mx-auto text-center mb-12">
        <div className="p-10 rounded-3xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 shadow-2xl">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display mb-3">
            Prêt à libérer la vitesse de vos 10 doigts ?
          </h2>
          <p className="text-sm text-slate-300 max-w-md mx-auto mb-6">
            Commencez par la première leçon gratuite ou testez votre vitesse actuelle en 30 secondes.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={onOpenOnboarding}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              Démarrer le parcours
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenSpeedTest}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-semibold transition-all"
            >
              Test de vitesse
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
