import { AppearAction } from '../../../types/Appear';

export const defaultPayload: AppearAction['payload'] = {
  animation: {
    effect: 'grow',
    duration: 2000,
    easing: 'cubicOut',
    oneByOne: false,
    loop: false
  }
};
