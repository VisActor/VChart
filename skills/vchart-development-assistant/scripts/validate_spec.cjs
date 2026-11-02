#!/usr/bin/env node
// Check syntax, then check configurations that can run without host globals.
// This is a configuration check, not a security sandbox or browser render test.
const fs = require('node:fs');
const vm = require('node:vm');
const {validateSpec} = require('./spec-contract.cjs');

function validateSource(source) {
  let script;
  try {
    script = new vm.Script(source + '\n; typeof spec !== "undefined" ? spec : undefined;');
  } catch (error) {
    return {ok: false, specChecked: false, errors: [{code: 'SOURCE_SYNTAX', path: 'spec', message: String(error.message)}]};
  }
  try {
    const spec = script.runInNewContext(Object.create(null), {timeout: 1000});
    return {...validateSpec(spec), specChecked: true};
  } catch (error) {
    // A missing global may be supplied by the browser or the host. Do not mock it
    // or report a successful Spec check; the template checks the real result.
    if (error.name === 'ReferenceError') {
      return {
        ok: true,
        specChecked: false,
        errors: [],
        warnings: [{code: 'RUNTIME_VALIDATION_DEFERRED', path: 'spec', message: `${error.message}; syntax checked, validate the Spec in the browser.`}],
      };
    }
    return {ok: false, specChecked: false, errors: [{code: 'SOURCE_EVALUATION', path: 'spec', message: String(error.message)}]};
  }
}

if (require.main === module) {
  const source = process.argv[2] === '--stdin' ? fs.readFileSync(0, 'utf8') : fs.readFileSync(process.argv[2], 'utf8');
  const result = validateSource(source);
  process.stdout.write(JSON.stringify(result) + '\n');
  process.exitCode = result.ok ? 0 : 1;
}
module.exports = {validateSource};
