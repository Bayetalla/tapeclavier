import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { KeyboardLayoutType, SwitchSoundType } from '../types';
import {
  playErrorSound,
  playKeySound,
  playLaserSound,
  playExplosionSound,
  playBossHitSound,
  playVictoryFanfare,
  playSuccessChime,
} from '../utils/audioSynthesizer';
import {
  Gamepad2,
  Heart,
  Sparkles,
  Trophy,
  Zap,
  ShieldAlert,
  Swords,
  Rocket,
  RotateCcw,
  Volume2,
  VolumeX,
  Target,
  Flame,
  Award,
  ChevronRight,
  Shield,
  Activity,
  Gauge,
  Sliders,
} from 'lucide-react';

interface GamesHubProps {
  layout: KeyboardLayoutType;
  soundType: SwitchSoundType;
  onSoundChange: (s: SwitchSoundType) => void;
  onAwardXp: (xp: number) => void;
}

export type GameMode = 'falling' | 'space' | 'boss';
export type Difficulty = 'easy' | 'normal' | 'hard';

interface WordBanks {
  easy: string[];
  normal: string[];
  hard: string[];
}

const WORDS_FR: WordBanks = {
  easy: [
    'cle', 'mot', 'jeu', 'vue', 'air', 'eau', 'feu', 'fer', 'or', 'do',
    'roi', 'fin', 'bon', 'ami', 'ciel', 'main', 'nuit', 'vent', 'vert', 'bleu',
    'rose', 'bras', 'page', 'coup', 'sens', 'port', 'zone', 'cafe', 'lune', 'fleur',
  ],
  normal: [
    'clavier', 'doigts', 'vitesse', 'agile', 'espace', 'ecran', 'memoire', 'reflexe',
    'rythme', 'souple', 'toucher', 'action', 'rapide', 'precis', 'maitrise', 'expert',
    'flamme', 'etoile', 'secret', 'victoire', 'dragon', 'laser', 'cosmos', 'horizon',
    'succes', 'niveau', 'record', 'energie', 'impact', 'combat', 'bouclier', 'puissance',
    'circuit', 'cadence', 'moteur', 'parfait', 'reussir', 'attaque', 'galaxie', 'vaisseau',
  ],
  hard: [
    'dactylographie', 'synchronisation', 'extraordinaire', 'professionnel',
    'psychomoteur', 'automatisation', 'perseverance', 'circonference',
    'caracteristique', 'transformation', 'developpement', 'cybernetique',
    'indispensable', 'interconnexion', 'infaillible', 'aerodynamique',
    'algorithmique', 'reconstitution', 'constellation', 'intergalactique',
  ],
};

const WORDS_EN: WordBanks = {
  easy: [
    'key', 'run', 'sky', 'sun', 'star', 'fire', 'word', 'moon', 'fast', 'play',
    'code', 'ship', 'wave', 'iron', 'gold', 'game', 'mind', 'type', 'hand', 'flow',
    'boss', 'beam', 'hero', 'wing', 'core', 'blast', 'jump', 'dash', 'rush', 'volt',
  ],
  normal: [
    'keyboard', 'fingers', 'velocity', 'agility', 'reflex', 'rhythm', 'precision',
    'mastery', 'stellar', 'plasma', 'meteor', 'galaxy', 'defense', 'shield', 'strike',
    'victory', 'command', 'booster', 'cruiser', 'phantom', 'energy', 'impact', 'horizon',
    'warrior', 'quantum', 'blaster', 'circuit', 'engine', 'target', 'station',
  ],
  hard: [
    'championship', 'hypervelocity', 'cybernetic', 'extraordinary', 'constellation',
    'invulnerability', 'synchronization', 'teleportation', 'intergalactic', 'subterranean',
    'astrophysics', 'countermeasure', 'unprecedented', 'electromagnetic', 'superposition',
  ],
};

interface FallingWordItem {
  id: number;
  word: string;
  x: number; // percentage 5..85
  y: number; // percentage 0..100
  speed: number;
}

interface SpaceEnemyItem {
  id: number;
  word: string;
  lane: number; // 0..4
  distance: number; // 0 (top/deep space) to 100 (player flagship)
  speed: number;
  type: 'scout' | 'fighter' | 'cruiser';
  maxHp: number;
  currentHp: number;
}

interface BossProfile {
  id: string;
  name: string;
  avatar: string;
  title: string;
  maxHp: number;
  attackIntervalMs: number;
  bgGradient: string;
}

const BOSS_PROFILES: Record<Difficulty, BossProfile[]> = {
  easy: [
    {
      id: 'cyber_dragon_e',
      name: 'Cyber Wyrm',
      avatar: '🐲',
      title: 'Gardien Numérique Novice',
      maxHp: 80,
      attackIntervalMs: 8000,
      bgGradient: 'from-emerald-950/40 via-slate-900 to-slate-950',
    },
  ],
  normal: [
    {
      id: 'cyber_dragon_n',
      name: 'Titan Mécatronique',
      avatar: '🤖',
      title: 'Colosse d\'Acier & Plasma',
      maxHp: 150,
      attackIntervalMs: 5500,
      bgGradient: 'from-indigo-950/40 via-slate-900 to-slate-950',
    },
  ],
  hard: [
    {
      id: 'cyber_dragon_h',
      name: 'Seigneur du Néant',
      avatar: '👁️',
      title: 'Entité Cosmique Hyper-Fréquence',
      maxHp: 220,
      attackIntervalMs: 3800,
      bgGradient: 'from-rose-950/40 via-slate-900 to-slate-950',
    },
  ],
};

