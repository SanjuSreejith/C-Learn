// app_script.js
// Client-side JavaScript for Code_Duo

// 1. C# Syntax Highlighter
function highlightCSharp(code) {
  if (!code) return '';
  const escaped = String(code)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return escaped
    .replace(/(\/\/[^\r\n]*)/g, '<span class="tok-comment">$1</span>')
    .replace(/\b(int|float|bool|string|void|class|struct|interface|abstract|virtual|override|public|private|protected|static|new|return|if|else|for|while|foreach|switch|case|break|yield|async|await)\b/g, '<span class="tok-keyword">$1</span>')
    .replace(/\b(Vector3|Vector2|Rigidbody|Rigidbody2D|Collider|Transform|GameObject|MonoBehaviour|ScriptableObject|Console|Mathf|Math|Time|Physics|RaycastHit|Quaternion|SceneManager|List|Dictionary|Queue|Stack|HashSet|Action|Func|UniTask|Task)\b/g, '<span class="tok-type">$1</span>')
    .replace(/\b([0-9]+(\.[0-9]+)?f?)\b/g, '<span class="tok-number">$1</span>')
    .replace(/(".*?")/g, '<span class="tok-string">$1</span>');
}

// 2. Synthesized Web Audio SFX Engine
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }
  playTap() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }
  playCorrect() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.07);
      gain.gain.setValueAtTime(0.12, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.2);
    });
  }
  playWrong() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.25);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.26);
  }
  playChestOpen() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [330, 440, 550, 660, 880, 1100].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.15, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.26);
    });
  }
}
const sfx = new SoundEngine();

// 3. User Accounts & Realistic Gem Economy
const DEFAULT_ACCOUNTS = {
  Sanju2206: {
    username: 'Sanju2206',
    password: 'CD_sanju@22',
    name: 'Sanju (Lead Dev)',
    avatar: '👨‍💻',
    role: 'Gameplay Systems Architect (Lead)',
    isPremium: true,
    state: {
      xp: 350,
      streak: 1,
      gems: 185, // Realistic earned diamonds
      hearts: '∞',
      isPremium: true,
      level: 4,
      rankTitle: 'Super Gameplay Architect',
      freezes: 5,
      unlockedUnits: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      completedLessons: [],
      openedChests: [],
      unlockedBadges: ['b_first', 'b_wildfire', 'b_xp'],
      lastStreakDate: new Date().toDateString(),
      activeBoost: null,
      bktKnowledge: {
        Variables: 0.85,
        Logic: 0.80,
        Engine: 0.75,
        OOP: 0.70,
        Physics: 0.65,
        Collections: 0.60,
        Events: 0.55,
        Profiling: 0.50
      }
    }
  },
  Scaria2584: {
    username: 'Scaria2584',
    password: 'CD_scaria@25',
    name: 'Scaria (Designer)',
    avatar: '⚡',
    role: 'Physics & Level Designer',
    isPremium: true,
    state: {
      xp: 280,
      streak: 1,
      gems: 140, // Realistic earned diamonds
      hearts: '∞',
      isPremium: true,
      level: 3,
      rankTitle: 'Super Physics Designer',
      freezes: 5,
      unlockedUnits: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      completedLessons: [],
      openedChests: [],
      unlockedBadges: ['b_first'],
      lastStreakDate: new Date().toDateString(),
      activeBoost: null,
      bktKnowledge: {
        Variables: 0.80,
        Logic: 0.75,
        Engine: 0.70,
        OOP: 0.65,
        Physics: 0.60,
        Collections: 0.55,
        Events: 0.50,
        Profiling: 0.45
      }
    }
  }
};

let accountsDB = JSON.parse(localStorage.getItem('code_duo_accounts_db')) || DEFAULT_ACCOUNTS;

// Cap gems realistically for both accounts (not 9999 cheat)
['Sanju2206', 'Scaria2584'].forEach(u => {
  if (accountsDB[u]) {
    accountsDB[u].isPremium = true;
    accountsDB[u].state.isPremium = true;
    accountsDB[u].state.hearts = '∞';
    if (!accountsDB[u].state.gems || accountsDB[u].state.gems > 500) {
      accountsDB[u].state.gems = (u === 'Sanju2206' ? 185 : 140);
    }
  }
});

let currentUsername = localStorage.getItem('code_duo_active_user') || 'Sanju2206';
if (!accountsDB[currentUsername]) currentUsername = 'Sanju2206';
let userState = accountsDB[currentUsername].state;

