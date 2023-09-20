import { Divider } from '@douyinfe/semi-ui';
import type { ITextEditorComponentProps, TextColor } from '../typings/editor-bar';
import { IconComment } from '../svg/comment';
import { EditorBarTextColor } from '../tools/text-color';
import { EditorBarFontSize } from '../tools/font-size';
import { EditorBarEntry } from '../tools/util';
import { IconBold } from '@douyinfe/semi-icons';
import { defaultEditorBarComponentConfig } from '../config/editor-bar';
import { useState } from 'react';

export function TextEditorBar(props: ITextEditorComponentProps) {
  const fontSizeList = props.fontSizeList ?? defaultEditorBarComponentConfig.fontSize.fontSizeList;

  const [textColor, setTextColor] = useState<TextColor>(
    props.defaultTextColor ?? defaultEditorBarComponentConfig.textColor.default
  );
  const [fontSize, setFontSize] = useState<number>(
    props.defaultFontSize ?? defaultEditorBarComponentConfig.fontSize.default
  );
  const [bold, setBold] = useState<boolean>(props.defaultBold ?? defaultEditorBarComponentConfig.bold.default);

  return (
    <div className="vchart-editor-ui-editor-bar-container" style={{ ...(props.style ?? {}) }}>
      <EditorBarEntry
        icon={<IconBold />}
        selected={bold}
        onClick={() => {
          setBold(!bold);
          props.onBoldChange?.(!bold);
        }}
      />
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
      <EditorBarEntry icon={<IconComment />} selected={false} />
    </div>
  );
}
