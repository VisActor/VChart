import { Scene } from '../../src/scene';
import { RankingBar } from '../../src/template/ranking-bar/ranking-bar';
import { yearsData, countryImage } from '../data/ranking-bar';

const allData: any[] = [];
yearsData.forEach(value => {
  allData.push(...value);
});

const scene = new Scene({ dom: 'root' });
const rankingBar = new RankingBar({
  data: allData,
  timeField: 'Year',
  xField: 'Value',
  yField: 'CountryName',
  icon: Array.from(countryImage).reduce((obj, [key, value]) => {
    obj[key] = value;
    return obj;
  }, {})
});
// rankingBar.render({ dom: 'root' });
console.log(yearsData);

scene.add(rankingBar);
scene.render();
