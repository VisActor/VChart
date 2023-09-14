import type {
  IFontFamilyComponentConfig,
  IFontStyleComponentConfig,
  ISliderNumberComponentConfig
} from '../typings/config';

export const defaultBaseComponentConfig = {
  sliderNumber: {
    label: '数值',
    default: 10,
    min: 1,
    max: 20
  } as ISliderNumberComponentConfig,
  fontFamily: {
    label: '字体',
    default: 'PingFangSC-Regular',
    options: [
      { value: 'PingFangSC-Regular', label: '苹方(PingFang-SC)' },
      { value: 'Microsoft YaHei', label: '微软雅黑(Microsoft YaHei)' }
    ]
  } as IFontFamilyComponentConfig,
  fontStyle: {
    label: '样式',
    default: { bold: false, underline: false, italic: false }
  } as IFontStyleComponentConfig
};
