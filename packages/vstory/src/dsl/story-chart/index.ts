import { StoryBar } from './bar';
import { StoryPie } from './pie';

import { StoryArea } from './area';
import { StoryLine } from './line';

export { StoryBar, StoryArea, StoryPie };
export type StoryChart = StoryBar | StoryArea | StoryPie;
