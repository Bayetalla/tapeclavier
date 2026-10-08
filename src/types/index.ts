export type KeyboardLayoutType = 'azerty' | 'qwerty' | 'qwertz';

export type FingerId =
  | 'leftPinky'
  | 'leftRing'
  | 'leftMiddle'
  | 'leftIndex'
  | 'leftThumb'
  | 'rightThumb'
  | 'rightIndex'
  | 'rightMiddle'
  | 'rightRing'
  | 'rightPinky';

export interface KeyInfo {
  code: string;
  display: string;
  shiftDisplay?: string;
  altGrDisplay?: string;
  finger: FingerId;
  hand: 'left' | 'right';
  row: number; // 0: numbers, 1: top, 2: home, 3: bottom, 4: space
  width?: number; // relative key width (1 = 1u, 1.5 = tab, 2 = backspace, etc.)
  isHomeKey?: boolean; // F and J
}

export interface KeyStat {
  key: string;
  totalPresses: number;
  errors: number;
  totalTimeMs: number;
}

export interface FingerStat {
  finger: FingerId;
  label: string;
  totalPresses: number;
  errors: number;
}

export interface TypingResult {
  id: string;
  date: string;
  wpm: number;
  cpm: number;
  accuracy: number;
  firstTryAccuracy: number;
  errorCount: number;
  timeSpentSeconds: number;
  mode: string;
  title: string;
  weakKeys: string[];
}

export interface LessonStep {
  id: string;
  title: string;
  instruction: string;
  text: string;
  targetWpm: number;
  targetAccuracy: number;
  keysIntroduced: string[];
}

export interface LessonLevel {
  level: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  steps: LessonStep[];
}

export type ThemeType = 'slate' | 'light' | 'midnight' | 'retro' | 'contrast';

export type SwitchSoundType = 'cherry-blue' | 'cherry-brown' | 'cherry-red' | 'thock' | 'typewriter' | 'bubble' | 'off';

export interface UserProfile {
  name: string;
  avatar: string;
  levelTitle: string;
  animalRank: 'tortoise' | 'hare' | 'fox' | 'leopard' | 'eagle';
  xp: number;
  streakDays: number;
  lastPracticeDate: string;
  preferredLayout: KeyboardLayoutType;
  preferredSound: SwitchSoundType;
  theme: ThemeType;
  dailyGoalMinutes: number;
  todayPracticeMinutes: number;
  targetWpm: number;
  firstTryAccuracyMode: boolean;
  showHands: boolean;
  showKeyboard: boolean;
  soundEnabled: boolean;
}

export interface CertificateData {
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master';
  wpm: number;
  accuracy: number;
  date: string;
  userName: string;
  durationSeconds: number;
}
