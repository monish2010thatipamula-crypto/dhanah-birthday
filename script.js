/* ==========================================================================
   Happy Birthday Dhanah - Luxury Royal Sisterhood Edition Scripts
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeroButtons();
  initConfettiCannon();
  initStoryViewer();
  initMidnightFireworksEngine();
  initAudioAndVisualizer();
  initCakeMicrophoneSensor();
  initSisterhoodQuiz();
  initMemoryCarousel();
  init3DPresentBox();
  initSisterhoodLetter();
  initJourneyDock();
  initCountdown();

  // Subtle opening golden sparkle
  setTimeout(() => {
    fireConfetti({ particleCount: 50, originY: 0.4 });
  }, 700);
});

/* ==========================================================================
   1. HERO TWO BUTTONS LOGIC
   ========================================================================== */
function initHeroButtons() {
  const storiesBtn = document.getElementById('hero-btn-stories');
  const adventuresBtn = document.getElementById('hero-btn-adventures');
  const adventuresContainer = document.getElementById('adventures-container');
  const unlockedHint = document.getElementById('hero-unlocked-hint');

  if (storiesBtn) {
    storiesBtn.addEventListener('click', () => {
      openStoryModal();
    });
  }

  if (adventuresBtn) {
    adventuresBtn.addEventListener('click', () => {
      if (adventuresContainer) {
        adventuresContainer.style.display = 'block';
        if (unlockedHint) unlockedHint.style.display = 'block';

        playBellTone(659.25, 0.2);
        fireConfetti({ particleCount: 60, originX: 0.5, originY: 0.7 });

        setTimeout(() => {
          const firstSection = document.getElementById('sec-countdown');
          if (firstSection) {
            firstSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 200);
      }
    });
  }
}

/* ==========================================================================
   2. MIDNIGHT STARRY SKY & FIREWORKS SIMULATION
   ========================================================================== */
let fireworksRunning = false;
let fireworksAnimId = null;
let fireworksList = [];
let particlesList = [];
let starsList = [];
const fwCanvas = document.getElementById('fireworks-canvas');
const fwCtx = fwCanvas ? fwCanvas.getContext('2d') : null;

function resizeFireworksCanvas() {
  if (!fwCanvas) return;
  fwCanvas.width = window.innerWidth;
  fwCanvas.height = window.innerHeight;
  initStars();
}
window.addEventListener('resize', resizeFireworksCanvas);

function initStars() {
  starsList = [];
  const starCount = Math.floor((window.innerWidth * window.innerHeight) / 3000);
  for (let i = 0; i < starCount; i++) {
    starsList.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.8 + 0.2,
      flickerSpeed: Math.random() * 0.02 + 0.01
    });
  }
}

const FW_PALETTES = [
  ['#ffd700', '#ffea70', '#fff3b0'], // Gold
  ['#ff007f', '#ff5277', '#ff8da1'], // Rose Pink
  ['#00f0ff', '#70e4ef', '#bbf5f9'], // Cyan
  ['#9d4edd', '#c77dff', '#e0aaff'], // Violet
  ['#06d6a0', '#70f3c5', '#bdfbe3'], // Emerald
  ['#ff5400', '#ff8500', '#ffb703']  // Sunset Orange
];

class Rocket {
  constructor() {
    this.x = Math.random() * (fwCanvas.width * 0.8) + fwCanvas.width * 0.1;
    this.y = fwCanvas.height;
    this.targetY = Math.random() * (fwCanvas.height * 0.45) + fwCanvas.height * 0.15;
    this.speed = Math.random() * 4 + 11;
    this.angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.18;
    this.vx = Math.cos(this.angle) * this.speed;
    this.vy = Math.sin(this.angle) * this.speed;
    this.palette = FW_PALETTES[Math.floor(Math.random() * FW_PALETTES.length)];
    this.trail = [];
  }

  update() {
    this.trail.push({ x: this.x, y: this.y, alpha: 1 });
    if (this.trail.length > 7) this.trail.shift();

    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.14; // Gravity slowing down rocket

    return this.vy >= 0 || this.y <= this.targetY;
  }

  draw(ctx) {
    ctx.save();
    for (let i = 0; i < this.trail.length; i++) {
      const pt = this.trail[i];
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = this.palette[0];
      ctx.globalAlpha = (i / this.trail.length) * 0.8;
      ctx.fill();
    }
    ctx.restore();
  }
}

