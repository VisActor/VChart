import type { ISeriesTooltipHelper } from '../interface';
import { BaseSeriesTooltipHelper } from '../base/tooltip-helper';
import type { Datum, ITooltipPattern, TooltipActiveType } from '../../typings';
import type { LiquidSeries } from './liquid';

export class LiquidSeriesTooltipHelper extends BaseSeriesTooltipHelper implements ISeriesTooltipHelper {
  /** 获取默认的tooltip pattern */
  getDefaultTooltipPattern(activeType: TooltipActiveType): ITooltipPattern | null {
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
          key: this.getContentKey(),
          value: this.getContentValue(),
          hasShape: true,
          shapeType: this.shapeTypeCallback,
          shapeColor: this.getLiquidFillColor,
          shapeStroke: this.getLiquidFillColor,
          shapeHollow: false
        }
      ]
    };
  }
  getContentKey = () => (datum: any) => {
    return (this.series as LiquidSeries).getValueField();
  };

  getContentValue = () => (datum: any) => {
    const valueField = (this.series as LiquidSeries).getValueField();
    return datum[valueField];
  };

  getLiquidFillColor = (datum: Datum) => {
    return this.series.getMarkInName('liquid').getAttribute('fill', datum) as any;
  };
}
