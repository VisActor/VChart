import { Divider } from '@douyinfe/semi-ui';
import type { Fill, IColorEditorComponentProps, Stroke } from '../typings/editor-bar';
import { IconComment } from '../svg/comment';
import { EditorBarStroke } from './stroke';
import { EditorBarFill } from './fill';
import { EditorBarTool } from './util';
import { useState } from 'react';
import { defaultEditorBarComponentConfig } from '../config/editor-bar';

export function ColorEditorBar(props: IColorEditorComponentProps) {
  const [fill, setFill] = useState<Fill>(defaultEditorBarComponentConfig.fill.default);
  const [stroke, setStroke] = useState<Stroke>(defaultEditorBarComponentConfig.stroke.default);

  return (
    <div className="vchart-editor-ui-editor-bar-container" style={{ ...(props.style ?? {}) }}>
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
      <EditorBarTool icon={<IconComment />} selected={false} />
    </div>
  );
}
