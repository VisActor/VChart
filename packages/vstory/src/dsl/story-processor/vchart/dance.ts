import VChart, { IChartSpec } from '@visactor/vchart';
import { getAllSeriesMarksWithoutRoot } from '../../../util/vchart-api';
import { isDatumEqual } from '../../utils/datum';
import { isNil } from '@visactor/vutils';

export const danceProcessor = (chartInstance: VChart, spec: IChartSpec, addAction: any) => {
  if (!chartInstance) {
    return;
  }

  const marks = getAllSeriesMarksWithoutRoot(chartInstance).filter(mark => mark.type === 'rect');

  if (!marks.length) {
    return;
  }

  marks.forEach(mark => {
    const product = mark.getProduct();
    const { elements } = product;

    const element = elements.find(e => isDatumEqual(e.data, addAction.data));
    if (isNil(element)) {
      return;
    }

    const duration = 500;
    const queue = [
      { dy: -50, scaleY: 0.5, fill: 'red' },
      { dy: 0, scaleY: 0.5, fill: 'red' },
      { dy: -30, scaleY: 0.7, fill: 'red' },
      { dy: 0, scaleY: 0.7, fill: 'red' },
      { dy: -18, scaleY: 0.9, fill: 'red' },
      { dy: 0, scaleY: 1, fill: 'red' }
    ];

    queue.forEach(v => {
      element
        .getGraphicItem()
        .animate()
        .to(v, duration / queue.length, 'easeIn');
    });
  });
};

// 改mark的属性的方案有种
// mark.encode样式;
// Graphic.attrs;
// 限制: 一定不能调用updateSpec;
// 但可以调用updateData;

// // 做动画 有2种
// mark.animate.run(); //一组elements
// 限制: 一定不能调用updateSpec;
// 但可以调用updateData;

// //
// Graphic.animate(); // 单个element
// 限制: 一定不能调用updateSpec;
// 不能调用updateData;
