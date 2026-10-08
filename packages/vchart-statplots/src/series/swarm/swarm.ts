import {
  ScatterSeries,
  Factory,
  AttributeLevel,
  registerScatterSeries,
  queryColorFromColorScheme
} from '@visactor/vchart';
import type { Datum, ISeriesConstructor, SeriesTypeEnum } from '@visactor/vchart';
import { layoutSwarm } from './layout';
/** 分类带宽和数值坐标来自系列轴 helper，resize 时按最终像素域重新排布。 */
export class SwarmSeries extends ScatterSeries {
  static readonly type: string = 'statplotsSwarm';
  readonly type = SwarmSeries.type as SeriesTypeEnum;
  private offsets = new Map<string, number>();
  initMarkStyle(): void {
    super.initMarkStyle();
    const warningColor = queryColorFromColorScheme(this.getColorScheme()!, { type: 'palette', key: 'warningColor' });
    this.setMarkStyle(
      this.getSeriesMark(),
      {
        fillOpacity: (row: Datum) => (row.__crowded ? 0.15 : 0.85),
        stroke: (row: Datum) => (row.__crowded ? warningColor : false)
      },
      'normal',
      AttributeLevel.Series
    );
  }
  private layoutPoints(): void {
    const rows = this.getViewData().latestData as Datum[];
    const horizontal = this.direction === 'horizontal';
    const helper = horizontal ? this.getYAxisHelper() : this.getXAxisHelper();
    const depth = (horizontal ? this.fieldY : this.fieldX).length - 1;
    const halfWidth = helper.getBandwidth!(depth)! * 0.45;
    const groups = new Map<string, Datum[]>();
    rows.forEach(row => {
      const group = groups.get(row.__group);
      if (group) {
        group.push(row);
      } else {
        groups.set(row.__group, [row]);
      }
    });
    this.offsets.clear();
    groups.forEach(group => {
      const result = layoutSwarm(
        group.map(row => ({
          id: row.__key,
          valuePosition: horizontal ? super.dataToPositionX(row) : super.dataToPositionY(row),
          radius: 3.5
        })),
        halfWidth
      );
      const byId = new Map(result.placements.map(item => [item.id, item]));
      group.forEach(row => {
        const placement = byId.get(row.__key)!;
        this.offsets.set(row.__key, placement.offset);
        row.__crowded = placement.overflow;
      });
    });
  }
  onLayoutEnd(): void {
    this.layoutPoints();
    super.onLayoutEnd();
  }
  dataToPositionX(row: Datum): number {
    return super.dataToPositionX(row) + (this.direction === 'horizontal' ? 0 : this.offsets.get(row.__key) ?? 0);
  }
  dataToPositionY(row: Datum): number {
    return super.dataToPositionY(row) + (this.direction === 'horizontal' ? this.offsets.get(row.__key) ?? 0 : 0);
  }
  release(): void {
    this.offsets.clear();
    super.release();
  }
}
export function registerSwarmSeries(): void {
  registerScatterSeries();
  Factory.registerSeries(SwarmSeries.type, SwarmSeries as unknown as ISeriesConstructor);
}
