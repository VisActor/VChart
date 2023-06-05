import type { DataView } from '@visactor/vdataset';
import type { IPoint } from '../../typings';
import {
  checkBoundsOverlap,
  isQuadrantLeft,
  isQuadrantRight,
  isLess,
  isGreater,
  isClose,
  connectLineRadian,
  lineCirclePoints,
  circlePoint,
  isNil,
  isValidNumber,
  isFunction,
  initTextMeasure
} from '../../util';
import type { IArcSeries } from '../../series/interface';
import {
  DEFAULT_LABEL_LIMIT,
  DEFAULT_LABEL_ALIGN,
  DEFAULT_LABEL_TEXT,
  DEFAULT_LABEL_VISIBLE,
  DEFAULT_LABEL_X,
  DEFAULT_LABEL_Y,
  ARC_K,
  ARC_LABEL_HOVER_AX,
  ARC_LABEL_HOVER_AY,
  ARC_LABEL_POINT_AX,
  ARC_LABEL_POINT_AY,
  ARC_LABEL_POINT_BX,
  ARC_LABEL_POINT_BY,
  ARC_LABEL_POINT_CX,
  ARC_LABEL_POINT_CY,
  ARC_LABEL_SELECTED_AX,
  ARC_LABEL_SELECTED_AY,
  ARC_MIDDLE_ANGLE,
  ARC_QUADRANT,
  ARC_RADIAN
} from '../../constant';
import type { ITextMarkSpec, TextAlign } from '../../typings/visual';
import { STATE_VALUE_ENUM } from '../../compile/mark';
import type { IBoundsLike, TextMeasure } from '@visactor/vutils';
import type { ILabelTextMarkSpec } from '../../series/pie/interface';
import type { Quadrant } from '../../typings/common';

export interface IArcLabelOpt {
  series: IArcSeries;
}

export const arcLabel = (data: Array<DataView>, op: IArcLabelOpt) => {
  const latestData = data[0].latestData;
  const layout = new ArcLabelLayout(op.series, latestData);
  return layout.updateLabels();
};

class ArcInfo {
  key!: string;
  refDatum!: any;
  /**
   * 绘图区圆弧中点
   */
  center!: IPoint;
  /**
   * label起始区圆弧中点
   */
  outerCenter!: IPoint;
  labelSize!: { width: number; height: number };
  labelPosition!: IPoint;
  labelLimit: number;
  labelVisible: boolean;
  lastLabelY!: number;
  labelYRange!: [number, number];
  labelText!: string | string[];
  pointB!: IPoint;
  pointC!: IPoint;
  /**
   * 象限
   */
  quadrant: Quadrant;
  radian: number;
  middleAngle: number;
  k: number;

  constructor(
    refDatum: any,
    center: IPoint,
    outerCenter: IPoint,
    quadrant: Quadrant,
    radian: number,
    middleAngle: number,
    k: number
  ) {
    this.refDatum = refDatum;
    this.center = center;
    this.outerCenter = outerCenter;
    this.quadrant = quadrant;
    this.radian = radian;
    this.middleAngle = middleAngle;
    this.k = k;
    this.labelVisible = true;
    this.labelLimit = 0;
  }

  getLabelBounds(): IBoundsLike {
    if (!this.labelPosition || !this.labelSize) {
      return { x1: 0, x2: 0, y1: 0, y2: 0 };
    }
    return {
      x1: this.labelPosition.x - this.labelSize.width / 2,
      y1: this.labelPosition.y - this.labelSize.height / 2,
      x2: this.labelPosition.x + this.labelSize.width / 2,
      y2: this.labelPosition.y + this.labelSize.height / 2
    };
  }
}

type PriorityArc = {
  arc: ArcInfo;
  /**
   * 在初始 arc 数组中的索引
   */
  originIndex: number;
  priorityIndex: number;
};

export class ArcLabelLayout {
  private _series: IArcSeries;
  private _data: Array<DataView>;

  private _ellipsisWidth: number = 0;

  private _arcLeft: Map<any, ArcInfo> = new Map();
  private _arcRight: Map<any, ArcInfo> = new Map();

  private _textMeasure: TextMeasure<ITextMarkSpec>;

  constructor(series: IArcSeries, data: Array<DataView>) {
    this._series = series;
    this._data = data;
    this._textMeasure = initTextMeasure(this._getMeasureSpec() as ITextMarkSpec);
  }

