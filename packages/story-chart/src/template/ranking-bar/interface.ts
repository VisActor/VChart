import { ILineGraphicAttribute, ITextGraphicAttribute } from '@visactor/vrender-core';
import { IPlayConfig } from 'src/interface/type';

export type IRankingBarData = any[];

export interface IRankingBarSpec extends IPlayConfig {
  data: IRankingBarData;

  timeField: string;
  xField: string;
  yField: string;

  topN?: number;

  bar?: {
    padding?: number;
    cornerRadius?: number;
  };

  color?: Record<string, string>;

  icon?: Record<string, string>;

  background?: string;

  label?: ITextGraphicAttribute;

  timeLabel?: ITextGraphicAttribute;

  xAxis?: {
    label?: ITextGraphicAttribute;
    domainLine?: ILineGraphicAttribute;
    grid?: ILineGraphicAttribute;
  };

  yAxis?: {
    label?: ITextGraphicAttribute;
    domainLine?: ILineGraphicAttribute;
    grid?: ILineGraphicAttribute;
  };

  title?: ITextGraphicAttribute;
  subTitle?: ITextGraphicAttribute;
}
