import {
  type ISeriesTooltipHelper,
  type ITooltipLinePattern,
  type TooltipActiveType,
  BaseSeriesTooltipHelper
} from '@visactor/vchart';
import { TimeUtil } from '@visactor/vutils';

export class LinkSeriesTooltipHelper extends BaseSeriesTooltipHelper implements ISeriesTooltipHelper {
  protected enableByType(activeType: TooltipActiveType): boolean {
    return activeType === 'mark';
  }

  protected getDefaultTitlePattern(activeType: TooltipActiveType): ITooltipLinePattern {
    return {
      key: 'link info',
      value: 'link info'
    };
  }

  shapeTypeCallback = () => {
    return 'square';
  };

  protected getDefaultContentList(): ITooltipLinePattern[] {
    return [
      {
        key: 'time',
        value: (datum: any) => TimeUtil.getInstance().timeFormat('%Y%m%d %H:%M', datum.from.split('_')[1])
      },
      {
        key: 'type',
        value: (datum: any) => datum.action_type
      },
      {
        key: 'from',
        value: (datum: any) => datum.from
      },
      {
        key: 'to',
        value: (datum: any) => datum.to
      }
    ];
  }
}
