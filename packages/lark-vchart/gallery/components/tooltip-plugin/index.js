Component({
  data: {
    tipsAnimation: null,
    tipsData: { visible: true },
    style: {}
  },
  methods: {
    init(chartInstance) {
      chartInstance.setTooltipListener(({ data, event }) => {
        if (!event) {
          return;
        }
        const { style, options } = chartInstance.chart.tooltip.tooltipHandler;

        const { offsetX = 0, offsetY = 0 } = options;
        const { title, contents } = data || {};
        const { srX, srY } = event.changedTouches
          ? event.changedTouches[0]
          : event;
        const { width: w, height: h, padding } = chartInstance.chart;
        const width = w + padding.left + padding.right;
        const height = h + padding.top + padding.bottom;

        const maxW = style.panel.maxWidth || 9999999;
        const textW = this.getMaxTextWidth(title, contents);
        const panelW = textW > maxW ? maxW : textW;
        const panelH = this.getTextHeight(title, contents);

        const deltaX =
          panelW + srX + offsetX > width
            ? srX - panelW - offsetX
            : srX + offsetX;
        const deltaY =
          panelH + srY + offsetY > height
            ? height - panelH - offsetY
            : srY + offsetY;

        if (!this.tipsAnimation) {
          this.tipsAnimation = tt.createAnimation({ duration: 0 });
        }
        this.tipsAnimation
          .opacity(data ? 1 : 0)
          .top(deltaY)
          .left(deltaX)
          .step();
        this.setData({
          style: this.generateStyle(style),
          tipsData: { title, content: contents, visible: true },
          tipsAnimation: this.tipsAnimation.export()
        });
      });
    },

    getMaxTextWidth(title, contents = []) {
      const titleLen = this.getLength((title && title.value) || "");
      const maxTextLen = contents.reduce((max, item) => {
        const length = this.getLength(item.key + item.value);
        return length > max ? length : max;
      }, titleLen);

      return (maxTextLen * 12 + 30 + 24) / 2;
    },

    getTextHeight(title, contents = []) {
      return ((contents.length + (title && title.value ? 1 : 0)) * 44 + 26) / 2;
    },

    getLength(str) {
      let len = 0;
      for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 127 || str.charCodeAt(i) === 94) {
          len += 2;
        } else {
          len++;
        }
      }
      return len;
    },

    generateStyle(style) {
      return {
        panel: style.panel,
        titleStyle: style.title,
        contentStyle: style.content,
        valueStyle: style.value
      };
    }
  }
});
