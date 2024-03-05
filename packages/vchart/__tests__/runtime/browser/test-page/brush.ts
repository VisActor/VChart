import { isMobile } from 'react-device-detect';
// eslint-disable-next-line no-duplicate-imports
import { default as VChart } from '../../../../src/index';
import bigData from './data/datazoom-big-data.json';

// const spec = {
//   ...bigData,
//   dataZoom: [
//     {
//       ...bigData.dataZoom[0],
//       showDetail: true,
//       tolerance: 5,
//       realTime: true,
//       // backgroundChart: {
//       //   area: {
//       //     visible: false,
//       //     style: {
//       //       visible: false,
//       //       fill: 'red'
//       //     }
//       //   },
//       //   line: {
//       //     visible: false,
//       //     style: {
//       //       visible: false
//       //     }
//       //   }
//       // },
//       selectedBackgroundChart: {
//         area: {
//           visible: false,
//           style: {
//             visible: false
//           }
//         },
//         line: {
//           visible: false,
//           style: {
//             visible: false
//           }
//         }
//       },
//       // realTime: false,
//       // showDetail: true,
//       // maxSpan: 0.05
//       filterMode: 'filter'
//       // showDetail: true
//       // showDetail: false
//     }
//   ]
//   // data: [
//   //     {
//   //       id: bigData.data[0].id,
//   //       values: bigData.data[0].values.slice(0, 10000)
//   //     },
//   //     {
//   //       id: bigData.data[1].id,
//   //       values: bigData.data[1].values.slice(0, 10000)
//   //     },
//   //     {
//   //       id: bigData.data[2].id,
//   //       values: bigData.data[2].values
//   //     }
//   //   ]
// };

