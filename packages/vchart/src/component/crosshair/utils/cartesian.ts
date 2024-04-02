import type { BandScale } from '@visactor/vscale';
// eslint-disable-next-line no-duplicate-imports
import { isContinuous, isDiscrete } from '@visactor/vscale';
import type { ICartesianSeries } from '../../../series';
import type { ILayoutPoint, StringOrNumber } from '../../../typings';
import type { IBound, IHair } from '../base';
import { LayoutType } from '../config';
import type { AxisCurrentValueMap, ICrosshairInfoX, ICrosshairInfoY, ICrosshairLabelInfo } from '../interface';
import { getDatumByValue } from './common';
import { getAxisLabelOffset } from '../../axis/util';
import { isValid } from '@visactor/vutils';
import type { IAxis, ILinearAxis } from '../../axis';
import { getFormatFunction } from '../../util';

export const layoutByValue = (
  tag: number = LayoutType.ALL,
  series: ICartesianSeries,
  layoutStartPoint: ILayoutPoint,
  currValueX: AxisCurrentValueMap,
  currValueY: AxisCurrentValueMap,
  xHair: IHair,
  yHair: IHair,
  enableRemain: boolean = false,
  cacheXCrossHairInfo?: ICrosshairInfoX,
  cacheYCrossHairInfo?: ICrosshairInfoY
) => {
  const layoutX = tag & LayoutType.VERTICAL;
  const layoutY = tag & LayoutType.HORIZONTAL;

  if (!layoutStartPoint) {
    layoutStartPoint = { x: 0, y: 0 };
  }

  // 计算x和y的坐标
  let xAxis = null;
  let yAxis = null;
  let x = 0;
  let y = 0;
  if (currValueX.size) {
    const item = Array.from(currValueX.values())[0];
    x = item.axis.getScale().scale(item.value) + item.axis.getLayoutStartPoint().x - layoutStartPoint.x;
    xAxis = item.axis;
  }
  if (currValueY.size) {
    const item = Array.from(currValueY.values())[0];
    y = item.axis.getScale().scale(item.value) + item.axis.getLayoutStartPoint().y - layoutStartPoint.y;
    yAxis = item.axis;
  }

  const xVisible = !!currValueX.size && Number.isFinite(x);
  const yVisible = !!currValueY.size && Number.isFinite(y);
  const xUseCache = enableRemain && !xVisible && isValid(cacheXCrossHairInfo);
  const yUseCache = enableRemain && !yVisible && isValid(cacheYCrossHairInfo);

  let xCrossHairInfo: ICrosshairInfoX;
  if (layoutX) {
    xCrossHairInfo = xUseCache
      ? cacheXCrossHairInfo
      : {
          height: 0,
          leftPos: 0,
          rightPos: 0,
          topPos: 0,
          x: 0,
          bottom: { visible: false, text: '', dx: 0, dy: 0 },
          top: { visible: false, text: '', dx: 0, dy: 0 },
          visible: xVisible,
          axis: xAxis
        };
  }

  let yCrossHairInfo: ICrosshairInfoY;
  if (layoutY) {
    yCrossHairInfo = yUseCache
      ? cacheYCrossHairInfo
      : {
          width: 0,
          leftPos: 0,
          topPos: 0,
          bottomPos: 0,
          y: 0,
          left: { visible: false, text: '', dx: 0, dy: 0 },
          right: { visible: false, text: '', dx: 0, dy: 0 },
          visible: yVisible,
          axis: yAxis
        };
  }

  let bandWidth;
  let offsetWidth: number = 0;
  let bandHeight;
  let offsetHeight: number = 0;

  // 计算x轴和y轴的数据，只允许最多一对x和一对y
  if (xHair) {
    currValueX.forEach(({ axis, value }) => {
      value = value ?? '';
      let niceLabelFormatter: (value: StringOrNumber) => StringOrNumber = null;
      const xScale = axis.getScale();
      if (isDiscrete(xScale.type)) {
        bandWidth = (xScale as BandScale).bandwidth();

        if (bandWidth === 0 && (xScale as BandScale).step) {
          offsetWidth = (xScale as BandScale).step();
        }
      } else if (isContinuous(xScale.type)) {
        const fieldX = series.fieldX[0];
        const fieldX2 = series.fieldX2;
        const datum = getDatumByValue(series.getViewData().latestData, +value, fieldX, fieldX2);
        if (datum) {
          const startX = series.dataToPositionX(datum);
          if (fieldX2) {
            bandWidth = Math.abs(startX - series.dataToPositionX1(datum));
            value = `${datum[fieldX]} ~ ${datum[fieldX2]}`;
          } else {
            bandWidth = 1;
          }
          x = startX;
        }
        niceLabelFormatter = (axis as ILinearAxis).niceLabelFormatter;
      }
      if (xCrossHairInfo && xHair.label?.visible && !xUseCache) {
        const labelOffset = getAxisLabelOffset(axis.getSpec());
        if (axis.getOrient() === 'bottom') {
          xCrossHairInfo.bottom.visible = true;
          xCrossHairInfo.bottom.value = value;
          xCrossHairInfo.bottom.text = niceLabelFormatter ? niceLabelFormatter(value) : value;
          xCrossHairInfo.bottom.dx = 0;
          xCrossHairInfo.bottom.dy = labelOffset;
        } else if (axis.getOrient() === 'top') {
          xCrossHairInfo.top.visible = true;
          xCrossHairInfo.top.value = value;
          xCrossHairInfo.top.text = niceLabelFormatter ? niceLabelFormatter(value) : value;
          xCrossHairInfo.top.dx = 0;
          xCrossHairInfo.top.dy = -labelOffset;
        }
      }
    });
  }

  if (yHair) {
    currValueY.forEach(({ axis, value }) => {
      value = value ?? '';
      let niceLabelFormatter: (value: StringOrNumber) => StringOrNumber = null;
      const yScale = axis.getScale();
      if (isDiscrete(yScale.type)) {
        bandHeight = (yScale as BandScale).bandwidth();

        if (bandHeight === 0 && (yScale as BandScale).step) {
          offsetHeight = (yScale as BandScale).step();
        }
      } else if (isContinuous(yScale.type)) {
        const fieldY = series.fieldY[0];
        const fieldY2 = series.fieldY2;
        const datum = getDatumByValue(series.getViewData().latestData, +value, fieldY, fieldY2);
        if (datum) {
          const startY = series.dataToPositionY(datum);
          if (fieldY2) {
            bandHeight = Math.abs(startY - series.dataToPositionY1(datum));
            value = `${datum[fieldY]} ~ ${datum[fieldY2]}`;
          } else {
            bandHeight = 1;
          }
          y = startY;
        }
        niceLabelFormatter = (axis as ILinearAxis).niceLabelFormatter;
      }
      if (yCrossHairInfo && yHair.label?.visible && !yUseCache) {
        const labelOffset = getAxisLabelOffset(axis.getSpec());
        if (axis.getOrient() === 'left') {
          yCrossHairInfo.left.visible = true;
          yCrossHairInfo.left.value = value;
          yCrossHairInfo.left.text = niceLabelFormatter ? niceLabelFormatter(value) : value;
          yCrossHairInfo.left.dx = -labelOffset;
          yCrossHairInfo.left.dy = 0;
        } else if (axis.getOrient() === 'right') {
          yCrossHairInfo.right.visible = true;
          yCrossHairInfo.right.value = value;
          yCrossHairInfo.right.text = niceLabelFormatter ? niceLabelFormatter(value) : value;
          yCrossHairInfo.right.dx = labelOffset;
          yCrossHairInfo.right.dy = 0;
        }
      }
    });
  }

  if (xCrossHairInfo && !xUseCache) {
    const xRegion = { x1: Infinity, y1: Infinity, x2: -Infinity, y2: -Infinity };
    setRegionArea(xRegion, currValueX);
    xCrossHairInfo.leftPos = xRegion.x1;
    xCrossHairInfo.rightPos = xRegion.x2;
    xCrossHairInfo.topPos = xRegion.y1;
    xCrossHairInfo.height = xRegion.y2 - xRegion.y1;
    xCrossHairInfo.x = x + layoutStartPoint.x;

    if (xHair && xHair.label) {
      const { top, bottom } = xCrossHairInfo;
      if (top.visible) {
        setFormattedCrosshairLabel(top, 'top', xHair.label);
      }
      if (bottom.visible) {
        setFormattedCrosshairLabel(bottom, 'bottom', xHair.label);
      }
    }
  }

  if (yCrossHairInfo && !yUseCache) {
    const yRegion = { x1: Infinity, y1: Infinity, x2: -Infinity, y2: -Infinity };
    setRegionArea(yRegion, currValueY);
    yCrossHairInfo.leftPos = yRegion.x1;
    yCrossHairInfo.topPos = yRegion.y1;
    yCrossHairInfo.bottomPos = yRegion.y2;
    yCrossHairInfo.width = yRegion.x2 - yRegion.x1;
    yCrossHairInfo.y = y + layoutStartPoint.y;

    if (yHair && yHair.label) {
      const { left, right } = yCrossHairInfo;
      if (left.visible) {
        setFormattedCrosshairLabel(left, 'left', yHair.label);
      }
      if (right.visible) {
        setFormattedCrosshairLabel(right, 'right', yHair.label);
      }
    }
  }

  return {
    x: layoutX && xCrossHairInfo ? xCrossHairInfo : undefined,
    y: layoutY && yCrossHairInfo ? yCrossHairInfo : undefined,
    offsetWidth,
    offsetHeight,
    bandWidth: bandWidth ?? 0,
    bandHeight: bandHeight ?? 0
  };
};

