import { ScatterSeries, Factory, registerScatterSeries } from '@visactor/vchart';
import type { Datum, ISeriesConstructor, SeriesTypeEnum } from '@visactor/vchart';
export class StripSeries extends ScatterSeries {
  static readonly type: string = 'statplotsStrip';
  readonly type = StripSeries.type as SeriesTypeEnum;
  dataToPositionX(datum: Datum): number {
    return super.dataToPositionX(datum) + this.getXAxisHelper().getBandwidth!(this.fieldX.length - 1)! * datum.__offset;
  }
}
export function registerStripSeries(): void {
  registerScatterSeries();
  Factory.registerSeries(StripSeries.type, StripSeries as unknown as ISeriesConstructor);
}
