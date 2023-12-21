import type {
  IColorComponentConfig,
  IFontFamilyComponentConfig,
  IFontSizeComponentConfig,
  IFontStyleComponentConfig,
  IInputComponentConfig,
  ISelectComponentConfig,
  ISliderNumberComponentConfig,
  ISwitchComponentConfig,
  ITextAlignComponentConfig
} from '../typings/config';

export const defaultBaseComponentConfig = {
  input: {
    label: '输入',
    default: null as null,
    placeHolder: '请输入内容'
  } as Omit<IInputComponentConfig, 'key'>,
  select: {
    label: '选择',
    default: null as null,
    options: [] as { value: string; label: string }[]
  } as Omit<ISelectComponentConfig, 'key'>,
  switch: {
    label: '开关',
    default: false
  } as Omit<ISwitchComponentConfig, 'key'>,
  sliderNumber: {
    label: '数值',
    default: 0,
    min: 0,
    max: 10,
    unit: null
  } as Omit<ISliderNumberComponentConfig, 'key'>,
  color: {
    label: '颜色',
    default: '#000000'
  } as Omit<IColorComponentConfig, 'key'>,
  fontFamily: {
    label: '字体',
    default: 'PingFangSC-Regular',
    options: [
      { value: '', label: '浏览器默认字体' },
      // { value: 'San Francisco', label: 'San Francisco' },
      // { value: 'PingFangSC-Regular', label: '苹方(PingFang-SC)' },
      // { value: 'Microsoft YaHei', label: '微软雅黑(Microsoft YaHei)' },
      { value: 'Times New Roman', label: 'Times New Roman' },
      { value: 'monospace', label: 'Monospace' }
    ]
  } as Omit<IFontFamilyComponentConfig, 'key'>,
  fontSize: {
    label: '字号',
    default: 10,
    min: 0,
    max: 40
  } as Omit<IFontSizeComponentConfig, 'key'>,
  fontStyle: {
    label: '样式',
    default: { bold: false, underline: false, italic: false }
  } as Omit<IFontStyleComponentConfig, 'key'>,
  textAlign: {
    label: '对齐方式',
    default: 'center'
  } as Omit<ITextAlignComponentConfig, 'key'>
};