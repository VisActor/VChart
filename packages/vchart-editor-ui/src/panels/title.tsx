import { isNil } from '@visactor/vutils';
import type {
  IColorComponentConfig,
  IFontFamilyComponentConfig,
  IFontStyleComponentConfig,
  IInputComponentConfig,
  ISelectComponentConfig,
  ISliderNumberComponentConfig,
  ISwitchComponentConfig,
  ITextAlignComponentConfig
} from '../typings/config';
import type { ITitleComponentEntries, ITitleComponentProps } from '../typings/panel';
import { Input } from '../base/input';
import { SliderNumber } from '../base/slider-number';
import { FontFamily } from '../base/font-family';
import { FontStyle } from '../base/font-style';
import { PanelTitle } from '../base/panel-title';
import { titleDefaultProps } from '../config/panel';
import { Color } from '../base/color';
import { TextAlign } from '../base/text-align';
import { Select } from '../base/select';
import { Switch } from '../base/switch';
import { EditorHeader } from '../base/editor-header';
import { useState } from 'react';

function generateTitleEntries(
  section: 'title' | 'subTitle',
  entries: ITitleComponentEntries['subTitle']['entries'],
  onChange: (entryType: string, key: string, value: any) => void
) {
  return entries.map((entry, index) => {
    switch (entry.key) {
      case 'display':
        return (
          <Switch
            key={`${entry.key}-${index}`}
            label={entry.label}
            value={false}
            onChange={(value: number) => onChange(section, 'display', value)}
            config={entry as ISwitchComponentConfig}
          />
        );
      case 'text':
        return (
          <Input
            key={`${entry.key}-${index}`}
            label={entry.label}
            value={null}
            onChange={(fontSize: number) => onChange(section, 'text', fontSize)}
            config={entry as IInputComponentConfig}
          />
        );
      case 'fontSize':
        return (
          <SliderNumber
            key={`${entry.key}-${index}`}
            label={entry.label}
            value={10}
            onChange={(fontSize: number) => onChange(section, 'fontSize', fontSize)}
            config={entry as ISliderNumberComponentConfig}
          />
        );
      case 'fontFamily':
        return (
          <FontFamily
            key={`${entry.key}-${index}`}
            label={entry.label}
            fontFamily="PingFangSC-Regular"
            onChange={(fontFamily: string) => onChange(section, 'fontFamily', fontFamily)}
            config={entry as IFontFamilyComponentConfig}
          />
        );
      case 'fontStyle':
        return (
          <FontStyle
            key={`${entry.key}-${index}`}
            label={entry.label}
            bolder={false}
            underline={false}
            italic={false}
            onChange={(fontStyle: any) => onChange(section, 'fontStyle', fontStyle)}
            config={entry as IFontStyleComponentConfig}
          />
        );
      case 'color':
        return (
          <Color
            key={`${entry.key}-${index}`}
            label={entry.label}
            color={'#aaaaaa'}
            onChange={(color: string) => onChange(section, 'color', color)}
            config={entry as IColorComponentConfig}
          />
        );
    }
    return null;
  });
}

function generateAlignEntries(
  entries: ITitleComponentEntries['align']['entries'],
  onChange: (entryType: string, key: string, value: any) => void
) {
  return entries.map((entry, index) => {
    switch (entry.key) {
      case 'position':
        return (
          <Select
            key={`${entry.key}-${index}`}
            label={entry.label}
            value={'center'}
            onChange={(position: string) => onChange('align', 'position', position)}
            config={entry as ISelectComponentConfig}
          />
        );
      case 'textAlign':
        return (
          <TextAlign
            key={`${entry.key}-${index}`}
            label={entry.label}
            textAlign={'center'}
            onChange={(textAlign: number) => onChange('align', 'textAlign', textAlign)}
            config={entry as ITextAlignComponentConfig}
          />
        );
    }
    return null;
  });
}

export function Title(props: ITitleComponentProps) {
  const onChange = (section: string, key: string, value: any) => {
    // console.log(section, key, value);
    props.onChange?.();
  };

  const label = props.label ?? titleDefaultProps.label;
  const entries = props.sections ?? titleDefaultProps.sections;

  const [collapsed, setCollapsed] = useState<boolean>(true);

  return (
    <div>
      <EditorHeader label={label} collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} />
      {!collapsed ? (
        <>
          {entries.title ? (
            <>
              {!isNil(entries.title.label) ? <PanelTitle label={entries.title.label} /> : null}
              {generateTitleEntries('title', entries.title.entries, onChange)}
            </>
          ) : null}
          {entries.subTitle ? (
            <>
              {!isNil(entries.subTitle.label) ? <PanelTitle label={entries.subTitle.label} /> : null}
              {generateTitleEntries('subTitle', entries.subTitle.entries, onChange)}
            </>
          ) : null}
          {entries.align ? (
            <>
              {!isNil(entries.align.label) ? <PanelTitle label={entries.align.label} /> : null}
              {generateAlignEntries(entries.align.entries, onChange)}
            </>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
