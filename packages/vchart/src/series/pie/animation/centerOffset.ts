import type { IAnimationTimeline, IAnimationTypeConfig } from '@visactor/vgrammar-core';
import { ARC_MIDDLE_ANGLE } from '../../../constant';
import type { IArcMark } from '../../../mark/arc';
import type { Datum } from '../../../typings';
import { isValidNumber, polarToCartesian } from '@visactor/vutils';

export type ICenterOffsetAnimationOptions = {
  distance?: number;
};

export function centerOffsetConfig(mark: IArcMark, originalConfig: IAnimationTypeConfig): IAnimationTimeline {
  const offset = originalConfig.options?.distance ?? 10;
  const duration = isValidNumber(originalConfig.duration) ? originalConfig.duration / 2 : 1000;
  const easing = originalConfig.options.easing ?? 'cubicOut';
  return {
    oneByOne: originalConfig.oneByOne,
    loop: originalConfig.loop ?? false,
    timeSlices: [
      {
        duration,
        effects: {
          easing,
          channel: {
            x: {
              from: (datum: Datum) => mark.getAttribute('x', datum),
              to: (datum: Datum) => {
                const center = mark.getAttribute('x', datum) as number;
                const point = polarToCartesian(
                  {
                    x: 0,
                    y: 0
                  },
                  offset,
                  datum[ARC_MIDDLE_ANGLE]
                );
                return center + point.x;
              }
            },
            y: {
              from: (datum: Datum) => mark.getAttribute('y', datum),
              to: (datum: Datum) => {
                const center = mark.getAttribute('y', datum) as number;
                const point = polarToCartesian(
                  {
                    x: 0,
                    y: 0
                  },
                  offset,
                  datum[ARC_MIDDLE_ANGLE]
                );
                return center + point.y;
              }
            }
          }
        }
      },
      {
        duration,
        effects: {
          easing,
          channel: {
            x: {
              to: (datum: Datum) => mark.getAttribute('x', datum),
              from: (datum: Datum) => {
                const center = mark.getAttribute('x', datum) as number;
                const point = polarToCartesian(
                  {
                    x: 0,
                    y: 0
                  },
                  offset,
                  datum[ARC_MIDDLE_ANGLE]
                );
                return center + point.x;
              }
            },
            y: {
              to: (datum: Datum) => mark.getAttribute('y', datum),
              from: (datum: Datum) => {
                const center = mark.getAttribute('y', datum) as number;
                const point = polarToCartesian(
                  {
                    x: 0,
                    y: 0
                  },
                  offset,
                  datum[ARC_MIDDLE_ANGLE]
                );
                return center + point.y;
              }
            }
          }
        }
      }
    ]
  };
}
