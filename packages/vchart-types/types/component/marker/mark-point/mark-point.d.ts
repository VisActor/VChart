import type { IMarkPoint, IMarkPointSpec, IMarkPointTheme } from './interface';
import type { IComponentOption } from '../../interface';
import { ComponentTypeEnum } from '../../interface/type';
import { MarkPoint as MarkPointComponent } from '@visactor/vrender-components';
import { BaseMarker } from '../base-marker';
import type { IGroup } from '@visactor/vrender-core';
export declare class MarkPoint extends BaseMarker<IMarkPointSpec> implements IMarkPoint {
    static type: ComponentTypeEnum;
    type: ComponentTypeEnum;
    name: string;
    layoutZIndex: number;
    protected _theme: IMarkPointTheme;
    protected _markerComponent: MarkPointComponent;
    static createComponent(spec: any, options: IComponentOption): MarkPoint | MarkPoint[];
    protected _createMarkerComponent(): IGroup;
    protected _markerLayout(): void;
    protected _initDataView(): void;
}
export declare const registerMarkPoint: () => void;
