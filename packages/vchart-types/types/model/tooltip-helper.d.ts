import type { ITooltipActiveTypeAsKeys, ITooltipSpec } from '../component/tooltip/interface';
import type { TooltipActiveType } from '../typings';
import type { IModel } from './interface';
import type { IMark } from '../mark/interface';
export type TooltipTrigger = IModel | IMark;
export interface ITooltipHelper {
    spec: ITooltipSpec | undefined;
    activeType: TooltipActiveType[];
    activeTriggerSet: ITooltipActiveTypeAsKeys<Set<TooltipTrigger>, Set<TooltipTrigger>, Set<TooltipTrigger>>;
    ignoreTriggerSet: ITooltipActiveTypeAsKeys<Set<TooltipTrigger>, Set<TooltipTrigger>, Set<TooltipTrigger>>;
    updateTooltipSpec: () => void;
}
export declare abstract class BaseTooltipHelper implements ITooltipHelper {
    spec: ITooltipSpec | undefined;
    activeType: TooltipActiveType[];
    activeTriggerSet: {
        mark: Set<TooltipTrigger>;
        dimension: Set<TooltipTrigger>;
        group: Set<TooltipTrigger>;
    };
    ignoreTriggerSet: {
        mark: Set<TooltipTrigger>;
        dimension: Set<TooltipTrigger>;
        group: Set<TooltipTrigger>;
    };
    abstract updateTooltipSpec(): void;
}
