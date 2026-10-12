import { Page, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { pathToFileURL } from 'url';
import { randomUUID } from 'crypto';
export const repo = path.resolve(__dirname, '../../../..');
export const skillRoot = path.join(repo, 'skills/data-science-visualization');
export const artifacts = path.join(repo, '.vchart-statplots/dsv');
export const python = process.env.DSV_PYTHON || 'python3';
export function generate(request: any, name = 'page') {
  const directory = path.join(artifacts, 'generated', name + '-' + randomUUID());
  fs.mkdirSync(directory, { recursive: true });
  const input = path.join(directory, 'request.json');
  fs.writeFileSync(input, JSON.stringify(request));
  execFileSync(python, [
    path.join(skillRoot, 'scripts/generate_visualization.py'),
    '--request',
    input,
    '--output',
    path.join(directory, 'out')
  ]);
  return path.join(directory, 'out/visualization.html');
}
export async function openGenerated(page: Page, html: string, cached = true) {
  if (cached) {
    execFileSync(process.execPath, [path.join(repo, 'packages/vchart-statplots/scripts/cache-published-umd.mjs')]);
    const manifest = JSON.parse(fs.readFileSync(path.join(artifacts, 'published/manifest.json'), 'utf8'));
    for (const entry of Object.values(manifest.files) as any[]) {
      await page.route(entry.url, route => route.fulfill({ path: entry.path, contentType: 'text/javascript' }));
    }
  }
  await page.goto(pathToFileURL(html).href);
  await expect.poll(() => page.evaluate(() => (window as any).__DSV_STATUS__?.ready)).toBe(true);
}
export function tableRequest(charts: any[], controls: any = {}, records?: any[]) {
  return {
    version: 1,
    title: '交互数据探索',
    dataset: {
      source: {
        records: records || [
          { id: '001', x: 0, y: 0, alt: 10, group: 'A' },
          { id: '002', x: 1, y: 1, alt: 20, group: 'A' },
          { id: '003', x: 2, y: 4, alt: 30, group: 'B' },
          { id: '004', x: 4, y: 2, alt: 40, group: 'B' }
        ]
      },
      idColumn: 'id',
      columns: [
        { name: 'id', type: 'string' },
        { name: 'x', type: 'number', label: '年龄', unit: '岁' },
        { name: 'y', type: 'number', label: '收入', unit: '元' },
        { name: 'alt', type: 'number', label: '消费', unit: '元' },
        { name: 'group', type: 'string', label: '地区' }
      ]
    },
    charts,
    controls
  };
}
export function histogram() {
  return {
    id: 'hist',
    binding: { type: 'histogram', fields: { value: 'x' }, options: { title: '指标分布', binning: { binCount: 1 } } }
  };
}
export async function expectRendered(page: Page) {
  const charts = await page.evaluate(() => (window as any).__DSV_STATUS__.charts);
  expect(
    charts.every((chart: any) => chart.status === 'rendered'),
    JSON.stringify(charts)
  ).toBe(true);
}
export async function marks(page: Page, id: string) {
  return page.evaluate(id => {
    const canvas = document.querySelector(`#dsv-${id} canvas`)!.getBoundingClientRect();
    return (window as any).__DSV_CONTROLLERS__
      .get(id)
      .chart.getChart()
      .getAllSeries()
      .flatMap((series: any) =>
        series
          .getSeriesMark()
          .getGraphics()
          .map((g: any) => ({
            datum: g.context?.data?.[0],
            states: g.currentStates,
            x: canvas.x + (g.globalAABBBounds.x1 + g.globalAABBBounds.x2) / 2,
            y: canvas.y + (g.globalAABBBounds.y1 + g.globalAABBBounds.y2) / 2
          }))
      );
  }, id);
}
