import { TextArea, Input as SemiInput } from '@douyinfe/semi-ui';
import type { IBaseInputComponentProps } from '../typings/base';
import { defaultBaseComponentConfig } from '../config/base';
import { tooltipWrapper } from '../utils/node';

export function Input(props: IBaseInputComponentProps) {
  const placeholder = props.config?.placeholder ?? defaultBaseComponentConfig.input.placeholder;
  const singleline = props.config?.singleline ?? false;
  const trigger = props.config?.trigger ?? 'change';

  return (
    <div className="vchart-editor-ui-panel-base-container">
      {singleline ? (
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          {tooltipWrapper(<p className="vchart-editor-ui-panel-base-label">{props.label}</p>, props.tooltip)}
          <SemiInput
            style={{ maxWidth: 200 }}
            defaultValue={props.value}
            placeholder={placeholder}
            onChange={value => {
              if (trigger === 'change') {
                props.onChange?.(value);
              }
            }}
            onBlur={e => {
              if (trigger === 'blur') {
                props.onChange?.((e.target as HTMLInputElement).value);
              }
            }}
          />
        </div>
      ) : (
        <TextArea
          defaultValue={props.value}
          placeholder={placeholder}
          rows={2}
          style={{ width: '100%' }}
          onChange={value => {
            if (trigger === 'change') {
              props.onChange?.(value);
            }
          }}
          onBlur={e => {
            if (trigger === 'blur') {
              props.onChange?.((e.target as HTMLInputElement).value);
            }
          }}
        />
      )}
    </div>
  );
}
