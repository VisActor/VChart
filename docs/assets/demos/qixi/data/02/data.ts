import { Page02OriginalData } from './interface';
import image202305 from './assets/2023-05.png';
import image202306 from './assets/2023-06.png';
import image202307 from './assets/2023-07.png';

export const page02: Page02OriginalData = {
  '2023/05': {
    image: image202305,
    dataList: [
      { category: '接吻', value: 37 },
      { category: '吃饭', value: 28 },
      { category: '吵架', value: 16 },
      { category: '旅游', value: 13 },
      { category: '思念', value: 13 }
    ]
  },
  '2023/06': {
    image: image202306,
    dataList: [
      { category: '吃饭', value: 36 },
      { category: '接吻', value: 32 },
      { category: '吵架', value: 28 },
      { category: '旅游', value: 17 },
      { category: '思念', value: 16 }
    ]
  },
  '2023/07': {
    image: image202307,
    dataList: [
      { category: '思念', value: 48 },
      { category: '接吻', value: 36 },
      { category: '吃饭', value: 24 },
      { category: '旅游', value: 19 },
      { category: '吵架', value: 16 }
    ]
  }
};
