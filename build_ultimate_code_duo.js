// build_ultimate_code_duo.js
// Compiles the upgraded, full-screen Duolingo Gamedev app with:
// 1. Realistic gem economy (185 and 140 gems) with Super Unlimited Hearts (❤️ ∞)
// 2. Full-screen wide PC desktop layout (1440px graceful responsive grid)
// 3. Multi-tiered Duolingo achievements with progress bars & star ratings
// 4. Ultra-crisp syntax highlighted C# code blocks (keywords, types, numbers, strings)
// 5. Rich 4-layer explanation tabs (Core Rule, Gamedev Analogy, Memory & Heap, Pro Pitfall)
// 6. Expanded, dynamic Indian & global character cast (Vikram, Priya, Kabir, Duo, Lily, Dev)

const fs = require('fs');

const curriculum = JSON.parse(fs.readFileSync('curriculum_data.json', 'utf8'));

// Build LESSONS_DATABASE & LESSON_ORDER
const lessonsDb = {};
const lessonOrder = [];

curriculum.forEach(unit => {
  unit.lessons.forEach(l => {
    lessonOrder.push(l.id);
    lessonsDb[l.id] = {
      title: l.title,
      unit: unit.unit,
      topic: l.topic,
      questions: [
        {
          character: l.q.char,
          charSpeech: l.q.speech,
          type: l.q.type,
          title: l.q.title,
          instruction: l.q.instruction,
          code: l.q.code,
          choices: l.q.choices,
          answer: l.q.answer,
          explainSummary: l.q.summary,
          explainAnalogy: l.q.analogy,
          explainMemory: l.q.memory,
          pitfall: l.q.pitfall || 'Failing to test edge cases can trigger NullReferenceException or memory leaks.'
        }
      ]
    };
  });
});

