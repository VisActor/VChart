{{ target: mark-box-plot }}

<!-- IBoxPlotSeriesSpec -->

#${prefix} lineWidth(number) = 2
箱型图箱体描边粗细

#${prefix} boxWidth(number)
箱型图箱体宽度，为空则自适应

#${prefix} shaftWidth(number)
箱型图最大最小值宽度，为空则自适应

#${prefix} shaftShape(string) = 'line'
箱型图连接最大最小值的中轴线形状

可选值：

- `line` 线形
- `bar` 条形

#${prefix} boxFill(string)
箱型图箱体填充颜色，为空则不填充

#${prefix} stroke(string)
箱型图描边颜色，仅当 shaftShape='line'时生效

#${prefix} shaftFillOpacity(number) = 0.5
箱型图连接最大最小值的中轴线透明度，仅当 shaftType=bar 时生效
