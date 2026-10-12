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

**设计上表达的关系：共享介质关系。** 查看不同用户经过的具体介质是否重合，例如同一台设备、同一个 IP 或同一个直播间。

**假设场景**：用户 A 通过 IP₁、用户 B 通过 IP₂，都使用设备 D 登录。两人的介质路径在设备 D 重合，提供了账号之间的关联线索；共同点是同一台设备 D，而不仅是都属于 Device 类型。

**本例数据**：曲线连接 `user_001` 的注册记录 `event_001_1`（IP 类）与 `user_002` 的登录记录 `event_002_2`（设备类）。本例仅提供类型和连接端点，未提供具体介质 ID，因此这条线演示连接效果，不能据此确认两人共享哪个介质。

- **坐标轴**：每行是一位用户，横轴是 IP、设备、用户、直播间等介质类型，不表示时间。
- **点与线**：点颜色区分行为，线颜色区分关联类别；同一用户、同类介质的事件可能重叠。相同端点的多条关联用不同曲率区分。
- **操作**：底部选择范围、横向滚动查看介质，右侧滚动查看其他用户。

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
