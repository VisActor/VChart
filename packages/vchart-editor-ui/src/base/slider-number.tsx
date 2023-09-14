import { useState } from 'react';
import { InputNumber, Slider } from '@douyinfe/semi-ui';
import { isArray, merge } from '@visactor/vutils';
import type { IBaseFontSizeComponentProps } from '../typings/base';
import { defaultBaseComponentConfig } from '../config/base';

export function SliderNumber(props: IBaseFontSizeComponentProps) {
  const config = merge({}, defaultBaseComponentConfig.fontSize ?? {}, props.config ?? {});

  const defaultFontSize = props.fontSize ?? config.value.default;
  const minFontSize = props.min ?? config.value.min;
  const maxFontSize = props.max ?? config.value.max;
  const [value, setValue] = useState<number>(defaultFontSize);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <p>{config.label}</p>
      <Slider
        value={value}
        min={minFontSize}
        max={maxFontSize}
        onChange={fontSize => {
          const finalFontSize = isArray(fontSize) ? fontSize[0] : fontSize;
          setValue(finalFontSize);
          props.onChange?.(finalFontSize);
        }}
        style={{ width: 200 }}
      ></Slider>
      <InputNumber
        value={value}
        min={minFontSize}
        max={maxFontSize}
        onChange={fontSize => {
          const finalFontSize = isArray(fontSize) ? fontSize[0] : fontSize;
          setValue(finalFontSize);
          props.onChange?.(finalFontSize);
        }}
      />
    </div>
  );
}
