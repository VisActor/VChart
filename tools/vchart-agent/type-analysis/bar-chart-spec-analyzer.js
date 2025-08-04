/**
 * IBarChartSpec 完整实现代码解析器
 * 为大模型代码生成优化版本 - 简化版
 * 参考 area-chart-spec 的分析方法
 */

const fs = require('fs');
const path = require('path');

// 枚举类型定义（与面积图相同的基础枚举，加上柱图特有的）
const enumTypes = {
  'DirectionType': '"vertical" | "horizontal"',
  'SeriesType': '"line" | "area" | "bar" | "scatter" | "pie" | "radar" | "sankey" | "treemap" | "sunburst" | "gauge" | "waterfall" | "box" | "histogram" | "rose" | "circularProgress" | "linearProgress" | "funnel" | "map" | "wordCloud" | "correlation" | "heatmap" | "liquidFill" | "mosaic" | "dot" | "range-column"',
  'StringOrNumber': 'string | number',
  'DataKeyType': 'string | string[] | ((data: any) => string)',
  'IInvalidType': '"break" | "link" | "zero" | "ignore"',
  'ISamplingMethod': '"lttb" | "max" | "min" | "average" | "sum"',
  'EnableMarkType': '"symbol" | "rect" | "line" | "text" | "image" | "path" | "area" | "arc" | "polygon" | "group"',
  'BarMarks': '"bar"',
  'BarAppearPreset': '"grow" | "fadeIn" | "scaleIn"'
};

// 简单类型列表
const simpleTypes = [
  'string', 'number', 'boolean', 'any', 'unknown', 'void', 'null', 'undefined',
  'string[]', 'number[]', 'boolean[]', 'any[]'
];

