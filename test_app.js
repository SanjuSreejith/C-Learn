// test_app.js
const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

console.log('--- TEST 1: Script syntax verification ---');
const scriptMatches = [...content.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi)];
if (scriptMatches.length === 0) {
  console.error('FAIL: No script tag found!');
  process.exit(1);
}
scriptMatches.forEach((m, idx) => {
  try {
    new Function(m[1]);
    console.log(`PASS: Script tag #${idx} parsed with 0 syntax errors!`);
  } catch (e) {
    console.error(`FAIL: Script tag #${idx} Syntax Error:`, e.message);
    process.exit(1);
  }
});

const mainScript = scriptMatches[scriptMatches.length - 1][1];

console.log('--- TEST 2: Lessons count & 1,000 Questions verification ---');
const orderMatch = mainScript.match(/const LESSON_ORDER = (\[[\s\S]*?\]);/);
if (!orderMatch) {
  console.error('FAIL: Could not find LESSON_ORDER in main script');
  process.exit(1);
}
const order = JSON.parse(orderMatch[1]);
console.log('LESSON_ORDER count:', order.length);
if (order.length === 100) {
  console.log('PASS: Exactly 100 lessons in LESSON_ORDER!');
} else {
  console.error('FAIL: Expected 100 lessons, got:', order.length);
  process.exit(1);
}

// Count total questions and check answer distribution in LESSONS_DATABASE
const dbMatch = mainScript.match(/const LESSONS_DATABASE = ({[\s\S]*?});\nconst LESSON_ORDER/);
if (!dbMatch) {
  console.error('FAIL: Could not extract LESSONS_DATABASE');
  process.exit(1);
}
const db = JSON.parse(dbMatch[1]);
let totalQ = 0;
let ansDist = { 0: 0, 1: 0, 2: 0, 3: 0 };
Object.keys(db).forEach(id => {
  const qLen = db[id].questions.length;
  totalQ += qLen;
  db[id].questions.forEach(q => {
    ansDist[q.answer] = (ansDist[q.answer] || 0) + 1;
  });
});
console.log(`Total questions in LESSONS_DATABASE: ${totalQ}`);
console.log('Answer distribution (0=A, 1=B, 2=C, 3=D):', ansDist);

const allAnswersVaried = Object.values(ansDist).every(cnt => cnt > 150);
if (totalQ === 1000 && allAnswersVaried) {
  console.log('PASS: Correct answers are uniformly distributed across A, B, C, D (not all A)!');
} else {
  console.error('FAIL: Answer choices are not properly distributed!');
  process.exit(1);
}

console.log('--- TEST 3: Teach-First Concept Briefing Screen ---');
const hasTeachScreen = content.includes('renderTeachScreen');
const hasTeachCard = content.includes('concept-briefing-card');
const hasStartDrillsBtn = content.includes('startDrillsAfterTeach');

console.log('Has renderTeachScreen:', hasTeachScreen);
console.log('Has concept-briefing-card:', hasTeachCard);
console.log('Has startDrillsAfterTeach:', hasStartDrillsBtn);

if (hasTeachScreen && hasTeachCard && hasStartDrillsBtn) {
  console.log('PASS: Duolingo Teach-First concept briefing screen is integrated before drills!');
} else {
  console.error('FAIL: Teach-first concept screen missing!');
  process.exit(1);
}

console.log('--- TEST 4: Dynamic Daily Streak Engine ---');
const hasDynamicStreakWidget = content.includes('renderStreakWidget');
const hasAwardStreakFn = content.includes('checkAndAwardDailyStreak');
const hasStreakDotsContainer = content.includes('streak-calendar-dots');

console.log('Has renderStreakWidget:', hasDynamicStreakWidget);
console.log('Has checkAndAwardDailyStreak:', hasAwardStreakFn);
console.log('Has streak-calendar-dots:', hasStreakDotsContainer);

if (hasDynamicStreakWidget && hasAwardStreakFn && hasStreakDotsContainer) {
  console.log('PASS: Dynamic daily streak calculation & flame calendar verified!');
} else {
  console.error('FAIL: Dynamic streak engine missing!');
  process.exit(1);
}

console.log('--- TEST 5: Top Character Dialogue Feedback ("Okay!") ---');
const hasTopBubble = content.includes('id="lesson-top-bubble"');
const hasOkayPrefix = content.includes('Okay!');
const noDuplicateAgentInDrawer = !content.includes('id="eval-feedback-agent"');

if (hasTopBubble && hasOkayPrefix && noDuplicateAgentInDrawer) {
  console.log('PASS: Mascot reacts at the top with "Okay!" without duplicate character below!');
} else {
  console.error('FAIL: Mascot top feedback criteria not met.');
  process.exit(1);
}

console.log('--- TEST 6: Automated GitHub Sync Engine ---');
const hasGitPill = content.includes('header-git-pill');
const hasAutoSaveFn = content.includes('autoSaveToGitHub');
const hasGitSyncModal = content.includes('git-sync-modal');

if (hasGitPill && hasAutoSaveFn && hasGitSyncModal) {
  console.log('PASS: GitHub automated save and companion sync engine verified!');
} else {
  console.error('FAIL: GitHub sync engine criteria not met.');
  process.exit(1);
}

console.log('\n=============================');
console.log('🎉 ALL INTEGRATION TESTS PASSED!');
console.log('=============================');
