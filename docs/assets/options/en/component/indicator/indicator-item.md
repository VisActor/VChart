{{ target: component-indicator-item }}

#${prefix} visible(boolean) = true

Whether to display the current item

#${prefix} field(string)

Text content field.
Higher priority than the text configuration in the style

#${prefix} space(number)

Text spacing.

- `title.space`: spacing between title and content
- `contentItem.space`: spacing between content

#${prefix} autoLimit(boolean) = false

Whether to automatically limit text space.

#${prefix} autoFit(boolean) = false

Whether to automatically fit the text size based on the available space.

#${prefix} fitPercent(number) = 0.5

The ratio of the text width to the available space when automatically fitting the text.

#${prefix} style(Object)

Text style

{{ use: graphic-text(
  prefix = '####'
) }}