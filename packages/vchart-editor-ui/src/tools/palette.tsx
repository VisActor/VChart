import { Popover } from '@douyinfe/semi-ui';
import type { IEditorBarPaletteProps } from '../typings/editor-bar';
import { IconChevronDown } from '@douyinfe/semi-icons';

const selectedStyle = {
  height: 24,
  padding: '8px',
  backgroundColor: 'rgba(117, 164, 255, 0.1)'
};

const unselectedStyle = {
  height: 24,
  padding: '8px'
};

export function EditorBarPalette(props: IEditorBarPaletteProps) {
  return (
    <Popover
      spacing={10}
      content={
        <div className="vchart-editor-ui-editor-bar-panel-container">
          {(props.paletteList ?? []).map((palette, paletteIndex) => (
            <div
              key={paletteIndex}
              onClick={() => props.onPaletteChange?.(palette)}
              className="vchart-editor-ui-editor-bar-row"
              style={props.palette === palette ? selectedStyle : unselectedStyle}
            >
              {palette.map(color => (
                <span
                  key={color}
                  className="vchart-editor-ui-editor-bar-color-item"
                  style={{ background: color }}
                ></span>
              ))}
            </div>
          ))}
        </div>
      }
    >
      <span className="vchart-editor-ui-editor-bar-tool">
        <span className="vchart-editor-ui-editor-bar-color-item" style={{ background: props.palette[0] }}></span>
        <span className="vchart-editor-ui-editor-bar-color-item" style={{ background: props.palette[1] }}></span>
        <span className="vchart-editor-ui-editor-bar-color-item" style={{ background: props.palette[2] }}></span>
        <IconChevronDown className="vchart-editor-ui-editor-bar-open-icon" />
      </span>
    </Popover>
  );
}
