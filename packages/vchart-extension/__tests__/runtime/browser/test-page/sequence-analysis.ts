import { registerSequenceAnalysis } from '../../../../src';
import { VChart } from '@visactor/vchart';
import type {
  ActionData,
  EventData,
  ISequenceAnalysisSpec,
  PatternData,
  UserImageMap
} from '../../../../src/charts/sequence-analysis/interface';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import trainingData2 from '../data/sequence-scatter/Training_process2/data.json';
// import bgimgData from '../data/sequence-scatter/Training_process1/bgimg_data.json';

// 模拟绘制点的 EventData 数据
const eventData: EventData[] = [
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
  }
].reverse();
const tickData = [];
const timeCountMap = {};
eventData.forEach(user => {
  user.dots.forEach(e => {
    timeCountMap[e.time_stamp] = e.action_count;
    tickData.push({
      time_stamp: e.time_stamp,
      action_count: e.action_count
    });
  });
});

// 模拟绘制用户头像的 UserImageMap 数据
const userImageMap: UserImageMap = {
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

const stepMediumMap: Record<string, string> = {
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

// 模拟绘制 pattern 的 PatternData 数据
const patternData: PatternData[] = [
  {
    from: 'event_002_1',
    to: 'event_002_1',
    pattern_type: 'pattern_001',
    isExtend: 'right'
  },
  {
    from: 'event_002_4',
    to: 'event_006',
    pattern_type: 'pattern_001'
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
    from: 'event_004_10',
    to: 'event_004_10',
    pattern_type: 'pattern_002'
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

const patternDataCurve: PatternData[] = [
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

// 模拟绘制箭头的 ActionData 数据
const actionData: ActionData[] = [
  {
    from: 'event_002_2',
    to: 'event_003_2',
    user_image: userImageMap['user_003'],
    user_id: 'user_003'
  },
  {
    from: 'event_003_4',
    to: 'event_004_4',
    user_image: userImageMap['user_003'],
    user_id: 'user_003'
  },
  {
    from: 'event_003_5',
    to: 'event_004_5',
    user_image: userImageMap['user_003'],
    user_id: 'user_003'
  },
  {
    from: 'event_004_5',
    to: 'event_005_5',
    user_image: userImageMap['user_004'],
    user_id: 'user_004'
  },
  {
    from: 'event_005_5',
    to: 'event_006_5',
    user_image: userImageMap['user_005'],
    user_id: 'user_005'
  },
  {
    from: 'event_006_5',
    to: 'event_007_5',
    user_image: userImageMap['user_006'],
    user_id: 'user_006'
  },
  {
    from: 'event_006_7',
    to: 'event_007_7',
    user_image: userImageMap['user_006'],
    user_id: 'user_006'
  },
  {
    from: 'event_006_8',
    to: 'event_007_8',
    user_image: userImageMap['user_007'],
    user_id: 'user_007'
  },
  {
    from: 'event_006_9',
    to: 'event_007_9',
    user_image: userImageMap['user_006'],
    user_id: 'user_006'
  },
  {
    from: 'event_006_10',
    to: 'event_007_10',
    user_image: userImageMap['user_006'],
    user_id: 'user_006'
  },
  {
    from: 'event_008_2',
    to: 'event_009_2',
    user_image: userImageMap['user_008'],
    user_id: 'user_008'
  },
  {
    from: 'event_008_3',
    to: 'event_009_3',
    user_image: userImageMap['user_008'],
    user_id: 'user_008'
  },
  {
    from: 'event_008_10',
    to: 'event_009_10',
    user_image: userImageMap['user_008'],
    user_id: 'user_008'
  }
];

const spec_1: ISequenceAnalysisSpec = {
  type: 'sequenceAnalysis',
  mode: 'step',
  mediumConnection: false,
  actionTarget: false,
  eventData,
  actionData,
  userImageMap,
  patternData,
  stepMediumMap
};

const spec_2: ISequenceAnalysisSpec = {
  type: 'sequenceAnalysis',
  mode: 'step',
  mediumConnection: true,
  actionTarget: true,
  eventData,
  actionData,
  userImageMap,
  patternData: patternDataCurve,
  stepMediumMap
};

const spec_3: ISequenceAnalysisSpec = {
  type: 'sequenceAnalysis',
  mode: 'time',
  mediumConnection: true,
  actionTarget: true,
  eventData,
  actionData,
  userImageMap,
  patternData,
  stepMediumMap
};

const spec_4: ISequenceAnalysisSpec = {
  type: 'sequenceAnalysis',
  mode: 'time',
  mediumConnection: true,
  actionTarget: false,
  eventData,
  actionData,
  userImageMap,
  patternData,
  stepMediumMap
};

const spec1 = {
  type: 'sequenceAnalysis',
  series: [
    {
      type: 'link',
      dataId: 'patternData',
      dotSeriesIndex: 1,
      fromField: 'from',
      toField: 'to',
      seriesField: 'pattern_type',
      allowExtend: true,
      arrow: {
        visible: false
      },

      link: {
        state: {
          custom_unSelected: {
            strokeOpacity: 0.5,
            stroke: 'grey'
          }
        }
      }
    },
    {
      type: 'dot',
      xField: 'step',
      yField: 'user_id',
      titleField: 'user_id',
      seriesField: 'action_type',
      dataIndex: 0,
      highLightSeriesGroup: '',
      title: {
        visible: false,
        style: {
          fill: 'rgba(46, 47, 50)'
        }
      },
      grid: {
        style: {
          visible: false
        }
      },
      dot: {
        state: {
          custom_unSelected: {
            fillOpacity: 0.5,
            fill: 'grey'
          }
        }
      },
      symbol: {
        visible: false
      }
    }
  ],
  data: [
    {
      id: 'eventData',
      values: eventData
    },
    {
      id: 'actionData',
      values: actionData
    },
    {
      id: 'patternData',
      values: patternData
    }
  ],
  axes: [
    {
      orient: 'top',
      type: 'band',
      // bandSize: 800,
      label: {
        formatMethod: label => {
          return {
            type: 'rich',
            text: [
              {
                text: `${(stepMediumMap[label] as any).medium_type}... `,
                fontSize: 12
              },
              {
                text: `+${(stepMediumMap[label] as any).count}`,
                fontSize: 12,
                background: 'grey',
                backgroundOpacity: 0.4,
                backgroundCornerRadius: 5
              }
            ]
          };
        }
      }
    },
    {
      orient: 'bottom',
      // bandSize: 800,
      type: 'band',
      bandPadding: 0
    },
    {
      orient: 'left',
      type: 'band',
      domainLine: {
        visible: false
      },
      tick: {
        visible: false
      },
      label: {
        formatMethod: label => {
          return {
            type: 'rich',
            text: [{ image: userImageMap[label], width: 40, height: 40 }]
          };
        }
      },
      grid: {
        visible: true,
        style: {
          lineDash: [3, 3]
        }
      }
    }
  ],
  dataZoom: [
    {
      orient: 'bottom',
      start: 0,
      end: 1,
      showDetail: true,
      axisId: 'step_bottom'
      // filterMode: 'axis'
    }
  ],
  scrollBar: [
    {
      orient: 'bottom',
      auto: true,
      axisIndex: 0,
      filterMode: 'axis'
    }
  ]
};

const spec2 = {
  type: 'sequenceAnalysis',
  series: [
    {
      type: 'link',
      dataId: 'patternData',
      dotSeriesIndex: 1,
      fromField: 'from',
      toField: 'to',
      seriesField: 'user_id',
      linkType: 'curve',
      arrow: {
        visible: false
      },
      link: {
        style: {
          lineWidth: 1,
          stroke: 'red'
        }
      }
    },
    {
      type: 'dot',
      // xField: 'step',
      xField: 'medium_type',
      yField: 'user_id',
      seriesField: 'action_type',
      titleField: 'user_id',
      dataIndex: 0,
      highLightSeriesGroup: '',
      title: {
        visible: false,
        style: {
          fill: 'rgba(46, 47, 50)'
        }
      },
      grid: {
        style: {
          visible: false
        }
      },
      symbol: {
        visible: false
      }
    }
  ],
  data: [
    {
      id: 'eventData',
      values: eventData
    },
    {
      id: 'actionData',
      values: actionData
    },
    {
      id: 'patternData',
      values: patternDataCurve
    }
  ],
  axes: [
    {
      orient: 'top',
      type: 'band'
      // bandSize: 600
      // label: {
      //   formatMethod: label => {
      //     return {
      //       type: 'rich',
      //       text: [
      //         {
      //           text: `${(stepMediumMap[label] as any).medium}`,
      //           fontSize: 12
      //         },
      //         {
      //           text: ` +${(stepMediumMap[label] as any).count}`,
      //           fontSize: 12,
      //           background: 'grey',
      //           backgroundOpacity: 0.4,
      //           backgroundCornerRadius: 5
      //         }
      //       ]
      //     };
      //   }
      // }
    },
    // {
    //   orient: 'bottom',
    //   // bandSize: 800,
    //   type: 'band'
    // },
    {
      orient: 'left',
      type: 'band',
      label: {
        formatMethod: label => {
          return {
            type: 'rich',
            text: [{ image: userImageMap[label], width: 40, height: 40 }]
          };
        }
      },
      grid: {
        visible: true,
        style: {
          lineDash: [3, 3]
        }
      },
      domainLine: {
        visible: false
      },
      tick: {
        visible: false
      }
    }
  ],
  tooltip: {
    visible: false
  },
  animation: false,
  dataZoom: [
    {
      orient: 'bottom',
      filterMode: 'axis'
    }
  ],
  scrollBar: [
    {
      orient: 'right',
      axisIndex: 1,
      filterMode: 'axis',
      start: 0,
      end: 0.5
    }
  ]
};

const spec3 = {
  type: 'sequenceAnalysis',
  series: [
    {
      type: 'link',
      dataId: 'actionData',
      dotSeriesIndex: 1,
      fromField: 'from',
      toField: 'to',
      arrow: {
        visible: false
      }
    },
    {
      type: 'dot',
      xField: 'time_stamp',
      yField: 'user_id',
      titleField: 'user_id',
      seriesField: 'action_type',
      dataIndex: 0,
      highLightSeriesGroup: '',
      title: {
        visible: false,
        style: {
          fill: 'rgba(46, 47, 50)'
        }
      },
      grid: {
        style: {
          visible: false
        }
      },
      symbol: {
        visible: false
      }
    }
  ],
  data: [
    {
      id: 'eventData',
      values: eventData
    },
    {
      id: 'actionData',
      values: actionData
    },
    {
      id: 'patternData',
      values: patternData
    }
  ],
  axes: [
    {
      orient: 'top',
      // bandSize: 800,
      type: 'time',
      label: {
        dataFilter: (datum, value, context) => {
          const [min, max] = context.vchart.getChart().getAllComponents()[0].getScale(0)._niceDomain;
          // console.log('datum', datum, min, max);
          // return datum;
          return tickData.map(t => ({
            id: t.time_stamp,
            label: t.action_count,
            value: (t.time_stamp - min) / (max - min),
            rawValue: t.time_stamp
          }));
        },
        formatMethod: (label, datum) => {
          // console.log('label', datum, label, timeCountMap[label]);
          if (datum?.rawValue) {
            return timeCountMap[datum.rawValue];
          }
          return label;
        }
      },
      tick: {
        dataFilter: (datum, context) => {
          // console.log('context', context, datum);
          const [min, max] = context.vchart.getChart().getAllComponents()[0].getScale(0)._niceDomain;
          const [minRange, maxRange] = context.vchart.getChart().getAllComponents()[0].getScale(0).range();
          // console.log('datum', datum, min, max);
          // return datum;
          return tickData.map(t => ({
            id: t.time_stamp,
            label: t.time_stamp,
            value: (t.time_stamp - min) / (max - min),
            rawValue: t.time_stamp,
            point: { x: ((t.time_stamp - min) / (max - min)) * (maxRange - minRange) + minRange, y: 0 }
          }));
        }
      },
      grid: {
        visible: false
      }
    },
    {
      orient: 'bottom',
      id: 'bottom_time',
      // bandSize: 800,
      type: 'time',
      layers: [
        {
          tickStep: 28800,
          timeFormat: '%Y%m%d'
        },
        {
          tickStep: 28800,
          timeFormat: '%H:%M'
        }
      ],
      label: {
        dataFilter: (datum, value, context) => {
          const [min, max] = context.vchart.getChart().getAllComponents()[0].getScale(0)._niceDomain;
          // console.log('datum', datum, min, max);
          // return datum;
          return tickData.map(t => ({
            id: t.time_stamp,
            label: t.time_stamp,
            value: (t.time_stamp - min) / (max - min),
            rawValue: t.time_stamp
          }));
        }
      },
      tick: {
        dataFilter: (datum, context) => {
          console.log('context', context, datum);
          const [min, max] = context.vchart.getChart().getAllComponents()[0].getScale(0)._niceDomain;
          const [minRange, maxRange] = context.vchart.getChart().getAllComponents()[0].getScale(0).range();
          // console.log('datum', datum, min, max);
          // return datum;
          return tickData.map(t => ({
            id: t.time_stamp,
            label: t.time_stamp,
            value: (t.time_stamp - min) / (max - min),
            rawValue: t.time_stamp,
            point: { x: ((t.time_stamp - min) / (max - min)) * (maxRange - minRange) + minRange, y: 0 }
          }));
        }
      },
      grid: {
        visible: false
      }
    },

    {
      orient: 'left',
      type: 'band',
      label: {
        formatMethod: label => {
          return {
            type: 'rich',
            text: [{ image: userImageMap[label], width: 40, height: 40 }]
          };
        }
      },
      grid: {
        visible: true,
        style: {
          lineDash: [3, 3]
        }
      }
    }
  ],
  markLine: tickData.map(t => ({
    zIndex: -1,
    x: t.time_stamp,
    endSymbol: {
      visible: false
    },
    label: {
      visible: false
    }
  })),
  dataZoom: [
    {
      orient: 'bottom',
      filterMode: 'axis'
    }
  ],
  scrollBar: [
    {
      orient: 'bottom',
      auto: true,
      axisIndex: 0,
      filterMode: 'axis'
    }
  ]
};

const spec4 = {
  type: 'sequenceAnalysis',
  padding: 60,
  series: [
    {
      type: 'link',
      dataId: 'actionData',
      dotSeriesIndex: 1,
      fromField: 'from',
      toField: 'to',
      imageLabelField: 'user_image',
      arrow: {
        style: {
          fill: 'grey'
        }
      },
      imageLabel: {
        style: {
          width: 40,
          height: 40
        }
      },
      link: {
        style: {
          stroke: 'grey'
        }
      }
    },
    {
      type: 'dot',
      xField: 'time_stamp',
      yField: 'user_id',
      titleField: 'user_id',
      seriesField: 'action_type',
      dataIndex: 0,
      highLightSeriesGroup: '',
      title: {
        visible: false,
        style: {
          fill: 'rgba(46, 47, 50)'
        }
      },
      grid: {
        style: {
          visible: false
        }
      },
      dot: {
        zIndex: 999,
        state: {
          custom_unSelected: {
            fillOpacity: 0.5,
            fill: 'grey'
          }
        }
      }
    }
  ],
  data: [
    {
      id: 'eventData',
      values: eventData
    },
    {
      id: 'actionData',
      values: actionData
    },
    {
      id: 'patternData',
      values: patternData
    }
  ],
  region: [
    {
      clip: false
    }
  ],
  axes: [
    {
      orient: 'top',
      // bandSize: 800,
      type: 'time',
      id: 'top_time',
      label: {
        dataFilter: (datum, value, context) => {
          const [min, max] = context.vchart.getChart().getAllComponents()[0].getScale(0)._niceDomain;
          // console.log('datum', datum, min, max);
          // return datum;
          return tickData.map(t => ({
            id: t.time_stamp,
            label: t.action_count,
            value: (t.time_stamp - min) / (max - min),
            rawValue: t.time_stamp
          }));
        },
        formatMethod: (label, datum) => {
          // console.log('label', datum, label, timeCountMap[label]);
          if (datum?.rawValue) {
            return timeCountMap[datum.rawValue];
          }
          return label;
        }
      },
      tick: {
        dataFilter: (datum, context) => {
          // console.log('context', context, datum);
          const [min, max] = context.vchart.getChart().getAllComponents()[0].getScale(0)._niceDomain;
          const [minRange, maxRange] = context.vchart.getChart().getAllComponents()[0].getScale(0).range();
          // console.log('datum', datum, min, max);
          // return datum;
          return tickData.map(t => ({
            id: t.time_stamp,
            label: t.time_stamp,
            value: (t.time_stamp - min) / (max - min),
            rawValue: t.time_stamp,
            point: { x: ((t.time_stamp - min) / (max - min)) * (maxRange - minRange) + minRange, y: 0 }
          }));
        }
      },
      grid: {
        visible: false
      },
      hasDimensionTooltip: true
    },
    {
      orient: 'bottom',
      id: 'bottom_time',
      // bandSize: 800,
      type: 'time',
      layers: [
        {
          tickStep: 28800,
          timeFormat: '%Y%m%d'
        },
        {
          tickStep: 28800,
          timeFormat: '%H:%M'
        }
      ],
      label: {
        dataFilter: (datum, value, context) => {
          const [min, max] = context.vchart.getChart().getAllComponents()[0].getScale(0)._niceDomain;
          // console.log('datum', datum, min, max);
          // return datum;
          return tickData.map(t => ({
            id: t.time_stamp,
            label: t.time_stamp,
            value: (t.time_stamp - min) / (max - min),
            rawValue: t.time_stamp
          }));
        }
      },
      tick: {
        dataFilter: (datum, context) => {
          console.log('context', context, datum);
          const [min, max] = context.vchart.getChart().getAllComponents()[0].getScale(0)._niceDomain;
          const [minRange, maxRange] = context.vchart.getChart().getAllComponents()[0].getScale(0).range();
          // console.log('datum', datum, min, max);
          // return datum;
          return tickData.map(t => ({
            id: t.time_stamp,
            label: t.time_stamp,
            value: (t.time_stamp - min) / (max - min),
            rawValue: t.time_stamp,
            point: { x: ((t.time_stamp - min) / (max - min)) * (maxRange - minRange) + minRange, y: 0 }
          }));
        }
      },
      grid: {
        visible: false
      },
      hasDimensionTooltip: true
    },

    {
      orient: 'left',
      type: 'band',
      id: 'left_user',
      label: {
        formatMethod: label => {
          return {
            type: 'rich',
            text: [{ image: userImageMap[label], width: 40, height: 40 }]
          };
        }
      },
      grid: {
        visible: true,
        style: {
          lineDash: [3, 3]
        }
      },
      tick: {
        visible: false
      },
      domainLine: {
        visible: false
      }
    }
  ],
  markLine: tickData.map(t => ({
    zIndex: -1,
    x: t.time_stamp,
    endSymbol: {
      visible: false
    },
    label: {
      visible: false
    }
  })),
  tooltip: {
    visible: false
  },
  crosshair: {
    xField: {
      visible: true,
      line: {
        type: 'rect',
        width: 20,
        style: {
          fill: 'rgb(240,242,245)',
          lineWidth: 0
        }
      },
      bindingAxesIndex: [0, 1]
    },
    yField: {
      visible: true,
      bindingAxesIndex: [2],
      defaultSelect: {
        axisIndex: 2,
        datum: 40
      },
      line: {
        type: 'rect'
      },
      label: {
        visible: true // Default is false
      }
    }
  },
  dataZoom: [
    {
      orient: 'bottom',
      filterMode: 'axis'
    }
  ],
  scrollBar: [
    {
      orient: 'bottom',
      auto: true,
      axisIndex: 0,
      filterMode: 'axis'
    }
  ]
};
const run = () => {
  registerSequenceAnalysis();
  const cs = new VChart(spec_1, {
    dom: document.getElementById('chart') as HTMLElement,
    //theme: 'dark',
    onError: err => {
      console.error(err);
    }
  });
  console.time('renderTime');

  cs.renderSync();

  // cs.on('pointerenter', e => {
  //   console.log('pointerenter', e);
  // });

  // 创建一个div，位置可以自定义
  const width = 80;
  const height = 60;
  const createPoptip = (id: string) => {
    const poptip = document.createElement('div');
    poptip.style.position = 'absolute';
    poptip.style.width = `${width}px`;
    poptip.style.height = `${height}px`;
    poptip.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    poptip.style.borderRadius = '5px';
    poptip.style.color = '#fff';
    poptip.id = id;
    poptip.innerHTML = id;
    poptip.style.visibility = 'hidden';
    document.getElementById('chart')?.appendChild(poptip);
  };
  createPoptip('userPoptip');
  createPoptip('axisPoptip');
  createPoptip('markPoptip');

  cs.on('pointerover', { nodeName: 'axis-label' }, event => {
    // console.log('pointerover', event);

    const { x, y } = event.event.global;
    const { _compiledProductId } = event.mark;
    let poptipId = '';
    console.log('_compiledProductId', _compiledProductId);
    if (_compiledProductId === 'left_user') {
      // left_user对应的是spec中配置的轴id, 可以写死
      poptipId = 'userPoptip';
    } else if (_compiledProductId === 'top_time') {
      poptipId = 'axisPoptip';
    }
    const poptip = document.getElementById(poptipId);
    if (poptip) {
      poptip.style.visibility = 'visible';
      poptip.style.left = `${x - width / 2}px`;
      poptip.style.top = `${y - height}px`;
    }
  });

  cs.on('pointerout', { nodeName: 'axis-label' }, event => {
    const { _compiledProductId } = event.mark;
    let poptipId = '';
    console.log('_compiledProductId', _compiledProductId);
    if (_compiledProductId === 'left_user') {
      // left_user对应的是spec中配置的轴id, 可以写死
      poptipId = 'userPoptip';
    } else if (_compiledProductId === 'top_time') {
      poptipId = 'axisPoptip';
    }
    // 获取 poptip 元素
    const poptip = document.getElementById(poptipId);
    if (poptip) {
      poptip.style.visibility = 'hidden';
    }
  });

  cs.on('pointerover', { markName: 'dot' }, event => {
    // console.log('pointerover', event);

    const { x, y } = event.event.global;
    const poptipId = 'markPoptip';
    const poptip = document.getElementById(poptipId);
    if (poptip) {
      poptip.style.visibility = 'visible';
      poptip.style.left = `${x - width / 2}px`;
      poptip.style.top = `${y - height}px`;
    }
  });

  cs.on('pointerout', { level: 'mark' }, event => {
    // console.log('pointerover', event);

    const poptipId = 'markPoptip';
    const poptip = document.getElementById(poptipId);
    if (poptip) {
      poptip.style.visibility = 'hidden';
    }
  });

  if (document.getElementById('user_001')) {
    document.getElementById('user_001').onclick = () => {
      cs.clearAllStates();
      cs.updateState({
        // 名称与上方配置要对应
        custom_unSelected: {
          filter: datum => {
            // 数据 type 不相等的进入这个状态
            return datum.user_id === 'user_001';
          }
        }
      });
    };
  }

  if (document.getElementById('user_002')) {
    document.getElementById('user_002').onclick = () => {
      cs.clearAllStates();
      cs.updateState({
        // 名称与上方配置要对应
        custom_unSelected: {
          filter: datum => {
            // 数据 type 不相等的进入这个状态
            return datum.user_id === 'user_002';
          }
        }
      });
    };
  }

  if (document.getElementById('action_register')) {
    document.getElementById('action_register').onclick = () => {
      cs.clearAllStates();
      cs.updateState({
        // 名称与上方配置要对应
        custom_unSelected: {
          filter: datum => {
            // console.log('datum', datum);
            // 数据 type 不相等的进入这个状态
            return datum.action_type === 'register';
          }
        }
      });
    };
  }

  if (document.getElementById('action_login')) {
    document.getElementById('action_login').onclick = () => {
      cs.clearAllStates();
      cs.updateState({
        // 名称与上方配置要对应
        custom_unSelected: {
          filter: datum => {
            // console.log('datum', datum);
            // 数据 type 不相等的进入这个状态
            return datum.action_type === 'login';
          }
        }
      });
    };
  }

  if (document.getElementById('action_commit')) {
    document.getElementById('action_commit').onclick = () => {
      cs.clearAllStates();
      cs.updateState({
        // 名称与上方配置要对应
        custom_unSelected: {
          filter: datum => {
            // console.log('datum', datum);
            // 数据 type 不相等的进入这个状态
            return datum.action_type === 'commit';
          }
        }
      });
    };
  }

  if (document.getElementById('pattern_001')) {
    document.getElementById('pattern_001').onclick = () => {
      cs.clearAllStates();
      cs.updateState({
        // 名称与上方配置要对应
        custom_unSelected: {
          filter: datum => {
            // console.log('datum', datum);
            // 数据 type 不相等的进入这个状态
            return datum.pattern_type === 'pattern_001';
          }
        }
      });
    };
  }

  if (document.getElementById('pattern_002')) {
    document.getElementById('pattern_002').onclick = () => {
      cs.clearAllStates();
      cs.updateState({
        // 名称与上方配置要对应
        custom_unSelected: {
          filter: datum => {
            // console.log('datum', datum);
            // 数据 type 不相等的进入这个状态
            return datum.pattern_type === 'pattern_002';
          }
        }
      });
    };
  }

  if (document.getElementById('medium_web')) {
    document.getElementById('medium_web').onclick = () => {
      cs.clearAllStates();
      cs.updateState({
        // 名称与上方配置要对应
        custom_unSelected: {
          filter: datum => {
            // console.log('datum', datum);
            // 数据 type 不相等的进入这个状态
            return datum.medium_type === 'web';
          }
        }
      });
    };
  }

  if (document.getElementById('medium_mobile')) {
    document.getElementById('medium_mobile').onclick = () => {
      cs.clearAllStates();
      cs.updateState({
        // 名称与上方配置要对应
        custom_unSelected: {
          filter: datum => {
            // console.log('datum', datum);
            // 数据 type 不相等的进入这个状态
            return datum.medium_type === 'mobile';
          }
        }
      });
    };
  }

  if (document.getElementById('medium_IP')) {
    document.getElementById('medium_IP').onclick = () => {
      cs.clearAllStates();
      cs.updateState({
        // 名称与上方配置要对应
        custom_unSelected: {
          filter: datum => {
            // console.log('datum', datum);
            // 数据 type 不相等的进入这个状态
            return datum.medium_type === 'IP';
          }
        }
      });
    };
  }

  if (
    document.getElementById('mode') &&
    document.getElementById('mediumConnection') &&
    document.getElementById('actionTarget')
  ) {
    let mode = 'step';
    let mediumConnection = false;
    let actionTarget = false;
    document.getElementById('mode').onchange = event => {
      mode = event.target.value;
      console.log('mode', mode, mediumConnection, actionTarget);
      updateSequenceSpec(mode, mediumConnection, actionTarget);
    };
    document.getElementById('mediumConnection').onchange = event => {
      mediumConnection = event.target.checked;
      console.log('mediumConnection', mode, mediumConnection, actionTarget);
      updateSequenceSpec(mode, mediumConnection, actionTarget);
    };
    document.getElementById('actionTarget').onchange = event => {
      actionTarget = event.target.checked;
      console.log('acitionTarget', mode, mediumConnection, actionTarget);
      updateSequenceSpec(mode, mediumConnection, actionTarget);
    };
    const updateSequenceSpec = (mode, mediumConnection, actionTarget) => {
      if (mode === 'step') {
        if (mediumConnection) {
          cs.updateSpec(spec_2);
        } else {
          cs.updateSpec(spec_1);
        }
      } else {
        if (actionTarget) {
          cs.updateSpec(spec_3);
        } else {
          cs.updateSpec(spec_4);
        }
      }
    };
  }

  console.timeEnd('renderTime');
  window['vchart'] = cs;
  console.log(cs);
};
run();