class SparkleParticle {
  constructor(x, y, palette) {
    this.x = x;
    this.y = y;
    this.color = palette[Math.floor(Math.random() * palette.length)];
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 7 + 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.friction = 0.96;
    this.gravity = 0.14;
    this.alpha = 1;
    this.decay = Math.random() * 0.016 + 0.012;
    this.radius = Math.random() * 2.5 + 1.5;
  }

  update() {
    this.vx *= this.friction;
    this.vy = (this.vy * this.friction) + this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.decay;
  }

  draw(ctx) {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.color;
    ctx.fill();
    ctx.restore();
  }
}

function launchExplosion(x, y, palette) {
  const count = Math.floor(Math.random() * 35) + 65;
  for (let i = 0; i < count; i++) {
    particlesList.push(new SparkleParticle(x, y, palette));
  }
  playBellTone(783.99 + (Math.random() - 0.5) * 200, 0.15);
}

function fireworksLoop() {
  if (!fireworksRunning || !fwCtx || !fwCanvas) return;

  // Dark cosmic trail fade
  fwCtx.fillStyle = 'rgba(3, 2, 12, 0.25)';
  fwCtx.fillRect(0, 0, fwCanvas.width, fwCanvas.height);

  // Draw twinkling stars
  for (let star of starsList) {
    star.alpha += (Math.random() - 0.5) * star.flickerSpeed;
    star.alpha = Math.max(0.1, Math.min(0.9, star.alpha));
    fwCtx.beginPath();
    fwCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    fwCtx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
    fwCtx.fill();
  }

  // Random rocket generation
  if (Math.random() < 0.055) {
    fireworksList.push(new Rocket());
  }

  // Update rockets
  for (let i = fireworksList.length - 1; i >= 0; i--) {
    const r = fireworksList[i];
    const exploded = r.update();
    r.draw(fwCtx);
    if (exploded) {
      launchExplosion(r.x, r.y, r.palette);
      fireworksList.splice(i, 1);
    }
  }

  // Update particles
  for (let i = particlesList.length - 1; i >= 0; i--) {
    const p = particlesList[i];
    p.update();
    p.draw(fwCtx);
    if (p.alpha <= 0) {
      particlesList.splice(i, 1);
    }
  }

  fireworksAnimId = requestAnimationFrame(fireworksLoop);
}

function openMidnightSky() {
  const modal = document.getElementById('midnight-fireworks-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  resizeFireworksCanvas();
  fireworksRunning = true;
  fireworksLoop();

  // Initial volley
  setTimeout(() => fireworksList.push(new Rocket()), 100);
  setTimeout(() => fireworksList.push(new Rocket()), 350);
  setTimeout(() => fireworksList.push(new Rocket()), 650);

  playFanfare();
}

function closeMidnightSky() {
  const modal = document.getElementById('midnight-fireworks-modal');
  if (!modal) return;
  modal.style.display = 'none';
  fireworksRunning = false;
  if (fireworksAnimId) cancelAnimationFrame(fireworksAnimId);
}

function initMidnightFireworksEngine() {
  const triggerBtn = document.getElementById('trigger-midnight-btn');
  const finaleFwBtn = document.getElementById('finale-fireworks-btn');
  const exitBtn = document.getElementById('exit-midnight-btn');

  if (triggerBtn) triggerBtn.addEventListener('click', openMidnightSky);
  if (finaleFwBtn) finaleFwBtn.addEventListener('click', openMidnightSky);
  if (exitBtn) exitBtn.addEventListener('click', closeMidnightSky);
}

/* ==========================================================================
   3. INSTAGRAM-STYLE STORY VIEWER
   ========================================================================== */
let storyIndex = 0;
const TOTAL_STORIES = 4;
let storyTimer = null;
let storyProgress = 0;

function openStoryModal() {
  const modal = document.getElementById('story-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  storyIndex = 0;
  displayStorySlide(0);
  playBellTone(659.25, 0.2);
}

function closeStoryModal() {
  const modal = document.getElementById('story-modal');
  if (!modal) return;
  modal.style.display = 'none';
  clearInterval(storyTimer);
}

function displayStorySlide(idx) {
  storyIndex = idx;
  clearInterval(storyTimer);
  storyProgress = 0;

  const slides = document.querySelectorAll('.story-card');
  slides.forEach((s, i) => s.classList.toggle('active', i === idx));

  for (let i = 0; i < TOTAL_STORIES; i++) {
    const barFill = document.getElementById(`sbf-${i}`);
    if (barFill) {
      if (i < idx) barFill.style.width = '100%';
      else if (i > idx) barFill.style.width = '0%';
      else barFill.style.width = '0%';
    }
  }

  const curFill = document.getElementById(`sbf-${idx}`);
  const stepMs = 50;
  const duration = 4500;
  const inc = (stepMs / duration) * 100;

  storyTimer = setInterval(() => {
    storyProgress += inc;
    if (curFill) curFill.style.width = `${Math.min(100, storyProgress)}%`;

    if (storyProgress >= 100) {
      clearInterval(storyTimer);
      if (storyIndex < TOTAL_STORIES - 1) {
        displayStorySlide(storyIndex + 1);
      } else {
        closeStoryModal();
        fireConfetti({ particleCount: 50, originX: 0.5, originY: 0.5 });
      }
    }
  }, stepMs);
}

function initStoryViewer() {
  const closeBtn = document.getElementById('close-story-btn');
  const tapLeft = document.getElementById('story-tap-prev');
  const tapRight = document.getElementById('story-tap-next');
  const heartBtn = document.getElementById('story-heart-trigger');

  if (closeBtn) closeBtn.addEventListener('click', closeStoryModal);

  if (tapLeft) tapLeft.addEventListener('click', () => {
    if (storyIndex > 0) displayStorySlide(storyIndex - 1);
  });

  if (tapRight) tapRight.addEventListener('click', () => {
    if (storyIndex < TOTAL_STORIES - 1) {
      displayStorySlide(storyIndex + 1);
    } else {
      closeStoryModal();
      fireConfetti({ particleCount: 50, originX: 0.5, originY: 0.5 });
    }
  });

  if (heartBtn) {
    heartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      fireConfetti({ particleCount: 40, originX: 0.5, originY: 0.65 });
      heartBtn.textContent = '💖 Hugs Delivered! 💖';
    });
  }
}

