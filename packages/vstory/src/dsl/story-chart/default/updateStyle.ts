import { UpdateStyleOption } from '../../types/UpdateStyle';

export const defaultUpdateStyle: UpdateStyleOption = {
  payload: {
    style: {},
    animation: {
      duration: 500,
      easing: 'linear'
    }
  }
};
