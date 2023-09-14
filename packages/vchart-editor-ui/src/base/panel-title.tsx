import { Divider } from '@douyinfe/semi-ui';
import type { IPanelTitleProps } from '../typings/base';

export function PanelTitle(props: IPanelTitleProps) {
  return (
    <div>
      <span>{props.label}</span>
      <Divider margin="12px" />
    </div>
  );
}
