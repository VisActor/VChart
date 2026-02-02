import type { IEventSeriesTheme } from './interface';

export const event: IEventSeriesTheme = {
  dotLabelGap: 6,
  titleSubTitleGap: 4,
  dot: {
    style: {
      size: 8
    }
  },
  line: {
    visible: true,
    style: {
      stroke: '#c0c3c7',
      lineWidth: 1
    }
  },
  title: {
    visible: true,
    style: {
      fontSize: 14
    }
  },
  subTitle: {
    visible: true,
    style: {
      fontSize: 12
    }
  },
  arrow: {
    visible: false,
    thickness: 16
  }
};
