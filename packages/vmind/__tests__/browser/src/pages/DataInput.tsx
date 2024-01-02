import React, { useState, useCallback, useMemo } from 'react';
import './index.scss';
import {
  Avatar,
  Input,
  Divider,
  Button,
  InputNumber,
  Upload,
  Message,
  Select,
  Radio,
  Checkbox
} from '@arco-design/web-react';
import {
  mockUserInput10,
  mockUserInput2,
  mockUserInput3,
  mockUserInput3Eng,
  mockUserInput6,
  mockUserInput6Eng,
  mockUserInput8,
  carSaleMockData,
  mockUserInput15,
  acceptRatioData,
  mallSalesData,
  hotWordsData,
  mockUserInput4,
  mockUserInput5,
  mockUserInput9,
  mockUserInput11,
  mockUserInput12,
  mockUserInput13,
  mockUserInput14,
  mockUserInput16
} from '../constants/mockData';
import VMind from '../../../../src/index';
import { Model } from '../../../../src/typings';

const TextArea = Input.TextArea;
const Option = Select.Option;
const RadioGroup = Radio.Group;

type IPropsType = {
  onSpecGenerate: (
    spec: any,
    time: {
      totalTime: number;
      frameArr: any[];
    },
    costTime: number
  ) => void;
};
const demoDataList: { [key: string]: any } = {
  pie: mockUserInput2,
  'dynamic bar zh_cn': mockUserInput6,
  line: mockUserInput8,
  column: mockUserInput3,
  column2: mockUserInput10,
  wordcloud: hotWordsData,
  wordcloud2: mockUserInput5,
  'scatter plot': mockUserInput4,
  funnel: mockUserInput9,
  'dual-axis': mockUserInput11,
  waterfall: mockUserInput12,
  rose: mockUserInput13,
  radar: mockUserInput14,
  sankey: mockUserInput15,
  'box-plot': mockUserInput16,
  'Electric vehicle sales': carSaleMockData,
  'College entrance examination': acceptRatioData,
  'Shopping Mall Sales Performance': mallSalesData,
  'Global GDP': mockUserInput6Eng,
  'Sales of different drinkings': mockUserInput3Eng
};

const globalVariables = (import.meta as any).env;
const ModelConfigMap = {
  [Model.SKYLARK2]: { url: globalVariables.VITE_SKYLARK_URL, key: globalVariables.VITE_SKYLARK_KEY },
  [Model.SKYLARK]: { url: globalVariables.VITE_SKYLARK_URL, key: globalVariables.VITE_SKYLARK_KEY },
  [Model.GPT3_5]: { url: globalVariables.VITE_GPT_URL, key: globalVariables.VITE_GPT_KEY },
  [Model.GPT4]: { url: globalVariables.VITE_GPT_URL, key: globalVariables.VITE_GPT_KEY }
};

