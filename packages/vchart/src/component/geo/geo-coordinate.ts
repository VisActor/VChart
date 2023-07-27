/* eslint-disable no-duplicate-imports */
import type { IPoint } from '../../typings/coordinate';
import { Projection } from './projection';
import type { IEffect, IModelLayoutOption, IModelRenderOption, ILayoutItem } from '../../model/interface';
import type { IComponentOption } from '../interface';
import { ComponentTypeEnum } from '../interface';
import { BaseComponent } from '../base';
import type { IGeoRegionSpec, IRegion, IRegionSpec } from '../../region/interface';
import { isNil, merge } from '../../util';
import { ChartEvent, PREFIX } from '../../constant/index';
import type { ICartesianSeries, IGeoSeries } from '../../series/interface';
import { SeriesTypeEnum } from '../../series/interface/type';
import type { ISymbolMark } from '../../mark/symbol';
import type { IGeoCoordinate, IGeoCoordinateHelper, IGeoCoordinateSpec, IProjectionSpec } from './interface';
import type { IPathMark } from '../../mark/path';
import type { BaseEventParams, ExtendEventParam, PanEventParam, ZoomEventParam } from '../../event/interface';
import type { Datum, IChartSpec } from '../../typings';
import type { IZoomable } from '../../interaction/zoom/zoomable';
import { Zoomable } from '../../interaction/zoom/zoomable';
import { mixin } from '@visactor/vutils';

export function projectionName(key: string, id: number) {
  return `${PREFIX}_${id}_${key}`;
}
export class GeoCoordinate extends BaseComponent implements IGeoCoordinate {
  static type = ComponentTypeEnum.geoCoordinate;
  type = ComponentTypeEnum.geoCoordinate;
  name: string = ComponentTypeEnum.geoCoordinate;

  layoutType: ILayoutItem['layoutType'] = 'absolute';

  protected declare _spec: IGeoRegionSpec;

  _longitudeField?: string;
  get longitudeField() {
    return this._longitudeField;
  }

  _latitudeField?: string;
  get latitudeField() {
    return this._latitudeField;
  }

  protected _projectionSpec: IProjectionSpec = {
    name: projectionName(this.type, this.id),
    type: 'mercator'
  };
  get projectionSpec() {
    return this._projectionSpec;
  }
  setProjection(projectionSpec: IGeoCoordinateSpec['projection']) {
    this._projectionSpec = {
      ...projectionSpec,
      name: this._projectionSpec.name
    };
  }

  protected _projection!: Projection;

  private _actualScale = 1;
  private _evaluated = false;
  private _lastHeight = 0;
  private _lastWidth = 0;

  static createComponent(spec: IChartSpec, options: IComponentOption) {
    if (isNil(spec)) {
      return null;
    }
    const result: IGeoCoordinate[] = [];
    spec.region.forEach((r: IRegionSpec, i: number) => {
      if (r.coordinate === 'geo') {
        // 去除 padding 配置，避免重复计算
        const spec = { ...r, padding: 0 };
        const c = new GeoCoordinate(spec, options);
        // FIXME: hack，regions的关联关系不应该在具体的component中处理
        c._regions = options.getRegionsInIndex([i]);
        result.push(c);
      }
    });
    return result;
  }

  effect: IEffect = {
    scaleUpdate: () => {
      this.coordinateHelper();
    }
  };

  setAttrFromSpec() {
    super.setAttrFromSpec();

    if (this._spec.roam) {
      (this as unknown as IZoomable).initZoomable(this.event, this._option.mode);
    }

    this._projectionSpec = merge(this._projectionSpec, this._spec.projection);
    if (this._projectionSpec.zoom > this._spec.zoomLimit?.max) {
      this._projectionSpec.zoom = this._spec.zoomLimit.max;
    }
    if (this._projectionSpec.zoom < this._spec.zoomLimit?.min) {
      this._projectionSpec.zoom = this._spec.zoomLimit.min;
    }
    this._longitudeField = this._spec.longitudeField;
    this._latitudeField = this._spec.latitudeField;
  }

