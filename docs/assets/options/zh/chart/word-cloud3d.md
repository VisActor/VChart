{{ target: chart-word-cloud3d }}

# wordCloud3dChart

3d 词云图

词云图在底层实现上分为: "词云" 和 "形状词云"。3d 词云图则是在 3d 视角下对词云投影到球，圆柱等面上
当`maskShape`未配置 或配置为内置形状时，视作"词云; 否则是做"形状词云"。  
由于底层算法不同，"词云"和"形状词云"在配置上略有不同。不同配置在`wordCloudConfig` 和 `wordCloudShapeConfig`中有所体现。

注：内置形状包含：

- `'triangleForward'`: 右箭头
- `'triangle'`: 三角形
- `'diamond'`: 菱形
- `'square'`: 方形
- `'star'`: 星形
- `'cardioid'`: 心形
- `'circle'`: 圆形
- `'pentagon'`: 五角形

{{ use: common-chart-spec(
    prefix = '#',
    chartType = 'wordCloud3d'
) }}

{{ use: series-word-cloud3d(
  prefix = '#',
  noType = true,
  noData = true,
  noMorph = true,
  useInChart = true
) }}
