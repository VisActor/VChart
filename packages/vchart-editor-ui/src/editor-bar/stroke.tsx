import { Popover, Slider } from '@douyinfe/semi-ui';
import type { IEditorBarStrokeProps } from '../typings/editor-bar';
import { IconChevronDown } from '@douyinfe/semi-icons';
import { useState } from 'react';
import { isArray } from '@visactor/vutils';
import { ColorItem } from './util';
import { IconStroke } from '../svg/stroke';
import { IconLineDisable } from '../svg/disable';
import { IconDashedLine, IconLine, IconThinDashedLine } from '../svg/line';

const selectedStyle = {
  backgroundColor: 'rgba(117, 164, 255, 0.10)'
};

const unselectedStyle = {};

const paletteList = [
  ['#000000', '#646A73', '#BBBFC4', '#DEE0E3', '#EFF0F1', '#FFFFFF'],
  ['#9F6FF1', '#5083FB', '#32A645', '#FFE928', '#ED6D0C', '#F54A45']
];

function StrokePanel(props: IEditorBarStrokeProps) {
  const onChartSelected = (chart: string) => {
    //
  };

  const [opacity, setOpacity] = useState<number>(props.strokeOpacity ?? 1);

  return (
    <div className="vchart-editor-ui-editor-bar-panel-container" style={{ padding: 10, position: 'relative' }}>
      <div style={{ marginBottom: 6 }}>描边/线条</div>
      <div style={{ borderRadius: 6, background: '#F5F6F7', padding: 2, display: 'flex', gap: 2, marginBottom: 8 }}>
        <div
          className="vchart-editor-ui-editor-bar-box-item"
          style={props.strokeStyle === 'disable' ? selectedStyle : unselectedStyle}
        >
          <IconLineDisable />
        </div>
        <div
          className="vchart-editor-ui-editor-bar-box-item"
          style={props.strokeStyle === 'line' ? selectedStyle : unselectedStyle}
        >
          <IconLine />
        </div>
        <div
          className="vchart-editor-ui-editor-bar-box-item"
          style={props.strokeStyle === 'dashedLine' ? selectedStyle : unselectedStyle}
        >
          <IconDashedLine />
        </div>
        <div
          className="vchart-editor-ui-editor-bar-box-item"
          style={props.strokeStyle === 'thinDashedLine' ? selectedStyle : unselectedStyle}
        >
          <IconThinDashedLine />
        </div>
      </div>
      <div style={{ borderRadius: 6, background: '#F5F6F7', padding: 2, display: 'flex', gap: 2, marginBottom: 8 }}>
        <div
          className="vchart-editor-ui-editor-bar-box-item"
          style={props.strokeWidth === 1 ? selectedStyle : unselectedStyle}
        >
          <span
            style={{ borderRadius: '50%', background: '#000000', display: 'inline-block', width: 6, height: 6 }}
          ></span>
        </div>
        <div
          className="vchart-editor-ui-editor-bar-box-item"
          style={props.strokeWidth === 2 ? selectedStyle : unselectedStyle}
        >
          <span
            style={{ borderRadius: '50%', background: '#000000', display: 'inline-block', width: 8, height: 8 }}
          ></span>
        </div>
        <div
          className="vchart-editor-ui-editor-bar-box-item"
          style={props.strokeWidth === 3 ? selectedStyle : unselectedStyle}
        >
          <span
            style={{ borderRadius: '50%', background: '#000000', display: 'inline-block', width: 10, height: 10 }}
          ></span>
        </div>
        <div
          className="vchart-editor-ui-editor-bar-box-item"
          style={props.strokeWidth === 4 ? selectedStyle : unselectedStyle}
        >
          <span
            style={{ borderRadius: '50%', background: '#000000', display: 'inline-block', width: 12, height: 12 }}
          ></span>
        </div>
      </div>
      {(paletteList ?? []).map((palette, paletteIndex) => (
        <div key={paletteIndex}>
          {palette.map(color => (
            <ColorItem key={color} color={color} size={22} />
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
          props.onStrokeOpacityChange?.(opacity);
        }}
      ></Slider>
      {props.strokeStyle === 'disable' ? (
        <div
          style={{
            left: 0,
            bottom: 6,
            width: '100%',
            height: 170,
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
        <IconStroke fill={props.strokeColor} />
        <IconChevronDown className="vchart-editor-ui-editor-bar-open-icon" />
      </span>
    </Popover>
  );
}

export function EditorBarStrokeLine(props: IEditorBarStrokeProps) {
  return (
    <Popover spacing={10} content={<StrokePanel {...props} />}>
      <span className="vchart-editor-ui-editor-bar-tool">
        <IconLine />
        <IconChevronDown className="vchart-editor-ui-editor-bar-open-icon" />
      </span>
    </Popover>
  );
}