  /**
   * 标签布局整体流程
   */
  updateLabels() {
    const labelConfig = this._series.getLabelConfig();

    if (!labelConfig?.visible) {
      return null;
    }

    this._setArcs();

    this._layoutLabels();
    return this._setLabelData();
  }

  /**
   * 为每条数据设置对应的 Arc
   */
  private _setArcs() {
    const valueField = this._series.getRadiusField()[0];
    const radiusRatio = this._series.getRadius();
    const labelConfig = this._series.getLabelConfig();
    const line1MinLength = labelConfig.line.line1MinLength as number;

    if (labelConfig?.visible) {
      this._clearArcs();
      const radius = this._series.computeRadius(radiusRatio);
      const center = this._series.center;
      const data = this._series.getViewData?.()?.latestData;
      let values;
      if (data.length <= 1) {
        values = data.slice();
      } else {
        switch (labelConfig?.showRule) {
          case 'headAndTail':
            values = [data[0], data[data.length - 1]];
            break;
          case 'max':
            values = [
              data.reduce((max: number, value: number) => {
                return max[valueField] > value[valueField] ? max : value;
              }, data[0])
            ];
            break;
          case 'min':
            values = [
              data.reduce((min: number, value: number) => {
                return min[valueField] < value[valueField] ? min : value;
              }, data[0])
            ];
            break;
          case 'minAndMax':
            values = [
              data.reduce((max: number, value: number) => {
                return max[valueField] > value[valueField] ? max : value;
              }, data[0]),
              data.reduce((min: number, value: number) => {
                return min[valueField] < value[valueField] ? min : value;
              }, data[0])
            ];
            break;
          case 'all':
          default:
            values = data.slice();
        }
      }
      this._ellipsisWidth = this._measureTextSize('...').width;
      for (const item of values) {
        const arcMiddle = circlePoint(
          (center as IPoint).x,
          (center as IPoint).y,
          radius * item[ARC_K],
          item[ARC_MIDDLE_ANGLE]
        );
        const outerArcMiddle = circlePoint(
          (center as IPoint).x,
          (center as IPoint).y,
          radius + line1MinLength,
          item[ARC_MIDDLE_ANGLE]
        );
        const arc = new ArcInfo(
          item,
          arcMiddle,
          outerArcMiddle,
          item[ARC_QUADRANT],
          item[ARC_RADIAN],
          item[ARC_MIDDLE_ANGLE],
          item[ARC_K]
        );
        const text = this._getFormatLabelText(item);
        arc.labelSize = this._measureTextSize(text);
        if (isQuadrantRight(arc.quadrant)) {
          this._arcRight.set(arc.refDatum, arc);
        } else if (isQuadrantLeft(arc.quadrant)) {
          this._arcLeft.set(arc.refDatum, arc);
        }
      }
    }
  }
  /**
   * 根据 key 值获取对应的 arc
   * @param key 每条数据对应的 DEFAULT_DATA_INDEX 值
   */
  private _getArc(datum: any) {
    return this._arcLeft.get(datum) || this._arcRight.get(datum);
  }

  /**
   * 清空所有 arc
   */
  private _clearArcs() {
    this._arcLeft.clear();
    this._arcRight.clear();
  }

