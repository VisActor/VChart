/**
 * IAreaChartSpec 完整实现代码解析器
 * 为大模型代码生成优化版本
 * 增强功能：
 * 1. 解析枚举类型为具体字符串
 * 2. 区分简单类型和复杂类型
 * 3. 添加 dependencies 字段记录复杂类型依赖
 * 4. 提供复杂类型的完整打平定义，供大模型生成代码使用
 */

const fs = require('fs');
const path = require('path');

// 枚举类型定义
const enumTypes = {
  'DirectionType': '"vertical" | "horizontal"',
  'SeriesType': '"line" | "area" | "bar" | "scatter" | "pie" | "radar" | "sankey" | "treemap" | "sunburst" | "gauge" | "waterfall" | "box" | "histogram" | "rose" | "circularProgress" | "linearProgress" | "funnel" | "map" | "wordCloud" | "correlation" | "heatmap" | "liquidFill" | "mosaic" | "dot" | "range-column"',
  'StringOrNumber': 'string | number',
  'DataKeyType': 'string | string[] | ((data: any) => string)',
  'IInvalidType': '"break" | "link" | "zero" | "ignore"',
  'ISamplingMethod': '"lttb" | "max" | "min" | "average" | "sum"',
  'EnableMarkType': '"symbol" | "rect" | "line" | "text" | "image" | "path" | "area" | "arc" | "polygon" | "group"',
  'AreaMarks': '"point" | "line" | "area"',
  'AreaAppearPreset': '"clipIn" | "fadeIn" | "grow"'
};

// 简单类型列表
const simpleTypes = [
  'string', 'number', 'boolean', 'any', 'unknown', 'void', 'null', 'undefined',
  'string[]', 'number[]', 'boolean[]', 'any[]'
];

