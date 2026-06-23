import { VChart } from '@visactor/vchart';
import { registerStorylineChart } from '../../../../src';
import type { IStorylineSpec, StorylineLayoutType } from '../../../../src/charts/storyline';

const layouts: StorylineLayoutType[] = ['landscape', 'portrait', 'ladder', 'spiral', 'clock', 'arc', 'wing'];

const SUB_IMAGE_URL = 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-2022.png';
const TITLE_IMAGE_URL = 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/title-world-cap.png';

const baseData = [
  {
    id: 'discover',
    title: 'Discover',
    content:
      'Collect the first signal and frame the story. Capture every relevant detail from the source material ' +
      'so the audience can reconstruct the same context the author had when starting the analysis.' +
      'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-1930.png',
    subImage: SUB_IMAGE_URL
  },
  {
    id: 'group',
    title: 'Group',
    content:
      'Arrange related facts into a compact block, removing duplicates and aligning each fragment ' +
      'to the central theme so readers can scan supporting evidence at a glance without losing context.' +
      'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-1930.png',
    subImage: SUB_IMAGE_URL
  },
  {
    id: 'connect',
    title: 'Connect',
    content:
      'Draw the reading path between blocks. Use repeating motifs, parallel sentence structures ' +
      'and visual cues to establish a continuous flow that walks the reader from premise to conclusion.' +
      'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-1930.png',
    subImage: SUB_IMAGE_URL
  },
  {
    id: 'emphasize',
    title: 'Emphasize',
    content:
      'Use image, title, and copy as one visual unit. Highlight the most important facts with typography ' +
      'weight, color contrast or motion so the eye instinctively returns to them while scanning.' +
      'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-1930.png',
    subImage: SUB_IMAGE_URL
  },
  {
    id: 'resolve',
    title: 'Resolve',
    content:
      'End with a clear takeaway. Summarize the lesson, point out the next decision the audience ' +
      'should make and remove any ambiguity so the story closes with a satisfying, actionable conclusion.' +
      'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-1930.png',
    subImage: SUB_IMAGE_URL
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
    // portrait 布局：附加 marker 时间节点（2012、2013…）以便沿中轴纵向展示
    const marker = layout === 'portrait' ? String(2012 + index) : undefined;
    return {
      ...seed,
      id: `${layout}-${index}-${seed.id}`,
      title: `${seed.title} ${index + 1}`,
      content: [`${seed.content}`, `Layout ${layout} / Block ${index + 1} of ${count}.`],
      ...(marker ? { marker } : {})
    };
  });
};

// 通用 title / content 样式（所有布局共享）
const commonTitle: IStorylineSpec['title'] = {
  style: {
    // fontSize: 14,
    // fill: '#1f2533',
    // fontWeight: 700
  }
};

