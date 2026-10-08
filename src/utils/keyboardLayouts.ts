import { FingerId, KeyInfo, KeyboardLayoutType } from '../types';

export const FINGER_NAMES: Record<FingerId, string> = {
  leftPinky: 'Auriculaire Gauche',
  leftRing: 'Annulaire Gauche',
  leftMiddle: 'Majeur Gauche',
  leftIndex: 'Index Gauche',
  leftThumb: 'Pouce',
  rightThumb: 'Pouce',
  rightIndex: 'Index Droit',
  rightMiddle: 'Majeur Droit',
  rightRing: 'Annulaire Droit',
  rightPinky: 'Auriculaire Droit',
};

export const FINGER_COLORS: Record<FingerId, string> = {
  leftPinky: '#ec4899',   // pink
  leftRing: '#a855f7',    // purple
  leftMiddle: '#3b82f6',  // blue
  leftIndex: '#06b6d4',   // cyan
  leftThumb: '#10b981',   // emerald
  rightThumb: '#10b981',  // emerald
  rightIndex: '#14b8a6',  // teal
  rightMiddle: '#f59e0b', // amber
  rightRing: '#f97316',   // orange
  rightPinky: '#ef4444',  // red/coral
};

// AZERTY Keyboard definition (standard French layout)
export const AZERTY_KEYS: KeyInfo[][] = [
  // Row 0: Numbers & symbols
  [
    { code: 'Backquote', display: '²', shiftDisplay: '', finger: 'leftPinky', hand: 'left', row: 0, width: 1 },
    { code: 'Digit1', display: '&', shiftDisplay: '1', finger: 'leftPinky', hand: 'left', row: 0, width: 1 },
    { code: 'Digit2', display: 'é', shiftDisplay: '2', altGrDisplay: '~', finger: 'leftRing', hand: 'left', row: 0, width: 1 },
    { code: 'Digit3', display: '"', shiftDisplay: '3', altGrDisplay: '#', finger: 'leftMiddle', hand: 'left', row: 0, width: 1 },
    { code: 'Digit4', display: '\'', shiftDisplay: '4', altGrDisplay: '{', finger: 'leftIndex', hand: 'left', row: 0, width: 1 },
    { code: 'Digit5', display: '(', shiftDisplay: '5', altGrDisplay: '[', finger: 'leftIndex', hand: 'left', row: 0, width: 1 },
    { code: 'Digit6', display: '-', shiftDisplay: '6', altGrDisplay: '|', finger: 'rightIndex', hand: 'right', row: 0, width: 1 },
    { code: 'Digit7', display: 'è', shiftDisplay: '7', altGrDisplay: '`', finger: 'rightIndex', hand: 'right', row: 0, width: 1 },
    { code: 'Digit8', display: '_', shiftDisplay: '8', altGrDisplay: '\\', finger: 'rightMiddle', hand: 'right', row: 0, width: 1 },
    { code: 'Digit9', display: 'ç', shiftDisplay: '9', altGrDisplay: '^', finger: 'rightRing', hand: 'right', row: 0, width: 1 },
    { code: 'Digit0', display: 'à', shiftDisplay: '0', altGrDisplay: '@', finger: 'rightPinky', hand: 'right', row: 0, width: 1 },
    { code: 'Minus', display: ')', shiftDisplay: '°', altGrDisplay: ']', finger: 'rightPinky', hand: 'right', row: 0, width: 1 },
    { code: 'Equal', display: '=', shiftDisplay: '+', altGrDisplay: '}', finger: 'rightPinky', hand: 'right', row: 0, width: 1 },
    { code: 'Backspace', display: '⌫', finger: 'rightPinky', hand: 'right', row: 0, width: 1.8 },
  ],
  // Row 1: Top row
  [
    { code: 'Tab', display: 'Tab ⇥', finger: 'leftPinky', hand: 'left', row: 1, width: 1.5 },
    { code: 'KeyA', display: 'a', shiftDisplay: 'A', finger: 'leftPinky', hand: 'left', row: 1, width: 1 },
    { code: 'KeyZ', display: 'z', shiftDisplay: 'Z', finger: 'leftRing', hand: 'left', row: 1, width: 1 },
    { code: 'KeyE', display: 'e', shiftDisplay: 'E', altGrDisplay: '€', finger: 'leftMiddle', hand: 'left', row: 1, width: 1 },
    { code: 'KeyR', display: 'r', shiftDisplay: 'R', finger: 'leftIndex', hand: 'left', row: 1, width: 1 },
    { code: 'KeyT', display: 't', shiftDisplay: 'T', finger: 'leftIndex', hand: 'left', row: 1, width: 1 },
    { code: 'KeyY', display: 'y', shiftDisplay: 'Y', finger: 'rightIndex', hand: 'right', row: 1, width: 1 },
    { code: 'KeyU', display: 'u', shiftDisplay: 'U', finger: 'rightIndex', hand: 'right', row: 1, width: 1 },
    { code: 'KeyI', display: 'i', shiftDisplay: 'I', finger: 'rightMiddle', hand: 'right', row: 1, width: 1 },
    { code: 'KeyO', display: 'o', shiftDisplay: 'O', finger: 'rightRing', hand: 'right', row: 1, width: 1 },
    { code: 'KeyP', display: 'p', shiftDisplay: 'P', finger: 'rightPinky', hand: 'right', row: 1, width: 1 },
    { code: 'BracketLeft', display: '^', shiftDisplay: '¨', finger: 'rightPinky', hand: 'right', row: 1, width: 1 },
    { code: 'BracketRight', display: '$', shiftDisplay: '£', altGrDisplay: '¤', finger: 'rightPinky', hand: 'right', row: 1, width: 1 },
    { code: 'Enter', display: '↵ Entrée', finger: 'rightPinky', hand: 'right', row: 1, width: 1.3 },
  ],
  // Row 2: Home row
  [
    { code: 'CapsLock', display: 'Caps ⇪', finger: 'leftPinky', hand: 'left', row: 2, width: 1.8 },
    { code: 'KeyQ', display: 'q', shiftDisplay: 'Q', finger: 'leftPinky', hand: 'left', row: 2, width: 1 },
    { code: 'KeyS', display: 's', shiftDisplay: 'S', finger: 'leftRing', hand: 'left', row: 2, width: 1 },
    { code: 'KeyD', display: 'd', shiftDisplay: 'D', finger: 'leftMiddle', hand: 'left', row: 2, width: 1 },
    { code: 'KeyF', display: 'f', shiftDisplay: 'F', finger: 'leftIndex', hand: 'left', row: 2, width: 1, isHomeKey: true },
    { code: 'KeyG', display: 'g', shiftDisplay: 'G', finger: 'leftIndex', hand: 'left', row: 2, width: 1 },
    { code: 'KeyH', display: 'h', shiftDisplay: 'H', finger: 'rightIndex', hand: 'right', row: 2, width: 1 },
    { code: 'KeyJ', display: 'j', shiftDisplay: 'J', finger: 'rightIndex', hand: 'right', row: 2, width: 1, isHomeKey: true },
    { code: 'KeyK', display: 'k', shiftDisplay: 'K', finger: 'rightMiddle', hand: 'right', row: 2, width: 1 },
    { code: 'KeyL', display: 'l', shiftDisplay: 'L', finger: 'rightRing', hand: 'right', row: 2, width: 1 },
    { code: 'KeyM', display: 'm', shiftDisplay: 'M', finger: 'rightPinky', hand: 'right', row: 2, width: 1 },
    { code: 'Quote', display: 'ù', shiftDisplay: '%', finger: 'rightPinky', hand: 'right', row: 2, width: 1 },
    { code: 'Backslash', display: '*', shiftDisplay: 'µ', finger: 'rightPinky', hand: 'right', row: 2, width: 1.2 },
  ],
  // Row 3: Bottom row
  [
    { code: 'ShiftLeft', display: '⇧ Maj', finger: 'leftPinky', hand: 'left', row: 3, width: 2.2 },
    { code: 'KeyW', display: 'w', shiftDisplay: 'W', finger: 'leftPinky', hand: 'left', row: 3, width: 1 },
    { code: 'KeyX', display: 'x', shiftDisplay: 'X', finger: 'leftRing', hand: 'left', row: 3, width: 1 },
    { code: 'KeyC', display: 'c', shiftDisplay: 'C', finger: 'leftMiddle', hand: 'left', row: 3, width: 1 },
    { code: 'KeyV', display: 'v', shiftDisplay: 'V', finger: 'leftIndex', hand: 'left', row: 3, width: 1 },
    { code: 'KeyB', display: 'b', shiftDisplay: 'B', finger: 'leftIndex', hand: 'left', row: 3, width: 1 },
    { code: 'KeyN', display: 'n', shiftDisplay: 'N', finger: 'rightIndex', hand: 'right', row: 3, width: 1 },
    { code: 'Comma', display: ',', shiftDisplay: '?', finger: 'rightIndex', hand: 'right', row: 3, width: 1 },
    { code: 'Period', display: ';', shiftDisplay: '.', finger: 'rightMiddle', hand: 'right', row: 3, width: 1 },
    { code: 'Slash', display: ':', shiftDisplay: '/', finger: 'rightRing', hand: 'right', row: 3, width: 1 },
    { code: 'IntlBackslash', display: '!', shiftDisplay: '§', finger: 'rightPinky', hand: 'right', row: 3, width: 1 },
    { code: 'ShiftRight', display: '⇧ Maj', finger: 'rightPinky', hand: 'right', row: 3, width: 2.3 },
  ],
  // Row 4: Space row
  [
    { code: 'ControlLeft', display: 'Ctrl', finger: 'leftPinky', hand: 'left', row: 4, width: 1.5 },
    { code: 'AltLeft', display: 'Alt', finger: 'leftThumb', hand: 'left', row: 4, width: 1.5 },
    { code: 'Space', display: 'Espace', finger: 'rightThumb', hand: 'right', row: 4, width: 6.5 },
    { code: 'AltRight', display: 'Alt Gr', finger: 'rightThumb', hand: 'right', row: 4, width: 1.5 },
    { code: 'ControlRight', display: 'Ctrl', finger: 'rightPinky', hand: 'right', row: 4, width: 1.5 },
  ],
];

