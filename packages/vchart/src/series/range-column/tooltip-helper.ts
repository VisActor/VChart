import type { ISeriesTooltipHelper } from '../interface';
import { BaseSeriesTooltipHelper } from '../base/tooltip-helper';
import type { Datum, ITooltipPattern, TooltipActiveType } from '../../typings';
// eslint-disable-next-line no-duplicate-imports
import { Direction } from '../../typings';

export class RangeColumnSeriesTooltipHelper extends BaseSeriesTooltipHelper implements ISeriesTooltipHelper {
  /** 获取默认的tooltip pattern */
  getDefaultTooltipPattern(activeType: TooltipActiveType): ITooltipPattern | null {
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
          value: (datum: Datum) =>
            this.series.getSpec().direction === Direction.horizontal
              ? datum[this.series.getSpec().xField[0]] + '-' + datum[this.series.getSpec().xField[1]]
              : datum[this.series.getSpec().yField[0]] + '-' + datum[this.series.getSpec().yField[1]],
          hasShape: true,
          shapeType: this.contentShapeTypeCallback,
          shapeColor: this.contentShapeColorCallback,
          shapeHollow: false
        }
      ]
    };
  }
}
