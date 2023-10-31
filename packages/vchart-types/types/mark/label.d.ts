import type { IComponentMark } from './component';
import type { IMark } from './interface/common';
import { MarkTypeEnum } from './interface/type';
import { TextMark } from './text';
export declare class LabelMark extends TextMark implements ILabelMark {
    static readonly type = MarkTypeEnum.text;
    static readonly constructorType = MarkTypeEnum.label;
    skipEncode: boolean;
    private _rule;
    getRule(): string;
    setRule(rule: string): void;
    private _target;
    getTarget(): IMark;
    setTarget(target: IMark): void;
    private _component;
    getComponent(): IMark;
    setComponent(component: IMark): void;
}
export interface ILabelMark extends IMark {
    skipEncode: boolean;
    getRule: () => string;
    setRule: (rule: string) => void;
    getTarget: () => IMark;
    setTarget: (target: IMark) => void;
    getComponent: () => IComponentMark;
    setComponent: (component: IComponentMark) => void;
}
