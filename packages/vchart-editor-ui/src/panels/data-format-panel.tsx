import type { IDataFormatPanelProps } from '../typings/panel';
import { dataFormatDefaultProps } from '../config/panel';
import { CustomPanel } from './custom-panel';

const sectionComponentMaps = {
  format: {
    unit: 'select',
    fixed: 'sliderNumber',
    thousandsSeparator: 'switch'
  }
};

export function DataFormatPanel(props: IDataFormatPanelProps) {
  const label = props.label ?? dataFormatDefaultProps.label;
  const sections = props.sections ?? dataFormatDefaultProps.sections;

  return (
    <CustomPanel
      label={label}
      sections={sections as any}
      sectionComponentMaps={sectionComponentMaps}
      style={props.style}
    />
  );
}
