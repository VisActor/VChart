import React from 'react';
// @ts-ignore
import VChart from '@visactor/vchart/build/es5';
import { IChartProps, IVChart, RenderMode } from '../../typings';

export interface WebChartProps extends IChartProps {
  /**
   * vchart 的环境参数
   */
  mode?: RenderMode;
}

export class WebChart extends React.Component<WebChartProps> {
  private vchart: IVChart;

  constructor(props: IChartProps) {
    super(props);
  }

  componentDidMount() {
    const { onChartInit, onChartReady, mode }: any = this.props;
    this.vchart = new VChart(this.props.spec, {
      dom: `${this.props.canvasId}`,
      mode,
      ...this.props.options
    }) as IVChart;

    onChartInit && onChartInit(this.vchart);

    this.vchart
      .renderAsync()
      .then(() => {
        onChartReady && onChartReady(this.vchart);
      })
      .catch((e: any) => {
        console.error(e);
      });
  }

  componentWillUnmount() {
    if (!this.vchart) return;
    this.vchart && this.vchart.release();
  }

  componentDidUpdate(prevProps: IChartProps) {
    if (!this.vchart) return;

    const { spec, onChartReady } = this.props;

    if (JSON.stringify(prevProps.spec) !== JSON.stringify(spec)) {
      this.vchart.updateSpec(spec, true);
      onChartReady && onChartReady(this.vchart);
    }
  }

  render() {
    const { canvasId, style } = this.props;
    return (
      <div
        style={{
          position: 'relative',
          ...style,
          padding: 0
        }}
        id={`${canvasId}`}
      ></div>
    );
  }
}

export default WebChart;
