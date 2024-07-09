import type { Maybe } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { isArray, isNil, isValid } from '@visactor/vutils';
import type { IComponentOption } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { ComponentTypeEnum } from '../interface/type';
import type { AxisCurrentValueMap, ICartesianCrosshairSpec, ICrosshairInfoX, ICrosshairInfoY } from './interface';
import type { ICartesianSeries } from '../../series/interface';
// eslint-disable-next-line no-duplicate-imports
import { isDiscrete } from '@visactor/vscale';
import { LineCrosshair, RectCrosshair, Tag } from '@visactor/vrender-components';
import type { IAxisInfo, IHair } from './base';
// eslint-disable-next-line no-duplicate-imports
import { BaseCrossHair } from './base';
import type { IGraphic, IGroup, INode } from '@visactor/vrender-core';
import { limitTagInBounds } from './utils';
import type { IAxis } from '../axis/interface';
import type { IOrientType, StringOrNumber, TooltipActiveType, TooltipData } from '../../typings';
import { isXAxis, isYAxis } from '../axis/cartesian/util/common';
import { Factory } from '../../core/factory';
import { LayoutType } from './config';
import type { IModelSpecInfo } from '../../model/interface';
import { layoutByValue, layoutHorizontalCrosshair, layoutVerticalCrosshair } from './utils/cartesian';
import { getFirstSeries } from '../../util';
import type { IDimensionData, IDimensionInfo } from '../../event/events/dimension/interface';

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

  private _currValueX: AxisCurrentValueMap;
  private _currValueY: AxisCurrentValueMap;

  static getSpecInfo(chartSpec: any): Maybe<IModelSpecInfo[]> {
    const crosshairSpec = chartSpec[this.specKey];
    if (isNil(crosshairSpec)) {
      return undefined;
    }
    if (!isArray(crosshairSpec)) {
      if (
        (crosshairSpec.xField && crosshairSpec.xField.visible !== false) ||
        (crosshairSpec.yField && crosshairSpec.yField.visible !== false)
      ) {
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
      if ((s.xField && s.xField.visible !== false) || (s.yField && s.yField.visible !== false)) {
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

  private _defaultCrosshair(axisIndex: number, value: StringOrNumber, tag: number) {
    const axis = this._option.getComponentsByKey('axes').find(c => c.getSpecIndex() === axisIndex) as IAxis;
    if (!axis) {
      return;
    }
    // 横轴
    if (tag === LayoutType.VERTICAL) {
      this._currValueX.clear();
      this._currValueX.set(axisIndex, { axis, value });
    } else {
      this._currValueY.clear();
      this._currValueY.set(axisIndex, { axis, value });
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
    const value = axis.getScale().invert(p);
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
  setAxisValue(value: StringOrNumber, axis: IAxis) {
    if (isXAxis(axis.getOrient() as unknown as IOrientType)) {
      this._currValueX.set(axis.getSpecIndex(), {
        value,
        axis
      });
    } else {
      this._currValueY.set(axis.getSpecIndex(), {
        value,
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
    currValue: AxisCurrentValueMap,
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
        value: this._getValueAt(
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

  protected _layoutCrosshair(
    relativeX: number,
    relativeY: number,
    tooltipData?: TooltipData,
    activeType?: TooltipActiveType
  ) {
    let x = relativeX;
    let y = relativeY;

    if (tooltipData && tooltipData.length) {
      if (activeType === 'dimension') {
        const dimensionInfo = (tooltipData as IDimensionInfo[])[0];
        // 图例筛选时, 找到第一个没有被筛选的系列
        const datumIndex = dimensionInfo.data.findIndex(dimData => dimData.datum.length > 0);
        let pos;
        if (datumIndex > -1) {
          const dimensionData = dimensionInfo.data[datumIndex];
          pos = dimensionData.series.dataToPosition(dimensionData.datum[0]);
        }

        const isY = isValid(dimensionInfo.dimType)
          ? dimensionInfo.dimType === 'y'
          : isYAxis(dimensionInfo?.axis?.getOrient() as IOrientType);

        if (isY) {
          y = pos?.y;
        } else {
          x = pos?.x;
        }
      } else if (activeType === 'mark') {
        const dimensionData = (tooltipData as IDimensionData[])[0];
        const pos = dimensionData.series.dataToPosition(dimensionData.datum[0]);

        x = pos?.x;
        y = pos?.y;
      }
    }

    // 找到所有的包含这个点的轴
    const { xAxisMap, yAxisMap } = this._findAllAxisContains(x, y);
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
    xAxisMap && xAxisMap.size && this._getAllAxisValues(xAxisMap, x, this._currValueX, true);
    yAxisMap && yAxisMap.size && this._getAllAxisValues(yAxisMap, y, this._currValueY, false);

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

  layoutByValue(tag: number = LayoutType.ALL) {
    if (!this.enable) {
      return;
    }
    const series = getFirstSeries(this._regions, 'cartesian') as ICartesianSeries;
    if (!series) {
      return;
    }

    const { x, y, offsetWidth, offsetHeight, bandWidth, bandHeight } = layoutByValue(
      tag,
      series,
      this.getLayoutStartPoint(),
      this._currValueX,
      this._currValueY,
      this._xHair,
      this._yHair,
      this.enableRemain,
      this._cacheXCrossHairInfo,
      this._cacheYCrossHairInfo
    );

    if (this.enableRemain) {
      x && (this._cacheXCrossHairInfo = { ...x, _isCache: true });
      y && (this._cacheYCrossHairInfo = { ...y, _isCache: true });
    }

    x && this._layoutVertical(x, bandWidth, offsetWidth);
    y && this._layoutHorizontal(y, bandHeight, offsetHeight);
  }

  private _layoutVertical(crosshairInfo: ICrosshairInfoX, bandWidth: number, offsetWidth: number) {
    if ((crosshairInfo._isCache && this.enableRemain) || !this._xHair) {
      return;
    }

    const { x, topPos, height, top, bottom, visible } = crosshairInfo;

    if (visible) {
      // 外部设置的size
      const type = this._xHair.type;
      const positionAttribute = layoutVerticalCrosshair(this._xHair, crosshairInfo, bandWidth, offsetWidth);
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
          zIndex: this.labelZIndex,
          visible: true
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
          zIndex: this.labelZIndex,
          visible: true
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
      const positionAttribute = layoutHorizontalCrosshair(this._yHair, crosshairInfo, bandHeight, offsetHeight);
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
          disableTriggerEvent: this._option.disableTriggerEvent,
          pickable: false
        });
      } else if (type === 'rect') {
        crosshair = new RectCrosshair({
          ...attributes,
          rectStyle: style,
          zIndex: this.gridZIndex,
          disableTriggerEvent: this._option.disableTriggerEvent,
          pickable: false
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
