import type { IMarkLine, IMarkLineSpec, IMarkLineTheme } from './interface';
import type { IComponentOption } from '../../interface';
import { ComponentTypeEnum } from '../../interface/type';
import { MarkLine as MarkLineComponent } from '@visactor/vrender-components';
import { BaseMarker } from '../base-marker';
export declare class MarkLine extends BaseMarker<IMarkLineSpec & IMarkLineTheme> implements IMarkLine {
    static type: ComponentTypeEnum;
    type: ComponentTypeEnum;
    name: string;
    layoutZIndex: number;
    protected _theme: IMarkLineTheme;
    protected _markerComponent: MarkLineComponent;
    static createComponent(spec: any, options: IComponentOption): MarkLine | MarkLine[];
    protected _createMarkerComponent(): void;
    protected _markerLayout(): void;
    protected _initDataView(): void;
}
export declare const registerMarkLine: () => void;
