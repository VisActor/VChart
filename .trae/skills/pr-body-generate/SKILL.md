---
name: pr-body-generate
description: 'Generates a well-formed Pull Request body for the VChart project based on its template. Use this skill to automatically populate the PR body with details like linked issues, changelog entries, self-test checklists, and a code walkthrough. The output is saved to a local file for review and modification before creating the PR.'
---

# 生成 PR 正文 (pr-body-generate)

## 概述

本技能用于根据 `VChart` 仓库中预设的 Pull Request 模板，自动生成一份内容丰富、格式规范的 PR 正文。它能够智能地聚合来自 Rush 变更日志、测试报告和 Git 提交历史的信息。

## 前置条件

- **Git 环境**: 一个配置好的 Git 环境。
- **本地变更**: 建议在本地已有代码变更和 `common/changes` 变更条目的情况下运行，以生成最完整的 PR 正文。

## 输入参数

| 参数             | 类型    | 是否必填 | 默认值                                  | 描述                                                           |
| ---------------- | ------- | -------- | --------------------------------------- | -------------------------------------------------------------- |
| `lang`           | string  | 否       | `zh`                                    | PR 模板的语言 (`zh` 或 `en`)。                                 |
| `title`          | string  | 否       | (空)                                    | 用于生成建议 PR 标题的素材。                                   |
| `head`           | string  | 否       | (空)                                    | PR 的源分支名。如果为空，将自动推导当前分支。                  |
| `labels`         | array   | 否       | `[]`                                    | 附加到 PR 的标签，会体现在正文的元信息中。                     |
| `rushChangesDir` | string  | 否       | `common/changes`                        | Rush 变更日志条目所在的目录。                                  |
| `localBodyFile`  | boolean | 否       | `true`                                  | 是否将生成的正文保存到本地文件。                               |
| `autotestReport` | string  | 否       | `.trae/output/autotest.report.local.md` | `auto-test` 技能生成的临时报告路径，其内容会被摘要进 PR 正文。 |
| `autoCheckType`  | boolean | 否       | `true`                                  | 是否自动勾选模板中的“分支类型/This is a ...”。                 |
| `typeOverride`   | string  | 否       | (空)                                    | 手动覆盖类型（如 `Workflow`、`New feature` 等），优先级最高。  |

## 输出与成功标准

- **主要输出**:
  - `generated_title`: 推荐的 PR 标题。
  - `generated_body_preview`: 生成的完整 PR 正文的 Markdown 预览。
  - `generated_body_file`: 本地保存 PR 正文的文件路径（默认为 `.trae/output/pr.body.local.md`）。
- **成功标准**:
  - `body_generated`: PR 正文已成功生成并按需保存到本地文件。

## 执行步骤

1.  **选择模板（严格遵循）**: 根据 `lang` 参数，精确选择对应的 PR 模板文件（中文：`.github/PULL_REQUEST_TEMPLATE/pr_cn.md`，英文：`.github/PULL_REQUEST_TEMPLATE.md`），并严格保留其章节结构与标题，不新增任何自定义章节或尾注。
2.  **任务类型自动识别与勾选（This is a ... / 这个分支是...）**:
    - 勾选策略优先级（从高到低）：
      1. `typeOverride` 显式指定
      2. 分支名前缀（例如 `feat/`、`fix/`、`chore/auto-flow-...`）
      3. 最近一次提交的 Conventional Commits 类型（如 `feat:`、`fix:`）
      4. 分支名关键词（如 `docs`、`demo`、`perf`、`refactor`、`style`、`test`、`merge`、`release`、`types`、`deps`、`bundle`）
      5. 标签 `labels` 的类型暗示（如包含 `workflow`、`documentation`）
    - 英文模板 `.github/PULL_REQUEST_TEMPLATE.md` 的映射：
      - `feat` → New feature
      - `fix` → Bug fix
      - `types`/`typings` → TypeScript definition update
      - `bundle`/`size`/`chore(bundle)` → Bundle size optimization
      - `perf` → Performance optimization
      - `enhance`/`improve` → Enhancement feature
      - `refactor` → Refactoring
      - `deps`/`chore(deps)` → Update dependency
      - `style` → Code style optimization
      - `test` → Test Case
      - `merge`/`branch-merge` → Branch merge
      - `release` → Release
      - `docs`/`site` → Site / documentation update
      - `demo` → Demo update
      - `chore/auto-flow*`、`workflow`、`ci` → Workflow
      - 未匹配 → Other (about what?)
    - 中文模板 `.github/PULL_REQUEST_TEMPLATE/pr_cn.md` 的映射与上面对应（如 `feat` → 新功能、`fix` → Bug fix、`docs` → 网站/文档更新、`chore/auto-flow*`/`workflow`/`ci` → Workflow 等）。
    - 仅勾选一个“主类型”，避免多选造成歧义；若同时匹配多个类型，选择优先级更高者。
    - 示例：
      - `chore/auto-flow-experience` → 勾选 Workflow
      - `feat/heatmap-color-scale` → 勾选 New feature / 新功能
      - `fix/tooltip-crash` → 勾选 Bug fix
      - `docs/site-nav` → 勾选 Site / documentation update
      - `refactor/scale` → 勾选 Refactoring
      - `perf/heatmap` → 勾选 Performance optimization
      - `test/heatmap` → 勾选 Test Case
      - `style/eslint` → 勾选 Code style optimization
      - `merge/develop` → 勾选 Branch merge
      - `release/vX.Y.Z` → 勾选 Release
      - `types/vchart` → 勾选 TypeScript definition update
      - `chore(deps): bump lodash` → 勾选 Update dependency
