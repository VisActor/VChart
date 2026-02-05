# 场景二处理流程：配置生成

## 适用情况

**识别信号**：

- 用户希望从 0 到 1 创建图表（提供描述/数据结构）
- 用户已有 spec，希望添加/修改某个功能点
- 用户问"如何配置 xxx"、"怎么实现 xxx 效果"

## 模式分类

- **完整生成模式**：用户无现有 spec，需要生成完整配置
- **增量生成模式**：用户有现有 spec，需要生成增量配置

## 通用步骤

### 步骤 1：意图识别

**使用 `topkey/*.json` 将用户自然语言映射到配置项**：

| 用户表达                    | 匹配的配置项                  | 来源                              |
| --------------------------- | ----------------------------- | --------------------------------- |
| "加个标签" / "显示数值"     | `label`                       | references/topkey/[type].json     |
| "加条参考线" / "画条基准线" | `markLine`                    | references/topkey/[type].json     |
| "堆叠起来" / "累加显示"     | `stack: true`                 | references/topkey/[type].json     |
| "分组对比"                  | `seriesField` + `xField` 数组 | references/topkey/[type].json     |
| "加个图例"                  | `legends`                     | references/topkey/all_common.json |
| "鼠标悬浮提示"              | `tooltip`                     | references/topkey/all_common.json |
| "坐标轴标题"                | `axes[].title`                | references/topkey/all_common.json |

### 步骤 2：确定生成模式

```
if (用户提供了现有 spec) {
  → 增量生成模式
} else {
  → 完整生成模式
}
```

---

## 完整生成模式

### 步骤 2a-1：图表类型推断

基于用户描述和数据特征，参考 `../references/chart/chart-type-guide.md` 推断：

| 数据特征        | 可视化目的  | 推荐类型                     |
| --------------- | ----------- | ---------------------------- |
| 类目 + 数值     | 比较大小    | `bar`                        |
| 类目 + 数值     | 占比分布    | `pie`                        |
| 时间序列 + 数值 | 趋势变化    | `line`                       |
| 时间序列 + 数值 | 累积量感    | `area`                       |
| 两个数值维度    | 相关性/分布 | `scatter`                    |
| 多维度评分      | 综合对比    | `radar`                      |
| 层级数据        | 占比构成    | `treemap` / `sunburst`       |
| 流向数据        | 流量分配    | `sankey`                     |
| 流程阶段        | 转化漏斗    | `funnel`                     |
| 进度数据        | 完成度      | `gauge` / `circularProgress` |

### 步骤 2a-2：与用户确认

```markdown
## 图表类型推荐

基于您的需求，我推荐使用 **[图表类型中文名]**（`type: '[类型标识]'`）

**推荐理由**：[简要说明]

**是否确认？** 如需调整请告诉我。
```

### 步骤 2a-3：构建完整 Spec

**使用 `type-meta/[图表类型].json` 构建配置结构**：

1. 从 `inheritanceTree` 获取完整的可用属性列表
2. 填充 `required: true` 的必填字段
3. 根据用户需求添加可选配置
4. 对于复杂类型（`isSimple: false`），查阅 `type-details/[类型名].md`

```javascript
const spec = {
  type: '[图表类型]',
  data: [
    {
      id: 'dataId',
      values: [
        /* 用户数据 */
      ]
    }
  ],
  // 必填字段（从 type-meta 获取）
  [requiredField]: [value],

  // 用户需求的配置项
  [配置项]: {
    // 从 type-details 获取类型定义
  }
};

const vchart = new VChart(spec, { dom: 'container' });
vchart.renderSync();
```

### 步骤 2a-4：输出 JavaScript 代码（强制）

直接输出 **完整的 VChart spec 配置代码**，禁止只输出部分片段。

**输出要求**：

1. 包含完整的 spec 对象定义
2. 包含合理的 Mock 数据（至少 5 条）
3. 添加关键配置的注释说明
4. 用 ```javascript 代码块包裹，便于复制使用

**输出格式**：

````markdown
## 图表生成结果

基于您的需求，生成了以下 [图表类型] 配置。

**配置说明**：

- [关键配置点说明]

**完整代码**：

```javascript
// 完整的 VChart spec 配置
const spec = {
  type: '[图表类型]',
  data: [
    {
      id: 'dataId',
      values: [
        // Mock 数据（至少 5 条）
      ]
    }
  ]
  // ... 其他配置
};