  /**
   * 根据 arc 设置 datum 中对应的标签数据
   */
  private _setLabelData() {
    const labelConfig = this._series.getLabelConfig();
    const center = this._series.center;

    return this._data.map((v: any) => {
      const arc = this._getArc(v);
      const value = { ...v };

      if (!arc) {
        value[DEFAULT_LABEL_VISIBLE] = false;
        return value;
      }
      const { labelPosition, labelLimit, labelSize, pointB, pointC } = arc;
      if (labelConfig?.position !== 'inside') {
        const hoverLineA = circlePoint(
          (center as IPoint).x,
          (center as IPoint).y,
          this._series.computeDatumRadius(value, STATE_VALUE_ENUM.STATE_HOVER),
          arc.middleAngle
        );

        const selectedLineA = circlePoint(
          (center as IPoint).x,
          (center as IPoint).y,
          this._series.computeDatumRadius(value, STATE_VALUE_ENUM.STATE_SELECTED),
          arc.middleAngle
        );

        const pointA = circlePoint(
          (center as IPoint).x,
          (center as IPoint).y,
          this._series.computeDatumRadius(value, STATE_VALUE_ENUM.STATE_NORMAL),
          arc.middleAngle
        );
        value[ARC_LABEL_POINT_AX] = pointA.x;
        value[ARC_LABEL_POINT_AY] = pointA.y;
        value[ARC_LABEL_HOVER_AX] = hoverLineA.x;
        value[ARC_LABEL_HOVER_AY] = hoverLineA.y;
        value[ARC_LABEL_SELECTED_AX] = selectedLineA.x;
        value[ARC_LABEL_SELECTED_AY] = selectedLineA.y;
        value[ARC_LABEL_POINT_BX] = pointB.x;
        value[ARC_LABEL_POINT_BY] = pointB.y;
        value[ARC_LABEL_POINT_CX] = pointC.x;
        value[ARC_LABEL_POINT_CY] = pointC.y;
        // 外部标签绘制的 baseline 为 top
        value[DEFAULT_LABEL_Y] = labelPosition.y - labelSize.height / 2;
      } else {
        // 内部标签绘制的 baseline 为 middle
        value[DEFAULT_LABEL_Y] = labelPosition.y;
      }

      value[DEFAULT_LABEL_ALIGN] = this._computeAlign(arc);
      value[DEFAULT_LABEL_LIMIT] = Math.max(labelLimit, 0);
      value[DEFAULT_LABEL_VISIBLE] = arc.labelVisible && !isNil(arc.labelText);
      value[DEFAULT_LABEL_X] = labelPosition.x;
      value[DEFAULT_LABEL_TEXT] = arc.labelText;

      return value;
    });
  }

  /**
   * 执行内部/外部标签的布局计算
   */
  private _layoutLabels() {
    const labelConfig = this._series.getLabelConfig();
    const leftArcs = Array.from(this._arcLeft.values());
    const rightArcs = Array.from(this._arcRight.values());

    if (labelConfig?.position === 'inside') {
      this._layoutInsideLabels(rightArcs);
      this._layoutInsideLabels(leftArcs);
    } else {
      this._layoutOutsideLabels(rightArcs);
      this._layoutOutsideLabels(leftArcs);
    }
  }

  /**
   * 布局内部标签
   */
  private _layoutInsideLabels(arcs: ArcInfo[]) {
    const center = this._series.center;
    const innerRadiusRatio = this._series.getInnerRadius();
    const outerRadiusRatio = this._series.getRadius();
    const labelConfig = this._series.getLabelConfig();
    const spaceWidth = labelConfig.spaceWidth as number;

    arcs.forEach((arc: ArcInfo) => {
      const { labelSize, radian } = arc;
      const innerRadius = this._series.computeRadius(innerRadiusRatio, 1);
      const outerRadius = this._series.computeRadius(outerRadiusRatio);
      const minRadian = connectLineRadian(outerRadius, labelSize.height);
      let limit;
      if (radian < minRadian) {
        limit = 0;
      } else {
        let minRadius;
        if (radian >= Math.PI) {
          minRadius = innerRadius;
        } else {
          minRadius = Math.max(innerRadius, labelSize.height / 2 / Math.tan(radian / 2));
        }
        limit = outerRadius - minRadius - spaceWidth;
      }
      // TODO: 对于不旋转的内部标签设置 limit 为 outerRadius
      if (labelConfig?.rotate !== true) {
        limit = outerRadius - spaceWidth;
      }
      const text = this._getFormatLabelText(arc.refDatum, limit);
      arc.labelText = text;
      const labelWidth = Math.min(limit, this._measureTextSize(text).width);
      const align = this._computeAlign(arc);
      const alignOffset = align === 'left' ? labelWidth : align === 'right' ? 0 : labelWidth / 2;
      const labelRadius = outerRadius - spaceWidth - alignOffset;
      arc.labelPosition = circlePoint((center as IPoint).x, (center as IPoint).y, labelRadius, arc.middleAngle);
      arc.labelLimit = labelWidth;
      if (!isGreater(labelWidth, 0)) {
        arc.labelVisible = false;
      }
    });
  }

