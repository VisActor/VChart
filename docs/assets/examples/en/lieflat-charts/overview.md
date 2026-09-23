---
category: examples
group: lieflat charts
title: Lieflat infographic examples
order: -1
cover: /vchart/preview/lieflat-charts-rung-bars.png
---

# Lieflat infographic examples

**43 VChart infographic examples** inspired by [Lieflat Charts](https://github.com/larashero3-dotcom/lieflat-charts). Hairlines, countable units and editorial spacing are retained; colors follow the active theme. Every example provides standalone code; original identifiers are preserved.

## Animation and usage

Every example explicitly enables `animation: true` and starts its entrance automatically. Custom layouts show text first, followed by staggered marks over about 1.1 seconds. Native charts retain their entrance animations. Bar race and cumulative growth use autoplaying native players with pause, seek and lifecycle cleanup. Gallery covers are static; open an example to see motion.

For static output, set `animation: false`; examples with a player also require `player.auto: false` and selection of the desired time frame. All business values are simulated, with units and encodings explained in each example. Maps load the documentation site’s GeoJSON sources and require network access.

## Theme and data separation

All 43 examples inherit the active VChart theme. Use `vchart.setCurrentTheme(name)` at runtime without rebuilding the chart or recomputing business data. Background, text, grids, categorical colors and tooltips use separate theme roles. Native axes, legends and players inherit their component themes. Custom marks cache resolved colors until the theme changes.

Categorical charts use `colorScheme.default.dataScheme`. Calendar heatmaps and maps derive an ordered ramp from the first data color toward the background. Map regions and their continuous legend share the same scale; missing observations use the grid color and remain distinct from zero. Treemap labels use `smartInvert`. Dot cascade and Circular network also inherit the background instead of forcing a dark canvas.

Register a theme, then switch the instance. The documentation playground exposes `VCHART_MODULE`; in a project, import it from `@visactor/vchart`.

```javascript
// 原始纸灰风格同样作为主题注册。
VChart.ThemeManager.registerTheme('lieflat-paper', {
  colorScheme: {
    default: {
      dataScheme: ['#1c1c1a', '#4a4944', '#6a6963', '#8f8e88', '#b0afa9', '#c6c5bf'],
      palette: {
        backgroundColor: '#f0efeb',
        primaryFontColor: '#1c1c1a',
        secondaryFontColor: '#62625c',
        axisLabelFontColor: '#62625c',
        axisGridColor: '#deddd6',
        borderColor: '#b0afa9',
        popupBackgroundColor: '#f0efeb',
        disableFontColor: '#c6c5bf'
      }
    }
  }
});

// 深色主题需要先注册。
VChart.ThemeManager.registerTheme('lieflat-dark', VCHART_MODULE.darkTheme);

// 彩色主题：同时指定数据色与文字/背景角色。
VChart.ThemeManager.registerTheme('lieflat-color', {
  colorScheme: {
    default: {
      dataScheme: ['#006c67', '#d85b31', '#5b56ad', '#c18b22', '#297caf', '#a63e6e'],
      palette: {
        backgroundColor: '#fffaf0',
        primaryFontColor: '#283b3a',
        secondaryFontColor: '#566b68',
        axisLabelFontColor: '#566b68',
        axisGridColor: '#e0e6de',
        popupBackgroundColor: '#fffaf0',
        borderColor: '#d5ddd5'
      }
    }
  }
});

await vchart.setCurrentTheme('lieflat-dark');
// await vchart.setCurrentTheme('lieflat-paper');
// await vchart.setCurrentTheme('lieflat-color');
// await vchart.setCurrentTheme('light');
```

Use `VChart.ThemeManager.setCurrentTheme(name)` before constructing charts to set the application theme. No fixed `spec.theme` or constructor theme overrides this setting. Custom themes should pair distinct data colors with readable text and background colors; changing only `background` does not create a complete dark theme. Covers retain the original paper/dark reference appearance; live examples follow the active theme.

## Preview

| Preview                                                                                                                           | Preview                                                                                                                            |
| --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| [![F1 · Rung bars](/vchart/preview/lieflat-charts-rung-bars.png)](/vchart/examples/lieflat-charts/rung-bars)                      | [![F4 · Tick donut](/vchart/preview/lieflat-charts-tick-donut.png)](/vchart/examples/lieflat-charts/tick-donut)                    |
| [![L1 · Launch fan](/vchart/preview/lieflat-charts-launch-fan.png)](/vchart/examples/lieflat-charts/launch-fan)                   | [![L2 · Dot cascade](/vchart/preview/lieflat-charts-dot-cascade.png)](/vchart/examples/lieflat-charts/dot-cascade)                 |
| [![G5 · Pictorial forest](/vchart/preview/lieflat-charts-pictorial-forest.png)](/vchart/examples/lieflat-charts/pictorial-forest) | [![L13 · Hourglass stream](/vchart/preview/lieflat-charts-hourglass-stream.png)](/vchart/examples/lieflat-charts/hourglass-stream) |

## Amounts and comparisons（12）

Rungs, ticks, beads and pictograms suit rankings, comparisons and outcome summaries.

| Example                                                                   | Encoding                                                             |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| [F1 · Rung bars](/vchart/examples/lieflat-charts/rung-bars)               | Revenue by plan · one rung = $1k MRR                                 |
| [F5 · Tick rows](/vchart/examples/lieflat-charts/tick-rows)               | Six teams, shipped and counted · one tick = one release              |
| [F6 · Paired rungs](/vchart/examples/lieflat-charts/paired-rungs)         | This year against last · one rung = $1k · left = 2025 · right = 2026 |
| [F7 · Stacked rungs](/vchart/examples/lieflat-charts/stacked-rungs)       | Regional revenue mix · CORE / API / ADD-ONS · one rung = $1k         |
| [F9 · Rung waterfall](/vchart/examples/lieflat-charts/rung-waterfall)     | From gross to net · one rung = $1k                                   |
| [F12 · Dumbbell queue](/vchart/examples/lieflat-charts/dumbbell-queue)    | Onboarding before and after · one bead = one minute saved            |
| [L2 · Dot cascade](/vchart/examples/lieflat-charts/dot-cascade)           | What breaks, stacked and ranked · one small dot = 2 incidents        |
| [L7 · Brand spectrum](/vchart/examples/lieflat-charts/brand-spectrum)     | Where the brand sits · customer panel · big dot = us                 |
| [L15 · Ballot tally](/vchart/examples/lieflat-charts/ballot-tally)        | What they fear, tick by tick · multiple responses · one tick = 1%    |
| [G3 · Chunky bars](/vchart/examples/lieflat-charts/chunky-bars)           | Revenue by plan · monthly recurring revenue, $k                      |
| [G10 · Diverging bars](/vchart/examples/lieflat-charts/diverging-bars)    | Where we gained, where we bled · net change by channel               |
| [G5 · Pictorial forest](/vchart/examples/lieflat-charts/pictorial-forest) | Trees planted, year by year · one tree symbol = 100 trees            |

## Composition and progress（5）

Countable units, radial ticks and area blocks suit shares, composition and goal progress.

| Example                                                                | Encoding                                                     |
| ---------------------------------------------------------------------- | ------------------------------------------------------------ |
| [F4 · Tick donut](/vchart/examples/lieflat-charts/tick-donut)          | Where traffic comes from · 100 countable ticks               |
| [F11 · Tick gauge](/vchart/examples/lieflat-charts/tick-gauge)         | How far to the quarter’s goal · one tick = one percent       |
| [L14 · Hundred field](/vchart/examples/lieflat-charts/hundred-field)   | A hundred of us, four minds · one dot = one percentage point |
| [G4 · Dot waffle](/vchart/examples/lieflat-charts/dot-waffle)          | Where sign-ups come from · one dot = 1%                      |
| [F13 · Nested treemap](/vchart/examples/lieflat-charts/nested-treemap) | Where the work went · 1,280 hours · area = effort            |

## Time and events（9）

Time positions and event markers support annual reviews, product histories, trends and ranking stories.

| Example                                                                   | Encoding                                                                          |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| [F2 · Hairline line](/vchart/examples/lieflat-charts/hairline-line)       | Thirty days of sign-ups · hollow = weekend                                        |
| [F3 · Hairline area](/vchart/examples/lieflat-charts/hairline-area)       | Concurrent users · one hairline = one day                                         |
| [L3 · Barcode lollipop](/vchart/examples/lieflat-charts/barcode-lollipop) | Ninety days as a barcode · Apr–Jun · peak concurrent users                        |
| [L1 · Launch fan](/vchart/examples/lieflat-charts/launch-fan)             | Twelve features, fanned out · launch week × current MAU                           |
| [L9 · Bubble almanac](/vchart/examples/lieflat-charts/bubble-almanac)     | Eight years of tickets · bubble area = tickets · inner circle = escalations       |
| [L11 · Trend lineage](/vchart/examples/lieflat-charts/trend-lineage)      | Features rise, fall, come back · solid = launch · hollow = redesign · × = dormant |
| [L17 · Calendar heat](/vchart/examples/lieflat-charts/calendar-heat)      | A year of deploys, day by day · 2025 · one cell = one calendar day                |
| [F16 · Stream ribbon](/vchart/examples/lieflat-charts/stream-ribbon)      | Three products trade the same river · 48 weeks · band width = active accounts     |
| [G21 · Rank strip](/vchart/examples/lieflat-charts/rank-strip)            | Flows climbs to the top · one is best · five quarterly snapshots                  |

## Matrices and distributions（6）

Dots, arcs, radial shapes and ridgelines reveal patterns for posters and focused reports.

| Example                                                                    | Encoding                                                                |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [F10 · Dot heat](/vchart/examples/lieflat-charts/dot-heat)                 | When support gets loud · dot area = tickets · 7 days × 12 hours         |
| [L4 · Arc matrix](/vchart/examples/lieflat-charts/arc-matrix)              | Eight products in twelve cities · bubble area = paying accounts         |
| [L8 · Dotty matrix](/vchart/examples/lieflat-charts/dotty-matrix)          | Four squads, stacked in space · dot area = tasks closed                 |
| [L10 · Radial patchwork](/vchart/examples/lieflat-charts/radial-patchwork) | A quarter of deploys, overlaid · angle = time · radius = changes        |
| [L19 · Ridgeline](/vchart/examples/lieflat-charts/ridgeline)               | Five pipelines, five tempos · response time density · bandwidth = 1.2 h |
| [F14 · Rung histogram](/vchart/examples/lieflat-charts/rung-histogram)     | Most tickets resolve within six hours · 100 tickets · 2-hour bins       |

## Relationships, hierarchy and flow（7）

Layouts expose clusters, ownership or flow directly; hover adds detail.

| Example                                                                       | Encoding                                                                     |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [L5 · Radial convergence](/vchart/examples/lieflat-charts/radial-convergence) | 48 requests pull toward five themes · one rim node = one request             |
| [L6 · Cluster field](/vchart/examples/lieflat-charts/cluster-field)           | The contributor field · 132 contributors · spokes = repository contributions |
| [L12 · Type colonnade](/vchart/examples/lieflat-charts/type-colonnade)        | Forty-four repos, ten owners · every label is one repository                 |
| [L13 · Hourglass stream](/vchart/examples/lieflat-charts/hourglass-stream)    | The funnel, poured · stage width = people · one thread = 10 visitors         |
| [G6 · Circular network](/vchart/examples/lieflat-charts/circular-network)     | Who works with whom · hover neighbors · click to pin                         |
| [G7 · Platform tree](/vchart/examples/lieflat-charts/platform-tree)           | Everything the platform ships · hierarchy, not quantitative size             |
| [G22 · Aggregate Sankey](/vchart/examples/lieflat-charts/aggregate-sankey)    | Channels pour into plans · ribbon width = accounts                           |

## Animated stories（2）

Rank changes and cumulative growth suit motion infographics; native players start automatically and support pause and seek.

| Example                                                                      | Encoding                                                           |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| [G16 · Bar race](/vchart/examples/lieflat-charts/bar-race)                   | Eight products race · monthly active accounts · play / pause below |
| [G18 · Draw-in and counter](/vchart/examples/lieflat-charts/draw-in-counter) | H1 revenue, drawn in one stroke · cumulative $k                    |

## Geographic distribution（2）

Suitable for regional differences, coverage and global distribution; geographic area is not a quantity encoding.

| Example                                                                   | Encoding                                                                               |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| [M1 · US choropleth](/vchart/examples/lieflat-charts/us-choropleth)       | Sign-ups across the states · geography is not quantity · neutral fill = no observation |
| [M2 · World choropleth](/vchart/examples/lieflat-charts/world-choropleth) | Where the users are · monthly active accounts · drag to pan, wheel to zoom             |

## Reference and implementation

Reference revision: `eace082`. Standard charts use VChart series; editorial layouts use public `customMark` / `dataId` APIs. Custom graphics use a lifecycle-managed `TooltipHandler`; circular-network highlighting uses graphic states.

Design and chart naming are credited to the original author. The reference uses [PolyForm Noncommercial 1.0.0](https://github.com/larashero3-dotcom/lieflat-charts/blob/eace082/LICENSE). These VChart implementations are newly written; original template source and media are not redistributed.
