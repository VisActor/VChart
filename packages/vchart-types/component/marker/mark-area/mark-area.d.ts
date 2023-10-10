import type { IMarkArea, IMarkAreaSpec, IMarkAreaTheme } from './interface';
import type { IComponentOption } from '../../interface';
import { ComponentTypeEnum } from '../../interface';
import { MarkArea as MarkAreaComponent } from '@visactor/vrender-components';
import { BaseMarker } from '../base-marker';
import type { LayoutItem } from '../../../model/layout-item';
export declare class MarkArea extends BaseMarker<IMarkAreaSpec & IMarkAreaTheme> implements IMarkArea {
  static type: ComponentTypeEnum;
  type: ComponentTypeEnum;
  name: string;
  layoutZIndex: LayoutItem['layoutZIndex'];
  static speckey: string;
  protected _theme: IMarkAreaTheme;
  protected _markerComponent: MarkAreaComponent;
  static createComponent(spec: any, options: IComponentOption): MarkArea | MarkArea[];
  protected _createMarkerComponent(): void;
  protected _markerLayout(): void;
  protected _initDataView(): void;
}
