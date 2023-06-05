import React from 'react';
import { WebChart } from './components/web-chart';
import { GeneralChart } from './components/general-chart';
import { IChartProps, ChartSpaceEnvType } from './typings';

interface IChartSpaceProps extends IChartProps {
  type: ChartSpaceEnvType;
}

export default function VChart({ type, ...args }: IChartSpaceProps) {
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

// // TO FIX: 兼容上一版本飞书的导出方式，目前在一些比较老的文档和用户中有部分使用
export { GeneralChart as TaroChartSpace } from './components/general-chart';
