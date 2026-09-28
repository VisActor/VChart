import { BOX_PLOT_OUTLIER_VALUE_FIELD } from '../../../src/constant/box-plot';
import { foldOutlierData, type IBoxPlotOutlierOpt } from '../../../src/data/transforms/box-plot';

describe('box plot transform options', () => {
  test('resolves lazy outlier options on every transform run', () => {
    let dimensionField = ['x'];
    let outliersField = 'outliers';
    let seriesField = 'series';
    const options = () =>
      ({
        dimensionField,
        outliersField,
        seriesField
      } as IBoxPlotOutlierOpt);
    const data = [
      {
        latestData: [{ x: 'A', y: 'B', outliers: [1], nextOutliers: [2], series: 'S', nextSeries: 'T' }]
      }
    ];

    const first = foldOutlierData(
      data as unknown as Parameters<typeof foldOutlierData>[0],
      options as unknown as Parameters<typeof foldOutlierData>[1]
    );
    expect(first[0]).toMatchObject({ [BOX_PLOT_OUTLIER_VALUE_FIELD]: 1, x: 'A', series: 'S' });

    dimensionField = ['y'];
    outliersField = 'nextOutliers';
    seriesField = 'nextSeries';

    const second = foldOutlierData(
      data as unknown as Parameters<typeof foldOutlierData>[0],
      options as unknown as Parameters<typeof foldOutlierData>[1]
    );
    expect(second[0]).toMatchObject({ [BOX_PLOT_OUTLIER_VALUE_FIELD]: 2, y: 'B', nextSeries: 'T' });
  });

  test('folds each numeric value from an outliersField array', () => {
    const rows = foldOutlierData(
      [
        {
          latestData: [
            { x: 'Sub-Saharan Africa', y6: [12.01, 12.02, 14.03] },
            { x: 'South Asia', y1: 9.4 }
          ]
        }
      ] as unknown as Parameters<typeof foldOutlierData>[0],
      {
        dimensionField: ['x'],
        outliersField: 'y6'
      }
    );

    expect(rows.map(row => row[BOX_PLOT_OUTLIER_VALUE_FIELD]).filter(value => typeof value === 'number')).toEqual([
      12.01, 12.02, 14.03
    ]);
    expect(rows[0]).toMatchObject({ [BOX_PLOT_OUTLIER_VALUE_FIELD]: 12.01, x: 'Sub-Saharan Africa' });
  });
});
