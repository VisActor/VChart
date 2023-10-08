import { TextArea } from '@douyinfe/semi-ui';
import type { IBaseInputComponentProps } from '../typings/base';
import { defaultBaseComponentConfig } from '../config/base';

export function Input(props: IBaseInputComponentProps) {
  const placeholder = props.config?.placeholder ?? defaultBaseComponentConfig.input.placeholder;

  return (
    <div className="vchart-editor-ui-panel-base-container">
      <TextArea
        defaultValue={props.value}
        placeholder={placeholder}
        onChange={value => {
          props.onChange?.(value);
        }}
        rows={2}
        style={{ width: '100%' }}
      />
    </div>
  );
}