// const spec = {
//   "background": "transparent",
//   "type": "common",
//   "region": [
//     {
//       "id": "dualAreaRegion"
//     },
//     {
//       "id": "scatterRegion"
//     }
//   ],
//   "padding": [
//     8,
//     16,
//     8,
//     4
//   ],
//   "crosshair": {
//     "xField": {
//       "visible": true,
//       "line": {
//         "type": "line",
//         "style": {
//           "lineWidth": 1,
//           "opacity": 1,
//           "stroke": "rgba(255,255,255,0.3)"
//         }
//       },
//       "label": {
//         "visible": true,
//         "labelBackground": {
//           "style": {
//             "fill": "transparent",
//             "outerBorder": {
//               "stroke": "transparent"
//             },
//             "cornerRadius": 34
//           }
//         }
//       }
//     }
//   },
//   "dataZoom": [
//     {
//       "tolerance": 2,
//       "showDetail": true,
//       "startHandler": {
//         "style": {
//           "fill": "#686A77",
//           "stroke": "#464958"
//         }
//       },
//       "endHandler": {
//         "style": {
//           "fill": "#686A77",
//           "stroke": "#464958"
//         }
//       },
//       "orient": "bottom",
//       "id": "datazoom",
//       "realTime": true,
//       "startText": {
//         "style": {
//           "fill": "#BFC4DE"
//         }
//       },
//       "endText": {
//         "style": {
//           "fill": "#BFC4DE"
//         }
//       },
//       "backgroundChart": {
//         "area": {
//           "visible": false,
//           "style": {
//             "fill": "#343841"
//           }
//         },
//         "line": {
//           "style": {
//             "stroke": "#343841"
//           }
//         }
//       },
//       "selectedBackgroundChart": {
//         "area": {
//           "visible": false,
//           "style": {
//             "visible": false,
//             "fill": "#343841"
//           }
//         }
//       },
//       "background": {
//         "style": {
//           "fill": "rgba(255, 255, 255, 0.08)",
//           "fillOpacity": 1,
//           "outerBorder": {
//             "stroke": "rgba(255, 255, 255, 0.08)"
//           }
//         }
//       },
//       "selectedBackground": {
//         "style": {
//           "fill": "rgba(255, 255, 255, 0.12)",
//           "fillOpacity": 1,
//           "outerBorder": {
//             "stroke": "rgba(255, 255, 255, 0.12)"
//           }
//         }
//       },
//       "maxSpan": 0.8,
//       "start": 0,
//       "end": 0.5
//     }
//   ],
//   "layout": {
//     "type": "grid",
//     "col": 3,
//     "row": 5,
//     "elements": [
//       {
//         "modelId": "dualAreaLeftAxis",
//         "row": 0,
//         "rowSpan": 2,
//         "col": 0
//       },
//       {
//         "modelId": "dualAreaRegion",
//         "row": 0,
//         "rowSpan": 2,
//         "col": 1
//       },
//       {
//         "modelId": "dualAreaRightAxis",
//         "row": 0,
//         "rowSpan": 2,
//         "col": 2
//       },
//       {
//         "modelId": "bottomAxis",
//         "row": 2,
//         "col": 1
//       },
//       {
//         "modelId": "scatterLeftAxis",
//         "row": 3,
//         "col": 0
//       },
//       {
//         "modelId": "scatterRegion",
//         "row": 3,
//         "col": 1
//       },
//       {
//         "modelId": "datazoom",
//         "row": 4,
//         "col": 1
//       }
//     ]
//   },
//   "series": [
//     {
//       "id": "area1",
//       "regionId": "dualAreaRegion",
//       "dataId": "areaData1",
//       "type": "area",
//       "xField": "time",
//       "yField": "value",
//       "area": {
//         "style": {
//           "fillOpacity": 0.2,
//           "lineWidth": 2,
//           "fill": {
//             "gradient": "linear",
//             "x0": 0.5,
//             "y0": 0,
//             "x1": 0.5,
//             "y1": 1,
//             "stops": [
//               {
//                 "offset": 0,
//                 "color": "rgba(71, 100, 255, 0.40)",
//                 "opacity": 1
//               },
//               {
//                 "offset": 1,
//                 "color": "rgba(51, 85, 255, 0.00)"
//               }
//             ]
//           }
//         }
//       },
//       "point": false,
//       "seriesMark": "point",
//       "name": "成交金额"
//     },
//     {
//       "id": "area2",
//       "regionId": "dualAreaRegion",
//       "type": "area",
//       "dataId": "areaData2",
//       "xField": "time",
//       "yField": "value",
//       "area": {
//         "style": {
//           "fillOpacity": 0.2,
//           "lineWidth": 2,
//           "fill": {
//             "gradient": "linear",
//             "x0": 0.5,
//             "y0": 0,
//             "x1": 0.5,
//             "y1": 1,
//             "stops": [
//               {
//                 "offset": 0,
//                 "color": "rgba(13, 156, 141, 0.40)",
//                 "opacity": 1
//               },
//               {
//                 "offset": 1,
//                 "color": "rgba(13, 156, 141, 0.00)"
//               }
//             ]
//           }
//         }
//       },
//       "point": false,
//       "seriesMark": "point",
//       "name": "成交订单数"
//     },
//     {
//       "regionId": "scatterRegion",
//       "id": "scatter",
//       "invalidType": "ignore",
//       "type": "scatter",
//       "dataId": "scatterData",
//       "xField": "time",
//       "yField": "type",
//       "seriesField": "type",
//       "point": {
//         "style": {
//           "size": 8,
//           "fill": {
//             "scale": "scatterColor",
//             "field": "type"
//           }
//         },
//         "state": {
//           "dimension_hover": {
//             "size": 10,
//             "stroke": "#fff",
//             "lineWidth": 2
//           }
//         }
//       },
//       "name": "商品"
//     }
//   ],
//   "axes": [
//     {
//       "id": "dualAreaLeftAxis",
//       "seriesId": "area1",
//       "orient": "left",
//       "tick": {
//         "forceTickCount": 5
//       },
//       "grid": {
//         "visible": true,
//         "style": {
//           "lineDash": [
//             4,
//             4
//           ],
//           "stroke": "rgba(255, 255, 255, 0.18)"
//         }
//       },
//       "label": {}
//     },
//     {
//       "id": "dualAreaRightAxis",
//       "seriesId": "area2",
//       "orient": "right",
//       "tick": {
//         "forceTickCount": 5
//       },
//       "grid": {
//         "visible": false,
//         "style": {
//           "lineDash": [
//             4,
//             4
//           ],
//           "stroke": "rgba(255, 255, 255, 0.18)"
//         }
//       },
//       "label": {}
//     },
//     {
//       "id": "scatterLeftAxis",
//       "seriesId": "scatter",
//       "orient": "left",
//       "type": "band",
//       "tick": {
//         "visible": false
//       },
//       "domainLine": {
//         "visible": false
//       },
//       "grid": {
//         "visible": true,
//         "style": {
//           "lineDash": [
//             4,
//             4
//           ],
//           "stroke": "rgba(255, 255, 255, 0.18)"
//         }
//       },
//       "domain": [
//         "违规",
//         "营销",
//         "商品"
//       ]
//     },
//     {
//       "id": "bottomAxis",
//       "seriesId": [
//         "area1",
//         "area2",
//         "scatter"
//       ],
//       "orient": "bottom",
//       "tick": {
//         "visible": false
//       },
//       "domainLine": {
//         "style": {
//           "stroke": "#494949"
//         }
//       },
//       "label": {}
//     }
//   ],
//   "color": [
//     "#4D67FF",
//     "#119676"
//   ],
//   "legends": {
//     "visible": false
//   },
//   "data": [
//     {
//       "id": "areaData1",
//       "values": [
//         {
//           "time": "12-01 08:59",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701392340"
//         },
//         {
//           "time": "12-01 09:00",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701392400"
//         },
//         {
//           "time": "12-01 09:01",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701392460"
//         },
//         {
//           "time": "12-01 09:02",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701392520"
//         },
//         {
//           "time": "12-01 09:03",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701392580"
//         },
//         {
//           "time": "12-01 09:04",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701392640"
//         },
//         {
//           "time": "12-01 09:05",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701392700"
//         },
//         {
//           "time": "12-01 09:06",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701392760"
//         },
//         {
//           "time": "12-01 09:07",
//           "value": 1699,
//           "type": "成交金额",
//           "timestamp": "1701392820"
//         },
//         {
//           "time": "12-01 09:08",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701392880"
//         },
//         {
//           "time": "12-01 09:09",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701392940"
//         },
//         {
//           "time": "12-01 09:10",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701393000"
//         },
//         {
//           "time": "12-01 09:11",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701393060"
//         },
//         {
//           "time": "12-01 09:12",
//           "value": 2799,
//           "type": "成交金额",
//           "timestamp": "1701393120"
//         },
//         {
//           "time": "12-01 09:13",
//           "value": 2799,
//           "type": "成交金额",
//           "timestamp": "1701393180"
//         },
//         {
//           "time": "12-01 09:14",
//           "value": 2799,
//           "type": "成交金额",
//           "timestamp": "1701393240"
//         },
//         {
//           "time": "12-01 09:15",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701393300"
//         },
//         {
//           "time": "12-01 09:16",
//           "value": 2799,
//           "type": "成交金额",
//           "timestamp": "1701393360"
//         },
//         {
//           "time": "12-01 09:17",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701393420"
//         },
//         {
//           "time": "12-01 09:18",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701393480"
//         },
//         {
//           "time": "12-01 09:19",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701393540"
//         },
//         {
//           "time": "12-01 09:20",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701393600"
//         },
//         {
//           "time": "12-01 09:21",
//           "value": 2799,
//           "type": "成交金额",
//           "timestamp": "1701393660"
//         },
//         {
//           "time": "12-01 09:22",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701393720"
//         },
//         {
//           "time": "12-01 09:23",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701393780"
//         },
//         {
//           "time": "12-01 09:24",
//           "value": 2799,
//           "type": "成交金额",
//           "timestamp": "1701393840"
//         },
//         {
//           "time": "12-01 09:25",
//           "value": 2799,
//           "type": "成交金额",
//           "timestamp": "1701393900"
//         },
//         {
//           "time": "12-01 09:26",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701393960"
//         },
//         {
//           "time": "12-01 09:27",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701394020"
//         },
//         {
//           "time": "12-01 09:28",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701394080"
//         },
//         {
//           "time": "12-01 09:29",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701394140"
//         },
//         {
//           "time": "12-01 09:30",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701394200"
//         },
//         {
//           "time": "12-01 09:31",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701394260"
//         },
//         {
//           "time": "12-01 09:32",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701394320"
//         },
//         {
//           "time": "12-01 09:33",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701394380"
//         },
//         {
//           "time": "12-01 09:34",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701394440"
//         },
//         {
//           "time": "12-01 09:35",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701394500"
//         },
//         {
//           "time": "12-01 09:36",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701394560"
//         },
//         {
//           "time": "12-01 09:37",
//           "value": 2799,
//           "type": "成交金额",
//           "timestamp": "1701394620"
//         },
//         {
//           "time": "12-01 09:38",
//           "value": 1999,
//           "type": "成交金额",
//           "timestamp": "1701394680"
//         },
//         {
//           "time": "12-01 09:39",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701394740"
//         },
//         {
//           "time": "12-01 09:40",
//           "value": 2799,
//           "type": "成交金额",
//           "timestamp": "1701394800"
//         },
//         {
//           "time": "12-01 09:41",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701394860"
//         },
//         {
//           "time": "12-01 09:42",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701394920"
//         },
//         {
//           "time": "12-01 09:43",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701394980"
//         },
//         {
//           "time": "12-01 09:44",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701395040"
//         },
//         {
//           "time": "12-01 09:45",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701395100"
//         },
//         {
//           "time": "12-01 09:46",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701395160"
//         },
//         {
//           "time": "12-01 09:47",
//           "value": 2799,
//           "type": "成交金额",
//           "timestamp": "1701395220"
//         },
//         {
//           "time": "12-01 09:48",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701395280"
//         },
//         {
//           "time": "12-01 09:49",
//           "value": 2799,
//           "type": "成交金额",
//           "timestamp": "1701395340"
//         },
//         {
//           "time": "12-01 09:50",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701395400"
//         },
//         {
//           "time": "12-01 09:51",
//           "value": 5598,
//           "type": "成交金额",
//           "timestamp": "1701395460"
//         },
//         {
//           "time": "12-01 09:52",
//           "value": 2799,
//           "type": "成交金额",
//           "timestamp": "1701395520"
//         },
//         {
//           "time": "12-01 09:53",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701395580"
//         },
//         {
//           "time": "12-01 09:54",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701395640"
//         },
//         {
//           "time": "12-01 09:55",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701395700"
//         },
//         {
//           "time": "12-01 09:56",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701395760"
//         },
//         {
//           "time": "12-01 09:57",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701395820"
//         },
//         {
//           "time": "12-01 09:58",
//           "value": 2799,
//           "type": "成交金额",
//           "timestamp": "1701395880"
//         },
//         {
//           "time": "12-01 09:59",
//           "value": 9096,
//           "type": "成交金额",
//           "timestamp": "1701395940"
//         },
//         {
//           "time": "12-01 10:00",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701396000"
//         },
//         {
//           "time": "12-01 10:01",
//           "value": 5598,
//           "type": "成交金额",
//           "timestamp": "1701396060"
//         },
//         {
//           "time": "12-01 10:02",
//           "value": 5598,
//           "type": "成交金额",
//           "timestamp": "1701396120"
//         },
//         {
//           "time": "12-01 10:03",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701396180"
//         },
//         {
//           "time": "12-01 10:04",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701396240"
//         },
//         {
//           "time": "12-01 10:05",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701396300"
//         },
//         {
//           "time": "12-01 10:06",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701396360"
//         },
//         {
//           "time": "12-01 10:07",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701396420"
//         },
//         {
//           "time": "12-01 10:08",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701396480"
//         },
//         {
//           "time": "12-01 10:09",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701396540"
//         },
//         {
//           "time": "12-01 10:10",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701396600"
//         },
//         {
//           "time": "12-01 10:11",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701396660"
//         },
//         {
//           "time": "12-01 10:12",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701396720"
//         },
//         {
//           "time": "12-01 10:13",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701396780"
//         },
//         {
//           "time": "12-01 10:14",
//           "value": 1599,
//           "type": "成交金额",
//           "timestamp": "1701396840"
//         },
//         {
//           "time": "12-01 10:15",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701396900"
//         },
//         {
//           "time": "12-01 10:16",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701396960"
//         },
//         {
//           "time": "12-01 10:17",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701397020"
//         },
//         {
//           "time": "12-01 10:18",
//           "value": 2799,
//           "type": "成交金额",
//           "timestamp": "1701397080"
//         },
//         {
//           "time": "12-01 10:19",
//           "value": 2799,
//           "type": "成交金额",
//           "timestamp": "1701397140"
//         },
//         {
//           "time": "12-01 10:20",
//           "value": 2799,
//           "type": "成交金额",
//           "timestamp": "1701397200"
//         },
//         {
//           "time": "12-01 10:21",
//           "value": 2799,
//           "type": "成交金额",
//           "timestamp": "1701397260"
//         },
//         {
//           "time": "12-01 10:22",
//           "value": 2799,
//           "type": "成交金额",
//           "timestamp": "1701397320"
//         },
//         {
//           "time": "12-01 10:23",
//           "value": 2799,
//           "type": "成交金额",
//           "timestamp": "1701397380"
//         },
//         {
//           "time": "12-01 10:24",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701397440"
//         },
//         {
//           "time": "12-01 10:25",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701397500"
//         },
//         {
//           "time": "12-01 10:26",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701397560"
//         },
//         {
//           "time": "12-01 10:27",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701397620"
//         },
//         {
//           "time": "12-01 10:28",
//           "value": 2799,
//           "type": "成交金额",
//           "timestamp": "1701397680"
//         },
//         {
//           "time": "12-01 10:29",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701397740"
//         },
//         {
//           "time": "12-01 10:30",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701397800"
//         },
//         {
//           "time": "12-01 10:31",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701397860"
//         },
//         {
//           "time": "12-01 10:32",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701397920"
//         },
//         {
//           "time": "12-01 10:33",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701397980"
//         },
//         {
//           "time": "12-01 10:34",
//           "value": 2799,
//           "type": "成交金额",
//           "timestamp": "1701398040"
//         },
//         {
//           "time": "12-01 10:35",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701398100"
//         },
//         {
//           "time": "12-01 10:36",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701398160"
//         },
//         {
//           "time": "12-01 10:37",
//           "value": 2799,
//           "type": "成交金额",
//           "timestamp": "1701398220"
//         },
//         {
//           "time": "12-01 10:38",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701398280"
//         },
//         {
//           "time": "12-01 10:39",
//           "value": 2799,
//           "type": "成交金额",
//           "timestamp": "1701398340"
//         },
//         {
//           "time": "12-01 10:40",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701398400"
//         },
//         {
//           "time": "12-01 10:41",
//           "value": 2799,
//           "type": "成交金额",
//           "timestamp": "1701398460"
//         },
//         {
//           "time": "12-01 10:42",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701398520"
//         },
//         {
//           "time": "12-01 10:43",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701398580"
//         },
//         {
//           "time": "12-01 10:44",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701398640"
//         },
//         {
//           "time": "12-01 10:45",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701398700"
//         },
//         {
//           "time": "12-01 10:46",
//           "value": 2799,
//           "type": "成交金额",
//           "timestamp": "1701398760"
//         },
//         {
//           "time": "12-01 10:47",
//           "value": 1699,
//           "type": "成交金额",
//           "timestamp": "1701398820"
//         },
//         {
//           "time": "12-01 10:48",
//           "value": 2799,
//           "type": "成交金额",
//           "timestamp": "1701398880"
//         },
//         {
//           "time": "12-01 10:49",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701398940"
//         },
//         {
//           "time": "12-01 10:50",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701399000"
//         },
//         {
//           "time": "12-01 10:51",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701399060"
//         },
//         {
//           "time": "12-01 10:52",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701399120"
//         },
//         {
//           "time": "12-01 10:53",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701399180"
//         },
//         {
//           "time": "12-01 10:54",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701399240"
//         },
//         {
//           "time": "12-01 10:55",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701399300"
//         },
//         {
//           "time": "12-01 10:56",
//           "value": 2799,
//           "type": "成交金额",
//           "timestamp": "1701399360"
//         },
//         {
//           "time": "12-01 10:57",
//           "value": 2799,
//           "type": "成交金额",
//           "timestamp": "1701399420"
//         },
//         {
//           "time": "12-01 10:58",
//           "value": 2799,
//           "type": "成交金额",
//           "timestamp": "1701399480"
//         },
//         {
//           "time": "12-01 10:59",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701399540"
//         },
//         {
//           "time": "12-01 11:00",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701399600"
//         },
//         {
//           "time": "12-01 11:01",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701399660"
//         },
//         {
//           "time": "12-01 11:02",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701399720"
//         },
//         {
//           "time": "12-01 11:03",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701399780"
//         },
//         {
//           "time": "12-01 11:04",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701399840"
//         },
//         {
//           "time": "12-01 11:05",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701399900"
//         },
//         {
//           "time": "12-01 11:06",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701399960"
//         },
//         {
//           "time": "12-01 11:07",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701400020"
//         },
//         {
//           "time": "12-01 11:08",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701400080"
//         },
//         {
//           "time": "12-01 11:09",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701400140"
//         },
//         {
//           "time": "12-01 11:10",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701400200"
//         },
//         {
//           "time": "12-01 11:11",
//           "value": 2799,
//           "type": "成交金额",
//           "timestamp": "1701400260"
//         },
//         {
//           "time": "12-01 11:12",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701400320"
//         },
//         {
//           "time": "12-01 11:13",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701400380"
//         },
//         {
//           "time": "12-01 11:14",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701400440"
//         },
//         {
//           "time": "12-01 11:15",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701400500"
//         },
//         {
//           "time": "12-01 11:16",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701400560"
//         },
//         {
//           "time": "12-01 11:17",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701400620"
//         },
//         {
//           "time": "12-01 11:18",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701400680"
//         },
//         {
//           "time": "12-01 11:19",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701400740"
//         },
//         {
//           "time": "12-01 11:20",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701400800"
//         },
//         {
//           "time": "12-01 11:21",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701400860"
//         },
//         {
//           "time": "12-01 11:22",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701400920"
//         },
//         {
//           "time": "12-01 11:23",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701400980"
//         },
//         {
//           "time": "12-01 11:24",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701401040"
//         },
//         {
//           "time": "12-01 11:25",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701401100"
//         },
//         {
//           "time": "12-01 11:26",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701401160"
//         },
//         {
//           "time": "12-01 11:27",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701401220"
//         },
//         {
//           "time": "12-01 11:28",
//           "value": 2799,
//           "type": "成交金额",
//           "timestamp": "1701401280"
//         },
//         {
//           "time": "12-01 11:29",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701401340"
//         },
//         {
//           "time": "12-01 11:30",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701401400"
//         },
//         {
//           "time": "12-01 11:31",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701401460"
//         },
//         {
//           "time": "12-01 11:32",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701401520"
//         },
//         {
//           "time": "12-01 11:33",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701401580"
//         },
//         {
//           "time": "12-01 11:34",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701401640"
//         },
//         {
//           "time": "12-01 11:35",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701401700"
//         },
//         {
//           "time": "12-01 11:36",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701401760"
//         },
//         {
//           "time": "12-01 11:37",
//           "value": 1699,
//           "type": "成交金额",
//           "timestamp": "1701401820"
//         },
//         {
//           "time": "12-01 11:38",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701401880"
//         },
//         {
//           "time": "12-01 11:39",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701401940"
//         },
//         {
//           "time": "12-01 11:40",
//           "value": 2799,
//           "type": "成交金额",
//           "timestamp": "1701402000"
//         },
//         {
//           "time": "12-01 11:41",
//           "value": 2799,
//           "type": "成交金额",
//           "timestamp": "1701402060"
//         },
//         {
//           "time": "12-01 11:42",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701402120"
//         },
//         {
//           "time": "12-01 11:43",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701402180"
//         },
//         {
//           "time": "12-01 11:44",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701402240"
//         },
//         {
//           "time": "12-01 11:45",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701402300"
//         },
//         {
//           "time": "12-01 11:46",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701402360"
//         },
//         {
//           "time": "12-01 11:47",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701402420"
//         },
//         {
//           "time": "12-01 11:48",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701402480"
//         },
//         {
//           "time": "12-01 11:49",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701402540"
//         },
//         {
//           "time": "12-01 11:50",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701402600"
//         },
//         {
//           "time": "12-01 11:51",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701402660"
//         },
//         {
//           "time": "12-01 11:52",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701402720"
//         },
//         {
//           "time": "12-01 11:53",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701402780"
//         },
//         {
//           "time": "12-01 11:54",
//           "value": 2799,
//           "type": "成交金额",
//           "timestamp": "1701402840"
//         },
//         {
//           "time": "12-01 11:55",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701402900"
//         },
//         {
//           "time": "12-01 11:56",
//           "value": 3698,
//           "type": "成交金额",
//           "timestamp": "1701402960"
//         },
//         {
//           "time": "12-01 11:57",
//           "value": 1999,
//           "type": "成交金额",
//           "timestamp": "1701403020"
//         },
//         {
//           "time": "12-01 11:58",
//           "value": 2799,
//           "type": "成交金额",
//           "timestamp": "1701403080"
//         },
//         {
//           "time": "12-01 11:59",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701403140"
//         },
//         {
//           "time": "12-01 12:00",
//           "value": 5598,
//           "type": "成交金额",
//           "timestamp": "1701403200"
//         },
//         {
//           "time": "12-01 12:01",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701403260"
//         },
//         {
//           "time": "12-01 12:02",
//           "value": 2799,
//           "type": "成交金额",
//           "timestamp": "1701403320"
//         },
//         {
//           "time": "12-01 12:03",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701403380"
//         },
//         {
//           "time": "12-01 12:04",
//           "value": 2799,
//           "type": "成交金额",
//           "timestamp": "1701403440"
//         },
//         {
//           "time": "12-01 12:05",
//           "value": 2799,
//           "type": "成交金额",
//           "timestamp": "1701403500"
//         },
//         {
//           "time": "12-01 12:06",
//           "value": 0,
//           "type": "成交金额",
//           "timestamp": "1701403560"
//         },
//         {
//           "time": "12-01 12:07",
//           "value": 3698,
//           "type": "成交金额",
//           "timestamp": "1701403620"
//         },
//         {
//           "time": "12-01 12:08",
//           "value": 1699,
//           "type": "成交金额",
//           "timestamp": "1701403680"
//         }
//       ]
//     },
//     {
//       "id": "areaData2",
//       "values": [
//         {
//           "time": "12-01 08:59",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701392340"
//         },
//         {
//           "time": "12-01 09:00",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701392400"
//         },
//         {
//           "time": "12-01 09:01",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701392460"
//         },
//         {
//           "time": "12-01 09:02",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701392520"
//         },
//         {
//           "time": "12-01 09:03",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701392580"
//         },
//         {
//           "time": "12-01 09:04",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701392640"
//         },
//         {
//           "time": "12-01 09:05",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701392700"
//         },
//         {
//           "time": "12-01 09:06",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701392760"
//         },
//         {
//           "time": "12-01 09:07",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701392820"
//         },
//         {
//           "time": "12-01 09:08",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701392880"
//         },
//         {
//           "time": "12-01 09:09",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701392940"
//         },
//         {
//           "time": "12-01 09:10",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701393000"
//         },
//         {
//           "time": "12-01 09:11",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701393060"
//         },
//         {
//           "time": "12-01 09:12",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701393120"
//         },
//         {
//           "time": "12-01 09:13",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701393180"
//         },
//         {
//           "time": "12-01 09:14",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701393240"
//         },
//         {
//           "time": "12-01 09:15",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701393300"
//         },
//         {
//           "time": "12-01 09:16",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701393360"
//         },
//         {
//           "time": "12-01 09:17",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701393420"
//         },
//         {
//           "time": "12-01 09:18",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701393480"
//         },
//         {
//           "time": "12-01 09:19",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701393540"
//         },
//         {
//           "time": "12-01 09:20",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701393600"
//         },
//         {
//           "time": "12-01 09:21",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701393660"
//         },
//         {
//           "time": "12-01 09:22",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701393720"
//         },
//         {
//           "time": "12-01 09:23",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701393780"
//         },
//         {
//           "time": "12-01 09:24",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701393840"
//         },
//         {
//           "time": "12-01 09:25",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701393900"
//         },
//         {
//           "time": "12-01 09:26",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701393960"
//         },
//         {
//           "time": "12-01 09:27",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701394020"
//         },
//         {
//           "time": "12-01 09:28",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701394080"
//         },
//         {
//           "time": "12-01 09:29",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701394140"
//         },
//         {
//           "time": "12-01 09:30",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701394200"
//         },
//         {
//           "time": "12-01 09:31",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701394260"
//         },
//         {
//           "time": "12-01 09:32",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701394320"
//         },
//         {
//           "time": "12-01 09:33",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701394380"
//         },
//         {
//           "time": "12-01 09:34",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701394440"
//         },
//         {
//           "time": "12-01 09:35",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701394500"
//         },
//         {
//           "time": "12-01 09:36",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701394560"
//         },
//         {
//           "time": "12-01 09:37",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701394620"
//         },
//         {
//           "time": "12-01 09:38",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701394680"
//         },
//         {
//           "time": "12-01 09:39",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701394740"
//         },
//         {
//           "time": "12-01 09:40",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701394800"
//         },
//         {
//           "time": "12-01 09:41",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701394860"
//         },
//         {
//           "time": "12-01 09:42",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701394920"
//         },
//         {
//           "time": "12-01 09:43",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701394980"
//         },
//         {
//           "time": "12-01 09:44",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701395040"
//         },
//         {
//           "time": "12-01 09:45",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701395100"
//         },
//         {
//           "time": "12-01 09:46",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701395160"
//         },
//         {
//           "time": "12-01 09:47",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701395220"
//         },
//         {
//           "time": "12-01 09:48",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701395280"
//         },
//         {
//           "time": "12-01 09:49",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701395340"
//         },
//         {
//           "time": "12-01 09:50",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701395400"
//         },
//         {
//           "time": "12-01 09:51",
//           "value": 2,
//           "type": "成交订单数",
//           "timestamp": "1701395460"
//         },
//         {
//           "time": "12-01 09:52",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701395520"
//         },
//         {
//           "time": "12-01 09:53",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701395580"
//         },
//         {
//           "time": "12-01 09:54",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701395640"
//         },
//         {
//           "time": "12-01 09:55",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701395700"
//         },
//         {
//           "time": "12-01 09:56",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701395760"
//         },
//         {
//           "time": "12-01 09:57",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701395820"
//         },
//         {
//           "time": "12-01 09:58",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701395880"
//         },
//         {
//           "time": "12-01 09:59",
//           "value": 4,
//           "type": "成交订单数",
//           "timestamp": "1701395940"
//         },
//         {
//           "time": "12-01 10:00",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701396000"
//         },
//         {
//           "time": "12-01 10:01",
//           "value": 2,
//           "type": "成交订单数",
//           "timestamp": "1701396060"
//         },
//         {
//           "time": "12-01 10:02",
//           "value": 2,
//           "type": "成交订单数",
//           "timestamp": "1701396120"
//         },
//         {
//           "time": "12-01 10:03",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701396180"
//         },
//         {
//           "time": "12-01 10:04",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701396240"
//         },
//         {
//           "time": "12-01 10:05",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701396300"
//         },
//         {
//           "time": "12-01 10:06",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701396360"
//         },
//         {
//           "time": "12-01 10:07",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701396420"
//         },
//         {
//           "time": "12-01 10:08",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701396480"
//         },
//         {
//           "time": "12-01 10:09",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701396540"
//         },
//         {
//           "time": "12-01 10:10",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701396600"
//         },
//         {
//           "time": "12-01 10:11",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701396660"
//         },
//         {
//           "time": "12-01 10:12",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701396720"
//         },
//         {
//           "time": "12-01 10:13",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701396780"
//         },
//         {
//           "time": "12-01 10:14",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701396840"
//         },
//         {
//           "time": "12-01 10:15",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701396900"
//         },
//         {
//           "time": "12-01 10:16",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701396960"
//         },
//         {
//           "time": "12-01 10:17",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701397020"
//         },
//         {
//           "time": "12-01 10:18",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701397080"
//         },
//         {
//           "time": "12-01 10:19",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701397140"
//         },
//         {
//           "time": "12-01 10:20",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701397200"
//         },
//         {
//           "time": "12-01 10:21",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701397260"
//         },
//         {
//           "time": "12-01 10:22",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701397320"
//         },
//         {
//           "time": "12-01 10:23",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701397380"
//         },
//         {
//           "time": "12-01 10:24",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701397440"
//         },
//         {
//           "time": "12-01 10:25",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701397500"
//         },
//         {
//           "time": "12-01 10:26",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701397560"
//         },
//         {
//           "time": "12-01 10:27",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701397620"
//         },
//         {
//           "time": "12-01 10:28",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701397680"
//         },
//         {
//           "time": "12-01 10:29",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701397740"
//         },
//         {
//           "time": "12-01 10:30",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701397800"
//         },
//         {
//           "time": "12-01 10:31",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701397860"
//         },
//         {
//           "time": "12-01 10:32",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701397920"
//         },
//         {
//           "time": "12-01 10:33",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701397980"
//         },
//         {
//           "time": "12-01 10:34",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701398040"
//         },
//         {
//           "time": "12-01 10:35",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701398100"
//         },
//         {
//           "time": "12-01 10:36",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701398160"
//         },
//         {
//           "time": "12-01 10:37",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701398220"
//         },
//         {
//           "time": "12-01 10:38",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701398280"
//         },
//         {
//           "time": "12-01 10:39",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701398340"
//         },
//         {
//           "time": "12-01 10:40",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701398400"
//         },
//         {
//           "time": "12-01 10:41",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701398460"
//         },
//         {
//           "time": "12-01 10:42",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701398520"
//         },
//         {
//           "time": "12-01 10:43",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701398580"
//         },
//         {
//           "time": "12-01 10:44",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701398640"
//         },
//         {
//           "time": "12-01 10:45",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701398700"
//         },
//         {
//           "time": "12-01 10:46",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701398760"
//         },
//         {
//           "time": "12-01 10:47",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701398820"
//         },
//         {
//           "time": "12-01 10:48",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701398880"
//         },
//         {
//           "time": "12-01 10:49",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701398940"
//         },
//         {
//           "time": "12-01 10:50",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701399000"
//         },
//         {
//           "time": "12-01 10:51",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701399060"
//         },
//         {
//           "time": "12-01 10:52",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701399120"
//         },
//         {
//           "time": "12-01 10:53",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701399180"
//         },
//         {
//           "time": "12-01 10:54",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701399240"
//         },
//         {
//           "time": "12-01 10:55",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701399300"
//         },
//         {
//           "time": "12-01 10:56",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701399360"
//         },
//         {
//           "time": "12-01 10:57",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701399420"
//         },
//         {
//           "time": "12-01 10:58",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701399480"
//         },
//         {
//           "time": "12-01 10:59",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701399540"
//         },
//         {
//           "time": "12-01 11:00",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701399600"
//         },
//         {
//           "time": "12-01 11:01",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701399660"
//         },
//         {
//           "time": "12-01 11:02",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701399720"
//         },
//         {
//           "time": "12-01 11:03",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701399780"
//         },
//         {
//           "time": "12-01 11:04",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701399840"
//         },
//         {
//           "time": "12-01 11:05",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701399900"
//         },
//         {
//           "time": "12-01 11:06",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701399960"
//         },
//         {
//           "time": "12-01 11:07",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701400020"
//         },
//         {
//           "time": "12-01 11:08",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701400080"
//         },
//         {
//           "time": "12-01 11:09",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701400140"
//         },
//         {
//           "time": "12-01 11:10",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701400200"
//         },
//         {
//           "time": "12-01 11:11",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701400260"
//         },
//         {
//           "time": "12-01 11:12",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701400320"
//         },
//         {
//           "time": "12-01 11:13",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701400380"
//         },
//         {
//           "time": "12-01 11:14",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701400440"
//         },
//         {
//           "time": "12-01 11:15",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701400500"
//         },
//         {
//           "time": "12-01 11:16",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701400560"
//         },
//         {
//           "time": "12-01 11:17",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701400620"
//         },
//         {
//           "time": "12-01 11:18",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701400680"
//         },
//         {
//           "time": "12-01 11:19",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701400740"
//         },
//         {
//           "time": "12-01 11:20",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701400800"
//         },
//         {
//           "time": "12-01 11:21",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701400860"
//         },
//         {
//           "time": "12-01 11:22",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701400920"
//         },
//         {
//           "time": "12-01 11:23",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701400980"
//         },
//         {
//           "time": "12-01 11:24",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701401040"
//         },
//         {
//           "time": "12-01 11:25",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701401100"
//         },
//         {
//           "time": "12-01 11:26",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701401160"
//         },
//         {
//           "time": "12-01 11:27",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701401220"
//         },
//         {
//           "time": "12-01 11:28",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701401280"
//         },
//         {
//           "time": "12-01 11:29",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701401340"
//         },
//         {
//           "time": "12-01 11:30",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701401400"
//         },
//         {
//           "time": "12-01 11:31",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701401460"
//         },
//         {
//           "time": "12-01 11:32",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701401520"
//         },
//         {
//           "time": "12-01 11:33",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701401580"
//         },
//         {
//           "time": "12-01 11:34",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701401640"
//         },
//         {
//           "time": "12-01 11:35",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701401700"
//         },
//         {
//           "time": "12-01 11:36",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701401760"
//         },
//         {
//           "time": "12-01 11:37",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701401820"
//         },
//         {
//           "time": "12-01 11:38",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701401880"
//         },
//         {
//           "time": "12-01 11:39",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701401940"
//         },
//         {
//           "time": "12-01 11:40",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701402000"
//         },
//         {
//           "time": "12-01 11:41",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701402060"
//         },
//         {
//           "time": "12-01 11:42",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701402120"
//         },
//         {
//           "time": "12-01 11:43",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701402180"
//         },
//         {
//           "time": "12-01 11:44",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701402240"
//         },
//         {
//           "time": "12-01 11:45",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701402300"
//         },
//         {
//           "time": "12-01 11:46",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701402360"
//         },
//         {
//           "time": "12-01 11:47",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701402420"
//         },
//         {
//           "time": "12-01 11:48",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701402480"
//         },
//         {
//           "time": "12-01 11:49",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701402540"
//         },
//         {
//           "time": "12-01 11:50",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701402600"
//         },
//         {
//           "time": "12-01 11:51",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701402660"
//         },
//         {
//           "time": "12-01 11:52",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701402720"
//         },
//         {
//           "time": "12-01 11:53",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701402780"
//         },
//         {
//           "time": "12-01 11:54",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701402840"
//         },
//         {
//           "time": "12-01 11:55",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701402900"
//         },
//         {
//           "time": "12-01 11:56",
//           "value": 2,
//           "type": "成交订单数",
//           "timestamp": "1701402960"
//         },
//         {
//           "time": "12-01 11:57",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701403020"
//         },
//         {
//           "time": "12-01 11:58",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701403080"
//         },
//         {
//           "time": "12-01 11:59",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701403140"
//         },
//         {
//           "time": "12-01 12:00",
//           "value": 2,
//           "type": "成交订单数",
//           "timestamp": "1701403200"
//         },
//         {
//           "time": "12-01 12:01",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701403260"
//         },
//         {
//           "time": "12-01 12:02",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701403320"
//         },
//         {
//           "time": "12-01 12:03",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701403380"
//         },
//         {
//           "time": "12-01 12:04",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701403440"
//         },
//         {
//           "time": "12-01 12:05",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701403500"
//         },
//         {
//           "time": "12-01 12:06",
//           "value": 0,
//           "type": "成交订单数",
//           "timestamp": "1701403560"
//         },
//         {
//           "time": "12-01 12:07",
//           "value": 2,
//           "type": "成交订单数",
//           "timestamp": "1701403620"
//         },
//         {
//           "time": "12-01 12:08",
//           "value": 1,
//           "type": "成交订单数",
//           "timestamp": "1701403680"
//         }
//       ]
//     },
//     {
//       "id": "scatterData",
//       "values": [
//         {
//           "type": "商品"
//         },
//         {
//           "type": "营销"
//         },
//         {
//           "type": "违规"
//         }
//       ],
//       "fields": {
//         "type": {
//           "domain": [
//             "违规",
//             "营销",
//             "商品"
//           ],
//           "lockStatisticsByDomain": true
//         }
//       }
//     }
//   ],
//   "scales": [
//     {
//       "id": "scatterColor",
//       "type": "ordinal",
//       "range": [
//         "#EB4747",
//         "rgba(88, 195, 218, 1)",
//         "rgba(34, 118, 252, 1)"
//       ],
//       "domain": [
//         {
//           "dataId": "scatterData",
//           "fields": [
//             "type"
//           ]
//         }
//       ]
//     }
//   ],
//   "animationUpdate": false,
//   "animation": false
// }

