# Cursor+DeepSeek: Quick Start to Your VChart Code

In the previous sections, we have gained a basic understanding of the components of a spec and how a basic chart is generated. However, due to VChart's powerful features and diverse APIs, quickly implementing a complex chart with VChart can be challenging. Is there an easy way to get started without endlessly searching through API documentation?

The answer is yes! Thanks to the rapid development of current AI technologies, you can quickly understand and master VChart usage with AI tools. This not only significantly boosts your coding efficiency but also allows you as a developer to focus on creativity and business logic. In this tutorial, we will configure `Cursor` and `DeepSeek` (or any other AI) to help you quickly get started with your VChart code!

## 1. Preparation

### A VChart Project

For example, you may have a simple project initialized with:

<div style="text-align: center;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/deepSeek+Cursor_1.PNG" alt="初始化项目">
</div>

### DeepSeek

Register deepSeek, create a new API key on the [deepSeek api 官网](https://platform.deepseek.com/api_keys)

### Cursor

Download and register on the [official website](https://www.cursor.com/), use `cursor` to open your VChart project, and configure `cursor`

### Configure cursor

For example, the model name is `deepseek-chat`, the API address is https://api.deepseek.com/v1, see [api usage official website](https://api-docs.deepseek.com/zh-cn/)
We create a new model in the `model` page, set the corresponding `api` address and `model` name.

_Note: Currently, `cursor` official website does not support direct access to `deepSeek`. We can achieve access to `deepSeek` by overriding the interface address of `openAPI`. During the setup process, we need to close other models and only access `deepSeek` model_

<div style="text-align: center;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/deepseek_en_1.jpeg" alt="cursor配置">
</div>

## 2. Practice

### Add Column Chart

Use `cmd+i` command to call up AI interaction, directly let AI generate a simple column chart code, apply this spec, we check the result, a simple column chart is rendered; we can find that `deepSeek` has a certain understanding of `vchart`, simple charts can be directly added, we try a more complex scenario.

<p style="text-align: center;">
 <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/deep_seek_3.PNG" alt="cursor结果" height="380">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/deepseek_4.PNG" alt="渲染结果" height="380">
</p>

### Complex Scenario, Inject Docs

We hope to add an average auxiliary line to the y-axis, check the result, but the result is not correct, carefully check to find that `markLine` seems to be written correctly, but the `spec` does not conform to the specification, and the average line has been calculated, we solve this problem by injecting docs.

<p style="text-align: center;">
 <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/deepseek_5.png" alt="markline_cursor" height="380">
 <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/deepseek_6.png" alt="markline_result" height="380">
</p>

### Set Docs

Enter the `cursor` setting page, select `Features`, add docs, you can choose one of the following docs addresses:

- https://visactor.com/vchart
- https://visactor.io/vchart

![配置docs](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/deep_seek_6.gif)

You can also directly add a new doc through `@Docs` in the editing page

### Experimental Result

After editing the new added docs again, you can get the correct result!

<p style="text-align: center;">
 <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/deepseek_7.png" alt="markline_cursor" height="380">
 <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/deepseek_8.png" alt="markline_result" height="380">
</p>

Through this tutorial, you have learned how to use `cursor+deepseek` to improve your VChart coding efficiency and explore the powerful features and flexibility of VChart. I wish you a pleasant coding experience!
