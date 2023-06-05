import type { IDiscreteLegendTheme } from '../../../../component/legend';

export const discreteLegend: IDiscreteLegendTheme = {
  title: {
    visible: false,
    padding: 0,
    textStyle: {
      fontSize: 12,
      fill: '#333333',
      fontWeight: 'normal'
    },
    space: 12
  },
  item: {
    visible: true,
    spaceCol: 10,
    spaceRow: 10,
    padding: {
      top: 2,
      bottom: 2,
      left: 2,
      right: 2
    },
    // style: {},
    background: {
      state: {
        selectedHover: {
          fill: 'gray',
          fillOpacity: 0.7
        },
        unSelectedHover: {
          fill: 'gray',
          fillOpacity: 0.2
        }
      }
    },
    shape: {
      space: 4,
      // visible: true,
      state: {
        unSelected: {
          fillOpacity: 0.5
        }
      }
    },
    label: {
      space: 4,

      // visible: true,
      style: {
        fill: 'black',
        fontSize: 12
      },
      state: {
        unSelected: {
          fillOpacity: 0.5
        }
      }
    }
  },
  allowAllCanceled: false
};
