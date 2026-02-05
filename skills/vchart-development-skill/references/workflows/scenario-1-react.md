# React-VChart 问题诊断专项指南

> 本文档是场景一（问题诊断）的 React-VChart 专项补充，适用于使用 `@visactor/react-vchart` 库的 React 用户。

## 适用情况

当用户代码中出现以下特征时，使用本指南：

- 从 `@visactor/react-vchart` 导入组件
- 使用 `<BarChart>`、`<LineChart>`、`<VChart>` 等 JSX 标签
- React 项目中的图表问题
- 提及 React Hooks、状态管理、组件生命周期等

---

## React-VChart 特有问题诊断

### 1. 组件使用错误

#### 问题 1.1：组件类型选择错误

**识别信号**：

- 图表类型与组件不匹配
- 用户使用 `<LineChart>` 但想要柱状图

**诊断步骤**：

```
1. 确认用户意图的图表类型
2. 检查使用的组件标签是否匹配：
   - 柱状图 → <BarChart>
   - 折线图 → <LineChart>
   - 饼图 → <PieChart>
   - 通用 → <VChart> (需要 spec prop)
```

**修复示例**：

```jsx
// ❌ 错误
<LineChart data={data}>
  <Bar xField="x" yField="y" />
</LineChart>

// ✅ 正确
<BarChart data={data}>
  <Bar xField="x" yField="y" />
</BarChart>
```

#### 问题 1.2：组件嵌套错误

**识别信号**：

- 系列组件（如 `<Bar>`）未放在对应图表组件内
- 组件标签组合不合法

**诊断步骤**：

```
1. 检查系列组件是否在正确的父组件下：
   - <Bar> 必须在 <BarChart> 或 <CommonChart> 内
   - <Line> 必须在 <LineChart> 或 <CommonChart> 内
2. 检查组件组件（Axis、Legend）是否在图表组件内
```

**修复示例**：

```jsx
// ❌ 错误
<div>
  <Bar xField="x" yField="y" />
  <BarChart data={data} />
</div>

// ✅ 正确
<BarChart data={data}>
  <Bar xField="x" yField="y" />
  <Axis orient="bottom" />
  <Legend visible={true} />
</BarChart>
```

---

### 2. Props 传递问题

#### 问题 2.1：data prop 格式错误

**识别信号**：

- 图表不显示或报错 "data is not iterable"
- data 格式不符合 VChart 规范

**诊断步骤**：

```
1. 检查 data 是否为数组格式：[{ id, values }]
2. 确认 values 是否为数组
3. 检查数据字段是否与 xField/yField 匹配
```

**常见错误**：

```jsx
// ❌ 错误 1：直接传值数组
<BarChart data={[{x: 1, y: 2}, {x: 2, y: 3}]}>

// ❌ 错误 2：缺少 id
<BarChart data={[{ values: [...] }]}>

// ❌ 错误 3：values 不是数组
<BarChart data={[{ id: 'data', values: {...} }]}>

// ✅ 正确
<BarChart data={[{ id: 'data', values: [{x: 1, y: 2}, {x: 2, y: 3}] }]}>
```

#### 问题 2.2：配置对象 props 错误

**识别信号**：

- 样式配置不生效
- 嵌套对象配置语法错误

**诊断步骤**：

```
1. 确认对象型 props 使用双花括号 {{ }}
2. 检查对象内部属性名是否正确
3. 对照 VChart spec 文档验证配置项
```

**修复示例**：

```jsx
// ❌ 错误：单花括号
<Bar label={visible: true} />

// ✅ 正确：双花括号
<Bar label={{ visible: true }} />

// ✅ 正确：嵌套对象
<Bar
  label={{
    visible: true,
    style: { fill: 'red' }
  }}
/>
```

---

### 3. 状态更新问题

#### 问题 3.1：数据更新不触发重渲染

**识别信号**：

- 修改 state 后图表不更新
- 数据变化但图表保持旧数据

**诊断步骤**：

```
1. 检查是否使用了不可变更新方式
2. 确认 data prop 引用是否改变
3. 检查 React DevTools 确认组件是否重新渲染
```

**常见问题**：

```jsx
// ❌ 错误：直接修改数组（引用未变）
const handleUpdate = () => {
  chartData.push({ x: 5, y: 10 });
  setChartData(chartData); // 引用相同，不触发更新
};

// ✅ 正确：创建新数组
const handleUpdate = () => {
  setChartData([...chartData, { x: 5, y: 10 }]);
};

// ✅ 正确：使用不可变更新
const handleUpdate = () => {
  setChartData(prev => [...prev, { x: 5, y: 10 }]);
};
```

#### 问题 3.2：频繁更新导致性能问题

**识别信号**：

- 图表卡顿或闪烁
- 每次 state 变化都触发图表完全重绘

**诊断步骤**：

```
1. 检查 data 是否在每次渲染时创建新对象
2. 确认是否使用了 useMemo 优化
3. 检查父组件是否频繁重渲染
```

