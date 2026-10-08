import React from 'react';
import { FingerId, KeyboardLayoutType } from '../types';
import { FINGER_COLORS, FINGER_NAMES, findKeyForChar } from '../utils/keyboardLayouts';

interface VirtualHandsProps {
  nextChar: string | null;
  layout: KeyboardLayoutType;
}

export const VirtualHands: React.FC<VirtualHandsProps> = ({ nextChar, layout }) => {
  const targetInfo = nextChar ? findKeyForChar(nextChar, layout) : null;
  const activeFinger: FingerId | null = targetInfo?.key?.finger || null;

  const fingersLeft: { id: FingerId; label: string; x: number; y: number; h: number; w: number; r: number }[] = [
    { id: 'leftPinky', label: 'Auriculaire', x: 26, y: 72, h: 48, w: 14, r: -16 },
    { id: 'leftRing', label: 'Annulaire', x: 45, y: 50, h: 62, w: 15, r: -7 },
    { id: 'leftMiddle', label: 'Majeur', x: 67, y: 40, h: 70, w: 15, r: 0 },
    { id: 'leftIndex', label: 'Index', x: 89, y: 48, h: 62, w: 15, r: 8 },
    { id: 'leftThumb', label: 'Pouce', x: 114, y: 92, h: 44, w: 16, r: 35 },
  ];

  const fingersRight: { id: FingerId; label: string; x: number; y: number; h: number; w: number; r: number }[] = [
    { id: 'rightThumb', label: 'Pouce', x: 26, y: 92, h: 44, w: 16, r: -35 },
    { id: 'rightIndex', label: 'Index', x: 52, y: 48, h: 62, w: 15, r: -8 },
    { id: 'rightMiddle', label: 'Majeur', x: 74, y: 40, h: 70, w: 15, r: 0 },
    { id: 'rightRing', label: 'Annulaire', x: 96, y: 50, h: 62, w: 15, r: 7 },
    { id: 'rightPinky', label: 'Auriculaire', x: 116, y: 72, h: 48, w: 14, r: 16 },
  ];

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      {/* Active finger guidance label */}
      <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/80 border border-slate-800 rounded-full text-xs text-slate-300">
        <span className="w-2.5 h-2.5 rounded-full inline-block animate-pulse" style={{ backgroundColor: activeFinger ? FINGER_COLORS[activeFinger] : '#64748b' }} />
        <span>
          Doigt recommandé :{' '}
          <strong className="text-white font-medium">
            {activeFinger ? FINGER_NAMES[activeFinger] : 'Ligne de repos (F & J)'}
          </strong>
        </span>
      </div>

      <div className="flex items-center justify-center gap-8 sm:gap-16">
        {/* Left Hand */}
        <div className="flex flex-col items-center">
          <svg viewBox="0 0 150 160" className="w-28 sm:w-36 h-28 sm:h-36 drop-shadow-lg">
            {/* Palm base */}
            <path
              d="M 28 110 C 25 140, 50 155, 80 155 C 110 155, 125 135, 120 110 C 115 95, 35 95, 28 110 Z"
              fill="#1e293b"
              stroke="#334155"
              strokeWidth="2"
            />
            {/* Fingers */}
            {fingersLeft.map((f) => {
              const isActive = activeFinger === f.id;
              const color = FINGER_COLORS[f.id];
              return (
                <g key={f.id} transform={`rotate(${f.r} ${f.x + f.w / 2} ${f.y + f.h})`}>
                  <rect
                    x={f.x}
                    y={f.y}
                    width={f.w}
                    height={f.h}
                    rx={f.w / 2}
                    fill={isActive ? color : '#1e293b'}
                    stroke={isActive ? '#ffffff' : '#334155'}
                    strokeWidth={isActive ? '2.5' : '1.5'}
                    className={`transition-all duration-150 ${
                      isActive ? 'filter drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]' : ''
                    }`}
                  />
                  {isActive && (
                    <circle
                      cx={f.x + f.w / 2}
                      cy={f.y + f.w / 2 + 2}
                      r={3}
                      fill="#ffffff"
                    />
                  )}
                </g>
              );
            })}
          </svg>
          <span className="text-[11px] text-slate-400 font-medium mt-1">Main Gauche</span>
        </div>

        {/* Right Hand */}
        <div className="flex flex-col items-center">
          <svg viewBox="0 0 150 160" className="w-28 sm:w-36 h-28 sm:h-36 drop-shadow-lg">
            {/* Palm base */}
            <path
              d="M 122 110 C 125 140, 100 155, 70 155 C 40 155, 25 135, 30 110 C 35 95, 115 95, 122 110 Z"
              fill="#1e293b"
              stroke="#334155"
              strokeWidth="2"
            />
            {/* Fingers */}
            {fingersRight.map((f) => {
              const isActive = activeFinger === f.id;
              const color = FINGER_COLORS[f.id];
              return (
                <g key={f.id} transform={`rotate(${f.r} ${f.x + f.w / 2} ${f.y + f.h})`}>
                  <rect
                    x={f.x}
                    y={f.y}
                    width={f.w}
                    height={f.h}
                    rx={f.w / 2}
                    fill={isActive ? color : '#1e293b'}
                    stroke={isActive ? '#ffffff' : '#334155'}
                    strokeWidth={isActive ? '2.5' : '1.5'}
                    className={`transition-all duration-150 ${
                      isActive ? 'filter drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]' : ''
                    }`}
                  />
                  {isActive && (
                    <circle
                      cx={f.x + f.w / 2}
                      cy={f.y + f.w / 2 + 2}
                      r={3}
                      fill="#ffffff"
                    />
                  )}
                </g>
              );
            })}
          </svg>
          <span className="text-[11px] text-slate-400 font-medium mt-1">Main Droite</span>
        </div>
      </div>
    </div>
  );
};
