/**
 * @description 获取标注的默认初始配置
 */
import {
  type IVChart,
  type ICartesianSeries,
  STACK_FIELD_TOTAL_TOP,
  STACK_FIELD_TOTAL,
  STACK_FIELD_END
} from '@visactor/vchart';
import { type IPointLike, array } from '@visactor/vutils';
import { type IText } from '@visactor/vrender-core';
import { sum } from '../math';
import type { Datum } from '../../data/interface';

export const DEFAULT_OFFSET_FOR_GROWTH_MARKLINE = 30;
export const DEFAULT_OFFSET_FOR_TOTAL_DIFF_MARKLINE = 30;

/**
 * CAGR（复合年增长率）是一种用于描述投资、业务或其他金融项目在一段时间内的平均增长率的度量
 * @param EV 是结束值
 * @param BV  是开始值
 * @param n 是年数
 * @returns CAGR
 */
export function calculateCAGR(EV: number, BV: number, n: number) {
  return Math.pow(EV / BV, 1 / n) - 1;
}

// TODO: 移到 vutils-extension 中
export function getInsertPoints(
  start: IPointLike,
  end: IPointLike,
  direction: 'top' | 'bottom' | 'left' | 'right',
  offset: number = 0
) {
  const points: IPointLike[] = [];
  const dy = start.y - end.y;
  const dx = start.x - end.x;

  switch (direction) {
    case 'top':
      points.push(start);
      points.push({
        x: start.x,
        y: dy > 0 ? start.y - offset - Math.abs(dy) : start.y - offset
      });
      points.push({
        x: end.x,
        y: dy > 0 ? end.y - offset : end.y - offset - Math.abs(dy)
      });
      points.push(end);
      break;
    case 'bottom':
      points.push(start);
      points.push({ x: start.x, y: dy < 0 ? start.y + offset + Math.abs(dy) : start.y + offset });
      points.push({ x: end.x, y: dy < 0 ? end.y + offset : end.y + offset + Math.abs(dy) });
      points.push(end);
      break;
    case 'left':
      points.push(start);
      points.push({
        x: dx > 0 ? start.x - offset - Math.abs(dx) : start.x - offset,
        y: start.y
      });
      points.push({
        x: dx > 0 ? end.x - offset : end.x - offset - Math.abs(dx),
        y: end.y
      });
      points.push(end);
      break;
    case 'right':
      points.push(start);
      points.push({
        x: dx > 0 ? start.x + offset : start.x + offset + Math.abs(dx),
        y: start.y
      });
      points.push({
        x: dx > 0 ? end.x + offset + Math.abs(dx) : end.x + offset,
        y: end.y
      });
      points.push(end);
      break;
    default:
      break;
  }
  return points;
}

// TODO: 移到 vutils-extension 中
export function getTextOffset(
  start: IPointLike,
  end: IPointLike,
  direction: 'top' | 'bottom' | 'left' | 'right',
  offset: number = 0
) {
  const dy = start.y - end.y;
  const dx = start.x - end.x;

  if (direction === 'bottom') {
    return {
      dx: dx > 0 ? -dx / 2 : Math.abs(dx / 2),
      dy: dy > 0 ? offset : Math.abs(dy) + offset
    };
  }

  if (direction === 'top') {
    return {
      dx: dx > 0 ? -Math.abs(dx / 2) : +Math.abs(dx / 2),
      dy: dy > 0 ? -(Math.abs(dy) + offset) : -offset
    };
  }

  if (direction === 'left') {
    return {
      dx: dx > 0 ? -dx - offset : -offset,
      dy: dy > 0 ? -(dy / 2) : Math.abs(dy / 2)
    };
  }

  if (direction === 'right') {
    return {
      dx: dx > 0 ? offset : Math.abs(dx) + offset,
      dy: dy > 0 ? -(dy / 2) : Math.abs(dy / 2)
    };
  }

  return {};
}

export function groupByFields(data: Datum, groupFields: string[]) {
  const result = {};
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const groupKey = groupFields.map(field => item[field]).join('-');
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
  }
  return result;
}

