import * as VChart from '@visactor/vchart';
import * as VChartExtension '@visactor/vchart-extension';


const defaultTheme = VChart.ThemeManager.getCurrentTheme();
const defaultTransformedTheme = VChart.ThemeManager.getCurrentTheme(true);

//  强制设置tooltip不进行动画 
defaultTheme.component.tooltip.transitionDuration = 0;
defaultTransformedTheme.component.tooltip.transitionDuration = 0;

(window as any).VChart = VChart;
(window as any).VChartExtension = VChartExtension;

export default {
  VChart, VChartExtension
};

