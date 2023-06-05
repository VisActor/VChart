import type { IIndicatorItemSpec } from './interface';

export interface IIndicatorDatum {
  type: 'title' | 'content';
  index: number;
  datum: any;
  spec: IIndicatorItemSpec;
}

export interface IIndicatorMapper {
  title: IIndicatorItemSpec;
  content: IIndicatorItemSpec[];
  datum: () => any;
}

export const indicatorMapper = (data: Array<any>, op: IIndicatorMapper) => {
  const { datum, title, content } = op;
  const mappedData: Array<any> = [];
  const datumResult = datum.call(null);
  if (title.visible) {
    mappedData.push({
      type: 'title',
      index: 0,
      datum: datumResult,
      spec: title
    } as IIndicatorDatum);
  }
  content.forEach((c, i) => {
    if (c.visible) {
      mappedData.push({
        type: 'content',
        index: i,
        datum: datumResult,
        spec: c
      } as IIndicatorDatum);
    }
  });
  return mappedData;
};
