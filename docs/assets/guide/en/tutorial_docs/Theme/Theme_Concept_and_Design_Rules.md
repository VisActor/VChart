# 主题概念和设计规范

The English version is working in progress.

## 主题简介

VChart 支持对图表主题的整体配置和复用。在概念上，VChart 主题主要由图表布局参数、图表样式以及数据色板组成。

在配置了合适主题的情况下，用户只需要在 spec 中声明**图表类型**、**图表数据**以及**图表结构**（比如要显示的系列和组件等），就可以渲染出符合设计规范和目标风格的图表。

在具体接口定义上，VChart 主题的配置包含以下几个部分：

- 主题信息（主题命名等）
- 图表层级样式（图表背景色、边距等）
- 全局样式（全局字体）
- 色板（包含数据色板、语义色板）
- 图元样式配置
- 系列样式配置
- 组件样式配置

在经验上，**色板**、**图元样式配置**、**组件样式配置**和**系列样式配置**是一个定义一个新主题最基本的配置。

## VChart 默认主题构成

VChart 默认主题的预设可以分为以下几部分：

### 数据色板

<img style="max-width: 600px" src="/vchart/guide/theme/0.png" alt="color scheme">

数据色板是在图表中用于区分数据组的离散色板，也通常用于区分图例项。如以下两个图表中不同数据组的色板，在颜色队列中按顺序取色：

<div style="display: flex; max-width: 800px">
  <img style="padding: 5px; width: 50%;" src="/vchart/guide/theme/1.png" alt="line chart">
  <img style="padding: 5px; width: 50%;" src="/vchart/guide/theme/2.png" alt="bar chart">
</div>

数据色板也可以是动态的、渐进式的。比如默认色板会根据数据项数量的范围来动态调整：

<img style="max-width: 600px" src="/vchart/guide/theme/3.png" alt="color scheme">

如以上规则，数据组不超过 10 个时，采用 10 色的色板；数据组超过 10 个时，采用 20 色的色板。如果数据组超过 20 个，则会重复应用色板颜色，从第 1 个开始。

### 语义色板

VChart 默认主题定义了一套语义色板，用于描述可以复用的颜色。语义色板的形式为从 token 到色值的映射表。

默认主题预设了一套 token，并根据这套 token 实现了亮色主题和暗色主题。下表以 1.6.3 版本为准：

