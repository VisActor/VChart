# @internal/bundler

> 基于 [gulp](https://gulpjs.com/) + [rollup](https://rollupjs.org/introduction/) 封装的专门针对前端库的打包工具，支持 typescript、react、 less 和资源拷贝等能力

# 使用

```
bundle [options] <entry>

# eg.
bundle -f es -w dev --env __DEV__=true --env __ID__="'my_id'"
```

# 命令行参数说明

```
-r, --root <path> 项目根目录(绝对或相对路径) eg. --root /path/to/project
-c, --config <filename> 指定配置文件，默认 <PROJECT_ROOT>/bundler.config.js, eg. --config ./bundler.config.js
--tsconfig <path> tsconfig.json 路径 eg. --tsconfig ./tsconfig.json
-i, --input <filename> 入口文件, 默认 <PROJECT_ROOT>/src/index.ts, eg. --config ./src/index.ts
-f, --formats <format> 指定产物模块类型(umd,es,cjs), eg. -f es -f cjs
-n, --name <name>  UMD 产物中的全局变量名称, 默认取 package name eg. --name MyGlobalName
--copy <ext> 需要拷贝的静态资源文件后缀(umd产物无效), eg. --copy png --copy svg
--less 开启 less 编译支持
-e, --envs <key=value> 要替换的环境变量, eg. --env __DEV__=true --env __ID__="'my_id'"
--clean 删除产物目录
--minify 是否输出压缩后的 UMD 产物文件
--no-es-total-file 只生成逐模块 ESM，跳过全量 ESM 文件
--browserUmd 浏览器测试用 UMD，使用 esbuild 解析浏览器依赖
-w, --watch 监听文件变化重新构建
-s, --sourcemap 是否生成 sourcemap
--ignorePostTasks, 不执行 postTasks
--ignoreUmdEntries，不执行额外的umd
```

# 配置文件

> 来自命令行参数的字段相比配置文件的相同字段优先级更高, 即可以用命令行参数覆盖配置文件中出现的字段

默认 `<PROJECT_ROOT>/bundler.config.js` 会被 _bundle_ 读取，配置文件需要导出一个配置对象:

```javascript
module.exports = {
  input: {
    es: 'index.es.ts',
    cjs: 'index.cjs.ts',
    umd: 'index.umd.ts'
  },
  formats: ['es', 'cjs', 'umd'],
  outputDir: {
    es: 'es',
    cjs: 'cjs',
    umd: 'dist'
  },
  name: 'MyGlobalName'
  // ...其他配置项
};
```

配置对象类型如下：

```typescript
interface Config {
  // 项目根路径(相对或绝对路径)
  root: string;
  // 项目源码所在目录(相对路径)
  sourceDir: string;
  // tsconfig.json 所在相对路径
  tsconfig: string;
  // 入口文件相对路径
  input: string | Partial<Record<_ModuleKind, string>>;
  // 输出产物类型
  formats: _ModuleKind[];
  // 输出产物类型相对路径
  outputDir: Partial<Record<_ModuleKind, string>>;
  // UMD 产物中的全局变量名称, 默认取 package name
  name: string;
  // UMD 产物中的文件名称, 默认取 package name
  umdOutputFilename: string;
  // 是否开启sourcemap
  sourcemap: boolean;
  // 开启监听源码模式
  watch: boolean;
  // 要拷贝的静态资源扩展名
  copy: string[];
  // 是否开启  less 编译支持
  less: boolean;
  // 环境变量, 默认会注入版本号`__VERSION__`
  envs: Record<string, string>;
  // 构建开始前，是否清空构建产物目录
  clean: boolean;
  // 是否压缩 umd 产物文件
  minify: boolean;
  // 跳过主 UMD 的 Terser compress 阶段，仍缩短变量名并移除空白。
  umdCompress?: boolean;
  // 本轮同时构建 ESM 时，复用编译产物打包；单独构建 UMD 时仍读取源码。
  bundleFromEs?: boolean;
  // Playwright 和 Photo 用的浏览器 UMD。发布构建沿用 Rollup 的解析与转换。
  browserUmd?: boolean;
  // 出现编译错误时是否输出产物文件, 如果为true，则会停止构建且不输出任何东西
  noEmitOnError: boolean;
  // 传给给 @babel/preset-env 的 `targets` 字段 see: https://babeljs.io/docs/babel-preset-env#targets
  targets: string | string[] | Record<string, string>;
  // 构建 UMD 产物时，需要排除的模块名称
  external: string[] | ((rawPackageJson: RawPackageJson) => string[]);
  // 构建 UMD 产物时，传递给 @rollup/plugin-alias 作为 entries 的选项
  alias: Array<{ find: string | RegExp; replacement: string; customResolver?: ResolverFunction | ResolverObject }>;
  // 额外的 rollup 配置项
  rollupOptions: Omit<RollupOptions, 'output'>;
  // 构建前执行的任务列表
  preTasks: Record<string, (config: Config, projectRoot: string, rawPackageJson: RawPackageJson) => Promise<unknown>>;
  // 构建后执行的任务列表
  postTasks: Record<string, (config: Config, projectRoot: string, rawPackageJson: RawPackageJson) => Promise<unknown>>;
}
type _ModuleKind = 'es' | 'cjs' | 'umd';
```

# 测试

```shell
rushx dev --root fixtures/config [options]
rushx test
```

## 构建性能验证（2026-11-21）

基线为 `15d701eee`。在同一台 Apple M3 Pro 上使用 Node.js 22.22.2、Rush 5.148.0、pnpm 10.7.0 和同一套第三方依赖。发布冷构建计入各 Rush 构建命令的墙钟时间，依赖安装、发布和 tarball 校验单独执行。

| 构建流程 | 优化前 | 优化后 | 节省 |
| --- | ---: | ---: | ---: |
| 完整发布构建 | 433.08 秒 | 274.54 秒 | 158.54 秒（36.6%） |
| 单测前置构建 | 11.97 秒 | 0 秒 | 11.97 秒 |
| Playwright VChart | 23.09 秒 | 6.76 秒 | 16.33 秒（70.7%） |
| Playwright VChart + 扩展 | 26.77 秒 | 6.74 秒 | 20.03 秒（74.8%） |
| StatPlots 浏览器测试前置构建 | 240.24 秒 | 37.68 秒 | 202.56 秒（84.3%） |
| Photo 聚合包 | 48.16 秒 | 19.28 秒 | 28.88 秒（60.0%） |

发布基线为原工作流八道构建步骤耗时之和。优化后先按原依赖链构建 VChart（194.35 秒），再以并发度 2 构建适配包和扩展（80.17 秒）。VChart 在第一阶段写入 Lark 和微信小程序入口。StatPlots 的基线使用同一轮发布中对应依赖链与 StatPlots 的两条命令之和，包含两次 Rush 启动。测试流水线的表格时间截至构建完成，浏览器比较和远端 Photo 任务独立计时。

对比了 11 个 `npm pack` tarball 的 9,704 个文件。路径、权限、类型声明、source map 和包清单一致。最终冷构建的 12 个主要发布入口与已验收包逐字节一致。核对了 VChart、扩展、React 和 StatPlots 普通及压缩 UMD 的 CommonJS 和 AMD 导出，以及 VChart 全量 ESM 的 Factory 外部引用。ES5 与基线逐字节一致，小程序与鸿蒙入口通过 JavaScript 语法检查。

| 压缩 UMD | 优化前 gzip | 优化后 gzip |
| --- | ---: | ---: |
| VChart | 637,854 B | 642,298 B |
| VChart Extension | 216,277 B | 218,154 B |
| React VChart | 647,635 B | 652,743 B |
| StatPlots | 69,357 B | 70,457 B |

gzip 使用级别 6。VChart 压缩 UMD 为 2,459,060 B，低于 3 MB 门槛。Photo 测试包 gzip 从 1,030,348 B 降到 999,277 B。

VChart 625 项单测、StatPlots 672 项单测和 518 项浏览器测试、Bundler 9 项测试通过。StatPlots 最终构建保留示例与目录检查需要的 CJS，Schema、示例、目录检查及 UMD/ESM 入口复验均通过。VChart 与扩展的全量视觉比较共 273 项通过，Photo 聚合包 13 项本地抽测和发布压缩 UMD 10 项抽测通过。`injected-stage` 在全量视觉和发布抽测中都只出现一列 530 个像素的轻微色值变化，单通道最大差值为 5/255，两轮均通过项目原有阈值。GitHub runner 与远端 Photo 的耗时需以实际 CI 记录为准。
