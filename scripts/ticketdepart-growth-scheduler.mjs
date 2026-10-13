#!/usr/bin/env node
/**
 * TicketDepart scheduled growth monitor.
 * Long-running scheduler for legitimate SEO/site-health audits, not traffic inflation.
 */
import { spawn } from 'node:child_process';
import { appendFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const auditScript = path.join(here, 'ticketdepart-growth-workers.mjs');
const dataDir = path.resolve(process.env.TD_DATA_DIR || './td-growth-data');
const intervalMinutes = Math.max(15, Math.min(1440, Number(process.env.TD_INTERVAL_MINUTES || 60)));
const site = process.env.TD_SITE_URL || 'https://ticketdepart.com';
const logPath = path.join(dataDir, 'worker.log');
const stopPath = path.join(dataDir, 'STOP');
const statePath = path.join(dataDir, 'state.json');

await mkdir(dataDir, { recursive: true });
const log = async message => {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  process.stdout.write(line);
  await appendFile(logPath, line);
};
const writeState = async state => {
  await import('node:fs/promises').then(fs => fs.writeFile(statePath, JSON.stringify({
    ...state, pid: process.pid, site, intervalMinutes, updatedAt: new Date().toISOString()
  }, null, 2)));
};

if (existsSync(stopPath)) {
  const fs = await import('node:fs/promises');
  await fs.unlink(stopPath).catch(() => {});
}
await writeState({ status: 'running', lastRunAt: null, lastExitCode: null });
await log(`Scheduler started for ${site}; interval=${intervalMinutes}m. Audits are not customer traffic.`);

let stopping = false;
let activeChild;
const stop = async signal => {
  if (stopping) return;
  stopping = true;
  await log(`Stop requested (${signal}).`);
  if (activeChild) activeChild.kill('SIGTERM');
};
process.on('SIGTERM', () => { void stop('SIGTERM'); });
process.on('SIGINT', () => { void stop('SIGINT'); });

while (!stopping) {
  if (existsSync(stopPath)) {
    const fs = await import('node:fs/promises');
    await fs.unlink(stopPath).catch(() => {});
    await stop('STOP file');
    break;
  }
  const started = new Date().toISOString();
  await writeState({ status: 'running', lastRunAt: started, lastExitCode: null });
  await log('Starting SEO/site-health audit.');
  activeChild = spawn(process.execPath, [auditScript, site], {
    cwd: dataDir,
    env: { ...process.env, MAX_URLS: process.env.MAX_URLS || '100', CONCURRENCY: process.env.CONCURRENCY || '2', DELAY_MS: process.env.DELAY_MS || '1500' },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  activeChild.stdout.on('data', chunk => { void appendFile(logPath, chunk); process.stdout.write(chunk); });
  activeChild.stderr.on('data', chunk => { void appendFile(logPath, chunk); process.stderr.write(chunk); });
  const code = await new Promise(resolve => activeChild.once('close', resolve));
  activeChild = undefined;
  await log(`Audit finished with exit code ${code}.`);
  await writeState({ status: stopping ? 'stopping' : 'running', lastRunAt: started, lastExitCode: code });
  if (stopping) break;
  const waitMs = intervalMinutes * 60 * 1000;
  const end = Date.now() + waitMs;
  while (!stopping && Date.now() < end) {
    if (existsSync(stopPath)) {
      const fs = await import('node:fs/promises');
      await fs.unlink(stopPath).catch(() => {});
      await stop('STOP file');
      break;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}
await writeState({ status: 'stopped', lastRunAt: null, lastExitCode: null });
await log('Scheduler stopped.');
