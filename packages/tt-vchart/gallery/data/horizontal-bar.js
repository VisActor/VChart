export default {
  type: 'common',
  data: [
    {
      id: 'id0',
      values: [{"x":"0","y":"581","y2":"0","type":"A","color":"A"},{"x":"0","y":"512","y2":"0","type":"B","color":"B"},{"x":"0","y":"-489","y2":"0","type":"A","color":"C"},{"x":"0","y":"-320","y2":"0","type":"B","color":"D"},{"x":"1","y":"483","y2":"0","type":"A","color":"A"},{"x":"1","y":"402","y2":"0","type":"B","color":"B"},{"x":"1","y":"-440","y2":"0","type":"A","color":"C"},{"x":"1","y":"-513","y2":"0","type":"B","color":"D"},{"x":"2","y":"422","y2":"0","type":"A","color":"A"},{"x":"2","y":"511","y2":"0","type":"B","color":"B"},{"x":"2","y":"-559","y2":"0","type":"A","color":"C"},{"x":"2","y":"-369","y2":"0","type":"B","color":"D"},{"x":"3","y":"376","y2":"0","type":"A","color":"A"},{"x":"3","y":"317","y2":"0","type":"B","color":"B"},{"x":"3","y":"-583","y2":"0","type":"A","color":"C"},{"x":"3","y":"-475","y2":"0","type":"B","color":"D"},{"x":"4","y":"336","y2":"0","type":"A","color":"A"},{"x":"4","y":"379","y2":"0","type":"B","color":"B"},{"x":"4","y":"-312","y2":"0","type":"A","color":"C"},{"x":"4","y":"-336","y2":"0","type":"B","color":"D"},{"x":"5","y":"564","y2":"0","type":"A","color":"A"},{"x":"5","y":"468","y2":"0","type":"B","color":"B"},{"x":"5","y":"-455","y2":"0","type":"A","color":"C"},{"x":"5","y":"-506","y2":"0","type":"B","color":"D"},{"x":"6","y":"522","y2":"0","type":"A","color":"A"},{"x":"6","y":"328","y2":"0","type":"B","color":"B"},{"x":"6","y":"-379","y2":"0","type":"A","color":"C"},{"x":"6","y":"-400","y2":"0","type":"B","color":"D"},{"x":"7","y":"568","y2":"0","type":"A","color":"A"},{"x":"7","y":"594","y2":"0","type":"B","color":"B"},{"x":"7","y":"-366","y2":"0","type":"A","color":"C"},{"x":"7","y":"-306","y2":"0","type":"B","color":"D"},{"x":"8","y":"549","y2":"0","type":"A","color":"A"},{"x":"8","y":"525","y2":"0","type":"B","color":"B"},{"x":"8","y":"-425","y2":"0","type":"A","color":"C"},{"x":"8","y":"-339","y2":"0","type":"B","color":"D"},{"x":"9","y":"400","y2":"0","type":"A","color":"A"},{"x":"9","y":"371","y2":"0","type":"B","color":"B"},{"x":"9","y":"-541","y2":"0","type":"A","color":"C"},{"x":"9","y":"-546","y2":"0","type":"B","color":"D"}]
    },
    {
      id: 'id1',
      values: [{"x":"0","y":"421","y2":"0","stack":"a","type":"A","color":"C"},{"x":"0","y":"561","y2":"0","stack":"a","type":"B","color":"D"},{"x":"1","y":"446","y2":"0","stack":"a","type":"A","color":"C"},{"x":"1","y":"557","y2":"0","stack":"a","type":"B","color":"D"},{"x":"2","y":"344","y2":"0","stack":"a","type":"A","color":"C"},{"x":"2","y":"577","y2":"0","stack":"a","type":"B","color":"D"},{"x":"3","y":"572","y2":"0","stack":"a","type":"A","color":"C"},{"x":"3","y":"433","y2":"0","stack":"a","type":"B","color":"D"},{"x":"4","y":"536","y2":"0","stack":"a","type":"A","color":"C"},{"x":"4","y":"300","y2":"0","stack":"a","type":"B","color":"D"},{"x":"5","y":"307","y2":"0","stack":"a","type":"A","color":"C"},{"x":"5","y":"515","y2":"0","stack":"a","type":"B","color":"D"},{"x":"6","y":"586","y2":"0","stack":"a","type":"A","color":"C"},{"x":"6","y":"578","y2":"0","stack":"a","type":"B","color":"D"},{"x":"7","y":"367","y2":"0","stack":"a","type":"A","color":"C"},{"x":"7","y":"423","y2":"0","stack":"a","type":"B","color":"D"},{"x":"8","y":"532","y2":"0","stack":"a","type":"A","color":"C"},{"x":"8","y":"591","y2":"0","stack":"a","type":"B","color":"D"},{"x":"9","y":"409","y2":"0","stack":"a","type":"A","color":"C"},{"x":"9","y":"597","y2":"0","stack":"a","type":"B","color":"D"}]
    }
  ],
  series: [
    {
      type: 'bar',
      dataId: 'id0',
      direction: 'horizontal',
      xField: 'y',
      yField: ['x', 'type'],
      seriesField: 'color',
      stateDef: {
        state1: {
          filter: (datum, options) => {
            return datum.y > 500;
          }
        }
      },
      label: {
        style: {
          fill: 'red',
          position: 'outside'
        }
      },
      bar: {
        style: {
          stroke: 'orange',
          strokeWidth: 2
        },
        state: {
          state1: {
            fill: 'black'
          }
        }
      }
    }
  ],
  axes: [
    { orient: 'left', type: 'band' },
    { orient: 'bottom', label: { visible: true }, type: 'linear' }
  ]
};
