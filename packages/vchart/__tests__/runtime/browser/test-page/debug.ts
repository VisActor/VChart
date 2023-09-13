import { default as VChart } from '../../../../src/index';
const CONTAINER_ID = 'chart';

const run = () => {
  const spec = {
    type: 'common',
    data: [
      {
        id: 'Advertising ARPU',
        values: [
          {
            x: '3/27',
            y: 0.027862545270892002,
            type: 'Advertising ARPU'
          },
          {
            x: '3/28',
            y: 0.028064379287963,
            type: 'Advertising ARPU'
          },
          {
            x: '3/29',
            y: 0.027026199779132003,
            type: 'Advertising ARPU'
          },
          {
            x: '3/30',
            y: 0.027765674884026002,
            type: 'Advertising ARPU'
          },
          {
            x: '3/31',
            y: 0.030678377288905004,
            type: 'Advertising ARPU'
          },
          {
            x: '4/1',
            y: 0.023206229478278002,
            type: 'Advertising ARPU'
          },
          {
            x: '4/2',
            y: 0.026039509720724004,
            type: 'Advertising ARPU'
          },
          {
            x: '4/3',
            y: 0.023915641494481003,
            type: 'Advertising ARPU'
          },
          {
            x: '4/4',
            y: 0.025157983417784004,
            type: 'Advertising ARPU'
          },
          {
            x: '4/5',
            y: 0.023101918189636,
            type: 'Advertising ARPU'
          },
          {
            x: '4/6',
            y: 0.023883528547947,
            type: 'Advertising ARPU'
          },
          {
            x: '4/7',
            y: 0.025423907166644003,
            type: 'Advertising ARPU'
          },
          {
            x: '4/8',
            y: 0.025729593456995003,
            type: 'Advertising ARPU'
          },
          {
            x: '4/9',
            y: 0.025890733257937,
            type: 'Advertising ARPU'
          },
          {
            x: '4/10',
            y: 0.026339624953123003,
            type: 'Advertising ARPU'
          },
          {
            x: '4/11',
            y: 0.025039625766595002,
            type: 'Advertising ARPU'
          },
          {
            x: '4/12',
            y: 0.024784454813776002,
            type: 'Advertising ARPU'
          },
          {
            x: '4/13',
            y: 0.024961614480549003,
            type: 'Advertising ARPU'
          },
          {
            x: '4/14',
            y: 0.027819699148553003,
            type: 'Advertising ARPU'
          },
          {
            x: '4/15',
            y: 0.027040901827452002,
            type: 'Advertising ARPU'
          },
          {
            x: '4/16',
            y: 0.028139113531741002,
            type: 'Advertising ARPU'
          },
          {
            x: '4/17',
            y: 0.025548871946720002,
            type: 'Advertising ARPU'
          },
          {
            x: '4/18',
            y: 0.027027341810209,
            type: 'Advertising ARPU'
          },
          {
            x: '4/19',
            y: 0.025596927531222002,
            type: 'Advertising ARPU'
          },
          {
            x: '4/20',
            y: 0.026758756854421,
            type: 'Advertising ARPU'
          },
          {
            x: '4/21',
            y: 0.028994268975992003,
            type: 'Advertising ARPU'
          },
          {
            x: '4/22',
            y: 0.027266225478156002,
            type: 'Advertising ARPU'
          },
          {
            x: '4/23',
            y: 0.027027715344387002,
            type: 'Advertising ARPU'
          },
          {
            x: '4/24',
            y: 0.027007602883959002,
            type: 'Advertising ARPU'
          },
          {
            x: '4/25',
            y: 0.026503331206731002,
            type: 'Advertising ARPU'
          },
          {
            x: '4/26',
            y: 0.026997696826809,
            type: 'Advertising ARPU'
          },
          {
            x: '4/27',
            y: 0.027665347551350004,
            type: 'Advertising ARPU'
          },
          {
            x: '4/28',
            y: 0.026678217809073004,
            type: 'Advertising ARPU'
          },
          {
            x: '4/29',
            y: 0.031260483181624,
            type: 'Advertising ARPU'
          },
          {
            x: '4/30',
            y: 0.028951215686719003,
            type: 'Advertising ARPU'
          },
          {
            x: '5/1',
            y: 0.023535393024095002,
            type: 'Advertising ARPU'
          },
          {
            x: '5/2',
            y: 0.023246474703278,
            type: 'Advertising ARPU'
          },
          {
            x: '5/3',
            y: 0.024220269139394002,
            type: 'Advertising ARPU'
          },
          {
            x: '5/4',
            y: 0.024251630453972002,
            type: 'Advertising ARPU'
          },
          {
            x: '5/5',
            y: 0.024443896137414003,
            type: 'Advertising ARPU'
          },
          {
            x: '5/6',
            y: 0.024545701485152,
            type: 'Advertising ARPU'
          },
          {
            x: '5/7',
            y: 0.024863471930543002,
            type: 'Advertising ARPU'
          },
          {
            x: '5/8',
            y: 0.023032867685532,
            type: 'Advertising ARPU'
          },
          {
            x: '5/9',
            y: 0.022683983761493002,
            type: 'Advertising ARPU'
          },
          {
            x: '5/10',
            y: 0.024697982126248002,
            type: 'Advertising ARPU'
          },
          {
            x: '5/11',
            y: 0.025710264927554002,
            type: 'Advertising ARPU'
          },
          {
            x: '5/12',
            y: 0.02459906203092,
            type: 'Advertising ARPU'
          },
          {
            x: '5/13',
            y: 0.026144439047241,
            type: 'Advertising ARPU'
          },
          {
            x: '5/14',
            y: 0.024288451266009002,
            type: 'Advertising ARPU'
          },
          {
            x: '5/15',
            y: 0.023958380188720003,
            type: 'Advertising ARPU'
          },
          {
            x: '5/16',
            y: 0.024336559538058,
            type: 'Advertising ARPU'
          },
          {
            x: '5/17',
            y: 0.024427726801339002,
            type: 'Advertising ARPU'
          },
          {
            x: '5/18',
            y: 0.025819377551921003,
            type: 'Advertising ARPU'
          },
          {
            x: '5/19',
            y: 0.028559528885352,
            type: 'Advertising ARPU'
          },
          {
            x: '5/20',
            y: 0.028815678787770003,
            type: 'Advertising ARPU'
          },
          {
            x: '5/21',
            y: 0.027133163139946,
            type: 'Advertising ARPU'
          },
          {
            x: '5/22',
            y: 0.025294561671783,
            type: 'Advertising ARPU'
          },
          {
            x: '5/23',
            y: 0.025960980586516,
            type: 'Advertising ARPU'
          },
          {
            x: '5/24',
            y: 0.025061238091167,
            type: 'Advertising ARPU'
          },
          {
            x: '5/25',
            y: 0.02482186862865,
            type: 'Advertising ARPU'
          },
          {
            x: '5/26',
            y: 0.02512645910326,
            type: 'Advertising ARPU'
          },
          {
            x: '5/27',
            y: 0.026622117341273004,
            type: 'Advertising ARPU'
          },
          {
            x: '5/28',
            y: 0.02803642822756,
            type: 'Advertising ARPU'
          },
          {
            x: '5/29',
            y: 0.026177752357583003,
            type: 'Advertising ARPU'
          },
          {
            x: '5/30',
            y: 0.025591729640308,
            type: 'Advertising ARPU'
          },
          {
            x: '5/31',
            y: 0.025957842746929003,
            type: 'Advertising ARPU'
          },
          {
            x: '6/1',
            y: 0.025739214086450003,
            type: 'Advertising ARPU'
          },
          {
            x: '6/2',
            y: 0.026984296418884002,
            type: 'Advertising ARPU'
          },
          {
            x: '6/3',
            y: 0.028698476107861002,
            type: 'Advertising ARPU'
          },
          {
            x: '6/4',
            y: 0.027631368180626004,
            type: 'Advertising ARPU'
          },
          {
            x: '6/5',
            y: 0.02568610697256,
            type: 'Advertising ARPU'
          },
          {
            x: '6/6',
            y: 0.028165621961605002,
            type: 'Advertising ARPU'
          },
          {
            x: '6/7',
            y: 0.027606428890466002,
            type: 'Advertising ARPU'
          },
          {
            x: '6/8',
            y: 0.028841298898081003,
            type: 'Advertising ARPU'
          },
          {
            x: '6/9',
            y: 0.02840741846095,
            type: 'Advertising ARPU'
          },
          {
            x: '6/10',
            y: 0.028690751979102,
            type: 'Advertising ARPU'
          },
          {
            x: '6/11',
            y: 0.027445471412842003,
            type: 'Advertising ARPU'
          },
          {
            x: '6/12',
            y: 0.026917876081968002,
            type: 'Advertising ARPU'
          },
          {
            x: '6/13',
            y: 0.027262336929042,
            type: 'Advertising ARPU'
          },
          {
            x: '6/14',
            y: 0.027864228703598,
            type: 'Advertising ARPU'
          },
          {
            x: '6/15',
            y: 0.028835439945005002,
            type: 'Advertising ARPU'
          },
          {
            x: '6/16',
            y: 0.029179272429471003,
            type: 'Advertising ARPU'
          },
          {
            x: '6/17',
            y: 0.029837884761937,
            type: 'Advertising ARPU'
          },
          {
            x: '6/18',
            y: 0.028953120496054002,
            type: 'Advertising ARPU'
          },
          {
            x: '6/19',
            y: 0.02857902266102,
            type: 'Advertising ARPU'
          },
          {
            x: '6/20',
            y: 0.028115881719874003,
            type: 'Advertising ARPU'
          },
          {
            x: '6/21',
            y: 0.028285813710951003,
            type: 'Advertising ARPU'
          },
          {
            x: '6/22',
            y: 0.031969643090107004,
            type: 'Advertising ARPU'
          },
          {
            x: '6/23',
            y: 0.031452854770428,
            type: 'Advertising ARPU'
          },
          {
            x: '6/24',
            y: 0.032156206292907004,
            type: 'Advertising ARPU'
          },
          {
            x: '6/25',
            y: 0.030529215370178,
            type: 'Advertising ARPU'
          },
          {
            x: '6/26',
            y: 0.030434469915988003,
            type: 'Advertising ARPU'
          },
          {
            x: '6/27',
            y: 0.028914039903356004,
            type: 'Advertising ARPU'
          },
          {
            x: '6/28',
            y: 0.031887081775944,
            type: 'Advertising ARPU'
          },
          {
            x: '6/29',
            y: 0.032902323811204004,
            type: 'Advertising ARPU'
          },
          {
            x: '6/30',
            y: 0.033589373024697,
            type: 'Advertising ARPU'
          },
          {
            x: '7/1',
            y: 0.024618092581244002,
            type: 'Advertising ARPU'
          },
          {
            x: '7/2',
            y: 0.025769655249905002,
            type: 'Advertising ARPU'
          },
          {
            x: '7/3',
            y: 0.024264110361633003,
            type: 'Advertising ARPU'
          },
          {
            x: '7/4',
            y: 0.023812135332181003,
            type: 'Advertising ARPU'
          },
          {
            x: '7/5',
            y: 0.024781068890585,
            type: 'Advertising ARPU'
          },
          {
            x: '7/6',
            y: 0.025937964799844,
            type: 'Advertising ARPU'
          },
          {
            x: '7/7',
            y: 0.025993850621287003,
            type: 'Advertising ARPU'
          },
          {
            x: '7/8',
            y: 0.025781714791277003,
            type: 'Advertising ARPU'
          },
          {
            x: '7/9',
            y: 0.024503516440365,
            type: 'Advertising ARPU'
          },
          {
            x: '7/10',
            y: 0.024097685258881,
            type: 'Advertising ARPU'
          },
          {
            x: '7/11',
            y: 0.025966558944371002,
            type: 'Advertising ARPU'
          },
          {
            x: '7/12',
            y: 0.027955063128725,
            type: 'Advertising ARPU'
          },
          {
            x: '7/13',
            y: 0.027718534807768,
            type: 'Advertising ARPU'
          },
          {
            x: '7/14',
            y: 0.024916827105227003,
            type: 'Advertising ARPU'
          },
          {
            x: '7/15',
            y: 0.026341428706126,
            type: 'Advertising ARPU'
          },
          {
            x: '7/16',
            y: 0.026075362227378003,
            type: 'Advertising ARPU'
          },
          {
            x: '7/17',
            y: 0.025248492561266003,
            type: 'Advertising ARPU'
          },
          {
            x: '7/18',
            y: 0.025970988116105,
            type: 'Advertising ARPU'
          },
          {
            x: '7/19',
            y: 0.025658005043709003,
            type: 'Advertising ARPU'
          },
          {
            x: '7/20',
            y: 0.0247373813737,
            type: 'Advertising ARPU'
          },
          {
            x: '7/21',
            y: 0.025202897188986002,
            type: 'Advertising ARPU'
          },
          {
            x: '7/22',
            y: 0.026764505146605003,
            type: 'Advertising ARPU'
          },
          {
            x: '7/23',
            y: 0.025683298922668,
            type: 'Advertising ARPU'
          },
          {
            x: '7/24',
            y: 0.025380378524294003,
            type: 'Advertising ARPU'
          }
        ]
      }
    ],
    series: [
      {
        type: 'line',
        dataId: 'Advertising ARPU',
        xField: 'x',
        yField: 'y',
        seriesField: 'type',
        label: {
          style: {
            visible: false
          }
        },
        invalidType: 'break',
        point: {
          visible: false
        }
      }
    ],
    axes: [
      {
        orient: 'left',
        range: {
          min: 0.022683983761493002,
          max: 0.033589373024697
        },
        expand: {
          max: 0.2
        },
        label: {},
        title: {
          visible: true,
          text: '数值',
          space: 10,
          autoRotate: false,
          style: {
            angle: -90,
            textBaseline: 'bottom'
          }
        },
        grid: {
          style: (value, index, datum) => {
            if (index === 0) {
              return {
                stroke: 'red'
              };
            }

            if (index === 3) {
              return {
                stroke: 'green'
              };
            }

            if (value > 0.03) {
              return {
                stroke: 'pink',
                lineWidth: 4
              };
            }
          }
        }
      },
      {
        orient: 'bottom',
        label: {
          visible: true
        },
        tick: {
          visible: false
        }
      }
    ]
  };

  const vchart = new VChart(spec, { dom: CONTAINER_ID });
  vchart.renderAsync();

  // Just for the convenience of console debugging, DO NOT COPY!
  window['vchart'] = vchart;
};
run();
