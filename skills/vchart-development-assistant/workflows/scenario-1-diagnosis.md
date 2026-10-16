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

先复用当前请求和已有上下文中的 spec、实际数据/绑定、错误表现与期望效果。只补充会影响定位的缺项，不重复索取已提供信息，也不要求固定数量的数据样本。

真实数据来自可访问文件或数据源时按已知来源读取；绑定只能由宿主提供时保留契约并说明本地无法完成的验收，不以内嵌 mock 替代。

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
4. **数据来源**：当前或已有上下文的真实数据、字段、单位及可用绑定；没有原 spec 不代表没有真实数据

### 步骤 2b：构建解决方案

1. **选择真实数据或演示数据**：遵循 [主文件的数据规则](../SKILL.md#数据与生成自检)。真实数据或可用绑定已知时沿用字段、记录和口径，不因为缺少 spec 就替换或增加记录；缺少影响诊断的数据/字段时询问必要信息，不伪造完整业务修复配置。
2. **处理不可访问绑定**：保留真实绑定契约，给出有证据的配置分析或排查方向，并区分候选原因与未完成的运行验收。不能通过填 mock 报告原业务问题已修复。
3. **按目标构建配置**：已有数据足以构建配置时，保持 HTML/spec 交付目标，生成对应完整产物；只有用户明确请求或允许教学/样式演示时才使用标注来源的 mock，没有固定最少条数。演示与实际业务修复结果分开说明。
4. **说明诊断依据**：没有原代码或运行证据时不声称已定位原问题的根因；只说明实际完成的配置检查、候选原因和验证范围。

---

## 输出诊断结果

遵循 [主文件的交付选择](../SKILL.md#先确定任务与交付目标)，保留用户指定或已有的 HTML/spec/组件目标。尚未建立交付目标时，独立 spec 排错交付整合后的完整修复配置；已有 HTML 内的 spec 排错仍交付完整 HTML。只看改动时才给补丁。没有现有配置的独立演示需求按 HTML 路径处理。

纯 JSON 请求不混入诊断说明或实例代码；普通对话的原因与验证说明放在配置之外。spec 交付按 [spec 流程](scenario-2-spec-generation.md)，诊断 HTML 按下方既有模板生成。不要因反馈“没显示”就把 JSON 修复变成 HTML。

### 格式一：交付修复后的 spec

直接输出可用的 VChart spec 配置代码，便于用户复制到项目中。

**配置诊断模式输出示例**：

````markdown
## 问题诊断

**问题**：图表 Y 轴没有数据显示，柱状图高度为 0

**原因**：yField 配置值为 "values"，但数据字段名为 "value"，字段名不匹配

**修复建议**：确保 xField/yField 与数据字段名严格一致

## 用户原始代码

```javascript
const spec = {
  type: 'bar',
  data: {
    values: [
      { category: 'A', value: 10 },
      { category: 'B', value: 20 }
    ]
  },
  xField: 'category',
  yField: 'values', // ❌ 错误：字段名不匹配
  label: {
    visible: true
  }
};

```

## 修复方案

```javascript
const spec = {
  type: 'bar',
  data: {
    values: [
      { category: 'A', value: 10 },
      { category: 'B', value: 20 }
    ]
  },
  xField: 'category',
  yField: 'value', // ✅ 修正：与数据字段名一致
  label: {
    visible: true
  }
};

```
````

**描述诊断模式输出示例**：

以下是用户已允许使用 mock 的教学示例，A/B/C 为模拟类别；实际诊断应沿用用户的真实数据或绑定。

````markdown
## 问题诊断

**问题**：需要在柱状图上显示数据标签

**解决方案**：通过配置 `label` 属性实现数据标签显示

## 完整代码示例

```javascript
const spec = {
  type: 'bar',
  data: {
    values: [
      { category: 'A', value: 10 },
      { category: 'B', value: 20 },
      { category: 'C', value: 15 }
    ]
  },
  xField: 'category',
  yField: 'value',
  label: {
    visible: true,
    position: 'top',
    style: {
      fill: '#333'
    }
  }
};

```
````

### 格式二：输出完整 HTML（按需）

当用户需要完整的可运行演示时，使用 `template/diagnosis.html` 模板，通过 Python 脚本生成诊断 HTML。

#### 使用 Python 脚本生成诊断 HTML

推荐使用 `scripts/generate_diagnosis_html.py` 脚本，通过配置文件生成交互式诊断 HTML。

**脚本使用示例**：

```bash
# 最小示例
python3 scripts/generate_diagnosis_html.py --config-file config.js

# 完整示例
python3 scripts/generate_diagnosis_html.py \
  --title "VChart 问题诊断报告" \
  --desc "基于用户配置的诊断与修复结果" \
  --config-file config.js \
  --output output/diagnosis.html
```

**主要参数**：

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
  yField: "values",  // 问题行
  label: {
    visible: true,
    formatMethod: (text, datum) => datum.value + "%"
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
  yField: "value",  // 修复后
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
  --output my_diagnosis.html
```

**步骤 3：查看生成结果**

在浏览器中打开生成的 HTML 文件，可以看到包含问题回顾、诊断分析和可编辑的解决方案的交互式页面。

#### 直接输出 HTML 代码（备选）

如果无法使用脚本，也可以直接输出完整的 HTML 代码：

````markdown
## 诊断方案（可运行）

将以下内容保存为 `.html` 文件，在浏览器中打开即可查看：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>VChart 诊断示例</title>
    <script src="https://unpkg.com/@visactor/vchart/build/index.min.js"></script>
  </head>
  <body>
    <div id="chart" style="width: 600px; height: 400px;"></div>

    <script>
      // 问题代码示例
      const problemSpec = {
        type: 'bar',
        data: {
          values: [
            { category: 'A', value: 10 },
            { category: 'B', value: 20 }
          ]
        },
        xField: 'category',
        yField: 'values' // 问题：字段名错误
      };

      // 修复后的代码
      const spec = {
        type: 'bar',
        data: {
          values: [
            { category: 'A', value: 10 },
            { category: 'B', value: 20 }
          ]
        },
        xField: 'category',
        yField: 'value' // 修复：字段名正确
      };

      const vchart = new VChart.default(spec, { dom: 'chart' });
      vchart.renderAsync();
    </script>
  </body>
</html>
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

## 相关资源

- [配置项索引](../references/topkey/) - 快速查找配置项
- [示例库](../references/examples/) - 常用图表完整示例
- [类型详情](../references/type-details/) - 详细的类型定义
- [图表类型指南](../references/chart/chart-type-guide.md) - 各类图表特性参考