/* ==========================================================================
   4. WEB AUDIO SYNTHESIZER & REAL-TIME VISUALIZER
   ========================================================================== */
let sharedAudioCtx = null;
let sharedAnalyser = null;
let isMusicActive = false;
let musicStepTimer = null;
let visualizerRunning = false;

function getAudioCtx() {
  if (!sharedAudioCtx) {
    const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
    if (AudioCtxClass) {
      sharedAudioCtx = new AudioCtxClass();
      sharedAnalyser = sharedAudioCtx.createAnalyser();
      sharedAnalyser.fftSize = 64;
    }
  }
  if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume();
  }
  return sharedAudioCtx;
}

const MELODY_CHIMES = [
  { f: 392.00, d: 0.75 }, { f: 392.00, d: 0.25 }, { f: 440.00, d: 1 }, { f: 392.00, d: 1 }, { f: 523.25, d: 1 }, { f: 493.88, d: 2 },
  { f: 392.00, d: 0.75 }, { f: 392.00, d: 0.25 }, { f: 440.00, d: 1 }, { f: 392.00, d: 1 }, { f: 587.33, d: 1 }, { f: 523.25, d: 2 },
  { f: 392.00, d: 0.75 }, { f: 392.00, d: 0.25 }, { f: 783.99, d: 1 }, { f: 659.25, d: 1 }, { f: 523.25, d: 1 }, { f: 493.88, d: 1 }, { f: 440.00, d: 1.5 },
  { f: 698.46, d: 0.75 }, { f: 698.46, d: 0.25 }, { f: 659.25, d: 1 }, { f: 523.25, d: 1 }, { f: 587.33, d: 1 }, { f: 523.25, d: 2.5 }
];

function playBellTone(freq, duration = 0.25) {
  const actx = getAudioCtx();
  if (!actx || !freq) return;

  const now = actx.currentTime;
  const osc1 = actx.createOscillator();
  const osc2 = actx.createOscillator();
  const gain = actx.createGain();

  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(freq, now);

  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(freq * 2, now);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.22, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc1.connect(gain);
  osc2.connect(gain);

  if (sharedAnalyser) {
    gain.connect(sharedAnalyser);
    sharedAnalyser.connect(actx.destination);
  } else {
    gain.connect(actx.destination);
  }

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + duration);
  osc2.stop(now + duration);
}

function playFanfare() {
  const chords = [392.00, 523.25, 659.25, 783.99];
  chords.forEach((f, idx) => {
    setTimeout(() => playBellTone(f, 0.4), idx * 80);
  });
}

