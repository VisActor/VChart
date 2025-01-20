import { IRankingListSpec } from './interface';

export const defaultSpec: Omit<IRankingListSpec, 'type' | 'data' | 'xField' | 'yField'> = {
  width: 400,
  height: 225,
  labelLayout: 'top',
  bar: {
    height: 100,
    style: {
      cornerRadius: 5
    }
  },
  barBackground: {
    type: 'rect',
    style: {
      fill: 'rgba(255,255,255,0.1)',
      cornerRadius: 5
    }
  },
  rankingIcon: {
    visible: true,
    style: {
      fill: 'rgba(253,253,253,0.5)',
      size: 12
    }
  },
  nameLabel: {
    visible: true,
    style: {
      // fontFamily: ''
      fontSize: 20,
      fontWeight: 'normal',
      fill: 'rgba(255,255,255,0.7)',
      textBaseline: 'middle'
    }
  },
  orderLabel: {
    visible: true,
    style: {
      // fontFamily: ''
      fontSize: 20,
      fontWeight: 'normal',
      fill: 'rgba(255,255,255,0.7)',
      textBaseline: 'middle'
    }
  },
  valueLabel: {
    visible: true,
    style: {
      // fontFamily: ''
      fontSize: 14,
      fontWeight: 'normal',
      fill: 'rgba(255,255,255,1)',
      textBaseline: 'middle'
    }
  },
  pageSize: 5,
  scrollSize: 1,
  animationAppear: {
    enable: true,
    type: 'grow',
    duration: 1000,
    easing: 'linear'
  },
  animationUpdate: {
    enable: true,
    type: 'grow',
    duration: 1000,
    easing: 'linear'
  },
  animationNormal: {
    // enable: true,
    // type: 'scroll',
    interval: 1000
    // easing: 'linear'
  }
};
