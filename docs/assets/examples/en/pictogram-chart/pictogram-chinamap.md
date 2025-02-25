---
category: examples
group: pictogram chart
title: Map of China eating spicy degree pictograph  
keywords: pictogramChart,map,comparison,china
order: 26-6
cover: https://cdn.jsdelivr.net/gh/UC-web291/picture_storing/chinamapv4.gif
option: pictogramChart
---

# Chinese Map Pictogram - A Glance at the Spiciness Level in Chinese Provinces

contributed by Qian_Shark

This pictogram chart shows the classification information of different regions in China. The colors are mapped according to different spiciness categories, with warmer colors indicating a higher tolerance for spicy food and cooler colors indicating a lower tolerance. It also supports legend hover interaction to display provincial information.

## Key Configurations
- In the SVG file, configure the name attribute for the graphic elements. Then, in the chart configuration, you can specify the element styles through the name configuration.
- Register SVG resources using the VChart.registerSVG interface.
- Declare the registered SVG name using the svg attribute.
- Declare the chart type as a pictogram using the type: pictogram attribute.
- Define the data source using the data attribute.
- onfigure color mapping using the color attribute.
- Declare the series field and name field using the seriesField and nameField attributes respectively.
- Specify the SVG graphic to use with the svg attribute.
- Declare the styles of the pictogram elements using the pictogram.style attribute.
- Listen for the legendItemHover and legendItemUnHover events to implement legend hover interaction.


## Code Demo

```javascript livedemo
/** --Add the following code when using in business context-- */
// When using in business context, please additionally import
// import { registerPictogramChart } from '@visactor/vchart';
// registerPictogramChart();
/** --Add the above code when using in business context-- */

// VCHART_MODULE.registerPictogramChart();
/** --Delete the above code when using in business context-- */
const response = await fetch('https://cdn.jsdelivr.net/gh/UC-web291/picture_storing/chinamap.svg');
const shape = await response.text();
      // Define map data
      const chinamap_data = [
        { id: 'CN-11', name: 'Beijing', category: 'gold' },
        { id: 'CN-12', name: 'Tianjin', category: 'gold' },
        { id: 'CN-13', name: 'Hebei', category: 'gold' },
        { id: 'CN-14', name: 'Shanxi', category: 'diamond' },
        { id: 'CN-15', name: 'Inner Mongolia', category: 'diamond' },
        { id: 'CN-21', name: 'Liaoning', category: 'diamond' },
        { id: 'CN-22', name: 'Jilin', category: 'diamond' },
        { id: 'CN-23', name: 'Heilongjiang', category: 'diamond' },
        { id: 'CN-31', name: 'Shanghai', category: 'silver' },
        { id: 'CN-32', name: 'Jiangsu', category: 'silver' },
        { id: 'CN-33', name: 'Zhejiang', category: 'silver' },
        { id: 'CN-34', name: 'Anhui', category: 'silver' },
        { id: 'CN-35', name: 'Fujian', category: 'silver' },
        { id: 'CN-36', name: 'Jiangxi', category: 'diamond' },
        { id: 'CN-37', name: 'Shandong', category: 'gold' },
        { id: 'CN-41', name: 'Henan', category: 'gold' },
        { id: 'CN-42', name: 'Hubei', category: 'diamond' },
        { id: 'CN-43', name: 'Hunan', category: 'MVP' },
        { id: 'CN-44', name: 'Guangdong', category: 'silver' },
        { id: 'CN-46', name: 'Hainan', category: 'bronze' },
        { id: 'CN-50', name: 'Chongqing', category: 'MVP' },
        { id: 'CN-51', name: 'Sichuan', category: 'MVP' },
        { id: 'CN-52', name: 'Guizhou', category: 'MVP' },
        { id: 'CN-53', name: 'Yunnan', category: 'diamond' },
        { id: 'CN-54', name: 'Tibet', category: 'bronze' },
        { id: 'CN-61', name: 'Shaanxi', category: 'gold' },
        { id: 'CN-62', name: 'Gansu', category: 'MVP' },
        { id: 'CN-63', name: 'Qinghai', category: 'bronze' },
        { id: 'CN-64', name: 'Ningxia', category: 'bronze' },
        { id: 'CN-65', name: 'Xinjiang', category: 'MVP' },
        { id: 'CN-91', name: 'Hong Kong', category: 'bronze' },
        { id: 'CN-92', name: 'Macau', category: 'bronze' },
        { id: 'CN-71', name: 'Taiwan', category: 'bronze' },
        { id: 'CN-45', name: 'Guangxi', category: 'gold' }
      ]
      // Define chart configuration objects
      const spec = {
        // The chart type is pictograph
        type: 'pictogram',
        data: {
          // Unique identifier of the data
          id: 'data',
          // Data value
          values: chinamap_data,
        },
        color: {
          specified: {
            // Diamond -- pink
            diamond: 'pink',
            //  Gold -- orange
            gold: 'orange',
            //  Silver - yellow
            silver: 'yellow',
            // Bronze -- green
            bronze: 'green',
            // Master -- Red
            MVP: 'red',
            // The color of undefined categories is white
            undefined: 'white',
          },
          // Series fields are categories
          field: 'category'
        },
        // Series fields are categories
        seriesField: 'category',
        //  The name field is the name
        nameField: 'id',
        valueField: 'name',
        // SVG graphic name used
        svg: 'chinamap',
        pictogram: {
          style: {
            fill: {
              // Fill color Use color to map the color. The fields are categories
              scale: 'color',
              field: 'category'
            }
          },
          state: {
            //  The fill color of the legend hover is gray
            legend_hover_reverse: {
              fill: '#ccc',
            }
          }
        },
        //  Chart title
        title: {
          text: 'Spicy food in China at a glance'
        },
        legends: [
          {
            orient: 'top',
            position: 'middle',
            padding: {
              bottom: 12
            },
            visible: true,
            field: 'category',
            filter: false,
            select: false,
            data: items => {
              return items.map(item => {
                item.shape.outerBorder = {
                  stroke: item.shape.fill,
                  distance: 2,
                  lineWidth: 1
                };
                return item;
              });
            },
          }
        ],
      };

      // VChart.registerPictogramChart();
      // VChart.default.registerSVG('chinamap', shape);
      
      VChart.registerSVG('chinamap', shape);

      const vchart = new VChart.(spec, { dom: CONTAINER_ID  });
      // Listen for legend item hover events
      vchart.on('legendItemHover', e => {
        // Gets the legend item name of the hover
        const hoveredName = e?.value?.data?.label;
        if (hoveredName) {
          // Update the chart status by setting the color of the legend item that is not hovering
          vchart.updateState({
            legend_hover_reverse: {
              filter: d => {
                // Finds the category of the current data item
                const category = chinamap_data.find(chinamap_data => chinamap_data.id === d.data?.id)?.category;
                // Return true if the class exists and is not equal to the legend item name of the hover, fals
                return category && category!== hoveredName;
              }

          }
        });
      }
    });

  // Listen for the legend item unhover event
vchart.on('legendItemUnHover', e => {
  // Update the chart state to restore the color of all legend items to the original color
  vchart.updateState({
    legend_hover_reverse: {
      filter: d => false
    }
  });
});

vchart.renderSync();

// Just for the convenience of console debugging, DO NOT COPY!
window['vchart'] = vchart;
```

## Related Tutorials

[PictogramChart](link)


       