function stepMelody(index = 0) {
  if (!isMusicActive) return;

  if (index >= MELODY_CHIMES.length) {
    musicStepTimer = setTimeout(() => {
      if (isMusicActive) stepMelody(0);
    }, 1800);
    return;
  }

  const item = MELODY_CHIMES[index];
  const beat = 380;
  const durSec = (item.d * beat) / 1000;

  playBellTone(item.f, Math.max(0.35, durSec * 1.15));

  musicStepTimer = setTimeout(() => {
    if (isMusicActive) stepMelody(index + 1);
  }, item.d * beat);
}

function initAudioAndVisualizer() {
  const navMusicBtn = document.getElementById('nav-music-btn');
  const navLabel = document.getElementById('nav-music-label');
  const navIcon = document.getElementById('nav-music-icon');
  const vizBtn = document.getElementById('viz-toggle-btn');
  const vizIcon = document.getElementById('viz-btn-icon');
  const vizLabel = document.getElementById('viz-btn-label');
  const vizPrompt = document.getElementById('visualizer-prompt');
  const vizPip = document.getElementById('viz-status-pip');
  const vizStatus = document.getElementById('viz-status-text');

  function toggleMusic() {
    getAudioCtx();
    if (isMusicActive) {
      isMusicActive = false;
      if (musicStepTimer) clearTimeout(musicStepTimer);
      if (navMusicBtn) navMusicBtn.classList.remove('active-music');
      if (navLabel) navLabel.textContent = 'Birthday Music';
      if (navIcon) navIcon.textContent = '🎵';
      if (vizIcon) vizIcon.textContent = '▶️';
      if (vizLabel) vizLabel.textContent = 'Play Birthday Tune';
      if (vizPrompt) vizPrompt.style.opacity = '1';
      if (vizPip) vizPip.classList.remove('active');
      if (vizStatus) vizStatus.textContent = 'Web Audio Engine: Paused';
    } else {
      isMusicActive = true;
      if (navMusicBtn) navMusicBtn.classList.add('active-music');
      if (navLabel) navLabel.textContent = 'Music Playing 🎶';
      if (navIcon) navIcon.textContent = '⏸️';
      if (vizIcon) vizIcon.textContent = '⏸️';
      if (vizLabel) vizLabel.textContent = 'Pause Birthday Tune';
      if (vizPrompt) vizPrompt.style.opacity = '0';
      if (vizPip) vizPip.classList.add('active');
      if (vizStatus) vizStatus.textContent = 'Web Audio Engine: Playing "Happy Birthday"';
      stepMelody(0);
      startVisualizerRendering();
    }
  }

  if (navMusicBtn) navMusicBtn.addEventListener('click', toggleMusic);
  if (vizBtn) vizBtn.addEventListener('click', toggleMusic);
}

function startVisualizerRendering() {
  if (visualizerRunning) return;
  visualizerRunning = true;

  const canvas = document.getElementById('audio-visualizer-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function draw() {
    requestAnimationFrame(draw);
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!sharedAnalyser) return;

    const bufferLen = sharedAnalyser.frequencyBinCount;
    const dataArr = new Uint8Array(bufferLen);
    sharedAnalyser.getByteFrequencyData(dataArr);

    const barWidth = (canvas.width / bufferLen) * 2;
    let x = 0;

    for (let i = 0; i < bufferLen; i++) {
      const val = dataArr[i];
      const barHeight = (val / 255) * (canvas.height * 0.85);

      const grad = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
      grad.addColorStop(0, '#ff3366');
      grad.addColorStop(0.5, '#7028e4');
      grad.addColorStop(1, '#ffd700');

      ctx.fillStyle = grad;
      ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);

      x += barWidth;
    }
  }

  draw();
}

/* ==========================================================================
   5. INTERACTIVE CAKE & MIC BREATH SENSOR
   ========================================================================== */
