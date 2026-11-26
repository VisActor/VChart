import { default as VChart } from '../../../../../src';
import type { ICartesianZ } from '../../../../../src/component/axis/cartesian/interface/spec';
import { LayoutZIndex } from '../../../../../src/constant/layout';
import { createCanvas, removeDom } from '../../../../util/dom';

const CATEGORIES = ['A', 'B', 'C', 'D', 'E'];
const VALUES = [-60, 40, -20, 80, 30];
const DATA = CATEGORIES.map((x, i) => ({ x, y: VALUES[i] }));

describe('cartesian axis crossValue', () => {
  let canvasDom: HTMLCanvasElement;
  let vchart: any;

  beforeEach(() => {
    canvasDom = createCanvas();
    canvasDom.style.position = 'relative';
    canvasDom.style.width = '500px';
    canvasDom.style.height = '400px';
    canvasDom.width = 500;
    canvasDom.height = 400;
  });

  afterEach(() => {
    removeDom(canvasDom);
    vchart?.release();
    vchart = null;
  });

  const render = (spec: any) => {
    vchart = new VChart(spec, { renderCanvas: canvasDom, animation: false });
    vchart.renderSync();
    return vchart;
  };

  const axisOf = (id: string) => vchart.getComponents().find((com: any) => com.userId === id) as any;
  const styleOf = (axis: any) => axis._axisMark.getSimpleStyle() ?? {};
  /** 真正决定分层的是图元上的 zIndex，不是 markConfig —— 后者写了不代表图元跟着变 */
  const zOf = (axis: any) => axis._axisMark.getProduct()?.attribute?.zIndex;
  /** 同理，偏移要看落到图元上的那个值：setSimpleStyle 丢掉字段不等于图元上被清掉 */
  const graphicDy = (axis: any) => axis._axisMark._component?.attribute?.dy;
  const isHorizontalAxis = (axis: any) => axis.getOrient() === 'top' || axis.getOrient() === 'bottom';
  /** 轴线最终落在图表坐标系的哪个位置 */
  const axisLinePos = (axis: any) => {
    const key = isHorizontalAxis(axis) ? 'y' : 'x';
    return axis.getLayoutStartPoint()[key] + (styleOf(axis)[`d${key}`] ?? 0);
  };
  /** 参照轴上某个刻度值在图表坐标系的位置 —— crossValue 的定义就是「轴线落在这里」 */
  const tickPos = (axis: any, value: any) => {
    const key = isHorizontalAxis(axis) ? 'x' : 'y';
    return axis.getLayoutStartPoint()[key] + axis.valueToPosition(value);
  };

  const barSpec = (valueAxis: any = {}, catAxis: any = {}, rest: any = {}) => ({
    type: 'bar',
    width: 500,
    height: 400,
    animation: false,
    data: [{ id: 'd', values: DATA }],
    xField: 'x',
    yField: 'y',
    axes: [
      { id: 'value', orient: 'left', type: 'linear', min: -100, max: 100, ...valueAxis },
      { id: 'cat', orient: 'bottom', type: 'band', ...catAxis }
    ],
    ...rest
  });

  describe('geometry', () => {
    it('pins a bottom axis onto the tick of the left axis', () => {
      render(barSpec({}, { crossValue: 0 }));
      const cat = axisOf('cat');
      const value = axisOf('value');

      expect(value.getScale().domain()).toEqual([-100, 100]);
      expect(axisLinePos(cat)).toBeCloseTo(tickPos(value, 0), 5);
      // 不经过 valueToPosition 的独立校验：对称 domain 的 0 刻度必须正落在值轴中点
      const range = value.getScale().range() as number[];
      expect(axisLinePos(cat) - (value.getLayoutStartPoint().y + range[1])).toBeCloseTo(
        value.getLayoutStartPoint().y + range[0] - axisLinePos(cat),
        5
      );
    });

    it('pins a top axis onto the tick of the left axis', () => {
      render(barSpec({}, { orient: 'top', crossValue: 25 }));
      const cat = axisOf('cat');
      expect(axisLinePos(cat)).toBeCloseTo(tickPos(axisOf('value'), 25), 5);
    });

    it('pins a left axis onto the band start of the bottom axis', () => {
      render(barSpec({ crossValue: 2 }, {}));
      const value = axisOf('value');
      const cat = axisOf('cat');
      expect(axisLinePos(value)).toBeCloseTo(tickPos(cat, CATEGORIES[2]), 5);
    });

    it('pins a right axis onto the band start of the bottom axis', () => {
      render(barSpec({ orient: 'right', crossValue: 3 }, {}));
      const value = axisOf('value');
      const cat = axisOf('cat');
      expect(axisLinePos(value)).toBeCloseTo(tickPos(cat, CATEGORIES[3]), 5);
    });

    it('follows an inverted perpendicular axis', () => {
      render(barSpec({ inverse: true }, { crossValue: 60 }));
      const cat = axisOf('cat');
      const value = axisOf('value');
      expect(value.getInverse()).toBe(true);
      expect(axisLinePos(cat)).toBeCloseTo(tickPos(value, 60), 5);
      // inverse 之后 60 落在下半区，比中点更靠下
      expect(axisLinePos(cat)).toBeGreaterThan(tickPos(value, 0));
    });

    it('stays on the tick when the perpendicular axis has innerOffset', () => {
      render(barSpec({ innerOffset: { top: 20, bottom: 30 } }, { crossValue: 0 }));
      const cat = axisOf('cat');
      const value = axisOf('value');
      const range = value.getScale().range() as number[];
      // innerOffset 让 range 不再贴着布局矩形的两端，用旧的 range[0] 相对量会整体偏 30px
      expect(range[0]).toBeCloseTo(value.getLayoutRect().height - 30, 5);
      expect(range[1]).toBeCloseTo(20, 5);
      expect(axisLinePos(cat)).toBeCloseTo(tickPos(value, 0), 5);
    });

    it('clamps an out-of-range value to the end of a continuous axis', () => {
      render(barSpec({}, { crossValue: 1000 }));
      const cat = axisOf('cat');
      const value = axisOf('value');
      // 越界不该让整根轴退回边上：夹到 domain 末端
      expect(axisLinePos(cat)).toBeCloseTo(tickPos(value, 100), 5);
    });

    it('clamps an out-of-range index to the end of a band axis', () => {
      render(barSpec({ crossValue: 99 }, {}));
      const value = axisOf('value');
      const cat = axisOf('cat');
      const range = cat.getScale().range() as number[];
      expect(axisLinePos(value)).toBeCloseTo(cat.getLayoutStartPoint().x + range[range.length - 1], 5);
    });
  });

  describe('layout', () => {
    it('gives the reserved band back to the plot area when the axis moves inside', () => {
      render(barSpec({}, {}));
      const baselineHeight = axisOf('cat').getLayoutRect().height;
      expect(baselineHeight).toBeGreaterThan(0);
      vchart.release();

      render(barSpec({}, { crossValue: 0 }));
      expect(axisOf('cat').getLayoutRect().height).toBe(0);
    });

    it('keeps reserving the band when the axis has a title', () => {
      render(barSpec({}, { crossValue: 0, title: { visible: true, text: 'category' } }));
      const cat = axisOf('cat');
      expect(cat.getLayoutRect().height).toBeGreaterThan(0);
      // 标题反向补偿，留在原来那条边上
      expect(styleOf(cat).title.dy).toBeCloseTo(-styleOf(cat).dy, 5);
    });

    it('keeps reserving the band for a field-alias title with no explicit text', () => {
      render(barSpec({}, { crossValue: 0, title: { visible: true } }));
      expect(axisOf('cat').getLayoutRect().height).toBeGreaterThan(0);
    });

    it('still reserves an explicitly sized band (documented limitation)', () => {
      render(barSpec({}, { crossValue: 0, height: 40 }));
      // 用户显式给的尺寸是 USER 级，布局不接受测量结果把它改掉 —— 轴照样移过去，但带子留着
      const cat = axisOf('cat');
      expect(cat.getLayoutRect().height).toBe(40);
      expect(axisLinePos(cat)).toBeCloseTo(tickPos(axisOf('value'), 0), 5);
    });

    it('keeps reserving when the value is clamped to an edge', () => {
      render(barSpec({}, { crossValue: -1000 }));
      // 夹到端点 = 还贴着边，不该把带子收掉
      expect(axisOf('cat').getLayoutRect().height).toBeGreaterThan(0);
    });

    it('raises the axis above the region', () => {
      render(barSpec({}, { crossValue: 0 }));
      const cat = axisOf('cat');
      const plain = axisOf('value');
      expect(zOf(cat)).toBeGreaterThan(zOf(plain));
      expect(zOf(cat)).toBeGreaterThan(LayoutZIndex.Region);
    });
  });

  describe('target axis resolution', () => {
    it('honours crossAxisId matched against the spec id', () => {
      render(
        barSpec(
          {},
          { crossValue: 0, crossAxisId: 'value2' },
          {
            axes: [
              { id: 'value', orient: 'left', type: 'linear', min: -100, max: 100 },
              { id: 'value2', orient: 'right', type: 'linear', min: -100, max: 300 },
              { id: 'cat', orient: 'bottom', type: 'band', crossValue: 0, crossAxisId: 'value2' }
            ]
          }
        )
      );
      const cat = axisOf('cat');
      expect(axisLinePos(cat)).toBeCloseTo(tickPos(axisOf('value2'), 0), 5);
      // 两根值轴的 domain 不同，0 的位置也不同 —— 绑错了这条会挂
      expect(axisLinePos(cat)).not.toBeCloseTo(tickPos(axisOf('value'), 0), 1);
    });

    it('does not match an internal component id', () => {
      render(barSpec({}, { crossValue: 0 }));
      const internalId = axisOf('value').id;
      vchart.release();

      // 内部自增 id 不是公开契约，拿它当 crossAxisId 不该命中任何轴
      render(barSpec({}, { crossValue: 0, crossAxisId: internalId }));
      expect(styleOf(axisOf('cat')).dy ?? 0).toBe(0);
    });

    it('honours crossAxisIndex as the index in the axes array', () => {
      render(
        barSpec(
          {},
          {},
          {
            axes: [
              { id: 'value', orient: 'left', type: 'linear', min: -100, max: 100 },
              { id: 'value2', orient: 'right', type: 'linear', min: -100, max: 300 },
              { id: 'cat', orient: 'bottom', type: 'band', crossValue: 0, crossAxisIndex: 1 }
            ]
          }
        )
      );
      const cat = axisOf('cat');
      expect(axisLinePos(cat)).toBeCloseTo(tickPos(axisOf('value2'), 0), 5);
    });

    it('counts crossAxisIndex against the spec, not the compacted component array', () => {
      render(
        barSpec(
          {},
          {},
          {
            axes: [
              // 非法 orient，不会建出组件 —— 组件数组从此跟 spec 下标错开
              { id: 'bogus', orient: 'nowhere' },
              { id: 'value', orient: 'left', type: 'linear', min: -100, max: 100 },
              { id: 'value2', orient: 'right', type: 'linear', min: -100, max: 300 },
              { id: 'cat', orient: 'bottom', type: 'band', crossValue: 0, crossAxisIndex: 2 }
            ]
          }
        )
      );
      expect(axisOf('bogus')).toBeUndefined();
      const cat = axisOf('cat');
      // spec 下标 2 是 value2；按组件数组算会落到 cat 自己身上，什么都不会动
      expect(axisLinePos(cat)).toBeCloseTo(tickPos(axisOf('value2'), 0), 5);
    });

    it('keeps an explicit target even when the value is out of its domain', () => {
      render(barSpec({}, { crossValue: 1000, crossAxisId: 'value' }));
      const cat = axisOf('cat');
      expect(axisLinePos(cat)).toBeCloseTo(tickPos(axisOf('value'), 100), 5);
    });

    it('prefers the axis whose domain covers the value', () => {
      render(
        barSpec(
          {},
          {},
          {
            axes: [
              { id: 'value', orient: 'left', type: 'linear', min: -100, max: 100 },
              { id: 'value2', orient: 'right', type: 'linear', min: 150, max: 300 },
              { id: 'cat', orient: 'bottom', type: 'band', crossValue: 200 }
            ]
          }
        )
      );
      const cat = axisOf('cat');
      expect(axisLinePos(cat)).toBeCloseTo(tickPos(axisOf('value2'), 200), 5);
    });

    it('binds to the perpendicular axis of its own region', () => {
      render({
        type: 'common',
        width: 500,
        height: 400,
        animation: false,
        data: [
          { id: 'd0', values: DATA },
          { id: 'd1', values: DATA }
        ],
        region: [{ id: 'r0' }, { id: 'r1' }],
        series: [
          { type: 'bar', regionIndex: 0, dataId: 'd0', xField: 'x', yField: 'y' },
          { type: 'bar', regionIndex: 1, dataId: 'd1', xField: 'x', yField: 'y' }
        ],
        axes: [
          { id: 'value0', orient: 'left', regionIndex: [0], type: 'linear', min: -100, max: 100 },
          { id: 'cat0', orient: 'bottom', regionIndex: [0], type: 'band', crossValue: 0 },
          { id: 'value1', orient: 'left', regionIndex: [1], type: 'linear', min: -100, max: 300 },
          { id: 'cat1', orient: 'bottom', regionIndex: [1], type: 'band', crossValue: 0 }
        ]
      });
      const cat1 = axisOf('cat1');
      expect(cat1.getRegions()[0]).not.toBe(axisOf('cat0').getRegions()[0]);
      expect(axisLinePos(cat1)).toBeCloseTo(tickPos(axisOf('value1'), 0), 5);
      // 不能绑到数组里排在前面、但属于另一个 region 的那根（两根 domain 不同，位置可区分）
      expect(axisLinePos(cat1)).not.toBeCloseTo(tickPos(axisOf('value0'), 0), 1);
    });
  });

  describe('lifecycle', () => {
    it('clears the offset when crossValue is removed', () => {
      render(barSpec({}, { crossValue: 0 }));
      expect(styleOf(axisOf('cat')).dy).not.toBe(0);

      vchart.updateSpec(barSpec({}, {}));
      const cat = axisOf('cat');
      expect(graphicDy(cat)).toBe(0);
      expect(cat.getLayoutRect().height).toBeGreaterThan(0);
      expect(zOf(cat)).toBe(zOf(axisOf('value')));
    });

    it('applies the offset when crossValue is added', () => {
      render(barSpec({}, {}));
      expect(styleOf(axisOf('cat')).dy ?? 0).toBe(0);

      vchart.updateSpec(barSpec({}, { crossValue: 0 }));
      const cat = axisOf('cat');
      expect(axisLinePos(cat)).toBeCloseTo(tickPos(axisOf('value'), 0), 5);
      expect(zOf(cat)).toBeGreaterThan(zOf(axisOf('value')));
    });

    it('follows a domain change', () => {
      render(barSpec({}, { crossValue: 0 }));
      vchart.updateSpec(barSpec({ min: -400, max: 100 }, { crossValue: 0 }));
      const cat = axisOf('cat');
      const value = axisOf('value');
      expect(value.getScale().domain()).toEqual([-400, 100]);
      expect(axisLinePos(cat)).toBeCloseTo(tickPos(value, 0), 5);
    });

    it('clears the offset when the target no longer resolves', () => {
      render(barSpec({}, { crossValue: 0 }));
      expect(styleOf(axisOf('cat')).dy).not.toBe(0);

      vchart.updateSpec(barSpec({}, { crossValue: 0, crossAxisId: 'nope' }));
      const cat = axisOf('cat');
      expect(graphicDy(cat)).toBe(0);
      // 轴线真的回到了底边，而不是只在 _simpleStyle 里没了那个字段
      expect(cat._axisMark.getProduct().AABBBounds.y1).toBeGreaterThan(cat.getRegions()[0].getLayoutRect().height / 2);
    });
  });

  describe('other marks', () => {
    it('keeps grid lines spanning the region', () => {
      render(barSpec({}, { crossValue: 0, grid: { visible: true } }));
      const cat = axisOf('cat');
      const gridStyle = cat._gridMark.getSimpleStyle();
      expect(gridStyle.dx ?? 0).toBe(0);
      expect(gridStyle.dy ?? 0).toBe(0);
    });

    it('moves the axis unit together with the axis', () => {
      render(barSpec({}, { crossValue: 0, unit: { visible: true, text: 'pcs' } }));
      const cat = axisOf('cat');
      expect(cat._unitText.attribute.dy).toBeCloseTo(styleOf(cat).dy, 5);
    });

    it('keeps the unit offset the user configured', () => {
      render(barSpec({}, { unit: { visible: true, text: 'pcs', style: { dy: 7 } } }));
      expect(axisOf('cat')._unitText.attribute.dy).toBe(7);
    });

    it('adds the cross offset on top of the configured unit offset', () => {
      render(barSpec({}, { crossValue: 0, unit: { visible: true, text: 'pcs', style: { dy: 7 } } }));
      const cat = axisOf('cat');
      expect(cat._unitText.attribute.dy).toBeCloseTo(styleOf(cat).dy + 7, 5);
    });
  });

  describe('z axis', () => {
    it('does not carry crossValue on the z branch of the spec type', () => {
      const zAxis: ICartesianZ = {
        orient: 'z',
        // @ts-expect-error z 轴没有「对面那根轴」，crossValue 一族不挂在它上面
        crossValue: 0
      };
      expect(zAxis.orient).toBe('z');
    });

    it('ignores a crossValue smuggled onto a z axis at runtime', () => {
      render(
        barSpec(
          {},
          {},
          {
            axes: [
              { id: 'value', orient: 'left', type: 'linear', min: -100, max: 100 },
              { id: 'cat', orient: 'bottom', type: 'band' },
              { id: 'z', orient: 'z', crossValue: 0 }
            ]
          }
        )
      );
      const z = axisOf('z');
      expect(z).toBeTruthy();
      expect(styleOf(z).dx ?? 0).toBe(0);
      expect(styleOf(z).dy ?? 0).toBe(0);
    });
  });

  describe('domainLine.onZero', () => {
    it('resolves onZeroAxisId against the spec id', () => {
      render(barSpec({}, { domainLine: { visible: true, onZero: true, onZeroAxisId: 'value' } }));
      const cat = axisOf('cat');
      const value = axisOf('value');
      const lineDy = styleOf(cat).line?.dy ?? 0;
      expect(lineDy).not.toBe(0);
      expect(cat.getLayoutStartPoint().y + lineDy).toBeCloseTo(tickPos(value, 0), 5);
    });

    it('lets crossValue win over onZero', () => {
      render(barSpec({}, { crossValue: 50, domainLine: { visible: true, onZero: true } }));
      const cat = axisOf('cat');
      expect(styleOf(cat).line?.dy ?? 0).toBe(0);
      expect(axisLinePos(cat)).toBeCloseTo(tickPos(axisOf('value'), 50), 5);
    });
  });
});
