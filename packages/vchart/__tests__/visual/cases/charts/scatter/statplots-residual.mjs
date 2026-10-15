import { verifySpec, verifyRendered, graphicCenter } from '../../../helpers.mjs';

/**
 * 验证目的：原始 x 残差与趋势的共同筛选及零线。
 * 图表类型：common。
 * 关键配置：seriesField=series、共享 legend.seriesId、linear 数值轴。
 * 场景条件：来自原始分组示例的已审阅原生 spec；不依赖未发布的 StatPlots 包。
 * 最终检查：真实点击图例，所有实际系列仅保留模型 B，图元共用同一颜色。
 * 覆盖边界：统计数值由 StatPlots/Python 单测验证，此例只覆盖原生显示与交互。
 */
export default {
  createSpec() {
    return {
      type: 'common',
      theme: 'light',
      color: [
        '#0173B2',
        '#DE8F05',
        '#029E73',
        '#D55E00',
        '#CC78BC',
        '#CA9161',
        '#FBAFE4',
        '#949494',
        '#ECE133',
        '#56B4E9'
      ],
      padding: 16,
      title: {
        visible: true,
        text: '原始残差：趋势同步筛选',
        subtext: '',
        padding: {
          bottom: 16
        }
      },
      axes: [
        {
          orient: 'bottom',
          type: 'linear',
          zero: false,
          nice: true,
          title: {
            visible: true,
            text: 'x'
          },
          grid: {
            visible: false
          },
          label: {
            flush: true
          }
        },
        {
          orient: 'left',
          type: 'linear',
          zero: false,
          nice: true,
          title: {
            visible: true,
            text: '原始残差'
          },
          grid: {
            visible: true
          },
          label: {
            flush: true
          }
        }
      ],
      series: [
        {
          type: 'scatter',
          id: 'residuals',
          data: {
            id: 'residuals',
            values: [
              {
                id: '0',
                x: 0,
                y: 1,
                series: '模型 A',
                fittedValue: 1.0337033750614375,
                residual: -0.0337033750614375,
                method: '线性回归',
                residualKind: '原始残差',
                trend: 'LOWESS · span=0.5 · iterations=3 · delta=0'
              },
              {
                id: '1',
                x: 0.3333333333333333,
                y: 1.7291657385595678,
                series: '模型 A',
                fittedValue: 1.2649295705375954,
                residual: 0.46423616802197243,
                method: '线性回归',
                residualKind: '原始残差',
                trend: 'LOWESS · span=0.5 · iterations=3 · delta=0'
              },
              {
                id: '2',
                x: 0.6666666666666666,
                y: 1.338896115653251,
                series: '模型 A',
                fittedValue: 1.4961557660137526,
                residual: -0.1572596503605015,
                method: '线性回归',
                residualKind: '原始残差',
                trend: 'LOWESS · span=0.5 · iterations=3 · delta=0'
              },
              {
                id: '3',
                x: 1,
                y: 1.2370926588361335,
                series: '模型 A',
                fittedValue: 1.7273819614899102,
                residual: -0.4902893026537767,
                method: '线性回归',
                residualKind: '原始残差',
                trend: 'LOWESS · span=0.5 · iterations=3 · delta=0'
              },
              {
                id: '4',
                x: 1.3333333333333333,
                y: 2.1803900089026373,
                series: '模型 A',
                fittedValue: 1.9586081569660678,
                residual: 0.22178185193656952,
                method: '线性回归',
                residualKind: '原始残差',
                trend: 'LOWESS · span=0.5 · iterations=3 · delta=0'
              },
              {
                id: '5',
                x: 1.6666666666666667,
                y: 2.5659102229784123,
                series: '模型 A',
                fittedValue: 2.189834352442226,
                residual: 0.3760758705361864,
                method: '线性回归',
                residualKind: '原始残差',
                trend: 'LOWESS · span=0.5 · iterations=3 · delta=0'
              },
              {
                id: '6',
                x: 2,
                y: 2.0500626562032283,
                series: '模型 A',
                fittedValue: 2.4210605479183833,
                residual: -0.37099789171515507,
                method: '线性回归',
                residualKind: '原始残差',
                trend: 'LOWESS · span=0.5 · iterations=3 · delta=0'
              },
              {
                id: '7',
                x: 2.3333333333333335,
                y: 2.3242647772148164,
                series: '模型 A',
                fittedValue: 2.6522867433945407,
                residual: -0.32802196617972434,
                method: '线性回归',
                residualKind: '原始残差',
                trend: 'LOWESS · span=0.5 · iterations=3 · delta=0'
              },
              {
                id: '8',
                x: 2.6666666666666665,
                y: 3.296247574094914,
                series: '模型 A',
                fittedValue: 2.883512938870698,
                residual: 0.41273463522421583,
                method: '线性回归',
                residualKind: '原始残差',
                trend: 'LOWESS · span=0.5 · iterations=3 · delta=0'
              },
              {
                id: '9',
                x: 3,
                y: 3.298370286565307,
                series: '模型 A',
                fittedValue: 3.114739134346856,
                residual: 0.18363115221845083,
                method: '线性回归',
                residualKind: '原始残差',
                trend: 'LOWESS · span=0.5 · iterations=3 · delta=0'
              },
              {
                id: '10',
                x: 3.3333333333333335,
                y: 2.8526345873935552,
                series: '模型 A',
                fittedValue: 3.345965329823014,
                residual: -0.4933307424294586,
                method: '线性回归',
                residualKind: '原始残差',
                trend: 'LOWESS · span=0.5 · iterations=3 · delta=0'
              },
              {
                id: '11',
                x: 3.6666666666666665,
                y: 3.492167153759567,
                series: '模型 A',
                fittedValue: 3.5771915252991713,
                residual: -0.08502437153960418,
                method: '线性回归',
                residualKind: '原始残差',
                trend: 'LOWESS · span=0.5 · iterations=3 · delta=0'
              },
              {
                id: '12',
                x: 4,
                y: 4.299896450071334,
                series: '模型 A',
                fittedValue: 3.808417720775329,
                residual: 0.4914787292960052,
                method: '线性回归',
                residualKind: '原始残差',
                trend: 'LOWESS · span=0.5 · iterations=3 · delta=0'
              },
              {
                id: '13',
                x: 4.333333333333333,
                y: 3.979015035621295,
                series: '模型 A',
                fittedValue: 4.039643916251486,
                residual: -0.060628880630190896,
                method: '线性回归',
                residualKind: '原始残差',
                trend: 'LOWESS · span=0.5 · iterations=3 · delta=0'
              },
              {
                id: '14',
                x: 4.666666666666667,
                y: 3.7807674437947343,
                series: '模型 A',
                fittedValue: 4.270870111727644,
                residual: -0.49010266793291013,
                method: '线性回归',
                residualKind: '原始残差',
                trend: 'LOWESS · span=0.5 · iterations=3 · delta=0'
              },
              {
                id: '15',
                x: 5,
                y: 4.6795291770110845,
                series: '模型 A',
                fittedValue: 4.502096307203802,
                residual: 0.17743286980728268,
                method: '线性回归',
                residualKind: '原始残差',
                trend: 'LOWESS · span=0.5 · iterations=3 · delta=0'
              },
              {
                id: '16',
                x: 5.333333333333333,
                y: 5.172969864158695,
                series: '模型 A',
                fittedValue: 4.733322502679959,
                residual: 0.43964736147873573,
                method: '线性回归',
                residualKind: '原始残差',
                trend: 'LOWESS · span=0.5 · iterations=3 · delta=0'
              },
              {
                id: '17',
                x: 5.666666666666667,
                y: 4.673847996679518,
                series: '模型 A',
                fittedValue: 4.964548698156117,
                residual: -0.29070070147659877,
                method: '线性回归',
                residualKind: '原始残差',
                trend: 'LOWESS · span=0.5 · iterations=3 · delta=0'
              },
              {
                id: '18',
                x: 6,
                y: 4.835819616084202,
                series: '模型 A',
                fittedValue: 5.195774893632275,
                residual: -0.35995527754807277,
                method: '线性回归',
                residualKind: '原始残差',
                trend: 'LOWESS · span=0.5 · iterations=3 · delta=0'
              },
              {
                id: '19',
                x: 6.333333333333333,
                y: 5.819997278116443,
                series: '模型 A',
                fittedValue: 5.4270010891084315,
                residual: 0.39299618900801114,
                method: '线性回归',
                residualKind: '原始残差',
                trend: 'LOWESS · span=0.5 · iterations=3 · delta=0'
              },
              {
                id: '0',
                x: 0,
                y: 5,
                series: '模型 B',
                fittedValue: 5.033703375061438,
                residual: -0.033703375061437946,
                method: '线性回归',
                residualKind: '原始残差',
                trend: 'LOWESS · span=0.5 · iterations=3 · delta=0'
              },
              {
                id: '1',
                x: 0.3333333333333333,
                y: 5.379165738559568,
                series: '模型 B',
                fittedValue: 4.914929570537596,
                residual: 0.464236168021972,
                method: '线性回归',
                residualKind: '原始残差',
                trend: 'LOWESS · span=0.5 · iterations=3 · delta=0'
              },
              {
                id: '2',
                x: 0.6666666666666666,
                y: 4.638896115653251,
                series: '模型 B',
                fittedValue: 4.7961557660137535,
                residual: -0.15725965036050216,
                method: '线性回归',
                residualKind: '原始残差',
                trend: 'LOWESS · span=0.5 · iterations=3 · delta=0'
              },
              {
                id: '3',
                x: 1,
                y: 4.187092658836134,
                series: '模型 B',
                fittedValue: 4.677381961489911,
                residual: -0.49028930265377735,
                method: '线性回归',
                residualKind: '原始残差',
                trend: 'LOWESS · span=0.5 · iterations=3 · delta=0'
              },
              {
                id: '4',
                x: 1.3333333333333333,
                y: 4.780390008902637,
                series: '模型 B',
                fittedValue: 4.558608156966068,
                residual: 0.2217818519365693,
                method: '线性回归',
                residualKind: '原始残差',
                trend: 'LOWESS · span=0.5 · iterations=3 · delta=0'
              },
              {
                id: '5',
                x: 1.6666666666666667,
                y: 4.815910222978412,
                series: '模型 B',
                fittedValue: 4.439834352442226,
                residual: 0.3760758705361864,
                method: '线性回归',
                residualKind: '原始残差',
                trend: 'LOWESS · span=0.5 · iterations=3 · delta=0'
              },
              {
                id: '6',
                x: 2,
                y: 3.9500626562032286,
                series: '模型 B',
                fittedValue: 4.321060547918384,
                residual: -0.37099789171515507,
                method: '线性回归',
                residualKind: '原始残差',
                trend: 'LOWESS · span=0.5 · iterations=3 · delta=0'
              },
              {
                id: '7',
                x: 2.3333333333333335,
                y: 3.874264777214817,
                series: '模型 B',
                fittedValue: 4.2022867433945414,
                residual: -0.32802196617972434,
                method: '线性回归',
                residualKind: '原始残差',
                trend: 'LOWESS · span=0.5 · iterations=3 · delta=0'
              },
              {
                id: '8',
                x: 2.6666666666666665,
                y: 4.496247574094914,
                series: '模型 B',
                fittedValue: 4.083512938870698,
                residual: 0.41273463522421583,
                method: '线性回归',
                residualKind: '原始残差',
                trend: 'LOWESS · span=0.5 · iterations=3 · delta=0'
              },
              {
                id: '9',
                x: 3,
                y: 4.148370286565307,
                series: '模型 B',
                fittedValue: 3.964739134346856,
                residual: 0.18363115221845128,
                method: '线性回归',
                residualKind: '原始残差',
                trend: 'LOWESS · span=0.5 · iterations=3 · delta=0'
              },
              {
                id: '10',
                x: 3.3333333333333335,
                y: 3.352634587393555,
                series: '模型 B',
                fittedValue: 3.845965329823014,
                residual: -0.49333074242945907,
                method: '线性回归',
                residualKind: '原始残差',
                trend: 'LOWESS · span=0.5 · iterations=3 · delta=0'
              },
              {
                id: '11',
                x: 3.6666666666666665,
                y: 3.6421671537595675,
                series: '模型 B',
                fittedValue: 3.727191525299171,
                residual: -0.08502437153960374,
                method: '线性回归',
                residualKind: '原始残差',
                trend: 'LOWESS · span=0.5 · iterations=3 · delta=0'
              },
              {
                id: '12',
                x: 4,
                y: 4.099896450071335,
                series: '模型 B',
                fittedValue: 3.608417720775329,
                residual: 0.4914787292960061,
                method: '线性回归',
                residualKind: '原始残差',
                trend: 'LOWESS · span=0.5 · iterations=3 · delta=0'
              },
              {
                id: '13',
                x: 4.333333333333333,
                y: 3.4290150356212954,
                series: '模型 B',
                fittedValue: 3.4896439162514867,
                residual: -0.06062888063019134,
                method: '线性回归',
                residualKind: '原始残差',
                trend: 'LOWESS · span=0.5 · iterations=3 · delta=0'
              },
              {
                id: '14',
                x: 4.666666666666667,
                y: 2.8807674437947357,
                series: '模型 B',
                fittedValue: 3.370870111727644,
                residual: -0.49010266793290835,
                method: '线性回归',
                residualKind: '原始残差',
                trend: 'LOWESS · span=0.5 · iterations=3 · delta=0'
              },
              {
                id: '15',
                x: 5,
                y: 3.429529177011084,
                series: '模型 B',
                fittedValue: 3.252096307203802,
                residual: 0.17743286980728223,
                method: '线性回归',
                residualKind: '原始残差',
                trend: 'LOWESS · span=0.5 · iterations=3 · delta=0'
              },
              {
                id: '16',
                x: 5.333333333333333,
                y: 3.5729698641586958,
                series: '模型 B',
                fittedValue: 3.133322502679959,
                residual: 0.4396473614787366,
                method: '线性回归',
                residualKind: '原始残差',
                trend: 'LOWESS · span=0.5 · iterations=3 · delta=0'
              },
              {
                id: '17',
                x: 5.666666666666667,
                y: 2.7238479966795177,
                series: '模型 B',
                fittedValue: 3.0145486981561165,
                residual: -0.29070070147659877,
                method: '线性回归',
                residualKind: '原始残差',
                trend: 'LOWESS · span=0.5 · iterations=3 · delta=0'
              },
              {
                id: '18',
                x: 6,
                y: 2.535819616084202,
                series: '模型 B',
                fittedValue: 2.8957748936322742,
                residual: -0.3599552775480723,
                method: '线性回归',
                residualKind: '原始残差',
                trend: 'LOWESS · span=0.5 · iterations=3 · delta=0'
              },
              {
                id: '19',
                x: 6.333333333333333,
                y: 3.169997278116444,
                series: '模型 B',
                fittedValue: 2.777001089108432,
                residual: 0.39299618900801203,
                method: '线性回归',
                residualKind: '原始残差',
                trend: 'LOWESS · span=0.5 · iterations=3 · delta=0'
              }
            ]
          },
          xField: 'x',
          yField: 'residual',
          seriesField: 'series',
          size: 7,
          tooltip: {
            visible: false
          },
          animation: false
        },
        {
          type: 'line',
          id: 'residual-trend',
          data: {
            id: 'residual-trend',
            values: [
              {
                x: 0,
                estimate: 0.07350723448744817,
                series: '模型 A',
                method: 'LOWESS · span=0.5 · iterations=3 · delta=0',
                sampleCount: 20
              },
              {
                x: 0.3333333333333333,
                estimate: 0.04836456738651717,
                series: '模型 A',
                method: 'LOWESS · span=0.5 · iterations=3 · delta=0',
                sampleCount: 20
              },
              {
                x: 0.6666666666666666,
                estimate: 0.026917510817823162,
                series: '模型 A',
                method: 'LOWESS · span=0.5 · iterations=3 · delta=0',
                sampleCount: 20
              },
              {
                x: 1,
                estimate: 0.0029060834083618863,
                series: '模型 A',
                method: 'LOWESS · span=0.5 · iterations=3 · delta=0',
                sampleCount: 20
              },
              {
                x: 1.3333333333333333,
                estimate: -0.035195196523417786,
                series: '模型 A',
                method: 'LOWESS · span=0.5 · iterations=3 · delta=0',
                sampleCount: 20
              },
              {
                x: 1.6666666666666667,
                estimate: -0.040718485440789244,
                series: '模型 A',
                method: 'LOWESS · span=0.5 · iterations=3 · delta=0',
                sampleCount: 20
              },
              {
                x: 2,
                estimate: -0.004395635464743974,
                series: '模型 A',
                method: 'LOWESS · span=0.5 · iterations=3 · delta=0',
                sampleCount: 20
              },
              {
                x: 2.3333333333333335,
                estimate: -0.004117045743672929,
                series: '模型 A',
                method: 'LOWESS · span=0.5 · iterations=3 · delta=0',
                sampleCount: 20
              },
              {
                x: 2.6666666666666665,
                estimate: -0.03631511121914016,
                series: '模型 A',
                method: 'LOWESS · span=0.5 · iterations=3 · delta=0',
                sampleCount: 20
              },
              {
                x: 3,
                estimate: -0.024509023923201437,
                series: '模型 A',
                method: 'LOWESS · span=0.5 · iterations=3 · delta=0',
                sampleCount: 20
              },
              {
                x: 3.3333333333333335,
                estimate: 0.008582902382927445,
                series: '模型 A',
                method: 'LOWESS · span=0.5 · iterations=3 · delta=0',
                sampleCount: 20
              },
              {
                x: 3.6666666666666665,
                estimate: -0.00677353355057895,
                series: '模型 A',
                method: 'LOWESS · span=0.5 · iterations=3 · delta=0',
                sampleCount: 20
              },
              {
                x: 4,
                estimate: -0.030152759752450183,
                series: '模型 A',
                method: 'LOWESS · span=0.5 · iterations=3 · delta=0',
                sampleCount: 20
              },
              {
                x: 4.333333333333333,
                estimate: -0.003387494217534569,
                series: '模型 A',
                method: 'LOWESS · span=0.5 · iterations=3 · delta=0',
                sampleCount: 20
              },
              {
                x: 4.666666666666667,
                estimate: 0.01757556283134044,
                series: '模型 A',
                method: 'LOWESS · span=0.5 · iterations=3 · delta=0',
                sampleCount: 20
              },
              {
                x: 5,
                estimate: -0.010174723090525885,
                series: '模型 A',
                method: 'LOWESS · span=0.5 · iterations=3 · delta=0',
                sampleCount: 20
              },
              {
                x: 5.333333333333333,
                estimate: -0.005525455971644938,
                series: '模型 A',
                method: 'LOWESS · span=0.5 · iterations=3 · delta=0',
                sampleCount: 20
              },
              {
                x: 5.666666666666667,
                estimate: 0.015509702973146744,
                series: '模型 A',
                method: 'LOWESS · span=0.5 · iterations=3 · delta=0',
                sampleCount: 20
              },
              {
                x: 6,
                estimate: 0.034703848777382626,
                series: '模型 A',
                method: 'LOWESS · span=0.5 · iterations=3 · delta=0',
                sampleCount: 20
              },
              {
                x: 6.333333333333333,
                estimate: 0.052011486614274606,
                series: '模型 A',
                method: 'LOWESS · span=0.5 · iterations=3 · delta=0',
                sampleCount: 20
              },
              {
                x: 0,
                estimate: 0.07350723448744753,
                series: '模型 B',
                method: 'LOWESS · span=0.5 · iterations=3 · delta=0',
                sampleCount: 20
              },
              {
                x: 0.3333333333333333,
                estimate: 0.04836456738651659,
                series: '模型 B',
                method: 'LOWESS · span=0.5 · iterations=3 · delta=0',
                sampleCount: 20
              },
              {
                x: 0.6666666666666666,
                estimate: 0.02691751081782274,
                series: '模型 B',
                method: 'LOWESS · span=0.5 · iterations=3 · delta=0',
                sampleCount: 20
              },
              {
                x: 1,
                estimate: 0.0029060834083615254,
                series: '模型 B',
                method: 'LOWESS · span=0.5 · iterations=3 · delta=0',
                sampleCount: 20
              },
              {
                x: 1.3333333333333333,
                estimate: -0.03519519652341808,
                series: '模型 B',
                method: 'LOWESS · span=0.5 · iterations=3 · delta=0',
                sampleCount: 20
              },
              {
                x: 1.6666666666666667,
                estimate: -0.04071848544078942,
                series: '模型 B',
                method: 'LOWESS · span=0.5 · iterations=3 · delta=0',
                sampleCount: 20
              },
              {
                x: 2,
                estimate: -0.00439563546474404,
                series: '模型 B',
                method: 'LOWESS · span=0.5 · iterations=3 · delta=0',
                sampleCount: 20
              },
              {
                x: 2.3333333333333335,
                estimate: -0.004117045743672904,
                series: '模型 B',
                method: 'LOWESS · span=0.5 · iterations=3 · delta=0',
                sampleCount: 20
              },
              {
                x: 2.6666666666666665,
                estimate: -0.036315111219140064,
                series: '模型 B',
                method: 'LOWESS · span=0.5 · iterations=3 · delta=0',
                sampleCount: 20
              },
              {
                x: 3,
                estimate: -0.024509023923201274,
                series: '模型 B',
                method: 'LOWESS · span=0.5 · iterations=3 · delta=0',
                sampleCount: 20
              },
              {
                x: 3.3333333333333335,
                estimate: 0.008582902382927665,
                series: '模型 B',
                method: 'LOWESS · span=0.5 · iterations=3 · delta=0',
                sampleCount: 20
              },
              {
                x: 3.6666666666666665,
                estimate: -0.006773533550578681,
                series: '模型 B',
                method: 'LOWESS · span=0.5 · iterations=3 · delta=0',
                sampleCount: 20
              },
              {
                x: 4,
                estimate: -0.030152759752449885,
                series: '模型 B',
                method: 'LOWESS · span=0.5 · iterations=3 · delta=0',
                sampleCount: 20
              },
              {
                x: 4.333333333333333,
                estimate: -0.003387494217534233,
                series: '模型 B',
                method: 'LOWESS · span=0.5 · iterations=3 · delta=0',
                sampleCount: 20
              },
              {
                x: 4.666666666666667,
                estimate: 0.0175755628313408,
                series: '模型 B',
                method: 'LOWESS · span=0.5 · iterations=3 · delta=0',
                sampleCount: 20
              },
              {
                x: 5,
                estimate: -0.010174723090525532,
                series: '模型 B',
                method: 'LOWESS · span=0.5 · iterations=3 · delta=0',
                sampleCount: 20
              },
              {
                x: 5.333333333333333,
                estimate: -0.005525455971644531,
                series: '模型 B',
                method: 'LOWESS · span=0.5 · iterations=3 · delta=0',
                sampleCount: 20
              },
              {
                x: 5.666666666666667,
                estimate: 0.015509702973147233,
                series: '模型 B',
                method: 'LOWESS · span=0.5 · iterations=3 · delta=0',
                sampleCount: 20
              },
              {
                x: 6,
                estimate: 0.034703848777383174,
                series: '模型 B',
                method: 'LOWESS · span=0.5 · iterations=3 · delta=0',
                sampleCount: 20
              },
              {
                x: 6.333333333333333,
                estimate: 0.05201148661427519,
                series: '模型 B',
                method: 'LOWESS · span=0.5 · iterations=3 · delta=0',
                sampleCount: 20
              }
            ]
          },
          xField: 'x',
          yField: 'estimate',
          seriesField: 'series',
          point: {
            visible: false
          },
          line: {
            style: {
              curveType: 'linear',
              lineWidth: 2
            }
          },
          tooltip: {
            visible: false
          },
          animation: false
        }
      ],
      legends: {
        visible: true,
        seriesId: ['residuals', 'residual-trend'],
        orient: 'top'
      },
      markLine: {
        y: 0,
        endSymbol: {
          visible: false
        },
        line: {
          style: {
            lineDash: [4, 4]
          }
        }
      }
    };
  },
  async exercise(page) {
    const target = await graphicCenter(page, 'legendItem');
    await page.mouse.click(target.x, target.y);
    await page.mouse.move(950, 750);
  },
  async verify(page) {
    await verifySpec(page, this.createSpec());
    await page.waitForFunction(() => {
      const chart = window.__visualChart;
      const selected = chart.getLegendSelectedDataByIndex();
      return (
        selected.length === 1 &&
        selected[0] === '模型 B' &&
        chart
          .getChart()
          .getAllSeries()
          .every(s => {
            const rows = s.getViewData().latestData;
            return rows.length > 0 && rows.every(row => row.series === '模型 B');
          })
      );
    });
    await verifyRendered(page);
    await page.evaluate(() => {
      const colors = window.__visualChart
        .getChart()
        .getAllSeries()
        .map(s => {
          const g = s.getSeriesMark().getGraphics()[0];
          return s.type === 'line' ? g.attribute.stroke : g.attribute.fill;
        });
      if (new Set(colors).size !== 1 || !colors[0]) throw new Error('点、曲线或带的系列颜色不一致');
    });
  }
};
