import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { SimpleBar } from './demos/SimpleBar';
import { RankingBar } from './demos/RankingBar';
import { StoryBarDemo } from './demos/StoryBarDemo';
import { StorySceneDemo } from './demos/StoryScene';
import { AreaWithTag } from './demos/AreaWithTag';
import { StoryLineDemo } from './demos/StoryLineDemo';
import { useLocalStorage } from './hooks/useLocalStorage';
import { StoryPieDemo } from './demos/StoryPieDemo';
import { AppearBar } from './demos/AppearBar';
import { AppearLine } from './demos/AppearLine';
import { AppearPie } from './demos/AppearPie';
import { GraphicActionDemo } from './demos/graphicAction';
import { ChartHistory } from './demos/ChartHistory';

const menus = [
  {
    name: 'SimpleBar',
    component: SimpleBar
  },
  {
    name: 'RankingBar',
    component: RankingBar
  },
  {
    name: 'Bar',
    component: StoryBarDemo
  },
  {
    name: 'Line',
    component: StoryLineDemo
  },
  {
    name: 'Pie',
    component: StoryPieDemo
  },
  {
    name: 'StoryScene',
    component: StorySceneDemo
  },
  {
    name: 'AreaWithTag',
    component: AreaWithTag
  },
  {
    name: 'AppearBar',
    component: AppearBar
  },
  {
    name: 'AppearLine',
    component: AppearLine
  },
  {
    name: 'AppearPie',
    component: AppearPie
  },
  {
    name: 'Graphic-Action',
    component: GraphicActionDemo
  },
  {
    name: 'ChartHistory',
    component: ChartHistory
  }
];

const App = () => {
  const [activeIndex, setActiveIndex] = useLocalStorage('menuIndex', menus.length - 1);

  const selectedMenu = menus[activeIndex];

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <div style={{ flexBasis: 200, height: '90vh', border: '1px solid #eee' }}>
        {menus.map((menu, index) => (
          <div key={index} onClick={() => setActiveIndex(index)} style={{ color: 'blueviolet' }}>
            <button>{menu.name}</button>
          </div>
        ))}
      </div>

      <div style={{ flexGrow: 1, border: '1px solid #eee', height: '90vh' }}>
        <selectedMenu.component />
      </div>
    </div>
  );
};

createRoot(document.getElementById('root') as HTMLElement).render(<App />);
