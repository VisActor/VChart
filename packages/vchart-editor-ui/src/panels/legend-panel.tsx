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
      className={props.className}
      style={props.style}
      defaultCollapsed={props.defaultCollapsed}
      enabled={props.enabled}
      onEnabled={props.onEnabled}
      onChange={props.onChange}
      onRefresh={props.onRefresh}
    />
  );
}
