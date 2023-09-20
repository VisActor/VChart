import { useState } from 'react';
import { ButtonGroup, IconButton } from '@douyinfe/semi-ui';
import type { IBaseTextAlignComponentProps } from '../typings/base';
import { defaultBaseComponentConfig } from '../config/base';
import { IconAlignCenter, IconAlignLeft, IconAlignRight } from '@douyinfe/semi-icons';

const normalStyle = {};

const selectedStyle = {
  background: '#aaa'
};

export function TextAlign(props: IBaseTextAlignComponentProps) {
  const label = props.label ?? defaultBaseComponentConfig.textAlign.label;
  const defaultTextAlign = props.textAlign ?? defaultBaseComponentConfig.textAlign.default;
  const [textAlign, setTextAlign] = useState<string>(defaultTextAlign);

  return (
    <div className="vchart-editor-ui-panel-base-container">
      <p className="vchart-editor-ui-panel-base-label">{label}</p>
      <ButtonGroup>
        <IconButton
          icon={<IconAlignLeft />}
          style={textAlign === 'left' ? selectedStyle : normalStyle}
          onClick={() => {
            if (textAlign !== 'left') {
              setTextAlign('left');
              props.onChange?.('left');
            }
          }}
        />
        <IconButton
          icon={<IconAlignCenter />}
          style={textAlign === 'center' ? selectedStyle : normalStyle}
          onClick={() => {
            if (textAlign !== 'center') {
              setTextAlign('center');
              props.onChange?.('center');
            }
          }}
        />
        <IconButton
          icon={<IconAlignRight />}
          style={textAlign === 'right' ? selectedStyle : normalStyle}
          onClick={() => {
            if (textAlign !== 'right') {
              setTextAlign('right');
              props.onChange?.('right');
            }
          }}
        />
      </ButtonGroup>
    </div>
  );
}