// 复杂类型的详细定义（模拟从源码中解析出来的结构）
const complexTypeDefinitions = {
  'ICartesianCrosshairSpec': {
    description: '笛卡尔坐标系十字辅助线配置',
    properties: [
      { name: 'xField', type: 'string', required: false, description: 'x轴字段名' },
      { name: 'yField', type: 'string', required: false, description: 'y轴字段名' },
      { name: 'trigger', type: '"hover" | "click" | "none"', required: false, description: '触发方式' },
      { name: 'line', type: 'ILineMarkSpec', required: false, description: '十字线样式配置' },
      { name: 'label', type: 'ILabelSpec', required: false, description: '标签配置' },
      { name: 'container', type: 'string | HTMLElement', required: false, description: '容器元素' }
    ]
  },
  'IMarkLineSpec': {
    description: '参考线配置',
    properties: [
      { name: 'coordinates', type: '{ x?: number | string; y?: number | string }[]', required: false, description: '参考线坐标点' },
      { name: 'process', type: 'IDataPointProcess[]', required: false, description: '数据处理流程' },
      { name: 'line', type: 'ILineMarkSpec', required: false, description: '线条样式' },
      { name: 'label', type: 'ILabelSpec', required: false, description: '标签配置' },
      { name: 'connectDirection', type: '"x" | "y"', required: false, description: '连接方向' }
    ]
  },
  'IMarkAreaSpec': {
    description: '参考区域配置',
    properties: [
      { name: 'coordinates', type: '{ x?: number | string; y?: number | string }[]', required: false, description: '区域坐标点' },
      { name: 'process', type: 'IDataPointProcess[]', required: false, description: '数据处理流程' },
      { name: 'area', type: 'IAreaMarkSpec', required: false, description: '区域样式' },
      { name: 'label', type: 'ILabelSpec', required: false, description: '标签配置' }
    ]
  },
  'IMarkPointSpec': {
    description: '参考点配置',
    properties: [
      { name: 'coordinates', type: '{ x?: number | string; y?: number | string }[]', required: false, description: '参考点坐标' },
      { name: 'process', type: 'IDataPointProcess[]', required: false, description: '数据处理流程' },
      { name: 'symbol', type: 'ISymbolMarkSpec', required: false, description: '点样式' },
      { name: 'label', type: 'ILabelSpec', required: false, description: '标签配置' }
    ]
  },
  'ICartesianAxisSpec': {
    description: '笛卡尔坐标轴配置',
    properties: [
      { name: 'orient', type: '"left" | "right" | "top" | "bottom"', required: true, description: '坐标轴位置' },
      { name: 'type', type: '"linear" | "band" | "point" | "time" | "log"', required: false, description: '坐标轴类型' },
      { name: 'domain', type: '[number, number] | string[]', required: false, description: '坐标轴数据域' },
      { name: 'range', type: '[number, number]', required: false, description: '坐标轴像素范围' },
      { name: 'title', type: 'ITitleSpec', required: false, description: '坐标轴标题' },
      { name: 'label', type: 'ILabelSpec', required: false, description: '坐标轴标签' },
      { name: 'tick', type: 'ITickSpec', required: false, description: '刻度线配置' },
      { name: 'grid', type: 'IGridSpec', required: false, description: '网格线配置' },
      { name: 'visible', type: 'boolean', required: false, description: '是否可见', defaultValue: 'true' }
    ]
  },
  'IData': {
    description: '数据配置',
    properties: [
      { name: 'id', type: 'StringOrNumber', required: false, description: '数据集ID' },
      { name: 'values', type: 'any[]', required: false, description: '静态数据值' },
      { name: 'fields', type: '{ [key: string]: { type: "number" | "string" | "boolean" } }', required: false, description: '字段类型定义' },
      { name: 'parser', type: 'IDataParser', required: false, description: '数据解析器' },
      { name: 'transforms', type: 'IDataTransform[]', required: false, description: '数据转换流程' }
    ]
  },
  'ILayoutPaddingSpec': {
    description: '布局内边距配置',
    properties: [
      { name: 'left', type: 'number', required: false, description: '左边距' },
      { name: 'right', type: 'number', required: false, description: '右边距' },
      { name: 'top', type: 'number', required: false, description: '上边距' },
      { name: 'bottom', type: 'number', required: false, description: '下边距' }
    ]
  },
  'ILayoutSpec': {
    description: '布局配置',
    properties: [
      { name: 'type', type: '"grid" | "normal"', required: false, description: '布局类型' },
      { name: 'col', type: 'number', required: false, description: '网格列数' },
      { name: 'row', type: 'number', required: false, description: '网格行数' },
      { name: 'elements', type: 'ILayoutElement[]', required: false, description: '布局元素' }
    ]
  },
  'IBackgroundSpec': {
    description: '背景配置',
    properties: [
      { name: 'fill', type: 'string', required: false, description: '填充色' },
      { name: 'cornerRadius', type: 'number', required: false, description: '圆角半径' },
      { name: 'stroke', type: 'string', required: false, description: '边框色' },
      { name: 'lineWidth', type: 'number', required: false, description: '边框宽度' }
    ]
  },
  'ITitleSpec': {
    description: '标题配置',
    properties: [
      { name: 'visible', type: 'boolean', required: false, description: '是否显示', defaultValue: 'true' },
      { name: 'text', type: 'string', required: false, description: '标题文本' },
      { name: 'subtext', type: 'string', required: false, description: '副标题文本' },
      { name: 'align', type: '"left" | "center" | "right"', required: false, description: '对齐方式' },
      { name: 'textStyle', type: 'ITextMarkSpec', required: false, description: '主标题文本样式' },
      { name: 'subtextStyle', type: 'ITextMarkSpec', required: false, description: '副标题文本样式' }
    ]
  },
  'ILegendSpec': {
    description: '图例配置',
    properties: [
      { name: 'visible', type: 'boolean', required: false, description: '是否显示', defaultValue: 'true' },
      { name: 'orient', type: '"left" | "right" | "top" | "bottom"', required: false, description: '图例位置' },
      { name: 'position', type: '"start" | "middle" | "end"', required: false, description: '图例对齐位置' },
      { name: 'item', type: 'ILegendItemSpec', required: false, description: '图例项配置' },
      { name: 'pager', type: 'ILegendPagerSpec', required: false, description: '分页器配置' },
      { name: 'title', type: 'ILegendTitleSpec', required: false, description: '图例标题' }
    ]
  },
  'ITooltipSpec': {
    description: '提示框配置',
    properties: [
      { name: 'visible', type: 'boolean', required: false, description: '是否显示', defaultValue: 'true' },
      { name: 'trigger', type: '"hover" | "click" | "none"', required: false, description: '触发方式' },
      { name: 'mark', type: 'ITooltipMarkSpec', required: false, description: '提示框样式' },
      { name: 'content', type: 'ITooltipContentSpec[]', required: false, description: '提示框内容配置' },
      { name: 'offset', type: '{ x: number; y: number }', required: false, description: '偏移量' }
    ]
  },
  'IMarkSpec': {
    description: '图元标记配置基类',
    properties: [
      { name: 'visible', type: 'boolean', required: false, description: '是否可见', defaultValue: 'true' },
      { name: 'interactive', type: 'boolean', required: false, description: '是否可交互', defaultValue: 'true' },
      { name: 'style', type: 'T', required: false, description: '图元样式配置（泛型）' },
      { name: 'state', type: '{ [stateName: string]: T }', required: false, description: '状态样式配置' }
    ]
  },
  'ISymbolMarkSpec': {
    description: '符号图元样式配置',
    properties: [
      { name: 'symbolType', type: '"circle" | "square" | "diamond" | "triangle" | "star"', required: false, description: '符号类型' },
      { name: 'size', type: 'number', required: false, description: '符号大小' },
      { name: 'fill', type: 'string', required: false, description: '填充色' },
      { name: 'stroke', type: 'string', required: false, description: '边框色' },
      { name: 'lineWidth', type: 'number', required: false, description: '边框宽度' },
      { name: 'opacity', type: 'number', required: false, description: '透明度' }
    ]
  },
  'ILineMarkSpec': {
    description: '线图元样式配置',
    properties: [
      { name: 'stroke', type: 'string', required: false, description: '线条颜色' },
      { name: 'lineWidth', type: 'number', required: false, description: '线条宽度' },
      { name: 'lineDash', type: 'number[]', required: false, description: '虚线样式' },
      { name: 'opacity', type: 'number', required: false, description: '透明度' },
      { name: 'lineCap', type: '"butt" | "round" | "square"', required: false, description: '线条端点样式' }
    ]
  },
  'IAreaMarkSpec': {
    description: '面积图元样式配置',
    properties: [
      { name: 'fill', type: 'string', required: false, description: '填充色' },
      { name: 'fillOpacity', type: 'number', required: false, description: '填充透明度' },
      { name: 'stroke', type: 'string', required: false, description: '边框色' },
      { name: 'strokeOpacity', type: 'number', required: false, description: '边框透明度' },
      { name: 'lineWidth', type: 'number', required: false, description: '边框宽度' }
    ]
  },
  'ILabelSpec': {
    description: '标签配置',
    properties: [
      { name: 'visible', type: 'boolean', required: false, description: '是否显示', defaultValue: 'true' },
      { name: 'position', type: '"top" | "bottom" | "left" | "right" | "center"', required: false, description: '标签位置' },
      { name: 'offset', type: 'number', required: false, description: '偏移距离' },
      { name: 'style', type: 'ITextMarkSpec', required: false, description: '文本样式' },
      { name: 'formatter', type: 'string | ((value: any) => string)', required: false, description: '格式化函数' }
    ]
  },
  'IMultiLabelSpec': {
    description: '多标签配置',
    properties: [
      { name: 'visible', type: 'boolean', required: false, description: '是否显示', defaultValue: 'true' },
      { name: 'position', type: '"top" | "bottom" | "left" | "right" | "center" | "inside-middle"', required: false, description: '标签位置' },
      { name: 'offset', type: 'number', required: false, description: '偏移距离' },
      { name: 'style', type: 'ITextMarkSpec', required: false, description: '文本样式' },
      { name: 'smartInvert', type: 'boolean', required: false, description: '智能反色' }
    ]
  },
  'IDataType': {
    description: '数据类型配置',
    properties: [
      { name: 'id', type: 'StringOrNumber', required: false, description: '数据集ID' },
      { name: 'values', type: 'any[]', required: false, description: '数据值' },
      { name: 'transforms', type: 'IDataTransform[]', required: false, description: '数据变换' }
    ]
  },
  'ISeriesStyle': {
    description: '系列样式配置',
    properties: [
      { name: 'fill', type: 'string', required: false, description: '填充色' },
      { name: 'stroke', type: 'string', required: false, description: '边框色' },
      { name: 'lineWidth', type: 'number', required: false, description: '线宽' },
      { name: 'opacity', type: 'number', required: false, description: '透明度' }
    ]
  },
  'ITotalLabelSpec': {
    description: '汇总标签配置',
    properties: [
      { name: 'visible', type: 'boolean', required: false, description: '是否显示', defaultValue: 'true' },
      { name: 'position', type: '"top" | "middle" | "bottom"', required: false, description: '标签位置' },
      { name: 'style', type: 'ITextMarkSpec', required: false, description: '文本样式' },
      { name: 'formatter', type: 'string | ((value: any) => string)', required: false, description: '格式化函数' }
    ]
  },
  'IMorphSeriesSpec': {
    description: '变形动画配置',
    properties: [
      { name: 'enable', type: 'boolean', required: false, description: '是否启用', defaultValue: 'false' },
      { name: 'morphKey', type: 'string', required: false, description: '变形关键字段' },
      { name: 'morphElementKey', type: 'string', required: false, description: '变形元素关键字段' }
    ]
  },
  'ISeriesTooltipSpec': {
    description: '系列提示框配置',
    properties: [
      { name: 'visible', type: 'boolean', required: false, description: '是否显示', defaultValue: 'true' },
      { name: 'mark', type: 'ITooltipMarkSpec', required: false, description: '提示框样式' },
      { name: 'content', type: 'ITooltipContentSpec[]', required: false, description: '内容配置' }
    ]
  },
  'IHoverSpec': {
    description: '悬停交互配置',
    properties: [
      { name: 'enable', type: 'boolean', required: false, description: '是否启用', defaultValue: 'true' },
      { name: 'blurOthersOnHover', type: 'boolean', required: false, description: '悬停时模糊其他元素' },
      { name: 'disableActiveState', type: 'boolean', required: false, description: '禁用激活状态' }
    ]
  },
  'ISelectSpec': {
    description: '选择交互配置',
    properties: [
      { name: 'enable', type: 'boolean', required: false, description: '是否启用', defaultValue: 'true' },
      { name: 'mode', type: '"single" | "multiple"', required: false, description: '选择模式' },
      { name: 'reverseSelect', type: 'boolean', required: false, description: '反向选择' }
    ]
  },
  'IInteractionItemSpec': {
    description: '交互项配置',
    properties: [
      { name: 'type', type: 'string', required: true, description: '交互类型' },
      { name: 'config', type: 'any', required: false, description: '交互配置' }
    ]
  },
  'IStateAnimateSpec': {
    description: '状态动画配置',
    properties: [
      { name: 'duration', type: 'number', required: false, description: '动画时长' },
      { name: 'easing', type: 'string', required: false, description: '缓动函数' },
      { name: 'delay', type: 'number', required: false, description: '延迟时间' }
    ]
  },
  'IMarkAnimateSpec': {
    description: '图元动画配置',
    properties: [
      { name: 'duration', type: 'number', required: false, description: '动画时长' },
      { name: 'easing', type: 'string', required: false, description: '缓动函数' },
      { name: 'delay', type: 'number', required: false, description: '延迟时间' },
      { name: 'loop', type: 'boolean', required: false, description: '是否循环' }
    ]
  },
  'ICommonStateAnimateSpec': {
    description: '通用状态动画配置',
    properties: [
      { name: 'duration', type: 'number', required: false, description: '动画时长' },
      { name: 'easing', type: 'string', required: false, description: '缓动函数' },
      { name: 'delay', type: 'number', required: false, description: '延迟时间' }
    ]
  }
};

