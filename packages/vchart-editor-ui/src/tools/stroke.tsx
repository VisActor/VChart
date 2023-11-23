import { Button, Divider, Popover, Slider } from '@douyinfe/semi-ui';
import type { IEditorBarStrokeProps, Stroke } from '../typings/editor-bar';
import { IconChevronDown } from '@douyinfe/semi-icons';
import { RGB, isArray } from '@visactor/vutils';
import { ColorItem, EditorBarPanelEntry } from './util';
import { IconStroke } from '../svg/stroke';
import { IconLineDisable } from '../svg/disable';
import { IconDashedLine, IconLine, IconThinDashedLine } from '../svg/line';
import { defaultEditorBarComponentConfig } from '../config/editor-bar';
import { SketchPicker } from 'react-color';
import { IconGleam } from '../svg/gleam';
import { isColorEqual } from '../utils/color';

const strokeStyleList = [
  { icon: IconLineDisable, style: 'disable' },
  { icon: IconLine, style: 'line' },
  { icon: IconDashedLine, style: 'dashedLine' },
  { icon: IconThinDashedLine, style: 'thinDashedLine' }
];

const lineWidthList = [
  { lineWidth: 1, size: 6 },
  { lineWidth: 2, size: 8 },
  { lineWidth: 3, size: 10 },
  { lineWidth: 4, size: 12 }
];

function StrokePanel(props: IEditorBarStrokeProps) {
  const strokeColor = props.stroke?.color ?? defaultEditorBarComponentConfig.stroke.default.color;
  const strokeOpacity = props.stroke?.opacity ?? defaultEditorBarComponentConfig.stroke.default.opacity;
  const strokeLineWidth = props.stroke?.lineWidth ?? defaultEditorBarComponentConfig.stroke.default.lineWidth;
  const strokeStyle = props.stroke?.style ?? defaultEditorBarComponentConfig.stroke.default.style;

  const strokeColorList = defaultEditorBarComponentConfig.stroke.colorList;

  const ColorPicker = props.colorPicker ?? SketchPicker;

  return (
    <div className="vchart-editor-ui-editor-bar-panel-container" style={{ padding: '10px 12px', position: 'relative' }}>
      <div style={{ marginBottom: 6 }}>描边/线条</div>
      <div style={{ borderRadius: 6, background: '#F5F6F7', padding: 2, display: 'flex', gap: 2, marginBottom: 8 }}>
        {strokeStyleList.map(style => {
          const Icon = style.icon;
          return (
            <EditorBarPanelEntry
              key={style.style}
              icon={<Icon />}
              selected={strokeStyle === style.style}
              onClick={() => {
                props.onStrokeChange?.({
                  style: style.style as Stroke['style'],
                  color: strokeColor,
                  opacity: strokeOpacity,
                  lineWidth: strokeLineWidth
                });
              }}
            />
          );
        })}
      </div>
      <div style={{ borderRadius: 6, background: '#F5F6F7', padding: 2, display: 'flex', gap: 2, marginBottom: 8 }}>
        {lineWidthList.map(lineWidth => (
          <EditorBarPanelEntry
            key={lineWidth.lineWidth}
            icon={
              <span
                style={{
                  borderRadius: '50%',
                  background: '#000000',
                  display: 'inline-block',
                  width: lineWidth.size,
                  height: lineWidth.size
                }}
              ></span>
            }
            selected={strokeLineWidth === lineWidth.lineWidth}
            onClick={() => {
              props.onStrokeChange?.({
                style: strokeStyle,
                color: strokeColor,
                opacity: strokeOpacity,
                lineWidth: lineWidth.lineWidth
              });
            }}
          />
        ))}
      </div>

      <Divider layout="horizontal" margin="8px" style={{ marginLeft: -12, width: 'calc(100% + 24px)' }} />

      {(strokeColorList ?? []).map((palette, paletteIndex) => (
        <div key={paletteIndex}>
          {palette.map(color => (
            <ColorItem
              key={color}
              color={color}
              size={22}
              selected={isColorEqual(color, strokeColor)}
              onClick={() => {
                props.onStrokeChange?.({
                  style: strokeStyle,
                  color: color,
                  opacity: strokeOpacity,
                  lineWidth: strokeLineWidth
                });
              }}
            />
          ))}
        </div>
      ))}
      <Popover
        content={
          <ColorPicker
            color={strokeColor === 'disable' ? '#000000' : strokeColor}
            onChange={color => {
              const rgba = new RGB(color.rgb.r, color.rgb.g, color.rgb.b, color.rgb.a);
              const hex = rgba.formatHex();
              props.onStrokeChange?.({
                style: strokeStyle,
                color: hex,
                opacity: strokeOpacity,
                lineWidth: strokeLineWidth
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
        透明度<span style={{ float: 'right' }}>{(strokeOpacity * 100).toFixed(0)}%</span>
      </div>
      <Slider
        defaultValue={strokeOpacity}
        min={0}
        max={1}
        step={0.01}
        onChange={value => {
          const opacity = isArray(value) ? value[0] : value;
          props.onStrokeChange?.({
            style: strokeStyle,
            color: strokeColor,
            opacity: opacity,
            lineWidth: strokeLineWidth
          });
        }}
      ></Slider>
      {strokeStyle === 'disable' ? (
        <div
          className="vchart-editor-ui-editor-bar-tool-mask"
          style={{
            left: 0,
            bottom: 6,
            width: '100%',
            height: 210,
            background: 'rgb(255 255 255 / 75%)',
            position: 'absolute'
          }}
        ></div>
      ) : null}
    </div>
  );
}

export function EditorBarStroke(props: IEditorBarStrokeProps) {
  return (
    <Popover spacing={10} content={<StrokePanel {...props} />}>
      <span className="vchart-editor-ui-editor-bar-tool">
        <IconStroke fill={props.stroke?.color ?? defaultEditorBarComponentConfig.stroke.default.color} />
        <IconChevronDown className="vchart-editor-ui-editor-bar-open-icon" />
      </span>
    </Popover>
  );
}

export function EditorBarStrokeLine(props: IEditorBarStrokeProps) {
  const Icon = strokeStyleList.find(style => style.style === (props.stroke.style ?? 'line'))?.icon;
  return (
    <Popover spacing={10} content={<StrokePanel {...props} />}>
      <span className="vchart-editor-ui-editor-bar-tool">
        <Icon fill={props.stroke.style === 'disable' ? '#2B2F36' : props.stroke.color} style={{ width: 24 }} />
        <IconChevronDown className="vchart-editor-ui-editor-bar-open-icon" />
      </span>
    </Popover>
  );
}
