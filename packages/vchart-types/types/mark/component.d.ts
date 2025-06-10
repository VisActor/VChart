import type { ICommonSpec } from '../typings';
import { BaseMark } from './base/base-mark';
import type { IComponentMark, IMarkOption, IMarkStyle } from './interface';
import { MarkTypeEnum } from './interface/type';
import type { IGraphic, IGroupGraphicAttribute } from '@visactor/vrender-core';
export declare class ComponentMark extends BaseMark<ICommonSpec> implements IComponentMark {
    static readonly type = MarkTypeEnum.component;
    type: string;
    private _componentType;
    private _component;
    private _mode;
    constructor(name: string, option: IMarkOption);
    protected _getDefaultStyle(): IMarkStyle<ICommonSpec>;
    getComponent(): IGraphic<Partial<import("@visactor/vrender-core").IGraphicAttribute>>;
    clearComponent(): void;
    protected _getAttrsFromConfig(attrs?: IGroupGraphicAttribute): IGroupGraphicAttribute;
    protected _attributesTransform: (attrs: any) => any;
    setAttributeTransform(t: (attrs: any) => any): void;
    renderInner(): void;
    release(): void;
}
export declare const registerComponentMark: () => void;
