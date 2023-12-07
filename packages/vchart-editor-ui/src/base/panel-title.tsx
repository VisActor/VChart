import { Switch } from '@douyinfe/semi-ui';
import type { IPanelTitleProps } from '../typings/base';
import { tooltipWrapper } from '../utils/node';
import { IconTriangleDown, IconTriangleUp } from '@douyinfe/semi-icons';
import { isBoolean } from '@visactor/vutils';

export function PanelTitle(props: IPanelTitleProps) {
  const collapsed = props.collapsed ?? true;

  return (
    <div
      className="vchart-editor-ui-panel-title-container"
      // hack for chart editor
      style={{ marginBottom: collapsed ? 8 : 0, justifyContent: 'space-between' }}
    >
      <div style={{ display: 'flex' }}>
        {tooltipWrapper(<span className="vchart-editor-ui-panel-title">{props.label}</span>, props.tooltip)}
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
            <IconTriangleDown className="title-collapsed-triangle" style={{ rotate: '0deg' }} />
          ) : (
            <IconTriangleDown className="title-collapsed-triangle" style={{ rotate: '90deg' }} />
          )}
        </span>
      </div>

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
  );
}
