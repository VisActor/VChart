import { Checkbox } from '@douyinfe/semi-ui';
import type { IEditorHeaderProps } from '../typings/base';
import { defaultBaseComponentConfig } from '../config/base';
import { IconRefresh, IconTriangleDown, IconTriangleUp } from '@douyinfe/semi-icons';

export function EditorHeader(props: IEditorHeaderProps) {
  const label = props.label ?? defaultBaseComponentConfig.switch.label;

  const checked = props.checked ?? true;
  const collapsed = props.collapsed ?? false;

  return (
    <div className="vchart-editor-ui-panel-header">
      <span style={{ display: 'flex', alignItems: 'center' }}>
        <Checkbox
          checked={checked}
          onChange={() => props?.onCheck?.(!checked)}
          className="vchart-editor-ui-panel-title"
          style={{ marginRight: 8 }}
        >
          {label}
        </Checkbox>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 16,
            height: 16,
            cursor: 'pointer'
          }}
          onClick={() => props?.onCollapse?.(!props.collapsed)}
        >
          {collapsed ? (
            <IconTriangleUp style={{ fontSize: '10px' }} />
          ) : (
            <IconTriangleDown style={{ fontSize: '10px' }} />
          )}
        </span>
      </span>
      <IconRefresh onClick={() => props?.onRefresh?.()} style={{ cursor: 'pointer', float: 'right' }} />
    </div>
  );
}