  /**
   * 布局外部标签
   */
  private _layoutOutsideLabels(arcs: ArcInfo[]) {
    const { height } = this._getPlotLayout();
    const labelConfig = this._series.getLabelConfig();
    const line2MinLength = labelConfig.line.line2MinLength as number;
    const labelLayout = labelConfig.layout;
    const spaceWidth = labelConfig.spaceWidth as number;

    arcs.forEach(arc => {
      const direction = isQuadrantLeft(arc.quadrant) ? -1 : 1;
      arc.labelPosition = {
        x: arc.outerCenter.x + direction * (arc.labelSize.width / 2 + line2MinLength + spaceWidth),
        y: arc.outerCenter.y
      };
    });
    arcs.sort((a, b) => {
      return a.labelPosition.y - b.labelPosition.y;
    });

    if (labelConfig.coverEnable !== false || labelLayout.strategy === 'none') {
      for (const arc of arcs) {
        const { labelPosition, labelSize } = arc;
        arc.labelLimit = labelSize.width;
        arc.pointB = isQuadrantLeft(arc.quadrant)
          ? {
              x: labelPosition.x + labelSize.width / 2 + line2MinLength + spaceWidth,
              y: labelPosition.y
            }
          : {
              x: labelPosition.x - labelSize.width / 2 - line2MinLength - spaceWidth,
              y: labelPosition.y
            };
        this._computeX(arc);
      }
      if (labelConfig.coverEnable === false && labelLayout.strategy === 'none') {
        this._coverLabels(arcs);
      }
    } else {
      // 由于可能存在多行标签，这里仅仅估计一个最大标签数量用于避免冗余计算
      const maxLabels = height / ((labelConfig.style?.fontSize as number) || 16);
      // 布局圆弧半径
      this._adjustY(arcs, maxLabels);

      const { minY, maxY } = arcs.reduce(
        (yInfo, arc) => {
          const { y1, y2 } = arc.getLabelBounds();
          yInfo.minY = Math.max(0, Math.min(y1, yInfo.minY));
          yInfo.maxY = Math.min(height, Math.max(y2, yInfo.maxY));
          return yInfo;
        },
        { minY: Infinity, maxY: -Infinity }
      );
      const halfY = Math.max(Math.abs(height / 2 - minY), Math.abs(maxY - height / 2));
      // const halfY = height / 2;
      // pointB 与 label 的 y 值相同，但是 label 的 x 值依赖于 pointB 的 x 值
      const r = this._computeLayoutRadius(halfY);
      for (const arc of arcs) {
        this._computePointB(arc, r);
        this._computeX(arc);
      }
    }
    const { width } = this._getPlotLayout();
    arcs.forEach(arc => {
      if (
        arc.labelVisible &&
        (isLess(arc.pointB.x, line2MinLength + spaceWidth) ||
          isGreater(arc.pointB.x, width - line2MinLength - spaceWidth))
      ) {
        arc.labelVisible = false;
      }
    });
  }

  /**
   * 自上至下计算被遮盖的标签
   */
  private _coverLabels(arcs: ArcInfo[]) {
    if (arcs.length <= 1) {
      return;
    }
    let lastBounds = arcs[0].getLabelBounds();
    for (let i = 1; i < arcs.length; i++) {
      const bounds = arcs[i].getLabelBounds();
      if (!checkBoundsOverlap(lastBounds, bounds)) {
        lastBounds = bounds;
      } else {
        arcs[i].labelVisible = false;
      }
    }
  }

  /**
   * 计算标签布局圆弧半径，即 pointB 所落在的圆弧
   */
  private _computeLayoutRadius(halfYLength: number) {
    const labelConfig = this._series.getLabelConfig();
    const layoutArcGap = labelConfig.layoutArcGap as number;
    const line1MinLength = labelConfig.line.line1MinLength as number;
    const radiusRatio = this._series.getRadius();

    const radius = this._series.computeRadius(radiusRatio);
    // const a = radius + line1MinLength - layoutArcGap;
    const outerR = Math.max(radius + line1MinLength, this._series.computeDatumRadius(null));
    const a = outerR - layoutArcGap;
    // r^2 = (r - a)^2 + halfY^2;
    return Math.max((a ** 2 + halfYLength ** 2) / (2 * a), outerR);
  }

