import type { Maybe } from '@visactor/vutils';
import { isArray, isValid, isValidNumber, isNil } from '@visactor/vutils';
import type { IComponentOption } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { ComponentTypeEnum } from '../interface/type';
import type { ICartesianCrosshairSpec } from './interface';
import type { ICartesianSeries } from '../../series/interface';
import type { BandScale } from '@visactor/vscale';
// eslint-disable-next-line no-duplicate-imports
import { isDiscrete, isContinuous } from '@visactor/vscale';
import { LineCrosshair, RectCrosshair, Tag } from '@visactor/vrender-components';
import type { IAxisInfo, IBound, IHair } from './base';
// eslint-disable-next-line no-duplicate-imports
import { BaseCrossHair } from './base';
import type { IGraphic, IGroup, INode } from '@visactor/vrender-core';
import { getDatumByValue, limitTagInBounds } from './util';
import { getAxisLabelOffset } from '../axis/util';
import type { IAxis } from '../axis/interface';
import type { IOrientType, StringOrNumber } from '../../typings';
import { isXAxis } from '../axis/cartesian/util/common';
import { Factory } from '../../core/factory';
import { LayoutType } from './config';
import type { IModelSpecInfo } from '../../model/interface';

interface ICrosshairInfoX {
  height: number;
  leftPos: number;
  rightPos: number;
  topPos: number;
  x: number;
  bottom: { visible: boolean; text: StringOrNumber; dx: number; dy: number };
  top: { visible: boolean; text: StringOrNumber; dx: number; dy: number };
  visible: boolean;
  _isCache?: boolean;
  axis: IAxis;
}
interface ICrosshairInfoY {
  width: number;
  leftPos: number;
  topPos: number;
  bottomPos: number;
  y: number;
  left: { visible: boolean; text: StringOrNumber; dx: number; dy: number };
  right: { visible: boolean; text: StringOrNumber; dx: number; dy: number };
  visible: boolean;
  _isCache?: boolean;
  axis: IAxis;
}

// 1. crosshair保存上次记录的x和y轴dimension
// 2. 每次交互触发时，首先转化成dimension保存，然后依据dimension计算x和y绘制
// 3. 如果同方向同时有多个轴，那么同时保存这些轴的数据
// 4. 如果同方向的轴有多个离散轴，那么直接不显示

export class CartesianCrossHair<T extends ICartesianCrosshairSpec = ICartesianCrosshairSpec> extends BaseCrossHair<T> {
  static specKey = 'crosshair';

  static type = ComponentTypeEnum.cartesianCrosshair;
  type = ComponentTypeEnum.cartesianCrosshair;
  name: string = ComponentTypeEnum.cartesianCrosshair;

  private _xHair: IHair | undefined;
  private _yHair: IHair | undefined;

  private _cacheXCrossHairInfo: ICrosshairInfoX | undefined;
  private _cacheYCrossHairInfo: ICrosshairInfoY | undefined;

  private _xCrosshair: IGroup;
  private _xTopLabel: Tag;
  private _xBottomLabel: Tag;

  private _yCrosshair: IGroup;
  private _yLeftLabel: Tag;
  private _yRightLabel: Tag;

  private _currValueX: Map<number, { v: StringOrNumber; axis: IAxis }>;
  private _currValueY: Map<number, { v: StringOrNumber; axis: IAxis }>;

  static getSpecInfo(chartSpec: any): Maybe<IModelSpecInfo[]> {
    const crosshairSpec = chartSpec[this.specKey];
    if (isNil(crosshairSpec)) {
      return undefined;
    }
    if (!isArray(crosshairSpec)) {
      if (crosshairSpec.xField || crosshairSpec.yField) {
        return [
          {
            spec: crosshairSpec,
            specPath: [this.specKey],
            specInfoPath: ['component', this.specKey, 0],
            type: ComponentTypeEnum.cartesianCrosshair
          }
        ];
      }
      return undefined;
    }
    const specInfos: IModelSpecInfo[] = [];
    crosshairSpec.forEach((s: ICartesianCrosshairSpec, i: number) => {
      if (s.xField || s.yField) {
        specInfos.push({
          spec: s,
          specPath: [this.specKey, i],
          specInfoPath: ['component', this.specKey, i],
          type: ComponentTypeEnum.cartesianCrosshair
        });
      }
    });
    return specInfos;
  }