function initCakeMicrophoneSensor() {
  const cakeArea = document.getElementById('cake-clickable-area');
  const blowBtn = document.getElementById('blow-cake-btn');
  const relightBtn = document.getElementById('relight-cake-btn');
  const promptText = document.getElementById('cake-prompt-text');
  const micBtn = document.getElementById('mic-blow-btn');
  const micSensorBar = document.getElementById('mic-sensor-bar');
  const sensorFill = document.getElementById('sensor-fill');
  const candles = document.querySelectorAll('.candle-stick');

  let candlesBlown = false;
  let micStream = null;
  let micAnalyser = null;
  let micAnimId = null;

  function extinguish() {
    if (candlesBlown) return;
    candlesBlown = true;

    candles.forEach((c, idx) => {
      setTimeout(() => c.classList.add('blown'), idx * 110);
    });

    playFanfare();
    fireConfetti({ particleCount: 90, originX: 0.5, originY: 0.55 });
    setTimeout(() => {
      fireConfetti({ particleCount: 60, originX: 0.35, originY: 0.45 });
      fireConfetti({ particleCount: 60, originX: 0.65, originY: 0.45 });
    }, 200);

    if (promptText) {
      promptText.innerHTML = '🎉 <strong>Woohoo Dhanah!</strong> Wish granted! May your year sparkle with joy! 💖✨';
    }
    if (blowBtn) blowBtn.style.display = 'none';
    if (relightBtn) relightBtn.style.display = 'inline-flex';
  }

  function relight() {
    candlesBlown = false;
    candles.forEach(c => c.classList.remove('blown'));
    playBellTone(659.25, 0.2);
    if (promptText) {
      promptText.innerHTML = '🕯️ <strong>3 Candles Lit:</strong> Blow into your mic or click below!';
    }
    if (blowBtn) blowBtn.style.display = 'inline-flex';
    if (relightBtn) relightBtn.style.display = 'none';
  }

  if (cakeArea) cakeArea.addEventListener('click', extinguish);
  if (blowBtn) blowBtn.addEventListener('click', extinguish);
  if (relightBtn) relightBtn.addEventListener('click', relight);

  async function toggleMic() {
    if (micStream) {
      micStream.getTracks().forEach(t => t.stop());
      micStream = null;
      if (micAnimId) cancelAnimationFrame(micAnimId);
      if (micBtn) {
        micBtn.classList.remove('active');
        document.getElementById('mic-pill-label').textContent = 'Enable Mic to Blow';
      }
      if (micSensorBar) micSensorBar.style.display = 'none';
      return;
    }

    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const actx = getAudioCtx();
      const source = actx.createMediaStreamSource(micStream);
      micAnalyser = actx.createAnalyser();
      micAnalyser.fftSize = 256;
      source.connect(micAnalyser);

      if (micBtn) {
        micBtn.classList.add('active');
        document.getElementById('mic-pill-label').textContent = 'Mic Active: Blow into mic!';
      }
      if (micSensorBar) micSensorBar.style.display = 'flex';

      function monitor() {
        if (!micAnalyser) return;
        const data = new Uint8Array(micAnalyser.frequencyBinCount);
        micAnalyser.getByteFrequencyData(data);

        let sum = 0;
        for (let i = 0; i < data.length; i++) sum += data[i];
        const avg = sum / data.length;
        const pct = Math.min(100, (avg / 65) * 100);

        if (sensorFill) sensorFill.style.width = `${pct}%`;

        if (pct > 55 && !candlesBlown) {
          extinguish();
        }

        micAnimId = requestAnimationFrame(monitor);
      }
      monitor();
    } catch (err) {
      alert('Microphone access could not be enabled. You can always click "Blow Candles"!');
    }
  }

  if (micBtn) micBtn.addEventListener('click', toggleMic);
}

/* ==========================================================================
   6. SISTERHOOD PERSONALITY QUIZ
   ========================================================================== */
const SISTER_QUIZ = [
  {
    q: "Who takes the longest to get ready for an outing?",
    options: [
      { text: "Dhanah (Gotta ensure the aesthetic is 100% flawless!)", correct: true },
      { text: "Me (I take my time too)", correct: false },
      { text: "Both of us (Family trait!)", correct: true }
    ],
    feedback: "True! Dhanah never steps out without a 10/10 fit ✨"
  },
  {
    q: "What is Dhanah's ultimate superpower as a sister?",
    options: [
      { text: "Turning any boring day into non-stop laughter 😂", correct: true },
      { text: "Having immaculate playlist recommendations 🎶", correct: true },
      { text: "All of the above + world-class style 👑", correct: true }
    ],
    feedback: "Unquestionably! She is a complete powerhouse of good vibes."
  },
  {
    q: "If Dhanah is having a long day, what's the guaranteed cure?",
    options: [
      { text: "Her favorite sweet treat / snack & a cozy chat 🍰", correct: true },
      { text: "Blasting music and dancing in the room 💃", correct: false },
      { text: "Peace, quiet and a shopping spree 🛍️", correct: false }
    ],
    feedback: "Snacks and sincere talks heal everything!"
  },
  {
    q: "Who is most likely to start laughing at the completely wrong moment?",
    options: [
      { text: "Dhanah, 1000%! 🤣", correct: true },
      { text: "Me, but she joins in instantly", correct: true },
      { text: "Neither, we are always serious (Impossible!)", correct: false }
    ],
    feedback: "Guaranteed giggles every single time."
  },
  {
    q: "Who is the certified favorite sister in the entire world?",
    options: [
      { text: "DHANAH! Without a doubt! 🏆💖", correct: true },
      { text: "Dhanah (again, obviously!) ✨", correct: true },
      { text: "Dhanah (unanimous vote!) 🎉", correct: true }
    ],
    feedback: "A 100% unanimous victory! Long live Queen Dhanah!"
  }
];

