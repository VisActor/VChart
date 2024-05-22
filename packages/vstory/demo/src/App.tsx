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
import { GraphicActionDemo } from './demos/graphicAction';
import { VChartSiteDemo } from './demos/VChartSite/VChartSite';
import { DisAppear } from './demos/DisAppear';
import { StoryEdit } from './demos/StoryEdit';
import { Appear } from './demos/Appear';

const App = () => {
  const [activeIndex, setActiveIndex] = useLocalStorage('menuIndex', 0);
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
      name: 'DisAppear',
      component: DisAppear
    },
    {
      name: 'Appear',
      component: Appear
    },
    {
      name: 'Graphic-Action',
      component: GraphicActionDemo
    },
    {
      name: 'VChart-Site',
      component: VChartSiteDemo
    },
    {
      name: 'StoryEdit',
      component: StoryEdit
    }
  ];
  const selectedMenu = menus[activeIndex ?? menus.length - 1];

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
