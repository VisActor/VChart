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

  return (
    <div className="vchart-editor-ui-panel-base-container">
      <p className="vchart-editor-ui-panel-base-label">{label}</p>
      <IconButton
        icon={<IconBold />}
        style={props.bolder ? selectedStyle : normalStyle}
        onClick={() => {
          props.onChange?.({ bolder: !props.bolder, underline: props.underline, italic: props.italic });
        }}
      />
      <IconButton
        icon={<IconUnderline />}
        style={props.underline ? selectedStyle : normalStyle}
        onClick={() => {
          props.onChange?.({ bolder: props.bolder, underline: !props.underline, italic: props.italic });
        }}
      />
      <IconButton
        icon={<IconItalic />}
        style={props.italic ? selectedStyle : normalStyle}
        onClick={() => {
          props.onChange?.({ bolder: props.bolder, underline: props.underline, italic: !props.italic });
        }}
      />
    </div>
  );
}
