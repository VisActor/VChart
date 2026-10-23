const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const typescript = require('typescript');

const source = fs.readFileSync(path.join(__dirname, '../src/utils/spec-equal.ts'), 'utf8');
const { outputText, diagnostics = [] } = typescript.transpileModule(source, {
  compilerOptions: {
    module: typescript.ModuleKind.CommonJS,
    target: typescript.ScriptTarget.ES2015
  },
  reportDiagnostics: true
});
assert.equal(diagnostics.length, 0, 'spec comparator should transpile without diagnostics');

const compiledModule = { exports: {} };
new Function('exports', 'require', 'module', outputText)(compiledModule.exports, require, compiledModule);
const { isSpecEqual } = compiledModule.exports;

const firstFormatter = () => 'first';
const secondFormatter = () => 'second';
assert.equal(isSpecEqual({ formatter: firstFormatter }, { formatter: secondFormatter }), false);
assert.equal(isSpecEqual({ formatter: firstFormatter }, { formatter: firstFormatter }), true);
assert.equal(isSpecEqual({ axis: { visible: true } }, { axis: { visible: true } }), true);
assert.equal(isSpecEqual({ date: new Date(0) }, { date: new Date(0) }), true);
assert.equal(isSpecEqual({ date: new Date(0) }, { date: new Date(1) }), false);

function cyclicSpec(value) {
  const spec = { value };
  spec.self = spec;
  return spec;
}
assert.equal(isSpecEqual(cyclicSpec(1), cyclicSpec(1)), true);
assert.equal(isSpecEqual(cyclicSpec(1), cyclicSpec(2)), false);

console.log('Taro VChart spec equality checks passed');
