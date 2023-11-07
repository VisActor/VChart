import { SketchPicker } from 'react-color';
import type { IBaseColorComponentProps } from '../typings/base';
import { defaultBaseComponentConfig } from '../config/base';
import { Button, Popover } from '@douyinfe/semi-ui';
import { tooltipWrapper } from '../utils/node';

export function Color(props: IBaseColorComponentProps) {
  const label = props.label ?? defaultBaseComponentConfig.color.label;

  return (
    <div className="vchart-editor-ui-panel-base-container">
      {tooltipWrapper(<p className="vchart-editor-ui-panel-base-label">{label}</p>, props.tooltip)}
      <Popover
        content={
          <SketchPicker
            color={props.color}
            onChange={color => {
              props.onChange?.(color.hex);
            }}
          />
        }
      >
        <Button>
          <div style={{ width: 40, height: 20, backgroundColor: props.color }}></div>
        </Button>
      </Popover>
    </div>
  );
}
