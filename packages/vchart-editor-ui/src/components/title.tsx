import { FontFamily } from '../base/font-family';
import { FontStyle } from '../base/font-style';
import { SliderNumber } from '../base/slider-number';
import type { ITitleComponentProps } from '../typings/components';
import type { ITitleEditorComponentConfig } from '../typings/config';

const titleDefaultEntries: ITitleEditorComponentConfig['entries'] = [
  { key: 'fontSize', label: '字号' },
  { key: 'fontFamily', label: '字体' },
  { key: 'fontStyle', label: '样式' }
];

export function Title(props: ITitleComponentProps) {
  const onChange = (key: string, value: any) => {
    // console.log(key, value);
    props.onChange?.();
  };

  const entries = props.config?.entries ?? titleDefaultEntries;

  return (
    <div>
      <p>图表标题</p>
      {entries.map((entry, index) => {
        switch (entry.key) {
          case 'fontSize':
            return (
              <SliderNumber
                key={`${entry.key}-${index}`}
                label={entry.label}
                value={10}
                onChange={(fontSize: number) => onChange('fontSize', fontSize)}
              />
            );
          case 'fontFamily':
            return (
              <FontFamily
                key={`${entry.key}-${index}`}
                label={entry.label}
                fontFamily="PingFangSC-Regular"
                onChange={(fontFamily: string) => onChange('fontFamily', fontFamily)}
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
                onChange={(fontStyle: any) => onChange('fontStyle', fontStyle)}
              />
            );
        }
        return null;
      })}
    </div>
  );
}
