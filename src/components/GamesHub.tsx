import React, { useState, useEffect, useRef } from 'react';
import { KeyboardLayoutType, SwitchSoundType } from '../types';
import { playErrorSound, playKeySound, playSuccessChime } from '../utils/audioSynthesizer';
import { Gamepad2, Heart, Sparkles, Trophy, Zap, ShieldAlert, Swords, Rocket } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GamesHubProps {
  layout: KeyboardLayoutType;
  soundType: SwitchSoundType;
  onSoundChange: (s: SwitchSoundType) => void;
  onAwardXp: (xp: number) => void;
}

type GameMode = 'falling' | 'space' | 'boss';

const GAME_WORDS = [
  'clavier', 'doigts', 'vitesse', 'agile', 'espace', 'ecran', 'memoire', 'reflexe',
  'rythme', 'souple', 'toucher', 'action', 'rapide', 'precis', 'maitrise', 'expert',
  'flamme', 'etoile', 'secret', 'victoire', 'dragon', 'laser', 'cosmos', 'horizon',
  'succes', 'niveau', 'record', 'energie', 'impact', 'combat', 'bouclier', 'puissance',
];

export const GamesHub: React.FC<GamesHubProps> = ({
  soundType,
  onAwardXp,
}) => {
  const [activeGame, setActiveGame] = useState<GameMode>('falling');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [gameOver, setGameOver] = useState<boolean>(false);

  // Falling Words state
  const [fallingItems, setFallingItems] = useState<{ id: number; word: string; y: number; x: number }[]>([]);
  // Boss Battle state
  const [bossHp, setBossHp] = useState<number>(100);
  const [bossMaxHp] = useState<number>(100);
  const [bossTargetWord, setBossTargetWord] = useState<string>('clavier');

  const inputRef = useRef<HTMLInputElement>(null);

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setLives(3);
    setCurrentInput('');
    setBossHp(100);
    setFallingItems([
      { id: Date.now(), word: GAME_WORDS[Math.floor(Math.random() * GAME_WORDS.length)], y: 5, x: 20 + Math.random() * 50 },
    ]);
    if (activeGame === 'boss') {
      setBossTargetWord(GAME_WORDS[Math.floor(Math.random() * GAME_WORDS.length)]);
    }
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // Falling words game loop
  useEffect(() => {
    if (!isPlaying || gameOver || activeGame !== 'falling') return;

    const gameLoop = setInterval(() => {
      setFallingItems((prev) => {
        // Move words down
        const updated = prev.map((item) => ({ ...item, y: item.y + 1.2 }));

        // Check if any word hit bottom
        const hitBottom = updated.filter((item) => item.y >= 88);
        if (hitBottom.length > 0) {
          playErrorSound();
          setLives((l) => {
            const nextLives = l - hitBottom.length;
            if (nextLives <= 0) {
              setGameOver(true);
              setIsPlaying(false);
            }
            return Math.max(0, nextLives);
          });
        }

        // Keep unreached words
        const remaining = updated.filter((item) => item.y < 88);

        // Spawn new word periodically
        if (Math.random() < 0.25 && remaining.length < 5) {
          remaining.push({
            id: Date.now(),
            word: GAME_WORDS[Math.floor(Math.random() * GAME_WORDS.length)],
            y: 5,
            x: 10 + Math.random() * 70,
          });
        }

        return remaining;
      });
    }, 100);

    return () => clearInterval(gameLoop);
  }, [isPlaying, gameOver, activeGame]);

  // Handle typing inside game
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isPlaying || gameOver) return;

    if (e.key.length === 1) {
      playKeySound(soundType, e.key === ' ');
    }

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const typed = currentInput.trim().toLowerCase();

      if (activeGame === 'falling') {
        // Find matching word
        const matchIndex = fallingItems.findIndex((item) => item.word.toLowerCase() === typed);
        if (matchIndex !== -1) {
          playSuccessChime();
          setScore((s) => s + 10);
          onAwardXp(15);
          setFallingItems((prev) => prev.filter((_, idx) => idx !== matchIndex));
          setCurrentInput('');
        } else {
          playErrorSound();
        }
      } else if (activeGame === 'boss') {
        if (typed === bossTargetWord.toLowerCase()) {
          playSuccessChime();
          const damage = 20;
          setScore((s) => s + 25);
          onAwardXp(20);
          setBossHp((hp) => {
            const nextHp = hp - damage;
            if (nextHp <= 0) {
              // Boss defeated!
              setIsPlaying(false);
              confetti({ particleCount: 100, spread: 80 });
              return 0;
            }
            return nextHp;
          });
          setBossTargetWord(GAME_WORDS[Math.floor(Math.random() * GAME_WORDS.length)]);
          setCurrentInput('');
        } else {
          playErrorSound();
          setLives((l) => {
            const nextLives = l - 1;
            if (nextLives <= 0) {
              setGameOver(true);
              setIsPlaying(false);
            }
            return Math.max(0, nextLives);
          });
        }
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4">
      {/* Game Mode Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-indigo-400" />
            Jeux de Dactylographie
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Développez vos réflexes sous pression de façon ultra-ludique.
          </p>
        </div>

        <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => {
              setActiveGame('falling');
              setIsPlaying(false);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
              activeGame === 'falling' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Falling Words
          </button>
          <button
            onClick={() => {
              setActiveGame('boss');
              setIsPlaying(false);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
              activeGame === 'boss' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            Boss Battle
          </button>
        </div>
      </div>

      {/* Main Game Arena Box */}
      <div className="relative w-full h-[400px] sm:h-[460px] bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-4 select-none">
        {/* Top Arena HUD: Lives & Score */}
        <div className="flex justify-between items-center z-10 px-2">
          <div className="flex items-center gap-1">
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                className={`w-5 h-5 transition-colors ${
                  i < lives ? 'text-rose-500 fill-rose-500' : 'text-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-mono font-bold text-indigo-300 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              Score: {score} pts
            </div>
          </div>
        </div>

        {/* Game Stage Area */}
        <div className="relative flex-1 w-full overflow-hidden">
          {activeGame === 'falling' && isPlaying && (
            <>
              {fallingItems.map((item) => (
                <div
                  key={item.id}
                  style={{ top: `${item.y}%`, left: `${item.x}%` }}
                  className="absolute px-3 py-1 rounded-xl bg-indigo-950/80 border border-indigo-500/50 text-white font-mono font-semibold text-sm shadow-[0_0_12px_rgba(99,102,241,0.5)] transition-all duration-100"
                >
                  {item.word}
                </div>
              ))}
              {/* Ground death line */}
              <div className="absolute bottom-2 inset-x-0 h-0.5 bg-rose-500/40" />
            </>
          )}

          {activeGame === 'boss' && isPlaying && (
            <div className="h-full flex flex-col items-center justify-center text-center">
              {/* Boss health bar */}
              <div className="w-64 mb-6">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Cyber Dragon</span>
                  <span>{bossHp}/{bossMaxHp} HP</span>
                </div>
                <div className="w-full h-3 bg-slate-900 rounded-full border border-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-200"
                    style={{ width: `${(bossHp / bossMaxHp) * 100}%` }}
                  />
                </div>
              </div>

              {/* Boss Avatar */}
              <div className="w-24 h-24 rounded-3xl bg-rose-950/40 border border-rose-500/40 flex items-center justify-center text-5xl mb-4 animate-bounce">
                🐲
              </div>

              {/* Word to type to attack */}
              <span className="text-xs text-slate-400 mb-1">Tape ce mot pour infliger des dégâts critiques :</span>
              <div className="px-5 py-2 rounded-2xl bg-slate-900 border-2 border-indigo-500 text-2xl font-mono font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                {bossTargetWord}
              </div>
            </div>
          )}

          {/* Start / Game Over overlay */}
          {(!isPlaying || gameOver) && (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
              {gameOver ? (
                <>
                  <ShieldAlert className="w-12 h-12 text-rose-500 mb-3" />
                  <h3 className="text-2xl font-bold text-white mb-1">Partie terminée !</h3>
                  <p className="text-sm text-slate-400 mb-4">Votre score final : {score} points</p>
                </>
              ) : (
                <>
                  <Rocket className="w-12 h-12 text-indigo-400 mb-3" />
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {activeGame === 'falling' ? 'Falling Words' : 'Boss Battle'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-sm mb-6">
                    {activeGame === 'falling'
                      ? 'Tapez chaque mot avant qu\'il n\'atteigne la ligne rouge en bas de l\'écran !'
                      : 'Tapez les mots demandés aussi vite que possible pour terrasser le boss !'}
                  </p>
                </>
              )}
              <button
                onClick={startGame}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all"
              >
                {gameOver ? 'Rejouer' : 'Commencer la partie'}
              </button>
            </div>
          )}
        </div>

        {/* Bottom Typing Input Field */}
        {isPlaying && (
          <div className="w-full max-w-md mx-auto pt-2 z-10">
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Tape le mot ici puis appuie sur Espace..."
              autoFocus
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-center text-lg outline-none focus:border-indigo-500 shadow-inner"
            />
          </div>
        )}
      </div>
    </div>
  );
};
