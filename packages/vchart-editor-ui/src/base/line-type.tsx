import { Select as SemiSelect } from '@douyinfe/semi-ui';
import type { IBaseLineTypeComponentProps } from '../typings/base';
import { defaultBaseComponentConfig } from '../config/base';
import { tooltipWrapper } from '../utils/node';
import { IconDashedLine, IconLine, IconThinDashedLine } from '../svg/line';

const defaultLineTypes = [
  { value: 'line', icon: IconLine },
  { value: 'dashedLine', icon: IconDashedLine },
  { value: 'thinDashedLine', icon: IconThinDashedLine }
];

export function LineType(props: IBaseLineTypeComponentProps) {
  const label = props.label ?? defaultBaseComponentConfig.select.label;
  const lineType = props.lineType ?? 'line';

  return (
    <div className="vchart-editor-ui-panel-base-container">
      {tooltipWrapper(<p className="vchart-editor-ui-panel-base-label">{label}</p>, props.tooltip)}
      <SemiSelect
        defaultValue={lineType}
        onChange={value => {
          props.onChange?.(value);
        }}
      >
        {defaultLineTypes.map(lineTypeOption => {
          const Icon = lineTypeOption.icon;
          return (
            <SemiSelect.Option key={lineTypeOption.value} value={lineTypeOption.value}>
              <div className="vchart-editor-ui-panel-line-type-container">
                <Icon style={lineTypeOption.value === 'thinDashedLine' ? { width: 25, height: 20 } : {}} />
              </div>
            </SemiSelect.Option>
          );
        })}
      </SemiSelect>
    </div>
  );
}
