import React, { useState } from 'react';
import { Divider } from '@douyinfe/semi-ui';
import type {
  ICustomEditorComponentProps,
  IEditorBarChartEntry,
  IEditorBarEntry,
  IEditorBarFontSizeEntry,
  IEditorBarPaletteEntry
} from '../typings/editor-bar';
import { EditorBarChart } from '../tools/chart';
import { EditorBarPalette } from '../tools/palette';
import { EditorBarFill } from '../tools/fill';
import { EditorBarStroke, EditorBarStrokeLine } from '../tools/stroke';
import { EditorBarEntry, editorBarToolMap } from '../tools/util';
import { defaultEditorBarComponentConfig } from '../config/editor-bar';
import { EditorBarTextColor } from '../tools/text-color';
import { EditorBarFontSize } from '../tools/font-size';

function generateInitialPanelValue(entries: IEditorBarEntry[]) {
  const panelValue = {};
  entries.forEach(entry => {
    switch (entry.key) {
      case 'chart':
        panelValue[entry.key] =
          entry.default ??
          ((entry as IEditorBarChartEntry).chartList ?? defaultEditorBarComponentConfig.chart.chartList)[0].type;
        break;
      case 'palette':
        panelValue[entry.key] =
          entry.default ??
          ((entry as IEditorBarPaletteEntry).paletteList ?? defaultEditorBarComponentConfig.palette.paletteList)[0];
        break;
      case 'fill':
        panelValue[entry.key] = entry.default ?? defaultEditorBarComponentConfig.fill.default;
        break;
      case 'stroke':
      case 'line':
        panelValue[entry.key] = entry.default ?? defaultEditorBarComponentConfig.stroke.default;
        break;
      case 'textColor':
        panelValue[entry.key] = entry.default ?? defaultEditorBarComponentConfig.textColor.default;
        break;
      case 'fontSize':
        panelValue[entry.key] = entry.default ?? defaultEditorBarComponentConfig.fontSize.default;
        break;
      default:
        panelValue[entry.key] = entry.default ?? false;
    }
  });
  return panelValue;
}

function generateEditorEntry(
  entry: IEditorBarEntry,
  onChange: (key: string, value?: any) => void,
  tool: string,
  setTool: (tool: string) => void,
  onToolChange: (tool: string) => void,
  panelValue: Record<string, any>,
  setPanelValue: (panelValue: Record<string, any>) => void
) {
  let toolNode: React.ReactNode;
  if (editorBarToolMap[entry.key]) {
    switch (editorBarToolMap[entry.key].type) {
      case 'tool':
        toolNode = (
          <EditorBarEntry
            icon={editorBarToolMap[entry.key].icon}
            selected={tool === entry.key}
            onClick={() => {
              const nextTool = tool !== entry.key ? entry.key : null;
              setTool(nextTool);
              onToolChange?.(nextTool);
              entry.onChange?.(nextTool === tool);
              onChange?.(entry.key, nextTool === tool);
            }}
          />
        );
        break;
      case 'trigger':
        toolNode = (
          <EditorBarEntry
            icon={editorBarToolMap[entry.key].icon}
            onClick={() => {
              entry.onChange?.(entry.key);
              onChange?.(entry.key, entry.key);
            }}
          />
        );
        break;
      case 'switch':
        toolNode = (
          <EditorBarEntry
            icon={editorBarToolMap[entry.key].icon}
            selected={panelValue[entry.key]}
            onClick={() => {
              const nextValue = !panelValue[entry.key];
              setPanelValue(Object.assign({}, panelValue, { [entry.key]: nextValue }));
              entry.onChange?.(nextValue);
              onChange?.(entry.key, nextValue);
            }}
          />
        );
        break;
    }
  } else {
    switch (entry.key) {
      case 'chart':
        toolNode = (
          <EditorBarChart
            chart={panelValue[entry.key]}
            chartList={(entry as IEditorBarChartEntry).chartList ?? defaultEditorBarComponentConfig.chart.chartList}
            onChartChange={chart => {
              setPanelValue(Object.assign({}, panelValue, { [entry.key]: chart }));
              entry.onChange?.(chart);
              onChange?.(entry.key, chart);
            }}
          />
        );
        break;
      case 'palette':
        toolNode = (
          <EditorBarPalette
            palette={panelValue[entry.key]}
            paletteList={
              (entry as IEditorBarPaletteEntry).paletteList ?? defaultEditorBarComponentConfig.palette.paletteList
            }
            onPaletteChange={palette => {
              setPanelValue(Object.assign({}, panelValue, { [entry.key]: palette }));
              entry.onChange?.(palette);
              onChange?.(entry.key, palette);
            }}
          />
        );
        break;
      case 'fill':
        toolNode = (
          <EditorBarFill
            fill={panelValue[entry.key]}
            onFillChange={fill => {
              setPanelValue(Object.assign({}, panelValue, { [entry.key]: fill }));
              entry.onChange?.(fill);
              onChange?.(entry.key, fill);
            }}
          />
        );
        break;
      case 'stroke':
        toolNode = (
          <EditorBarStroke
            stroke={panelValue[entry.key]}
            onStrokeChange={stroke => {
              setPanelValue(Object.assign({}, panelValue, { [entry.key]: stroke }));
              entry.onChange?.(stroke);
              onChange?.(entry.key, stroke);
            }}
          />
        );
        break;
      case 'line':
        toolNode = (
          <EditorBarStrokeLine
            stroke={panelValue[entry.key]}
            onStrokeChange={stroke => {
              setPanelValue(Object.assign({}, panelValue, { [entry.key]: stroke }));
              entry.onChange?.(stroke);
              onChange?.(entry.key, stroke);
            }}
          />
        );
        break;
      case 'textColor':
        toolNode = (
          <EditorBarTextColor
            textColor={panelValue[entry.key]}
            onTextColorChange={textColor => {
              setPanelValue(Object.assign({}, panelValue, { [entry.key]: textColor }));
              entry.onChange?.(textColor);
              onChange?.(entry.key, textColor);
            }}
          />
        );
        break;
      case 'fontSize':
        toolNode = (
          <EditorBarFontSize
            fontSize={panelValue[entry.key]}
            fontSizeList={
              (entry as IEditorBarFontSizeEntry).fontSizeList ?? defaultEditorBarComponentConfig.fontSize.fontSizeList
            }
            onFontSizeChange={fontSize => {
              setPanelValue(Object.assign({}, panelValue, { [entry.key]: fontSize }));
              entry.onChange?.(fontSize);
              onChange?.(entry.key, fontSize);
            }}
          />
        );
        break;
    }
  }
  if (entry.divide === false) {
    return toolNode;
  }
  return (
    <>
      {toolNode}
      <Divider layout="vertical" margin="8px" style={{ height: 10 }} />
    </>
  );
}

export function CustomEditorBar(props: ICustomEditorComponentProps) {
  const [tool, setTool] = useState<string | null>(null);
  const [panelValue, setPanelValue] = useState<Record<string, any>>(generateInitialPanelValue(props.entries));

  return (
    <div
      className="vchart-editor-ui-editor-bar-container"
      style={{ display: 'flex', alignItems: 'center', padding: '4px 8px', height: 32, ...(props.style ?? {}) }}
    >
      {props.entries.map(entry => {
        return (
          <React.Fragment key={entry.key}>
            {generateEditorEntry(entry, props.onChange, tool, setTool, props.onToolChange, panelValue, setPanelValue)}
          </React.Fragment>
        );
      })}
    </div>
  );
}
