import React, { useState } from 'react';
import { EditorHeader } from '../base/editor-header';
import type { ICustomPanelProps, IPanelSection } from '../typings/panel';
import type {
  ComponentConfig,
  IColorComponentConfig,
  ICustomBaseComponentConfig,
  IFontFamilyComponentConfig,
  IFontSizeComponentConfig,
  IFontStyleComponentConfig,
  IInputComponentConfig,
  ILineTypeComponentConfig,
  INumberComponentConfig,
  IPaletteComponentConfig,
  ISelectComponentConfig,
  IShapeComponentConfig,
  ISliderNumberComponentConfig,
  ISwitchComponentConfig,
  ITextAlignComponentConfig
} from '../typings/config';
import { isNil, merge } from '@visactor/vutils';
import { Color } from '../base/color';
import { FontFamily } from '../base/font-family';
import { FontStyle } from '../base/font-style';
import { Input } from '../base/input';
import { Select } from '../base/select';
import { SliderNumber } from '../base/slider-number';
import { Switch } from '../base/switch';
import { TextAlign } from '../base/text-align';
import { PanelTitle } from '../base/panel-title';
import { FontSize } from '../base/font-size';
import { defaultBaseComponentConfig } from '../config/base';
import { Palette } from '../base/palette';
import { LineType } from '../base/line-type';
import { Shape } from '../base/shape';
import { Number } from '../base/number';
import { Divider } from '@douyinfe/semi-ui';

function generatePanelValue(
  sections: Record<string, IPanelSection>,
  sectionComponentMaps?: Record<string, Record<string, string>>,
  initial?: boolean
) {
  const panelValue = {};
  Object.keys(sections).forEach(sectionKey => {
    panelValue[sectionKey] = {};
    const section = sections[sectionKey];
    const componentMap = sectionComponentMaps?.[sectionKey];
    section.entries.forEach(entry => {
      const componentType = componentMap ? componentMap[entry.key] : entry.key;
      if (initial) {
        panelValue[sectionKey][entry.key] = entry.default ?? defaultBaseComponentConfig[componentType]?.default;
      } else {
        panelValue[sectionKey][entry.key] = entry.value;
      }
    });
  });
  return panelValue;
}

