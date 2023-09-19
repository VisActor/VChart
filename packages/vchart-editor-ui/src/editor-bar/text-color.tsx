import { Popover } from '@douyinfe/semi-ui';
import type { IEditorBarTextColorProps } from '../typings/editor-bar';
import { IconChevronDown } from '@douyinfe/semi-icons';
import { TextBackgroundColorItem, TextColorItem } from './util';

const textFillColorList = [
  ['#1F2329', '#8F959E', '#FFFFFF', '#7A35F0', '#1456F0', '#2EA121', '#865B03', '#A44904', '#C02A26']
];

const textBackgroundColorList = [
  ['disable', '#FFFFFF', '#EFF0F1', '#EFE6FE', '#E0E9FF', '#D0F5CE', '#FFFCA3', '#FEE7CD', '#FEE3E2'],
  ['#000000', '#646A73', '#BBBFC4', '#9F6FF1', '#5083FB', '#32A645', '#FFE928', '#ED6D0C', '#F54A45']
];

export function EditorBarTextColor(props: IEditorBarTextColorProps) {
  const onChartSelected = (chart: string) => {
    //
  };

  return (
    <Popover
      spacing={10}
      content={
        <div className="vchart-editor-ui-editor-bar-container" style={{ padding: 10 }}>
          <div>文字颜色</div>
          {(textFillColorList ?? []).map((palette, paletteIndex) => (
            <div key={paletteIndex}>
              {palette.map(color => (
                <TextColorItem key={color} color={color} />
              ))}
            </div>
          ))}
          <div>文字背景色</div>
          {(textBackgroundColorList ?? []).map((palette, paletteIndex) => (
            <div key={paletteIndex}>
              {palette.map(color => (
                <TextBackgroundColorItem key={color} color={color} />
              ))}
            </div>
          ))}
        </div>
      }
    >
      <span>
        <TextColorItem color={props.fillColor} background={props.backgroundColor} />
        <IconChevronDown />
      </span>
    </Popover>
  );
}