  constructor(spec: T, options: IComponentOption) {
    super(spec, options);
    this._currValueX = new Map();
    this._currValueY = new Map();
  }

  protected _showDefaultCrosshairBySpec() {
    const { xField, yField } = this._spec as ICartesianCrosshairSpec;
    if (xField?.visible && xField.defaultSelect) {
      const { axisIndex, datum } = xField.defaultSelect;
      this._defaultCrosshair(axisIndex, datum, LayoutType.VERTICAL);
    }
    if (yField?.visible && yField.defaultSelect) {
      const { axisIndex, datum } = yField.defaultSelect;
      this._defaultCrosshair(axisIndex, datum, LayoutType.HORIZONTAL);
    }
  }

  private _defaultCrosshair(axisIndex: number, datum: StringOrNumber, tag: number) {
    const axis = this._option.getComponentsByKey('axes').find(c => c.getSpecIndex() === axisIndex) as IAxis;
    if (!axis) {
      return;
    }
    // 横轴
    if (tag === LayoutType.VERTICAL) {
      this._currValueX.clear();
      this._currValueX.set(axisIndex, { axis, v: datum });
    } else {
      this._currValueY.clear();
      this._currValueY.set(axisIndex, { axis, v: datum });
    }
    this.layoutByValue(tag);
  }

  /**
   * 查找所有落在x和y区域的轴
   * @param relativeX
   * @param relativeY
   */
  private _findAllAxisContains(relativeX: number, relativeY: number) {
    const xAxisMap = this._getAxisInfoByField<IAxis>('x');
    const yAxisMap = this._getAxisInfoByField<IAxis>('y');
    return {
      xAxisMap: this._filterAxisByPoint(xAxisMap, relativeX, relativeY),
      yAxisMap: this._filterAxisByPoint(yAxisMap, relativeX, relativeY)
    };
  }

  private _getValueAt(axis: IAxis, p: number): number | string {
    let value = axis.getScale().invert(p);
    if (isContinuous(axis.getScale().type) && isValidNumber(+value)) {
      value = (+value as number).toFixed(2);
    }
    return value;
  }

  /**
   * clear axis value of crosshair
   */
  clearAxisValue() {
    this._currValueX.clear();
    this._currValueY.clear();
  }

  /**
   * set axis value of crosshair
   */
  setAxisValue(v: StringOrNumber, axis: IAxis) {
    if (isXAxis(axis.getOrient() as unknown as IOrientType)) {
      this._currValueX.set(axis.getSpecIndex(), {
        v,
        axis
      });
    } else {
      this._currValueY.set(axis.getSpecIndex(), {
        v,
        axis
      });
    }
  }
  /**
   * 根据位置获取所有轴上的value
   * @param axisMap
   * @param p
   * @returns
   */
  private _getAllAxisValues(
    axisMap: IAxisInfo<IAxis>,
    p: number,
    currValue: Map<number, { v: StringOrNumber; axis: IAxis }>,
    vertical: boolean
  ): boolean {
    // 首先不能存在两个离散轴
    let discrete = false;
    axisMap.forEach(item => {
      if (isDiscrete(item.axis.getScale().type)) {
        if (!discrete) {
          discrete = true;
        } else {
          this.enable = false;
        }
      }
    });
    if (!this.enable) {
      return false;
    }
    // 获取所有的value
    axisMap.forEach((item, id) => {
      const axis = item.axis;
      currValue.set(id, {
        v: this._getValueAt(
          axis,
          p -
            (vertical
              ? axis.getLayoutStartPoint().x - this.getLayoutStartPoint().x
              : axis.getLayoutStartPoint().y - this.getLayoutStartPoint().y)
        ),
        axis
      });
    });
    return true;
  }

  protected _layoutCrosshair(relativeX: number, relativeY: number) {
    // 找到所有的包含这个点的轴
    const { xAxisMap, yAxisMap } = this._findAllAxisContains(relativeX, relativeY);
    if ((xAxisMap && xAxisMap.size === 0) || (yAxisMap && yAxisMap.size === 0)) {
      if (this.enableRemain) {
        return;
      }
      // 隐藏
      this.hide();
      return;
    }
    // 删除之前的currValue
    this._currValueX.clear();
    this._currValueY.clear();
    // 将数据保存到这个对象中，如果不存在，就直接不执行后续逻辑
    xAxisMap && xAxisMap.size && this._getAllAxisValues(xAxisMap, relativeX, this._currValueX, true);
    yAxisMap && yAxisMap.size && this._getAllAxisValues(yAxisMap, relativeY, this._currValueY, false);

    this.layoutByValue(LayoutType.ALL);
  }

