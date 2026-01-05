# 使用说明：pr-body-generate

本技能用于自动生成一份内容丰富、格式规范的 Pull Request 正文。

## 何时使用

- **创建 PR 前**: 在代码提交和 `changelog` 生成之后，使用此技能可以一键生成 PR 的完整描述，节省手动填写模板的时间。
- **作为流程的一部分**: 在 `auto-flow` 编排中，此技能是创建 PR 之前的关键准备步骤。

## 示例对话

**场景一: 自动生成正文**

> **你**: “我已提交了代码和 changelog，现在请帮我生成 PR 正文。”
>
> **Agent**: (执行技能) “PR 正文已生成并保存到 `./.trae/output/pr.body.local.md`。建议标题为 '[Auto] feat: your feature summary'。请审阅内容，然后执行 `pr-create-from-body` 来创建 PR。”

**场景二: 生成时指定标题和标签**

> **你**: "执行 `pr-body-generate`，标题是 'feat(vis-component): 新增 Tooltip 组件'，标签是 'feature', 'component'。"
>
> **Agent**: (执行技能) “好的，已生成 PR 正文，其中包含了你指定的标签信息，并为你推荐了标题。”

## 关键参数

- `lang`: PR 模板的语言，支持 `zh` (默认) 和 `en`。
- `title`: 用于生成建议 PR 标题的素材。
- `rushChangesDir`: Rush 变更日志条目的目录，默认为 `common/changes`。
- `localBodyFile`: 是否将生成的正文保存到本地文件，默认为 `true`。
- `autotestReport`: `auto-test` 技能的报告路径，其内容会被摘要进 PR 正文。

## 注意事项

- **仅生成不创建**: 此技能只负责生成 PR 正文的 `.md` 文件，**不会** 在 GitHub 上创建 PR。创建操作由 `pr-create-from-body` 技能完成。
- **依赖前序产出**: 生成的正文内容的完整性依赖于之前步骤的产出，例如 `common/changes` 目录下的 `changelog` 文件和 `auto-test` 生成的测试报告。
- **人工审查**: 自动生成的内容是草稿，强烈建议在执行下一步前，打开本地生成的 `.md` 文件进行审查和必要的修改。