// 类型分析器
class TypeAnalyzer {
  static isSimpleType(type) {
    // 检查是否为基础类型
    if (simpleTypes.includes(type)) return true;
    
    // 检查是否为字面量类型 (如 "area", "vertical")
    if (type.startsWith('"') && type.endsWith('"')) return true;
    
    // 检查是否为枚举值联合类型 (如 "a" | "b" | "c")
    if (type.includes('|') && type.split('|').every(t => t.trim().startsWith('"') && t.trim().endsWith('"'))) {
      return true;
    }
    
    return false;
  }
  
  static extractFirstGenericParameter(content) {
    // 提取第一个泛型参数，考虑嵌套的尖括号
    // 例如：'IVisualSpecScale<unknown, string>, "id"' -> 'IVisualSpecScale<unknown, string>'
    // 例如：'ITheme, "name"' -> 'ITheme'
    
    let depth = 0;
    let inQuotes = false;
    let quoteChar = '';
    
    for (let i = 0; i < content.length; i++) {
      const char = content[i];
      
      if (!inQuotes && (char === '"' || char === "'")) {
        inQuotes = true;
        quoteChar = char;
      } else if (inQuotes && char === quoteChar) {
        inQuotes = false;
        quoteChar = '';
      } else if (!inQuotes && char === '<') {
        depth++;
      } else if (!inQuotes && char === '>') {
        depth--;
      } else if (!inQuotes && char === ',' && depth === 0) {
        return content.substring(0, i).trim();
      }
    }
    
    return content.trim();
  }

  static parseGenericParameters(genericType) {
    // 解析泛型参数，考虑嵌套的尖括号
    // 例如：'unknown, string' -> ['unknown', 'string']
    // 例如：'IMarkSpec<ISymbolMarkSpec>, number' -> ['IMarkSpec<ISymbolMarkSpec>', 'number']
    
    const params = [];
    let current = '';
    let depth = 0;
    let inQuotes = false;
    let quoteChar = '';
    
    for (let i = 0; i < genericType.length; i++) {
      const char = genericType[i];
      
      if (!inQuotes && (char === '"' || char === "'")) {
        inQuotes = true;
        quoteChar = char;
        current += char;
      } else if (inQuotes && char === quoteChar) {
        inQuotes = false;
        quoteChar = '';
        current += char;
      } else if (!inQuotes && char === '<') {
        depth++;
        current += char;
      } else if (!inQuotes && char === '>') {
        depth--;
        current += char;
      } else if (!inQuotes && char === ',' && depth === 0) {
        if (current.trim()) {
          params.push(current.trim());
        }
        current = '';
      } else {
        current += char;
      }
    }
    
    if (current.trim()) {
      params.push(current.trim());
    }
    
    return params;
  }

  static extractDependencies(type) {
    const dependencies = [];
    
    // TypeScript 工具类型列表，这些不应该被当作依赖
    const utilityTypes = new Set([
      'Omit', 'Pick', 'Partial', 'Required', 'Readonly', 'Record', 
      'Exclude', 'Extract', 'NonNullable', 'ReturnType', 'Parameters',
      'ConstructorParameters', 'InstanceType', 'ThisParameterType',
      'OmitThisParameter', 'ThisType', 'Uppercase', 'Lowercase',
      'Capitalize', 'Uncapitalize'
    ]);
    
    // 浏览器/Node.js 原生类型，这些也不应该被当作依赖
    const nativeTypes = new Set([
      'HTMLElement', 'Element', 'Node', 'Document', 'Window',
      'Event', 'MouseEvent', 'KeyboardEvent', 'TouchEvent',
      'Promise', 'Error', 'Date', 'RegExp', 'Map', 'Set',
      'WeakMap', 'WeakSet', 'ArrayBuffer', 'DataView',
      'Int8Array', 'Uint8Array', 'Int16Array', 'Uint16Array',
      'Int32Array', 'Uint32Array', 'Float32Array', 'Float64Array'
    ]);
    
    // 移除数组标记、联合类型分隔符等
    const cleanType = type
      .replace(/\[\]/g, '') // 移除数组标记
      .replace(/\s*\|\s*/g, '|'); // 标准化联合类型分隔符
    
    // 分割联合类型
    const typeOptions = cleanType.split('|').map(t => t.trim());
    
    typeOptions.forEach(typeOption => {
      // 跳过简单类型
      if (this.isSimpleType(typeOption)) return;
      
      // 跳过原生类型
      if (nativeTypes.has(typeOption)) return;
      
      // 处理 TypeScript 工具类型 (如 Omit<ITheme, "name"> -> ITheme)
      const utilityMatch = typeOption.match(/(Omit|Pick|Partial|Required|Readonly|Record|Exclude|Extract|NonNullable|ReturnType|Parameters|ConstructorParameters|InstanceType|ThisParameterType|OmitThisParameter|ThisType|Uppercase|Lowercase|Capitalize|Uncapitalize)<(.+)>/);
      if (utilityMatch) {
        const utilityType = utilityMatch[1];
        const innerContent = utilityMatch[2];
        
        // 解析工具类型的第一个参数（基础类型）
        // 例如：Omit<IVisualSpecScale<unknown, string>, "id"> -> IVisualSpecScale<unknown, string>
        const firstParam = this.extractFirstGenericParameter(innerContent);
        
        // 递归提取基础类型的依赖
        const baseDeps = this.extractDependencies(firstParam);
        dependencies.push(...baseDeps);
        return;
      }
      
      // 提取泛型中的类型 (如 IMarkSpec<ISymbolMarkSpec> -> IMarkSpec, ISymbolMarkSpec)
      const genericMatch = typeOption.match(/([A-Z][A-Za-z0-9_]*)<(.+)>/);
      if (genericMatch) {
        const baseType = genericMatch[1];
        const genericType = genericMatch[2];
        
        // 添加基础类型（排除工具类型和原生类型）
        if (!this.isSimpleType(baseType) && !utilityTypes.has(baseType) && !nativeTypes.has(baseType)) {
          dependencies.push(baseType);
        }
        
        // 递归处理泛型类型参数，需要处理嵌套的尖括号
        // 例如：IVisualSpecScale<unknown, string> 中的 "unknown, string"
        const genericParams = this.parseGenericParameters(genericType);
        genericParams.forEach(param => {
          const paramDeps = this.extractDependencies(param);
          dependencies.push(...paramDeps);
        });
      } else if (typeOption.match(/^[A-Z][A-Za-z0-9_]*$/) && !utilityTypes.has(typeOption) && !nativeTypes.has(typeOption)) {
        // 单个接口类型（排除工具类型和原生类型）
        dependencies.push(typeOption);
      }
    });
    
    return [...new Set(dependencies)]; // 去重
  }
  
