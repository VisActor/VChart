import { isArray, isValid, isValidNumber, isNil } from '@visactor/vutils';
import type { IComponentOption } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { ComponentTypeEnum } from '../interface/type';
import type { ICartesianCrosshairSpec } from './interface';
import type { ICartesianSeries } from '../../series/interface';
import { isDiscrete, isContinuous } from '@visactor/vscale';
import { LineCrosshair, RectCrosshair, Tag } from '@visactor/vrender-components';
import type { IHair } from './base';
// eslint-disable-next-line no-duplicate-imports
import { BaseCrossHair } from './base';
import type { IGraphic, IGroup, INode } from '@visactor/vrender-core';
import { getDatumByValue, limitTagInBounds } from './util';
import { getAxisLabelOffset } from '../axis/util';
import type { IAxis } from '../axis/interface';
import type { IOrientType, StringOrNumber } from '../../typings';
import { isXAxis } from '../axis/cartesian/util/common';
import { Factory } from '../../core/factory';

interface ICrosshairInfoX {
  height: number;
  leftPos: number;
  topPos: number;
  x: number;
  bottom: { visible: boolean; text: StringOrNumber; dx: number; dy: number };
  top: { visible: boolean; text: StringOrNumber; dx: number; dy: number };
  visible: boolean;
  _isCache?: boolean;
}
interface ICrosshairInfoY {
  width: number;
  leftPos: number;
  topPos: number;
  y: number;
  left: { visible: boolean; text: StringOrNumber; dx: number; dy: number };
  right: { visible: boolean; text: StringOrNumber; dx: number; dy: number };
  visible: boolean;
  _isCache?: boolean;
}

// 1. crosshair保存上次记录的x和y轴dimension
// 2. 每次交互触发时，首先转化成dimension保存，然后依据dimension计算x和y绘制
// 3. 如果同方向同时有多个轴，那么同时保存这些轴的数据
// 4. 如果同方向的轴有多个离散轴，那么直接不显示

enum LayoutType {
  ALL = 0b0011,
  HORIZONTAL = 0b0010,
  VERTICAL = 0b0001,
  NONE = 0b0000
}

type IBound = { x1: number; y1: number; x2: number; y2: number };
type IAxisInfo = Map<number, IBound & { axis: IAxis }>;

export class CartesianCrossHair<T extends ICartesianCrosshairSpec = ICartesianCrosshairSpec> extends BaseCrossHair<T> {
  static specKey = 'crosshair';
  specKey: string = 'crosshair';

  static type = ComponentTypeEnum.cartesianCrosshair;
  type = ComponentTypeEnum.cartesianCrosshair;
  name: string = ComponentTypeEnum.cartesianCrosshair;
  currValueX: Map<number, { v: StringOrNumber; axis: IAxis }>;
  currValueY: Map<number, { v: StringOrNumber; axis: IAxis }>;

  xHair: IHair | undefined;
  yHair: IHair | undefined;

  private _cacheXCrossHairInfo: ICrosshairInfoX | undefined;
  private _cacheYCrossHairInfo: ICrosshairInfoY | undefined;

  private _xCrosshair: IGroup;
  private _xTopLabel: Tag;
  private _xBottomLabel: Tag;

  private _yCrosshair: IGroup;
  private _yLeftLabel: Tag;
  private _yRightLabel: Tag;

  static createComponent(spec: any, options: IComponentOption) {
    const crosshairSpec = spec.crosshair;
    if (isNil(crosshairSpec)) {
      return undefined;
    }
    if (!isArray(crosshairSpec)) {
      if (crosshairSpec.xField || crosshairSpec.yField) {
        return new CartesianCrossHair(crosshairSpec, options);
      }
      return undefined;
    }
    const components: CartesianCrossHair[] = [];
    crosshairSpec.forEach((s: ICartesianCrosshairSpec, i: number) => {
      if (s.xField || s.yField) {
        components.push(new CartesianCrossHair(s, { ...options, specIndex: i }));
      }
    });
    return components;
  }

  constructor(spec: T, options: IComponentOption) {
    super(spec, options);
    this.currValueX = new Map();
    this.currValueY = new Map();
  }

