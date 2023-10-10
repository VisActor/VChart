import type { IChartConstructor, IChartOption, IChart } from '../chart/interface';
import type { ISeriesConstructor, ISeriesOption } from '../series/interface';
import type { IComponentConstructor } from '../component/interface';
import type { IMarkOption, MarkConstructor } from '../mark/interface';
import type { IRegion, IRegionConstructor } from '../region/interface';
import type { IModelOption } from '../model/interface';
import type { Transform, Parser } from '@visactor/vdataset';
import type { ILayoutConstructor } from '../layout/interface';
export declare class Factory {
  private static _charts;
  private static _series;
  private static _components;
  private static _marks;
  private static _regions;
  static transforms: {
    [key: string]: Transform;
  };
  static dataParser: {
    [key: string]: Parser;
  };
  static _layout: {
    [key: string]: ILayoutConstructor;
  };
  static registerChart(key: string, chart: IChartConstructor): void;
  static registerSeries(key: string, series: ISeriesConstructor): void;
  static registerComponent(key: string, cmp: IComponentConstructor): void;
  static registerMark(key: string, mark: MarkConstructor): void;
  static registerRegion(key: string, region: IRegionConstructor): void;
  static registerTransform(key: string, transform: Transform): void;
  static registerLayout(key: string, layout: ILayoutConstructor): void;
  static createChart(chartType: string, spec: any, options: IChartOption): IChart | null;
  static createRegion(regionType: string, spec: any, options: IModelOption): IRegion | null;
  static createSeries(seriesType: string, spec: any, options: ISeriesOption): import('../series/interface').ISeries;
  static createMark(markType: string, name: string, options: IMarkOption): import('../mark/interface').IMark;
  static getComponents(): IComponentConstructor[];
  static getComponentInKey(name: string): IComponentConstructor;
  static getLayout(name: string): ILayoutConstructor;
  static getSeries(type: string): ISeriesConstructor;
}
