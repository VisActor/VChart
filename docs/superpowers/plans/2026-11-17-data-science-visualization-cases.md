# 数据科学可视化固定任务实施计划

> 本计划记录固定任务编写阶段：只新增任务材料，不修改运行时；该阶段未提交。

**Goal:** 在 `skill-cases/data-science-visualization/` 提供 8 个不同典型图型的独立可执行任务。

**Architecture:** 按 [设计](../specs/2026-11-17-data-science-visualization-cases-design.md) 分离 Agent 输入和验收标准。复用现有 Skill 的生成、校验和重放能力，临时验证产物保存在忽略目录。

**Tech Stack:** Markdown、CSV、JSON、Python 3.11 标准库及现有发布 UMD。

## 全局约束

- 用户指定目录为 `skill-cases/data-science-visualization/`。
- 8 例图型各不相同；每例只生成一张图。
- 每例独立携带输入，哈希覆盖全部输入文件；说明模拟来源和字段口径。
- 验收不进入生成工作区，不写标准答案或像素快照。
- 不修改运行时、不提交，不把工程验证记录为 Agent 或人工视觉验收通过。

## Task 1：建立任务与数据

**Files:** 新建 `skill-cases/README.md`、`skill-cases/data-science-visualization/README.md` 及设计表中各例的 `prompt.md`、`inputs/`、`fixtures.json`、`README.md`。

- [x] 编写目录指南、独立执行步骤和公共验收标准。
- [x] 构造 8 份确定性场景输入和字段口径，计算 SHA-256。
- [x] 为每例编写明确图型、数据范围与必要交互要求的固定提示词。
- [x] 编写对应验收标准，包含可手算的事实与需要真实操作的步骤。

## Task 2：验证材料

**Files:** 验证结果留在 `.vchart-statplots/dsv/cases-2026-11-17/`；不向任务中加入期望请求。

- [x] 检查目录完整、输入清单与实际文件一致、全部哈希与本地 Markdown 链接有效。
- [x] 重算各例 README 中的数值事实，检查 8 个不同图型与 Skill 索引一致。
- [x] 在临时目录按输入构造请求，运行 Python 3.11 固定生成器，验证 8 例可生成和独立重放。
- [x] 使用同版本发布库校验并编译每个请求，记录工程结果及未执行的 Agent/人工验收。
- [x] 检查最终差异、空白和工作区，保留用户已有文件。

## 验证结果

- 8 例、16 个输入文件的清单与 SHA-256 校验通过，本地 Markdown 链接与新增文件空白检查通过。
- Python 3.11 固定生成器：8 例生成及 8 例独立重放通过，重放请求使用 records，不引用原文件。
- Node.js 22 + Chromium + SHA-256 核对后的 2.2.2 发布 UMD 缓存：8 例 validate/compile/render 通过，每图均有实际图元；CDN 请求由本地缓存响应，不代表在线 CDN 可达性。
- 已按输入与发布编译结果复核各例验收数字。
- 临时请求、脚本、截图和检查记录位于忽略目录 `.vchart-statplots/dsv/cases-2026-11-17/`，未加入任务输入。浏览器已关闭，无常驻服务。
- 未执行完整 Agent 任务、真实悬停/控件操作或人工视觉验收；未修改运行时，未运行全量视觉回归，未提交或创建 PR。
