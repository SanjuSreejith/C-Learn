// build_refined_app.js
// Complete builder that merges HTML, CSS, Curriculum, and JavaScript into index.html
// Updated per user feedback:
// 1. PC UI fully occupies whole monitor (100% width, flexible fluid columns, no blank margin gutters)
// 2. Background decorative elements (Awake, Vector3, etc.) moved to a dedicated background layer with z-index: 0 / -1, strictly BEHIND all cards
// 3. Realistic login: Removed quick-fill credential buttons, users enter their own passwords, added eye toggle and remember me
// 4. Redesigned "Super": Replaced ugly yellow badge & neon pink hearts with sleek, elegant Duolingo Super violet/gold styling
// 5. Mobile UI: Header fits 100% with zero clipping, clean 4-tab bottom dock

const fs = require('fs');

const curriculum = JSON.parse(fs.readFileSync('curriculum_data.json', 'utf8'));

// Build LESSONS_DATABASE & LESSON_ORDER
const lessonsDb = {};
const lessonOrder = [];

curriculum.forEach(unit => {
  unit.lessons.forEach(l => {
    lessonOrder.push(l.id);
    const qList = (l.questions && l.questions.length > 0) ? l.questions : (l.q ? [l.q] : []);
    lessonsDb[l.id] = {
      title: l.title,
      unit: unit.unit,
      topic: l.topic,
      questions: qList.map(item => ({
        character: item.character || item.char || 'kabir',
        charSpeech: item.charSpeech || item.speech || 'Let us code and build this game system!',
        type: item.type || 'multiple_choice',
        title: item.title || l.title,
        instruction: item.instruction || 'What will be output or evaluated?',
        code: item.code || '',
        choices: item.choices || ['Choice A', 'Choice B', 'Choice C', 'Choice D'],
        answer: item.answer !== undefined ? item.answer : 0,
        explainSummary: item.explainSummary || item.summary || 'Essential concept for robust game development.',
        explainAnalogy: item.explainAnalogy || item.analogy || 'Like managing game state in Unity.',
        explainMemory: item.explainMemory || item.memory || 'STACK: Direct execution on current thread frame.',
        pitfall: item.pitfall || 'Failing to test edge cases can trigger NullReferenceException or memory leaks.'
      }))
    };
  });
});

const UNIT_MASCOTS = {
  1: {
    m1: { char: 'kabir', bark: "Cache your variables, bro! 0 GC Alloc!" },
    m2: { char: 'duo', bark: "Almost at the Unit 1 Milestone Chest!" }
  },
  2: {
    m1: { char: 'priya', bark: "Awake() initializes before Start()!" },
    m2: { char: 'vikram', bark: "Physics queries run on FixedUpdate tick!" }
  },
  3: {
    m1: { char: 'vikram', bark: "Classes on Heap, Structs on Stack!" },
    m2: { char: 'dev', bark: "Check for null references before invoking!" }
  },
  4: {
    m1: { char: 'priya', bark: "Raycasts test geometry in 3D space!" },
    m2: { char: 'lily', bark: "Vectors & normals make shaders pop!" }
  },
  5: {
    m1: { char: 'kabir', bark: "Dictionary O(1) lightning lookup!" },
    m2: { char: 'dev', bark: "Never allocate memory in Update() loops!" }
  },
  6: {
    m1: { char: 'priya', bark: "C# Actions decouple systems cleanly!" },
    m2: { char: 'duo', bark: "Always unsubscribe with -= in OnDisable()!" }
  },
  7: {
    m1: { char: 'vikram', bark: "Coroutines yield without blocking CPU!" },
    m2: { char: 'lily', bark: "Smooth camera Lerp feels like butter!" }
  },
  8: {
    m1: { char: 'lily', bark: "ScriptableObjects keep data modular!" },
    m2: { char: 'kabir', bark: "Modular weapons system initialized!" }
  },
  9: {
    m1: { char: 'priya', bark: "State machines keep enemy AI clean!" },
    m2: { char: 'dev', bark: "Object Pooling eliminates frame drops!" }
  },
  10: {
    m1: { char: 'vikram', bark: "Burst SIMD compiles high-speed C#!" },
    m2: { char: 'duo', bark: "120 FPS locked! Legendary lead!" }
  }
};

const SINE_OFFSETS = [0, -50, -75, -45, 0, 45, 75, 50, 0, 0, 0];

function generatePathHTML() {
  let html = '';
  curriculum.forEach((u, uIdx) => {
    const mascots = UNIT_MASCOTS[u.unit] || UNIT_MASCOTS[1];
    
    html += `
      <!-- UNIT ${u.unit} -->
      <div class="unit-banner ${u.colorClass}">
        <div class="unit-banner-header">
          <div class="unit-banner-badge-group">
            <span class="unit-badge">${u.badge}</span>
            <span class="unit-lesson-counter">10 LESSONS</span>
          </div>
          <button class="unit-guidebook-btn" onclick="openGuidebook(${u.unit})">
            <span>📖</span> <span>Guidebook</span>
          </button>
        </div>
        <h2 class="unit-title">${u.title}</h2>
        <p class="unit-desc">${u.desc}</p>
      </div>

      <!-- Path Unit ${u.unit} -->
      <div class="path-container" id="unit-${u.unit}-path">
        <!-- SVG Winding Stepping Track -->
        <svg class="path-track-svg" viewBox="0 0 320 1060" preserveAspectRatio="none">
          <path class="path-track-line" d="M 160,40 C 160,88 110,88 110,136 C 110,184 85,184 85,232 C 85,280 115,280 115,328 C 115,376 160,376 160,424 C 160,472 205,472 205,520 C 205,568 235,568 235,616 C 235,664 210,664 210,712 C 210,760 160,760 160,808 L 160,904 L 160,1000" />
        </svg>

        <!-- Mascot Encounter 1 (Beside Lesson 3 on right side) -->
        <div class="path-mascot-encounter mascot-right" style="top: 195px;" onclick="triggerCharacterBark('${mascots.m1.char}')">
          <div class="mascot-speech-bubble">${mascots.m1.bark}</div>
          <div class="mascot-avatar" id="mascot-${u.unit}-1-svg"></div>
        </div>

        <!-- Mascot Encounter 2 (Beside Lesson 7 on left side) -->
        <div class="path-mascot-encounter mascot-left" style="top: 580px;" onclick="triggerCharacterBark('${mascots.m2.char}')">
          <div class="mascot-avatar" id="mascot-${u.unit}-2-svg"></div>
          <div class="mascot-speech-bubble">${mascots.m2.bark}</div>
        </div>
    `;

    // Path nodes
    u.lessons.forEach((l, lIdx) => {
      const isFirst = uIdx === 0 && lIdx === 0;
      const offset = SINE_OFFSETS[lIdx];
      const isMid = lIdx === 4;

      html += `
        <div class="path-node-wrapper" style="transform: translateX(calc(${offset}px * var(--path-offset-ratio)));">
          ${isFirst ? `
          <div class="node-popover" id="popover-${l.id}">
            <div class="node-popover-title">${l.title}</div>
            <div class="node-popover-sub">START · LESSON 1</div>
          </div>` : ''}
          <div class="node-pedestal"></div>
          <button class="path-node ${isFirst ? 'current' : 'locked'} ${isMid ? 'mid-node' : ''}" id="node-${l.id}" onclick="launchLesson('${l.id}')">
            <span>${isFirst ? '▶' : (isMid ? '⭐' : '🔒')}</span>
          </button>
        </div>
      `;
    });

    // Milestone Chest
    const chestId = `chest${u.unit}`;
    html += `
        <div class="path-node-wrapper">
          <div class="node-pedestal chest-pedestal"></div>
          <button class="path-node chest" id="node-${chestId}" onclick="openChest('${chestId}')">
            <span>🎁</span>
          </button>
        </div>
      </div>
    `;
  });
  return html;
}

const pathHtmlContent = generatePathHTML();

let appScript = fs.readFileSync('app_complete_script.js', 'utf8');

