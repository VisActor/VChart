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
for (const name of ['distribution', 'comparison', 'relationships', 'quality', 'external']) {
  test(`copied skill generates and opens ${name} outside the repo`, async ({ page }) => {
    const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'dsv-portable-'));
    try {
      const copied = path.join(temporary, 'skill');
      fs.cpSync(skillRoot, copied, { recursive: true, filter: file => !file.includes('__pycache__') });
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

test('layout fits 360px in light and dark, and live CDN works without interception', async ({ page }) => {
  test.setTimeout(90000);
  const request = JSON.parse(fs.readFileSync(path.join(skillRoot, 'examples/distribution.json'), 'utf8'));
  request.dataset.source.path = path.join(skillRoot, 'examples/observations.csv');
  const html = generate(request);
  await openGenerated(page, html, false);
  await expectRendered(page);
  await page.setViewportSize({ width: 360, height: 800 });
  for (const dark of [false, true]) {
    if (dark) {
      await page.locator('#theme').click();
      await expect(page.locator('body')).toHaveClass('dark');
    }
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({
      path: path.join(artifacts, 'screenshots', dark ? '360-dark.png' : '360-light.png'),
      fullPage: true
    });
  }
});
