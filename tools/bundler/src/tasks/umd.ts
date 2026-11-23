import { rollup } from 'rollup';
import terser from '@rollup/plugin-terser';
import { build } from 'esbuild';
import * as path from 'path';
import type { OutputOptions } from 'rollup';
import type { RawPackageJson } from '../logic/package';
import type { Config } from '../logic/config';
import { getBabelPlugins } from '../logic/babel.config';
import { getExternal, getRollupOptions } from '../logic/rollup.config';

// 完整构建复用本轮编译的 ESM；独立构建仍使用源码入口。
function resolveEntry(config: Config, root: string, fromEs: boolean) {
  const input = typeof config.input === 'string' ? config.input : config.input.umd!;
  return fromEs
    ? path.resolve(root, config.outputDir.es!, input.replace(/\.[tj]sx?$/, '.js'))
    : path.resolve(root, config.sourceDir, input);
}

// esbuild 合并浏览器依赖，Rollup 保留原来的 UMD 加载接口。
async function bundleBrowser(config: Config, projectRoot: string, pkg: RawPackageJson, input: string) {
  const external = getExternal(pkg, config.external);
  const { outputFiles } = await build({
    absWorkingDir: projectRoot,
    entryPoints: [input],
    bundle: true,
    format: 'esm',
    platform: 'browser',
    mainFields: ['browser', 'module', 'main'],
    target: 'es2018',
    tsconfig: path.resolve(__dirname, '../../tsconfig.browser.json'),
    define: config.envs,
    external,
    write: false
  });
  return rollup({
    input,
    external: id => external.some(name => id === name || id.startsWith(`${name}/`)),
    plugins: [{ name: 'browser-entry', load: id => (id === input ? outputFiles[0]!.text : null) }]
  });
}

// Rollup 只建一次依赖图，压缩器只挂载到 .min.js 输出。
export async function buildUmd(
  config: Config,
  projectRoot: string,
  rawPackageJson: RawPackageJson,
  outputs: boolean[],
  fromEs = false
) {
  await buildOutputs(config, projectRoot, rawPackageJson, 'umd', outputs, fromEs);
}

// 额外的 ESM 入口共享同一套文件名和压缩规则。
export async function buildES(
  config: Config,
  projectRoot: string,
  rawPackageJson: RawPackageJson,
  minify: boolean,
  fromEs = false
) {
  await buildOutputs(config, projectRoot, rawPackageJson, 'es', [minify], fromEs);
}

// 按原发布约定写入每个格式，并在写入失败时释放 Rollup 资源。
async function buildOutputs(
  config: Config,
  projectRoot: string,
  pkg: RawPackageJson,
  format: 'umd' | 'es',
  outputs: boolean[],
  fromEs: boolean
) {
  const input = resolveEntry(config, projectRoot, fromEs);
  const packageName = pkg.name.replace('@', '').replace('/', '_');
  const filename = config.umdOutputFilename || packageName;
  const dest = path.resolve(projectRoot, config.outputDir.umd!);
  const output: OutputOptions = {
    format,
    name: config.name || packageName,
    exports: 'named',
    globals: { react: 'React', ...config.globals }
  };
  const bundle =
    format === 'umd' && config.browserUmd
      ? await bundleBrowser(config, projectRoot, pkg, input)
      : await rollup(
          getRollupOptions(
            projectRoot,
            input,
            pkg,
            getBabelPlugins(pkg.name, { envOptions: { targets: config.targets } }),
            config,
            fromEs
          )
        );
  try {
    for (const minify of outputs) {
      await bundle.write({
        ...output,
        file: path.join(dest, `${filename}${format === 'es' ? '.es' : ''}${minify ? '.min' : ''}.js`),
        plugins: minify ? [terser(format === 'umd' && config.umdCompress === false ? { compress: false } : {})] : []
      });
    }
  } finally {
    await bundle.close();
  }
}
