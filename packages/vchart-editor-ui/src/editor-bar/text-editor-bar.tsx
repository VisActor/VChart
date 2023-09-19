import { Divider } from '@douyinfe/semi-ui';
import type { IEditorComponentProps } from '../typings/editor-bar';
import { IconComment } from '../svg/comment';
import { EditorBarTextColor } from './text-color';
import { EditorBarFontSize } from './font-size';

const fontSizeList = [14, 16, 20, 24, 32, 36, 40];

export function TextEditorBar(props: IEditorComponentProps) {
  return (
    <div className="vchart-editor-ui-editor-bar-container" style={{ ...(props.style ?? {}) }}>
      <EditorBarTextColor fillColor="#1F2329" backgroundColor="disable" />
      <EditorBarFontSize fontSize={14} fontSizeList={fontSizeList} />
      <Divider layout="vertical" margin="12px" />
      <IconComment />
    </div>
  );
}