const setFormattedCrosshairLabel = (labelInfo: ICrosshairLabelInfo, position: string, labelSpec: IHair['label']) => {
  const { formatMethod, formatter } = labelSpec;
  const { formatFunc, args } = getFormatFunction(formatMethod, formatter, labelInfo.text, {
    label: labelInfo.text,
    value: labelInfo.value,
    position
  });
  if (formatFunc) {
    labelInfo.text = formatFunc(...args);
  }
};

// 计算x轴和y轴对应的region区域
const setRegionArea = (outRegion: IBound, currentValue: AxisCurrentValueMap) => {
  currentValue.forEach(({ axis }) => {
    const regions = axis.getRegions();
    regions.forEach(r => {
      outRegion.x1 = Math.min(outRegion.x1, r.getLayoutStartPoint().x);
      outRegion.y1 = Math.min(outRegion.y1, r.getLayoutStartPoint().y);
      outRegion.x2 = Math.max(outRegion.x2, r.getLayoutStartPoint().x + r.getLayoutRect().width);
      outRegion.y2 = Math.max(outRegion.y2, r.getLayoutStartPoint().y + r.getLayoutRect().height);
    });
  });
};

export const layoutVerticalCrosshair = (
  xHair: IHair,
  crosshairInfo: ICrosshairInfoX,
  bandWidth: number,
  offsetWidth: number
) => {
  const { x, topPos, height } = crosshairInfo;

  // 外部设置的size
  const type = xHair.type;
  let positionAttribute;
  if (type === 'line') {
    positionAttribute = {
      visible: true,
      start: { x: x + bandWidth / 2, y: topPos },
      end: { x: x + bandWidth / 2, y: topPos + height }
    };
  } else if (type === 'rect') {
    const extend = getRectSize(xHair, bandWidth, crosshairInfo.axis);
    const { leftPos, rightPos } = crosshairInfo;

    positionAttribute = {
      visible: true,
      start: { x: Math.max(x - extend / 2 - offsetWidth / 2, leftPos), y: topPos },
      end: { x: Math.min(x + bandWidth + extend / 2 + offsetWidth / 2, rightPos), y: topPos + height }
    };
  }

  return positionAttribute;
};

