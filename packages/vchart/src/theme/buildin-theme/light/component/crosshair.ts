import type { ICrosshairRectSpec, ICrosshairTheme } from '../../../../component/crosshair/interface';

export const crosshair: ICrosshairTheme = {
  trigger: 'hover',
  xField: {
    visible: false,
    line: {
      type: 'rect',
      visible: true,
      style: {
        fill: '#b2bacf',
        opacity: 0.2,
        lineDash: [] as number[]
      }
    } as ICrosshairRectSpec,
    label: {
      visible: true,
      style: {
        fontWeight: 'normal',
        fill: '#fff',
        fontSize: 12
      },
      labelBackground: {
        padding: {
          bottom: 2,
          top: 2,
          left: 4,
          right: 4
        },
        style: {
          fill: 'rgba(47, 59, 82, 0.9)',
          cornerRadius: 4
        }
      }
    }
  },
  yField: {
    visible: false,
    line: {
      type: 'line',
      visible: true,
      style: {
        stroke: '#b2bacf',
        opacity: 0.2,
        lineDash: [] as number[]
      }
    },
    label: {
      visible: true,
      style: {
        fontWeight: 'normal',
        fill: '#fff',
        fontSize: 12
      },
      labelBackground: {
        padding: {
          bottom: 2,
          top: 2,
          left: 4,
          right: 4
        },
        style: {
          fill: 'rgba(47, 59, 82, 0.9)',
          cornerRadius: 4
        }
      }
    }
  },
  categoryField: {
    visible: false,
    line: {
      type: 'line',
      visible: true,
      style: {
        stroke: '#b2bacf',
        opacity: 0.2,
        lineDash: [] as number[]
      }
    },
    label: {
      visible: true,
      style: {
        fontWeight: 'normal',
        fill: '#fff',
        fontSize: 12
      },
      labelBackground: {
        padding: {
          bottom: 2,
          top: 2,
          left: 4,
          right: 4
        },
        style: {
          fill: 'rgba(47, 59, 82, 0.9)',
          cornerRadius: 4
        }
      }
    }
  },
  valueField: {
    visible: false,
    line: {
      type: 'line',
      visible: true,
      style: {
        stroke: '#b2bacf',
        opacity: 0.2,
        lineDash: [] as number[]
      }
    },
    label: {
      visible: true,
      style: {
        fontWeight: 'normal',
        fill: '#fff',
        fontSize: 12
      },
      labelBackground: {
        padding: {
          bottom: 2,
          top: 2,
          left: 4,
          right: 4
        },
        style: {
          fill: 'rgba(47, 59, 82, 0.9)',
          cornerRadius: 4
        }
      }
    }
  }
};
