import { useState } from 'react';
import { Select } from '@douyinfe/semi-ui';
import { merge } from '@visactor/vutils';
import type { IBaseFontFamilyComponentProps } from '../typings/base';
import { defaultBaseComponentConfig } from '../config/base';

export function FontFamily(props: IBaseFontFamilyComponentProps) {
  const config = merge({}, defaultBaseComponentConfig.fontFamily ?? {}, props.config ?? {});

  const defaultFontFamily = props.fontFamily ?? config.defaultFontFamily;
  const [fontFamily, setFontFamily] = useState<string>(defaultFontFamily);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <p>{config.label}</p>
      <Select
        defaultValue={fontFamily}
        style={{ width: 180 }}
        optionList={config.value.options ?? []}
        onChange={fontFamily => {
          setFontFamily(fontFamily as string);
          props.onChange?.(fontFamily);
        }}
      ></Select>
    </div>
  );
}
