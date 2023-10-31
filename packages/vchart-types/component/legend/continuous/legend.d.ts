import { DataView } from '@visactor/vdataset';
import type { IModelInitOption, ILayoutRect } from '../../../model/interface';
import type { IComponentOption } from '../../interface';
import { ComponentTypeEnum } from '../../interface';
import type { ILegend } from '../interface';
import type { IColorLegendSpec, IColorLegendTheme, ISizeLegendSpec } from './interface';
import { BaseLegend } from '../base-legend';
export declare class ContinuousLegend<
  T extends IColorLegendSpec | ISizeLegendSpec = IColorLegendSpec | ISizeLegendSpec
> extends BaseLegend<T> {
  static type: ComponentTypeEnum;
  type: ComponentTypeEnum;
  name: string;
  protected _theme: IColorLegendTheme;
  private _field;
  private _legendType;
  static createComponent(spec: any, options: IComponentOption): ContinuousLegend<any> | ILegend[];
  constructor(spec: T, options: IComponentOption);
  setAttrFromSpec(): void;
  init(option: IModelInitOption): void;
  private _getScaleInGlobal;
  protected _initLegendData(): DataView;
  protected _initSelectedData(): void;
  private _addDefaultTitleText;
  protected _getLegendAttributes(rect: ILayoutRect): any;
  protected _getLegendConstructor(): any;
  protected _initEvent(): void;
}
export declare const registerContinuousLegend: () => void;
