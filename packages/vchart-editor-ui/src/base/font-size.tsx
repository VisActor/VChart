import { useState } from 'react';
import { InputNumber, Slider } from '@douyinfe/semi-ui';
import { isArray } from '@visactor/vutils';
import type { IBaseFontSizeComponentProps } from '../typings/base';
import { defaultBaseComponentConfig } from '../config/base';

export function FontSize(props: IBaseFontSizeComponentProps) {
  const label = props.label ?? defaultBaseComponentConfig.fontSize.label;
  const defaultFontSize = props.fontSize ?? defaultBaseComponentConfig.fontSize.default;
  const min = props.config?.min ?? defaultBaseComponentConfig.fontSize.min;
  const max = props.config?.max ?? defaultBaseComponentConfig.fontSize.max;
  const [fontSize, setFontSize] = useState<number>(defaultFontSize);

  return (
    <div className="vchart-editor-ui-panel-base-container">
      <p className="vchart-editor-ui-panel-base-label">{label}</p>
      <Slider
        value={fontSize}
        min={min}
        max={max}
        onChange={value => {
          const finalValue = isArray(value) ? value[0] : value;
          setFontSize(finalValue);
          props.onChange?.(finalValue);
        }}
        style={{ width: 200 }}
      ></Slider>
      <InputNumber
        value={fontSize}
        min={min}
        max={max}
        onChange={value => {
          const finalValue = isArray(value) ? value[0] : value;
          setFontSize(finalValue);
          props.onChange?.(finalValue);
        }}
      />
    </div>
  );
}
