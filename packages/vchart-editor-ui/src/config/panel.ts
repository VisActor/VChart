import type {
  IAxisPanelProps,
  IDataFormatPanelProps,
  ILabelPanelProps,
  ILegendPanelProps,
  ITitlePanelProps
} from '../typings/panel';

export const axisDefaultProps: IAxisPanelProps = {
  label: '轴',
  sections: {
    label: {
      label: '轴标签',
      entries: [
        { key: 'fontFamily', label: '字体' },
        { key: 'fontSize', label: '字号' },
        { key: 'fontStyle', label: '样式' },
        { key: 'color', label: '颜色' }
      ]
    },
    domain: {
      label: '轴线',
      entries: [
        { key: 'lineWidth', label: '线宽' },
        { key: 'dashInterval', label: '虚线间隔' },
        { key: 'strokeColor', label: '颜色' }
      ]
    }
  }
};

export const dataFormatDefaultProps: IDataFormatPanelProps = {
  label: '数据格式',
  sections: {
    format: {
      entries: [
        { key: 'unit', label: '数值单位' },
        { key: 'fixed', label: '小数位数' },
        { key: 'thousandsSeparator', label: '显示千分位分隔符' }
      ]
    }
  }
};

export const labelDefaultProps: ILabelPanelProps = {
  label: '数值标签',
  sections: {
    label: {
      entries: [
        { key: 'fontFamily', label: '字体' },
        { key: 'fontSize', label: '字号' },
        { key: 'fontStyle', label: '样式' },
        { key: 'color', label: '颜色' }
      ]
    }
  }
};

export const legendDefaultProps: ILegendPanelProps = {
  label: '图例',
  sections: {
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
    },
    label: {
      label: '图例标签',
      entries: [
        { key: 'fontFamily', label: '字体' },
        { key: 'fontSize', label: '字号' },
        { key: 'fontStyle', label: '样式' },
        { key: 'color', label: '颜色' }
      ]
    }
  }
};

export const titleDefaultProps: ITitlePanelProps = {
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
        { key: 'display', label: '显示副标题' },
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
