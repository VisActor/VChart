import React, { useState, useEffect } from 'react';
import { View } from '@tarojs/components';
import { VChart } from '../../../src';
import Taro from '@tarojs/taro';

export default function (props: any) {
  console.log('env', Taro.getEnv());
  // let type;
  // if (URLSearchParams) {
  //   const url = new URLSearchParams(props.tid);
  //   const type = url.get('pages/chart/index?type');
  // }

  // if (!type) {
  //   // h5 下解析不出来，所以用了这个本方法，不重要，跑通就行
  //   type = props.tid.substring(props.tid.indexOf('type=') + 5, props.tid.indexOf('&'));
  // }
  const type = props.tid.substring(props.tid.indexOf('type=') + 5, props.tid.indexOf('&'));
  console.log(type);

  const specData = require(`../../data/${type}`).default;

  const [spec, setSpec] = useState(specData);

  useEffect(() => {
    setTimeout(() => {
      setSpec({
        ...spec
        // theme: {},
      });
    }, 5000);
  }, []);

  return (
    <View>
      <View
        style={{
          boxSizing: 'border-box',
          width: '100vw',
          height: '75vh',
          padding: '0 8px'
        }}
      >
        <VChart
          type={Taro.getEnv()}
          spec={spec}
          canvasId={`${type}chart1`}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '4px',
            border: '1px solid #eeeeee'
          }}
          onChartInit={() => {
            console.log(`init ${type}`);
          }}
          onChartReady={() => {
            console.log(`ready ${type}`);
          }}
          onChartUpdate={() => {
            console.log(`update ${type}`);
          }}
        />
      </View>

      {/* <View
        style={{
          boxSizing: 'border-box',
          width: '100vw',
          height: '75vh',
          padding: '0 8px'
        }}
      >
        <VChart
          type={Taro.getEnv() as any}
          spec={spec}
          canvasId={`${type}chart2`}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "4px",
            border: "1px solid #eeeeee",
          }}
          onChartInit={() => {
            console.log(`init ${type}`);
          }}
          onChartReady={() => {
            console.log(`ready ${type}`);
          }}
          onChartUpdate={() => {
            console.log(`update ${type}`);
          }}
        />
      </View> */}
    </View>
  );
}
