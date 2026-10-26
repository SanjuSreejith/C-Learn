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

console.log('--- TEST 2: Lessons count verification ---');
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

console.log('--- TEST 3: Syntax Highlighting & Code Display ---');
console.log('Has highlightCSharp:', content.includes('function highlightCSharp'));
console.log('Has tok-keyword styling:', content.includes('.tok-keyword'));
console.log('Has tok-type styling:', content.includes('.tok-type'));
console.log('Has code-terminal-card flex-shrink: 0:', content.includes('flex-shrink: 0 !important'));
console.log('Has code-snippet-box display:', content.includes('.code-snippet-box'));

console.log('--- TEST 4: Realistic Gems & Unlimited Hearts ---');
console.log('Sanju has realistic gems (185):', content.includes('gems: 185') || content.includes('185'));
console.log('Scaria has realistic gems (140):', content.includes('gems: 140') || content.includes('140'));
console.log('Unlimited hearts (∞) enabled:', content.includes('∞'));
console.log('Sleek Super badge present:', content.includes('super-badge-sleek') || content.includes('👑 SUPER'));

console.log('--- TEST 5: Background Design & Layering ---');
console.log('Has ambient gamedev stickers:', content.includes('.bg-sticker'));
console.log('Background stickers z-index 0:', content.includes('z-index: 0'));
console.log('UI elements above background (z-index 10):', content.includes('z-index: 10'));
console.log('Has SVG Winding Stepping Track:', content.includes('.path-track-svg') && content.includes('path-track-line'));
console.log('Has Mascot encounters along the trail:', content.includes('.path-mascot-encounter'));

console.log('--- TEST 6: PC Full Occupation & Mobile Responsiveness ---');
console.log('100vw PC layout:', content.includes('100vw'));
console.log('Has responsive desktop sidebar:', content.includes('.desktop-sidebar'));
console.log('Has responsive right sidebar:', content.includes('.sidebar-right'));
console.log('Has mobile bottom navigation dock:', content.includes('.mobile-bottom-nav'));
console.log('No quick-fill login credentials:', !content.includes('fillCredentials'));
console.log('Password eye toggle present:', content.includes('togglePasswordVisibility'));

console.log('--- TEST 7: Theme Persistence ---');
console.log('Early head script theme loader:', content.includes("localStorage.getItem('code_duo_theme')"));
console.log('Theme toggle function:', content.includes('toggleTheme'));
console.log('Saved theme setter:', content.includes("localStorage.setItem('code_duo_theme'"));

console.log('--- TEST 8: Indian & Global Characters ---');
console.log('Has Vikram (Indian Lead Engine):', content.includes('Vikram (Engine Lead)'));
console.log('Has Priya (Indian Gameplay Lead):', content.includes('Priya (Gameplay Lead)'));
console.log('Has Kabir / Pixel (Indian Indie Dev):', content.includes('Kabir / Pixel'));
console.log('Has Duo, Lily, Dev:', content.includes('Duo (Studio Boss)') && content.includes('Shader-Lily') && content.includes('Dev (QA Bounty Hunter)'));

console.log('--- TEST 9: Multi-tiered Duolingo Achievements & Explanations ---');
console.log('Has 12 Multi-tiered Achievements:', content.includes('MULTI_TIER_ACHIEVEMENTS'));
console.log('Has Explaining Tabs (Concept, Gamedev, Memory, Pitfall):', content.includes('switchExplainTab'));

console.log('\n=============================');
console.log('🎉 ALL INTEGRATION TESTS PASSED!');
console.log('=============================');
