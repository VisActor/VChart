# VChart Skill 使用

VChart 和 VTable 作为 VisActor 数据可视化解决方案的核心组件，为了帮助开发者通过 AI 提升效率、降低使用门槛，VisActor 提供了开发者 skill。

## 与快速上手的关系

- [快速上手](./Getting_Started) 介绍的是 VChart 基础安装与绘图流程。
- 本文聚焦 `vchart-skill` 在 AI 编辑器中的使用方式，帮助你更快完成图表生成、样式调整和配置修复。
- 建议阅读顺序：先完成[快速上手](./Getting_Started)，再阅读本文。

## 简介

`vchart-skill` 面向支持 skills 的 AI 编辑器，核心目标是让模型更准确理解 VChart 语义与实践路径，从而减少试错成本。

## 安装与简单 Demo

### 1. Skill 安装

VChart 开发 skill 已发布在 GitHub：

- 仓库入口：`https://github.com/VisActor/VChart`
- skill 目录：`https://github.com/VisActor/VChart/tree/develop/skills/vchart-development-assistant`

可使用以下任一命令安装：

```bash
npx skills add VisActor/VChart
```

```bash
npx skills add VisActor/VChart --skill vchart-development-assistant
```

安装过程示意：

![vchart-skill 安装示意](/vchart/guide/skill-usage/installation.webp)

### 2. 编辑器参考

- Trae 文档：`https://docs.trae.ai/ide/skills?_lang=zh`
- Cursor 文档：`https://cursor.com/cn/docs/context/skills`

安装后，通常会落到项目内编辑器对应的 skills 目录（例如 `.cursor/skills` 或其他 `.<editor>/skills` 目录），请确认目录中能看到 `vchart-development-assistant`。

目录示意：

![skills 目录示意](/vchart/guide/skill-usage/directory.webp)

### 3. 示例一：生成简单图表

建议提示词：

```text
使用 VChart 生成一个基础柱状图，包含 xField、yField 和最小可运行示例。
```

验收点：

- 能输出可运行的最小 spec。
- 图表可正常渲染。

示例效果：

![生成简单图表示例](/vchart/guide/skill-usage/generate-chart.webp)

### 4. 示例二：调整图表样式

建议提示词：

```text
在已有柱状图基础上，优化颜色、标签样式和图例可读性，保留原有数据结构。
```

验收点：

- 样式改动清晰可见。
- 不破坏原有图表结构与数据映射。

示例效果：

![调整图表样式示例](/vchart/guide/skill-usage/style-chart.webp)

### 5. 示例三：修复配置问题

建议提示词：

```text
检查当前 VChart spec 的配置错误并给出修复方案，解释每一处修复原因。
```

验收点：

- 明确指出错误位置。
- 给出可直接替换的修复配置。

示例效果：

![修复配置问题示例](/vchart/guide/skill-usage/fix-config.webp)

## 常见问题与注意事项

- 如果编辑器不支持 skills，需先确认当前版本是否提供该能力。
- 如果命令执行成功但效果不明显，优先检查 skill 目录是否正确写入。
- 若项目上下文不足，建议先补充图表目标、字段含义和预期输出。
- 外部链接或命令可能随版本变化，请以最新官方文档为准。
