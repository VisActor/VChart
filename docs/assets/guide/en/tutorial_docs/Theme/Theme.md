# Chart Theme

Chart themes (Theme) are a powerful feature of VChart, providing a unified way to control global chart styles, color palettes, marks, series, and component styles. Using chart themes can make your chart styles more consistent and reusable across your entire project, improving development efficiency.

The following will detail the chart theme configuration in VChart.

## Theme Structure

The theme configuration is described by the `ITheme` interface and can be roughly divided into 6 configurations:

```ts
interface ITheme {
  /**
   * 1st Configuration: Theme Information
   */
  /** Theme naming */
  name?: string;

  /**
   * 2nd Configuration: Chart level style attributes
   */
  /** Chart background color */
  background?: string | IGradientColor;
  /** Chart padding */
  padding?: ILayoutPaddingSpec;
  /** Chart font configuration */
  fontFamily?: string;

  /**
   * 3rd Configuration: Color palette
   */
  /** Global color palette */
  colorScheme?: IThemeColorScheme;

  /**
   * 4th Configuration: Global mark attribute configuration
   */
  /** Global mark style attributes, indexed by mark type */
  mark?: IGlobalMarkThemeByType;
  /** Global mark style attributes, indexed by mark name, with higher priority */
  markByName?: IGlobalMarkThemeByName;

  /**
   * 5th Configuration: Series attribute configuration
   */
  /** Series style attributes */
  series?: ISeriesTheme;

  /**
   * 6th Configuration: Component attribute configuration
   */
  /** Component style attributes */
  component?: IComponentTheme;
}
```

Next, we will detail these theme configurations and their applications.

### Theme Information

Contains 1 configuration:

- `ITheme.name`: Theme name, used to identify the theme. See the "Custom Themes" section for details.

### Chart level style attributes

Global style configuration is used to set the overall style of the chart, including the background color, padding, and text font in the chart. Specific configurations are as follows:

1. `ITheme.background`: Chart background color. It can be a solid color, such as '#FF0000', which means the chart background is red. It can also be a gradient color configuration, for example:

```json
{
  type: 'linear',
  x1: 0,
  y1: 0,
  x2: 100,
  y2: 100,
  colorStops: [
    { offset: 0, color: '#FF0000 },
    { offset: 0.5, color: '#00FF00' },
    { offset: 1, color: '#0000' }
  ]
}
```

2. `ITheme.padding`: Chart padding, which can be configured separately for left, right, top and bottom.

3. `ITheme.fontFamily`: Default chart font configuration. For example, `"Times New Roman"`.

### Color Palette

Contains 1 configuration:

- `ITheme.colorScheme`: Global color palette.

  The global color palette is used to set the color scheme of the chart, such as the color of the data series and components. The global color palette includes several types:

  1. Type `Array<string>` is the simplest color palette configuration, providing an array of color values directly.
  2. Type `ProgressiveDataScheme<string>` is a progressive color palette configuration that allows multiple color palette schemes to coexist simultaneously, with specific application depending on the execution of user callbacks.
  3. Type `IColorSchemeStruct` is the most functional color palette definition, which includes both language palettes and progressive palettes.

  These types can be used in combination to meet your color needs in charts. This part can be seen in detail in the "Color Palette" section.

### Global Mark Attribute Configuration

Each graphical element in a chart is a mark, such as points, lines, and rectangles in bar charts. The mark theme is a public style configured based on the basic graphic element types in the chart.

Contains 2 configurations:

- `ITheme.mark`: Global mark style attributes, indexed by mark category. Its type `IGlobalMarkThemeByType` is defined as:

  ```ts
  interface IGlobalMarkThemeByType {
    [MarkTypeEnum.line]?: Partial<ILineMarkSpec>;
    [MarkTypeEnum.symbol]?: Partial<ISymbolMarkSpec>;
    [MarkTypeEnum.area]?: Partial<IAreaMarkSpec>;
    [MarkTypeEnum.rect]?: Partial<IRectMarkSpec>;
    [MarkTypeEnum.arc]?: Partial<IArcMarkSpec>;
    [MarkTypeEnum.text]?: Partial<ITextMarkSpec>;
    [MarkTypeEnum.path]?: Partial<IPathMarkSpec>;
  }
  ```

  In VChart's internal logic, each member of `ITheme.mark` is merged **by mark type** into each mark's spec of each series.
