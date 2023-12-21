import { Select } from '@douyinfe/semi-ui';
import type { IBaseFontFamilyComponentProps } from '../typings/base';
import { defaultBaseComponentConfig } from '../config/base';
import { tooltipWrapper } from '../utils/node';

export function FontFamily(props: IBaseFontFamilyComponentProps) {
  const label = props.label ?? defaultBaseComponentConfig.fontFamily.label;
  const fontFamilyOptions = props.config?.options ?? defaultBaseComponentConfig.fontFamily.options;

  return (
    <div className="vchart-editor-ui-panel-base-container">
      {tooltipWrapper(<p className="vchart-editor-ui-panel-base-label">{label}</p>, props.tooltip)}
      <Select
        value={props.fontFamily}
        style={{ width: 180 }}
        optionList={fontFamilyOptions}
        onChange={fontFamily => {
          props.onChange?.(fontFamily);
        }}
      ></Select>
    </div>
  );
}