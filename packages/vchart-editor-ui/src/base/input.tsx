import { TextArea, Input as SemiInput } from '@douyinfe/semi-ui';
import type { IBaseInputComponentProps } from '../typings/base';
import { defaultBaseComponentConfig } from '../config/base';

export function Input(props: IBaseInputComponentProps) {
  const placeholder = props.config?.placeholder ?? defaultBaseComponentConfig.input.placeholder;
  const singleline = props.config?.singleline ?? false;

  return (
    <div className="vchart-editor-ui-panel-base-container">
      {singleline ? (
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 'bolder' }}>{props.label}</span>
          <SemiInput
            style={{ maxWidth: 200 }}
            defaultValue={props.value}
            placeholder={placeholder}
            onChange={value => {
              props.onChange?.(value);
            }}
          />
        </div>
      ) : (
        <TextArea
          defaultValue={props.value}
          placeholder={placeholder}
          onChange={value => {
            props.onChange?.(value);
          }}
          rows={2}
          style={{ width: '100%' }}
        />
      )}
    </div>
  );
}
