import {
  CartesianSeries,
  Factory,
  AttributeLevel,
  MarkTypeEnum,
  registerPolygonMark,
  registerScatterSeries,
  ScatterSeries,
  queryColorFromColorScheme
} from '@visactor/vchart';
import type { Datum, IScatterSeriesSpec, ISeriesConstructor, PolygonMark, SeriesMarkMap } from '@visactor/vchart';
export class HexbinSeries extends CartesianSeries<IScatterSeriesSpec> {
  static readonly type = 'statplotsHexbin';
  readonly type = HexbinSeries.type;
  static readonly transformerConstructor = ScatterSeries.transformerConstructor;
  readonly transformerConstructor = ScatterSeries.transformerConstructor;
  static readonly mark: SeriesMarkMap = { point: { name: 'polygon', type: MarkTypeEnum.polygon } };
  private polygon!: PolygonMark;
  initMark(): void {
    this.polygon = this._createMark(HexbinSeries.mark.point!, { isSeriesMark: true }) as PolygonMark;
  }
  initMarkStyle(): void {
    this.setMarkStyle(
      this.polygon,
      {
        points: (row: Datum) =>
          row.vertices.map((point: { x: number; y: number }) => this.valueToPosition(point.x, point.y)),
        fill: { scale: 'hex-count', field: 'count' },
        stroke: queryColorFromColorScheme(this.getColorScheme()!, { type: 'palette', key: 'backgroundColor' }),
        lineWidth: 0.5
      },
      'normal',
      AttributeLevel.Series
    );
  }
  getActiveMarks() {
    return [this.polygon];
  }
  getDefaultShapeType() {
    return 'square';
  }
  protected initTooltip(): void {
    super.initTooltip();
    this._tooltipHelper!.activeTriggerSet!.mark!.add(this.polygon);
  }
}
export function registerHexbinSeries(): void {
  registerScatterSeries();
  registerPolygonMark();
  Factory.registerSeries(HexbinSeries.type, HexbinSeries as unknown as ISeriesConstructor);
}
