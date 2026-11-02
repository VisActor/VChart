const spec = {
  type: 'bar',
  data: {
    values: [
      { day: '周一', value: 12 },
      { day: '周二', value: 25 },
      { day: '周三', value: 18 },
      { day: '周四', value: 32 }
    ]
  },
  xField: 'day',
  yField: 'value',
  label: {
    visible: true,
    // 按标签回调签名使用第二个参数 datum；函数配置需要 JS 环境。
    formatMethod: (text, datum) => `${datum.day}: ${text}`
  }
};
