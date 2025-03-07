import { registerSequenceScatter } from '../../../../src';
import { VChart } from '@visactor/vchart';
import trainingData1 from '../data/sequence-scatter/Training_process1/data.json';
import trainingInfo1 from '../data/sequence-scatter/Training_process1/info.json';
import trainingData2 from '../data/sequence-scatter/Training_process2/data.json';
import trainingInfo2 from '../data/sequence-scatter/Training_process2/info.json';
// eslint-disable-next-line @typescript-eslint/no-unused-vars

/*
  read original data from json files, and convert it to data for sequence-scatter
*/

let TRAINING_PROCESS_ID = 1;  // 1 for code search process, 2 for image classification process

let original_data, training_info, task_type, scope;
if(TRAINING_PROCESS_ID === 1){
  original_data = trainingData1;
  training_info = trainingInfo1;
  task_type = 'neighborhood';
  scope = [-9, -9, 6, 6];
}
else{
  original_data = trainingData2;
  training_info = trainingInfo2;
  task_type = 'classification';
  scope = [-8, -8, 8, 8];
}

const label_index = training_info['label_index'];
const label_text = training_info['label_text'];
const label_color_list = training_info['label_color'];
const label_color_dict = {};
for (let i = 0; i < label_color_list.length; i++) {
  let c = label_color_list[i];
  label_color_dict[label_text[i]] = `rgb(${c[0]},${c[1]},${c[2]})`;
}

/*
  create data for sequence-scatter
*/
const chartData = {};
Object.keys(original_data).forEach(epoch => {
  chartData[epoch] = {
    nodes:[],
    edges:[]
  };

  // fill in nodes
  original_data[epoch].projection.forEach((pos, id) => {
    let conf = 1;
    let pred = label_text[label_index[id]];
    if(task_type === 'classification'){
      conf = original_data[epoch].confidence[id];
      pred = label_text[original_data[epoch].prediction[id]];
    }

    chartData[epoch].nodes.push({
      index: id,
      x: pos[0],
      y: pos[1],
      label: label_text[label_index[id]],
      prediction: pred,
      confidence: conf,
    });
  });

  // fill in edges
  let intra_similarity, inter_similarity;
  if(task_type === 'neighborhood'){
    intra_similarity = original_data[epoch].intra_similarity;
    inter_similarity = original_data[epoch].inter_similarity;
    
    let edgeId = 0;
    
    original_data[epoch].projection.forEach((pos, id) => {
      intra_similarity[id].forEach(neighbor => {
        chartData[epoch].edges.push({
          index: edgeId,
          x0: pos[0],
          y0: pos[1],
          x1: original_data[epoch].projection[neighbor][0],
          y1: original_data[epoch].projection[neighbor][1],
          type:0,
          color: label_color_dict[label_text[label_index[id]]]
        });
        edgeId++;
      })
      inter_similarity[id].forEach(neighbor => {
        chartData[epoch].edges.push({
          index: edgeId++,
          x0: pos[0],
          y0: pos[1],
          x1: original_data[epoch].projection[neighbor][0],
          y1: original_data[epoch].projection[neighbor][1],
          type:1,
          color: label_color_dict[label_text[label_index[neighbor]]]
        });
        edgeId++;
      })
    });
  }
});

/*
  create spec for sequence-scatter
*/
const spec = {
  type: 'sequenceScatter',
  taskType: task_type,
  labelColor: label_color_dict,
  scope: scope,
  data: chartData,
  xField: 'x',
  yField: 'y',
  
  infoLabel: {
    visible: true,
    style: {
      text: datum => {
        return 'iteration: ' + datum.iter;
      }
    }
  },
  player: {
    orient: 'bottom',
    auto: true,
    interval: 2000,
    duration: 2000
  }
};

const run = () => {
  registerSequenceScatter();
  const cs = new VChart(spec, {
    dom: document.getElementById('chart') as HTMLElement,
    //theme: 'dark',
    onError: err => {
      console.error(err);
    }
  });

  // register events
  cs.on('pointerover', { id: 'scatter-series' }, (e: { datum: { x: number; y:number }; }) => {
      const pointX = e.datum?.x;
      const pointY = e.datum?.y;
      const endpoints = transformEdges(spec.data, pointX, pointY);
      cs.updateDataSync('edges', endpoints);
  });
  cs.on('pointerout', { id: 'scatter-series' }, e => {
      cs.updateDataSync('edges', []);  
  });

  console.time('renderTime');

  cs.renderSync();

  console.timeEnd('renderTime');
  window['vchart'] = cs;
  console.log(cs);
};
run();


/*
  Helper functions for preprocessing original data
*/
function transformEdges(specData, pointX, pointY) {
  const endpoints: any[] = [];
  Object.keys(specData).forEach(iter => {
    const edges = specData[iter].edges;
    edges.forEach(edge => {
      if(pointX === edge.x0 && pointY === edge.y0){
        endpoints.push({x: edge.x0, y: edge.y0, type: edge.type, index: edge.index, color: edge.color});
        endpoints.push({x: edge.x1, y: edge.y1, type: edge.type, index: edge.index, color: edge.color});
      }
    })
  })
  return endpoints;
}