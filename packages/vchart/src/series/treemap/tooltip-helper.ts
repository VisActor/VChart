import { BaseSeriesTooltipHelper } from '../base/tooltip-helper';

export class TreemapTooltipHelper extends BaseSeriesTooltipHelper {
  get defaultShapeType(): string {
    return 'square';
  }

  contentKeyCallback = (datum: any) => {
    return datum?.[this.series.getDimensionField()[0]];
  };
}
