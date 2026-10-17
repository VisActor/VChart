import fs from 'node:fs/promises';
import path from 'node:path';
import { build as buildCore } from '../../../vchart/scripts/visual/build.mjs';

const buildEnv = { NODE_ENV: 'production', BUNDLE_ANALYZE: '', IGNORE_ENTRIES: 'true' };

export async function build(root, destination, runtime, log, coreBundle) {
  // CI 可复用本轮已冻结的同侧核心资源，避免扩展导出重复编译核心。
  if (coreBundle) await fs.copyFile(coreBundle, destination);
  else await buildCore(root, destination, runtime, log);
  // 使用同一侧源码构建时序扩展；VChart 保持外部依赖，共享 Factory 和主题注册表。
  // 基线迁移前由 sequenceAnalysis 注册核心系列，迁移后注册扩展系列。
  const extensionDirectory = path.join(path.dirname(destination), `${path.basename(destination, '.js')}-extension`);
  await fs.mkdir(extensionDirectory, { recursive: true });
  // 主包 UMD 不生成声明文件，扩展编译直接读取同一侧主包源码的类型，避免使用陈旧 esm。
  const extensionTsconfig = path.join(extensionDirectory, 'tsconfig.json');
  const coreTsconfig = JSON.parse(await fs.readFile(path.join(root, 'packages/vchart/tsconfig.json'), 'utf8'));
  const paths = Object.fromEntries(
    Object.entries(coreTsconfig.compilerOptions.paths ?? {}).map(([key, values]) => [
      key,
      values.map(value => path.resolve(root, 'packages/vchart', value))
    ])
  );
  paths['@visactor/vchart'] = [path.join(root, 'packages/vchart/src/index.ts')];
  await fs.writeFile(
    extensionTsconfig,
    JSON.stringify({
      extends: path.join(root, 'packages/vchart-extension/tsconfig.json'),
      compilerOptions: { rootDir: path.join(root, 'packages'), paths },
      include: [path.join(root, 'packages/vchart-extension/src/charts/sequence-analysis/sequence-analysis.ts')],
      references: []
    })
  );
  const extensionConfig = path.join(extensionDirectory, 'bundler.config.cjs');
  await fs.writeFile(
    extensionConfig,
    `module.exports = ${JSON.stringify({
      name: 'VChartExtension',
      tsconfig: extensionTsconfig,
      input: { umd: 'charts/sequence-analysis/sequence-analysis.ts' },
      outputDir: { umd: path.join(extensionDirectory, 'build') },
      umdOutputFilename: 'index',
      noEmitOnError: false,
      external: ['@visactor/vchart'],
      globals: { '@visactor/vchart': 'VChart' },
      envs: { __DEV__: 'false' }
    })};`
  );
  await runtime.run(
    process.execPath,
    [
      path.join(root, 'common/scripts/install-run-rushx.js'),
      'build:umd',
      '--config',
      extensionConfig,
      '--minify=false'
    ],
    path.join(root, 'packages/vchart-extension'),
    log,
    { code: 'BUILD_FAILED', env: buildEnv }
  );
  await fs.appendFile(
    destination,
    Buffer.concat([Buffer.from('\n;\n'), await fs.readFile(path.join(extensionDirectory, 'build/index.js'))])
  );
}