<table>
  <tbody>
    <tr>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0">分类</div></td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0">序号</div></td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0">token（默认主题的语义色板）</div></td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0">描述、应用范围和默认色值</div></td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0">实际 case（截图来自默认主题真实图表）</div></td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="5" colspan="1"><div style="margin: 14px 0">图表层级样式</div></td>
      <td rowspan="4" colspan="1"><div style="margin: 14px 0; text-align: center">1</div></td>
      <td rowspan="4" colspan="1">
        <div style="margin: 14px 0"><code>backgroundColor</code></div>
      </td>
      <td rowspan="4" colspan="1">
        <div style="margin: 14px 0"><b>背景色</b></div>
        <div style="margin: 14px 0">用于图表背景、图元描边。</div>
        <div style="margin: 14px 0; display: flex">
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">light</div>
            <div
              style="
                background: #ffffff;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#ffffff</div>
          </div>
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">dark</div>
            <div
              style="
                background: #202226;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#202226</div>
          </div>
        </div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">图表背景色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/line-chart-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/line-chart-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">point 图元描边颜色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/point-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/point-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">数据标签描边颜色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/bar-chart-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/bar-chart-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">播放器滑块描边颜色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/player-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/player-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0; text-align: center">2</div></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0"><code>borderColor</code></div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0"><b>图表边框色</b></div>
        <div style="margin: 14px 0">用于图表边框（图表内暂时没有实际应用，仅有指导意义）。</div>
        <div style="margin: 14px 0; display: flex">
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">light</div>
            <div
              style="
                background: #e3e5e8;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#e3e5e8</div>
          </div>
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">dark</div>
            <div
              style="
                background: #404349;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#404349</div>
          </div>
        </div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">图表边框色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/line-chart-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/line-chart-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="15" colspan="1"><div style="margin: 14px 0">公共</div></td>
      <td rowspan="3" colspan="1"><div style="margin: 14px 0; text-align: center">3</div></td>
      <td rowspan="3" colspan="1">
        <div style="margin: 14px 0"><code>shadowColor</code></div>
      </td>
      <td rowspan="3" colspan="1">
        <div style="margin: 14px 0"><b>默认阴影颜色</b></div>
        <div style="margin: 14px 0">用于浮层、滑块等带高度属性的图元阴影。</div>
        <div style="margin: 14px 0; display: flex">
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">light</div>
            <div
              style="
                background: rgba(33, 37, 44, 0.1);
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">rgba(33,37,44,0.1)</div>
          </div>
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">dark</div>
            <div
              style="
                background: rgba(0, 0, 0, 0.1);
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">rgba(0,0,0,0.1)</div>
          </div>
        </div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">提示信息阴影颜色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/tooltip-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/tooltip-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">poptip 阴影颜色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/heatmap-chart-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/heatmap-chart-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">颜色图例滑块阴影颜色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 100px" src="/vchart/guide/theme/color-legend-light.png" alt="light" />
          <img style="max-width: 100px" src="/vchart/guide/theme/color-legend-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0; text-align: center">4</div></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0"><code>hoverBackgroundColor</code></div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0"><b>鼠标 Hover 背景颜色</b></div>
        <div style="margin: 14px 0">用于元素在鼠标 hover 状态的背景颜色。</div>
        <div style="margin: 14px 0; display: flex">
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">light</div>
            <div
              style="
                background: #f1f2f5;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#f1f2f5</div>
          </div>
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">dark</div>
            <div
              style="
                background: #404349;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#404349</div>
          </div>
        </div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">图例项 hover 背景色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/pie-chart-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/pie-chart-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="4" colspan="1"><div style="margin: 14px 0; text-align: center">5</div></td>
      <td rowspan="4" colspan="1">
        <div style="margin: 14px 0"><code>sliderRailColor</code></div>
      </td>
      <td rowspan="4" colspan="1">
        <div style="margin: 14px 0"><b>滑块类组件背景条填充颜色</b></div>
        <div style="margin: 14px 0">用于滑块类组件背景条的填充颜色。</div>
        <div style="margin: 14px 0; display: flex">
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">light</div>
            <div
              style="
                background: #f1f3f4;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#f1f3f4</div>
          </div>
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">dark</div>
            <div
              style="
                background: #404349;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#404349</div>
          </div>
        </div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">缩略轴背景区域颜色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/column-chart-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/column-chart-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">播放器未播放轨道颜色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/player-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/player-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">颜色图例轨道颜色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 100px" src="/vchart/guide/theme/color-legend-light.png" alt="light" />
          <img style="max-width: 100px" src="/vchart/guide/theme/color-legend-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">尺寸图例轨道颜色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 100px" src="/vchart/guide/theme/size-legend-light.png" alt="light" />
          <img style="max-width: 100px" src="/vchart/guide/theme/size-legend-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="2" colspan="1"><div style="margin: 14px 0; text-align: center">6</div></td>
      <td rowspan="2" colspan="1">
        <div style="margin: 14px 0"><code>sliderHandleColor</code></div>
      </td>
      <td rowspan="2" colspan="1">
        <div style="margin: 14px 0"><b>滑块类组件滑块填充颜色</b></div>
        <div style="margin: 14px 0">用于滑块类组件滑块的填充颜色。</div>
        <div style="margin: 14px 0; display: flex">
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">light</div>
            <div
              style="
                background: #ffffff;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#ffffff</div>
          </div>
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">dark</div>
            <div
              style="
                background: #202226;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#202226</div>
          </div>
        </div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">缩略轴滑块填充颜色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/column-chart-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/column-chart-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">尺寸图例滑块填充颜色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 100px" src="/vchart/guide/theme/size-legend-light.png" alt="light" />
          <img style="max-width: 100px" src="/vchart/guide/theme/size-legend-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="3" colspan="1"><div style="margin: 14px 0; text-align: center">7</div></td>
      <td rowspan="3" colspan="1">
        <div style="margin: 14px 0"><code>sliderTrackColor</code></div>
      </td>
      <td rowspan="3" colspan="1">
        <div style="margin: 14px 0"><b>滑块类组件已选范围填充颜色</b></div>
        <div style="margin: 14px 0">用于滑块类组件已选范围的填充颜色。</div>
        <div style="margin: 14px 0; display: flex">
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">light</div>
            <div
              style="
                background: #0040ff;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#0040ff</div>
          </div>
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">dark</div>
            <div
              style="
                background: #4284ff;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#4284FF</div>
          </div>
        </div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">缩略轴选择区域颜色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/column-chart-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/column-chart-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">播放器已播放轨道颜色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/player-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/player-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">尺寸图例选中部分轨道颜色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 100px" src="/vchart/guide/theme/size-legend-light.png" alt="light" />
          <img style="max-width: 100px" src="/vchart/guide/theme/size-legend-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="2" colspan="1"><div style="margin: 14px 0; text-align: center">8</div></td>
      <td rowspan="2" colspan="1">
        <div style="margin: 14px 0"><code>popupBackgroundColor</code></div>
      </td>
      <td rowspan="2" colspan="1">
        <div style="margin: 14px 0"><b>浮层背景区域颜色</b></div>
        <div style="margin: 14px 0">用于浮层的背景区域颜色。</div>
        <div style="margin: 14px 0; display: flex">
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">light</div>
            <div
              style="
                background: #ffffff;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#ffffff</div>
          </div>
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">dark</div>
            <div
              style="
                background: #404349;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#404349</div>
          </div>
        </div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">提示信息背景框颜色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/tooltip-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/tooltip-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">poptip 背景框颜色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/heatmap-chart-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/heatmap-chart-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="17" colspan="1"><div style="margin: 14px 0">字体颜色</div></td>
      <td rowspan="8" colspan="1"><div style="margin: 14px 0; text-align: center">9</div></td>
      <td rowspan="8" colspan="1">
        <div style="margin: 14px 0"><code>primaryFontColor</code></div>
      </td>
      <td rowspan="8" colspan="1">
        <div style="margin: 14px 0"><b>主要字色</b></div>
        <div style="margin: 14px 0">颜色和背景色差异最大的字色，用于最显要的信息展示。</div>
        <div style="margin: 14px 0; display: flex">
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">light</div>
            <div
              style="
                background: #21252c;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#21252c</div>
          </div>
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">dark</div>
            <div
              style="
                background: #fdfdfd;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#fdfdfd</div>
          </div>
        </div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">图表主标题字色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/line-chart-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/line-chart-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">指标卡主要字色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/gauge-chart-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/gauge-chart-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">poptip 标题字色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/heatmap-chart-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/heatmap-chart-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">poptip 内容字色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/heatmap-chart-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/heatmap-chart-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">提示信息标题字色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/tooltip-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/tooltip-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">Mark-line 标签字色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/mark-line-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/mark-line-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">Mark-area 标签字色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/mark-area-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/mark-area-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">图例标题字色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/pie-chart-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/pie-chart-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="4" colspan="1"><div style="margin: 14px 0; text-align: center">10</div></td>
      <td rowspan="4" colspan="1">
        <div style="margin: 14px 0"><code>secondaryFontColor</code></div>
      </td>
      <td rowspan="4" colspan="1">
        <div style="margin: 14px 0"><b>次要字色</b></div>
        <div style="margin: 14px 0">颜色和背景色差异较小的字色，用于次要的信息展示。</div>
        <div style="margin: 14px 0; display: flex">
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">light</div>
            <div
              style="
                background: #606773;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#606773</div>
          </div>
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">dark</div>
            <div
              style="
                background: #888c93;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#888c93</div>
          </div>
        </div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">轴标题字色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/line-chart-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/line-chart-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">图例标签字色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/pie-chart-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/pie-chart-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">提示信息数据 key 字色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/tooltip-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/tooltip-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">缩略轴标签字色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/column-chart-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/column-chart-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="2" colspan="1"><div style="margin: 14px 0; text-align: center">11</div></td>
      <td rowspan="2" colspan="1">
        <div style="margin: 14px 0"><code>tertiaryFontColor</code></div>
      </td>
      <td rowspan="2" colspan="1">
        <div style="margin: 14px 0"><b>第三字色</b></div>
        <div style="margin: 14px 0">颜色和背景色差异更小的字色，用于更次要的信息展示。</div>
        <div style="margin: 14px 0; display: flex">
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">light</div>
            <div
              style="
                background: #89909d;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#89909d</div>
          </div>
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">dark</div>
            <div
              style="
                background: #bbbdc3;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#bbbdc3</div>
          </div>
        </div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">图表副标题字色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/line-chart-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/line-chart-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">指标卡次要字色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/gauge-chart-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/gauge-chart-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0; text-align: center">12</div></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0"><code>axisLabelFontColor</code></div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0"><b>轴标签字色</b></div>
        <div style="margin: 14px 0">用于轴标签字色，默认与第三字色颜色相同。</div>
        <div style="margin: 14px 0; display: flex">
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">light</div>
            <div
              style="
                background: #89909d;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#89909d</div>
          </div>
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">dark</div>
            <div
              style="
                background: #bbbdc3;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#bbbdc3</div>
          </div>
        </div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">轴标签字色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/line-chart-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/line-chart-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0; text-align: center">13</div></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0"><code>disableFontColor</code></div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0"><b>禁用字色</b></div>
        <div style="margin: 14px 0">用于禁用状态字色或非激活态字色。</div>
        <div style="margin: 14px 0; display: flex">
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">light</div>
            <div
              style="
                background: #bcc1cb;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#bcc1cb</div>
          </div>
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">dark</div>
            <div
              style="
                background: #55595f;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#55595f</div>
          </div>
        </div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">非激活态图例标签字色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/pie-chart-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/pie-chart-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0; text-align: center">14</div></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0"><code>axisMarkerFontColor</code></div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0"><b>轴高亮标记字色</b></div>
        <div style="margin: 14px 0">用于轴标签上的高亮标记字色。</div>
        <div style="margin: 14px 0; display: flex">
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">light</div>
            <div
              style="
                background: #ffffff;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#ffffff</div>
          </div>
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">dark</div>
            <div
              style="
                background: #202226;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#202226</div>
          </div>
        </div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">十字准星标签字色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/tooltip-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/tooltip-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="3" colspan="1"><div style="margin: 14px 0">轴样式</div></td>
      <td rowspan="2" colspan="1"><div style="margin: 14px 0; text-align: center">15</div></td>
      <td rowspan="2" colspan="1">
        <div style="margin: 14px 0"><code>axisGridColor</code></div>
      </td>
      <td rowspan="2" colspan="1">
        <div style="margin: 14px 0"><b>轴网格线颜色</b></div>
        <div style="margin: 14px 0">用于轴网格线颜色以及同级的颜色。</div>
        <div style="margin: 14px 0; display: flex">
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">light</div>
            <div
              style="
                background: #f1f2f5;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#f1f2f5</div>
          </div>
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">dark</div>
            <div
              style="
                background: #404349;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#404349</div>
          </div>
        </div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">轴网格线颜色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/line-chart-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/line-chart-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">十字准星矩形颜色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/tooltip-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/tooltip-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0; text-align: center">16</div></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0"><code>axisDomainColor</code></div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0"><b>轴线颜色</b></div>
        <div style="margin: 14px 0">用于轴线颜色以及同级的颜色。</div>
        <div style="margin: 14px 0; display: flex">
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">light</div>
            <div
              style="
                background: #d9dde4;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#d9dde4</div>
          </div>
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">dark</div>
            <div
              style="
                background: #4b4f54;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#4b4f54</div>
          </div>
        </div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">轴线颜色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/line-chart-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/line-chart-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="3" colspan="1"><div style="margin: 14px 0">缩略轴</div></td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0; text-align: center">17</div></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0"><code>dataZoomHandlerStrokeColor</code></div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0"><b>缩略轴滑块描边颜色</b></div>
        <div style="margin: 14px 0">用于缩略轴滑块描边颜色以及同级的颜色。</div>
        <div style="margin: 14px 0; display: flex">
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">light</div>
            <div
              style="
                background: #aeb5be;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#aeb5be</div>
          </div>
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">dark</div>
            <div
              style="
                background: #888c93;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#888c93</div>
          </div>
        </div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">缩略轴滑块描边颜色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/column-chart-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/column-chart-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="2" colspan="1"><div style="margin: 14px 0; text-align: center">18</div></td>
      <td rowspan="2" colspan="1">
        <div style="margin: 14px 0"><code>dataZoomChartColor</code></div>
      </td>
      <td rowspan="2" colspan="1">
        <div style="margin: 14px 0"><b>缩略轴图表区域颜色</b></div>
        <div style="margin: 14px 0">用于缩略轴预览图表的颜色以及同级的颜色。</div>
        <div style="margin: 14px 0; display: flex">
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">light</div>
            <div
              style="
                background: #c9ced8;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#c9ced8</div>
          </div>
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">dark</div>
            <div
              style="
                background: #55595f;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#55595F</div>
          </div>
        </div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">缩略轴图表区域颜色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/column-chart-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/column-chart-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">尺寸图例尺寸标识颜色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 100px" src="/vchart/guide/theme/size-legend-light.png" alt="light" />
          <img style="max-width: 100px" src="/vchart/guide/theme/size-legend-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="2" colspan="1"><div style="margin: 14px 0">播放器</div></td>
      <td rowspan="2" colspan="1"><div style="margin: 14px 0; text-align: center">19</div></td>
      <td rowspan="2" colspan="1">
        <div style="margin: 14px 0"><code>playerControllerColor</code></div>
      </td>
      <td rowspan="2" colspan="1">
        <div style="margin: 14px 0"><b>播放器控制器填充颜色</b></div>
        <div style="margin: 14px 0">用于播放器控制器的填充颜色。</div>
        <div style="margin: 14px 0; display: flex">
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">light</div>
            <div
              style="
                background: #0040ff;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#0040ff</div>
          </div>
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">dark</div>
            <div
              style="
                background: #0040ff;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#0040ff</div>
          </div>
        </div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">播放器按钮颜色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/player-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/player-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">播放器滑块颜色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/player-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/player-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1"><div style="margin: 14px 0">滚动条</div></td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0; text-align: center">20</div></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0"><code>scrollBarSliderColor</code></div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0"><b>滚动条滑块颜色</b></div>
        <div style="margin: 14px 0">用于滚动条滑块的填充颜色。</div>
        <div style="margin: 14px 0; display: flex">
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">light</div>
            <div
              style="
                background: rgba(0, 0, 0, 0.3);
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">rgba(0,0,0,0.3)</div>
          </div>
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">dark</div>
            <div
              style="
                background: rgba(255, 255, 255, 0.3);
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">rgba(255,255,255,0.3)</div>
          </div>
        </div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">滚动条滑块颜色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/scroll-bar-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/scroll-bar-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="6" colspan="1"><div style="margin: 14px 0">标注</div></td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0; text-align: center">21</div></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0"><code>axisMarkerBackgroundColor</code></div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0"><b>轴高亮标记背景色</b></div>
        <div style="margin: 14px 0">用于轴标签上的高亮标记背景色。</div>
        <div style="margin: 14px 0; display: flex">
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">light</div>
            <div
              style="
                background: #21252c;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#21252c</div>
          </div>
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">dark</div>
            <div
              style="
                background: #fdfdfd;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#fdfdfd</div>
          </div>
        </div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">十字准星标签背景色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/tooltip-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/tooltip-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="2" colspan="1"><div style="margin: 14px 0; text-align: center">22</div></td>
      <td rowspan="2" colspan="1">
        <div style="margin: 14px 0"><code>markLabelBackgroundColor</code></div>
      </td>
      <td rowspan="2" colspan="1">
        <div style="margin: 14px 0"><b>标注标签背景颜色</b></div>
        <div style="margin: 14px 0">用于普通标注标签的背景颜色。</div>
        <div style="margin: 14px 0; display: flex">
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">light</div>
            <div
              style="
                background: #f1f2f5;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#f1f2f5</div>
          </div>
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">dark</div>
            <div
              style="
                background: #404349;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#404349</div>
          </div>
        </div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">Mark-line 标签背景色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/mark-line-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/mark-line-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">Mark-area 标签背景色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/mark-area-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/mark-area-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="3" colspan="1"><div style="margin: 14px 0; text-align: center">23</div></td>
      <td rowspan="3" colspan="1">
        <div style="margin: 14px 0"><code>markLineStrokeColor</code></div>
      </td>
      <td rowspan="3" colspan="1">
        <div style="margin: 14px 0"><b>标注线颜色</b></div>
        <div style="margin: 14px 0">用于普通标注线的颜色。</div>
        <div style="margin: 14px 0; display: flex">
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">light</div>
            <div
              style="
                background: #606773;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#606773</div>
          </div>
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">dark</div>
            <div
              style="
                background: #888c93;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#888c93</div>
          </div>
        </div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">Mark-line 线条颜色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/mark-line-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/mark-line-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">十字准星线形颜色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/tooltip-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/tooltip-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">Mark-point 线条颜色</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/mark-point-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/mark-point-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="4" colspan="1"><div style="margin: 14px 0">功能色</div></td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0; text-align: center">24</div></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0"><code>dangerColor</code></div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0"><b>危险色</b></div>
        <div style="margin: 14px 0">危险、错误、失败、盈利、上升、女性。</div>
        <div style="margin: 14px 0; display: flex">
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">light</div>
            <div
              style="
                background: #e33232;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#e33232</div>
          </div>
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">dark</div>
            <div
              style="
                background: #eb4b4b;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#eb4b4b</div>
          </div>
        </div>
      </td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0">无内置应用场景</div></td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0; text-align: center">25</div></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0"><code>warningColor</code></div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0"><b>警告色</b></div>
        <div style="margin: 14px 0">预警、警示。</div>
        <div style="margin: 14px 0; display: flex">
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">light</div>
            <div
              style="
                background: #ffc528;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#ffc528</div>
          </div>
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">dark</div>
            <div
              style="
                background: #f0bd30;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#f0bd30</div>
          </div>
        </div>
      </td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0">无内置应用场景</div></td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0; text-align: center">26</div></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0"><code>successColor</code></div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0"><b>成功色</b></div>
        <div style="margin: 14px 0">安全、正确、成功、亏损、下降。</div>
        <div style="margin: 14px 0; display: flex">
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">light</div>
            <div
              style="
                background: #07a35a;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#07a35a</div>
          </div>
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">dark</div>
            <div
              style="
                background: #14b267;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#14b267</div>
          </div>
        </div>
      </td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0">无内置应用场景</div></td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0; text-align: center">27</div></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0"><code>infoColor</code></div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0"><b>信息色</b></div>
        <div style="margin: 14px 0">正常、寒冷、男性。</div>
        <div style="margin: 14px 0; display: flex">
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">light</div>
            <div
              style="
                background: #3073f2;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#3073f2</div>
          </div>
          <div style="width: 50%; text-align: center; font-size: 12px">
            <div style="margin: 5px">dark</div>
            <div
              style="
                background: #4284ff;
                border-radius: 5px;
                height: 30px;
                margin: 5px;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
              "
            ></div>
            <div style="margin: 5px">#4284ff</div>
          </div>
        </div>
      </td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0">无内置应用场景</div></td>
    </tr>
  </tbody>
