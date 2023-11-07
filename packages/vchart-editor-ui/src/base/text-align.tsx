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

  return (
    <div className="vchart-editor-ui-panel-base-container">
      {tooltipWrapper(<p className="vchart-editor-ui-panel-base-label">{label}</p>, props.tooltip)}
      <ButtonGroup>
        <IconButton
          icon={<IconAlignLeft />}
          style={props.textAlign === 'left' ? selectedStyle : normalStyle}
          onClick={() => {
            if (props.textAlign !== 'left') {
              props.onChange?.('left');
            }
          }}
        />
        <IconButton
          icon={<IconAlignCenter />}
          style={props.textAlign === 'center' ? selectedStyle : normalStyle}
          onClick={() => {
            if (props.textAlign !== 'center') {
              props.onChange?.('center');
            }
          }}
        />
        <IconButton
          icon={<IconAlignRight />}
          style={props.textAlign === 'right' ? selectedStyle : normalStyle}
          onClick={() => {
            if (props.textAlign !== 'right') {
              props.onChange?.('right');
            }
          }}
        />
      </ButtonGroup>
    </div>
  );
}
