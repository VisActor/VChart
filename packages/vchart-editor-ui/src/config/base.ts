import type { IBaseComponentConfig } from '../typings/config';

export const defaultBaseComponentConfig: Record<string, IBaseComponentConfig> = {
  sliderNumber: {
    label: '数值',
    value: { default: 10, min: 1, max: 20 }
  },
  fontSize: {
    label: '字号',
    value: { default: 10, min: 1, max: 20 }
  },
  fontFamily: {
    label: '字体',
    value: {
      default: { value: 'PingFangSC-Regular', label: '苹方(PingFang-SC)' },
      options: [
        { value: 'PingFangSC-Regular', label: '苹方(PingFang-SC)' },
        { value: 'Microsoft YaHei', label: '微软雅黑(Microsoft YaHei)' }
      ]
    }
  },
  fontStyle: {
    label: '样式',
    value: {
      default: { bold: false, underline: false, italic: false }
    }
  }
};
