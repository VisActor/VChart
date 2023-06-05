import type { IIndicatorItemSpec } from './interface';

export const defaultIndicatorConfig = {
  title: {
    visible: true,
    autoLimit: false,
    autoFit: false,
    style: {
      fontSize: 20,
      fill: 'black',
      fontWeight: 'normal',
      fillOpacity: 1,
      textBaseline: 'top',
      textAlign: 'center'
    }
  } as IIndicatorItemSpec,
  content: {
    visible: true,
    style: {
      fontSize: 16,
      fill: 'black',
      fontWeight: 'normal',
      fillOpacity: 1,
      textBaseline: 'top',
      textAlign: 'center'
    }
  } as IIndicatorItemSpec
};
