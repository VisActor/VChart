import { Divider } from '@douyinfe/semi-ui';
import type { IPanelTitleProps } from '../typings/base';
import { tooltipWrapper } from '../utils/node';
import { IconTriangleDown, IconTriangleUp } from '@douyinfe/semi-icons';

export function PanelTitle(props: IPanelTitleProps) {
  const collapsed = props.collapsed ?? true;

  return (
    <div className="vchart-editor-ui-panel-title-container">
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
          <IconTriangleUp style={{ fontSize: '10px' }} />
        ) : (
          <IconTriangleDown style={{ fontSize: '10px' }} />
        )}
      </span>
    </div>
  );
}
