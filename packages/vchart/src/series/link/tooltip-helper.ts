import type { ISeriesTooltipHelper } from '../interface';
import { BaseSeriesTooltipHelper } from '../base/tooltip-helper';
import type { ITooltipPattern, TooltipActiveType } from '../../typings';
import { TimeUtil } from '@visactor/vutils';

export class LinkSeriesTooltipHelper extends BaseSeriesTooltipHelper implements ISeriesTooltipHelper {
  /** 获取默认的tooltip pattern */
  getDefaultTooltipPattern(activeType: TooltipActiveType): ITooltipPattern | null {
    if (activeType === 'mark') {
      return {
        visible: true,
        activeType,
        title: {
          key: 'link info',
          value: 'link info'
        },
        content: [
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
        ].map(entry => {
          return {
            hasShape: true,
            shapeType: 'square',
            shapeColor: this.shapeColorCallback,
            shapeStroke: this.shapeStrokeCallback,
            ...entry
          };
        })
      };
    }
    return null;
  }
}
