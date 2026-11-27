const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const ts = require('typescript');
const { isEqual } = require('@visactor/vutils');

function loadChart(name, exportedName) {
  const filename = path.join(__dirname, '../src/components', name, 'index.tsx');
  const { outputText, diagnostics } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    fileName: filename,
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, target: ts.ScriptTarget.ES2015 },
    reportDiagnostics: true
  });
  assert.deepEqual(diagnostics, []);

  class Component {
    constructor(props) {
      this.props = props;
    }
  }
  const modules = {
    react: { default: { Component } },
    '@visactor/vutils': { isEqual },
    '@tarojs/components': {},
    '@tarojs/taro': {},
    '../../utils': {},
    '../../typings': {}
  };
  const exports = {};
  new Function('exports', 'require', outputText)(exports, id => {
    assert.ok(Object.hasOwn(modules, id), `Unexpected import: ${id}`);
    return modules[id];
  });
  return exports[exportedName];
}

for (const [name, exportedName] of [['general-chart', 'GeneralChart'], ['web-chart', 'WebChart']]) {
  test(`${exportedName} updates when only a spec callback changes`, () => {
    const Chart = loadChart(name, exportedName);
    const original = () => 'original';
    const replacement = () => 'replacement';
    const makeProps = formatter => ({ spec: { type: 'bar', label: { formatMethod: formatter } } });
    const previous = makeProps(original);
    const chart = new Chart(previous);
    const updates = [];
    if (exportedName === 'GeneralChart') {
      chart.ttCanvas = { chartInstance: {}, updateSpec: props => updates.push(props.spec) };
    } else {
      chart.vchart = { updateSpec: spec => updates.push(spec) };
    }

    chart.props = makeProps(original);
    chart.componentDidUpdate(previous);
    assert.deepEqual(updates, []);

    chart.props = makeProps(replacement);
    chart.componentDidUpdate(previous);
    assert.deepEqual(updates, [chart.props.spec]);
  });
}