- `ITheme.markByName`: Global mark style attributes, indexed by mark name, with higher priority.  
  This configuration is very convenient for modifying common configurations of multiple series. Its type `IGlobalMarkThemeByName` is defined as:

  ```ts
  interface IGlobalMarkThemeByName {
    /** used in lineSeries, areaSeries, radarSeries, etc. */
    line?: Partial<ILineMarkSpec>;
    /** used in lineSeries, areaSeries, radarSeries, scatterSeries etc. */
    point?: Partial<ISymbolMarkSpec>;
    /** used in lineSeries, areaSeries, radarSeries, etc. */
    area?: Partial<IAreaMarkSpec>;
    /** used in barSeries, rangeColumnSeries etc. */
    bar?: Partial<IRectMarkSpec>;
    /** used in many series */
    label?: Partial<ITextMarkSpec>;

    [markName: string]: any;
  }
  ```

  - line mark style configuration, used in line, area, radar, etc. series.
  - point mark style configuration, used in line, area, radar, scatter, etc. series.
  - area mark style configuration, used in line, area, radar, etc. series.
  - bar mark style configuration, used in bar, rangeColumn, etc. series.
  - label mark style configuration, used in almost all series.
  - Custom mark style configuration, users can add any name-spec pairs in this object. In VChart's internal logic, each member of `ITheme.markByName` is merged **by mark name** into each mark's spec of each series.

For configuration methods of different mark spec types, please refer to the relevant parts of the VChart configuration documentation.

#### Difference between mark theme configuration and mark spec configuration

It is not difficult to find a similar theme type definition in the text above:

```ts
{
  [MarkTypeEnum.line]?: Partial<ILineMarkSpec>;
}
```

This actually reflects the design idea of theme configuration items: **The theme configuration (or style configuration) of specific chart elements is a subset of spec, and should be mergeable into spec configuration in theory.**

In fact, in order to distinguish the difference between chart element spec and theme, the actual theme configuration is similar to the following definition:

```ts
{
  [MarkTypeEnum.line]?: Partial<IMarkTheme<ILineMarkSpec>>;
}
```

Where the generic `IMarkTheme` specifies which properties in the mark spec can be used as theme configurations. In the tutorial documentation, the generic `IMarkTheme` is omitted for simplicity.

### Series Attribute Configuration

A chart may contain multiple series, such as line chart series, bar chart series, and pie chart series. Series themes allow users to set specific styles for different types of series, such as the color, appearance, and animation of each type of series.

Contains 1 configuration:

- `ITheme.series`: Series style attributes, indexed by series category.

  Its type `ISeriesTheme` is defined as:

  ```ts
  interface ISeriesTheme {
    [SeriesTypeEnum.bar]?: IBarSeriesTheme;
    [SeriesTypeEnum.bar3d]?: IBar3dSeriesTheme;
    [SeriesTypeEnum.line]?: ILineSeriesTheme;
    [SeriesTypeEnum.scatter]?: IScatterSeriesTheme;
    [SeriesTypeEnum.area]?: IAreaSeriesTheme;
    [SeriesTypeEnum.radar]?: IRadarSeriesTheme;
    [SeriesTypeEnum.pie]?: IPieSeriesTheme;
    [SeriesTypeEnum.pie3d]?: IPie3dSeriesTheme;
    [SeriesTypeEnum.rose]?: IRoseSeriesTheme;
    [SeriesTypeEnum.map]?: IMapSeriesTheme;
    [SeriesTypeEnum.circularProgress]?: ICircularProgressSeriesTheme;
    [SeriesTypeEnum.link]?: ILinkSeriesTheme;
    [SeriesTypeEnum.dot]?: IDotSeriesTheme;
    [SeriesTypeEnum.wordCloud]?: IWordCloudSeriesTheme;
    [SeriesTypeEnum.wordCloud3d]?: IWordCloud3dSeriesTheme;
    [SeriesTypeEnum.funnel]?: IFunnelSeriesTheme;
    [SeriesTypeEnum.funnel3d]?: IFunnel3dSeriesTheme;
    [SeriesTypeEnum.wordCloud]?: IWordCloudSeriesTheme;
    [SeriesTypeEnum.linearProgress]?: ILinearProgressSeriesTheme;
    [SeriesTypeEnum.waterfall]?: IWaterfallSeriesTheme;
    [SeriesTypeEnum.boxPlot]?: IBoxPlotSeriesTheme;
    [SeriesTypeEnum.treemap]?: ITreemapSeriesTheme;
    [SeriesTypeEnum.sankey]?: ISankeySeriesTheme;
    [SeriesTypeEnum.gauge]?: IGaugeSeriesTheme;
    [SeriesTypeEnum.gaugePointer