**优化方案**：

```jsx
// ❌ 问题：每次渲染创建新数据
function Chart() {
  const data = [{ id: 'data', values: generateData() }];
  return <BarChart data={data}>...</BarChart>;
}

// ✅ 优化 1：使用 useMemo
function Chart() {
  const data = useMemo(
    () => [{ id: 'data', values: generateData() }],
    [] // 依赖项
  );
  return <BarChart data={data}>...</BarChart>;
}

// ✅ 优化 2：使用 useState
function Chart() {
  const [data] = useState([{ id: 'data', values: generateData() }]);
  return <BarChart data={data}>...</BarChart>;
}
```

---

### 4. 事件处理问题

#### 问题 4.1：事件回调未触发

**识别信号**：

- onClick、onReady 等回调不执行
- 控制台无错误但事件无响应

**诊断步骤**：

```
1. 确认事件名是否正确（注意大小写）
2. 检查回调函数是否正确定义
3. 确认事件是否在正确的组件上监听
```

**常见错误**：

```jsx
// ❌ 错误 1：事件名错误
<BarChart onclick={handleClick}>  // 应为 onClick

// ❌ 错误 2：未传递函数
<BarChart onClick="handleClick">  // 应为 {handleClick}

// ❌ 错误 3：立即执行
<BarChart onClick={handleClick()}>  // 应为 {handleClick}

// ✅ 正确
<BarChart onClick={handleClick}>
  ...
</BarChart>

// ✅ 正确：内联函数
<BarChart onClick={(e) => console.log(e)}>
  ...
</BarChart>
```

#### 问题 4.2：onReady 获取实例错误

**识别信号**：

- 无法获取 VChart 实例
- 实例方法调用失败

**诊断步骤**：

```
1. 确认 onReady 回调参数接收实例
2. 检查实例保存方式（ref vs state）
3. 验证实例方法调用时机
```

**正确用法**：

```jsx
function Chart() {
  const chartRef = useRef(null);

  const handleReady = (instance, isInitial) => {
    chartRef.current = instance;
    console.log('Chart ready:', isInitial);
  };

  const updateChart = () => {
    if (chartRef.current) {
      chartRef.current.updateSpec({...});
    }
  };

  return (
    <BarChart onReady={handleReady}>
      <Bar xField="x" yField="y" />
    </BarChart>
  );
}
```

---

### 5. 生命周期和副作用问题

#### 问题 5.1：内存泄漏

**识别信号**：

- 组件卸载后仍有定时器运行
- 控制台警告 "Can't perform a React state update on an unmounted component"

**诊断步骤**：

```
1. 检查是否在 useEffect 中正确清理副作用
2. 确认事件监听器是否正确移除
3. 检查异步操作是否在组件卸载后仍执行
```

**修复示例**：

```jsx
// ❌ 问题：未清理定时器
function Chart() {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const timer = setInterval(() => {
      setData(generateNewData());
    }, 1000);
    // 缺少清理函数
  }, []);

  return <BarChart data={data}>...</BarChart>;
}

// ✅ 正确：添加清理函数
function Chart() {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const timer = setInterval(() => {
      setData(generateNewData());
    }, 1000);

    return () => clearInterval(timer); // 清理
  }, []);

  return <BarChart data={data}>...</BarChart>;
}
```

#### 问题 5.2：依赖项错误导致无限循环

**识别信号**：

- 页面卡死或持续重渲染
- 控制台疯狂输出日志

**诊断步骤**：

```
1. 检查 useEffect 依赖数组
2. 确认依赖项是否在每次渲染时变化
3. 检查是否在 effect 中修改了依赖项
```

**修复示例**：

```jsx
// ❌ 问题：依赖项每次都变化
function Chart({ config }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData(config).then(setData);
  }, [config]); // config 每次都是新对象

  return <BarChart data={data}>...</BarChart>;
}

// ✅ 方案 1：使用 useMemo 稳定依赖
function Chart({ config }) {
  const [data, setData] = useState([]);
  const stableConfig = useMemo(() => config, [config.url, config.params]);

  useEffect(() => {
    fetchData(stableConfig).then(setData);
  }, [stableConfig]);

  return <BarChart data={data}>...</BarChart>;
}

// ✅ 方案 2：解构依赖
function Chart({ config }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData(config).then(setData);
  }, [config.url, config.params]); // 只依赖具体值

  return <BarChart data={data}>...</BarChart>;
}
```

---

## 转换为 VChart Spec 诊断

当 React 特有问题排查完毕后，如果问题仍然存在，需要将 React 组件代码转换为等价的 VChart spec 进行深度诊断。

### 转换规则

| React 代码                             | VChart Spec                                  |
| -------------------------------------- | -------------------------------------------- |
| `<BarChart data={data}>`               | `{ type: 'bar', data: data }`                |
| `<Bar xField="x" yField="y" />`        | `{ xField: 'x', yField: 'y' }`               |
| `<Axis orient="bottom" type="band" />` | `axes: [{ orient: 'bottom', type: 'band' }]` |
| `<Legend visible={true} />`            | `legends: { visible: true }`                 |
| `label={{ visible: true }}`            | `label: { visible: true }`                   |