// 使用方式：
// const vchart = new VChart(spec, { dom: 'chart' });
// vchart.renderSync();
```
````

````

---

## 增量生成模式

### 步骤 2b-1：定位配置项

**根据用户意图，使用 topkey 定位配置项名称**：

```javascript
// 用户说："我想给柱子加个标签"
// references/topkey/bar.json 中找到：
{
  "label": {
    "key": "label",
    "oneDesc": "标签相关配置,包括跟标签相关的引导线配置"
  }
}
// → 配置项为 label
````

### 步骤 2b-2：查询类型定义

**使用 `type-details/[类型名]-Type-Definition.md` 获取详细配置**：

```javascript
// 查询 type-details/ILabelSpec-Type-Definition.md
// 获取完整的 ILabelSpec 接口定义
```

### 步骤 2b-3：输出 JavaScript 代码（强制）

无论用户是否提供了完整 spec，都必须输出完整的 JavaScript 代码。

**情况 A：用户提供了完整 spec**

- 将增量配置整合到用户 spec 中
- 输出整合后的完整配置代码

**情况 B：用户只描述功能需求，未提供 spec**

- **Mock 数据**：构建合理的模拟数据（至少 5 条）
- **完整 spec**：生成包含该功能的完整图表配置
- 直接输出 JavaScript 代码

### 输出格式示例

````javascript
// 📊 [功能描述]
// 配置要点：[关键配置说明]



---

## 完整生成流程示例

#### Spec 文件结构

spec 文件应包含完整的 VChart 配置代码（JavaScript 格式）：

```javascript
const spec = {
  type: "bar",
  data: {
    values: [
      { category: "A", value: 10 },
      { category: "B", value: 20 },
      { category: "C", value: 15 },
      { category: "D", value: 12 },
      { category: "E", value: 18 },
    ],
  },
  xField: "category",
  yField: "value",
  label: {
    visible: true,
    style: { fill: "#333" },
  },
  tooltip: {
    visible: true,
  },
};
````

#### 实际使用示例

**步骤 1：创建 spec 文件 `spec.js`**

```javascript
const spec = {
  type: 'bar',
  data: {
    values: [
      { category: 'A', value: 10 },
      { category: 'B', value: 20 },
      { category: 'C', value: 15 },
      { category: 'D', value: 12 },
      { category: 'E', value: 18 }
    ]
  },
  xField: 'category',
  yField: 'value',
  label: { visible: true }
};
```

---

**输出格式**：

````markdown
## 功能实现：[功能名称]

**配置说明**：

- `[属性1]`：[类型] - [说明]
- `[属性2]`：[类型] - [说明]

**完整代码**：

```javascript
// 完整的 VChart spec 配置
const spec = {
  // ... 配置内容
};

// 使用方式：
// const vchart = new VChart(spec, { dom: 'chart' });
// vchart.renderSync();
```
````

## 生成模式选择指南

### 完整生成模式适用场景

- 用户是新手，没有现有 spec
- 用户提供需求描述和数据，希望从零开始
- 用户说"帮我做一个 xxx 图表"

### 增量生成模式适用场景

- 用户已有基础图表配置
- 用户希望在现有图表上添加特定功能
- 用户提供当前 spec，询问如何修改

---

## React 场景补充

- 若用户明确使用 React-VChart，输出时应提供 **React 组件代码**，包含完整的 import 语句和组件定义
- 说明依赖安装：`npm i @visactor/react-vchart @visactor/vchart`
- 如用户不接受纯 JS 示例，可同时给出 React 版本与 VChart 原生版本，标注差异

**React 组件示例**：

```jsx
import React from 'react';
import { BarChart } from '@visactor/react-vchart';

const MyChart = () => {
  const spec = {
    // VChart 配置
  };

  return <BarChart spec={spec} />;
};

export default MyChart;
```

## 不合格输出示例（禁止）

- ❌ 只返回部分 spec 配置（如只有 `axes` 或 `series`）
- ❌ 缺少数据源（`data` 字段为空或缺失）
- ❌ 使用占位符如 `[...更多数据...]` 而不给出完整示例
- ❌ 代码格式不规范，难以复制使用

---

## 相关资源

- [配置项索引](../references/topkey/) - 快速查找配置项
- [示例库](../references/examples/) - 常用图表完整示例
- [类型详情](../references/type-details/) - 详细的类型定义

```

```
