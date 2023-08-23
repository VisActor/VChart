3D Word Cloud

The configuration of 3D word cloud inherits most of the configuration of the regular word cloud. The difference is that the type needs to be set to wordcloud3d, and the ChartSpace instance needs to be added to the option3d configuration.

## Chart Composition

Word clouds are composed of text elements, tooltip, and other components.

![](https://temp.domain/obj/bit-cloud/dfd203ff5e337abea49411b07.png)

Text elements are the basic elements of word clouds, and related drawing configurations are essential:

- `wordCloudChart.type`: Chart type, 3d word cloud type is `'wordCloud3d'`
- `wordCloudChart.data`: The data source for chart drawing
- `wordCloudChart.nameField`: Text field, mapping the text of text elements
- `wordCloudChart.valueField`: Value field, mapping the size of text elements

Tooltip and other components serve as optional components to assist in displaying the chart, with default effects and functionality:

- `wordCloudChart.tooltip`: Tooltip, displayed by default when interacting, detailed configuration can be found in [VChart Tooltip Component Configuration](../../option/wordCloudChart#tooltip)
- For more component configurations, check [VChart wordCloudChart Configuration](../../option/wordCloudChart)

As a 3D chart, the 3D scatter plot needs to enable the 3D view by configuring the 3D perspective in the initialization parameters of VChart:

- `options3d.enable`: Enable 3D perspective

Code Demo

```javascript livedemo
const spec = {
  type: 'wordCloud3d',
  // 待申请新外网可访问的存储空间后更换
  maskShape: `http://temp.domain/obj/bytecharts/shape_bears.png`,
  nameField: 'challenge_name',
  valueField: 'sum_count',
  seriesField: 'challenge_name',
  data: [
    {
      name: 'data',
      values: [
        {
          challenge_name: '刘浩存',
          sum_count: 957
        },
        {
          challenge_name: '刘昊然',
          sum_count: 942
        },
        {
          challenge_name: '喜欢',
          sum_count: 842
        },
        {
          challenge_name: '真的',
          sum_count: 828
        },
        {
          challenge_name: '四海',
          sum_count: 665
        },
        {
          challenge_name: '好看',
          sum_count: 627
        },
        {
          challenge_name: '评论',
          sum_count: 574
        },
        {
          challenge_name: '好像',
          sum_count: 564
        },
        {
          challenge_name: '沈腾',
          sum_count: 554
        },
        {
          challenge_name: '不像',
          sum_count: 540
        },
        {
          challenge_name: '多少钱',
          sum_count: 513
        },
        {
          challenge_name: '韩寒',
          sum_count: 513
        },
        {
          challenge_name: '不知道',
          sum_count: 499
        },
        {
          challenge_name: '感觉',
          sum_count: 499
        },
        {
          challenge_name: '尹正',
          sum_count: 495
        },
        {
          challenge_name: '不看',
          sum_count: 487
        },
        {
          challenge_name: '奥特之父',
          sum_count: 484
        },
        {
          challenge_name: '阿姨',
          sum_count: 482
        },
        {
          challenge_name: '支持',
          sum_count: 482
        },
        {
          challenge_name: '父母',
          sum_count: 479
        },
        {
          challenge_name: '一条',
          sum_count: 462
        },
        {
          challenge_name: '女主',
          sum_count: 456
        },
        {
          challenge_name: '确实',
          sum_count: 456
        },
        {
          challenge_name: '票房',
          sum_count: 456
        },
        {
          challenge_name: '无语',
          sum_count: 443
        },
        {
          challenge_name: '干干净净',
          sum_count: 443
        },
        {
          challenge_name: '为啥',
          sum_count: 426
        },
        {
          challenge_name: '爱情',
          sum_count: 425
        },
        {
          challenge_name: '喜剧',
          sum_count: 422
        },
        {
          challenge_name: '春节',
          sum_count: 414
        },
        {
          challenge_name: '剧情',
          sum_count: 414
        },
        {
          challenge_name: '人生',
          sum_count: 409
        },
        {
          challenge_name: '风格',
          sum_count: 408
        },
        {
          challenge_name: '演员',
          sum_count: 403
        },
        {
          challenge_name: '成长',
          sum_count: 403
        },
        {
          challenge_name: '玩意',
          sum_count: 402
        },
        {
          challenge_name: '文学',
          sum_count: 397
        }
      ]
    }
  ],
  word: {
    style: {
      keepDirIn3d: false
    }
  },
  fillingWord: {
    style: {
      keepDirIn3d: false
    }
  },
  depth_3d: 1000
};

const vchart = new VChart(spec, {
  dom: CONTAINER_ID,
  disableDirtyBounds: true,
  options3d: {
    enable: true
  }
});
vchart.renderAsync();

// 只为了方便控制台调试用，不要拷贝
window['vchart'] = vchart;
```

For other configurations, refer to [Word Cloud]()
