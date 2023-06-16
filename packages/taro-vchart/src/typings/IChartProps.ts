import { CSSProperties } from 'react';
import { IOptions } from './IOptions';
import { IVChart, ISpec } from './IVChart';
import { IEvent } from './IEvent';

interface IChartProps {
  /**
   * 图表 id, 必确唯一
   */
  canvasId: string;
  /**
   * VChart 图表配置项
   */
  spec: ISpec;
  /**
   * 图表容器样式
   */
  style?: CSSProperties;
  /**
   * 初始化 VChart 实例传入的额外配置项，同 VChart 实例化配置项
   */
  options?: IOptions;
  /**
   * 事件绑定配置
   */
  events?: IEvent[];
  /**
   * 图表渲染完毕后触发的回调
   * @param chart
   * @returns
   */
  onChartReady?: (chart: IVChart) => void;
  /**
   * 图表初始化完后触发的回调
   * @param chart
   * @returns
   */
  onChartInit?: (chart: IVChart) => void;
  /**
   * 图表更新完毕后触发的回调
   * @param chart
   * @returns
   */
  onChartUpdate?: (chart: IVChart) => void;
}

export { IChartProps };
