import type { ISeriesTooltipHelper } from '../interface';
import { BaseSeriesTooltipHelper } from '../base/tooltip-helper';
import type { Datum, ITooltipPattern, TooltipActiveType, ITooltipLinePattern } from '../../typings';
// eslint-disable-next-line no-duplicate-imports
import { Direction } from '../../typings/space';
import type { IDimensionInfo } from '../../event/events/dimension/interface';

export class RangeAreaSeriesTooltipHelper extends BaseSeriesTooltipHelper implements ISeriesTooltipHelper {
  /** 获取默认的tooltip pattern */
  getDefaultTooltipPattern(activeType: TooltipActiveType, dimensionInfo?: IDimensionInfo[]): ITooltipPattern | null {
    if (activeType === 'mark') {
      return {
        visible: true,
        activeType,
        title: {
          key: undefined,
          value: this.titleValueCallback,
          hasShape: false
        },
        content: [
          {
            key: this.contentKeyCallback,
            value: this.contentValueCallback,
            hasShape: true,
            shapeType: this.contentShapeTypeCallback,
            shapeColor: this.contentShapeColorCallback,
            shapeStroke: this.contentShapeColorCallback,
            shapeHollow: false
          }
        ]
      };
    } else if (activeType === 'dimension' && dimensionInfo) {
      const title: ITooltipLinePattern = {
        key: undefined,
        value: this._getDimensionData,
        hasShape: false
      };
      const content: ITooltipLinePattern[] = [];
      dimensionInfo.forEach(({ data }) =>
        data.forEach(({ series }: any) => {
          if (series.type === 'rangeArea') {
            content.push({
              seriesId: series.id,
              key: this.contentKeyCallback,
              value: (datum: Datum) => {
                return this.series.getSpec().direction === Direction.horizontal
                  ? datum[this.series.getSpec().xField[0]] + '-' + datum[this.series.getSpec().xField[1]]
                  : datum[this.series.getSpec().yField[0]] + '-' + datum[this.series.getSpec().yField[1]];
              },
              hasShape: true,
              shapeType: this.contentShapeTypeCallback,
              shapeColor: this.contentShapeColorCallback,
              shapeStroke: this.contentShapeColorCallback,
              shapeHollow: false
            });
          }
        })
      );
      return {
        visible: true,
        activeType,
        title,
        content
      };
    }
    return null;
  }
}
