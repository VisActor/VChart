import type { IDataFormatPanelProps } from '../typings/panel';
import { dataFormatDefaultProps } from '../config/panel';
import { EditorHeader } from '../base/editor-header';
import { useState } from 'react';
import { generateSection } from './custom-panel';

const dataFormatComponentMap = {
  unit: 'select',
  fixed: 'sliderNumber',
  thousandsSeparator: 'switch'
};

export function DataFormatPanel(props: IDataFormatPanelProps) {
  const label = props.label ?? dataFormatDefaultProps.label;
  const sections = props.sections ?? dataFormatDefaultProps.sections;

  const [collapsed, setCollapsed] = useState<boolean>(true);

  return (
    <div className="vchart-editor-ui-panel-container">
      <EditorHeader label={label} collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} />
      <div className="vchart-editor-ui-panel-collapse-container" style={{ height: collapsed ? 0 : 'auto' }}>
        {generateSection(sections.format, 'format', props.onChange, dataFormatComponentMap)}
      </div>
    </div>
  );
}
