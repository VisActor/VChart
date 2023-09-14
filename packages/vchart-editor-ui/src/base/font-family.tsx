import { useState } from 'react';
import { Select } from '@douyinfe/semi-ui';
import type { IBaseFontFamilyComponentProps } from '../typings/base';
import { defaultBaseComponentConfig } from '../config/base';

export function FontFamily(props: IBaseFontFamilyComponentProps) {
  const label = props.label ?? defaultBaseComponentConfig.fontFamily.label;
  const defaultFontFamily = props.fontFamily ?? defaultBaseComponentConfig.fontFamily.default;
  const fontFamilyOptions = props.config?.options ?? defaultBaseComponentConfig.fontFamily.options;
  const [fontFamily, setFontFamily] = useState<string>(defaultFontFamily);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <p>{label}</p>
      <Select
        defaultValue={fontFamily}
        style={{ width: 180 }}
        optionList={fontFamilyOptions}
        onChange={fontFamily => {
          setFontFamily(fontFamily as string);
          props.onChange?.(fontFamily);
        }}
      ></Select>
    </div>
  );
}
