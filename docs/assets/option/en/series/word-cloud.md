{{ target: series-word-cloud }}

<!-- IWordCloudSeriesSpec -->

**wordCloud series**, used to draw word cloud charts. **Only applicable to Cartesian coordinate system**.

{{ use: common-cartesian-series(
  prefix = ${prefix},
  noType = ${noType},
  noData = ${noData},
  noMorph = ${noMorph},
  useInChart = ${useInChart},
  seriesType = 'wordCloud',
  seriesMarks = ['word'],
  preset = 'scaleIn' + '|' + 'fadeIn' ,
  defaultPreset = 'scaleIn',
) }}

#${prefix} nameField(string)

Text field.

#${prefix} valueField(string)

Weight field.

#${prefix} fontFamilyField(string)

Font field.

#${prefix} fontWeightField(string)

Font weight field.

#${prefix} fontStyleField(string)

Font style field.

#${prefix} colorHexField(string)

Specify the hex color field directly.

#${prefix} colorMode(string)

Color mode.

Optional values:

- `'linear'`: Linear coloring (to be opened)
- `'ordinal'`: Ordinal coloring

#${prefix} colorList(Array)

Color list.

#${prefix} rotateAngles(Array)

Rotatable angle random range list.

#${prefix} fontWeightRange(Array)

Font weight range. If you need a fixed font weight, configure the numbers in the array to be the same.

#${prefix} fontSizeRange(Array|string)

Font size range. If you need a fixed font size, configure the numbers in the array to be the same.

When the valueField exists, the default value is [20,40]; when the valueField does not exist, the default value is [10, 10].

'auto' configuration is supported since version 1.8.7. That is, if the configuration is 'auto', fontSizeRange is not passed in, and the font size will change as the canvas size changes.

#${prefix} maskShape(string)

Word cloud shape, url, svg string, or base64, or built-in string (svg string/base64 not yet supported).

Built-in string optional values:

- `'triangleForward'`: Right arrow
- `'triangle'`: Triangle
- `'diamond'`: Diamond shape
- `'square'`: Square
- `'star'`: Star shape
- `'cardioid'`: Heart shape
- `'circle'`: Circle
- `'pentagon'`: Pentagon

#${prefix} random(boolean)

Whether to start random placement direction (clockwise | counterclockwise).

#${prefix} wordCloudConfig(Object)

Word cloud special configuration (only effective when the maskShape of the word cloud is not specified or the maskShape is a shape string).

##${prefix} drawOutOfBound(string) = 'hidden'

Omission strategy for text that exceeds the length of the canvas.

Optional values:

- `'clip'`: Draw text that exceeds the length, and clip the part of the text that exceeds the canvas
- `'hidden'`: Do not draw text that exceeds the canvas
- `'ellipsis'`: Draw text that exceeds the length, and use the user-specified string to replace the text that exceeds it (not yet supported)

##${prefix} ellipsis(Object)

Configuration of omitted text.

###${prefix} string(string) = '...'

Replacement string for text that exceeds the length.

###${prefix} limitLength(number) = '...'

Limit length. The part that exceeds this length will display the user-specified string.

##${prefix} zoomToFit(Object)

Adaptive scaling configuration.

###${prefix} shrink(boolean)

Whether to shrink.

###${prefix} enlarge(boolean)

Whether to zoom in.

###${prefix} fontSizeLimitMin(number)

Minimum font size for shrinking, effective when shrink: true.

###${prefix} fontSizeLimitMax(number)

Maximum font size when zooming in, effective when enlarge: true.

##${prefix} layoutMode(string)

Layout mode.

Optional values:

- `'fast'`: Fast layout, for small programs & widget environments
- `'grid'`: Grid-based pixel layout
- `'default'`: Based on pixel layout

##${prefix} progressiveTime(number)

Progressive rendering configuration - layout time.

##${prefix} progressiveStep(number)

Progressive rendering configuration - layout steps.

#${prefix} wordCloudShapeConfig(Object)

