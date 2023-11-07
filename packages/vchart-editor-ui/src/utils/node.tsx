import { Tooltip } from '@douyinfe/semi-ui';
import type React from 'react';

export function tooltipWrapper(node: React.ReactNode, tooltip: string | null | undefined) {
  return tooltip ? (
    <Tooltip content={tooltip}>
      {/* wrap addition div to correctly pass tooltip props to content node */}
      <div style={{ width: 'fit-content', height: 'fit-content' }}>{node}</div>
    </Tooltip>
  ) : (
    node
  );
}
