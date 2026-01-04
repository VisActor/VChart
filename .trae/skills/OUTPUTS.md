# 输出物与路径规范

## 默认位置
- 差异 JSON：`./.trae/output/diff.json`
- Autotest 报告：`./.trae/output/autotest.report.local.md`
- PR 正文：`./.trae/output/pr.body.local.md`

## 可覆盖
- 所有输出路径均可通过技能参数覆盖，要求为相对仓库根路径的可写位置。

## 命名约定
- 测试文件：`__tests__/*.test.ts`
- 自动化区块：名称前缀 `autogen:`，避免覆盖人工块。

