import type { IPolarSeries } from '../../series/interface/series';
import { mergeSpec } from '../../util/spec/merge-spec';
import type { IComponentOption } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { ComponentTypeEnum } from '../interface/type';
import type { IPolarCrosshairSpec } from './interface';
import type { BandScale } from '@visactor/vscale';
// eslint-disable-next-line no-duplicate-imports
import { isDiscrete, isContinuous } from '@visactor/vscale';
// import { registerComponent } from '@visactor/vgrammar-core';
import { Tag } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import { LineCrosshair, SectorCrosshair, CircleCrosshair, PolygonCrosshair } from '@visactor/vrender-components';
import type { IPolarAxis } from '../axis/polar/interface';
import type { IPoint, StringOrNumber } from '../../typings';
import type { IHair } from './base';
// eslint-disable-next-line no-duplicate-imports
import { BaseCrossHair } from './base';
import {
  polarToCartesian,
  getIntersectPoint,
  PointService,
  getAngleByPoint,
  isArray,
  isValid,
  isValidNumber,
  isNil,
  clamp
} from '@visactor/vutils';
import type { IGraphic, IGroup, INode } from '@visactor/vrender-core';
import { angleLabelOrientAttribute, radiusLabelOrientAttribute } from '../../util/math';
import { limitTagInBounds } from './util';
import { getAxisLabelOffset } from '../axis/util';
import { Factory } from '../../core/factory';

interface ICrosshairInfo {
  x: number;
  y: number;
  center: IPoint;
  radius: number;
  distance: number;
  startAngle: number;
  endAngle: number;
  innerRadius: number;
  visible: boolean;
  sides: number;
  angle: number;
  point: IPoint;
  _isCache?: boolean;
  label?: { visible: boolean; text: StringOrNumber; offset: number };
  axis?: IPolarAxis;
}

enum LayoutType {
  ALL = 0b0011,
  HORIZONTAL = 0b0010,
  VERTICAL = 0b0001,
  NONE = 0b0000
}

type IBound = { x1: number; y1: number; x2: number; y2: number };
type IAxisInfo = Map<number, IBound & { axis: IPolarAxis }>;

export class PolarCrossHair<T extends IPolarCrosshairSpec = IPolarCrosshairSpec> extends BaseCrossHair<T> {
  static specKey = 'crosshair';
  specKey: string = 'crosshair';

  static type = ComponentTypeEnum.polarCrosshair;
  type = ComponentTypeEnum.polarCrosshair;
  name: string = ComponentTypeEnum.polarCrosshair;
  currValueX: Map<number, { v: StringOrNumber; axis: IPolarAxis; [key: string]: any }>;
  currValueY: Map<number, { v: StringOrNumber; axis: IPolarAxis; [key: string]: any }>;

  xHair: IHair | undefined;
  yHair: (IHair & { smooth: boolean }) | undefined;

  private _cacheXCrossHairInfo: ICrosshairInfo | undefined;
  private _cacheYCrossHairInfo: ICrosshairInfo | undefined;

  private _radiusCrosshair: IGroup;
  private _radiusLabelCrosshair: Tag;
  private _angleCrosshair: IGroup;
  private _angleLabelCrosshair: Tag;

