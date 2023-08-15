import ReactDOM from 'react-dom/client';
import * as VRender from '@visactor/vrender';
import * as VChart from '@visactor/vchart';
import * as VisUtil from '@visactor/vutils';
import { App } from './app';

import '@arco-design/web-react/dist/css/arco.css';

(window as any).VRender = VRender;
(window as any).VChart = VChart.VChart;
(window as any).CONTAINER_ID = 'chart';
(window as any).VisUtil = VisUtil;

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);