let quizIdx = 0;
let quizScore = 0;

function initSisterhoodQuiz() {
  renderQuiz();

  const retakeBtn = document.getElementById('retake-quiz-btn');
  if (retakeBtn) {
    retakeBtn.addEventListener('click', () => {
      quizIdx = 0;
      quizScore = 0;
      document.getElementById('quiz-diploma-view').style.display = 'none';
      document.getElementById('quiz-body-area').style.display = 'block';
      renderQuiz();
    });
  }
}

function renderQuiz() {
  const counter = document.getElementById('quiz-counter');
  const scoreChip = document.getElementById('quiz-score-chip');
  const qText = document.getElementById('quiz-q-text');
  const choicesBox = document.getElementById('quiz-choices');
  const feedback = document.getElementById('quiz-feedback');

  if (feedback) feedback.style.display = 'none';

  if (quizIdx >= SISTER_QUIZ.length) {
    document.getElementById('quiz-body-area').style.display = 'none';
    document.getElementById('quiz-diploma-view').style.display = 'block';
    fireConfetti({ particleCount: 90, originX: 0.5, originY: 0.6 });
    playFanfare();
    return;
  }

  const cur = SISTER_QUIZ[quizIdx];
  if (counter) counter.textContent = `Question ${quizIdx + 1} of ${SISTER_QUIZ.length}`;
  if (scoreChip) scoreChip.textContent = `Score: ${quizScore} / ${SISTER_QUIZ.length}`;
  if (qText) qText.textContent = cur.q;

  if (choicesBox) {
    choicesBox.innerHTML = '';
    cur.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-choice-btn';
      btn.innerHTML = `<strong>${String.fromCharCode(65 + idx)}.</strong> ${opt.text}`;
      btn.addEventListener('click', () => {
        const allBtns = document.querySelectorAll('.quiz-choice-btn');
        allBtns.forEach(b => b.disabled = true);

        if (opt.correct) {
          quizScore++;
          btn.classList.add('correct');
          playBellTone(783.99, 0.2);
        } else {
          btn.classList.add('wrong');
          playBellTone(349.23, 0.2);
        }

        if (feedback) {
          feedback.style.display = 'block';
          feedback.style.background = opt.correct ? '#e8f5e9' : '#fff3e0';
          feedback.style.color = opt.correct ? '#2e7d32' : '#e65100';
          feedback.innerHTML = `✨ <strong>${opt.correct ? 'Correct!' : 'Close!'}</strong> ${cur.feedback}`;
        }

        setTimeout(() => {
          quizIdx++;
          renderQuiz();
        }, 1300);
      });
      choicesBox.appendChild(btn);
    });
  }
}

/* ==========================================================================
   7. SISTERHOOD PHOTO CAROUSEL
   ========================================================================== */
