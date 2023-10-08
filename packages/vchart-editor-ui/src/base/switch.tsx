import { Switch as SemiSwitch } from '@douyinfe/semi-ui';
import type { IBaseSwitchComponentProps } from '../typings/base';
import { defaultBaseComponentConfig } from '../config/base';

export function Switch(props: IBaseSwitchComponentProps) {
  const label = props.label ?? defaultBaseComponentConfig.switch.label;

  return (
    <div className="vchart-editor-ui-panel-base-container" style={{ justifyContent: 'space-between' }}>
      <p className="vchart-editor-ui-panel-base-label">{label}</p>
      <SemiSwitch
        defaultChecked={props.value}
        checked={props.value}
        onChange={value => {
          props.onChange?.(value);
        }}
      ></SemiSwitch>
    </div>
  );
}
