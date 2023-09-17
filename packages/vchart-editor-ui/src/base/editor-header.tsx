import { Checkbox } from '@douyinfe/semi-ui';
import type { IEditorHeaderProps } from '../typings/base';
import { defaultBaseComponentConfig } from '../config/base';
import { IconRefresh, IconTriangleDown, IconTriangleUp } from '@douyinfe/semi-icons';
import { useState } from 'react';

export function EditorHeader(props: IEditorHeaderProps) {
  const label = props.label ?? defaultBaseComponentConfig.switch.label;

  const checked = props.checked ?? true;
  const collapsed = props.collapsed ?? false;

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Checkbox checked={checked} onChange={event => props?.onCheck?.()}>
        {label}
      </Checkbox>
      {!collapsed ? (
        <IconTriangleUp onClick={() => props?.onCollapse?.()} style={{ cursor: 'pointer' }} />
      ) : (
        <IconTriangleDown onClick={() => props?.onCollapse?.()} style={{ cursor: 'pointer' }} />
      )}
      <IconRefresh onClick={() => props?.onCollapse?.()} style={{ cursor: 'pointer' }} />
    </div>
  );
}
