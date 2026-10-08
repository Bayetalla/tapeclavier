import React from 'react';
import { KeyboardLayoutType, KeyInfo } from '../types';
import { FINGER_COLORS, findKeyForChar, getLayoutKeys } from '../utils/keyboardLayouts';

interface VirtualKeyboardProps {
  layout: KeyboardLayoutType;
  nextChar: string | null;
  activePhysicalKey?: string | null;
  lastErrorKey?: string | null;
  heatMapData?: Record<string, number>; // key -> error rate 0..100
  showFingerColors?: boolean;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  layout,
  nextChar,
  activePhysicalKey,
  lastErrorKey,
  heatMapData,
  showFingerColors = true,
}) => {
  const rows = getLayoutKeys(layout);
  const targetInfo = nextChar ? findKeyForChar(nextChar, layout) : null;
  const targetCode = targetInfo?.key?.code || null;
  const requiresShift = targetInfo?.requiresShift || false;

  return (
    <div className="w-full max-w-4xl mx-auto p-3 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-md select-none">
      <div className="flex flex-col gap-1.5">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1.5 justify-center w-full">
            {row.map((key) => {
              const isTarget = targetCode === key.code;
              const isShiftActive =
                requiresShift && (key.code === 'ShiftLeft' || key.code === 'ShiftRight');
              const isPressed = activePhysicalKey === key.code;
              const isError = lastErrorKey === key.code;
              const fingerColor = FINGER_COLORS[key.finger];

              // Heatmap error color if in heatmap mode
              let heatColor: string | null = null;
              if (heatMapData) {
                const charKey = key.display.toLowerCase();
                const errRate = heatMapData[charKey];
                if (errRate !== undefined) {
                  if (errRate > 15) heatColor = 'bg-rose-500/30 border-rose-500/60 text-rose-200';
                  else if (errRate > 5) heatColor = 'bg-amber-500/30 border-amber-500/60 text-amber-200';
                  else heatColor = 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200';
                }
              }

              // Dynamic width based on key.width (1 = flex-1, 1.5 = flex-[1.5], etc.)
              const widthStyle = key.width
                ? { flex: `${key.width} 0 0%` }
                : { flex: '1 0 0%' };

              return (
                <div
                  key={key.code}
                  style={widthStyle}
                  className={`
                    relative h-11 sm:h-12 rounded-lg flex flex-col items-center justify-center transition-all duration-100 border
                    ${isPressed ? 'scale-95 translate-y-0.5' : ''}
                    ${
                      isError
                        ? 'bg-rose-600/40 border-rose-500 text-rose-100 shadow-[0_0_12px_rgba(244,63,94,0.6)] animate-pulse'
                        : isTarget || isShiftActive
                        ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-[0_0_16px_rgba(99,102,241,0.5)] scale-[1.03] z-10'
                        : isPressed
                        ? 'bg-slate-700 border-slate-500 text-white shadow-inner'
                        : heatColor
                        ? heatColor
                        : 'bg-slate-800/80 border-slate-700/80 text-slate-200 hover:bg-slate-700/60'
                    }
                  `}
                >
                  {/* Finger accent line at top of key */}
                  {showFingerColors && (
                    <div
                      className="absolute top-0.5 inset-x-2 h-0.5 rounded-full opacity-60"
                      style={{ backgroundColor: fingerColor }}
                    />
                  )}

                  {/* Shift label at top right */}
                  {key.shiftDisplay && (
                    <span className="text-[10px] text-slate-400 leading-none">
                      {key.shiftDisplay}
                    </span>
                  )}

                  {/* Main display label */}
                  <span
                    className={`font-mono font-medium ${
                      key.display.length > 1 ? 'text-[11px] sm:text-xs' : 'text-sm sm:text-base'
                    }`}
                  >
                    {key.display}
                  </span>

                  {/* Tactile marker bump for F and J home row */}
                  {key.isHomeKey && (
                    <div className="absolute bottom-1 w-2.5 h-0.5 rounded-full bg-slate-400/80" />
                  )}

                  {/* Target glow ring pulse */}
                  {isTarget && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
