// server.js
// Lightweight local companion server for Code_Duo with automated Git Sync & Push
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API endpoint: /api/git-sync
  if (req.url === '/api/git-sync' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const username = payload.username || 'User';
        const section = payload.section || payload.unit || '1';
        const lesson = payload.lesson || '';
        const xp = payload.xp || 0;
        const streak = payload.streak || 0;
        const isSectionComplete = payload.isSectionComplete || false;

        const progressFile = path.join(ROOT_DIR, 'user_progress.json');
        const accountsFile = path.join(ROOT_DIR, 'accounts.json');
        const timestamp = new Date().toISOString();

        const progressData = {
          lastSync: timestamp,
          username,
          lastCompletedSection: section,
          lastCompletedLesson: lesson,
          isSectionComplete,
          xp,
          streak,
          state: payload.state || {}
        };

        fs.writeFileSync(progressFile, JSON.stringify(progressData, null, 2), 'utf8');

        // Update accounts.json if state provided
        if (payload.state && fs.existsSync(accountsFile)) {
          try {
            const accounts = JSON.parse(fs.readFileSync(accountsFile, 'utf8'));
            if (accounts[username]) {
              accounts[username].state = payload.state;
              fs.writeFileSync(accountsFile, JSON.stringify(accounts, null, 2), 'utf8');
            }
          } catch (e) {
            console.error('Failed to update accounts.json:', e.message);
          }
        }

        // Execute Git Commit and Push
        const commitMsg = isSectionComplete
          ? `Auto-Save: Completed Section Unit ${section} by ${username} [XP: ${xp}, Streak: ${streak}]`
          : `Auto-Save: Lesson ${lesson} by ${username} [XP: ${xp}, Streak: ${streak}]`;

        execSync('git add user_progress.json accounts.json', { cwd: ROOT_DIR });
        
        let gitOutput = '';
        try {
          gitOutput = execSync(`git commit -m "${commitMsg}"`, { cwd: ROOT_DIR }).toString();
        } catch (commitErr) {
          gitOutput = commitErr.stdout ? commitErr.stdout.toString() : 'No changes to commit';
        }

        let pushOutput = '';
        let pushed = false;
        try {
          pushOutput = execSync('git push origin main', { cwd: ROOT_DIR }).toString();
          pushed = true;
        } catch (pushErr) {
          pushOutput = pushErr.stderr ? pushErr.stderr.toString() : pushErr.message;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          ok: true,
          pushed,
          message: 'Saved and synced to GitHub successfully!',
          commitMsg,
          pushOutput,
          timestamp
        }));
        console.log(`[GitHub Auto-Save] ${commitMsg} at ${timestamp}`);
      } catch (err) {
        console.error('[GitHub Auto-Save Error]', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: err.message }));
      }
    });
    return;
  }

  // API endpoint: /api/git-status
  if (req.url === '/api/git-status' && req.method === 'GET') {
    try {
      const branch = execSync('git branch --show-current', { cwd: ROOT_DIR }).toString().trim();
      const lastCommit = execSync('git log -1 --pretty=format:"%h - %s (%cd)" --date=relative', { cwd: ROOT_DIR }).toString().trim();
      const remote = execSync('git remote get-url origin', { cwd: ROOT_DIR }).toString().trim();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, branch, lastCommit, remote }));
    } catch (e) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: e.message }));
    }
    return;
  }

  // Static file serving
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  const filePath = path.join(ROOT_DIR, decodeURIComponent(reqPath));

  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Internal Server Error');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Code_Duo Server running at: http://localhost:${PORT}`);
  console.log(`🐙 GitHub Auto-Sync: Active for https://github.com/SanjuSreejith/C-Learn.git`);
  console.log(`===============================================`);
});