</table>

VChart 主题模块支持自定义语义色板，同时可以定义新的 token 集合，在主题或 spec 各处引用 token 以引用对应颜色，具体详见“色板”一节。

### 字色与字阶

在默认主题中，文字色大致分以下四档，具体应用可见上文的 token 列表。

<img style="max-width: 600px" src="/vchart/guide/theme/text-color.png" alt="text color">

同时，字号和行间距在官方主题中分为以下 6 阶：

<table>
  <tbody>
    <tr style="background: none">
      <td rowspan="1" colspan="1"><div style="margin: 14px 0">字阶</div></td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0">字重</div></td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0">字号</div></td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0">行高（仅作指导意义）</div></td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0">字间距（仅作指导意义）</div></td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0">应用范围（截图来自实际图表）</div></td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">1</div>
      </td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0">Medium</div></td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0">32px</div></td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0">1.5</div></td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0">-0.5</div></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">指标卡标题</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/gauge-chart-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/gauge-chart-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">2</div>
      </td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0">Medium</div></td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0">20px</div></td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0">1.4</div></td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0">-0.4</div></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">指标卡内容</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/gauge-chart-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/gauge-chart-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">3</div>
      </td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0">Medium</div></td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0">16px</div></td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0">1.5</div></td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0">-0.2</div></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">图表标题</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/line-chart-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/line-chart-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="5" colspan="1">
        <div style="margin: 14px 0">4（默认）</div>
      </td>
      <td rowspan="5" colspan="1"><div style="margin: 14px 0">Medium</div></td>
      <td rowspan="5" colspan="1"><div style="margin: 14px 0">14px</div></td>
      <td rowspan="5" colspan="1"><div style="margin: 14px 0">1.5</div></td>
      <td rowspan="5" colspan="1"><div style="margin: 14px 0">0</div></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">数据标签</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/bar-chart-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/bar-chart-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">Mark-line 标签</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/mark-line-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/mark-line-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">Mark-area 标签</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/mark-area-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/mark-area-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">提示信息</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/tooltip-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/tooltip-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">图表副标题</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/line-chart-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/line-chart-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="10" colspan="1">
        <div style="margin: 14px 0">5</div>
      </td>
      <td rowspan="10" colspan="1"><div style="margin: 14px 0">Regular</div></td>
      <td rowspan="10" colspan="1"><div style="margin: 14px 0">12px</div></td>
      <td rowspan="10" colspan="1"><div style="margin: 14px 0">1.3</div></td>
      <td rowspan="10" colspan="1"><div style="margin: 14px 0">0</div></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">poptip</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/heatmap-chart-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/heatmap-chart-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">图例标题</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/pie-chart-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/pie-chart-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">图例标签</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/pie-chart-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/pie-chart-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">颜色图例标签</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 100px" src="/vchart/guide/theme/color-legend-light.png" alt="light" />
          <img style="max-width: 100px" src="/vchart/guide/theme/color-legend-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">尺寸图例标签</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 100px" src="/vchart/guide/theme/size-legend-light.png" alt="light" />
          <img style="max-width: 100px" src="/vchart/guide/theme/size-legend-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr class="row--1000172" data-index="14">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">缩略轴标签</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/column-chart-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/column-chart-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">十字准星标签</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/tooltip-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/tooltip-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">轴标题</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/line-chart-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/line-chart-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">轴标签</div>
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/line-chart-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/line-chart-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1" style="display: none"></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">一些其他系列的标签，如：时序图、旭日图、矩形树图、嵌套圆图系列等</div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">6</div>
      </td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0">Regular</div></td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0">10px</div></td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0">1.2</div></td>
      <td rowspan="1" colspan="1"><div style="margin: 14px 0">0</div></td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">地图标签</div>
      </td>
    </tr>
  </tbody>
