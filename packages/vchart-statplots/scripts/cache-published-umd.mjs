// Test-only cache of verified npm release bytes, never a workspace-build substitute.
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { version, verifyTarball } from './sync-visualization-skill.mjs';
const root = fileURLToPath(new URL('../../../.vchart-statplots/dsv/published/', import.meta.url));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
async function response(url) {
  const value = await fetch(url, { signal: AbortSignal.timeout(60000) });
  if (!value.ok) throw new Error(`${url}: HTTP ${value.status}`);
  return value;
}
export async function preparePublished() {
  try {
    const cached = JSON.parse(await readFile(join(root, 'manifest.json'), 'utf8'));
    if (cached.version !== version) throw new Error('Cached version mismatch');
    for (const item of Object.values(cached.files)) {
      if (hash(await readFile(item.path)) !== item.sha256) throw new Error('Cached UMD mismatch');
    }
    return cached;
  } catch (error) { if (!['ENOENT'].includes(error.code) && !/Cached/.test(error.message)) throw error; }
  await mkdir(root, { recursive: true });
  const temp = await mkdtemp(join(tmpdir(), 'dsv-umd-'));
  const manifest = { version, files: {} };
  try {
    for (const [key, name] of [['vchart', '@visactor/vchart'], ['statplots', '@visactor/vchart-statplots']]) {
      const metadata = await (await response(`https://registry.npmjs.org/${encodeURIComponent(name)}/${version}`)).json();
      const tarball = Buffer.from(await (await response(metadata.dist.tarball)).arrayBuffer());
      verifyTarball(tarball, metadata.dist.integrity);
      const archive = join(temp, `${key}.tgz`); await writeFile(archive, tarball);
      const bytes = execFileSync('tar', ['-xOf', archive, 'package/build/index.min.js'], { maxBuffer: 64 * 1024 * 1024 });
      const path = join(root, `${key}.js`); await writeFile(path, bytes);
      manifest.files[key] = { package: name, path, tarball: metadata.dist.tarball, integrity: metadata.dist.integrity,
        sha256: hash(bytes), url: `https://unpkg.com/${name}@${version}/build/index.min.js` };
    }
    await writeFile(join(root, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
    return manifest;
  } finally { await rm(temp, { recursive: true, force: true }); }
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const result = await preparePublished();
  console.log(JSON.stringify(result, null, 2));
}
