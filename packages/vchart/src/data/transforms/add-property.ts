export type AddChartSpacePropertyContext = { keyMap: Map<string, number> };
export interface IAddChartSpacePropertyOpt {
  beforeCall: () => AddChartSpacePropertyContext;
  call: (d: any, i: number, context: AddChartSpacePropertyContext) => void;
}

export const addChartSpaceProperty = (data: Array<any>, op: IAddChartSpacePropertyOpt) => {
  const context = op.beforeCall();
  data.forEach((d, i) => op.call(d, i, context));

  if (context.keyMap) {
    context.keyMap.clear();
    context.keyMap = null;
  }

  return data;
};