export function DataInput(props: IPropsType) {
  const defaultDataKey = Object.keys(demoDataList)[3];
  const [describe, setDescribe] = useState<string>(demoDataList[defaultDataKey].input);
  const [csv, setCsv] = useState<string>(demoDataList[defaultDataKey].csv);
  const [spec, setSpec] = useState<string>('');
  const [time, setTime] = useState<number>(1000);
  const [model, setModel] = useState<Model>(Model.SKYLARK2);
  const [cache, setCache] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const vmind = useMemo(
    () =>
      new VMind({
        url: ModelConfigMap[model].url ?? undefined,
        model,
        cache,
        showThoughts: false,
        headers: {
          'api-key': ModelConfigMap[model].key
        }
      }),
    [cache, model]
  );

  const askGPT = useCallback(async () => {
    setLoading(true);
    const { fieldInfo, dataset } = vmind.parseCSVData(csv);
    //const { fieldInfo, dataset } = await vmind.parseCSVDataWithLLM(csv, describe);
    const startTime = new Date().getTime();
    const { spec, time } = await vmind.generateChart(describe, fieldInfo, dataset);
    const endTime = new Date().getTime();
    const costTime = endTime - startTime;
    props.onSpecGenerate(spec, time as any, costTime);
    setLoading(false);
  }, [vmind, csv, describe, props]);

  return (
    <div className="left-sider">
      <div style={{ width: '90%', marginBottom: 20 }}>
        <p>
          <Avatar size={18} style={{ backgroundColor: '#3370ff' }}>
            0
          </Avatar>
          <span style={{ marginLeft: 10 }}>Select Demo Data (optional)</span>
        </p>
        <Select
          style={{
            width: '100%'
          }}
          defaultValue={defaultDataKey}
          onChange={v => {
            const dataObj = demoDataList[v];
            setDescribe(dataObj.input);
            setCsv(dataObj.csv);
          }}
        >
          {Object.keys(demoDataList).map(name => (
            <Option key={name} value={name}>
              {name}
            </Option>
          ))}
        </Select>
      </div>

      <div>
        <p>
          <Avatar size={18} style={{ backgroundColor: '#3370ff' }}>
            1
          </Avatar>
          <span style={{ marginLeft: 10 }}>What would you like to visualize?</span>
        </p>

        <TextArea
          placeholder={describe}
          value={describe}
          onChange={v => setDescribe(v)}
          style={{ minHeight: 160, marginTop: 20, background: 'transparent', border: '1px solid #eee' }}
        />
      </div>
      <Divider style={{ marginTop: 60 }} />
      <div>
        <p>
          <Avatar size={18} style={{ backgroundColor: '#3370ff' }}>
            2
          </Avatar>
          <span style={{ marginLeft: 10 }}>Input your data file in csv format</span>
        </p>
        {/*<Upload
          drag
          accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'
          onDrop={(e) => {
            let uploadFile = e.dataTransfer.files[0]
            if (isAcceptFile(uploadFile, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel')) {
              return
            } else {
              Message.info('不接受的文件类型，请重新上传指定文件类型~');
            }
          }}
          customRequest={(option) => {
            const { file } = option;
            var reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.addEventListener('load', async (event) => {
              const result = reader.result;
              if (!result) {
                return;
              }
              const csv = await excel2csv(result);
              csv && setCsv(csv);
            });
          }}
          tip='Only pictures can be uploaded'
        />*/}
        <TextArea
          placeholder={csv}
          value={csv}
          onChange={v => setCsv(v)}
          style={{ minHeight: 160, marginTop: 20, background: 'transparent', border: '1px solid #eee' }}
        />
      </div>

      <Divider style={{ marginTop: 60 }} />
      {/*
      <div>
        <p>
          <Avatar size={18} style={{ backgroundColor: '#3370ff' }}>
            OR
          </Avatar>
          <span style={{ marginLeft: 10 }}>input spec immediately</span>
        </p>

        <TextArea
          placeholder={spec}
          defaultValue={spec}
          onChange={v => setSpec(v)}
          style={{
            marginBottom: 20,
            minHeight: 160,
            marginTop: 20,
            background: 'transparent',
            border: '1px solid #eee'
          }}
        />
        <InputNumber defaultValue={time} onChange={v => setTime(v)}></InputNumber>
      </div>*/}
      <div style={{ width: '90%', marginBottom: 10 }}>
        <RadioGroup value={model} onChange={v => setModel(v)}>
          <Radio value={Model.GPT3_5}>GPT-3.5</Radio>
          <Radio value={Model.GPT4}>GPT-4</Radio>
          <Radio value={Model.SKYLARK2}>skylark2 pro</Radio>

          <Radio value={Model.SKYLARK}>skylark pro</Radio>
        </RadioGroup>
      </div>
      <div style={{ width: '90%', marginBottom: 10 }}>
        <Checkbox checked={cache} onChange={v => setCache(v)}>
          Enable Cache
        </Checkbox>
      </div>
      <div className="generate-botton">
        <Button
          loading={loading}
          onClick={() => {
            if (spec) {
              const jsonSpec = new Function(`return ${spec}`)();
              props.onSpecGenerate(jsonSpec, { totalTime: time } as any);
            } else {
              askGPT();
            }
          }}
          shape="round"
          type="primary"
        >
          generate chart (preview)
        </Button>
      </div>
    </div>
  );
}
