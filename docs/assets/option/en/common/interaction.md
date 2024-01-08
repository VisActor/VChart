{{ target: common-interaction }}

#${prefix} interactions(Array)

From version @1.9.0, the configuration format is as follows:

```ts
{
  interactions: [
    {
      type: 'element-active'
    }
  ];
}
```

Configure the supported interaction types internally. The currently supported interaction types are:

- `'element-active'` triggers the element's state to be `active`
- `'element-highlight'` sets the element's state to `highlight` and sets other elements' state to `blur`
- `'element-select'` sets the element's state to `selected`
- `'element-highlight-by-key'` sets the element's state to `highlight` and sets other elements' state to `blur` with the same `key` value as the triggered element
- `'element-highlight-by-group'` sets the element's state to `highlight` and sets other elements' state to `blur` with the same `group` value as the triggered element
- `'element-highlight-by-legend'` triggers through the legend, sets associated element state to `highlight`, and sets other elements' state to `blur`
- `'element-active-by-legend'` triggers through the legend, sets associated element state to `active`
- `'element-highlight-by-name'` when the `name` attribute of the graphic element meets the requirements, sets associated element state to `highlight`, and sets other elements' state to `blur`
