import { Button, Popover, Slider } from '@douyinfe/semi-ui';
import type { IEditorBarFillProps } from '../typings/editor-bar';
import { IconChevronDown } from '@douyinfe/semi-icons';
import { isArray } from '@visactor/vutils';
import { ColorItem } from './util';
import { defaultEditorBarComponentConfig } from '../config/editor-bar';
import { IconGleam } from '../svg/gleam';
import { SketchPicker } from 'react-color';
import { isColorEqual } from '../utils/color';

export function EditorBarFill(props: IEditorBarFillProps) {
  const fillColor = props.fill?.color ?? defaultEditorBarComponentConfig.fill.default.color;
  const fillOpacity = props.fill?.opacity ?? defaultEditorBarComponentConfig.fill.default.opacity;

  const fillColorList = defaultEditorBarComponentConfig.fill.colorList;

  const ColorPicker = props.colorPicker ?? SketchPicker;

  return (
    <Popover
      spacing={10}
      content={
        <div className="vchart-editor-ui-editor-bar-panel-container" style={{ padding: '10px 12px' }}>
          <div style={{ marginBottom: 2 }}>填充</div>
          {(fillColorList ?? []).map((palette, paletteIndex) => (
            <div key={paletteIndex}>
              {palette.map(color => (
                <ColorItem
                  key={color}
                  color={color}
                  selected={isColorEqual(fillColor, color)}
                  onClick={() => {
                    props.onFillChange?.({
                      color: color,
                      opacity: fillOpacity
                    });
                  }}
                />
              ))}
            </div>
          ))}
          <Popover
            content={
              <ColorPicker
                color={fillColor === 'disable' ? '#000000' : fillColor}
                onChange={color => {
                  props.onFillChange?.({
                    color: color.hex,
                    opacity: fillOpacity
                  });
                }}
              />
            }
          >
            <Button type="tertiary" style={{ marginRight: 8, outline: 'none', borderRadius: 6, width: '100%' }}>
              <IconGleam /> 自定义
            </Button>
          </Popover>
          <div style={{ marginTop: 6 }}>
            透明度<span style={{ float: 'right' }}>{(fillOpacity * 100).toFixed(0)}%</span>
          </div>
          <Slider
            defaultValue={fillOpacity}
            min={0}
            max={1}
            step={0.01}
            onChange={value => {
              const nextOpacity = isArray(value) ? value[0] : value;
              props.onFillChange?.({
                color: fillColor,
                opacity: nextOpacity
              });
            }}
          ></Slider>
        </div>
      }
    >
      <span className="vchart-editor-ui-editor-bar-tool">
        <ColorItem color={fillColor} />
        <IconChevronDown className="vchart-editor-ui-editor-bar-open-icon" />
      </span>
    </Popover>
  );
}
