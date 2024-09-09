import type { ISeriesTooltipHelper } from '../interface';
import { BaseSeriesTooltipHelper } from '../base/tooltip-helper';
import type { ITooltipLinePattern, ITooltipPattern, TooltipActiveType } from '../../typings';
import { TimeUtil } from '@visactor/vutils';

export class DotSeriesTooltipHelper extends BaseSeriesTooltipHelper implements ISeriesTooltipHelper {
  /** 获取默认的tooltip pattern */
  getDefaultTooltipPattern(activeType: TooltipActiveType): ITooltipPattern | null {
    if (activeType === 'mark') {
      return {
        visible: true,
        activeType,
        title: {
          key: 'event info',
          value: 'event info'
        },
        content: [
          {
            key: (datum: any) => datum.type,
            value: (datum: any) => datum.id
          },
          {
            key: 'event_time',
            value: (datum: any) => TimeUtil.getInstance().timeFormat('%Y%m%d', datum.event_time)
          },
          {
            key: 'action_type',
            value: (datum: any) => datum.action_type
          },
          {
            key: 'children',
            value: (datum: any) => {
              return datum.children;
            }
          }
        ].map(entry => {
          return {
            hasShape: true,
            shapeType: 'square',
            shapeColor: this.shapeColorCallback,
            shapeStroke: this.shapeStrokeCallback,
            ...entry
          };
        }),
        updateContent: (prev: any, datum: any, params: any) => {
          const childrenContent: ITooltipLinePattern[] = [];
          const childrenPrev = prev.filter((p: any) => p.key === 'children');

          childrenPrev.length > 0 &&
            childrenPrev[0].value.forEach((element: any) => {
              let flag = true;
              for (const key in element) {
                childrenContent.push({
                  shapeType: 'circle',
                  hasShape: flag,
                  shapeColor: this.shapeColorCallback(datum[0].datum[0]),
                  shapeStroke: this.shapeStrokeCallback(datum[0].datum[0]),
                  key: key,
                  value: element[key] + ''
                } as ITooltipLinePattern);
                flag = false;
              }
            });
          return prev.concat(childrenContent);
        }
      };
    }
    return null;
  }
}
