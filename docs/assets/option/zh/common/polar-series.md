{{ target: common-polar-series }}

<!-- IPolarSeriesSpec -->

{{ use: common-series(
prefix = ${prefix},
noType = ${noType},
noData = ${noData},
seriesType = ${seriesType},
noMorph = ${noMorph},
useInChart = ${useInChart},
noPreset = ${noPreset},
preset = ${preset},
defaultPreset = ${defaultPreset},
seriesMarks = ${seriesMarks},
) }}

{{ if: !${noCategoryField} }}
#${prefix} categoryField(string|string[])

类别字段，映射到角度轴。可以声明为数组类型，内部会依次按照声明的字段进行数据分组。
{{ /if }}

#${prefix} valueField(string|string[])

数值字段，映射到半径轴。可以声明为数组类型，内部会依次按照声明的字段进行数据分组。

#${prefix} outerRadius(number) = 0.6

扇区外半径，数值的范围为 0 - 1。

#${prefix} innerRadius(number) = 0

扇区内半径，数值的范围为 0 - 1。

#${prefix} startAngle(number) = -90

扇区起始角度。角度制。

#${prefix} endAngle(number) = 270

扇区结束角度。角度制。

#${prefix} centerX(number)

极坐标中心点 x 坐标。

#${prefix} centerY(number)

极坐标中心点 y 坐标。
