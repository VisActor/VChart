import type { IText, ITextGraphicAttribute } from '@visactor/vrender-core';
import modifyCSS from './dom';
import type { ITextSize } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { TextMeasure, array, isNil, normalizePadding } from '@visactor/vutils';

export type TextInfo = {
  text: IText;
  container: HTMLElement;
  /**
   * 文本当前的内容表达式
   */
  expression?: string;
  /**
   * 需要处理表达式
   */
  needExpression?: boolean;
  change?: (expression: string) => void;
  /**
   * 面板样式
   */
  panelStyle?: any;
  /**
   * 默认的字体
   */
  defaultFontFamily?: string;
};

export const measureText = (text: string | string[], textSpec?: Partial<ITextGraphicAttribute>): ITextSize => {
  return new TextMeasure<ITextGraphicAttribute>({}, textSpec).measure(text);
};

export const setupSimpleTextEditor = function (textInfo: TextInfo) {
  const {
    text,
    container: chartContainer,
    panelStyle,
    defaultFontFamily,
    expression,
    needExpression,
    change
  } = textInfo;
  const textBounds = text.globalAABBBounds;

  const anchor = {
    left: textBounds.x1,
    top: textBounds.y1,
    width: textBounds.width(),
    height: textBounds.height()
  };

  const { padding = [0, 0, 0, 0] } = panelStyle;
  const panelPadding = normalizePadding(padding);
  const textAlign = text.attribute.textAlign;

  const body_rect = document.body.parentNode.getBoundingClientRect();
  const font_size = text.attribute.fontSize;
  const font_family = text.attribute.fontFamily || defaultFontFamily;
  const height = anchor.height + panelPadding[0] + panelPadding[2];
  const width = anchor.width + panelPadding[1] + panelPadding[3];

  const wrapper = document.createElement('div');

  modifyCSS(wrapper, {
    position: 'absolute',
    zIndex: 110,
    width: width + 'px',
    fontFamily: font_family,
    fontSize: font_size + 'px',
    height: height + 'px',
    lineHeight: height + 'px',
    left: anchor.left - body_rect.left - panelPadding[3] + 'px',
    top: anchor.top - body_rect.top - panelPadding[0] + 'px',
    padding: 0,
    margin: '0',
    background: 'white',
    outline: '1px dashed #AAA',
    boxShadow: '0 0 2px #AAA',
    textAlign: textAlign
  });
  chartContainer.append(wrapper);

  wrapper.style.visibility = 'visible';

  const input = document.createElement('textArea') as HTMLTextAreaElement;
  modifyCSS(input, {
    margin: 0,
    padding: 0,
    outline: 'none',
    border: 'none',
    width: '100%',
    height: '100%',
    verticalAlign: 'middle',
    fontSize: font_size + 'px',
    textAlign: textAlign,
    resize: 'none'
  });

  const textString = array(text.attribute.text).join('\n');
  input.value = needExpression ? (isNil(expression) ? '##' : expression || textString) : textString;

  wrapper.append(input);

  const update_size = function () {
    const currentValue = input.value.split('\n');
    const wrapperWidth = Math.max(
      width,
      measureText(currentValue, text.attribute).width + panelPadding[1] + panelPadding[3]
    );

    const wrapperHeight = Math.max(
      height,
      measureText(currentValue, text.attribute).height + panelPadding[0] + panelPadding[2]
    );

    modifyCSS(wrapper, {
      width: wrapperWidth + 'px',
      height: wrapperHeight + 'px'
    });
  };
  update_size();

  input.focus();
  input.select();

  input.addEventListener('wheel', e => {
    e.stopPropagation();
  });

  let isWrapperRemoved = false;

  const onBlur = function () {
    !isWrapperRemoved && wrapper.remove();
    isWrapperRemoved = true;
    if (change) {
      change(input.value);
    }
  };
  const onInput = function () {
    input.style.backgroundColor = '#FFF';
    update_size();
  };
  input.addEventListener('blur', onBlur);
  input.addEventListener('input', onInput);
  input.addEventListener('keydown', function (e) {
    e.stopPropagation();
  });
  input.addEventListener('keyup', function (e) {
    if (e.key === 'Escape') {
      input.removeEventListener('input', onInput);
      !isWrapperRemoved && wrapper.remove();
      isWrapperRemoved = true;
    }
    update_size();
  });
};
