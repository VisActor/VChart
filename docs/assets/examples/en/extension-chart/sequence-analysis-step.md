---
category: examples
group: extension chart
title: 'Sequence Analysis: Step Mode'
keywords: extension, sequenceAnalysis, step
order: 14
cover: /vchart/preview/sequence-analysis-step.png
option: sequenceAnalysisChart
---

# Sequence Analysis: Step Mode

This chart demonstrates how to compare multiple users' event histories and highlight selected behavioral segments. Think of it as a user activity comparison table: each row is a user, columns show behavioral steps, and colored dots represent events such as registration, login, follow and private messaging.

## What this example represents

Imagine reviewing platform activity logs to understand which steps each user took and where selected behavioral segments appear across users. Aligning the records by step lets you compare them together instead of reading logs one record at a time.

For example, `user_004` has a follow event at step 4 and a private-message event (`im`) at step 6. The line between them means the input data marks these events as a relationship to inspect together. For `user_005`, follow at step 4 is linked to private messaging at step 5. The chart makes the positions of these similar segments easy to compare. Intermediate events remain visible; a link does not mean that the user skipped those steps.

Dots are event records; links are additional relationship annotations supplied through `patternData`. The chart displays these annotations and does not automatically discover behavioral patterns in the logs.

**This dataset demonstrates visualization features.** The local demo does not define business rules for `pattern_001` or `pattern_002`, or a complete metric definition for the top `+N` labels. It cannot establish anomalous activity, a shared IP address or a causal relationship. A business application should supply clearly named relationships with defined criteria and use the chart to display those results.

## A concrete record and its scenario

The following record is taken directly from this example. One possible business interpretation is live-streaming platform activity analysis: **the system records a room-related follow activity for `user_004`, assigns it to step 4, timestamps it at July 7, 2025, 12:00 in Beijing (UTC+8), and gives it an activity count of 7.** This provides a scenario for interpreting the synthetic fields.

```js
// An event excerpt for user_004 from eventData
{
  user_id: 'user_004',
  dots: [
    {
      node_name: 'event_004_4',
      step: 'step_4',
      action_type: 'follow',
      medium_type: 'Liveroom',
      time_stamp: 1751860800000,
      action_count: 7
    }
  ]
}
```

| Field                       | Meaning in this record                      | Visual representation                                                          |
| --------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------ |
| `user_id: 'user_004'`       | The user associated with the activity       | The row identified by that user's avatar                                       |
| `node_name: 'event_004_4'`  | Unique identifier of the event record       | Referenced by link data; the identifier is not drawn                           |
| `step: 'step_4'`            | The fourth step assigned by the application | The `step_4` column on the bottom axis                                         |
| `action_type: 'follow'`     | A follow activity                           | Determines the dot's color category                                            |
| `medium_type: 'Liveroom'`   | The related object category is a live room  | The `Liveroom` column in medium mode; step mode still positions it at `step_4` |
| `time_stamp: 1751860800000` | July 7, 2025, 12:00 in Beijing (UTC+8)      | Determines the horizontal position in time mode, but not step mode             |
| `action_count: 7`           | A follow-activity count of 7 in this record | Draws one dot; time mode adds 7 to the top total for that timestamp            |

The dot at the intersection of the `user_004` row and `step_4` column represents this record. **The count of 7 does not mean seven users or necessarily seven distinct live rooms.** `Liveroom` specifies only an object category. A business application would need additional fields, such as a room ID, to identify the actual room.

The example also supplies this link:

```js
{ from: 'event_004_4', to: 'event_004_6', pattern_type: 'pattern_001' }
```

`event_004_6` is a private-message record for the same user. The line means **these follow and private-message records are annotated as a relationship to inspect together**. It helps an analyst locate the pair for further log inspection. In this example, `pattern_001` is only a category identifier with no detection rule defined. The link does not establish causation or chronological order.

## How to read the chart

This example shows 111 events from 10 users, organized by behavioral step, together with explicitly supplied pattern relationships.

- **Vertical axis and left avatars:** each row represents a user (`user_id`), with an avatar from `userImageMap`. Follow a row to inspect that user's events across steps.
- **Bottom axis:** `step_1`, `step_2`, and so on are event categories from `dots.step`. Steps are equally spaced; their distance does not encode elapsed time.
- **Top labels:** each label shows the medium name and additional count supplied in `stepMediumMap`. For example, `+1` in `Device... +1` comes from the step's `count`. This is a supplied additional count without a defined business metric in this demo; it is not the number of event dots.
- **Colored dots:** each dot is an event record, colored by `action_type`, such as registration, login or comment. User and step determine its position. Multiple events for the same user and step can overlap.
- **Links:** each line corresponds to a `patternData` record whose `from` and `to` reference event `node_name` values. It represents a supplied pattern relationship, colored by `pattern_type`. All links in this step example stay within a single user row and annotate that user’s event segments.
- **Short segments beside dots:** this example enables link extension along step bands and includes pattern records that reference the same event at both ends. Such records can appear as short segments beside a dot. Segment length does not encode duration or relationship strength.

Use the bottom range selector to filter steps, the horizontal gray scrollbar to pan across them, and the right scrollbar to browse users. The initial window shows only part of the steps and users.

## Demo

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

[Tutorial](/vchart/guide/tutorial_docs/Chart_Extensions/sequence_analysis) · [Options](/vchart/option/sequenceAnalysisChart)
