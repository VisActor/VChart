import { ComponentTypeEnum } from '../../interface/type';
import type { MarkAreaAttrs } from '@visactor/vrender-components';
import { MarkArea as MarkAreaComponent } from '@visactor/vrender-components';
import type { IPoint } from '../../../typings';
import type { IMarkProcessOptions } from '../interface';
import { BaseMarkArea } from './base-mark-area';
export declare class CartesianMarkArea extends BaseMarkArea {
    static type: ComponentTypeEnum;
    type: ComponentTypeEnum;
    name: string;
    static coordinateType: string;
    coordinateType: string;
    protected _newMarkAreaComponent(attr: MarkAreaAttrs): MarkAreaComponent;
    protected _computePointsAttr(): {
        points: IPoint[];
    };
    protected _computeOptions(): IMarkProcessOptions;
}
export declare const registerMarkArea: () => void;