### 转换示例

```jsx
// React 组件代码
<BarChart data={[{ id: 'data', values: chartData }]}>
  <Bar xField="category" yField="value" label={{ visible: true }} />
  <Axis orient="bottom" type="band" />
  <Axis orient="left" type="linear" />
  <Legend visible={true} position="top" />
</BarChart>;

// 等价 VChart spec
const spec = {
  type: 'bar',
  data: [{ id: 'data', values: chartData }],
  xField: 'category',
  yField: 'value',
  label: { visible: true },
  axes: [
    { orient: 'bottom', type: 'band' },
    { orient: 'left', type: 'linear' }
  ],
  legends: { visible: true, position: 'top' }
};
```

转换后，使用标准 VChart 诊断流程（参考主文档 scenario-1-diagnosis.md）进行深度分析。

---

## 输出 React 组件代码

React-VChart 问题必须输出 **完整的 React 组件代码**。

### 输出要求

- ✅ 包含完整的 React 组件定义（函数组件或类组件）
- ✅ 使用 React-VChart 库的正确 API
- ✅ 包含必要的 import 语句
- ✅ 添加问题分析和修复说明注释
- ✅ 提供组件使用示例

### 输出格式示例

```jsx
// 🔧 React-VChart 问题修复
// 问题：[问题描述]
// 原因：[根本原因分析]
// 解决方案：[修复方法说明]

import React from 'react';
import { BarChart } from '@visactor/react-vchart';

const MyChart = () => {
  const spec = {
    // VChart 配置
  };

  return <BarChart spec={spec} onReady={vchart => console.log('图表初始化完成', vchart)} />;
};

export default MyChart;

// 使用方式：
// import MyChart from './MyChart';
// <MyChart />
```

---

## React 特定最佳实践

### 1. 数据管理

```jsx
// ✅ 推荐：使用 useState 管理图表数据
const [chartData, setChartData] = useState(initialData);

// ✅ 推荐：数据不变时使用 useMemo
const formattedData = useMemo(() => rawData.map(item => ({ ...item, value: item.value * 100 })), [rawData]);

// ✅ 推荐：复杂数据转换使用 useCallback
const transformData = useCallback(raw => {
  return raw.filter(item => item.value > 0);
}, []);
```

### 2. 性能优化

```jsx
// ✅ 使用 React.memo 避免不必要的重渲染
const MemoizedChart = React.memo(
  ({ data, config }) => (
    <BarChart data={data}>
      <Bar {...config} />
    </BarChart>
  ),
  (prevProps, nextProps) => {
    return prevProps.data === nextProps.data && prevProps.config === nextProps.config;
  }
);

// ✅ 拆分大型配置对象
const axesConfig = useMemo(
  () => [
    { orient: 'bottom', type: 'band' },
    { orient: 'left', type: 'linear' }
  ],
  []
);
```

### 3. 实例管理

```jsx
// ✅ 推荐：使用 ref 保存图表实例
const chartRef = useRef(null);

const handleReady = useCallback(instance => {
  chartRef.current = instance;
}, []);

// ✅ 调用实例方法
const exportImage = useCallback(() => {
  if (chartRef.current) {
    chartRef.current.exportImg();
  }
}, []);
```

---

## React 脚本故障排除

### 常见问题

#### Q1: `❌ 模板不存在: assets/template/diagnosis-react.html`

**原因**：脚本运行位置不正确

**解决步骤**：

1. 确认当前工作目录：`pwd`
2. 进入 `vchart-development-assistant` 目录：`cd vchart-development-assistant`
3. 确认 `assets/template/diagnosis-react.html` 文件存在：`ls assets/template/diagnosis-react.html`
4. 重新运行脚本

---

## 相关资源

- **React-VChart 官方文档**：https://visactor.com/vchart/guide/tutorial_docs/Cross-terminal_and_Developer_Ecology/react
- **GitHub 仓库**：https://github.com/VisActor/VChart/tree/develop/packages/react-vchart
- [组件参考](../references/components/) - 组件配置速查

### React 专项提示

1. **JSX 代码格式**：确保代码格式正确，组件标签闭合
2. **Props 命名**：使用驼峰命名法（camelCase），如 `xField`、`yField`
3. **数据结构**：确保数据格式与配置一致

---

## 参考资源

- **官方文档**：https://visactor.com/vchart/guide/tutorial_docs/Cross-terminal_and_Developer_Ecology/react
- **GitHub 仓库**：https://github.com/VisActor/VChart/tree/develop/packages/react-vchart
- **API 文档**：https://github.com/VisActor/VChart/blob/main/packages/react-vchart/docs/2.1%20API设计.md
- **VChart 主文档**：参考 scenario-1-diagnosis.md 进行深度配置诊断
