import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { skillRoot, generate, openGenerated, expectRendered, marks } from './skill-helpers';
const resource = path.join(skillRoot, 'references/statplots');
const catalog = JSON.parse(fs.readFileSync(path.join(resource, 'docs/plot-catalog.json'), 'utf8'));
for (const entry of catalog) {
  test(`published UMD renders generated ${entry.type} artifact`, async ({ page }) => {
    const spec = JSON.parse(fs.readFileSync(path.join(resource, entry.example), 'utf8'));
    const html = generate(
      { version: 1, title: entry.name, charts: [{ id: 'plot', spec, source: { label: '上游演示输入' } }] },
      entry.type
    );
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    await openGenerated(page, html);
    await expectRendered(page);
    expect((await marks(page, 'plot')).length).toBeGreaterThan(0);
    expect(errors).toEqual([]);
  });
}