const commonContent: IStorylineSpec['content'] = {
  style: {
    // fontSize: 12,
    // lineHeight: 17,
    // fill: '#596579'
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
const titleImage: IStorylineSpec['titleImage'] = {
  image: TITLE_IMAGE_URL
};

const WIDTH = 1920;
const HEIGHT = 1080;

// landscape：图片错落 + 贯穿曲线，block 含上下两个卡片，垂直空间更大
const createLandscapeSpec = (layout: StorylineLayoutType): IStorylineSpec => ({
  type: 'storyline',
  padding: 20,
  width: WIDTH,
  height: HEIGHT,
  data: buildData(layout),
  layout,
  titleImage,
  themeColor,
  line: commonLine,
  image: {
    showBackground: false
  }
});

// portrait：默认 block.height = regionHeight / count，imageHeight = blockHeight * 0.4，
// contentHeight = blockHeight * 0.6；底部 padding 默认 = contentHeight，由 transformer 自动应用。
const createPortraitSpec = (layout: StorylineLayoutType): IStorylineSpec => ({
  type: 'storyline',
  height: WIDTH,
  width: HEIGHT,
  data: buildData(layout),
  layout,
  titleImage,
  themeColor
});

// arc：弧形布局，通过 direction 切换 dome（'up'）/ bowl（'down'）
const createArcSpec = (layout: StorylineLayoutType): IStorylineSpec => ({
  type: 'storyline',
  padding: [50, 20, 100, 20],
  width: WIDTH,
  height: HEIGHT,
  data: buildData(layout),
  layout: { type: 'arc', direction: 'down' },
  titleImage,
  themeColor
});

// clock：环绕式时间线
const createClockSpec = (layout: StorylineLayoutType): IStorylineSpec => ({
  type: 'storyline',
  height: HEIGHT,
  width: WIDTH,
  padding: [20, 20, 50, 20],
  layout: 'clock',
  titleImage,
  themeColor,
  // background: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-1930.png',
  data: [
    {
      id: 'uruguay-1930',
      title: '首届世界杯诞生',
      content:
        '1930年7月，国际足联首届世界杯在乌拉圭蒙得维的亚开幕，仅有十三支球队参赛。' +
        '东道主乌拉圭借助世纪球场坐镇，决赛中以4比2逆转近邻阿根廷，捧起了雷米特金杯。' +
        '乌拉圭队队长纳萨齐高举奖杯的画面，从此奠定了世界杯作为全球足球最高荣誉的象征意义。',
      image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-1930.png'
    },
    {
      id: 'brazil-1958',
      title: '贝利天才登场',
      content:
        '1958年瑞典世界杯成为足球新王登基的舞台。年仅十七岁的贝利首次代表巴西出战，在四分之一决赛对威尔士贡献关键进球，半决赛对法国上演帽子戏法，决赛对东道主瑞典再度梅开二度，帮助巴西首夺世界杯冠军。',
      image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-1930.png'
    },
    {
      id: 'mexico-1986',
      title: '马拉多纳神迹',
      content:
        '1986年墨西哥世界杯由马拉多纳一人定义。四分之一决赛对英格兰，' +
        '他先用左手将球送入网窝制造『上帝之手』，紧接着又从中圈带球连过五人攻入世纪进球，' +
        '让阿根廷在马岛战争阴影下挣得舆论高地。半决赛对比利时再献两粒精彩入球，最终阿根廷3比2夺冠。',
      image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-1930.png'
    },
    {
      id: 'france-1998',
      title: '齐祖之夜法兰西',
      content:
        '1998年法国世界杯由东道主自己谱写童话。决赛在圣丹尼新落成的法兰西大球场进行，' +
        '齐达内两次起跳头槌破门，将卫冕冠军巴西打懵，最终法国3比0大胜首夺世界杯。' +
        '比赛终场哨响时，香榭丽舍大街涌入百万球迷，蓝白红的海洋与齐达内剪影一同映在凯旋门上。',
      image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-1930.png'
    },
    {
      id: 'germany-2014',
      title: '战车碾过马拉卡纳',
      content:
        '2014年巴西世界杯德国队成为最大赢家。半决赛德国在贝洛奥里藏特7比1血洗东道主巴西，决赛在传奇的马拉卡纳球场进行，加时赛第113分钟，戈策胸停凌空抽射打进绝杀，德国时隔24年再夺世界杯。',
      image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-1930.png'
    },
    {
      id: 'qatar-2022',
      title: '梅西终圆封王梦',
      content:
        '2022年卡塔尔世界杯成为首届在中东和北半球冬季举行的世界杯。决赛在卢赛尔体育场进行，' +
        '阿根廷与法国上演被誉为史上最经典的对决。梅西梅开二度，' +
        '姆巴佩则上演世界杯决赛六十五年来首个帽子戏法，常规及加时赛战成3比3。' +
        '点球大战中阿根廷4比2取胜。',
      image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-1930.png'
    }
  ]
});

const createDefaultSpec = (layout: StorylineLayoutType): IStorylineSpec => ({
  type: 'storyline',
  padding: 20,
  data: buildData(layout),
  layout,
  titleImage,
  themeColor,
  block: {
    widthRatio: 0.28,
    minWidth: 220,
    maxWidth: 320,
    height: 192,
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
  height: WIDTH,
  width: HEIGHT,
  data: buildData(layout),
  layout: { type: 'wing', direction: 'left' },
  titleImage,
  themeColor
});

// ladder：参考 Bauhaus 信息图 —— 中央倾斜大字 headline + 两侧错落 block
// 通过 layout.direction（'up' | 'down'）控制对角线方向
const createLadderSpec = (layout: StorylineLayoutType): IStorylineSpec => ({
  type: 'storyline',
  width: 1600,
  height: 900,
  padding: 20,
  layout: { type: 'ladder', direction: 'down', headline: 'ladder' },
  themeColor: '#C8102E',
  background: 'transparent',
  data: [
    {
      id: 'uruguay-1930',
      title: '首届世界杯诞生',
      content:
        '1930年7月，国际足联首届世界杯在乌拉圭蒙得维的亚开幕，仅有十三支球队参赛。' +
        '东道主乌拉圭坐镇世纪球场，决赛中以4比2逆转近邻阿根廷，捧起了雷米特金杯。',
      image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-1930.png'
    },
    {
      id: 'brazil-1958',
      title: '贝利天才登场',
      content:
        '1958年瑞典世界杯成为足球新王登基的舞台。年仅十七岁的贝利首次代表巴西出战，' +
        '在四分之一决赛对威尔士贡献关键进球，半决赛对法国上演帽子戏法，' +
        '决赛对东道主瑞典再度梅开二度，帮助巴西首夺世界杯冠军。',
      image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-1930.png'
    },
    {
      id: 'mexico-1986',
      title: '马拉多纳神迹',
      content:
        '1986年墨西哥世界杯由马拉多纳一人定义。四分之一决赛对英格兰，' +
        '他先用左手将球送入网窝制造『上帝之手』，紧接着又从中圈带球连过五人攻入世纪进球，' +
        '让阿根廷在马岛战争阴影下挣得舆论高地。',
      image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-1930.png'
    },
    {
      id: 'france-1998',
      title: '齐祖之夜法兰西',
      content:
        '1998年法国世界杯由东道主自己谱写童话。决赛在圣丹尼新落成的法兰西大球场进行，' +
        '齐达内两次起跳头槌破门，将卫冕冠军巴西打懵，最终法国3比0大胜首夺世界杯。',
      image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-1930.png'
    },
    {
      id: 'germany-2014',
      title: '战车碾过马拉卡纳',
      content:
        '2014年巴西世界杯德国队成为最大赢家。半决赛德国在贝洛奥里藏特7比1血洗东道主巴西，' +
        '决赛在传奇的马拉卡纳球场进行，加时赛第113分钟，戈策胸停凌空抽射打进绝杀，' +
        '德国时隔24年再夺世界杯。',
      image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-1930.png'
    },
    {
      id: 'qatar-2022',
      title: '梅西终圆封王梦',
      content:
        '2022年卡塔尔世界杯成为首届在中东和北半球冬季举行的世界杯。决赛在卢赛尔体育场进行，' +
        '阿根廷与法国上演被誉为史上最经典的对决。梅西梅开二度，' +
        '姆巴佩则上演世界杯决赛六十五年来首个帽子戏法，常规及加时赛战成3比3。' +
        '点球大战中阿根廷4比2取胜。',
      image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-1930.png'
    }
  ]
});

const specBuilderByLayout: Partial<Record<StorylineLayoutType, (layout: StorylineLayoutType) => IStorylineSpec>> = {
  landscape: createLandscapeSpec,
  portrait: createPortraitSpec,
  clock: createClockSpec,
  arc: createArcSpec,
  wing: createWingSpec,
  ladder: createLadderSpec
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

  select.value = 'clock';
  render(select.value as StorylineLayoutType);

  select.addEventListener('change', () => {
    render(select.value as StorylineLayoutType);
  });
};

run();
