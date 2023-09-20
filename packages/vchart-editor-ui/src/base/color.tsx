import { useState } from 'react';
import { SketchPicker } from 'react-color';
import type { IBaseColorComponentProps } from '../typings/base';
import { defaultBaseComponentConfig } from '../config/base';
import { Button, Popover } from '@douyinfe/semi-ui';

export function Color(props: IBaseColorComponentProps) {
  const label = props.label ?? defaultBaseComponentConfig.color.label;
  const defaultColor = props.color ?? defaultBaseComponentConfig.color.default;
  const [color, setColor] = useState<string>(defaultColor);

  return (
    <div className="vchart-editor-ui-panel-base-container">
      <p className="vchart-editor-ui-panel-base-label">{label}</p>
      <Popover
        content={
          <SketchPicker
            color={color}
            onChange={color => {
              setColor(color.hex);
              props.onChange?.(color.hex);
            }}
          />
        }
      >
        <Button>
          <div style={{ width: 40, height: 20, backgroundColor: color }}></div>
        </Button>
      </Popover>
    </div>
  );
}
