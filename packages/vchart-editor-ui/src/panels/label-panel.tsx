import type { ILabelPanelProps } from '../typings/panel';
import { labelDefaultProps } from '../config/panel';
import { CustomPanel } from './custom-panel';

const sectionComponentMaps = {
  label: {
    fontSize: 'fontSize',
    fontFamily: 'fontFamily',
    fontStyle: 'fontStyle',
    color: 'color'
  }
};

export function LabelPanel(props: ILabelPanelProps) {
  const label = props.label ?? labelDefaultProps.label;
  const sections = props.sections ?? labelDefaultProps.sections;

  return (
    <CustomPanel
      label={label}
      sections={sections as any}
      sectionComponentMaps={sectionComponentMaps}
      style={props.style}
    />
  );
}
