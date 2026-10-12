/* Semantic role mapping only. All statistics are computed by statplots. */
(function (global) {
  'use strict';
  const roles = {
    countPlot: [['category'], ['series']], histogram: [['value'], []],
    kdePlot: [['value'], ['series']], ecdfPlot: [['value'], ['series']],
    boxPlot: [['category', 'value'], ['series']], violinPlot: [['category', 'value'], ['series']],
    stripPlot: [['category', 'value'], ['series']], scatterPlot: [['x', 'y'], ['series']],
    hexbinPlot: [['x', 'y'], []], missingValueMatrix: [['variables'], []],
    correlationMatrix: [['variables'], []], pairPlot: [['variables'], ['series']]
  };
  function require(condition, message) { if (!condition) throw new Error(message); }
  function buildBoundSpec(binding, rows, columns) {
    const { type, fields, options = {} } = binding;
    require(Object.hasOwn(roles, type), '该图没有表格绑定');
    const [required, optional] = roles[type];
    require(required.every(role => Object.hasOwn(fields, role)) &&
      Object.keys(fields).every(role => required.includes(role) || optional.includes(role)), `${type}: fields 角色不符合输入契约`);
    require(!['type', 'data', 'variables'].some(key => Object.hasOwn(options, key)), 'options 不能覆盖 type/data/variables');
    const byName = new Map(columns.map(column => [column.name, column]));
    for (const [role, names] of Object.entries(fields)) {
      const refs = role === 'variables' ? names : [names];
      require(Array.isArray(refs) && refs.length && new Set(refs).size === refs.length, `${role}: 需要唯一列名`);
      for (const name of refs) {
        require(byName.has(name), `引用了不存在的列: ${name}`);
        const expected = role === 'category' || role === 'series' ? 'string' : 'number';
        if (type !== 'missingValueMatrix') require(byName.get(name).type === expected, `${name}: ${role} 需要 ${expected}`);
      }
    }
    const matrix = Object.hasOwn(fields, 'variables');
    let omittedN = 0;
    let data;
    const spec = { ...options, type };
    if (matrix) {
      const variables = fields.variables;
      require(variables.length <= (type === 'pairPlot' ? 4 : 20), `${type}: 变量过多`);
      const included = rows.filter(row => {
        if (fields.series && row.values[fields.series] === null) { omittedN++; return false; }
        return true;
      });
      if (type === 'pairPlot') require(included.length * variables.length * (variables.length - 1) <= 120000, 'pairPlot 超过 120000 点预算');
      if (type === 'missingValueMatrix') require(included.length * variables.length <= 200000, '缺失矩阵超过 200000 网格预算');
      data = { observations: included.map(row => ({
        id: row.id, values: Object.fromEntries(variables.map(name => [name, row.values[name]])),
        ...(fields.series ? { series: row.values[fields.series] } : {})
      })) };
      spec.variables = variables.slice();
    } else {
      data = [];
      for (const row of rows) {
        if (Object.values(fields).some(name => row.values[name] === null)) { omittedN++; continue; }
        const record = Object.fromEntries(Object.entries(fields).map(([role, name]) => [role, row.values[name]]));
        if (type === 'stripPlot' || type === 'scatterPlot') record.id = row.id;
        data.push(record);
      }
      if (type === 'kdePlot' || type === 'violinPlot') {
        const groups = new Set(data.map(row => JSON.stringify([type === 'violinPlot' ? row.category : null, row.series])));
        require(groups.size <= 20, `${type} 最多 20 个分组，请明确范围`);
      }
      const labels = { ...options.fieldLabels };
      for (const [role, name] of Object.entries(fields)) {
        if (role === 'series') continue;
        const column = byName.get(name);
        labels[role] = `${column.label || name}${column.unit ? `（${column.unit}）` : ''}`;
      }
      spec.fieldLabels = labels;
    }
    spec.data = data;
    return { spec, inputN: rows.length - omittedN, omittedN };
  }
  function filterRows(rows, filters) {
    return rows.filter(row => filters.every(filter => {
      const value = row.values[filter.field];
      if (filter.kind === 'category') return filter.value === null || value === filter.value;
      require(filter.kind === 'range' && Array.isArray(filter.value) && filter.value.length === 2,
        '范围筛选需要闭区间');
      require(filter.value[0] <= filter.value[1], '范围下界不能大于上界');
      return value !== null && value >= filter.value[0] && value <= filter.value[1];
    }));
  }
  global.StatPlotData = { buildBoundSpec, filterRows };
})(globalThis);