  static resolveType(type) {
    // 先检查是否为枚举类型
    if (enumTypes[type]) {
      return {
        resolvedType: enumTypes[type],
        isSimple: true,
        dependencies: []
      };
    }
    
    const dependencies = this.extractDependencies(type);
    const isSimple = this.isSimpleType(type) && dependencies.length === 0;
    
    return {
      resolvedType: type,
      isSimple,
      dependencies
    };
  }
}

// 辅助函数：创建属性对象
function createProperty(name, description, type, required = false, category, options = {}) {
  const typeAnalysis = TypeAnalyzer.resolveType(type);
  
  return {
    name,
    description,
    type: typeAnalysis.resolvedType,
    originalType: type, // 保留原始类型
    required,
    category,
    isSimple: typeAnalysis.isSimple,
    dependencies: typeAnalysis.dependencies,
    ...options // 支持 since, defaultValue 等额外选项
  };
}

// IAreaChartSpec 完整实现分析
const areaChartSpecMeta = {
  typeName: 'IAreaChartSpec',
  description: '面积图图表配置规范的完整实现分析',
  
  // 继承关系树
  inheritanceTree: {
    'IAreaChartSpec': {
      description: '面积图图表规范，扩展了笛卡尔坐标系图表和面积系列配置',
      directExtends: ['ICartesianChartSpec', 'IChartExtendsSeriesSpec<IAreaSeriesSpec>'],
      ownProperties: [
        createProperty('type', '图表类型，面积图固定为 "area"', '"area"', true, '基础标识'),
        createProperty('series', '系列配置数组，定义面积图的系列', 'IAreaSeriesSpec[]', false, '系列配置')
      ]
    },
    
    'ICartesianChartSpec': {
      description: '笛卡尔坐标系图表配置规范，扩展了基础图表配置',
      directExtends: ['IChartSpec'],
      ownProperties: [
        createProperty('direction', '图表的方向配置。vertical: 垂直布局，horizontal: 水平布局', 'DirectionType', false, '布局方向'),
        createProperty('axes', '笛卡尔坐标系的坐标轴配置', 'ICartesianAxisSpec[]', false, '坐标系统'),
        createProperty('crosshair', '十字辅助线配置', 'ICartesianCrosshairSpec | ICartesianCrosshairSpec[]', false, '辅助元素'),
        createProperty('markLine', '参考线配置', 'IMarkLineSpec | IMarkLineSpec[]', false, '辅助元素'),
        createProperty('markArea', '参考区域配置', 'IMarkAreaSpec | IMarkAreaSpec[]', false, '辅助元素'),
        createProperty('markPoint', '参考点配置', 'IMarkPointSpec | IMarkPointSpec[]', false, '辅助元素')
      ]
    },
    
    'IChartSpec': {
      description: '图表基础配置规范，包含图表的核心功能配置',
      directExtends: [],
      ownProperties: [
        // 基础配置
        createProperty('data', '图表数据配置', 'IData', false, '数据源'),
        createProperty('width', '画布宽度', 'number', false, '画布尺寸'),
        createProperty('height', '画布高度', 'number', false, '画布尺寸'),
        createProperty('autoFit', '图表宽高是否自适应容器，浏览器环境下默认为 true', 'boolean', false, '画布尺寸'),
        createProperty('padding', '图表整体 padding 设置', 'ILayoutPaddingSpec', false, '布局设置'),
        createProperty('region', 'region配置', 'RegionSpec[]', false, '布局设置'),
        createProperty('layout', '布局配置', 'ILayoutSpec', false, '布局设置'),
        
        // 样式配置
        createProperty('color', '图表色系配置', 'string[] | Omit<IVisualSpecScale<unknown, string>, "id">', false, '色彩主题'),
        createProperty('theme', '图表上的主题定义。可以直接配置主题名，前提是该主题名已经注册', 'Omit<ITheme, "name"> | string', false, '色彩主题'),
        createProperty('background', '图表背景色配置，优先级高于构造函数中的 background 配置', 'IBackgroundSpec', false, '色彩主题', { since: '1.11.6' }),
        createProperty('scales', '全局 scale 配置', 'IVisualSpecScale<unknown, unknown>[]', false, '色彩主题'),
        
        // 组件配置
        createProperty('title', '图表标题配置', 'ITitleSpec', false, '图表组件'),
        createProperty('legends', '图例配置', 'ILegendSpec | ILegendSpec[]', false, '图表组件'),
        createProperty('tooltip', 'tooltip配置', 'ITooltipSpec', false, '图表组件'),
        createProperty('dataZoom', '缩略轴配置', 'IDataZoomSpec | IDataZoomSpec[]', false, '图表组件'),
        createProperty('scrollBar', '滚动条配置', 'IScrollBarSpec | IScrollBarSpec[]', false, '图表组件'),
        createProperty('player', '播放器配置', 'IPlayer', false, '图表组件'),
        
        // 交互配置
        createProperty('brush', '框选配置', 'IBrushSpec', false, '交互功能'),
        
        // 系列相关
        createProperty('seriesStyle', '系列样式，仅在图表配置了seriesField时生效', 'ISeriesStyle', false, '系列样式'),
        createProperty('animationThreshold', '自动关闭动画的阀值，对应的是单系列data的长度', 'number', false, '动画控制', { since: '1.2.0' }),
        createProperty('stackInverse', '堆积时是否逆序', 'boolean', false, '数据处理', { defaultValue: 'false', since: '1.4.0' }),
        createProperty('stackSort', '堆积时是否排序', 'boolean', false, '数据处理', { defaultValue: 'false', since: '1.10.4' }),
        
        // 扩展功能
        createProperty('customMark', '自定义mark', 'ICustomMarkSpec<EnableMarkType>[]', false, '扩展功能'),
        createProperty('media', '媒体查询配置', 'IMediaQuerySpec', false, '响应式', { since: '1.8.0' })
      ]
    },
    
    'IChartExtendsSeriesSpec<IAreaSeriesSpec>': {
      description: 'IAreaSeriesSpec 的扩展配置，排除了 data, morph, stackValue, tooltip 字段',
      note: 'type IChartExtendsSeriesSpec<T extends ISeriesSpec> = Omit<T, "data" | "morph" | "stackValue" | "tooltip">',
      directExtends: ['IAreaSeriesSpec (Omit data, morph, stackValue, tooltip)'],
      ownProperties: [] // 这是一个类型别名，不直接拥有属性
    },
    
    'IAreaSeriesSpec': {
      description: '面积系列配置规范，定义面积图系列的所有特性',
      directExtends: ['ICartesianSeriesSpec', 'IAnimationSpec<AreaMarks, AreaAppearPreset>', 'IMarkProgressiveConfig', 'IDataSamping', 'IMarkOverlap'],
      ownProperties: [
        createProperty('type', '系列类型，面积系列固定为 "area"', '"area"', true, '系列标识'),
        createProperty('xField', 'x轴字段', 'string | string[]', false, '数据映射'),
        createProperty('yField', 'y轴字段', 'string | string[]', false, '数据映射'),
        createProperty('point', '点图元配置', 'IMarkSpec<ISymbolMarkSpec>', false, '图元样式'),
        createProperty('line', '线图元配置', 'IMarkSpec<ILineMarkSpec>', false, '图元样式'),
        createProperty('area', '面积图元配置', 'IMarkSpec<IAreaMarkSpec>', false, '图元样式'),
        createProperty('label', '标签配置，支持 inside-middle 标签位置', 'IMultiLabelSpec<...>', false, '标签配置', { since: '1.13.1' }),
        createProperty('areaLabel', '面积图元标签配置，支持起点和终点位置', 'Omit<ILabelSpec, "position"> & { position?: "start" | "end" }', false, '标签配置', { since: '1.7.0' }),
        createProperty('seriesMark', '系列主 mark 类型配置，该配置会影响图例的展示', '"point" | "line" | "area"', false, '系列行为', { defaultValue: '"area"', since: '1.2.0' }),
        createProperty('activePoint', '是否使用额外的 activePoint 显示交互点，可以在点隐藏时显示被交互的点', 'boolean', false, '交互增强', { defaultValue: 'false', since: '1.3.0' })
      ]
    },
    
    'ICartesianSeriesSpec': {
      description: '笛卡尔坐标系系列配置规范',
      directExtends: ['ISeriesSpec'],
      ownProperties: [
        createProperty('direction', '布局方向，row表示按行布局，col表示按列布局', 'DirectionType', false, '坐标系统'),
        createProperty('xField', 'x轴字段', 'string | string[]', false, '数据映射'),
        createProperty('x2Field', '用于区间数据，声明区间末尾的数据字段', 'string', false, '数据映射'),
        createProperty('yField', 'y轴字段，运行双轴都为离散，连续。所以 yField 也可以像 xField 一样支持多维度', 'string | string[]', false, '数据映射'),
        createProperty('y2Field', '用于区间数据，声明区间末尾的数据字段', 'string', false, '数据映射'),
        createProperty('zField', 'z轴字段，用于3d散点图等', 'string | string[]', false, '数据映射'),
        createProperty('sortDataByAxis', '是否将数据按照数轴排序', 'boolean', false, '数据处理', { defaultValue: 'false', since: '1.3.0' })
      ]
    },
    
    'ISeriesSpec': {
      description: '系列基础配置规范，定义所有系列通用的配置',
      directExtends: ['IInteractionSpec'],
      ownProperties: [
        // 基础标识
        createProperty('type', '系列类型', 'SeriesType', false, '系列标识'),
        createProperty('name', '系列名称', 'string', false, '系列标识'),
        createProperty('id', '用户自定义的 series id', 'StringOrNumber', false, '系列标识'),
        
        // 数据关联
        createProperty('data', '系列数据，系列可以配置自身的数据，也可以从chart.data中获取数据', 'IDataType', false, '数据源'),
        createProperty('dataIndex', '系列关联的数据索引', 'number', false, '数据关联', { defaultValue: '0' }),
        createProperty('dataId', '系列关联的数据id', 'StringOrNumber', false, '数据关联'),
        createProperty('dataKey', 'dataKey用于绑定数据与Mark的关系, 该配置在动画中非常重要', 'DataKeyType', false, '数据关联'),
        
        // 布局关联
        createProperty('regionIndex', '系列关联的region索引', 'number', false, '布局关联', { defaultValue: '0' }),
        createProperty('regionId', '系列关联的region id', 'StringOrNumber', false, '布局关联'),
        createProperty('zIndex', 'z轴层级，只在通过series配置时生效', 'number', false, '布局关联'),
        
        // 系列分组
        createProperty('seriesField', '分组字段', 'string', false, '系列分组'),
        createProperty('seriesStyle', '系列样式，仅在图表配置了seriesField时生效', 'ISeriesStyle', false, '系列分组'),
        
        // 数据处理
        createProperty('stack', '是否对数据进行堆叠处理', 'boolean', false, '数据处理'),
        createProperty('stackValue', '堆叠时的分组值，stackValue 相等的系列将在一起堆积。没有配置的系列将在一组', 'StringOrNumber', false, '数据处理', { since: '1.4.0' }),
        createProperty('totalLabel', '堆叠汇总标签', 'ITotalLabelSpec', false, '数据处理', { since: '1.3.0' }),
        createProperty('percent', '是否对数据进行百分比处理', 'boolean', false, '数据处理'),
        createProperty('stackOffsetSilhouette', '是否围绕中心轴偏移轮廓', 'boolean', false, '数据处理'),
        createProperty('invalidType', '非合规数据点连接方式。null，undefined等非法数据点连接方式', 'IInvalidType', false, '数据处理', { defaultValue: '"break"' }),
        
        // 动画配置
        createProperty('animation', '是否开启系列动画', 'boolean', false, '动画控制'),
        createProperty('animationThreshold', '自动关闭动画的阀值，对应的是单系列data的长度', 'number', false, '动画控制', { since: '1.2.0' }),
        createProperty('morph', 'morph 动画配置', 'IMorphSeriesSpec', false, '动画控制'),
        
        // 3D支持
        createProperty('support3d', '是否支持3d视角', 'boolean', false, '3D渲染'),
        
        // 扩展功能
        createProperty('extensionMark', '系列的扩展mark，能够获取系列上的数据', '(IExtensionMarkSpec<Exclude<EnableMarkType, "group">> | IExtensionGroupMarkSpec)[]', false, '扩展功能'),
        
        // 交互提示
        createProperty('tooltip', '系列对应的提示信息设置，优先级高于图表的tooltip配置', 'ISeriesTooltipSpec', false, '交互提示')
      ]
    },
    
    'IInteractionSpec': {
      description: '交互配置规范，定义系列的交互行为',
      directExtends: [],
      ownProperties: [
        createProperty('hover', 'hover交互配置', 'IHoverSpec | boolean', false, '交互行为'),
        createProperty('select', '选中交互配置', 'ISelectSpec | boolean', false, '交互行为'),
        createProperty('interactions', '其他需要按需注册的类型交互', 'IInteractionItemSpec[]', false, '交互行为')
      ]
    },
    
    'IAnimationSpec<AreaMarks, AreaAppearPreset>': {
      description: '面积图动画配置规范，支持 point、line、area 图元的动画',
      note: 'AreaMarks = "point" | "line" | "area", AreaAppearPreset = "clipIn" | "fadeIn" | "grow"',
      directExtends: [],
      ownProperties: [
        createProperty('animationAppear', '图表入场动画，支持配置图表内置不同动画效果', 'boolean | IStateAnimateSpec<AreaAppearPreset> | IMarkAnimateSpec<AreaMarks>', false, '入场动画'),
        createProperty('animationEnter', '数据更新 - 新增数据动画', 'boolean | ICommonStateAnimateSpec | IMarkAnimateSpec<AreaMarks>', false, '数据动画'),
        createProperty('animationUpdate', '数据更新 - 数据更新动画', 'boolean | ICommonStateAnimateSpec | IMarkAnimateSpec<AreaMarks>', false, '数据动画'),
        createProperty('animationExit', '数据更新 - 数据删除动画', 'boolean | ICommonStateAnimateSpec | IMarkAnimateSpec<AreaMarks>', false, '数据动画')
      ]
    },
    
    'IMarkProgressiveConfig': {
      description: '图元渐进式渲染配置，用于大数据场景的渲染优化',
      directExtends: [],
      ownProperties: [
        createProperty('large', '是否开启大数据渲染模式，开启后会降低渲染的精度', 'boolean', false, '大数据渲染'),
        createProperty('largeThreshold', '开启大数据渲染优化的阀值，对应的是data的长度;推荐 largeThreshold < progressiveThreshold', 'number', false, '大数据渲染'),
        createProperty('progressiveStep', '分片长度', 'number', false, '渐进渲染'),
        createProperty('progressiveThreshold', '开启分片渲染的阀值，对应的是单系列data的长度', 'number', false, '渐进渲染')
      ]
    },
    
    'IDataSamping': {
      description: '数据采样配置，用于大数据场景的数据优化',
      directExtends: [],
      ownProperties: [
        createProperty('activePoint', '是否使用额外的 activePoint 显示交互点，可以在点隐藏时显示被交互的点', 'boolean', false, '交互优化', { defaultValue: 'false', since: '1.3.0' }),
        createProperty('sampling', '数据采样 - 采样方法', 'ISamplingMethod', false, '数据采样', { since: '1.6.0' }),
        createProperty('samplingFactor', '数据采样 - 采样系数', 'number', false, '数据采样', { defaultValue: '1', since: '1.6.0' })
      ]
    },
    
    'IMarkOverlap': {
      description: '图元重叠处理配置，用于优化密集数据的显示效果',
      directExtends: [],
      ownProperties: [
        createProperty('pointDis', '标记点之间的距离，px', 'number', false, '重叠控制', { since: '1.6.0' }),
        createProperty('pointDisMul', '标记点之间的距离， pointSize 的倍数', 'number', false, '重叠控制', { defaultValue: '1', since: '1.6.0' }),
        createProperty('pointOverlapTolerance', '是否允许标记图形相互覆盖', 'boolean', false, '重叠控制', { defaultValue: 'false', since: '1.6.0' })
      ]
    }
  }
};

