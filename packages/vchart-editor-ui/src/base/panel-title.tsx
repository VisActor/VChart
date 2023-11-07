import { Divider } from '@douyinfe/semi-ui';
import type { IPanelTitleProps } from '../typings/base';
import { tooltipWrapper } from '../utils/node';

export function PanelTitle(props: IPanelTitleProps) {
  return (
    <div>
      {tooltipWrapper(<span className="vchart-editor-ui-panel-title">{props.label}</span>, props.tooltip)}
      <Divider margin="12px" />
    </div>
  );
}
