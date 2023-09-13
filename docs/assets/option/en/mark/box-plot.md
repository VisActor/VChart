{{ target: mark-box-plot }}

<!-- IBoxPlotSeriesSpec -->

#${prefix} lineWidth(number) = 2
Box plot stroke thickness

#${prefix} boxWidth(number)
Box plot box width, adaptive if empty

#${prefix} shaftWidth(number)
Box plot maximum-minimum value width, adaptive if empty

#${prefix} shaftShape(string) = 'line'
Box plot center axis shape connecting maximum and minimum values

Optional values:

- `line` Linear
- `bar` Bar

#${prefix} boxFill(string)
Box plot box fill color, no fill if empty

#${prefix} stroke(string)
Box plot stroke color, effective only when shaftShape='line'

#${prefix} shaftFillOpacity(number) = 0.5
Box plot center axis line opacity connecting maximum and minimum values, effective only when shaftType=bar