import { FontFamily } from '../base/font-family';
import { FontSize } from '../base/font-size';
import { FontStyle } from '../base/font-style';
import type { ITitleComponentProps } from '../typings/components';

export function Title(props: ITitleComponentProps) {
  const onChange = (key: string, value: any) => {
    // console.log(key, value);
    props.onChange?.();
  };
  return (
    <div>
      <p>Title</p>
      <FontFamily
        fontFamily="PingFangSC-Regular"
        onChange={(fontFamily: number) => onChange('fontFamily', fontFamily)}
      />
      <FontSize fontSize={10} onChange={(fontSize: number) => onChange('fontSize', fontSize)} />
      <FontStyle
        bolder={false}
        underline={false}
        italic={false}
        onChange={(fontStyle: any) => onChange('fontStyle', fontStyle)}
      />
    </div>
  );
}
