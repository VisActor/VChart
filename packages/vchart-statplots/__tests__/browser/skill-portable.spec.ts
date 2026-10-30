import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { execFileSync } from 'child_process';
import {
  skillRoot,
  artifacts,
  python,
  openGenerated,
  expectRendered,
  generate,
  tableRequest,
  marks
} from './skill-helpers';
function expectUsageResources(copied: string) {
  for (const name of ['tests', 'references/statplots/manifest.json', 'references/statplots/package.json']) {
    expect(fs.existsSync(path.join(copied, name)), name).toBe(false);
  }
  expect(fs.existsSync(path.join(copied, 'references/statplots/snapshot.json'))).toBe(true);
}
for (const name of ['distribution', 'comparison', 'relationships', 'quality', 'external', 'interactive']) {
  test(`copied skill generates and opens ${name} outside the repo`, async ({ page }) => {
    const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'dsv-portable-'));
    try {
      const copied = path.join(temporary, 'skill');
      fs.cpSync(skillRoot, copied, { recursive: true, filter: file => !file.includes('__pycache__') });
      expectUsageResources(copied);
      execFileSync(
        python,
        [
          path.join(copied, 'scripts/generate_visualization.py'),
          '--request',
          path.join(copied, 'examples', `${name}.json`),
          '--output',
          path.join(temporary, 'out')
        ],
        { cwd: temporary }
      );
      fs.unlinkSync(path.join(copied, 'examples/observations.csv'));
      execFileSync(
        python,
        [
          path.join(copied, 'scripts/generate_visualization.py'),
          '--request',
          path.join(temporary, 'out/visualization.request.json'),
          '--output',
          path.join(temporary, 'replayed')
        ],
        { cwd: temporary }
      );
      await openGenerated(page, path.join(temporary, 'replayed/visualization.html'));
      await expectRendered(page);
      fs.mkdirSync(path.join(artifacts, 'screenshots'), { recursive: true });
      await page.setViewportSize({ width: 1000, height: 800 });
      await page.screenshot({ path: path.join(artifacts, 'screenshots', `${name}.png`), fullPage: true });
      if (name === 'quality')
        expect(
          await page.evaluate(
            () => (window as any).__DSV_CONTROLLERS__.get('missing').spec.data.observations[0].values.income
          )
        ).toBe(0);
    } finally {
      fs.rmSync(temporary, { recursive: true, force: true });
    }
  });
}
test('copied skill renders a local variant outside the repo', async ({ page }) => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'dsv-portable-variant-'));
  try {
    const copied = path.join(temporary, 'skill');
    fs.cpSync(skillRoot, copied, { recursive: true, filter: file => !file.includes('__pycache__') });
    expectUsageResources(copied);
    const resource = path.join(copied, 'references/statplots');
    const variants: Record<string, { example: string; options: Record<string, unknown> }[]> = JSON.parse(
      fs.readFileSync(path.join(resource, 'variants.json'), 'utf8')
    );
    for (const item of Object.values(variants).flat()) {
      expect(fs.existsSync(path.join(resource, item.example)), item.example).toBe(true);
    }
    const entry = variants.countPlot.find(item => item.options.statistic === 'proportion')!;
    const spec = JSON.parse(fs.readFileSync(path.join(resource, entry.example), 'utf8'));
    const input = path.join(temporary, 'request.json');
    fs.writeFileSync(
      input,
      JSON.stringify({
        version: 1,
        title: '发布比例示例',
        charts: [{ id: 'plot', spec, source: { label: '发布变体示例' } }]
      })
    );
    execFileSync(
      python,
      [
        path.join(copied, 'scripts/generate_visualization.py'),
        '--request',
        input,
        '--output',
        path.join(temporary, 'out')
      ],
      { cwd: temporary }
    );
    await openGenerated(page, path.join(temporary, 'out/visualization.html'));
    await expectRendered(page);
    expect((await marks(page, 'plot')).length).toBeGreaterThan(0);
    expect(await page.evaluate(() => (window as any).__DSV_CONTROLLERS__.get('plot').spec.statistic)).toBe(
      'proportion'
    );
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

const bindings: Record<string, any> = {
  countPlot: { category: 'group' },
  histogram: { value: 'x' },
  kdePlot: { value: 'x' },
  ecdfPlot: { value: 'x' },
  boxPlot: { category: 'group', value: 'x' },
  violinPlot: { category: 'group', value: 'x' },
  stripPlot: { category: 'group', value: 'x' },
  scatterPlot: { x: 'x', y: 'y' },
  hexbinPlot: { x: 'x', y: 'y' },
  missingValueMatrix: { variables: ['x', 'group'] },
  correlationMatrix: { variables: ['x', 'y'] },
  pairPlot: { variables: ['x', 'y'] }
};
for (const [type, fields] of Object.entries(bindings)) {
  test(`published UMD consumes real table binding ${type}`, async ({ page }) => {
    await openGenerated(page, generate(tableRequest([{ id: 'plot', binding: { type, fields } }])));
    await expectRendered(page);
    expect((await marks(page, 'plot')).length).toBeGreaterThan(0);
  });
}

test('copied output fits 360px and loads live CDN after removing the skill', async ({ page }) => {
  test.setTimeout(90000);
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'dsv-live-independent-'));
  try {
    const copied = path.join(temporary, '独立 skill');
    fs.cpSync(skillRoot, copied, {
      recursive: true,
      filter: file => !file.includes('__pycache__') && path.basename(file) !== '.DS_Store'
    });
    expectUsageResources(copied);
    const input = path.join(copied, 'examples/distribution.json');
    const request = JSON.parse(fs.readFileSync(input, 'utf8'));
    request.presentation = { actions: ['theme'] };
    fs.writeFileSync(input, JSON.stringify(request));
    const output = path.join(temporary, 'out');
    execFileSync(
      python,
      [path.join(copied, 'scripts/generate_visualization.py'), '--request', input, '--output', output],
      { cwd: '/' }
    );
    fs.rmSync(copied, { recursive: true });
    await openGenerated(page, path.join(output, 'visualization.html'), false);
    await expectRendered(page);
    expect((await marks(page, 'distribution')).length).toBeGreaterThan(0);
    await page.setViewportSize({ width: 360, height: 800 });
    for (const dark of [false, true]) {
      if (dark) {
        await page.locator('#theme').click();
        await expect(page.locator('body')).toHaveClass('dark');
      }
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
        .toBe(true);
      await page.screenshot({
        path: path.join(artifacts, 'screenshots', dark ? '360-dark.png' : '360-light.png'),
        fullPage: true
      });
    }
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});
