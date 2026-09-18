export const createRelatedSpec = () => ({
  type: 'sankey',
  width: 800,
  height: 460,
  data: [
    {
      id: 'data',
      values: [
        {
          nodes: [
            { name: 'A', children: [{ name: 'top', children: [{ name: '00', value: 15 }] }] },
            { name: 'B', children: [{ name: 'top', children: [{ name: '00', value: 100 }] }] },
            { name: 'C', children: [{ name: 'bottom', value: 30 }] }
          ]
        }
      ]
    }
  ],
  categoryField: 'name',
  valueField: 'value',
  nodeKey: (datum: any) => datum.name,
  nodeAlign: 'left',
  nodeWidth: 10,
  nodeGap: 8,
  node: { state: { hover: { fill: 'red' }, blur: { fillOpacity: 0.15 } } },
  link: {
    style: { round: false },
    state: {
      hover: { stroke: '#000000' },
      selected: { backgroundStyle: { fill: '#e8e8e8' } },
      blur: { fill: '#e8e8e8' }
    }
  },
  emphasis: { enable: true, effect: 'related' }
});

/** Read ribbon endpoints independently of the production path encoder (no arrows). */
export const ribbonThickness = (path: string, vertical = false) => {
  const commands = path.match(/[MCLZ][^MCLZ]*/g);
  expect(commands.map(command => command[0])).toEqual(['M', 'C', 'L', 'C', 'Z']);
  const endpoints = commands.slice(0, 4).map(command => {
    const values = command
      .slice(1)
      .trim()
      .split(/[\s,]+/)
      .map(Number);
    return values.slice(-2);
  });
  const axis = vertical ? 0 : 1;
  return [Math.abs(endpoints[3][axis] - endpoints[0][axis]), Math.abs(endpoints[2][axis] - endpoints[1][axis])];
};
