import React, { useState, useCallback, useEffect } from 'react';
import './index.scss';
import { Button, Input, Card, Space, Modal, Spin } from '@arco-design/web-react';
import { defaultTicker } from '@visactor/vrender';
import { default as VChart } from '@visactor/vchart';
import VMind from '../../../../src/';
const TextArea = Input.TextArea;

type IPropsType = {
  spec: any;
  time:
    | {
        totalTime: number;
        frameArr: any[];
      }
    | undefined;
};

function downloadGif(link: string, filename = 'out') {
  const a = document.createElement('a');
  a.href = link;
  a.download = `${filename}.gif`;
  a.dispatchEvent(new MouseEvent('click'));
}

function downloadVideo(link: string, filename = 'out') {
  const a = document.createElement('a');
  a.href = link;
  a.download = `${filename}.mp4`;
  a.dispatchEvent(new MouseEvent('click'));
}

export function RightChart(props: IPropsType) {
  const [chartSpace, setChartSpace] = useState<VChart | null>(null);
  const [generating, setGenerating] = useState<boolean>(false);
  const [outType, setOutType] = useState<'gif' | 'video' | ''>('');
  const [src, setSrc] = useState('');

  const vmind = new VMind(import.meta.OPENAI_KEY!);
  // const [describe, setDescribe] = useState<string>(mockUserInput6.input);
  // const [csv, setCsv] = useState<string>(mockUserInput6.csv);
  // const [loading, setLoading] = useState<boolean>(false);

  // const askGPT = useCallback(async () => {
  //   setLoading(true);
  //   const spec = await(NLToChartPipe(csv, describe));
  //   props.onSpecGenerate(spec, 3000);
  //   setLoading(false);
  // }, [describe, csv]);
  const generateVideo = useCallback(async () => {
    const { spec, time } = props;
    if (!time || !spec) {
      return;
    }
    setGenerating(true);
    const src = await vmind.exportVideo(spec, time, VChart);
    setSrc(src);
    setOutType('video');
    setGenerating(false);
  }, [props.spec, props.time]);

  const generateGif = useCallback(async () => {
    const { spec, time } = props;
    if (!time || !spec) {
      return;
    }
    setGenerating(true);
    const src = await vmind.exportGIF(spec, time, VChart);
    setSrc(src);
    setOutType('gif');
    setGenerating(false);
    // downloadVideo(src);
  }, [props.spec, props.time]);

  useEffect(() => {
    defaultTicker.mode = 'raf';
    const { spec, time } = props;
    if (!time || !spec) {
      return;
    }
    let cs = chartSpace;
    if (!cs) {
      cs = new VChart(spec, {
        dom: 'chart',
        mode: 'desktop-browser',
        dpr: 2,
        disableDirtyBounds: true
      });
      setChartSpace(cs);
    } else {
      cs.updateSpec(props.spec);
    }
    cs.renderAsync();
  }, [props.spec, props.time]);

  return (
    <div className="right-chart">
      <Modal
        title={outType}
        visible={!!outType}
        style={{ width: '' }}
        okText="下载"
        onOk={() => {
          setOutType('');
          if (outType === 'gif') {
            downloadGif(src);
          } else {
            downloadVideo(src);
          }
        }}
        onCancel={() => setOutType('')}
      >
        {outType === 'gif' ? <img src={src} /> : <video controls src={src} />}
      </Modal>
      <Spin style={{ flex: 1, display: 'flex', background: 'rgb(244, 244, 245)' }} loading={generating}>
        <Card hoverable style={{ flex: 1, background: 'rgb(244, 244, 245)' }}>
          <div className="right-chart-title">
            <Space>
              <Button
                disabled={!(!!props.spec && !!props.time)}
                size="small"
                onClick={() => {
                  generateGif();
                }}
                shape="round"
                type="primary"
              >
                export GIF
              </Button>
              <Button
                disabled={!(!!props.spec && !!props.time)}
                size="small"
                onClick={() => {
                  generateVideo();
                }}
                shape="round"
                type="primary"
              >
                export Video
              </Button>
            </Space>
          </div>
          <div className="right-chart-content">
            <div id="chart"></div>
          </div>
        </Card>
      </Spin>
    </div>
  );
}
