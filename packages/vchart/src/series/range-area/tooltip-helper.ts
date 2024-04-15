import type { ISeriesTooltipHelper } from '../interface';
import { BaseSeriesTooltipHelper } from '../base/tooltip-helper';
import type { Datum, ITooltipPattern, TooltipActiveType, ITooltipLinePattern } from '../../typings';
// eslint-disable-next-line no-duplicate-imports
import { Direction } from '../../typings/space';
import type { IDimensionInfo } from '../../event/events/dimension/interface';

export class RangeAreaSeriesTooltipHelper extends BaseSeriesTooltipHelper implements ISeriesTooltipHelper {
  /** 获取默认的tooltip pattern */
  getDefaultTooltipPattern(activeType: TooltipActiveType, dimensionInfo?: IDimensionInfo[]): ITooltipPattern | null {
    switch (activeType) {
      case 'mark':
      case 'group':
        return {
          visible: true,
          activeType,
          title: {
            key: undefined,
            value: this.dimensionTooltipTitleCallback,
            hasShape: false
          },
          content: [
            {
              key: this.markTooltipKeyCallback,
              value: this.markTooltipValueCallback,
              hasShape: true,
              shapeType: this.shapeTypeCallback,
              shapeColor: this.shapeColorCallback,
              shapeStroke: this.shapeColorCallback,
              shapeHollow: false
            }
          ]
        };
      case 'dimension':
        if (dimensionInfo) {
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
                  key: this.markTooltipKeyCallback,
                  value: (datum: Datum) => {
                    return this.series.getSpec().direction === Direction.horizontal
                      ? datum[this.series.getSpec().xField[0]] + '-' + datum[this.series.getSpec().xField[1]]
                      : datum[this.series.getSpec().yField[0]] + '-' + datum[this.series.getSpec().yField[1]];
                  },
                  hasShape: true,
                  shapeType: this.shapeTypeCallback,
                  shapeColor: this.shapeColorCallback,
                  shapeStroke: this.shapeColorCallback,
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
        break;
    }
    return null;
  }
}
