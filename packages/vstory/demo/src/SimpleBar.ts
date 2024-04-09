import { Bar } from '../../src/template/charts/simple-chart';
import { Scene } from '../../src/scene';
import { highlight } from '../../src/animate/highlight';
import { Title, textWriter } from '../../src/component/title';

import { RankingBar } from '../../src/template/ranking-bar/ranking-bar';
import { yearsData, countryImage } from '../data/ranking-bar';

const allData: any[] = [];
yearsData.forEach(value => {
  allData.push(...value);
});

const scene = new Scene({
  dom: 'root'
});

const bar = new Bar({
  type: 'bar',
  width: 400,
  height: 300,
  data: [
    {
      id: 'barData',
      values: [
        { month: 'Monday', sales: 22 },
        { month: 'Tuesday', sales: 13 },
        { month: 'Wednesday', sales: 25 },
        { month: 'Thursday', sales: 29 },
        { month: 'Friday', sales: 38 }
      ]
    }
  ],
  xField: 'month',
  yField: 'sales',
  bar: {
    id: 'bar',
    state: {
      highlight: {}
    }
  }
});

const title = new Title({
  text: 'A Bar Chart Demo',
  x: 0,
  y: 0,
  textStyle: {
    fontSize: 20
  }
});

scene.wait(800);
scene.play(textWriter(title, 1000));
scene.wait(1200);

scene.add(bar);

scene.wait(1000);
const ani = highlight(bar, [{ month: 'Friday' }, { month: 'Monday' }], { fill: 'green' });
scene.wait(1000);

ani && scene.play(ani);
scene.wait(2000);

const ani2 = highlight(bar, [{ month: 'Tuesday' }], {
  fill: 'red',
  shadowColor: 'rgba(0, 0, 0, 0.8)',
  shadowBlur: 10
});
ani2 && scene.play(ani2);
scene.wait(1000);
// scene.remove(title);
// scene.remove(bar);
