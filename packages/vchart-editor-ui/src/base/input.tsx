import { useState } from 'react';
import { TextArea } from '@douyinfe/semi-ui';
import type { IBaseInputComponentProps } from '../typings/base';
import { defaultBaseComponentConfig } from '../config/base';

export function Input(props: IBaseInputComponentProps) {
  const defaultValue = props.value ?? defaultBaseComponentConfig.input.default;
  const placeholder = props.config?.placeholder ?? defaultBaseComponentConfig.input.placeholder;
  const [value, setValue] = useState<string>(defaultValue);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <TextArea
        defaultValue={value}
        placeholder={placeholder}
        style={{ width: 200, height: 50 }}
        onChange={value => {
          setValue(value);
          props.onChange?.(value);
        }}
      />
    </div>
  );
}
