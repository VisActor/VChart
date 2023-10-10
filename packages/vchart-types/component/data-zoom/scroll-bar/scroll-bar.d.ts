import type { IComponentOption } from '../../interface';
import { ComponentTypeEnum } from '../../interface';
import { DataFilterBaseComponent } from '../data-filter-base-component';
import type { ScrollBarAttributes } from '@visactor/vrender-components';
import { ScrollBar as ScrollBarComponent } from '@visactor/vrender-components';
import type { IGroup } from '@visactor/vrender-core';
import type { IScrollBarSpec } from './interface';
export declare class ScrollBar<T extends IScrollBarSpec = IScrollBarSpec> extends DataFilterBaseComponent<T> {
  static type: ComponentTypeEnum;
  type: ComponentTypeEnum;
  name: string;
  layoutZIndex: number;
  layoutLevel: number;
  protected _component: ScrollBarComponent;
  static createComponent(spec: any, options: IComponentOption): ScrollBar<any> | ScrollBar<IScrollBarSpec>[];
  constructor(spec: T, options: IComponentOption);
  onLayoutEnd(ctx: any): void;
  protected _updateScaleRange(): void;
  protected _computeWidth(): number;
  protected _computeHeight(): number;
  protected _createOrUpdateComponent(): void;
  protected _handleChange(start: number, end: number, updateComponent?: boolean): void;
  protected _handleDataCollectionChange(): void;
  protected _initEvent(): void;
  protected _initCommonEvent(): void;
  protected _getComponentAttrs(): Partial<ScrollBarAttributes>;
  getVRenderComponents(): IGroup[];
}
