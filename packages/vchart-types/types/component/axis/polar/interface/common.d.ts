import type { IBaseScale } from '@visactor/vscale';
import type { IComponent } from '../../../interface';
import type { IPoint, IPolarOrientType, IPolarPoint } from '../../../../typings';
import type { IGrid } from '../../interface';
import type { ICompilableData } from '../../../../compile/data';
export type IPolarGrid = IGrid & {
    smooth?: boolean;
};
export interface IPolarAxisHelper {
    isContinuous: boolean;
    dataToPosition: (values: any, cfg?: any) => number;
    coordToPoint: (point: IPolarPoint) => IPoint;
    pointToCoord: (point: IPoint) => IPolarPoint;
    center: () => IPoint;
    getScale: (depth?: number) => IBaseScale;
    getBandwidth?: (depth?: number) => number;
    getAxisId: () => number;
}
export interface IPolarAxis extends IComponent {
    startAngle: number;
    endAngle: number;
    getOrient: () => IPolarOrientType;
    getScale: () => IBaseScale;
    setRefAngleAxis: (axes: IPolarAxis) => this;
    tickValues: () => number[];
    getCenter: () => IPoint;
    getOuterRadius: () => number;
    getInnerRadius: () => number;
    dataToPosition: (values: any[]) => number;
    positionToData: (position: IPoint) => any;
    getTickData: () => ICompilableData;
    coordToPoint: (point: IPolarPoint) => IPoint;
    pointToCoord: (point: IPoint) => IPolarPoint;
}
