# 场景一处理流程：问题诊断

## 适用情况

**识别信号**：

- 用户提供了现有代码并描述"不工作"、"报错"、"显示异常"
- 用户询问"有没有更好的方式"、"如何优化"
- 用户遇到性能问题或渲染问题
- 用户描述问题现象（可能有截图，可能无配置）

> **注意**：如用户使用 `@visactor/react-vchart` 库，请直接参考 [scenario-1-react.md](scenario-1-react.md)

## 模式分类

```
if (用户提供了现有 spec 配置) {
  → 配置诊断模式：基于用户配置分析问题并修复
} else {
  → 描述诊断模式：根据用户描述/截图生成解决方案配置
}
```

---

## 配置诊断模式（用户提供了 spec）

### 步骤 1a：收集信息

请用户提供：

1. 完整的 VChart spec 配置代码
2. 数据样本（至少 3-5 条）
3. 错误信息或异常表现描述
4. 期望的正确效果

### 步骤 2a：诊断分析

使用 `type-meta/[图表类型].json` 检查配置完整性：

```
1. **类型检查**：spec.type 是否为有效图表类型
2. **必填字段**：对照 type-meta 检查 required: true 的字段
3. **字段映射**：xField/yField/valueField 等是否与数据字段匹配
4. **数据格式**：data 配置是否符合 IData 规范
5. **类型约束**：属性值是否符合 type-details 中的类型定义
6. **版本兼容**：确认 API 是否适用于 2.0.0+ 版本
```

---

## 描述诊断模式（用户未提供 spec）

### 步骤 1b：理解问题

根据用户描述/截图识别：

1. **问题类型**：布局、样式、交互、性能、数据显示等
2. **图表类型**：推断用户使用的图表类型
3. **期望效果**：用户想要达到的目标

### 步骤 2b：构建解决方案

1. **Mock 数据**：根据问题场景构建合理的模拟数据（至少 5 条）
2. **生成 spec**：创建能体现解决方案的完整配置
3. **对比方案**：如适用，提供问题现象 vs 修复后的对比

---

## 输出 JavaScript 代码（强制）

直接输出 **完整的 VChart 配置代码**，包含问题分析和修复说明。

### 配置诊断模式输出

- **诊断结果**：基于用户配置的分析结论（作为注释）
- **修复后 spec**：基于用户原配置修复后的完整配置

### 描述诊断模式输出

- **诊断结果**：问题现象解读 + 解决思路（作为注释）
- **修复后 spec**：使用 Mock 数据构建的完整配置，体现解决方案

---

## 输出格式示例

```javascript
// 🔧 VChart 问题诊断报告
// 问题：[问题描述]
// 原因：[根本原因分析]
// 解决方案：[修复方法说明]

const spec = {
  type: 'bar',
  data: [
    {
      id: 'barData',
      values: [
        // Mock 数据
      ]
    }
  ]
  // ... 修复后的完整配置
};

// 使用方式：
// const vchart = new VChart(spec, { dom: 'chart' });
// vchart.renderSync();
```

---

## 完整诊断流程示例

配置文件需要包含三个 JavaScript 对象：

**1. problemReview（问题回顾）**

```javascript
const problemReview = {
  highlightLines: [11], // 可选：需要高亮的行号数组
  specCode: `[用户原始代码]` // 完整 JS 代码字符串，可包含函数
};
```

**2. diagnosis（诊断分析）**

```javascript
const diagnosis = {
  problem: '[问题简述]',
  cause: '[原因分析]',
  suggestion: '[修复建议]' // 可选
};
```

**3. solutions（解决方案数组）**

```javascript
const solutions = [
  {
    title: '[方案标题]',
    description: '[方案描述]',
    highlightLines: [11], // 可选：需要高亮的行号数组
    specCode: `[修复代码]` // 完整 JS 代码字符串，可包含函数
  }
  // 更多方案...
];
```

#### 实际使用示例

**步骤 1：创建配置文件 `config.js`**

```javascript
const problemReview = {
  highlightLines: [11],
  specCode: `const spec = {
  type: "bar",
  data: {
    values: [
      { category: "A", value: 10 },
      { category: "B", value: 20 }
    ]
  },
  xField: "category",
  yField: "values",
  label: {
    visible: true,
    formatter: (d) => d.value + "%"
  }
};`,
};

const diagnosis = {
  problem: "图表 Y 轴没有数据显示，柱状图高度为 0",
  cause: 'yField 配置值为 "values"，但数据字段名为 "value"',
  suggestion: "确保 xField/yField 与数据字段名严格一致",
};

const solutions = [
  {
    title: "修正字段映射",
    description:
      '将 yField 的值从 "values" 修正为 "value"，与数据字段名保持一致。',
    highlightLines: [11],
    specCode: `const spec = {
  type: "bar",
  data: {
    values: [
      { category: "A", value: 10 },
      { category: "B", value: 20 }
    ]
  },
  xField: "category",
  yField: "value",
  label: { visible: true }
};

// 使用方式：
// const vchart = new VChart(spec, { dom: 'chart' });
// vchart.renderSync();
```

---

## 常见问题速查

参考：`../references/chart/common-issues.md`

## 诊断清单

### 数据相关问题

| 问题现象     | 可能原因           | 检查项                               |
| ------------ | ------------------ | ------------------------------------ |
| 图表不显示   | 数据为空或格式错误 | `data.values` 是否为数组且非空       |
| 坐标轴无数据 | 字段映射错误       | `xField`/`yField` 是否匹配数据字段名 |
| 数据显示异常 | 数据类型不匹配     | 数值字段是否为 number 类型           |

### 配置相关问题

| 问题现象     | 可能原因           | 检查项                      |
| ------------ | ------------------ | --------------------------- |
| 组件不显示   | visible 设为 false | 检查组件 `visible` 属性     |
| 样式不生效   | 配置路径错误       | 对照 type-meta 检查属性路径 |
| 版本兼容问题 | API 已变更         | 确认使用的是 2.0.0+ API     |

---

## 相关资源

- [配置项索引](../references/topkey/) - 快速查找配置项
- [类型详情](../references/type-details/) - 详细的类型定义
- [组件参考](../references/components/) - 组件配置速查
- [常见问题](../references/chart/common-issues.md) - VChart 常见问题汇总
