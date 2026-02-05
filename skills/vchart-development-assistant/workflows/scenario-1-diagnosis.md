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

## 输出可运行 HTML（强制）

使用 `assets/template/diagnosis.html` 模板，通过 Python 脚本产出完整 HTML。

### 配置诊断模式输出

- **诊断结果**：基于用户配置的分析结论
- **方案 spec**：基于用户原配置修复后的完整配置

### 描述诊断模式输出

- **诊断结果**：问题现象解读 + 解决思路
- **方案 spec**：使用 Mock 数据构建的完整配置，体现解决方案

### 使用 Python 脚本生成诊断 HTML

推荐使用 `scripts/generate_diagnosis_html.py` 脚本，通过配置文件生成诊断 HTML。

> 💡 **参数详情**：参见 [脚本参数参考](../references/SCRIPT_PARAMS_REFERENCE.md#generate_diagnosis_htmlpy)

#### 脚本使用示例

**最小示例**（使用默认参数）：

```bash
python3 scripts/generate_diagnosis_html.py --config-file config.js
```

**完整示例**（自定义所有参数）：

```bash
python3 scripts/generate_diagnosis_html.py \
  --title "VChart 问题诊断报告" \
  --desc "基于用户配置的诊断与修复结果" \
  --config-file config.js \
  --output output/diagnosis.html
```

#### 主要参数

- `--config-file`：包含 `problemReview`/`diagnosis`/`solutions` 的 JS 配置文件
- `--title`：诊断报告标题（可选）
- `--output`：输出 HTML 文件路径（可选，默认 `output/diagnosis.html`）

#### 配置文件结构

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
};`
};

const diagnosis = {
  problem: '图表 Y 轴没有数据显示，柱状图高度为 0',
  cause: 'yField 配置值为 "values"，但数据字段名为 "value"',
  suggestion: '确保 xField/yField 与数据字段名严格一致'
};

const solutions = [
  {
    title: '修正字段映射',
    description: '将 yField 的值从 "values" 修正为 "value"，与数据字段名保持一致。',
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
};`
  }
];
```

**步骤 2：运行脚本生成 HTML**

```bash
python3 scripts/generate_diagnosis_html.py \
  --title "字段映射错误诊断" \
  --desc "柱状图 Y 轴数据显示问题分析" \
  --config-file config.js \
  --output output/diagnosis.html
```

**步骤 3：查看生成结果**

在浏览器中打开 `output/diagnosis.html` 查看交互式诊断报告。

### 输出格式

````markdown
## 诊断方案（可运行）

将以下内容保存为 `.html` 文件，在浏览器中打开：

```html
[使用模板填充后的完整 HTML]
```
````

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

## 脚本故障排除

遇到脚本执行问题？请参考：**[Python 脚本常见问题排除指南](../references/SCRIPTS_TROUBLESHOOTING.md)**

### 快速链接

常见问题包括：

- ❌ [模板不存在错误](../references/SCRIPTS_TROUBLESHOOTING.md#-模板不存在错误)（运行位置不正确）
- ❌ [配置文件不存在](../references/SCRIPTS_TROUBLESHOOTING.md#-配置文件不存在configjs)（`config.js` 路径错误）
- ❌ [模板标记缺失](../references/SCRIPTS_TROUBLESHOOTING.md#-模板标记缺失错误)（模板文件被修改）
- ❌ [HTML 文件无法打开](../references/SCRIPTS_TROUBLESHOOTING.md#-输出目录问题)（输出目录或权限问题）

### 其他资源

- [文件命名约定](../references/FILE_NAMING_CONVENTIONS.md) - 了解 `config.js` 的格式要求
- [脚本参数参考](../references/SCRIPT_PARAMS_REFERENCE.md) - 查看所有可用参数