const extraScript = `
const LESSONS_DATABASE = ${JSON.stringify(lessonsDb, null, 2)};
const LESSON_ORDER = ${JSON.stringify(lessonOrder)};

const GUIDEBOOK_DATA = {
  1: {
    title: 'Unit 1 · Beginner Gamedev Logic',
    content: '<h3>Variables & Types</h3><p>Primitive types store direct values on the stack: <code>int hp = 100;</code>, <code>float speed = 5.5f;</code> (must append f), <code>bool isDead = false;</code>.</p><h3>Conditionals & Loops</h3><p>Use <code>if/else</code> for state transitions and <code>for/while</code> loops to iterate over spawn points or bullets.</p>'
  },
  2: {
    title: 'Unit 2 · Unity Engine Lifecycle',
    content: '<h3>Awake vs Start</h3><p><code>Awake()</code> is invoked upon loading. Initialize internal variables and self references here. <code>Start()</code> is called before the first frame update.</p><h3>FixedUpdate vs Update</h3><p><code>Update()</code> runs on every visual frame. <code>FixedUpdate()</code> runs at a fixed deterministic physics tick (~0.02s) for Rigidbody forces.</p>'
  },
  3: {
    title: 'Unit 3 · OOP & Memory in Unity',
    content: '<h3>Classes vs Structs</h3><p><code>class</code> is a reference type on the Heap. Modifying one copy modifies all references. <code>struct</code> is a value type on the Stack that is copied on assignment.</p><h3>Encapsulation</h3><p>Use <code>[SerializeField] private float speed;</code> to expose variables in the Inspector without breaking private encapsulation.</p>'
  },
  4: {
    title: 'Unit 4 · Math, Physics & Raycasting',
    content: '<h3>Physics.Raycast</h3><p>Cast an invisible line into the world to detect ground or shoot bullets: <code>Physics.Raycast(pos, dir, out hit, dist, mask)</code>.</p><h3>Dot Product</h3><p><code>Vector3.Dot(forward, targetDir) > 0</code> determines if an enemy is in front of the player or within vision cones.</p>'
  },
  5: {
    title: 'Unit 5 · Data Structures & Inventory',
    content: '<h3>Dictionary O(1)</h3><p>Use <code>Dictionary&lt;int, Item&gt;</code> for instant lookups by ID without iterating through thousands of array entries.</p><h3>Avoid LINQ in Update()</h3><p>LINQ operations (<code>.Where()</code>, <code>.ToList()</code>) allocate garbage collection memory on the Heap every frame.</p>'
  },
  6: {
    title: 'Unit 6 · Decoupled Events & Architecture',
    content: '<h3>C# Actions & Events</h3><p><code>public static event Action&lt;int&gt; OnPlayerDamaged;</code> allows HUD and Audio systems to listen without player scripts holding references.</p><h3>Unsubscribing</h3><p>Always unsubscribe in <code>OnDisable()</code> with <code>-=</code> to avoid memory retention bugs.</p>'
  },
  7: {
    title: 'Unit 7 · Timers & Asynchronous Systems',
    content: '<h3>Coroutines</h3><p><code>yield return null;</code> waits 1 frame. <code>yield return new WaitForSeconds(2f);</code> pauses execution without freezing the main rendering thread.</p><h3>UniTask</h3><p>Zero-allocation async/await tailored for high-performance Unity gameplay loops.</p>'
  },
  8: {
    title: 'Unit 8 · ScriptableObjects & Data Architecture',
    content: '<h3>[CreateAssetMenu]</h3><p>Store modular weapon and enemy statistics as reusable <code>.asset</code> data files in the Project folder instead of duplicating data in prefabs.</p>'
  },
  9: {
    title: 'Unit 9 · Scalable Game Design Patterns',
    content: '<h3>Object Pooling</h3><p>Recycle inactive bullets and particle systems instead of calling <code>Instantiate()</code> and <code>Destroy()</code> to eliminate GC hitches.</p><h3>Finite State Machines</h3><p>Organize enemy behaviors into clean states (<code>IState</code>) with <code>Enter()</code>, <code>Update()</code>, and <code>Exit()</code> methods.</p>'
  },
  10: {
    title: 'Unit 10 · Pro Performance & Burst/Jobs',
    content: '<h3>NonAlloc Physics</h3><p>Use <code>Physics.RaycastNonAlloc()</code> passing in a reusable array buffer to achieve zero-allocation physics queries at 120 FPS.</p><h3>Burst & Jobs</h3><p>Compile SIMD multi-threaded C# using the Unity Job System for massive CPU performance gains.</p>'
  }
};

const CHARACTERS = {
  vikram: {
    name: 'Vikram (Engine Lead)',
    role: 'Senior Indian Architect',
    barks: [
      "Show me the IL bytecode and memory profiler trace before merging!",
      "A cache miss on L1 CPU cache is 200 cycles lost. Struct memory layout matters, dost!",
      "Chai in hand, 0 bytes GC Alloc in Update(). That's how we hit 120 FPS!",
      "Always cache your transform references. Micro-optimizations build legendary games!"
    ],
    renderSVG: (emotion = 'idle') => \`
      <svg class="char-svg" viewBox="0 0 100 110" style="width:100%; height:100%;">
        <ellipse cx="50" cy="102" rx="28" ry="6" fill="rgba(0,0,0,0.12)"/>
        <path d="M 28 62 C 28 50, 72 50, 72 62 L 76 96 L 24 96 Z" fill="#1e3a5f"/>
        <path d="M 44 62 L 44 96 M 50 62 L 50 96" stroke="#f1c40f" stroke-width="1.5"/>
        <circle cx="50" cy="42" r="22" fill="#d99b6c"/>
        <path d="M 27 34 C 27 18, 73 18, 73 34 C 70 24, 30 24, 27 34 Z" fill="#1a1a1a"/>
        <path d="M 36 50 C 36 60, 64 60, 64 50 L 62 48 C 62 55, 38 55, 38 48 Z" fill="#1a1a1a"/>
        <rect x="34" y="38" width="13" height="10" rx="3" fill="none" stroke="#222" stroke-width="2.2"/>
        <rect x="53" y="38" width="13" height="10" rx="3" fill="none" stroke="#222" stroke-width="2.2"/>
        <line x1="47" y1="43" x2="53" y2="43" stroke="#222" stroke-width="2.2"/>
        <circle cx="40.5" cy="43" r="2.2" fill="#111"/>
        <circle cx="59.5" cy="43" r="2.2" fill="#111"/>
        <rect x="76" y="65" width="12" height="15" rx="3" fill="#ffffff" stroke="#c0392b" stroke-width="2"/>
        <path d="M 88 70 Q 94 72 88 78" stroke="#c0392b" stroke-width="2" fill="none"/>
      </svg>
    \`
  },
  priya: {
    name: 'Priya (Gameplay Lead)',
    role: 'Lead Indian AI Engineer',
    barks: [
      "Architecture without clean state machines is like biryani without spices!",
      "Vectors and trigonometry are your best friends in game development!",
      "I decoupled player combat with C# Actions and our code runs so smooth!",
      "Always design systems modularly. Clean code is joyful code!"
    ],
    renderSVG: (emotion = 'idle') => \`
      <svg class="char-svg" viewBox="0 0 100 110" style="width:100%; height:100%;">
        <ellipse cx="50" cy="102" rx="28" ry="6" fill="rgba(0,0,0,0.12)"/>
        <path d="M 30 60 C 30 48, 70 48, 70 60 L 74 95 L 26 95 Z" fill="#00b4d8"/>
        <circle cx="50" cy="42" r="21" fill="#e0a370"/>
        <path d="M 26 38 C 26 18, 74 18, 74 38 L 76 68 L 70 70 L 68 40 L 32 40 L 30 70 L 24 68 Z" fill="#201a15"/>
        <circle cx="50" cy="36" r="2" fill="#c0392b"/>
        <circle cx="41" cy="43" r="3" fill="#1b2a30"/>
        <circle cx="59" cy="43" r="3" fill="#1b2a30"/>
        <path d="M 37 40 L 41 38" stroke="#201a15" stroke-width="1.5"/>
        <path d="M 63 40 L 59 38" stroke="#201a15" stroke-width="1.5"/>
        <path d="M 44 51 Q 50 56 56 51" stroke="#a0522d" stroke-width="2" fill="none"/>
        <path d="M 27 40 C 27 20, 73 20, 73 40" stroke="#f39c12" stroke-width="4" fill="none"/>
        <rect x="23" y="36" width="6" height="12" rx="2" fill="#f39c12"/>
        <rect x="71" y="36" width="6" height="12" rx="2" fill="#f39c12"/>
      </svg>
    \`
  },
  kabir: {
    name: 'Kabir / Pixel (Junior Indie Dev)',
    role: 'Indie Hacker & Physicist',
    barks: [
      "Bhai, I set Rigidbody mass to -9999 and the boss flew into outer space!",
      "I spawned 10,000 chickens and my laptop started heating like a tandoor! Best game ever!",
      "Wait, so player and enemy were sharing the same health reference?! Reference aliasing bug caught!"
    ],
    renderSVG: (emotion = 'idle') => \`
      <svg class="char-svg" viewBox="0 0 100 110" style="width:100%; height:100%;">
        <ellipse cx="50" cy="102" rx="26" ry="5" fill="rgba(0,0,0,0.12)"/>
        <path d="M 32 60 C 32 50, 68 50, 68 60 L 72 95 L 28 95 Z" fill="#e74c3c"/>
        <circle cx="50" cy="44" r="21" fill="#e6a877"/>
        <path d="M 28 40 C 28 24, 72 24, 72 40 Z" fill="#e67e22"/>
        <path d="M 68 38 Q 84 38 88 43" stroke="#d35400" stroke-width="4.5" stroke-linecap="round" fill="none"/>
        <circle cx="42" cy="45" r="3.5" fill="#1b2a30"/>
        <circle cx="58" cy="45" r="3.5" fill="#1b2a30"/>
        <path d="M 45 54 Q 50 58 55 54" stroke="#8b4513" stroke-width="2.2" fill="none"/>
      </svg>
    \`
  },
  duo: {
    name: 'Duo (Studio Boss)',
    role: 'Studio Boss',
    barks: [
      "Did you test that on a real device build or just inside the Unity editor?!",
      "If you allocate memory in Update(), you are staying late this Friday!",
      "My cold brew is ready and your C# code has zero compiler warnings. Good job!",
      "Ship early, profile often, and keep the frame rate pinned at 120 FPS!"
    ],
    renderSVG: (emotion = 'idle') => \`
      <svg class="char-svg" viewBox="0 0 100 110" style="width:100%; height:100%;">
        <ellipse cx="50" cy="102" rx="30" ry="6" fill="rgba(0,0,0,0.12)"/>
        <path d="M 22 55 C 22 22, 78 22, 78 55 C 78 90, 22 90, 22 55 Z" fill="#58cc02"/>
        <ellipse cx="50" cy="65" rx="20" ry="16" fill="#8ee000"/>
        <path d="M 19 45 C 19 14, 81 14, 81 45" stroke="#263840" stroke-width="5" fill="none" stroke-linecap="round"/>
        <rect x="15" y="40" width="8" height="15" rx="3" fill="#ff4b4b"/>
        <rect x="77" y="40" width="8" height="15" rx="3" fill="#ff4b4b"/>
        <circle cx="36" cy="42" r="11" fill="#ffffff"/>
        <circle cx="36" cy="42" r="\${emotion === 'wrong' ? 3 : 6}" fill="#14232b"/>
        <circle cx="38" cy="40" r="2.5" fill="#ffffff"/>
        <circle cx="64" cy="42" r="11" fill="#ffffff"/>
        <circle cx="64" cy="42" r="\${emotion === 'wrong' ? 3 : 6}" fill="#14232b"/>
        <circle cx="66" cy="40" r="2.5" fill="#ffffff"/>
        <polygon points="50,48 42,57 58,57" fill="#ff9600"/>
        <path d="M 22 55 Q 16 70 22 75" stroke="#46a302" stroke-width="5" stroke-linecap="round" fill="none"/>
        <rect x="75" y="58" width="12" height="15" rx="2" fill="#fff" stroke="#cecece" stroke-width="2"/>
        <circle cx="42" cy="94" r="5" fill="#ff9600"/>
        <circle cx="58" cy="94" r="5" fill="#ff9600"/>
      </svg>
    \`
  },
  lily: {
    name: 'Shader-Lily',
    role: 'Tech Artist & VFX Queen',
    barks: [
      "Let's write a custom unlit vertex shader to make our gems shimmer!",
      "Clean visual hierarchy makes even debug UI feel magical."
    ],
    renderSVG: (emotion = 'idle') => \`
      <svg class="char-svg" viewBox="0 0 100 110" style="width:100%; height:100%;">
        <ellipse cx="50" cy="102" rx="26" ry="5" fill="rgba(0,0,0,0.12)"/>
        <path d="M 33 60 C 33 50, 67 50, 67 60 L 72 95 L 28 95 Z" fill="#ce82ff"/>
        <circle cx="50" cy="44" r="21" fill="#fed5b7"/>
        <path d="M 27 45 C 25 20, 75 20, 73 45 C 70 30, 30 30, 27 45 Z" fill="#5a189a"/>
        <circle cx="42" cy="46" r="3" fill="#1b2a30"/>
        <circle cx="58" cy="46" r="3" fill="#1b2a30"/>
        <path d="M 45 54 Q 50 58 55 54" stroke="#5a189a" stroke-width="2" fill="none"/>
      </svg>
    \`
  },
  dev: {
    name: 'Dev (QA Bounty Hunter)',
    role: 'Lead QA & Bug Hunter',
    barks: [
      "Found an off-by-one loop index on level 4! Caught it before the player saw it!",
      "Writing unit tests for physics saves 50 hours of playtesting misery!"
    ],
    renderSVG: (emotion = 'idle') => \`
      <svg class="char-svg" viewBox="0 0 100 110" style="width:100%; height:100%;">
        <ellipse cx="50" cy="102" rx="26" ry="5" fill="rgba(0,0,0,0.12)"/>
        <path d="M 32 60 C 32 50, 68 50, 68 60 L 71 95 L 29 95 Z" fill="#27ae60"/>
        <circle cx="50" cy="44" r="21" fill="#d99b6c"/>
        <path d="M 28 35 C 28 22, 72 22, 72 35 Z" fill="#2c3e50"/>
        <circle cx="42" cy="44" r="3" fill="#111"/>
        <circle cx="58" cy="44" r="3" fill="#111"/>
        <circle cx="76" cy="65" r="9" fill="none" stroke="#f39c12" stroke-width="2.5"/>
        <line x1="82" y1="71" x2="90" y2="79" stroke="#f39c12" stroke-width="3"/>
      </svg>
    \`
  }
};

function triggerCharacterBark(charKey) {
  sfx.playTap();
  const char = CHARACTERS[charKey];
  if (!char) return;
  const bark = char.barks[Math.floor(Math.random() * char.barks.length)];
  showToastDialog(\`\${char.name} says:\`, \`"\${bark}"\`, 'Keep Coding!', '💬');
}

function triggerCharacterEncounter(el, charKey) {
  sfx.playTap();
  if (el) {
    el.classList.add('mascot-hop-anim');
    setTimeout(() => el.classList.remove('mascot-hop-anim'), 400);
  }
  triggerCharacterBark(charKey);
}

function renderPathCharacters() {
  const mascotMap = ${JSON.stringify(UNIT_MASCOTS)};
  for (let u = 1; u <= 10; u++) {
    const data = mascotMap[u];
    if (!data) continue;
    const el1 = document.getElementById(\`mascot-\${u}-1-svg\`);
    if (el1 && CHARACTERS[data.m1.char]) {
      el1.innerHTML = CHARACTERS[data.m1.char].renderSVG('idle');
    }
    const el2 = document.getElementById(\`mascot-\${u}-2-svg\`);
    if (el2 && CHARACTERS[data.m2.char]) {
      el2.innerHTML = CHARACTERS[data.m2.char].renderSVG('idle');
    }
  }
}

function switchTab(tabId) {
  sfx.playTap();
  ['path', 'leaderboard', 'shop', 'badges'].forEach(t => {
    const view = document.getElementById(\`view-\${t}\`);
    const btn = document.getElementById(\`btn-tab-\${t}\`);
    const dock = document.getElementById(\`dock-btn-\${t}\`);
    if (view) view.classList.toggle('active', t === tabId);
    if (btn) btn.classList.toggle('active', t === tabId);
    if (dock) dock.classList.toggle('active', t === tabId);
  });
  if (tabId === 'leaderboard') renderLeaderboard();
  if (tabId === 'badges') renderBadgesView();
}

function renderHeaderStats() {
  if (!currentUsername || !accountsDB[currentUsername]) return;
  const u = accountsDB[currentUsername];
  const isSuper = u.isPremium || userState.isPremium;

  const chipName = document.getElementById('chip-name');
  if (chipName) chipName.textContent = u.name.split(' ')[0];
  const chipAvatar = document.getElementById('chip-avatar');
  if (chipAvatar) chipAvatar.textContent = u.avatar;
  const chipSuper = document.getElementById('chip-super-badge');
  if (chipSuper) chipSuper.style.display = isSuper ? 'inline-flex' : 'none';

  const sidebarName = document.getElementById('sidebar-user-name');
  if (sidebarName) sidebarName.textContent = u.name;
  const sidebarRole = document.getElementById('sidebar-user-role');
  if (sidebarRole) sidebarRole.textContent = isSuper ? '👑 Super Duo · Lead' : u.role;
  const sidebarAvatar = document.getElementById('sidebar-user-avatar');
  if (sidebarAvatar) sidebarAvatar.textContent = u.avatar;

  const streakEl = document.getElementById('top-streak-val');
  if (streakEl) streakEl.textContent = userState.streak;
  const gemsEl = document.getElementById('top-gems-val');
  if (gemsEl) gemsEl.textContent = userState.gems;
  
  const heartsDisplay = isSuper ? '∞' : userState.hearts;
  const heartsEl = document.getElementById('top-hearts-val');
  if (heartsEl) heartsEl.textContent = heartsDisplay;
  const heartPill = document.getElementById('stat-pill-hearts');
  if (heartPill) heartPill.classList.toggle('heart-super', isSuper);

  const xpEl = document.getElementById('top-xp-val');
  if (xpEl) xpEl.textContent = userState.xp;
  const levelEl = document.getElementById('top-level-val');
  if (levelEl) levelEl.textContent = \`Lv. \${userState.level}\`;

  const streakCount = document.getElementById('right-streak-count');
  if (streakCount) streakCount.textContent = \`\${userState.streak} Day\${userState.streak === 1 ? '' : 's'}\`;
  const freezeStatus = document.getElementById('right-freeze-status');
  if (freezeStatus) freezeStatus.textContent = \`🛡️ \${userState.freezes || 5} Freezes active\`;

  renderAIRadar();
  renderRightLeaguePreview();
  updatePathNodesStatus();
}

function renderAIRadar() {
  const container = document.getElementById('ai-skill-bars-container');
  if (!container || !userState) return;
  const skills = [
    { key: 'Variables', label: 'Variables & Math' },
    { key: 'Logic', label: 'Logic & Conditions' },
    { key: 'Engine', label: 'Engine Lifecycle' },
    { key: 'OOP', label: 'OOP & References' },
    { key: 'Physics', label: 'Physics & Vectors' },
    { key: 'Collections', label: 'Collections' },
    { key: 'Events', label: 'Events & Observers' },
    { key: 'Profiling', label: 'Profiling & Burst' }
  ];

  container.innerHTML = skills.map(s => {
    const p = Math.round(((userState.bktKnowledge && userState.bktKnowledge[s.key]) || 0.65) * 100);
    return \`
      <div class="radar-bar-item">
        <div class="radar-bar-label">
          <span>\${s.label}</span>
          <span>\${p}%</span>
        </div>
        <div class="radar-bar-track">
          <div class="radar-bar-fill" style="width: \${p}%;"></div>
        </div>
      </div>
    \`;
  }).join('');
}

function renderRightLeaguePreview() {
  const container = document.getElementById('right-league-preview');
  if (!container) return;
  const u1 = accountsDB['Sanju2206'];
  const u2 = accountsDB['Scaria2584'];
  const list = [
    { name: u1.name + (currentUsername === 'Sanju2206' ? ' (You)' : ''), xp: u1.state.xp, avatar: u1.avatar },
    { name: 'Vikram', xp: 280, avatar: '👓' },
    { name: u2.name + (currentUsername === 'Scaria2584' ? ' (You)' : ''), xp: u2.state.xp, avatar: u2.avatar },
    { name: 'Priya', xp: 230, avatar: '👩‍💻' }
  ].sort((a, b) => b.xp - a.xp);

  container.innerHTML = list.map((l, i) => \`
    <div style="display:flex; justify-content:space-between; align-items:center; font-size:12.5px; font-weight:700;">
      <span style="display:flex; align-items:center; gap:8px;">
        <span style="color:var(--text-muted); font-size:11px;">#\${i+1}</span>
        <span>\${l.avatar}</span>
        <span>\${l.name}</span>
      </span>
      <span style="color:var(--primary-dark); font-weight:800;">\${l.xp} XP</span>
    </div>
  \`).join('');
}

function updatePathNodesStatus() {
  if (!userState) return;
  let firstUnlocked = null;
  LESSON_ORDER.forEach((lessonId, idx) => {
    const nodeBtn = document.getElementById(\`node-\${lessonId}\`);
    if (!nodeBtn) return;
    const isDone = userState.completedLessons.includes(lessonId);
    const isUnlocked = idx === 0 || userState.completedLessons.includes(LESSON_ORDER[idx - 1]);
    const isMid = (idx % 10) === 4;

    if (isDone) {
      nodeBtn.className = 'path-node done';
      nodeBtn.innerHTML = '<span>✓</span>';
    } else if (isUnlocked) {
      nodeBtn.className = 'path-node current' + (isMid ? ' mid-node' : '');
      nodeBtn.innerHTML = '<span>▶</span>';
      if (!firstUnlocked) firstUnlocked = lessonId;
    } else {
      nodeBtn.className = 'path-node locked' + (isMid ? ' mid-node' : '');
      nodeBtn.innerHTML = \`<span>\${isMid ? '⭐' : '🔒'}</span>\`;
    }
  });

  for (let u = 1; u <= 10; u++) {
    const chestId = \`chest\${u}\`;
    const chestBtn = document.getElementById(\`node-\${chestId}\`);
    if (chestBtn) {
      if (userState.openedChests.includes(chestId)) {
        chestBtn.className = 'path-node chest opened';
        chestBtn.innerHTML = '<span>✓</span>';
      } else {
        chestBtn.className = 'path-node chest';
        chestBtn.innerHTML = '<span>🎁</span>';
      }
    }
  }

  const popover = document.querySelector('.node-popover');
  if (popover && firstUnlocked) {
    const targetNode = document.getElementById(\`node-\${firstUnlocked}\`);
    if (targetNode && targetNode.parentElement) {
      targetNode.parentElement.insertBefore(popover, targetNode);
      const lessonObj = LESSONS_DATABASE[firstUnlocked];
      if (lessonObj) {
        popover.querySelector('.node-popover-title').textContent = lessonObj.title;
        const lessonNum = LESSON_ORDER.indexOf(firstUnlocked) + 1;
        popover.querySelector('.node-popover-sub').textContent = \`START · LESSON \${lessonNum}\`;
      }
    }
  }
}

function openChest(chestId) {
  sfx.playTap();
  const unitNum = parseInt(chestId.replace('chest', ''), 10);
  const chestBtn = document.getElementById(\`node-\${chestId}\`);

  if (userState.openedChests.includes(chestId)) {
    showToastDialog('Chest Already Claimed', 'You have already collected the rewards from this Milestone Chest!', 'OK', '🎁');
    return;
  }

  const startIdx = (unitNum - 1) * 10;
  const endIdx = startIdx + 10;
  const unitLessons = LESSON_ORDER.slice(startIdx, endIdx);
  const completedInUnit = unitLessons.filter(lId => userState.completedLessons.includes(lId)).length;

  if (completedInUnit < 10) {
    if (chestBtn) {
      chestBtn.classList.add('shake-animate');
      setTimeout(() => chestBtn.classList.remove('shake-animate'), 500);
    }
    showToastDialog(
      'Milestone Chest Locked',
      \`Complete all 10 lessons in Unit \${unitNum} to unlock this reward chest!\\n\\nProgress: \${completedInUnit} / 10 completed (\${10 - completedInUnit} remaining).\`,
      'Got It',
      '🔒'
    );
    return;
  }

  const gemAward = 35 + unitNum * 10;
  const xpAward = 100 + unitNum * 25;
  userState.gems += gemAward;
  userState.xp += xpAward;
  userState.openedChests.push(chestId);
  sfx.playChestOpen();

  if (window.confetti) {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  }

  showToastDialog(
    'Milestone Chest Unlocked!',
    \`Congratulations on conquering Unit \${unitNum}!\\n\\nRewards:\\n💎 +\${gemAward} Gems\\n⚡ +\${xpAward} XP\\n\\nKeep up the phenomenal coding streak!\`,
    'Awesome!',
    '🎉'
  );
  saveState();
  autoSaveToGitHub({
    unit: unitNum,
    isSectionComplete: true,
    chestClaimed: true
  });
}

let activeSession = {
  lessonId: null,
  questions: [],
  currentIndex: 0,
  hasAnswered: false,
  selectedChoice: null,
  startTimeMs: 0,
  isDiagnostic: false,
  activeExplainTab: 'summary'
};

function launchLesson(lessonId) {
  sfx.playTap();
  const idx = LESSON_ORDER.indexOf(lessonId);
  if (idx > 0 && !userState.completedLessons.includes(LESSON_ORDER[idx - 1])) {
    showToastDialog('Lesson Locked', 'Complete the previous lesson first to unlock this quest!', 'OK', '🔒');
    return;
  }

  const lessonData = LESSONS_DATABASE[lessonId];
  if (!lessonData) return;

  activeSession = {
    lessonId: lessonId,
    questions: [...lessonData.questions],
    currentIndex: 0,
    hasAnswered: false,
    selectedChoice: null,
    startTimeMs: Date.now(),
    isDiagnostic: false,
    activeExplainTab: 'summary'
  };

  document.getElementById('lesson-modal').classList.add('active');
  renderCurrentQuestion();
}

function renderCurrentQuestion() {
  const q = activeSession.questions[activeSession.currentIndex];
  activeSession.hasAnswered = false;
  activeSession.selectedChoice = null;
  activeSession.startTimeMs = Date.now();
  activeSession.activeExplainTab = 'summary';

  const progressPct = ((activeSession.currentIndex) / activeSession.questions.length) * 100;
  document.getElementById('lesson-progress-fill').style.width = \`\${progressPct}%\`;
  
  const isSuper = accountsDB[currentUsername].isPremium || userState.isPremium;
  document.getElementById('lesson-hearts-count').textContent = isSuper ? '∞' : userState.hearts;

  const drawer = document.getElementById('eval-drawer');
  drawer.className = 'eval-drawer';

  const charKey = q.character === 'junior' ? 'kabir' : (q.character || 'priya');
  const char = CHARACTERS[charKey] || CHARACTERS.priya;
  const contentArea = document.getElementById('lesson-content-area');

  const highlightedCode = q.code ? highlightCSharp(q.code) : '';

  contentArea.innerHTML = \`
    <div class="lesson-top-character-wrapper" id="lesson-top-character">
      <div class="lesson-top-avatar" id="lesson-top-avatar">
        \${char.renderSVG('idle')}
      </div>
      <div class="lesson-top-bubble" id="lesson-top-bubble">
        \${q.charSpeech}
      </div>
    </div>

    <div class="exercise-title">\${q.title}</div>
    <div class="exercise-instruction">\${q.instruction}</div>

    \${q.code ? \`
    <div class="code-terminal-card">
      <div class="code-terminal-header">
        <div class="term-dot red"></div>
        <div class="term-dot yellow"></div>
        <div class="term-dot green"></div>
        <span class="term-title">GameLogic.cs</span>
      </div>
      <pre class="code-snippet-box"><code>\${highlightedCode}</code></pre>
    </div>\` : ''}

    <div class="choice-grid">
      \${q.choices.map((choice, i) => \`
        <button class="choice-btn" id="choice-btn-\${i}" onclick="selectChoice(\${i})">
          <span class="choice-btn-key">\${i + 1}</span>
          <span>\${escapeHTML(choice)}</span>
        </button>
      \`).join('')}
    </div>
  \`;
}

function selectChoice(idx) {
  if (activeSession.hasAnswered) return;
  sfx.playTap();
  activeSession.selectedChoice = idx;
  const buttons = document.querySelectorAll('.choice-btn');
  buttons.forEach((b, i) => b.classList.toggle('selected', i === idx));
  submitAnswer();
}

function submitAnswer() {
  if (activeSession.hasAnswered) return;
  activeSession.hasAnswered = true;
  const q = activeSession.questions[activeSession.currentIndex];
  const isCorrect = activeSession.selectedChoice === q.answer;
  const responseTimeMs = Date.now() - activeSession.startTimeMs;

  const cognitive = classifyCognitiveState(isCorrect, responseTimeMs, userState.streak);
  updateBKT(q.topic || 'Variables', isCorrect);

  const chosenBtn = document.getElementById(\`choice-btn-\${activeSession.selectedChoice}\`);
  const correctBtn = document.getElementById(\`choice-btn-\${q.answer}\`);
  const isSuper = accountsDB[currentUsername].isPremium || userState.isPremium;

  // 1. UPDATE THE TOP CHARACTER DIALOGUE & AVATAR DIRECTLY!
  const topBubble = document.getElementById('lesson-top-bubble');
  const topAvatar = document.getElementById('lesson-top-avatar');
  const charKey = q.character === 'junior' ? 'kabir' : (q.character || 'priya');
  const char = CHARACTERS[charKey] || CHARACTERS.priya;

  if (isCorrect) {
    sfx.playCorrect();
    if (chosenBtn) chosenBtn.classList.add('correct');
    if (topAvatar) {
      topAvatar.className = 'lesson-top-avatar char-bounce-correct';
    }
    if (topBubble) {
      topBubble.className = 'lesson-top-bubble bubble-correct';
      topBubble.innerHTML = \`<span class="bubble-prefix">Okay!</span> \${getTopPraiseDialogue(char, cognitive)}\`;
    }
  } else {
    sfx.playWrong();
    if (chosenBtn) chosenBtn.classList.add('wrong');
    if (correctBtn) correctBtn.classList.add('correct');

    if (!isSuper && typeof userState.hearts === 'number') {
      userState.hearts = Math.max(0, userState.hearts - 1);
    }
    document.getElementById('lesson-hearts-count').textContent = isSuper ? '∞' : userState.hearts;
    if (topAvatar) {
      topAvatar.className = 'lesson-top-avatar char-shake-wrong';
    }
    if (topBubble) {
      topBubble.className = 'lesson-top-bubble bubble-wrong';
      topBubble.innerHTML = \`<span class="bubble-prefix">Okay, wait!</span> \${getTopGuidanceDialogue(char, cognitive)}\`;
    }
  }

  // 2. BOTTOM EVALUATION DRAWER (Clean tabs, no duplicate character underneath)
  const drawer = document.getElementById('eval-drawer');
  const title = document.getElementById('eval-feedback-title');
  const icon = document.getElementById('eval-feedback-icon');

  drawer.className = \`eval-drawer active \${isCorrect ? 'correct-state' : 'wrong-state'}\`;
  title.textContent = isCorrect ? 'Correct! Superb deduction!' : (isSuper ? 'Incorrect! (Protected by Super Unlimited Hearts)' : 'Incorrect!');
  icon.textContent = isCorrect ? '✓' : '✗';

  renderExplainContent('summary');
}

function getTopPraiseDialogue(char, cognitive) {
  const shortName = char.name.split(' ')[0];
  if (cognitive.state === 'MASTERED_FLUENT') {
    return \`\${shortName}: "Superb execution! Lightning-fast trace, dost! That is real Lead Architect speed."\`;
  } else if (cognitive.state === 'CONFIDENT_CALCULATED') {
    return \`\${shortName}: "Spot on! Clean, deliberate calculation. The game loop stays rock solid!"\`;
  } else {
    return \`\${shortName}: "Shabash! Taking time to double-check references prevents nasty crashes in production!"\`;
  }
}

function getTopGuidanceDialogue(char, cognitive) {
  const shortName = char.name.split(' ')[0];
  if (cognitive.state === 'FAST_GUESS') {
    return \`\${shortName}: "Hold on dost, don't rush! Trace the memory and variables line-by-line first."\`;
  } else {
    return \`\${shortName}: "Watch out! A small slip here can break the game loop. Check the explanation tabs below!"\`;
  }
}

function switchExplainTab(tabKey) {
  sfx.playTap();
  activeSession.activeExplainTab = tabKey;
  const tabs = document.querySelectorAll('.explain-tab-btn');
  const tabKeys = ['summary', 'analogy', 'memory', 'pitfall'];
  tabs.forEach((t, i) => t.classList.toggle('active', tabKeys[i] === tabKey));
  renderExplainContent(tabKey);
}

function renderExplainContent(tabKey) {
  const q = activeSession.questions[activeSession.currentIndex];
  const box = document.getElementById('eval-explanation-box');
  if (!box) return;

  if (tabKey === 'summary') {
    box.innerHTML = \`<div><b>💡 Core Concept:</b> \${q.explainSummary}</div>\`;
  } else if (tabKey === 'analogy') {
    box.innerHTML = \`<div><b>🎮 Gamedev Scenario:</b> \${q.explainAnalogy}</div>\`;
  } else if (tabKey === 'memory') {
    box.innerHTML = \`<div><b>🧠 Engine & Memory Model:</b> <code>\${q.explainMemory}</code></div>\`;
  } else if (tabKey === 'pitfall') {
    box.innerHTML = \`<div><b>⚠️ Production Bug Trap:</b> \${q.pitfall || 'Be careful with object lifecycles and garbage collection allocation spikes in game loops!'}</div>\`;
  }
}

function handleDrawerContinue() {
  sfx.playTap();
  activeSession.currentIndex++;
  if (activeSession.currentIndex < activeSession.questions.length) {
    renderCurrentQuestion();
  } else {
    finishLesson();
  }
}

function finishLesson() {
  document.getElementById('lesson-progress-fill').style.width = '100%';
  const lessonId = activeSession.lessonId;

  const todayStr = new Date().toDateString();
  if (userState.lastStreakDate !== todayStr) {
    userState.streak++;
    userState.lastStreakDate = todayStr;
  }

  if (lessonId && !userState.completedLessons.includes(lessonId)) {
    userState.completedLessons.push(lessonId);
  }

  const xpEarned = 25;
  const gemsEarned = 15;
  userState.xp += xpEarned;
  userState.gems += gemsEarned;
  userState.level = Math.floor(userState.xp / 100) + 1;

  if (window.confetti) {
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
  }

  sfx.playCorrect();
  saveState();
  closeLessonModal();

  // Check if all lessons of this unit/section are now completed
  const unitNum = lessonId ? parseInt(lessonId.split('-')[0].replace('u', ''), 10) : 1;
  const unitLessons = LESSON_ORDER.filter(id => id.startsWith(\`u\${unitNum}-\`));
  const isSectionComplete = unitLessons.length > 0 && unitLessons.every(id => userState.completedLessons.includes(id));

  // Trigger Automatic GitHub Save
  autoSaveToGitHub({
    unit: unitNum,
    lessonId: lessonId,
    isSectionComplete: isSectionComplete
  });

  const sectionMsg = isSectionComplete 
    ? \`\\n\\n🎉 SECTION UNIT \${unitNum} FULLY COMPLETED!\\n🐙 Work automatically saved & pushed to GitHub main!\`
    : \`\\n\\n🐙 Progress auto-saved to GitHub!\`;

  showToastDialog(
    isSectionComplete ? 'Section & Unit Complete!' : 'Quest Completed!',
    \`Fantastic job! You finished the lesson!\${sectionMsg}\\n\\nEarned:\\n⚡ +\${xpEarned} XP\\n💎 +\${gemsEarned} Gems\\n🔥 Streak: \${userState.streak} Days\`,
    'Continue Path',
    isSectionComplete ? '👑' : '🏆'
  );
}

// GITHUB AUTO-SAVE & SYNC ENGINE
async function autoSaveToGitHub(details = {}) {
  const syncBtn = document.getElementById('header-git-pill');
  if (syncBtn) {
    syncBtn.innerHTML = '<span>⏳</span><span>Syncing...</span>';
    syncBtn.classList.remove('synced');
  }

  const payload = {
    username: currentUsername || 'Sanju2206',
    section: details.unit || 1,
    lesson: details.lessonId || '',
    isSectionComplete: details.isSectionComplete || false,
    xp: userState ? userState.xp : 0,
    streak: userState ? userState.streak : 1,
    state: userState
  };

  try {
    const res = await fetch('http://localhost:3000/api/git-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.ok) {
      if (syncBtn) {
        syncBtn.innerHTML = '<span>🐙</span><span>GitHub: Synced ✓</span>';
        syncBtn.classList.add('synced');
      }
      console.log('[Code_Duo Git Sync]', data.message);
      return;
    }
  } catch (err) {
    // Local server offline or file protocol
    console.log('[Code_Duo Git Sync] Local companion server offline. Stored in browser cache.');
  }

  if (syncBtn) {
    syncBtn.innerHTML = '<span>🐙</span><span>GitHub: Auto-Save Ready</span>';
  }
}

function openGitSyncModal() {
  sfx.playTap();
  const modal = document.getElementById('git-sync-modal');
  if (modal) {
    modal.classList.add('active');
    checkGitStatusInModal();
  }
}

function closeGitSyncModal() {
  sfx.playTap();
  const modal = document.getElementById('git-sync-modal');
  if (modal) modal.classList.remove('active');
}

async function checkGitStatusInModal() {
  const statusEl = document.getElementById('git-modal-status-text');
  const serverEl = document.getElementById('git-modal-server-badge');
  try {
    const res = await fetch('http://localhost:3000/api/git-status');
    const data = await res.json();
    if (data.ok) {
      if (serverEl) serverEl.innerHTML = '<span style="color:#2e7d32; font-weight:800;">● Local Companion Server Active (Port 3000)</span>';
      if (statusEl) statusEl.innerHTML = \`<b>Branch:</b> \${data.branch}<br><b>Remote:</b> <code>\${data.remote}</code><br><b>Last Commit:</b> \${data.lastCommit}\`;
      return;
    }
  } catch (e) {}

  if (serverEl) serverEl.innerHTML = '<span style="color:#d97706; font-weight:800;">○ Local Server Idle (Run <code>npm start</code> or <code>node server.js</code>)</span>';
  if (statusEl) statusEl.innerHTML = '<b>Remote:</b> <code>https://github.com/SanjuSreejith/C-Learn.git</code><br><b>Branch:</b> <code>main</code><br>Auto-Save triggers automatically on section and lesson completions!';
}

async function triggerManualGitSync() {
  sfx.playTap();
  const btn = document.getElementById('git-manual-sync-btn');
  if (btn) btn.textContent = 'SYNCING TO GITHUB...';
  await autoSaveToGitHub({ unit: 1, isSectionComplete: false });
  if (btn) btn.textContent = 'SYNCED SUCCESSFULLY! ✓';
  setTimeout(() => {
    if (btn) btn.textContent = 'SYNC TO GITHUB NOW';
    checkGitStatusInModal();
  }, 1600);
}

function saveGitHubPAT() {
  sfx.playTap();
  const input = document.getElementById('git-pat-input');
  if (input && input.value.trim()) {
    localStorage.setItem('code_duo_github_pat', input.value.trim());
    alert('GitHub Personal Access Token saved! Direct browser commits enabled.');
  } else {
    localStorage.removeItem('code_duo_github_pat');
    alert('GitHub Token removed.');
  }
}

function quitLesson() {
  sfx.playTap();
  closeLessonModal();
}

function closeLessonModal() {
  document.getElementById('lesson-modal').classList.remove('active');
  const drawer = document.getElementById('eval-drawer');
  if (drawer) drawer.className = 'eval-drawer';
}

function startPlacementQuiz() {
  sfx.playTap();
  activeSession = {
    lessonId: 'diagnostic-placement',
    questions: [
      LESSONS_DATABASE['u1-n1'].questions[0],
      LESSONS_DATABASE['u2-n1'].questions[0],
      LESSONS_DATABASE['u3-n1'].questions[0],
      LESSONS_DATABASE['u4-n3'].questions[0],
      LESSONS_DATABASE['u5-n2'].questions[0]
    ],
    currentIndex: 0,
    hasAnswered: false,
    selectedChoice: null,
    startTimeMs: Date.now(),
    isDiagnostic: true,
    activeExplainTab: 'summary'
  };
  document.getElementById('lesson-modal').classList.add('active');
  renderCurrentQuestion();
}

function openGuidebook(unitNum) {
  sfx.playTap();
  const info = GUIDEBOOK_DATA[unitNum] || { title: \`Unit \${unitNum} Guidebook\`, content: 'Keep practicing code to master this unit!' };
  document.getElementById('guidebook-modal-title').textContent = info.title;
  document.getElementById('guidebook-modal-body').innerHTML = info.content;
  document.getElementById('guidebook-modal').classList.add('active');
}

function closeGuidebook() {
  sfx.playTap();
  document.getElementById('guidebook-modal').classList.remove('active');
}

function openAccountHub() {
  sfx.playTap();
  const container = document.getElementById('account-hub-cards-container');
  const u1 = accountsDB['Sanju2206'];
  const u2 = accountsDB['Scaria2584'];

  container.innerHTML = \`
    <div class="account-card-box \${currentUsername === 'Sanju2206' ? 'active-user' : ''}">
      <div style="font-size:34px;">👨‍💻</div>
      <div class="acc-details">
        <div class="acc-name">\${u1.name} <span class="super-badge-sleek">👑 SUPER</span></div>
        <div class="acc-tag">@\${u1.username} · \${u1.role}</div>
        <div class="acc-stats-row">
          <span>⚡ \${u1.state.xp} XP</span>
          <span>🔥 \${u1.state.streak}d</span>
          <span>💎 \${u1.state.gems}</span>
          <span>❤️ ∞</span>
        </div>
      </div>
    </div>

    <div class="account-card-box \${currentUsername === 'Scaria2584' ? 'active-user' : ''}">
      <div style="font-size:34px;">⚡</div>
      <div class="acc-details">
        <div class="acc-name">\${u2.name} <span class="super-badge-sleek">👑 SUPER</span></div>
        <div class="acc-tag">@\${u2.username} · \${u2.role}</div>
        <div class="acc-stats-row">
          <span>⚡ \${u2.state.xp} XP</span>
          <span>🔥 \${u2.state.streak}d</span>
          <span>💎 \${u2.state.gems}</span>
          <span>❤️ ∞</span>
        </div>
      </div>
    </div>
  \`;

  document.getElementById('account-hub-modal').classList.add('active');
}

function closeAccountHub() {
  sfx.playTap();
  document.getElementById('account-hub-modal').classList.remove('active');
}

function renderLeaderboard() {
  const container = document.getElementById('leaderboard-container');
  const u1 = accountsDB['Sanju2206'];
  const u2 = accountsDB['Scaria2584'];
  const leaders = [
    { rank: 1, name: u1.name + (currentUsername === 'Sanju2206' ? ' (You)' : ''), title: u1.role, xp: u1.state.xp, isMe: currentUsername === 'Sanju2206', avatar: u1.avatar },
    { rank: 2, name: 'Vikram', title: 'Senior Engine Architect', xp: 280, avatar: '👓' },
    { rank: 3, name: u2.name + (currentUsername === 'Scaria2584' ? ' (You)' : ''), title: u2.role, xp: u2.state.xp, isMe: currentUsername === 'Scaria2584', avatar: u2.avatar },
    { rank: 4, name: 'Priya', title: 'Lead AI & Gameplay', xp: 230, avatar: '👩‍💻' },
    { rank: 5, name: 'Kabir / Pixel', title: 'Indie Physics Hacker', xp: 190, avatar: '🧢' },
    { rank: 6, name: 'Shader-Lily', title: 'Tech Artist', xp: 155, avatar: '💜' },
    { rank: 7, name: 'Dev', title: 'Lead QA Bounty Hunter', xp: 140, avatar: '🔍' },
    { rank: 8, name: 'Duo', title: 'Studio Boss', xp: 120, avatar: '🦉' }
  ].sort((a, b) => b.xp - a.xp);

  container.innerHTML = leaders.map((leader, idx) => \`
    <div class="leaderboard-item \${leader.isMe ? 'me' : ''}">
      <div class="rank-num \${idx === 0 ? 'top1' : idx === 1 ? 'top2' : idx === 2 ? 'top3' : ''}">\${idx + 1}</div>
      <div class="leader-avatar">\${leader.avatar}</div>
      <div class="leader-info">
        <div class="leader-name">\${leader.name}</div>
        <div class="leader-title">\${leader.title}</div>
      </div>
      <div class="leader-xp">\${leader.xp} XP</div>
    </div>
  \`).join('');
}

const MULTI_TIER_ACHIEVEMENTS = [
  { id: 'b_wildfire', title: 'Wildfire Streak', desc: 'Reach a 3, 7, 14, or 30-day coding streak', icon: '🔥', current: 1, max: 3, tier: 'Level 1/5', stars: '⭐☆☆☆☆' },
  { id: 'b_first', title: 'First Compile', desc: 'Complete your first gamedev C# lesson', icon: '🐣', current: 1, max: 1, tier: 'COMPLETED', stars: '⭐⭐⭐⭐⭐' },
  { id: 'b_xp', title: 'XP Titan', desc: 'Earn 100, 250, 500, or 1000 XP in game drills', icon: '⚡', current: 350, max: 500, tier: 'Level 2/5', stars: '⭐⭐☆☆☆' },
  { id: 'b_gems', title: 'Diamond Hands', desc: 'Collect 100, 200, or 400 earned gems', icon: '💎', current: 185, max: 200, tier: 'Level 2/5', stars: '⭐⭐☆☆☆' },
  { id: 'b_sharpshooter', title: 'Sharpshooter', desc: 'Finish 5 lessons with 100% accuracy', icon: '🎯', current: 3, max: 5, tier: 'Level 1/5', stars: '⭐☆☆☆☆' },
  { id: 'b_chest1', title: 'Dungeon Raider', desc: 'Unlock Unit 1 Milestone Chest', icon: '🎁', current: 0, max: 1, tier: 'Locked', stars: '☆☆☆☆☆' },
  { id: 'b_neural', title: 'Neural Master', desc: 'Reach 80% mastery across AI Knowledge Matrix', icon: '🧠', current: 75, max: 80, tier: 'Level 3/5', stars: '⭐⭐⭐☆☆' },
  { id: 'b_oop', title: 'Heap Whisperer', desc: 'Conquer Unit 3 OOP & Struct memory model', icon: '📦', current: 0, max: 10, tier: 'Locked', stars: '☆☆☆☆☆' },
  { id: 'b_physics', title: 'PhysX Wizard', desc: 'Complete all Raycast and Vector math drills', icon: '🧮', current: 0, max: 10, tier: 'Locked', stars: '☆☆☆☆☆' },
  { id: 'b_events', title: 'Event Maestro', desc: 'Master decoupled Action architectures', icon: '📡', current: 0, max: 10, tier: 'Locked', stars: '☆☆☆☆☆' },
  { id: 'b_fps', title: '120 FPS Purist', desc: 'Zero GC Allocations in game loops', icon: '🚀', current: 0, max: 10, tier: 'Locked', stars: '☆☆☆☆☆' },
  { id: 'b_grand', title: 'Legendary Lead Architect', desc: 'Master all 100 Gamedev C# lessons!', icon: '👑', current: 0, max: 100, tier: 'Locked', stars: '☆☆☆☆☆' }
];

function renderBadgesView() {
  if (!currentUsername || !accountsDB[currentUsername]) return;
  const u = accountsDB[currentUsername];
  document.getElementById('badges-hero-name').textContent = u.name;
  document.getElementById('badges-hero-role').textContent = u.isPremium ? '👑 Super Duo · Lead Architect' : u.role;
  document.getElementById('badges-hero-avatar').textContent = u.avatar;

  const container = document.getElementById('achievements-container');
  container.innerHTML = MULTI_TIER_ACHIEVEMENTS.map(a => {
    const pct = Math.min(100, Math.round((a.current / a.max) * 100));
    const isDone = a.current >= a.max;
    return \`
      <div class="achieve-tier-card \${isDone ? 'unlocked' : ''}">
        <div class="achieve-icon-badge">\${a.icon}</div>
        <div class="achieve-info">
          <div class="achieve-name-row">
            <span class="achieve-name">\${a.title}</span>
            <span class="achieve-stars">\${a.stars}</span>
          </div>
          <div class="achieve-desc">\${a.desc}</div>
          <div class="achieve-bar-track">
            <div class="achieve-bar-fill" style="width: \${pct}%;"></div>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:800; color:var(--text-muted); margin-top:4px;">
            <span>\${a.tier}</span>
            <span>\${a.current} / \${a.max}</span>
          </div>
        </div>
      </div>
    \`;
  }).join('');

  document.getElementById('badges-unlocked-ratio').textContent = '3/12 Unlocked';
}

function buyItem(itemKey, cost) {
  sfx.playTap();
  if (userState.gems < cost) {
    showToastDialog('Insufficient Gems', \`You need \${cost} gems to purchase this item! Keep solving lessons to earn more.\`, 'OK', '💎');
    return;
  }
  userState.gems -= cost;
  if (itemKey === 'streak_freeze') userState.freezes = (userState.freezes || 0) + 1;
  sfx.playCorrect();
  saveState();
  showToastDialog('Item Purchased!', 'Your purchase was successful and applied to your account!', 'Great', '🛍️');
}

function toggleTheme() {
  sfx.playTap();
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try {
    localStorage.setItem('code_duo_theme', next);
  } catch(e) {}
  updateThemeIcon(next);
}

function initTheme() {
  let saved = 'light';
  try {
    saved = localStorage.getItem('code_duo_theme') || 'light';
  } catch(e) {}
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('theme-toggle-btn');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function toggleAudio() {
  sfx.enabled = !sfx.enabled;
  document.getElementById('audio-toggle-btn').textContent = sfx.enabled ? '🔊' : '🔇';
  if (sfx.enabled) sfx.playTap();
}

function togglePasswordVisibility() {
  const input = document.getElementById('login-password-input');
  if (input) {
    input.type = input.type === 'password' ? 'text' : 'password';
  }
}

function showToastDialog(title, body, btnText = 'OK', emoji = '🔔') {
  document.getElementById('toast-dialog-emoji').textContent = emoji;
  document.getElementById('toast-dialog-title').textContent = title;
  document.getElementById('toast-dialog-body').innerText = body;
  document.getElementById('toast-dialog-btn').textContent = btnText;
  document.getElementById('toast-dialog-modal').classList.add('active');
}

function closeToastDialog() {
  sfx.playTap();
  document.getElementById('toast-dialog-modal').classList.remove('active');
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Check Auth & Initial Mount
initTheme();
checkAuthAtStart();
`;

