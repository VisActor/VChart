import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { digest, atomicJson, fault } from './runtime.mjs';

export const official = 'https://github.com/VisActor/VChart.git';
const buildEnv = { NODE_ENV: 'production', BUNDLE_ANALYZE: '', IGNORE_ENTRIES: 'true' };

/** 查询指定仓库，禁止改变分支、索引和远端配置。 */
export function git(root, args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).trim();
}
/** 包含未提交和未跟踪源码，不将忽略的生成产物纳入摘要。 */
export async function workingTree(root) {
  const status = git(root, ['status', '--short']);
  const patch = execFileSync('git', ['diff', 'HEAD', '--binary'], { cwd: root, maxBuffer: 64 * 1024 * 1024 });
  const files = execFileSync('git', ['ls-files', '--others', '--exclude-standard', '-z'], {
    cwd: root,
    encoding: 'utf8'
  })
    .split('\0')
    .filter(Boolean)
    .sort();
  const untracked = [];
  for (const file of files) {
    const full = path.join(root, file);
    const stat = await fs.lstat(full);
    untracked.push([file, digest(stat.isSymbolicLink() ? await fs.readlink(full) : await fs.readFile(full))]);
  }
  return {
    head: git(root, ['rev-parse', 'HEAD']),
    dirty: Boolean(status),
    status,
    digest: digest(Buffer.concat([patch, Buffer.from(JSON.stringify(untracked))]))
  };
}
/** 从固定官方地址获取并固定提交；fork 的 origin 不参与解析。 */
export async function resolveBaseline(root, sha, runtime, log) {
  await runtime.run('git', ['fetch', '--no-tags', official, sha || 'refs/heads/develop'], root, log, {
    code: 'BASELINE_FETCH_FAILED'
  });
  const resolved = git(root, ['rev-parse', 'FETCH_HEAD^{commit}']);
  if (sha && resolved !== sha.toLowerCase()) throw fault('BASELINE_FETCH_FAILED', '基线 SHA 与请求不一致');
  return resolved;
}
/** 执行既有最小构建链，仅删除已知且被忽略的 UMD 目标以排除旧文件。 */
export async function build(root, destination, runtime, log) {
  const output = 'packages/vchart/build/index.js';
  if (git(root, ['ls-files', '--', output])) throw fault('BUILD_FAILED', '构建目标被 Git 跟踪，拒绝删除');
  try {
    git(root, ['check-ignore', '--no-index', output]);
  } catch {
    throw fault('BUILD_FAILED', '构建目标不属于忽略的生成目录');
  }
  await fs.rm(path.join(root, output), { force: true });
  for (const [folder, args] of [
    ['tools/bundler', ['build']],
    ['packages/vutils-extension', ['build:es']],
    ['packages/vchart', ['build:umd', '--ignorePostTasks', '--ignoreUmdEntries', '--minify=false']]
  ])
    await runtime.run(
      process.execPath,
      [path.join(root, 'common/scripts/install-run-rushx.js'), ...args],
      path.join(root, folder),
      log,
      { code: 'BUILD_FAILED', env: buildEnv }
    );
  try {
    if (!(await fs.stat(path.join(root, output))).size) throw new Error('构建产物为空');
    await fs.copyFile(path.join(root, output), destination);
  } catch (error) {
    throw fault('BUILD_FAILED', `没有生成有效的新产物：${error.message}`, error);
  }
}
/** 验证缓存内容；损坏视为 miss，权限等真实 I/O 错误继续抛出。 */
export async function readCache(cache, key) {
  try {
    const metadata = JSON.parse(await fs.readFile(path.join(cache, 'metadata.json'), 'utf8'));
    if (metadata.key !== key) return null;
    const bundle = await fs.readFile(path.join(cache, 'bundle.js'));
    return bundle.length && digest(bundle) === metadata.digest ? bundle : null;
  } catch (error) {
    if (error.code === 'ENOENT' || error instanceof SyntaxError) return null;
    throw error;
  }
}
/** 在持有运行锁时发布完整缓存；新目录准备成功前保留旧缓存。 */
export async function publishCache(cache, key, bundle) {
  const temporary = await fs.mkdtemp(`${cache}-next-`);
  const old = `${cache}-previous`;
  try {
    await fs.writeFile(path.join(temporary, 'bundle.js'), bundle);
    await atomicJson(path.join(temporary, 'metadata.json'), { key, digest: digest(bundle) });
    await fs.rm(old, { recursive: true, force: true });
    try {
      await fs.rename(cache, old);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    try {
      await fs.rename(temporary, cache);
    } catch (error) {
      try {
        await fs.rename(old, cache);
      } catch {}
      throw error;
    }
    await fs.rm(old, { recursive: true, force: true });
  } finally {
    await fs.rm(temporary, { recursive: true, force: true });
  }
}
/** 基线缓存只取决于构建输入；报告修改不使缓存失效。 */
export async function baselineBuild(root, runDir, sha, runtime, report, timed) {
  const log = path.join(runDir, 'build.log');
  const key = digest(
    JSON.stringify({
      sha,
      lock: git(root, ['show', `${sha}:common/config/rush/pnpm-lock.yaml`]),
      node: process.version,
      platform: process.platform,
      arch: process.arch,
      recipe: digest(await fs.readFile(fileURLToPath(import.meta.url))),
      buildEnv,
      tools: git(root, ['show', `${sha}:rush.json`])
    })
  );
  const cache = path.join(root, '.vchart-visual/baseline-cache');
  const cached = await readCache(cache, key);
  if (cached) {
    await fs.writeFile(path.join(runDir, 'baseline.js'), cached);
    report.baseline.cacheHit = true;
    return;
  }
  const worktree = path.join(runDir, 'worktree');
  runtime.defer(async () => {
    // 清理不经已中断的命令调度器，仍有独立超时和错误记录。
    if (
      await fs.stat(worktree).catch(error => {
        if (error.code === 'ENOENT') return null;
        throw error;
      })
    )
      execFileSync('git', ['worktree', 'remove', '--force', worktree], { cwd: root, stdio: 'pipe', timeout: 60000 });
  });
  await runtime.run('git', ['worktree', 'add', '--detach', worktree, sha], root, log, { code: 'BUILD_FAILED' });
  await timed('baselineInstallMs', () =>
    runtime.run(process.execPath, ['common/scripts/install-run-rush.js', 'install', '--ignore-hooks'], worktree, log, {
      code: 'BUILD_FAILED',
      env: { NODE_ENV: 'development' }
    })
  );
  await timed('baselineCompileMs', () => build(worktree, path.join(runDir, 'baseline.js'), runtime, log));
  await publishCache(cache, key, await fs.readFile(path.join(runDir, 'baseline.js')));
}
