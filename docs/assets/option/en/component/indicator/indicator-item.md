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

#${prefix} fitStrategy(string) = 'default'

Strategies employed in adaptive text computing. Options:

- 'default': The default adaptive strategy, each text calculates the font size independently based on the available space;
- 'inscribed': Inscribed rectangle calculation strategy. All texts configured with the inscribed strategy will jointly calculate the inscribed rectangle of the available space to avoid occlusion with elements outside the available space.

#${prefix} style(Object)

Text style

##${prefix} type(string)

Supported since version 1.7.0, text type

Optional:

- 'text'
- 'rich'

##${prefix} text(string | number | Array)

Text content.
Rich text content is supported since version 1.7.0.

{{ use: graphic-text(
  prefix = '####'
) }}
