# 扩展包测试

扩展模块的单元测试、浏览器示例和视觉用例均在本包维护。主包测试不加载扩展包；本包通过 `@visactor/vchart` 及其声明的子路径引用主包。

## 单元测试

在本包目录执行 `npm test -- --runInBand`。测试复用主包的 Electron / ts-jest 配置及源码映射，依赖方向为扩展包到主包。

## 视觉回归

在仓库根目录执行 `node packages/vchart-extension/scripts/visual-test.mjs`；支持 `--list`、`--check`、`--case`、`--dir`、`--baseline` 和 `--self-compare`。默认与官方 develop 比较。

复用主包通用测试框架，在本包入口注入扩展构建步骤、用例目录及页面。两侧分别构建对应版本的主包和扩展包，扩展通过外部依赖共享 VChart 实例。报告位于 `.vchart-visual/extension/runs/`，不与主包运行锁或基线缓存混用。

时序图迁移保留了数据更新、曲线连线和 dataZoom 过滤共 3 个视觉用例。提交前分别运行主包和扩展包全量用例。