// 生成复杂类型的完整 TypeScript 定义，专为大模型代码生成优化
function generateComplexTypeDefinitions() {
  const allComplexTypes = new Set();
  
  // 收集所有依赖的复杂类型
  Object.values(areaChartSpecMeta.inheritanceTree).forEach(interfaceConfig => {
    if (interfaceConfig.ownProperties) {
      interfaceConfig.ownProperties.forEach(prop => {
        if (prop.dependencies) {
          prop.dependencies.forEach(dep => allComplexTypes.add(dep));
        }
      });
    }
  });
  
  const typeDefinitions = {};
  
  // 为每个复杂类型生成完整的 TypeScript 接口定义
  allComplexTypes.forEach(typeName => {
    if (complexTypeDefinitions[typeName]) {
      const definition = complexTypeDefinitions[typeName];
      
      // 生成 TypeScript 接口代码
      let interfaceCode = `interface ${typeName} {\n`;
      
      definition.properties.forEach(prop => {
        const optional = prop.required ? '' : '?';
        const propType = expandComplexType(prop.type);
        const comment = prop.description ? `  /** ${prop.description} */\n` : '';
        
        interfaceCode += comment;
        interfaceCode += `  ${prop.name}${optional}: ${propType};\n`;
      });
      
      interfaceCode += '}';
      
      typeDefinitions[typeName] = {
        description: definition.description,
        typescriptCode: interfaceCode,
        properties: definition.properties.map(prop => ({
          ...prop,
          expandedType: expandComplexType(prop.type),
          ...TypeAnalyzer.resolveType(prop.type)
        })),
        usageNote: '可以直接使用 typescriptCode 中的接口定义进行代码生成'
      };
    } else {
      // 为未定义的复杂类型生成简化版本
      typeDefinitions[typeName] = {
        description: `${typeName} 接口配置`,
        typescriptCode: `interface ${typeName} {\n  [key: string]: any;\n}`,
        properties: [],
        note: '此类型定义需要从源码中进一步解析',
        usageNote: '使用通用对象类型，具体属性需要根据实际需求定义'
      };
    }
  });
  
  return typeDefinitions;
}

