#!/usr/bin/env node
/**
 * test-storybook をローカルで 1 コマンド実行する (CI の serve→wait-on→test を再現)。
 *
 *   npm run build-storybook      # 先に storybook-static を生成しておくこと
 *   npm run test-storybook:local        # 全 story
 *   npm run test-storybook:local -- Button   # story 絞り込み (内側ループ用、§4-1)
 *
 * storybook-static を http-server で serve → wait-on で起動待ち → test-storybook 実行 →
 * 終了時 (成功/失敗どちらでも) に serve を確実に kill する。新規 dep は足さない (既存 wait-on を使用)。
 */
import { spawn } from 'node:child_process';

const PORT = 6006;
const URL = `http://127.0.0.1:${PORT}`;

const server = spawn('npx', ['http-server', 'storybook-static', '--port', String(PORT), '--silent'], {
  stdio: 'ignore',
  detached: true, // プロセスグループごと kill するため
});

const cleanup = () => {
  try { process.kill(-server.pid, 'SIGTERM'); }
  catch { try { server.kill('SIGTERM'); } catch { /* already gone */ } }
};
process.on('SIGINT', () => { cleanup(); process.exit(130); });
process.on('SIGTERM', () => { cleanup(); process.exit(143); });

const run = (cmd, args) =>
  new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit' });
    p.on('exit', (code) => (code === 0 ? resolve() : reject(code ?? 1)));
    p.on('error', reject);
  });

let code = 1;
try {
  await run('npx', ['wait-on', `tcp:127.0.0.1:${PORT}`, '-t', '60000']);
  // process.argv.slice(2) を渡して story 絞り込み等を pass-through する
  await run('npx', ['test-storybook', '--url', URL, ...process.argv.slice(2)]);
  code = 0;
} catch (e) {
  code = typeof e === 'number' ? e : 1;
} finally {
  cleanup();
}
process.exit(code);
