/**
 * 主题的命名，不要使用类似 arco，default 等字段，应该要以主题的特征来，颜色/场景特征（light,dark）
 *
 * 1. 对除了 color 外的一些主题设置，应该要有专门的设计，**不要直接复制**
 * 2. 原则上来讲，默认值尽量都放主题中，但是也可根据情况自行判断
 * 3. 目前主题只到系列，不到系列的 mark，对于这个分界没有太清楚，后续根据需求再做开放
 */
import { DEFAULT_TEXT_FONT_FAMILY as fontFamily } from './config';
import type { ITheme } from '../interface';
import { lightTheme } from './light/index';

export const darkTheme: ITheme = {
  ...lightTheme,
  name: 'dark',
  fontFamily,
  colorScheme: {
    default: [
      '#5383F4',
      '#7BCF8E',
      '#FF9D2C',
      '#FFDB26',
      '#7568D9',
      '#80D8FB',
      '#1857A3',
      '#CAB0E8',
      '#FF8867',
      '#B9E493',
      '#2CB4A8',
      '#B9E4E3'
    ]
  }
};
