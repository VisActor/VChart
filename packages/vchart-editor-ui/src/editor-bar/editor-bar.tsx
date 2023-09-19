import { Divider } from '@douyinfe/semi-ui';
import { IconHistogram, IconMore } from '@douyinfe/semi-icons';
import type { IEditorComponentProps } from '../typings/editor-bar';
import { EditorBarChart } from './chart';
import { EditorBarPalette } from './palette';
import { EditorBarFill } from './fill';
import { IconHorizontalLine } from '../svg/horizontal-line';
import { IconVerticalLine } from '../svg/vertical-line';
import { IconHorizontalRect } from '../svg/horizontal-rect';
import { IconVerticalRect } from '../svg/vertical-rect';
import { IconCombineMark } from '../svg/combine-mark';
import { IconSumDiff } from '../svg/sum-diff';
import { IconHierarchyDiff } from '../svg/hierarchy-diff';
import { IconAddText } from '../svg/add-text';
import { IconEditData } from '../svg/edit-data';
import { IconComment } from '../svg/comment';
import { EditorBarStroke } from './stroke';
import { EditorBarTool } from './util';
import {
  IconBarChart,
  IconBarLineChart,
  IconGroupBarChart,
  IconLineChart,
  IconPercentageBarChart,
  IconStackBarChart
} from '../svg/chart';

const chartList = [
  {
    type: 'bar',
    icon: <IconBarChart />,
    label: '基础柱状图'
  },
  {
    type: 'groupBar',
    icon: <IconGroupBarChart />,
    label: '分组柱状图'
  },
  {
    type: 'stackBar',
    icon: <IconStackBarChart />,
    label: '堆叠柱状图'
  },
  {
    type: 'percentageBar',
    icon: <IconPercentageBarChart />,
    label: '百分比堆叠图'
  },
  {
    type: 'line',
    icon: <IconLineChart />,
    label: '折线图'
  },
  {
    type: 'combine',
    icon: <IconBarLineChart />,
    label: '柱线组合图'
  }
];

const paletteList = [
  ['#2E62F1', '#4DC36A', '#FF8406', '#FFCC00', '#4F44CF', '#5AC8FA', '#003A8C', '#B08AE2'],
  ['#4BC7A2', '#2E75D2', '#34B6FD', '#F5C040', '#98DD62', '#7272E1', '#87DBDD', '#FF8406']
];

export function EditorBar(props: IEditorComponentProps) {
  return (
    <div
      className="vchart-editor-ui-editor-bar-container"
      style={{ display: 'flex', alignItems: 'center', padding: '4px 8px', height: 32, ...(props.style ?? {}) }}
    >
      <EditorBarChart chart="bar" chartList={chartList} />
      <Divider layout="vertical" margin="8px" style={{ height: 10 }} />

      <EditorBarPalette palette={paletteList[0]} paletteList={paletteList} />
      <Divider layout="vertical" margin="8px" style={{ height: 10 }} />

      <EditorBarTool icon={<IconHorizontalLine />} selected={false} />
      <Divider layout="vertical" margin="8px" style={{ height: 10 }} />

      <EditorBarTool icon={<IconVerticalLine />} selected={false} />
      <Divider layout="vertical" margin="8px" style={{ height: 10 }} />

      <EditorBarTool icon={<IconHorizontalRect />} selected={false} />
      <Divider layout="vertical" margin="8px" style={{ height: 10 }} />

      <EditorBarTool icon={<IconVerticalRect />} selected={false} />
      <Divider layout="vertical" margin="8px" style={{ height: 10 }} />

      <EditorBarTool icon={<IconCombineMark />} selected={false} />
      <Divider layout="vertical" margin="8px" style={{ height: 10 }} />

      <EditorBarTool icon={<IconSumDiff />} selected={false} />
      <Divider layout="vertical" margin="8px" style={{ height: 10 }} />

      <EditorBarTool icon={<IconHierarchyDiff />} selected={false} />
      <Divider layout="vertical" margin="8px" style={{ height: 10 }} />

      <EditorBarTool icon={<IconAddText />} selected={false} />
      <Divider layout="vertical" margin="8px" style={{ height: 10 }} />

      <EditorBarTool icon={<IconEditData />} selected={false} />
      <Divider layout="vertical" margin="8px" style={{ height: 10 }} />

      <EditorBarFill fillColor="#FFFFFF" fillOpacity={1} />
      <EditorBarStroke strokeStyle="disable" strokeColor="#000000" strokeWidth={1} strokeOpacity={1} />
      <Divider layout="vertical" margin="8px" style={{ height: 10 }} />

      <EditorBarTool icon={<IconComment />} selected={false} />
      <Divider layout="vertical" margin="8px" style={{ height: 10 }} />

      <EditorBarTool icon={<IconMore />} selected={false} />
    </div>
  );
}
