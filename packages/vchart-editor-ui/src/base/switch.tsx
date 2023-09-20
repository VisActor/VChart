import { useState } from 'react';
import { Switch as SemiSwitch } from '@douyinfe/semi-ui';
import type { IBaseSwitchComponentProps } from '../typings/base';
import { defaultBaseComponentConfig } from '../config/base';

export function Switch(props: IBaseSwitchComponentProps) {
  const label = props.label ?? defaultBaseComponentConfig.switch.label;
  const defaultValue = props.value ?? defaultBaseComponentConfig.switch.default;
  const [value, setValue] = useState<boolean>(defaultValue);

  return (
    <div className="vchart-editor-ui-panel-base-container">
      <p className="vchart-editor-ui-panel-base-label">{label}</p>
      <SemiSwitch
        defaultChecked={value}
        checked={value}
        onChange={value => {
          setValue(value);
          props.onChange?.(value);
        }}
      ></SemiSwitch>
    </div>
  );
}