function initMemoryCarousel() {
  const track = document.getElementById('car-track');
  const prevBtn = document.getElementById('car-prev');
  const nextBtn = document.getElementById('car-next');
  const dots = document.querySelectorAll('#car-dots .pag-dot');
  const fileSelectors = document.querySelectorAll('.photo-file-selector');

  [1, 2, 3, 4].forEach(id => {
    const saved = localStorage.getItem(`dhanah_royal_photo_${id}`);
    if (saved) {
      const img = document.getElementById(`car-img-${id}`);
      if (img) {
        img.src = saved;
        img.style.display = 'block';
        const backdrop = img.parentElement.querySelector('.art-backdrop');
        if (backdrop) backdrop.style.display = 'none';
      }
    }
  });

  fileSelectors.forEach(sel => {
    sel.addEventListener('change', (e) => {
      const targetId = sel.getAttribute('data-target');
      const file = e.target.files && e.target.files[0];
      if (!file || !targetId) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
        const b64 = evt.target.result;
        const img = document.getElementById(targetId);
        if (img) {
          img.src = b64;
          img.style.display = 'block';
          const backdrop = img.parentElement.querySelector('.art-backdrop');
          if (backdrop) backdrop.style.display = 'none';

          const idNum = targetId.replace('car-img-', '');
          try {
            localStorage.setItem(`dhanah_royal_photo_${idNum}`, b64);
          } catch(e) {}
          playBellTone(698.46, 0.2);
          fireConfetti({ particleCount: 35, originX: 0.5, originY: 0.5 });
        }
      };
      reader.readAsDataURL(file);
    });
  });

  if (prevBtn && track) {
    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -track.offsetWidth * 0.9, behavior: 'smooth' });
    });
  }

  if (nextBtn && track) {
    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: track.offsetWidth * 0.9, behavior: 'smooth' });
    });
  }

  if (track) {
    track.addEventListener('scroll', () => {
      const idx = Math.round(track.scrollLeft / track.offsetWidth);
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    });
  }

  dots.forEach((d, idx) => {
    d.addEventListener('click', () => {
      if (track) {
        track.scrollTo({ left: track.offsetWidth * idx, behavior: 'smooth' });
      }
    });
  });
}

/* ==========================================================================
   8. 3D ROTATING MYSTERY PRESENT
   ========================================================================== */
function init3DPresentBox() {
  const stage = document.getElementById('gift-cube-stage');
  const voucher = document.getElementById('revealed-voucher');
  const prompt = document.getElementById('gift-tap-prompt');

  if (!stage || !voucher) return;

  stage.addEventListener('click', () => {
    if (stage.classList.contains('opened')) return;

    stage.classList.add('opened');
    voucher.style.display = 'block';
    if (prompt) prompt.textContent = '🎉 VIP Sister Pass Unlocked!';

    playFanfare();
    fireConfetti({ particleCount: 85, originX: 0.5, originY: 0.65 });

    setTimeout(() => {
      voucher.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 200);
  });
}

/* ==========================================================================
   9. A LETTER TO MY SISTER (NOT LOVE LETTER)
   ========================================================================== */
function initSisterhoodLetter() {
  const env = document.getElementById('envelope-3d-box');
  const hint = document.getElementById('seal-hint-text');
  if (!env) return;

  env.addEventListener('click', () => {
    env.classList.toggle('opened');
    const isOpened = env.classList.contains('opened');

    if (isOpened) {
      playBellTone(587.33, 0.3);
      fireConfetti({ particleCount: 50, originX: 0.5, originY: 0.5 });
      if (hint) hint.textContent = 'Tap envelope again to fold back!';
    } else {
      if (hint) hint.textContent = 'Click the golden heart seal to unfold the letter!';
    }
  });
}

/* ==========================================================================
   10. FLOATING JOURNEY DOCK (#10)
   ========================================================================== */
const SECTIONS = [
  { id: 'sec-countdown', title: '⏰ Midnight Countdown' },
  { id: 'sec-visualizer', title: '🎵 Music Visualizer' },
  { id: 'sec-cake', title: '🎂 Blow The Candles' },
  { id: 'sec-quiz', title: '🧠 Sibling Quiz' },
  { id: 'sec-carousel', title: '📸 Memory Carousel' },
  { id: 'sec-gift', title: '🎁 3D Mystery Gift' },
  { id: 'sec-letter', title: '💌 Sisterhood Letter' },
  { id: 'sec-finale', title: '👑 Grand Celebration' }
];

let curSecIdx = 0;

function updateJourneyDock() {
  const num = document.getElementById('dock-step-num');
  const title = document.getElementById('dock-step-title');
  const bar = document.getElementById('dock-bar-fill');
  const prev = document.getElementById('dock-prev-btn');
  const next = document.getElementById('dock-next-btn');

  if (num) num.textContent = `Chapter ${curSecIdx + 1} of ${SECTIONS.length}`;
  if (title) title.textContent = SECTIONS[curSecIdx].title;

  const pct = ((curSecIdx + 1) / SECTIONS.length) * 100;
  if (bar) bar.style.width = `${pct}%`;

  if (prev) prev.disabled = curSecIdx === 0;
  if (next) {
    next.textContent = curSecIdx === SECTIONS.length - 1 ? '🎉 Fireworks' : 'Next Chapter ›';
  }
}

function scrollToSection(idx) {
  if (idx < 0 || idx >= SECTIONS.length) return;
  curSecIdx = idx;
  updateJourneyDock();

  const target = document.getElementById(SECTIONS[curSecIdx].id);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    playBellTone(523.25 + idx * 30, 0.12);
  }
}

