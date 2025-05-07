import { vennTransform } from '@visactor/vlayouts';

export const vennLayout = (
  data: Array<any>,
  op: {
    setField: string;
    valueField: string;
    getViewBox: () => {
      x0: number;
      x1: number;
      y0: number;
      y1: number;
    };
  }
) => {
  const viewBox = op.getViewBox();

  if (viewBox && data?.length) {
    return vennTransform(
      {
        setField: op.setField,
        valueField: op.valueField,
        ...viewBox
      },
      data
    );
  }

  return [];
};