function generateEntry(
  section: string,
  entry: ComponentConfig,
  forcePanelValue: any,
  panelValue: any,
  setPanelValue: (value: any) => void,
  onChange: (entryType: string, key: string, value: any) => void,
  componentKey: string,
  postKey?: string | number
) {
  const CustomComponent = (entry as ICustomBaseComponentConfig).component;
  const value = forcePanelValue?.[section]?.[entry.key] ?? panelValue?.[section]?.[entry.key];
  switch (componentKey) {
    case 'input':
      return (
        <Input
          key={`${entry.key}-${postKey ?? 0}`}
          label={entry.label}
          tooltip={entry.tooltip}
          value={value}
          onChange={value => {
            const newPanelValue = merge({}, panelValue, { [section]: { [entry.key]: value } });
            setPanelValue(newPanelValue);
            onChange?.(section, entry.key, value);
          }}
          config={entry as IInputComponentConfig}
        />
      );
    case 'select':
      return (
        <Select
          key={`${entry.key}-${postKey ?? 0}`}
          label={entry.label}
          tooltip={entry.tooltip}
          value={value}
          onChange={value => {
            const newPanelValue = merge({}, panelValue, { [section]: { [entry.key]: value } });
            setPanelValue(newPanelValue);
            onChange?.(section, entry.key, value);
          }}
          config={entry as ISelectComponentConfig}
        />
      );
    case 'switch':
      return (
        <Switch
          key={`${entry.key}-${postKey ?? 0}`}
          label={entry.label}
          tooltip={entry.tooltip}
          value={value}
          onChange={value => {
            const newPanelValue = merge({}, panelValue, { [section]: { [entry.key]: value } });
            setPanelValue(newPanelValue);
            onChange?.(section, entry.key, value);
          }}
          config={entry as ISwitchComponentConfig}
        />
      );
    case 'number':
      return (
        <Number
          key={`${entry.key}-${postKey ?? 0}`}
          label={entry.label}
          tooltip={entry.tooltip}
          value={value}
          onChange={value => {
            const newPanelValue = merge({}, panelValue, { [section]: { [entry.key]: value } });
            setPanelValue(newPanelValue);
            onChange?.(section, entry.key, value);
          }}
          config={entry as INumberComponentConfig}
        />
      );
    case 'sliderNumber':
      return (
        <SliderNumber
          key={`${entry.key}-${postKey ?? 0}`}
          label={entry.label}
          tooltip={entry.tooltip}
          value={value}
          onChange={value => {
            const newPanelValue = merge({}, panelValue, { [section]: { [entry.key]: value } });
            setPanelValue(newPanelValue);
            onChange?.(section, entry.key, value);
          }}
          config={entry as ISliderNumberComponentConfig}
        />
      );
    case 'color':
      return (
        <Color
          key={`${entry.key}-${postKey ?? 0}`}
          label={entry.label}
          tooltip={entry.tooltip}
          color={value}
          onChange={value => {
            const newPanelValue = merge({}, panelValue, { [section]: { [entry.key]: value } });
            setPanelValue(newPanelValue);
            onChange?.(section, entry.key, value);
          }}
          config={entry as IColorComponentConfig}
        />
      );
    case 'fontFamily':
      return (
        <FontFamily
          key={`${entry.key}-${postKey ?? 0}`}
          label={entry.label}
          tooltip={entry.tooltip}
          fontFamily={value}
          onChange={value => {
            const newPanelValue = merge({}, panelValue, { [section]: { [entry.key]: value } });
            setPanelValue(newPanelValue);
            onChange?.(section, entry.key, value);
          }}
          config={entry as IFontFamilyComponentConfig}
        />
      );
    case 'fontSize':
      return (
        <FontSize
          key={`${entry.key}-${postKey ?? 0}`}
          label={entry.label}
          tooltip={entry.tooltip}
          fontSize={value}
          onChange={value => {
            const newPanelValue = merge({}, panelValue, { [section]: { [entry.key]: value } });
            setPanelValue(newPanelValue);
            onChange?.(section, entry.key, value);
          }}
          config={entry as IFontSizeComponentConfig}
        />
      );
    case 'fontStyle':
      return (
        <FontStyle
          key={`${entry.key}-${postKey ?? 0}`}
          label={entry.label}
          tooltip={entry.tooltip}
          bolder={value?.bolder}
          underline={value?.underline}
          italic={value?.italic}
          onChange={value => {
            const newPanelValue = merge({}, panelValue, { [section]: { [entry.key]: value } });
            setPanelValue(newPanelValue);
            onChange?.(section, entry.key, value);
          }}
          config={entry as IFontStyleComponentConfig}
        />
      );
    case 'textAlign':
      return (
        <TextAlign
          key={`${entry.key}-${postKey ?? 0}`}
          label={entry.label}
          tooltip={entry.tooltip}
          textAlign={value}
          onChange={value => {
            const newPanelValue = merge({}, panelValue, { [section]: { [entry.key]: value } });
            setPanelValue(newPanelValue);
            onChange?.(section, entry.key, value);
          }}
          config={entry as ITextAlignComponentConfig}
        />
      );
    case 'palette':
      return (
        <Palette
          key={`${entry.key}-${postKey ?? 0}`}
          label={entry.label}
          tooltip={entry.tooltip}
          palette={value}
          onChange={value => {
            const newPanelValue = merge({}, panelValue, { [section]: { [entry.key]: value } });
            setPanelValue(newPanelValue);
            onChange?.(section, entry.key, value);
          }}
          config={entry as IPaletteComponentConfig}
        />
      );
    case 'shape':
      return (
        <Shape
          key={`${entry.key}-${postKey ?? 0}`}
          label={entry.label}
          tooltip={entry.tooltip}
          shape={value}
          onChange={value => {
            const newPanelValue = merge({}, panelValue, { [section]: { [entry.key]: value } });
            setPanelValue(newPanelValue);
            onChange?.(section, entry.key, value);
          }}
          config={entry as IShapeComponentConfig}
        />
      );
    case 'lineType':
      return (
        <LineType
          key={`${entry.key}-${postKey ?? 0}`}
          label={entry.label}
          tooltip={entry.tooltip}
          lineType={value}
          onChange={value => {
            const newPanelValue = merge({}, panelValue, { [section]: { [entry.key]: value } });
            setPanelValue(newPanelValue);
            onChange?.(section, entry.key, value);
          }}
          config={entry as ILineTypeComponentConfig}
        />
      );
    case 'custom':
      return (
        <CustomComponent
          key={`${entry.key}-${postKey ?? 0}`}
          label={entry.label}
          tooltip={entry.tooltip}
          value={value}
          onChange={value => {
            const newPanelValue = merge({}, panelValue, { [section]: { [entry.key]: value } });
            setPanelValue(newPanelValue);
            onChange?.(section, entry.key, value);
          }}
          config={entry as ICustomBaseComponentConfig}
        />
      );
  }
  return null;
}

