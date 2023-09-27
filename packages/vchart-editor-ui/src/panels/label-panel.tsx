import type { ILabelPanelProps } from '../typings/panel';
import { labelDefaultProps } from '../config/panel';
import { EditorHeader } from '../base/editor-header';
import { useState } from 'react';
import { generateSection } from './custom-panel';

const labelComponentMap = {
  fontSize: 'fontSize',
  fontFamily: 'fontFamily',
  fontStyle: 'fontStyle',
  color: 'color'
};

export function LabelPanel(props: ILabelPanelProps) {
  const label = props.label ?? labelDefaultProps.label;
  const sections = props.sections ?? labelDefaultProps.sections;

  const [collapsed, setCollapsed] = useState<boolean>(true);

  return (
    <div className="vchart-editor-ui-panel-container">
      <EditorHeader label={label} collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} />
      <div className="vchart-editor-ui-panel-collapse-container" style={{ height: collapsed ? 0 : 'auto' }}>
        {generateSection(sections.label, 'label', props.onChange, labelComponentMap)}
      </div>
    </div>
  );
}
