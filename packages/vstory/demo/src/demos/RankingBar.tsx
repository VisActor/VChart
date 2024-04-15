import React, { useEffect } from 'react';

import { Bar } from '../../../src/template/charts/simple-chart';
import { Scene } from '../../../src/scene';
import { Title, textWriter } from '../../../src/component/title';

import { RankingBar as RankingBarChart } from '../../../src/template/ranking-bar/ranking-bar';
import { yearsData, countryImage } from '../../data/ranking-bar';

export const RankingBar = () => {
  const domId = 'ranking';
  useEffect(() => {
    const allData: any[] = [];
    yearsData.forEach(value => {
      allData.push(...value);
    });

    const scene = new Scene({
      dom: domId
    });
    const rankingBar = new RankingBarChart({
      data: allData,
      timeField: 'Year',
      xField: 'Value',
      yField: 'CountryName',
      icon: Array.from(countryImage).reduce((obj: any, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {}),
      // iconPosition: 'bar-end',
      // duration: 30000,
      interval: 400,
      // iconShape: 'rect',
      // iconPosition: 'axis',
      color: {
        China: 'red',
        USA: 'rgb(0,43,127)',
        India: '#FF9933',
        Russia: '#D52B1E',
        Japan: 'rgb(79,66,95)',
        Brazil: ' #009B3A',
        Mexico: 'rgb(1,101,69)',
        Indonesia: '#CE1126',
        Italy: '#009246',
        UK: 'rgb(27,63,126)',
        Germany: '#000000',
        France: '#0055A4',
        Pakistan: '#006600',
        Nigeria: '#008000'
      },
      nameLabel: {
        visible: true,
        position: 'bar-start',
        style: {
          // fill: 'white'
        }
      },
      timeLabel: {
        // visible: false
      },
      yAxis: {
        // domainLine: {
        //   stroke: 'red',
        //   lineWidth: 10
        // }
      }
    });
    (window as any).rankingBar = rankingBar;

    const title = new Title({
      text: 'A Ranking Bar Chart Demo',
      x: 0,
      y: 0,
      textStyle: {
        fontSize: 20
      }
    });

    scene.wait(800);
    scene.play(textWriter(title, 1000));
    scene.wait(1200);

    scene.add(rankingBar);
  }, []);

  return <div id={domId}></div>;
};
