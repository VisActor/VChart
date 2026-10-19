# StatPlots CodeQL 修复实施计划

> 用户已确认评审方案；在当前会话逐项执行及验收。

**目标：** 收敛测试 URL 子串匹配和画廊链接告警，保留真实安全回归。

**架构：** 测试 fixture 精确匹配两个完整请求 URL；画廊通过标准 URL 编码构造路径，继续由已有校验器拒绝非法类型。

**技术栈：** Node.js 22、node:test、Playwright Chromium、浏览器 DOM API。

## 全局约束

- 沿用标准 API，不新增依赖或 VChart 热路径判断。
- 不关闭安全扫描，不把本地结果表述为远端告警已修复。
- 本次不重复修改已修复的 workflow 权限与包名编码。

## 任务一：资源同步测试 fixture

文件：`packages/vchart-statplots/__tests__/runtime/skill-resources.test.cjs`。

- [x] 新增 `packageFetch(version, bytes, integrity)`：完整匹配 npm 元数据 URL 和固定 tarball URL，返回对应 Response；未知请求抛错。
- [x] 两处同步失败测试使用该 fixture，版本取同步器导出的 `version`。
- [x] 补充正例及伪造域名、路径、查询参数、错误版本、错误协议负例。
- [x] 执行 `node --test __tests__/runtime/skill-resources.test.cjs`，核对旧快照和 controller 保留断言。

## 任务二：画廊链接与真实输入回归

文件：`packages/vchart-statplots/examples/gallery.js`、`packages/vchart-statplots/__tests__/browser/gallery.spec.ts`。

- [x] 链接改为 `/schema/plots/${encodeURIComponent(spec.type)}.schema.json`。
- [x] 浏览器测试提交三类恶意 type，断言 `/type` 校验错误、原 schema 链接不变、无脚本执行、图表保留。
- [x] 验证正常 schema 链接仍同源且可加载。
- [x] 执行 `npm run test:browser -- gallery.spec.ts colors.spec.ts`。

## 任务三：交付

- [x] 在 `.github/workflows/statplots-test.yml` 中接入 runtime 测试，不修改权限。
- [x] 格式化变更、运行相关 lint 和 `git diff --check`，审阅最终 diff。
- [x] 保存本地提交，核对工作区状态并记录验证结果；报告远端 CodeQL 尚待复扫。

## 验证记录

- Node.js 22.23.3。
- runtime 9 项通过；从仓库根目录执行 CI 的相同命令也通过。
- 反例检查：在临时测试文件中恢复域名子串匹配，新 URL 回归失败（Missing expected rejection），其余 8 项通过；临时文件已删除。
- 画廊和颜色浏览器回归 16 项通过，包括全部 28 种类型切换、正常 schema 加载及三类注入输入被拒绝。
- JavaScript / CJS 语法检查、`git diff --check` 通过；相关 TypeScript ESLint 0 错误，4 项为原有非空断言和空函数警告。
- 人工查看窄屏画廊截图，布局正常。本次未改 VChart 核心，未运行核心全量视觉测试。
- 本地未安装 CodeQL CLI；本次未推送，GitHub 告警状态需等待远端复扫确认。