3.  **填充内容（仅在模板章节内）**: 仅在模板既有章节下补充内容：
    - **Changelog**: 解析 `{{rushChangesDir}}` 目录下的变更条目，并填充到正文的 Changelog 部分。
    - **自测项**: 如果 `autotestReport` 文件存在（默认路径为 `./.trae/output/autotest.report.local.md`），会将其中的测试摘要信息（包括“无新增自动化测试”说明）填充到自测/走查部分；若文件不存在，则在正文中保留空白或占位说明，提示尚未提供自动化测试报告。
    - **背景与方案**: 基于 `message` 参数（如果提供）和提交历史，生成简要的背景与方案描述。
    - **缺失数据的占位处理**: 当未找到 `{{rushChangesDir}}` 下的 changelog 或未提供 `autotestReport` 时，正文仍会生成对应的小节，并使用“暂无 changelog”或“尚未提供自动化测试报告”等最小占位文案，确保结构完整而不会报错。
    - **元信息**: 如需提供分支、标签等信息，放入“背景&解决方案”或相应模板章节的正文中，不新增“提交与后续”等额外章节。
4.  **输出与保存**:
    - Agent 会生成一个建议的 PR 标题。
    - 将完整的 PR 正文以 Markdown 预览形式展示。
    - 当 `localBodyFile` 为 `true`（默认行为）时，将模板原文复制并在既有章节内补充内容，保存到 `.trae/output/pr.body.local.md`。输出不包含任何模板外的额外段落（例如“提交与后续”）。
5.  **验证 (Validation)**:
    - 生成完成后，请打开 `.trae/output/pr.body.local.md`，检查至少以下几点：
      - 标题、背景与方案是否准确概括本次变更。
      - “这个分支是.../This is a ...”是否已正确勾选，且与分支名/提交类型一致。
      - Changelog 小节是否与 `common/changes` 中的内容一致；如没有 changelog，正文中是否有明确的“暂无 changelog”说明。
      - 自测/走查小节是否正确引用了 auto-test 报告；当没有新增测试时，应能看到“无新增自动化测试 (No new tests generated)” 等说明。
      - Summary / Walkthrough 等收尾小节是否存在，整体结构是否完整。
    - 如发现缺失或需要补充的信息，可直接编辑该 Markdown 文件后再执行 `pr-create-from-body`。

## 命令示例（本地等价操作）

如果希望在不依赖技能的情况下，用命令行完成一个最小可用的 PR 正文生成流程，可以在 VChart 仓库根目录参考以下步骤：

```bash
# 1. 确定当前分支（head）
head="$(git rev-parse --abbrev-ref HEAD)"

# 2. 选择 PR 模板文件
# 中文模板：
template=".github/PULL_REQUEST_TEMPLATE/pr_cn.md"
# 英文模板：
# template=".github/PULL_REQUEST_TEMPLATE.md"

# 3. 确保输出目录存在
mkdir -p ./.trae/output

# 4. 将模板内容写入本地临时 PR 正文文件
cp "$template" ./.trae/output/pr.body.local.md

# 5. 在编辑器中打开并补充变更摘要、自测结果与覆盖率信息
${EDITOR:-vim} ./.trae/output/pr.body.local.md
```

> 说明：`pr-body-generate` 在内部会在此基础上自动整合 `common/changes` 与 `./.trae/output/autotest.report.local.md` 中的信息，但无论数据是否齐全，都会按照 `localBodyFile: true` 的默认行为写出 `.trae/output/pr.body.local.md` 文件。

## 何时使用 / 边界

- **使用时机**:
  - 在提交代码并生成变更日志之后，创建 PR 之前，用于准备 PR 的描述内容。
  - 作为 `auto-flow` 工作流的一部分，在 `commit-smart` 步骤之后自动调用。
- **边界**:
  - 此技能只生成 PR 正文，不会创建 PR。创建 PR 是 `pr-create-from-body` 技能的职责。
  - 生成内容的丰富程度依赖于前序步骤的产出（如 `changelog` 和 `auto-test` 报告）。
