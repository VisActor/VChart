---
category: examples
group: chart-3d
title: 3D 形状词云图
keywords: space
order: 23-6
cover: http://tosv.byted.org/obj/bit-cloud/vchart/preview/chart-3d/wordcloud3d.gif
option: wordCloud3dChart
---

# 形状词云图

3D 词云的配置大部分继承了普通词云的配置，区别在于 type 需要配置成 wordcloud3d，然后 ChartSpace 实例化时添加 option3d 配置

## 关键配置

- `depth_3d` 属性声明为数值字段，表明词云离屏幕的距离
- `keepDirIn3d` 文本的属性配置，控制文本的方向是否跟随旋转
- `options3d` 此配置为 ChartSpace 构造函数中传入的配置，声明该 ChartSpace 需要支持 3d 模式
- `nameField` 属性声明为文字文本字段
- `valueField` 属性声明为文字大小字段
- `maskShape` 属性声明为形状轮廓, 支持图片 url 形式 及 形状字符串形式

## 代码演示

```javascript livedemo
const spec = {
  type: 'wordCloud3d',
  // 待申请新外网可访问的存储空间后更换
  maskShape: `http://tosv.boe.byted.org/obj/bytecharts/shape_bears.png`,
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

// Just for the convenience of console debugging, DO NOT COPY!
window['vchart'] = vchart;
```

## 相关教程

[3D 词云](link)