// 复杂类型的详细定义（继承面积图的定义，增加柱图特有的）
const complexTypeDefinitions = {
  // 继承所有面积图的复杂类型定义
  'ICartesianCrosshairSpec': {
    description: '笛卡尔坐标系十字辅助线配置',
    properties: [
      { name: 'xField', type: 'string', required: false, description: 'x轴字段名' },
      { name: 'yField', type: 'string', required: false, description: 'y轴字段名' },
      { name: 'trigger', type: '"hover" | "click" | "none"', required: false, description: '触发方式' },
      { name: 'line', type: 'ILineMarkSpec', required: false, description: '十字线样式配置' },
      { name: 'label', type: 'ILabelSpec', required: false, description: '标签配置' }
    ]
  },
  'IMarkLineSpec': {
    description: '参考线配置',
    properties: [
      { name: 'coordinates', type: '{ x?: number | string; y?: number | string }[]', required: false, description: '参考线坐标点' },
      { name: 'line', type: 'ILineMarkSpec', required: false, description: '线条样式' },
      { name: 'label', type: 'ILabelSpec', required: false, description: '标签配置' }
    ]
  },
  'IMarkAreaSpec': {
    description: '参考区域配置',
    properties: [
      { name: 'coordinates', type: '{ x?: number | string; y?: number | string }[]', required: false, description: '区域坐标点' },
      { name: 'area', type: 'IAreaMarkSpec', required: false, description: '区域样式' },
      { name: 'label', type: 'ILabelSpec', required: false, description: '标签配置' }
    ]
  },
  'IMarkPointSpec': {
    description: '参考点配置',
    properties: [
      { name: 'coordinates', type: '{ x?: number | string; y?: number | string }[]', required: false, description: '参考点坐标' },
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
      { name: 'visible', type: 'boolean', required: false, description: '是否可见', defaultValue: 'true' }
    ]
  },
  
  // 柱图特有的复杂类型
  'IRectMarkSpec': {
    description: '矩形图元样式配置，用于柱状图柱体',
    properties: [
      { name: 'fill', type: 'string', required: false, description: '填充色' },
      { name: 'stroke', type: 'string', required: false, description: '边框色' },
      { name: 'lineWidth', type: 'number', required: false, description: '边框宽度' },
      { name: 'opacity', type: 'number', required: false, description: '透明度' },
      { name: 'cornerRadius', type: 'number | number[]', required: false, description: '圆角半径' },
      { name: 'width', type: 'number', required: false, description: '宽度' },
      { name: 'height', type: 'number', required: false, description: '高度' }
    ]
  },
  'IBarBackgroundSpec': {
    description: '柱状背景图元配置',
    properties: [
      { name: 'fieldLevel', type: 'number', required: false, description: '决定柱状背景图元显示层级，例如在分组柱状图中的组级别' }
    ]
  },
  'IStackCornerRadiusCallback': {
    description: '堆叠柱圆角回调函数配置',
    properties: [
      { name: 'callback', type: '(attr: IRectGraphicAttribute, datum: Datum, ctx: ISeriesMarkAttributeContext) => number | number[]', required: true, description: '圆角回调函数' }
    ]
  },
  
  // 基础配置类型（继承面积图）
  'IData': {
    description: '数据配置',
    properties: [
      { name: 'id', type: 'StringOrNumber', required: false, description: '数据集ID' },
      { name: 'values', type: 'any[]', required: false, description: '静态数据值' },
      { name: 'fields', type: '{ [key: string]: { type: "number" | "string" | "boolean" } }', required: false, description: '字段类型定义' }
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
  'ITitleSpec': {
    description: '标题配置',
    properties: [
      { name: 'visible', type: 'boolean', required: false, description: '是否显示', defaultValue: 'true' },
      { name: 'text', type: 'string', required: false, description: '标题文本' },
      { name: 'subtext', type: 'string', required: false, description: '副标题文本' },
      { name: 'align', type: '"left" | "center" | "right"', required: false, description: '对齐方式' }
    ]
  },
  'ILegendSpec': {
    description: '图例配置',
    properties: [
      { name: 'visible', type: 'boolean', required: false, description: '是否显示', defaultValue: 'true' },
      { name: 'orient', type: '"left" | "right" | "top" | "bottom"', required: false, description: '图例位置' },
      { name: 'position', type: '"start" | "middle" | "end"', required: false, description: '图例对齐位置' }
    ]
  },
  'ITooltipSpec': {
    description: '提示框配置',
    properties: [
      { name: 'visible', type: 'boolean', required: false, description: '是否显示', defaultValue: 'true' },
      { name: 'trigger', type: '"hover" | "click" | "none"', required: false, description: '触发方式' }
    ]
  },
  'ILabelSpec': {
    description: '标签配置',
    properties: [
      { name: 'visible', type: 'boolean', required: false, description: '是否显示', defaultValue: 'true' },
      { name: 'position', type: '"top" | "bottom" | "left" | "right" | "center"', required: false, description: '标签位置' },
      { name: 'offset', type: 'number', required: false, description: '偏移距离' }
    ]
  },
  'IMultiLabelSpec': {
    description: '多标签配置，支持柱图的复杂标签位置',
    properties: [
      { name: 'visible', type: 'boolean', required: false, description: '是否显示', defaultValue: 'true' },
      { name: 'position', type: '"outside" | "top" | "bottom" | "left" | "right" | "inside" | "inside-top" | "inside-bottom" | "inside-right" | "inside-left" | "top-right" | "top-left" | "bottom-right" | "bottom-left"', required: false, description: '标签位置，支持柱图特有位置' },
      { name: 'offset', type: 'number', required: false, description: '偏移距离' }
    ]
  }
};

// 类型分析器（简化版）
class TypeAnalyzer {
  static isSimpleType(type) {
    if (!type) return true;
    
    // 检查是否为基础简单类型
    if (simpleTypes.includes(type)) return true;
    
    // 检查是否为枚举类型
    if (enumTypes[type]) return true;
    
    // 检查联合类型，如果所有部分都是简单类型，则认为是简单类型
    if (type.includes('|')) {
      const parts = type.split('|').map(p => p.trim());
      return parts.every(part => 
        simpleTypes.includes(part) || 
        enumTypes[part] || 
        part.startsWith('"') || 
        /^[0-9]+$/.test(part)
      );
    }
    
    return false;
  }
  
  static extractDependencies(type) {
    if (!type || this.isSimpleType(type)) return [];
    
    const dependencies = new Set();
    
    // 递归提取依赖的辅助函数
    const extractFromType = (typeStr) => {
      if (!typeStr || this.isSimpleType(typeStr)) return;
      
      // 处理数组类型
      if (typeStr.endsWith('[]')) {
        const baseType = typeStr.slice(0, -2);
        extractFromType(baseType);
        return;
      }
      
      // 处理联合类型
      if (typeStr.includes('|')) {
        const parts = typeStr.split('|').map(p => p.trim());
        parts.forEach(part => extractFromType(part));
        return;
      }
      
      // 处理交叉类型（如 IMarkSpec<IRectMarkSpec> & IBarBackgroundSpec）
      if (typeStr.includes('&')) {
        const parts = typeStr.split('&').map(p => p.trim());
        parts.forEach(part => extractFromType(part));
        return;
      }
      
      // 处理泛型类型（如 IMarkSpec<IRectMarkSpec>）
      if (typeStr.includes('<')) {
        const match = typeStr.match(/^([^<]+)<(.+)>$/);
        if (match) {
          const [, baseType, genericParams] = match;
          
          // 添加基础类型依赖
          if (!this.isSimpleType(baseType) && !enumTypes[baseType]) {
            dependencies.add(baseType);
          }
          
          // 递归处理泛型参数
          this.parseGenericParameters(genericParams).forEach(param => {
            extractFromType(param);
          });
        }
        return;
      }
      
      // 普通复杂类型
      if (!enumTypes[typeStr] && !typeStr.startsWith('"') && !typeStr.match(/^[0-9]+$/)) {
        dependencies.add(typeStr);
      }
    };
    
    extractFromType(type);
    return Array.from(dependencies);
  }
  
  // 解析泛型参数的辅助方法
  static parseGenericParameters(paramStr) {
    const params = [];
    let depth = 0;
    let currentParam = '';
    
    for (let i = 0; i < paramStr.length; i++) {
      const char = paramStr[i];
      
      if (char === '<') {
        depth++;
        currentParam += char;
      } else if (char === '>') {
        depth--;
        currentParam += char;
      } else if (char === ',' && depth === 0) {
        if (currentParam.trim()) {
          params.push(currentParam.trim());
        }
        currentParam = '';
      } else {
        currentParam += char;
      }
    }
    
    if (currentParam.trim()) {
      params.push(currentParam.trim());
    }
    
    return params;
  }
  
  static resolveType(type) {
    const isSimple = this.isSimpleType(type);
    const dependencies = this.extractDependencies(type);
    
    // 解析枚举类型
    let resolvedType = type;
    if (enumTypes[type]) {
      resolvedType = enumTypes[type];
    }
    
    return {
      resolvedType,
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
    originalType: type,
    required,
    category,
    isSimple: typeAnalysis.isSimple,
    dependencies: typeAnalysis.dependencies,
    ...options
  };
}

// IBarChartSpec 完整实现分析
const barChartSpecMeta = {
  typeName: 'IBarChartSpec',
  description: '柱状图图表配置规范的完整实现分析',
  
  // 继承关系树
  inheritanceTree: {
    'IBarChartSpec': {
      description: '柱状图图表规范，扩展了笛卡尔坐标系图表和柱状系列配置',
      directExtends: ['ICartesianChartSpec', 'IChartExtendsSeriesSpec<IBarSeriesSpec>'],
      ownProperties: [
        createProperty('type', '图表类型，柱状图固定为 "bar"', '"bar"', true, '基础标识'),
        createProperty('series', '系列配置数组，定义柱状图的系列', 'IBarSeriesSpec[]', false, '系列配置'),
        createProperty('autoBandSize', '是否开启自动 bandSize。如果开启，会根据传入的 barWidth 等配置自动计算 bandSize', 'boolean | { extend: number }', false, '布局优化', { since: '1.10.0' })
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
        
        // 组件配置
        createProperty('title', '图表标题配置', 'ITitleSpec', false, '图表组件'),
        createProperty('legends', '图例配置', 'ILegendSpec | ILegendSpec[]', false, '图表组件'),
        createProperty('tooltip', 'tooltip配置', 'ITooltipSpec', false, '图表组件'),
        
        // 动画控制
        createProperty('animation', '是否开启动画', 'boolean', false, '动画控制'),
        createProperty('animationThreshold', '自动关闭动画的阀值，对应的是单系列data的长度', 'number', false, '动画控制', { since: '1.2.0' }),
        
        // 数据处理
        createProperty('stackInverse', '堆积时是否逆序', 'boolean', false, '数据处理', { defaultValue: 'false', since: '1.4.0' }),
        createProperty('stackSort', '堆积时是否排序', 'boolean', false, '数据处理', { defaultValue: 'false', since: '1.10.4' })
      ]
    },
    
    'IChartExtendsSeriesSpec<IBarSeriesSpec>': {
      description: 'IBarSeriesSpec 的扩展配置，排除了 data, morph, stackValue, tooltip 字段',
      note: 'type IChartExtendsSeriesSpec<T extends ISeriesSpec> = Omit<T, "data" | "morph" | "stackValue" | "tooltip">',
      directExtends: ['IBarSeriesSpec (Omit data, morph, stackValue, tooltip)'],
      ownProperties: [] // 这是一个类型别名，不直接拥有属性
    },
    
    'IBarSeriesSpec': {
      description: '柱状系列配置规范，定义柱状图系列的所有特性',
      directExtends: ['ICartesianSeriesSpec', 'IAnimationSpec<BarMarks, BarAppearPreset>', 'IMarkProgressiveConfig', 'IDataSamping'],
      ownProperties: [
        createProperty('type', '系列类型，柱状系列固定为 "bar"', '"bar"', true, '系列标识'),
        createProperty('xField', 'x轴字段', 'string | string[]', false, '数据映射'),
        createProperty('yField', 'y轴字段', 'string | string[]', false, '数据映射'),
        
        // 柱体图元配置
        createProperty('bar', '柱体图元配置', 'IMarkSpec<IRectMarkSpec>', false, '图元样式'),
        createProperty('barBackground', '柱状背景图元配置', 'IMarkSpec<IRectMarkSpec> & IBarBackgroundSpec', false, '图元样式', { since: '1.6.0' }),
        createProperty('label', '标签配置，支持柱图特有的位置配置', 'IMultiLabelSpec', false, '标签配置'),
        
        // 柱体尺寸配置
        createProperty('barWidth', '柱体宽度，可以设置绝对的像素值，也可以使用百分比', 'number | string', false, '柱体尺寸'),
        createProperty('barMinWidth', '柱体最小宽度', 'number | string', false, '柱体尺寸'),
        createProperty('barMaxWidth', '柱体最大宽度', 'number | string', false, '柱体尺寸'),
        createProperty('barMinHeight', '柱条最小高度，可用于防止某数据项的值过小的视觉调整', 'number', false, '柱体尺寸', { since: '1.4.0' }),
        
        // 柱体间距配置
        createProperty('barGapInGroup', '分组柱图中各个分组内的柱子间距', 'number | string | (number | string)[]', false, '柱体间距', { since: '1.2.0' }),
        createProperty('barGap', '柱条间 gap 值', 'number', false, '柱体间距', { since: '1.13.11' }),
        
        // 堆叠配置
        createProperty('stackCornerRadius', '堆叠柱整体的圆角，支持回调配置', 'number | number[] | IStackCornerRadiusCallback', false, '堆叠样式', { since: '1.10.0' })
      ]
    },
    
    'ICartesianSeriesSpec': {
      description: '笛卡尔坐标系系列配置规范',
      directExtends: ['ISeriesSpec'],
      ownProperties: [
        createProperty('direction', '布局方向，row表示按行布局，col表示按列布局', 'DirectionType', false, '坐标系统'),
        createProperty('xField', 'x轴字段', 'string | string[]', false, '数据映射'),
        createProperty('x2Field', '用于区间数据，声明区间末尾的数据字段', 'string', false, '数据映射'),
        createProperty('yField', 'y轴字段', 'string | string[]', false, '数据映射'),
        createProperty('y2Field', '用于区间数据，声明区间末尾的数据字段', 'string', false, '数据映射'),
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
        
        // 数据处理
        createProperty('stack', '是否对数据进行堆叠处理', 'boolean', false, '数据处理'),
        createProperty('percent', '是否对数据进行百分比处理', 'boolean', false, '数据处理'),
        createProperty('invalidType', '非合规数据点连接方式', 'IInvalidType', false, '数据处理', { defaultValue: '"break"' }),
        
        // 动画配置
        createProperty('animation', '是否开启系列动画', 'boolean', false, '动画控制'),
        createProperty('animationThreshold', '自动关闭动画的阀值', 'number', false, '动画控制', { since: '1.2.0' })
      ]
    },
    
    'IInteractionSpec': {
      description: '交互配置规范，定义系列的交互行为',
      directExtends: [],
      ownProperties: [
        createProperty('hover', 'hover交互配置', 'IHoverSpec | boolean', false, '交互行为'),
        createProperty('select', '选中交互配置', 'ISelectSpec | boolean', false, '交互行为')
      ]
    },
    
    'IAnimationSpec<BarMarks, BarAppearPreset>': {
      description: '柱状图动画配置规范，支持 bar 图元的动画',
      note: 'BarMarks = "bar", BarAppearPreset = "grow" | "fadeIn" | "scaleIn"',
      directExtends: [],
      ownProperties: [
        createProperty('animationAppear', '图表入场动画，支持配置图表内置不同动画效果', 'boolean | IStateAnimateSpec<BarAppearPreset> | IMarkAnimateSpec<BarMarks>', false, '入场动画'),
        createProperty('animationEnter', '数据更新 - 新增数据动画', 'boolean | ICommonStateAnimateSpec | IMarkAnimateSpec<BarMarks>', false, '数据动画'),
        createProperty('animationUpdate', '数据更新 - 数据更新动画', 'boolean | ICommonStateAnimateSpec | IMarkAnimateSpec<BarMarks>', false, '数据动画'),
        createProperty('animationExit', '数据更新 - 数据删除动画', 'boolean | ICommonStateAnimateSpec | IMarkAnimateSpec<BarMarks>', false, '数据动画')
      ]
    },
    
    'IMarkProgressiveConfig': {
      description: '图元渐进式渲染配置，用于大数据场景的渲染优化',
      directExtends: [],
      ownProperties: [
        createProperty('large', '是否开启大数据渲染模式', 'boolean', false, '大数据渲染'),
        createProperty('largeThreshold', '开启大数据渲染优化的阀值', 'number', false, '大数据渲染'),
        createProperty('progressiveStep', '分片长度', 'number', false, '渐进渲染'),
        createProperty('progressiveThreshold', '开启分片渲染的阀值', 'number', false, '渐进渲染')
      ]
    },
    
    'IDataSamping': {
      description: '数据采样配置，用于大数据场景的数据优化',
      directExtends: [],
      ownProperties: [
        createProperty('sampling', '数据采样 - 采样方法', 'ISamplingMethod', false, '数据采样', { since: '1.6.0' }),
        createProperty('samplingFactor', '数据采样 - 采样系数', 'number', false, '数据采样', { defaultValue: '1', since: '1.6.0' })
      ]
    }
  }
};

// 生成复杂类型的 TypeScript 定义（参考 area-chart 的实现方式）
function generateComplexTypeDefinitions() {
  const typeDefinitions = {};
  
  // 深度展开类型定义的辅助函数
  function deepExpandType(typeName, visited = new Set(), depth = 0) {
    // 避免循环引用
    if (visited.has(typeName)) {
      return typeName;
    }
    
    // 简单类型直接返回
    if (simpleTypes.includes(typeName)) {
      return typeName;
    }
    
    // 枚举类型展开
    if (enumTypes[typeName]) {
      return enumTypes[typeName];
    }
    
    // 数组类型处理
    if (typeName.endsWith('[]')) {
      const baseType = typeName.slice(0, -2);
      const expandedBase = deepExpandType(baseType, visited, depth);
      return `${expandedBase}[]`;
    }
    
    // 联合类型处理
    if (typeName.includes('|')) {
      const parts = typeName.split('|').map(part => part.trim());
      return parts.map(part => deepExpandType(part, visited, depth)).join(' | ');
    }
    
    // 泛型类型保持原样（避免过度复杂）
    if (typeName.includes('<')) {
      return typeName;
    }
    
    // 交叉类型处理
    if (typeName.includes('&')) {
      const parts = typeName.split('&').map(part => part.trim());
      return parts.map(part => deepExpandType(part, visited, depth)).join(' & ');
    }
    
    // 检查是否是我们定义的复杂类型，进行深度展开
    const definition = complexTypeDefinitions[typeName];
    if (definition && definition.properties && depth < 3) {
      visited.add(typeName);
      
      const properties = definition.properties.map(prop => {
        const optional = prop.required ? '' : '?';
        const expandedType = deepExpandType(prop.type, new Set(visited), depth + 1);
        const comment = prop.description ? `\n  /** ${prop.description} */` : '';
        return `${comment}\n  ${prop.name}${optional}: ${expandedType};`;
      }).join('');
      
      visited.delete(typeName);
      return `{${properties}\n}`;
    }
    
    // 对于未知或不需要展开的类型，返回通用对象类型
    if (depth > 2 || !definition) {
      return '{ [key: string]: any }';
    }
    
    return typeName;
  }
  
  // 为每个复杂类型生成完整定义
  Object.keys(complexTypeDefinitions).forEach(typeName => {
    const definition = complexTypeDefinitions[typeName];
    
    // 生成属性列表
    const properties = definition.properties.map(prop => {
      const expandedType = deepExpandType(prop.type);
      return {
        name: prop.name,
        type: prop.type,
        required: prop.required,
        description: prop.description,
        expandedType: expandedType,
        resolvedType: prop.type,
        isSimple: TypeAnalyzer.isSimpleType(prop.type),
        dependencies: TypeAnalyzer.extractDependencies(prop.type)
      };
    });
    
    // 生成完整的 TypeScript 接口代码
    const interfaceProperties = definition.properties.map(prop => {
      const optional = prop.required ? '' : '?';
      const expandedType = deepExpandType(prop.type);
      const comment = prop.description ? `\n  /** ${prop.description} */` : '';
      return `${comment}\n  ${prop.name}${optional}: ${expandedType};`;
    }).join('');
    
    const typescriptCode = `interface ${typeName} {${interfaceProperties}\n}`;
    
    typeDefinitions[typeName] = {
      description: definition.description,
      typescriptCode: typescriptCode,
      properties: properties,
      note: properties.length > 0 ? 
        `包含 ${properties.length} 个属性，类型已完全展开` : 
        '此类型定义需要从源码中进一步解析',
      usageNote: `${typeName} 的完整类型定义，所有子类型已展开便于大模型理解`
    };
  });
  
  return typeDefinitions;
}

// 生成最终的完整meta配置
function generateCompleteBarChartSpecMeta() {
  const complexTypes = generateComplexTypeDefinitions();
  
  return {
    ...barChartSpecMeta,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    
    // 复杂类型的完整定义，供大模型使用
    complexTypeDefinitions: complexTypes,
    
    // 基础统计信息
    statistics: {
      totalInterfaces: Object.keys(barChartSpecMeta.inheritanceTree).length,
      totalProperties: Object.values(barChartSpecMeta.inheritanceTree)
        .reduce((sum, iface) => sum + iface.ownProperties.length, 0),
      simpleTypes: 0,
      complexTypes: Object.keys(complexTypes).length
    }
  };
}

// 生成并保存结果
const result = generateCompleteBarChartSpecMeta();

// 保存到本地JSON文件
function saveToJsonFile() {
  const outputPath = path.join(__dirname, 'bar-chart-spec-meta.json');
  
  try {
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');
    console.log(`✅ IBarChartSpec 元数据已成功生成并保存到: ${outputPath}`);
    console.log(`📊 统计信息:`);
    console.log(`   - 总接口数: ${result.statistics.totalInterfaces}`);
    console.log(`   - 总属性数: ${result.statistics.totalProperties}`);
    console.log(`   - 复杂类型数: ${result.statistics.complexTypes}`);
    console.log(`   - 文件大小: ${(JSON.stringify(result).length / 1024).toFixed(2)} KB`);
  } catch (error) {
    console.error('❌ 保存文件时出错:', error);
  }
}

// 执行保存
saveToJsonFile();

module.exports = { barChartSpecMeta: result };
