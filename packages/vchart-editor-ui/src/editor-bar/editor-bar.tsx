import { Divider } from '@douyinfe/semi-ui';
import { IconHistogram } from '@douyinfe/semi-icons';
import type { IEditorComponentProps } from '../typings/editor-bar';
import { EditorBarChart } from './chart';
import { EditorBarPalette } from './palette';
import { EditorBarFill } from './fill';
// import horizontalLineSVG from '../assets/horizontal-line.svg';

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
    <>
      <div className="vchart-editor-ui-editor-bar-container">
        <EditorBarChart chart="bar" chartList={chartList} />
        <Divider layout="vertical" margin="12px" />
        <EditorBarPalette palette={paletteList[0]} paletteList={paletteList} />
        <Divider layout="vertical" margin="12px" />
        <EditorBarFill fillColor="#FFFFFF" fillOpacity={1} />
      </div>
    </>
  );
}
