import { registerMapLabel } from './../../../../../src/components/map-label/map-label';
import { default as VChart } from '@visactor/vchart';

// register3DPlugin();
registerMapLabel({ VChart });
const run = async () => {
  // 图表配置
  const spec = {
    type: 'common',
    padding: 0,
    region: [
      {
        roam: true,
        coordinate: 'geo',
        longitudeField: 'lon',
        latitudeField: 'lat'
      }
    ],
    mapLabel: {
      visible: true,
      position: 'outer',
      seriesId: 'scatter',
      nameField: 'name',
      valueField: 'value',
      leader: {
        visible: true,
        style: {
          stroke: 'blue'
        }
      },
      icon: {
        visible: true,
        style: {
          size: 14,
          lineWidth: 1,
          fill: 'red',
          shape:
            // eslint-disable-next-line max-len
            'M-.4431-.4293h.2844l.1138.1138h.512v.6258H-.4431V-.4293zm.0569.6827h.7964V-.2587H-.0676l-.1138-.1138H-.3862v.6258z'
        }
      },
      background: {
        style: {
          shadowColor: 'red',
          shadowBlur: 5
        }
      }
    },
    series: [
      {
        type: 'map',
        map: 'china',
        nameField: 'name',
        valueField: 'value',
        seriesField: 'name',
        nameMap: {
          广东省: '广东',
          江苏省: '江苏',
          山东省: '山东',
          河南省: '河南',
          河北省: '河北',
          浙江省: '浙江',
          四川省: '四川',
          安徽省: '安徽',
          辽宁省: '辽宁',
          陕西省: '陕西',
          山西省: '山西',
          湖北省: '湖北',
          北京市: '北京',
          湖南省: '湖南',
          黑龙江省: '黑龙江',
          福建省: '福建',
          内蒙古自治区: '内蒙古',
          云南省: '云南',
          江西省: '江西',
          重庆市: '重庆',
          上海市: '上海',
          贵州省: '贵州',
          吉林省: '吉林',
          天津市: '天津',
          广西壮族自治区: '广西',
          甘肃省: '甘肃',
          新疆维吾尔自治区: '新疆',
          宁夏回族自治区: '宁夏',
          海南省: '海南',
          青海省: '青海',
          西藏自治区: '西藏',
          香港特别行政区: '中国香港',
          台湾省: '中国台湾',
          澳门特别行政区: '澳门'
        },
        area: {
          style: {
            fill: '#E9F2FF',
            stroke: 'grey',
            lineWidth: 1
          }
        }
      },
      {
        regionIndex: 0,
        id: 'scatter',
        type: 'scatter',
        data: {
          values: [
            {
              name: '乌鲁木齐',
              value: '2197',
              lat: '43.50',
              lon: '87.37'
            },
            {
              name: '济南',
              value: '2197',
              lat: '36.606472',
              lon: '117.164382'
            },
            {
              name: '江苏',
              value: '21197',
              lat: '32.983908',
              lon: '119.486395'
            },
            {
              name: '成都',
              value: '21197',
              lat: '30.659462',
              lon: '104.065735'
            }
          ]
        },
        xField: 'name',
        yField: 'value',
        point: {
          style: {
            fill: 'blue',
            fillOpacity: 1,
            size: 10
          }
        }
      }
    ],
    tooltip: {
      transitionDuration: 0
    }
  };

  const chinaMapUrl_topojson = 'https://tosv.byted.org/obj/gis/topojson/china.json';

  const chinaRes_topojson = await fetch(chinaMapUrl_topojson);
  const china_topojson = await chinaRes_topojson.json();

  VChart.registerMap('china', china_topojson, {
    type: 'topojson',
    object: 'china',
    simplify: true
  });

  const cs = new VChart(spec, {
    dom: document.getElementById('chart') as HTMLElement
  });
  console.time('renderTime');
  cs.renderSync();
  console.timeEnd('renderTime');
  window['vchart'] = cs;
  console.log(cs);
  cs.on('click', event => {
    console.log(event);
  });
};
run();
