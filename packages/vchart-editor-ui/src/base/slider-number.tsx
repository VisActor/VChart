import { InputNumber, Slider } from '@douyinfe/semi-ui';
import { isArray } from '@visactor/vutils';
import type { IBaseSliderNumberComponentProps } from '../typings/base';
import { defaultBaseComponentConfig } from '../config/base';
import { tooltipWrapper } from '../utils/node';

export function SliderNumber(props: IBaseSliderNumberComponentProps) {
  const label = props.label ?? defaultBaseComponentConfig.sliderNumber.label;
  const min = props.config?.min ?? defaultBaseComponentConfig.sliderNumber.min;
  const max = props.config?.max ?? defaultBaseComponentConfig.sliderNumber.max;
  const unit = props.config?.unit ?? defaultBaseComponentConfig.sliderNumber.unit;
  const step = props.config?.step ?? defaultBaseComponentConfig.sliderNumber.step;

  return (
    <div className="vchart-editor-ui-panel-base-container">
      {tooltipWrapper(<p className="vchart-editor-ui-panel-base-label">{label}</p>, props.tooltip)}
      <Slider
        value={props.value}
        min={min}
        max={max}
        step={step}
        onChange={value => {
          const finalValue = isArray(value) ? value[0] : value;
          props.onChange?.(finalValue);
        }}
        style={{ width: 160 }}
      ></Slider>
      <InputNumber
        value={props.value}
        min={min}
        max={max}
        step={step}
        onChange={value => {
          const finalValue = isArray(value) ? value[0] : value;
          props.onChange?.(finalValue);
        }}
        formatter={value => `${value}${unit ?? ''}`}
        parser={value => {
          if (unit) {
            const match = value.match(`${unit}$`);
            if (match) {
              return value.slice(0, match.index);
            }
          }
          return value;
        }}
      />
    </div>
  );
}
