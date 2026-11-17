# Skill 固定任务

这里保存交给成熟 Agent 执行的固定提示词、独立输入和验收标准。目录结构参考 VisActor/skills 的固定任务约定；本仓库按 `skill-cases/<skill-name>/<case-name>/` 维护，不把任务或验收材料放进可安装 Skill。

```text
skill-cases/<skill-name>/<case-name>/
  README.md      # 任务介绍及验收标准，留在验收端
  prompt.md      # 交给 Agent 的任务
  inputs/        # 独立、可公开的完整输入及口径
  fixtures.json  # 每个输入文件的来源与 SHA-256
```

## 任务索引

| Skill | 固定任务 |
| --- | --- |
| [data-science-visualization](data-science-visualization/README.md) | 8 种典型统计与模型结果图表 |

已审查的展示作品及提示词、输入、最终产物与预览在 [examples/](../examples/README.md)。固定任务执行时只交付所选提示词与输入，不把展示作品当作执行输入或唯一标准答案。

## 维护约定

- 每例独立携带公开或模拟数据；输入有意修改时同步更新 `fixtures.json` 中的 SHA-256 与验收数字。
- 只把选中的 Skill、`prompt.md` 和 `inputs/` 暴露给执行 Agent；README、校验清单和预期数值留在验收端。
- 固定任务允许多种正确的实现结果，不要求相同布局、配色或像素。不向任务输入夹带参考答案。
- 记录执行所用 Skill commit/本地差异、Agent/模型、宿主、输入、输出及实际观察。能导出的日志与截图保存在本地；无法导出时说明缺失，不声称记录完整。
- 本地工作区、生成结果、截图与日志使用 `.vchart-statplots/skill-cases/` 下每次执行独立的目录；不覆盖旧结果，不提交缓存或会话日志。
- 本目录没有模型 API harness，不在 CI 中调用模型。固定任务定义、工程校验、Agent 执行和人工视觉验收分别记录，不能相互替代。
- 确定性脚本和浏览器回归继续放在对应包的测试目录；经过实际视觉审查的作品才适合另作展示案例。
