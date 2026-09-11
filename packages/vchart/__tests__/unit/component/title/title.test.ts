import { Title } from '../../../../src/component/title/title';
import { ComponentTypeEnum } from '../../../../src/component/interface/type';
import { getTheme } from '../../../util/context';

const ctx: any = {
  type: ComponentTypeEnum.title,
  eventDispatcher: { addEventListener: () => {} },
  mode: 'desktop-browser',
  globalInstance: {
    getContainer: () => ({}),
    getTooltipHandlerByUser: (): any => undefined,
    getStage: () => ({
      find: (): any => ({
        add: () => {}
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
