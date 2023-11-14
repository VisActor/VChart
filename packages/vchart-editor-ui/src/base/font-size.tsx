import { InputNumber, Slider } from '@douyinfe/semi-ui';
import { isArray, isValid } from '@visactor/vutils';
import type { IBaseFontSizeComponentProps } from '../typings/base';
import { defaultBaseComponentConfig } from '../config/base';
import { tooltipWrapper } from '../utils/node';

export function FontSize(props: IBaseFontSizeComponentProps) {
  const label = props.label ?? defaultBaseComponentConfig.fontSize.label;
  const min = props.config?.min ?? defaultBaseComponentConfig.fontSize.min;
  const max = props.config?.max ?? defaultBaseComponentConfig.fontSize.max;

  return (
    <div className="vchart-editor-ui-panel-base-container">
      {tooltipWrapper(<p className="vchart-editor-ui-panel-base-label">{label}</p>, props.tooltip)}
      <Slider
        value={props.fontSize}
        min={min}
        max={max}
        onChange={value => {
          const finalValue = isArray(value) ? value[0] : value;
          props.onChange?.(finalValue);
        }}
        style={{ width: 160 }}
      ></Slider>
      <InputNumber
        value={props.fontSize}
        min={min}
        max={max}
        onChange={value => {
          const singleValue = isArray(value) ? value[0] : value;
          const finalValue = !isValid(singleValue) || singleValue === '' ? null : singleValue;
          props.onChange?.(finalValue);
        }}
      />
    </div>
  );
}
