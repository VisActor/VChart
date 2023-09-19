import type { IColorItemProps, IEditorBarToolProps } from '../typings/editor-bar';
import { IconColorDisable, IconDisableRect } from '../svg/disable';
import { IconStrokeText, IconText } from '../svg/text';

export function ColorItem(props: IColorItemProps) {
  const color = props.color;
  const disableSize = (props.size ?? 18) + 3;
  const borderSize = (props.size ?? 18) - 2;
  const selectedSize = (props.size ?? 18) - 4;
  const size = props.size ?? 18;
  return color === 'disable' ? (
    <IconColorDisable
      style={{ width: disableSize, height: disableSize, margin: 1, marginRight: 2, cursor: 'pointer' }}
    />
  ) : color.toLowerCase() === '#ffffff' ? (
    <span
      key={color}
      onClick={() => props.onClick?.()}
      className="vchart-editor-ui-editor-bar-color-item"
      style={
        props.selected
          ? { background: color, border: '2px solid #2570fa', width: selectedSize, height: selectedSize }
          : { background: color, border: '1px solid #1F232926', width: borderSize, height: borderSize }
      }
    ></span>
  ) : (
    <span
      key={color}
      onClick={() => props.onClick?.()}
      className="vchart-editor-ui-editor-bar-color-item"
      style={
        props.selected
          ? { background: color, border: '2px solid #2570fa', width: selectedSize, height: selectedSize }
          : { background: color, width: size, height: size }
      }
    ></span>
  );
}

export function TextColorItem(props: IColorItemProps & { background?: string }) {
  const color = props.color;
  const size = props.size ?? 20;
  const selectedSize = (props.size ?? 20) - 2;
  return (
    <span style={{ display: 'inline-block' }}>
      {color.toLowerCase() === '#ffffff' ? (
        <span
          key={color}
          onClick={() => props.onClick?.()}
          className="vchart-editor-ui-editor-bar-color-item-text"
          style={
            props.selected
              ? {
                  border: '2px solid #2570fa',
                  width: selectedSize,
                  height: selectedSize,
                  backgroundColor: props.background ?? 'transparent'
                }
              : {
                  border: '1px solid #1F232926',
                  width: size,
                  height: size,
                  backgroundColor: props.background ?? 'transparent'
                }
          }
        >
          <IconStrokeText />
        </span>
      ) : (
        <span
          key={color}
          onClick={() => props.onClick?.()}
          className="vchart-editor-ui-editor-bar-color-item-text"
          style={
            props.selected
              ? {
                  border: '2px solid #2570fa',
                  width: selectedSize,
                  height: selectedSize,
                  backgroundColor: props.background ?? 'transparent'
                }
              : {
                  border: '1px solid #1F232926',
                  width: size,
                  height: size,
                  backgroundColor: props.background ?? 'transparent'
                }
          }
        >
          <IconText fill={color} />
        </span>
      )}
    </span>
  );
}

export function TextBackgroundColorItem(props: IColorItemProps) {
  const color = props.color;
  const disableSize = (props.size ?? 22) + 1;
  const whiteSize = (props.size ?? 22) - 2;
  const selectedSize = (props.size ?? 22) - 4;
  const size = props.size ?? 22;
  return color === 'disable' ? (
    <IconDisableRect
      style={{ width: disableSize, height: disableSize, margin: 1, marginRight: 2, cursor: 'pointer' }}
    />
  ) : color.toLowerCase() === '#ffffff' ? (
    <span
      key={color}
      onClick={() => props.onClick?.()}
      className="vchart-editor-ui-editor-bar-color-item-rect"
      style={
        props.selected
          ? { background: color, border: '2px solid #2570fa', width: selectedSize, height: selectedSize }
          : { background: color, border: '1px solid #1F232926', width: whiteSize, height: whiteSize }
      }
    ></span>
  ) : (
    <span
      key={color}
      onClick={() => props.onClick?.()}
      className="vchart-editor-ui-editor-bar-color-item-rect"
      style={
        props.selected
          ? { background: color, border: '2px solid #2570fa', width: selectedSize, height: selectedSize }
          : { background: color, width: size, height: size }
      }
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
      onClick={() => props.onClick?.()}
    >
      {props.icon}
    </span>
  );
}

export function EditorBarPanelTool(props: IEditorBarToolProps) {
  return (
    <div
      className={`vchart-editor-ui-editor-bar-box-item ${
        props.selected ? 'vchart-editor-ui-editor-bar-box-item-selected' : ''
      }`}
      onClick={() => props.onClick?.()}
    >
      {props.icon}
    </div>
  );
}