Word cloud special configuration (only effective when the maskShape of the word cloud is url, base64, or svg string).

##${prefix} fillingColorList(Array)

Fill words - color channel.

##${prefix} fillingColorList(Array)

Fill words - color list.

##${prefix} fillingFontFamilyField(string)

Fill words - font field.

##${prefix} fillingFontWeightField(string)

Fill words - font weight field.

##${prefix} fillingFontStyleField(string)

Fill words - font style field.

##${prefix} fillingColorHexField(string)

Fill words - specify hex color field directly.

##${prefix} fillingRotateAngles(Array)

Fill words - rotatable angle random range list.

##${prefix} ratio(number)

Overall layout - expected ratio when calculating core words automatically.

##${prefix} removeWhiteBorder(boolean)

Overall layout - whether to remove the white border of the input image.

##${prefix} layoutMode(string)

Overall layout - layout mode.

Optional values:

- `'default'`
- `'ensureMapping'`
- `'ensureMappingEnlarge'`

##${prefix} fillingTimes(number)

Fill layout - fill text fill times.

##${prefix} fillingXStep(number)

Fill layout - advancement range of x during filling.

##${prefix} fillingYStep(number)

Fill layout - advancement range of y during filling.

##${prefix} fillingXRatioStep(number)

Fill layout - advancement range of x during filling (relative width ratio).

##${prefix} fillingYRatioStep(number)

Fill layout - advancement range of y during filling (relative height ratio).

##${prefix} fillingInitialFontSize(number)

Fill layout - initial font size of fill text.

##${prefix} fillingDeltaFontSize(number)

Fill layout - reduction value of font size for each fill.

##${prefix} fillingInitialOpacity(number)

Fill layout - initial opacity of fill text.

##${prefix} fillingDeltaOpacity(number)

Fill layout - reduction value of opacity for each fill.

##${prefix} textLayoutTimes(number)

Fill layout - number of attempts to layout words.

##${prefix} fontSizeShrinkFactor(number)

Fill layout - the factor of reducing font size after each layout fails.

##${prefix} stepFactor(number)

Fill layout - layout step factor.

##${prefix} importantWordCount(number)

Fill layout - important word count.

##${prefix} globalShinkLimit(number)

Fill layout - font size reduction limit.

##${prefix} fontSizeEnlargeFactor(number)

Fill layout - the factor of increasing font size after each layout succeeds.

##${prefix} fillingDeltaFontSizeFactor(number)

Fill layout - the factor of reducing font size after each iteration of automatically calculated fill word font size.

##${prefix} fillingRatio(number)

Fill layout - expected ratio when calculating fill words automatically.

#${prefix} word(Object)

Word cloud text graphic configuration or shape word cloud core word text graphic configuration.

{{ use: common-mark(
  prefix = '#' + ${prefix}
) }}

##${prefix} padding(number)

Text spacing.

##${prefix} formatMethod(Function)

Text formatting callback function.

The callback function is defined as follows:

```ts
/**
 * @params The data corresponding to the current element
 * @return the processed text
 */
(datum: any) => string;
```

##${prefix} style(Object)

Text style.

{{ use: mark-style(
  markName = 'word'
) }}

{{ use: mark-text(
  prefix = '##' + ${prefix}
) }}

##${prefix} state(Object)

{{ use: mark-state-style() }}

#${prefix} fillingWord(Object)

Shape word cloud fill word text graphic configuration.

Reason for not adding formatMethod: Shape word cloud uses the same set of data for word and fillingWord (same text), so the format of fillingWords will not take effect.

{{ use: common-mark(
  prefix = '#' + ${prefix}
) }}

##${prefix} padding(number)

Text spacing.

##${prefix} style(Object)

Text style.

{{ use: mark-style(
  markName = 'fillingWord'
) }}

{{ use: mark-text(
  prefix = '##' + ${prefix}
) }}

##${prefix} state(Object)

{{ use: mark-state-style() }}
