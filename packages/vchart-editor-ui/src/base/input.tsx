import { TextArea } from '@douyinfe/semi-ui';
import type { IBaseInputComponentProps } from '../typings/base';
import { defaultBaseComponentConfig } from '../config/base';

export function Input(props: IBaseInputComponentProps) {
  const placeholder = props.config?.placeholder ?? defaultBaseComponentConfig.input.placeholder;

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <TextArea
        defaultValue={props.value}
        placeholder={placeholder}
        style={{ width: 200, height: 50 }}
        onChange={value => {
          props.onChange?.(value);
        }}
      />
    </div>
  );
}
