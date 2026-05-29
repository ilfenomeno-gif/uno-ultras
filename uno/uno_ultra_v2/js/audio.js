let audioCtx = null;

function getAudioCtx() {
  if (audioCtx) return audioCtx;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  } catch {
    audioCtx = null;
  }
  return audioCtx;
}

function tone(freq, durMs, volume = 0.08, type = "triangle") {
  const ac = getAudioCtx();
  if (!ac) return;

  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = volume;

  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + durMs / 1000);
}

export function createAudioSystem(options = {}) {
  let enabled = options.enabled ?? true;
  let musicEnabled = options.musicEnabled ?? true;

  return {
    setEnabled(value) {
      enabled = !!value;
    },
    setMusicEnabled(value) {
      musicEnabled = !!value;
    },
    playClick() {
      if (!enabled) return;
      tone(520, 60);
    },
    playDraw() {
      if (!enabled) return;
      tone(360, 90);
    },
    playWin() {
      if (!enabled) return;
      tone(620, 90);
      setTimeout(() => tone(780, 120), 90);
      setTimeout(() => tone(980, 160), 220);
    },
    pulseMusic() {
      if (!enabled || !musicEnabled) return;
      tone(220, 180, 0.03, "sine");
    },
  };
}
