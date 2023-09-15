import React, { useState, useCallback, useEffect } from 'react';
import './index.scss';
import { Avatar, Input, Divider, Button, InputNumber, Upload, Message } from '@arco-design/web-react';
import {
  carSaleMockData,
  mockUserInput10,
  mockUserInput2,
  mockUserInput3,
  mockUserInput3Eng,
  mockUserInput6,
  mockUserInput6Eng,
  mockUserInput8
} from '../constants';
import VMind from '@visactor/vmind';

const TextArea = Input.TextArea;
type IPropsType = {
  openAIKey: string | undefined;
  setOpenAIKey: any;
  onSpecGenerate: (
    spec: any,
    time: {
      totalTime: number;
      frameArr: any[];
    }
  ) => void;
};

export function LeftInput(props: IPropsType) {
  const { openAIKey, setOpenAIKey } = props;
  const [describe, setDescribe] = useState<string>(carSaleMockData.input);
  const [csv, setCsv] = useState<string>(carSaleMockData.csv);
  const [loading, setLoading] = useState<boolean>(false);

  const askGPT = useCallback(async () => {
    setLoading(true);
    if (!openAIKey) {
      Message.warning('Please input your openAI api key!');
      return;
    }
    const vmind = new VMind(openAIKey!);

    const { spec, time } = await vmind.generateChart(csv, describe);
    props.onSpecGenerate(spec, time);
    setLoading(false);
  }, [describe, csv, openAIKey]);

  return (
    <div className="left-sider">
      <div
        style={{
          marginLeft: 20,
          marginBottom: 20
        }}
      >
        <p>
          <Avatar size={18}>1</Avatar>
          <span
            style={{
              marginLeft: 10
            }}
          >
            Input your openAI api key:
          </span>
        </p>
        <Input value={openAIKey} onChange={v => setOpenAIKey(v)} style={{ width: 250 }} />
      </div>

      <div
        style={{
          marginLeft: 10,
          marginBottom: 20
        }}
      >
        <p>
          <Avatar size={18}>2</Avatar>
          <span style={{ marginLeft: 10 }}>What would you like to visualize?</span>
        </p>

        <TextArea
          placeholder={describe}
          defaultValue={describe}
          onChange={v => setDescribe(v)}
          style={{ minHeight: 120 }}
        />
      </div>

      <div
        style={{
          marginLeft: 10,
          marginBottom: 20
        }}
      >
        <p>
          <Avatar size={18}>3</Avatar>
          <span style={{ marginLeft: 10 }}>Input your data file in csv format</span>
        </p>
        <TextArea placeholder={csv} value={csv} onChange={v => setCsv(v)} style={{ minHeight: 300 }} />
      </div>

      <Divider style={{ marginTop: 60 }} />

      <div className="generate-botton">
        <Button
          loading={loading}
          onClick={() => {
            askGPT();
          }}
          disabled={!openAIKey}
          shape="round"
          //type="primary"
        >
          generate chart (preview)
        </Button>
      </div>
    </div>
  );
}
