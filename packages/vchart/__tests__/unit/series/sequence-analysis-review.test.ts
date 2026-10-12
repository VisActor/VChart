import { DataSet, DataView, dataViewParser } from '@visactor/vdataset';
import { DotSeries } from '../../../src/series/dot/dot';
import { LinkSeries, registerLinkSeries } from '../../../src/series/link/link';
import { registerSequenceChart } from '../../../src/chart/sequence/sequence';
import { Factory } from '../../../src/core/factory';
import { factoryRegistry } from '../../../src/core/factory-registry';
import { linkDotInfo } from '../../../src/data/transforms/link-dot-info';
// eslint-disable-next-line max-len
import { SequenceAnalysisChartSpecTransformer } from '../../../../vchart-extension/src/charts/sequence-analysis/sequence-analysis-transformer';

const events = (time: number) => [
  {
    user_id: 'U1',
    dots: [
      { node_name: 'a', time_stamp: time },
      { node_name: 'b', time_stamp: time + 10 }
    ]
  },
  { user_id: 'U2', dots: [{ node_name: 'c', time_stamp: time + 20 }] }
];

describe('sequence analysis review regressions', () => {
  it('preserves user rows and link coordinates after fillData and raw-data updates', () => {
    const dataSet = new DataSet();
    dataSet.registerParser('dataview', dataViewParser);
    const raw = new DataView(dataSet).parse(events(10));
    const dot: any = new DotSeries(
      { type: 'dot', xField: 'time_stamp', yField: 'user_id', animation: false } as any,
      { dataSet, getSeriesData: () => raw, eventDispatcher: { dispatch: jest.fn() } } as any
    );
    dot._dataSet = dataSet;
    dot._fieldX = ['time_stamp'];
    dot._fieldY = ['user_id'];
    dot.initData();
    const link: any = new LinkSeries(
      { dotSeriesIndex: 0 } as any,
      {
        getChart: () => ({ getSeriesInIndex: () => [dot] })
      } as any
    );
    const verify = (time: number) => {
      dot.fillData();
      expect(raw.latestData).toHaveLength(2);
      expect(raw.latestData[0].dots).toHaveLength(2);
      expect(dot.getViewData().latestData).toHaveLength(3);
      const links = linkDotInfo([], {
        infoKey: 'dots',
        fields: () => ({ fromField: 'from', toField: 'to', xField: 'time_stamp', yField: 'user_id' }),
        linkData: () => [{ from: 'a', to: 'c' }],
        dotData: () => link._getDotData()
      });
      expect(links[0]).toMatchObject({
        from_xField: time,
        from_yField: 'U1',
        to_xField: time + 20,
        to_yField: 'U2'
      });
    };
    verify(10);
    verify(10);
    dot.updateRawData(events(40));
    verify(40);
    dataSet.destroy();
  });

  it.each([false, true])('keeps time-mode links visible with actionTarget = %s', actionTarget => {
    const spec: any = {
      type: 'sequenceAnalysis',
      mode: 'time',
      actionTarget,
      eventData: events(10),
      actionData: [{ from: 'a', to: 'c' }],
      userImageMap: {},
      stepMediumMap: {}
    };
    new SequenceAnalysisChartSpecTransformer({ type: 'sequenceAnalysis' }).transformSpec(spec);
    const link = spec.series[0];
    expect(link.linkType).toBe('line');
    expect(link.link.visible).not.toBe(false);
    expect(link.link.style?.visible).not.toBe(false);
    expect(link.imageLabel.visible).toBe(actionTarget);
    expect(link.arrow.style.visible).toBe(actionTarget);
  });

  it.each([registerLinkSeries, registerSequenceChart])('registers curve and image marks on demand (%#)', register => {
    const marks = { ...factoryRegistry.marks };
    const graphics = { ...factoryRegistry.graphicComponents };
    try {
      delete factoryRegistry.marks.path;
      delete factoryRegistry.marks.image;
      delete factoryRegistry.graphicComponents.path;
      delete factoryRegistry.graphicComponents.image;
      register();
      for (const type of ['path', 'image']) {
        const mark = Factory.createMark(type, type, {} as any);
        expect(mark?.type).toBe(type);
        expect(Factory.createGraphicComponent(type, {}).type).toBe(type);
        mark.release();
      }
    } finally {
      Object.assign(factoryRegistry.marks, marks);
      Object.assign(factoryRegistry.graphicComponents, graphics);
    }
  });
});
