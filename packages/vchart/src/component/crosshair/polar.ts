/* eslint-disable no-duplicate-imports */
import type { IPolarSeries } from '../../series/interface/series';
import { mergeSpec } from '../../util/spec/merge-spec';
import type { IComponentOption } from '../interface';
import { ComponentTypeEnum } from '../interface/type';
import type { IPolarCrosshairSpec } from './interface';
import type { BandScale } from '@visactor/vscale';
import { isDiscrete, isContinuous } from '@visactor/vscale';
import { Tag } from '@visactor/vrender-components';
import { LineCrosshair, SectorCrosshair, CircleCrosshair, PolygonCrosshair } from '@visactor/vrender-components';
import type { IPolarAxis } from '../axis/polar/interface';
import type { IPoint, StringOrNumber } from '../../typings';
import type { IAxisInfo, IHair } from './base';
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
import type { IGraphic, IGroup, INode } from '@visactor/vrender';
import { angleLabelOrientAttribute, radiusLabelOrientAttribute } from '../../util/math';
import { limitTagInBounds } from './util';
import { getAxisLabelOffset } from '../axis/util';
import { Factory } from '../../core/factory';
import { LayoutType } from './config';

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

export class PolarCrossHair<T extends IPolarCrosshairSpec = IPolarCrosshairSpec> extends BaseCrossHair<T> {
  static specKey = 'crosshair';
  specKey: string = 'crosshair';

  static type = ComponentTypeEnum.polarCrosshair;
  type = ComponentTypeEnum.polarCrosshair;
  name: string = ComponentTypeEnum.polarCrosshair;
  private _currValueAngle: Map<number, { v: StringOrNumber; axis: IPolarAxis; [key: string]: any }>;
  private _currValueRadius: Map<number, { v: StringOrNumber; axis: IPolarAxis; [key: string]: any }>;

  private _angleHair: IHair | undefined;
  private _radiusHair: (IHair & { smooth: boolean }) | undefined;

