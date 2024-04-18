import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { SimpleBar } from './demos/SimpleBar';
import { RankingBar } from './demos/RankingBar';
import { StoryBarDemo } from './demos/StoryBarDemo';
import { StorySceneDemo } from './demos/StoryScene';
import { AreaWithTag } from './demos/AreaWithTag';

const App = () => {
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
      name: 'StoryScene',
      component: StorySceneDemo
    },
    {
      name: 'AreaWithTag',
      component: AreaWithTag
    }
  ];

  const [selectedMenu, setSelectedMenu] = useState(menus[2]);

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <div style={{ flexBasis: 200, height: '90vh', border: '1px solid #eee' }}>
        {menus.map((menu, index) => (
          <div key={index} onClick={() => setSelectedMenu(menu)} style={{ color: 'blueviolet' }}>
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

ReactDOM.render(<App />, document.getElementById('root'));
