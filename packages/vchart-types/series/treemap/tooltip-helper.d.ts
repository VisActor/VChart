import { BaseSeriesTooltipHelper } from '../base/tooltip-helper';
export declare class TreemapTooltipHelper extends BaseSeriesTooltipHelper {
  get defaultShapeType(): string;
  contentKeyCallback: (datum: any) => any;
}
