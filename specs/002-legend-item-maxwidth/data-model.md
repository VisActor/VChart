# Data Model

## Legend Entities

### DiscreteLegendSpec
Updated configuration for discrete legend.

| Field | Type | Description |
|-------|------|-------------|
| `item.maxWidth` | `number | string` | Supports percentage string (e.g., '50%'). When percentage, it should be relative to the available content width (excluding pager). |

### LegendAttributes (Internal)
Attributes passed to `vrender-components`.

| Field | Type | Description |
|-------|------|-------------|
| `items[].maxWidth` | `number | string` | Previously resolved to `number` (pixels). Now preserves `string` (percentage) if specified in spec. |
