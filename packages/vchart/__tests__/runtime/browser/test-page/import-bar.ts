import { isMobile } from 'react-device-detect';
import { VChart } from '../../../../src/export/core';
import { BarChart } from '../../../../src/export/chart';
import { BarSeries } from '../../../../src/export/series';
import { RectMark } from '../../../../src/export/mark';
import { CartesianAxis, CartesianBandAxis, CartesianLinearAxis } from '../../../../src/export/component';

VChart.useChart([BarChart]);
VChart.useSeries([BarSeries]);
VChart.useMark([RectMark]);
VChart.useComponent([CartesianBandAxis, CartesianLinearAxis]);

const run = () => {
  const mockData: any[] = [];
  const types = ['A', 'B', 'C'];

  types.forEach(type => {
    for (let i = 1; i <= 12; i++) {
      mockData.push({ month: i + '月', value: Math.random() * 100 + 10, type });
    }
  });

  const barChart = new VChart(
    {
      type: 'bar',
      data: [
        {
          values: mockData
        }
      ],
      xField: 'month',
      yField: 'value',
      seriesField: 'type'
    },
    {
      dom: document.getElementById('chart') as HTMLElement,
      mode: isMobile ? 'mobile-browser' : 'desktop-browser'
    }
  );
  barChart.renderAsync();
};
run();
