import type { IModelOption } from '../../model/interface';
import { type IOrientType } from '../../typings';
import type { ComponentTypeEnum } from '../interface';
export interface IDataFilterWithNewDomainOption {
    getNewDomain: () => any[];
    isContinuous: () => boolean;
    field: () => string;
}
export declare const dataFilterWithNewDomain: (data: Array<any>, op: IDataFilterWithNewDomainOption) => any[];
export interface IDataFilterComputeDomainOption {
    input: {
        dataCollection: any[];
        stateFields: string[];
        valueFields: string[];
        method: 'sum';
    };
    output: {
        stateField: string;
        valueField: string;
    };
}
export declare const dataFilterComputeDomain: (data: Array<any>, op: IDataFilterComputeDomainOption) => any[];
export declare const getDataFilterTheme: (orient: IOrientType, type: ComponentTypeEnum, option: Partial<IModelOption>) => any;
