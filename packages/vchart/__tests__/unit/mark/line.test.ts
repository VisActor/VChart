import { markContext as ctx } from '../../util/context';
import { LineMark } from '../../../src/mark/line';
import { LayoutZIndex } from '../../../src/constant';

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
    expect(lineMark1.getStyle('enableSegments')).toBe(undefined);

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
    expect(lineMark2.getStyle('enableSegments')).toBe(true);

    const lineMark3 = new LineMark('line1', ctx);
    lineMark3.created();
    //FIXME: 不能将类型“{ strokeDash: { scale: {}; }; }”分配给类型“ConvertToMarkStyleSpec<ILineMarkSpec>”。
    lineMark3.initStyleWithSpec({
      style: {
        lineDash: undefined
      }
    });
    expect(lineMark3.getStyle('enableSegments')).toBe(undefined);

    const lineMark4 = new LineMark('line1', ctx);
    lineMark4.created();
    lineMark4.initStyleWithSpec({
      style: {
        x: 0,
        y: 0,
        stroke: 'red'
      }
    });
    expect(lineMark4.getStyle('enableSegments')).toBeUndefined();
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
