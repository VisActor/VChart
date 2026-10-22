---
title: 112. How to use the tooltip and abscissa in the vchart library?</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
# Question title

How to use the tooltip and abscissa in the vchart library?</br>


# Problem description

I am using the vchart library to create charts, but I am having trouble setting the tooltip and abscissa. I tried to configure the tooltip, but it did not display, even if I set it to visible.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/V2tZbHwSkoVAhnxomLfcSkoenmf.gif' alt='' width='674' height='692'>

In addition, I also hope to be able to customize the content of the x-axis. I'm not sure if my usage is incorrect or there are other issues.</br>


# Solution

Firstly, regarding the configuration issue of tooltip, your setting method is correct.</br>


Then, regarding the issue of tooltip not taking effect, you need to check if your `content `is written in the wrong place. If you want to customize the content of the tooltip, you can refer to [this example of vchart ](https://www.visactor.io/vchart/demo/tooltip/custom-tooltip).</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/WXw6biTKvoapmWxY9VVcel0oneg.gif' alt='' width='3482' height='1592'>

Finally, regarding the customization of the x-axis, you can achieve it by setting the style in `axes.label `. You can also use `formatMethod `to customize the content. The specific implementation method can refer to [this example of vchart ](https://www.visactor.io/vchart/demo/axis/grid-style).</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/NNrEbOSDfokcQ0xaBwNcPTA4nUe.gif' alt='' width='3526' height='1306'>





# Related Documents

*  [VChart Tooltip User Guide](https://www.visactor.io/vchart/guide/tutorial_docs/Chart_Concepts/Tooltip)</br>
*  [Example of vchart Axis style settings](https://www.visactor.io/vchart/demo/axis/style)</br>
*  [Vchart Custom Tooltip Example](https://www.visactor.io/vchart/demo/tooltip/custom-tooltip)</br>
*  [VChart Axis Grid Style Example](https://www.visactor.io/vchart/demo/axis/grid-style)</br>

