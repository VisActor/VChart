# @visactor/vmind

<div align="center">

English | [简体中文](readme-zh.md)

</div>

`@visactor/vmind` is an intelligent chart component based on LLM provided by [VisActor](https://www.visactor.io/), including dialog-based chart generation and editing capabilities. It provides a natural language interaction interface, allowing you to easily create chart narrative works with `@visactor/VMind` with just one sentence, and edit them through continuous dialogue, greatly improving your efficiency in creating data visualization works.

The main features of `@visactor/vmind` include:

- **Easy to use**: Just provide the data you want to display and a sentence describing the information you want to display, and `@visactor/vmind` will automatically generate the chart for you. Based on the existing chart, describe the modifications you want to make to the chart in one sentence, and `@visactor/VMind` will help you achieve the desired effect.
- **Strong scalability**: The components of `@visactor/VMind` can be easily extended and customized, and new functions and features can be added as needed. By default, the OpenAI GPT model is used, and you can easily replace it with any LLM service.
- **Easy narrative**: Based on the powerful chart narrative ability of `@visactor/vchart`, `@visactor/VMind` supports the generation of various types of charts, including line charts, bar charts, pie charts, etc., and can also generate dynamic bar charts and other dynamic charts, making it easy for you to narrate data. More chart types are being added. You can also use the dialog-based editing function to easily modify chart styles and animation effects, making it easy for you to create narratives.
- **One-click export**: `@visactor/VMind` comes with a chart export module, and you can export the created chart narrative as a video or GIF for display.

## Development Guide

### Demo Page

Enter the VChart repository and execute:

```bash
# Install dependencies
$ rush update
# Start the demo page
$ rush docs
```

Select VMind from the top navigation bar, enter your OpenAI Key, click generate chart, and you can experience VMind.

### Start the Development Page

Enter the VChart repository and execute:

```bash
# Install dependencies
$ rush update
# Start the VMind development page
$ rush vmind
```

You can start the vmind development page.

### Project Structure

- \_\_tests\_\_: Playground for development
- src/common: Common data processing, chart recommendation methods, chart generation pipelines
- src/gpt: Code related to gpt intelligent chart generation
- src/skylark: Code related to skylark intelligent chart generation
- src/chart-to-video: Code related to exporting videos, GIFs

## Instructions for use

### 📦 Installation

```bash
# npm
$ npm install @visactor/vmind

# yarn
$ yarn add @visactor/vmind
```

### 📊 Usage Example

#### Intelligent Chart Generation

First, we need to install VMind in the project:

```bash
# Install with npm

npm install @visactor/vmind

# Install with yarn

yarn add @visactor/vmind
```

Next, import VMind at the top of the JavaScript file

```typescript
import VMind from '@visactor/vmind';
```

VMind currently supports OpenAI GPT-3.5, GPT-4 models and skylark-pro series models. Users can specify the model type to be called when initializing the VMind object, and pass in the URL of the large model service. Next, we initialize a VMind instance and pass in the model type and model url:

```typescript
import { Model } from '@visactor/vmind';

const vmind = new VMind({
  url: LLM_SERVICE_URL, //URL of the large model service
  model: Model.SKYLARK, //Currently supports gpt-3.5, gpt-4, skylark pro models. The specified model will be called in subsequent chart generation
  headers: {
    'api-key': LLM_API_KEY
  } //headers will be used directly as the request header in the large model request. You can put the model api key in the header
});
```

Here is a list of supported models:

```typescript
//models that VMind support
//more models are under development
export enum Model {
  GPT3_5 = 'gpt-3.5-turbo',
  GPT4 = 'gpt-4',
  SKYLARK = 'skylark-pro',
  SKYLARK2 = 'skylark2-pro-4k'
}
```

In order to use csv data in subsequent processes, you need to call the data processing method, extract the field information in the data, and convert it into a structured dataset. VMind provides rule-based and large model-based methods to obtain field information:

```typescript
//Pass in csv string to get fieldInfo and dataset for chart generation
const { fieldInfo, dataset } = vmind.parseCSVData(csv);
//Pass in csv string and user's display intention, call large model, get fieldInfo and dataset for chart generation. NOTE: This will pass the raw data to the large model
const { fieldInfo, dataset } = await vmind.parseCSVDataWithLLM(csv, userInput);
```

We want to show "the changes in sales rankings of various car brands". Call the generateChart method and pass the data and display content description directly to VMind:

```typescript
const describe = 'show me the changes in sales rankings of various car brand';
//Call the chart generation interface to get spec and chart animation duration
const { spec, time } = await vmind.generateChart(userInput, fieldInfo, dataset);
```

In this way, we get the VChart spec of the corresponding dynamic chart. We can render the chart based on this spec:

```typescript
import VChart from '@visactor/vchart';

<body>
<!-- Prepare a DOM with size (width and height) for vchart, of course you can also specify it in the spec configuration -->
<div id="chart" style="width: 600px;height:400px;"></div>
</body>

// Create a vchart instance
const vchart = new VChart(spec, { dom: 'chart' });
// Draw
vchart.renderAsync();
```

Thanks to the capabilities of the large language model, users can describe more requirements in natural language and "customize" dishes.
Users can specify different theme styles (currently only gpt chart generation supports this feature). For example, users can specify to generate a tech-style chart:

```typescript
//describe can be in both Chinese and English
//Specify to generate a tech-style chart
const describe = 'show me the changes in sales rankings of various car brand,tech style';
const { spec, time } = await vmind.generateChart(userInput, fieldInfo, dataset);
```

You can also specify the chart type, field mapping, etc. supported by VMind. For example:

```typescript
//Specify to generate a line chart, with car manufacturers as the x-axis
const describe =
  'show me the changes in sales rankings of various car brands,tech style.Using a line chart, Manufacturer makes the x-axis';
const { spec, time } = await(vmind.generateChart(csvData, describe));
```

#### Customizing LLM Request Method

Pass parameters when initializing the VMind object:

```typescript
import VMind from '@visactor/vmind';
const vmind = new VMind(openAIKey:string, params:{
url?: string;//URL of the LLM service
/** gpt request header, which has higher priority */
headers?: Record<string, string> ;//request headers
method?: string;//request method POST GET
model?: string;//model name
max_tokens?: number;
temperature?: number;//recommended to set to 0
})
```

Specify your LLM service url in url (default is https://api.openai.com/v1/chat/completions)
In subsequent calls, VMind will use the parameters in params to request the LLM service url.

#### Dialog-based editing

Under development, stay tuned

### Effect display

#### Dynamic bar chart

![Alt text](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VChart-Video-2.gif)

#### Bar chart

![Alt text](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VChart-Video-1.gif)

#### Pie chart

![Alt text](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VChart-Video-3.gif)
