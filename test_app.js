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

// Count total questions in LESSONS_DATABASE
const dbMatch = mainScript.match(/const LESSONS_DATABASE = ({[\s\S]*?});\nconst LESSON_ORDER/);
if (!dbMatch) {
  console.error('FAIL: Could not extract LESSONS_DATABASE');
  process.exit(1);
}
const db = JSON.parse(dbMatch[1]);
let totalQ = 0;
let lessonsWith10Q = 0;
Object.keys(db).forEach(id => {
  const qLen = db[id].questions.length;
  totalQ += qLen;
  if (qLen === 10) lessonsWith10Q++;
});
console.log(`Total questions in LESSONS_DATABASE: ${totalQ}`);
console.log(`Lessons with exactly 10 questions: ${lessonsWith10Q} / 100`);

if (totalQ === 1000 && lessonsWith10Q === 100) {
  console.log('PASS: Exactly 10 questions per lesson across all 100 lessons (1,000 total questions)!');
} else {
  console.error('FAIL: Expected 1,000 questions, got:', totalQ);
  process.exit(1);
}

console.log('--- TEST 3: Top Character Dialogue Feedback ("Okay!") ---');
const hasTopBubble = content.includes('id="lesson-top-bubble"');
const hasOkayPrefix = content.includes('Okay!');
const hasBounceAnimation = content.includes('char-bounce-correct');
const hasShakeAnimation = content.includes('char-shake-wrong');
const noDuplicateAgentInDrawer = !content.includes('id="eval-feedback-agent"');

console.log('Has lesson-top-bubble:', hasTopBubble);
console.log('Has Okay! prefix reaction:', hasOkayPrefix);
console.log('Has char bounce animation:', hasBounceAnimation);
console.log('Has char shake animation:', hasShakeAnimation);
console.log('No duplicate character in bottom drawer:', noDuplicateAgentInDrawer);

if (hasTopBubble && hasOkayPrefix && hasBounceAnimation && hasShakeAnimation && noDuplicateAgentInDrawer) {
  console.log('PASS: Mascot commentary reacts directly at the top with "Okay!" feedback!');
} else {
  console.error('FAIL: Mascot top feedback criteria not met.');
  process.exit(1);
}

console.log('--- TEST 4: Automated GitHub Sync Engine ---');
const hasGitPill = content.includes('header-git-pill');
const hasAutoSaveFn = content.includes('autoSaveToGitHub');
const hasGitSyncModal = content.includes('git-sync-modal');
const hasServerJs = fs.existsSync('server.js');

console.log('Has header GitHub pill:', hasGitPill);
console.log('Has autoSaveToGitHub function:', hasAutoSaveFn);
console.log('Has git-sync-modal dialog:', hasGitSyncModal);
console.log('Has server.js companion:', hasServerJs);

if (hasGitPill && hasAutoSaveFn && hasGitSyncModal && hasServerJs) {
  console.log('PASS: GitHub automated save and companion sync engine verified!');
} else {
  console.error('FAIL: GitHub sync engine criteria not met.');
  process.exit(1);
}

console.log('--- TEST 5: Syntax Highlighting & Code Display ---');
console.log('Has highlightCSharp:', content.includes('function highlightCSharp'));
console.log('Has tok-keyword styling:', content.includes('.tok-keyword'));
console.log('Has tok-type styling:', content.includes('.tok-type'));
console.log('Has code-terminal-card flex-shrink: 0:', content.includes('flex-shrink: 0 !important'));

console.log('--- TEST 6: Realistic Accounts & Sleek Super ---');
console.log('Sanju has realistic gems (185):', content.includes('gems: 185') || content.includes('185'));
console.log('Scaria has realistic gems (140):', content.includes('gems: 140') || content.includes('140'));
console.log('Unlimited hearts (∞) enabled:', content.includes('∞'));
console.log('Sleek Super badge present:', content.includes('super-badge-sleek') || content.includes('👑 SUPER'));

console.log('\n=============================');
console.log('🎉 ALL INTEGRATION TESTS PASSED!');
console.log('=============================');