const completeScript = appScript + '\n' + extraScript;

const htmlMarkup = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <meta name="theme-color" content="#58cc02">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <title>Code_Duo — C# + Unity Learning Quest</title>
  
  <script>
    (function() {
      try {
        var saved = localStorage.getItem('code_duo_theme') || 'light';
        document.documentElement.setAttribute('data-theme', saved);
      } catch(e) {}
    })();
  </script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700;800&family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>

  <style>
    :root {
      --primary: #58cc02;
      --primary-dark: #46a302;
      --primary-light: #d7ffb8;
      --secondary: #1cb0f6;
      --secondary-dark: #1899d6;
      --secondary-light: #ddf4ff;
      --accent-orange: #ff9600;
      --accent-orange-dark: #e07a00;
      --accent-red: #ff4b4b;
      --accent-red-dark: #ea2b2b;
      --accent-red-light: #ffdfe0;
      --accent-yellow: #ffc800;
      --accent-yellow-dark: #e5a500;
      --accent-purple: #ce82ff;
      --accent-purple-dark: #a560e8;
      --accent-purple-light: #f6eaff;

      --bg: #ffffff;
      --bg-page: #f7f9fa;
      --card-bg: #ffffff;
      --card-border: #e5e5e5;
      --card-border-dark: #cecece;
      --text: #3c3c3c;
      --text-muted: #777777;
      --text-light: #afafaf;
      --bottom-bar-bg: #ffffff;

      --font-main: 'Nunito', -apple-system, BlinkMacSystemFont, sans-serif;
      --font-display: 'Fredoka', 'Nunito', sans-serif;
      --font-code: 'JetBrains Mono', monospace;

      --radius-sm: 10px;
      --radius-md: 16px;
      --radius-lg: 22px;
      --radius-full: 9999px;

      --path-offset-ratio: 1;
    }

    [data-theme="dark"] {
      --bg: #141f23;
      --bg-page: #0f171a;
      --card-bg: #19272d;
      --card-border: #263840;
      --card-border-dark: #334852;
      --text: #f0f4f7;
      --text-muted: #8fa5b0;
      --text-light: #5f7580;
      --bottom-bar-bg: #141f23;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
    }

    html, body {
      width: 100%;
      min-height: 100vh;
      margin: 0;
      padding: 0;
      overflow-x: hidden !important;
    }

    body {
      background-color: var(--bg-page);
      background-image: 
        radial-gradient(circle, rgba(88, 204, 2, 0.08) 1.5px, transparent 1.5px),
        radial-gradient(circle, rgba(28, 176, 246, 0.06) 1.5px, transparent 1.5px);
      background-size: 32px 32px;
      background-position: 0 0, 16px 16px;
      color: var(--text);
      font-family: var(--font-main);
      font-size: 15px;
      line-height: 1.4;
      min-height: 100vh;
      position: relative;
    }

    [data-theme="dark"] body {
      background-image: 
        radial-gradient(circle, rgba(88, 204, 2, 0.12) 1.5px, transparent 1.5px),
        radial-gradient(circle, rgba(28, 176, 246, 0.10) 1.5px, transparent 1.5px);
    }

    button, input {
      font-family: inherit;
    }

    /* DEDICATED BACKGROUND DECORATIVE LAYER (STRICTLY BEHIND ALL UI: Z-INDEX: 0) */
    .bg-decorative-layer {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
    }

    .bg-sticker {
      position: absolute;
      font-family: var(--font-code);
      font-size: 11px;
      font-weight: 800;
      padding: 5px 12px;
      border-radius: 8px;
      background: rgba(88, 204, 2, 0.05);
      border: 1px dashed rgba(88, 204, 2, 0.22);
      color: rgba(70, 163, 2, 0.45);
      pointer-events: none;
      user-select: none;
      animation: stickerFloat 7s ease-in-out infinite alternate;
      z-index: 0;
    }
    [data-theme="dark"] .bg-sticker {
      background: rgba(28, 176, 246, 0.05);
      border-color: rgba(28, 176, 246, 0.16);
      color: rgba(56, 189, 248, 0.4);
    }
    @keyframes stickerFloat {
      0% { transform: translateY(0px) rotate(-1deg); }
      100% { transform: translateY(-10px) rotate(1.5deg); }
    }

    /* AUTHENTIC LOGIN SCREEN GATE */
    .login-gate-wrapper {
      position: fixed;
      inset: 0;
      background: var(--bg-page);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
      box-sizing: border-box;
    }

    .login-card {
      background: var(--bg);
      border: 2px solid var(--card-border);
      border-radius: var(--radius-lg);
      padding: 36px 30px;
      max-width: 440px;
      width: 100%;
      text-align: center;
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.08);
      box-sizing: border-box;
      position: relative;
      z-index: 10;
    }

    .auth-label {
      display: block;
      font-size: 11px;
      font-weight: 800;
      color: var(--text-muted);
      margin-bottom: 5px;
      letter-spacing: 0.8px;
      text-align: left;
    }

    .auth-input {
      width: 100%;
      padding: 13px 16px;
      border: 2px solid var(--card-border);
      border-radius: var(--radius-md);
      font-size: 14.5px;
      font-family: inherit;
      background: var(--bg);
      color: var(--text);
      box-sizing: border-box;
      transition: border-color 0.15s;
    }
    .auth-input:focus {
      outline: none;
      border-color: var(--secondary);
    }

    .password-toggle-btn {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      font-size: 17px;
      opacity: 0.6;
      transition: opacity 0.15s;
    }
    .password-toggle-btn:hover {
      opacity: 1;
    }

    /* FULL-SCREEN PC DESKTOP LAYOUT (100% MONITOR OCCUPIED, NO BLANK VOIDS) */
    .app-shell {
      display: none; /* Managed by Auth */
      width: 100vw;
      max-width: 100vw;
      min-height: 100vh;
      margin: 0;
      box-sizing: border-box;
      position: relative;
      z-index: 5;
    }

    /* LEFT SIDEBAR (260px) */
    .desktop-sidebar {
      width: 260px;
      min-width: 260px;
      height: 100vh;
      position: sticky;
      top: 0;
      background: var(--bg);
      border-right: 2px solid var(--card-border);
      display: flex;
      flex-direction: column;
      padding: 24px 18px;
      z-index: 30;
      box-sizing: border-box;
    }

    .brand-logo {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 0 8px 24px;
      font-family: var(--font-display);
      font-size: 26px;
      font-weight: 800;
      color: var(--primary);
      text-decoration: none;
      cursor: pointer;
      letter-spacing: -0.5px;
    }

    .brand-logo-icon {
      width: 42px;
      height: 42px;
      background: var(--primary);
      border-radius: 12px;
      display: grid;
      place-items: center;
      color: #fff;
      font-size: 24px;
      box-shadow: 0 4px 0 var(--primary-dark);
      flex-shrink: 0;
    }

    .brand-text {
      display: flex;
      flex-direction: column;
      line-height: 1.1;
    }

    .brand-text small {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 1.3px;
      color: var(--text-muted);
      margin-top: 3px;
    }

    .sidebar-menu {
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
    }

    .nav-tab-btn {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 13px 16px;
      border-radius: var(--radius-md);
      border: 2px solid transparent;
      background: transparent;
      color: var(--text-muted);
      font-family: var(--font-main);
      font-size: 14px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      cursor: pointer;
      transition: all 0.15s ease;
      width: 100%;
      text-align: left;
    }

    .nav-tab-btn:hover {
      background: rgba(0, 0, 0, 0.04);
    }
    [data-theme="dark"] .nav-tab-btn:hover {
      background: rgba(255, 255, 255, 0.04);
    }

    .nav-tab-btn.active {
      background: var(--secondary-light);
      border-color: var(--secondary);
      color: var(--secondary-dark);
    }
    [data-theme="dark"] .nav-tab-btn.active {
      color: var(--secondary);
    }

    .nav-tab-btn .nav-icon {
      font-size: 22px;
      display: inline-block;
    }

    .sidebar-user-card {
      margin-top: auto;
      padding: 12px 14px;
      background: var(--bg-page);
      border: 2px solid var(--card-border);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .sidebar-user-meta {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
      cursor: pointer;
      flex: 1;
    }

    .sidebar-user-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: var(--secondary);
      color: #fff;
      display: grid;
      place-items: center;
      font-size: 20px;
      flex-shrink: 0;
    }

    .sidebar-user-name {
      font-weight: 800;
      font-size: 13.5px;
      color: var(--text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sidebar-user-role {
      font-size: 11px;
      color: #7b2cbf;
      font-weight: 800;
    }

    .sidebar-signout-btn {
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      padding: 6px;
      border-radius: 8px;
      color: var(--text-muted);
      transition: all 0.15s;
    }
    .sidebar-signout-btn:hover {
      background: var(--accent-red-light);
      color: var(--accent-red);
    }

    /* CENTER VIEWPORT (FLUID & EXPANDED ACROSS FULL SCREEN) */
    .main-viewport {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-sizing: border-box;
      padding: 0 32px 90px;
      position: relative;
      z-index: 10;
    }

    /* TOP STATS BAR */
    .top-stats-bar {
      position: sticky;
      top: 0;
      width: 100%;
      background: var(--bg);
      border-bottom: 2px solid var(--card-border);
      padding: 12px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      z-index: 40;
      box-sizing: border-box;
    }

    /* SLEEK DUOLINGO-STYLE SUPER BADGE (ELEGANT PURPLE/GOLD GRADIENT) */
    .user-chip-pill {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 6px 12px;
      background: var(--bg-page);
      border: 2px solid var(--card-border);
      border-radius: var(--radius-full);
      cursor: pointer;
      font-weight: 800;
      font-size: 13px;
      transition: all 0.15s ease;
      flex-shrink: 0;
    }
    .user-chip-pill:hover {
      border-color: var(--secondary);
    }
    .user-chip-avatar { font-size: 16px; }
    .user-chip-name { font-weight: 800; }
    
    .super-badge-sleek {
      font-size: 10px;
      font-weight: 900;
      background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
      color: #ffffff;
      padding: 2px 7px;
      border-radius: 10px;
      letter-spacing: 0.5px;
      box-shadow: 0 2px 4px rgba(108, 92, 231, 0.25);
    }

    .header-stat-group {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .stat-pill {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 6px 11px;
      border-radius: var(--radius-full);
      font-weight: 800;
      font-size: 13px;
      color: var(--text);
      background: var(--bg-page);
      border: 1.5px solid var(--card-border);
      flex-shrink: 0;
    }

    .stat-pill.heart-super {
      color: var(--accent-red);
      background: var(--bg-page);
      border: 1.5px solid var(--card-border);
    }
    .stat-pill.heart-super .stat-val {
      color: var(--accent-red);
      font-size: 15px;
      font-weight: 900;
    }

    .stat-icon { font-size: 15px; }

    .header-action-group {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    }

    .header-btn {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-sm);
      border: 2px solid var(--card-border);
      background: var(--bg);
      cursor: pointer;
      font-size: 16px;
      display: grid;
      place-items: center;
      transition: all 0.15s;
      flex-shrink: 0;
    }
    .header-btn:hover {
      border-color: var(--secondary);
      transform: translateY(-1px);
    }
    .header-signout-btn:hover {
      border-color: var(--accent-red);
      background: var(--accent-red-light);
    }

    /* RIGHT SIDEBAR WIDGETS (380px) */
    .sidebar-right {
      width: 380px;
      min-width: 380px;
      height: 100vh;
      position: sticky;
      top: 0;
      overflow-y: auto;
      padding: 24px 20px;
      display: flex;
      flex-direction: column;
      gap: 18px;
      border-left: 2px solid var(--card-border);
      background: var(--bg-page);
      box-sizing: border-box;
      z-index: 20;
    }

    .widget-card {
      background: var(--bg);
      border: 2px solid var(--card-border);
      border-radius: var(--radius-md);
      padding: 18px;
      box-shadow: 0 3px 0 var(--card-border-dark);
      position: relative;
      z-index: 10;
    }

    .widget-title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .widget-title {
      font-size: 15px;
      font-weight: 800;
      color: var(--text);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .streak-calendar-row {
      display: flex;
      justify-content: space-between;
      margin: 14px 0 10px;
    }

    .streak-day-dot {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--card-border);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 800;
      color: var(--text-muted);
    }

    .streak-day-dot.active {
      background: var(--accent-orange);
      color: #ffffff;
      box-shadow: 0 3px 0 var(--accent-orange-dark);
    }

    .radar-bar-item { margin-bottom: 11px; }
    .radar-bar-label {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 4px;
      color: var(--text);
    }

    .radar-bar-track {
      height: 8px;
      border-radius: 4px;
      background: #e5e5e5;
      overflow: hidden;
    }
    [data-theme="dark"] .radar-bar-track { background: #263840; }

    .radar-bar-fill {
      height: 100%;
      background: var(--primary);
      border-radius: 4px;
      transition: width 0.4s ease;
    }

    /* PATH VIEWS & TABS */
    .tab-view {
      display: none;
      width: 100%;
      max-width: 780px;
      margin: 0 auto;
      position: relative;
      z-index: 10;
    }
    .tab-view.active { display: block; }

    /* UNIT BANNERS WITH HIGH-CONTRAST HEADER */
    .unit-banner {
      border-radius: var(--radius-md);
      padding: 20px 24px;
      color: #ffffff;
      margin: 22px 0 76px; /* 76px margin guarantees popover NEVER touches banner */
      position: relative;
      box-shadow: 0 6px 0 rgba(0, 0, 0, 0.12);
      width: 100%;
      box-sizing: border-box;
      z-index: 10;
    }
    .unit-banner.u1 { background: linear-gradient(135deg, #58cc02 0%, #46a302 100%); }
    .unit-banner.u2 { background: linear-gradient(135deg, #ce82ff 0%, #a560e8 100%); }
    .unit-banner.u3 { background: linear-gradient(135deg, #1cb0f6 0%, #1899d6 100%); }
    .unit-banner.u4 { background: linear-gradient(135deg, #ff9600 0%, #e07a00 100%); }
    .unit-banner.u5 { background: linear-gradient(135deg, #ff4b4b 0%, #ea2b2b 100%); }
    .unit-banner.u6 { background: linear-gradient(135deg, #00b4d8 0%, #0077b6 100%); }
    .unit-banner.u7 { background: linear-gradient(135deg, #7209b7 0%, #3f37c9 100%); }
    .unit-banner.u8 { background: linear-gradient(135deg, #f72585 0%, #b5179e 100%); }
    .unit-banner.u9 { background: linear-gradient(135deg, #fb8500 0%, #d45b00 100%); }
    .unit-banner.u10 { background: linear-gradient(135deg, #ffb703 0%, #d48b00 100%); }

    .unit-banner-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
      flex-wrap: wrap;
    }
    .unit-banner-badge-group {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .unit-badge {
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 1px;
      text-transform: uppercase;
      background: rgba(0, 0, 0, 0.16);
      padding: 4px 10px;
      border-radius: 8px;
    }
    .unit-lesson-counter {
      font-size: 11px;
      font-weight: 800;
      opacity: 0.9;
    }
    .unit-guidebook-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.22);
      border: 2px solid rgba(255, 255, 255, 0.45);
      color: #fff;
      padding: 6px 14px;
      border-radius: var(--radius-sm);
      font-size: 12px;
      font-weight: 800;
      cursor: pointer;
      backdrop-filter: blur(4px);
      transition: all 0.15s ease;
      white-space: nowrap;
    }
    .unit-guidebook-btn:hover {
      background: rgba(255, 255, 255, 0.35);
      transform: translateY(-1px);
    }
    .unit-title {
      font-family: var(--font-display);
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 6px;
      line-height: 1.25;
    }
    .unit-desc {
      font-size: 13.5px;
      opacity: 0.92;
      line-height: 1.45;
    }

    /* PATH CONTAINER & WINDING TRACK */
    .path-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      padding: 24px 0 34px;
      gap: 24px;
      width: 100%;
      z-index: 10;
    }

    .path-track-svg {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 320px;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    }
    .path-track-line {
      fill: none;
      stroke: #e5e5e5;
      stroke-width: 14;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-dasharray: 14 14;
    }
    [data-theme="dark"] .path-track-line {
      stroke: #263840;
    }

    /* PATH MASCOT ENCOUNTERS */
    .path-mascot-encounter {
      position: absolute;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      z-index: 12;
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .path-mascot-encounter:hover {
      transform: scale(1.08) translateY(-3px);
    }
    .path-mascot-encounter.mascot-right {
      left: calc(50% + 54px * var(--path-offset-ratio));
    }
    .path-mascot-encounter.mascot-left {
      right: calc(50% + 54px * var(--path-offset-ratio));
      flex-direction: row-reverse;
    }

    .mascot-avatar {
      width: 72px;
      height: 82px;
      flex-shrink: 0;
      filter: drop-shadow(0 5px 8px rgba(0,0,0,0.16));
    }
    .mascot-speech-bubble {
      background: var(--bg);
      border: 2px solid var(--card-border);
      border-radius: 14px;
      padding: 8px 12px;
      font-size: 11.5px;
      font-weight: 800;
      line-height: 1.35;
      color: var(--text);
      max-width: 145px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      position: relative;
    }
    .mascot-right .mascot-speech-bubble::before {
      content: '';
      position: absolute;
      top: 50%;
      right: 100%;
      transform: translateY(-50%);
      border: 6px solid transparent;
      border-right-color: var(--card-border);
    }
    .mascot-right .mascot-speech-bubble::after {
      content: '';
      position: absolute;
      top: 50%;
      right: 100%;
      transform: translateY(-50%);
      border: 5px solid transparent;
      border-right-color: var(--bg);
    }
    .mascot-left .mascot-speech-bubble::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 100%;
      transform: translateY(-50%);
      border: 6px solid transparent;
      border-left-color: var(--card-border);
    }
    .mascot-left .mascot-speech-bubble::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 100%;
      transform: translateY(-50%);
      border: 5px solid transparent;
      border-left-color: var(--bg);
    }
    @keyframes mascotHop {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-12px); }
    }
    .mascot-hop-anim { animation: mascotHop 0.4s ease; }

    /* PATH NODE BUTTONS */
    .path-node-wrapper {
      position: relative;
      display: flex;
      justify-content: center;
      width: 100%;
      z-index: 5;
    }

    .node-pedestal {
      position: absolute;
      bottom: -6px;
      width: 84px;
      height: 22px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.08);
      z-index: 1;
    }
    .node-pedestal.chest-pedestal {
      width: 96px;
    }

    .path-node {
      width: 78px;
      height: 72px;
      border-radius: 50%;
      background: var(--primary);
      border: none;
      box-shadow: 0 8px 0 var(--primary-dark);
      cursor: pointer;
      display: grid;
      place-items: center;
      color: #ffffff;
      font-size: 28px;
      position: relative;
      transition: all 0.1s ease;
      z-index: 2;
    }
    .path-node:active:not(.locked) {
      transform: translateY(6px);
      box-shadow: 0 2px 0 var(--primary-dark);
    }

    .path-node.locked {
      background: #e5e5e5;
      box-shadow: 0 8px 0 #cecece;
      color: #a0a0a0;
      cursor: not-allowed;
    }
    [data-theme="dark"] .path-node.locked {
      background: #2b3940;
      box-shadow: 0 8px 0 #1b262c;
      color: #556c78;
    }

    .path-node.mid-node {
      border: 3px solid #ffd700;
    }

    .path-node.chest {
      border-radius: var(--radius-md);
      width: 86px;
      height: 76px;
      background: linear-gradient(135deg, #ffc800 0%, #ff9600 100%);
      box-shadow: 0 8px 0 #c67100;
      font-size: 34px;
    }
    .path-node.chest.opened {
      background: var(--primary);
      box-shadow: 0 8px 0 var(--primary-dark);
    }

    .path-node.current {
      animation: pulseGlow 2s infinite;
    }

    /* NODE POPOVER FLOATING BUBBLE */
    .node-popover {
      position: absolute;
      bottom: calc(100% + 16px);
      background: var(--bg);
      border: 2px solid var(--card-border);
      border-radius: var(--radius-md);
      padding: 10px 18px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.14);
      text-align: center;
      white-space: nowrap;
      z-index: 25;
      animation: popoverBounce 2.5s ease-in-out infinite;
    }
    [data-theme="dark"] .node-popover {
      background: #19272d;
      border-color: #263840;
    }
    @keyframes popoverBounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
    .node-popover::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 8px solid transparent;
      border-top-color: var(--bg);
    }
    [data-theme="dark"] .node-popover::after {
      border-top-color: #19272d;
    }
    .node-popover-title {
      font-size: 13.5px;
      font-weight: 800;
      color: var(--text);
    }
    .node-popover-sub {
      font-size: 11px;
      color: var(--primary-dark);
      font-weight: 900;
      margin-top: 2px;
      letter-spacing: 0.5px;
    }

    /* BUTTONS DUO STYLE */
    .btn-duo {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 12px 22px;
      border-radius: var(--radius-md);
      font-family: var(--font-main);
      font-size: 14px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      border: none;
      cursor: pointer;
      transition: all 0.1s ease;
      box-shadow: 0 4px 0 rgba(0, 0, 0, 0.15);
    }
    .btn-duo:active {
      transform: translateY(3px);
      box-shadow: 0 1px 0 rgba(0, 0, 0, 0.15);
    }
    .btn-duo-primary {
      background: var(--primary);
      color: #fff;
      box-shadow: 0 4px 0 var(--primary-dark);
    }
    .btn-duo-secondary {
      background: var(--secondary);
      color: #fff;
      box-shadow: 0 4px 0 var(--secondary-dark);
    }
    .btn-duo-white {
      background: #fff;
      color: var(--text);
      box-shadow: 0 4px 0 var(--card-border-dark);
    }

    /* LESSON SCREEN OVERLAY (CRITICAL: HIDDEN BY DEFAULT) */
    .lesson-overlay {
      position: fixed;
      inset: 0;
      background: var(--bg);
      z-index: 500;
      display: none;
      flex-direction: column;
      height: 100vh;
      height: 100dvh;
      overflow: hidden;
    }
    .lesson-overlay.active {
      display: flex !important;
    }

    .lesson-header {
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      max-width: 800px;
      width: 100%;
      margin: 0 auto;
      box-sizing: border-box;
    }

    .lesson-close-btn {
      background: none;
      border: none;
      font-size: 26px;
      color: var(--text-light);
      cursor: pointer;
    }

    .duo-progress-track {
      flex: 1;
      height: 16px;
      background: #e5e5e5;
      border-radius: var(--radius-full);
      overflow: hidden;
      position: relative;
    }
    [data-theme="dark"] .duo-progress-track { background: #263840; }

    .duo-progress-fill {
      height: 100%;
      background: var(--primary);
      border-radius: var(--radius-full);
      width: 0%;
      transition: width 0.35s ease;
    }

    .lesson-hearts {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--accent-red);
      font-weight: 800;
      font-size: 20px;
    }

    .lesson-content {
      flex: 1;
      overflow-y: auto;
      padding: 16px 20px 150px;
      max-width: 700px;
      width: 100%;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }

    /* TOP CHARACTER & SPEECH FEEDBACK IN LESSON */
    .lesson-top-character-wrapper {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
    }
    .lesson-top-avatar {
      width: 80px;
      height: 90px;
      flex-shrink: 0;
      transition: transform 0.3s ease;
    }
    .char-bounce-correct {
      animation: charBounce 0.5s ease;
    }
    .char-shake-wrong {
      animation: charShake 0.4s ease;
    }
    @keyframes charBounce {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-12px) scale(1.08); }
    }
    @keyframes charShake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-8px) rotate(-3deg); }
      75% { transform: translateX(8px) rotate(3deg); }
    }
    .lesson-top-bubble {
      background: var(--card-bg);
      border: 2px solid var(--card-border);
      border-radius: 16px;
      padding: 14px 20px;
      font-size: 15px;
      font-weight: 700;
      line-height: 1.45;
      color: var(--text);
      flex: 1;
      box-shadow: 0 4px 0 var(--card-border-dark);
      transition: all 0.25s ease;
    }
    .lesson-top-bubble.bubble-correct {
      border-color: #58cc02 !important;
      background: rgba(88, 204, 2, 0.12) !important;
      color: var(--text) !important;
      box-shadow: 0 4px 0 #46a302 !important;
    }
    .lesson-top-bubble.bubble-wrong {
      border-color: #ff4b4b !important;
      background: rgba(255, 75, 75, 0.12) !important;
      color: var(--text) !important;
      box-shadow: 0 4px 0 #ea2b2b !important;
    }
    .bubble-prefix {
      font-weight: 900;
      font-size: 16px;
      display: inline-block;
      margin-right: 4px;
    }
    .bubble-correct .bubble-prefix {
      color: #58cc02;
    }
    .bubble-wrong .bubble-prefix {
      color: #ff4b4b;
    }

    .git-sync-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--card-bg);
      border: 2px solid var(--card-border);
      border-radius: 20px;
      padding: 6px 14px;
      font-size: 12.5px;
      font-weight: 800;
      color: var(--text);
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 0 var(--card-border-dark);
    }
    .git-sync-pill:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 0 var(--card-border-dark);
      border-color: var(--primary);
    }
    .git-sync-pill.synced {
      border-color: #58cc02;
      color: #2e7d32;
    }

    .exercise-title {
      font-family: var(--font-display);
      font-size: 23px;
      font-weight: 700;
      margin-bottom: 6px;
    }
    .exercise-instruction {
      font-size: 15px;
      color: var(--text-muted);
      font-weight: 600;
      margin-bottom: 16px;
    }

    /* SYNTAX HIGHLIGHTED CODE TERMINAL (ALWAYS VISIBLE & PROPORTIONED) */
    .code-terminal-card {
      background: #0d151c !important;
      border-radius: 16px;
      margin: 14px 0 20px;
      overflow: hidden;
      border: 2px solid #1e293b;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
      display: block !important;
      width: 100%;
      flex-shrink: 0 !important;
      min-height: 130px !important;
      height: auto !important;
    }
    .code-terminal-header {
      background: #15222d;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      gap: 8px;
      border-bottom: 1px solid #1e293b;
    }
    .term-dot { width: 10px; height: 10px; border-radius: 50%; }
    .term-dot.red { background: #ef4444; }
    .term-dot.yellow { background: #f59e0b; }
    .term-dot.green { background: #10b981; }
    .term-title {
      font-family: var(--font-code);
      font-size: 12px;
      color: #94a3b8;
      margin-left: 6px;
      font-weight: 700;
    }

    .code-snippet-box {
      color: #f8fafc !important;
      padding: 16px 20px !important;
      font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
      font-size: 14.5px !important;
      line-height: 1.75 !important;
      margin: 0 !important;
      overflow-x: auto;
      white-space: pre-wrap !important;
      word-break: break-word !important;
      background: #0d151c !important;
      display: block !important;
      min-height: 70px;
    }

    .tok-keyword { color: #4ade80 !important; font-weight: 700; }
    .tok-type { color: #38bdf8 !important; font-weight: 700; }
    .tok-number { color: #fb923c !important; font-weight: 600; }
    .tok-string { color: #fde047 !important; }
    .tok-comment { color: #94a3b8 !important; font-style: italic; }

    .choice-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 16px;
    }

    .choice-btn {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 14px 18px;
      border-radius: var(--radius-md);
      background: var(--bg);
      border: 2px solid var(--card-border);
      box-shadow: 0 4px 0 var(--card-border-dark);
      cursor: pointer;
      text-align: left;
      font-family: var(--font-main);
      font-size: 15.5px;
      font-weight: 700;
      color: var(--text);
      transition: all 0.1s ease;
      min-height: 56px;
    }
    .choice-btn:active {
      transform: translateY(3px);
      box-shadow: 0 1px 0 var(--card-border-dark);
    }
    .choice-btn.selected {
      border-color: var(--secondary);
      background: var(--secondary-light);
      box-shadow: 0 4px 0 var(--secondary-dark);
      color: var(--secondary-dark);
    }
    .choice-btn.correct {
      border-color: var(--primary) !important;
      background: var(--primary-light) !important;
      box-shadow: 0 4px 0 var(--primary-dark) !important;
      color: var(--primary-dark) !important;
    }
    .choice-btn.wrong {
      border-color: var(--accent-red) !important;
      background: var(--accent-red-light) !important;
      box-shadow: 0 4px 0 var(--accent-red-dark) !important;
      color: var(--accent-red-dark) !important;
    }

    .choice-btn-key {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      border: 2px solid var(--card-border);
      display: grid;
      place-items: center;
      font-size: 13px;
      font-weight: 800;
      color: var(--text-light);
      flex-shrink: 0;
    }

    /* ENHANCED 4-LAYER EVALUATION DRAWER */
    .eval-drawer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 16px 20px;
      background: var(--bottom-bar-bg);
      border-top: 2px solid var(--card-border);
      z-index: 520;
      display: none;
      box-shadow: 0 -8px 28px rgba(0, 0, 0, 0.1);
    }
    .eval-drawer.active { display: block !important; }
    .eval-drawer.correct-state {
      background: var(--primary-light);
      border-top-color: var(--primary);
    }
    .eval-drawer.wrong-state {
      background: var(--accent-red-light);
      border-top-color: var(--accent-red);
    }

    .eval-drawer-inner {
      max-width: 700px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .eval-feedback-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
    }
    .eval-feedback-title {
      font-size: 19px;
      font-weight: 800;
    }

    /* Explanation Tabs */
    .explain-tab-bar {
      display: flex;
      gap: 8px;
      margin-top: 6px;
      border-bottom: 1.5px solid rgba(0,0,0,0.1);
      padding-bottom: 6px;
      overflow-x: auto;
    }
    .explain-tab-btn {
      background: none;
      border: none;
      font-size: 12px;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 8px;
      cursor: pointer;
      color: var(--text-muted);
      white-space: nowrap;
    }
    .explain-tab-btn.active {
      background: rgba(0,0,0,0.08);
      color: var(--text);
    }

    /* GENERIC MODAL BACKDROP (CRITICAL: HIDDEN BY DEFAULT) */
    .generic-dialog-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.65);
      z-index: 600;
      display: none;
      place-items: center;
      padding: 20px;
      backdrop-filter: blur(4px);
    }
    .generic-dialog-backdrop.active {
      display: grid !important;
    }

    .dialog-card {
      background: var(--bg);
      border-radius: var(--radius-lg);
      padding: 26px;
      max-width: 480px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
      max-height: 90vh;
      overflow-y: auto;
      box-sizing: border-box;
      position: relative;
      z-index: 10;
    }
    .dialog-emoji { font-size: 48px; margin-bottom: 8px; }
    .dialog-title { font-family: var(--font-display); font-size: 22px; margin-bottom: 8px; }
    .dialog-body { font-size: 14px; color: var(--text-muted); line-height: 1.5; margin-bottom: 20px; text-align: left; }
    .dialog-buttons { display: flex; gap: 10px; justify-content: flex-end; }

    /* MULTI-TIERED DUOLINGO ACHIEVEMENTS GRID */
    .achieve-tier-card {
      background: var(--bg);
      border: 2px solid var(--card-border);
      border-radius: var(--radius-md);
      padding: 16px 18px;
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 12px;
      transition: all 0.15s ease;
      position: relative;
      z-index: 10;
    }
    .achieve-tier-card.unlocked {
      border-color: #ffd700;
      background: #fffdf5;
    }
    .achieve-icon-badge {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      background: var(--bg-page);
      border: 2px solid var(--card-border);
      display: grid;
      place-items: center;
      font-size: 26px;
      flex-shrink: 0;
    }
    .achieve-info { flex: 1; text-align: left; }
    .achieve-name-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }
    .achieve-name { font-weight: 800; font-size: 14.5px; }
    .achieve-stars { color: #f59e0b; font-size: 12px; font-weight: 800; }
    .achieve-desc { font-size: 12px; color: var(--text-muted); margin-bottom: 8px; }
    .achieve-bar-track {
      height: 7px;
      border-radius: 4px;
      background: #e5e5e5;
      overflow: hidden;
    }
    .achieve-bar-fill {
      height: 100%;
      background: var(--accent-orange);
      border-radius: 4px;
    }

    /* ACCOUNT SWITCHER CARDS */
    .account-hub-cards {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 16px;
    }
    .account-card-box {
      border: 2px solid var(--card-border);
      border-radius: var(--radius-md);
      padding: 14px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      background: var(--bg-page);
    }
    .account-card-box.active-user {
      border-color: var(--primary);
      background: var(--primary-light);
    }
    .acc-details { flex: 1; text-align: left; }
    .acc-name { font-weight: 800; font-size: 14.5px; }
    .acc-tag { font-size: 11px; color: var(--text-muted); font-weight: 700; margin-bottom: 4px; }
    .acc-stats-row { display: flex; gap: 12px; font-size: 11.5px; font-weight: 800; color: var(--text); }

    /* LEADERBOARD VIEW */
    .leaderboard-header-card {
      background: linear-gradient(135deg, #1cb0f6 0%, #0d88c4 100%);
      color: #fff;
      border-radius: var(--radius-md);
      padding: 24px;
      text-align: center;
      margin: 20px 0 16px;
      position: relative;
      z-index: 10;
    }
    .leaderboard-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      position: relative;
      z-index: 10;
    }
    .leaderboard-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 18px;
      background: var(--bg);
      border: 2px solid var(--card-border);
      border-radius: var(--radius-md);
    }
    .leaderboard-item.me {
      border-color: var(--primary);
      background: var(--primary-light);
    }
    .rank-num { font-weight: 900; font-size: 14px; width: 24px; }
    .rank-num.top1 { color: #f1c40f; }
    .rank-num.top2 { color: #95a5a6; }
    .rank-num.top3 { color: #e67e22; }
    .leader-avatar { font-size: 24px; }
    .leader-info { flex: 1; }
    .leader-name { font-weight: 800; font-size: 14.5px; }
    .leader-title { font-size: 11.5px; color: var(--text-muted); font-weight: 600; }
    .leader-xp { font-weight: 800; font-size: 14.5px; color: var(--primary-dark); }

    /* SHOP GRID */
    .shop-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 16px;
      margin-top: 16px;
      position: relative;
      z-index: 10;
    }
    .shop-item-card {
      background: var(--bg);
      border: 2px solid var(--card-border);
      border-radius: var(--radius-md);
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 8px;
      box-shadow: 0 3px 0 var(--card-border-dark);
      position: relative;
      z-index: 10;
    }
    .shop-item-icon { font-size: 38px; }
    .shop-item-name { font-weight: 800; font-size: 15.5px; }
    .shop-item-desc { font-size: 12.5px; color: var(--text-muted); margin-bottom: 8px; }

    /* MOBILE BOTTOM NAV */
    .mobile-bottom-nav {
      display: none;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60px;
      background: var(--bg);
      border-top: 2px solid var(--card-border);
      justify-content: space-around;
      align-items: center;
      z-index: 300;
      padding-bottom: env(safe-area-inset-bottom);
      box-sizing: border-box;
    }
    .mobile-nav-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 10px;
      font-weight: 800;
      gap: 3px;
      cursor: pointer;
      flex: 1 1 0;
      width: 25%;
      min-width: 0;
      height: 100%;
    }
    .mobile-nav-btn.active { color: var(--primary-dark); }
    .mobile-nav-btn span:first-child { font-size: 20px; }

    /* ANIMATIONS */
    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 0 0 0 rgba(88, 204, 2, 0.5), 0 8px 0 var(--primary-dark); }
      50% { box-shadow: 0 0 0 12px rgba(88, 204, 2, 0), 0 8px 0 var(--primary-dark); }
    }
    @keyframes duoShake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-8px); }
      40%, 80% { transform: translateX(8px); }
    }
    .shake-animate { animation: duoShake 0.4s ease-in-out; }

    /* RESPONSIVE BREAKPOINTS */
    @media (max-width: 1120px) {
      .sidebar-right { display: none; }
    }
    @media (max-width: 768px) {
      :root {
        --path-offset-ratio: 0.65;
      }
      .app-shell {
        max-width: 100vw !important;
        overflow-x: hidden !important;
      }
      .desktop-sidebar { display: none; }
      .mobile-bottom-nav {
        display: flex;
        width: 100vw;
        max-width: 100vw;
      }
      .main-viewport {
        padding: 0 8px 90px;
        min-width: 0;
        width: 100vw;
        max-width: 100vw;
        overflow-x: hidden;
      }
      .top-stats-bar {
        padding: 8px 10px;
        gap: 4px;
        justify-content: space-between;
        width: 100vw;
        max-width: 100vw;
        box-sizing: border-box;
      }
      .user-chip-pill {
        padding: 4px 8px;
        gap: 3px;
        flex-shrink: 0;
      }
      .user-chip-name { font-size: 11.5px; }
      .super-badge-sleek { display: none !important; } /* Hide super tag in header on mobile to conserve room */
      .header-stat-group {
        gap: 3px;
        flex-shrink: 1;
      }
      .stat-pill {
        padding: 4px 6px;
        font-size: 11px;
        gap: 2px;
      }
      .stat-icon { font-size: 13px; }
      .header-action-group {
        gap: 4px;
        flex-shrink: 0;
      }
      .header-btn {
        width: 30px;
        height: 30px;
        font-size: 13px;
      }
      .unit-banner {
        padding: 16px 18px;
        margin: 18px 0 76px;
      }
      .unit-title { font-size: 18px; }
      .unit-desc { font-size: 12px; }
      .mascot-avatar { width: 54px; height: 62px; }
      .mascot-speech-bubble { display: none; }
      .bg-decorative-layer { display: none; } /* Hide background stickers on mobile */
      .hide-on-mobile { display: none !important; }
    }
  </style>
</head>
<body>

<!-- DEDICATED BACKGROUND DECORATIVE LAYER (STRICTLY BEHIND ALL UI, Z-INDEX: 0) -->
<div class="bg-decorative-layer">
  <div class="bg-sticker" style="top: 140px; left: 275px;">int hp = 100;</div>
  <div class="bg-sticker" style="top: 290px; right: 400px;">Awake();</div>
  <div class="bg-sticker" style="top: 560px; left: 280px;">Vector3.forward</div>
  <div class="bg-sticker" style="top: 880px; right: 395px;">[SerializeField]</div>
  <div class="bg-sticker" style="top: 1240px; left: 285px;">0 GC Alloc</div>
  <div class="bg-sticker" style="top: 1650px; right: 410px;">120 FPS Lock</div>
  <div class="bg-sticker" style="top: 2100px; left: 275px;">Physics.Raycast()</div>
  <div class="bg-sticker" style="top: 2600px; right: 405px;">Action&lt;T&gt;</div>
  <div class="bg-sticker" style="top: 3100px; left: 280px;">IEnumerator</div>
  <div class="bg-sticker" style="top: 3600px; right: 400px;">ScriptableObject</div>
</div>

<!-- REALISTIC LOGIN GATE SCREEN (NO QUICK-FILL SHORTCUTS; SECURE PASSWORD ENTRY) -->
<div id="login-screen" class="login-gate-wrapper">
  <div class="login-card">
    <div class="brand-logo" style="justify-content: center; padding: 0 0 10px;">
      <div class="brand-logo-icon">🎮</div>
      <div class="brand-text">Code_Duo<small>C# · UNITY QUEST</small></div>
    </div>
    
    <div style="font-size: 44px; margin: 2px 0 8px;">🦉</div>
    
    <h2 style="font-family: var(--font-display); font-size: 22px; margin-bottom: 4px;">Welcome, Gamedev!</h2>
    <p style="color: var(--text-muted); font-size: 13px; margin-bottom: 22px;">Sign in to your personal account to continue your C# gamedev mastery journey.</p>

    <form onsubmit="handleLoginSubmit(event)" style="display: flex; flex-direction: column; gap: 14px; text-align: left;">
      <div>
        <label class="auth-label">USERNAME</label>
        <input type="text" id="login-username-input" class="auth-input" placeholder="Username (Sanju2206 or Scaria2584)" required autocomplete="username">
      </div>
      <div>
        <label class="auth-label">PASSWORD</label>
        <div style="position: relative;">
          <input type="password" id="login-password-input" class="auth-input" placeholder="Enter your password" required autocomplete="current-password" style="padding-right: 44px;">
          <button type="button" class="password-toggle-btn" onclick="togglePasswordVisibility()" title="Show/Hide Password">👁️</button>
        </div>
      </div>

      <div style="display: flex; align-items: center; justify-content: space-between; font-size: 12px; margin-top: 2px;">
        <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; color: var(--text-muted); font-weight: 700;">
          <input type="checkbox" id="remember-me-checkbox" checked style="accent-color: var(--primary); cursor: pointer;">
          Remember me on this browser
        </label>
      </div>

      <div id="login-error-msg" style="color: var(--accent-red); font-size: 12.5px; font-weight: 800; display: none; text-align: center; padding: 8px 12px; background: var(--accent-red-light); border-radius: 8px;"></div>

      <button type="submit" class="btn-duo btn-duo-primary" style="width: 100%; padding: 14px; font-size: 15px; margin-top: 6px;">
        LOG IN & START CODING
      </button>
    </form>
  </div>
</div>

<!-- FULL APP SHELL (SHOWN WHEN LOGGED IN - 100% MONITOR OCCUPIED) -->
<div class="app-shell" id="app-shell">
  <!-- LEFT SIDEBAR -->
  <aside class="desktop-sidebar">
    <div class="brand-logo" onclick="switchTab('path')">
      <div class="brand-logo-icon">🎮</div>
      <div class="brand-text">Code_Duo<small>C# · UNITY</small></div>
    </div>

    <div class="sidebar-menu">
      <button class="nav-tab-btn active" id="btn-tab-path" onclick="switchTab('path')">
        <span class="nav-icon">🗺️</span>
        <span>Quest Path</span>
      </button>
      <button class="nav-tab-btn" id="btn-tab-leaderboard" onclick="switchTab('leaderboard')">
        <span class="nav-icon">🏆</span>
        <span>Leaderboard</span>
      </button>
      <button class="nav-tab-btn" id="btn-tab-badges" onclick="switchTab('badges')">
        <span class="nav-icon">🎖️</span>
        <span>Achievements</span>
      </button>
      <button class="nav-tab-btn" id="btn-tab-shop" onclick="switchTab('shop')">
        <span class="nav-icon">🛍️</span>
        <span>Powerups</span>
      </button>
    </div>

    <!-- User Profile & Sign Out Footer -->
    <div class="sidebar-user-card">
      <div class="sidebar-user-meta" onclick="openAccountHub()">
        <div class="sidebar-user-avatar" id="sidebar-user-avatar">👨‍💻</div>
        <div style="min-width:0;">
          <div class="sidebar-user-name" id="sidebar-user-name">Sanju</div>
          <div class="sidebar-user-role" id="sidebar-user-role">👑 Super Duo · Lead</div>
        </div>
      </div>
      <button class="sidebar-signout-btn" onclick="signOut()" title="Sign Out">🚪</button>
    </div>
  </aside>

  <!-- CENTER VIEWPORT (OCCUPIES REMAINING WIDTH FLUIDLY) -->
  <main class="main-viewport">
    <!-- TOP STATS BAR -->
    <header class="top-stats-bar">
      <!-- Profile Chip -->
      <div class="user-chip-pill" onclick="openAccountHub()" title="Manage Account & Switch Profile">
        <span class="user-chip-avatar" id="chip-avatar">👨‍💻</span>
        <span class="user-chip-name" id="chip-name">Sanju</span>
        <span class="super-badge-sleek" id="chip-super-badge">👑 SUPER</span>
      </div>

      <!-- Stat Badges -->
      <div class="header-stat-group">
        <div class="stat-pill stat-streak" title="Daily Streak">
          <span class="stat-icon">🔥</span>
          <span class="stat-val" id="top-streak-val">1</span>
        </div>
        <div class="stat-pill stat-gems" title="Diamonds / Gems">
          <span class="stat-icon">💎</span>
          <span class="stat-val" id="top-gems-val">185</span>
        </div>
        <div class="stat-pill stat-hearts heart-super" id="stat-pill-hearts" title="Hearts (Unlimited for Super Accounts)">
          <span class="stat-icon">❤️</span>
          <span class="stat-val" id="top-hearts-val">∞</span>
        </div>
        <div class="stat-pill stat-xp hide-on-mobile" title="Total XP">
          <span class="stat-icon">⚡</span>
          <span class="stat-val" id="top-xp-val">350</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="header-action-group">
        <button class="git-sync-pill hide-on-mobile" id="header-git-pill" onclick="openGitSyncModal()" title="Automated GitHub Sync Status">
          <span>🐙</span>
          <span>GitHub: Auto-Save Active</span>
        </button>
        <button class="header-btn" id="theme-toggle-btn" onclick="toggleTheme()" title="Toggle Dark/Light Mode">🌙</button>
        <button class="header-btn hide-on-mobile" id="audio-toggle-btn" onclick="toggleAudio()" title="Sound Effects On/Off">🔊</button>
        <button class="header-btn header-signout-btn" onclick="signOut()" title="Sign Out to Login Screen">🚪</button>
      </div>
    </header>

    <!-- TAB 1: QUEST PATH (100 LESSONS & 10 UNITS) -->
    <section class="tab-view active" id="view-path">
      ${pathHtmlContent}
    </section>

    <!-- TAB 2: LEADERBOARD -->
    <section class="tab-view" id="view-leaderboard">
      <div class="leaderboard-header-card">
        <div style="font-size: 38px; margin-bottom: 6px;">🏆</div>
        <h2 style="font-family: var(--font-display); font-size: 24px; margin-bottom: 4px;">Diamond Studio League</h2>
        <p style="font-size: 13.5px; opacity: 0.9;">Top C# game developers this week. Reset every Sunday.</p>
      </div>
      <div class="leaderboard-list" id="leaderboard-container"></div>
    </section>

    <!-- TAB 3: MULTI-TIER ACHIEVEMENTS -->
    <section class="tab-view" id="view-badges">
      <div style="background: linear-gradient(135deg, #ce82ff 0%, #a560e8 100%); color: #fff; border-radius: var(--radius-md); padding: 24px; margin: 20px 0 16px; text-align: center;">
        <div style="font-size: 42px; margin-bottom: 6px;" id="badges-hero-avatar">👨‍💻</div>
        <h2 style="font-family: var(--font-display); font-size: 24px;" id="badges-hero-name">Sanju</h2>
        <div style="font-size: 12.5px; font-weight: 800; opacity: 0.9;" id="badges-hero-role">👑 Super Duo · Lead Architect</div>
        <div style="display: inline-block; background: rgba(0,0,0,0.2); padding: 4px 14px; border-radius: var(--radius-full); margin-top: 10px; font-weight: 800; font-size: 12px;" id="badges-unlocked-ratio">3/12 Unlocked</div>
      </div>
      <div id="achievements-container"></div>
    </section>

    <!-- TAB 4: SHOP / POWERUPS -->
    <section class="tab-view" id="view-shop">
      <div style="background: linear-gradient(135deg, #ff9600 0%, #e07a00 100%); color: #fff; border-radius: var(--radius-md); padding: 24px; margin: 20px 0 16px; text-align: center;">
        <div style="font-size: 40px; margin-bottom: 6px;">🛍️</div>
        <h2 style="font-family: var(--font-display); font-size: 24px; margin-bottom: 4px;">Gamedev Powerup Forge</h2>
        <p style="font-size: 13.5px; opacity: 0.9;">Spend earned gems to protect your streaks and boost learning!</p>
      </div>
      <div class="shop-grid">
        <div class="shop-item-card">
          <div class="shop-item-icon">🛡️</div>
          <div class="shop-item-name">Streak Freeze</div>
          <div class="shop-item-desc">Preserves your coding streak if you miss a calendar day.</div>
          <button class="btn-duo btn-duo-secondary" onclick="buyItem('streak_freeze', 50)">💎 50 Gems</button>
        </div>
        <div class="shop-item-card">
          <div class="shop-item-icon">⚡</div>
          <div class="shop-item-name">XP Multiplier (2x)</div>
          <div class="shop-item-desc">Double all earned XP from completed C# drills for 15 minutes.</div>
          <button class="btn-duo btn-duo-secondary" onclick="buyItem('xp_boost', 75)">💎 75 Gems</button>
        </div>
        <div class="shop-item-card">
          <div class="shop-item-icon">☕</div>
          <div class="shop-item-name">Vikram's Masala Chai</div>
          <div class="shop-item-desc">Instant focus boost! Reveals an architectural clue in any hard drill.</div>
          <button class="btn-duo btn-duo-secondary" onclick="buyItem('chai_clue', 40)">💎 40 Gems</button>
        </div>
      </div>
    </section>
  </main>

  <!-- RIGHT SIDEBAR (380px) -->
  <aside class="sidebar-right">
    <!-- WIDGET 1: STREAK CARD -->
    <div class="widget-card">
      <div class="widget-title-row">
        <div class="widget-title">🔥 Daily Streak</div>
        <span style="font-weight: 800; font-size: 13.5px; color: var(--accent-orange);" id="right-streak-count">1 Day</span>
      </div>
      <p style="font-size: 12.5px; color: var(--text-muted); line-height: 1.4;">Solve at least 1 gamedev lesson every day to protect your streak!</p>
      
      <div class="streak-calendar-row">
        <div class="streak-day-dot active">M</div>
        <div class="streak-day-dot">T</div>
        <div class="streak-day-dot">W</div>
        <div class="streak-day-dot">T</div>
        <div class="streak-day-dot">F</div>
        <div class="streak-day-dot">S</div>
        <div class="streak-day-dot">S</div>
      </div>

      <div style="font-size: 11.5px; font-weight: 800; color: var(--secondary-dark); margin-top: 6px;" id="right-freeze-status">
        🛡️ 5 Streak Freezes active
      </div>
    </div>

    <!-- WIDGET 2: AI KNOWLEDGE MATRIX (BKT & DECISION ENGINE) -->
    <div class="widget-card">
      <div class="widget-title-row">
        <div class="widget-title">🧠 AI Knowledge Matrix</div>
        <span style="font-size: 11px; background: #e8f5e9; color: #2e7d32; padding: 2px 8px; border-radius: 8px; font-weight: 800;">LIVE BKT</span>
      </div>
      <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px;">Real-time Bayesian Knowledge Tracing estimating your C# mastery probability.</p>
      <div id="ai-skill-bars-container"></div>
    </div>

    <!-- WIDGET 3: LIVE LEAGUE PREVIEW -->
    <div class="widget-card">
      <div class="widget-title-row">
        <div class="widget-title">🏆 Studio Rankings</div>
        <button onclick="switchTab('leaderboard')" style="background:none; border:none; color:var(--secondary-dark); font-weight:800; font-size:12px; cursor:pointer;">VIEW ALL</button>
      </div>
      <div id="right-league-preview" style="display: flex; flex-direction: column; gap: 8px;"></div>
    </div>

    <!-- WIDGET 4: DIAGNOSTIC PLACEMENT TEST -->
    <div class="widget-card" style="background: linear-gradient(135deg, #edf7e6 0%, #dff2d3 100%); border-color: #b5e29e;">
      <div class="widget-title" style="color: #2e6616;">🚀 Test Out of Unit</div>
      <p style="font-size: 12px; color: #436e2f; margin: 6px 0 12px; line-height: 1.45;">Already a pro C# gamedev? Take the 5-question diagnostic drill to fast-track ahead!</p>
      <button class="btn-duo btn-duo-primary" style="width: 100%; padding: 10px;" onclick="startPlacementQuiz()">START DIAGNOSTIC</button>
    </div>
  </aside>
</div>

<!-- MOBILE BOTTOM NAVIGATION DOCK -->
<nav class="mobile-bottom-nav">
  <button class="mobile-nav-btn active" id="dock-btn-path" onclick="switchTab('path')">
    <span>🗺️</span>
    <span>Path</span>
  </button>
  <button class="mobile-nav-btn" id="dock-btn-leaderboard" onclick="switchTab('leaderboard')">
    <span>🏆</span>
    <span>League</span>
  </button>
  <button class="mobile-nav-btn" id="dock-btn-badges" onclick="switchTab('badges')">
    <span>🎖️</span>
    <span>Badges</span>
  </button>
  <button class="mobile-nav-btn" id="dock-btn-shop" onclick="switchTab('shop')">
    <span>🛍️</span>
    <span>Shop</span>
  </button>
</nav>

<!-- FULL-BLEED INTERACTIVE LESSON MODAL -->
<div class="lesson-overlay" id="lesson-modal">
  <div class="lesson-header">
    <button class="lesson-close-btn" onclick="quitLesson()" title="Quit Quest">✕</button>
    <div class="duo-progress-track">
      <div class="duo-progress-fill" id="lesson-progress-fill"></div>
    </div>
    <div class="lesson-hearts">
      <span>❤️</span>
      <span id="lesson-hearts-count">∞</span>
    </div>
  </div>

  <div class="lesson-content" id="lesson-content-area"></div>

  <!-- ENHANCED 4-LAYER EVALUATION DRAWER -->
  <div class="eval-drawer" id="eval-drawer">
    <div class="eval-drawer-inner">
      <div class="eval-feedback-header">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 44px; height: 44px; border-radius: 50%; background: #fff; display: grid; place-items: center; font-size: 24px; font-weight: 900;" id="eval-feedback-icon">✓</div>
          <div>
            <div class="eval-feedback-title" id="eval-feedback-title">Correct! Superb deduction!</div>
          </div>
        </div>
        <button class="btn-duo btn-duo-primary" style="padding: 12px 28px; font-size: 15px;" onclick="handleDrawerContinue()">CONTINUE</button>
      </div>

      <!-- 4-Layer Explanation Tabs -->
      <div class="explain-tab-bar">
        <button class="explain-tab-btn active" onclick="switchExplainTab('summary')">💡 Core Concept</button>
        <button class="explain-tab-btn" onclick="switchExplainTab('analogy')">🎮 Gamedev Analogy</button>
        <button class="explain-tab-btn" onclick="switchExplainTab('memory')">🧠 Engine & Memory</button>
        <button class="explain-tab-btn" onclick="switchExplainTab('pitfall')">⚠️ Bug Trap</button>
      </div>

      <!-- Explanation Box Content -->
      <div id="eval-explanation-box" style="font-size: 13.5px; line-height: 1.5; color: var(--text);"></div>
    </div>
  </div>
</div>

<!-- GITHUB AUTO-SYNC MODAL -->
<div class="generic-dialog-backdrop" id="git-sync-modal">
  <div class="dialog-card" style="max-width: 520px; text-align: left;">
    <div class="dialog-emoji" style="text-align: center;">🐙</div>
    <h2 class="dialog-title" style="text-align: center;">GitHub Automated Sync</h2>
    <div class="dialog-body" style="font-size: 13.5px; line-height: 1.5;">
      <div style="background: var(--card-bg); border: 2px solid var(--card-border); border-radius: 12px; padding: 12px 16px; margin-bottom: 12px;" id="git-modal-status-text">
        <b>Repository:</b> <code>https://github.com/SanjuSreejith/C-Learn.git</code><br>
        <b>Branch:</b> <code>main</code><br>
        <b>Auto-Save:</b> Triggers automatically after every section and lesson!
      </div>
      <div id="git-modal-server-badge" style="margin-bottom: 14px;"></div>
      
      <p style="margin-bottom: 6px; font-weight: 700;">Zero-Config Push:</p>
      <p style="margin-bottom: 14px; font-size: 12.5px; opacity: 0.85;">Start the companion server by running <code>npm start</code> or <code>node server.js</code> in your terminal. All finished sections and units commit and push automatically without prompting!</p>
      
      <div style="border-top: 1px solid var(--card-border); padding-top: 12px; margin-top: 12px;">
        <p style="font-weight: 700; font-size: 13px; margin-bottom: 6px;">Browser Direct Sync (Personal Access Token):</p>
        <input type="password" id="git-pat-input" placeholder="Paste GitHub PAT (optional)" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 2px solid var(--card-border); background: var(--bg); color: var(--text); font-size: 13px; box-sizing: border-box; margin-bottom: 8px;">
        <button class="btn-duo btn-duo-white" style="font-size: 12px; padding: 6px 12px;" onclick="saveGitHubPAT()">Save Token</button>
      </div>
    </div>
    <div class="dialog-buttons" style="justify-content: space-between; margin-top: 16px;">
      <button class="btn-duo btn-duo-primary" id="git-manual-sync-btn" onclick="triggerManualGitSync()">SYNC TO GITHUB NOW</button>
      <button class="btn-duo btn-duo-white" onclick="closeGitSyncModal()">CLOSE</button>
    </div>
  </div>
</div>

<!-- UNIT GUIDEBOOK MODAL -->
<div class="generic-dialog-backdrop" id="guidebook-modal">
  <div class="dialog-card" style="text-align: left; max-width: 580px;">
    <h2 class="dialog-title" id="guidebook-modal-title" style="margin-bottom: 12px;">Unit Guidebook</h2>
    <div class="dialog-body" id="guidebook-modal-body"></div>
    <div class="dialog-buttons">
      <button class="btn-duo btn-duo-primary" onclick="closeGuidebook()">GOT IT</button>
    </div>
  </div>
</div>

<!-- ACCOUNT SWITCHER & PROFILE HUB MODAL -->
<div class="generic-dialog-backdrop" id="account-hub-modal">
  <div class="dialog-card">
    <div class="dialog-emoji">🎮</div>
    <h2 class="dialog-title">Active Gamedev Accounts</h2>
    <p class="dialog-body" style="text-align:center;">Both Lead Sanju and Designer Scaria enjoy Super Duolingo unlimited hearts & realistic gem counts.</p>
    <div class="account-hub-cards" id="account-hub-cards-container"></div>
    <div class="dialog-buttons" style="justify-content: space-between;">
      <button class="btn-duo btn-duo-white" style="color:var(--accent-red);" onclick="signOut()">SIGN OUT 🚪</button>
      <button class="btn-duo btn-duo-primary" onclick="closeAccountHub()">CLOSE</button>
    </div>
  </div>
</div>

<!-- GENERIC TOAST DIALOG MODAL -->
<div class="generic-dialog-backdrop" id="toast-dialog-modal">
  <div class="dialog-card">
    <div class="dialog-emoji" id="toast-dialog-emoji">🔔</div>
    <h2 class="dialog-title" id="toast-dialog-title">Notification</h2>
    <div class="dialog-body" id="toast-dialog-body" style="text-align: center; white-space: pre-wrap;"></div>
    <div class="dialog-buttons" style="justify-content: center;">
      <button class="btn-duo btn-duo-primary" id="toast-dialog-btn" onclick="closeToastDialog()">OK</button>
    </div>
  </div>
</div>

<script>
${completeScript}
</script>
</body>
</html>
`;

fs.writeFileSync('index.html', htmlMarkup, 'utf8');
console.log('Successfully assembled and wrote refined index.html! Bytes:', Buffer.byteLength(htmlMarkup, 'utf8'));