  protected _showDefaultCrosshair() {
    if (!this.showDefault) {
      return;
    }
    const { xField = {}, yField = {} } = this._spec as any; // FIXME: spec 类型需要补全
    if (xField?.visible && xField.defaultSelect) {
      const { axisIndex, datum } = xField.defaultSelect;
      this.defaultCrosshair(axisIndex, datum, LayoutType.VERTICAL, true);
      this.layoutByValue(LayoutType.VERTICAL);
    }
    if (yField?.visible && yField.defaultSelect) {
      const { axisIndex, datum } = yField.defaultSelect;
      this.defaultCrosshair(axisIndex, datum, LayoutType.HORIZONTAL, false);
      this.layoutByValue(LayoutType.HORIZONTAL);
    }
  }

  private defaultCrosshair(axisIndex: number, datum: StringOrNumber, tag: number, vertical: boolean) {
    const axis = this._option.getComponentsByKey('axes').find(c => c.getSpecIndex() === axisIndex) as IAxis;
    if (!axis) {
      return;
    }
    // 横轴
    if (vertical) {
      this.currValueX.clear();
      this.currValueX.set(axisIndex, { axis, v: datum });
    } else {
      this.currValueY.clear();
      this.currValueY.set(axisIndex, { axis, v: datum });
    }
  }

  /**
   * 查找所有落在x和y区域的轴
   * @param relativeX
   * @param relativeY
   */
  findAllAxisContains(relativeX: number, relativeY: number) {
    const xAxisMap = this._getAxisInfoByField('x') as IAxisInfo;
    const yAxisMap = this._getAxisInfoByField('y') as IAxisInfo;
    return {
      xAxisMap: this._filterAxisByPoint(xAxisMap, relativeX, relativeY),
      yAxisMap: this._filterAxisByPoint(yAxisMap, relativeX, relativeY)
    };
  }

  private getValueAt(axis: IAxis, p: number): number | string {
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
    this.currValueX.clear();
    this.currValueY.clear();
  }

