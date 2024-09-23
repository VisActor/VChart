import type { ITooltipSpec } from '../component/tooltip/interface';
import type { TooltipActiveType } from '../typings';
import type { IMark } from '../mark/interface';

export interface ITooltipHelper {
  /** tooltip对应spec */
  spec: ITooltipSpec | undefined;

  /** 实际生效的tooltip activeType */
  activeType: TooltipActiveType[];

  /** 可以响应mark tooltip或者dimension tooltip的对象 */
  activeTriggerSet: {
    mark?: Set<IMark>;
    group?: Set<IMark>;
  };
  /** 不响应tooltip且不会影响已有tooltip的对象 */
  ignoreTriggerSet: {
    mark?: Set<IMark>;
  };

  /** 更新spec */
  updateTooltipSpec: () => void;
}

export abstract class BaseTooltipHelper implements ITooltipHelper {
  spec: ITooltipSpec | undefined;
  activeType: TooltipActiveType[];

  activeTriggerSet = {
    mark: new Set<IMark>(),
    group: new Set<IMark>()
  };
  ignoreTriggerSet = {
    mark: new Set<IMark>()
  };

  abstract updateTooltipSpec(): void;
}
