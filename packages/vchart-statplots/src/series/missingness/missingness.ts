import { HeatmapSeries, Factory, AttributeLevel, registerHeatmapSeries } from '@visactor/vchart';
import type { Datum, ISeriesConstructor, SeriesTypeEnum } from '@visactor/vchart';
import { layoutPixelRows } from './layout';
import type { PixelRow } from './layout';

/** 复用 heatmap，只在布局结束时将观测行的共享边界对齐到设备像素。 */
export class MissingnessSeries extends HeatmapSeries {
  static readonly type: string = 'statplotsMissingness';
  readonly type = MissingnessSeries.type as SeriesTypeEnum;
  private rows = new Map<string, PixelRow>();

  initCellMarkStyle(): void {
    super.initCellMarkStyle();
    this.setMarkStyle(
      this._cellMark,
      {
        y: (row: Datum) => this.rows.get(row.observationId)!.y,
        size: (row: Datum) => this.rows.get(row.observationId)!.size
      },
      'normal',
      AttributeLevel.Series
    );
  }

  onLayoutEnd(): void {
    const axis = this.getYAxisHelper();
    const scale = axis.getScale!(0);
    this.rows = layoutPixelRows(
      scale.domain() as string[],
      scale.range() as number[],
      this.getLayoutStartPoint().y,
      this._option.globalInstance.getStage().window.dpr,
      this.getCellSize(this.getXAxisHelper())
    );
    super.onLayoutEnd();
  }

  release(): void {
    this.rows.clear();
    super.release();
  }
}

export function registerMissingnessSeries(): void {
  registerHeatmapSeries();
  Factory.registerSeries(MissingnessSeries.type, MissingnessSeries as unknown as ISeriesConstructor);
}
