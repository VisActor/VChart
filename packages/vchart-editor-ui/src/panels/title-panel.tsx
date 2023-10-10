import type { ITitlePanelProps } from '../typings/panel';
import { titleDefaultProps } from '../config/panel';
import { CustomPanel } from './custom-panel';

const sectionComponentMaps = {
  title: {
    text: 'input',
    fontSize: 'fontSize',
    fontFamily: 'fontFamily',
    fontStyle: 'fontStyle',
    color: 'color'
  },
  subTitle: {
    display: 'switch',
    text: 'input',
    fontSize: 'fontSize',
    fontFamily: 'fontFamily',
    fontStyle: 'fontStyle',
    color: 'color'
  },
  align: {
    position: 'select',
    textAlign: 'textAlign'
  }
};

export function TitlePanel(props: ITitlePanelProps) {
  const label = props.label ?? titleDefaultProps.label;
  const sections = props.sections ?? titleDefaultProps.sections;

  return (
    <CustomPanel
      label={label}
      sections={sections as any}
      sectionComponentMaps={sectionComponentMaps}
      className={props.className}
      style={props.style}
      onChange={props.onChange}
      onRefresh={props.onRefresh}
    />
  );
}
