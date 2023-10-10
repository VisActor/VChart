import { DataView } from '@visactor/vdataset';
import type { IDiscreteLegendSpec, IDiscreteLegendTheme } from './interface';
import type { ISeries } from '../../../series/interface';
import type { IModelInitOption, ILayoutRect } from '../../../model/interface';
import type { IComponentOption } from '../../interface';
import { ComponentTypeEnum } from '../../interface';
import { DiscreteLegend as LegendComponent } from '@visactor/vrender-components';
import type { ILegend } from '../interface';
import { BaseLegend } from '../base-legend';
export declare class DiscreteLegend extends BaseLegend<IDiscreteLegendSpec> {
  static type: ComponentTypeEnum;
  type: ComponentTypeEnum;
  name: string;
  protected _theme: IDiscreteLegendTheme;
  static createComponent(spec: any, options: IComponentOption): DiscreteLegend | ILegend[];
  init(option: IModelInitOption): void;
  protected _initLegendData(): DataView;
  protected _getSeriesLegendField(s: ISeries): string;
  protected _initSelectedData(): void;
  private _addDefaultTitleText;
  protected _getLegendAttributes(rect: ILayoutRect): any;
  protected _getLegendConstructor(): typeof LegendComponent;
  protected _initEvent(): void;
  private _getLegendItems;
}
