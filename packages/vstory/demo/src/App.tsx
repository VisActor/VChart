import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { SimpleBar } from './demos/SimpleBar';
import { RankingBar } from './demos/RankingBar';

const App = () => {
  const menus = [
    {
      name: 'SimpleBar',
      component: SimpleBar
    },
    {
      name: 'RankingBar',
      component: RankingBar
    }
  ];

  const [selectedMenu, setSelectedMenu] = useState(menus[0]);

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <div style={{ flexBasis: 200, height: '90vh', border: '1px solid #eee' }}>
        {menus.map((menu, index) => (
          <div key={index} onClick={() => setSelectedMenu(menu)} style={{ color: 'blueviolet' }}>
            <button>{menu.name}</button>
          </div>
        ))}
      </div>

      <div style={{ flexGrow: 1, border: '1px solid #eee' }}>
        <selectedMenu.component />
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
