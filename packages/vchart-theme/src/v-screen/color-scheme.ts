import { ColorScheme } from '@visactor/vchart-types/theme/color-scheme/interface';

export const vScreenColorScheme: Record<
  string,
  {
    name: string;
    colors: ColorScheme;
  }
> = {
  volcanoBlue: {
    name: '火山蓝',
    colors: ['#006EFF', '#00E5E5', '#2E55EA', '#B8E7FE', '#00D689', '#B7F9F5', '#FBCC71', '#F46E50']
  },
  clean: {
    name: '清新蜡笔',
    colors: ['#fd7f6f', '#7eb0d5', '#b2e061', '#bd7ebe', '#ffb55a', '#ffee65', '#beb9db', '#fdcce5', '#8bd3c7']
  },
  outskirts: {
    name: '郊外',
    colors: [
      '#cfcfcf',
      '#ffbc79',
      '#a2c8ec',
      '#898989',
      '#c85200',
      '#5f9ed1',
      '#595959',
      '#ababab',
      '#ff800e',
      '#006ba4'
    ]
  },
  blueOrange: {
    name: '汽车蓝橙',
    colors: ['#4ABEFF', '#E97A4B', '#A0D8FF', '#FFB99C', '#91A9B1', '#E9A94B', '#4BE99D', '#6F86FF']
  },
  financeYellow: {
    name: '金融黄',
    colors: ['#FFCF67', '#FF9254', '#D7D7D7', '#E1C396', '#FFB99C', '#C5BEB4', '#96B9A8', '#C59C7F']
  },
  wenLvCyan: {
    name: '文旅青',
    colors: ['#32E2CD', '#FFCE70', '#B03C3C', '#BEEAE4', '#D66E41', '#E1E1E1', '#3BC080', '#435BD8']
  },
  electricGreen: {
    name: '电力绿',
    colors: ['#08FEF3', '#FF7925', '#FBCC71', '#2EC8EA', '#B8FEF1', '#F9CFB7', '#D43A30', '#5FCEA6']
  },
  eCommercePurple: {
    name: '电商紫',
    colors: ['#734AFF', '#FF6960', '#5484FF', '#CDC4EC', '#EAC4C2', '#34CECC', '#FFB054', '#C13C5C']
  },
  redBlue: {
    name: '红蓝',
    colors: ['#006EFF', '#CC3B3B', '#B8E5FE', '#214FFF', '#FFCFCF', '#00E5E5', '#B7F9F5', '#FBCC71']
  },
  partyRed: {
    name: '党建红',
    colors: ['#E82F2F', '#FF9635', '#D7D7D7', '#E19B96', '#FFB99C', '#C5BEB4', '#B99696', '#C59C7F']
  }
};
