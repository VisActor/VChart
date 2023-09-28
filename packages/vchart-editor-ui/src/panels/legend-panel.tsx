import type { ILegendPanelProps } from '../typings/panel';
import { legendDefaultProps } from '../config/panel';
import { EditorHeader } from '../base/editor-header';
import { useState } from 'react';
import { generateSection } from './custom-panel';

const legendAlignComponentMap = {
  position: 'select',
  textAlign: 'textAlign'
};

const legendLabelComponentMap = {
  maxLine: 'sliderNumber',
  fontSize: 'fontSize',
  fontFamily: 'fontFamily',
  fontStyle: 'fontStyle',
  color: 'color'
};

export function LegendPanel(props: ILegendPanelProps) {
  const label = props.label ?? legendDefaultProps.label;
  const sections = props.sections ?? legendDefaultProps.sections;

  const [collapsed, setCollapsed] = useState<boolean>(true);

  return (
    <div className="vchart-editor-ui-panel-container">
      <EditorHeader label={label} collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} />
      <div className="vchart-editor-ui-panel-collapse-container" style={{ height: collapsed ? 0 : 'auto' }}>
        {generateSection(sections.align, 'align', props.onChange, legendAlignComponentMap)}
        {generateSection(sections.label, 'label', props.onChange, legendLabelComponentMap)}
      </div>
    </div>
  );
}