  // life cycle
  created() {
    super.created();
    this.initProjection();
    this.coordinateHelper();
    this.initEvent();
    // FIXME: 这里是在开启缩放时，处理关联的symbol等mark，在地图缩放时应该同步缩放
    // this.rescaleMark();
  }

  private _handleChartZoom = (
    params: { zoomDelta: number; zoomX?: number; zoomY?: number },
    event?: BaseEventParams['event']
  ) => {
    let scale = params.zoomDelta;
    // check if the next scale will outrange
    const _lastActualScale = this._actualScale;
    this._actualScale *= scale;
    if (this._actualScale < this._spec.zoomLimit?.min) {
      this._actualScale = this._spec.zoomLimit?.min;
      scale = this._spec.zoomLimit?.min / _lastActualScale;
    } else if (this._actualScale > this._spec.zoomLimit?.max) {
      this._actualScale = this._spec.zoomLimit?.max;
      scale = this._spec.zoomLimit?.max / _lastActualScale;
    }
    if (event) {
      (event as any).zoomDelta = scale;
    }
    this.zoom(scale, [params.zoomX, params.zoomY]);
    return scale;
  };

  dispatchZoom(zoomDelta: number, center?: { x: number; y: number }) {
    const scaleCenter = center || {
      x: this.getLayoutStartPoint().x + this.getLayoutRect().width / 2,
      y: this.getLayoutStartPoint().y + this.getLayoutRect().height / 2
    };
    const scale = this._handleChartZoom({ zoomDelta, zoomX: scaleCenter.x, zoomY: scaleCenter.y });
    if (scale !== 1) {
      this.event.emit('zoom', {
        scale,
        scaleCenter,
        model: this
      } as unknown as ExtendEventParam);
    }
  }

  initEvent() {
    this.event.on(
      ChartEvent.scaleUpdate,
      { filter: ({ model }) => model?.id === this.id },
      this.effect.scaleUpdate.bind(this)
    );

    if (this._spec.roam) {
      (this as unknown as IZoomable).initZoomEventOfRegions(this._regions, null, this._handleChartZoom);
      (this as unknown as IZoomable).initDragEventOfRegions(this._regions, () => true, this.pan);

      this._regions.forEach(r => {
        r.getSeries().forEach(s => {
          s.event.on('zoom', e => {
            s.handleZoom(e as ZoomEventParam);
            return true;
          });

          s.event.on('panmove', e => {
            s.handlePan(e as PanEventParam);
            return true;
          });
        });
      });
    }
  }

  initProjection() {
    this._projection = new Projection(this._projectionSpec);
  }

  coordinateHelper() {
    const helper: IGeoCoordinateHelper = {
      longitudeField: this._longitudeField,
      latitudeField: this._latitudeField,
      dataToPosition: this.dataToPosition.bind(this),
      dataToLongitude: this.dataToLongitude.bind(this),
      dataToLatitude: this.dataToLatitude.bind(this),
      shape: this.shape.bind(this),
      getCoordinateId: () => this.id
    };

    this._regions.forEach(r => {
      r.getSeries().forEach(s => {
        if (s.type === SeriesTypeEnum.map) {
          (s as unknown as IGeoSeries).setCoordinateHelper(helper);
        } else {
          // 散点地图
          (s as unknown as ICartesianSeries).setXAxisHelper({
            ...helper,
            dataToPosition: (values: any[]) => {
              return this.dataToLongitude(values[0]);
            },
            getAxisType: () => this.type,
            getAxisId: () => this.id
          });
          (s as unknown as ICartesianSeries).setYAxisHelper({
            ...helper,
            dataToPosition: (values: any[]) => {
              return this.dataToLatitude(values[0]);
            },
            getAxisType: () => this.type,
            getAxisId: () => this.id
          });
          this._longitudeField && (s as unknown as ICartesianSeries).setFieldX(this._longitudeField);
          this._latitudeField && (s as unknown as ICartesianSeries).setFieldY(this._latitudeField);
        }
      });
    });
  }

