import { POLAR_DEFAULT_RADIUS, POLAR_END_ANGLE, POLAR_END_RADIAN } from '../../../constant/polar';
import type { IBaseScale, BandScale, LinearScale } from '@visactor/vscale';
// eslint-disable-next-line no-duplicate-imports
import { isContinuous } from '@visactor/vscale';
import { ChartEvent, LayoutZIndex, POLAR_START_ANGLE, POLAR_START_RADIAN } from '../../../constant';
import type { IPolarAxis, IPolarAxisCommonSpec, IPolarAxisCommonTheme } from './interface';
import type { IComponentOption } from '../../interface';
// eslint-disable-next-line no-duplicate-imports
import { ComponentTypeEnum } from '../../interface/type';
import { Factory } from '../../../core/factory';
import { mergeSpec } from '../../../util/spec/merge-spec';
import { eachSeries } from '../../../util/model';
import { polarToCartesian } from '../../../util/math';
import type { IPolarTickDataOpt, CoordinateType } from '@visactor/vutils-extension';
// eslint-disable-next-line no-duplicate-imports
import type { IPolarSeries } from '../../../series/interface';
import type { IPoint, IPolarOrientType, IPolarPoint, Datum, StringOrNumber, ILayoutType } from '../../../typings';
import { isPolarAxisSeries } from '../../../series/util/utils';
import { getAxisLabelOffset, isValidPolarAxis } from '../util';

import type { Dict, Maybe } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { PointService, degreeToRadian, isValid, isArray, isValidNumber } from '@visactor/vutils';
import type { IEffect, IModelSpecInfo } from '../../../model/interface';
import { CompilableData } from '../../../compile/data/compilable-data';
import { AxisComponent } from '../base-axis';
import type { IBandAxisSpec, ITick } from '../interface';
import { HOOK_EVENT } from '@visactor/vgrammar-core';
import { getPolarAxisInfo } from './util';