// QWERTY Keyboard definition (US Standard layout)
export const QWERTY_KEYS: KeyInfo[][] = [
  // Row 0
  [
    { code: 'Backquote', display: '`', shiftDisplay: '~', finger: 'leftPinky', hand: 'left', row: 0, width: 1 },
    { code: 'Digit1', display: '1', shiftDisplay: '!', finger: 'leftPinky', hand: 'left', row: 0, width: 1 },
    { code: 'Digit2', display: '2', shiftDisplay: '@', finger: 'leftRing', hand: 'left', row: 0, width: 1 },
    { code: 'Digit3', display: '3', shiftDisplay: '#', finger: 'leftMiddle', hand: 'left', row: 0, width: 1 },
    { code: 'Digit4', display: '4', shiftDisplay: '$', finger: 'leftIndex', hand: 'left', row: 0, width: 1 },
    { code: 'Digit5', display: '5', shiftDisplay: '%', finger: 'leftIndex', hand: 'left', row: 0, width: 1 },
    { code: 'Digit6', display: '6', shiftDisplay: '^', finger: 'rightIndex', hand: 'right', row: 0, width: 1 },
    { code: 'Digit7', display: '7', shiftDisplay: '&', finger: 'rightIndex', hand: 'right', row: 0, width: 1 },
    { code: 'Digit8', display: '8', shiftDisplay: '*', finger: 'rightMiddle', hand: 'right', row: 0, width: 1 },
    { code: 'Digit9', display: '9', shiftDisplay: '(', finger: 'rightRing', hand: 'right', row: 0, width: 1 },
    { code: 'Digit0', display: '0', shiftDisplay: ')', finger: 'rightPinky', hand: 'right', row: 0, width: 1 },
    { code: 'Minus', display: '-', shiftDisplay: '_', finger: 'rightPinky', hand: 'right', row: 0, width: 1 },
    { code: 'Equal', display: '=', shiftDisplay: '+', finger: 'rightPinky', hand: 'right', row: 0, width: 1 },
    { code: 'Backspace', display: '⌫', finger: 'rightPinky', hand: 'right', row: 0, width: 1.8 },
  ],
  // Row 1
  [
    { code: 'Tab', display: 'Tab ⇥', finger: 'leftPinky', hand: 'left', row: 1, width: 1.5 },
    { code: 'KeyQ', display: 'q', shiftDisplay: 'Q', finger: 'leftPinky', hand: 'left', row: 1, width: 1 },
    { code: 'KeyW', display: 'w', shiftDisplay: 'W', finger: 'leftRing', hand: 'left', row: 1, width: 1 },
    { code: 'KeyE', display: 'e', shiftDisplay: 'E', finger: 'leftMiddle', hand: 'left', row: 1, width: 1 },
    { code: 'KeyR', display: 'r', shiftDisplay: 'R', finger: 'leftIndex', hand: 'left', row: 1, width: 1 },
    { code: 'KeyT', display: 't', shiftDisplay: 'T', finger: 'leftIndex', hand: 'left', row: 1, width: 1 },
    { code: 'KeyY', display: 'y', shiftDisplay: 'Y', finger: 'rightIndex', hand: 'right', row: 1, width: 1 },
    { code: 'KeyU', display: 'u', shiftDisplay: 'U', finger: 'rightIndex', hand: 'right', row: 1, width: 1 },
    { code: 'KeyI', display: 'i', shiftDisplay: 'I', finger: 'rightMiddle', hand: 'right', row: 1, width: 1 },
    { code: 'KeyO', display: 'o', shiftDisplay: 'O', finger: 'rightRing', hand: 'right', row: 1, width: 1 },
    { code: 'KeyP', display: 'p', shiftDisplay: 'P', finger: 'rightPinky', hand: 'right', row: 1, width: 1 },
    { code: 'BracketLeft', display: '[', shiftDisplay: '{', finger: 'rightPinky', hand: 'right', row: 1, width: 1 },
    { code: 'BracketRight', display: ']', shiftDisplay: '}', finger: 'rightPinky', hand: 'right', row: 1, width: 1 },
    { code: 'Backslash', display: '\\', shiftDisplay: '|', finger: 'rightPinky', hand: 'right', row: 1, width: 1.3 },
  ],
  // Row 2
  [
    { code: 'CapsLock', display: 'Caps ⇪', finger: 'leftPinky', hand: 'left', row: 2, width: 1.8 },
    { code: 'KeyA', display: 'a', shiftDisplay: 'A', finger: 'leftPinky', hand: 'left', row: 2, width: 1 },
    { code: 'KeyS', display: 's', shiftDisplay: 'S', finger: 'leftRing', hand: 'left', row: 2, width: 1 },
    { code: 'KeyD', display: 'd', shiftDisplay: 'D', finger: 'leftMiddle', hand: 'left', row: 2, width: 1 },
    { code: 'KeyF', display: 'f', shiftDisplay: 'F', finger: 'leftIndex', hand: 'left', row: 2, width: 1, isHomeKey: true },
    { code: 'KeyG', display: 'g', shiftDisplay: 'G', finger: 'leftIndex', hand: 'left', row: 2, width: 1 },
    { code: 'KeyH', display: 'h', shiftDisplay: 'H', finger: 'rightIndex', hand: 'right', row: 2, width: 1 },
    { code: 'KeyJ', display: 'j', shiftDisplay: 'J', finger: 'rightIndex', hand: 'right', row: 2, width: 1, isHomeKey: true },
    { code: 'KeyK', display: 'k', shiftDisplay: 'K', finger: 'rightMiddle', hand: 'right', row: 2, width: 1 },
    { code: 'KeyL', display: 'l', shiftDisplay: 'L', finger: 'rightRing', hand: 'right', row: 2, width: 1 },
    { code: 'Semicolon', display: ';', shiftDisplay: ':', finger: 'rightPinky', hand: 'right', row: 2, width: 1 },
    { code: 'Quote', display: '\'', shiftDisplay: '"', finger: 'rightPinky', hand: 'right', row: 2, width: 1 },
    { code: 'Enter', display: '↵ Enter', finger: 'rightPinky', hand: 'right', row: 2, width: 2.2 },
  ],
  // Row 3
  [
    { code: 'ShiftLeft', display: '⇧ Shift', finger: 'leftPinky', hand: 'left', row: 3, width: 2.3 },
    { code: 'KeyZ', display: 'z', shiftDisplay: 'Z', finger: 'leftPinky', hand: 'left', row: 3, width: 1 },
    { code: 'KeyX', display: 'x', shiftDisplay: 'X', finger: 'leftRing', hand: 'left', row: 3, width: 1 },
    { code: 'KeyC', display: 'c', shiftDisplay: 'C', finger: 'leftMiddle', hand: 'left', row: 3, width: 1 },
    { code: 'KeyV', display: 'v', shiftDisplay: 'V', finger: 'leftIndex', hand: 'left', row: 3, width: 1 },
    { code: 'KeyB', display: 'b', shiftDisplay: 'B', finger: 'leftIndex', hand: 'left', row: 3, width: 1 },
    { code: 'KeyN', display: 'n', shiftDisplay: 'N', finger: 'rightIndex', hand: 'right', row: 3, width: 1 },
    { code: 'KeyM', display: 'm', shiftDisplay: 'M', finger: 'rightIndex', hand: 'right', row: 3, width: 1 },
    { code: 'Comma', display: ',', shiftDisplay: '<', finger: 'rightMiddle', hand: 'right', row: 3, width: 1 },
    { code: 'Period', display: '.', shiftDisplay: '>', finger: 'rightRing', hand: 'right', row: 3, width: 1 },
    { code: 'Slash', display: '/', shiftDisplay: '?', finger: 'rightPinky', hand: 'right', row: 3, width: 1 },
    { code: 'ShiftRight', display: '⇧ Shift', finger: 'rightPinky', hand: 'right', row: 3, width: 2.5 },
  ],
  // Row 4
  [
    { code: 'ControlLeft', display: 'Ctrl', finger: 'leftPinky', hand: 'left', row: 4, width: 1.5 },
    { code: 'AltLeft', display: 'Alt', finger: 'leftThumb', hand: 'left', row: 4, width: 1.5 },
    { code: 'Space', display: 'Space', finger: 'rightThumb', hand: 'right', row: 4, width: 6.5 },
    { code: 'AltRight', display: 'Alt', finger: 'rightThumb', hand: 'right', row: 4, width: 1.5 },
    { code: 'ControlRight', display: 'Ctrl', finger: 'rightPinky', hand: 'right', row: 4, width: 1.5 },
  ],
];

