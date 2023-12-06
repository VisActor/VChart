import type { IMarkArea, IMarkAreaSpec, IMarkAreaTheme } from './interface';
import type { IComponentOption } from '../../interface';
import { ComponentTypeEnum } from '../../interface/type';
import { MarkArea as MarkAreaComponent } from '@visactor/vrender-components';
import { BaseMarker } from '../base-marker';
import type { IGroup } from '@visactor/vrender-core';
export declare class MarkArea extends BaseMarker<IMarkAreaSpec> implements IMarkArea {
    static type: ComponentTypeEnum;
    type: ComponentTypeEnum;
    name: string;
    layoutZIndex: number;
    protected _theme: IMarkAreaTheme;
    protected _markerComponent: MarkAreaComponent;
    static createComponent(spec: any, options: IComponentOption): MarkArea | MarkArea[];
    protected _createMarkerComponent(): IGroup;
    protected _markerLayout(): void;
    protected _initDataView(): void;
}
export declare const registerMarkArea: () => void;