  static createComponent(spec: any, options: IComponentOption) {
    const crosshairSpec = spec.crosshair;
    if (isNil(crosshairSpec)) {
      return undefined;
    }
    if (!isArray(crosshairSpec)) {
      if (crosshairSpec.categoryField || crosshairSpec.valueField) {
        return new PolarCrossHair(crosshairSpec, options);
      }
      return undefined;
    }
    const components: PolarCrossHair[] = [];
    crosshairSpec.forEach((s: IPolarCrosshairSpec, i: number) => {
      if (s.categoryField || s.valueField) {
        components.push(new PolarCrossHair(s, { ...options, specIndex: i }));
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
    // TODO: 待支持
  }

  hide() {
    this._radiusCrosshair && this._radiusCrosshair.hideAll();
    this._radiusLabelCrosshair && this._radiusLabelCrosshair.hideAll();
    this._angleCrosshair && this._angleCrosshair.hideAll();
    this._angleLabelCrosshair && this._angleLabelCrosshair.hideAll();
  }

  /**
   * 查找所有落在x和y区域的轴
   * @param relativeX
   * @param relativeY
   */
  findAllAxisContains(relativeX: number, relativeY: number) {
    const xAxisMap = this._getAxisInfoByField<IPolarAxis>('category');
    const yAxisMap = this._getAxisInfoByField<IPolarAxis>('value');
    return {
      xAxisMap: this._filterAxisByPoint<IPolarAxis>(xAxisMap, relativeX, relativeY),
      yAxisMap: this._filterAxisByPoint<IPolarAxis>(yAxisMap, relativeX, relativeY)
    };
  }

  /**
   * 根据位置获取所有轴上的value
   * @param axisMap
   * @param p
   * @returns
   */
  getAllAxisValues(
    axisMap: IAxisInfo,
    point: IPoint,
    currValue: Map<number, { v: StringOrNumber; axis: IPolarAxis; [key: string]: any }>
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
      const { x: axisStartX, y: axisStartY } = item.axis.getLayoutStartPoint();
      const { x, y } = this.getLayoutStartPoint();
      let value = axis.positionToData({
        x: point.x - (axisStartX - x),
        y: point.y - (axisStartY - y)
      });
      if (isContinuous(axis.getScale().type) && isValidNumber(+value)) {
        value = (+value as number).toFixed(2);
      }
      const center = {
        x: axis.getCenter().x + this.getLayoutStartPoint().x,
        y: axis.getCenter().y + this.getLayoutStartPoint().y
      };
      currValue.set(id, {
        v: value,
        axis: item.axis,
        center,
        innerRadius: axis.getInnerRadius(),
        radius: axis.getOuterRadius(),
        startAngle: axis.startAngle,
        endAngle: axis.endAngle,
        distance: PointService.distancePP(point, axis.getCenter()),
        coord: axis.pointToCoord(point),
        point
      });
    });
    return true;
  }

  protected _layoutCrosshair(relativeX: number, relativeY: number) {
    // 找到所有的包含这个点的轴
    const { xAxisMap, yAxisMap } = this.findAllAxisContains(relativeX, relativeY);
    if (xAxisMap.size === 0 && yAxisMap.size === 0) {
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
    xAxisMap && this.getAllAxisValues(xAxisMap, { x: relativeX, y: relativeY }, this.currValueX);
    yAxisMap && this.getAllAxisValues(yAxisMap, { x: relativeX, y: relativeY }, this.currValueY);

    this.layoutByValue(LayoutType.ALL);
  }

  private layoutByValue(tag: number) {
    if (!this.enable) {
      return;
    }
    // 获取axisHelper
    const series = this._firstSeries<IPolarSeries>();
    if (!series) {
      return;
    }
    let xCrossHairInfo = {
      x: 0,
      y: 0,
      center: { x: 0, y: 0 },
      radius: 0,
      distance: 0,
      startAngle: 0,
      endAngle: 0,
      innerRadius: 0,
      visible: false,
      label: { visible: false, text: '', offset: 0 }
    } as ICrosshairInfo;
    let yCrossHairInfo = {
      x: 0,
      y: 0,
      center: { x: 0, y: 0 },
      radius: 0,
      distance: 0,
      startAngle: 0,
      endAngle: 0,
      innerRadius: 0,
      visible: false,
      sides: (series.angleAxisHelper.getScale(0) as BandScale).ticks().length,
      label: { visible: false, text: '', offset: 0 }
    } as ICrosshairInfo;

    // 计算x轴和y轴的数据，只允许最多一对x和一对y
    if (this.xHair) {
      xCrossHairInfo.visible = !!this.currValueX.size;
      const bandWidth = series.angleAxisHelper.getBandwidth(0);
      this.currValueX.forEach(({ axis, v, coord, ...rest }) => {
        v = v ?? '';
        mergeSpec(xCrossHairInfo, rest);
        const angle = series.angleAxisHelper.dataToPosition([v]);
        xCrossHairInfo.angle = angle;
        if (this.xHair.label?.visible) {
          xCrossHairInfo.label.visible = true;
          xCrossHairInfo.label.text = v;
          xCrossHairInfo.label.offset = getAxisLabelOffset(axis.getSpec());
        }

        xCrossHairInfo.startAngle = angle - bandWidth / 2;
        xCrossHairInfo.endAngle = angle + bandWidth / 2;
      });
    }

    if (this.yHair) {
      yCrossHairInfo.visible = !!this.currValueY.size;
      this.currValueY.forEach(({ axis, v, coord, ...rest }) => {
        v = v ?? '';
        if (this.yHair.label?.visible) {
          yCrossHairInfo.label.visible = true;
          yCrossHairInfo.label.text = v;
          yCrossHairInfo.label.offset = getAxisLabelOffset(axis.getSpec());
        }
        yCrossHairInfo.angle = coord.angle;
        yCrossHairInfo.axis = axis;
        mergeSpec(yCrossHairInfo, rest);
      });
    }

    if (this.enableRemain && !xCrossHairInfo.visible && isValid(this._cacheXCrossHairInfo)) {
      xCrossHairInfo = this._cacheXCrossHairInfo;
    } else {
      if (this.xHair?.label?.formatMethod && xCrossHairInfo.label.visible) {
        const { label } = xCrossHairInfo;
        label.text = this.xHair.label.formatMethod(label.text, 'angle') as string;
      }
    }

    if (this.enableRemain && !yCrossHairInfo.visible && isValid(this._cacheYCrossHairInfo)) {
      yCrossHairInfo = this._cacheYCrossHairInfo;
    } else {
      if (this.yHair?.label?.formatMethod && yCrossHairInfo.label.visible) {
        const { label } = yCrossHairInfo;
        label.text = this.yHair.label.formatMethod(label.text, 'radius') as string;
      }
    }

    if (tag) {
      LayoutType.HORIZONTAL && this._layoutHorizontal(yCrossHairInfo);
      LayoutType.VERTICAL && this._layoutVertical(xCrossHairInfo);
    }

    if (this.enableRemain) {
      this._cacheXCrossHairInfo = { ...xCrossHairInfo, _isCache: true };
      this._cacheYCrossHairInfo = { ...yCrossHairInfo, _isCache: true };
    }
  }

  private _layoutVertical(crosshairInfo: ICrosshairInfo) {
    if (crosshairInfo._isCache && this.enableRemain) {
      return;
    }

    const container = this.getContainer();
    const { angle, innerRadius, radius, label, startAngle, endAngle, center, visible } = crosshairInfo;
    if (visible) {
      const crosshairType = this.xHair.type === 'rect' ? 'sector' : 'line';
      let positionAttrs;
      if (crosshairType === 'sector') {
        positionAttrs = {
          center,
          innerRadius,
          radius,
          startAngle: startAngle,
          endAngle: endAngle
        };
      } else {
        positionAttrs = {
          start: polarToCartesian(center, innerRadius, angle),
          end: polarToCartesian(center, radius, angle)
        };
      }

      if (this._angleCrosshair) {
        this._angleCrosshair.setAttributes(positionAttrs as unknown as any);
      } else {
        let crosshair;
        // 创建
        if (crosshairType === 'line') {
          crosshair = new LineCrosshair({
            ...(positionAttrs as { start: IPoint; end: IPoint }),
            lineStyle: this.xHair.style,
            zIndex: this.gridZIndex
          });
        } else if (crosshairType === 'sector') {
          crosshair = new SectorCrosshair({
            ...(positionAttrs as {
              center: IPoint;
              innerRadius: number;
              radius: number;
              startAngle: number;
              endAngle: number;
            }),
            sectorStyle: this.xHair.style,
            zIndex: this.gridZIndex
          });
        }
        this._angleCrosshair = crosshair as unknown as IGroup;
        // 添加至场景树
        container.add(crosshair as unknown as INode);
      }

      // 文本
      if (label.visible) {
        const orient = angleLabelOrientAttribute(angle);
        const labelAttrs = {
          ...polarToCartesian(center, radius + label.offset, angle),
          ...this.xHair.label,
          ...label,
          textStyle: {
            ...this.xHair.label?.textStyle,
            textAlign: orient.align,
            textBaseline: orient.baseline
          },
          zIndex: this.labelZIndex
        };
        this._updateCrosshairLabel(this._angleLabelCrosshair, labelAttrs, label => {
          label.name = 'crosshair-angle-label';
          this._angleLabelCrosshair = label;
        });
      } else {
        this._angleLabelCrosshair && this._angleLabelCrosshair.hideAll();
      }
    }
  }

  private _layoutHorizontal(crosshairInfo: ICrosshairInfo) {
    if (crosshairInfo._isCache && this.enableRemain) {
      return;
    }

    const { center, startAngle, endAngle, distance, sides, axis, label, point, radius, innerRadius, visible } =
      crosshairInfo;
    const container = this.getContainer();
    if (visible) {
      const crosshairType = this.yHair.smooth ? 'circle' : 'polygon';

      let polygonRadius = distance;
      if (crosshairType === 'polygon') {
        const axisCenter = axis.getCenter();
        // 需要计算半径
        // 获取当前点的角度
        const curAngle = getAngleByPoint(axisCenter, point);
        const stepAngle = (endAngle - startAngle) / sides;
        const index = Math.floor((curAngle - startAngle) / stepAngle);
        const preAngle = index * stepAngle + startAngle;
        const nextAngle = Math.min((index + 1) * stepAngle + startAngle, endAngle);

        const prePoint = polarToCartesian(axisCenter, distance, preAngle);
        const nextPoint = polarToCartesian(axisCenter, distance, nextAngle);
        // 求交点
        const insertPoint = getIntersectPoint(
          [nextPoint.x, nextPoint.y],
          [prePoint.x, prePoint.y],
          [axisCenter.x, axisCenter.y],
          [point.x, point.y]
        );
        if (insertPoint) {
          polygonRadius = clamp(
            PointService.distancePN(point, insertPoint[0], insertPoint[1]) + distance,
            innerRadius,
            radius
          );
        }
      }
      const positionAttrs = {
        center,
        startAngle: startAngle,
        endAngle: endAngle,
        radius: polygonRadius,
        sides
      };

      if (this._radiusCrosshair) {
        this._radiusCrosshair.setAttributes(positionAttrs as unknown as any);
      } else {
        let crosshair;
        if (crosshairType === 'polygon') {
          crosshair = new PolygonCrosshair({
            ...positionAttrs,
            lineStyle: this.yHair.style,
            zIndex: this.gridZIndex + 1 // 样式优化：线盖在面上
          });
        } else {
          crosshair = new CircleCrosshair({
            ...positionAttrs,
            lineStyle: this.yHair.style,
            zIndex: this.gridZIndex
          });
        }
        this._radiusCrosshair = crosshair as unknown as IGroup;
        // 添加至场景树
        container.add(crosshair as unknown as INode);
      }

      // 文本
      if (label.visible) {
        const orient = radiusLabelOrientAttribute(startAngle);
        const labelAttrs = {
          ...polarToCartesian(center, polygonRadius, startAngle),
          ...this.yHair.label,
          ...label,
          textStyle: {
            ...this.yHair.label?.textStyle,
            textAlign: orient.align,
            textBaseline: orient.baseline
          },
          zIndex: this.labelZIndex
        };
        this._updateCrosshairLabel(this._radiusLabelCrosshair, labelAttrs, label => {
          label.name = 'crosshair-radius-label';
          this._radiusLabelCrosshair = label;
        });
      } else {
        this._radiusLabelCrosshair && this._radiusLabelCrosshair.hideAll();
      }
    }
  }

  protected _parseFieldInfo() {
    const { categoryField, valueField } = this._crosshairConfig as IPolarCrosshairSpec;
    if (categoryField && categoryField.visible) {
      this.xHair = this._parseField(categoryField, 'categoryField');
    }
    if (valueField && valueField.visible) {
      this.yHair = this._parseField(valueField, 'valueField');
      this.yHair.smooth = valueField?.line?.smooth;
    }
  }

  private _updateCrosshairLabel(label: Tag, labelAttrs: any, callback: (label: Tag) => void) {
    // 文本
    const container = this.getContainer();
    if (label) {
      label.setAttributes(labelAttrs);
    } else {
      label = new Tag(labelAttrs);
      container.add(label as unknown as INode);
      callback(label);
    }
    limitTagInBounds(label, this._getLimitBounds());
  }

  getVRenderComponents(): IGraphic[] {
    return [
      this._radiusCrosshair,
      this._radiusLabelCrosshair,
      this._angleCrosshair,
      this._angleLabelCrosshair
    ] as unknown as IGroup[];
  }
}

export const registerPolarCrossHair = () => {
  Factory.registerComponent(PolarCrossHair.type, PolarCrossHair);
};
