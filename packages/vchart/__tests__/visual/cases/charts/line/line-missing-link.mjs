import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 649d7f0b52a1e9eec95f9ed2
 * 验证目的：连接缺失值的折线与多系列数据。
 * 迁移说明：保留源数据、计算和回调；翻译通用显示文字，适配本地宿主。
 * 覆盖边界：仅验证静态最终状态，动画关闭，不代表下钻或悬停已验证。
 */
export default {
  createSpec() {
    // 在每次调用中重建原始配置及数据，保留来源中的确定性计算。
    const spec = {
      type: 'line',
      data: {
        values: [
          {
            medalType: 'Gold Medals',
            count: 40,
            year: '1952'
          },
          {
            medalType: 'Gold Medals',
            count: 32,
            year: '1956'
          },
          {
            medalType: 'Gold Medals',
            count: 34,
            year: '1960'
          },
          {
            medalType: 'Gold Medals',
            count: 36,
            year: '1964'
          },
          {
            medalType: 'Gold Medals',
            count: 45,
            year: '1968'
          },
          {
            medalType: 'Gold Medals',
            count: 33,
            year: '1972'
          },
          {
            medalType: 'Gold Medals',
            count: 34,
            year: '1976'
          },
          {
            medalType: 'Gold Medals',
            count: null,
            year: '1980'
          },
          {
            medalType: 'Gold Medals',
            count: 83,
            year: '1984'
          },
          {
            medalType: 'Gold Medals',
            count: 36,
            year: '1988'
          },
          {
            medalType: 'Gold Medals',
            count: 37,
            year: '1992'
          },
          {
            medalType: 'Gold Medals',
            count: 44,
            year: '1996'
          },
          {
            medalType: 'Gold Medals',
            count: 37,
            year: '2000'
          },
          {
            medalType: 'Gold Medals',
            count: 35,
            year: '2004'
          },
          {
            medalType: 'Gold Medals',
            count: 36,
            year: '2008'
          },
          {
            medalType: 'Gold Medals',
            count: 46,
            year: '2012'
          },
          {
            medalType: 'Silver Medals',
            count: 19,
            year: '1952'
          },
          {
            medalType: 'Silver Medals',
            count: 25,
            year: '1956'
          },
          {
            medalType: 'Silver Medals',
            count: 21,
            year: '1960'
          },
          {
            medalType: 'Silver Medals',
            count: 26,
            year: '1964'
          },
          {
            medalType: 'Silver Medals',
            count: 28,
            year: '1968'
          },
          {
            medalType: 'Silver Medals',
            count: 31,
            year: '1972'
          },
          {
            medalType: 'Silver Medals',
            count: 35,
            year: '1976'
          },
          {
            medalType: 'Silver Medals',
            count: null,
            year: '1980'
          },
          {
            medalType: 'Silver Medals',
            count: 60,
            year: '1984'
          },
          {
            medalType: 'Silver Medals',
            count: 31,
            year: '1988'
          },
          {
            medalType: 'Silver Medals',
            count: 34,
            year: '1992'
          },
          {
            medalType: 'Silver Medals',
            count: 32,
            year: '1996'
          },
          {
            medalType: 'Silver Medals',
            count: 24,
            year: '2000'
          },
          {
            medalType: 'Silver Medals',
            count: 40,
            year: '2004'
          },
          {
            medalType: 'Silver Medals',
            count: 38,
            year: '2008'
          },
          {
            medalType: 'Silver Medals',
            count: 29,
            year: '2012'
          },
          {
            medalType: 'Bronze Medals',
            count: 17,
            year: '1952'
          },
          {
            medalType: 'Bronze Medals',
            count: 17,
            year: '1956'
          },
          {
            medalType: 'Bronze Medals',
            count: 16,
            year: '1960'
          },
          {
            medalType: 'Bronze Medals',
            count: 28,
            year: '1964'
          },
          {
            medalType: 'Bronze Medals',
            count: 34,
            year: '1968'
          },
          {
            medalType: 'Bronze Medals',
            count: 30,
            year: '1972'
          },
          {
            medalType: 'Bronze Medals',
            count: 25,
            year: '1976'
          },
          {
            medalType: 'Bronze Medals',
            count: null,
            year: '1980'
          },
          {
            medalType: 'Bronze Medals',
            count: 30,
            year: '1984'
          },
          {
            medalType: 'Bronze Medals',
            count: 27,
            year: '1988'
          },
          {
            medalType: 'Bronze Medals',
            count: 37,
            year: '1992'
          },
          {
            medalType: 'Bronze Medals',
            count: 25,
            year: '1996'
          },
          {
            medalType: 'Bronze Medals',
            count: 33,
            year: '2000'
          },
          {
            medalType: 'Bronze Medals',
            count: 26,
            year: '2004'
          },
          {
            medalType: 'Bronze Medals',
            count: 36,
            year: '2008'
          },
          {
            medalType: 'Bronze Medals',
            count: 29,
            year: '2012'
          }
        ]
      },
      xField: 'year',
      yField: 'count',
      seriesField: 'medalType',
      invalidType: 'link'
    };

    return spec;
  },
  async verify(page) {
    // 完整配置和回调由 verifySpec 检查，另验证最终绘制或操作结果。
    await verifySourceSpec(page);
    await verifyRendered(page, 'series');
  }
};
