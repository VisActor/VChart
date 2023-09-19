import { Divider } from '@douyinfe/semi-ui';
import { IconBold } from '@douyinfe/semi-icons';
import type { IEditorComponentProps } from '../typings/editor-bar';
import { IconComment } from '../svg/comment';
import { EditorBarStrokeLine } from './stroke';

export function LineEditorBar(props: IEditorComponentProps) {
  return (
    <div className="vchart-editor-ui-editor-bar-container" style={{ ...(props.style ?? {}) }}>
      <IconBold />
      <Divider layout="vertical" margin="12px" />
      <EditorBarStrokeLine strokeStyle="disable" strokeColor="#000000" strokeWidth={1} strokeOpacity={1} />
      <Divider layout="vertical" margin="12px" />
      <IconComment />
    </div>
  );
}