  /**
   * 计算 pointB，其 y 值在 adjustY 中确定，也即是 label 的 y 值
   */
  private _computePointB(arc: ArcInfo, r: number) {
    const radiusRatio = this._series.getRadius();
    const labelConfig = this._series.getLabelConfig();
    const line1MinLength = labelConfig.line.line1MinLength as number;
    const labelLayout = labelConfig.layout;

    if (labelLayout.strategy === 'none') {
      // 不执行躲避策略或者不显示引导线时紧挨着圆弧布局
      arc.pointB = {
        x: arc.outerCenter.x,
        y: arc.outerCenter.y
      };
    } else {
      const center = this._series.center;
      const radius = this._series.computeRadius(radiusRatio);
      const { labelPosition, quadrant } = arc;
      const outerR = Math.max(radius + line1MinLength, this._series.computeDatumRadius(null));
      const rd = r - outerR;
      // x 为 pointB.x 与圆心的差值
      const x = Math.sqrt(r ** 2 - Math.abs((center as IPoint).y - labelPosition.y) ** 2) - rd;
      if (isValidNumber(x)) {
        arc.pointB = {
          x: (center as IPoint).x + x * (isQuadrantLeft(quadrant) ? -1 : 1),
          y: labelPosition.y
        };
      } else {
        arc.pointB = { x: NaN, y: NaN };
      }
    }
  }

  /**
   * 计算 pointC 以及 label limit 与 position
   */
  private _computeX(arc: ArcInfo) {
    const center = this._series.center;
    const plotLayout = this._getPlotLayout();
    const radiusRatio = this._series.getRadius();
    const labelConfig = this._series.getLabelConfig();
    const line1MinLength = labelConfig.line.line1MinLength as number;
    const line2MinLength = labelConfig.line.line2MinLength as number;
    const labelLayoutAlign = labelConfig.layout?.align;
    const spaceWidth = labelConfig.spaceWidth as number;
    const align = this._computeAlign(arc) as TextAlign;

    const { labelPosition, quadrant, pointB } = arc;
    if (!isValidNumber(pointB.x * pointB.y)) {
      arc.pointC = { x: NaN, y: NaN };
      labelPosition.x = NaN;
      arc.labelLimit = 0;
    }
    const radius = this._series.computeRadius(radiusRatio);
    const flag = isQuadrantLeft(quadrant) ? -1 : 1;
    let cx: number = 0;
    const restWidth = flag > 0 ? plotLayout.width - pointB.x : pointB.x;
    let limit = restWidth - line2MinLength - spaceWidth;
    if (labelLayoutAlign === 'labelLine') {
      cx = (radius + line1MinLength + line2MinLength) * flag + (center as IPoint).x;
      limit = (flag > 0 ? plotLayout.width - cx : cx) - spaceWidth;
    }
    // TODO: compute label stroke
    // const strokeWidthScale =
    //   this.series.labelMark?.getScaleInState('strokeWidth');
    const text = this._getFormatLabelText(arc.refDatum, limit);
    arc.labelText = text;
    let labelWidth = Math.min(limit, this._measureTextSize(text).width);
    switch (labelLayoutAlign) {
      case 'labelLine':
        break;
      case 'edge':
        cx = flag > 0 ? plotLayout.width - labelWidth - spaceWidth : labelWidth + spaceWidth;
        break;
      case 'arc':
      default:
        cx = pointB.x + flag * line2MinLength;
        break;
    }
    labelWidth = Math.max(this._ellipsisWidth, labelWidth);
    arc.pointC = { x: cx, y: labelPosition.y };

    if (labelLayoutAlign === 'edge') {
      // edge 模式下的多行文本对齐方向与其他模式相反
      const alignOffset = this._computeAlignOffset(align, labelWidth, -flag);
      // 贴近画布边缘的布局结果可能会由于 cx 的小数 pixel 导致被部分裁剪，因此额外做计算
      labelPosition.x = flag > 0 ? plotLayout.width + alignOffset : alignOffset;
    } else {
      const alignOffset = this._computeAlignOffset(align, labelWidth, flag);
      labelPosition.x = cx + alignOffset + flag * spaceWidth;
    }

    arc.labelLimit = labelWidth;
  }

  private _computeAlignOffset(align: TextAlign, labelWidth: number, alignFlag: number): number {
    switch (align) {
      case 'left':
        return alignFlag < 0 ? -labelWidth : 0;
      case 'right':
        return alignFlag < 0 ? 0 : labelWidth;
      case 'center':
      default:
        return (labelWidth / 2) * alignFlag;
    }
  }