function initJourneyDock() {
  const prev = document.getElementById('dock-prev-btn');
  const next = document.getElementById('dock-next-btn');

  if (prev) prev.addEventListener('click', () => scrollToSection(curSecIdx - 1));
  if (next) {
    next.addEventListener('click', () => {
      if (curSecIdx === SECTIONS.length - 1) {
        openMidnightSky();
      } else {
        scrollToSection(curSecIdx + 1);
      }
    });
  }

  updateJourneyDock();
}

/* ==========================================================================
   11. COUNTDOWN TIMER
   ========================================================================== */
function initCountdown() {
  const daysEl = document.getElementById('timer-days');
  const hoursEl = document.getElementById('timer-hours');
  const minsEl = document.getElementById('timer-minutes');
  const secsEl = document.getElementById('timer-seconds');
  const cap = document.getElementById('countdown-caption');

  function update() {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    const diff = midnight - now;

    if (diff <= 0) {
      if (cap) cap.textContent = "🎉 It's Dhanah's Birthday TODAY!";
      return;
    }

    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    if (daysEl) daysEl.textContent = '00';
    if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(m).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(s).padStart(2, '0');
  }

  setInterval(update, 1000);
  update();
}

/* ==========================================================================
   12. CONFETTI ENGINE
   ========================================================================== */
let confList = [];
let confAnimId = null;
const cCanvas = document.getElementById('confetti-canvas');
const cCtx = cCanvas ? cCanvas.getContext('2d') : null;

function resizeConfetti() {
  if (!cCanvas) return;
  cCanvas.width = window.innerWidth;
  cCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeConfetti);
resizeConfetti();

class ConfParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 9 + 6;
    const colors = ['#ffd700', '#ff3366', '#7028e4', '#00f0ff', '#ffbe0b', '#06d6a0'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 11 + 4;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - 5;
    this.gravity = 0.28;
    this.friction = 0.98;
    this.rotation = Math.random() * 360;
    this.rotSpeed = (Math.random() - 0.5) * 12;
    this.alpha = 1;
    this.decay = Math.random() * 0.012 + 0.008;
    this.shape = Math.random() > 0.4 ? 'rect' : 'circle';
  }

  update() {
    this.vx *= this.friction;
    this.vy = (this.vy * this.friction) + this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotSpeed;
    this.alpha -= this.decay;
  }

  draw(ctx) {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = this.color;
    if (this.shape === 'rect') {
      ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

function fireConfetti(opts = {}) {
  if (!cCtx || !cCanvas) return;
  const count = opts.particleCount || 60;
  const x = opts.originX !== undefined ? opts.originX * cCanvas.width : cCanvas.width / 2;
  const y = opts.originY !== undefined ? opts.originY * cCanvas.height : cCanvas.height / 2;

  for (let i = 0; i < count; i++) {
    confList.push(new ConfParticle(x, y));
  }

  if (!confAnimId) {
    confettiLoop();
  }
}

function confettiLoop() {
  if (!cCtx || !cCanvas) return;
  cCtx.clearRect(0, 0, cCanvas.width, cCanvas.height);
  confList = confList.filter(p => p.alpha > 0 && p.y < cCanvas.height + 50);

  for (let p of confList) {
    p.update();
    p.draw(cCtx);
  }

  if (confList.length > 0) {
    confAnimId = requestAnimationFrame(confettiLoop);
  } else {
    confAnimId = null;
  }
}

function initConfettiCannon() {
  const navBtn = document.getElementById('nav-confetti-btn');
  const finaleConfBtn = document.getElementById('finale-confetti-btn');

  if (navBtn) {
    navBtn.addEventListener('click', () => {
      playBellTone(659.25, 0.15);
      fireConfetti({ particleCount: 75, originX: 0.5, originY: 0.3 });
    });
  }

  if (finaleConfBtn) {
    finaleConfBtn.addEventListener('click', () => {
      playFanfare();
      fireConfetti({ particleCount: 110, originX: 0.5, originY: 0.5 });
      setTimeout(() => fireConfetti({ particleCount: 70, originX: 0.2, originY: 0.4 }), 200);
      setTimeout(() => fireConfetti({ particleCount: 70, originX: 0.8, originY: 0.4 }), 400);
    });
  }
}
