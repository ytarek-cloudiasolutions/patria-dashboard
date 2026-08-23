let audioCtx: AudioContext | null = null;

/** Two-tone notification beep — no audio file needed, works after any user interaction unlocks audio. */
export function playNotificationSound() {
  try {
    const AudioContextCtor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx ??= new AudioContextCtor();
    if (audioCtx.state === "suspended") audioCtx.resume();

    const now = audioCtx.currentTime;
    [880, 1175].forEach((freq, i) => {
      const osc = audioCtx!.createOscillator();
      const gain = audioCtx!.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const start = now + i * 0.18;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.3, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.16);
      osc.connect(gain).connect(audioCtx!.destination);
      osc.start(start);
      osc.stop(start + 0.18);
    });
  } catch {
    // Audio not available (e.g. autoplay blocked before first user interaction) — ignore
  }
}

let loopTimer: ReturnType<typeof setInterval> | null = null;

/** Repeats the two-tone beep every 1.5s until stopLoopingAlert() is called —
 * for alerts that must keep the staff's attention until they act (e.g. a
 * new incoming order), not just a one-shot "something happened" chime. */
export function startLoopingAlert() {
  if (loopTimer) return; // already looping
  playNotificationSound();
  loopTimer = setInterval(playNotificationSound, 1500);
}

export function stopLoopingAlert() {
  if (loopTimer) {
    clearInterval(loopTimer);
    loopTimer = null;
  }
}
