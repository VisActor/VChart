import React from 'react';
import { WebChart } from './components/web-chart';
import { GeneralChart } from './components/general-chart';
import { IChartProps, VChartEnvType } from './typings';

interface IVChartProps extends IChartProps {
  /**
   * 配置环境。
   * - `tt` 字节小程序。
   * - `lark` 飞书小程序。
   * - `h5` 浏览器环境, 与`web`等价。
   * - `web` 浏览器环境, 与`h5`等价。
   */
  type: VChartEnvType;
}

export default function VChart({ type, ...args }: IVChartProps) {
  const env = type.toLocaleLowerCase();
  const strategies = {
    lark: () => {
      return <GeneralChart {...args} />;
    },
    tt: () => {
      return <GeneralChart {...args} />;
    },
    web: () => {
      return <WebChart {...args} />;
    },
    h5: () => {
      return <WebChart {...args} />;
    }
  };

  if (env && strategies[env] !== undefined) {
    return strategies[env].call();
  }

  console.warn(`暂不支持 ${env} 环境`);
  return <GeneralChart {...args} />;
}

export { VChart };