function generateEntries(
  section: string,
  entries: ComponentConfig[],
  forcePanelValue: any,
  panelValue: any,
  setPanelValue: (value: any) => void,
  onChange: (entryType: string, key: string, value: any) => void,
  componentMap?: Record<string, string>
) {
  return entries.map((entry, index) => {
    if (!componentMap) {
      return generateEntry(section, entry, forcePanelValue, panelValue, setPanelValue, onChange, entry.key, index);
    }
    const componentKey = componentMap[entry.key];
    return componentKey
      ? generateEntry(section, entry, forcePanelValue, panelValue, setPanelValue, onChange, componentKey, index)
      : null;
  });
}

export function generateSection(
  section: IPanelSection,
  sectionKey: string,
  forcePanelValue: any,
  panelValue: any,
  setPanelValue: (value: any) => void,
  onChange: (entryType: string, key: string, value: any) => void,
  panelCollapsed: Record<string, boolean>,
  setPanelCollapsed: (collapsed: Record<string, boolean>) => void,
  onSectionEnabled: (section: string, enabled: boolean) => void,
  componentMap?: Record<string, string>,
  divider: boolean = true
) {
  const collapsed = panelCollapsed[sectionKey] ?? section.enabled !== false;
  return section ? (
    <>
      {!isNil(section.label) ? (
        <PanelTitle
          label={section.label}
          tooltip={section.tooltip}
          enabled={section.enabled}
          onEnabled={enabled => {
            onSectionEnabled?.(sectionKey, enabled);
          }}
          collapsed={collapsed}
          onCollapse={collapsed => {
            setPanelCollapsed(Object.assign({}, panelCollapsed, { [sectionKey]: collapsed }));
          }}
        />
      ) : null}
      <div style={{ position: 'relative' }}>
        {collapsed
          ? generateEntries(
              sectionKey,
              section.entries,
              forcePanelValue,
              panelValue,
              setPanelValue,
              onChange,
              componentMap
            )
          : null}
        {section.enabled === false ? <div className="vchart-editor-ui-panel-container-mask"></div> : null}
      </div>
      {divider ? <Divider margin="8px" /> : null}
    </>
  ) : null;
}

function getSectionCollapsedMap(sections: Record<string, IPanelSection>) {
  const collapsedMap = {};
  Object.keys(sections).forEach(key => {
    collapsedMap[key] = undefined;
  });
  return collapsedMap;
}

export function CustomPanel(props: ICustomPanelProps) {
  const label = props.label ?? '';
  const sections = props.sections ?? {};

  const [collapsed, setCollapsed] = useState<boolean>(props.defaultCollapsed ?? true);

  const [panelCollapsed, setPanelCollapsed] = useState<Record<string, boolean>>(getSectionCollapsedMap(sections));

  const [panelValue, setPanelValue] = useState<any>(generatePanelValue(sections, props.sectionComponentMaps, true));

  const forcePanelValue = generatePanelValue(sections, props.sectionComponentMaps);

  const onRefresh = props.onRefresh
    ? () => {
        props.onRefresh?.(panelValue);
        setPanelValue(generatePanelValue(props.initialSections ?? sections, props.sectionComponentMaps));
      }
    : null;

  const sectionKeys = Object.keys(sections);

  return (
    <div className={`vchart-editor-ui-panel-container ${props.className ?? ''}`} style={props.style ?? {}}>
      <EditorHeader
        label={label}
        tooltip={props.tooltip}
        enabled={props.enabled}
        onEnabled={enabled => props.onEnabled?.(enabled)}
        collapsed={collapsed}
        onCollapse={() => setCollapsed(!collapsed)}
        onRefresh={onRefresh}
      />
      <div className="vchart-editor-ui-panel-container-content">
        <div className="vchart-editor-ui-panel-collapse-container" style={{ height: !collapsed ? 0 : 'auto' }}>
          {sectionKeys.map((section, sectionIndex) => {
            return (
              <React.Fragment key={section}>
                {generateSection(
                  sections[section],
                  section,
                  forcePanelValue,
                  panelValue,
                  setPanelValue,
                  props.onChange,
                  panelCollapsed,
                  setPanelCollapsed,
                  props.onSectionEnabled,
                  props.sectionComponentMaps?.[section],
                  sectionIndex !== sectionKeys.length - 1
                )}
              </React.Fragment>
            );
          })}
        </div>
        {props.enabled === false ? <div className="vchart-editor-ui-panel-container-mask"></div> : null}
      </div>
    </div>
  );
}