</table>

### 组件布局

默认主题规范中定义了组件和图表的布局参数。下面以带图例的图表在 pc 端的布局参数为例：

<img style="max-width: 600px" src="/vchart/guide/theme/layout-0.png" alt="color scheme">

<img style="max-width: 600px" src="/vchart/guide/theme/layout-1.png" alt="color scheme">

<img style="max-width: 600px" src="/vchart/guide/theme/layout-2.png" alt="color scheme">

<img style="max-width: 600px" src="/vchart/guide/theme/layout-3.png" alt="color scheme">

目前默认主题中高频组件的布局参数如下：

<table>
  <tbody>
    <tr style="background: none">
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">图表元素（组件）</div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">位置和对齐</div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">边距（padding）</div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">示例</div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">图表整体</div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">无</div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0"><code>20 20 20 20</code></div>
      </td>
      <td rowspan="3" colspan="1">
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/line-chart-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/line-chart-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">标题</div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">top，左对齐</div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0"><code>4 0 20 0</code></div>
      </td>
      <td rowspan="1" colspan="1" style="display: none"></td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">离散图例</div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">bottom，居中对齐</div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0"><code>16 24 16 24</code></div>
      </td>
      <td rowspan="1" colspan="1" style="display: none"></td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">缩略轴</div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">跟随轴</div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0"><code>12 0 12 0</code></div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/column-chart-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/column-chart-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">颜色图例</div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">right，竖直居中对齐</div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0"><code>16 24 16 24</code></div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/heatmap-chart-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/heatmap-chart-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">尺寸图例</div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">right，竖直居中对齐</div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0"><code>16 24 16 24</code></div>
      </td>
      <td rowspan="2" colspan="1">
        <div style="margin: 14px 0; display: flex; justify-content: center; max-width: 400px">
          <img style="max-width: 50%" src="/vchart/guide/theme/scatter-chart-light.png" alt="light" />
          <img style="max-width: 50%" src="/vchart/guide/theme/scatter-chart-dark.png" alt="dark" />
        </div>
      </td>
    </tr>
    <tr style="background: none; vertical-align: top">
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">播放器</div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0">bottom，左对齐</div>
      </td>
      <td rowspan="1" colspan="1">
        <div style="margin: 14px 0"><code>20 0 20 0</code></div>
      </td>
      <td rowspan="1" colspan="1" style="display: none"></td>
    </tr>
  </tbody>
