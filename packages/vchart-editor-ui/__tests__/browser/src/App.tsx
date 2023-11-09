import './App.css';
import {
  AxisPanel,
  ColorEditorBar,
  CustomEditorBar,
  CustomPanel,
  DataFormatPanel,
  EditorBar,
  LabelPanel,
  LineEditorBar,
  TextEditorBar,
  TitlePanel
} from '../../../src';
import { useState } from 'react';

function App() {
  const [enabled, setEnabled] = useState<boolean>(true);
  const [fontSize, setFontSize] = useState<number>(12);

  return (
    <div>
      <p>VChart Editor UI</p>
      <EditorBar style={{ marginBottom: 20 }} />
      <ColorEditorBar style={{ marginBottom: 20 }} />
      <LineEditorBar style={{ marginBottom: 20 }} />
      <TextEditorBar style={{ marginBottom: 20 }} />
      <CustomEditorBar
        style={{ marginBottom: 20 }}
        entries={[
          { key: 'chart' },
          { key: 'palette' },
          { key: 'fill' },
          { key: 'stroke' },
          { key: 'line' },
          { key: 'textColor' },
          { key: 'fontSize', default: 16 },

          { key: 'horizontalLine', divide: false },
          { key: 'verticalLine', divide: false },
          { key: 'horizontalRect', divide: false },
          { key: 'verticalRect', divide: false },
          { key: 'combineMark', divide: false },
          { key: 'sumDiff', divide: false },
          { key: 'hierarchyDiff', divide: false },
          { key: 'addText' },

          { key: 'bold' },

          { key: 'editData', divide: false },
          { key: 'comment', divide: false },
          { key: 'more', divide: false }
        ]}
      />
      <TitlePanel
        style={{ marginBottom: 20 }}
        sections={{
          title: {
            label: '主标题',
            entries: [
              { key: 'text' },
              { key: 'fontSize', label: '字号' },
              { key: 'fontFamily', label: '字体' },
              { key: 'fontStyle', label: '样式' },
              { key: 'color', label: '颜色' }
            ]
          },
          subTitle: {
            label: '副标题',
            entries: [
              { key: 'display', label: '显示副标题' },
              { key: 'text' },
              { key: 'fontSize', label: '字号' },
              { key: 'fontFamily', label: '字体' },
              { key: 'fontStyle', label: '样式' },
              { key: 'color', label: '颜色' }
            ]
          },
          align: {
            label: '排列',
            entries: [
              {
                key: 'position',
                label: '显示位置',
                options: [
                  { value: 'left', label: '居左' },
                  { value: 'center', label: '居中' },
                  { value: 'right', label: '居右' }
                ]
              },
              { key: 'textAlign', label: '对齐方式' }
            ]
          }
        }}
      />
      <AxisPanel style={{ marginBottom: 20 }} />
      <DataFormatPanel style={{ marginBottom: 20 }} />
      <LabelPanel style={{ marginBottom: 20 }} />
      <CustomPanel
        style={{ marginBottom: 20 }}
        label="图形样式"
        sectionComponentMaps={{
          style: {
            count: 'sliderNumber',
            interval: 'sliderNumber',
            borderRadius: 'sliderNumber',
            lineType: 'lineType'
          }
        }}
        sections={{
          bar: {
            entries: [
              { key: 'count', label: '柱体个数' },
              { key: 'interval', label: '柱间距', unit: '%', default: 50, min: 0, max: 100 },
              { key: 'borderRadius', label: '柱体圆角', unit: '%', default: 50, min: 0, max: 100 },
              { key: 'lineType', label: 'line dash' }
            ]
          }
        }}
      />
      <CustomPanel
        style={{ marginBottom: 20 }}
        label="时间标注"
        sectionComponentMaps={{
          sum: {
            a: 'input',
            b: 'input'
          }
        }}
        sections={{
          time: {
            label: '当前时间',
            entries: [
              { key: 'switch', label: '显示当前时间' },
              { key: 'fontFamily', label: '字体' },
              { key: 'fontSize', label: '字号', value: fontSize },
              { key: 'fontStyle', label: '样式' },
              { key: 'color', label: '颜色' }
            ]
          },
          sum: {
            label: '总计',
            entries: [
              { key: 'switch', label: '显示总计' },
              { key: 'fontFamily', label: '字体' },
              { key: 'fontSize', label: '字号' },
              { key: 'fontStyle', label: '样式' },
              { key: 'color', label: '颜色' },
              { key: 'textAlign', label: '对齐方式' },
              { key: 'a', label: 'abc', options: [{ label: '1', value: '2' }], default: '2' },
              { key: 'b', label: 'abc1', options: [{ label: '1', value: '2' }], default: '3' },
              { key: 'sliderNumber', label: 'def', unit: '%', min: 10, max: 100 }
            ]
          }
        }}
        enabled={enabled}
        onEnabled={enabled => {
          console.log('enabled', enabled);
          setEnabled(enabled);
        }}
        onChange={(section, key, value) => {
          console.log(section, key, value);
          if (section === 'time' && key === 'fontSize') {
            setFontSize(value);
          }
        }}
      />
    </div>
  );
}

export default App;