// 展开复杂类型为大模型可理解的具体类型
function expandComplexType(type) {
  // 如果是简单类型，直接返回
  if (TypeAnalyzer.isSimpleType(type)) {
    return type;
  }
  
  // 处理数组类型
  if (type.endsWith('[]')) {
    const baseType = type.slice(0, -2);
    return `${expandComplexType(baseType)}[]`;
  }
  
  // 处理联合类型
  if (type.includes('|')) {
    return type.split('|').map(t => expandComplexType(t.trim())).join(' | ');
  }
  
  // 处理已知的复杂类型，展开为具体定义
  const complexTypeMapping = {
    'ICartesianAxisSpec': `{
  orient: "left" | "right" | "top" | "bottom";
  type?: "linear" | "band" | "point" | "time" | "log";
  domain?: [number, number] | string[];
  range?: [number, number];
  title?: {
    visible?: boolean;
    text?: string;
    style?: {
      fontSize?: number;
      fill?: string;
      fontWeight?: string | number;
    };
  };
  label?: {
    visible?: boolean;
    style?: {
      fontSize?: number;
      fill?: string;
    };
    formatter?: (value: any) => string;
  };
  tick?: {
    visible?: boolean;
    length?: number;
    style?: {
      stroke?: string;
      lineWidth?: number;
    };
  };
  grid?: {
    visible?: boolean;
    style?: {
      stroke?: string;
      lineWidth?: number;
      lineDash?: number[];
    };
  };
  visible?: boolean;
}`,
    
    'ICartesianCrosshairSpec': `{
  xField?: string;
  yField?: string;
  trigger?: "hover" | "click" | "none";
  line?: {
    stroke?: string;
    lineWidth?: number;
    lineDash?: number[];
    opacity?: number;
  };
  label?: {
    visible?: boolean;
    position?: "top" | "bottom" | "left" | "right";
    style?: {
      fontSize?: number;
      fill?: string;
      backgroundColor?: string;
      padding?: number[];
    };
  };
  container?: string;
}`,
    
    'IMarkLineSpec': `{
  coordinates?: { x?: number | string; y?: number | string }[];
  line?: {
    stroke?: string;
    lineWidth?: number;
    lineDash?: number[];
    opacity?: number;
  };
  label?: {
    visible?: boolean;
    text?: string;
    position?: "start" | "middle" | "end";
    style?: {
      fontSize?: number;
      fill?: string;
    };
  };
}`,
    
    'IMarkAreaSpec': `{
  coordinates?: { x?: number | string; y?: number | string }[];
  area?: {
    fill?: string;
    fillOpacity?: number;
    stroke?: string;
    strokeOpacity?: number;
  };
  label?: {
    visible?: boolean;
    text?: string;
    style?: {
      fontSize?: number;
      fill?: string;
    };
  };
}`,
    
    'IMarkPointSpec': `{
  coordinates?: { x?: number | string; y?: number | string }[];
  symbol?: {
    symbolType?: "circle" | "square" | "diamond" | "triangle";
    size?: number;
    fill?: string;
    stroke?: string;
    lineWidth?: number;
  };
  label?: {
    visible?: boolean;
    text?: string;
    style?: {
      fontSize?: number;
      fill?: string;
    };
  };
}`,
    
    'IData': `{
  id?: string | number;
  values?: any[];
  fields?: { [key: string]: { type: "number" | "string" | "boolean" } };
  transforms?: Array<{
    type: string;
    [key: string]: any;
  }>;
}`,
    
    'ILayoutPaddingSpec': `{
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
} | number | number[]`,
    
    'ILayoutSpec': `{
  type?: "grid" | "normal";
  col?: number;
  row?: number;
  elements?: Array<{
    modelId: string;
    col?: number;
    row?: number;
    colSpan?: number;
    rowSpan?: number;
  }>;
}`,
    
    'IBackgroundSpec': `{
  fill?: string;
  cornerRadius?: number;
  stroke?: string;
  lineWidth?: number;
}`,
    
    'ITitleSpec': `{
  visible?: boolean;
  text?: string;
  subtext?: string;
  align?: "left" | "center" | "right";
  textStyle?: {
    fontSize?: number;
    fontWeight?: string | number;
    fill?: string;
    lineHeight?: number;
  };
  subtextStyle?: {
    fontSize?: number;
    fill?: string;
    lineHeight?: number;
  };
  padding?: number | number[];
}`,
    
    'ILegendSpec': `{
  visible?: boolean;
  orient?: "left" | "right" | "top" | "bottom";
  position?: "start" | "middle" | "end";
  item?: {
    visible?: boolean;
    background?: {
      visible?: boolean;
      style?: {
        fill?: string;
        cornerRadius?: number;
      };
    };
    label?: {
      style?: {
        fontSize?: number;
        fill?: string;
      };
      space?: number;
    };
    shape?: {
      style?: {
        size?: number;
        fill?: string;
        stroke?: string;
      };
    };
  };
  title?: {
    visible?: boolean;
    text?: string;
    style?: {
      fontSize?: number;
      fill?: string;
      fontWeight?: string | number;
    };
  };
}`,
    
    'ITooltipSpec': `{
  visible?: boolean;
  trigger?: "hover" | "click" | "none";
  mark?: {
    visible?: boolean;
    style?: {
      fill?: string;
      stroke?: string;
      cornerRadius?: number;
      shadowColor?: string;
      shadowBlur?: number;
    };
  };
  content?: Array<{
    key?: string;
    value?: string | ((datum: any) => string);
    hasShape?: boolean;
    shapeType?: "circle" | "square" | "line";
  }>;
  offset?: { x?: number; y?: number };
}`,
    
    'IMarkSpec': `{
  visible?: boolean;
  interactive?: boolean;
  style?: T;
  state?: {
    hover?: T;
    selected?: T;
    [stateName: string]: T;
  };
}`,
    
    'ISymbolMarkSpec': `{
  symbolType?: "circle" | "square" | "diamond" | "triangle" | "star" | "cross";
  size?: number;
  fill?: string;
  stroke?: string;
  lineWidth?: number;
  opacity?: number;
  fillOpacity?: number;
  strokeOpacity?: number;
}`,
    
    'ILineMarkSpec': `{
  stroke?: string;
  lineWidth?: number;
  lineDash?: number[];
  opacity?: number;
  lineCap?: "butt" | "round" | "square";
  lineJoin?: "miter" | "round" | "bevel";
}`,
    
    'IAreaMarkSpec': `{
  fill?: string;
  fillOpacity?: number;
  stroke?: string;
  strokeOpacity?: number;
  lineWidth?: number;
  lineDash?: number[];
}`,
    
    'ILabelSpec': `{
  visible?: boolean;
  position?: "top" | "bottom" | "left" | "right" | "center";
  offset?: number | { x?: number; y?: number };
  style?: {
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string | number;
    fill?: string;
    stroke?: string;
    lineWidth?: number;
    textAlign?: "left" | "center" | "right";
    textBaseline?: "top" | "middle" | "bottom";
  };
  formatter?: string | ((value: any, datum?: any) => string);
}`,
    
    'IMultiLabelSpec': `{
  visible?: boolean;
  position?: "top" | "bottom" | "left" | "right" | "center" | "inside-middle";
  offset?: number | { x?: number; y?: number };
  style?: {
    fontSize?: number;
    fill?: string;
    fontWeight?: string | number;
  };
  smartInvert?: boolean;
  formatter?: string | ((value: any) => string);
}`,
    
    'ISeriesStyle': `{
  fill?: string;
  stroke?: string;
  lineWidth?: number;
  opacity?: number;
  fillOpacity?: number;
  strokeOpacity?: number;
}`,
    
    'IHoverSpec': `{
  enable?: boolean;
  blurOthersOnHover?: boolean;
  disableActiveState?: boolean;
}`,
    
    'ISelectSpec': `{
  enable?: boolean;
  mode?: "single" | "multiple";
  reverseSelect?: boolean;
}`,
    
    'IInteractionItemSpec': `{
  type: string;
  config?: any;
}`,
    
    'IVisualSpecScale': `{
  type?: "linear" | "ordinal" | "band" | "point" | "time";
  domain?: any[];
  range?: any[];
  [key: string]: any;
}`
  };
  
  // 如果有预定义的映射，使用具体定义
  if (complexTypeMapping[type]) {
    return complexTypeMapping[type];
  }
  
  // 处理泛型类型
  if (type.includes('<')) {
    const baseType = type.split('<')[0];
    if (complexTypeMapping[baseType]) {
      return complexTypeMapping[baseType];
    }
  }
  
  // 处理工具类型 (如 Omit<T, K>)
  const utilityMatch = type.match(/(Omit|Pick|Partial|Required)<([^,>]+)(?:,\s*[^>]*)?>/);
  if (utilityMatch) {
    const baseType = utilityMatch[2].trim();
    const expandedBase = expandComplexType(baseType);
    
    // 对于 Omit/Pick 等，返回展开的基础类型（简化处理）
    return expandedBase;
  }
  
  // 默认返回通用对象类型
  return `{ [key: string]: any }`;
}

