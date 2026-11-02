import { Title } from '../../../../src/component/title/title';
import { ComponentTypeEnum } from '../../../../src/component/interface/type';
import { getTheme } from '../../../util/context';
import { Layout } from '../../../../src/layout';
import { LayoutItem } from '../../../../src/layout/layout-item';
import { registerBrowserEnv } from '../../../../src/env';
import { application } from '@visactor/vrender-core';

beforeAll(() => {
  registerBrowserEnv();
  application.global.setEnv('browser');
});

const ctx: any = {
  type: ComponentTypeEnum.title,
  eventDispatcher: { addEventListener: () => {} },
  mode: 'desktop-browser',
  globalInstance: {
    getContainer: () => ({}),
    getTooltipHandlerByUser: (): any => undefined,
    getStage: () => ({
      find: (): any => ({
        add: (component: { render: () => void }) => component.render()
      })
    })
  },
  getTheme: getTheme,
  getCompiler: () => ({}),
  getChart: () => ({
    getSpec: () => ({})
  }),
  getChartViewRect: () => ({ width: 800, height: 600 }),
  getRegionsInIndex: (): any[] => []
};

const layoutRect = { width: 500, height: 500, x: 0, y: 0 };

const createTitle = (spec: any) => {
  const title = new Title(spec as any, ctx);
  title.created();
  title.init({} as any);
  return title;
};

const getTitleAttribute = (title: Title) => (title as any)._titleComponent.attribute;

describe('Title Component Repro', () => {
  it('should not throw error when only subtext is set', () => {
    const spec = {
      visible: true,
      subtext: 'This is a subtitle'
      // text is undefined
    };

    const title = new Title(spec as any, ctx);
    title.created();
    title.init({});

    expect(() => {
      title.getBoundsInRect(layoutRect);
    }).not.toThrow();
  });
});

describe('Title layout cache', () => {
  it.each([
    ['top', 'normal'],
    ['bottom', 'normal'],
    ['left', 'normal'],
    ['right', 'normal'],
    ['top', 'normal-inline']
  ])('should preserve measured bounds for %s %s titles across incremental layouts', (orient, layoutType) => {
    const title = createTitle({
      visible: true,
      text: 'Title',
      textStyle: { fontSize: 12, lineHeight: 16 },
      orient,
      layoutType
    });
    const region = new LayoutItem({ id: 1 } as any, { layoutType: 'region', layoutLevel: 100 });
    const layout = new Layout();
    const runLayout = (width: number) => {
      layout.layoutItems(
        null as any,
        [title.layout, region],
        { x: 0, y: 0, width, height: 300 },
        {
          x1: 0,
          y1: 0,
          x2: width,
          y2: 300
        }
      );
    };

    runLayout(400);
    const dimension = orient === 'top' || orient === 'bottom' ? 'height' : 'width';
    const measuredSize = title.getLayoutRect()[dimension];
    expect(measuredSize).toBeGreaterThan(0);

    // resize 会重新测量标题；文字尺寸不变时也必须保存真实测量结果。
    title.layout.setWillLayoutTag();
    runLayout(401);
    expect(title.getLayoutRect()[dimension]).toBe(measuredSize);
    const resizedRegion = { ...region.getLayoutRect() };

    // 轴或图例触发的后续布局不会把标题标为 dirty，会直接复用标题缓存。
    runLayout(401);
    expect(region.getLayoutRect()).toEqual(resizedRegion);
    expect(region.getLayoutRect().width).toBeGreaterThan(0);
    expect(region.getLayoutRect().height).toBeGreaterThan(0);
  });
});

describe('Title size spec as ILayoutNumber', () => {
  it('should resolve percent `maxHeight` against the chart view rect', () => {
    const title = createTitle({ text: 'title', maxHeight: '50%' });
    title.getBoundsInRect(layoutRect as any);

    expect(getTitleAttribute(title).maxHeight).toBe(300);
  });

  it('should evaluate function `maxHeight` with the chart view rect', () => {
    let received: any;
    const title = createTitle({
      text: 'title',
      maxHeight: (rect: any) => {
        received = rect;
        return 72;
      }
    });
    title.getBoundsInRect(layoutRect as any);

    expect(getTitleAttribute(title).maxHeight).toBe(72);
    expect(received).toEqual({ width: 800, height: 600 });
  });

  it('should resolve percent `minHeight` against the chart view rect', () => {
    const title = createTitle({ text: 'title', minHeight: '10%' });
    title.getBoundsInRect(layoutRect as any);

    expect(getTitleAttribute(title).minHeight).toBe(60);
  });

  it('should take percent `height` as the layout height', () => {
    const title = createTitle({ text: 'title', height: '25%' });
    const bounds = title.getBoundsInRect(layoutRect as any);

    expect(getTitleAttribute(title).height).toBe(150);
    expect(bounds.y2 - bounds.y1).toBe(150);
  });

  it('should fold percent `maxWidth` once, against the chart view rect', () => {
    const title = createTitle({ text: 'title', maxWidth: '30%' });
    title.getBoundsInRect(layoutRect as any);

    expect(getTitleAttribute(title).maxWidth).toBe(240);
  });

  it('should still clamp `maxWidth` by the layout rect', () => {
    const title = createTitle({ text: 'title', maxWidth: '90%' });
    title.getBoundsInRect(layoutRect as any);

    expect(getTitleAttribute(title).maxWidth).toBe(500);
  });

  it('should keep numeric size config unchanged', () => {
    const title = createTitle({ text: 'title', maxHeight: 60, minWidth: 100 });
    title.getBoundsInRect(layoutRect as any);

    expect(getTitleAttribute(title).maxHeight).toBe(60);
    expect(getTitleAttribute(title).minWidth).toBe(100);
  });

  it('should leave unset size config undefined', () => {
    const title = createTitle({ text: 'title' });
    title.getBoundsInRect(layoutRect as any);

    const attribute = getTitleAttribute(title);
    expect(attribute.width).toBeUndefined();
    expect(attribute.height).toBeUndefined();
    expect(attribute.minHeight).toBeUndefined();
    expect(attribute.maxHeight).toBeUndefined();
  });
});