export function stackTotal(stackData: any, valueField: string) {
  if ('values' in stackData && stackData.values.length) {
    const total = sum(stackData.values, valueField);
    stackData.values.forEach((v: Datum) => {
      v[STACK_FIELD_TOTAL] = total;
      delete v[STACK_FIELD_TOTAL_TOP];
    });
    const maxNode = stackData.values.reduce((max: Datum, current: Datum) => {
      return current[STACK_FIELD_END] > max[STACK_FIELD_END] ? current : max;
    });
    maxNode[STACK_FIELD_TOTAL_TOP] = true;
    return;
  }
  for (const key in stackData.nodes) {
    stackTotal(stackData.nodes[key], valueField);
  }
}

export function isDataSameInFields(data1: Datum, data2: Datum, fields: string[]) {
  return fields.every(field => data1[field] === data2[field]);
}

export function adjustTotalDiffCoordinatesOffset(
  datum: Datum,
  series: ICartesianSeries,
  vchart: IVChart,
  offset = { x: 0, y: 0 }
) {
  const labels = vchart.getStage().getElementsByName('data-label');
  if (labels && labels.length) {
    let allLabelTexts: IText[] = [];
    labels.forEach((label: any) => {
      allLabelTexts = allLabelTexts.concat(label.getElementsByType('text') as IText[]);
    });
    const isHorizontal = series.direction === 'horizontal';
    const isXInverse = series.getXAxisHelper().isInverse();
    const isYInverse = series.getYAxisHelper().isInverse();
    const isStack = series.getStack();
    const datumPosition = {
      x: series.getXAxisHelper().dataToPosition(array(series.getSpec().xField).map(field => datum[field])),
      y: series.getYAxisHelper().dataToPosition(array(series.getSpec().yField).map(field => datum[field]))
    };
    let matchLabels;
    if (isHorizontal) {
      const fields = isStack
        ? array(series.getSpec().yField)
        : [...array(series.getSpec().yField), ...array(series.getSpec().xField)];

      matchLabels = allLabelTexts.filter(
        text =>
          isDataSameInFields(datum, (text.attribute as any).data, fields) &&
          text.AABBBounds.y1 <= datumPosition.y &&
          text.AABBBounds.y2 >= datumPosition.y &&
          (isXInverse ? text.AABBBounds.x1 < datumPosition.x : text.AABBBounds.x2 > datumPosition.x)
      );
    } else {
      const fields = isStack
        ? array(series.getSpec().xField)
        : [...array(series.getSpec().yField), ...array(series.getSpec().xField)];
      matchLabels = allLabelTexts.filter(
        text =>
          isDataSameInFields(datum, (text.attribute as any).data, fields) &&
          text.AABBBounds.x1 <= datumPosition.x &&
          text.AABBBounds.x2 >= datumPosition.x &&
          (isYInverse ? text.AABBBounds.y2 > datumPosition.y : text.AABBBounds.y1 < datumPosition.y)
      );
    }

    if (matchLabels && matchLabels.length) {
      if (isHorizontal) {
        offset.x = isXInverse
          ? Math.min(...matchLabels.map(text => text.AABBBounds.x1)) - datumPosition.x
          : Math.max(...matchLabels.map(text => text.AABBBounds.x2)) - datumPosition.x;
      } else {
        offset.y = isYInverse
          ? Math.max(...matchLabels.map(text => text.AABBBounds.y2)) - datumPosition.y
          : Math.min(...matchLabels.map(text => text.AABBBounds.y1)) - datumPosition.y;
      }
    }
  }

  return offset;
}

export function getDefaultGrowthLineOffset(series: ICartesianSeries) {
  const isHorizontal = series.direction === 'horizontal';

  const isXInverse = series.getXAxisHelper().isInverse();
  const isYInverse = series.getYAxisHelper().isInverse();

  const offset = `${
    (isHorizontal ? (isXInverse ? -1 : 1) : isYInverse ? 1 : -1) * DEFAULT_OFFSET_FOR_GROWTH_MARKLINE
  }%`;

  return [
    {
      x: isHorizontal ? offset : 0,
      y: isHorizontal ? 0 : offset
    },
    {
      x: isHorizontal ? offset : 0,
      y: isHorizontal ? 0 : offset
    }
  ];
}
