import type { IAxisPanelProps } from '../typings/panel';
import { axisDefaultProps } from '../config/panel';
import { CustomPanel } from './custom-panel';

const sectionComponentMaps = {
  label: {
    fontSize: 'fontSize',
    fontFamily: 'fontFamily',
    fontStyle: 'fontStyle',
    color: 'color'
  },
  domain: {
    lineWidth: 'sliderNumber',
    dashInterval: 'sliderNumber',
    strokeColor: 'color'
  }
};

export function AxisPanel(props: IAxisPanelProps) {
  const label = props.label ?? axisDefaultProps.label;
  const sections = props.sections ?? axisDefaultProps.sections;

  return (
    <CustomPanel
      label={label}
      sections={sections as any}
      sectionComponentMaps={sectionComponentMaps}
      style={props.style}
    />
  );
}
