import { Divider } from '@douyinfe/semi-ui';
import type { IPanelTitleProps } from '../typings/base';

export function PanelTitle(props: IPanelTitleProps) {
  return (
    <div>
      <span className="vchart-editor-ui-panel-title">{props.label}</span>
      <Divider margin="12px" />
    </div>
  );
}
