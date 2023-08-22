---
category: examples
group: scatter chart
title: Jitter Scatter Plot
order: 9-2
cover: http://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vchart/preview/scatter-chart/jitter-scatter.png
option: scatterChart
---

# Jitter Scatter Plot

Jitter scatter plots add some random jitter to the positions of data points to prevent them from overlapping.

This type of graph is commonly used to display the relationship between two variables, one of which is continuous, and the other categorical. In this example, the categorical variable is 'cylinders', and the continuous variable is 'horsepower'. It is used to observe the relationship between different numbers of cylinders and horsepower.

Jitter scatter plots help observers see the distribution and trend of data points more clearly, especially in areas where data points are dense.

> Data from observablehq.com

## Code Demo

```javascript livedemo
const data = [
  { name: 'chevrolet chevelle malibu', milesPerGallon: 18, cylinders: 8, horsepower: 130 },
  { name: 'buick skylark 320', milesPerGallon: 15, cylinders: 8, horsepower: 165 },
  { name: 'plymouth satellite', milesPerGallon: 18, cylinders: 8, horsepower: 150 },
  { name: 'amc rebel sst', milesPerGallon: 16, cylinders: 8, horsepower: 150 },
  { name: 'ford torino', milesPerGallon: 17, cylinders: 8, horsepower: 140 },
  { name: 'ford galaxie 500', milesPerGallon: 15, cylinders: 8, horsepower: 198 },
  { name: 'chevrolet impala', milesPerGallon: 14, cylinders: 8, horsepower: 220 },
  { name: 'plymouth fury iii', milesPerGallon: 14, cylinders: 8, horsepower: 215 },
  { name: 'pontiac catalina', milesPerGallon: 14, cylinders: 8, horsepower: 225 },
  { name: 'amc ambassador dpl', milesPerGallon: 15, cylinders: 8, horsepower: 190 },
  { name: 'citroen ds-21 pallas', milesPerGallon: 0, cylinders: 4, horsepower: 115 },
  { name: 'chevrolet chevelle concours (sw)', milesPerGallon: 0, cylinders: 8, horsepower: 165 },
  { name: 'ford torino (sw)', milesPerGallon: 0, cylinders: 8, horsepower: 153 },
  { name: 'plymouth satellite (sw)', milesPerGallon: 0, cylinders: 8, horsepower: 175 },
  { name: 'amc rebel sst (sw)', milesPerGallon: 0, cylinders: 8, horsepower: 175 },
  { name: 'dodge challenger se', milesPerGallon: 15, cylinders: 8, horsepower: 170 },
  { name: "plymouth 'cuda 340", milesPerGallon: 14, cylinders: 8, horsepower: 160 },
  { name: 'ford mustang boss 302', milesPerGallon: 0, cylinders: 8, horsepower: 140 },
  { name: 'chevrolet monte carlo', milesPerGallon: 15, cylinders: 8, horsepower: 150 },
  { name: 'buick estate wagon (sw)', milesPerGallon: 14, cylinders: 8, horsepower: 225 },
  { name: 'toyota corona mark ii', milesPerGallon: 24, cylinders: 4, horsepower: 95 },
  { name: 'plymouth duster', milesPerGallon: 22, cylinders: 6, horsepower: 95 },
  { name: 'amc hornet', milesPerGallon: 18, cylinders: 6, horsepower: 97 },
  { name: 'ford maverick', milesPerGallon: 21, cylinders: 6, horsepower: 85 },
  { name: 'datsun pl510', milesPerGallon: 27, cylinders: 4, horsepower: 88 },
  { name: 'volkswagen 1131 deluxe sedan', milesPerGallon: 26, cylinders: 4, horsepower: 46 },
  { name: 'peugeot 504', milesPerGallon: 25, cylinders: 4, horsepower: 87 },
  { name: 'audi 100 ls', milesPerGallon: 24, cylinders: 4, horsepower: 90 },
  { name: 'saab 99e', milesPerGallon: 25, cylinders: 4, horsepower: 95 },
  { name: 'bmw 2002', milesPerGallon: 26, cylinders: 4, horsepower: 113 },
  { name: 'amc gremlin', milesPerGallon: 21, cylinders: 6, horsepower: 90 },
  { name: 'ford f250', milesPerGallon: 10, cylinders: 8, horsepower: 215 },
  { name: 'chevy c20', milesPerGallon: 10, cylinders: 8, horsepower: 200 },
  { name: 'dodge d200', milesPerGallon: 11, cylinders: 8, horsepower: 210 },
  { name: 'hi 1200d', milesPerGallon: 9, cylinders: 8, horsepower: 193 },
  { name: 'datsun pl510', milesPerGallon: 27, cylinders: 4, horsepower: 88 },
  { name: 'chevrolet vega 2300', milesPerGallon: 28, cylinders: 4, horsepower: 90 },
  { name: 'toyota corona', milesPerGallon: 25, cylinders: 4, horsepower: 95 },
  { name: 'ford pinto', milesPerGallon: 25, cylinders: 4, horsepower: 0 },
  { name: 'volkswagen super beetle 117', milesPerGallon: 0, cylinders: 4, horsepower: 48 },
  { name: 'amc gremlin', milesPerGallon: 19, cylinders: 6, horsepower: 100 },
  { name: 'plymouth satellite custom', milesPerGallon: 16, cylinders: 6, horsepower: 105 },
  { name: 'chevrolet chevelle malibu', milesPerGallon: 17, cylinders: 6, horsepower: 100 },
  { name: 'ford torino 500', milesPerGallon: 19, cylinders: 6, horsepower: 88 },
  { name: 'amc matador', milesPerGallon: 18, cylinders: 6, horsepower: 100 },
  { name: 'chevrolet impala', milesPerGallon: 14, cylinders: 8, horsepower: 165 },
  { name: 'pontiac catalina brougham', milesPerGallon: 14, cylinders: 8, horsepower: 175 },
  { name: 'ford galaxie 500', milesPerGallon: 14, cylinders: 8, horsepower: 153 },
  { name: 'plymouth fury iii', milesPerGallon: 14, cylinders: 8, horsepower: 150 },
  { name: 'dodge monaco (sw)', milesPerGallon: 12, cylinders: 8, horsepower: 180 },
  { name: 'ford country squire (sw)', milesPerGallon: 13, cylinders: 8, horsepower: 170 },
  { name: 'pontiac safari (sw)', milesPerGallon: 13, cylinders: 8, horsepower: 175 },
  { name: 'amc hornet sportabout (sw)', milesPerGallon: 18, cylinders: 6, horsepower: 110 },
  { name: 'chevrolet vega (sw)', milesPerGallon: 22, cylinders: 4, horsepower: 72 },
  { name: 'pontiac firebird', milesPerGallon: 19, cylinders: 6, horsepower: 100 },
  { name: 'ford mustang', milesPerGallon: 18, cylinders: 6, horsepower: 88 },
  { name: 'mercury capri 2000', milesPerGallon: 23, cylinders: 4, horsepower: 86 },
  { name: 'opel 1900', milesPerGallon: 28, cylinders: 4, horsepower: 90 },
  { name: 'peugeot 304', milesPerGallon: 30, cylinders: 4, horsepower: 70 },
  { name: 'fiat 124b', milesPerGallon: 30, cylinders: 4, horsepower: 76 },
  { name: 'toyota corolla 1200', milesPerGallon: 31, cylinders: 4, horsepower: 65 },
  { name: 'datsun 1200', milesPerGallon: 35, cylinders: 4, horsepower: 69 },
  { name: 'volkswagen model 111', milesPerGallon: 27, cylinders: 4, horsepower: 60 },
  { name: 'plymouth cricket', milesPerGallon: 26, cylinders: 4, horsepower: 70 },
  { name: 'toyota corona hardtop', milesPerGallon: 24, cylinders: 4, horsepower: 95 },
  { name: 'dodge colt hardtop', milesPerGallon: 25, cylinders: 4, horsepower: 80 },
  { name: 'volkswagen type 3', milesPerGallon: 23, cylinders: 4, horsepower: 54 },
  { name: 'chevrolet vega', milesPerGallon: 20, cylinders: 4, horsepower: 90 },
  { name: 'ford pinto runabout', milesPerGallon: 21, cylinders: 4, horsepower: 86 },
  { name: 'chevrolet impala', milesPerGallon: 13, cylinders: 8, horsepower: 165 },
  { name: 'pontiac catalina', milesPerGallon: 14, cylinders: 8, horsepower: 175 },
  { name: 'plymouth fury iii', milesPerGallon: 15, cylinders: 8, horsepower: 150 },
  { name: 'ford galaxie 500', milesPerGallon: 14, cylinders: 8, horsepower: 153 },
  { name: 'amc ambassador sst', milesPerGallon: 17, cylinders: 8, horsepower: 150 },
  { name: 'mercury marquis', milesPerGallon: 11, cylinders: 8, horsepower: 208 },
  { name: 'buick lesabre custom', milesPerGallon: 13, cylinders: 8, horsepower: 155 },
  { name: 'oldsmobile delta 88 royale', milesPerGallon: 12, cylinders: 8, horsepower: 160 },
  { name: 'chrysler newport royal', milesPerGallon: 13, cylinders: 8, horsepower: 190 },
  { name: 'mazda rx2 coupe', milesPerGallon: 19, cylinders: 3, horsepower: 97 },
  { name: 'amc matador (sw)', milesPerGallon: 15, cylinders: 8, horsepower: 150 },
  { name: 'chevrolet chevelle concours (sw)', milesPerGallon: 13, cylinders: 8, horsepower: 130 },
  { name: 'ford gran torino (sw)', milesPerGallon: 13, cylinders: 8, horsepower: 140 },
  { name: 'plymouth satellite custom (sw)', milesPerGallon: 14, cylinders: 8, horsepower: 150 },
  { name: 'volvo 145e (sw)', milesPerGallon: 18, cylinders: 4, horsepower: 112 },
  { name: 'volkswagen 411 (sw)', milesPerGallon: 22, cylinders: 4, horsepower: 76 },
  { name: 'peugeot 504 (sw)', milesPerGallon: 21, cylinders: 4, horsepower: 87 },
  { name: 'renault 12 (sw)', milesPerGallon: 26, cylinders: 4, horsepower: 69 },
  { name: 'ford pinto (sw)', milesPerGallon: 22, cylinders: 4, horsepower: 86 },
  { name: 'datsun 510 (sw)', milesPerGallon: 28, cylinders: 4, horsepower: 92 },
  { name: 'toyouta corona mark ii (sw)', milesPerGallon: 23, cylinders: 4, horsepower: 97 },
  { name: 'dodge colt (sw)', milesPerGallon: 28, cylinders: 4, horsepower: 80 },
  { name: 'toyota corolla 1600 (sw)', milesPerGallon: 27, cylinders: 4, horsepower: 88 },
  { name: 'buick century 350', milesPerGallon: 13, cylinders: 8, horsepower: 175 },
  { name: 'amc matador', milesPerGallon: 14, cylinders: 8, horsepower: 150 },
  { name: 'chevrolet malibu', milesPerGallon: 13, cylinders: 8, horsepower: 145 },
  { name: 'ford gran torino', milesPerGallon: 14, cylinders: 8, horsepower: 137 },
  { name: 'dodge coronet custom', milesPerGallon: 15, cylinders: 8, horsepower: 150 },
  { name: 'mercury marquis brougham', milesPerGallon: 12, cylinders: 8, horsepower: 198 },
  { name: 'chevrolet caprice classic', milesPerGallon: 13, cylinders: 8, horsepower: 150 },
  { name: 'ford ltd', milesPerGallon: 13, cylinders: 8, horsepower: 158 },
  { name: 'plymouth fury gran sedan', milesPerGallon: 14, cylinders: 8, horsepower: 150 },
  { name: 'chrysler new yorker brougham', milesPerGallon: 13, cylinders: 8, horsepower: 215 },
  { name: 'buick electra 225 custom', milesPerGallon: 12, cylinders: 8, horsepower: 225 },
  { name: 'amc ambassador brougham', milesPerGallon: 13, cylinders: 8, horsepower: 175 },
  { name: 'plymouth valiant', milesPerGallon: 18, cylinders: 6, horsepower: 105 },
  { name: 'chevrolet nova custom', milesPerGallon: 16, cylinders: 6, horsepower: 100 },
  { name: 'amc hornet', milesPerGallon: 18, cylinders: 6, horsepower: 100 },
  { name: 'ford maverick', milesPerGallon: 18, cylinders: 6, horsepower: 88 },
  { name: 'plymouth duster', milesPerGallon: 23, cylinders: 6, horsepower: 95 },
  { name: 'volkswagen super beetle', milesPerGallon: 26, cylinders: 4, horsepower: 46 },
  { name: 'chevrolet impala', milesPerGallon: 11, cylinders: 8, horsepower: 150 },
  { name: 'ford country', milesPerGallon: 12, cylinders: 8, horsepower: 167 },
  { name: 'plymouth custom suburb', milesPerGallon: 13, cylinders: 8, horsepower: 170 },
  { name: 'oldsmobile vista cruiser', milesPerGallon: 12, cylinders: 8, horsepower: 180 },
  { name: 'amc gremlin', milesPerGallon: 18, cylinders: 6, horsepower: 100 },
  { name: 'toyota carina', milesPerGallon: 20, cylinders: 4, horsepower: 88 },
  { name: 'chevrolet vega', milesPerGallon: 21, cylinders: 4, horsepower: 72 },
  { name: 'datsun 610', milesPerGallon: 22, cylinders: 4, horsepower: 94 },
  { name: 'maxda rx3', milesPerGallon: 18, cylinders: 3, horsepower: 90 },
  { name: 'ford pinto', milesPerGallon: 19, cylinders: 4, horsepower: 85 },
  { name: 'mercury capri v6', milesPerGallon: 21, cylinders: 6, horsepower: 107 },
  { name: 'fiat 124 sport coupe', milesPerGallon: 26, cylinders: 4, horsepower: 90 },
  { name: 'chevrolet monte carlo s', milesPerGallon: 15, cylinders: 8, horsepower: 145 },
  { name: 'pontiac grand prix', milesPerGallon: 16, cylinders: 8, horsepower: 230 },
  { name: 'fiat 128', milesPerGallon: 29, cylinders: 4, horsepower: 49 },
  { name: 'opel manta', milesPerGallon: 24, cylinders: 4, horsepower: 75 },
  { name: 'audi 100ls', milesPerGallon: 20, cylinders: 4, horsepower: 91 },
  { name: 'volvo 144ea', milesPerGallon: 19, cylinders: 4, horsepower: 112 },
  { name: 'dodge dart custom', milesPerGallon: 15, cylinders: 8, horsepower: 150 },
  { name: 'saab 99le', milesPerGallon: 24, cylinders: 4, horsepower: 110 },
  { name: 'toyota mark ii', milesPerGallon: 20, cylinders: 6, horsepower: 122 },
  { name: 'oldsmobile omega', milesPerGallon: 11, cylinders: 8, horsepower: 180 },
  { name: 'plymouth duster', milesPerGallon: 20, cylinders: 6, horsepower: 95 },
  { name: 'ford maverick', milesPerGallon: 21, cylinders: 6, horsepower: 0 },
  { name: 'amc hornet', milesPerGallon: 19, cylinders: 6, horsepower: 100 },
  { name: 'chevrolet nova', milesPerGallon: 15, cylinders: 6, horsepower: 100 },
  { name: 'datsun b210', milesPerGallon: 31, cylinders: 4, horsepower: 67 },
  { name: 'ford pinto', milesPerGallon: 26, cylinders: 4, horsepower: 80 },
  { name: 'toyota corolla 1200', milesPerGallon: 32, cylinders: 4, horsepower: 65 },
  { name: 'chevrolet vega', milesPerGallon: 25, cylinders: 4, horsepower: 75 },
  { name: 'chevrolet chevelle malibu classic', milesPerGallon: 16, cylinders: 6, horsepower: 100 },
  { name: 'amc matador', milesPerGallon: 16, cylinders: 6, horsepower: 110 },
  { name: 'plymouth satellite sebring', milesPerGallon: 18, cylinders: 6, horsepower: 105 },
  { name: 'ford gran torino', milesPerGallon: 16, cylinders: 8, horsepower: 140 },
  { name: 'buick century luxus (sw)', milesPerGallon: 13, cylinders: 8, horsepower: 150 },
  { name: 'dodge coronet custom (sw)', milesPerGallon: 14, cylinders: 8, horsepower: 150 },
  { name: 'ford gran torino (sw)', milesPerGallon: 14, cylinders: 8, horsepower: 140 },
  { name: 'amc matador (sw)', milesPerGallon: 14, cylinders: 8, horsepower: 150 },
  { name: 'audi fox', milesPerGallon: 29, cylinders: 4, horsepower: 83 },
  { name: 'volkswagen dasher', milesPerGallon: 26, cylinders: 4, horsepower: 67 },
  { name: 'opel manta', milesPerGallon: 26, cylinders: 4, horsepower: 78 },
  { name: 'toyota corona', milesPerGallon: 31, cylinders: 4, horsepower: 52 },
  { name: 'datsun 710', milesPerGallon: 32, cylinders: 4, horsepower: 61 },
  { name: 'dodge colt', milesPerGallon: 28, cylinders: 4, horsepower: 75 },
  { name: 'fiat 128', milesPerGallon: 24, cylinders: 4, horsepower: 75 },
  { name: 'fiat 124 tc', milesPerGallon: 26, cylinders: 4, horsepower: 75 },
  { name: 'honda civic', milesPerGallon: 24, cylinders: 4, horsepower: 97 },
  { name: 'subaru', milesPerGallon: 26, cylinders: 4, horsepower: 93 },
  { name: 'fiat x1.9', milesPerGallon: 31, cylinders: 4, horsepower: 67 },
  { name: 'plymouth valiant custom', milesPerGallon: 19, cylinders: 6, horsepower: 95 },
  { name: 'chevrolet nova', milesPerGallon: 18, cylinders: 6, horsepower: 105 },
  { name: 'mercury monarch', milesPerGallon: 15, cylinders: 6, horsepower: 72 },
  { name: 'ford maverick', milesPerGallon: 15, cylinders: 6, horsepower: 72 },
  { name: 'pontiac catalina', milesPerGallon: 16, cylinders: 8, horsepower: 170 },
  { name: 'chevrolet bel air', milesPerGallon: 15, cylinders: 8, horsepower: 145 },
  { name: 'plymouth grand fury', milesPerGallon: 16, cylinders: 8, horsepower: 150 },
  { name: 'ford ltd', milesPerGallon: 14, cylinders: 8, horsepower: 148 },
  { name: 'buick century', milesPerGallon: 17, cylinders: 6, horsepower: 110 },
  { name: 'chevroelt chevelle malibu', milesPerGallon: 16, cylinders: 6, horsepower: 105 },
  { name: 'amc matador', milesPerGallon: 15, cylinders: 6, horsepower: 110 },
  { name: 'plymouth fury', milesPerGallon: 18, cylinders: 6, horsepower: 95 },
  { name: 'buick skyhawk', milesPerGallon: 21, cylinders: 6, horsepower: 110 },
  { name: 'chevrolet monza 2+2', milesPerGallon: 20, cylinders: 8, horsepower: 110 },
  { name: 'ford mustang ii', milesPerGallon: 13, cylinders: 8, horsepower: 129 },
  { name: 'toyota corolla', milesPerGallon: 29, cylinders: 4, horsepower: 75 },
  { name: 'ford pinto', milesPerGallon: 23, cylinders: 4, horsepower: 83 },
  { name: 'amc gremlin', milesPerGallon: 20, cylinders: 6, horsepower: 100 },
  { name: 'pontiac astro', milesPerGallon: 23, cylinders: 4, horsepower: 78 },
  { name: 'toyota corona', milesPerGallon: 24, cylinders: 4, horsepower: 96 },
  { name: 'volkswagen dasher', milesPerGallon: 25, cylinders: 4, horsepower: 71 },
  { name: 'datsun 710', milesPerGallon: 24, cylinders: 4, horsepower: 97 },
  { name: 'ford pinto', milesPerGallon: 18, cylinders: 6, horsepower: 97 },
  { name: 'volkswagen rabbit', milesPerGallon: 29, cylinders: 4, horsepower: 70 },
  { name: 'amc pacer', milesPerGallon: 19, cylinders: 6, horsepower: 90 },
  { name: 'audi 100ls', milesPerGallon: 23, cylinders: 4, horsepower: 95 },
  { name: 'peugeot 504', milesPerGallon: 23, cylinders: 4, horsepower: 88 },
  { name: 'volvo 244dl', milesPerGallon: 22, cylinders: 4, horsepower: 98 },
  { name: 'saab 99le', milesPerGallon: 25, cylinders: 4, horsepower: 115 },
  { name: 'honda civic cvcc', milesPerGallon: 33, cylinders: 4, horsepower: 53 },
  { name: 'fiat 131', milesPerGallon: 28, cylinders: 4, horsepower: 86 },
  { name: 'opel 1900', milesPerGallon: 25, cylinders: 4, horsepower: 81 },
  { name: 'capri ii', milesPerGallon: 25, cylinders: 4, horsepower: 92 },
  { name: 'dodge colt', milesPerGallon: 26, cylinders: 4, horsepower: 79 },
  { name: 'renault 12tl', milesPerGallon: 27, cylinders: 4, horsepower: 83 },
  { name: 'chevrolet chevelle malibu classic', milesPerGallon: 17.5, cylinders: 8, horsepower: 140 },
  { name: 'dodge coronet brougham', milesPerGallon: 16, cylinders: 8, horsepower: 150 },
  { name: 'amc matador', milesPerGallon: 15.5, cylinders: 8, horsepower: 120 },
  { name: 'ford gran torino', milesPerGallon: 14.5, cylinders: 8, horsepower: 152 },
  { name: 'plymouth valiant', milesPerGallon: 22, cylinders: 6, horsepower: 100 },
  { name: 'chevrolet nova', milesPerGallon: 22, cylinders: 6, horsepower: 105 },
  { name: 'ford maverick', milesPerGallon: 24, cylinders: 6, horsepower: 81 },
  { name: 'amc hornet', milesPerGallon: 22.5, cylinders: 6, horsepower: 90 },
  { name: 'chevrolet chevette', milesPerGallon: 29, cylinders: 4, horsepower: 52 },
  { name: 'chevrolet woody', milesPerGallon: 24.5, cylinders: 4, horsepower: 60 },
  { name: 'vw rabbit', milesPerGallon: 29, cylinders: 4, horsepower: 70 },
  { name: 'honda civic', milesPerGallon: 33, cylinders: 4, horsepower: 53 },
  { name: 'dodge aspen se', milesPerGallon: 20, cylinders: 6, horsepower: 100 },
  { name: 'ford granada ghia', milesPerGallon: 18, cylinders: 6, horsepower: 78 },
  { name: 'pontiac ventura sj', milesPerGallon: 18.5, cylinders: 6, horsepower: 110 },
  { name: 'amc pacer d/l', milesPerGallon: 17.5, cylinders: 6, horsepower: 95 },
  { name: 'volkswagen rabbit', milesPerGallon: 29.5, cylinders: 4, horsepower: 71 },
  { name: 'datsun b-210', milesPerGallon: 32, cylinders: 4, horsepower: 70 },
  { name: 'toyota corolla', milesPerGallon: 28, cylinders: 4, horsepower: 75 },
  { name: 'ford pinto', milesPerGallon: 26.5, cylinders: 4, horsepower: 72 },
  { name: 'volvo 245', milesPerGallon: 20, cylinders: 4, horsepower: 102 },
  { name: 'plymouth volare premier v8', milesPerGallon: 13, cylinders: 8, horsepower: 150 },
  { name: 'peugeot 504', milesPerGallon: 19, cylinders: 4, horsepower: 88 },
  { name: 'toyota mark ii', milesPerGallon: 19, cylinders: 6, horsepower: 108 },
  { name: 'mercedes-benz 280s', milesPerGallon: 16.5, cylinders: 6, horsepower: 120 },
  { name: 'cadillac seville', milesPerGallon: 16.5, cylinders: 8, horsepower: 180 },
  { name: 'chevy c10', milesPerGallon: 13, cylinders: 8, horsepower: 145 },
  { name: 'ford f108', milesPerGallon: 13, cylinders: 8, horsepower: 130 },
  { name: 'dodge d100', milesPerGallon: 13, cylinders: 8, horsepower: 150 },
  { name: 'honda Accelerationord cvcc', milesPerGallon: 31.5, cylinders: 4, horsepower: 68 },
  { name: 'buick opel isuzu deluxe', milesPerGallon: 30, cylinders: 4, horsepower: 80 },
  { name: 'renault 5 gtl', milesPerGallon: 36, cylinders: 4, horsepower: 58 },
  { name: 'plymouth arrow gs', milesPerGallon: 25.5, cylinders: 4, horsepower: 96 },
  { name: 'datsun f-10 hatchback', milesPerGallon: 33.5, cylinders: 4, horsepower: 70 },
  { name: 'chevrolet caprice classic', milesPerGallon: 17.5, cylinders: 8, horsepower: 145 },
  { name: 'oldsmobile cutlass supreme', milesPerGallon: 17, cylinders: 8, horsepower: 110 },
  { name: 'dodge monaco brougham', milesPerGallon: 15.5, cylinders: 8, horsepower: 145 },
  { name: 'mercury cougar brougham', milesPerGallon: 15, cylinders: 8, horsepower: 130 },
  { name: 'chevrolet concours', milesPerGallon: 17.5, cylinders: 6, horsepower: 110 },
  { name: 'buick skylark', milesPerGallon: 20.5, cylinders: 6, horsepower: 105 },
  { name: 'plymouth volare custom', milesPerGallon: 19, cylinders: 6, horsepower: 100 },
  { name: 'ford granada', milesPerGallon: 18.5, cylinders: 6, horsepower: 98 },
  { name: 'pontiac grand prix lj', milesPerGallon: 16, cylinders: 8, horsepower: 180 },
  { name: 'chevrolet monte carlo landau', milesPerGallon: 15.5, cylinders: 8, horsepower: 170 },
  { name: 'chrysler cordoba', milesPerGallon: 15.5, cylinders: 8, horsepower: 190 },
  { name: 'ford thunderbird', milesPerGallon: 16, cylinders: 8, horsepower: 149 },
  { name: 'volkswagen rabbit custom', milesPerGallon: 29, cylinders: 4, horsepower: 78 },
  { name: 'pontiac sunbird coupe', milesPerGallon: 24.5, cylinders: 4, horsepower: 88 },
  { name: 'toyota corolla liftback', milesPerGallon: 26, cylinders: 4, horsepower: 75 },
  { name: 'ford mustang ii 2+2', milesPerGallon: 25.5, cylinders: 4, horsepower: 89 },
  { name: 'chevrolet chevette', milesPerGallon: 30.5, cylinders: 4, horsepower: 63 },
  { name: 'dodge colt m/m', milesPerGallon: 33.5, cylinders: 4, horsepower: 83 },
  { name: 'subaru dl', milesPerGallon: 30, cylinders: 4, horsepower: 67 },
  { name: 'volkswagen dasher', milesPerGallon: 30.5, cylinders: 4, horsepower: 78 },
  { name: 'datsun 810', milesPerGallon: 22, cylinders: 6, horsepower: 97 },
  { name: 'bmw 320i', milesPerGallon: 21.5, cylinders: 4, horsepower: 110 },
  { name: 'mazda rx-4', milesPerGallon: 21.5, cylinders: 3, horsepower: 110 },
  { name: 'volkswagen rabbit custom diesel', milesPerGallon: 43.1, cylinders: 4, horsepower: 48 },
  { name: 'ford fiesta', milesPerGallon: 36.1, cylinders: 4, horsepower: 66 },
  { name: 'mazda glc deluxe', milesPerGallon: 32.8, cylinders: 4, horsepower: 52 },
  { name: 'datsun b210 gx', milesPerGallon: 39.4, cylinders: 4, horsepower: 70 },
  { name: 'honda civic cvcc', milesPerGallon: 36.1, cylinders: 4, horsepower: 60 },
  { name: 'oldsmobile cutlass salon brougham', milesPerGallon: 19.9, cylinders: 8, horsepower: 110 },
  { name: 'dodge diplomat', milesPerGallon: 19.4, cylinders: 8, horsepower: 140 },
  { name: 'mercury monarch ghia', milesPerGallon: 20.2, cylinders: 8, horsepower: 139 },
  { name: 'pontiac phoenix lj', milesPerGallon: 19.2, cylinders: 6, horsepower: 105 },
  { name: 'chevrolet malibu', milesPerGallon: 20.5, cylinders: 6, horsepower: 95 },
  { name: 'ford fairmont (auto)', milesPerGallon: 20.2, cylinders: 6, horsepower: 85 },
  { name: 'ford fairmont (man)', milesPerGallon: 25.1, cylinders: 4, horsepower: 88 },
  { name: 'plymouth volare', milesPerGallon: 20.5, cylinders: 6, horsepower: 100 },
  { name: 'amc concord', milesPerGallon: 19.4, cylinders: 6, horsepower: 90 },
  { name: 'buick century special', milesPerGallon: 20.6, cylinders: 6, horsepower: 105 },
  { name: 'mercury zephyr', milesPerGallon: 20.8, cylinders: 6, horsepower: 85 },
  { name: 'dodge aspen', milesPerGallon: 18.6, cylinders: 6, horsepower: 110 },
  { name: 'amc concord d/l', milesPerGallon: 18.1, cylinders: 6, horsepower: 120 },
  { name: 'chevrolet monte carlo landau', milesPerGallon: 19.2, cylinders: 8, horsepower: 145 },
  { name: 'buick regal sport coupe (turbo)', milesPerGallon: 17.7, cylinders: 6, horsepower: 165 },
  { name: 'ford futura', milesPerGallon: 18.1, cylinders: 8, horsepower: 139 },
  { name: 'dodge magnum xe', milesPerGallon: 17.5, cylinders: 8, horsepower: 140 },
  { name: 'chevrolet chevette', milesPerGallon: 30, cylinders: 4, horsepower: 68 },
  { name: 'toyota corona', milesPerGallon: 27.5, cylinders: 4, horsepower: 95 },
  { name: 'datsun 510', milesPerGallon: 27.2, cylinders: 4, horsepower: 97 },
  { name: 'dodge omni', milesPerGallon: 30.9, cylinders: 4, horsepower: 75 },
  { name: 'toyota celica gt liftback', milesPerGallon: 21.1, cylinders: 4, horsepower: 95 },
  { name: 'plymouth sapporo', milesPerGallon: 23.2, cylinders: 4, horsepower: 105 },
  { name: 'oldsmobile starfire sx', milesPerGallon: 23.8, cylinders: 4, horsepower: 85 },
  { name: 'datsun 200-sx', milesPerGallon: 23.9, cylinders: 4, horsepower: 97 },
  { name: 'audi 5000', milesPerGallon: 20.3, cylinders: 5, horsepower: 103 },
  { name: 'volvo 264gl', milesPerGallon: 17, cylinders: 6, horsepower: 125 },
  { name: 'saab 99gle', milesPerGallon: 21.6, cylinders: 4, horsepower: 115 },
  { name: 'peugeot 604sl', milesPerGallon: 16.2, cylinders: 6, horsepower: 133 },
  { name: 'volkswagen scirocco', milesPerGallon: 31.5, cylinders: 4, horsepower: 71 },
  { name: 'honda Accelerationord lx', milesPerGallon: 29.5, cylinders: 4, horsepower: 68 },
  { name: 'pontiac lemans v6', milesPerGallon: 21.5, cylinders: 6, horsepower: 115 },
  { name: 'mercury zephyr 6', milesPerGallon: 19.8, cylinders: 6, horsepower: 85 },
  { name: 'ford fairmont 4', milesPerGallon: 22.3, cylinders: 4, horsepower: 88 },
  { name: 'amc concord dl 6', milesPerGallon: 20.2, cylinders: 6, horsepower: 90 },
  { name: 'dodge aspen 6', milesPerGallon: 20.6, cylinders: 6, horsepower: 110 },
  { name: 'chevrolet caprice classic', milesPerGallon: 17, cylinders: 8, horsepower: 130 },
  { name: 'ford ltd landau', milesPerGallon: 17.6, cylinders: 8, horsepower: 129 },
  { name: 'mercury grand marquis', milesPerGallon: 16.5, cylinders: 8, horsepower: 138 },
  { name: 'dodge st. regis', milesPerGallon: 18.2, cylinders: 8, horsepower: 135 },
  { name: 'buick estate wagon (sw)', milesPerGallon: 16.9, cylinders: 8, horsepower: 155 },
  { name: 'ford country squire (sw)', milesPerGallon: 15.5, cylinders: 8, horsepower: 142 },
  { name: 'chevrolet malibu classic (sw)', milesPerGallon: 19.2, cylinders: 8, horsepower: 125 },
  { name: 'chrysler lebaron town @ country (sw)', milesPerGallon: 18.5, cylinders: 8, horsepower: 150 },
  { name: 'vw rabbit custom', milesPerGallon: 31.9, cylinders: 4, horsepower: 71 },
  { name: 'maxda glc deluxe', milesPerGallon: 34.1, cylinders: 4, horsepower: 65 },
  { name: 'dodge colt hatchback custom', milesPerGallon: 35.7, cylinders: 4, horsepower: 80 },
  { name: 'amc spirit dl', milesPerGallon: 27.4, cylinders: 4, horsepower: 80 },
  { name: 'mercedes benz 300d', milesPerGallon: 25.4, cylinders: 5, horsepower: 77 },
  { name: 'cadillac eldorado', milesPerGallon: 23, cylinders: 8, horsepower: 125 },
  { name: 'peugeot 504', milesPerGallon: 27.2, cylinders: 4, horsepower: 71 },
  { name: 'oldsmobile cutlass salon brougham', milesPerGallon: 23.9, cylinders: 8, horsepower: 90 },
  { name: 'plymouth horizon', milesPerGallon: 34.2, cylinders: 4, horsepower: 70 },
  { name: 'plymouth horizon tc3', milesPerGallon: 34.5, cylinders: 4, horsepower: 70 },
  { name: 'datsun 210', milesPerGallon: 31.8, cylinders: 4, horsepower: 65 },
  { name: 'fiat strada custom', milesPerGallon: 37.3, cylinders: 4, horsepower: 69 },
  { name: 'buick skylark limited', milesPerGallon: 28.4, cylinders: 4, horsepower: 90 },
  { name: 'chevrolet citation', milesPerGallon: 28.8, cylinders: 6, horsepower: 115 },
  { name: 'oldsmobile omega brougham', milesPerGallon: 26.8, cylinders: 6, horsepower: 115 },
  { name: 'pontiac phoenix', milesPerGallon: 33.5, cylinders: 4, horsepower: 90 },
  { name: 'vw rabbit', milesPerGallon: 41.5, cylinders: 4, horsepower: 76 },
  { name: 'toyota corolla tercel', milesPerGallon: 38.1, cylinders: 4, horsepower: 60 },
  { name: 'chevrolet chevette', milesPerGallon: 32.1, cylinders: 4, horsepower: 70 },
  { name: 'datsun 310', milesPerGallon: 37.2, cylinders: 4, horsepower: 65 },
  { name: 'chevrolet citation', milesPerGallon: 28, cylinders: 4, horsepower: 90 },
  { name: 'ford fairmont', milesPerGallon: 26.4, cylinders: 4, horsepower: 88 },
  { name: 'amc concord', milesPerGallon: 24.3, cylinders: 4, horsepower: 90 },
  { name: 'dodge aspen', milesPerGallon: 19.1, cylinders: 6, horsepower: 90 },
  { name: 'audi 4000', milesPerGallon: 34.3, cylinders: 4, horsepower: 78 },
  { name: 'toyota corona liftback', milesPerGallon: 29.8, cylinders: 4, horsepower: 90 },
  { name: 'mazda 626', milesPerGallon: 31.3, cylinders: 4, horsepower: 75 },
  { name: 'datsun 510 hatchback', milesPerGallon: 37, cylinders: 4, horsepower: 92 },
  { name: 'toyota corolla', milesPerGallon: 32.2, cylinders: 4, horsepower: 75 },
  { name: 'mazda glc', milesPerGallon: 46.6, cylinders: 4, horsepower: 65 },
  { name: 'dodge colt', milesPerGallon: 27.9, cylinders: 4, horsepower: 105 },
  { name: 'datsun 210', milesPerGallon: 40.8, cylinders: 4, horsepower: 65 },
  { name: 'vw rabbit c (diesel)', milesPerGallon: 44.3, cylinders: 4, horsepower: 48 },
  { name: 'vw dasher (diesel)', milesPerGallon: 43.4, cylinders: 4, horsepower: 48 },
  { name: 'audi 5000s (diesel)', milesPerGallon: 36.4, cylinders: 5, horsepower: 67 },
  { name: 'mercedes-benz 240d', milesPerGallon: 30, cylinders: 4, horsepower: 67 },
  { name: 'honda civic 1500 gl', milesPerGallon: 44.6, cylinders: 4, horsepower: 67 },
  { name: 'renault lecar deluxe', milesPerGallon: 40.9, cylinders: 4, horsepower: 0 },
  { name: 'subaru dl', milesPerGallon: 33.8, cylinders: 4, horsepower: 67 },
  { name: 'vokswagen rabbit', milesPerGallon: 29.8, cylinders: 4, horsepower: 62 },
  { name: 'datsun 280-zx', milesPerGallon: 32.7, cylinders: 6, horsepower: 132 },
  { name: 'mazda rx-7 gs', milesPerGallon: 23.7, cylinders: 3, horsepower: 100 },
  { name: 'triumph tr7 coupe', milesPerGallon: 35, cylinders: 4, horsepower: 88 },
  { name: 'ford mustang cobra', milesPerGallon: 23.6, cylinders: 4, horsepower: 0 },
  { name: 'honda Accelerationord', milesPerGallon: 32.4, cylinders: 4, horsepower: 72 },
  { name: 'plymouth reliant', milesPerGallon: 27.2, cylinders: 4, horsepower: 84 },
  { name: 'buick skylark', milesPerGallon: 26.6, cylinders: 4, horsepower: 84 },
  { name: 'dodge aries wagon (sw)', milesPerGallon: 25.8, cylinders: 4, horsepower: 92 },
  { name: 'chevrolet citation', milesPerGallon: 23.5, cylinders: 6, horsepower: 110 },
  { name: 'plymouth reliant', milesPerGallon: 30, cylinders: 4, horsepower: 84 },
  { name: 'toyota starlet', milesPerGallon: 39.1, cylinders: 4, horsepower: 58 },
  { name: 'plymouth champ', milesPerGallon: 39, cylinders: 4, horsepower: 64 },
  { name: 'honda civic 1300', milesPerGallon: 35.1, cylinders: 4, horsepower: 60 },
  { name: 'subaru', milesPerGallon: 32.3, cylinders: 4, horsepower: 67 },
  { name: 'datsun 210', milesPerGallon: 37, cylinders: 4, horsepower: 65 },
  { name: 'toyota tercel', milesPerGallon: 37.7, cylinders: 4, horsepower: 62 },
  { name: 'mazda glc 4', milesPerGallon: 34.1, cylinders: 4, horsepower: 68 },
  { name: 'plymouth horizon 4', milesPerGallon: 34.7, cylinders: 4, horsepower: 63 },
  { name: 'ford escort 4w', milesPerGallon: 34.4, cylinders: 4, horsepower: 65 },
  { name: 'ford escort 2h', milesPerGallon: 29.9, cylinders: 4, horsepower: 65 },
  { name: 'volkswagen jetta', milesPerGallon: 33, cylinders: 4, horsepower: 74 },
  { name: 'renault 18i', milesPerGallon: 34.5, cylinders: 4, horsepower: 0 },
  { name: 'honda prelude', milesPerGallon: 33.7, cylinders: 4, horsepower: 75 },
  { name: 'toyota corolla', milesPerGallon: 32.4, cylinders: 4, horsepower: 75 },
  { name: 'datsun 200sx', milesPerGallon: 32.9, cylinders: 4, horsepower: 100 },
  { name: 'mazda 626', milesPerGallon: 31.6, cylinders: 4, horsepower: 74 },
  { name: 'peugeot 505s turbo diesel', milesPerGallon: 28.1, cylinders: 4, horsepower: 80 },
  { name: 'saab 900s', milesPerGallon: 0, cylinders: 4, horsepower: 110 },
  { name: 'volvo diesel', milesPerGallon: 30.7, cylinders: 6, horsepower: 76 },
  { name: 'toyota cressida', milesPerGallon: 25.4, cylinders: 6, horsepower: 116 },
  { name: 'datsun 810 maxima', milesPerGallon: 24.2, cylinders: 6, horsepower: 120 },
  { name: 'buick century', milesPerGallon: 22.4, cylinders: 6, horsepower: 110 },
  { name: 'oldsmobile cutlass ls', milesPerGallon: 26.6, cylinders: 8, horsepower: 105 },
  { name: 'ford granada gl', milesPerGallon: 20.2, cylinders: 6, horsepower: 88 },
  { name: 'chrysler lebaron salon', milesPerGallon: 17.6, cylinders: 6, horsepower: 85 },
  { name: 'chevrolet cavalier', milesPerGallon: 28, cylinders: 4, horsepower: 88 },
  { name: 'chevrolet cavalier wagon', milesPerGallon: 27, cylinders: 4, horsepower: 88 },
  { name: 'chevrolet cavalier 2-door', milesPerGallon: 34, cylinders: 4, horsepower: 88 },
  { name: 'pontiac j2000 se hatchback', milesPerGallon: 31, cylinders: 4, horsepower: 85 },
  { name: 'dodge aries se', milesPerGallon: 29, cylinders: 4, horsepower: 84 },
  { name: 'pontiac phoenix', milesPerGallon: 27, cylinders: 4, horsepower: 90 },
  { name: 'ford fairmont futura', milesPerGallon: 24, cylinders: 4, horsepower: 92 },
  { name: 'amc concord dl', milesPerGallon: 23, cylinders: 4, horsepower: 0 },
  { name: 'volkswagen rabbit l', milesPerGallon: 36, cylinders: 4, horsepower: 74 },
  { name: 'mazda glc custom l', milesPerGallon: 37, cylinders: 4, horsepower: 68 },
  { name: 'mazda glc custom', milesPerGallon: 31, cylinders: 4, horsepower: 68 },
  { name: 'plymouth horizon miser', milesPerGallon: 38, cylinders: 4, horsepower: 63 },
  { name: 'mercury lynx l', milesPerGallon: 36, cylinders: 4, horsepower: 70 },
  { name: 'nissan stanza xe', milesPerGallon: 36, cylinders: 4, horsepower: 88 },
  { name: 'honda Accelerationord', milesPerGallon: 36, cylinders: 4, horsepower: 75 },
  { name: 'toyota corolla', milesPerGallon: 34, cylinders: 4, horsepower: 70 },
  { name: 'honda civic', milesPerGallon: 38, cylinders: 4, horsepower: 67 },
  { name: 'honda civic (auto)', milesPerGallon: 32, cylinders: 4, horsepower: 67 },
  { name: 'datsun 310 gx', milesPerGallon: 38, cylinders: 4, horsepower: 67 },
  { name: 'buick century limited', milesPerGallon: 25, cylinders: 6, horsepower: 110 },
  { name: 'oldsmobile cutlass ciera (diesel)', milesPerGallon: 38, cylinders: 6, horsepower: 85 },
  { name: 'chrysler lebaron medallion', milesPerGallon: 26, cylinders: 4, horsepower: 92 },
  { name: 'ford granada l', milesPerGallon: 22, cylinders: 6, horsepower: 112 },
  { name: 'toyota celica gt', milesPerGallon: 32, cylinders: 4, horsepower: 96 },
  { name: 'dodge charger 2.2', milesPerGallon: 36, cylinders: 4, horsepower: 84 },
  { name: 'chevrolet camaro', milesPerGallon: 27, cylinders: 4, horsepower: 90 },
  { name: 'ford mustang gl', milesPerGallon: 27, cylinders: 4, horsepower: 86 },
  { name: 'vw pickup', milesPerGallon: 44, cylinders: 4, horsepower: 52 },
  { name: 'dodge rampage', milesPerGallon: 32, cylinders: 4, horsepower: 84 },
  { name: 'ford ranger', milesPerGallon: 28, cylinders: 4, horsepower: 79 },
  { name: 'chevy s-10', milesPerGallon: 31, cylinders: 4, horsepower: 82 }
];

/**
 * 给数组添加随机扰动
 * @param {Array} arr - 数组对象
 * @param {string} keyField - 字段属性
 * @param {number} factor - 扰动因子
 * @return {Array} - 扰动后的数组
 */
function jitter(arr, keyField, factor) {
  const data = arr.map(d => d[keyField]);
  // 计算标准差
  const stdev = factor * (Math.max(...data) - Math.min(...data));
  // x方向增加扰动值, 范围是[-0.5, 0.5]
  return arr.map(item => ({
    ...item,
    x: item[keyField] + (Math.random() - 0.5) * stdev
  }));
}

const jitterData = jitter(data.flat(), 'cylinders', 0.15);

// 图表配置
const spec = {
  type: 'common',
  series: [
    {
      type: 'scatter',
      xField: 'x',
      yField: 'horsepower',
      seriesField: 'cylinders',
      point: {
        state: {
          hover: {
            scaleX: 1.2,
            scaleY: 1.2
          }
        },
        style: {
          fillOpacity: 0.5
        }
      }
    }
  ],
  tooltip: {
    dimension: {
      visible: true
    },
    mark: {
      title: true,
      content: [
        {
          key: d => d.name,
          value: d => d.y
        }
      ]
    }
  },
  crosshair: {
    yField: {
      visible: true,
      line: { visible: true, type: 'line' },
      label: {
        visible: true // label default close
      }
    },
    xField: {
      visible: true,
      line: { visible: true, type: 'line' },
      label: {
        visible: true // label default close
      }
    }
  },
  axes: [
    {
      title: {
        visible: true,
        text: 'Horse Power'
      },
      orient: 'left',
      range: { min: 0 },
      type: 'linear'
    },
    {
      title: {
        visible: true,
        text: 'Cylinders'
      },
      orient: 'bottom',
      label: { visible: true },
      range: { min: 2.5 },
      type: 'linear'
    }
  ],
  data: [
    {
      id: 'data',
      values: jitterData
    }
  ],
  legends: [
    {
      visible: true,
      orient: 'top'
    }
  ]
};

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderAsync();

// Just for the convenience of console debugging, do not copy
window.vchart = vchart;
```

## Related Tutorials

[Scatter Plot](link)
