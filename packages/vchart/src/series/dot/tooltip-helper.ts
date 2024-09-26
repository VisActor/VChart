import type { ISeriesTooltipHelper } from '../interface';
import { BaseSeriesTooltipHelper } from '../base/tooltip-helper';
import type {
  ITooltipLinePattern,
  ITooltipPattern,
  MaybeArray,
  TooltipActiveType,
  TooltipData,
  TooltipPatternProperty
} from '../../typings';
import { TimeUtil } from '@visactor/vutils';
import type { IDimensionData } from '../../event';

export class DotSeriesTooltipHelper extends BaseSeriesTooltipHelper implements ISeriesTooltipHelper {
  enableByType(activeType: TooltipActiveType): boolean {
    return activeType === 'mark';
  }

  getDefaultTitlePattern(activeType: TooltipActiveType): ITooltipPattern['title'] {
    return {
      key: 'event info',
      value: 'event info'
    };
  }

  shapeTypeCallback = () => {
    return 'square';
  };

  getDefaultContentList(): MaybeArray<TooltipPatternProperty<MaybeArray<ITooltipLinePattern>>> {
    return (data: TooltipData) => {
      const datum = (data as IDimensionData[])?.[0]?.datum?.[0];
      const contents: ITooltipLinePattern[] = [
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
      ];

      if (datum && datum.children) {
        datum.children.forEach((child: any) => {
          let flag = true;
          for (const key in child) {
            contents.push({
              shapeType: 'circle',
              hasShape: flag,
              shapeColor: this.shapeColorCallback(datum),
              shapeStroke: this.shapeStrokeCallback(datum),
              key: key,
              value: child[key] + ''
            } as ITooltipLinePattern);
            flag = false;
          }
        });
      }

      return contents;
    };
  }

  // getTooltipPattern(
  //   activeType: TooltipActiveType,
  //   chartTooltipSpec?: ITooltipSpec,
  //   data?: TooltipData,
  //   params?: TooltipHandlerParams
  // ): ITooltipPattern | null {
  //   const res = super.getTooltipPattern(activeType, chartTooltipSpec, data, params);

  //   if (res) {
  //     res.updateContent = (prev: any, datum: any, params: any) => {
  //       const childrenContent: ITooltipLinePattern[] = [];
  //       const childrenPrev = prev.filter((p: any) => p.key === 'children');

  //       childrenPrev.length > 0 &&
  //         childrenPrev[0].value.forEach((element: any) => {
  //           let flag = true;
  //           for (const key in element) {
  //             childrenContent.push({
  //               shapeType: 'circle',
  //               hasShape: flag,
  //               shapeColor: this.shapeColorCallback(datum[0].datum[0]),
  //               shapeStroke: this.shapeStrokeCallback(datum[0].datum[0]),
  //               key: key,
  //               value: element[key] + ''
  //             } as ITooltipLinePattern);
  //             flag = false;
  //           }
  //         });
  //       return prev.concat(childrenContent);
  //     };
  //   }

  //   return res;
  // }
}