  /**
   * set axis value of crosshair
   */
  setAxisValue(v: StringOrNumber, axis: IAxis) {
    if (isXAxis(axis.getOrient() as unknown as IOrientType)) {
      this.currValueX.set(axis.getSpecIndex(), {
        v,
        axis
      });
    } else {
      this.currValueX.set(axis.getSpecIndex(), {
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
  private getAllAxisValues(
    axisMap: IAxisInfo,
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
        v: this.getValueAt(
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
    const { xAxisMap, yAxisMap } = this.findAllAxisContains(relativeX, relativeY);
    if (xAxisMap && xAxisMap.size === 0 && yAxisMap && yAxisMap.size === 0) {
      if (this.enableRemain) {
        return;
      }
      // 隐藏
      this.hide();
      return;
    }
    // 删除之前的currValue
    this.currValueX.clear();
    this.currValueY.clear();
    // 将数据保存到这个对象中，如果不存在，就直接不执行后续逻辑
    xAxisMap && xAxisMap.size && this.getAllAxisValues(xAxisMap, relativeX, this.currValueX, true);
    yAxisMap && yAxisMap.size && this.getAllAxisValues(yAxisMap, relativeY, this.currValueY, false);

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

  private layoutByValue(tag: number = LayoutType.ALL) {
    if (!this.enable) {
      return;
    }
    // 获取axisHelper
    const series = this._firstSeries<ICartesianSeries>();
    if (!series) {
      return;
    }
    let xCrossHairInfo: ICrosshairInfoX = {
      height: 0,
      leftPos: 0,
      topPos: 0,
      x: 0,
      bottom: { visible: false, text: '', dx: 0, dy: 0 },
      top: { visible: false, text: '', dx: 0, dy: 0 },
      visible: false
    };
    let yCrossHairInfo: ICrosshairInfoY = {
      width: 0,
      leftPos: 0,
      topPos: 0,
      y: 0,
      left: { visible: false, text: '', dx: 0, dy: 0 },
      right: { visible: false, text: '', dx: 0, dy: 0 },
      visible: false
    };
    // 计算x轴和y轴对应的region区域
    const getRegionArea = (outRegion: IBound, currentValue: Map<number, { v: StringOrNumber; axis: IAxis }>) => {
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
    // 计算x和y的坐标
    let x = 0;
    let y = 0;
    if (this.currValueX.size) {
      const item = Array.from(this.currValueX.values())[0];
      x = item.axis.getScale().scale(item.v) + item.axis.getLayoutStartPoint().x - this.getLayoutStartPoint().x;
    }
    if (this.currValueY.size) {
      const item = Array.from(this.currValueY.values())[0];
      y = item.axis.getScale().scale(item.v) + item.axis.getLayoutStartPoint().y - this.getLayoutStartPoint().y;
    }

    xCrossHairInfo.visible = !!this.currValueX.size && Number.isFinite(x);
    yCrossHairInfo.visible = !!this.currValueY.size && Number.isFinite(y);

    const xRegion = { x1: Infinity, y1: Infinity, x2: -Infinity, y2: -Infinity };
    const yRegion = { x1: Infinity, y1: Infinity, x2: -Infinity, y2: -Infinity };
    getRegionArea(xRegion, this.currValueX);
    getRegionArea(yRegion, this.currValueY);

    let indexWidth;
    let valueHeight;
    // 计算x轴和y轴的数据，只允许最多一对x和一对y
    if (this.xHair) {
      this.currValueX.forEach(({ axis, v }) => {
        v = v ?? '';
        const xScale = axis.getScale();
        if (isDiscrete(xScale.type)) {
          const eachBand = (xScale as any)._step;
          indexWidth = axis ? series.getXAxisHelper().getBandwidth?.(0) : eachBand;
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
        if (this.xHair.label?.visible) {
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

    if (this.yHair) {
      this.currValueY.forEach(({ axis, v }) => {
        v = v ?? '';
        const yScale = axis.getScale();
        if (isDiscrete(yScale.type)) {
          const eachBand = (yScale as any)._step;
          valueHeight = yScale ? series.getYAxisHelper().getBandwidth?.(0) : eachBand;
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
        if (this.yHair.label?.visible) {
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

    if (this.enableRemain && !xCrossHairInfo.visible && isValid(this._cacheXCrossHairInfo)) {
      xCrossHairInfo = this._cacheXCrossHairInfo;
    } else {
      xCrossHairInfo.leftPos = xRegion.x1;
      xCrossHairInfo.topPos = xRegion.y1;
      xCrossHairInfo.height = xRegion.y2 - xRegion.y1;
      xCrossHairInfo.x = x + this.getLayoutStartPoint().x;
      if (this.xHair?.label?.formatMethod) {
        const { top, bottom } = xCrossHairInfo;
        bottom.visible && (bottom.text = this.xHair.label.formatMethod(bottom.text, 'bottom') as string);
        top.visible && (top.text = this.xHair.label.formatMethod(top.text, 'top') as string);
      }
    }

    if (this.enableRemain && !yCrossHairInfo.visible && isValid(this._cacheYCrossHairInfo)) {
      yCrossHairInfo = this._cacheYCrossHairInfo;
    } else {
      yCrossHairInfo.leftPos = yRegion.x1;
      yCrossHairInfo.topPos = yRegion.y1;
      yCrossHairInfo.width = yRegion.x2 - yRegion.x1;
      yCrossHairInfo.y = y + this.getLayoutStartPoint().y;
      if (this.yHair?.label?.formatMethod) {
        const { left, right } = yCrossHairInfo;
        left.visible && (left.text = this.yHair.label.formatMethod(left.text, 'left') as string);
        right.visible && (right.text = this.yHair.label.formatMethod(right.text, 'right') as string);
      }
    }

    if (tag) {
      LayoutType.HORIZONTAL && this._layoutHorizontal(yCrossHairInfo, valueHeight ?? 0);
      LayoutType.VERTICAL && this._layoutVertical(xCrossHairInfo, indexWidth ?? 0);
    }

    if (this.enableRemain) {
      this._cacheXCrossHairInfo = { ...xCrossHairInfo, _isCache: true };
      this._cacheYCrossHairInfo = { ...yCrossHairInfo, _isCache: true };
    }
  }

  private _layoutVertical(crosshairInfo: ICrosshairInfoX, bandWidth: number) {
    if ((crosshairInfo._isCache && this.enableRemain) || !this.xHair) {
      return;
    }

    const { x, topPos, height, top, bottom, visible } = crosshairInfo;

    if (visible) {
      // 外部设置的size
      let extend = 0;
      if (this.xHair?.style?.sizePercent) {
        extend = (this.xHair.style.sizePercent - 1) * bandWidth;
      } else if (typeof this.xHair?.style?.size === 'number') {
        extend = this.xHair.style.size - bandWidth;
      }
      const type = this.xHair.type;
      let positionAttribute;
      if (type === 'line') {
        positionAttribute = {
          start: { x: x + bandWidth / 2 - extend / 2, y: topPos },
          end: { x: x + bandWidth / 2 + extend / 2, y: topPos + height }
        };
      } else if (type === 'rect') {
        positionAttribute = {
          start: { x: x - extend / 2, y: topPos },
          end: { x: x + bandWidth + extend / 2, y: topPos + height }
        };
      }
      this._updateCrosshair('x', type, positionAttribute);
      // 文本
      if (top.visible) {
        const updateAttrs = {
          x: x + bandWidth / 2,
          y: topPos,
          ...top,
          ...this.xHair.label,
          textStyle: {
            ...this.xHair.label?.textStyle,
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
          ...this.xHair.label,
          textStyle: {
            ...this.xHair.label?.textStyle,
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

  private _layoutHorizontal(crosshairInfo: ICrosshairInfoY, bandHeight: number) {
    if ((crosshairInfo._isCache && this.enableRemain) || !this.yHair) {
      return;
    }
    const { leftPos, width, y, left, right, visible } = crosshairInfo;
    if (visible) {
      let extend = 0;
      if (this.yHair?.style?.sizePercent) {
        extend = (this.yHair.style.sizePercent - 1) * bandHeight;
      } else if (typeof this.yHair?.style?.size === 'number') {
        extend = this.yHair.style.size - bandHeight;
      }

      const type = this.yHair.type;
      let positionAttribute;
      if (type === 'line') {
        positionAttribute = {
          start: { x: leftPos, y: y + bandHeight / 2 },
          end: { x: leftPos + width, y: y + bandHeight / 2 }
        };
      } else if (type === 'rect') {
        positionAttribute = {
          start: { x: leftPos, y: y - extend / 2 },
          end: { x: leftPos + width, y: y + bandHeight + extend / 2 }
        };
      }
      this._updateCrosshair('y', type, positionAttribute);

      // 文本
      if (left.visible) {
        const updateAttrs = {
          x: leftPos,
          y: y + bandHeight / 2,
          ...left,
          ...this.yHair.label,
          textStyle: {
            ...this.yHair.label?.textStyle,
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
          ...this.yHair.label,
          textStyle: {
            ...this.yHair.label?.textStyle,
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

  protected _parseFieldInfo() {
    const { xField, yField } = this._crosshairConfig as ICartesianCrosshairSpec;
    if (xField && xField.visible) {
      this.xHair = this._parseField(xField, 'xField');
    }
    if (yField && yField.visible) {
      this.yHair = this._parseField(yField, 'yField');
    }
  }

  private _updateCrosshair(dim: string, type: string, attributes: any) {
    const container = this.getContainer();
    let crosshair;
    let style;
    if (dim === 'x') {
      crosshair = this._xCrosshair;
      style = this.xHair.style;
    } else {
      crosshair = this._yCrosshair;
      style = this.yHair.style;
    }
    if (crosshair) {
      crosshair.setAttributes(attributes);
    } else {
      // 创建
      if (type === 'line') {
        crosshair = new LineCrosshair({
          ...attributes,
          lineStyle: style,
          zIndex: this.gridZIndex + 1 // 样式优化：线盖在面上
        });
      } else if (type === 'rect') {
        crosshair = new RectCrosshair({
          ...attributes,
          rectStyle: style,
          zIndex: this.gridZIndex
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
      container.add(label as unknown as INode);
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
