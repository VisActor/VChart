import type { ITitlePanelProps } from '../typings/panel';
import { titleDefaultProps } from '../config/panel';
import { EditorHeader } from '../base/editor-header';
import { useState } from 'react';
import { generateSection } from './custom-panel';

const titleLabelComponentMap = {
  display: 'switch',
  text: 'input',
  fontSize: 'fontSize',
  fontFamily: 'fontFamily',
  fontStyle: 'fontStyle',
  color: 'color'
};

const titleAlignComponentMap = {
  position: 'select',
  textAlign: 'textAlign'
};

export function TitlePanel(props: ITitlePanelProps) {
  const label = props.label ?? titleDefaultProps.label;
  const sections = props.sections ?? titleDefaultProps.sections;

  const [collapsed, setCollapsed] = useState<boolean>(true);

  return (
    <div className="vchart-editor-ui-panel-container">
      <EditorHeader label={label} collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} />
      <div className="vchart-editor-ui-panel-collapse-container" style={{ height: collapsed ? 0 : 'auto' }}>
        {generateSection(sections.title, 'title', props.onChange, titleLabelComponentMap)}
        {generateSection(sections.subTitle, 'subTitle', props.onChange, titleLabelComponentMap)}
        {generateSection(sections.align, 'align', props.onChange, titleAlignComponentMap)}
      </div>
    </div>
  );
}
