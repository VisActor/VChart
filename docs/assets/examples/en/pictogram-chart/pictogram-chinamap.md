---
category: examples
group: pictogram chart
title: Map of China eating spicy degree pictograph  
keywords: pictogramChart,map,comparison,china
order: 26-6
cover: https://cdn.jsdelivr.net/gh/UC-web291/picture_storing/chinav4.gif
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
VCHART_MODULE.registerPictogramChart();
/** --Delete the above code when using in business context-- */
const response = await fetch('https://cdn.jsdelivr.net/gh/UC-web291/picture_storing/china.svg');
const shape = await response.text();
// Define map data
const chinamap_data = [
  { name: 'Hunan', category: 'MVP' ,level:'🌶🌶🌶🌶'},
  { name: 'Chongqing', category: 'MVP',level:'🌶🌶🌶🌶' },
  { name: 'Sichuan', category: 'MVP',level:'🌶🌶🌶🌶' },
  { name: 'Guizhou', category: 'MVP' ,level:'🌶🌶🌶🌶'},    
  { name: 'Gansu', category: 'MVP' ,level:'🌶🌶🌶🌶'},
  { name: 'Xinjiang', category: 'MVP' ,level:'🌶🌶🌶🌶'},
  { name: 'Jiangxi', category: 'MVP' ,level:'🌶🌶🌶🌶'},

  { name: 'Shanxi', category: 'diamond' ,level:'🌶🌶🌶'},
  { name: 'Nei Mongol', category: 'diamond' ,level:'🌶🌶🌶'},
  { name: 'Liaoning', category: 'diamond' ,level:'🌶🌶🌶'},
  { name: 'Jilin', category: 'diamond' ,level:'🌶🌶🌶'},
  { name: 'Heilongjiang', category: 'diamond',level:'🌶🌶🌶' },
  { name: 'Hubei', category: 'diamond' ,level:'🌶🌶🌶'},  
  { name: 'Yunnan', category: 'diamond' ,level:'🌶🌶🌶'},  

  { name: 'Beijing', category: 'gold' ,level:'🌶🌶'},
  { name: 'Tianjin', category: 'gold',level:'🌶🌶' },
  { name: 'Hebei', category: 'gold' ,level:'🌶🌶'},  
  { name: 'Shandong', category: 'gold' ,level:'🌶🌶'},
  { name: 'Henan', category: 'gold' ,level:'🌶🌶'},  
  { name: 'Shaanxi', category: 'gold' ,level:'🌶🌶'},  
  { name: 'Guangxi Zhuang', category: 'gold',level:'🌶🌶' },

  { name: 'Shanghai', category: 'silver' ,level:'🌶'},
  { name: 'Jiangsu', category: 'silver' ,level:'🌶'},
  { name: 'Zhejiang', category: 'silver' ,level:'🌶'},
  { name: 'Anhui', category: 'silver' ,level:'🌶'},
  { name: 'Fujian', category: 'silver' ,level:'🌶'},
  { name: 'Guangdong', category: 'silver',level:'🌶' },
  
  { name: 'Hainan', category: 'bronze' ,level:'🌶'},
  { name: 'Tibet', category: 'bronze' ,level:'🌶'},
  { name: 'Quinghai', category: 'bronze' ,level:'🌶'},
  { name: 'Ningxia Hui', category: 'bronze' ,level:'🌶'},
  { name: 'Hong Kong', category: 'bronze' ,level:'🌶'},
  { name: 'Macau', category: 'bronze',level:'🌶' },
  { name: 'Taiwan', category: 'bronze',level:'🌶' }
     
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
             // master
            MVP:'rgb(109, 5, 5)',
            // diamond
            diamond:'rgb(228, 14, 14)',
            //  gold
            gold:'rgb(223, 89, 71)',
            // siliver
            silver:'rgb(247, 166, 16)',
            // bronze
            bronze:'#f8e3b0',
            // The color of undefined categories is white
            undefined: 'white',
          },
          // Series fields are categories
          field: 'category'
        },
        // Series fields are categories
        seriesField: 'category',
        //  The name field is the name
        nameField: 'name',
        valueField: 'level',
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
            //  The fill color of the legend hover is white
            legend_hover_reverse: {
              fill: 'white',
            },
            // The effect of making the province map "spit out" when hovering
            hover: {
            transform: 'scale(2)', 
            opacity: 0.3, 
            shadowBlur: 30, 
            shadowColor: 'rgba(0, 0, 0, 0.97)', 
            transition: {
              duration: 1200, 
              easing: 'ease-out'
            }
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

      const vchart = new VChart(spec, { dom: CONTAINER_ID  });
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
                const category = chinamap_data.find(chinamap_data => chinamap_data.name === d.data?.name)?.category;
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

