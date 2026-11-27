# Skill 案例展示

这里保存已查看实际内容与视觉效果的 Skill 案例，包括固定提示词、完整输入、最终产物和预览。它们不随可安装 Skill 分发，也不作为 CI 像素基线自动重新生成。

| Skill | 案例范围 |
| --- | --- |
| [data-science-visualization](data-science-visualization/README.md) | 8 种典型统计与模型结果图表，包含可交互 HTML、可重放请求、数据及来源 |

## 案例结构

```text
examples/<skill-name>/<case-name>/
  README.md       # 任务、输入、结果与使用方法，使用案例本身的语言
  prompt.md       # 固定任务提示词
  inputs/         # 可公开的完整输入及口径
  result/         # 最终产物和必要的本地资源
  preview.png     # 实际结果的代表性截图或导出图
```

每例只维护一份 README；说明模拟数据、口径和影响使用的限制，以及网络、库版本或其他运行依赖。替换作品时同步更新提示词、输入、结果与预览。

复作时只把提示词与输入交给 Agent，完成后再打开结果比较。独立验收标准在 [skill-cases/](../skill-cases/README.md)；最新执行与检查记录在维护文档中。原始会话日志、诊断副本、草稿、依赖目录和实验截图留在本地运行工作区，不作为展示案例入库。
