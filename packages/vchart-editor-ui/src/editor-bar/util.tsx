import type { IColorItemProps, IEditorBarToolProps } from '../typings/editor-bar';
import { IconColorDisable, IconDisableRect } from '../svg/disable';
import { IconStrokeText, IconText } from '../svg/text';

export function ColorItem(props: IColorItemProps) {
  const color = props.color;
  const disableSize = (props.size ?? 18) + 3;
  const whiteSize = (props.size ?? 18) - 2;
  const size = props.size ?? 18;
  return color === 'disable' ? (
    <IconColorDisable style={{ width: disableSize, height: disableSize, margin: 1, marginRight: 2 }} />
  ) : color.toLowerCase() === '#ffffff' ? (
    <span
      key={color}
      className="vchart-editor-ui-editor-bar-color-item"
      style={{ background: color, border: '1px solid #1F232926', width: whiteSize, height: whiteSize }}
    ></span>
  ) : (
    <span
      key={color}
      className="vchart-editor-ui-editor-bar-color-item"
      style={{ background: color, width: size, height: size }}
    ></span>
  );
}

export function TextColorItem(props: IColorItemProps & { background?: string }) {
  const color = props.color;
  const size = props.size ?? 16;
  return (
    <span style={{ display: 'inline-block' }}>
      {color.toLowerCase() === '#ffffff' ? (
        <span
          key={color}
          className="vchart-editor-ui-editor-bar-color-item-text"
          style={{
            border: '1px solid #1F232926',
            width: size,
            height: size,
            backgroundColor: props.background ?? 'transparent'
          }}
        >
          <IconStrokeText />
        </span>
      ) : (
        <span
          key={color}
          className="vchart-editor-ui-editor-bar-color-item-text"
          style={{
            border: '1px solid #1F232926',
            width: size,
            height: size,
            backgroundColor: props.background ?? 'transparent'
          }}
        >
          <IconText fill={color} />
        </span>
      )}
    </span>
  );
}

export function TextBackgroundColorItem(props: IColorItemProps) {
  const color = props.color;
  const disableSize = (props.size ?? 18) + 1;
  const whiteSize = (props.size ?? 18) - 2;
  const size = props.size ?? 18;
  return color === 'disable' ? (
    <IconDisableRect style={{ width: disableSize, height: disableSize, margin: 1, marginRight: 2 }} />
  ) : color.toLowerCase() === '#ffffff' ? (
    <span
      key={color}
      className="vchart-editor-ui-editor-bar-color-item-rect"
      style={{ background: color, border: '1px solid #1F232926', width: whiteSize, height: whiteSize }}
    ></span>
  ) : (
    <span
      key={color}
      className="vchart-editor-ui-editor-bar-color-item-rect"
      style={{ background: color, width: size, height: size }}
    ></span>
  );
}

export function EditorBarTool(props: IEditorBarToolProps) {
  return (
    <span
      className={`vchart-editor-ui-editor-bar-tool ${
        props.selected ? 'vchart-editor-ui-editor-bar-tool-selected' : ''
      }`}
      style={{ width: 20 }}
    >
      {props.icon}
    </span>
  );
}
