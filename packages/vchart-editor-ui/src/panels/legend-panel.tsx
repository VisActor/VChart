import type { ILegendPanelProps } from '../typings/panel';
import { legendDefaultProps } from '../config/panel';
import { CustomPanel } from './custom-panel';

const sectionComponentMaps = {
  align: {
    position: 'select',
    textAlign: 'textAlign'
  },
  label: {
    maxLine: 'sliderNumber',
    fontSize: 'fontSize',
    fontFamily: 'fontFamily',
    fontStyle: 'fontStyle',
    color: 'color'
  }
};

export function LegendPanel(props: ILegendPanelProps) {
  const label = props.label ?? legendDefaultProps.label;
  const sections = props.sections ?? legendDefaultProps.sections;

  return (
    <CustomPanel
      label={label}
      sections={sections as any}
      sectionComponentMaps={sectionComponentMaps}
      style={props.style}
    />
  );
}
