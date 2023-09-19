import { Divider } from '@douyinfe/semi-ui';
import type { ITextEditorComponentProps, TextColor } from '../typings/editor-bar';
import { IconComment } from '../svg/comment';
import { EditorBarTextColor } from './text-color';
import { EditorBarFontSize } from './font-size';
import { EditorBarTool } from './util';
import { IconBold } from '@douyinfe/semi-icons';
import { defaultEditorBarComponentConfig } from '../config/editor-bar';
import { useState } from 'react';

export function TextEditorBar(props: ITextEditorComponentProps) {
  const fontSizeList = props.fontSizeList ?? defaultEditorBarComponentConfig.fontSize.fontSizeList;

  const [textColor, setTextColor] = useState<TextColor>(defaultEditorBarComponentConfig.textColor.default);
  const [fontSize, setFontSize] = useState<number>(defaultEditorBarComponentConfig.fontSize.default);

  return (
    <div className="vchart-editor-ui-editor-bar-container" style={{ ...(props.style ?? {}) }}>
      <EditorBarTool icon={<IconBold />} selected={false} />
      <Divider layout="vertical" margin="8px" style={{ height: 10 }} />

      <EditorBarTextColor
        textColor={textColor}
        onTextColorChange={textColor => {
          setTextColor(textColor);
          props.onTextColorChange?.(textColor);
        }}
      />
      <EditorBarFontSize
        fontSize={fontSize}
        fontSizeList={fontSizeList}
        onFontSizeChange={fontSize => {
          setFontSize(fontSize);
          props.onFontSizeChange?.(fontSize);
        }}
      />
      <EditorBarTool icon={<IconComment />} selected={false} />
    </div>
  );
}
