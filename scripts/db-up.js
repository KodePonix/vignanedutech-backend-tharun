// Starts the local Postgres container before `npm run dev`.
// If Docker Desktop isn't running (Windows/macOS), it launches it and waits.
const { execSync, spawn } = require('child_process');
const fs = require('fs');

const dockerReady = () => {
  try { execSync('docker info', { stdio: 'ignore' }); return true; } catch { return false; }
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  if (!dockerReady()) {
    const paths = {
      win32: 'C:\Program Files\Docker\Docker\Docker Desktop.exe',
      darwin: '/Applications/Docker.app',
    };
    const app = paths[process.platform];
    if (app && fs.existsSync(app)) {
      console.log('[db] Docker is not running - starting Docker Desktop...');
      if (process.platform === 'darwin') spawn('open', ['-a', 'Docker'], { detached: true, stdio: 'ignore' }).unref();
      else spawn(app, [], { detached: true, stdio: 'ignore' }).unref();
      for (let i = 0; i < 90 && !dockerReady(); i++) await sleep(2000);
    }
    if (!dockerReady()) {
      console.error('[db] Docker engine is not available. Start Docker Desktop and run `npm run dev` again.');
      process.exit(1);
    }
  }
  console.log('[db] Starting Postgres container...');
  execSync('docker compose up -d --wait db', { stdio: 'inherit' });
  console.log('[db] Postgres is ready on localhost:5432');
}

main().catch((err) => { console.error(err.message); process.exit(1); });
