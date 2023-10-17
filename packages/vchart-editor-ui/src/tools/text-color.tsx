import { Popover } from '@douyinfe/semi-ui';
import type { IEditorBarTextColorProps } from '../typings/editor-bar';
import { IconChevronDown } from '@douyinfe/semi-icons';
import { TextBackgroundColorItem, TextColorItem } from './util';
import { defaultEditorBarComponentConfig } from '../config/editor-bar';

export function EditorBarTextColor(props: IEditorBarTextColorProps) {
  const textColorList = defaultEditorBarComponentConfig.textColor.colorList;
  const textBackgroundColorList = defaultEditorBarComponentConfig.textColor.backgroundColorList;
  const textColor = props.textColor?.color ?? defaultEditorBarComponentConfig.textColor.default.color;
  const textBackgroundColor =
    props.textColor?.backgroundColor ?? defaultEditorBarComponentConfig.textColor.default.backgroundColor;

  return (
    <Popover
      spacing={10}
      content={
        <div className="vchart-editor-ui-editor-bar-panel-container" style={{ padding: '10px 12px' }}>
          <div style={{ marginBottom: 8 }}>文字颜色</div>
          {(textColorList ?? []).map((palette, paletteIndex) => (
            <div
              key={paletteIndex}
              style={{ display: 'flex', marginBottom: paletteIndex !== textColorList.length - 1 ? 8 : 0 }}
            >
              {palette.map(color => (
                <TextColorItem
                  key={color}
                  color={color}
                  selected={color === textColor}
                  onClick={() => {
                    props.onTextColorChange?.({
                      color: color,
                      backgroundColor: textBackgroundColor
                    });
                  }}
                />
              ))}
            </div>
          ))}
          {props.background ? (
            <>
              <div style={{ marginTop: 12, marginBottom: 8 }}>文字背景色</div>
              {(textBackgroundColorList ?? []).map((palette, paletteIndex) => (
                <div
                  key={paletteIndex}
                  style={{ display: 'flex', marginBottom: paletteIndex !== textBackgroundColorList.length - 1 ? 8 : 0 }}
                >
                  {palette.map(color => (
                    <TextBackgroundColorItem
                      key={color}
                      color={color}
                      selected={color === textBackgroundColor}
                      onClick={() => {
                        props.onTextColorChange?.({
                          color: textColor,
                          backgroundColor: color
                        });
                      }}
                    />
                  ))}
                </div>
              ))}
            </>
          ) : null}
        </div>
      }
    >
      <span className="vchart-editor-ui-editor-bar-tool">
        <TextColorItem color={textColor} background={textBackgroundColor} />
        <IconChevronDown className="vchart-editor-ui-editor-bar-open-icon" />
      </span>
    </Popover>
  );
}