// Generate Path HTML for 10 units & 100 nodes
function generatePathHTML() {
  let html = '';
  curriculum.forEach((u, uIdx) => {
    html += `
      <!-- UNIT ${u.unit} -->
      <div class="unit-banner ${u.colorClass}">
        <div class="unit-badge">${u.badge}</div>
        <div class="unit-title">${u.title}</div>
        <div class="unit-desc">${u.desc}</div>
        <button class="unit-guidebook-btn" onclick="openGuidebook(${u.unit})">📖 Guidebook</button>
      </div>

      <!-- Path Unit ${u.unit} -->
      <div class="path-container" id="unit-${u.unit}-path">
    `;

    // Character spots along the path (Diverse Indian & Studio characters)
    if (u.unit === 1) {
      html += `
        <div class="path-character-spot" style="top: 15px; left: calc(50% + 80px);" onclick="triggerCharacterBark('kabir')">
          <div id="path-kabir-svg"></div>
        </div>
        <div class="path-character-spot" style="top: 195px; left: calc(50% - 165px);" onclick="triggerCharacterBark('duo')">
          <div id="path-duo-svg"></div>
        </div>
      `;
    } else if (u.unit === 2) {
      html += `
        <div class="path-character-spot" style="top: 15px; left: calc(50% + 85px);" onclick="triggerCharacterBark('priya')">
          <div id="path-priya-svg"></div>
        </div>
      `;
    } else if (u.unit === 3) {
      html += `
        <div class="path-character-spot" style="top: 15px; left: calc(50% - 160px);" onclick="triggerCharacterBark('vikram')">
          <div id="path-vikram-svg"></div>
        </div>
      `;
    } else if (u.unit === 4) {
      html += `
        <div class="path-character-spot" style="top: 15px; left: calc(50% + 85px);" onclick="triggerCharacterBark('lily')">
          <div id="path-lily-u4-svg"></div>
        </div>
      `;
    } else if (u.unit === 5) {
      html += `
        <div class="path-character-spot" style="top: 15px; left: calc(50% - 160px);" onclick="triggerCharacterBark('dev')">
          <div id="path-dev-u5-svg"></div>
        </div>
      `;
    } else if (u.unit === 6) {
      html += `
        <div class="path-character-spot" style="top: 15px; left: calc(50% + 85px);" onclick="triggerCharacterBark('priya')">
          <div id="path-priya-u6-svg"></div>
        </div>
      `;
    } else if (u.unit === 7) {
      html += `
        <div class="path-character-spot" style="top: 15px; left: calc(50% - 160px);" onclick="triggerCharacterBark('vikram')">
          <div id="path-vikram-u7-svg"></div>
        </div>
      `;
    } else if (u.unit === 8) {
      html += `
        <div class="path-character-spot" style="top: 15px; left: calc(50% + 85px);" onclick="triggerCharacterBark('kabir')">
          <div id="path-kabir-u8-svg"></div>
        </div>
      `;
    } else if (u.unit === 9) {
      html += `
        <div class="path-character-spot" style="top: 15px; left: calc(50% - 160px);" onclick="triggerCharacterBark('lily')">
          <div id="path-lily-u9-svg"></div>
        </div>
      `;
    } else if (u.unit === 10) {
      html += `
        <div class="path-character-spot" style="top: 15px; left: calc(50% + 85px);" onclick="triggerCharacterBark('vikram')">
          <div id="path-vikram-u10-svg"></div>
        </div>
        <div class="path-character-spot" style="top: 290px; left: calc(50% - 165px);" onclick="triggerCharacterBark('duo')">
          <div id="path-duo-u10-svg"></div>
        </div>
      `;
    }

    // Path nodes
    u.lessons.forEach((l, lIdx) => {
      const isFirst = uIdx === 0 && lIdx === 0;
      html += `
        <div class="path-node-wrapper">
          ${isFirst ? `
          <div class="node-popover" id="popover-${l.id}">
            <div class="node-popover-title">${l.title}</div>
            <div class="node-popover-sub">Start · Lesson 1</div>
          </div>` : ''}
          <button class="path-node ${isFirst ? 'current' : 'locked'}" id="node-${l.id}" onclick="launchLesson('${l.id}')">
            <span>${isFirst ? '▶' : '🔒'}</span>
          </button>
        </div>
      `;
    });

    // Milestone Chest
    const chestId = `chest${u.unit}`;
    html += `
        <div class="path-node-wrapper">
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

const completeCSS = `
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

    body {
      background: var(--bg-page);
      color: var(--text);
      font-family: var(--font-main);
      font-size: 15px;
      line-height: 1.4;
      overflow-x: hidden;
      min-height: 100vh;
    }

    button, input {
      font-family: inherit;
    }

    /* FULL-SCREEN PC DESKTOP LAYOUT (COVERS FULL MONITOR) */
    .app-shell {
      display: flex;
      justify-content: center;
      min-height: 100vh;
      width: 100%;
      max-width: 1440px;
      margin: 0 auto;
      background: var(--bg-page);
      box-sizing: border-box;
    }

    /* LEFT SIDEBAR (270px) */
    .desktop-sidebar {
      width: 270px;
      min-width: 270px;
      height: 100vh;
      position: sticky;
      top: 0;
      background: var(--bg);
      border-right: 2px solid var(--card-border);
      display: flex;
      flex-direction: column;
      padding: 26px 18px;
      z-index: 50;
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
      font-size: 14.5px;
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
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .sidebar-user-card:hover {
      border-color: var(--secondary);
      background: var(--secondary-light);
    }

    .sidebar-user-meta {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
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
      color: var(--secondary-dark);
      font-weight: 800;
    }

    /* CENTER VIEWPORT (SPACIOUS & EXPANDED) */
    .main-viewport {
      flex: 1;
      max-width: 720px;
      min-width: 480px;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-sizing: border-box;
      padding: 0 24px 90px;
    }

    /* TOP STATS BAR */
    .top-stats-bar {
      position: sticky;
      top: 0;
      width: 100%;
      background: var(--bg);
      border-bottom: 2px solid var(--card-border);
      padding: 14px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      z-index: 40;
      box-sizing: border-box;
    }

    .profile-chip {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: var(--bg-page);
      border: 2px solid var(--card-border);
      border-radius: var(--radius-full);
      cursor: pointer;
      font-weight: 800;
      font-size: 13px;
      transition: all 0.15s ease;
    }

    .profile-chip.super-chip {
      background: linear-gradient(135deg, #fff9db 0%, #ffeaa7 100%);
      border-color: #f1c40f;
      color: #855700;
    }

    .profile-chip:hover {
      border-color: var(--secondary);
    }

    .stat-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      border-radius: var(--radius-full);
      font-weight: 800;
      font-size: 13.5px;
      color: var(--text);
    }

    .stat-pill.heart-super {
      color: #e84393;
      background: #ffeef8;
      border: 1.5px solid #fd79a8;
      box-shadow: 0 0 8px rgba(253, 121, 168, 0.3);
    }

    .stat-icon { font-size: 17px; }

    .header-action-btns {
      display: flex;
      gap: 6px;
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
    }
    .header-btn:hover {
      border-color: var(--secondary);
      transform: translateY(-1px);
    }

    /* RIGHT SIDEBAR WIDGETS (380px SPACIOUS) */
    .sidebar-right {
      width: 380px;
      min-width: 380px;
      height: 100vh;
      position: sticky;
      top: 0;
      overflow-y: auto;
      padding: 26px 20px;
      display: flex;
      flex-direction: column;
      gap: 18px;
      border-left: 2px solid var(--card-border);
      background: var(--bg-page);
      box-sizing: border-box;
    }

    .widget-card {
      background: var(--bg);
      border: 2px solid var(--card-border);
      border-radius: var(--radius-md);
      padding: 18px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.03);
    }

    .widget-title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .widget-title {
      font-size: 15.5px;
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
      font-size: 12.5px;
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

    .cognitive-state-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 800;
      padding: 6px 12px;
      border-radius: 12px;
      background: #e8f5e9;
      color: #2e7d32;
      margin-top: 8px;
    }

    /* PATH VIEWS & TABS */
    .tab-view {
      display: none;
      width: 100%;
    }
    .tab-view.active { display: block; }

    /* UNIT BANNERS */
    .unit-banner {
      border-radius: var(--radius-md);
      padding: 22px 26px;
      color: #ffffff;
      margin: 24px 0 16px;
      position: relative;
      box-shadow: 0 6px 0 rgba(0, 0, 0, 0.12);
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

    .unit-badge {
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 1px;
      opacity: 0.9;
      margin-bottom: 4px;
    }
    .unit-title {
      font-family: var(--font-display);
      font-size: 23px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    .unit-desc {
      font-size: 13.5px;
      opacity: 0.92;
      line-height: 1.45;
      max-width: 480px;
    }
    .unit-guidebook-btn {
      position: absolute;
      top: 18px;
      right: 18px;
      background: rgba(255, 255, 255, 0.22);
      border: 2px solid rgba(255, 255, 255, 0.4);
      color: #fff;
      padding: 7px 14px;
      border-radius: var(--radius-sm);
      font-size: 12px;
      font-weight: 800;
      cursor: pointer;
      backdrop-filter: blur(4px);
      transition: all 0.15s ease;
    }
    .unit-guidebook-btn:hover {
      background: rgba(255, 255, 255, 0.35);
      transform: translateY(-1px);
    }

    /* PATH NODES */
    .path-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      padding: 18px 0 26px;
      gap: 22px;
    }

    .path-character-spot {
      position: absolute;
      width: 82px;
      height: 98px;
      cursor: pointer;
      z-index: 10;
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .path-character-spot:hover {
      transform: scale(1.12) translateY(-4px);
    }

    .path-node-wrapper {
      position: relative;
      display: flex;
      justify-content: center;
      width: 100%;
    }
    .path-node-wrapper:nth-child(4n+1) { transform: translateX(0px); }
    .path-node-wrapper:nth-child(4n+2) { transform: translateX(-52px); }
    .path-node-wrapper:nth-child(4n+3) { transform: translateX(0px); }
    .path-node-wrapper:nth-child(4n+4) { transform: translateX(52px); }

    .path-node {
      width: 80px;
      height: 74px;
      border-radius: 50%;
      background: var(--primary);
      border: none;
      box-shadow: 0 8px 0 var(--primary-dark);
      cursor: pointer;
      display: grid;
      place-items: center;
      color: #ffffff;
      font-size: 30px;
      position: relative;
      transition: all 0.1s ease;
    }
    .path-node:active:not(.locked) {
      transform: translateY(6px);
      box-shadow: 0 2px 0 var(--primary-dark);
    }

    .path-node.locked {
      background: #e5e5e5;
      box-shadow: 0 8px 0 #cecece;
      color: #afafaf;
      cursor: not-allowed;
    }
    [data-theme="dark"] .path-node.locked {
      background: #2b3940;
      box-shadow: 0 8px 0 #1b262c;
      color: #556c78;
    }

    .path-node.chest {
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, #ffc800 0%, #ff9600 100%);
      box-shadow: 0 8px 0 #c67100;
    }
    .path-node.chest.opened {
      background: var(--primary);
      box-shadow: 0 8px 0 var(--primary-dark);
    }

    .path-node.current {
      animation: pulseGlow 2s infinite;
    }

    .node-popover {
      position: absolute;
      bottom: calc(100% + 14px);
      background: #ffffff;
      border: 2px solid var(--card-border);
      border-radius: var(--radius-md);
      padding: 10px 16px;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
      text-align: center;
      white-space: nowrap;
      z-index: 20;
    }
    [data-theme="dark"] .node-popover {
      background: #19272d;
      border-color: #263840;
    }
    .node-popover::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 8px solid transparent;
      border-top-color: #ffffff;
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
      font-weight: 800;
      margin-top: 2px;
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
      padding: 18px 24px;
      display: flex;
      align-items: center;
      gap: 18px;
      max-width: 840px;
      width: 100%;
      margin: 0 auto;
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
      padding: 16px 24px 150px;
      max-width: 720px;
      width: 100%;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
    }

    .exercise-title {
      font-family: var(--font-display);
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 6px;
    }
    .exercise-instruction {
      font-size: 15.5px;
      color: var(--text-muted);
      font-weight: 600;
      margin-bottom: 18px;
    }

    /* ULTRA-CRISP SYNTAX HIGHLIGHTED CODE TERMINAL (ALWAYS VISIBLE & PROPORTIONED) */
    .code-terminal-card {
      background: #0d151c !important;
      border-radius: 16px;
      margin: 16px 0 22px;
      overflow: hidden;
      border: 2px solid #1e293b;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
      display: block !important;
      width: 100%;
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
      padding: 18px 22px !important;
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
      padding: 15px 20px;
      border-radius: var(--radius-md);
      background: var(--bg);
      border: 2px solid var(--card-border);
      box-shadow: 0 4px 0 var(--card-border-dark);
      cursor: pointer;
      text-align: left;
      font-family: var(--font-main);
      font-size: 16px;
      font-weight: 700;
      color: var(--text);
      transition: all 0.1s ease;
      min-height: 58px;
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
      width: 30px;
      height: 30px;
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
      padding: 18px 24px;
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
      max-width: 720px;
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
    }
    .dialog-emoji { font-size: 48px; margin-bottom: 8px; }
    .dialog-title { font-family: var(--font-display); font-size: 23px; margin-bottom: 8px; }
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
      padding: 26px;
      text-align: center;
      margin: 24px 0 16px;
    }
    .leaderboard-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
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
    }
    .shop-item-card {
      background: var(--bg);
      border: 2px solid var(--card-border);
      border-radius: var(--radius-md);
      padding: 18px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 8px;
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
      height: 64px;
      background: var(--bg);
      border-top: 2px solid var(--card-border);
      justify-content: space-around;
      align-items: center;
      z-index: 300;
      padding-bottom: env(safe-area-inset-bottom);
    }
    .mobile-nav-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 11px;
      font-weight: 800;
      gap: 3px;
      cursor: pointer;
      flex: 1;
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
    @media (max-width: 1080px) {
      .sidebar-right { display: none; }
    }
    @media (max-width: 768px) {
      .desktop-sidebar { display: none; }
      .mobile-bottom-nav { display: flex; }
      .main-viewport { padding: 0 16px 90px; min-width: 320px; }
      .top-stats-bar { padding: 10px 14px; gap: 4px; }
      .stat-pill { padding: 4px 6px; font-size: 12px; }
    }
`;

const completeHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <meta name="theme-color" content="#58cc02">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <title>Code_Duo — C# + Unity Learning Quest</title>
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700;800&family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>

  <style>
${completeCSS}
  </style>
</head>
<body>

<div class="app-shell">
  <!-- LEFT SIDEBAR -->
  <aside class="desktop-sidebar">
    <div class="brand-logo" onclick="switchTab('path')">
      <div class="brand-logo-icon">🎮</div>
      <div class="brand-text">Code_Duo<small>C# · UNITY</small></div>
    </div>

    <div class="sidebar-menu">
      <button class="nav-tab-btn" id="btn-tab-diagnostic" onclick="startPlacementQuiz()">
        <span class="nav-icon">⚡</span>
        <span>Placement</span>
      </button>
      <button class="nav-tab-btn active" id="btn-tab-path" onclick="switchTab('path')">
        <span class="nav-icon">🗺️</span>
        <span>Learn Path</span>
      </button>
      <button class="nav-tab-btn" id="btn-tab-leaderboard" onclick="switchTab('leaderboard')">
        <span class="nav-icon">🛡️</span>
        <span>Leaderboard</span>
      </button>
      <button class="nav-tab-btn" id="btn-tab-shop" onclick="switchTab('shop')">
        <span class="nav-icon">💎</span>
        <span>Gems & Shop</span>
      </button>
      <button class="nav-tab-btn" id="btn-tab-badges" onclick="switchTab('badges')">
        <span class="nav-icon">🏅</span>
        <span>Badges & Quests</span>
      </button>
    </div>

    <div class="sidebar-user-card" onclick="openAccountHub()">
      <div class="sidebar-user-meta">
        <div class="sidebar-user-avatar" id="sidebar-user-avatar">👨‍💻</div>
        <div style="min-width:0;">
          <div class="sidebar-user-name" id="sidebar-user-name">Sanju2206</div>
          <div class="sidebar-user-role" id="sidebar-user-role">💎 SUPER DUO</div>
        </div>
      </div>
      <button class="header-btn" style="width:28px; height:28px; font-size:12px; border:none; background:none;" title="Switch Account">⇄</button>
    </div>
  </aside>

  <!-- CENTER MAIN CONTENT -->
  <main class="main-viewport">
    <!-- Top Stats Header -->
    <header class="top-stats-bar">
      <div class="profile-chip super-chip" onclick="openAccountHub()" id="profile-chip">
        <span id="chip-avatar">👨‍💻</span>
        <span id="chip-name">Sanju · SUPER</span>
        <span style="font-size:10px;">▼</span>
      </div>

      <div class="stat-pill" title="Daily Streak">
        <span class="stat-icon">🔥</span>
        <span id="top-streak-val">1</span>
      </div>

      <div class="stat-pill" title="Earned Gems (Realistic Economy)">
        <span class="stat-icon">💎</span>
        <span id="top-gems-val">185</span>
      </div>

      <div class="stat-pill heart-super" id="stat-pill-hearts" title="Super Unlimited Hearts">
        <span class="stat-icon">❤️</span>
        <span id="top-hearts-val">∞</span>
      </div>

      <div class="stat-pill" title="XP Points">
        <span class="stat-icon">⚡</span>
        <span id="top-xp-val">350</span>
      </div>

      <div class="stat-pill" title="Gamedev Level">
        <span class="stat-icon">🏅</span>
        <span id="top-level-val">Lv. 4</span>
      </div>

      <div class="header-action-btns">
        <button class="header-btn" id="audio-toggle-btn" onclick="toggleAudio()" title="Sound Effects">🔊</button>
        <button class="header-btn" id="theme-toggle-btn" onclick="toggleTheme()" title="Toggle Theme">🌙</button>
      </div>
    </header>

    <!-- VIEWS -->
    <div style="width: 100%; max-width: 680px;">
      <!-- Path Tab View -->
      <section class="tab-view active" id="view-path">
        ${pathHtmlContent}
      </section>

      <!-- Leaderboard Tab View -->
      <section class="tab-view" id="view-leaderboard">
        <div class="leaderboard-header-card">
          <div style="font-size: 42px; margin-bottom: 8px;">🛡️</div>
          <h2>Emerald League</h2>
          <p>Compete with Vikram, Priya, Kabir, and fellow devs! Top 3 advance to Diamond League.</p>
        </div>
        <div class="leaderboard-list" id="leaderboard-container">
          <!-- Populated by JS -->
        </div>
      </section>

      <!-- Shop Tab View -->
      <section class="tab-view" id="view-shop">
        <div style="margin: 24px 0 12px;">
          <h2 style="font-size: 24px; margin: 0 0 4px;">Gamedev Item Shop</h2>
          <p style="color: var(--text-muted); font-size: 13.5px;">Spend earned gems on power-ups, boosts, and freezes!</p>
        </div>
        <div class="shop-grid">
          <div class="shop-item-card">
            <div class="shop-item-icon">❤️</div>
            <div class="shop-item-name">Super Unlimited Hearts</div>
            <div class="shop-item-desc">Premium accounts enjoy infinite lives!</div>
            <button class="btn-duo btn-duo-primary" style="margin-top:auto;" disabled>ACTIVE (∞)</button>
          </div>
          <div class="shop-item-card">
            <div class="shop-item-icon">🧊</div>
            <div class="shop-item-name">Streak Freeze</div>
            <div class="shop-item-desc">Protects your streak if you miss practicing tomorrow.</div>
            <button class="btn-duo btn-duo-secondary" style="margin-top:auto;" onclick="buyItem('streak_freeze', 100)">💎 100 Gems</button>
          </div>
          <div class="shop-item-card">
            <div class="shop-item-icon">⚡</div>
            <div class="shop-item-name">2X XP Boost (15m)</div>
            <div class="shop-item-desc">Doubles all lesson XP gains for 15 minutes.</div>
            <button class="btn-duo btn-duo-secondary" style="margin-top:auto;" onclick="buyItem('xp_boost', 80)">💎 80 Gems</button>
          </div>
          <div class="shop-item-card">
            <div class="shop-item-icon">☕</div>
            <div class="shop-item-name">Vikram's Masala Chai</div>
            <div class="shop-item-desc">Sharpens memory trace; grants bonus XP on next 3 lessons.</div>
            <button class="btn-duo btn-duo-secondary" style="margin-top:auto;" onclick="buyItem('masala_chai', 60)">💎 60 Gems</button>
          </div>
        </div>
      </section>

      <!-- Badges & Achievements Tab View (Duolingo Style Progression) -->
      <section class="tab-view" id="view-badges">
        <div style="background:var(--bg); border:2px solid var(--card-border); border-radius:var(--radius-md); padding:22px; display:flex; align-items:center; gap:16px; margin:24px 0 16px;">
          <div style="font-size:46px;" id="badges-hero-avatar">👨‍💻</div>
          <div>
            <h2 id="badges-hero-name" style="margin: 0 0 2px; font-size: 22px;">Sanju (Lead Dev)</h2>
            <div id="badges-hero-role" style="color: var(--secondary-dark); font-weight: 800; font-size: 13.5px;">💎 SUPER DUO ARCHITECT</div>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin: 24px 0 12px;">
          <h3 style="margin:0; font-size:18px;">Achievements & Medals</h3>
          <span style="font-size:12.5px; font-weight:800; color:var(--text-muted);" id="badges-unlocked-ratio">3/12 Unlocked</span>
        </div>
        <div class="achievements-list" id="achievements-container">
          <!-- Populated by JS -->
        </div>
      </section>
    </div>
  </main>

  <!-- RIGHT SIDEBAR (DESKTOP WIDGETS) -->
  <aside class="sidebar-right">
    <!-- Streak Widget -->
    <div class="widget-card">
      <div class="widget-title-row">
        <div class="widget-title">🔥 Daily Streak</div>
        <span style="font-size: 11px; font-weight: 800; color: var(--accent-orange);" id="right-streak-status">Active</span>
      </div>
      <div style="font-size: 30px; font-family: var(--font-display); font-weight: 800; color: var(--accent-orange);" id="right-streak-count">1 Day</div>
      <div style="font-size: 12.5px; color: var(--text-muted); margin-bottom: 8px;">Keep practicing daily to build your gamedev muscle!</div>
      <div class="streak-calendar-row">
        <div class="streak-day-dot active" id="dot-day-0">M</div>
        <div class="streak-day-dot" id="dot-day-1">T</div>
        <div class="streak-day-dot" id="dot-day-2">W</div>
        <div class="streak-day-dot" id="dot-day-3">T</div>
        <div class="streak-day-dot" id="dot-day-4">F</div>
        <div class="streak-day-dot" id="dot-day-5">S</div>
        <div class="streak-day-dot" id="dot-day-6">S</div>
      </div>
      <div style="font-size: 11.5px; font-weight: 800; color: #1cb0f6; margin-top: 8px;" id="right-freeze-status">🛡️ 5 Streak Freezes active</div>
    </div>

    <!-- Emerald League Widget -->
    <div class="widget-card">
      <div class="widget-title-row">
        <div class="widget-title">🛡️ Emerald League</div>
        <button class="unit-guidebook-btn" style="position:static; padding: 5px 10px; font-size: 11px; background:var(--secondary); color:#fff; border:none;" onclick="switchTab('leaderboard')">View All</button>
      </div>
      <div id="right-league-preview" style="display:flex; flex-direction:column; gap:9px;">
        <!-- Filled by JS -->
      </div>
    </div>

    <!-- AI Adaptive Knowledge Matrix -->
    <div class="widget-card">
      <div class="widget-title-row">
        <div class="widget-title">🧠 AI Knowledge Matrix</div>
        <span style="font-size: 10px; font-weight: 800; background: #e3f2fd; color: #1976d2; padding: 2px 7px; border-radius: 8px;">BKT + RL</span>
      </div>
      <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px;">Live Bayesian Skill Tracing calibrated from your code submissions:</div>
      
      <div id="ai-skill-bars-container">
        <!-- Rendered by JS -->
      </div>

      <div class="cognitive-state-badge" id="ai-cognitive-state">
        <span>⚡</span>
        <span id="ai-state-label">State: Focused & Mastered</span>
      </div>
      <button class="btn-duo btn-duo-secondary" style="margin-top: 14px; width: 100%; font-size: 12px; padding: 9px;" onclick="startPlacementQuiz()">🤖 Start AI Calibration</button>
    </div>

    <!-- Daily Quest -->
    <div class="widget-card">
      <div class="widget-title-row">
        <div class="widget-title">⚡ Daily Quest</div>
        <span style="font-size: 11px; font-weight: 800; color: var(--primary-dark);">+20 Gems</span>
      </div>
      <div style="font-size: 12.5px; font-weight: 700; color: var(--text); margin-bottom: 6px;">Earn 50 XP today</div>
      <div class="radar-bar-track">
        <div class="radar-bar-fill" id="daily-quest-bar" style="width: 100%;"></div>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 800; color: var(--text-muted); margin-top: 5px;">
        <span id="daily-quest-txt">50 / 50 XP</span>
        <span>100%</span>
      </div>
    </div>
  </aside>
</div>

<!-- MOBILE BOTTOM NAVIGATION -->
<nav class="mobile-bottom-nav">
  <button class="mobile-nav-btn active" id="dock-btn-path" onclick="switchTab('path')">
    <span>🗺️</span>
    <span>Path</span>
  </button>
  <button class="mobile-nav-btn" id="dock-btn-practice" onclick="startPlacementQuiz()">
    <span>⚡</span>
    <span>Practice</span>
  </button>
  <button class="mobile-nav-btn" id="dock-btn-leaderboard" onclick="switchTab('leaderboard')">
    <span>🛡️</span>
    <span>League</span>
  </button>
  <button class="mobile-nav-btn" id="dock-btn-shop" onclick="switchTab('shop')">
    <span>💎</span>
    <span>Shop</span>
  </button>
</nav>

<!-- MODALS (CRITICAL: ALL HIDDEN BY DEFAULT WITH display:none) -->

<!-- Lesson Execution Modal -->
<div class="lesson-overlay" id="lesson-modal">
  <div class="lesson-header">
    <button class="lesson-close-btn" onclick="quitLesson()" title="Quit Lesson">✕</button>
    <div class="duo-progress-track">
      <div class="duo-progress-fill" id="lesson-progress-fill"></div>
    </div>
    <div class="lesson-hearts" id="lesson-hearts-display">
      <span class="heart-icon">❤️</span>
      <span id="lesson-hearts-count">∞</span>
    </div>
  </div>

  <div class="lesson-content" id="lesson-content-area">
    <!-- Populated dynamically during question -->
  </div>

  <!-- Bottom 4-Layer Feedback Drawer -->
  <div class="eval-drawer" id="eval-drawer">
    <div class="eval-drawer-inner">
      <div class="eval-feedback-header">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="font-size:28px;" id="eval-feedback-icon">✓</div>
          <div>
            <div class="eval-feedback-title" id="eval-feedback-title">Correct! Superb deduction!</div>
            <div style="font-size:12.5px; font-weight:700; opacity:0.9;" id="eval-feedback-agent"></div>
          </div>
        </div>
        <button class="btn-duo btn-duo-primary" id="eval-continue-btn" onclick="handleDrawerContinue()">CONTINUE</button>
      </div>

      <!-- Explaining Layer Tabs -->
      <div class="explain-tab-bar">
        <button class="explain-tab-btn active" onclick="switchExplainTab('summary')">💡 Concept</button>
        <button class="explain-tab-btn" onclick="switchExplainTab('analogy')">🎮 Gamedev</button>
        <button class="explain-tab-btn" onclick="switchExplainTab('memory')">🧠 Engine/Memory</button>
        <button class="explain-tab-btn" onclick="switchExplainTab('pitfall')">⚠️ Bug Trap</button>
      </div>

      <div id="eval-explanation-box" style="margin-top: 6px; font-size:13.5px; line-height:1.5;"></div>
    </div>
  </div>
</div>

<!-- Guidebook Modal -->
<div class="generic-dialog-backdrop" id="guidebook-modal">
  <div class="dialog-card">
    <div class="dialog-emoji">📖</div>
    <div class="dialog-title" id="guidebook-modal-title">Unit Guidebook</div>
    <div class="dialog-body" id="guidebook-modal-body"></div>
    <div class="dialog-buttons">
      <button class="btn-duo btn-duo-primary" onclick="closeGuidebook()">Got it!</button>
    </div>
  </div>
</div>

<!-- Account Hub Switcher Modal -->
<div class="generic-dialog-backdrop" id="account-hub-modal">
  <div class="dialog-card" style="max-width: 500px;">
    <div class="dialog-emoji">👨‍💻</div>
    <div class="dialog-title">Code_Duo Team Profiles</div>
    <div class="dialog-body">
      <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 14px;">Switch between configured local developer accounts or sync state via GitHub accounts.json:</p>
      <div class="account-hub-cards" id="account-hub-cards-container">
        <!-- Populated by JS -->
      </div>
    </div>
    <div class="dialog-buttons">
      <button class="btn-duo btn-duo-secondary" onclick="closeAccountHub()">Close</button>
    </div>
  </div>
</div>

<!-- Password Prompt Modal -->
<div class="generic-dialog-backdrop" id="password-modal">
  <div class="dialog-card" style="max-width: 360px;">
    <div class="dialog-emoji">🔒</div>
    <div class="dialog-title">Verify Password</div>
    <div class="dialog-body">
      <p style="font-size: 13px; color: var(--text-muted);" id="password-prompt-desc">Enter password for Sanju2206:</p>
      <input type="password" id="account-password-input" style="width: 100%; padding: 12px; border: 2px solid var(--card-border); border-radius: var(--radius-sm); font-size: 14px; margin: 12px 0; background:var(--bg); color:var(--text);" placeholder="Enter password...">
      <div id="password-error-msg" style="color: var(--accent-red); font-size: 12px; font-weight: 800; display: none;">Incorrect password! Please try again.</div>
    </div>
    <div class="dialog-buttons">
      <button class="btn-duo btn-duo-white" onclick="closePasswordModal()">Cancel</button>
      <button class="btn-duo btn-duo-primary" onclick="confirmPasswordSwitch()">Verify & Switch</button>
    </div>
  </div>
</div>

<!-- Generic Toast Dialog -->
<div class="generic-dialog-backdrop" id="toast-dialog-modal">
  <div class="dialog-card" style="max-width: 380px;">
    <div class="dialog-emoji" id="toast-dialog-emoji">🔔</div>
    <div class="dialog-title" id="toast-dialog-title">Notice</div>
    <div class="dialog-body" id="toast-dialog-body" style="font-size: 14px; line-height: 1.5;"></div>
    <div class="dialog-buttons">
      <button class="btn-duo btn-duo-primary" id="toast-dialog-btn" onclick="closeToastDialog()">OK</button>
    </div>
  </div>
</div>

<!-- JAVASCRIPT LOGIC -->
<script>
/* =========================================================
   SYNTAX HIGHLIGHTER UTILITY (FOR ULTRA-CRISP C# CODE)
   ========================================================= */
function highlightCSharp(code) {
  if (!code) return '';
  const escaped = String(code)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return escaped
    .replace(/(\/\/[^\n]*)/g, '<span class="tok-comment">$1</span>')
    .replace(/\b(int|float|bool|string|void|class|struct|interface|abstract|virtual|override|public|private|protected|static|new|return|if|else|for|while|foreach|switch|case|break|yield|async|await)\b/g, '<span class="tok-keyword">$1</span>')
    .replace(/\b(Vector3|Vector2|Rigidbody|Rigidbody2D|Collider|Transform|GameObject|MonoBehaviour|ScriptableObject|Console|Mathf|Math|Time|Physics|RaycastHit|Quaternion|SceneManager|List|Dictionary|Queue|Stack|HashSet|Action|Func|UniTask|Task)\b/g, '<span class="tok-type">$1</span>')
    .replace(/\b([0-9]+(\.[0-9]+)?f?)\b/g, '<span class="tok-number">$1</span>')
    .replace(/(".*?")/g, '<span class="tok-string">$1</span>');
}

/* =========================================================
   SYNTHESIZED WEB AUDIO SFX ENGINE
   ========================================================= */
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

/* =========================================================
   USER ACCOUNTS & REALISTIC DIAMOND ECONOMY (LIMITED)
   ========================================================= */
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
      unlockedBadges: ['b_first', 'b_streak1', 'b_xp100'],
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

// Ensure gems are realistic (capped and reasonable, not 9999 cheat)
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

/* =========================================================
   AI ALGORITHMIC BACKEND (BKT, DECISION TREE, Q-LEARNING)
   ========================================================= */
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
    return \`\${char.name}: "Wah! Lightning fast trace! That is real Lead Architect speed right there!"\`;
  } else if (cognitiveState.state === 'FAST_GUESS') {
    return \`\${char.name}: "Hold on, dost! Trace the memory and variables line-by-line first."\`;
  } else if (cognitiveState.state === 'HESITANT_CORRECT') {
    return \`\${char.name}: "Shabash! Careful calculation prevents crashes in the production build!"\`;
  } else {
    return \`\${char.name}: "No worries, keep calm! Check the memory breakdown below to spot where the condition flipped."\`;
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
    code: \`int playerHp = \${hp};\\nint dmg = \${dmg};\\nint currentHp = playerHp - dmg;\\nConsole.WriteLine(currentHp);\`,
    choices: [String(ans), String(ans + 10), String(ans - 5), String(hp)],
    answer: 0,
    explainSummary: \`\${hp} - \${dmg} = \${ans}! Fast integer subtraction executed on stack.\`,
    explainAnalogy: 'Simulating instantaneous projectile damage in our combat engine.',
    explainMemory: \`STACK: [playerHp = \${hp}], [dmg = \${dmg}], [currentHp = \${ans}]\`,
    pitfall: 'Avoid floating point rounding errors when working with whole integer health pools.'
  };
}

/* =========================================================
   CURRICULUM DATABASE (${curriculum.length} Units, ${lessonOrder.length} Lessons)
   ========================================================= */
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

/* =========================================================
   EXPANDED INDIAN & GLOBAL CHARACTERS (VIBRANT & DYNAMIC)
   ========================================================= */
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
        <!-- Body: Indian Nehru jacket / Blazer -->
        <path d="M 28 62 C 28 50, 72 50, 72 62 L 76 96 L 24 96 Z" fill="#1e3a5f"/>
        <path d="M 44 62 L 44 96 M 50 62 L 50 96" stroke="#f1c40f" stroke-width="1.5"/>
        <!-- Head with Indian skin tone -->
        <circle cx="50" cy="42" r="22" fill="#d99b6c"/>
        <!-- Smart neat black hair & trimmed beard -->
        <path d="M 27 34 C 27 18, 73 18, 73 34 C 70 24, 30 24, 27 34 Z" fill="#1a1a1a"/>
        <path d="M 36 50 C 36 60, 64 60, 64 50 L 62 48 C 62 55, 38 55, 38 48 Z" fill="#1a1a1a"/>
        <!-- Glasses -->
        <rect x="34" y="38" width="13" height="10" rx="3" fill="none" stroke="#222" stroke-width="2.2"/>
        <rect x="53" y="38" width="13" height="10" rx="3" fill="none" stroke="#222" stroke-width="2.2"/>
        <line x1="47" y1="43" x2="53" y2="43" stroke="#222" stroke-width="2.2"/>
        <!-- Eyes -->
        <circle cx="40.5" cy="43" r="2.2" fill="#111"/>
        <circle cx="59.5" cy="43" r="2.2" fill="#111"/>
        <!-- Chai Cup in hand -->
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
        <!-- Body: Stylish teal gamer hoodie -->
        <path d="M 30 60 C 30 48, 70 48, 70 60 L 74 95 L 26 95 Z" fill="#00b4d8"/>
        <!-- Head -->
        <circle cx="50" cy="42" r="21" fill="#e0a370"/>
        <!-- Long dark flowing hair -->
        <path d="M 26 38 C 26 18, 74 18, 74 38 L 76 68 L 70 70 L 68 40 L 32 40 L 30 70 L 24 68 Z" fill="#201a15"/>
        <!-- Bindi -->
        <circle cx="50" cy="36" r="2" fill="#c0392b"/>
        <!-- Eyes with eyelashes -->
        <circle cx="41" cy="43" r="3" fill="#1b2a30"/>
        <circle cx="59" cy="43" r="3" fill="#1b2a30"/>
        <path d="M 37 40 L 41 38" stroke="#201a15" stroke-width="1.5"/>
        <path d="M 63 40 L 59 38" stroke="#201a15" stroke-width="1.5"/>
        <!-- Smile -->
        <path d="M 44 51 Q 50 56 56 51" stroke="#a0522d" stroke-width="2" fill="none"/>
        <!-- Headphones -->
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
        <!-- Red hoodie -->
        <path d="M 32 60 C 32 50, 68 50, 68 60 L 72 95 L 28 95 Z" fill="#e74c3c"/>
        <circle cx="50" cy="44" r="21" fill="#e6a877"/>
        <!-- Backwards cap -->
        <path d="M 28 40 C 28 24, 72 24, 72 40 Z" fill="#e67e22"/>
        <path d="M 68 38 Q 84 38 88 43" stroke="#d35400" stroke-width="4.5" stroke-linecap="round" fill="none"/>
        <!-- Expressive eyes -->
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
        <!-- Headset -->
        <path d="M 19 45 C 19 14, 81 14, 81 45" stroke="#263840" stroke-width="5" fill="none" stroke-linecap="round"/>
        <rect x="15" y="40" width="8" height="15" rx="3" fill="#ff4b4b"/>
        <rect x="77" y="40" width="8" height="15" rx="3" fill="#ff4b4b"/>
        <!-- Big Eyes -->
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
        <!-- Magnifying glass -->
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
  showToastDialog(\`\${char.name} says:\`, \`"\${bark}"\`, 'Keep Coding!');
}

function renderPathCharacters() {
  const spots = [
    { id: 'path-kabir-svg', char: 'kabir' },
    { id: 'path-duo-svg', char: 'duo' },
    { id: 'path-priya-svg', char: 'priya' },
    { id: 'path-vikram-svg', char: 'vikram' },
    { id: 'path-lily-u4-svg', char: 'lily' },
    { id: 'path-dev-u5-svg', char: 'dev' },
    { id: 'path-priya-u6-svg', char: 'priya' },
    { id: 'path-vikram-u7-svg', char: 'vikram' },
    { id: 'path-kabir-u8-svg', char: 'kabir' },
    { id: 'path-lily-u9-svg', char: 'lily' },
    { id: 'path-vikram-u10-svg', char: 'vikram' },
    { id: 'path-duo-u10-svg', char: 'duo' }
  ];
  spots.forEach(s => {
    const el = document.getElementById(s.id);
    if (el) el.innerHTML = CHARACTERS[s.char].renderSVG('idle');
  });
}

/* =========================================================
   UI NAVIGATION & TABS
   ========================================================= */
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
  const u = accountsDB[currentUsername];
  const isSuper = u.isPremium || userState.isPremium;

  document.getElementById('chip-name').textContent = u.name.split(' ')[0] + (isSuper ? ' · SUPER' : '');
  document.getElementById('chip-avatar').textContent = u.avatar;
  document.getElementById('sidebar-user-name').textContent = u.name;
  document.getElementById('sidebar-user-role').textContent = isSuper ? '💎 SUPER DUO ARCHITECT' : u.role;
  document.getElementById('sidebar-user-avatar').textContent = u.avatar;

  document.getElementById('top-streak-val').textContent = userState.streak;
  document.getElementById('top-gems-val').textContent = userState.gems;
  
  // UNLIMITED HEARTS FOR SANJU & SCARIA
  const heartsDisplay = isSuper ? '∞' : userState.hearts;
  document.getElementById('top-hearts-val').textContent = heartsDisplay;
  const heartPill = document.getElementById('stat-pill-hearts');
  if (heartPill) heartPill.classList.toggle('heart-super', isSuper);

  document.getElementById('top-xp-val').textContent = userState.xp;
  document.getElementById('top-level-val').textContent = \`Lv. \${userState.level}\`;

  // Desktop Widgets
  const streakCount = document.getElementById('right-streak-count');
  if (streakCount) streakCount.textContent = \`\${userState.streak} Day\${userState.streak === 1 ? '' : 's'}\`;
  const freezeStatus = document.getElementById('right-freeze-status');
  if (freezeStatus) freezeStatus.textContent = \`🛡️ \${userState.freezes || 5} Streak Freezes active\`;

  renderAIRadar();
  renderRightLeaguePreview();
  updatePathNodesStatus();
}

function renderAIRadar() {
  const container = document.getElementById('ai-skill-bars-container');
  if (!container) return;
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
    { name: u1.name + ' (You)', xp: u1.state.xp, avatar: u1.avatar },
    { name: 'Vikram', xp: 280, avatar: '👓' },
    { name: u2.name, xp: u2.state.xp, avatar: u2.avatar },
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
  let firstUnlocked = null;
  LESSON_ORDER.forEach((lessonId, idx) => {
    const nodeBtn = document.getElementById(\`node-\${lessonId}\`);
    if (!nodeBtn) return;
    const isDone = userState.completedLessons.includes(lessonId);
    const isUnlocked = idx === 0 || userState.completedLessons.includes(LESSON_ORDER[idx - 1]);

    if (isDone) {
      nodeBtn.className = 'path-node';
      nodeBtn.innerHTML = '<span>✓</span>';
    } else if (isUnlocked) {
      nodeBtn.className = 'path-node current';
      nodeBtn.innerHTML = '<span>▶</span>';
      if (!firstUnlocked) firstUnlocked = lessonId;
    } else {
      nodeBtn.className = 'path-node locked';
      nodeBtn.innerHTML = '<span>🔒</span>';
    }
  });

  // Chests status
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

  // Active popover positioning
  const popover = document.querySelector('.node-popover');
  if (popover && firstUnlocked) {
    const targetNode = document.getElementById(\`node-\${firstUnlocked}\`);
    if (targetNode && targetNode.parentElement) {
      targetNode.parentElement.insertBefore(popover, targetNode);
      const lessonObj = LESSONS_DATABASE[firstUnlocked];
      if (lessonObj) {
        popover.querySelector('.node-popover-title').textContent = lessonObj.title;
        const lessonNum = LESSON_ORDER.indexOf(firstUnlocked) + 1;
        popover.querySelector('.node-popover-sub').textContent = \`Start · Lesson \${lessonNum}\`;
      }
    }
  }
}

/* =========================================================
   STRICT CHEST REWARDS GATING (REALISTIC GEM AWARDS)
   ========================================================= */
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

  // Realistic gem award
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
}

/* =========================================================
   LESSON EXECUTION SYSTEM (SYNTAX HIGHLIGHTED & 4 LAYERS)
   ========================================================= */
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
  
  // Unlimited hearts display
  const isSuper = accountsDB[currentUsername].isPremium || userState.isPremium;
  document.getElementById('lesson-hearts-count').textContent = isSuper ? '∞' : userState.hearts;

  const drawer = document.getElementById('eval-drawer');
  drawer.className = 'eval-drawer';

  // Dynamic character selection
  const charKey = q.character === 'junior' ? 'kabir' : (q.character || 'priya');
  const char = CHARACTERS[charKey] || CHARACTERS.priya;
  const contentArea = document.getElementById('lesson-content-area');

  // Highlighted code snippet HTML
  const highlightedCode = q.code ? highlightCSharp(q.code) : '';

  contentArea.innerHTML = \`
    <div style="display:flex; align-items:center; gap:14px; margin-bottom:16px;">
      <div style="width:75px; height:85px; flex-shrink:0;">
        \${char.renderSVG('idle')}
      </div>
      <div style="background:#f1f5f2; border:2px solid #e1e9e3; border-radius:14px; padding:12px 18px; font-size:14.5px; font-weight:700; line-height:1.45; color:var(--text); flex:1;">
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

  if (isCorrect) {
    sfx.playCorrect();
    if (chosenBtn) chosenBtn.classList.add('correct');
  } else {
    sfx.playWrong();
    if (chosenBtn) chosenBtn.classList.add('wrong');
    if (correctBtn) correctBtn.classList.add('correct');

    // UNLIMITED HEARTS FOR SANJU & SCARIA: NEVER DECREMENT!
    if (!isSuper && typeof userState.hearts === 'number') {
      userState.hearts = Math.max(0, userState.hearts - 1);
    }
    document.getElementById('lesson-hearts-count').textContent = isSuper ? '∞' : userState.hearts;
  }

  // Show bottom evaluation drawer
  const drawer = document.getElementById('eval-drawer');
  const title = document.getElementById('eval-feedback-title');
  const icon = document.getElementById('eval-feedback-icon');
  const agentSpeech = document.getElementById('eval-feedback-agent');

  drawer.className = \`eval-drawer active \${isCorrect ? 'correct-state' : 'wrong-state'}\`;
  title.textContent = isCorrect ? 'Correct! Superb deduction!' : (isSuper ? 'Incorrect! (Protected by Super Unlimited Hearts)' : 'Incorrect!');
  icon.textContent = isCorrect ? '✓' : '✗';
  agentSpeech.textContent = selectQDialogue(q.character, cognitive);

  renderExplainContent('summary');
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

  // Streak advances strictly once per calendar day
  const todayStr = new Date().toDateString();
  if (userState.lastStreakDate !== todayStr) {
    userState.streak++;
    userState.lastStreakDate = todayStr;
  }

  if (lessonId && !userState.completedLessons.includes(lessonId)) {
    userState.completedLessons.push(lessonId);
  }

  const xpEarned = 25;
  const gemsEarned = 15; // Realistic earned gems
  userState.xp += xpEarned;
  userState.gems += gemsEarned;
  userState.level = Math.floor(userState.xp / 100) + 1;

  if (window.confetti) {
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
  }

  sfx.playCorrect();
  saveState();
  closeLessonModal();

  showToastDialog(
    'Quest Completed!',
    \`Fantastic job! You finished the lesson!\\n\\nEarned:\\n⚡ +\${xpEarned} XP\\n💎 +\${gemsEarned} Gems\\n🔥 Streak: \${userState.streak} Days\`,
    'Continue Path',
    '🏆'
  );
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

/* =========================================================
   DIAGNOSTIC PLACEMENT QUIZ
   ========================================================= */
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

/* =========================================================
   GUIDEBOOK MODAL
   ========================================================= */
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

/* =========================================================
   ACCOUNT HUB & PASSWORD VERIFICATION
   ========================================================= */
let pendingSwitchUsername = null;

function openAccountHub() {
  sfx.playTap();
  const container = document.getElementById('account-hub-cards-container');
  const u1 = accountsDB['Sanju2206'];
  const u2 = accountsDB['Scaria2584'];

  container.innerHTML = \`
    <div class="account-card-box \${currentUsername === 'Sanju2206' ? 'active-user' : ''}">
      <div style="font-size:34px;">👨‍💻</div>
      <div class="acc-details">
        <div class="acc-name">\${u1.name} <span style="font-size:10px; background:#f1c40f; color:#000; padding:2px 7px; border-radius:6px; font-weight:900;">SUPER</span></div>
        <div class="acc-tag">@\${u1.username} · \${u1.role}</div>
        <div class="acc-stats-row">
          <span>⚡ \${u1.state.xp} XP</span>
          <span>🔥 \${u1.state.streak}d</span>
          <span>💎 \${u1.state.gems}</span>
          <span>❤️ ∞</span>
        </div>
      </div>
      <div>
        \${currentUsername === 'Sanju2206'
          ? '<span style="font-size:11px; font-weight:900; color:var(--primary-dark); background:#d7ffb8; padding:5px 10px; border-radius:12px;">ACTIVE</span>'
          : '<button class="btn-duo btn-duo-secondary" style="padding:6px 12px; font-size:12px;" onclick="promptSwitchAccount(\\'Sanju2206\\')">Switch</button>'
        }
      </div>
    </div>

    <div class="account-card-box \${currentUsername === 'Scaria2584' ? 'active-user' : ''}">
      <div style="font-size:34px;">⚡</div>
      <div class="acc-details">
        <div class="acc-name">\${u2.name} <span style="font-size:10px; background:#f1c40f; color:#000; padding:2px 7px; border-radius:6px; font-weight:900;">SUPER</span></div>
        <div class="acc-tag">@\${u2.username} · \${u2.role}</div>
        <div class="acc-stats-row">
          <span>⚡ \${u2.state.xp} XP</span>
          <span>🔥 \${u2.state.streak}d</span>
          <span>💎 \${u2.state.gems}</span>
          <span>❤️ ∞</span>
        </div>
      </div>
      <div>
        \${currentUsername === 'Scaria2584'
          ? '<span style="font-size:11px; font-weight:900; color:var(--primary-dark); background:#d7ffb8; padding:5px 10px; border-radius:12px;">ACTIVE</span>'
          : '<button class="btn-duo btn-duo-secondary" style="padding:6px 12px; font-size:12px;" onclick="promptSwitchAccount(\\'Scaria2584\\')">Switch</button>'
        }
      </div>
    </div>
  \`;

  document.getElementById('account-hub-modal').classList.add('active');
}

function closeAccountHub() {
  sfx.playTap();
  document.getElementById('account-hub-modal').classList.remove('active');
}

function promptSwitchAccount(targetUsername) {
  sfx.playTap();
  closeAccountHub();
  pendingSwitchUsername = targetUsername;
  document.getElementById('password-prompt-desc').textContent = \`Enter password for \${targetUsername}:\`;
  document.getElementById('account-password-input').value = '';
  document.getElementById('password-error-msg').style.display = 'none';
  document.getElementById('password-modal').classList.add('active');
}

function closePasswordModal() {
  sfx.playTap();
  document.getElementById('password-modal').classList.remove('active');
  pendingSwitchUsername = null;
}

function confirmPasswordSwitch() {
  const entered = document.getElementById('account-password-input').value.trim();
  const target = accountsDB[pendingSwitchUsername];
  if (!target) return;

  if (entered === target.password) {
    sfx.playCorrect();
    currentUsername = pendingSwitchUsername;
    userState = target.state;
    saveState();
    closePasswordModal();
    showToastDialog('Account Switched!', \`Logged in as \${target.name} (@\${target.username}). Unlimited lives active!\`, 'Start Coding', '🎉');
  } else {
    sfx.playWrong();
    document.getElementById('password-error-msg').style.display = 'block';
  }
}

/* =========================================================
   LEADERBOARD & MULTI-TIER DUOLINGO ACHIEVEMENTS
   ========================================================= */
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

// 12 MULTI-TIER DUOLINGO ACHIEVEMENTS
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
  const u = accountsDB[currentUsername];
  document.getElementById('badges-hero-name').textContent = u.name;
  document.getElementById('badges-hero-role').textContent = u.isPremium ? '💎 SUPER DUO ARCHITECT' : u.role;
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

/* =========================================================
   THEME & TOAST UTILITIES
   ========================================================= */
function toggleTheme() {
  sfx.playTap();
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  document.getElementById('theme-toggle-btn').textContent = next === 'dark' ? '☀️' : '🌙';
}

function toggleAudio() {
  sfx.enabled = !sfx.enabled;
  document.getElementById('audio-toggle-btn').textContent = sfx.enabled ? '🔊' : '🔇';
  if (sfx.enabled) sfx.playTap();
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

// Initial Mount
renderHeaderStats();
renderPathCharacters();
</script>
</body>
</html>
`;

fs.writeFileSync('index.html', completeHTML, 'utf8');
console.log('Successfully generated upgraded index.html! File size:', Buffer.byteLength(completeHTML));
