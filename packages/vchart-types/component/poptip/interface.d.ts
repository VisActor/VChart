import type { PopTipAttributes } from '@visactor/vrender-components';
import type { IColorKey } from '../../theme/color-scheme/interface';
export interface IPoptipTheme extends Omit<PopTipAttributes, 'titleStyle' | 'contentStyle' | 'panel'> {
  titleStyle?: Partial<Omit<PopTipAttributes['titleStyle'], 'fill'>> & {
    fill?: PopTipAttributes['titleStyle']['fill'] | IColorKey;
  };
  contentStyle?: Partial<Omit<PopTipAttributes['contentStyle'], 'fill'>> & {
    fill?: PopTipAttributes['contentStyle']['fill'] | IColorKey;
  };
  panel?: Partial<Omit<PopTipAttributes['panel'], 'fill' | 'stroke' | 'shadowColor'>> & {
    fill?: PopTipAttributes['panel']['fill'] | IColorKey;
    stroke?: PopTipAttributes['panel']['stroke'] | IColorKey;
    shadowColor?: PopTipAttributes['panel']['shadowColor'] | IColorKey;
  };
}
