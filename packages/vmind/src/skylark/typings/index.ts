export type ChannelInfo = {
  [chartType: string]: {
    visualChannels: Record<string, string>; //Visual channel available in this chart type
    responseDescription: Record<string, string>; //description of the visual channel used in the llm response
    knowledge: string[]; //list of additional knowledge about the visual channels model need to know
  };
};