// 生成增强统计信息（增强版）
function generateEnhancedStatistics() {
  const stats = {
    totalInterfaces: Object.keys(areaChartSpecMeta.inheritanceTree).length,
    totalProperties: 0,
    simpleProperties: 0,
    complexProperties: 0,
    categoryCounts: {},
    interfaceCounts: {},
    versionFeatures: {},
    dependencyStats: {},
    typeComplexity: {
      simple: [],
      complex: []
    }
  };

  // 统计每个接口的属性
  Object.entries(areaChartSpecMeta.inheritanceTree).forEach(([interfaceName, config]) => {
    const propCount = config.ownProperties ? config.ownProperties.length : 0;
    let simpleCount = 0;
    let complexCount = 0;
    
    stats.interfaceCounts[interfaceName] = {
      total: propCount,
      simple: 0,
      complex: 0
    };
    stats.totalProperties += propCount;

    // 统计类别分布和类型复杂度
    if (config.ownProperties) {
      config.ownProperties.forEach(prop => {
        const category = prop.category || 'unknown';
        stats.categoryCounts[category] = (stats.categoryCounts[category] || 0) + 1;
        
        // 统计简单/复杂类型
        if (prop.isSimple) {
          stats.simpleProperties++;
          simpleCount++;
          stats.typeComplexity.simple.push({
            interface: interfaceName,
            property: prop.name,
            type: prop.type
          });
        } else {
          stats.complexProperties++;
          complexCount++;
          stats.typeComplexity.complex.push({
            interface: interfaceName,
            property: prop.name,
            type: prop.type,
            dependencies: prop.dependencies
          });
        }
        
        // 统计依赖关系
        if (prop.dependencies && prop.dependencies.length > 0) {
          prop.dependencies.forEach(dep => {
            if (!stats.dependencyStats[dep]) {
              stats.dependencyStats[dep] = [];
            }
            stats.dependencyStats[dep].push({
              interface: interfaceName,
              property: prop.name
            });
          });
        }
        
        // 统计版本特性
        if (prop.since) {
          if (!stats.versionFeatures[prop.since]) {
            stats.versionFeatures[prop.since] = [];
          }
          stats.versionFeatures[prop.since].push({
            interface: interfaceName,
            property: prop.name,
            description: prop.description,
            isSimple: prop.isSimple
          });
        }
      });
    }
    
    stats.interfaceCounts[interfaceName].simple = simpleCount;
    stats.interfaceCounts[interfaceName].complex = complexCount;
  });

  return stats;
}

