import { VChart } from '@visactor/vchart';
import { registerStorylineChart } from '../../../../src';
import type { IStorylineSpec, StorylineLayoutType } from '../../../../src/charts/storyline';

const layouts: StorylineLayoutType[] = [
  'landscape',
  'portrait',
  'up-ladder',
  'down-ladder',
  'pulse',
  'spiral',
  'clock',
  'bowl',
  'dome',
  'wing'
];

const baseData = [
  {
    id: 'discover',
    title: 'Discover',
    content:
      'Collect the first signal and frame the story. Capture every relevant detail from the source material ' +
      'so the audience can reconstruct the same context the author had when starting the analysis.',
    image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-1930.png'
  },
  {
    id: 'group',
    title: 'Group',
    content:
      'Arrange related facts into a compact block, removing duplicates and aligning each fragment ' +
      'to the central theme so readers can scan supporting evidence at a glance without losing context.',
    image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-1930.png'
  },
  {
    id: 'connect',
    title: 'Connect',
    content:
      'Draw the reading path between blocks. Use repeating motifs, parallel sentence structures ' +
      'and visual cues to establish a continuous flow that walks the reader from premise to conclusion.',
    image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-1930.png'
  },
  {
    id: 'emphasize',
    title: 'Emphasize',
    content:
      'Use image, title, and copy as one visual unit. Highlight the most important facts with typography ' +
      'weight, color contrast or motion so the eye instinctively returns to them while scanning.',
    image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-1930.png'
  },
  {
    id: 'resolve',
    title: 'Resolve',
    content:
      'End with a clear takeaway. Summarize the lesson, point out the next decision the audience ' +
      'should make and remove any ambiguity so the story closes with a satisfying, actionable conclusion.',
    image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-1930.png'
  }
];

const randomCountByLayout = layouts.reduce<Record<StorylineLayoutType, number>>(
  (result, layout) => {
    result[layout] = 3 + Math.floor(Math.random() * 7);
    return result;
  },
  {} as Record<StorylineLayoutType, number>
);

const buildData = (layout: StorylineLayoutType) => {
  const count = randomCountByLayout[layout];
  return Array.from({ length: count }, (_, index) => {
    const seed = baseData[index % baseData.length];
    return {
      ...seed,
      id: `${layout}-${index}-${seed.id}`,
      title: `${seed.title} ${index + 1}`,
      content: [`${seed.content}`, `Layout ${layout} / Block ${index + 1} of ${count}.`]
    };
  });
};

// 通用 title / content 样式（所有布局共享）
const commonTitle: IStorylineSpec['title'] = {
  style: {
    fontSize: 14,
    fill: '#1f2533',
    fontWeight: 700
  }
};

const commonContent: IStorylineSpec['content'] = {
  style: {
    fontSize: 12,
    lineHeight: 17,
    fill: '#596579'
  }
};

const commonLine: IStorylineSpec['line'] = {
  type: 'line',
  showArrow: true,
  style: {
    lineWidth: 1.5,
    lineCap: 'round',
    lineJoin: 'round',
    lineDash: [6, 5]
  }
};

const themeColor = 'rgb(228,154,56)';

// landscape：图片错落 + 贯穿曲线，block 含上下两个卡片，垂直空间更大
const createLandscapeSpec = (layout: StorylineLayoutType): IStorylineSpec => ({
  type: 'storyline',
  padding: 20,
  data: buildData(layout),
  layout,
  themeColor,
  block: {
    widthRatio: 0.22,
    minWidth: 200,
    maxWidth: 260,
    height: 260,
    padding: 12,
    gap: 40,
    style: { fill: '#ffffff', stroke: '#d8deea', lineWidth: 1, cornerRadius: 8 }
  },
  image: { gap: 0 },
  title: commonTitle,
  content: commonContent,
  line: commonLine
});

// portrait：上下预留 50px，中轴贯穿，block.height 由 transformer 自适应
const createPortraitSpec = (layout: StorylineLayoutType): IStorylineSpec => ({
  type: 'storyline',
  padding: [50, 20, 50, 20],
  data: buildData(layout),
  layout,
  themeColor,
  block: {
    widthRatio: 0.28,
    minWidth: 220,
    maxWidth: 320,
    padding: 12,
    gap: 40,
    style: { fill: '#ffffff', stroke: '#d8deea', lineWidth: 1, cornerRadius: 8 }
  },
  image: { gap: 0 },
  title: commonTitle,
  content: commonContent,
  line: commonLine
});

// bowl：顶部 50 / 底部 10 留白以承载弧线 + centerImage
const createDomeSpec = (layout: StorylineLayoutType): IStorylineSpec => ({
  type: 'storyline',
  padding: [50, 20, 100, 20],
  data: buildData(layout),
  layout,
  themeColor,
  block: {
    widthRatio: 0.28,
    minWidth: 220,
    maxWidth: 320,
    height: 300,
    padding: 12,
    gap: 40,
    style: { fill: '#ffffff', stroke: '#d8deea', lineWidth: 1, cornerRadius: 8 }
  },
  image: { position: 'left', gap: 12 },
  title: commonTitle,
  content: commonContent,
  line: commonLine,
  centerImage: {
    image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-1930.png'
  }
});

