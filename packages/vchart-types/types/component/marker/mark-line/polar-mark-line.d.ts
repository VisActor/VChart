import { ComponentTypeEnum } from '../../interface/type';
import type { MarkArcLineAttrs, MarkLineAttrs } from '@visactor/vrender-components';
import { MarkArcLine as MarkArcLineComponent, MarkLine as MarkLineComponent } from '@visactor/vrender-components';
import type { IPoint } from '../../../typings';
import { BaseMarkLine } from './base-mark-line';
export declare class PolarMarkLine extends BaseMarkLine {
    static type: ComponentTypeEnum;
    type: ComponentTypeEnum;
    name: string;
    static coordinateType: string;
    coordinateType: string;
    protected _markerComponent: MarkArcLineComponent;
    protected _newMarkLineComponent(attr: MarkArcLineAttrs | MarkLineAttrs): MarkArcLineComponent | MarkLineComponent;
    protected _computePointsAttr(): {
        points?: IPoint[];
        radius?: number;
        startAngle?: number;
        endAngle?: number;
        center?: IPoint;
    };
    protected _computeOptions(): any;
}
export declare const registerPolarMarkLine: () => void;
