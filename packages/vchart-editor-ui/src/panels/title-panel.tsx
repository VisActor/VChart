import type { ITitleComponentProps } from '../typings/panel';
import { titleDefaultProps } from '../config/panel';
import { EditorHeader } from '../base/editor-header';
import { useState } from 'react';
import { generateSection } from './custom-panel';

const titleComponentMap = {
  display: 'switch',
  text: 'input',
  fontSize: 'sliderNumber',
  fontFamily: 'fontFamily',
  fontStyle: 'fontStyle',
  color: 'color'
};

const alignComponentMap = {
  position: 'select',
  textAlign: 'textAlign'
};

export function TitlePanel(props: ITitleComponentProps) {
  const label = props.label ?? titleDefaultProps.label;
  const sections = props.sections ?? titleDefaultProps.sections;

  const [collapsed, setCollapsed] = useState<boolean>(true);

  return (
    <div className="vchart-editor-ui-panel-container">
      <EditorHeader label={label} collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} />
      <div className="vchart-editor-ui-panel-collapse-container" style={{ height: collapsed ? 0 : 'auto' }}>
        {generateSection(sections.title, 'title', props.onChange, titleComponentMap)}
        {generateSection(sections.subTitle, 'subTitle', props.onChange, titleComponentMap)}
        {generateSection(sections.align, 'align', props.onChange, alignComponentMap)}
      </div>
    </div>
  );
}
