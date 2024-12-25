import type { IGroupMark } from '@visactor/vgrammar-core';
import type { ICommonSpec } from '../typings';
import { BaseMark } from './base/base-mark';
import type { IComponentMark, IMarkOption } from './interface';
import { MarkTypeEnum } from './interface/type';
export declare class ComponentMark extends BaseMark<ICommonSpec> implements IComponentMark {
    static readonly type = MarkTypeEnum.component;
    type: string;
    private _componentType;
    private _mode;
    constructor(name: string, option: IMarkOption);
    protected _initProduct(group?: string | IGroupMark): void;
}
export declare const registerComponentMark: () => void;
