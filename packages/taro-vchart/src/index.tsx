import React from 'react';
import { WebChart } from './components/web-chart';
import { GeneralChart } from './components/general-chart';
import { IVChartProps } from './typings';
import Taro from '@tarojs/taro';
// @ts-ignore
import { VChart as chartConstructor, registerLarkEnv, registerWXEnv } from './chart/index';
import { VChartSimple } from './simple';

export default function VChart({ type, ...args }: IVChartProps) {
  console.log('VChart');
  const env = (type ?? Taro.getEnv()).toLocaleLowerCase();
  // @ts-ignore
  const props = { chartConstructor, ...args };
  const strategies = {
    lark: () => {
      registerLarkEnv();
      return <GeneralChart {...props} mode="miniApp" />;
    },
    tt: () => {
      registerLarkEnv();
      return <GeneralChart {...props} mode="miniApp" />;
    },
    weapp: () => {
      registerWXEnv();
      return <GeneralChart {...props} mode="wx" />;
    },
    web: () => {
      return <WebChart {...props} />;
    },
    h5: () => {
      return <WebChart {...props} mode="mobile-browser" />;
    }
  };

  if (env && strategies[env] !== undefined) {
    return strategies[env].call();
  }

  console.warn(`暂不支持 ${env} 环境`);
  return <GeneralChart {...props} />;
}

export { VChart, VChartSimple };
