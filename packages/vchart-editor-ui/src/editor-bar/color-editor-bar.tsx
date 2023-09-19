import { Divider } from '@douyinfe/semi-ui';
import type { IEditorComponentProps } from '../typings/editor-bar';
import { IconComment } from '../svg/comment';
import { EditorBarStroke } from './stroke';
import { EditorBarFill } from './fill';
import { EditorBarTool } from './util';

export function ColorEditorBar(props: IEditorComponentProps) {
  return (
    <div className="vchart-editor-ui-editor-bar-container" style={{ ...(props.style ?? {}) }}>
      <EditorBarFill fillColor="#FFFFFF" fillOpacity={1} />
      <EditorBarStroke strokeStyle="disable" strokeColor="#000000" strokeWidth={1} strokeOpacity={1} />{' '}
      <Divider layout="vertical" margin="8px" style={{ height: 10 }} />
      <EditorBarTool icon={<IconComment />} selected={false} />
    </div>
  );
}