  /**
   * 调整标签位置的 Y 值
   */
  private _adjustY(arcs: ArcInfo[], maxLabels: number) {
    const plotRect = this._getPlotLayout();
    const labelLayout = this._series.getLabelConfig().layout;
    if (labelLayout.strategy === 'vertical') {
      // vertical 策略类似 echarts 方案，没有切线限制策略，没有优先级，执行整体调整没有标签数量限制
      let lastY = 0;
      let delta;
      const len = arcs.length;
      if (len <= 0) {
        return;
      }
      // 偏移 y 值以避免遮挡
      for (let i = 0; i < len; i++) {
        const { y1 } = arcs[i].getLabelBounds();
        delta = y1 - lastY;
        if (isLess(delta, 0)) {
          const index = this._shiftY(arcs, i, len - 1, -delta);
          this._shiftY(arcs, index, 0, delta / 2);
        }
        const { y2 } = arcs[i].getLabelBounds();
        lastY = y2;
      }
      // 将超出上界的标签下移
      const { y1: firstY1 } = arcs[0].getLabelBounds();
      delta = firstY1 - 0;
      if (isLess(delta, 0)) {
        this._shiftY(arcs, 0, len - 1, -delta);
      }
      for (let i = arcs.length - 1; i >= 0; i--) {
        if (arcs[i].getLabelBounds().y2 > plotRect.height) {
          arcs[i].labelVisible = false;
        } else {
          break;
        }
      }
    } else if (labelLayout.strategy !== 'none') {
      const priorityArcs: PriorityArc[] = arcs.map((arc, i) => {
        return {
          arc,
          originIndex: i,
          priorityIndex: 0
        };
      });
      priorityArcs.sort((a, b) => {
        return b.arc.radian - a.arc.radian;
      });
      priorityArcs.forEach((priorityArc, i) => {
        priorityArc.priorityIndex = i;
        // 首先隐藏所有标签
        priorityArc.arc.labelVisible = false;
      });

      let topLabelIndex = Infinity;
      let bottomLabelIndex = -Infinity;
      // 按照优先级依次布局标签
      for (let i = 0; i < maxLabels && i < arcs.length; i++) {
        this._storeY(arcs);

        const arc = priorityArcs[i].arc;
        this._computeYRange(arc);
        arc.labelVisible = true;
        const curY = arc.labelPosition.y;
        // 寻找标签在布局前垂直方向上的上下邻居，也就是饼图上的邻居关系
        const { lastIndex, nextIndex } = this._findNeighborIndex(arcs, priorityArcs[i]);
        const lastArc = arcs[lastIndex];
        const nextArc = arcs[nextIndex];
        if (lastIndex === -1 && nextIndex !== -1) {
          const nextY = nextArc.labelPosition.y;
          if (curY > nextY) {
            arc.labelPosition.y = nextY - nextArc.labelSize.height / 2 - arc.labelSize.height / 2;
          } else {
            this._twoWayShift(arcs, arc, nextArc, nextIndex);
          }
        } else if (lastIndex !== -1 && nextIndex === -1) {
          const lastY = lastArc.labelPosition.y;
          if (curY < lastY) {
            arc.labelPosition.y = lastY + lastArc.labelSize.height / 2 + arc.labelSize.height / 2;
          } else {
            this._twoWayShift(arcs, lastArc, arc, priorityArcs[i].originIndex);
          }
        } else if (lastIndex !== -1 && nextIndex !== -1) {
          const lastY = lastArc.labelPosition.y;
          const nextY = nextArc.labelPosition.y;
          if (curY > nextY) {
            arc.labelPosition.y = nextY - nextArc.labelSize.height / 2 - arc.labelSize.height / 2;
            this._twoWayShift(arcs, lastArc, arc, priorityArcs[i].originIndex);
          } else if (curY < lastY) {
            arc.labelPosition.y = lastY + lastArc.labelSize.height / 2 + arc.labelSize.height / 2;
            this._twoWayShift(arcs, arc, nextArc, nextIndex);
          } else {
            this._twoWayShift(arcs, lastArc, arc, priorityArcs[i].originIndex);
            this._twoWayShift(arcs, arc, nextArc, nextIndex);
          }
        }

        const nextTopIndex = Math.min(topLabelIndex, priorityArcs[i].originIndex);
        const nextBottomIndex = Math.max(bottomLabelIndex, priorityArcs[i].originIndex);
        let delta;
        // 将超出下界的标签上移
        delta = arcs[nextBottomIndex].getLabelBounds().y2 - plotRect.height;
        if (isGreater(delta, 0)) {
          this._shiftY(arcs, nextBottomIndex, 0, -delta);
        }
        // 将超出上界的标签下移
        delta = arcs[nextTopIndex].getLabelBounds().y1 - 0;
        if (isLess(delta, 0)) {
          this._shiftY(arcs, nextTopIndex, arcs.length - 1, -delta);
        }
        delta = arcs[nextBottomIndex].getLabelBounds().y2 - plotRect.height;
        // 当整体上下移一次之后仍然无法容纳所有标签，则当前标签应当舍去
        if (isGreater(delta, 0)) {
          arc.labelVisible = false;
          this._restoreY(arcs);
          break;
        } else if (labelLayout.tangentConstraint && !this._checkYRange(arcs)) {
          // 当标签由于 Y 方向调节范围过大而舍弃时不应当终止布局过程
          arc.labelVisible = false;
          this._restoreY(arcs);
        } else {
          topLabelIndex = nextTopIndex;
          bottomLabelIndex = nextBottomIndex;
        }
      }
    }
  }