export const GamesHub: React.FC<GamesHubProps> = ({
  soundType,
  onSoundChange,
  onAwardXp,
}) => {
  // Game mode & settings
  const [activeGame, setActiveGame] = useState<GameMode>('falling');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');

  // Session state
  const [gameState, setGameState] = useState<'MENU' | 'PLAYING' | 'SUMMARY'>('MENU');
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [maxLives, setMaxLives] = useState<number>(3);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [isVictory, setIsVictory] = useState<boolean>(false);

  // Live Performance Metrics
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState<number>(0);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [wordsCompleted, setWordsCompleted] = useState<number>(0);

  // High Scores (persisted in localStorage)
  const [highScores, setHighScores] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('dactylo_game_highscores');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Falling Words specific state
  const [fallingItems, setFallingItems] = useState<FallingWordItem[]>([]);

  // Space Defender specific state
  const [spaceEnemies, setSpaceEnemies] = useState<SpaceEnemyItem[]>([]);
  const [currentWave, setCurrentWave] = useState<number>(1);
  const [totalWaves] = useState<number>(3);
  const [waveEnemiesDefeated, setWaveEnemiesDefeated] = useState<number>(0);
  const [activeLaserTarget, setActiveLaserTarget] = useState<{ x: number; y: number } | null>(null);

  // Boss Battle specific state
  const [currentBoss, setCurrentBoss] = useState<BossProfile>(BOSS_PROFILES.normal[0]);
  const [bossHp, setBossHp] = useState<number>(100);
  const [bossAttackTimer, setBossAttackTimer] = useState<number>(100); // 100% to 0%
  const [bossTargetWord, setBossTargetWord] = useState<string>('clavier');
  const [floatingDamage, setFloatingDamage] = useState<{ id: number; text: string; isCrit: boolean }[]>([]);
  const [bossIsRaging, setBossIsRaging] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Word pool accessor
  const getWordPool = useCallback(() => {
    const dict = language === 'fr' ? WORDS_FR : WORDS_EN;
    return dict[difficulty];
  }, [language, difficulty]);

  const getRandomWord = useCallback(() => {
    const pool = getWordPool();
    return pool[Math.floor(Math.random() * pool.length)];
  }, [getWordPool]);

  // Real-time metrics calculations
  const effectiveMinutes = Math.max(0.01, (elapsedSeconds || 1) / 60);
  const currentWpm = Math.max(0, Math.round((correctKeystrokes / 5) / effectiveMinutes));
  const currentCpm = Math.max(0, Math.round(correctKeystrokes / effectiveMinutes));
  const currentAccuracy = totalKeystrokes > 0
    ? Math.max(0, Math.min(100, Math.round((correctKeystrokes / totalKeystrokes) * 100)))
    : 100;

  // Real-time timer ticker
  useEffect(() => {
    if (gameState !== 'PLAYING' || !startTime) return;
    const timer = setInterval(() => {
      setElapsedSeconds((Date.now() - startTime) / 1000);
    }, 200);
    return () => clearInterval(timer);
  }, [gameState, startTime]);

  // Keep input focused during play
  useEffect(() => {
    if (gameState === 'PLAYING') {
      inputRef.current?.focus();
    }
  }, [gameState, activeGame]);

  // End Game Handler
  const handleGameOver = useCallback((won: boolean) => {
    setGameState('SUMMARY');
    setIsVictory(won);

    if (won) {
      playVictoryFanfare();
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#3b82f6', '#f59e0b', '#ec4899'],
      });
    } else {
      playErrorSound();
    }

    // High score update
    const scoreKey = `${activeGame}_${difficulty}_${language}`;
    setHighScores((prev) => {
      const best = prev[scoreKey] || 0;
      if (score > best) {
        const next = { ...prev, [scoreKey]: score };
        localStorage.setItem('dactylo_game_highscores', JSON.stringify(next));
        return next;
      }
      return prev;
    });

    // Award XP
    const finalAccuracy = totalKeystrokes > 0
      ? Math.max(0, Math.min(100, Math.round((correctKeystrokes / totalKeystrokes) * 100)))
      : 100;
    const earnedXp = Math.round((score * 0.4) + (currentWpm * 1.5) + (finalAccuracy * 0.5) + (won ? 50 : 15));
    onAwardXp(earnedXp);
  }, [activeGame, difficulty, language, score, totalKeystrokes, correctKeystrokes, currentWpm, onAwardXp]);

  // Start / Reset Game
  const handleStartGame = () => {
    const initialLives = difficulty === 'easy' ? 5 : difficulty === 'normal' ? 3 : 2;
    setLives(initialLives);
    setMaxLives(initialLives);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setCurrentInput('');
    setStartTime(Date.now());
    setElapsedSeconds(0);
    setTotalKeystrokes(0);
    setCorrectKeystrokes(0);
    setErrorCount(0);
    setWordsCompleted(0);
    setIsVictory(false);
    setActiveLaserTarget(null);
    setFloatingDamage([]);

    if (activeGame === 'falling') {
      const count = difficulty === 'easy' ? 2 : difficulty === 'normal' ? 3 : 4;
      const initialItems: FallingWordItem[] = Array.from({ length: count }, (_, i) => ({
        id: Date.now() + i,
        word: getRandomWord(),
        x: 10 + Math.random() * 70,
        y: Math.random() * 20,
        speed: difficulty === 'easy' ? 0.7 : difficulty === 'normal' ? 1.0 : 1.4,
      }));
      setFallingItems(initialItems);
    } else if (activeGame === 'space') {
      setCurrentWave(1);
      setWaveEnemiesDefeated(0);
      const initialEnemies: SpaceEnemyItem[] = [
        {
          id: Date.now(),
          word: getRandomWord(),
          lane: 1,
          distance: 10,
          speed: difficulty === 'easy' ? 0.5 : difficulty === 'normal' ? 0.8 : 1.2,
          type: 'scout',
          maxHp: 1,
          currentHp: 1,
        },
        {
          id: Date.now() + 1,
          word: getRandomWord(),
          lane: 3,
          distance: 18,
          speed: difficulty === 'easy' ? 0.5 : difficulty === 'normal' ? 0.8 : 1.2,
          type: 'fighter',
          maxHp: 1,
          currentHp: 1,
        },
      ];
      setSpaceEnemies(initialEnemies);
    } else if (activeGame === 'boss') {
      const boss = BOSS_PROFILES[difficulty][0];
      setCurrentBoss(boss);
      setBossHp(boss.maxHp);
      setBossIsRaging(false);
      setBossAttackTimer(100);
      setBossTargetWord(getRandomWord());
    }

    setGameState('PLAYING');
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // 1. Falling Words Loop
  useEffect(() => {
    if (gameState !== 'PLAYING' || activeGame !== 'falling') return;

    const baseInterval = 100;
    const interval = setInterval(() => {
      setFallingItems((prev) => {
        const fallIncrement = (difficulty === 'easy' ? 0.7 : difficulty === 'normal' ? 1.1 : 1.6);
        const updated = prev.map((item) => ({ ...item, y: item.y + fallIncrement * (item.speed || 1) }));

        // Check ground hit
        const reachedGround = updated.filter((item) => item.y >= 88);
        if (reachedGround.length > 0) {
          playErrorSound();
          setCombo(0);
          setLives((l) => {
            const next = l - reachedGround.length;
            if (next <= 0) {
              handleGameOver(false);
              return 0;
            }
            return next;
          });
        }

        const remaining = updated.filter((item) => item.y < 88);
        const maxOnScreen = difficulty === 'easy' ? 4 : difficulty === 'normal' ? 5 : 6;

        if (remaining.length < maxOnScreen && Math.random() < 0.28) {
          remaining.push({
            id: Date.now() + Math.random(),
            word: getRandomWord(),
            x: 8 + Math.random() * 74,
            y: 0,
            speed: difficulty === 'easy' ? 0.8 : difficulty === 'normal' ? 1.1 : 1.5,
          });
        }

        return remaining;
      });
    }, baseInterval);

    return () => clearInterval(interval);
  }, [gameState, activeGame, difficulty, getRandomWord, handleGameOver]);

  // 2. Space Defender Loop
  useEffect(() => {
    if (gameState !== 'PLAYING' || activeGame !== 'space') return;

    const enemiesPerWave = difficulty === 'easy' ? 8 : difficulty === 'normal' ? 12 : 16;

    const interval = setInterval(() => {
      setSpaceEnemies((prev) => {
        const speedMultiplier = (difficulty === 'easy' ? 0.6 : difficulty === 'normal' ? 0.9 : 1.3);
        const updated = prev.map((e) => ({
          ...e,
          distance: e.distance + speedMultiplier * e.speed,
        }));

        // Breach defense line at distance >= 88
        const breached = updated.filter((e) => e.distance >= 88);
        if (breached.length > 0) {
          playExplosionSound();
          playErrorSound();
          setCombo(0);
          setLives((l) => {
            const next = l - breached.length;
            if (next <= 0) {
              handleGameOver(false);
              return 0;
            }
            return next;
          });
        }

        const remaining = updated.filter((e) => e.distance < 88);

        // Spawn new enemy along 5 lanes if wave limit not exceeded
        if (remaining.length < 4 && Math.random() < 0.3) {
          const usedLanes = remaining.map((e) => e.lane);
          const availableLanes = [0, 1, 2, 3, 4].filter((l) => !usedLanes.includes(l));
          const chosenLane = availableLanes.length > 0
            ? availableLanes[Math.floor(Math.random() * availableLanes.length)]
            : Math.floor(Math.random() * 5);

          const isCruiser = difficulty === 'hard' && Math.random() < 0.25;
          remaining.push({
            id: Date.now() + Math.random(),
            word: getRandomWord(),
            lane: chosenLane,
            distance: 2,
            speed: isCruiser ? 0.6 : 1.0,
            type: isCruiser ? 'cruiser' : Math.random() > 0.5 ? 'fighter' : 'scout',
            maxHp: isCruiser ? 2 : 1,
            currentHp: isCruiser ? 2 : 1,
          });
        }

        return remaining;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [gameState, activeGame, difficulty, getRandomWord, handleGameOver]);

  // 3. Boss Battle Loop & Attack Countdown
  useEffect(() => {
    if (gameState !== 'PLAYING' || activeGame !== 'boss') return;

    const tickMs = 100;
    const decrement = (tickMs / currentBoss.attackIntervalMs) * 100;

    const timer = setInterval(() => {
      setBossAttackTimer((prev) => {
        const next = prev - decrement;
        if (next <= 0) {
          // Boss attacks!
          playBossHitSound();
          playErrorSound();
          setCombo(0);
          setLives((l) => {
            const nextLives = l - 1;
            if (nextLives <= 0) {
              handleGameOver(false);
              return 0;
            }
            return nextLives;
          });
          // Reset timer and assign new phrase
          setBossTargetWord(getRandomWord());
          return 100;
        }
        return next;
      });
    }, tickMs);

    return () => clearInterval(timer);
  }, [gameState, activeGame, currentBoss, getRandomWord, handleGameOver]);

  // Calculate Performance Grade for Summary
  const getGrade = (wpm: number, accuracy: number) => {
    if (wpm >= 70 && accuracy >= 97) return { letter: 'S', color: 'text-amber-400 border-amber-400', label: 'Grand Maître' };
    if (wpm >= 50 && accuracy >= 95) return { letter: 'A', color: 'text-indigo-400 border-indigo-400', label: 'Expert Agile' };
    if (wpm >= 35 && accuracy >= 90) return { letter: 'B', color: 'text-emerald-400 border-emerald-400', label: 'Opérateur Rapide' };
    if (wpm >= 20 && accuracy >= 80) return { letter: 'C', color: 'text-blue-400 border-blue-400', label: 'Apprenti Régulier' };
    return { letter: 'D', color: 'text-rose-400 border-rose-400', label: 'Débutant en Progrès' };
  };

  // Keyboard Stroke Listener for Gameplay
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (gameState !== 'PLAYING') return;

    // Ignore pure functional keys
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) return;

    // Escape exits to menu
    if (e.key === 'Escape') {
      setGameState('MENU');
      return;
    }

    setTotalKeystrokes((prev) => prev + 1);

    // Audio mechanical switch click
    playKeySound(soundType, e.key === ' ');

    // Handle space/enter submission or character appending
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const typed = currentInput.trim().toLowerCase();
      if (!typed) return;

      if (activeGame === 'falling') {
        const matchIdx = fallingItems.findIndex((item) => item.word.toLowerCase() === typed);
        if (matchIdx !== -1) {
          playSuccessChime();
          const target = fallingItems[matchIdx];
          const pts = Math.round(target.word.length * 10 * (1 + combo * 0.15));
          setScore((s) => s + pts);
          setCombo((c) => {
            const next = c + 1;
            setMaxCombo((m) => Math.max(m, next));
            return next;
          });
          setCorrectKeystrokes((prev) => prev + target.word.length);
          setWordsCompleted((w) => w + 1);
          setFallingItems((prev) => prev.filter((_, idx) => idx !== matchIdx));
          setCurrentInput('');
        } else {
          playErrorSound();
          setErrorCount((err) => err + 1);
          setCombo(0);
        }
      } else if (activeGame === 'space') {
        const matchIdx = spaceEnemies.findIndex((e) => e.word.toLowerCase() === typed);
        if (matchIdx !== -1) {
          playLaserSound();
          playExplosionSound();
          const target = spaceEnemies[matchIdx];
          setActiveLaserTarget({ x: target.lane * 20 + 10, y: target.distance });
          setTimeout(() => setActiveLaserTarget(null), 180);

          const pts = Math.round(target.word.length * 15 * (1 + combo * 0.2));
          setScore((s) => s + pts);
          setCombo((c) => {
            const next = c + 1;
            setMaxCombo((m) => Math.max(m, next));
            return next;
          });
          setCorrectKeystrokes((prev) => prev + target.word.length);
          setWordsCompleted((w) => w + 1);
          setWaveEnemiesDefeated((d) => {
            const next = d + 1;
            const threshold = difficulty === 'easy' ? 6 : difficulty === 'normal' ? 10 : 14;
            if (next >= threshold) {
              if (currentWave >= totalWaves) {
                // Victory!
                handleGameOver(true);
              } else {
                setCurrentWave((w) => w + 1);
                return 0;
              }
            }
            return next;
          });
          setSpaceEnemies((prev) => prev.filter((_, idx) => idx !== matchIdx));
          setCurrentInput('');
        } else {
          playErrorSound();
          setErrorCount((err) => err + 1);
          setCombo(0);
        }
      } else if (activeGame === 'boss') {
        if (typed === bossTargetWord.toLowerCase()) {
          playBossHitSound();
          playLaserSound();

          const isFast = bossAttackTimer > 50;
          const damage = isFast ? 30 : 20;

          // Float damage indicator
          setFloatingDamage((prev) => [
            ...prev,
            { id: Date.now(), text: `-${damage} HP ${isFast ? 'CRITIQUE!' : ''}`, isCrit: isFast },
          ]);
          setTimeout(() => {
            setFloatingDamage((prev) => prev.slice(1));
          }, 800);

          const pts = Math.round(bossTargetWord.length * 20 * (isFast ? 1.5 : 1));
          setScore((s) => s + pts);
          setCombo((c) => {
            const next = c + 1;
            setMaxCombo((m) => Math.max(m, next));
            return next;
          });
          setCorrectKeystrokes((prev) => prev + bossTargetWord.length);
          setWordsCompleted((w) => w + 1);

          setBossHp((hp) => {
            const nextHp = hp - damage;
            if (nextHp <= 0) {
              handleGameOver(true);
              return 0;
            }
            if (nextHp <= currentBoss.maxHp * 0.4) {
              setBossIsRaging(true);
            }
            return nextHp;
          });

          // Reset boss countdown & roll new word
          setBossAttackTimer(100);
          setBossTargetWord(getRandomWord());
          setCurrentInput('');
        } else {
          playErrorSound();
          setErrorCount((err) => err + 1);
          setCombo(0);
        }
      }
      return;
    }

    // Single character typing validation & auto-matching check
    if (e.key.length === 1) {
      const nextInput = currentInput + e.key;

      // In boss mode, check direct prefix match
      if (activeGame === 'boss') {
        if (bossTargetWord.toLowerCase().startsWith(nextInput.toLowerCase())) {
          setCorrectKeystrokes((c) => c + 1);
        } else {
          setErrorCount((err) => err + 1);
          playErrorSound();
        }
      } else {
        // Falling & Space modes: check if any active target starts with this prefix
        const targets = activeGame === 'falling'
          ? fallingItems.map((i) => i.word)
          : spaceEnemies.map((e) => e.word);
        const hasPrefixMatch = targets.some((w) => w.toLowerCase().startsWith(nextInput.toLowerCase()));

        if (hasPrefixMatch) {
          setCorrectKeystrokes((c) => c + 1);
        } else {
          setErrorCount((err) => err + 1);
        }
      }

      setCurrentInput(nextInput);
    }
  };

  const currentGrade = getGrade(currentWpm, currentAccuracy);
  const currentHighScore = highScores[`${activeGame}_${difficulty}_${language}`] || 0;

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-3 sm:px-6 select-none font-sans">
      {/* Hidden real input for keyboard capture */}
      <input
        ref={inputRef}
        type="text"
        value={currentInput}
        onChange={(e) => setCurrentInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="opacity-0 absolute -top-96 left-0 w-1 h-1 pointer-events-none"
        autoFocus
      />

      {/* Header bar: Title, Game Selectors & Audio Switch */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-display">
                Arcade Dactylographique
              </h2>
              <p className="text-xs text-slate-400">
                Développez vos réflexes sous pression avec calcul en temps réel des WPM et de la précision.
              </p>
            </div>
          </div>
        </div>

        {/* Global Controls: Sound & Language */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          {/* Language toggle FR / EN */}
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-xs font-mono">
            <button
              onClick={() => setLanguage('fr')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                language === 'fr' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              FR
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                language === 'en' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          {/* Sound switch selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-2 py-1 text-xs text-slate-300">
            <button
              onClick={() => onSoundChange(soundType === 'off' ? 'cherry-blue' : 'off')}
              className="mr-1 text-slate-400 hover:text-white"
              title="Activer/Désactiver le son"
            >
              {soundType === 'off' ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-indigo-400" />}
            </button>
            <select
              value={soundType}
              onChange={(e) => onSoundChange(e.target.value as SwitchSoundType)}
              className="bg-transparent text-slate-300 text-xs py-0.5 outline-none cursor-pointer"
            >
              <option value="cherry-blue" className="bg-slate-900 text-white">Cherry Blue (Click)</option>
              <option value="thock" className="bg-slate-900 text-white">Thocky (Deep)</option>
              <option value="cherry-red" className="bg-slate-900 text-white">Cherry Red</option>
              <option value="typewriter" className="bg-slate-900 text-white">Machine à écrire</option>
              <option value="off" className="bg-slate-900 text-white">Silencieux</option>
            </select>
          </div>
        </div>
      </div>

      {/* Game Mode Tabs & Difficulty Segmented Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-slate-900/90 border border-slate-800 p-2 rounded-2xl">
        {/* Game Mode Tabs */}
        <div className="flex gap-1 overflow-x-auto">
          <button
            onClick={() => {
              setActiveGame('falling');
              setGameState('MENU');
            }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
              activeGame === 'falling'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Falling Words
          </button>
          <button
            onClick={() => {
              setActiveGame('space');
              setGameState('MENU');
            }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
              activeGame === 'space'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            Space Defender
          </button>
          <button
            onClick={() => {
              setActiveGame('boss');
              setGameState('MENU');
            }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
              activeGame === 'boss'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            Boss Battle
          </button>
        </div>

        {/* Adjustable Difficulty Control */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80">
          <span className="text-[11px] text-slate-500 font-medium px-2 flex items-center gap-1">
            <Sliders className="w-3 h-3" /> Difficulté :
          </span>
          {(['easy', 'normal', 'hard'] as Difficulty[]).map((d) => {
            const labels = { easy: 'Facile', normal: 'Moyen', hard: 'Difficile' };
            const isSelected = difficulty === d;
            return (
              <button
                key={d}
                disabled={gameState === 'PLAYING'}
                onClick={() => setDifficulty(d)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  isSelected
                    ? d === 'easy'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : d === 'normal'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white disabled:opacity-40'
                }`}
              >
                {labels[d]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Game Stage / Arena Container */}
      <div
        onClick={() => inputRef.current?.focus()}
        className="relative w-full h-[460px] sm:h-[500px] bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-4 cursor-text"
      >
        {/* Dynamic Background Grids / Starfields */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

        {/* Live HUD (Top Bar inside Arena) */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 px-2 py-1 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800/80">
          {/* Lives indicator */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400 mr-1 font-medium">Bouclier :</span>
            {[...Array(maxLives)].map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 transition-all ${
                  i < lives ? 'text-rose-500 fill-rose-500 scale-100' : 'text-slate-700 scale-90'
                }`}
              />
            ))}
          </div>

          {/* Real-time WPM & Accuracy Telemetry */}
          <div className="flex items-center gap-3 sm:gap-5 text-xs font-mono">
            <div className="flex items-center gap-1 text-indigo-300">
              <Gauge className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-bold tabular-nums text-sm">{currentWpm}</span>
              <span className="text-[10px] text-slate-400">WPM</span>
            </div>

            <div className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span className={`font-bold tabular-nums text-sm ${
                currentAccuracy >= 95 ? 'text-emerald-400' : currentAccuracy >= 85 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {currentAccuracy}%
              </span>
              <span className="text-[10px] text-slate-400">Préc.</span>
            </div>

            {combo > 1 && (
              <div className="flex items-center gap-1 text-amber-400 animate-bounce">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                <span className="font-extrabold">{combo}x</span>
              </div>
            )}
          </div>

          {/* Score & High Score */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block leading-tight">Score</span>
              <span className="text-sm font-bold text-white font-mono tabular-nums">{score}</span>
            </div>
            <div className="hidden sm:block text-right pl-2 border-l border-slate-800">
              <span className="text-[10px] text-slate-500 block leading-tight">Record</span>
              <span className="text-xs font-semibold text-amber-400 font-mono tabular-nums">{currentHighScore}</span>
            </div>
          </div>
        </div>

        {/* -------------------- Active Game Canvas -------------------- */}
        <div className="relative flex-1 w-full overflow-hidden my-2">
          {/* 1. Falling Words Canvas */}
          {activeGame === 'falling' && gameState === 'PLAYING' && (
            <>
              {fallingItems.map((item) => {
                const isTargetMatch = currentInput.trim().length > 0 &&
                  item.word.toLowerCase().startsWith(currentInput.trim().toLowerCase());
                const matchLen = isTargetMatch ? currentInput.trim().length : 0;
                const typedPart = item.word.slice(0, matchLen);
                const remainingPart = item.word.slice(matchLen);

                return (
                  <div
                    key={item.id}
                    style={{ top: `${item.y}%`, left: `${item.x}%` }}
                    className={`absolute px-3 py-1.5 rounded-xl font-mono text-sm font-semibold transition-all duration-100 border ${
                      isTargetMatch
                        ? 'bg-indigo-900/90 border-indigo-400 text-white shadow-[0_0_16px_rgba(99,102,241,0.6)] scale-110 z-20'
                        : 'bg-slate-900/80 border-slate-700 text-slate-200 shadow-md'
                    }`}
                  >
                    <span className="text-emerald-400 underline decoration-2">{typedPart}</span>
                    <span>{remainingPart}</span>
                  </div>
                );
              })}

              {/* Defense Perimeter Boundary Line */}
              <div className="absolute bottom-2 inset-x-0 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-[0_0_12px_rgba(244,63,94,0.8)]" />
              <span className="absolute bottom-4 right-4 text-[10px] font-mono text-rose-400 tracking-wider">
                LIGNE DE DÉFENSE CRITIQUE
              </span>
            </>
          )}

          {/* 2. Space Defender Canvas */}
          {activeGame === 'space' && gameState === 'PLAYING' && (
            <>
              {/* Space lanes guides */}
              <div className="absolute inset-0 grid grid-cols-5 divide-x divide-slate-800/40 pointer-events-none" />

              {/* Waves counter badge */}
              <div className="absolute top-2 left-3 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-300">
                Vague : <strong className="text-indigo-400">{currentWave} / {totalWaves}</strong>
              </div>

              {/* Laser beam rendering */}
              {activeLaserTarget && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-30">
                  <line
                    x1="50%"
                    y1="90%"
                    x2={`${activeLaserTarget.x}%`}
                    y2={`${activeLaserTarget.y}%`}
                    stroke="#818cf8"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="animate-pulse"
                  />
                  <line
                    x1="50%"
                    y1="90%"
                    x2={`${activeLaserTarget.x}%`}
                    y2={`${activeLaserTarget.y}%`}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                </svg>
              )}

              {/* Enemy space ships */}
              {spaceEnemies.map((enemy) => {
                const laneX = enemy.lane * 20 + 2; // 0..4 mapped to percentage
                const isTargetMatch = currentInput.trim().length > 0 &&
                  enemy.word.toLowerCase().startsWith(currentInput.trim().toLowerCase());
                const matchLen = isTargetMatch ? currentInput.trim().length : 0;

                return (
                  <div
                    key={enemy.id}
                    style={{ top: `${enemy.distance}%`, left: `${laneX}%` }}
                    className="absolute w-[16%] flex flex-col items-center transition-all duration-100"
                  >
                    {/* Enemy Ship Sprite */}
                    <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-lg mb-1 transition-transform ${
                      isTargetMatch ? 'scale-125 drop-shadow-[0_0_12px_rgba(99,102,241,0.9)]' : ''
                    }`}>
                      {enemy.type === 'cruiser' ? '🛸' : enemy.type === 'fighter' ? '👾' : '🚀'}
                    </div>

                    {/* Word Label */}
                    <div className={`px-2.5 py-1 rounded-lg font-mono text-xs font-semibold whitespace-nowrap border shadow-lg ${
                      isTargetMatch
                        ? 'bg-indigo-900 border-indigo-400 text-white shadow-indigo-500/40'
                        : 'bg-slate-900/90 border-slate-700 text-slate-200'
                    }`}>
                      <span className="text-emerald-400">{enemy.word.slice(0, matchLen)}</span>
                      <span>{enemy.word.slice(matchLen)}</span>
                    </div>
                  </div>
                );
              })}

              {/* Player Command Flagship at the bottom center */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                  🛰️
                </div>
                <span className="text-[10px] text-slate-400 font-mono mt-1">Base Stellaire</span>
              </div>
            </>
          )}

          {/* 3. Boss Battle Canvas */}
          {activeGame === 'boss' && gameState === 'PLAYING' && (
            <div className={`h-full flex flex-col items-center justify-center text-center relative rounded-2xl p-4 bg-gradient-to-b ${currentBoss.bgGradient}`}>
              {/* Floating Damage numbers */}
              {floatingDamage.map((d) => (
                <div
                  key={d.id}
                  className={`absolute top-1/4 text-lg font-extrabold font-mono animate-bounce ${
                    d.isCrit ? 'text-amber-400 text-xl' : 'text-rose-400'
                  }`}
                >
                  {d.text}
                </div>
              ))}

              {/* Boss Information & HP Bar */}
              <div className="w-full max-w-sm mb-4">
                <div className="flex justify-between items-center text-xs text-slate-300 mb-1">
                  <span className="font-bold flex items-center gap-1.5">
                    {bossIsRaging && <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />}
                    {currentBoss.name}
                  </span>
                  <span className="font-mono tabular-nums text-slate-400">
                    {bossHp} / {currentBoss.maxHp} HP
                  </span>
                </div>
                {/* Health Bar */}
                <div className="w-full h-3.5 bg-slate-900 rounded-full border border-slate-700 overflow-hidden shadow-inner">
                  <div
                    className={`h-full transition-all duration-200 ${
                      bossIsRaging
                        ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600 animate-pulse'
                        : 'bg-gradient-to-r from-emerald-500 to-indigo-500'
                    }`}
                    style={{ width: `${Math.max(0, (bossHp / currentBoss.maxHp) * 100)}%` }}
                  />
                </div>

                {/* Attack Warning Countdown Gauge */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-mono">Attaque :</span>
                  <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-100 ${
                        bossAttackTimer < 30 ? 'bg-rose-500' : 'bg-amber-400'
                      }`}
                      style={{ width: `${bossAttackTimer}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Boss Animated Sprite Avatar */}
              <div className={`w-28 h-28 rounded-3xl bg-slate-900/60 border border-slate-700 flex items-center justify-center text-6xl mb-4 transition-transform shadow-2xl ${
                bossIsRaging ? 'animate-bounce border-rose-500/60 shadow-rose-900/30' : 'animate-pulse border-indigo-500/40 shadow-indigo-900/30'
              }`}>
                {currentBoss.avatar}
              </div>

              {/* Active Incantation to Type */}
              <div className="flex flex-col items-center">
                <span className="text-xs text-slate-400 mb-1 font-medium">
                  Tapez ce mot avant l'attaque pour frapper :
                </span>
                <div className="px-6 py-2.5 rounded-2xl bg-slate-900/90 border-2 border-indigo-500 text-2xl font-mono font-bold tracking-wider text-white shadow-[0_0_24px_rgba(99,102,241,0.4)]">
                  {(() => {
                    const typed = currentInput.trim();
                    const isMatch = bossTargetWord.toLowerCase().startsWith(typed.toLowerCase());
                    const matchLen = isMatch ? typed.length : 0;
                    return (
                      <>
                        <span className="text-emerald-400">{bossTargetWord.slice(0, matchLen)}</span>
                        <span>{bossTargetWord.slice(matchLen)}</span>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* -------------------- Title Menu Overlay -------------------- */}
          {gameState === 'MENU' && (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20 animate-fade-in">
              <div className="w-16 h-16 rounded-3xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 text-3xl mb-4 shadow-xl">
                {activeGame === 'falling' ? '🌧️' : activeGame === 'space' ? '🚀' : '🐲'}
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 font-display">
                {activeGame === 'falling'
                  ? 'Falling Words'
                  : activeGame === 'space'
                  ? 'Space Defender'
                  : 'Boss Battle'}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 max-w-md mb-6 leading-relaxed">
                {activeGame === 'falling'
                  ? 'Tapez chaque mot avant qu\'il n\'atteigne la ligne rouge au bas de l\'arène. Enchaînez les frappes sans faute pour maximiser votre combo multiplicateur !'
                  : activeGame === 'space'
                  ? 'Les vaisseaux envahisseurs avancent le long des couloirs spatiaux. Tapez leurs mots pour verrouiller le laser orbital et désintégrer la flotte ennemie.'
                  : 'Affrontez un boss redoutable doté d\'une barre de vie massive. Tapez rapidement ses incantations avant la fin du décompte d\'attaque !'}
              </p>

              {/* Game Quick Specs */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-sm mb-6 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Difficulté</span>
                  <span className="font-bold text-indigo-300 capitalize">{difficulty}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Langue</span>
                  <span className="font-bold text-white uppercase">{language}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Record Actuel</span>
                  <span className="font-bold text-amber-400 font-mono tabular-nums">{currentHighScore}</span>
                </div>
              </div>

              <button
                onClick={handleStartGame}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
              >
                Démarrer la partie
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* -------------------- Game Over / Victory Summary Overlay -------------------- */}
          {gameState === 'SUMMARY' && (
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 animate-fade-in overflow-y-auto">
              <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative">
                {/* Result header */}
                {isVictory ? (
                  <div className="flex flex-col items-center mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-2">
                      <Trophy className="w-7 h-7" />
                    </div>
                    <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                      Victoire Éclatante !
                    </span>
                    <h3 className="text-2xl font-bold text-white mt-0.5">Mission Accomplie</h3>
                  </div>
                ) : (
                  <div className="flex flex-col items-center mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-2">
                      <ShieldAlert className="w-7 h-7" />
                    </div>
                    <span className="text-xs uppercase tracking-widest text-rose-400 font-bold">
                      Bouclier Épuisé
                    </span>
                    <h3 className="text-2xl font-bold text-white mt-0.5">Partie Terminée</h3>
                  </div>
                )}

                {/* Score & Grade Display */}
                <div className="flex items-center justify-center gap-6 py-3 border-y border-slate-800 my-4">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 block uppercase">Score Final</span>
                    <span className="text-3xl font-extrabold text-white font-mono tabular-nums">{score}</span>
                  </div>

                  <div className="w-px h-10 bg-slate-800" />

                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 block uppercase">Rang Obtenu</span>
                    <div className="flex items-center justify-center gap-1.5 mt-0.5">
                      <span className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center font-bold text-lg font-mono ${currentGrade.color}`}>
                        {currentGrade.letter}
                      </span>
                      <span className="text-xs text-slate-300 font-medium">{currentGrade.label}</span>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6 text-xs">
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 block">Cadence WPM</span>
                    <span className="text-xl font-bold text-indigo-400 font-mono tabular-nums">
                      {currentWpm}
                    </span>
                    <span className="text-[10px] text-slate-500 block">{currentCpm} CPM</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 block">Précision</span>
                    <span className="text-xl font-bold text-emerald-400 font-mono tabular-nums">
                      {currentAccuracy}%
                    </span>
                    <span className="text-[10px] text-slate-500 block">{errorCount} erreurs</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 block">Combo Max</span>
                    <span className="text-xl font-bold text-amber-400 font-mono tabular-nums">
                      {maxCombo}x
                    </span>
                    <span className="text-[10px] text-slate-500 block">multiplicateur</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 block">Mots Validés</span>
                    <span className="text-xl font-bold text-slate-200 font-mono tabular-nums">
                      {wordsCompleted}
                    </span>
                    <span className="text-[10px] text-slate-500 block">{Math.round(elapsedSeconds)}s de jeu</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handleStartGame}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Rejouer
                  </button>
                  <button
                    onClick={() => setGameState('MENU')}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-all"
                  >
                    Changer de mode
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* -------------------- Interactive Live Typing Input Dock -------------------- */}
        <div className="relative z-10 w-full max-w-lg mx-auto pt-2">
          <div className="relative flex items-center">
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={gameState !== 'PLAYING'}
              placeholder={
                gameState === 'PLAYING'
                  ? 'Tapez ici les mots cibles puis Espace ou Entrée...'
                  : 'Appuyez sur Démarrer pour lancer la partie'
              }
              className="w-full px-5 py-3 rounded-2xl bg-slate-900/90 border border-slate-700 text-white font-mono text-center text-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-inner placeholder:text-slate-600 transition-all"
            />
            {currentInput && (
              <button
                onClick={() => setCurrentInput('')}
                className="absolute right-3 text-xs text-slate-500 hover:text-white px-2 py-1 rounded"
              >
                ⌫
              </button>
            )}
          </div>
          <p className="text-[11px] text-center text-slate-500 mt-1.5">
            Astuce : Espace ou Entrée valide votre mot · Touche Échap pour revenir au menu
          </p>
        </div>
      </div>
    </div>
  );
};
