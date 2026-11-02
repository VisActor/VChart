---
title: 23. How to disable chart interaction</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## **Title**

How to disable chart interaction</br>
## **Description**

How can I disable the interaction events of the chart and just use it as an image when using the chart?</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/ZUc5bMeeYonCUGxMMmVcZse8nag.gif' alt='' width='1712' height='1322'>

## **Solution**

In VChart, you can directly pass in `disableTriggerEvent: true` to disable interaction.</br>
## **Code Example**

```
const spec = {*
*  type: 'bar',*
*  data: [*
*    {*
*      id: 'barData',*
*      values: [*
*        { month: 'Monday', sales: 22 },*
*        { month: 'Tuesday', sales: 13 },*
*        { month: 'Wednesday', sales: 25 },*
*        { month: 'Thursday', sales: 29 },*
*        { month: 'Friday', sales: 38 }*
*      ]*
*    }*
*  ],*
*  xField: 'month',*
*  yField: 'sales'*
*};*

*const vchart = new VChart(spec, { dom: CONTAINER_ID, disableTriggerEvent: true });*
*vchart.renderSync();*

*// Just for the convenience of console debugging, DO NOT COPY!*
*window['vchart'] = vchart;</br>
```
## **Result**

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/L03Rbd8bXoPcO9x2h4TcwoO0nCg.gif' alt='' width='2434' height='1148'>

Demo: [https://codesandbox.io/p/sandbox/vchart-disabletriggerevent-psxswy?file=%2Fsrc%2Findex.js%3A20%2C46](https://codesandbox.io/p/sandbox/vchart-disabletriggerevent-psxswy?file=%2Fsrc%2Findex.js%3A20%2C46)</br>
## **Related Documents**

Demo：[https://codesandbox.io/p/sandbox/vchart-disabletriggerevent-psxswy?file=%2Fsrc%2Findex.js%3A20%2C46](https://codesandbox.io/p/sandbox/vchart-disabletriggerevent-psxswy?file=%2Fsrc%2Findex.js%3A20%2C46)</br>
Tutorial：</br>
*  Initialize VChart: [https://visactor.io/vchart/api/API/vchart](https://visactor.io/vchart/api/API/vchart)</br>
Github: [https://github.com/VisActor/VChart/](https://github.com/VisActor/VChart/)</br>