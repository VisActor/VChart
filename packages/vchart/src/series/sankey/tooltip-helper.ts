import type { ISeriesTooltipHelper } from '../interface';
import { BaseSeriesTooltipHelper } from '../base/tooltip-helper';
import type { Datum } from '@visactor/vgrammar';
import type { IToolTipLinePattern, ITooltipPattern, TooltipActiveType } from '../../typings';
import { isNumber } from '@visactor/vutils';
import type { IDimensionInfo } from '../../event/events/dimension/interface';

export class SankeySeriesTooltipHelper extends BaseSeriesTooltipHelper implements ISeriesTooltipHelper {
  /** 获取默认的tooltip pattern */
  getDefaultTooltipPattern(activeType: TooltipActiveType, dimensionInfo?: IDimensionInfo[]): ITooltipPattern | null {
    if (activeType === 'mark') {
      return {
        visible: true,
        activeType,
        title: {
          key: undefined,
          value: (datum: Datum) => {
            if (datum.source) {
              if (isNumber(datum.source)) {
                const seriesKeys = this.series.getSeriesKeys();
                return seriesKeys[datum.source] + ' => ' + seriesKeys[datum.target];
              }
              return datum.source + ' => ' + datum.target;
            }
            return datum.datum[this.series.getSpec().categoryField];
          },
          hasShape: false
        },
        content: [
          {
            key: this.contentKeyCallback,
            value: (datum: Datum) => {
              return datum.value;
            },
            hasShape: true,
            shapeType: this.contentShapeTypeCallback,
            shapeColor: this.contentShapeColorCallback,
            shapeStroke: this.contentShapeColorCallback,
            shapeHollow: false
          }
        ]
      };
    } else if (activeType === 'dimension' && dimensionInfo) {
      const title: IToolTipLinePattern = {
        key: undefined,
        value: this._getDimensionData,
        hasShape: false
      };
      const content: IToolTipLinePattern[] = [];
      dimensionInfo.forEach(({ data }) =>
        data.forEach(({ series }: any) => {
          content.push({
            seriesId: series.id,
            key: this.contentKeyCallback,
            value: this.contentValueCallback,
            hasShape: true,
            shapeType: this.contentShapeTypeCallback,
            shapeColor: this.contentShapeColorCallback,
            shapeStroke: this.contentShapeColorCallback,
            shapeHollow: false
          });
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
