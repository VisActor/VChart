import { AreaSeries, Factory, AttributeLevel, registerAreaSeries } from '@visactor/vchart';
import type { Datum, IAreaSeriesSpec, ISeriesConstructor, SeriesTypeEnum } from '@visactor/vchart';

/** 复用 area 的数据、状态与生命周期，只替换密度到分类带宽的映射。 */
export class ViolinSeries extends AreaSeries<IAreaSeriesSpec> {
  static readonly type: string = 'statplotsViolin';
  readonly type = ViolinSeries.type as SeriesTypeEnum;

  initMark(): void {
    super.initMark();
    this._areaMark.setGroupKey('__violinGroup');
  }

  initAreaMarkStyle(): void {
    super.initAreaMarkStyle();
    const offset = (datum: Datum) => {
      const depth = this.fieldX.length - 1;
      return this.getXAxisHelper().getBandwidth!(depth)! * 0.42 * datum.__densityWidth;
    };
    this.setMarkStyle(
      this._areaMark,
      {
        x: (datum: Datum) => this.dataToPositionX(datum) - offset(datum),
        x1: (datum: Datum) => this.dataToPositionX(datum) + offset(datum),
        y: this.dataToPositionY.bind(this),
        y1: this.dataToPositionY.bind(this),
        curveType: 'linear'
      },
      'normal',
      AttributeLevel.Series
    );
  }

  protected initTooltip(): void {
    super.initTooltip();
    this._tooltipHelper!.activeTriggerSet!.mark!.add(this._areaMark);
  }
}

export function registerViolinSeries(): void {
  registerAreaSeries();
  // VChart 在非 strictNullChecks 下发布扩展构造器，此处保留已验证的系列契约。
  Factory.registerSeries(ViolinSeries.type, ViolinSeries as unknown as ISeriesConstructor);
}