export abstract class PolarAxis<T extends IPolarAxisCommonSpec = IPolarAxisCommonSpec>
  extends AxisComponent<T>
  implements IPolarAxis
{
  static type = ComponentTypeEnum.polarAxis;
  type = ComponentTypeEnum.polarAxis;
  name: string = ComponentTypeEnum.polarAxis;

  static specKey = 'axes';

  protected readonly _defaultBandPosition = 0;
  protected readonly _defaultBandInnerPadding = 0;
  protected readonly _defaultBandOuterPadding = 0;

  layoutType: ILayoutType = 'absolute';
  layoutZIndex: number = LayoutZIndex.Axis;
  protected _tick: ITick | undefined = undefined;

  protected _center: IPoint | null = null;
  get center() {
    return this._center;
  }

  protected _startAngle: number = POLAR_START_RADIAN;
  get startAngle() {
    return this._startAngle;
  }

  protected _endAngle: number = POLAR_END_RADIAN;
  get endAngle() {
    return this._endAngle;
  }

  protected _orient: IPolarOrientType = 'radius';
  getOrient() {
    return this._orient;
  }

  protected _groupScales: IBaseScale[] = [];
  getGroupScales() {
    return this._groupScales;
  }

  private _axisStyle: any;
  private _gridStyle: any;

  static getSpecInfo(chartSpec: any): Maybe<IModelSpecInfo[]> {
    const axesSpec = chartSpec[this.specKey];
    if (!axesSpec) {
      return null;
    }

    if (!isArray(axesSpec)) {
      if (!isValidPolarAxis(axesSpec)) {
        return null;
      }
      const { axisType, componentName } = getPolarAxisInfo(axesSpec);
      axesSpec.center = chartSpec.center;
      axesSpec.startAngle = chartSpec.startAngle ?? POLAR_START_ANGLE;
      axesSpec.endAngle =
        chartSpec.endAngle ?? (isValid(chartSpec.startAngle) ? chartSpec.startAngle + 360 : POLAR_END_ANGLE);
      axesSpec.type = axisType;
      return [
        {
          spec: axesSpec,
          specPath: [this.specKey],
          type: componentName
        }
      ];
    }
    const specInfos: IModelSpecInfo[] = [];
    let angleAxisIndex: number;
    const radiusAxisSpecInfos: IModelSpecInfo[] = [];
    axesSpec.forEach((s: any, i: number) => {
      if (!isValidPolarAxis(s)) {
        return;
      }
      const { axisType, componentName } = getPolarAxisInfo(s);
      s.center = chartSpec.center;
      s.startAngle = chartSpec.startAngle ?? POLAR_START_ANGLE;
      s.endAngle = chartSpec.endAngle ?? (isValid(chartSpec.startAngle) ? chartSpec.startAngle + 360 : POLAR_END_ANGLE);
      // 优先使用outerRadius, 但要兼容s.radius, spec.radius
      s.outerRadius = s.radius ?? chartSpec.outerRadius ?? chartSpec.radius ?? POLAR_DEFAULT_RADIUS;
      s.type = axisType;
      const info = {
        spec: s,
        specIndex: i,
        specPath: [this.specKey, i],
        type: componentName
      };
      specInfos.push(info);
      if (s.orient === 'radius') {
        radiusAxisSpecInfos.push(info);
      } else {
        angleAxisIndex = i;
      }
    });
    radiusAxisSpecInfos.forEach(info => {
      (info as any).angleAxisIndex = angleAxisIndex;
    });
    return specInfos;
  }

  static createComponent(specInfo: IModelSpecInfo, options: IComponentOption) {
    const { spec, ...others } = specInfo;
    const C = Factory.getComponentInKey(others.type);
    if (C) {
      return new C(spec, {
        ...options,
        ...others
      }) as IPolarAxis;
    }
    options.onError(`Component ${others.type} not found`);
    return null;
  }

  effect: IEffect = {
    scaleUpdate: param => {
      this.computeData(param?.value);
      eachSeries(
        this._regions,
        s => {
          if (this.getOrient() === 'radius') {
            (s as IPolarSeries).radiusAxisHelper = this.axisHelper();
          } else {
            (s as IPolarSeries).angleAxisHelper = this.axisHelper();
          }
        },
        {
          userId: this._seriesUserId,
          specIndex: this._seriesIndex
        }
      );
    }
  };

  setAttrFromSpec() {
    super.setAttrFromSpec();

    if (this.visible) {
      this._axisStyle = this._getAxisAttributes();
      this._gridStyle = this._getGridAttributes();
    }

    this._tick = this._spec.tick;
    this._orient = this._spec.orient === 'angle' ? 'angle' : 'radius';
    this._center = this._spec.center;
    const chartSpec = this.getChart().getSpec() as any;
    const startAngle = this._spec.startAngle ?? chartSpec.startAngle;
    const endAngle = this._spec.endAngle ?? chartSpec.endAngle;
    this._startAngle = degreeToRadian(startAngle ?? POLAR_START_ANGLE);
    this._endAngle = degreeToRadian(endAngle ?? (isValid(startAngle) ? startAngle + 360 : POLAR_END_ANGLE));
    this._inverse = this._spec.inverse;
  }

  _transformLayoutPosition = (pos: Partial<IPoint>) => {
    const region = this.getRegions()?.[0];
    return region ? region.getLayoutPositionWidthIndent() : pos;
  };

  onLayoutEnd(ctx: any): void {
    const isChanged = this.updateScaleRange();

    if (isChanged) {
      this.updateSeriesScale();
      this.event.emit(ChartEvent.scaleUpdate, { model: this, value: 'range' });
    }

    super.onLayoutEnd(ctx);
  }

  onRender(ctx: any): void {
    // do nothing
  }

  changeRegions(/** regions: IRegion[] */): void {
    // do nothing
  }

  // data
  protected _initData() {
    const tickData = this._initTickDataSet(this._tickTransformOption('polar'));
    tickData.target.addListener('change', this._forceLayout.bind(this));
    this._tickData = new CompilableData(this._option, tickData);
  }

  protected _tickTransformOption(coordinateType: CoordinateType) {
    return {
      ...super._tickTransformOption(coordinateType),
      noDecimal: this._tick.noDecimals,
      startAngle: this.startAngle,
      labelOffset: getAxisLabelOffset(this._spec),
      getRadius: () => this.getOuterRadius()
    } as IPolarTickDataOpt;
  }

  afterCompile() {
    const product = this._axisMark?.getProduct();
    if (product) {
      product.addEventListener(HOOK_EVENT.AFTER_ELEMENT_ENCODE, () => {
        if (this._isLayout === false) {
          // 布局结束之后再进行插件的调用
          this._delegateAxisContainerEvent(product.getGroupGraphicItem());
        }
      });
    }
  }

  protected updateScaleRange() {
    const prevRange = this._scale.range();
    let newRange: [number, number];

    if (this.getOrient() === 'radius') {
      newRange = this._inverse
        ? [this.computeLayoutOuterRadius(), this.computeLayoutInnerRadius()]
        : [this.computeLayoutInnerRadius(), this.computeLayoutOuterRadius()];
    } else {
      newRange = this._inverse ? [this._endAngle, this._startAngle] : [this._startAngle, this._endAngle];
    }

    if (prevRange && newRange && prevRange[0] === newRange[0] && prevRange[1] === newRange[1]) {
      return false;
    }

    this._scale.range(newRange);

    return true;
  }

  protected collectData(depth: number) {
    const data: { min: number; max: number; values: any[] }[] = [];
    eachSeries(
      this._regions,
      s => {
        let field: string | string[];
        if (depth > 0) {
          field = s.getGroups()?.fields?.[depth];
        } else {
          field =
            this.getOrient() === 'radius' ? (s as IPolarSeries).getRadiusField() : (s as IPolarSeries).getAngleField();
        }
        field = (isArray(field) ? (isContinuous(this._scale.type) ? field : [field[0]]) : [field]) as string[];
        if (!depth) {
          this._dataFieldText = s.getFieldAlias(field[0]);
        }
        const seriesData = s.getViewDataStatistics?.();
        if (field) {
          field.forEach(f => {
            if (seriesData?.latestData?.[f]) {
              data.push(seriesData.latestData[f]);
            }
          });
        }
      },
      {
        userId: this._seriesUserId,
        specIndex: this._seriesIndex
      }
    );
    return data;
  }

  protected abstract computeDomain(data: { min: number; max: number; values: any[] }[]): StringOrNumber[];

  protected updateSeriesScale(): void {
    eachSeries(
      this._regions,
      s => {
        if (this.getOrient() === 'radius') {
          (s as IPolarSeries).setRadiusScale(this._scale);
          (s as IPolarSeries).radiusAxisHelper = this.axisHelper();
        } else {
          (s as IPolarSeries).setAngleScale(this._scale);
          (s as IPolarSeries).angleAxisHelper = this.axisHelper();
        }
      },
      {
        userId: this._seriesUserId,
        specIndex: this._seriesIndex
      }
    );
  }

  protected getSeriesStatisticsField(s: IPolarSeries) {
    const f = this.getOrient() === 'radius' ? s.getRadiusField() : s.getAngleField();
    if (isContinuous(this._scale.type)) {
      return f;
    }
    return [f[0]];
  }

  protected initGroupScales() {
    // do nothing
  }

  // axisHelper
  protected axisHelper() {
    const getScale = (depth: number) => {
      return this._scales[depth];
    };

    const helper = {
      isContinuous: isContinuous(this._scale.type),
      dataToPosition: this.dataToPosition.bind(this),
      coordToPoint: this.coordToPoint.bind(this),
      pointToCoord: this.pointToCoord.bind(this),
      center: this.getCenter.bind(this),
      getScale,
      getAxisId: () => this.id
    };
    return helper;
  }

  positionToData(position: IPoint) {
    const coord = this.pointToCoord(position);
    if (this.getOrient() === 'radius') {
      return this.invert(coord.radius);
    }
    return this.invert(coord.angle);
  }

  /**
   * 将半径和角度转换为笛卡尔坐标点
   * @param point 角度 & 弧度信息
   * @returns 笛卡尔坐标点 { x, y }
   */
  coordToPoint(point: IPolarPoint): IPoint {
    // center & startAngle 都是坐标系转换的配置，在 scale 中不生效，仅在最终转换时生效
    const angle = point.angle;
    const { x: centerX, y: centerY } = this.getCenter();
    const p = polarToCartesian({ angle, radius: point.radius });
    return {
      x: p.x + centerX,
      y: p.y + centerY
    };
  }

  /**
   * 将笛卡尔坐标转换为对应的半径和弧度
   * @param point 笛卡尔坐标点 { x, y }
   * @returns 角度 & 弧度信息 { radius, angle }
   */
  pointToCoord(point: IPoint): IPolarPoint {
    const { x: centerX, y: centerY } = this.getCenter();
    let dx = point.x - centerX;
    let dy = point.y - centerY;
    const startAngle = this._startAngle;
    const endAngle = this._endAngle;
    const radius = Math.sqrt(dx * dx + dy * dy);
    dx /= radius;
    dy /= radius;

    let radian = Math.atan2(dy, dx);
    if (radian < startAngle) {
      while (radian <= startAngle) {
        radian += Math.PI * 2;
      }
    }
    if (radian > endAngle) {
      while (radian >= endAngle) {
        radian -= Math.PI * 2;
      }
    }
    return {
      radius,
      angle: radian
    };
  }

  /**
   * 获取坐标轴圆心位置
   * @returns 圆心位置
   */
  getCenter(): IPoint {
    return {
      x: this._center?.x || this.getRefLayoutRect().width / 2,
      y: this._center?.y || this.getRefLayoutRect().height / 2
    };
  }

  /**
   * 获取极坐标半径值
   * @returns 半径数值
   */
  getOuterRadius(): number {
    return this.computeLayoutOuterRadius();
  }

  /**
   * 获取极坐标内半径值
   * @returns 内半径数值
   */
  getInnerRadius(): number {
    return this.computeLayoutInnerRadius();
  }

  tickValues(): number[] {
    if (this._tickData) {
      const latestData = this._tickData.getLatestData();

      if (latestData && !isArray(latestData)) {
        // the ticks data of scale has not be calculated
        this.computeData('force');
      }

      return this._tickData.getLatestData() || [];
    }

    return (this._scale as BandScale | LinearScale).ticks();
  }

  updateLayoutAttribute(): void {
    if (this._visible) {
      if (this.getOrient() === 'radius') {
        this._layoutRadiusAxis();
      } else {
        this._layoutAngleAxis();
      }
    }

    super.updateLayoutAttribute();
  }

  private _layoutAngleAxis(): void {
    const center = this.getCenter();
    const radius = this.computeLayoutOuterRadius();
    const innerRadius = this.computeLayoutInnerRadius();
    const angleRange = this._endAngle - this._startAngle;
    const items = isArray(this._tickData.getLatestData())
      ? this._tickData.getLatestData().map((obj: Datum) => {
          const angle = this.dataToPosition([obj.value]);
          return {
            id: obj.value,
            label: obj.value,
            value: (angle - this._startAngle) / angleRange,
            rawValue: obj.value
          };
        })
      : [];
    const commonAttrs = {
      ...this.getLayoutStartPoint(),
      inside: this._spec.inside,
      center,
      radius,
      innerRadius,
      startAngle: this._startAngle,
      endAngle: this._endAngle
    };
    const attrs: any = {
      ...commonAttrs,
      title: {
        text: this._spec.title.text || this._dataFieldText
      },
      items: items.length ? [items] : []
    };
    if (this._spec.grid.visible) {
      attrs.grid = {
        type: 'line',
        smoothLink: true,
        items,
        ...commonAttrs
      };
    }
    this._update(attrs);
  }

  private _layoutRadiusAxis(): void {
    const center = this.getCenter();
    const radius = this.computeLayoutOuterRadius();
    const innerRadius = this.computeLayoutInnerRadius();
    const endPoint = this.coordToPoint({ angle: this._startAngle, radius });
    const startPoint = this.coordToPoint({ angle: this._startAngle, radius: innerRadius });
    const distance = PointService.distancePP(startPoint, endPoint);
    const items = isArray(this._tickData.getLatestData())
      ? this._tickData.getLatestData().map((obj: Datum) => {
          const value = this.dataToPosition([obj.value]);
          return {
            id: obj.value,
            label: obj.value,
            value: (value - innerRadius) / distance,
            rawValue: obj.value
          };
        })
      : [];
    const commonAttrs = {
      ...this.getLayoutStartPoint(),
      start: startPoint,
      end: endPoint,
      verticalFactor: -1
    };
    const attrs: any = {
      ...commonAttrs,
      title: {
        text: this._spec.title.text || this._dataFieldText
      },
      items: items.length ? [items] : []
    };
    if (this._spec.grid?.visible) {
      attrs.grid = {
        items,
        type: this._spec.grid?.smooth ? 'circle' : 'polygon',
        center,
        closed: true,
        sides: this._getRelatedAngleAxis()?.tickValues().length,
        startAngle: this._startAngle,
        endAngle: this._endAngle,
        ...commonAttrs
      };
    }
    this._update(attrs);
  }

  protected _getRelatedAngleAxis(): IPolarAxis | undefined {
    const index = (this._option as any).angleAxisIndex;
    if (isValid(index)) {
      return this._option.getComponentByIndex(this.specKey, index) as IPolarAxis;
    }
    return undefined;
  }

  private computeLayoutOuterRadius() {
    /**
     * 兼容radius旧配置
     * @deprecated use outerRadius instead
     */
    const radius = this._spec.outerRadius ?? this._spec.radius;
    const outerRadius = radius ?? this.getRefSeriesRadius().outerRadius;
    const { width, height } = this.getRefLayoutRect();
    return (Math.min(width, height) / 2) * outerRadius;
  }

  private computeLayoutInnerRadius() {
    const innerRadius = this._spec.innerRadius ?? this.getRefSeriesRadius().innerRadius;
    const { width, height } = this.getRefLayoutRect();
    return (Math.min(width, height) / 2) * innerRadius;
  }

  private getRefLayoutRect() {
    return this.getRegions()[0].getLayoutRectWidthIndent();
  }

  private getRefSeriesRadius() {
    let outerRadius: number = POLAR_DEFAULT_RADIUS;
    let innerRadius: number = 0;
    const chartSpec = this.getChart().getSpec() as any;
    // FIXME: 为了保证 common 图表能够应用系列的 radius 配置，当前从相应的 region 中取到 radius 信息
    eachSeries(
      this.getRegions(),
      s => {
        const series = s as IPolarSeries;
        if (isPolarAxisSeries(series.type)) {
          const {
            outerRadius: seriesRadius = chartSpec.outerRadius,
            innerRadius: seriesInnerRadius = chartSpec.innerRadius
          } = series;
          if (isValidNumber(seriesRadius)) {
            outerRadius = seriesRadius;
          }
          if (isValidNumber(seriesInnerRadius)) {
            innerRadius = seriesInnerRadius;
          }
        }
      },
      {
        userId: this._seriesUserId,
        specIndex: this._seriesIndex
      }
    );
    return { outerRadius, innerRadius };
  }

  private _update(attrs: Dict<unknown>) {
    const { grid: gridAttrs, ...axisAttrs } = attrs;
    const axisProduct = this._axisMark.getProduct(); // 获取语法元素并更新
    axisProduct.encode(mergeSpec({}, this._axisStyle, axisAttrs));

    if (this._gridMark) {
      const gridProduct = this._gridMark.getProduct(); // 获取语法元素并更新
      gridProduct.encode(mergeSpec({}, this._gridStyle, gridAttrs));
    }
  }

  invert(value: number): number {
    if (this.getOrient() === 'angle' && this._scale.type === 'band') {
      //极坐标轴需要手动取模，超出range时默认会截断
      const range = this._scale.range();
      const rangeValue = range[range.length - 1] - range[0];
      const bandPosition = (this.getSpec() as IBandAxisSpec).bandPosition ?? this._defaultBandPosition;
      const offset = bandPosition === 0.5 ? 0 : (this._scale as BandScale).bandwidth() / 2;
      if (range[0] < 0) {
        const angle = value + offset;
        const transformedAngle = ((angle + Math.abs(range[0])) % rangeValue) - Math.abs(range[0]);
        return this._scale.invert(transformedAngle);
      }
      return this._scale.invert((value + offset) % rangeValue);
    }

    return this._scale.invert(value);
  }
}
