export type AddVChartPropertyContext = {
  keyMap: Map<string, number>;
};
export interface IAddVChartPropertyOpt {
  beforeCall: () => AddVChartPropertyContext;
  call: (d: any, i: number, context: AddVChartPropertyContext) => void;
}
export declare const addVChartProperty: (data: Array<any>, op: IAddVChartPropertyOpt) => any[];
