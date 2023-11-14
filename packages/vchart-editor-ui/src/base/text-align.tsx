import { ButtonGroup, IconButton } from '@douyinfe/semi-ui';
import type { IBaseTextAlignComponentProps } from '../typings/base';
import { defaultBaseComponentConfig } from '../config/base';
import { IconAlignCenter, IconAlignLeft, IconAlignRight } from '@douyinfe/semi-icons';
import { tooltipWrapper } from '../utils/node';

const normalStyle = {};

const selectedStyle = {
  background: '#aaa'
};

export function TextAlign(props: IBaseTextAlignComponentProps) {
  const label = props.label ?? defaultBaseComponentConfig.textAlign.label;
  const alignOptions = props.config.alignOptions ?? ['left', 'center', 'right'];

  return (
    <div className="vchart-editor-ui-panel-base-container">
      {tooltipWrapper(<p className="vchart-editor-ui-panel-base-label">{label}</p>, props.tooltip)}
      <ButtonGroup>
        <IconButton
          icon={<IconAlignLeft />}
          style={props.textAlign === alignOptions[0] ? selectedStyle : normalStyle}
          onClick={() => {
            if (props.textAlign !== alignOptions[0]) {
              props.onChange?.(alignOptions[0]);
            }
          }}
        />
        <IconButton
          icon={<IconAlignCenter />}
          style={props.textAlign === alignOptions[1] ? selectedStyle : normalStyle}
          onClick={() => {
            if (props.textAlign !== alignOptions[1]) {
              props.onChange?.(alignOptions[1]);
            }
          }}
        />
        <IconButton
          icon={<IconAlignRight />}
          style={props.textAlign === alignOptions[2] ? selectedStyle : normalStyle}
          onClick={() => {
            if (props.textAlign !== alignOptions[2]) {
              props.onChange?.(alignOptions[2]);
            }
          }}
        />
      </ButtonGroup>
    </div>
  );
}
