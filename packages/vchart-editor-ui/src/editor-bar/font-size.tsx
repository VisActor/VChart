import { Popover } from '@douyinfe/semi-ui';
import type { IEditorBarFontSizeProps } from '../typings/editor-bar';
import { IconChevronDown, IconHistogram } from '@douyinfe/semi-icons';

const selectedStyle = {
  height: 32
};

const unselectedStyle = {
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
        <div className="vchart-editor-ui-editor-bar-container">
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
      <span>
        {props.fontSize}
        <IconChevronDown />
      </span>
    </Popover>
  );
}
