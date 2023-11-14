import { InputNumber } from '@douyinfe/semi-ui';
import { isArray, isValid } from '@visactor/vutils';
import type { IBaseSliderNumberComponentProps } from '../typings/base';
import { defaultBaseComponentConfig } from '../config/base';
import { tooltipWrapper } from '../utils/node';

export function Number(props: IBaseSliderNumberComponentProps) {
  const label = props.label ?? defaultBaseComponentConfig.sliderNumber.label;
  const unit = props.config?.unit ?? defaultBaseComponentConfig.sliderNumber.unit;
  const step = props.config?.step ?? defaultBaseComponentConfig.sliderNumber.step;

  return (
    <div className="vchart-editor-ui-panel-base-container">
      {tooltipWrapper(<p className="vchart-editor-ui-panel-base-label">{label}</p>, props.tooltip)}
      <InputNumber
        value={props.value}
        step={step}
        onChange={value => {
          const singleValue = isArray(value) ? value[0] : value;
          const finalValue = !isValid(singleValue) || singleValue === '' ? null : singleValue;
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