</table>

## 扩展主题 ABC

如果面向一个新的设计规范扩展 VChart 主题，需要解决哪些可能的问题？

### 1. 产出一套或多套数据色板

通常面向组件库的设计规范并不会直接对图表的数据色板形成指导，因此这个问题可能是最复杂的。新的数据色板需要满足以下要求：

1. 色板符合目标设计规范，符合目标业务场景的调性
2. 色板颜色足够多（通常 10 种颜色左右或更多）
3. 相邻颜色区分度强，图表展现效果好
4. 色板整体符合某个特定的风格
5. 可访问性强，如对色弱人士友好等

数据色板是一个图表主题最容易被直观感受到的部分，因此尤为重要。

### 2. 将目标设计规范的 token 翻译为图表语义色板 token

目前默认主题的语义色板中的颜色是由 Arco Design 定义的颜色转化而来，其中很多颜色可以用 Arco Design 的 token 来表示。

如果要面向新的设计规范扩展图表主题，也需要经历这个步骤，即用目标设计规范定义的颜色来填充上文中语义色板的表格，或者直接定义新的 token 集合（如果这个设计规范下有现成的图表 demo，将会大大方便这一步骤）。

### 3. 图表组件定制与布局调整

在新的设计规范所对应的业务场景中，可能会对部分组件的样式有定制需求。这时需要收集具体需求并在主题中进行定制。

图表布局往往也需要根据业务场景的特点进行调整。

### 4. 交互效果、跨端

默认交互效果以及跨端优化也有很大一部分可以通过图表主题来配置，属于对主题进一步的定制。这部分同样需要收集具体需求和已经落地的案例，在主题中抽象出最佳实践并进行沉淀。

下一节将详细讲述 VChart 的主题配置功能。
