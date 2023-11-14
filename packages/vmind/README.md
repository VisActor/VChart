# @visactor/vmind

<div align="center">

English | [简体中文](readme-zh.md)

</div>

`@visactor/vmind` is an intelligent chart component based on large models provided by [VisActor](https://www.visactor.io/), including dialog-based chart generation and editing capabilities. It provides a natural language interaction interface, allowing you to easily create chart narrative works with `@visactor/VMind` with just one sentence, and edit them through continuous dialogue, greatly improving your efficiency in creating data visualization works.

The main features of `@visactor/vmind` include:

- **Easy to use**: Just provide the data you want to display and a sentence describing the information you want to display, and `@visactor/vmind` will automatically generate the chart for you. Based on the existing chart, describe the modifications you want to make to the chart in one sentence, and `@visactor/VMind` will help you achieve the desired effect.
- **Strong scalability**: The components of `@visactor/VMind` can be easily extended and customized, and new functions and features can be added as needed. By default, the OpenAI GPT model is used, and you can easily replace it with any text large model.
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
- src/chart-generation: Code related to intelligent chart generation
- src/chart-to-video: Code related to exporting videos, GIFs

## Instructions for use

### 📦 Installation

```bash
# npm
$ npm install @visactor/vmind

# yarn
$ yarn add @visactor/vmind
```

### 📊 Usage example

#### Intelligent chart generation

```typescript
import VMind from '@visactor/vmind';

const vmind = new VMind(openAIKey); //Pass in your openAI key

const { spec, time } = await vmind.generateChart(csv, describe); //Intelligent chart generation, pass in your csv format data and chart description, and return the chart spec and chart animation duration
```

#### Customizing Large Model Call Method

Pass parameters when initializing the VMind object:

```typescript
import VMind from '@visactor/vmind';
const vmind = new VMind(openAIKey:string, params:{
url?: string;//URL of the large model service
/** gpt request header, which has higher priority */
headers?: Record<string, string> ;//request headers
method?: string;//request method POST GET
model?: string;//model name
max_tokens?: number;
temperature?: number;//recommended to set to 0
})
```

Specify your large model service url in url (default is https://api.openai.com/v1/chat/completions)
In subsequent calls, VMind will use the parameters in params to request the large model service url.

#### Chart export

```typescript
//Export video
const src = await vmind.exportVideo(spec, time); //Pass in the chart spec and video duration, and return ObjectURL
//Export GIF image
const src = await vmind.exportGIF(spec, time); //Pass in the chart spec and GIF duration, and return ObjectURL
```

#### Dialog-based editing

Under development, stay tuned

### Effect display

#### Dynamic bar chart

![Alt text](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VChart-Video-2.gif)

#### Bar chart

![Alt text](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VChart-Video-1.gif)

#### Pie chart

![Alt text](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VChart-Video-3.gif)
