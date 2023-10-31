import { Popover } from '@douyinfe/semi-ui';
import type { IEditorBarChartProps } from '../typings/editor-bar';
import { IconChevronDown } from '@douyinfe/semi-icons';
import { IconChart } from '../svg/chart';

const selectedStyle = {
  width: 144,
  height: 32,
  backgroundColor: 'rgba(117, 164, 255, 0.1)'
};

const unselectedStyle = {
  width: 144,
  height: 32
};

export function EditorBarChart(props: IEditorBarChartProps) {
  return (
    <Popover
      spacing={10}
      content={
        <div className="vchart-editor-ui-editor-bar-panel-container">
          {(props.chartList ?? []).map(chart => (
            <div
              key={chart.type}
              onClick={() => props.onChartChange?.(chart.type)}
              className="vchart-editor-ui-editor-bar-row"
              style={props.chart === chart.type ? selectedStyle : unselectedStyle}
            >
              <span className="vchart-editor-ui-editor-bar-chart-icon">{chart.icon}</span>
              {chart.label}
            </div>
          ))}
        </div>
      }
    >
      <span className="vchart-editor-ui-editor-bar-tool">
        <IconChart />
        <IconChevronDown className="vchart-editor-ui-editor-bar-open-icon" />
      </span>
    </Popover>
  );
}
