export type AddVChartPropertyContext = { keyMap: Map<string, number> };
export interface IAddVChartPropertyOpt {
  beforeCall: () => AddVChartPropertyContext;
  call: (d: any, i: number, context: AddVChartPropertyContext) => void;
}

export const addVChartProperty = (data: Array<any>, op: IAddVChartPropertyOpt) => {
  const context = op.beforeCall();
  data.forEach((d, i) => op.call(d, i, context));

  if (context.keyMap) {
    context.keyMap.clear();
    context.keyMap = null;
  }

  return data;
};
