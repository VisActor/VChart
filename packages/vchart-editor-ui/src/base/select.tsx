import { Select as SemiSelect } from '@douyinfe/semi-ui';
import type { IBaseSelectComponentProps } from '../typings/base';
import { defaultBaseComponentConfig } from '../config/base';
import { tooltipWrapper } from '../utils/node';

export function Select(props: IBaseSelectComponentProps) {
  const label = props.label ?? defaultBaseComponentConfig.select.label;
  const selectOptions = props.config?.options ?? defaultBaseComponentConfig.select.options;

  return (
    <div className="vchart-editor-ui-panel-base-container">
      {tooltipWrapper(<p className="vchart-editor-ui-panel-base-label">{label}</p>, props.tooltip)}
      <SemiSelect
        defaultValue={props.value}
        style={{ width: 180 }}
        optionList={selectOptions}
        onChange={value => {
          props.onChange?.(value);
        }}
      ></SemiSelect>
    </div>
  );
}
