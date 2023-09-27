import type { IAxisPanelProps } from '../typings/panel';
import { axisDefaultProps } from '../config/panel';
import { EditorHeader } from '../base/editor-header';
import { useState } from 'react';
import { generateSection } from './custom-panel';

const axisLabelComponentMap = {
  fontSize: 'fontSize',
  fontFamily: 'fontFamily',
  fontStyle: 'fontStyle',
  color: 'color'
};

const axisDomainComponentMap = {
  lineWidth: 'sliderNumber',
  dashInterval: 'sliderNumber',
  strokeColor: 'color'
};

export function AxisPanel(props: IAxisPanelProps) {
  const label = props.label ?? axisDefaultProps.label;
  const sections = props.sections ?? axisDefaultProps.sections;

  const [collapsed, setCollapsed] = useState<boolean>(true);

  return (
    <div className="vchart-editor-ui-panel-container">
      <EditorHeader label={label} collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} />
      <div className="vchart-editor-ui-panel-collapse-container" style={{ height: collapsed ? 0 : 'auto' }}>
        {generateSection(sections.label, 'label', props.onChange, axisLabelComponentMap)}
        {generateSection(sections.domain, 'domain', props.onChange, axisDomainComponentMap)}
      </div>
    </div>
  );
}
