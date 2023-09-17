import { Divider } from '@douyinfe/semi-ui';
import type { IEditorComponentProps } from '../typings/editor-bar';
import { IconChevronDown, IconHistogram } from '@douyinfe/semi-icons';

export function EditorBar(props: IEditorComponentProps) {
  return (
    <div
      style={{
        padding: '4px 8px',
        border: '1px solid #DEE0E3',
        borderRadius: 8,
        boxShadow:
          // eslint-disable-next-line
          '0px 8px 24px 8px rgba(31, 35, 41, 0.04), 0px 6px 12px 0px rgba(31, 35, 41, 0.04), 0px 4px 8px -8px rgba(31, 35, 41, 0.06)'
      }}
    >
      <span>
        <IconHistogram />
        <IconChevronDown />
      </span>
      <Divider layout="vertical" margin="12px" />
    </div>
  );
}
