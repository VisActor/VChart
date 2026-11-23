import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { expect, it } from 'vitest';
import { getDefaultConfig } from '../logic/config';
import { buildUmd } from './umd';

it('writes both UMD variants from one compiled ESM graph', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'vchart-umd-'));
  try {
    await fs.mkdir(path.join(root, 'es'));
    await fs.writeFile(path.join(root, 'es/index.js'), 'export const value = 42;');
    let starts = 0;
    const config = {
      ...getDefaultConfig(),
      name: 'TestBundle',
      umdCompress: false,
      rollupOptions: {
        plugins: [
          {
            name: 'count-builds',
            buildStart(): void {
              starts += 1;
            }
          }
        ]
      }
    };
    await buildUmd(config, root, { name: 'test', version: '1.0.0' }, [false, true], true);
    expect(starts).toBe(1);
    for (const file of ['test.js', 'test.min.js']) {
      const context = { TestBundle: {} };
      vm.runInNewContext(await fs.readFile(path.join(root, 'dist', file), 'utf8'), context);
      expect(context.TestBundle).toMatchObject({ value: 42 });
    }
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});

it('keeps browser globals, external dependencies and version replacement', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'vchart-browser-umd-'));
  try {
    await fs.mkdir(path.join(root, 'src'));
    await fs.writeFile(
      path.join(root, 'src/index.ts'),
      "import { external } from 'test-external'; export const version: string = __VERSION__ + external;"
    );
    await buildUmd(
      {
        ...getDefaultConfig(),
        name: 'TestBundle',
        browserUmd: true,
        external: ['test-external'],
        globals: { 'test-external': 'TestExternal' },
        envs: { __VERSION__: '"1.0.0"' }
      },
      root,
      { name: 'test', version: '1.0.0' },
      [false]
    );
    const context = { TestBundle: {}, TestExternal: { external: '-browser' } };
    vm.runInNewContext(await fs.readFile(path.join(root, 'dist/test.js'), 'utf8'), context);
    expect(context.TestBundle).toMatchObject({ version: '1.0.0-browser' });
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});
