import type { ITitleComponentProps } from '../typings/components';

export const titleDefaultProps: Omit<ITitleComponentProps, 'spec'> = {
  label: '图表标题',
  sections: {
    title: {
      label: '主标题',
      entries: [
        { key: 'text' },
        { key: 'fontSize', label: '字号' },
        { key: 'fontFamily', label: '字体' },
        { key: 'fontStyle', label: '样式' },
        { key: 'color', label: '颜色' }
      ]
    },
    subTitle: {
      label: '副标题',
      entries: [
        { key: 'text' },
        { key: 'fontSize', label: '字号' },
        { key: 'fontFamily', label: '字体' },
        { key: 'fontStyle', label: '样式' },
        { key: 'color', label: '颜色' }
      ]
    },
    align: {
      label: '排列',
      entries: [
        {
          key: 'position',
          label: '显示位置',
          options: [
            { value: 'left', label: '居左' },
            { value: 'center', label: '居中' },
            { value: 'right', label: '居右' }
          ]
        },
        { key: 'textAlign', label: '对齐方式' }
      ]
    }
  }
};
