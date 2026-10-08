import { SwitchSoundType } from '../types';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playKeySound(type: SwitchSoundType, isSpace = false) {
  if (type === 'off') return;

  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    switch (type) {
      case 'cherry-blue': {
        // High crisp tactile click + mechanical bottom out
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(isSpace ? 480 : 1200 + Math.random() * 200, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.04);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);

        // Secondary subtle click
        const snap = ctx.createOscillator();
        const snapGain = ctx.createGain();
        snap.type = 'square';
        snap.frequency.setValueAtTime(3400, now);
        snap.frequency.exponentialRampToValueAtTime(800, now + 0.015);
        snapGain.gain.setValueAtTime(0.12, now);
        snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
        snap.connect(snapGain);
        snapGain.connect(ctx.destination);
        snap.start(now);
        snap.stop(now + 0.02);
        break;
      }

      case 'cherry-brown': {
        // Subtle tactile bump, softer click
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(isSpace ? 320 : 640 + Math.random() * 60, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.05);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
        break;
      }

      case 'cherry-red': {
        // Smooth linear bottom-out thud
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(isSpace ? 220 : 380 + Math.random() * 40, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.06);

        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.07);
        break;
      }

      case 'thock': {
        // Deep, hollow, lubed custom mechanical keyboard thock
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(isSpace ? 140 : 220 + Math.random() * 30, now);
        osc.frequency.exponentialRampToValueAtTime(65, now + 0.08);

        // Lowpass filter for deep warmth
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, now);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
        break;
      }

      case 'typewriter': {
        // Metallic retro clack
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(isSpace ? 750 : 1600 + Math.random() * 300, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
        break;
      }

      case 'bubble': {
        // Friendly playful bubble pop
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500 + Math.random() * 200, now);
        osc.frequency.exponentialRampToValueAtTime(1400, now + 0.05);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
        break;
      }
    }
  } catch {
    // Audio context may be restricted before user gesture
  }
}

// Error sound buzzer
export function playErrorSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.setValueAtTime(140, now + 0.05);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.13);
  } catch {}
}

// Success chime
export function playSuccessChime() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(0.15, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.26);
    });
  } catch {}
}

// TTS Audio player using Gemini TTS gemini-3.8-flash-tts with Web Speech fallback
let currentAudioElement: HTMLAudioElement | null = null;

export async function speakText(text: string, voice = 'Kore'): Promise<void> {
  // Stop current if playing
  if (currentAudioElement) {
    currentAudioElement.pause();
    currentAudioElement = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  try {
    const response = await fetch('/api/gemini/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        voice,
        style: 'Clair, naturel, encourageant pour l\'apprentissage de la frappe',
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.audio) {
        const audio = new Audio(data.audio);
        currentAudioElement = audio;
        await audio.play();
        return;
      }
    }
  } catch (err) {
    console.warn('Gemini TTS failed, falling back to Web Speech API', err);
  }

  // Fallback to browser SpeechSynthesis
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }
}

export function stopSpeaking() {
  if (currentAudioElement) {
    currentAudioElement.pause();
    currentAudioElement = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
