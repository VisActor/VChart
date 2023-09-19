import { Popover } from '@douyinfe/semi-ui';
import type { IEditorBarFontSizeProps } from '../typings/editor-bar';
import { IconChevronDown } from '@douyinfe/semi-icons';

const selectedStyle = {
  width: 32,
  height: 32,
  backgroundColor: 'rgba(117, 164, 255, 0.1)'
};

const unselectedStyle = {
  width: 32,
  height: 32
};

export function EditorBarFontSize(props: IEditorBarFontSizeProps) {
  const onFontSizeSelected = (fontSize: number) => {
    //
  };

  return (
    <Popover
      spacing={10}
      content={
        <div className="vchart-editor-ui-editor-bar-panel-container">
          {(props.fontSizeList ?? []).map(fontSize => (
            <div
              key={fontSize}
              onClick={() => onFontSizeSelected(fontSize)}
              className="vchart-editor-ui-editor-bar-row"
              style={props.fontSize === fontSize ? selectedStyle : unselectedStyle}
            >
              {fontSize.toFixed()}
            </div>
          ))}
        </div>
      }
    >
      <span className="vchart-editor-ui-editor-bar-tool">
        <span style={{ fontSize: '14px' }}>{props.fontSize}</span>
        <IconChevronDown className="vchart-editor-ui-editor-bar-open-icon" />
      </span>
    </Popover>
  );
}
