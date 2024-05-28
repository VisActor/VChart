import type { ILayoutRect, IPoint, IPolarOrientType } from '../../../../typings';
import type { IBandAxisSpec, IDomainLine, ILinearAxisSpec, ITitle, ILabel, ICommonAxisSpec } from '../../interface';
import type { IPolarGrid } from './common';
export type IPolarAxisSpec = IPolarLinearAxisSpec | IPolarBandAxisSpec;
export type IPolarAxisCommonSpec = Omit<ICommonAxisSpec, 'center'> & {
    layoutRadius?: 'auto' | number | ((layoutRect: ILayoutRect, center: IPoint) => number);
    inside?: boolean;
    orient: IPolarOrientType;
    grid?: IPolarGrid;
    radius?: number;
    subGrid?: IPolarGrid;
    domainLine?: IDomainLine;
    label?: ILabel;
    title?: ITitle;
    innerRadius?: number;
    outerRadius?: number;
    center?: {
        x: number | string;
        y: number | string;
    };
    startAngle?: number;
    endAngle?: number;
};
export type IPolarLinearAxisSpec = IPolarAxisCommonSpec & ILinearAxisSpec;
export type IPolarBandAxisSpec = IPolarAxisCommonSpec & IBandAxisSpec;