export const layoutHorizontalCrosshair = (
  yHair: IHair,
  crosshairInfo: ICrosshairInfoY,
  bandHeight: number,
  offsetHeight: number
) => {
  const { leftPos, width, y } = crosshairInfo;

  // 外部设置的size
  const type = yHair.type;
  let positionAttribute;
  if (type === 'line') {
    positionAttribute = {
      visible: true,
      start: { x: leftPos, y: y + bandHeight / 2 },
      end: { x: leftPos + width, y: y + bandHeight / 2 }
    };
  } else if (type === 'rect') {
    const extend = getRectSize(yHair, bandHeight, crosshairInfo.axis);
    const { topPos, bottomPos } = crosshairInfo;

    positionAttribute = {
      visible: true,
      start: { x: leftPos, y: Math.max(y - extend / 2 - offsetHeight / 2, topPos) },
      end: { x: leftPos + width, y: Math.min(y + bandHeight + extend / 2 + offsetHeight / 2, bottomPos) }
    };
  }

  return positionAttribute;
};

const getRectSize = (hair: IHair, bandSize: number, axis: IAxis) => {
  // 外部设置的size
  let extend = 0;
  if (hair.style?.sizePercent) {
    extend = (hair.style.sizePercent - 1) * bandSize;
  } else if (typeof hair.style?.size === 'number') {
    extend = hair.style.size - bandSize;
  } else if (typeof hair.style?.size === 'function') {
    const axisRect = axis.getLayoutRect();
    extend = hair.style.size(axisRect, axis) - bandSize;
  }

  return extend;
};
