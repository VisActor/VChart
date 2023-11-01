import type { ISeriesTooltipHelper } from '../interface';
import { BaseSeriesTooltipHelper } from '../base/tooltip-helper';
import type { IToolTipLinePattern, ITooltipPattern, TooltipActiveType } from '../../typings';
import { TimeUtil } from '../../component/axis/cartesian/util/time';
import { isValid } from '@visactor/vutils';

export class DotSeriesTooltipHelper extends BaseSeriesTooltipHelper implements ISeriesTooltipHelper {
  updateTooltipSpec() {
    super.updateTooltipSpec();
    if (isValid(this.spec?.mark)) {
      this.spec!.mark.updateContent = (prev: any, datum: any, params: any) => {
        const childrenContent: IToolTipLinePattern[] = [];
        const childrenPrev = prev.filter((p: any) => p.key === 'children');
        childrenPrev.length > 0 &&
          childrenPrev[0].value.forEach((element: any) => {
            let flag = true;
            for (const key in element) {
              childrenContent.push({
                shapeType: 'circle',
                hasShape: flag,
                shapeColor: this.contentShapeColorCallback(datum[0].datum[0]),
                shapeStroke: this.contentShapeColorCallback(datum[0].datum[0]),
                key: key,
                value: element[key] + ''
              });
              flag = false;
            }
          });
        return prev.concat(childrenContent);
      };
    }
  }

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
            hasShape: true,
            shapeType: 'square',
            shapeColor: this.contentShapeColorCallback,
            shapeStroke: this.contentShapeColorCallback,
            key: (datum: any) => datum.type,
            value: (datum: any) => datum.id
          },
          {
            hasShape: true,
            shapeType: 'square',
            shapeColor: this.contentShapeColorCallback,
            shapeStroke: this.contentShapeColorCallback,
            key: 'event_time',
            value: (datum: any) => TimeUtil.getInstance().timeFormat('%Y%m%d', datum.event_time)
          },
          {
            hasShape: true,
            shapeType: 'square',
            shapeColor: this.contentShapeColorCallback,
            shapeStroke: this.contentShapeColorCallback,
            key: 'action_type',
            value: (datum: any) => datum.action_type
          },
          {
            shapeType: 'square',
            hasShape: true,
            shapeColor: this.contentShapeColorCallback,
            shapeStroke: this.contentShapeColorCallback,
            key: 'children',
            value: (datum: any) => {
              return datum.children;
            }
          }
        ],
        updateContent: (prev: any, datum: any, params: any) => {
          const childrenContent: IToolTipLinePattern[] = [];
          prev[3].value.forEach((element: any) => {
            let flag = true;
            for (const key in element) {
              childrenContent.push({
                shapeType: 'circle',
                hasShape: flag,
                shapeColor: this.contentShapeColorCallback(datum[0].datum[0]),
                shapeStroke: this.contentShapeColorCallback(datum[0].datum[0]),
                key: key,
                value: element[key] + ''
              } as IToolTipLinePattern);
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
