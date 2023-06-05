import { DEFAULT_TEXT_FONT_FAMILY as fontFamily, DEFAULT_TEXT_FONT_SIZE as fontSize } from '../../theme';
import type { IMapLabelSpec } from './interface';

export const DEFAULT_CONFIG: Partial<IMapLabelSpec> = {
  visible: true,
  offset: 12,
  position: 'top',
  space: 10,
  nameLabel: {
    visible: true,
    style: {
      textBaseline: 'middle',
      textAlign: 'left',
      fill: 'black',
      fontSize,
      fontFamily
    }
  },
  valueLabel: {
    visible: true,
    style: {
      textBaseline: 'middle',
      textAlign: 'left',
      fill: 'black',
      fontSize,
      fontFamily
    }
  },
  background: {
    visible: true,
    padding: { top: 4, bottom: 4, left: 6, right: 6 },
    style: {
      cornerRadius: 2,
      lineWidth: 1,
      fill: 'white',
      stroke: 'grey'
    }
  },
  leader: {
    visible: false,
    style: {
      lineWidth: 1,
      stroke: 'red'
    }
  }
};
