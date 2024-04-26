import { TemplateChartType } from './constant';
import { isTotalTag as isWaterfallTotalTag } from './templates/waterfall';

export * from './templates/base-temp';
export * from './interface';

export { BarTemp } from './templates/bar';
export { DualAxisTemp } from './templates/dual-axis';
export { BarGroupTemp } from './templates/bar-group';
export { BarPercentTemp } from './templates/bar-percent';
export { HorizontalBarTemp } from './templates/horizontal-bar';
export { HorizontalBarGroupTemp } from './templates/horizontal-bar-group';
export { HorizontalBarPercentTemp } from './templates/horizontal-bar-percent';
export { AreaTemp } from './templates/area';
export { AreaPercentTemp } from './templates/area-percent';
export { LineTemp } from './templates/line';
export { PieTemp } from './templates/pie';
export { WaterfallTemp } from './templates/waterfall';

export const chartTempValueCheckMap: {
  [key: string]: (v: any) => boolean;
} = {
  [TemplateChartType.waterfall]: isWaterfallTotalTag
};
