import type { ITooltipActiveTypeAsKeys, ITooltipSpec } from '../component/tooltip/interface';
import type { TooltipActiveType } from '../typings';
import type { IModel } from './interface';
import type { IMark } from '../mark/interface';

export type TooltipTrigger = IModel | IMark;

export interface ITooltipHelper {
  /** tooltip对应spec */
  spec: ITooltipSpec | undefined;

  /** 实际生效的tooltip activeType */
  activeType: TooltipActiveType[];

  /** 可以响应mark tooltip或者dimension tooltip的对象 */
  activeTriggerSet: ITooltipActiveTypeAsKeys<Set<TooltipTrigger>, Set<TooltipTrigger>, Set<TooltipTrigger>>;
  /** 不响应tooltip且不会影响已有tooltip的对象 */
  ignoreTriggerSet: ITooltipActiveTypeAsKeys<Set<TooltipTrigger>, Set<TooltipTrigger>, Set<TooltipTrigger>>;

  /** 更新spec */
  updateTooltipSpec: () => void;
}

export abstract class BaseTooltipHelper implements ITooltipHelper {
  spec: ITooltipSpec | undefined;
  activeType: TooltipActiveType[];

  activeTriggerSet = {
    mark: new Set<TooltipTrigger>(),
    dimension: new Set<TooltipTrigger>(),
    group: new Set<TooltipTrigger>()
  };
  ignoreTriggerSet = {
    mark: new Set<TooltipTrigger>(),
    dimension: new Set<TooltipTrigger>(),
    group: new Set<TooltipTrigger>()
  };

  abstract updateTooltipSpec(): void;
}
