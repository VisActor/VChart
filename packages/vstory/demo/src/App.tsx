import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { SimpleBar } from './demos/SimpleBar';
import { RankingBar } from './demos/RankingBar';
import { StoryBarDemo } from './demos/StoryBarDemo';
import { StorySceneDemo } from './demos/StoryScene';
import { AreaWithTag } from './demos/AreaWithTag';
import { StoryLineDemo } from './demos/StoryLineDemo';
import { useLocalStorage } from './hooks/useLocalStorage';

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
      name: 'StoryBar',
      component: StoryBarDemo
    },
    {
      name: 'StoryLine',
      component: StoryLineDemo
    },
    {
      name: 'StoryScene',
      component: StorySceneDemo
    },
    {
      name: 'AreaWithTag',
      component: AreaWithTag
    }
  ];

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
