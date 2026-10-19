# VChart Skill Usage

VChart and VTable are core components of VisActor's visualization solution. To improve AI-assisted development efficiency and reduce onboarding cost, VisActor provides a developer skill.

## Relationship with Quick Start

- [Quick Start](./Getting_Started) covers VChart basics.
- This guide focuses on using `vchart-skill` in AI editors.

## Installation

Use either command:

```bash
npx skills add VisActor/VChart
```

```bash
npx skills add VisActor/VChart --skill vchart-development-assistant
```

Installation preview:

![vchart-skill installation preview](/vchart/guide/skill-usage/installation.webp)

## Editor References

- Trae docs: `https://docs.trae.ai/ide/skills?_lang=zh`
- Cursor docs: `https://cursor.com/cn/docs/context/skills`

Skill directory preview:

![skills directory preview](/vchart/guide/skill-usage/directory.webp)

## Demo Scenarios

### 1. Generate a simple chart

Suggested prompt:

```text
Use VChart to generate a basic bar chart with xField, yField, and a minimal runnable example.
```

Expected result:

- A runnable minimal spec is generated.
- The chart can render correctly.

![simple chart demo](/vchart/guide/skill-usage/generate-chart.webp)

### 2. Adjust chart styles

Suggested prompt:

```text
Optimize colors, label style, and legend readability for the existing bar chart while preserving the current data structure.
```

Expected result:

- Style changes are clearly visible.
- Existing chart structure and data mapping remain valid.

![style adjustment demo](/vchart/guide/skill-usage/style-chart.webp)

### 3. Fix spec/config issues

Suggested prompt:

```text
Review the current VChart spec, identify configuration errors, and provide fixes with explanations.
```

Expected result:

- Incorrect config locations are identified.
- A directly replaceable fixed config is provided.

![config fix demo](/vchart/guide/skill-usage/fix-config.webp)

## Notes

- Make sure the skill is installed in your project editor skill directory.
- If behavior differs by editor version, follow the latest official docs.
