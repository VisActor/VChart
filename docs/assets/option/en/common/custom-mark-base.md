{{ target: common-custom-mark-base }}

<!-- ICustomMarkSpec -->

#${prefix} dataIndex(number)

Supports custom mark using a specific data, if `dataId` is configured, this setting is invalid.

#${prefix} dataId(string)

Supports custom mark using a specific data. After the custom mark specifies the data, the `line` will generate a line node based on each data point, and other graphics will generate a graphic for each data piece.

#${prefix} dataKey(string | Function)
From version **1.9.5** onwards

Supports setting the `key` corresponding field for data after custom mark is associated with data, if not set, it will remain consistent with the series

#${prefix} componentType(string)

From version **1.9.0** onwards

When the type of custom mark is `component`, it can be used to set the specific component type

{{ use: common-mark(
    prefix = ${prefix}
  ) }}
