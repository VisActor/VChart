(async function () {
  'use strict';
  const payload = JSON.parse(document.getElementById('visualization-data').textContent);
  const status = window.__DSV_STATUS__ = { ready: false, charts: [], filteredN: payload.dataset?.rows.length ?? null, lastUpdateSucceeded: false };
  const controllers = new Map();
  window.__DSV_CONTROLLERS__ = controllers;
  const clone = value => structuredClone(value);
  let inputs = clone(payload.charts);
  let filters = (payload.controls.initialFilters || []).map(filter => ({ ...filter,
    value: filter.kind === 'range' ? [filter.value[0] ?? -Infinity, filter.value[1] ?? Infinity] : filter.value }));
  let theme = (inputs[0].spec || inputs[0].binding.options || {}).theme || 'light';
  let busy = false;
  const filterControls = [], editors = [];
  const pageError = document.getElementById('page-error');
  const byColumn = new Map((payload.dataset?.columns || []).map(column => [column.name, column]));
  const titleOf = input => (input.spec || input.binding.options || {}).title || input.id;
  const columnLabel = name => byColumn.get(name).label || name;
  function node(tag, text, parent) {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = text;
    if (parent) parent.append(element);
    return element;
  }
  function select(label, choices) {
    const wrapper = node('label', undefined, document.getElementById('controls'));
    wrapper.className = 'control'; node('span', label, wrapper);
    const element = node('select', undefined, wrapper);
    element.setAttribute('aria-label', label);
    for (const [value, text] of choices) { const option = node('option', text, element); option.value = value; }
    return element;
  }
  function buildControls() {
    for (const control of payload.controls.filters || []) {
      if (control.kind === 'category') {
        const values = [...new Set(payload.dataset.rows.map(row => row.values[control.field]).filter(value => value !== null))];
        const element = select(columnLabel(control.field), [['all', '全部'], ...values.map((value, i) => [String(i), value === '' ? '空字符串' : value])]);
        filterControls.push({ ...control, element, values });
      } else {
        const wrapper = node('div', undefined, document.getElementById('controls')); wrapper.className = 'control';
        node('span', columnLabel(control.field) + '（含端点）', wrapper);
        const range = node('div', undefined, wrapper); range.className = 'range';
        const lower = node('input', undefined, range), upper = node('input', undefined, range);
        for (const [input, label] of [[lower, '下界'], [upper, '上界']]) {
          input.type = 'number'; input.step = 'any'; input.placeholder = label;
          input.setAttribute('aria-label', columnLabel(control.field) + ' ' + label);
        }
        filterControls.push({ ...control, lower, upper });
      }
    }
    for (const control of payload.controls.variableSwitch || []) {
      const input = inputs.find(input => input.id === control.chartId);
      const roleName = { value: '数值', x: '横轴', y: '纵轴' }[control.role];
      const element = select(`${titleOf(input)} · ${roleName}变量`, control.candidates.map(name => [name, columnLabel(name)]));
      editors.push({ ...control, kind: 'variable', element });
      element.addEventListener('change', () => {
        const next = clone(inputs); next.find(input => input.id === control.chartId).binding.fields[control.role] = element.value;
        perform(next, filters, [control.chartId], theme);
      });
    }
    for (const control of payload.controls.parameters || []) {
      const input = inputs.find(input => input.id === control.chartId);
      const label = { 'binning.binCount': '分箱数', statistic: '统计量', method: '相关方法' }[control.path];
      const names = { count: '计数', proportion: '比例', density: '密度', pearson: 'Pearson（线性）', spearman: 'Spearman（秩）', kendall: 'Kendall（秩）' };
      const element = select(`${titleOf(input)} · ${label}`, [['default', '默认'], ...control.values.map(value => [JSON.stringify(value), names[value] || String(value)])]);
      editors.push({ ...control, kind: 'parameter', element });
      element.addEventListener('change', () => {
        const next = clone(inputs); const target = next.find(input => input.id === control.chartId).binding;
        target.options ||= {};
        const parts = control.path.split('.'); let object = target.options;
        for (const key of parts.slice(0, -1)) { object[key] ||= {}; object = object[key]; }
        const key = parts[parts.length - 1];
        if (element.value === 'default') delete object[key]; else object[key] = JSON.parse(element.value);
        perform(next, filters, [control.chartId], theme);
      });
    }
  }
  function restoreControls() {
    for (const control of filterControls) {
      const accepted = filters.find(filter => filter.field === control.field && filter.kind === control.kind);
      if (control.kind === 'category') control.element.value = !accepted || accepted.value === null ? 'all' : String(control.values.indexOf(accepted.value));
      else {
        control.lower.value = accepted && Number.isFinite(accepted.value[0]) ? accepted.value[0] : '';
        control.upper.value = accepted && Number.isFinite(accepted.value[1]) ? accepted.value[1] : '';
      }
    }
    for (const editor of editors) {
      const binding = inputs.find(input => input.id === editor.chartId).binding;
      const value = editor.kind === 'variable' ? binding.fields[editor.role]
        : editor.path.split('.').reduce((value, key) => value?.[key], binding.options);
      editor.element.value = editor.kind === 'variable' ? value : value === undefined ? 'default' : JSON.stringify(value);
    }
  }
  function setBusy(value) {
    busy = value; status.ready = !value;
    document.querySelectorAll('.toolbar input,.toolbar select,.toolbar button').forEach(element => { element.disabled = value; });
    document.getElementById('apply').disabled = value || !filterControls.length;
    document.getElementById('clear').disabled = value || !filterControls.length;
    document.getElementById('save-view').disabled = value || !inputs.every(input => controllers.get(input.id)?.spec);
    document.querySelectorAll('[data-png]').forEach(button => { button.disabled = value || !controllers.get(button.dataset.png)?.chart; });
    if (!value) document.getElementById('download').textContent = inputs.every(input => controllers.get(input.id)?.spec) ? '下载当前图表配置' : '下载输入配置';
  }
  function chartState(id) { return status.charts.find(chart => chart.id === id); }
  function builtSpec(input, rows) {
    return input.binding ? StatPlotData.buildBoundSpec(input.binding, rows, payload.dataset.columns)
      : { spec: input.spec, inputN: null, omittedN: 0 };
  }
  function showMetadata(state, input) {
    let text;
    if (state.inputN === null) {
      const data = input.spec.data;
      text = `语义输入 ${Array.isArray(data) ? data.length : data.observations.length} 行（不推断原始样本量）`;
    } else text = `本图输入 ${state.inputN} 条 · ${state.omittedN} 条缺少必要字段`;
    if (input.binding?.fields.variables) {
      text += ' · ' + input.binding.fields.variables.map(name => {
        const column=byColumn.get(name);
        return `${name}：${column.label || name}${column.unit ? `（${column.unit}）` : ''}`;
      }).join('；');
    }
    document.getElementById('meta-' + input.id).textContent = text;
  }
  function summary() {
    const succeeded = status.charts.filter(chart => chart.status === 'rendered').length;
    document.getElementById('summary').textContent = `${payload.dataset ? `原始 ${payload.dataset.source.originalN} 条 · 当前筛选 ${status.filteredN} 条 · ` : ''}${succeeded}/${inputs.length} 张图成功`;
  }
  async function updateOne(input, built) {
    let controller = controllers.get(input.id);
    if (!controller) {
      controller = StatPlotController.create({ dom: 'dsv-' + input.id, animation: false, confineTooltip: true });
      controllers.set(input.id, controller);
    }
    if (!controller.chart) document.getElementById('dsv-' + input.id).replaceChildren();
    await controller.update(built.spec);
  }
  function showFailure(id, error) {
    const state = chartState(id); state.status = 'failed'; state.error = error.message;
    document.getElementById('error-' + id).textContent = error.message;
    if (!controllers.get(id)?.chart) document.getElementById('dsv-' + id).textContent = '此图未能生成';
  }
  async function perform(nextInputs, nextFilters, affected, nextTheme) {
    if (busy) return;
    setBusy(true); pageError.textContent = '';
    const previous = new Map(affected.map(id => [id, { spec: controllers.get(id)?.spec, state: { ...chartState(id) } }]));
    const touched = [];
    let updating;
    try {
      const rows = payload.dataset ? StatPlotData.filterRows(payload.dataset.rows, nextFilters) : [];
      const pending = [];
      for (const input of nextInputs.filter(input => affected.includes(input.id))) {
        updating = input.id;
        const built = builtSpec(input, rows);
        await updateOne(input, built);
        touched.push(input.id); pending.push({ input, built });
      }
      inputs = nextInputs; filters = clone(nextFilters); theme = nextTheme;
      status.filteredN = payload.dataset ? rows.length : null;
      for (const { input, built } of pending) {
        const state = chartState(input.id);
        Object.assign(state, { status: 'rendered', error: null, inputN: built.inputN, omittedN: built.omittedN });
        document.getElementById('error-' + input.id).textContent = '';
        showMetadata(state, input);
      }
      document.body.classList.toggle('dark', theme === 'dark');
      status.lastUpdateSucceeded = true;
    } catch (error) {
      const recoveryErrors = [];
      for (const id of touched) {
        const old = previous.get(id);
        try {
          if (old.spec) await controllers.get(id).update(old.spec);
          else { await controllers.get(id).release(); controllers.delete(id); document.getElementById('dsv-' + id).textContent = '此图未能生成'; }
          Object.assign(chartState(id), old.state);
        } catch (recovery) { recoveryErrors.push(`${id}: ${recovery.message}`); showFailure(id, recovery); }
      }
      if (updating) showFailure(updating, error);
      status.lastUpdateSucceeded = false;
      pageError.textContent = `更新失败，已恢复上次成功条件。${error.message}${recoveryErrors.length ? '\n恢复失败：' + recoveryErrors.join('; ') : ''}`;
    } finally {
      restoreControls(); summary(); setBusy(false);
    }
  }
  buildControls(); restoreControls(); setBusy(true);
  const initialRows = payload.dataset ? StatPlotData.filterRows(payload.dataset.rows, filters) : [];
  status.filteredN = payload.dataset ? initialRows.length : null;
  for (const input of inputs) {
    const state = { id: input.id, status: 'pending', error: null, inputN: null, omittedN: 0 };
    status.charts.push(state);
    try {
      const built = builtSpec(input, initialRows);
      await updateOne(input, built);
      Object.assign(state, { status: 'rendered', inputN: built.inputN, omittedN: built.omittedN });
      showMetadata(state, input);
    } catch (error) { showFailure(input.id, error); }
  }
  document.body.classList.toggle('dark', theme === 'dark');
  status.lastUpdateSucceeded = status.charts.every(chart => chart.status === 'rendered');
  summary(); setBusy(false);
  document.getElementById('apply').addEventListener('click', () => {
    const nextFilters = [];
    for (const control of filterControls) {
      if (control.kind === 'category') nextFilters.push({ field: control.field, kind: control.kind,
        value: control.element.value === 'all' ? null : control.values[Number(control.element.value)] });
      else if (control.lower.value !== '' || control.upper.value !== '') nextFilters.push({ field: control.field, kind: control.kind,
        value: [control.lower.value === '' ? -Infinity : Number(control.lower.value), control.upper.value === '' ? Infinity : Number(control.upper.value)] });
    }
    perform(clone(inputs), nextFilters, inputs.filter(input => input.binding).map(input => input.id), theme);
  });
  document.getElementById('clear').addEventListener('click', () => perform(clone(inputs), [], inputs.filter(input => input.binding).map(input => input.id), theme));
  document.getElementById('theme').addEventListener('click', () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'; const next = clone(inputs);
    for (const input of next) { if (input.spec) input.spec.theme = nextTheme; else { input.binding.options ||= {}; input.binding.options.theme = nextTheme; } }
    perform(next, filters, next.map(input => input.id), nextTheme);
  });
  document.querySelectorAll('[data-png]').forEach(button => button.addEventListener('click', async () => {
    try { await controllers.get(button.dataset.png).exportPNG(button.dataset.png); }
    catch (error) { pageError.textContent = error.message; }
  }));
  const download = document.getElementById('download');
  download.textContent = status.charts.every(chart => controllers.get(chart.id)?.spec) ? '下载当前图表配置' : '下载输入配置';
  function downloadJSON(data, filename) {
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    const link = node('a'); link.href = url; link.download = filename; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  download.addEventListener('click', () => {
    const complete = inputs.every(input => controllers.get(input.id)?.spec);
    const data = complete ? inputs.map(input => controllers.get(input.id).spec) : payload;
    downloadJSON(data, complete ? 'statplots.json' : 'visualization.input.json');
  });
  document.getElementById('save-view').addEventListener('click', () => {
    const request = { version: 1, title: payload.title, charts: inputs, controls: { ...payload.controls,
      initialFilters: filters.map(filter => ({ ...filter,
        value: filter.kind === 'range' ? filter.value.map(bound => Number.isFinite(bound) ? bound : null) : filter.value })) } };
    if (payload.dataset) {
      request.dataset = { source: { records: payload.dataset.rows.map(row => row.values) }, columns: payload.dataset.columns };
      if (payload.dataset.source.idColumn) request.dataset.idColumn = payload.dataset.source.idColumn;
    }
    downloadJSON(request, 'visualization.request.json');
  });
  window.addEventListener('beforeunload', () => controllers.forEach(controller => controller.release()));
})();