  /**
   * 检查每个显示的标签的 Y 值是否在切线限制范围内
   */
  private _checkYRange(arcs: ArcInfo[]) {
    for (const arc of arcs) {
      const { labelYRange, labelPosition } = arc;
      if (
        arc.labelVisible &&
        labelYRange &&
        (isLess(labelPosition.y, labelYRange[0]) || isGreater(labelPosition.y, labelYRange[1]))
      ) {
        return false;
      }
    }
    return true;
  }

  /**
   * 计算圆弧切线所限制的标签 Y 值范围
   */
  private _computeYRange(arc: ArcInfo) {
    const plotRect = this._getPlotLayout();
    const radiusRatio = this._series.getRadius();
    const line1MinLength = this._series.getLabelConfig().line.line1MinLength as number;
    const { width, height } = plotRect;
    const radius = this._series.computeRadius(radiusRatio);
    // 出现 y 方向挤压过度必然是由于画布上下某一端被占满，此时半径是确定的
    const r = this._computeLayoutRadius(height / 2);
    // 所有坐标转化到以圆心为原点的坐标系计算
    // 在饼图上左右计算对称，可以全都转化到右侧计算
    const cx = Math.abs(arc.center.x - width / 2);
    const cy = arc.center.y - height / 2;
    let a;
    let b;
    let c;
    if (isClose(width / 2, cx)) {
      a = 0;
      b = 1;
      c = -cy;
    } else if (isClose(height / 2, cy)) {
      a = 1;
      b = 0;
      c = -cx;
    } else {
      // 斜截式转为一般式
      const k = -1 / (cy / cx);
      a = k;
      b = -1;
      c = cy - k * cx;
    }
    const points = lineCirclePoints(a, b, c, line1MinLength + radius - r, 0, r);
    // 由于饼图上切点在布局圆内部，交点必然有两个
    if (points.length < 2) {
      return;
    }
    let min;
    let max;
    if (points[0].x > points[1].x) {
      points.reverse();
    }
    if (points[0].x < 0) {
      if (isClose(points[0].y, points[1].y)) {
        if (Math.abs(arc.middleAngle) < Math.PI / 2) {
          min = 0;
          max = points[1].y + height / 2;
        } else {
          min = points[1].y + height / 2;
          max = height;
        }
      } else if (points[0].y < points[1].y) {
        min = 0;
        max = points[1].y + height / 2;
      } else {
        min = points[1].y + height / 2;
        max = plotRect.height;
      }
    } else {
      min = Math.min(points[0].y, points[1].y) + height / 2;
      max = Math.max(points[0].y, points[1].y) + height / 2;
    }
    arc.labelYRange = [min, max];
  }

  /**
   * 存储当前所有显示标签的 Y 值
   */
  private _storeY(arcs: ArcInfo[]) {
    for (const arc of arcs) {
      if (arc.labelVisible) {
        arc.lastLabelY = arc.labelPosition.y;
      }
    }
  }

  /**
   * 恢复所有显示标签在之前存储的 Y 值
   */
  private _restoreY(arcs: ArcInfo[]) {
    for (const arc of arcs) {
      if (arc.labelVisible) {
        arc.labelPosition.y = arc.lastLabelY;
      }
    }
  }

