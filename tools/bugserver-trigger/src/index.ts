import VChart from '@visactor/vchart';
import * as VChartExtensions from '@visactor/vchart-extension';

(VChart as any).VChartExtensions = VChartExtensions;
export default VChart;
