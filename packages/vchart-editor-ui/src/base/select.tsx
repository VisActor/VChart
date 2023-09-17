import { useState } from 'react';
import { Select as SemiSelect } from '@douyinfe/semi-ui';
import type { IBaseSelectComponentProps } from '../typings/base';
import { defaultBaseComponentConfig } from '../config/base';

export function Select(props: IBaseSelectComponentProps) {
  const label = props.label ?? defaultBaseComponentConfig.select.label;
  const defaultValue = props.value ?? defaultBaseComponentConfig.select.default;
  const selectOptions = props.config?.options ?? defaultBaseComponentConfig.select.options;
  const [value, setValue] = useState<string>(defaultValue);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <p>{label}</p>
      <SemiSelect
        defaultValue={value}
        style={{ width: 180 }}
        optionList={selectOptions}
        onChange={value => {
          setValue(value as string);
          props.onChange?.(value);
        }}
      ></SemiSelect>
    </div>
  );
}
