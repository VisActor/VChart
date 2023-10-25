import { Button, Popover } from '@douyinfe/semi-ui';
import type { IEditorBarTextColorProps } from '../typings/editor-bar';
import { IconChevronDown } from '@douyinfe/semi-icons';
import { TextBackgroundColorItem, TextColorItem } from './util';
import { defaultEditorBarComponentConfig } from '../config/editor-bar';
import { SketchPicker } from 'react-color';
import { IconGleam } from '../svg/gleam';

export function EditorBarTextColor(props: IEditorBarTextColorProps) {
  const textColorList = defaultEditorBarComponentConfig.textColor.colorList;
  const textBackgroundColorList = defaultEditorBarComponentConfig.textColor.backgroundColorList;
  const textColor = props.textColor?.color ?? defaultEditorBarComponentConfig.textColor.default.color;
  const textBackgroundColor =
    props.textColor?.backgroundColor ?? defaultEditorBarComponentConfig.textColor.default.backgroundColor;

  const ColorPicker = props.colorPicker ?? SketchPicker;

  return (
    <Popover
      spacing={10}
      content={
        <div className="vchart-editor-ui-editor-bar-panel-container" style={{ padding: '10px 12px' }}>
          <div style={{ marginBottom: 8 }}>文字颜色</div>
          {(textColorList ?? []).map((palette, paletteIndex) => (
            <div key={paletteIndex} style={{ display: 'flex', marginBottom: 8 }}>
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
          <Popover
            content={
              <ColorPicker
                color={textColor === 'disable' ? '#000000' : textColor}
                onChange={color => {
                  props.onTextColorChange?.({
                    color: color.hex,
                    backgroundColor: textBackgroundColor
                  });
                }}
              />
            }
          >
            <Button type="tertiary" style={{ marginRight: 8, outline: 'none', borderRadius: 6, width: '100%' }}>
              <IconGleam /> 自定义
            </Button>
          </Popover>
          {props.background ? (
            <>
              <div style={{ marginTop: 12, marginBottom: 8 }}>文字背景色</div>
              {(textBackgroundColorList ?? []).map((palette, paletteIndex) => (
                <div key={paletteIndex} style={{ display: 'flex', marginBottom: 8 }}>
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
              <Popover
                content={
                  <ColorPicker
                    color={textBackgroundColor === 'disable' ? '#000000' : textBackgroundColor}
                    onChange={color => {
                      props.onTextColorChange?.({
                        color: textColor,
                        backgroundColor: color.hex
                      });
                    }}
                  />
                }
              >
                <Button type="tertiary" style={{ marginRight: 8, outline: 'none', borderRadius: 6, width: '100%' }}>
                  <IconGleam /> 自定义
                </Button>
              </Popover>
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
