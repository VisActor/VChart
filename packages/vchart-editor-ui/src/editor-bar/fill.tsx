import { Popover, Slider } from '@douyinfe/semi-ui';
import type { IEditorBarFillProps } from '../typings/editor-bar';
import { IconChevronDown, IconHistogram } from '@douyinfe/semi-icons';
import { useState } from 'react';
import { isArray } from '@visactor/vutils';
import { ColorItem } from './util';

const selectedStyle = {
  width: 144,
  height: 32
};

const unselectedStyle = {
  width: 144,
  height: 32
};

const paletteList = [
  ['disable', '#FFFFFF', '#EFF0F1', '#EFE6FE', '#E0E9FF', '#D0F5CE', '#FFFCA3', '#FEE7CD', '#FEE3E2'],
  ['#000000', '#646A73', '#BBBFC4', '#9F6FF1', '#5083FB', '#32A645', '#FFE928', '#ED6D0C', '#F54A45']
];

export function EditorBarFill(props: IEditorBarFillProps) {
  const onChartSelected = (chart: string) => {
    //
  };

  const [opacity, setOpacity] = useState<number>(props.fillOpacity ?? 1);

  return (
    <Popover
      spacing={10}
      content={
        <div className="vchart-editor-ui-editor-bar-container" style={{ padding: 10 }}>
          <div>填充</div>
          {(paletteList ?? []).map((palette, paletteIndex) => (
            <div
              key={paletteIndex}
              // onClick={() => onPaletteSelected(palette)}
              // className="vchart-editor-ui-editor-bar-row"
            >
              {palette.map(color => (
                <ColorItem key={color} color={color} />
              ))}
            </div>
          ))}
          <div>
            透明度<span style={{ float: 'right' }}>{(opacity * 100).toFixed(0)}%</span>
          </div>
          <Slider
            defaultValue={opacity}
            min={0}
            max={1}
            step={0.01}
            onChange={value => {
              const opacity = isArray(value) ? value[0] : value;
              setOpacity(opacity);
              props.onFillOpacityChange?.(opacity);
            }}
          ></Slider>
        </div>
      }
    >
      <span>
        <ColorItem color={props.fillColor} />
        <IconChevronDown />
      </span>
    </Popover>
  );
}
