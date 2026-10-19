# StatPlots 修复与生成物迁移实施计划

> 按任务逐项在当前会话执行；用户已确认设计与范围。

**目标：** 修复有效 SHAP 数据的颜色溢出，并使生成资源从 Git 转移到开发、测试及发布构建流程。

**架构：** 在编译边界修正 SHAP 归一化；沿用现有 Schema 生成器和 npm/Rush 入口。发布继续使用预生成校验器。

**技术栈：** Node.js 22、TypeScript、Ajv standalone、Jest、Playwright、npm、Rush。

## 全局约束

- 不在图元 render/state 热路径重复计算范围。
- 只修改用户授权的三项修复及生成物生命周期。
- Schema 和校验器不进入 Git，但必须出现在正确的发布产物中。
- 使用 Node.js 22，不触发远程发版或修改视觉阈值。

## 任务一：SHAP 归一化

文件：`src/plots/shap-beeswarm/compile.ts`、`__tests__/unit/fourth-phase.test.ts`、`__tests__/browser/colors.spec.ts`（均位于 packages/vchart-statplots）。

- [x] 先加入有效输入回归：`[-1e308, 0, 1e308]` 的相对值为 `[0, 0.5, 1]`，填充色有效。
- [x] 执行 `npm test -- --runInBand fourth-phase.test.ts`，确认原实现失败。
- [x] 普通有限区间继续使用原公式；溢出区间使用 `(value / 2 - min / 2) / (max / 2 - min / 2)`。
- [x] 增补窄区间、缺失和常量检查；浏览器使用自定义三色调色板核对实际图元。

## 任务二：配置及生成资源入口

文件：`.github/workflows/statplots-test.yml`、`.gitignore`、`packages/vchart-statplots/package.json`、`scripts/cache-published-umd.mjs`、`README.md`、`scripts/build-schema.ts`、`.prettierignore`。

- [x] workflow 增加 `permissions: { contents: read }`，包名 URL 使用 `encodeURIComponent(name)`。
- [x] compile/test/test:browser/start/build:umd/check:examples/check:catalog 接入 `npm run build:schema && ...`；build 通过 compile 生成一次；prepack 使用 `npm run build`。
- [x] 忽略并从索引移除 `packages/vchart-statplots/schema/`、`packages/vchart-statplots/src/generated/`。
- [x] CI 保留 `check:schema`，用 `git ls-files` 检查替代生成物 diff。
- [x] 更新 README 的生成资源、开发和发布说明；生成器跳过未变化内容，以原子替换避免半写文件。

## 任务三：验收

- [x] 运行完整 StatPlots 单测、修改文件 ESLint、生成物一致性及类型编译。
- [x] 运行 SHAP、配色、图库和生命周期相关浏览器测试，并查看新增截图。
- [x] 在无生成物的检出中执行 npm test、npm run start；核对 Schema HTTP 资源。
- [x] 在无生成物及 StatPlots 构建产物的检出中执行 `npm pack`，检查 tarball 中 Schema、ESM/CJS 校验器和 UMD。
- [x] 执行 `node common/scripts/verify-release-workflows.js`、`git diff --check`，记录结果。

## 执行结果

- Node.js 22.23.3：38 个单测文件、669 项单测通过；相关 17 项浏览器回归通过。
- 新增 SHAP 宽区间单测和浏览器测试均在旧实现/旧 UMD 上按预期失败，修复后通过；检查了最终截图。
- compile、check:schema、28 份主例、122 份变体、36 份反例及 28 类目录检查通过。修改文件 ESLint 0 errors（包含现有及测试中的 any/non-null warnings）。
- 无生成物检出中，npm test 自动生成并通过 61 项 schema 测试；npm start 自动生成，图库及总/分图 Schema HTTP 资源均返回 200。
- 删除 StatPlots 的 Schema、校验器及 ESM/CJS/UMD 后执行 npm pack，prepack 正常完成构建。tarball 包含 29 份 Schema、ESM/CJS 校验器及 minified UMD；解包后的 CJS 入口能够验证并编译宽区间 SHAP。构建输出存在 tslib 的非致命警告；实际产物入口及浏览器均验证通过。
- 重复生成保持全部 31 个生成文件的时间戳不变；新的生成器在无生成物检出中也完成生成和一致性检查。两个完整编码的 npm 包名元数据请求均返回 HTTP 200。
- Git 索引中没有 Schema 或 src/generated 文件；生成物被忽略。release workflow 检查和 diff --check 通过。未执行远程发布，也未更新共享视觉基准。
