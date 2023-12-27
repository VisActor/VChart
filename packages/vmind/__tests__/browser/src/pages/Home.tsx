import React, { useState } from 'react';
import { Layout } from '@arco-design/web-react';
import { DataInput } from './DataInput';
import { ChartPreview } from './ChartPreview';
const Sider = Layout.Sider;
const Content = Layout.Content;

export function Home() {
  const [spec, setSpec] = useState<any>('');
  const [time, setTime] = useState<{
    totalTime: number;
    frameArr: any[];
  }>();
  return (
    <Layout>
      <Sider
        resizeDirections={['right']}
        style={{
          height: '100%',
          minWidth: 300
        }}
      >
        <DataInput
          onSpecGenerate={(spec, time) => {
            setSpec(spec);
            setTime(time);
          }}
        />
      </Sider>
      <Content>
        <ChartPreview spec={spec} time={time} />
      </Content>
    </Layout>
  );
}
