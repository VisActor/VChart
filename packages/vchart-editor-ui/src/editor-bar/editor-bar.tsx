import React, { useState } from 'react';
import { Divider } from '@douyinfe/semi-ui';
import { IconMore } from '@douyinfe/semi-icons';
import type { Fill, IEditorComponentProps, Stroke } from '../typings/editor-bar';
import { EditorBarChart } from '../tools/chart';
import { EditorBarPalette } from '../tools/palette';
import { EditorBarFill } from '../tools/fill';
import { IconEditData } from '../svg/edit-data';
import { IconComment } from '../svg/comment';
import { EditorBarStroke } from '../tools/stroke';
import { EditorBarEntry, editorBarToolMap } from '../tools/util';
import { defaultEditorBarComponentConfig } from '../config/editor-bar';

const editorTools = Object.keys(editorBarToolMap)
  .filter(key => editorBarToolMap[key].type === 'tool')
  .map(key => ({ key, icon: editorBarToolMap[key].icon }));

export function EditorBar(props: IEditorComponentProps) {
  const chartList = props.chartList ?? defaultEditorBarComponentConfig.chart.chartList;
  const paletteList = props.paletteList ?? defaultEditorBarComponentConfig.palette.paletteList;

  const [tool, setTool] = useState<string | null>(null);
  const [chart, setChart] = useState<string | null>(props.defaultChart ?? chartList[0].type);
  const [palette, setPalette] = useState<string[] | null>(props.defaultPalette ?? paletteList[0]);
  const [fill, setFill] = useState<Fill>(props.defaultFill ?? defaultEditorBarComponentConfig.fill.default);
  const [stroke, setStroke] = useState<Stroke>(props.defaultStroke ?? defaultEditorBarComponentConfig.stroke.default);

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
          <EditorBarEntry
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

      <EditorBarEntry icon={<IconEditData />} selected={false} onClick={() => props.onEditData?.()} />
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

      <EditorBarEntry icon={<IconComment />} selected={false} onClick={() => props.onComment?.()} />
      <Divider layout="vertical" margin="8px" style={{ height: 10 }} />

      <EditorBarEntry icon={<IconMore />} selected={false} onClick={() => props.onMore?.()} />
    </div>
  );
}
