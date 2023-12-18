export const detectAxesType = (values: any[], field: string) => {
  const isNumber = values.every(d => !d[field] || !isNaN(Number(d[field])));
  if (isNumber) {
    return 'linear';
  } else {
    return 'band';
  }
};

export const CARTESIAN_CHART_LIST = [
  'Dynamic Bar Chart',
  'Bar Chart',
  'Line Chart',
  'Scatter Plot',
  'Funnel Chart',
  'Dual Axis Chart',
  'Waterfall Chart',
  'Box Plot Chart'
];
