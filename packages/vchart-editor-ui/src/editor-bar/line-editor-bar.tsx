import { Divider } from '@douyinfe/semi-ui';
import type { ILineEditorComponentProps, Stroke } from '../typings/editor-bar';
import { IconComment } from '../svg/comment';
import { EditorBarStrokeLine } from '../tools/stroke';
import { EditorBarEntry } from '../tools/util';
import { useState } from 'react';
import { defaultEditorBarComponentConfig } from '../config/editor-bar';

export function LineEditorBar(props: ILineEditorComponentProps) {
  const [stroke, setStroke] = useState<Stroke>(defaultEditorBarComponentConfig.stroke.default);

  return (
    <div className="vchart-editor-ui-editor-bar-container" style={{ ...(props.style ?? {}) }}>
      <EditorBarStrokeLine
        stroke={stroke}
        onStrokeChange={stroke => {
          setStroke(stroke);
          props.onStrokeChange?.(stroke);
        }}
      />
      <Divider layout="vertical" margin="8px" style={{ height: 10 }} />
      <EditorBarEntry icon={<IconComment />} selected={false} />
    </div>
  );
}
