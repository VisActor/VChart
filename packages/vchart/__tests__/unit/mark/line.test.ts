import { markContext as ctx } from '../../util/context';
import { LineMark } from '../../../src/mark/line';

describe('Line Mark', () => {
  it('enableSegments', () => {
    const lineMark1 = new LineMark('line1', ctx);
    lineMark1.created();
    //FIXME: 不能将类型“() => void”分配给类型“FunctionType<string | IGradient | undefined>”
    lineMark1.initStyleWithSpec({
      style: {
        stroke: undefined
      }
    });
    expect((lineMark1 as any)._segmentStyleKeys.length).toBe(0);

    const lineMark2 = new LineMark('line1', ctx);
    lineMark2.created();
    //FIXME: 不能将类型“{ strokeDash: { type: string; }; }”分配给类型“ConvertToMarkStyleSpec<ILineMarkSpec>”。
    lineMark2.initStyleWithSpec({
      style: {
        lineDash: {
          type: 'linear',
          field: 'value',
          domain: [0, 1],
          range: [
            [4, 4],
            [4, 0]
          ]
        }
      }
    });
    expect((lineMark2 as any)._segmentStyleKeys).toEqual(['lineDash']);

    const lineMark3 = new LineMark('line1', ctx);
    lineMark3.created();
    //FIXME: 不能将类型“{ strokeDash: { scale: {}; }; }”分配给类型“ConvertToMarkStyleSpec<ILineMarkSpec>”。
    lineMark3.initStyleWithSpec({
      style: {
        lineDash: undefined
      }
    });
    expect((lineMark3 as any)._segmentStyleKeys.length).toBe(0);

    const lineMark4 = new LineMark('line1', ctx);
    lineMark4.created();
    lineMark4.initStyleWithSpec({
      style: {
        x: 0,
        y: 0,
        stroke: 'red'
      }
    });
    expect((lineMark4 as any)._segmentStyleKeys.length).toBe(0);
  });

  // FIXME: 'fill' does not exist in type 'IMarkSpec<ILineMarkSpec>'
  // it('ignoreAttributes', () => {
  //   const lineMark = new LineMark('line', ctx);
  //   lineMark.created();

  //   lineMark.initStyleWithSpec({
  //     fill: 'red',
  //     fillOpacity: 0
  //   });

  //   expect(lineMark.getStyle('fill')).toBeUndefined();
  //   expect(lineMark.getStyle('fillOpacity')).toBeUndefined();
  // });
});