  hide() {
    // 隐藏
    this._xCrosshair && this._xCrosshair.hideAll();
    this._xTopLabel && this._xTopLabel.hideAll();
    this._xBottomLabel && this._xBottomLabel.hideAll();

    this._yCrosshair && this._yCrosshair.hideAll();
    this._yLeftLabel && this._yLeftLabel.hideAll();
    this._yRightLabel && this._yRightLabel.hideAll();
  }

  // 计算x轴和y轴对应的region区域
  _setRegionArea(outRegion: IBound, currentValue: Map<number, { v: StringOrNumber; axis: IAxis }>) {
    currentValue.forEach(({ axis }) => {
      const regions = axis.getRegions();
      regions.forEach(r => {
        outRegion.x1 = Math.min(outRegion.x1, r.getLayoutStartPoint().x);
        outRegion.y1 = Math.min(outRegion.y1, r.getLayoutStartPoint().y);
        outRegion.x2 = Math.max(outRegion.x2, r.getLayoutStartPoint().x + r.getLayoutRect().width);
        outRegion.y2 = Math.max(outRegion.y2, r.getLayoutStartPoint().y + r.getLayoutRect().height);
      });
    });
  }

  layoutByValue(tag: number = LayoutType.ALL) {
    if (!this.enable) {
      return;
    }
    // 获取axisHelper
    const series = this._firstSeries<ICartesianSeries>();
    if (!series) {
      return;
    }
    const layoutX = tag & LayoutType.VERTICAL;
    const layoutY = tag & LayoutType.HORIZONTAL;

    // 计算x和y的坐标
    let xAxis = null;
    let yAxis = null;
    let x = 0;
    let y = 0;
    if (this._currValueX.size) {
      const item = Array.from(this._currValueX.values())[0];
      x = item.axis.getScale().scale(item.v) + item.axis.getLayoutStartPoint().x - this.getLayoutStartPoint().x;
      xAxis = item.axis;
    }
    if (this._currValueY.size) {
      const item = Array.from(this._currValueY.values())[0];
      y = item.axis.getScale().scale(item.v) + item.axis.getLayoutStartPoint().y - this.getLayoutStartPoint().y;
      yAxis = item.axis;
    }

    const xVisible = !!this._currValueX.size && Number.isFinite(x);
    const yVisible = !!this._currValueY.size && Number.isFinite(y);
    const xUseCache = this.enableRemain && !xVisible && isValid(this._cacheXCrossHairInfo);
    const yUseCache = this.enableRemain && !yVisible && isValid(this._cacheYCrossHairInfo);

    let xCrossHairInfo: ICrosshairInfoX;

    if (layoutX) {
      xCrossHairInfo = xUseCache
        ? this._cacheXCrossHairInfo
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
        ? this._cacheYCrossHairInfo
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

    let indexWidth;
    let offsetWidth: number = 0;
    let valueHeight;
    let offsetHeight: number = 0;
    // 计算x轴和y轴的数据，只允许最多一对x和一对y
    if (this._xHair) {
      this._currValueX.forEach(({ axis, v }) => {
        v = v ?? '';
        const xScale = axis.getScale();
        if (isDiscrete(xScale.type)) {
          indexWidth = (xScale as BandScale).bandwidth();

          if (indexWidth === 0 && (xScale as BandScale).step) {
            offsetWidth = (xScale as BandScale).step();
          }
        } else if (isContinuous(xScale.type)) {
          const fieldX = series.fieldX[0];
          const fieldX2 = series.fieldX2;
          const datum = getDatumByValue(series.getViewData().latestData, +v, fieldX, fieldX2);
          if (datum) {
            const startX = series.dataToPositionX(datum);
            if (fieldX2) {
              indexWidth = Math.abs(startX - series.dataToPositionX1(datum));
              v = `${datum[fieldX]} ~ ${datum[fieldX2]}`;
            } else {
              indexWidth = 1;
            }
            x = startX;
          }
        }
        if (xCrossHairInfo && this._xHair.label?.visible && !xUseCache) {
          const labelOffset = getAxisLabelOffset(axis.getSpec());
          if (axis.getOrient() === 'bottom') {
            xCrossHairInfo.bottom.visible = true;
            xCrossHairInfo.bottom.text = v;
            xCrossHairInfo.bottom.dx = 0;
            xCrossHairInfo.bottom.dy = labelOffset;
          } else if (axis.getOrient() === 'top') {
            xCrossHairInfo.top.visible = true;
            xCrossHairInfo.top.text = v;
            xCrossHairInfo.top.dx = 0;
            xCrossHairInfo.top.dy = -labelOffset;
          }
        }
      });
    }

    if (this._yHair) {
      this._currValueY.forEach(({ axis, v }) => {
        v = v ?? '';
        const yScale = axis.getScale();
        if (isDiscrete(yScale.type)) {
          valueHeight = (yScale as BandScale).bandwidth();

          if (valueHeight === 0 && (yScale as BandScale).step) {
            offsetHeight = (yScale as BandScale).step();
          }
        } else if (isContinuous(yScale.type)) {
          const fieldY = series.fieldY[0];
          const fieldY2 = series.fieldY2;
          const datum = getDatumByValue(series.getViewData().latestData, +v, fieldY, fieldY2);
          if (datum) {
            const startY = series.dataToPositionY(datum);
            if (fieldY2) {
              valueHeight = Math.abs(startY - series.dataToPositionY1(datum));
              v = `${datum[fieldY]} ~ ${datum[fieldY2]}`;
            } else {
              valueHeight = 1;
            }
            y = startY;
          }
        }
        if (yCrossHairInfo && this._yHair.label?.visible && !yUseCache) {
          const labelOffset = getAxisLabelOffset(axis.getSpec());
          if (axis.getOrient() === 'left') {
            yCrossHairInfo.left.visible = true;
            yCrossHairInfo.left.text = v;
            yCrossHairInfo.left.dx = -labelOffset;
            yCrossHairInfo.left.dy = 0;
          } else if (axis.getOrient() === 'right') {
            yCrossHairInfo.right.visible = true;
            yCrossHairInfo.right.text = v;
            yCrossHairInfo.right.dx = labelOffset;
            yCrossHairInfo.right.dy = 0;
          }
        }
      });
    }

    if (xCrossHairInfo && !xUseCache) {
      const xRegion = { x1: Infinity, y1: Infinity, x2: -Infinity, y2: -Infinity };
      this._setRegionArea(xRegion, this._currValueX);
      xCrossHairInfo.leftPos = xRegion.x1;
      xCrossHairInfo.rightPos = xRegion.x2;
      xCrossHairInfo.topPos = xRegion.y1;
      xCrossHairInfo.height = xRegion.y2 - xRegion.y1;
      xCrossHairInfo.x = x + this.getLayoutStartPoint().x;

      if (this._xHair && this._xHair.label) {
        if (this._xHair.label.formatMethod) {
          const { top, bottom } = xCrossHairInfo;
          bottom.visible && (bottom.text = this._xHair.label.formatMethod(bottom.text, 'bottom') as string);
          top.visible && (top.text = this._xHair.label.formatMethod(top.text, 'top') as string);
        } else if (this._xHair.label.formatter && Factory.getFormatter()) {
          const { top, bottom } = xCrossHairInfo;
          const formatter = Factory.getFormatter();
          bottom.visible &&
            (bottom.text = formatter(this._xHair.label.formatter, bottom.text, {
              label: bottom.text,
              position: 'bottom'
            }) as string);
          top.visible &&
            (top.text = formatter(this._xHair.label.formatter, top.text, {
              label: top.text,
              position: 'top'
            }) as string);
        }
      }
    }

    if (yCrossHairInfo && !yUseCache) {
      const yRegion = { x1: Infinity, y1: Infinity, x2: -Infinity, y2: -Infinity };
      this._setRegionArea(yRegion, this._currValueY);
      yCrossHairInfo.leftPos = yRegion.x1;
      yCrossHairInfo.topPos = yRegion.y1;
      yCrossHairInfo.bottomPos = yRegion.y2;
      yCrossHairInfo.width = yRegion.x2 - yRegion.x1;
      yCrossHairInfo.y = y + this.getLayoutStartPoint().y;
      if (this._yHair && this._yHair.label) {
        if (this._yHair.label.formatMethod) {
          const { left, right } = yCrossHairInfo;
          left.visible && (left.text = this._yHair.label.formatMethod(left.text, 'left') as string);
          right.visible && (right.text = this._yHair.label.formatMethod(right.text, 'right') as string);
        } else if (this._yHair?.label?.formatter && Factory.getFormatter()) {
          const { left, right } = yCrossHairInfo;

          const formatter = Factory.getFormatter();
          left.visible &&
            (left.text = formatter(this._yHair.label.formatter, left.text, {
              label: left.text,
              position: 'bottom'
            }));
          right.visible &&
            (right.text = formatter(this._yHair.label.formatter, right.text, {
              label: right.text,
              position: 'top'
            }));
        }
      }
    }

    if (layoutX && xCrossHairInfo) {
      this._layoutVertical(xCrossHairInfo, indexWidth ?? 0, offsetWidth);
      if (this.enableRemain) {
        this._cacheXCrossHairInfo = { ...xCrossHairInfo, _isCache: true };
      }
    }

    if (layoutY && yCrossHairInfo) {
      this._layoutHorizontal(yCrossHairInfo, valueHeight ?? 0, offsetHeight);
      if (this.enableRemain) {
        this._cacheYCrossHairInfo = { ...yCrossHairInfo, _isCache: true };
      }
    }
  }

  private _layoutVertical(crosshairInfo: ICrosshairInfoX, bandWidth: number, offsetWidth: number) {
    if ((crosshairInfo._isCache && this.enableRemain) || !this._xHair) {
      return;
    }

    const { x, topPos, height, top, bottom, visible } = crosshairInfo;

    if (visible) {
      // 外部设置的size
      const type = this._xHair.type;
      let positionAttribute;
      if (type === 'line') {
        positionAttribute = {
          start: { x: x + bandWidth / 2, y: topPos },
          end: { x: x + bandWidth / 2, y: topPos + height }
        };
      } else if (type === 'rect') {
        const extend = this._getRectSize(this._xHair, bandWidth, crosshairInfo.axis);
        const { leftPos, rightPos } = crosshairInfo;

        positionAttribute = {
          start: { x: Math.max(x - extend / 2 - offsetWidth / 2, leftPos), y: topPos },
          end: { x: Math.min(x + bandWidth + extend / 2 + offsetWidth / 2, rightPos), y: topPos + height }
        };
      }
      this._updateCrosshair('x', type, positionAttribute);
      // 文本
      if (top.visible) {
        const updateAttrs = {
          x: x + bandWidth / 2,
          y: topPos,
          ...top,
          ...this._xHair.label,
          textStyle: {
            ...this._xHair.label?.textStyle,
            textAlign: 'center',
            textBaseline: 'bottom'
          },
          zIndex: this.labelZIndex
        };
        this._updateCrosshairLabel(this._xTopLabel, updateAttrs, label => {
          label.name = 'crosshair-x-top-label';
          this._xTopLabel = label;
        });
      } else {
        this._xTopLabel && this._xTopLabel.hideAll();
      }

      if (bottom.visible) {
        const updateAttrs = {
          x: x + bandWidth / 2,
          y: topPos + height,
          ...bottom,
          ...this._xHair.label,
          textStyle: {
            ...this._xHair.label?.textStyle,
            textAlign: 'center',
            textBaseline: 'top'
          },
          zIndex: this.labelZIndex
        };
        this._updateCrosshairLabel(this._xBottomLabel, updateAttrs, label => {
          label.name = 'crosshair-x-bottom-label';
          this._xBottomLabel = label;
        });
      } else {
        this._xBottomLabel && this._xBottomLabel.hideAll();
      }
    }
  }

  private _layoutHorizontal(crosshairInfo: ICrosshairInfoY, bandHeight: number, offsetHeight: number) {
    if ((crosshairInfo._isCache && this.enableRemain) || !this._yHair) {
      return;
    }
    const { leftPos, width, y, left, right, visible } = crosshairInfo;
    if (visible) {
      const type = this._yHair.type;
      let positionAttribute;
      if (type === 'line') {
        positionAttribute = {
          start: { x: leftPos, y: y + bandHeight / 2 },
          end: { x: leftPos + width, y: y + bandHeight / 2 }
        };
      } else if (type === 'rect') {
        const extend = this._getRectSize(this._yHair, bandHeight, crosshairInfo.axis);
        const { topPos, bottomPos } = crosshairInfo;

        positionAttribute = {
          start: { x: leftPos, y: Math.max(y - extend / 2 - offsetHeight / 2, topPos) },
          end: { x: leftPos + width, y: Math.min(y + bandHeight + extend / 2 + offsetHeight / 2, bottomPos) }
        };
      }
      this._updateCrosshair('y', type, positionAttribute);

      // 文本
      if (left.visible) {
        const updateAttrs = {
          x: leftPos,
          y: y + bandHeight / 2,
          ...left,
          ...this._yHair.label,
          textStyle: {
            ...this._yHair.label?.textStyle,
            textAlign: 'right',
            textBaseline: 'middle'
          },
          zIndex: this.labelZIndex
        };

        this._updateCrosshairLabel(this._yLeftLabel, updateAttrs, label => {
          label.name = 'crosshair-y-left-label';
          this._yLeftLabel = label;
        });
      } else {
        this._yLeftLabel && this._yLeftLabel.hideAll();
      }

      if (right.visible) {
        const updateAttrs = {
          x: leftPos + width,
          y: y + bandHeight,
          ...right,
          ...this._yHair.label,
          textStyle: {
            ...this._yHair.label?.textStyle,
            textAlign: 'left',
            textBaseline: 'middle'
          },
          zIndex: this.labelZIndex
        };
        this._updateCrosshairLabel(this._yRightLabel, updateAttrs, label => {
          label.name = 'crosshair-y-right-label';
          this._yRightLabel = label;
        });
      } else {
        this._yRightLabel && this._yRightLabel.hideAll();
      }
    }
  }

  private _getRectSize(hair: IHair, bandSize: number, axis: IAxis) {
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
  }

  protected _parseFieldInfo() {
    const { xField, yField } = this._spec as ICartesianCrosshairSpec;
    if (xField && xField.visible) {
      this._xHair = this._parseField(xField, 'xField');
    }
    if (yField && yField.visible) {
      this._yHair = this._parseField(yField, 'yField');
    }
  }

  private _updateCrosshair(dim: string, type: string, attributes: any) {
    const container = this.getContainer();
    let crosshair;
    if (dim === 'x') {
      crosshair = this._xCrosshair;
    } else {
      crosshair = this._yCrosshair;
    }
    if (crosshair) {
      crosshair.setAttributes(attributes);
    } else {
      const style = dim === 'x' ? this._xHair.style : this._yHair.style;
      // 创建
      if (type === 'line') {
        crosshair = new LineCrosshair({
          ...attributes,
          lineStyle: style,
          zIndex: this.gridZIndex + 1, // 样式优化：线盖在面上
          disableTriggerEvent: this._option.disableTriggerEvent
        });
      } else if (type === 'rect') {
        crosshair = new RectCrosshair({
          ...attributes,
          rectStyle: style,
          zIndex: this.gridZIndex,
          disableTriggerEvent: this._option.disableTriggerEvent
        });
      }
      // 添加至场景树
      container?.add(crosshair as unknown as INode);
      if (dim === 'x') {
        this._xCrosshair = crosshair as unknown as IGroup;
      } else {
        this._yCrosshair = crosshair as unknown as IGroup;
      }
    }
  }

  private _updateCrosshairLabel(label: Tag, attributes: any, callback: (label: Tag) => void) {
    const container = this.getContainer();
    if (label) {
      label.setAttributes(attributes);
    } else {
      label = new Tag(attributes);
      callback(label);
      container?.add(label as unknown as INode);
    }
    limitTagInBounds(label, this._getLimitBounds());
  }

  protected _getNeedClearVRenderComponents(): IGraphic[] {
    return [
      this._xCrosshair,
      this._xTopLabel,
      this._xBottomLabel,
      this._yCrosshair,
      this._yLeftLabel,
      this._yRightLabel
    ] as unknown as IGraphic[];
  }
}

export const registerCartesianCrossHair = () => {
  Factory.registerComponent(CartesianCrossHair.type, CartesianCrossHair);
};
