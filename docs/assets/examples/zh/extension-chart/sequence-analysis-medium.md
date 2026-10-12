---
category: examples
group: extension chart
title: '时序分析：介质曲线连接'
keywords: extension, sequenceAnalysis, medium
order: 15
cover: /vchart/preview/sequence-analysis-medium.png
option: sequenceAnalysisChart
---

# 时序分析：介质曲线连接

按介质分类展示本地 demo 的用户事件，通过曲线表达模式连接。

## 如何读图

这个示例将同一批用户事件按介质分类对齐，用曲线展示跨事件的模式关联，便于观察不同用户、不同介质之间的联系。

- **纵轴与左侧头像**：每一行对应一个用户（`user_id`），头像来自 `userImageMap`。
- **顶部横轴**：`IP`、`Device`、`User`、`Liveroom`、`Email`、`Tel` 是事件的介质类型（`medium_type`）。横轴按类别等距排列，不表示时间先后或时间间隔。
- **彩色圆点**：每个点是一条事件记录，颜色按 `action_type` 区分。点的位置由用户和介质类型决定；同一用户在相同介质上的多条事件会落在同一位置，所以可见圆点数量可能少于事件总数。
- **曲线**：每条曲线对应一条 `patternData`，连接 `from` 和 `to` 指定的两个事件。跨行表示关联发生在不同用户的事件之间，跨列表示两个事件属于不同介质；曲线颜色按 `pattern_type` 区分。
- **多条相近的曲线**：本例保留了多条起终点相同的关联，例如 `event_001_1` 到 `event_002_2` 的三条记录。图表为它们分配不同曲率，便于分辨重复关联；弯曲程度不表示关联权重或强弱。

例如，`event_001_1` 位于用户 `user_001` 的 IP 列，`event_002_2` 位于用户 `user_002` 的 Device 列，两者之间的曲线表示数据中指定的模式关联。

底部范围选择器用于筛选介质范围；灰色横向滚动条用于平移可见类别，右侧滚动条用于浏览其他用户。初始窗口只显示部分数据。

## 代码演示

