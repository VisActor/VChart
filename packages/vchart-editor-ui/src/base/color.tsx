import { SketchPicker } from 'react-color';
import { RGB } from '@visactor/vutils';
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
              const rgba = new RGB(color.rgb.r, color.rgb.g, color.rgb.b, color.rgb.a);
              props.onChange?.(rgba.formatHex());
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
