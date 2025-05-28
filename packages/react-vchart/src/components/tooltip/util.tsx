// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import React from 'react';
import type { BaseChartProps } from '../../charts/BaseChart';
import type { TooltipProps, TooltipRender } from './interface';
import type { ITooltipSpec } from '@visactor/vchart';
import { REACT_TOOLTIP_ClASS_NAME } from './constant';
import { createPortal } from 'react-dom';

/** tooltip 自定义插槽 */
export const initCustomTooltip = (
  setTooltipNode: React.Dispatch<React.SetStateAction<React.ReactNode>>,
  props: BaseChartProps,
  spec?: TooltipProps
) => {
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

        setTooltipNode(
          createPortal(<div className={REACT_TOOLTIP_ClASS_NAME}>{render(el, actualTooltip, params)}</div>, el)
        );
      }
    } as ITooltipSpec;
  }

  return spec as ITooltipSpec;
};