```javascript livedemo
const { registerSequenceAnalysis } = VChartExtension;
registerSequenceAnalysis({ VChart });

const eventData = [
  {
    user_id: 'user_010',
    user_image: 'https://tosv.byted.org/obj/bit-cloud/user_010.png',
    dots: [
      {
        step: 'step_1',
        action_type: 'register',
        node_name: 'event_010_1',
        medium_type: 'IP',
        time_stamp: 1751850000000,
        action_count: 20
      },
      {
        step: 'step_2',
        action_type: 'login',
        node_name: 'event_010_2',
        medium_type: 'Device',
        time_stamp: 1751853600000,
        action_count: 20
      },
      {
        step: 'step_3',
        action_type: 'im',
        node_name: 'event_010_3',
        medium_type: 'User',
        time_stamp: 1751857200000,
        action_count: 20
      },
      {
        step: 'step_4',
        action_type: 'comment',
        node_name: 'event_010_4',
        medium_type: 'Liveroom',
        time_stamp: 1751860800000,
        action_count: 20
      },
      {
        step: 'step_5',
        action_type: 'follow',
        node_name: 'event_010_5',
        medium_type: 'User',
        time_stamp: 1751857200000,
        action_count: 20
      },
      {
        step: 'step_6',
        action_type: 'im',
        node_name: 'event_010_6',
        medium_type: 'User',
        time_stamp: 1751857200000,
        action_count: 20
      },
      {
        step: 'step_7',
        action_type: 'SendGift',
        node_name: 'event_010_7',
        medium_type: 'User',
        time_stamp: 1751857200000,
        action_count: 20
      },
      {
        step: 'step_8',
        action_type: 'login',
        node_name: 'event_010_8',
        medium_type: 'Liveroom',
        time_stamp: 1751860800000,
        action_count: 20
      },
      {
        step: 'step_9',
        action_type: 'im',
        node_name: 'event_010_9',
        medium_type: 'Email',
        time_stamp: 1751864400000,
        action_count: 20
      },
      {
        step: 'step_10',
        action_type: 'comment',
        node_name: 'event_010_10',
        medium_type: 'Tel',
        time_stamp: 1751868000000,
        action_count: 20
      },
      {
        step: 'step_11',
        action_type: 'register',
        node_name: 'event_010_11',
        medium_type: 'Tel',
        time_stamp: 1751868000000,
        action_count: 20
      },
      {
        step: 'step_12',
        action_type: 'im',
        node_name: 'event_010_12',
        medium_type: 'Tel',
        time_stamp: 1751868000000,
        action_count: 20
      }
    ]
  },
  {
    user_id: 'user_009',
    user_image: 'https://tosv.byted.org/obj/bit-cloud/user_009.png',
    dots: [
      {
        step: 'step_1',
        action_type: 'register',
        node_name: 'event_009_1',
        medium_type: 'IP',
        time_stamp: 1751850000000,
        action_count: 2
      },
      {
        step: 'step_2',
        action_type: 'im',
        node_name: 'event_009_2',
        medium_type: 'Device',
        time_stamp: 1751853600000,
        action_count: 8
      },
      {
        step: 'step_3',
        action_type: 'comment',
        node_name: 'event_009_3',
        medium_type: 'User',
        time_stamp: 1751857200000,
        action_count: 20
      },
      {
        step: 'step_4',
        action_type: 'follow',
        node_name: 'event_009_4',
        medium_type: 'Liveroom',
        time_stamp: 1751860800000,
        action_count: 20
      },
      {
        step: 'step_5',
        action_type: 'SendGift',
        node_name: 'event_009_5',
        medium_type: 'User',
        time_stamp: 1751857200000,
        action_count: 20
      },
      {
        step: 'step_6',
        action_type: 'im',
        node_name: 'event_009_6',
        medium_type: 'User',
        time_stamp: 1751857200000,
        action_count: 20
      },
      {
        step: 'step_7',
        action_type: 'SendGift',
        node_name: 'event_009_7',
        medium_type: 'User',
        time_stamp: 1751857200000,
        action_count: 20
      },
      {
        step: 'step_8',
        action_type: 'login',
        node_name: 'event_009_8',
        medium_type: 'Liveroom',
        time_stamp: 1751860800000,
        action_count: 20
      },
      {
        step: 'step_9',
        action_type: 'im',
        node_name: 'event_009_9',
        medium_type: 'Email',
        time_stamp: 1751864400000,
        action_count: 20
      },
      {
        step: 'step_10',
        action_type: 'comment',
        node_name: 'event_009_10',
        medium_type: 'Tel',
        time_stamp: 1751868000000,
        action_count: 20
      },
      {
        step: 'step_11',
        action_type: 'register',
        node_name: 'event_009_11',
        medium_type: 'Tel',
        time_stamp: 1751868000000,
        action_count: 20
      },
      {
        step: 'step_12',
        action_type: 'im',
        node_name: 'event_009_12',
        medium_type: 'Tel',
        time_stamp: 1751868000000,
        action_count: 20
      },
      {
        step: 'step_13',
        action_type: 'follow',
        node_name: 'event_009_13',
        medium_type: 'Tel',
        time_stamp: 1751868000000,
        action_count: 20
      },
      {
        step: 'step_14',
        action_type: 'focus',
        node_name: 'event_009_14',
        medium_type: 'Tel',
        time_stamp: 1751868000000,
        action_count: 20
      },
      {
        step: 'step_15',
        action_type: 'like',
        node_name: 'event_009_15',
        medium_type: 'Tel',
        time_stamp: 1751868000000,
        action_count: 20
      }
    ]
  },
  {
    user_id: 'user_008',
    user_image: 'https://tosv.byted.org/obj/bit-cloud/user_008.png',
    dots: [
      {
        step: 'step_1',
        action_type: 'register',
        node_name: 'event_008_1',
        medium_type: 'IP',
        time_stamp: 1751850000000,
        action_count: 23
      },
      {
        step: 'step_2',
        action_type: 'login',
        node_name: 'event_008_2',
        medium_type: 'Device',
        time_stamp: 1751853600000,
        action_count: 5
      },
      {
        step: 'step_3',
        action_type: 'comment',
        node_name: 'event_008_3',
        medium_type: 'User',
        time_stamp: 1751857200000,
        action_count: 8
      },
      {
        step: 'step_4',
        action_type: 'SendGift',
        node_name: 'event_008_4',
        medium_type: 'Liveroom',
        time_stamp: 1751860800000,
        action_count: 9
      },
      {
        step: 'step_5',
        action_type: 'like',
        node_name: 'event_008_5',
        medium_type: 'User',
        time_stamp: 1751857200000,
        action_count: 33
      },
      {
        step: 'step_6',
        action_type: 'SendGift',
        node_name: 'event_008_6',
        medium_type: 'User',
        time_stamp: 1751857200000,
        action_count: 2
      },
      {
        step: 'step_7',
        action_type: 'follow',
        node_name: 'event_008_7',
        medium_type: 'User',
        time_stamp: 1751857200000,
        action_count: 9
      },
      {
        step: 'step_8',
        action_type: 'im',
        node_name: 'event_008_8',
        medium_type: 'Liveroom',
        time_stamp: 1751860800000,
        action_count: 33
      },
      {
        step: 'step_9',
        action_type: 'comment',
        node_name: 'event_008_9',
        medium_type: 'Email',
        time_stamp: 1751864400000,
        action_count: 2
      },
      {
        step: 'step_10',
        action_type: 'focus',
        node_name: 'event_008_10',
        medium_type: 'Tel',
        time_stamp: 1751868000000,
        action_count: 11
      }
    ]
  },
  {
    user_id: 'user_007',
    user_image: 'https://tosv.byted.org/obj/bit-cloud/user_007.png',
    dots: [
      {
        step: 'step_1',
        action_type: 'register',
        node_name: 'event_007_1',
        medium_type: 'IP',
        time_stamp: 1751850000000,
        action_count: 9
      },
      {
        step: 'step_2',
        action_type: 'im',
        node_name: 'event_007_2',
        medium_type: 'Device',
        time_stamp: 1751853600000,
        action_count: 6
      },
      {
        step: 'step_3',
        action_type: 'comment',
        node_name: 'event_007_3',
        medium_type: 'User',
        time_stamp: 1751857200000,
        action_count: 8
      },
      {
        step: 'step_4',
        action_type: 'follow',
        node_name: 'event_007_4',
        medium_type: 'Liveroom',
        time_stamp: 1751860800000,
        action_count: 9
      },
      {
        step: 'step_5',
        action_type: 'SendGift',
        node_name: 'event_007_5',
        medium_type: 'User',
        time_stamp: 1751857200000,
        action_count: 3
      }
    ]
  },
  {
    user_id: 'user_006',
    user_image: 'https://tosv.byted.org/obj/bit-cloud/user_006.png',
    dots: [
      {
        step: 'step_1',
        action_type: 'register',
        node_name: 'event_006_1',
        medium_type: 'IP',
        time_stamp: 1751850000000,
        action_count: 3
      },
      {
        step: 'step_2',
        action_type: 'im',
        node_name: 'event_006_2',
        medium_type: 'Device',
        time_stamp: 1751853600000,
        action_count: 7
      },
      {
        step: 'step_3',
        action_type: 'comment',
        node_name: 'event_006_3',
        medium_type: 'User',
        time_stamp: 1751857200000,
        action_count: 8
      },
      {
        step: 'step_4',
        action_type: 'follow',
        node_name: 'event_006_4',
        medium_type: 'Liveroom',
        time_stamp: 1751860800000,
        action_count: 9
      },
      {
        step: 'step_5',
        action_type: 'SendGift',
        node_name: 'event_006_5',
        medium_type: 'User',
        time_stamp: 1751857200000,
        action_count: 5
      },
      {
        step: 'step_6',
        action_type: 'im',
        node_name: 'event_006_6',
        medium_type: 'User',
        time_stamp: 1751857200000,
        action_count: 8
      },
      {
        step: 'step_7',
        action_type: 'SendGift',
        node_name: 'event_006_7',
        medium_type: 'User',
        time_stamp: 1751857200000,
        action_count: 9
      },
      {
        step: 'step_8',
        action_type: 'login',
        node_name: 'event_006_8',
        medium_type: 'Liveroom',
        time_stamp: 1751860800000,
        action_count: 6
      },
      {
        step: 'step_9',
        action_type: 'im',
        node_name: 'event_006_9',
        medium_type: 'Email',
        time_stamp: 1751864400000,
        action_count: 7
      },
      {
        step: 'step_10',
        action_type: 'comment',
        node_name: 'event_006_10',
        medium_type: 'Tel',
        time_stamp: 1751868000000,
        action_count: 8
      },
      {
        step: 'step_11',
        action_type: 'register',
        node_name: 'event_006_11',
        medium_type: 'Tel',
        time_stamp: 1751868000000,
        action_count: 5
      },
      {
        step: 'step_12',
        action_type: 'im',
        node_name: 'event_006_12',
        medium_type: 'Tel',
        time_stamp: 1751868000000,
        action_count: 4
      },
      {
        step: 'step_13',
        action_type: 'follow',
        node_name: 'event_006_13',
        medium_type: 'Tel',
        time_stamp: 1751868000000,
        action_count: 3
      },
      {
        step: 'step_14',
        action_type: 'focus',
        node_name: 'event_006_14',
        medium_type: 'Tel',
        time_stamp: 1751868000000,
        action_count: 4
      },
      {
        step: 'step_15',
        action_type: 'like',
        node_name: 'event_006_15',
        medium_type: 'Tel',
        time_stamp: 1751868000000,
        action_count: 8
      }
    ]
  },
  {
    user_id: 'user_005',
    user_image: 'https://tosv.byted.org/obj/bit-cloud/user_005.png',
    dots: [
      {
        step: 'step_1',
        action_type: 'register',
        node_name: 'event_005_1',
        medium_type: 'IP',
        time_stamp: 1751850000000,
        action_count: 9
      },
      {
        step: 'step_2',
        action_type: 'follow',
        node_name: 'event_005_2',
        medium_type: 'Device',
        time_stamp: 1751853600000,
        action_count: 11
      },
      {
        step: 'step_3',
        action_type: 'comment',
        node_name: 'event_005_3',
        medium_type: 'User',
        time_stamp: 1751857200000,
        action_count: 5
      },
      {
        step: 'step_4',
        action_type: 'follow',
        node_name: 'event_005_4',
        medium_type: 'Liveroom',
        time_stamp: 1751860800000,
        action_count: 6
      },
      {
        step: 'step_5',
        action_type: 'im',
        node_name: 'event_005_5',
        medium_type: 'User',
        time_stamp: 1751857200000,
        action_count: 8
      },
      {
        step: 'step_6',
        action_type: 'SendGift',
        node_name: 'event_005_6',
        medium_type: 'User',
        time_stamp: 1751857200000,
        action_count: 9
      }
    ]
  },
  {
    user_id: 'user_004',
    user_image: 'https://tosv.byted.org/obj/bit-cloud/user_004.png',
    dots: [
      {
        step: 'step_1',
        action_type: 'register',
        node_name: 'event_004_1',
        medium_type: 'IP',
        time_stamp: 1751850000000,
        action_count: 8
      },
      {
        step: 'step_2',
        action_type: 'login',
        node_name: 'event_004_2',
        medium_type: 'Device',
        time_stamp: 1751853600000,
        action_count: 9
      },
      {
        step: 'step_3',
        action_type: 'im',
        node_name: 'event_004_3',
        medium_type: 'User',
        time_stamp: 1751857200000,
        action_count: 7
      },
      {
        step: 'step_4',
        action_type: 'follow',
        node_name: 'event_004_4',
        medium_type: 'Liveroom',
        time_stamp: 1751860800000,
        action_count: 7
      },
      {
        step: 'step_5',
        action_type: 'like',
        node_name: 'event_004_5',
        medium_type: 'User',
        time_stamp: 1751857200000,
        action_count: 8
      },
      {
        step: 'step_6',
        action_type: 'im',
        node_name: 'event_004_6',
        medium_type: 'User',
        time_stamp: 1751857200000,
        action_count: 33
      },
      {
        step: 'step_7',
        action_type: 'SendGift',
        node_name: 'event_004_7',
        medium_type: 'User',
        time_stamp: 1751857200000,
        action_count: 4
      },
      {
        step: 'step_8',
        action_type: 'login',
        node_name: 'event_004_8',
        medium_type: 'Liveroom',
        time_stamp: 1751860800000,
        action_count: 6
      },
      {
        step: 'step_9',
        action_type: 'follow',
        node_name: 'event_004_9',
        medium_type: 'Tel',
        time_stamp: 1751868000000,
        action_count: 8
      }
    ]
  },
  {
    user_id: 'user_003',
    user_image: 'https://tosv.byted.org/obj/bit-cloud/user_003.png',
    dots: [
      {
        step: 'step_1',
        action_type: 'register',
        node_name: 'event_003_1',
        medium_type: 'IP',
        time_stamp: 1751850000000,
        action_count: 15
      },
      {
        step: 'step_2',
        action_type: 'im',
        node_name: 'event_003_2',
        medium_type: 'Device',
        time_stamp: 1751853600000,
        action_count: 2
      },
      {
        step: 'step_3',
        action_type: 'SendGift',
        node_name: 'event_003_3',
        medium_type: 'User',
        time_stamp: 1751857200000,
        action_count: 8
      },
      {
        step: 'step_4',
        action_type: 'follow',
        node_name: 'event_003_4',
        medium_type: 'Liveroom',
        time_stamp: 1751860800000,
        action_count: 9
      },
      {
        step: 'step_5',
        action_type: 'follow',
        node_name: 'event_003_5',
        medium_type: 'User',
        time_stamp: 1751857200000,
        action_count: 6
      },
      {
        step: 'step_6',
        action_type: 'follow',
        node_name: 'event_003_6',
        medium_type: 'User',
        time_stamp: 1751857200000,
        action_count: 8
      },
      {
        step: 'step_7',
        action_type: 'SendGift',
        node_name: 'event_003_7',
        medium_type: 'User',
        time_stamp: 1751857200000,
        action_count: 9
      },
      {
        step: 'step_8',
        action_type: 'login',
        node_name: 'event_003_8',
        medium_type: 'Liveroom',
        time_stamp: 1751860800000,
        action_count: 6
      },
      {
        step: 'step_9',
        action_type: 'focus',
        node_name: 'event_003_9',
        medium_type: 'Email',
        time_stamp: 1751864400000,
        action_count: 5
      },
      {
        step: 'step_10',
        action_type: 'login',
        node_name: 'event_003_10',
        medium_type: 'Tel',
        time_stamp: 1751868000000,
        action_count: 6
      },
      {
        step: 'step_11',
        action_type: 'follow',
        node_name: 'event_003_11',
        medium_type: 'Medium',
        time_stamp: 1751871600000,
        action_count: 8
      },
      {
        step: 'step_12',
        action_type: 'focus',
        node_name: 'event_003_12',
        medium_type: 'Medium',
        time_stamp: 1751871600000,
        action_count: 9
      },
      {
        step: 'step_13',
        action_type: 'follow',
        node_name: 'event_003_13',
        medium_type: 'Medium',
        time_stamp: 1751871600000,
        action_count: 11
      },
      {
        step: 'step_14',
        action_type: 'im',
        node_name: 'event_003_14',
        medium_type: 'Medium',
        time_stamp: 1751871600000,
        action_count: 12
      },
      {
        step: 'step_15',
        action_type: 'focus',
        node_name: 'event_003_15',
        medium_type: 'Medium',
        time_stamp: 1751871600000,
        action_count: 3
      }
    ]
  },
  {
    user_id: 'user_002',
    user_image: 'https://tosv.byted.org/obj/bit-cloud/user_002.png',
    dots: [
      {
        step: 'step_1',
        action_type: 'register',
        node_name: 'event_002_1',
        medium_type: 'IP',
        time_stamp: 1751850000000,
        action_count: 8
      },
      {
        step: 'step_2',
        action_type: 'login',
        node_name: 'event_002_2',
        medium_type: 'Device',
        time_stamp: 1751853600000,
        action_count: 7
      },
      {
        step: 'step_3',
        action_type: 'comment',
        node_name: 'event_002_3',
        medium_type: 'User',
        time_stamp: 1751857200000,
        action_count: 9
      },
      {
        step: 'step_4',
        action_type: 'SendGift',
        node_name: 'event_002_4',
        medium_type: 'Liveroom',
        time_stamp: 1751860800000,
        action_count: 11
      },
      {
        step: 'step_5',
        action_type: 'follow',
        node_name: 'event_002_5',
        medium_type: 'User',
        time_stamp: 1751857200000,
        action_count: 22
      },
      {
        step: 'step_6',
        action_type: 'im',
        node_name: 'event_002_6',
        medium_type: 'User',
        time_stamp: 1751857200000,
        action_count: 34
      },
      {
        step: 'step_7',
        action_type: 'focus',
        node_name: 'event_002_7',
        medium_type: 'User',
        time_stamp: 1751857200000,
        action_count: 6
      },
      {
        step: 'step_8',
        action_type: 'login',
        node_name: 'event_002_8',
        medium_type: 'Liveroom',
        time_stamp: 1751860800000,
        action_count: 9
      },
      {
        step: 'step_9',
        action_type: 'focus',
        node_name: 'event_002_9',
        medium_type: 'Email',
        time_stamp: 1751864400000,
        action_count: 12
      },
      {
        step: 'step_10',
        action_type: 'login',
        node_name: 'event_002_10',
        medium_type: 'Tel',
        time_stamp: 1751868000000,
        action_count: 11
      },
      {
        step: 'step_11',
        action_type: 'follow',
        node_name: 'event_002_11',
        medium_type: 'Medium',
        time_stamp: 1751871600000,
        action_count: 5
      },
      {
        step: 'step_12',
        action_type: 'focus',
        node_name: 'event_002_12',
        medium_type: 'Medium',
        time_stamp: 1751871600000,
        action_count: 6
      },
      {
        step: 'step_13',
        action_type: 'follow',
        node_name: 'event_002_13',
        medium_type: 'Medium',
        time_stamp: 1751871600000,
        action_count: 8
      },
      {
        step: 'step_14',
        action_type: 'im',
        node_name: 'event_002_14',
        medium_type: 'Medium',
        time_stamp: 1751871600000,
        action_count: 9
      }
    ]
  },
  {
    user_id: 'user_001',
    user_image: 'https://tosv.byted.org/obj/bit-cloud/user_001.png',
    dots: [
      {
        step: 'step_1',
        action_type: 'register',
        node_name: 'event_001_1',
        medium_type: 'IP',
        time_stamp: 1751850000000,
        action_count: 20
      },
      {
        step: 'step_2',
        action_type: 'login',
        node_name: 'event_001_2',
        medium_type: 'Device',
        time_stamp: 1751853600000,
        action_count: 10
      },
      {
        step: 'step_3',
        action_type: 'comment',
        node_name: 'event_001_3',
        medium_type: 'User',
        time_stamp: 1751857200000,
        action_count: 3
      },
      {
        step: 'step_4',
        action_type: 'SendGift',
        node_name: 'event_001_4',
        medium_type: 'Liveroom',
        time_stamp: 1751850000000,
        action_count: 2
      },
      {
        step: 'step_5',
        action_type: 'like',
        node_name: 'event_001_5',
        medium_type: 'User',
        time_stamp: 1751857200000,
        action_count: 5
      },
      {
        step: 'step_6',
        action_type: 'login',
        node_name: 'event_001_6',
        medium_type: 'User',
        time_stamp: 1751857200000,
        action_count: 8
      },
      {
        step: 'step_7',
        action_type: 'focus',
        node_name: 'event_001_7',
        medium_type: 'User',
        time_stamp: 1751857200000,
        action_count: 11
      },
      {
        step: 'step_8',
        action_type: 'login',
        node_name: 'event_001_8',
        medium_type: 'Liveroom',
        time_stamp: 1751850000000,
        action_count: 22
      },
      {
        step: 'step_9',
        action_type: 'focus',
        node_name: 'event_001_9',
        medium_type: 'Email',
        time_stamp: 1751864400000,
        action_count: 3
      },
      {
        step: 'step_10',
        action_type: 'login',
        node_name: 'event_001_10',
        medium_type: 'Tel',
        time_stamp: 1751868000000,
        action_count: 6
      }
    ]
  }
];

const userImageMap = {
  user_001: 'https://tosv.byted.org/obj/bit-cloud/user_001.png',
  user_002: 'https://tosv.byted.org/obj/bit-cloud/user_002.png',
  user_003: 'https://tosv.byted.org/obj/bit-cloud/user_003.png',
  user_004: 'https://tosv.byted.org/obj/bit-cloud/user_004.png',
  user_005: 'https://tosv.byted.org/obj/bit-cloud/user_005.png',
  user_006: 'https://tosv.byted.org/obj/bit-cloud/user_006.png',
  user_007: 'https://tosv.byted.org/obj/bit-cloud/user_007.png',
  user_008: 'https://tosv.byted.org/obj/bit-cloud/user_008.png',
  user_009: 'https://tosv.byted.org/obj/bit-cloud/user_009.png',
  user_010: 'https://tosv.byted.org/obj/bit-cloud/user_010.png'
};

const stepMediumMap = {};

const patternData = [
  {
    from: 'event_001_1',
    to: 'event_002_2',
    pattern_type: 'pattern_001'
  },
  {
    from: 'event_001_1',
    to: 'event_002_2',
    pattern_type: 'pattern_001'
  },
  {
    from: 'event_001_1',
    to: 'event_002_2',
    pattern_type: 'pattern_001'
  },
  {
    from: 'event_002_2',
    to: 'event_006_3',
    pattern_type: 'pattern_001'
  },
  {
    from: 'event_002_2',
    to: 'event_006_3',
    pattern_type: 'pattern_001'
  },
  {
    from: 'event_002_2',
    to: 'event_006_3',
    pattern_type: 'pattern_001'
  },
  {
    from: 'event_006_3',
    to: 'event_006_4',
    pattern_type: 'pattern_001'
  },
  {
    from: 'event_006_4',
    to: 'event_006_4',
    pattern_type: 'pattern_001'
  },
  {
    from: 'event_006_4',
    to: 'event_004_9',
    pattern_type: 'pattern_001'
  },
  {
    from: 'event_006_4',
    to: 'event_004_9',
    pattern_type: 'pattern_002'
  },
  {
    from: 'event_006_4',
    to: 'event_004_9',
    pattern_type: 'pattern_002'
  },
  {
    from: 'event_006_1',
    to: 'event_009_2',
    pattern_type: 'pattern_001'
  },
  {
    from: 'event_009_2',
    to: 'event_008_3',
    pattern_type: 'pattern_001'
  },
  {
    from: 'event_009_2',
    to: 'event_008_3',
    pattern_type: 'pattern_001'
  },
  {
    from: 'event_009_2',
    to: 'event_008_3',
    pattern_type: 'pattern_001'
  },
  {
    from: 'event_008_3',
    to: 'event_009_4',
    pattern_type: 'pattern_001'
  },
  {
    from: 'event_008_3',
    to: 'event_009_4',
    pattern_type: 'pattern_001'
  },
  {
    from: 'event_008_3',
    to: 'event_009_4',
    pattern_type: 'pattern_001'
  },
  {
    from: 'event_009_4',
    to: 'event_002_9',
    pattern_type: 'pattern_001'
  },
  {
    from: 'event_009_4',
    to: 'event_002_9',
    pattern_type: 'pattern_001'
  },
  {
    from: 'event_002_9',
    to: 'event_003_10',
    pattern_type: 'pattern_001'
  },
  {
    from: 'event_002_9',
    to: 'event_003_10',
    pattern_type: 'pattern_002'
  },
  {
    from: 'event_003_10',
    to: 'event_002_11',
    pattern_type: 'pattern_002'
  },
  {
    from: 'event_006_1',
    to: 'event_005_2',
    pattern_type: 'pattern_002'
  },
  {
    from: 'event_005_2',
    to: 'event_006_3',
    pattern_type: 'pattern_001'
  },
  {
    from: 'event_006_3',
    to: 'event_007_4',
    pattern_type: 'pattern_001'
  }
];

const actionData = [];

const spec = {
  type: 'sequenceAnalysis',
  mode: 'step',
  mediumConnection: true,
  actionTarget: false,
  height: 600,
  eventData,
  actionData,
  userImageMap,
  patternData,
  stepMediumMap
};
const container = document.getElementById(CONTAINER_ID);
container.style.height = '600px';
const vchart = new VChart(spec, { dom: container });
vchart.renderSync();
window.vchart = vchart;
```

[教程](/vchart/guide/tutorial_docs/Chart_Extensions/sequence_analysis) · [配置项](/vchart/option/sequenceAnalysisChart)
