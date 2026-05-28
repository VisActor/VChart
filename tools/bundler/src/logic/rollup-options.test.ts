import { describe, expect, it } from 'vitest';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { rollup } from 'rollup';
import { getRollupOptions } from './rollup.config';
import { getDefaultConfig } from './config';

describe('rollup config', () => {
  it('does not disable declaration emit while composite is enabled', async () => {
    const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'bundler-rollup-'));
    fs.ensureDirSync(path.join(projectRoot, 'src'));
    fs.writeFileSync(path.join(projectRoot, 'src/index.ts'), 'export const value = 1;\n');
    fs.writeJsonSync(path.join(projectRoot, 'tsconfig.json'), {
      compilerOptions: {
        rootDir: './src',
        composite: true,
        declaration: true,
        module: 'ESNext',
        target: 'ES2015'
      },
      include: ['src']
    });

    const warnings: string[] = [];
    const options = getRollupOptions(
      projectRoot,
      path.join(projectRoot, 'src/index.ts'),
      { name: '@foo/bar', version: '1.0.0' },
      { presets: [], plugins: [] },
      {
        ...getDefaultConfig(),
        tsconfig: 'tsconfig.json',
        outputDir: { umd: 'dist' },
        rollupOptions: {
          onwarn(warning) {
            warnings.push(warning.message);
          }
        }
      }
    );

    const bundle = await rollup(options);
    await bundle.close();

    expect(warnings.some(message => message.includes('TS6304'))).toBe(false);
  });
});