const spec = {
  background: 'transparent',
  type: 'common',
  region: [
    {
      id: 'dualAreaRegion'
    },
    {
      id: 'scatterRegion'
    }
  ],
  padding: [8, 16, 8, 4],
  crosshair: {
    xField: {
      visible: true,
      line: {
        type: 'line',
        style: {
          lineWidth: 1,
          opacity: 1,
          stroke: 'rgba(255,255,255,0.3)'
        }
      },
      label: {
        visible: true,
        labelBackground: {
          style: {
            fill: 'transparent',
            outerBorder: {
              stroke: 'transparent'
            },
            cornerRadius: 34
          }
        }
      }
    }
  },
  dataZoom: [
    {
      tolerance: 2,
      showDetail: true,
      startHandler: {
        style: {
          fill: '#686A77',
          stroke: '#464958'
        }
      },
      endHandler: {
        style: {
          fill: '#686A77',
          stroke: '#464958'
        }
      },
      orient: 'bottom',
      id: 'datazoom',
      realTime: false,
      startText: {
        style: {
          fill: '#BFC4DE'
        }
      },
      endText: {
        style: {
          fill: '#BFC4DE'
        }
      },
      backgroundChart: {
        area: {
          visible: false,
          style: {
            fill: '#343841'
          }
        },
        line: {
          style: {
            stroke: '#343841'
          }
        }
      },
      selectedBackgroundChart: {
        area: {
          visible: false,
          style: {
            visible: false,
            fill: '#343841'
          }
        }
      },
      background: {
        style: {
          fill: 'rgba(255, 255, 255, 0.08)',
          fillOpacity: 1,
          outerBorder: {
            stroke: 'rgba(255, 255, 255, 0.08)'
          }
        }
      },
      selectedBackground: {
        style: {
          fill: 'rgba(255, 255, 255, 0.12)',
          fillOpacity: 1,
          outerBorder: {
            stroke: 'rgba(255, 255, 255, 0.12)'
          }
        }
      },
      maxSpan: 0.8,
      start: 0,
      end: 0.5
    }
  ],
  layout: {
    type: 'grid',
    col: 3,
    row: 5,
    elements: [
      {
        modelId: 'dualAreaLeftAxis',
        row: 0,
        rowSpan: 2,
        col: 0
      },
      {
        modelId: 'dualAreaRegion',
        row: 0,
        rowSpan: 2,
        col: 1
      },
      {
        modelId: 'dualAreaRightAxis',
        row: 0,
        rowSpan: 2,
        col: 2
      },
      {
        modelId: 'bottomAxis',
        row: 2,
        col: 1
      },
      {
        modelId: 'scatterLeftAxis',
        row: 3,
        col: 0
      },
      {
        modelId: 'scatterRegion',
        row: 3,
        col: 1
      },
      {
        modelId: 'datazoom',
        row: 4,
        col: 1
      }
    ]
  },
  series: [
    {
      id: 'area1',
      regionId: 'dualAreaRegion',
      dataId: 'areaData1',
      type: 'area',
      xField: 'time',
      yField: 'value',
      area: {
        style: {
          fillOpacity: 0.2,
          lineWidth: 2,
          fill: {
            gradient: 'linear',
            x0: 0.5,
            y0: 0,
            x1: 0.5,
            y1: 1,
            stops: [
              {
                offset: 0,
                color: 'rgba(71, 100, 255, 0.40)',
                opacity: 1
              },
              {
                offset: 1,
                color: 'rgba(51, 85, 255, 0.00)'
              }
            ]
          }
        }
      },
      point: false,
      seriesMark: 'point',
      name: '成交金额'
    },
    {
      id: 'area2',
      regionId: 'dualAreaRegion',
      type: 'area',
      dataId: 'areaData2',
      xField: 'time',
      yField: 'value',
      area: {
        style: {
          fillOpacity: 0.2,
          lineWidth: 2,
          fill: {
            gradient: 'linear',
            x0: 0.5,
            y0: 0,
            x1: 0.5,
            y1: 1,
            stops: [
              {
                offset: 0,
                color: 'rgba(13, 156, 141, 0.40)',
                opacity: 1
              },
              {
                offset: 1,
                color: 'rgba(13, 156, 141, 0.00)'
              }
            ]
          }
        }
      },
      point: false,
      seriesMark: 'point',
      name: '成交订单数'
    },
    {
      regionId: 'scatterRegion',
      id: 'scatter',
      invalidType: 'ignore',
      type: 'scatter',
      dataId: 'scatterData',
      xField: 'time',
      yField: 'type',
      seriesField: 'type',
      point: {
        style: {
          size: 8,
          fill: {
            scale: 'scatterColor',
            field: 'type'
          }
        },
        state: {
          dimension_hover: {
            size: 10,
            stroke: '#fff',
            lineWidth: 2
          }
        }
      },
      name: '商品'
    }
  ],
  axes: [
    {
      id: 'dualAreaLeftAxis',
      seriesId: 'area1',
      orient: 'left',
      tick: {
        forceTickCount: 5
      },
      grid: {
        visible: true,
        style: {
          lineDash: [4, 4],
          stroke: 'rgba(255, 255, 255, 0.18)'
        }
      },
      label: {}
    },
    {
      id: 'dualAreaRightAxis',
      seriesId: 'area2',
      orient: 'right',
      tick: {
        forceTickCount: 5
      },
      grid: {
        visible: false,
        style: {
          lineDash: [4, 4],
          stroke: 'rgba(255, 255, 255, 0.18)'
        }
      },
      label: {}
    },
    {
      id: 'scatterLeftAxis',
      seriesId: 'scatter',
      orient: 'left',
      type: 'band',
      tick: {
        visible: false
      },
      domainLine: {
        visible: false
      },
      grid: {
        visible: true,
        style: {
          lineDash: [4, 4],
          stroke: 'rgba(255, 255, 255, 0.18)'
        }
      },
      domain: ['违规', '营销', '商品']
    },
    {
      id: 'bottomAxis',
      seriesId: ['area1', 'area2', 'scatter'],
      orient: 'bottom',
      tick: {
        visible: false
      },
      domainLine: {
        style: {
          stroke: '#494949'
        }
      },
      label: {}
    }
  ],
  color: ['#4D67FF', '#119676'],
  legends: {
    visible: false
  },
  data: [
    {
      id: 'areaData1',
      values: [
        {
          time: '12-01 08:59',
          value: 0,
          type: '成交金额',
          timestamp: '1701392340'
        },
        {
          time: '12-01 09:00',
          value: 0,
          type: '成交金额',
          timestamp: '1701392400'
        },
        {
          time: '12-01 09:01',
          value: 0,
          type: '成交金额',
          timestamp: '1701392460'
        },
        {
          time: '12-01 09:02',
          value: 0,
          type: '成交金额',
          timestamp: '1701392520'
        },
        {
          time: '12-01 09:03',
          value: 0,
          type: '成交金额',
          timestamp: '1701392580'
        },
        {
          time: '12-01 09:04',
          value: 0,
          type: '成交金额',
          timestamp: '1701392640'
        },
        {
          time: '12-01 09:05',
          value: 0,
          type: '成交金额',
          timestamp: '1701392700'
        },
        {
          time: '12-01 09:06',
          value: 0,
          type: '成交金额',
          timestamp: '1701392760'
        },
        {
          time: '12-01 09:07',
          value: 1699,
          type: '成交金额',
          timestamp: '1701392820'
        },
        {
          time: '12-01 09:08',
          value: 0,
          type: '成交金额',
          timestamp: '1701392880'
        },
        {
          time: '12-01 09:09',
          value: 0,
          type: '成交金额',
          timestamp: '1701392940'
        },
        {
          time: '12-01 09:10',
          value: 0,
          type: '成交金额',
          timestamp: '1701393000'
        },
        {
          time: '12-01 09:11',
          value: 0,
          type: '成交金额',
          timestamp: '1701393060'
        },
        {
          time: '12-01 09:12',
          value: 2799,
          type: '成交金额',
          timestamp: '1701393120'
        },
        {
          time: '12-01 09:13',
          value: 2799,
          type: '成交金额',
          timestamp: '1701393180'
        },
        {
          time: '12-01 09:14',
          value: 2799,
          type: '成交金额',
          timestamp: '1701393240'
        },
        {
          time: '12-01 09:15',
          value: 0,
          type: '成交金额',
          timestamp: '1701393300'
        },
        {
          time: '12-01 09:16',
          value: 2799,
          type: '成交金额',
          timestamp: '1701393360'
        },
        {
          time: '12-01 09:17',
          value: 0,
          type: '成交金额',
          timestamp: '1701393420'
        },
        {
          time: '12-01 09:18',
          value: 0,
          type: '成交金额',
          timestamp: '1701393480'
        },
        {
          time: '12-01 09:19',
          value: 0,
          type: '成交金额',
          timestamp: '1701393540'
        },
        {
          time: '12-01 09:20',
          value: 0,
          type: '成交金额',
          timestamp: '1701393600'
        },
        {
          time: '12-01 09:21',
          value: 2799,
          type: '成交金额',
          timestamp: '1701393660'
        },
        {
          time: '12-01 09:22',
          value: 0,
          type: '成交金额',
          timestamp: '1701393720'
        },
        {
          time: '12-01 09:23',
          value: 0,
          type: '成交金额',
          timestamp: '1701393780'
        },
        {
          time: '12-01 09:24',
          value: 2799,
          type: '成交金额',
          timestamp: '1701393840'
        },
        {
          time: '12-01 09:25',
          value: 2799,
          type: '成交金额',
          timestamp: '1701393900'
        },
        {
          time: '12-01 09:26',
          value: 0,
          type: '成交金额',
          timestamp: '1701393960'
        },
        {
          time: '12-01 09:27',
          value: 0,
          type: '成交金额',
          timestamp: '1701394020'
        },
        {
          time: '12-01 09:28',
          value: 0,
          type: '成交金额',
          timestamp: '1701394080'
        },
        {
          time: '12-01 09:29',
          value: 0,
          type: '成交金额',
          timestamp: '1701394140'
        },
        {
          time: '12-01 09:30',
          value: 0,
          type: '成交金额',
          timestamp: '1701394200'
        },
        {
          time: '12-01 09:31',
          value: 0,
          type: '成交金额',
          timestamp: '1701394260'
        },
        {
          time: '12-01 09:32',
          value: 0,
          type: '成交金额',
          timestamp: '1701394320'
        },
        {
          time: '12-01 09:33',
          value: 0,
          type: '成交金额',
          timestamp: '1701394380'
        },
        {
          time: '12-01 09:34',
          value: 0,
          type: '成交金额',
          timestamp: '1701394440'
        },
        {
          time: '12-01 09:35',
          value: 0,
          type: '成交金额',
          timestamp: '1701394500'
        },
        {
          time: '12-01 09:36',
          value: 0,
          type: '成交金额',
          timestamp: '1701394560'
        },
        {
          time: '12-01 09:37',
          value: 2799,
          type: '成交金额',
          timestamp: '1701394620'
        },
        {
          time: '12-01 09:38',
          value: 1999,
          type: '成交金额',
          timestamp: '1701394680'
        },
        {
          time: '12-01 09:39',
          value: 0,
          type: '成交金额',
          timestamp: '1701394740'
        },
        {
          time: '12-01 09:40',
          value: 2799,
          type: '成交金额',
          timestamp: '1701394800'
        },
        {
          time: '12-01 09:41',
          value: 0,
          type: '成交金额',
          timestamp: '1701394860'
        },
        {
          time: '12-01 09:42',
          value: 0,
          type: '成交金额',
          timestamp: '1701394920'
        },
        {
          time: '12-01 09:43',
          value: 0,
          type: '成交金额',
          timestamp: '1701394980'
        },
        {
          time: '12-01 09:44',
          value: 0,
          type: '成交金额',
          timestamp: '1701395040'
        },
        {
          time: '12-01 09:45',
          value: 0,
          type: '成交金额',
          timestamp: '1701395100'
        },
        {
          time: '12-01 09:46',
          value: 0,
          type: '成交金额',
          timestamp: '1701395160'
        },
        {
          time: '12-01 09:47',
          value: 2799,
          type: '成交金额',
          timestamp: '1701395220'
        },
        {
          time: '12-01 09:48',
          value: 0,
          type: '成交金额',
          timestamp: '1701395280'
        },
        {
          time: '12-01 09:49',
          value: 2799,
          type: '成交金额',
          timestamp: '1701395340'
        },
        {
          time: '12-01 09:50',
          value: 0,
          type: '成交金额',
          timestamp: '1701395400'
        },
        {
          time: '12-01 09:51',
          value: 5598,
          type: '成交金额',
          timestamp: '1701395460'
        },
        {
          time: '12-01 09:52',
          value: 2799,
          type: '成交金额',
          timestamp: '1701395520'
        },
        {
          time: '12-01 09:53',
          value: 0,
          type: '成交金额',
          timestamp: '1701395580'
        },
        {
          time: '12-01 09:54',
          value: 0,
          type: '成交金额',
          timestamp: '1701395640'
        },
        {
          time: '12-01 09:55',
          value: 0,
          type: '成交金额',
          timestamp: '1701395700'
        },
        {
          time: '12-01 09:56',
          value: 0,
          type: '成交金额',
          timestamp: '1701395760'
        },
        {
          time: '12-01 09:57',
          value: 0,
          type: '成交金额',
          timestamp: '1701395820'
        },
        {
          time: '12-01 09:58',
          value: 2799,
          type: '成交金额',
          timestamp: '1701395880'
        },
        {
          time: '12-01 09:59',
          value: 9096,
          type: '成交金额',
          timestamp: '1701395940'
        },
        {
          time: '12-01 10:00',
          value: 0,
          type: '成交金额',
          timestamp: '1701396000'
        },
        {
          time: '12-01 10:01',
          value: 5598,
          type: '成交金额',
          timestamp: '1701396060'
        },
        {
          time: '12-01 10:02',
          value: 5598,
          type: '成交金额',
          timestamp: '1701396120'
        },
        {
          time: '12-01 10:03',
          value: 0,
          type: '成交金额',
          timestamp: '1701396180'
        },
        {
          time: '12-01 10:04',
          value: 0,
          type: '成交金额',
          timestamp: '1701396240'
        },
        {
          time: '12-01 10:05',
          value: 0,
          type: '成交金额',
          timestamp: '1701396300'
        },
        {
          time: '12-01 10:06',
          value: 0,
          type: '成交金额',
          timestamp: '1701396360'
        },
        {
          time: '12-01 10:07',
          value: 0,
          type: '成交金额',
          timestamp: '1701396420'
        },
        {
          time: '12-01 10:08',
          value: 0,
          type: '成交金额',
          timestamp: '1701396480'
        },
        {
          time: '12-01 10:09',
          value: 0,
          type: '成交金额',
          timestamp: '1701396540'
        },
        {
          time: '12-01 10:10',
          value: 0,
          type: '成交金额',
          timestamp: '1701396600'
        },
        {
          time: '12-01 10:11',
          value: 0,
          type: '成交金额',
          timestamp: '1701396660'
        },
        {
          time: '12-01 10:12',
          value: 0,
          type: '成交金额',
          timestamp: '1701396720'
        },
        {
          time: '12-01 10:13',
          value: 0,
          type: '成交金额',
          timestamp: '1701396780'
        },
        {
          time: '12-01 10:14',
          value: 1599,
          type: '成交金额',
          timestamp: '1701396840'
        },
        {
          time: '12-01 10:15',
          value: 0,
          type: '成交金额',
          timestamp: '1701396900'
        },
        {
          time: '12-01 10:16',
          value: 0,
          type: '成交金额',
          timestamp: '1701396960'
        },
        {
          time: '12-01 10:17',
          value: 0,
          type: '成交金额',
          timestamp: '1701397020'
        },
        {
          time: '12-01 10:18',
          value: 2799,
          type: '成交金额',
          timestamp: '1701397080'
        },
        {
          time: '12-01 10:19',
          value: 2799,
          type: '成交金额',
          timestamp: '1701397140'
        },
        {
          time: '12-01 10:20',
          value: 2799,
          type: '成交金额',
          timestamp: '1701397200'
        },
        {
          time: '12-01 10:21',
          value: 2799,
          type: '成交金额',
          timestamp: '1701397260'
        },
        {
          time: '12-01 10:22',
          value: 2799,
          type: '成交金额',
          timestamp: '1701397320'
        },
        {
          time: '12-01 10:23',
          value: 2799,
          type: '成交金额',
          timestamp: '1701397380'
        },
        {
          time: '12-01 10:24',
          value: 0,
          type: '成交金额',
          timestamp: '1701397440'
        },
        {
          time: '12-01 10:25',
          value: 0,
          type: '成交金额',
          timestamp: '1701397500'
        },
        {
          time: '12-01 10:26',
          value: 0,
          type: '成交金额',
          timestamp: '1701397560'
        },
        {
          time: '12-01 10:27',
          value: 0,
          type: '成交金额',
          timestamp: '1701397620'
        },
        {
          time: '12-01 10:28',
          value: 2799,
          type: '成交金额',
          timestamp: '1701397680'
        },
        {
          time: '12-01 10:29',
          value: 0,
          type: '成交金额',
          timestamp: '1701397740'
        },
        {
          time: '12-01 10:30',
          value: 0,
          type: '成交金额',
          timestamp: '1701397800'
        },
        {
          time: '12-01 10:31',
          value: 0,
          type: '成交金额',
          timestamp: '1701397860'
        },
        {
          time: '12-01 10:32',
          value: 0,
          type: '成交金额',
          timestamp: '1701397920'
        },
        {
          time: '12-01 10:33',
          value: 0,
          type: '成交金额',
          timestamp: '1701397980'
        },
        {
          time: '12-01 10:34',
          value: 2799,
          type: '成交金额',
          timestamp: '1701398040'
        },
        {
          time: '12-01 10:35',
          value: 0,
          type: '成交金额',
          timestamp: '1701398100'
        },
        {
          time: '12-01 10:36',
          value: 0,
          type: '成交金额',
          timestamp: '1701398160'
        },
        {
          time: '12-01 10:37',
          value: 2799,
          type: '成交金额',
          timestamp: '1701398220'
        },
        {
          time: '12-01 10:38',
          value: 0,
          type: '成交金额',
          timestamp: '1701398280'
        },
        {
          time: '12-01 10:39',
          value: 2799,
          type: '成交金额',
          timestamp: '1701398340'
        },
        {
          time: '12-01 10:40',
          value: 0,
          type: '成交金额',
          timestamp: '1701398400'
        },
        {
          time: '12-01 10:41',
          value: 2799,
          type: '成交金额',
          timestamp: '1701398460'
        },
        {
          time: '12-01 10:42',
          value: 0,
          type: '成交金额',
          timestamp: '1701398520'
        },
        {
          time: '12-01 10:43',
          value: 0,
          type: '成交金额',
          timestamp: '1701398580'
        },
        {
          time: '12-01 10:44',
          value: 0,
          type: '成交金额',
          timestamp: '1701398640'
        },
        {
          time: '12-01 10:45',
          value: 0,
          type: '成交金额',
          timestamp: '1701398700'
        },
        {
          time: '12-01 10:46',
          value: 2799,
          type: '成交金额',
          timestamp: '1701398760'
        },
        {
          time: '12-01 10:47',
          value: 1699,
          type: '成交金额',
          timestamp: '1701398820'
        },
        {
          time: '12-01 10:48',
          value: 2799,
          type: '成交金额',
          timestamp: '1701398880'
        },
        {
          time: '12-01 10:49',
          value: 0,
          type: '成交金额',
          timestamp: '1701398940'
        },
        {
          time: '12-01 10:50',
          value: 0,
          type: '成交金额',
          timestamp: '1701399000'
        },
        {
          time: '12-01 10:51',
          value: 0,
          type: '成交金额',
          timestamp: '1701399060'
        },
        {
          time: '12-01 10:52',
          value: 0,
          type: '成交金额',
          timestamp: '1701399120'
        },
        {
          time: '12-01 10:53',
          value: 0,
          type: '成交金额',
          timestamp: '1701399180'
        },
        {
          time: '12-01 10:54',
          value: 0,
          type: '成交金额',
          timestamp: '1701399240'
        },
        {
          time: '12-01 10:55',
          value: 0,
          type: '成交金额',
          timestamp: '1701399300'
        },
        {
          time: '12-01 10:56',
          value: 2799,
          type: '成交金额',
          timestamp: '1701399360'
        },
        {
          time: '12-01 10:57',
          value: 2799,
          type: '成交金额',
          timestamp: '1701399420'
        },
        {
          time: '12-01 10:58',
          value: 2799,
          type: '成交金额',
          timestamp: '1701399480'
        },
        {
          time: '12-01 10:59',
          value: 0,
          type: '成交金额',
          timestamp: '1701399540'
        },
        {
          time: '12-01 11:00',
          value: 0,
          type: '成交金额',
          timestamp: '1701399600'
        },
        {
          time: '12-01 11:01',
          value: 0,
          type: '成交金额',
          timestamp: '1701399660'
        },
        {
          time: '12-01 11:02',
          value: 0,
          type: '成交金额',
          timestamp: '1701399720'
        },
        {
          time: '12-01 11:03',
          value: 0,
          type: '成交金额',
          timestamp: '1701399780'
        },
        {
          time: '12-01 11:04',
          value: 0,
          type: '成交金额',
          timestamp: '1701399840'
        },
        {
          time: '12-01 11:05',
          value: 0,
          type: '成交金额',
          timestamp: '1701399900'
        },
        {
          time: '12-01 11:06',
          value: 0,
          type: '成交金额',
          timestamp: '1701399960'
        },
        {
          time: '12-01 11:07',
          value: 0,
          type: '成交金额',
          timestamp: '1701400020'
        },
        {
          time: '12-01 11:08',
          value: 0,
          type: '成交金额',
          timestamp: '1701400080'
        },
        {
          time: '12-01 11:09',
          value: 0,
          type: '成交金额',
          timestamp: '1701400140'
        },
        {
          time: '12-01 11:10',
          value: 0,
          type: '成交金额',
          timestamp: '1701400200'
        },
        {
          time: '12-01 11:11',
          value: 2799,
          type: '成交金额',
          timestamp: '1701400260'
        },
        {
          time: '12-01 11:12',
          value: 0,
          type: '成交金额',
          timestamp: '1701400320'
        },
        {
          time: '12-01 11:13',
          value: 0,
          type: '成交金额',
          timestamp: '1701400380'
        },
        {
          time: '12-01 11:14',
          value: 0,
          type: '成交金额',
          timestamp: '1701400440'
        },
        {
          time: '12-01 11:15',
          value: 0,
          type: '成交金额',
          timestamp: '1701400500'
        },
        {
          time: '12-01 11:16',
          value: 0,
          type: '成交金额',
          timestamp: '1701400560'
        },
        {
          time: '12-01 11:17',
          value: 0,
          type: '成交金额',
          timestamp: '1701400620'
        },
        {
          time: '12-01 11:18',
          value: 0,
          type: '成交金额',
          timestamp: '1701400680'
        },
        {
          time: '12-01 11:19',
          value: 0,
          type: '成交金额',
          timestamp: '1701400740'
        },
        {
          time: '12-01 11:20',
          value: 0,
          type: '成交金额',
          timestamp: '1701400800'
        },
        {
          time: '12-01 11:21',
          value: 0,
          type: '成交金额',
          timestamp: '1701400860'
        },
        {
          time: '12-01 11:22',
          value: 0,
          type: '成交金额',
          timestamp: '1701400920'
        },
        {
          time: '12-01 11:23',
          value: 0,
          type: '成交金额',
          timestamp: '1701400980'
        },
        {
          time: '12-01 11:24',
          value: 0,
          type: '成交金额',
          timestamp: '1701401040'
        },
        {
          time: '12-01 11:25',
          value: 0,
          type: '成交金额',
          timestamp: '1701401100'
        },
        {
          time: '12-01 11:26',
          value: 0,
          type: '成交金额',
          timestamp: '1701401160'
        },
        {
          time: '12-01 11:27',
          value: 0,
          type: '成交金额',
          timestamp: '1701401220'
        },
        {
          time: '12-01 11:28',
          value: 2799,
          type: '成交金额',
          timestamp: '1701401280'
        },
        {
          time: '12-01 11:29',
          value: 0,
          type: '成交金额',
          timestamp: '1701401340'
        },
        {
          time: '12-01 11:30',
          value: 0,
          type: '成交金额',
          timestamp: '1701401400'
        },
        {
          time: '12-01 11:31',
          value: 0,
          type: '成交金额',
          timestamp: '1701401460'
        },
        {
          time: '12-01 11:32',
          value: 0,
          type: '成交金额',
          timestamp: '1701401520'
        },
        {
          time: '12-01 11:33',
          value: 0,
          type: '成交金额',
          timestamp: '1701401580'
        },
        {
          time: '12-01 11:34',
          value: 0,
          type: '成交金额',
          timestamp: '1701401640'
        },
        {
          time: '12-01 11:35',
          value: 0,
          type: '成交金额',
          timestamp: '1701401700'
        },
        {
          time: '12-01 11:36',
          value: 0,
          type: '成交金额',
          timestamp: '1701401760'
        },
        {
          time: '12-01 11:37',
          value: 1699,
          type: '成交金额',
          timestamp: '1701401820'
        },
        {
          time: '12-01 11:38',
          value: 0,
          type: '成交金额',
          timestamp: '1701401880'
        },
        {
          time: '12-01 11:39',
          value: 0,
          type: '成交金额',
          timestamp: '1701401940'
        },
        {
          time: '12-01 11:40',
          value: 2799,
          type: '成交金额',
          timestamp: '1701402000'
        },
        {
          time: '12-01 11:41',
          value: 2799,
          type: '成交金额',
          timestamp: '1701402060'
        },
        {
          time: '12-01 11:42',
          value: 0,
          type: '成交金额',
          timestamp: '1701402120'
        },
        {
          time: '12-01 11:43',
          value: 0,
          type: '成交金额',
          timestamp: '1701402180'
        },
        {
          time: '12-01 11:44',
          value: 0,
          type: '成交金额',
          timestamp: '1701402240'
        },
        {
          time: '12-01 11:45',
          value: 0,
          type: '成交金额',
          timestamp: '1701402300'
        },
        {
          time: '12-01 11:46',
          value: 0,
          type: '成交金额',
          timestamp: '1701402360'
        },
        {
          time: '12-01 11:47',
          value: 0,
          type: '成交金额',
          timestamp: '1701402420'
        },
        {
          time: '12-01 11:48',
          value: 0,
          type: '成交金额',
          timestamp: '1701402480'
        },
        {
          time: '12-01 11:49',
          value: 0,
          type: '成交金额',
          timestamp: '1701402540'
        },
        {
          time: '12-01 11:50',
          value: 0,
          type: '成交金额',
          timestamp: '1701402600'
        },
        {
          time: '12-01 11:51',
          value: 0,
          type: '成交金额',
          timestamp: '1701402660'
        },
        {
          time: '12-01 11:52',
          value: 0,
          type: '成交金额',
          timestamp: '1701402720'
        },
        {
          time: '12-01 11:53',
          value: 0,
          type: '成交金额',
          timestamp: '1701402780'
        },
        {
          time: '12-01 11:54',
          value: 2799,
          type: '成交金额',
          timestamp: '1701402840'
        },
        {
          time: '12-01 11:55',
          value: 0,
          type: '成交金额',
          timestamp: '1701402900'
        },
        {
          time: '12-01 11:56',
          value: 3698,
          type: '成交金额',
          timestamp: '1701402960'
        },
        {
          time: '12-01 11:57',
          value: 1999,
          type: '成交金额',
          timestamp: '1701403020'
        },
        {
          time: '12-01 11:58',
          value: 2799,
          type: '成交金额',
          timestamp: '1701403080'
        },
        {
          time: '12-01 11:59',
          value: 0,
          type: '成交金额',
          timestamp: '1701403140'
        },
        {
          time: '12-01 12:00',
          value: 5598,
          type: '成交金额',
          timestamp: '1701403200'
        },
        {
          time: '12-01 12:01',
          value: 0,
          type: '成交金额',
          timestamp: '1701403260'
        },
        {
          time: '12-01 12:02',
          value: 2799,
          type: '成交金额',
          timestamp: '1701403320'
        },
        {
          time: '12-01 12:03',
          value: 0,
          type: '成交金额',
          timestamp: '1701403380'
        },
        {
          time: '12-01 12:04',
          value: 2799,
          type: '成交金额',
          timestamp: '1701403440'
        },
        {
          time: '12-01 12:05',
          value: 2799,
          type: '成交金额',
          timestamp: '1701403500'
        },
        {
          time: '12-01 12:06',
          value: 0,
          type: '成交金额',
          timestamp: '1701403560'
        },
        {
          time: '12-01 12:07',
          value: 3698,
          type: '成交金额',
          timestamp: '1701403620'
        },
        {
          time: '12-01 12:08',
          value: 1699,
          type: '成交金额',
          timestamp: '1701403680'
        }
      ]
    },
    {
      id: 'areaData2',
      values: [
        {
          time: '12-01 08:59',
          value: 0,
          type: '成交订单数',
          timestamp: '1701392340'
        },
        {
          time: '12-01 09:00',
          value: 0,
          type: '成交订单数',
          timestamp: '1701392400'
        },
        {
          time: '12-01 09:01',
          value: 0,
          type: '成交订单数',
          timestamp: '1701392460'
        },
        {
          time: '12-01 09:02',
          value: 0,
          type: '成交订单数',
          timestamp: '1701392520'
        },
        {
          time: '12-01 09:03',
          value: 0,
          type: '成交订单数',
          timestamp: '1701392580'
        },
        {
          time: '12-01 09:04',
          value: 0,
          type: '成交订单数',
          timestamp: '1701392640'
        },
        {
          time: '12-01 09:05',
          value: 0,
          type: '成交订单数',
          timestamp: '1701392700'
        },
        {
          time: '12-01 09:06',
          value: 0,
          type: '成交订单数',
          timestamp: '1701392760'
        },
        {
          time: '12-01 09:07',
          value: 1,
          type: '成交订单数',
          timestamp: '1701392820'
        },
        {
          time: '12-01 09:08',
          value: 0,
          type: '成交订单数',
          timestamp: '1701392880'
        },
        {
          time: '12-01 09:09',
          value: 0,
          type: '成交订单数',
          timestamp: '1701392940'
        },
        {
          time: '12-01 09:10',
          value: 0,
          type: '成交订单数',
          timestamp: '1701393000'
        },
        {
          time: '12-01 09:11',
          value: 0,
          type: '成交订单数',
          timestamp: '1701393060'
        },
        {
          time: '12-01 09:12',
          value: 1,
          type: '成交订单数',
          timestamp: '1701393120'
        },
        {
          time: '12-01 09:13',
          value: 1,
          type: '成交订单数',
          timestamp: '1701393180'
        },
        {
          time: '12-01 09:14',
          value: 1,
          type: '成交订单数',
          timestamp: '1701393240'
        },
        {
          time: '12-01 09:15',
          value: 0,
          type: '成交订单数',
          timestamp: '1701393300'
        },
        {
          time: '12-01 09:16',
          value: 1,
          type: '成交订单数',
          timestamp: '1701393360'
        },
        {
          time: '12-01 09:17',
          value: 0,
          type: '成交订单数',
          timestamp: '1701393420'
        },
        {
          time: '12-01 09:18',
          value: 0,
          type: '成交订单数',
          timestamp: '1701393480'
        },
        {
          time: '12-01 09:19',
          value: 0,
          type: '成交订单数',
          timestamp: '1701393540'
        },
        {
          time: '12-01 09:20',
          value: 0,
          type: '成交订单数',
          timestamp: '1701393600'
        },
        {
          time: '12-01 09:21',
          value: 1,
          type: '成交订单数',
          timestamp: '1701393660'
        },
        {
          time: '12-01 09:22',
          value: 0,
          type: '成交订单数',
          timestamp: '1701393720'
        },
        {
          time: '12-01 09:23',
          value: 0,
          type: '成交订单数',
          timestamp: '1701393780'
        },
        {
          time: '12-01 09:24',
          value: 1,
          type: '成交订单数',
          timestamp: '1701393840'
        },
        {
          time: '12-01 09:25',
          value: 1,
          type: '成交订单数',
          timestamp: '1701393900'
        },
        {
          time: '12-01 09:26',
          value: 0,
          type: '成交订单数',
          timestamp: '1701393960'
        },
        {
          time: '12-01 09:27',
          value: 0,
          type: '成交订单数',
          timestamp: '1701394020'
        },
        {
          time: '12-01 09:28',
          value: 0,
          type: '成交订单数',
          timestamp: '1701394080'
        },
        {
          time: '12-01 09:29',
          value: 0,
          type: '成交订单数',
          timestamp: '1701394140'
        },
        {
          time: '12-01 09:30',
          value: 0,
          type: '成交订单数',
          timestamp: '1701394200'
        },
        {
          time: '12-01 09:31',
          value: 0,
          type: '成交订单数',
          timestamp: '1701394260'
        },
        {
          time: '12-01 09:32',
          value: 0,
          type: '成交订单数',
          timestamp: '1701394320'
        },
        {
          time: '12-01 09:33',
          value: 0,
          type: '成交订单数',
          timestamp: '1701394380'
        },
        {
          time: '12-01 09:34',
          value: 0,
          type: '成交订单数',
          timestamp: '1701394440'
        },
        {
          time: '12-01 09:35',
          value: 0,
          type: '成交订单数',
          timestamp: '1701394500'
        },
        {
          time: '12-01 09:36',
          value: 0,
          type: '成交订单数',
          timestamp: '1701394560'
        },
        {
          time: '12-01 09:37',
          value: 1,
          type: '成交订单数',
          timestamp: '1701394620'
        },
        {
          time: '12-01 09:38',
          value: 1,
          type: '成交订单数',
          timestamp: '1701394680'
        },
        {
          time: '12-01 09:39',
          value: 0,
          type: '成交订单数',
          timestamp: '1701394740'
        },
        {
          time: '12-01 09:40',
          value: 1,
          type: '成交订单数',
          timestamp: '1701394800'
        },
        {
          time: '12-01 09:41',
          value: 0,
          type: '成交订单数',
          timestamp: '1701394860'
        },
        {
          time: '12-01 09:42',
          value: 0,
          type: '成交订单数',
          timestamp: '1701394920'
        },
        {
          time: '12-01 09:43',
          value: 0,
          type: '成交订单数',
          timestamp: '1701394980'
        },
        {
          time: '12-01 09:44',
          value: 0,
          type: '成交订单数',
          timestamp: '1701395040'
        },
        {
          time: '12-01 09:45',
          value: 0,
          type: '成交订单数',
          timestamp: '1701395100'
        },
        {
          time: '12-01 09:46',
          value: 0,
          type: '成交订单数',
          timestamp: '1701395160'
        },
        {
          time: '12-01 09:47',
          value: 1,
          type: '成交订单数',
          timestamp: '1701395220'
        },
        {
          time: '12-01 09:48',
          value: 0,
          type: '成交订单数',
          timestamp: '1701395280'
        },
        {
          time: '12-01 09:49',
          value: 1,
          type: '成交订单数',
          timestamp: '1701395340'
        },
        {
          time: '12-01 09:50',
          value: 0,
          type: '成交订单数',
          timestamp: '1701395400'
        },
        {
          time: '12-01 09:51',
          value: 2,
          type: '成交订单数',
          timestamp: '1701395460'
        },
        {
          time: '12-01 09:52',
          value: 1,
          type: '成交订单数',
          timestamp: '1701395520'
        },
        {
          time: '12-01 09:53',
          value: 0,
          type: '成交订单数',
          timestamp: '1701395580'
        },
        {
          time: '12-01 09:54',
          value: 0,
          type: '成交订单数',
          timestamp: '1701395640'
        },
        {
          time: '12-01 09:55',
          value: 0,
          type: '成交订单数',
          timestamp: '1701395700'
        },
        {
          time: '12-01 09:56',
          value: 0,
          type: '成交订单数',
          timestamp: '1701395760'
        },
        {
          time: '12-01 09:57',
          value: 0,
          type: '成交订单数',
          timestamp: '1701395820'
        },
        {
          time: '12-01 09:58',
          value: 1,
          type: '成交订单数',
          timestamp: '1701395880'
        },
        {
          time: '12-01 09:59',
          value: 4,
          type: '成交订单数',
          timestamp: '1701395940'
        },
        {
          time: '12-01 10:00',
          value: 0,
          type: '成交订单数',
          timestamp: '1701396000'
        },
        {
          time: '12-01 10:01',
          value: 2,
          type: '成交订单数',
          timestamp: '1701396060'
        },
        {
          time: '12-01 10:02',
          value: 2,
          type: '成交订单数',
          timestamp: '1701396120'
        },
        {
          time: '12-01 10:03',
          value: 0,
          type: '成交订单数',
          timestamp: '1701396180'
        },
        {
          time: '12-01 10:04',
          value: 0,
          type: '成交订单数',
          timestamp: '1701396240'
        },
        {
          time: '12-01 10:05',
          value: 0,
          type: '成交订单数',
          timestamp: '1701396300'
        },
        {
          time: '12-01 10:06',
          value: 0,
          type: '成交订单数',
          timestamp: '1701396360'
        },
        {
          time: '12-01 10:07',
          value: 0,
          type: '成交订单数',
          timestamp: '1701396420'
        },
        {
          time: '12-01 10:08',
          value: 0,
          type: '成交订单数',
          timestamp: '1701396480'
        },
        {
          time: '12-01 10:09',
          value: 0,
          type: '成交订单数',
          timestamp: '1701396540'
        },
        {
          time: '12-01 10:10',
          value: 0,
          type: '成交订单数',
          timestamp: '1701396600'
        },
        {
          time: '12-01 10:11',
          value: 0,
          type: '成交订单数',
          timestamp: '1701396660'
        },
        {
          time: '12-01 10:12',
          value: 0,
          type: '成交订单数',
          timestamp: '1701396720'
        },
        {
          time: '12-01 10:13',
          value: 0,
          type: '成交订单数',
          timestamp: '1701396780'
        },
        {
          time: '12-01 10:14',
          value: 1,
          type: '成交订单数',
          timestamp: '1701396840'
        },
        {
          time: '12-01 10:15',
          value: 0,
          type: '成交订单数',
          timestamp: '1701396900'
        },
        {
          time: '12-01 10:16',
          value: 0,
          type: '成交订单数',
          timestamp: '1701396960'
        },
        {
          time: '12-01 10:17',
          value: 0,
          type: '成交订单数',
          timestamp: '1701397020'
        },
        {
          time: '12-01 10:18',
          value: 1,
          type: '成交订单数',
          timestamp: '1701397080'
        },
        {
          time: '12-01 10:19',
          value: 1,
          type: '成交订单数',
          timestamp: '1701397140'
        },
        {
          time: '12-01 10:20',
          value: 1,
          type: '成交订单数',
          timestamp: '1701397200'
        },
        {
          time: '12-01 10:21',
          value: 1,
          type: '成交订单数',
          timestamp: '1701397260'
        },
        {
          time: '12-01 10:22',
          value: 1,
          type: '成交订单数',
          timestamp: '1701397320'
        },
        {
          time: '12-01 10:23',
          value: 1,
          type: '成交订单数',
          timestamp: '1701397380'
        },
        {
          time: '12-01 10:24',
          value: 0,
          type: '成交订单数',
          timestamp: '1701397440'
        },
        {
          time: '12-01 10:25',
          value: 0,
          type: '成交订单数',
          timestamp: '1701397500'
        },
        {
          time: '12-01 10:26',
          value: 0,
          type: '成交订单数',
          timestamp: '1701397560'
        },
        {
          time: '12-01 10:27',
          value: 0,
          type: '成交订单数',
          timestamp: '1701397620'
        },
        {
          time: '12-01 10:28',
          value: 1,
          type: '成交订单数',
          timestamp: '1701397680'
        },
        {
          time: '12-01 10:29',
          value: 0,
          type: '成交订单数',
          timestamp: '1701397740'
        },
        {
          time: '12-01 10:30',
          value: 0,
          type: '成交订单数',
          timestamp: '1701397800'
        },
        {
          time: '12-01 10:31',
          value: 0,
          type: '成交订单数',
          timestamp: '1701397860'
        },
        {
          time: '12-01 10:32',
          value: 0,
          type: '成交订单数',
          timestamp: '1701397920'
        },
        {
          time: '12-01 10:33',
          value: 0,
          type: '成交订单数',
          timestamp: '1701397980'
        },
        {
          time: '12-01 10:34',
          value: 1,
          type: '成交订单数',
          timestamp: '1701398040'
        },
        {
          time: '12-01 10:35',
          value: 0,
          type: '成交订单数',
          timestamp: '1701398100'
        },
        {
          time: '12-01 10:36',
          value: 0,
          type: '成交订单数',
          timestamp: '1701398160'
        },
        {
          time: '12-01 10:37',
          value: 1,
          type: '成交订单数',
          timestamp: '1701398220'
        },
        {
          time: '12-01 10:38',
          value: 0,
          type: '成交订单数',
          timestamp: '1701398280'
        },
        {
          time: '12-01 10:39',
          value: 1,
          type: '成交订单数',
          timestamp: '1701398340'
        },
        {
          time: '12-01 10:40',
          value: 0,
          type: '成交订单数',
          timestamp: '1701398400'
        },
        {
          time: '12-01 10:41',
          value: 1,
          type: '成交订单数',
          timestamp: '1701398460'
        },
        {
          time: '12-01 10:42',
          value: 0,
          type: '成交订单数',
          timestamp: '1701398520'
        },
        {
          time: '12-01 10:43',
          value: 0,
          type: '成交订单数',
          timestamp: '1701398580'
        },
        {
          time: '12-01 10:44',
          value: 0,
          type: '成交订单数',
          timestamp: '1701398640'
        },
        {
          time: '12-01 10:45',
          value: 0,
          type: '成交订单数',
          timestamp: '1701398700'
        },
        {
          time: '12-01 10:46',
          value: 1,
          type: '成交订单数',
          timestamp: '1701398760'
        },
        {
          time: '12-01 10:47',
          value: 1,
          type: '成交订单数',
          timestamp: '1701398820'
        },
        {
          time: '12-01 10:48',
          value: 1,
          type: '成交订单数',
          timestamp: '1701398880'
        },
        {
          time: '12-01 10:49',
          value: 0,
          type: '成交订单数',
          timestamp: '1701398940'
        },
        {
          time: '12-01 10:50',
          value: 0,
          type: '成交订单数',
          timestamp: '1701399000'
        },
        {
          time: '12-01 10:51',
          value: 0,
          type: '成交订单数',
          timestamp: '1701399060'
        },
        {
          time: '12-01 10:52',
          value: 0,
          type: '成交订单数',
          timestamp: '1701399120'
        },
        {
          time: '12-01 10:53',
          value: 0,
          type: '成交订单数',
          timestamp: '1701399180'
        },
        {
          time: '12-01 10:54',
          value: 0,
          type: '成交订单数',
          timestamp: '1701399240'
        },
        {
          time: '12-01 10:55',
          value: 0,
          type: '成交订单数',
          timestamp: '1701399300'
        },
        {
          time: '12-01 10:56',
          value: 1,
          type: '成交订单数',
          timestamp: '1701399360'
        },
        {
          time: '12-01 10:57',
          value: 1,
          type: '成交订单数',
          timestamp: '1701399420'
        },
        {
          time: '12-01 10:58',
          value: 1,
          type: '成交订单数',
          timestamp: '1701399480'
        },
        {
          time: '12-01 10:59',
          value: 0,
          type: '成交订单数',
          timestamp: '1701399540'
        },
        {
          time: '12-01 11:00',
          value: 0,
          type: '成交订单数',
          timestamp: '1701399600'
        },
        {
          time: '12-01 11:01',
          value: 0,
          type: '成交订单数',
          timestamp: '1701399660'
        },
        {
          time: '12-01 11:02',
          value: 0,
          type: '成交订单数',
          timestamp: '1701399720'
        },
        {
          time: '12-01 11:03',
          value: 0,
          type: '成交订单数',
          timestamp: '1701399780'
        },
        {
          time: '12-01 11:04',
          value: 0,
          type: '成交订单数',
          timestamp: '1701399840'
        },
        {
          time: '12-01 11:05',
          value: 0,
          type: '成交订单数',
          timestamp: '1701399900'
        },
        {
          time: '12-01 11:06',
          value: 0,
          type: '成交订单数',
          timestamp: '1701399960'
        },
        {
          time: '12-01 11:07',
          value: 0,
          type: '成交订单数',
          timestamp: '1701400020'
        },
        {
          time: '12-01 11:08',
          value: 0,
          type: '成交订单数',
          timestamp: '1701400080'
        },
        {
          time: '12-01 11:09',
          value: 0,
          type: '成交订单数',
          timestamp: '1701400140'
        },
        {
          time: '12-01 11:10',
          value: 0,
          type: '成交订单数',
          timestamp: '1701400200'
        },
        {
          time: '12-01 11:11',
          value: 1,
          type: '成交订单数',
          timestamp: '1701400260'
        },
        {
          time: '12-01 11:12',
          value: 0,
          type: '成交订单数',
          timestamp: '1701400320'
        },
        {
          time: '12-01 11:13',
          value: 0,
          type: '成交订单数',
          timestamp: '1701400380'
        },
        {
          time: '12-01 11:14',
          value: 0,
          type: '成交订单数',
          timestamp: '1701400440'
        },
        {
          time: '12-01 11:15',
          value: 0,
          type: '成交订单数',
          timestamp: '1701400500'
        },
        {
          time: '12-01 11:16',
          value: 0,
          type: '成交订单数',
          timestamp: '1701400560'
        },
        {
          time: '12-01 11:17',
          value: 0,
          type: '成交订单数',
          timestamp: '1701400620'
        },
        {
          time: '12-01 11:18',
          value: 0,
          type: '成交订单数',
          timestamp: '1701400680'
        },
        {
          time: '12-01 11:19',
          value: 0,
          type: '成交订单数',
          timestamp: '1701400740'
        },
        {
          time: '12-01 11:20',
          value: 0,
          type: '成交订单数',
          timestamp: '1701400800'
        },
        {
          time: '12-01 11:21',
          value: 0,
          type: '成交订单数',
          timestamp: '1701400860'
        },
        {
          time: '12-01 11:22',
          value: 0,
          type: '成交订单数',
          timestamp: '1701400920'
        },
        {
          time: '12-01 11:23',
          value: 0,
          type: '成交订单数',
          timestamp: '1701400980'
        },
        {
          time: '12-01 11:24',
          value: 0,
          type: '成交订单数',
          timestamp: '1701401040'
        },
        {
          time: '12-01 11:25',
          value: 0,
          type: '成交订单数',
          timestamp: '1701401100'
        },
        {
          time: '12-01 11:26',
          value: 0,
          type: '成交订单数',
          timestamp: '1701401160'
        },
        {
          time: '12-01 11:27',
          value: 0,
          type: '成交订单数',
          timestamp: '1701401220'
        },
        {
          time: '12-01 11:28',
          value: 1,
          type: '成交订单数',
          timestamp: '1701401280'
        },
        {
          time: '12-01 11:29',
          value: 0,
          type: '成交订单数',
          timestamp: '1701401340'
        },
        {
          time: '12-01 11:30',
          value: 0,
          type: '成交订单数',
          timestamp: '1701401400'
        },
        {
          time: '12-01 11:31',
          value: 0,
          type: '成交订单数',
          timestamp: '1701401460'
        },
        {
          time: '12-01 11:32',
          value: 0,
          type: '成交订单数',
          timestamp: '1701401520'
        },
        {
          time: '12-01 11:33',
          value: 0,
          type: '成交订单数',
          timestamp: '1701401580'
        },
        {
          time: '12-01 11:34',
          value: 0,
          type: '成交订单数',
          timestamp: '1701401640'
        },
        {
          time: '12-01 11:35',
          value: 0,
          type: '成交订单数',
          timestamp: '1701401700'
        },
        {
          time: '12-01 11:36',
          value: 0,
          type: '成交订单数',
          timestamp: '1701401760'
        },
        {
          time: '12-01 11:37',
          value: 1,
          type: '成交订单数',
          timestamp: '1701401820'
        },
        {
          time: '12-01 11:38',
          value: 0,
          type: '成交订单数',
          timestamp: '1701401880'
        },
        {
          time: '12-01 11:39',
          value: 0,
          type: '成交订单数',
          timestamp: '1701401940'
        },
        {
          time: '12-01 11:40',
          value: 1,
          type: '成交订单数',
          timestamp: '1701402000'
        },
        {
          time: '12-01 11:41',
          value: 1,
          type: '成交订单数',
          timestamp: '1701402060'
        },
        {
          time: '12-01 11:42',
          value: 0,
          type: '成交订单数',
          timestamp: '1701402120'
        },
        {
          time: '12-01 11:43',
          value: 0,
          type: '成交订单数',
          timestamp: '1701402180'
        },
        {
          time: '12-01 11:44',
          value: 0,
          type: '成交订单数',
          timestamp: '1701402240'
        },
        {
          time: '12-01 11:45',
          value: 0,
          type: '成交订单数',
          timestamp: '1701402300'
        },
        {
          time: '12-01 11:46',
          value: 0,
          type: '成交订单数',
          timestamp: '1701402360'
        },
        {
          time: '12-01 11:47',
          value: 0,
          type: '成交订单数',
          timestamp: '1701402420'
        },
        {
          time: '12-01 11:48',
          value: 0,
          type: '成交订单数',
          timestamp: '1701402480'
        },
        {
          time: '12-01 11:49',
          value: 0,
          type: '成交订单数',
          timestamp: '1701402540'
        },
        {
          time: '12-01 11:50',
          value: 0,
          type: '成交订单数',
          timestamp: '1701402600'
        },
        {
          time: '12-01 11:51',
          value: 0,
          type: '成交订单数',
          timestamp: '1701402660'
        },
        {
          time: '12-01 11:52',
          value: 0,
          type: '成交订单数',
          timestamp: '1701402720'
        },
        {
          time: '12-01 11:53',
          value: 0,
          type: '成交订单数',
          timestamp: '1701402780'
        },
        {
          time: '12-01 11:54',
          value: 1,
          type: '成交订单数',
          timestamp: '1701402840'
        },
        {
          time: '12-01 11:55',
          value: 0,
          type: '成交订单数',
          timestamp: '1701402900'
        },
        {
          time: '12-01 11:56',
          value: 2,
          type: '成交订单数',
          timestamp: '1701402960'
        },
        {
          time: '12-01 11:57',
          value: 1,
          type: '成交订单数',
          timestamp: '1701403020'
        },
        {
          time: '12-01 11:58',
          value: 1,
          type: '成交订单数',
          timestamp: '1701403080'
        },
        {
          time: '12-01 11:59',
          value: 0,
          type: '成交订单数',
          timestamp: '1701403140'
        },
        {
          time: '12-01 12:00',
          value: 2,
          type: '成交订单数',
          timestamp: '1701403200'
        },
        {
          time: '12-01 12:01',
          value: 0,
          type: '成交订单数',
          timestamp: '1701403260'
        },
        {
          time: '12-01 12:02',
          value: 1,
          type: '成交订单数',
          timestamp: '1701403320'
        },
        {
          time: '12-01 12:03',
          value: 0,
          type: '成交订单数',
          timestamp: '1701403380'
        },
        {
          time: '12-01 12:04',
          value: 1,
          type: '成交订单数',
          timestamp: '1701403440'
        },
        {
          time: '12-01 12:05',
          value: 1,
          type: '成交订单数',
          timestamp: '1701403500'
        },
        {
          time: '12-01 12:06',
          value: 0,
          type: '成交订单数',
          timestamp: '1701403560'
        },
        {
          time: '12-01 12:07',
          value: 2,
          type: '成交订单数',
          timestamp: '1701403620'
        },
        {
          time: '12-01 12:08',
          value: 1,
          type: '成交订单数',
          timestamp: '1701403680'
        }
      ]
    },
    {
      id: 'scatterData',
      values: [
        {
          type: '商品'
        },
        {
          type: '营销'
        },
        {
          type: '违规'
        }
      ],
      fields: {
        type: {
          domain: ['违规', '营销', '商品'],
          lockStatisticsByDomain: true
        }
      }
    }
  ],
  scales: [
    {
      id: 'scatterColor',
      type: 'ordinal',
      range: ['#EB4747', 'rgba(88, 195, 218, 1)', 'rgba(34, 118, 252, 1)'],
      domain: [
        {
          dataId: 'scatterData',
          fields: ['type']
        }
      ]
    }
  ],
  animationUpdate: false,
  animation: false
};

const run = () => {
  // VChart.ThemeManager.setCurrentTheme('dark');
  const cs = new VChart(spec, {
    dom: document.getElementById('chart') as HTMLElement
    // mode: isMobile ? 'mobile-browser' : 'desktop-browser',
    // theme: 'dark'
  });
  console.time('renderTime');

  cs.renderAsync().then(() => {
    console.timeEnd('renderTime');
  });

  window['vchart'] = cs;
  console.log(cs);
};
run();
