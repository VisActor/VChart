import { isNil } from '@visactor/vutils';
import { Input } from '../base/input';
import { SliderNumber } from '../base/slider-number';
import { FontFamily } from '../base/font-family';
import { FontStyle } from '../base/font-style';
import { PanelTitle } from '../base/panel-title';
import { titleDefaultProps } from '../config/editor';
import type { ITitleComponentEntries, ITitleComponentProps } from '../typings/components';
import { Color } from '../base/color';
import { TextAlign } from '../base/text-align';

function generateTitleEntries(
  section: 'title' | 'subTitle',
  entries: ITitleComponentEntries['title']['entries'],
  onChange: (entryType: string, key: string, value: any) => void
) {
  return entries.map((entry, index) => {
    switch (entry.key) {
      case 'text':
        return (
          <Input
            key={`${entry.key}-${index}`}
            label={entry.label}
            value={null}
            onChange={(fontSize: number) => onChange(section, 'text', fontSize)}
          />
        );
      case 'fontSize':
        return (
          <SliderNumber
            key={`${entry.key}-${index}`}
            label={entry.label}
            value={10}
            onChange={(fontSize: number) => onChange(section, 'fontSize', fontSize)}
          />
        );
      case 'fontFamily':
        return (
          <FontFamily
            key={`${entry.key}-${index}`}
            label={entry.label}
            fontFamily="PingFangSC-Regular"
            onChange={(fontFamily: string) => onChange(section, 'fontFamily', fontFamily)}
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
          />
        );
      case 'color':
        return (
          <Color
            key={`${entry.key}-${index}`}
            label={entry.label}
            color={'#aaaaaa'}
            onChange={(color: string) => onChange(section, 'color', color)}
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
      case 'textAlign':
        return (
          <TextAlign
            key={`${entry.key}-${index}`}
            label={entry.label}
            textAlign={'center'}
            onChange={(textAlign: number) => onChange('align', 'textAlign', textAlign)}
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

  return (
    <div>
      <p>{label}</p>
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
    </div>
  );
}
