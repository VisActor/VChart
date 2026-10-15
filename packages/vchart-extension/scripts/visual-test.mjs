import fs from 'node:fs/promises';
import { main } from '../../vchart/scripts/visual-test.mjs';
import { build } from './visual/build.mjs';

main({
  suitePath: 'packages/vchart-extension/__tests__/visual',
  outputDirectory: '.vchart-visual/extension',
  command: 'node packages/vchart-extension/scripts/visual-test.mjs',
  buildBundle: build,
  buildKey: await fs.readFile(new URL('./visual/build.mjs', import.meta.url), 'utf8')
}).catch(error => {
  console.error(`${error.code ?? 'EXECUTION_FAILED'}: ${error.message}`);
  process.exitCode = 2;
});
