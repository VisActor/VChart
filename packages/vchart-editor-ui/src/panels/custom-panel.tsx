import type {
  ComponentConfig,
  IColorComponentConfig,
  IFontFamilyComponentConfig,
  IFontSizeComponentConfig,
  IFontStyleComponentConfig,
  IInputComponentConfig,
  ISelectComponentConfig,
  ISliderNumberComponentConfig,
  ISwitchComponentConfig,
  ITextAlignComponentConfig
} from '../typings/config';
import type { ICustomPanelProps, IPanelSection } from '../typings/panel';
import { isNil } from '@visactor/vutils';
import { Color } from '../base/color';
import { FontFamily } from '../base/font-family';
import { FontStyle } from '../base/font-style';
import { Input } from '../base/input';
import { Select } from '../base/select';
import { SliderNumber } from '../base/slider-number';
import { Switch } from '../base/switch';
import { TextAlign } from '../base/text-align';
import { PanelTitle } from '../base/panel-title';
import React, { useState } from 'react';
import { EditorHeader } from '../base/editor-header';
import { FontSize } from '../base/font-size';

export function generateEntry(
  section: string,
  entry: ComponentConfig,
  onChange: (entryType: string, key: string, value: any) => void,
  componentKey: string,
  postKey?: string | number
) {
  switch (componentKey) {
    case 'input':
      return (
        <Input
          key={`${entry.key}-${postKey ?? 0}`}
          label={entry.label}
          value={(entry as IInputComponentConfig).default}
          onChange={value => onChange?.(section, entry.key, value)}
          config={entry as IInputComponentConfig}
        />
      );
    case 'select':
      return (
        <Select
          key={`${entry.key}-${postKey ?? 0}`}
          label={entry.label}
          value={(entry as ISelectComponentConfig).default}
          onChange={value => onChange?.(section, entry.key, value)}
          config={entry as ISelectComponentConfig}
        />
      );
    case 'switch':
      return (
        <Switch
          key={`${entry.key}-${postKey ?? 0}`}
          label={entry.label}
          value={(entry as ISwitchComponentConfig).default}
          onChange={value => onChange?.(section, entry.key, value)}
          config={entry as ISwitchComponentConfig}
        />
      );

    case 'sliderNumber':
      return (
        <SliderNumber
          key={`${entry.key}-${postKey ?? 0}`}
          label={entry.label}
          value={(entry as ISliderNumberComponentConfig).default}
          onChange={value => onChange?.(section, entry.key, value)}
          config={entry as ISliderNumberComponentConfig}
        />
      );
    case 'color':
      return (
        <Color
          key={`${entry.key}-${postKey ?? 0}`}
          label={entry.label}
          color={(entry as IColorComponentConfig).default}
          onChange={value => onChange?.(section, entry.key, value)}
          config={entry as IColorComponentConfig}
        />
      );
    case 'fontFamily':
      return (
        <FontFamily
          key={`${entry.key}-${postKey ?? 0}`}
          label={entry.label}
          fontFamily={(entry as IFontFamilyComponentConfig).default}
          onChange={value => onChange?.(section, entry.key, value)}
          config={entry as IFontFamilyComponentConfig}
        />
      );
    case 'fontSize':
      return (
        <FontSize
          key={`${entry.key}-${postKey ?? 0}`}
          label={entry.label}
          fontSize={(entry as IFontSizeComponentConfig).default}
          onChange={value => onChange?.(section, entry.key, value)}
          config={entry as IFontSizeComponentConfig}
        />
      );
    case 'fontStyle':
      return (
        <FontStyle
          key={`${entry.key}-${postKey ?? 0}`}
          label={entry.label}
          bolder={(entry as IFontStyleComponentConfig).default?.bold}
          underline={(entry as IFontStyleComponentConfig).default?.underline}
          italic={(entry as IFontStyleComponentConfig).default?.italic}
          onChange={value => onChange?.(section, entry.key, value)}
          config={entry as IFontStyleComponentConfig}
        />
      );
    case 'textAlign':
      return (
        <TextAlign
          key={`${entry.key}-${postKey ?? 0}`}
          label={entry.label}
          textAlign={(entry as ITextAlignComponentConfig).default}
          onChange={value => onChange?.(section, entry.key, value)}
          config={entry as ITextAlignComponentConfig}
        />
      );
  }
  return null;
}

export function generateEntries(
  section: string,
  entries: ComponentConfig[],
  onChange: (entryType: string, key: string, value: any) => void,
  componentMap?: Record<string, string>
) {
  return entries.map((entry, index) => {
    if (!componentMap) {
      return generateEntry(section, entry, onChange, entry.key, index);
    }
    const componentKey = componentMap[entry.key];
    return componentKey ? generateEntry(section, entry, onChange, componentKey, index) : null;
  });
}

export function generateSection(
  section: IPanelSection,
  sectionKey: string,
  onChange: (entryType: string, key: string, value: any) => void,
  componentMap?: Record<string, string>
) {
  return section ? (
    <>
      {!isNil(section.label) ? <PanelTitle label={section.label} /> : null}
      {generateEntries(sectionKey, section.entries, onChange, componentMap)}
    </>
  ) : null;
}

export function CustomPanel(props: ICustomPanelProps) {
  const label = props.label ?? '';
  const sections = props.sections ?? {};

  const [collapsed, setCollapsed] = useState<boolean>(true);

  return (
    <div className="vchart-editor-ui-panel-container">
      <EditorHeader label={label} collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} />
      <div className="vchart-editor-ui-panel-collapse-container" style={{ height: collapsed ? 0 : 'auto' }}>
        {Object.keys(sections).map(section => {
          return (
            <React.Fragment key={section}>
              {generateSection(sections[section], section, props.onChange, props.componentMap)}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
