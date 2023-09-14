import { useState } from 'react';
import { InputNumber, Slider } from '@douyinfe/semi-ui';
import { isArray, merge } from '@visactor/vutils';
import type { IBaseFontSizeComponentProps } from '../typings/base';
import { defaultBaseComponentConfig } from '../config/base';

export function FontSize(props: IBaseFontSizeComponentProps) {
  const config = merge({}, defaultBaseComponentConfig.fontSize ?? {}, props.config ?? {});

  const defaultFontSize = props.fontSize ?? config.value.default;
  const minFontSize = props.min ?? config.value.min;
  const maxFontSize = props.max ?? config.value.max;
  const [fontSize, setFontSize] = useState<number>(defaultFontSize);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <p>{config.label}</p>
      <Slider
        value={fontSize}
        min={minFontSize}
        max={maxFontSize}
        onChange={fontSize => {
          const finalFontSize = isArray(fontSize) ? fontSize[0] : fontSize;
          setFontSize(finalFontSize);
          props.onChange?.(finalFontSize);
        }}
        style={{ width: 200 }}
      ></Slider>
      <InputNumber
        value={fontSize}
        min={minFontSize}
        max={maxFontSize}
        onChange={fontSize => {
          const finalFontSize = isArray(fontSize) ? fontSize[0] : fontSize;
          setFontSize(finalFontSize);
          props.onChange?.(finalFontSize);
        }}
      />
    </div>
  );
}
