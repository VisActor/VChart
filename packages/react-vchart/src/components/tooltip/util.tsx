import React from 'react';
import type { BaseChartProps } from '../../charts/BaseChart';
import type { TooltipProps, TooltipRender } from './interface';
import type { ITooltipSpec } from '@visactor/vchart';
import { REACT_TOOLTIP_ClASS_NAME } from './constant';
import { createRoot } from 'react-dom/client';
import { render as reactRender } from 'react-dom';

/** tooltip 自定义插槽 */
export const initCustomTooltip = (props: BaseChartProps, spec?: TooltipProps) => {
  let render: TooltipRender;
  if (spec?.tooltipRender) {
    render = spec.tooltipRender;
    delete spec.tooltipRender;
  } else if (props.tooltipRender) {
    render = props.tooltipRender;
  }

  if (render) {
    let reserve: boolean;
    if (spec?.reserveDefaultTooltip) {
      reserve = spec.reserveDefaultTooltip;
      delete spec.reserveDefaultTooltip;
    } else {
      reserve = props.reserveDefaultTooltip;
    }
    return {
      ...spec,
      updateElement: (el, actualTooltip, params) => {
        const { changePositionOnly } = params;
        if (changePositionOnly) {
          return;
        }
        if (!reserve) {
          el.style.width = 'auto';
          el.style.height = 'auto';
          el.style.minHeight = 'auto';
          el.style.padding = '0px';
          for (let i = 0; i < el.children.length; i++) {
            const childNode = el.children[i] as HTMLElement;
            if (childNode.className !== REACT_TOOLTIP_ClASS_NAME && childNode.style.display !== 'none') {
              childNode.style.display = 'none';
            }
          }
        }

        let container = el.querySelector(`.${REACT_TOOLTIP_ClASS_NAME}`);
        if (!container) {
          // eslint-disable-next-line no-undef
          container = document.createElement('div');
          container.className = REACT_TOOLTIP_ClASS_NAME;
          el.appendChild(container);
        }
        const element = render(el, actualTooltip, params);
        const finalElement = React.isValidElement(element) ? element : <React.Fragment>{element}</React.Fragment>;

        if (createRoot) {
          if ((container as any).reactRoot) {
            (container as any).reactRoot.render(finalElement);
          } else {
            const root = createRoot(container);
            (container as any).reactRoot = root;
            root.render(finalElement);
          }
        } else {
          // react 17 以及以下
          reactRender(finalElement, container);
        }
      }
    } as ITooltipSpec;
  }

  return spec as ITooltipSpec;
};
