import React from 'react';
import { WebChart } from './components/web-chart';
import { GeneralChart } from './components/general-chart';
import { IChartProps, VChartEnvType } from './typings';
import Taro from '@tarojs/taro';
// @ts-ignore
import { registerLarkEnv, registerWXEnv } from '@visactor/vchart/build/es5';

interface IVChartProps extends IChartProps {
  /**
   * 配置环境。如果没有声明，则会通过 `Taro.getEnv()` 自动获取。
   * - `tt` 字节小程序。
   * - `lark` 飞书小程序。
   * - `weapp` 微信小程序
   * - `h5` 浏览器环境, 与`web`等价。
   * - `web` 浏览器环境, 与`h5`等价。
   */
  type?: VChartEnvType;
}

export default function VChart({ type, ...args }: IVChartProps) {
  const env = (type ?? Taro.getEnv()).toLocaleLowerCase();

  const strategies = {
    lark: () => {
      registerLarkEnv();
      return <GeneralChart {...args} mode="miniApp" />;
    },
    tt: () => {
      registerLarkEnv();
      return <GeneralChart {...args} mode="miniApp" />;
    },
    weapp: () => {
      registerWXEnv();
      return <GeneralChart {...args} mode="wx" />;
    },
    web: () => {
      return <WebChart {...args} />;
    },
    h5: () => {
      return <WebChart {...args} mode="mobile-browser" />;
    }
  };

  if (env && strategies[env] !== undefined) {
    return strategies[env].call();
  }

  console.warn(`暂不支持 ${env} 环境`);
  return <GeneralChart {...args} />;
}

export { VChart };
