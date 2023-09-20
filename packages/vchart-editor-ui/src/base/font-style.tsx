import { useState } from 'react';
import { IconBold, IconItalic, IconUnderline } from '@douyinfe/semi-icons';
import { IconButton } from '@douyinfe/semi-ui';
import type { IBaseFontStyleComponentProps } from '../typings/base';
import { defaultBaseComponentConfig } from '../config/base';

const normalStyle = {
  marginLeft: 10,
  marginRight: 10
};

const selectedStyle = {
  marginLeft: 10,
  marginRight: 10,
  background: '#aaa'
};

export function FontStyle(props: IBaseFontStyleComponentProps) {
  const label = props.label ?? defaultBaseComponentConfig.fontFamily.label;
  const defaultBolder = props.bolder ?? defaultBaseComponentConfig.fontStyle.default.bold;
  const defaultUnderline = props.underline ?? defaultBaseComponentConfig.fontStyle.default.underline;
  const defaultItalic = props.italic ?? defaultBaseComponentConfig.fontStyle.default.italic;
  const [bolder, setBolder] = useState<boolean>(defaultBolder);
  const [underline, setUnderline] = useState<boolean>(defaultUnderline);
  const [italic, setItalic] = useState<boolean>(defaultItalic);

  return (
    <div className="vchart-editor-ui-panel-base-container">
      <p className="vchart-editor-ui-panel-base-label">{label}</p>
      <IconButton
        icon={<IconBold />}
        style={bolder ? selectedStyle : normalStyle}
        onClick={() => {
          setBolder(!bolder);
          props.onChange?.({ bolder: !bolder, underline, italic });
        }}
      />
      <IconButton
        icon={<IconUnderline />}
        style={underline ? selectedStyle : normalStyle}
        onClick={() => {
          setUnderline(!underline);
          props.onChange?.({ bolder, underline: !underline, italic });
        }}
      />
      <IconButton
        icon={<IconItalic />}
        style={italic ? selectedStyle : normalStyle}
        onClick={() => {
          setItalic(!italic);
          props.onChange?.({ bolder, underline, italic: !italic });
        }}
      />
    </div>
  );
}
