import { type ITextGraphicAttribute } from '@visactor/vrender';
import modifyCSS from './dom';
// eslint-disable-next-line no-duplicate-imports
import { array, isEmpty, isNil, normalizePadding } from '@visactor/vutils';

export type TextInfo = {
  textAttributes: ITextGraphicAttribute;
  anchor: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  container: HTMLDivElement;
  /**
   * 文本当前的内容表达式
   */
  expression?: string;
  /**
   * 需要处理表达式
   */
  needExpression?: boolean;
  /**
   * 输入框是否沿着文本中心点对齐
   */
  alignCenter?: boolean;
  /**
   * 文本内容改变时的回调
   * @param textContent 文本内容改变
   * @returns
   */
  onChange?: (textContent: string) => void;
  /**
   * 完成输入的回调
   * @param textContent
   * @returns
   */
  onSubmit?: (textContent: string) => void;
  /**
   * 面板样式
   */
  panelStyle?: any;
};

let text_measure_ctx: CanvasRenderingContext2D;

function measureText(text: string, font: string) {
  if (!text_measure_ctx) {
    const text_measure = document.createElement('canvas');
    text_measure_ctx = text_measure.getContext('2d');
  }

  text_measure_ctx.font = font;
  return text_measure_ctx.measureText(text);
}

function getFontString(textAttributes: ITextGraphicAttribute) {
  // font: font-style font-variant font-weight font-size/line-height font-family|caption|icon|menu|message-box|small-caption|status-bar|initial|inherit;

  let font = '';
  const { fontStyle, fontVariant, fontWeight, fontSize, fontFamily } = textAttributes;
  if (fontStyle) {
    font += `${fontStyle}`;
  }

  if (fontVariant) {
    font += ` ${fontVariant}`;
  }

  if (fontWeight) {
    font += ` ${fontWeight}`;
  }

  if (fontSize) {
    font += ` ${fontSize}px`;
  }

  if (fontFamily) {
    font += ` ${fontFamily}`;
  }

  return font;
}

export const setupSimpleTextEditor = function (textInfo: TextInfo) {
  const {
    textAttributes,
    anchor: inputAnchor,
    container: chartContainer,
    panelStyle = {},
    expression,
    needExpression,
    onSubmit,
    onChange,
    alignCenter
  } = textInfo;

  const anchor = {
    ...inputAnchor,
    x: inputAnchor.left + inputAnchor.width * 0.5,
    y: inputAnchor.top + inputAnchor.height * 0.5
  };

  const { padding = [0, 0, 0, 0] } = panelStyle;
  const panelPadding = normalizePadding(padding);
  const textAlign = textAttributes.textAlign;
  const fontString = getFontString(textAttributes);
  const placeholderMeasure = measureText('请输入文本', fontString);

  const body_rect = (document.body.parentNode as HTMLElement).getBoundingClientRect();
  const font_size = textAttributes.fontSize;
  const lineHeight = (textAttributes.lineHeight || font_size) as number;
  const height = anchor.height || lineHeight;
  const width = anchor.width || placeholderMeasure.width;

  const wrapper = document.createElement('div');

  modifyCSS(wrapper, {
    position: 'absolute',
    zIndex: 110,
    width: width + 'px',
    height: height + 'px',
    lineHeight: lineHeight + 'px',
    left: anchor.left - body_rect.left - panelPadding[3] + 'px',
    top: anchor.top - body_rect.top - panelPadding[0] + 'px',
    padding: panelPadding.map(val => val + 'px').join(' '),
    margin: '0',
    background: 'white',
    outline: '1px dashed #000',
    boxSizing: 'content-box'
  });
  chartContainer.append(wrapper);

  wrapper.style.visibility = 'visible';

  const editableDom = document.createElement('textArea') as HTMLTextAreaElement;
  editableDom.id = 'vchart-text-editor';
  modifyCSS(editableDom, {
    margin: 0,
    padding: 0,
    outline: 'none',
    border: 'none',
    width: '100%',
    height: '100%',
    font: fontString,
    verticalAlign: textAttributes.textBaseline,
    lineHeight: 'inherit',
    textAlign: textAlign,
    resize: 'none',
    display: 'inline-block',
    // minHeight: '1em',
    backfaceVisibility: 'hidden',
    background: 'transparent',
    overflow: 'hidden',
    wordBreak: 'normal',
    whiteSpace: 'pre',
    overflowWrap: 'break-word',
    boxSizing: 'content-box',
    color: textAttributes.fill
  });

  const textString = array(textAttributes.text).join('\n');
  const originText = needExpression ? (isNil(expression) ? '##' : expression || textString) : textString;
  editableDom.value = originText;

  // if (isEmpty(editableDom.value)) {
  editableDom.placeholder = '请输入文本';
  // }

  wrapper.append(editableDom);

  const update_size = function () {
    if (editableDom.value !== originText) {
      const currentValue = editableDom.value.split('\n');

      let maxWidth = 0;
      currentValue.forEach(value => {
        const currentWidth = measureText(value, fontString).width;
        if (currentWidth > maxWidth) {
          maxWidth = currentWidth;
        }
      });

      const textMeasure = {
        width: maxWidth,
        height: lineHeight * currentValue.length
      };

      let wrapperWidth;
      let wrapperHeight;
      if (needExpression) {
        wrapperWidth = Math.max(width, textMeasure.width);
        wrapperHeight = Math.max(height, textMeasure.height);
      } else {
        wrapperWidth = isEmpty(editableDom.value) ? placeholderMeasure.width : textMeasure.width;
        wrapperHeight = textMeasure.height || lineHeight;
      }

      modifyCSS(wrapper, {
        width: wrapperWidth + 'px',
        height: wrapperHeight + 'px'
      });

      if (alignCenter) {
        modifyCSS(wrapper, {
          left: anchor.x - wrapperWidth * 0.5 - body_rect.left - panelPadding[3] + 'px',
          top: anchor.y - wrapperHeight * 0.5 - body_rect.top - panelPadding[0] + 'px'
        });
      }
    }
  };
  update_size();

  const bindBlurEvent = (event?: MouseEvent) => {
    setTimeout(() => {
      editableDom.addEventListener('blur', onBlur);

      editableDom.focus();
    });
  };

  editableDom.select();

  bindBlurEvent();

  let isWrapperRemoved = false;

  const stopEvent = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const cleanUp = () => {
    if (isWrapperRemoved) {
      return;
    }
    isWrapperRemoved = true;
    editableDom.removeEventListener('blur', onBlur);
    editableDom.removeEventListener('input', onInput);
    editableDom.removeEventListener('keydown', onKeydown);
    editableDom.removeEventListener('keyup', onKeyup);

    window.removeEventListener('wheel', stopEvent, true);
    window.removeEventListener('beforeunload', onBlur);

    wrapper.remove();
  };

  const onBlur = function () {
    cleanUp();
    if (onSubmit) {
      onSubmit(editableDom.value);
    }
  };
  const onInput = function () {
    editableDom.style.backgroundColor = '#FFF';

    if (onChange) {
      onChange(editableDom.value);
    }
    update_size();
  };
  const onKeydown = function (e: Event) {
    e.stopPropagation();
  };
  const onKeyup = function (e: any) {
    if (e.key === 'Escape') {
      onBlur();
    }
    editableDom.focus();
    // update_size();
  };
  editableDom.addEventListener('input', onInput);
  editableDom.addEventListener('keydown', onKeydown);
  editableDom.addEventListener('keyup', onKeyup);

  window.addEventListener('wheel', stopEvent, {
    passive: false,
    capture: true
  });
  window.addEventListener('beforeunload', onBlur);
};