// 生成继承关系图
function generateInheritanceGraph() {
  const graph = {
    root: 'IAreaChartSpec',
    relationships: []
  };

  Object.entries(areaChartSpecMeta.inheritanceTree).forEach(([interfaceName, config]) => {
    if (config.directExtends && config.directExtends.length > 0) {
      config.directExtends.forEach(parent => {
        graph.relationships.push({
          child: interfaceName,
          parent: parent,
          description: config.description
        });
      });
    }
  });

  return graph;
}

// 生成增强功能分类视图
function generateEnhancedCategoryView() {
  const categories = {};
  
  Object.entries(areaChartSpecMeta.inheritanceTree).forEach(([interfaceName, config]) => {
    if (config.ownProperties) {
      config.ownProperties.forEach(prop => {
        const category = prop.category || 'unknown';
        if (!categories[category]) {
          categories[category] = {
            description: `${category}相关的配置项`,
            properties: [],
            stats: {
              total: 0,
              simple: 0,
              complex: 0
            }
          };
        }
        categories[category].properties.push({
          ...prop,
          fromInterface: interfaceName
        });
        categories[category].stats.total++;
        if (prop.isSimple) {
          categories[category].stats.simple++;
        } else {
          categories[category].stats.complex++;
        }
      });
    }
  });

  return categories;
}

// 生成依赖关系视图
function generateDependencyView() {
  const dependencies = {};
  
  Object.entries(areaChartSpecMeta.inheritanceTree).forEach(([interfaceName, config]) => {
    if (config.ownProperties) {
      config.ownProperties.forEach(prop => {
        if (prop.dependencies && prop.dependencies.length > 0) {
          prop.dependencies.forEach(dep => {
            if (!dependencies[dep]) {
              dependencies[dep] = {
                description: `${dep} 接口依赖关系`,
                usedBy: []
              };
            }
            dependencies[dep].usedBy.push({
              interface: interfaceName,
              property: prop.name,
              description: prop.description,
              type: prop.type
            });
          });
        }
      });
    }
  });
  
  return dependencies;
}

// 生成最终的完整meta配置
function generateCompleteAreaChartSpecMeta() {
  const statistics = generateEnhancedStatistics();
  const inheritanceGraph = generateInheritanceGraph();
  const categoryView = generateEnhancedCategoryView();
  const dependencyView = generateDependencyView();
  const complexTypeDefinitions = generateComplexTypeDefinitions();
  
  return {
    meta: {
      typeName: areaChartSpecMeta.typeName,
      description: areaChartSpecMeta.description,
      statistics,
      enhancements: [
        '🔍 解析枚举类型为具体字符串值',
        '📊 区分简单类型和复杂类型',
        '🔗 添加 dependencies 字段记录复杂类型依赖',
        '📈 提供详细的类型复杂度统计',
        '🌐 生成完整的依赖关系图谱',
        '🚀 提供复杂类型的完整打平定义，专为大模型代码生成优化'
      ],
      generated: new Date().toISOString(),
      aiOptimized: true,
      purpose: '专为大模型代码生成提供完整的类型定义和结构化信息'
    },
    inheritanceTree: areaChartSpecMeta.inheritanceTree,
    inheritanceGraph,
    categoryView,
    dependencyView,
    // 新增：复杂类型的完整定义库
    complexTypeDefinitions,
    summary: {
      coreInterfaces: [
        'IAreaChartSpec',
        'ICartesianChartSpec', 
        'IChartSpec'
      ],
      seriesInterfaces: [
        'IAreaSeriesSpec',
        'ICartesianSeriesSpec',
        'ISeriesSpec',
        'IInteractionSpec'
      ],
      enhancementInterfaces: [
        'IAnimationSpec<AreaMarks, AreaAppearPreset>',
        'IMarkProgressiveConfig',
        'IDataSamping',
        'IMarkOverlap'
      ],
      typeAnalysis: {
        simpleTypeRatio: `${Math.round((statistics.simpleProperties / statistics.totalProperties) * 100)}%`,
        complexTypeRatio: `${Math.round((statistics.complexProperties / statistics.totalProperties) * 100)}%`,
        mostDependedTypes: Object.entries(statistics.dependencyStats)
          .sort((a, b) => b[1].length - a[1].length)
          .slice(0, 5)
          .map(([type, usages]) => ({ type, usageCount: usages.length })),
        totalComplexTypesWithDefinitions: Object.keys(complexTypeDefinitions).length
      }
    },
    // 专为大模型优化的代码生成指南
    codeGenerationGuide: {
      purpose: '此配置专为大模型生成 VChart 面积图代码而设计',
      usage: {
        simpleTypes: '可直接使用的基础类型，无需额外定义',
        complexTypes: '需要参考 complexTypeDefinitions 中的详细定义',
        dependencies: '每个属性的 dependencies 数组列出了所需的复杂类型',
        inheritance: '通过 inheritanceTree 了解接口继承关系'
      },
      recommendations: [
        '优先使用简单类型属性，降低代码复杂度',
        '复杂类型属性需要参考对应的类型定义',
        '根据功能需求选择合适的 category 分类下的属性',
        '注意版本兼容性，检查 since 字段标注的版本要求'
      ]
    }
  };
}

// 输出完整meta配置
const result = generateCompleteAreaChartSpecMeta();

// 保存到本地JSON文件
function saveToJsonFile() {
  const outputDir = __dirname;
  const outputPath = path.join(outputDir, 'area-chart-spec-complete-meta.json');
  
  try {
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');
    console.log(`✅ IAreaChartSpec 完整Meta信息已保存到: ${outputPath}`);
    console.log(`📊 统计信息:`);
    console.log(`  - 总接口数量: ${result.meta.statistics.totalInterfaces}`);
    console.log(`  - 总属性数量: ${result.meta.statistics.totalProperties}`);
    console.log(`  - 简单类型属性: ${result.meta.statistics.simpleProperties} (${result.summary.typeAnalysis.simpleTypeRatio})`);
    console.log(`  - 复杂类型属性: ${result.meta.statistics.complexProperties} (${result.summary.typeAnalysis.complexTypeRatio})`);
    console.log(`  - 功能分类数: ${Object.keys(result.categoryView).length}`);
    console.log(`  - 依赖类型数: ${Object.keys(result.dependencyView).length}`);
    console.log(`  - 🆕 复杂类型定义数: ${result.summary.typeAnalysis.totalComplexTypesWithDefinitions}`);
    console.log(`📂 接口详情:`);
    Object.entries(result.meta.statistics.interfaceCounts).forEach(([interfaceName, counts]) => {
      console.log(`  - ${interfaceName}: ${counts.total} 个属性 (简单: ${counts.simple}, 复杂: ${counts.complex})`);
    });
    console.log(`🔗 最常用的依赖类型:`);
    result.summary.typeAnalysis.mostDependedTypes.forEach(({ type, usageCount }) => {
      console.log(`  - ${type}: 被使用 ${usageCount} 次`);
    });
    console.log(`🎯 复杂类型定义概览:`);
    Object.entries(result.complexTypeDefinitions).forEach(([typeName, definition]) => {
      const propCount = definition.properties ? definition.properties.length : 0;
      console.log(`  - ${typeName}: ${propCount} 个属性 - ${definition.description}`);
    });
    console.log(`🚀 AI代码生成增强功能:`);
    result.meta.enhancements.forEach(enhancement => {
      console.log(`  ${enhancement}`);
    });
    console.log(`\n💡 使用建议:`);
    result.codeGenerationGuide.recommendations.forEach(rec => {
      console.log(`  • ${rec}`);
    });
  } catch (error) {
    console.error('❌ 保存文件失败:', error.message);
  }
}

// 执行保存
saveToJsonFile();

module.exports = { areaChartSpecMeta: result };