// bowl：dome 的上下镜像 —— centerImage 贴顶，弧线 + block 在下方
const createBowlSpec = (layout: StorylineLayoutType): IStorylineSpec => ({
  type: 'storyline',
  data: buildData(layout),
  layout,
  themeColor,
  block: {
    widthRatio: 0.28,
    minWidth: 220,
    maxWidth: 320,
    height: 300,
    padding: 12,
    gap: 40,
    style: { fill: '#ffffff', stroke: '#d8deea', lineWidth: 1, cornerRadius: 8 }
  },
  image: { position: 'left', gap: 12 },
  title: commonTitle,
  content: commonContent,
  line: commonLine,
  centerImage: {
    image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/center-image.png',
    // width: 600,
    // height: 600
    // style: {
    //   scaleX: 2.5,
    //   scaleY: 2.5
    //   // anchor: ['50%', '50%']
    // }
    style: {
      width: 800,
      height: 800,
      _debug_bounds: true
      // dx: -120,
      // dy: -120
      // imageScale: 2
      // anchor: ['50%', '50%']
    }
  }
});

// clock：环绕式时间线，需要 centerImage 作为盘心
const createClockSpec = (layout: StorylineLayoutType): IStorylineSpec => ({
  type: 'storyline',
  padding: 20,
  data: buildData(layout),
  layout,
  themeColor,
  block: {
    widthRatio: 0.28,
    minWidth: 220,
    maxWidth: 320,
    padding: 12,
    gap: 40,
    style: { fill: '#ffffff', stroke: '#d8deea', lineWidth: 1, cornerRadius: 8 }
  },
  image: { position: 'left', gap: 12 },
  title: commonTitle,
  content: commonContent,
  line: commonLine,
  centerImage: {
    image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-1930.png'
  }
});

// 默认 / clock / ladder / pulse / spiral / dome / wing 等布局共用一份 spec
const createDefaultSpec = (layout: StorylineLayoutType): IStorylineSpec => ({
  type: 'storyline',
  padding: 20,
  data: buildData(layout),
  layout,
  themeColor,
  block: {
    widthRatio: 0.28,
    minWidth: 220,
    maxWidth: 320,
    height: 132,
    padding: 12,
    gap: 40,
    style: { fill: '#ffffff', stroke: '#d8deea', lineWidth: 1, cornerRadius: 8 }
  },
  image: { position: 'left', gap: 12 },
  title: commonTitle,
  content: commonContent,
  line: commonLine
});

// wing：椭圆弧时间线（参考残奥历史信息图），通过 layout.direction 切换左/右翅膀
const createWingSpec = (layout: StorylineLayoutType): IStorylineSpec => ({
  type: 'storyline',
  padding: [40, 40, 40, 40],
  data: buildData(layout),
  layout: { type: 'wing', direction: 'left' },
  themeColor,
  block: {
    widthRatio: 0.32,
    minWidth: 280,
    maxWidth: 360,
    padding: 20,
    style: { fill: '#ffffff', stroke: '#d8deea', lineWidth: 1, cornerRadius: 8 }
  },
  image: { width: 96, height: 96 },
  title: {
    style: {
      fontSize: 22,
      fontWeight: 800,
      lineHeight: 28,
      fill: themeColor
    }
  },
  content: {
    style: {
      fontSize: 12,
      lineHeight: 17,
      fill: '#1f2430'
    }
  },
  line: {
    visible: true,
    style: {
      // 丝带起点窄、终点宽，模拟信息图主脉络
      startWidth: 50,
      endWidth: 350
    } as any
  }
});

const specBuilderByLayout: Partial<Record<StorylineLayoutType, (layout: StorylineLayoutType) => IStorylineSpec>> = {
  landscape: createLandscapeSpec,
  portrait: createPortraitSpec,
  clock: createClockSpec,
  bowl: createBowlSpec,
  dome: createDomeSpec,
  wing: createWingSpec
};

const createSpec = (layout: StorylineLayoutType): IStorylineSpec => {
  const builder = specBuilderByLayout[layout] ?? createDefaultSpec;
  return builder(layout);
};

declare global {
  interface Window {
    vchart?: VChart;
  }
}

const run = () => {
  registerStorylineChart();

  const container = document.getElementById('chart') as HTMLElement;
  const toolbar = document.createElement('div');
  toolbar.style.cssText = 'position:absolute;left:16px;top:16px;z-index:1;font:12px sans-serif;';
  const select = document.createElement('select');
  layouts.forEach(layout => {
    const option = document.createElement('option');
    option.value = layout;
    option.textContent = layout;
    select.appendChild(option);
  });
  toolbar.appendChild(select);
  container?.parentElement?.appendChild(toolbar);

  let cs: VChart | undefined;

  const render = (layout: StorylineLayoutType) => {
    cs?.release();
    cs = new VChart(createSpec(layout) as any, {
      dom: container,
      onError: err => {
        console.error(err);
      }
    });
    cs.renderSync();
    window.vchart = cs;
  };

  select.value = layouts[6];
  render(select.value as StorylineLayoutType);

  select.addEventListener('change', () => {
    render(select.value as StorylineLayoutType);
  });
};

run();
