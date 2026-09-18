import assert from 'node:assert/strict';
import { test } from 'node:test';
import { execSync } from 'child_process';
import { run } from './run';

test('throws when the project cannot be found', () => {
  assert.throws(
    () => run(['--project', 'missing-project', '--script', 'test']),
    /Cannot find Rush project: missing-project/
  );
});

test('propagates delegated script failures', () => {
  const scriptError = new Error('script failed');
  const fail: typeof execSync = () => {
    throw scriptError;
  };

  assert.throws(
    () => run(['--project', '@visactor/vchart', '--script', 'test'], fail),
    error => error === scriptError
  );
});