// Sync from accounts.json
fetch('./accounts.json')
  .then(res => res.json())
  .then(data => {
    if (data && data.accounts) {
      Object.keys(data.accounts).forEach(u => {
        if (!accountsDB[u]) {
          accountsDB[u] = data.accounts[u];
        } else {
          accountsDB[u].password = data.accounts[u].password;
          accountsDB[u].role = data.accounts[u].role;
          accountsDB[u].name = data.accounts[u].name;
          accountsDB[u].isPremium = true;
          accountsDB[u].state.isPremium = true;
          accountsDB[u].state.hearts = '∞';
        }
      });
      saveState();
    }
  })
  .catch(() => {});

function saveState() {
  accountsDB[currentUsername].state = userState;
  localStorage.setItem('code_duo_accounts_db', JSON.stringify(accountsDB));
  localStorage.setItem('code_duo_active_user', currentUsername);
  renderHeaderStats();
}

// 4. AI Algorithmic Backend
const BKT_PARAMS = { p_guess: 0.20, p_slip: 0.12, p_transit: 0.10 };

function updateBKT(topic, isCorrect) {
  if (!userState.bktKnowledge) userState.bktKnowledge = {};
  let p_known = userState.bktKnowledge[topic] || 0.65;
  const { p_guess, p_slip, p_transit } = BKT_PARAMS;

  let p_post;
  if (isCorrect) {
    p_post = (p_known * (1 - p_slip)) / ((p_known * (1 - p_slip)) + ((1 - p_known) * p_guess));
  } else {
    p_post = (p_known * p_slip) / ((p_known * p_slip) + ((1 - p_known) * (1 - p_guess)));
  }

  const p_next = p_post + (1 - p_post) * p_transit;
  userState.bktKnowledge[topic] = Math.min(0.99, Math.max(0.05, p_next));
  renderAIRadar();
  saveState();
}

function classifyCognitiveState(isCorrect, responseTimeMs, streak) {
  if (isCorrect) {
    if (responseTimeMs < 4500) {
      return { state: 'MASTERED_FLUENT', label: 'Mastered & Fluent', emoji: '🚀' };
    } else if (responseTimeMs < 12000) {
      return { state: 'CONFIDENT_CALCULATED', label: 'Confident & Analytical', emoji: '🧠' };
    } else {
      return { state: 'HESITANT_CORRECT', label: 'Hesitant but Correct', emoji: '🧐' };
    }
  } else {
    if (responseTimeMs < 2500) {
      return { state: 'FAST_GUESS', label: 'Rushed / Guessing', emoji: '⚠️' };
    } else {
      return { state: 'CONCEPT_CONFUSION', label: 'Concept Misconception', emoji: '💡' };
    }
  }
}

function selectQDialogue(character, cognitiveState) {
  const char = CHARACTERS[character] || CHARACTERS.priya;
  if (cognitiveState.state === 'MASTERED_FLUENT') {
    return `${char.name}: "Wah! Lightning fast trace! That is real Lead Architect speed right there!"`;
  } else if (cognitiveState.state === 'FAST_GUESS') {
    return `${char.name}: "Hold on, dost! Trace the memory and variables line-by-line first."`;
  } else if (cognitiveState.state === 'HESITANT_CORRECT') {
    return `${char.name}: "Shabash! Careful calculation prevents crashes in the production build!"`;
  } else {
    return `${char.name}: "No worries, keep calm! Check the memory breakdown below to spot where the condition flipped."`;
  }
}

function generateProceduralQuestion(topic) {
  const hp = Math.floor(Math.random() * 50) + 50;
  const dmg = Math.floor(Math.random() * 25) + 10;
  const ans = hp - dmg;
  return {
    character: 'kabir',
    charSpeech: "A fresh dynamic combat math drill! Help me calculate the HP after impact:",
    type: 'multiple_choice',
    title: 'Procedural Combat Math Drill',
    instruction: 'What is printed to the console?',
    code: `int playerHp = ${hp};\nint dmg = ${dmg};\nint currentHp = playerHp - dmg;\nConsole.WriteLine(currentHp);`,
    choices: [String(ans), String(ans + 10), String(ans - 5), String(hp)],
    answer: 0,
    explainSummary: `${hp} - ${dmg} = ${ans}! Fast integer subtraction executed on stack.`,
    explainAnalogy: 'Simulating instantaneous projectile damage in our combat engine.',
    explainMemory: `STACK: [playerHp = ${hp}], [dmg = ${dmg}], [currentHp = ${ans}]`,
    pitfall: 'Avoid floating point rounding errors when working with whole integer health pools.'
  };
}