  /**
   * 依据初始的标签排序，寻找某一标签上下最近的显示标签索引
   */
  private _findNeighborIndex(arcs: ArcInfo[], priorityArc: PriorityArc) {
    const index = priorityArc.originIndex;
    let lastIndex = -1;
    let nextIndex = -1;
    for (let i = index - 1; i >= 0; i--) {
      if (arcs[i].labelVisible) {
        lastIndex = i;
        break;
      }
    }
    for (let i = index + 1; i < arcs.length; i++) {
      if (arcs[i].labelVisible) {
        nextIndex = i;
        break;
      }
    }
    return {
      lastIndex,
      nextIndex
    };
  }

  /**
   * 执行给定标签 Y 值的 shiftDown 以及 shiftUp
   */
  private _twoWayShift(arcs: ArcInfo[], lastArc: ArcInfo, nextArc: ArcInfo, nextIndex: number) {
    const delta = nextArc.getLabelBounds().y1 - lastArc.getLabelBounds().y2;
    if (isLess(delta, 0)) {
      const i = this._shiftY(arcs, nextIndex, arcs.length - 1, -delta);
      this._shiftY(arcs, i, 0, delta / 2);
    }
  }

  /**
   * 向某一方向调整局部标签的 Y 值
   */
  private _shiftY(arcs: ArcInfo[], start: number, end: number, delta: number) {
    const direction = start < end ? 1 : -1;
    let index = start;
    while (index !== -1) {
      arcs[index].labelPosition.y += delta;
      const nextIndex = this._findNextVisibleIndex(arcs, index, end, direction);
      if (nextIndex >= 0 && nextIndex < arcs.length) {
        const { y1: curY1, y2: curY2 } = arcs[index].getLabelBounds();
        const { y1: nextY1, y2: nextY2 } = arcs[nextIndex].getLabelBounds();
        if ((direction > 0 && curY2 < nextY1) || (direction < 0 && curY1 > nextY2)) {
          return index;
        }
      }
      index = nextIndex;
    }
    return end;
  }

  /**
   * 寻找下一个显示标签索引
   */
  private _findNextVisibleIndex(arcs: ArcInfo[], start: number, end: number, direction: number) {
    const diff = (end - start) * direction;
    for (let i = 1; i <= diff; i++) {
      const index = start + i * direction;
      if (arcs[index].labelVisible) {
        return index;
      }
    }
    return -1;
  }

  private _computeAlign(arc: ArcInfo) {
    const labelConfig = this._series.getLabelConfig();
    // 暂时兼容两种配置方式
    const textAlign = labelConfig.style?.textAlign ?? labelConfig.style?.align;
    const layoutAlign = labelConfig.layout?.textAlign ?? labelConfig.layout?.align;
    if (labelConfig.position !== 'inside') {
      if (isNil(textAlign) || textAlign === 'auto') {
        // edge 模式下沿着画布对齐，与 labelLine & edge 模式相反
        if (layoutAlign === 'edge') {
          return isQuadrantLeft(arc.quadrant) ? 'left' : 'right';
        }
        return isQuadrantLeft(arc.quadrant) ? 'right' : 'left';
      }
      return textAlign;
    }
    return isNil(textAlign) || textAlign === 'auto' ? 'center' : textAlign;
  }

  private _getFormatLabelText(value: any, limit?: number) {
    const textSpec = this._series.getLabelConfig().style?.text;
    const seriesField = this._series.getSeriesField();
    const angleField = this._series.getAngleField()[0];
    const isInvalidLabel = isNil(seriesField) || isNil(value[seriesField]) || isNil(value[angleField]);
    // 如果 value 为 null，则标签不显示
    if (isFunction(textSpec)) {
      return isInvalidLabel ? null : textSpec.call(null, value, {});
    }
    return isInvalidLabel ? null : value[seriesField];
  }

  private _getMeasureSpec(): Partial<ILabelTextMarkSpec> {
    // 去除 align 配置避免文字测量错误
    return {
      ...(this._series.getLabelConfig().style as ILabelTextMarkSpec),
      textAlign: 'center'
    };
  }

  private _measureTextSize(text: string) {
    const size = this._textMeasure.quickMeasure(text);
    return {
      /*
       * 快速估算的宽度在有些情况下可能比真实值略小（经测试100000个日期字符串的误差均值是-0.0006），因此这里为了防止标签缩略，宽度加1
       */
      width: Math.ceil(size.width) + 1,
      height: size.height
    };
  }

  private _getPlotLayout() {
    return this._series.getRegion().getLayoutRect();
  }
}
