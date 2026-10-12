---
category: examples
group: extension chart
title: '时序分析：步骤模式'
keywords: extension, sequenceAnalysis, step
order: 14
cover: /vchart/preview/sequence-analysis-step.png
option: sequenceAnalysisChart
---

# 时序分析：步骤模式

按步骤展示本地 demo 的用户事件与模式连接。

## 如何读图

这个示例用 10 位用户的 111 个事件展示行为步骤，以及数据中指定的模式关联。

- **纵轴与左侧头像**：每一行对应一个用户（`user_id`），头像来自 `userImageMap`。沿着同一行可以查看这个用户在各个步骤上的事件。
- **底部横轴**：`step_1`、`step_2` 等表示事件所属的步骤（`dots.step`）。它是分类轴，相邻步骤等距排列，间距不表示实际耗时。
- **顶部标签**：展示 `stepMediumMap` 为每个步骤配置的介质名称和附加数量。例如 `Device... +1` 中的 `+1` 来自该步骤的 `count`，是示例预先给定的业务数量，不是图中事件点的个数。
- **彩色圆点**：每个点是一条事件记录，颜色按 `action_type` 区分，例如注册、登录、评论等。点的位置由用户和步骤共同决定；同一用户在同一步骤的多条事件可能重叠。
- **连接线**：每条线对应一条 `patternData`，通过 `from` / `to` 指向事件的 `node_name`，表示示例指定的模式关联；线的颜色按 `pattern_type` 区分。同一行上的线关联同一用户的事件，跨行线关联不同用户的事件。
- **节点旁的短线**：本例开启了沿步骤带的连接延伸，并包含起终点为同一事件的模式记录，因此部分关联呈现为点旁的短线。延伸长度只是绘制样式，不代表持续时间或关联强度。

底部范围选择器用于筛选横轴范围；灰色横向滚动条用于平移可见步骤，右侧滚动条用于浏览其他用户。初始窗口只显示部分步骤和用户，可拖动查看完整数据。

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

const stepMediumMap = {
  step_1: {
    medium_type: 'IP',
    count: 0
  },
  step_2: {
    medium_type: 'Device',
    count: 1
  },
  step_3: {
    medium_type: 'User',
    count: 3
  },
  step_4: {
    medium_type: 'Liveroom',
    count: 3
  },
  step_5: {
    medium_type: 'User',
    count: 3
  },
  step_6: {
    medium_type: 'User',
    count: 3
  },
  step_7: {
    medium_type: 'User',
    count: 3
  },
  step_8: {
    medium_type: 'Liveroom',
    count: 3
  },
  step_9: {
    medium_type: 'Email',
    count: 3
  },
  step_10: {
    medium_type: 'Tel',
    count: 3
  },
  step_11: {
    medium_type: 'Medium',
    count: 3
  },
  step_12: {
    medium_type: 'Medium',
    count: 3
  },
  step_13: {
    medium_type: 'Medium',
    count: 3
  },
  step_14: {
    medium_type: 'Medium',
    count: 3
  },
  step_15: {
    medium_type: 'Medium',
    count: 3
  }
};

const patternData = [
  {
    from: 'event_002_1',
    to: 'event_002_1',
    pattern_type: 'pattern_001',
    isExtend: 'right'
  },
  {
    from: 'event_002_7',
    to: 'event_002_7',
    pattern_type: 'pattern_001',
    isExtend: 'left'
  },
  {
    from: 'event_004_2',
    to: 'event_004_2',
    pattern_type: 'pattern_001',
    isExtend: 'right'
  },
  {
    from: 'event_004_4',
    to: 'event_004_6',
    pattern_type: 'pattern_001'
  },
  {
    from: 'event_004_7',
    to: 'event_004_7',
    pattern_type: 'pattern_001',
    isExtend: 'left'
  },
  {
    from: 'event_004_8',
    to: 'event_004_8',
    pattern_type: 'pattern_002',
    isExtend: 'right'
  },
  {
    from: 'event_005_3',
    to: 'event_005_3',
    pattern_type: 'pattern_001',
    isExtend: 'left'
  },
  {
    from: 'event_005_4',
    to: 'event_005_5',
    pattern_type: 'pattern_001'
  },
  {
    from: 'event_005_6',
    to: 'event_005_6',
    pattern_type: 'pattern_001',
    isExtend: 'left'
  },
  {
    from: 'event_009_3',
    to: 'event_009_3',
    pattern_type: 'pattern_001',
    isExtend: 'right'
  },
  {
    from: 'event_009_4',
    to: 'event_009_5',
    pattern_type: 'pattern_001'
  },
  {
    from: 'event_009_6',
    to: 'event_009_6',
    pattern_type: 'pattern_001',
    isExtend: 'left'
  },
  {
    from: 'event_010_5',
    to: 'event_010_6',
    pattern_type: 'pattern_001'
  },
  {
    from: 'event_010_6',
    to: 'event_010_6',
    pattern_type: 'pattern_001',
    isExtend: 'right'
  },
  {
    from: 'event_010_8',
    to: 'event_010_8',
    pattern_type: 'pattern_002'
  },
  {
    from: 'event_010_10',
    to: 'event_010_10',
    pattern_type: 'pattern_002',
    isExtend: 'left'
  }
];

const actionData = [];

const spec = {
  type: 'sequenceAnalysis',
  mode: 'step',
  mediumConnection: false,
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
