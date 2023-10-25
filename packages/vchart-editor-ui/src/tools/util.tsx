import type { IColorItemProps, IEditorBarEntryProps } from '../typings/editor-bar';
import { IconColorDisable, IconDisableRect } from '../svg/disable';
import { IconStrokeText, IconText } from '../svg/text';
import { IconHorizontalLine } from '../svg/horizontal-line';
import { IconVerticalLine } from '../svg/vertical-line';
import { IconHorizontalRect } from '../svg/horizontal-rect';
import { IconVerticalRect } from '../svg/vertical-rect';
import { IconCombineMark } from '../svg/combine-mark';
import { IconSumDiff } from '../svg/sum-diff';
import { IconHierarchyDiff } from '../svg/hierarchy-diff';
import { IconAddText } from '../svg/add-text';
import { IconComment } from '../svg/comment';
import { IconBold, IconMore } from '@douyinfe/semi-icons';
import { IconEditData } from '../svg/edit-data';

export function ColorItem(props: IColorItemProps) {
  const color = props.color;
  const disableSize = (props.size ?? 18) + 3;
  const selectedDisableSize = (props.size ?? 18) + 3 - 4;
  const borderSize = (props.size ?? 18) - 2;
  const selectedSize = (props.size ?? 18) - 4;
  const size = props.size ?? 18;
  return color === 'disable' ? (
    <IconColorDisable
      onClick={() => props.onClick?.()}
      style={
        props.selected
          ? {
              width: selectedDisableSize,
              height: selectedDisableSize,
              margin: 1,
              marginRight: 2,
              cursor: 'pointer',
              border: '2px solid #2570fa',
              borderRadius: '50%'
            }
          : { width: disableSize, height: disableSize, margin: 1, marginRight: 2, cursor: 'pointer' }
      }
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
                  backgroundColor: props.background && props.background !== 'disable' ? props.background : 'transparent'
                }
              : {
                  border: '1px solid #1F232926',
                  width: size,
                  height: size,
                  backgroundColor: props.background && props.background !== 'disable' ? props.background : 'transparent'
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
  const selectedDisableSize = (props.size ?? 22) + 1 - 4;
  const whiteSize = (props.size ?? 22) - 2;
  const selectedSize = (props.size ?? 22) - 4;
  const size = props.size ?? 22;
  return color === 'disable' ? (
    <IconDisableRect
      onClick={() => props.onClick?.()}
      style={
        props.selected
          ? {
              width: selectedDisableSize,
              height: selectedDisableSize,
              margin: 1,
              marginRight: 2,
              cursor: 'pointer',
              border: '2px solid #2570fa',
              borderRadius: 2
            }
          : { width: disableSize, height: disableSize, margin: 1, marginRight: 2, cursor: 'pointer' }
      }
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

export function EditorBarEntry(props: IEditorBarEntryProps) {
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

export function EditorBarPanelEntry(props: IEditorBarEntryProps) {
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

export const editorBarToolMap = {
  horizontalLine: { icon: <IconHorizontalLine />, type: 'switch' },
  verticalLine: { icon: <IconVerticalLine />, type: 'switch' },
  horizontalRect: { icon: <IconHorizontalRect />, type: 'switch' },
  verticalRect: { icon: <IconVerticalRect />, type: 'switch' },
  combineMark: { icon: <IconCombineMark />, type: 'switch' },
  sumDiff: { icon: <IconSumDiff />, type: 'switch' },
  hierarchyDiff: { icon: <IconHierarchyDiff />, type: 'switch' },
  addText: { icon: <IconAddText />, type: 'switch' },

  editData: { icon: <IconEditData />, type: 'trigger' },
  comment: { icon: <IconComment />, type: 'trigger' },
  more: { icon: <IconMore />, type: 'switch' },

  bold: { icon: <IconBold />, type: 'switch' }
};