// QWERTZ Keyboard definition (German layout)
export const QWERTZ_KEYS: KeyInfo[][] = [
  // Similar to QWERTY but with Z and Y swapped, and umlauts
  ...QWERTY_KEYS.map((row) =>
    row.map((k) => {
      if (k.code === 'KeyZ') return { ...k, display: 'y', shiftDisplay: 'Y', code: 'KeyY' };
      if (k.code === 'KeyY') return { ...k, display: 'z', shiftDisplay: 'Z', code: 'KeyZ' };
      return k;
    })
  ),
];

export function getLayoutKeys(layout: KeyboardLayoutType): KeyInfo[][] {
  switch (layout) {
    case 'azerty':
      return AZERTY_KEYS;
    case 'qwertz':
      return QWERTZ_KEYS;
    case 'qwerty':
    default:
      return QWERTY_KEYS;
  }
}

// Find key definition matching a given target character
export function findKeyForChar(char: string, layout: KeyboardLayoutType): { key: KeyInfo | null; requiresShift: boolean; requiresAltGr: boolean } {
  const rows = getLayoutKeys(layout);
  if (char === ' ') {
    return {
      key: { code: 'Space', display: 'Espace', finger: 'rightThumb', hand: 'right', row: 4 },
      requiresShift: false,
      requiresAltGr: false,
    };
  }

  for (const row of rows) {
    for (const key of row) {
      if (key.display === char) {
        return { key, requiresShift: false, requiresAltGr: false };
      }
      if (key.shiftDisplay === char) {
        return { key, requiresShift: true, requiresAltGr: false };
      }
      if (key.altGrDisplay === char) {
        return { key, requiresShift: false, requiresAltGr: true };
      }
      // Upper/lower case fallback
      if (key.display.toLowerCase() === char.toLowerCase()) {
        const isUpper = char === char.toUpperCase() && char !== char.toLowerCase();
        return { key, requiresShift: isUpper, requiresAltGr: false };
      }
    }
  }

  return { key: null, requiresShift: false, requiresAltGr: false };
}
