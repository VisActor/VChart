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

const chartList = [
  {
    type: 'bar',
    icon: <IconHistogram />,
    label: '基础柱状图'
  },
  {
    type: 'groupBar',
    icon: <IconHistogram />,
    label: '分组柱状图'
  },
  {
    type: 'stackBar',
    icon: <IconHistogram />,
    label: '堆叠柱状图'
  }
];

const paletteList = [
  ['#2E62F1', '#4DC36A', '#FF8406', '#FFCC00', '#4F44CF', '#5AC8FA', '#003A8C', '#B08AE2'],
  ['#4BC7A2', '#2E75D2', '#34B6FD', '#F5C040', '#98DD62', '#7272E1', '#87DBDD', '#FF8406']
];

export function EditorBar(props: IEditorComponentProps) {
  return (
    <div className="vchart-editor-ui-editor-bar-container" style={{ ...(props.style ?? {}) }}>
      <EditorBarChart chart="bar" chartList={chartList} />
      <Divider layout="vertical" margin="12px" />
      <EditorBarPalette palette={paletteList[0]} paletteList={paletteList} />
      <Divider layout="vertical" margin="12px" />
      <IconHorizontalLine />
      <Divider layout="vertical" margin="12px" />
      <IconVerticalLine />
      <Divider layout="vertical" margin="12px" />
      <IconHorizontalRect />
      <Divider layout="vertical" margin="12px" />
      <IconVerticalRect />
      <Divider layout="vertical" margin="12px" />
      <IconCombineMark />
      <Divider layout="vertical" margin="12px" />
      <IconSumDiff />
      <Divider layout="vertical" margin="12px" />
      <IconHierarchyDiff />
      <Divider layout="vertical" margin="12px" />
      <IconAddText />
      <Divider layout="vertical" margin="12px" />
      <IconEditData />
      <Divider layout="vertical" margin="12px" />
      <EditorBarFill fillColor="#FFFFFF" fillOpacity={1} />
      <EditorBarStroke strokeStyle="disable" strokeColor="#000000" strokeWidth={1} strokeOpacity={1} />
      <Divider layout="vertical" margin="12px" />
      <IconComment />
      <Divider layout="vertical" margin="12px" />
      <IconMore />
    </div>
  );
}
