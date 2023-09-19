import React, { useState } from 'react';
import { Divider } from '@douyinfe/semi-ui';
import { IconMore } from '@douyinfe/semi-icons';
import type { Fill, IEditorComponentProps, Stroke } from '../typings/editor-bar';
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
import { defaultEditorBarComponentConfig } from '../config/editor-bar';

type EditorTool = {
  key: string;
  icon: React.ReactNode;
};

const editorTools: EditorTool[] = [
  { key: 'horizontalLine', icon: <IconHorizontalLine /> },
  { key: 'verticalLine', icon: <IconVerticalLine /> },
  { key: 'horizontalRect', icon: <IconHorizontalRect /> },
  { key: 'verticalRect', icon: <IconVerticalRect /> },
  { key: 'combineMark', icon: <IconCombineMark /> },
  { key: 'sumDiff', icon: <IconSumDiff /> },
  { key: 'hierarchyDiff', icon: <IconHierarchyDiff /> },
  { key: 'addText', icon: <IconAddText /> }
];

export function EditorBar(props: IEditorComponentProps) {
  const chartList = props.chartList ?? defaultEditorBarComponentConfig.chart.chartList;
  const paletteList = props.paletteList ?? defaultEditorBarComponentConfig.palette.paletteList;

  const [tool, setTool] = useState<string | null>(null);
  const [chart, setChart] = useState<string | null>(chartList[0].type);
  const [palette, setPalette] = useState<string[] | null>(paletteList[0]);
  const [fill, setFill] = useState<Fill>(defaultEditorBarComponentConfig.fill.default);
  const [stroke, setStroke] = useState<Stroke>(defaultEditorBarComponentConfig.stroke.default);

  return (
    <div
      className="vchart-editor-ui-editor-bar-container"
      style={{ display: 'flex', alignItems: 'center', padding: '4px 8px', height: 32, ...(props.style ?? {}) }}
    >
      <EditorBarChart
        chart={chart}
        chartList={chartList}
        onChartChange={chart => {
          setChart(chart);
          props.onChartChange?.(chart);
        }}
      />
      <Divider layout="vertical" margin="8px" style={{ height: 10 }} />

      <EditorBarPalette
        palette={palette}
        paletteList={paletteList}
        onPaletteChange={palette => {
          setPalette(palette);
          props.onPaletteChange?.(palette);
        }}
      />
      <Divider layout="vertical" margin="8px" style={{ height: 10 }} />

      {editorTools.map(editorTool => (
        <React.Fragment key={editorTool.key}>
          <EditorBarTool
            icon={editorTool.icon}
            selected={tool === editorTool.key}
            onClick={() => {
              const nextTool = tool !== editorTool.key ? editorTool.key : null;
              setTool(nextTool);
              props.onToolChange?.(nextTool);
            }}
          />
          <Divider layout="vertical" margin="8px" style={{ height: 10 }} />
        </React.Fragment>
      ))}

      <EditorBarTool icon={<IconEditData />} selected={false} onClick={() => props.onEditData?.()} />
      <Divider layout="vertical" margin="8px" style={{ height: 10 }} />

      <EditorBarFill
        fill={fill}
        onFillChange={fill => {
          setFill(fill);
          props.onFillChange?.(fill);
        }}
      />
      <EditorBarStroke
        stroke={stroke}
        onStrokeChange={stroke => {
          setStroke(stroke);
          props.onStrokeChange?.(stroke);
        }}
      />
      <Divider layout="vertical" margin="8px" style={{ height: 10 }} />

      <EditorBarTool icon={<IconComment />} selected={false} onClick={() => props.onComment?.()} />
      <Divider layout="vertical" margin="8px" style={{ height: 10 }} />

      <EditorBarTool icon={<IconMore />} selected={false} onClick={() => props.onMore?.()} />
    </div>
  );
}
