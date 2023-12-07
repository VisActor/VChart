import { Divider, Switch } from '@douyinfe/semi-ui';
import type { IEditorHeaderProps } from '../typings/base';
import { defaultBaseComponentConfig } from '../config/base';
import { IconTriangleDown, IconTriangleUp } from '@douyinfe/semi-icons';
import { isBoolean } from '@visactor/vutils';
import { tooltipWrapper } from '../utils/node';
import { IconAnchor } from '../svg/anchor';

export function EditorHeader(props: IEditorHeaderProps) {
  const label = props.label ?? defaultBaseComponentConfig.switch.label;
  const collapsed = props.collapsed ?? true;

  return (
    <>
      <IconAnchor style={{ height: 20, position: 'absolute' }} />
      <div
        className="vchart-editor-ui-panel-header"
        // hack for chart editor
        style={{ marginBottom: collapsed ? 8 : 0 }}
      >
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {/* {enableChecked ? (
            <Checkbox
              checked={checked}
              onChange={() => props?.onCheck?.(!checked)}
              className="vchart-editor-ui-panel-title"
              style={{ marginRight: 8 }}
            >
              {tooltipWrapper(label, props.tooltip)}
            </Checkbox>
          ) : (
            <span className="vchart-editor-ui-panel-title">{tooltipWrapper(label, props.tooltip)}</span>
          )} */}
          {tooltipWrapper(<span className="vchart-editor-ui-panel-title">{label}</span>, props.tooltip)}
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
              <IconTriangleDown className="vchart-editor-ui-title-collapsed-triangle" style={{ rotate: '0deg' }} />
            ) : (
              <IconTriangleDown className="vchart-editor-ui-title-collapsed-triangle" style={{ rotate: '90deg' }} />
            )}
          </span>
        </span>

        {isBoolean(props.enabled) ? (
          <Switch
            size="small"
            checked={props.enabled}
            onChange={value => {
              props.onEnabled?.(value);
              if (value && !collapsed) {
                props.onCollapse?.(true);
              }
              if (!value && collapsed) {
                props.onCollapse?.(false);
              }
            }}
          ></Switch>
        ) : null}
      </div>
      {collapsed ? <Divider /> : null}
    </>
  );
}
