import { Page01OriginalData } from './interface';
import boy1995 from './assets/boy-1995.jpeg';
import boy1997 from './assets/boy-1997.png';
import girl1997 from './assets/girl-1997.webp';
import boy2000 from './assets/boy-2000.png';
import girl2000 from './assets/girl-2000.png';

export const page01: Page01OriginalData = {
  boy: [
    {
      year: 1995,
      image: boy1995,
      progress: 0.1,
      dataList: [
        { name: '他的年龄', value: '0' },
        { name: '城市', value: '上海' },
        { name: '状态', value: ['Hello', 'World!'] },
        { name: '心情', value: '不错' }
      ]
    },
    {
      year: 1997,
      image: boy1997,
      progress: 0.2,
      dataList: [
        { name: '他的年龄', value: '2' },
        { name: '城市', value: '上海' },
        { name: '状态', value: '尿床' },
        { name: '心情', value: '不错' }
      ]
    },
    {
      year: 2000,
      image: boy2000,
      progress: 0.3,
      dataList: [
        { name: '他的年龄', value: '5' },
        { name: '城市', value: '上海' },
        { name: '状态', value: '大班' },
        { name: '心情', value: '懵懂' }
      ]
    }
  ],
  girl: [
    {
      year: 1997,
      image: girl1997,
      progress: 0.1,
      dataList: [
        { name: '她的年龄', value: '0' },
        { name: '城市', value: '北京' },
        { name: '状态', value: '哭哭' },
        { name: '心情', value: '好奇' }
      ]
    },
    {
      year: 2000,
      image: girl2000,
      progress: 0.2,
      dataList: [
        { name: '她的年龄', value: '3' },
        { name: '城市', value: '北京' },
        { name: '状态', value: '小班' },
        { name: '心情', value: '调皮' }
      ]
    }
  ]
};
