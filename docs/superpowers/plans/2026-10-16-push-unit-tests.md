# Push 单测修复实施计划

**目标：** 修复 dot 迁移后遗漏的核心测试，使 statplots 单测独立于工作区包的构建产物。

**设计：** dot 属于扩展包，四条更新回归测试迁到扩展包并使用 `IDotSeriesSpec`，保留真实图元和数据阶段断言。statplots 复用核心 Jest 的工作区源码映射、D3/VRender 映射及全局初始化，TypeScript 同步解析工作区源码。

**约束：** 使用 Node.js 22；不修改生产渲染逻辑；不关闭类型检查，不跳过用例，不增加构建前置步骤。

## 实施

- [x] 从 `packages/vchart/__tests__/unit/core/update-effects.test.ts` 移出 dot spec、专用图元辅助函数及四条测试。
- [x] 在 `packages/vchart-extension/__tests__/unit/series/dot-update-effects.test.ts` 显式注册 dot，使用扩展 spec 类型，保留更新前后图元属性、reInit 次数和数据阶段未运行的断言。
- [x] 修改 `packages/vchart-statplots/jest.config.js` 与 `tsconfig.test.json`，让工作区依赖及其类型解析指向源码，保留 Node 测试环境。
- [x] 运行迁移测试、核心更新测试与 statplots 全部单测；临时隐藏 VChart/VUtils Extension 构建目录验证无构建依赖，结束后恢复。
- [x] 执行 push 使用的 `node common/scripts/install-run-rush.js test --only tag:package`，检查格式和最终 diff。

本次只改测试归属及测试配置，不影响生产渲染、布局或交互，不新增视觉用例。

## 验证记录

- Node.js 22.23.3：核心 update-effects 的 104 条测试通过；迁移的 dot 四条测试通过。
- statplots：39 套、672 条单测通过。
- 在 VChart、VUtils Extension、statplots 的现存 cjs / esm / es / build / dist 目录临时移走后，push 原命令退出码为 0，所有目录已在 finally 中恢复。
- statplots 严格类型检查只诊断本包；相邻包使用各自 tsconfig 由各自单测检查。临时注入 `number = null` 的反例触发 TS2322，诊断文件已清理。
- 源码接入暴露内置主题读取的可空返回类型，补齐非空断言，运行时代码不变。
- 修改文件 Prettier、JavaScript 语法检查及 git diff --check 通过；定向 ESLint 无错误，主题读取有非空断言警告。