  onLayoutEnd(ctx: IModelLayoutOption) {
    this.setLayoutRect(this._regions[0].getLayoutRect());
    this.setLayoutStartPosition(this._regions[0].getLayoutStartPoint());
    const { width, height } = this.getLayoutRect();
    if (!this._evaluated) {
      const { translate, scale, center } = this.evaluateProjection([0, 0], [width, height]);
      translate && this._projection.translate(translate);
      scale && this._projection.scale(scale);
      center && this._projection.center(center);
      this._evaluated = true;
    } else {
      const dx = (width - this._lastWidth) / 2;
      const dy = (height - this._lastHeight) / 2;
      this.pan([dx, dy]);
      this.event.emit('panmove', { delta: [dx, dy], model: this } as ExtendEventParam);
    }
    this._lastWidth = width;
    this._lastHeight = height;

    super.onLayoutEnd(ctx);
  }
  onRender(ctx: IModelRenderOption) {
    // do nothing
  }

  // region
  changeRegions(regions: IRegion[]): void {
    // do nothing
  }

  // util
  protected collectFeatures() {
    const features: any[] = [];
    this._regions.forEach(r => {
      r.getSeries().forEach(s => {
        if (s.type === SeriesTypeEnum.map) {
          features.push(...((s as unknown as IGeoSeries).getMapViewData()?.latestData ?? []));
        }
      });
    });
    return features;
  }

  // API
  dataToPosition(values: number[] = []): IPoint {
    const point = this._projection?.project([values[0], values[1]]);
    return {
      x: point?.[0],
      y: point?.[1]
    };
  }

  dataToLatitude(lat: number): number {
    const point = this._projection?.project([0, lat]);
    return point?.[1];
  }

  dataToLongitude(lon: number): number {
    const point = this._projection?.project([lon, 0]);
    return point?.[0];
  }

  // interaction
  zoom(p: number, anchor: [number, number] = [0, 0]) {
    let s = this._projection?.scale() ?? 0;
    const t = this._projection?.translate() ?? [0, 0];
    let t_x = t[0];
    let t_y = t[1];
    s = s * p;
    t_x -= (anchor[0] - t_x) * (p - 1);
    t_y -= (anchor[1] - t_y) * (p - 1);

    this._projection?.scale(s);
    this._projection?.translate([t_x, t_y]);
  }

  pan = (delta: [number, number] = [0, 0]) => {
    const t = this._projection?.translate() ?? [0, 0];
    let t_x = t[0];
    let t_y = t[1];
    t_x += delta[0];
    t_y += delta[1];
    this._projection?.translate([t_x, t_y]);
  };

  shape(datum?: any) {
    return this._projection.shape(datum);
  }

  private evaluateProjection(start: [number, number], size: [number, number]) {
    const evaluated = this._projection.evaluate(start, size, this.collectFeatures());
    let translate = evaluated.translate();
    const scale = evaluated.scale() * (this._projectionSpec.zoom ?? 1);
    const center = this._projectionSpec.center;
    center && (translate = [size[0] / 2, size[1] / 2]);
    return { translate, scale, center };
  }

  private rescaleMark() {
    this._regions.forEach(r => {
      const mapMark = r.getSeriesInType(SeriesTypeEnum.map)[0]?.getMarkInName('area') as IPathMark;
      if (mapMark) {
        r.getSeries().forEach(s => {
          if (s.type !== SeriesTypeEnum.map) {
            s.getMarksInType('symbol').forEach((s: ISymbolMark) => {
              s.setAttribute('scaleX', (datum: Datum) => {
                return (s.getAttribute('size', datum) as number) * (mapMark.getAttribute('scaleX', datum) as number);
              });
              s.setAttribute('scaleY', (datum: Datum) => {
                return (s.getAttribute('size', datum) as number) * (mapMark.getAttribute('scaleY', datum) as number);
              });
            });
          }
        });
      }
    });
  }
}

mixin(GeoCoordinate, Zoomable);
