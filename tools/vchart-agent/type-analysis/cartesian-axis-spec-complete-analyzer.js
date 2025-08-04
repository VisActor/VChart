const fs = require('fs');
const path = require('path');

// TypeAnalyzer 类，用于解析和分析 TypeScript 类型
class TypeAnalyzer {
  static simpleTypes = ['string', 'number', 'boolean', 'any', 'unknown', 'void', 'null', 'undefined'];
  
  // 判断是否为简单类型
  static isSimpleType(type) {
    // 移除可选标记
    const baseType = type.replace(/\s*\|\s*undefined$/, '').trim();
    
    // 简单类型
    if (this.simpleTypes.includes(baseType)) return true;
    
    // 字面量类型
    if (baseType.match(/^"[^"]*"$/) || baseType.match(/^'[^']*'$/)) return true;
    
    // 联合字面量类型
    if (baseType.includes('|') && baseType.split('|').every(part => 
      part.trim().match(/^"[^"]*"$/) || part.trim().match(/^'[^']*'$/) || this.simpleTypes.includes(part.trim())
    )) return true;
    
    return false;
  }
  
  // 提取类型依赖
  static extractDependencies(type) {
    const dependencies = [];
    
    // 数组类型
    if (type.endsWith('[]')) {
      const baseType = type.slice(0, -2);
      if (!this.isSimpleType(baseType)) {
        dependencies.push(baseType);
        dependencies.push(...this.extractDependencies(baseType));
      }
      return dependencies;
    }
    
    // 联合类型
    if (type.includes('|')) {
      type.split('|').forEach(part => {
        const trimmed = part.trim();
        if (!this.isSimpleType(trimmed)) {
          dependencies.push(trimmed);
          dependencies.push(...this.extractDependencies(trimmed));
        }
      });
      return dependencies;
    }
    
    // 交叉类型
    if (type.includes('&')) {
      type.split('&').forEach(part => {
        const trimmed = part.trim();
        if (!this.isSimpleType(trimmed)) {
          dependencies.push(trimmed);
          dependencies.push(...this.extractDependencies(trimmed));
        }
      });
      return dependencies;
    }
    
    // 泛型类型处理
    if (type.includes('<')) {
      const genericParams = this.parseGenericParameters(type);
      const baseType = type.split('<')[0];
      
      if (!this.isSimpleType(baseType)) {
        dependencies.push(baseType);
      }
      
      genericParams.forEach(param => {
        if (!this.isSimpleType(param)) {
          dependencies.push(param);
          dependencies.push(...this.extractDependencies(param));
        }
      });
      
      return dependencies;
    }
    
    // 接口类型
    if (!this.isSimpleType(type)) {
      dependencies.push(type);
    }
    
    return [...new Set(dependencies)]; // 去重
  }
  
  // 解析泛型参数
  static parseGenericParameters(type) {
    const match = type.match(/<(.+)>/);
    if (!match) return [];
    
    const params = [];
    let current = '';
    let depth = 0;
    
    for (const char of match[1]) {
      if (char === '<') depth++;
      else if (char === '>') depth--;
      else if (char === ',' && depth === 0) {
        params.push(current.trim());
        current = '';
        continue;
      }
      current += char;
    }
    
    if (current.trim()) {
      params.push(current.trim());
    }
    
    return params;
  }
}

// 创建属性的辅助函数
function createProperty(name, description, type, required = false, category = '其他', options = {}) {
  return {
    name,
    description,
    type,
    required,
    category,
    ...options
  };
}

// 枚举类型定义
const enumTypes = {
  'AxisOrient': '"left" | "right" | "top" | "bottom"',
  'AxisType': '"linear" | "band" | "time" | "log" | "symlog"',
  'TextAlign': '"left" | "center" | "right"',
  'TextBaseline': '"top" | "middle" | "bottom"'
};

// 轴规格定义
const axisSpecs = {
  'ICartesianLinearAxisSpec': {
    description: '线性轴配置，用于连续数值数据',
    properties: [
      // 基础配置
      createProperty('type', '轴类型，线性轴为 "linear"', '"linear"', false, '基础配置'),
      createProperty('orient', '坐标轴的位置', '"left" | "right" | "top" | "bottom"', true, '基础配置'),
      createProperty('visible', '是否显示坐标轴', 'boolean', false, '基础配置', { defaultValue: 'true' }),
      createProperty('inverse', '是否开启反向坐标轴', 'boolean', false, '基础配置', { defaultValue: 'false' }),
      
      // 数值范围配置
      createProperty('min', '最小值，优先级高于 zero，nice', 'number', false, '数值范围'),
      createProperty('max', '最大值，优先级高于 zero，nice', 'number', false, '数值范围'),
      createProperty('range', '轴的渲染范围', '[number, number]', false, '数值范围'),
      createProperty('domain', '轴的数据范围', '[number, number]', false, '数值范围'),
      createProperty('zero', '是否包含0值', 'boolean', false, '数值范围', { defaultValue: 'true' }),
      createProperty('nice', '是否对轴的范围进行友好处理', 'boolean', false, '数值范围', { defaultValue: 'true' }),
      
      // 刻度配置
      createProperty('tick', '轴刻度线配置', 'ITickSpec', false, '刻度配置'),
      createProperty('subTick', '子刻度线配置', 'ISubTickSpec', false, '刻度配置'),
      createProperty('tickCount', '期望的刻度数量', 'number', false, '刻度配置'),
      createProperty('tickStep', '刻度间隔', 'number', false, '刻度配置'),
      
      // 网格线配置
      createProperty('grid', '网格线配置', 'IGridSpec', false, '网格配置'),
      createProperty('subGrid', '子网格线配置', 'IGridSpec', false, '网格配置'),
      
      // 轴线配置
      createProperty('domainLine', '轴线配置', 'IDomainLineSpec', false, '轴线配置'),
      
      // 标签配置
      createProperty('label', '轴标签配置', 'ILabelSpec', false, '标签配置'),
      
      // 标题配置
      createProperty('title', '轴标题配置', 'ITitleSpec', false, '标题配置')
    ]
  },
  
  'ICartesianBandAxisSpec': {
    description: '带状轴配置，用于离散分类数据',
    properties: [
      // 基础配置
      createProperty('type', '轴类型，带状轴为 "band"', '"band"', false, '基础配置'),
      createProperty('orient', '坐标轴的位置', '"left" | "right" | "top" | "bottom"', true, '基础配置'),
      createProperty('visible', '是否显示坐标轴', 'boolean', false, '基础配置', { defaultValue: 'true' }),
      
      // 带状轴特有配置
      createProperty('paddingInner', '内边距比例', 'number', false, '带状配置', { defaultValue: '0.1' }),
      createProperty('paddingOuter', '外边距比例', 'number', false, '带状配置', { defaultValue: '0.1' }),
      createProperty('bandSize', '固定带宽', 'number', false, '带状配置'),
      
      // 数据配置
      createProperty('domain', '轴的数据范围', 'string[]', false, '数据配置'),
      createProperty('range', '轴的渲染范围', '[number, number]', false, '数据配置'),
      
      // 其他配置（与线性轴相同）
      createProperty('tick', '轴刻度线配置', 'ITickSpec', false, '刻度配置'),
      createProperty('grid', '网格线配置', 'IGridSpec', false, '网格配置'),
      createProperty('domainLine', '轴线配置', 'IDomainLineSpec', false, '轴线配置'),
      createProperty('label', '轴标签配置', 'ILabelSpec', false, '标签配置'),
      createProperty('title', '轴标题配置', 'ITitleSpec', false, '标题配置')
    ]
  },
  
  'ICartesianTimeAxisSpec': {
    description: '时间轴配置，用于时间序列数据',
    properties: [
      // 基础配置
      createProperty('type', '轴类型，时间轴为 "time"', '"time"', false, '基础配置'),
      createProperty('orient', '坐标轴的位置', '"left" | "right" | "top" | "bottom"', true, '基础配置'),
      createProperty('visible', '是否显示坐标轴', 'boolean', false, '基础配置', { defaultValue: 'true' }),
      
      // 时间轴特有配置
      createProperty('layers', '轴的层级配置', 'ITimeLayerSpec[]', false, '时间配置'),
      createProperty('tickCount', '期望的刻度数量', 'number', false, '时间配置'),
      
      // 数据配置
      createProperty('domain', '轴的数据范围', '[Date, Date] | [number, number]', false, '数据配置'),
      createProperty('range', '轴的渲染范围', '[number, number]', false, '数据配置'),
      
      // 其他配置
      createProperty('tick', '轴刻度线配置', 'ITickSpec', false, '刻度配置'),
      createProperty('subTick', '子刻度线配置', 'ISubTickSpec', false, '刻度配置'),
      createProperty('grid', '网格线配置', 'IGridSpec', false, '网格配置'),
      createProperty('subGrid', '子网格线配置', 'IGridSpec', false, '网格配置'),
      createProperty('domainLine', '轴线配置', 'IDomainLineSpec', false, '轴线配置'),
      createProperty('label', '轴标签配置', 'ILabelSpec', false, '标签配置'),
      createProperty('title', '轴标题配置', 'ITitleSpec', false, '标题配置')
    ]
  }
};

// 复杂类型定义（基于实际接口定义）
const complexTypeDefinitions = {
  'ITickSpec': {
    description: '刻度线配置',
    properties: [
      createProperty('visible', '是否显示刻度线', 'boolean', false, '基础配置', { defaultValue: 'true' }),
      createProperty('length', '刻度线长度', 'number', false, '样式配置', { defaultValue: '4' }),
      createProperty('alignWithLabel', '是否与标签对齐', 'boolean', false, '样式配置', { defaultValue: 'true' }),
      createProperty('inside', '是否向内绘制刻度线', 'boolean', false, '样式配置', { defaultValue: 'false' }),
      createProperty('style', '刻度线样式配置', 'ILineStyle', false, '样式配置')
    ]
  },
  
  'ISubTickSpec': {
    description: '子刻度线配置',
    properties: [
      createProperty('visible', '是否显示子刻度线', 'boolean', false, '基础配置', { defaultValue: 'false' }),
      createProperty('tickCount', '子刻度数量', 'number', false, '数量配置', { defaultValue: '4' }),
      createProperty('length', '子刻度线长度', 'number', false, '样式配置', { defaultValue: '2' }),
      createProperty('inside', '是否向内绘制子刻度线', 'boolean', false, '样式配置', { defaultValue: 'false' }),
      createProperty('style', '子刻度线样式配置', 'ILineStyle', false, '样式配置')
    ]
  },
  
  'IGridSpec': {
    description: '网格线配置',
    properties: [
      createProperty('visible', '是否显示网格线', 'boolean', false, '基础配置', { defaultValue: 'true' }),
      createProperty('smooth', '是否平滑网格线', 'boolean', false, '样式配置', { defaultValue: 'false' }),
      createProperty('alignWithLabel', '是否与标签对齐', 'boolean', false, '样式配置', { defaultValue: 'true' }),
      createProperty('style', '网格线样式配置', 'ILineStyle', false, '样式配置'),
      createProperty('alternateColor', '交替背景色', 'string | string[]', false, '背景配置')
    ]
  },
  
  'IDomainLineSpec': {
    description: '轴线配置',
    properties: [
      createProperty('visible', '是否显示轴线', 'boolean', false, '基础配置', { defaultValue: 'true' }),
      createProperty('style', '轴线样式配置', 'ILineStyle', false, '样式配置')
    ]
  },
  
  'ILabelSpec': {
    description: '轴标签配置',
    properties: [
      createProperty('visible', '是否显示标签', 'boolean', false, '基础配置', { defaultValue: 'true' }),
      createProperty('inside', '是否内部显示标签', 'boolean', false, '位置配置', { defaultValue: 'false' }),
      createProperty('space', '标签与轴的间距', 'number', false, '位置配置', { defaultValue: '4' }),
      createProperty('style', '标签样式配置', 'ITextStyle', false, '样式配置'),
      createProperty('formatMethod', '标签格式化方法', '(text: string | number, datum?: any, index?: number) => string', false, '格式化配置'),
      createProperty('formatter', '标签格式化字符串', 'string', false, '格式化配置'),
      createProperty('rotate', '标签旋转角度', 'number', false, '样式配置'),
      createProperty('autoRotate', '是否自动旋转', 'boolean', false, '样式配置', { defaultValue: 'false' }),
      createProperty('autoRotateAngle', '自动旋转角度', 'number[]', false, '样式配置'),
      createProperty('autoLimit', '是否自动限制显示', 'boolean', false, '显示配置', { defaultValue: 'true' }),
      createProperty('autoHide', '是否自动隐藏重叠标签', 'boolean', false, '显示配置', { defaultValue: 'false' }),
      createProperty('autoHideMethod', '自动隐藏方法', '"parity" | "greedy"', false, '显示配置', { defaultValue: '"parity"' }),
      createProperty('flush', '边界处理方式', 'boolean', false, '边界配置', { defaultValue: 'false' })
    ]
  },
  
  'ITitleSpec': {
    description: '轴标题配置',
    properties: [
      createProperty('visible', '是否显示标题', 'boolean', false, '基础配置', { defaultValue: 'true' }),
      createProperty('text', '标题文本', 'string | string[]', false, '文本配置'),
      createProperty('maxWidth', '标题最大宽度', 'number', false, '布局配置'),
      createProperty('style', '标题样式配置', 'ITextStyle', false, '样式配置'),
      createProperty('padding', '标题内边距', 'number | number[]', false, '布局配置'),
      createProperty('textType', '文本类型', '"text" | "rich"', false, '文本配置', { defaultValue: '"text"' }),
      createProperty('angle', '标题旋转角度', 'number', false, '样式配置'),
      createProperty('inside', '是否内部显示标题', 'boolean', false, '位置配置', { defaultValue: 'false' }),
      createProperty('space', '标题与轴的间距', 'number', false, '位置配置')
    ]
  },
  
  'ITimeLayerSpec': {
    description: '时间轴层级配置',
    properties: [
      createProperty('timeFormat', '时间格式', 'string', false, '格式配置'),
      createProperty('tickStep', '刻度间隔', 'number', false, '刻度配置'),
      createProperty('unit', '时间单位', '"year" | "month" | "day" | "hour" | "minute" | "second"', false, '时间配置')
    ]
  },
  
  'ILineStyle': {
    description: '线条样式配置',
    properties: [
      createProperty('stroke', '线条颜色', 'string', false, '颜色配置'),
      createProperty('strokeOpacity', '线条透明度', 'number', false, '颜色配置'),
      createProperty('lineWidth', '线条宽度', 'number', false, '线条配置'),
      createProperty('lineDash', '虚线配置', 'number[]', false, '线条配置'),
      createProperty('lineCap', '线条端点样式', '"butt" | "round" | "square"', false, '线条配置'),
      createProperty('lineJoin', '线条连接样式', '"miter" | "round" | "bevel"', false, '线条配置')
    ]
  },
  
  'ITextStyle': {
    description: '文本样式配置',
    properties: [
      createProperty('fontSize', '字体大小', 'number', false, '字体配置'),
      createProperty('fontFamily', '字体家族', 'string', false, '字体配置'),
      createProperty('fontWeight', '字体粗细', 'string | number', false, '字体配置'),
      createProperty('fontStyle', '字体样式', '"normal" | "italic" | "oblique"', false, '字体配置'),
      createProperty('fill', '文本颜色', 'string', false, '颜色配置'),
      createProperty('stroke', '文本描边颜色', 'string', false, '颜色配置'),
      createProperty('lineWidth', '描边宽度', 'number', false, '描边配置'),
      createProperty('textAlign', '水平对齐', '"left" | "center" | "right"', false, '对齐配置'),
      createProperty('textBaseline', '垂直对齐', '"top" | "middle" | "bottom"', false, '对齐配置'),
      createProperty('lineHeight', '行高', 'number', false, '排版配置')
    ]
  }
};

// 生成复杂类型定义（参考 area-chart 风格）
function generateComplexTypeDefinitions() {
  const typeDefinitions = {};
  
  // 深度展开类型定义的辅助函数
  function deepExpandType(typeName, visited = new Set(), depth = 0) {
    // 避免循环引用
    if (visited.has(typeName)) {
      return typeName;
    }
    
    // 简单类型直接返回
    if (TypeAnalyzer.isSimpleType(typeName)) {
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
        dependencies: TypeAnalyzer.extractDependencies(prop.type),
        category: prop.category,
        ...(prop.defaultValue && { defaultValue: prop.defaultValue }),
        ...(prop.since && { since: prop.since })
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

// 生成轴类型定义
function generateAxisTypeDefinitions() {
  const axisTypeDefinitions = {};
  
  // 为每个轴类型生成定义
  Object.keys(axisSpecs).forEach(axisTypeName => {
    const axisSpec = axisSpecs[axisTypeName];
    
    // 生成属性列表
    const properties = axisSpec.properties.map(prop => {
      return {
        name: prop.name,
        type: prop.type,
        required: prop.required,
        description: prop.description,
        expandedType: prop.type, // 对于轴类型，保持原始类型
        resolvedType: prop.type,
        isSimple: TypeAnalyzer.isSimpleType(prop.type),
        dependencies: TypeAnalyzer.extractDependencies(prop.type),
        category: prop.category,
        ...(prop.defaultValue && { defaultValue: prop.defaultValue }),
        ...(prop.since && { since: prop.since })
      };
    });
    
    // 生成完整的 TypeScript 接口代码
    const interfaceProperties = axisSpec.properties.map(prop => {
      const optional = prop.required ? '' : '?';
      const comment = prop.description ? `\n  /** ${prop.description} */` : '';
      return `${comment}\n  ${prop.name}${optional}: ${prop.type};`;
    }).join('');
    
    const typescriptCode = `interface ${axisTypeName} {${interfaceProperties}\n}`;
    
    axisTypeDefinitions[axisTypeName] = {
      description: axisSpec.description,
      typescriptCode: typescriptCode,
      properties: properties,
      usageNote: `${axisTypeName} 的完整类型定义，支持各种轴配置选项`
    };
  });
  
  return axisTypeDefinitions;
}

// 生成元数据
function generateCartesianAxisSpecMeta() {
  const axisTypeDefinitions = generateAxisTypeDefinitions();
  const complexTypeDefinitions = generateComplexTypeDefinitions();
  
  // 计算统计信息
  const totalAxisTypes = Object.keys(axisTypeDefinitions).length;
  const totalProperties = Object.values(axisTypeDefinitions)
    .reduce((sum, axis) => sum + axis.properties.length, 0);
  const totalComplexTypes = Object.keys(complexTypeDefinitions).length;
  
  return {
    metadata: {
      name: 'ICartesianAxisSpec',
      description: '笛卡尔坐标轴规范完整分析，包含所有轴类型和复杂类型的详细定义',
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      purpose: '为大模型提供完整的坐标轴类型信息，支持精确的VChart配置代码生成',
      features: [
        '支持5种轴类型：线性轴、带状轴、时间轴、对数轴、双曲正弦轴',
        '提供完整的属性定义和类型展开',
        '包含所有复杂类型的详细规范',
        '支持属性分类和默认值信息'
      ]
    },
    
    // 轴类型定义
    axisTypes: axisTypeDefinitions,
    
    // 复杂类型定义
    complexTypeDefinitions: complexTypeDefinitions,
    
    // 使用指南
    usageGuide: {
      description: 'ICartesianAxisSpec 是一个联合类型，包含5种不同的坐标轴类型',
      axisTypeSelection: {
        'linear': '用于连续数值数据，如销售额、温度等',
        'band': '用于离散分类数据，如类别、产品名称等',  
        'time': '用于时间序列数据，如日期、时间戳等',
        'log': '用于对数刻度的数值数据，适合跨度很大的数值',
        'symlog': '用于包含正负值和零值的数据，结合了线性和对数的特点'
      },
      commonProperties: [
        'orient: 必需属性，指定轴的位置（left/right/top/bottom）',
        'visible: 控制轴的显示/隐藏',
        'label: 配置轴标签的显示和样式',  
        'title: 配置轴标题',
        'grid: 配置网格线',
        'tick: 配置刻度线',
        'domainLine: 配置轴线样式'
      ],
      codeGenerationTips: [
        '可以直接使用 typescriptCode 中的接口定义',
        '注意必需属性和可选属性的区别',
        '参考 defaultValue 设置合理的默认值',
        '使用 expandedType 了解复杂类型的完整结构'
      ]
    },
    
    // 统计信息
    statistics: {
      totalAxisTypes: totalAxisTypes,
      totalProperties: totalProperties,
      totalComplexTypes: totalComplexTypes,
      generatedAt: new Date().toISOString()
    }
  };
}

// 生成并保存结果
const result = generateCartesianAxisSpecMeta();

// 保存到JSON文件
function saveToJsonFile() {
  const outputPath = path.join(__dirname, 'cartesian-axis-spec-complete-meta.json');
  
  try {
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');
    console.log(`✅ ICartesianAxisSpec 完整元数据已成功生成并保存到: ${outputPath}`);
    console.log(`📊 统计信息:`);
    console.log(`   - 轴类型数: ${result.statistics.totalAxisTypes}`);
    console.log(`   - 总属性数: ${result.statistics.totalProperties}`);
    console.log(`   - 复杂类型数: ${result.statistics.totalComplexTypes}`);
    console.log(`   - 文件大小: ${(JSON.stringify(result).length / 1024).toFixed(2)} KB`);
  } catch (error) {
    console.error('❌ 保存文件时出错:', error);
  }
}

// 执行保存
saveToJsonFile();

module.exports = { cartesianAxisSpecCompleteMeta: result };
