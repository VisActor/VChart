import { assertionError } from '../../../assertions.mjs';
import { verifyRendered } from '../../../helpers.mjs';
import { interactionFrame, interactionTarget } from '../../../interaction-helpers.mjs';

/**
 * 验证目的：防止 #4577 的桑基图横向滚动失效。
 * 图表类型：sankey。
 * 关键配置：overflow: 'scroll'、固定 linkWidth。
 * 场景条件：三层固定流向，缩窄绘图区后链接仍宽于视口。
 * 最终检查：真实滚轮和滑块拖动均移动内容，根组视口随绘图区调整。
 * 覆盖边界：横向溢出和桌面指针交互。
 */
const wheelDelta = 100;

async function readViewport(page) {
  return page.evaluate(() => {
    const [series] = window.__visualChart.getChart().getAllSeries();
    const { width, height } = series.getRootMark().getProduct().attribute;
    return { width, height, region: series.getRegion().getLayoutRect() };
  });
}

async function readScroll(page) {
  return page.evaluate(() => {
    const [series] = window.__visualChart.getChart().getAllSeries();
    const group = series.getRootMark().getProduct();
    const scrollbar = group.parent.children.find(
      child => child.isScrollBar && child.attribute.direction === 'horizontal'
    );
    return {
      offset: group.attribute.scrollX ?? 0,
      range: scrollbar?.attribute.range,
      name: scrollbar?.name
    };
  });
}

export default {
  createSpec() {
    return {
      type: 'sankey',
      overflow: 'scroll',
      linkWidth: 450,
      nodeWidth: 20,
      categoryField: 'name',
      nodeKey: 'name',
      sourceField: 'source',
      targetField: 'target',
      valueField: 'value',
      data: [
        {
          values: [
            {
              nodes: [{ name: 'Source' }, { name: 'Process' }, { name: 'Target' }],
              links: [
                { source: 'Source', target: 'Process', value: 8 },
                { source: 'Process', target: 'Target', value: 8 }
              ]
            }
          ]
        }
      ]
    };
  },

  async exercise(page) {
    const initial = await readViewport(page);
    await page.evaluate(() => window.__visualChart.resize(640, 520));
    await interactionFrame(page);
    const resized = await readViewport(page);
    const point = await interactionTarget(page, 'node');
    await page.mouse.move(point.x, point.y);
    await page.mouse.wheel(wheelDelta, 0);
    await interactionFrame(page);

    const wheel = await readScroll(page);
    if (wheel.offset !== -wheelDelta || !wheel.name || !(wheel.range?.[0] > 0)) {
      throw assertionError(`横向滚轮应将内容偏移至 -${wheelDelta}px 并显示滚动条，实际为 ${JSON.stringify(wheel)}`);
    }

    // 从已渲染的滑块起拖，避免把轨道点击误判为拖动。
    const slider = await page.evaluate(name => {
      const scrollbar = window.__visualChart.getStage().find(graphic => graphic.name === name, true);
      const thumb = scrollbar.find(graphic => graphic.name === 'slider', true);
      if (!thumb) throw new Error('缺少可拖动的桑基图滚动条滑块');
      const { x1, y1, x2, y2 } = thumb.globalAABBBounds;
      return { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
    }, wheel.name);
    await page.mouse.move(slider.x, slider.y);
    await page.mouse.down();
    await page.mouse.move(slider.x + 60, slider.y, { steps: 5 });
    await page.mouse.up();
    await interactionFrame(page);
    await page.evaluate(result => (window.__sankeyScrollExercise = result), { initial, resized, wheel });
  },

  async verify(page) {
    await verifyRendered(page);
    const { initial, resized, wheel } = await page.evaluate(() => window.__sankeyScrollExercise);
    if (
      initial.width !== initial.region.width ||
      initial.height !== initial.region.height ||
      resized.width !== resized.region.width ||
      resized.height !== resized.region.height ||
      resized.width >= initial.width ||
      resized.height >= initial.height
    ) {
      throw assertionError('桑基图滚动视口的宽高应随绘图区缩小');
    }
    const dragged = await readScroll(page);
    if (!(dragged.offset < wheel.offset && dragged.range?.[0] > wheel.range[0])) {
      throw assertionError(`拖动滑块应继续移动桑基图内容，实际为 ${JSON.stringify(dragged)}`);
    }
  }
};
