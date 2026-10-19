const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '../..');
const vchart = require('../../packages/vchart/package.json');
const statplots = require('../../packages/vchart-statplots/package.json');

test('发布 VChart 后，后续 workspace 包的 prepack 仍能编译依赖类型', t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'vchart-release-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const vchartDir = path.join(directory, 'vchart');
  const statplotsDir = path.join(directory, 'statplots');

  function write(file, content) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, typeof content === 'string' ? content : JSON.stringify(content));
  }

  function npm(cwd, args) {
    const result = spawnSync('npm', [...args, '--ignore-scripts=false'], {
      cwd,
      encoding: 'utf8',
      timeout: 60000,
      env: {
        ...process.env,
        npm_config_cache: path.join(directory, 'npm-cache'),
        npm_config_userconfig: path.join(directory, '.npmrc'),
        npm_config_registry: 'http://127.0.0.1:9',
        npm_config_fetch_retries: '0',
        npm_config_audit: 'false',
        npm_config_update_notifier: 'false'
      }
    });
    assert.ifError(result.error);
    assert.equal(result.status, 0, `${args.join(' ')}\n${result.stdout}\n${result.stderr}`);
    return result;
  }

  // 使用真实入口及生命周期钩子，仅用最小产物和编译替身隔离 workspace 依赖解析。
  write(path.join(vchartDir, 'package.json'), {
    name: vchart.name,
    version: vchart.version,
    main: vchart.main,
    module: vchart.module,
    types: vchart.types,
    files: vchart.files,
    scripts: {
      clear: vchart.scripts.clear,
      ...(vchart.scripts.postpublish ? { postpublish: vchart.scripts.postpublish } : {})
    }
  });
  write(path.join(vchartDir, vchart.main), 'exports.releaseProbe = 1;\n');
  write(path.join(vchartDir, vchart.module), 'export const releaseProbe = 1;\n');
  write(path.join(vchartDir, vchart.types), 'export declare const releaseProbe: number;\n');
  write(path.join(vchartDir, 'build/index.js'), 'var releaseProbe = 1;\n');
  fs.symlinkSync(path.join(root, 'packages/vchart/node_modules'), path.join(vchartDir, 'node_modules'), 'dir');

  write(path.join(statplotsDir, 'package.json'), {
    name: statplots.name,
    version: statplots.version,
    files: ['src'],
    scripts: { prepack: statplots.scripts.prepack, build: 'tsc --noEmit' }
  });
  write(path.join(statplotsDir, 'tsconfig.json'), {
    compilerOptions: { strict: true, types: [], moduleResolution: 'node', skipLibCheck: true },
    include: ['src']
  });
  write(path.join(statplotsDir, 'src/index.ts'),
    "import { releaseProbe } from '@visactor/vchart';\nexport const value: number = releaseProbe;\n");
  fs.mkdirSync(path.join(statplotsDir, 'node_modules/@visactor'), { recursive: true });
  fs.symlinkSync(vchartDir, path.join(statplotsDir, 'node_modules/@visactor/vchart'), 'dir');
  fs.symlinkSync(path.join(root, 'packages/vchart-statplots/node_modules/.bin'),
    path.join(statplotsDir, 'node_modules/.bin'), 'dir');
  fs.symlinkSync(path.join(root, 'packages/vchart-statplots/node_modules/typescript'),
    path.join(statplotsDir, 'node_modules/typescript'), 'dir');

  // 先证明同一份构建和依赖在发布前可用，再运行会触发 postpublish 的真实 dry-run。
  npm(statplotsDir, ['run', 'build']);
  npm(vchartDir, ['publish', '--dry-run', '--access', 'public']);
  const packed = npm(statplotsDir, ['pack', '--foreground-scripts']);
  assert.match(packed.stdout, /> tsc --noEmit\r?\n/, 'prepack 必须实际调用构建并编译类型');

  for (const entry of [vchart.main, vchart.module, vchart.types, 'build/index.js']) {
    assert.ok(fs.existsSync(path.join(vchartDir, entry)), `发布后必须保留 ${entry}`);
  }
  assert.ok(fs.existsSync(path.join(statplotsDir, `visactor-vchart-statplots-${statplots.version}.tgz`)));
});
