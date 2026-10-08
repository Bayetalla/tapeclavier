import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { KeyboardLayoutType, SwitchSoundType, TypingResult } from '../types';
import { playErrorSound, playKeySound, playSuccessChime, speakText, stopSpeaking } from '../utils/audioSynthesizer';
import { VirtualKeyboard } from './VirtualKeyboard';
import { VirtualHands } from './VirtualHands';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Sparkles,
  Headphones,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface TypingEngineProps {
  textToType: string;
  title: string;
  modeName: string;
  layout: KeyboardLayoutType;
  soundType: SwitchSoundType;
  onSoundChange: (s: SwitchSoundType) => void;
  firstTryAccuracyMode: boolean;
  onComplete: (result: TypingResult) => void;
  showKeyboardInitial?: boolean;
  showHandsInitial?: boolean;
}

export const TypingEngine: React.FC<TypingEngineProps> = ({
  textToType,
  title,
  modeName,
  layout,
  soundType,
  onSoundChange,
  firstTryAccuracyMode,
  onComplete,
  showKeyboardInitial = true,
  showHandsInitial = true,
}) => {
  // Typing state
  const [userInput, setUserInput] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Error tracking
  const [firstTryErrors, setFirstTryErrors] = useState<number>(0);
  const [errorIndices, setErrorIndices] = useState<Set<number>>(new Set());
  const [weakKeysMap, setWeakKeysMap] = useState<Record<string, number>>({});
  const [activePhysicalKey, setActivePhysicalKey] = useState<string | null>(null);
  const [lastErrorKey, setLastErrorKey] = useState<string | null>(null);

  // Display toggles
  const [showKeyboard, setShowKeyboard] = useState<boolean>(showKeyboardInitial);
  const [showHands, setShowHands] = useState<boolean>(showHandsInitial);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [isDictating, setIsDictating] = useState<boolean>(false);

  // Live timer tick for real-time WPM
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus input automatically
  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    focusInput();
  }, [textToType, focusInput]);

  // Reset session when text changes
  useEffect(() => {
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setIsCompleted(false);
    setFirstTryErrors(0);
    setErrorIndices(new Set());
    setWeakKeysMap({});
    setElapsedSeconds(0);
    stopSpeaking();
  }, [textToType]);

  // Real-time timer ticker
  useEffect(() => {
    if (!startTime || isCompleted) return;
    const interval = setInterval(() => {
      const sec = Math.max(1, (Date.now() - startTime) / 1000);
      setElapsedSeconds(sec);
    }, 200);
    return () => clearInterval(interval);
  }, [startTime, isCompleted]);

  // Next required character
  const currentIndex = userInput.length;
  const nextChar = currentIndex < textToType.length ? textToType[currentIndex] : null;

  // Real-time metrics
  const totalTyped = userInput.length;
  const correctChars = userInput.split('').reduce((acc, char, idx) => {
    return acc + (char === textToType[idx] ? 1 : 0);
  }, 0);

  const effectiveTimeMinutes = Math.max(0.01, (elapsedSeconds || 1) / 60);
  const currentWpm = Math.max(0, Math.round((correctChars / 5) / effectiveTimeMinutes));
  const currentCpm = Math.max(0, Math.round(correctChars / effectiveTimeMinutes));

  const totalErrors = firstTryAccuracyMode ? firstTryErrors : errorIndices.size;
  const currentAccuracy = totalTyped > 0
    ? Math.max(0, Math.min(100, Math.round(((totalTyped - totalErrors) / totalTyped) * 100)))
    : 100;

  // Complete session handler
  const handleFinish = useCallback(
    (finalErrors: number, finalTimeSec: number) => {
      setIsCompleted(true);
      setEndTime(Date.now());
      playSuccessChime();

      // Confetti burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#3b82f6', '#f59e0b'],
      });

      const effectiveMinutes = Math.max(0.01, finalTimeSec / 60);
      const finalWpm = Math.max(0, Math.round((textToType.length / 5) / effectiveMinutes));
      const finalCpm = Math.max(0, Math.round(textToType.length / effectiveMinutes));
      const finalAccuracy = Math.max(0, Math.min(100, Math.round(((textToType.length - finalErrors) / textToType.length) * 100)));

      // Top weak keys
      const sortedWeakKeys = Object.entries(weakKeysMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([k]) => k);

      const result: TypingResult = {
        id: `res-${Date.now()}`,
        date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
        wpm: finalWpm,
        cpm: finalCpm,
        accuracy: finalAccuracy,
        firstTryAccuracy: Math.round(((textToType.length - firstTryErrors) / textToType.length) * 100),
        errorCount: finalErrors,
        timeSpentSeconds: Math.round(finalTimeSec),
        mode: modeName,
        title,
        weakKeys: sortedWeakKeys,
      };

      onComplete(result);
    },
    [firstTryAccuracyMode, firstTryErrors, modeName, onComplete, textToType, title, weakKeysMap]
  );

  // Handle key stroke
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setActivePhysicalKey(e.code);

    // Escape clears focus or resets
    if (e.key === 'Escape') {
      setIsFocusMode(false);
      return;
    }

    // Ctrl+R restarts the exercise
    if (e.ctrlKey && e.key === 'r') {
      e.preventDefault();
      handleRestart();
      return;
    }

    // Ignore functional modifiers on their own
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(e.key)) {
      return;
    }

    // Start timer on very first key
    if (!startTime) {
      setStartTime(Date.now());
    }

    // Backspace handling
    if (e.key === 'Backspace') {
      playKeySound(soundType, false);
      if (userInput.length > 0) {
        setUserInput((prev) => prev.slice(0, -1));
        setLastErrorKey(null);
      }
      return;
    }

    // Single character input
    if (e.key.length === 1) {
      const expectedChar = textToType[userInput.length];
      const typedChar = e.key;

      if (typedChar === expectedChar) {
        // Correct press!
        playKeySound(soundType, typedChar === ' ');
        setLastErrorKey(null);
      } else {
        // Incorrect press!
        playErrorSound();
        setLastErrorKey(e.code);
        setFirstTryErrors((prev) => prev + 1);
        setErrorIndices((prev) => new Set(prev).add(userInput.length));

        // Track weak key
        setWeakKeysMap((prev) => ({
          ...prev,
          [expectedChar]: (prev[expectedChar] || 0) + 1,
        }));
      }

      const newInput = userInput + typedChar;
      setUserInput(newInput);

      // Check if finished
      if (newInput.length >= textToType.length) {
        const finalSec = startTime ? (Date.now() - startTime) / 1000 : 1;
        const finalErr = firstTryAccuracyMode ? firstTryErrors + (typedChar !== expectedChar ? 1 : 0) : errorIndices.size;
        handleFinish(finalErr, finalSec);
      }
    }
  };

  const handleKeyUp = () => {
    setActivePhysicalKey(null);
  };

  const handleRestart = () => {
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setIsCompleted(false);
    setFirstTryErrors(0);
    setErrorIndices(new Set());
    setWeakKeysMap({});
    setElapsedSeconds(0);
    setLastErrorKey(null);
    stopSpeaking();
    focusInput();
  };

  // Toggle voice dictation with Gemini TTS
  const handleToggleDictation = async () => {
    if (isDictating) {
      stopSpeaking();
      setIsDictating(false);
    } else {
      setIsDictating(true);
      await speakText(textToType);
      setIsDictating(false);
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={focusInput}
      className={`relative w-full flex flex-col items-center transition-all duration-300 ${
        isFocusMode
          ? 'fixed inset-0 z-50 bg-slate-950 p-6 sm:p-12 overflow-y-auto'
          : 'max-w-4xl mx-auto py-4 px-2 sm:px-4'
      }`}
    >
      {/* Hidden real input for keyboard focus */}
      <input
        ref={inputRef}
        type="text"
        value=""
        onChange={() => {}}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        className="opacity-0 absolute -top-96 left-0 w-1 h-1 pointer-events-none"
        autoFocus
        tabIndex={0}
      />

      {/* Header bar: Title, Mode badge & Live metrics */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white font-sans">
                {title}
              </h2>
              <span className="text-xs text-indigo-400 font-medium">· {modeName}</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Cliquez n'importe où pour activer la frappe · Appuyez sur Échap pour quitter le mode focus
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          {/* TTS Dictation */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleDictation();
            }}
            title="Écouter la dictée vocale (Gemini TTS)"
            className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
              isDictating
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isDictating ? 'Lecture...' : 'Dictée'}</span>
          </button>

          {/* Sound switch selector */}
          <div className="relative flex items-center bg-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSoundChange(soundType === 'off' ? 'cherry-blue' : 'off');
              }}
              className="p-1.5 text-slate-400 hover:text-white"
              title="Activer/Désactiver le son"
            >
              {soundType === 'off' ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-indigo-400" />}
            </button>
            <select
              value={soundType}
              onChange={(e) => onSoundChange(e.target.value as SwitchSoundType)}
              onClick={(e) => e.stopPropagation()}
              className="bg-transparent text-slate-300 text-xs py-1 pr-2 border-0 outline-none cursor-pointer"
            >
              <option value="cherry-blue" className="bg-slate-900 text-white">Cherry MX Blue (Click)</option>
              <option value="thock" className="bg-slate-900 text-white">Thocky (Deep)</option>
              <option value="cherry-brown" className="bg-slate-900 text-white">Cherry Brown</option>
              <option value="cherry-red" className="bg-slate-900 text-white">Cherry Red (Linear)</option>
              <option value="typewriter" className="bg-slate-900 text-white">Machine à écrire</option>
              <option value="bubble" className="bg-slate-900 text-white">Bulles</option>
              <option value="off" className="bg-slate-900 text-white">Muet</option>
            </select>
          </div>

          {/* Toggle Virtual Hands */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowHands(!showHands);
            }}
            title={showHands ? 'Masquer les mains' : 'Afficher les mains'}
            className={`p-2 rounded-lg text-xs font-medium transition-colors ${
              showHands ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Mains
          </button>

          {/* Toggle Keyboard */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowKeyboard(!showKeyboard);
            }}
            title={showKeyboard ? 'Masquer le clavier' : 'Afficher le clavier'}
            className={`p-2 rounded-lg text-xs font-medium transition-colors ${
              showKeyboard ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Clavier
          </button>

          {/* Restart */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRestart();
            }}
            title="Recommencer (Ctrl+R)"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Focus Mode Fullscreen */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFocusMode(!isFocusMode);
            }}
            title={isFocusMode ? 'Quitter le mode focus' : 'Mode Focus (Plein écran)'}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
          >
            {isFocusMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Speedometer telemetry live cards */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center">
          <span className="text-[11px] text-slate-400 font-medium">Vitesse (WPM)</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-mono tabular-nums">
            {currentWpm}
          </span>
          <span className="text-[10px] text-slate-500 font-mono tabular-nums">{currentCpm} CPM</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center">
          <span className="text-[11px] text-slate-400 font-medium">Précision</span>
          <span className={`text-2xl sm:text-3xl font-extrabold font-mono tabular-nums ${
            currentAccuracy >= 95 ? 'text-emerald-400' : currentAccuracy >= 90 ? 'text-amber-400' : 'text-rose-400'
          }`}>
            {currentAccuracy}%
          </span>
          <span className="text-[10px] text-slate-500">{firstTryAccuracyMode ? 'First-try mode' : 'Final mode'}</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center">
          <span className="text-[11px] text-slate-400 font-medium">Erreurs</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono tabular-nums">
            {totalErrors}
          </span>
          <span className="text-[10px] text-slate-500">
            {totalTyped > 0 ? `${Math.round((totalErrors / totalTyped) * 100)}% de fautes` : '0 faute'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center">
          <span className="text-[11px] text-slate-400 font-medium">Temps écoulé</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-200 font-mono tabular-nums">
            {Math.floor(elapsedSeconds / 60)}:
            {Math.floor(elapsedSeconds % 60)
              .toString()
              .padStart(2, '0')}
          </span>
          <span className="text-[10px] text-slate-500 font-mono tabular-nums">
            {currentIndex}/{textToType.length} caractères
          </span>
        </div>
      </div>

      {/* Main text box display */}
      <div className="w-full p-6 sm:p-8 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl mb-6 relative overflow-hidden">
        {/* Subtle progress bar at top of card */}
        <div
          className="absolute top-0 left-0 h-1 bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-150"
          style={{ width: `${Math.min(100, (currentIndex / textToType.length) * 100)}%` }}
        />

        {/* Character flow */}
        <div className="font-mono text-lg sm:text-2xl leading-relaxed tracking-wider select-none break-words min-h-[96px]">
          {textToType.split('').map((char, index) => {
            const isTyped = index < userInput.length;
            const isCurrent = index === userInput.length;
            const typedChar = userInput[index];
            const isMatch = isTyped && typedChar === char;

            let charClass = 'text-slate-500 transition-colors';
            if (isTyped) {
              charClass = isMatch
                ? 'text-emerald-400'
                : 'text-rose-400 bg-rose-500/20 underline decoration-rose-500';
            }

            return (
              <span key={index} className="relative inline-block">
                {/* Blinking cursor for current target */}
                {isCurrent && (
                  <span className="absolute -inset-x-0.5 inset-y-0 bg-indigo-500/30 border-l-2 border-indigo-400 animate-pulse rounded-sm" />
                )}
                <span className={charClass}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              </span>
            );
          })}
        </div>

        {/* Completion congratulations overlay if finished */}
        {isCompleted && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3 animate-bounce" />
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
              Exercice terminé avec succès !
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              Vitesse : <strong className="text-indigo-400">{currentWpm} WPM</strong> · Précision :{' '}
              <strong className="text-emerald-400">{currentAccuracy}%</strong>
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleRestart}
                className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-600/30"
              >
                Recommencer cet exercice
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Virtual Hands component */}
      {showHands && !isCompleted && (
        <div className="w-full mb-6 flex justify-center">
          <VirtualHands nextChar={nextChar} layout={layout} />
        </div>
      )}

      {/* Virtual Keyboard component */}
      {showKeyboard && !isCompleted && (
        <div className="w-full">
          <VirtualKeyboard
            layout={layout}
            nextChar={nextChar}
            activePhysicalKey={activePhysicalKey}
            lastErrorKey={lastErrorKey}
          />
        </div>
      )}
    </div>
  );
};
