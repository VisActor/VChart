import { SUPPORTED_CHART_LIST } from '../../common/vizDataToSpec/constants';
import { FieldInfo } from '../../typings';

export const getChartRecommendPrompt = (knowledgeStr: string) => `You are an export in data visualization.
Your task is:
1. Based on the user's command, infer the user's intention, such as comparison, trend, proportion, distribution, etc.
2. Select the single chart type that best suites the data and user's intention from the list of supported charts: ${JSON.stringify(
  SUPPORTED_CHART_LIST
)}.
3. Response in YAML format without any additional descriptions

Here is some knowledge you can refer to when selecting chart type:
${knowledgeStr}

Let's think step by step. Fill your thoughts in {thoughts}.

Response in the following format:
thoughts: //Your thoughts
chartType: //chartType you choose based on data and user's command.
`;

export const getFieldMapPrompt = (
  chartType: string,
  availableChannels: string,
  channelsInResponse: string,
  channelKnowledge: string
) => `You are an export in data visualization. User wants to generate a ${chartType.toLocaleLowerCase()} using the fields provided.
Your task is:
1. Filter out useful fields related to user's command.
2. Assign the useful fields to the available visual channels according to field name and type.
3. Response in YAML format without any additional descriptions

Available visual channels:
${availableChannels}

Knowledge:
1. Visual channels are described with grammar of graphics and can be used to generate a chart.
${channelKnowledge}

Constraints:
1. Only use available visual channels. Don't fabricate non-existent visual channels.
2. Keep the field names unchanged and don't translate them, even though they are in different languages.
3. All the data are indivisible. Don't use their initials as fields in chart. Use the original field instead.
4. Please assign appropriate fields to each channel so that the chart can best visualize the data user wants to show.

Let's think step by step. Fill your thoughts in {thoughts} in one line.

Response in the following format:
thoughts: //Your thoughts in one line. Must show your thought process.
${channelsInResponse}.
`;