  private _cacheAngleCrossHairInfo: ICrosshairInfo | undefined;
  private _cacheRadiusCrossHairInfo: ICrosshairInfo | undefined;

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
    this._currValueAngle = new Map();
    this._currValueRadius = new Map();
  }

  protected _showDefaultCrosshairBySpec() {
    const { categoryField, valueField } = this._spec as IPolarCrosshairSpec;
    if (categoryField?.visible && categoryField.defaultSelect) {
      const { axisIndex, datum } = categoryField.defaultSelect;
      this._defaultCrosshair(axisIndex, datum, LayoutType.VERTICAL);
    }
    if (valueField?.visible && valueField.defaultSelect) {
      const { axisIndex, datum } = valueField.defaultSelect;
      this._defaultCrosshair(axisIndex, datum, LayoutType.HORIZONTAL);
    }
  }

  private _defaultCrosshair(axisIndex: number, datum: StringOrNumber, tag: number) {
    const axis = this._option.getComponentsByKey('axes').find(c => c.getSpecIndex() === axisIndex) as IPolarAxis;
    if (!axis) {
      return;
    }
    // 横轴
    if (tag === LayoutType.VERTICAL) {
      this._currValueAngle.clear();
      // 根据数值拿到对应的坐标点
      const polarCoord = {
        angle: axis.valueToPosition(datum),
        radius: axis.getOuterRadius()
      };
      const canvasPosition = axis.coordToPoint(polarCoord);
      this._currValueAngle.set(axisIndex, this._getValueByAxis(axis, canvasPosition));
    } else {
      this._currValueRadius.clear();
      // 根据数值拿到对应的坐标点
      const polarCoord = {
        angle: axis.startAngle,
        radius: axis.valueToPosition(datum)
      };
      const canvasPosition = axis.coordToPoint(polarCoord);
      this._currValueRadius.set(axisIndex, this._getValueByAxis(axis, canvasPosition));
    }
    this.layoutByValue(LayoutType.ALL);
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
  private _findAllAxisContains(relativeX: number, relativeY: number) {
    const angleAxisMap = this._getAxisInfoByField<IPolarAxis>('category');
    const radiusAxisMap = this._getAxisInfoByField<IPolarAxis>('value');
    return {
      angleAxisMap: this._filterAxisByPoint<IPolarAxis>(angleAxisMap, relativeX, relativeY),
      radiusAxisMap: this._filterAxisByPoint<IPolarAxis>(radiusAxisMap, relativeX, relativeY)
    };
  }

  /**
   * 根据位置获取所有轴上的value
   * @param axisMap
   * @param p
   * @returns
   */
  private _getAllAxisValues(
    axisMap: IAxisInfo<IPolarAxis>,
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
      currValue.set(id, this._getValueByAxis(axis, point));
    });
    return true;
  }

  private _getValueByAxis(axis: IPolarAxis, point: IPoint) {
    const { x: axisStartX, y: axisStartY } = axis.getLayoutStartPoint();
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

    return {
      v: value,
      axis,
      center,
      innerRadius: axis.getInnerRadius(),
      radius: axis.getOuterRadius(),
      startAngle: axis.startAngle,
      endAngle: axis.endAngle,
      distance: PointService.distancePP(point, axis.getCenter()),
      coord: axis.pointToCoord(point),
      point
    };
  }

  protected _layoutCrosshair(relativeX: number, relativeY: number) {
    // 找到所有的包含这个点的轴
    const { angleAxisMap, radiusAxisMap } = this._findAllAxisContains(relativeX, relativeY);
    if (angleAxisMap.size === 0 && radiusAxisMap.size === 0) {
      if (this.enableRemain) {
        return;
      }
      // 隐藏
      this.hide();
      return;
    }
    // 删除之前的currValue
    this._currValueAngle.clear();
    this._currValueRadius.clear();
    // 将数据保存到这个对象中，如果不存在，就直接不执行后续逻辑
    angleAxisMap && this._getAllAxisValues(angleAxisMap, { x: relativeX, y: relativeY }, this._currValueAngle);
    radiusAxisMap && this._getAllAxisValues(radiusAxisMap, { x: relativeX, y: relativeY }, this._currValueRadius);

    this.layoutByValue(LayoutType.ALL);
  }

  layoutByValue(tag: number = LayoutType.ALL) {
    if (!this.enable) {
      return;
    }
    // 获取axisHelper
    const series = this._firstSeries<IPolarSeries>();
    if (!series) {
      return;
    }
    let angleCrossHairInfo = {
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
    let radiusCrossHairInfo = {
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
    if (this._angleHair) {
      angleCrossHairInfo.visible = !!this._currValueAngle.size;
      const bandWidth = series.angleAxisHelper.getBandwidth(0);
      this._currValueAngle.forEach(({ axis, v, coord, ...rest }) => {
        v = v ?? '';
        mergeSpec(angleCrossHairInfo, rest);
        const angle = series.angleAxisHelper.dataToPosition([v]);
        angleCrossHairInfo.angle = angle;
        if (this._angleHair.label?.visible) {
          angleCrossHairInfo.label.visible = true;
          angleCrossHairInfo.label.text = v;
          angleCrossHairInfo.label.offset = getAxisLabelOffset(axis.getSpec());
        }

        angleCrossHairInfo.startAngle = angle - bandWidth / 2;
        angleCrossHairInfo.endAngle = angle + bandWidth / 2;
      });
    }

    if (this._radiusHair) {
      radiusCrossHairInfo.visible = !!this._currValueRadius.size;
      this._currValueRadius.forEach(({ axis, v, coord, ...rest }) => {
        v = v ?? '';
        if (this._radiusHair.label?.visible) {
          radiusCrossHairInfo.label.visible = true;
          radiusCrossHairInfo.label.text = v;
          radiusCrossHairInfo.label.offset = getAxisLabelOffset(axis.getSpec());
        }
        radiusCrossHairInfo.angle = coord.angle;
        radiusCrossHairInfo.axis = axis;
        mergeSpec(radiusCrossHairInfo, rest);
      });
    }

    if (this.enableRemain && !angleCrossHairInfo.visible && isValid(this._cacheAngleCrossHairInfo)) {
      angleCrossHairInfo = this._cacheAngleCrossHairInfo;
    } else {
      if (this._angleHair?.label?.formatMethod && angleCrossHairInfo.label.visible) {
        const { label } = angleCrossHairInfo;
        label.text = this._angleHair.label.formatMethod(label.text, 'angle') as string;
      }
    }

    if (this.enableRemain && !radiusCrossHairInfo.visible && isValid(this._cacheRadiusCrossHairInfo)) {
      radiusCrossHairInfo = this._cacheRadiusCrossHairInfo;
    } else {
      if (this._radiusHair?.label?.formatMethod && radiusCrossHairInfo.label.visible) {
        const { label } = radiusCrossHairInfo;
        label.text = this._radiusHair.label.formatMethod(label.text, 'radius') as string;
      }
    }

    if (tag) {
      LayoutType.HORIZONTAL && this._layoutHorizontal(radiusCrossHairInfo);
      LayoutType.VERTICAL && this._layoutVertical(angleCrossHairInfo);
    }

    if (this.enableRemain) {
      this._cacheAngleCrossHairInfo = { ...angleCrossHairInfo, _isCache: true };
      this._cacheRadiusCrossHairInfo = { ...radiusCrossHairInfo, _isCache: true };
    }
  }

  private _layoutVertical(crosshairInfo: ICrosshairInfo) {
    if (crosshairInfo._isCache && this.enableRemain) {
      return;
    }

    const container = this.getContainer();
    const { angle, innerRadius, radius, label, startAngle, endAngle, center, visible } = crosshairInfo;
    if (visible) {
      const crosshairType = this._angleHair.type === 'rect' ? 'sector' : 'line';
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
            lineStyle: this._angleHair.style,
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
            sectorStyle: this._angleHair.style,
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
          ...this._angleHair.label,
          ...label,
          textStyle: {
            ...this._angleHair.label?.textStyle,
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
      const crosshairType = this._radiusHair.smooth ? 'circle' : 'polygon';

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
            lineStyle: this._radiusHair.style,
            zIndex: this.gridZIndex + 1 // 样式优化：线盖在面上
          });
        } else {
          crosshair = new CircleCrosshair({
            ...positionAttrs,
            lineStyle: this._radiusHair.style,
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
          ...this._radiusHair.label,
          ...label,
          textStyle: {
            ...this._radiusHair.label?.textStyle,
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
    const { categoryField, valueField } = this._spec as IPolarCrosshairSpec;
    if (categoryField && categoryField.visible) {
      this._angleHair = this._parseField(categoryField, 'categoryField');
    }
    if (valueField && valueField.visible) {
      this._radiusHair = this._parseField(valueField, 'valueField');
      this._radiusHair.smooth = valueField?.line?.smooth;
    }
  }

  private _updateCrosshairLabel(label: Tag, labelAttrs: any, callback: (label: Tag) => void) {
    // 文本
    const container = this.getContainer();
    if (label) {
      label.setAttributes(labelAttrs);
    } else {
      label = new Tag(labelAttrs);
      container?.add(label as unknown as INode);
      callback(label);
    }
    limitTagInBounds(label, this._getLimitBounds());
  }

  protected _getNeedClearVRenderComponents(): IGraphic[] {
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
