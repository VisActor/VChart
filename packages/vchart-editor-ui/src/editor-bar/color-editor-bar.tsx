import { Divider } from '@douyinfe/semi-ui';
import type { Fill, IColorEditorComponentProps, Stroke } from '../typings/editor-bar';
import { IconComment } from '../svg/comment';
import { EditorBarStroke } from '../tools/stroke';
import { EditorBarFill } from '../tools/fill';
import { EditorBarEntry } from '../tools/util';
import { useState } from 'react';
import { defaultEditorBarComponentConfig } from '../config/editor-bar';

export function ColorEditorBar(props: IColorEditorComponentProps) {
  const [fill, setFill] = useState<Fill>(props.defaultFill ?? defaultEditorBarComponentConfig.fill.default);
  const [stroke, setStroke] = useState<Stroke>(props.defaultStroke ?? defaultEditorBarComponentConfig.stroke.default);

  return (
    <div
      className={`vchart-editor-ui-editor-bar-container ${props.className ?? ''}`}
      style={{ ...(props.style ?? {}) }}
    >
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
      <EditorBarEntry icon={<IconComment />} selected={false} />
    </div>
  );
}
