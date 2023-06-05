import type { IChartConstructor, IChartOption, IChart } from '../chart/interface';
import type { ISeriesConstructor, ISeriesOption } from '../series/interface';
import type { IComponentConstructor } from '../component/interface';
import type { IMarkConstructor, IMarkOption, MarkConstructor } from '../mark/interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from '../mark/interface';
import type { IRegion, IRegionConstructor } from '../region/interface';
import type { IModelOption } from '../model/interface';
import type { Transform, Parser } from '@visactor/vdataset';
import { fields, filter, simplify, fold, csvParser, dsvParser, tsvParser } from '@visactor/vdataset';
import type { ILayoutConstructor } from '../layout/interface';

export class Factory {
  private static _charts: { [key: string]: IChartConstructor } = {};
  private static _series: { [key: string]: ISeriesConstructor } = {};
  private static _components: { [key: string]: IComponentConstructor } = {};
  private static _marks: { [key: string]: MarkConstructor } = {};
  private static _regions: { [key: string]: IRegionConstructor } = {};
  static transforms: { [key: string]: Transform } = {
    // buildIn transforms
    simplify: simplify,
    fields: fields,
    filter: filter,
    fold: fold
  };
  static dataParser: { [key: string]: Parser } = {
    // buildIn parser
    csv: csvParser,
    dsv: dsvParser,
    tsv: tsvParser
  };
  static _layout: { [key: string]: ILayoutConstructor } = {};

  static registerChart(key: string, chart: IChartConstructor) {
    Factory._charts[key] = chart;
  }
  static registerSeries(key: string, series: ISeriesConstructor) {
    Factory._series[key] = series;
  }
  static registerComponent(key: string, cmp: IComponentConstructor) {
    Factory._components[key] = cmp;
  }
  static registerMark(key: string, mark: MarkConstructor) {
    Factory._marks[key] = mark;
  }
  static registerRegion(key: string, region: IRegionConstructor) {
    Factory._regions[key] = region;
  }
  static registerTransform(key: string, transform: Transform) {
    Factory.transforms[key] = transform;
  }
  static registerLayout(key: string, layout: ILayoutConstructor) {
    Factory._layout[key] = layout;
  }

  static createChart(chartType: string, spec: any, options: IChartOption): IChart | null {
    if (!Factory._charts[chartType]) {
      return null;
    }
    const ChartConstructor = Factory._charts[chartType];
    return new ChartConstructor(spec, options);
  }

  static createRegion(regionType: string, spec: any, options: IModelOption): IRegion | null {
    if (!Factory._regions[regionType]) {
      return null;
    }
    const RegionConstructor = Factory._regions[regionType];
    return new RegionConstructor(spec, options);
  }

  static createSeries(seriesType: string, spec: any, options: ISeriesOption) {
    if (!Factory._series[seriesType]) {
      return null;
    }
    const SeriesConstructor = Factory._series[seriesType];
    return new SeriesConstructor(spec, options);
  }

  static createMark(markType: string, name: string, options: IMarkOption) {
    if (!Factory._marks[markType]) {
      return null;
    }
    const MarkConstructor = Factory._marks[markType] as IMarkConstructor;
    const markInstance = new MarkConstructor(name, options);
    if (markInstance.type === MarkTypeEnum.group) {
      // group 目前关闭交互，不参与事件拾取
      markInstance.setInteractive(false);
    }
    return markInstance;
  }

  static getComponents() {
    return Object.values(Factory._components);
  }

  static getComponentInKey(name: string) {
    return Factory._components[name];
  }

  static getLayout(name: string) {
    return Factory._layout[name];
  }
}
