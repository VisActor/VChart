### 数据说明

Time-Travelling-Visualizer × VisActor 数据demo，包含两个训练过程，分别为：

- 代码token与文本token对齐任务（Training_process1）；
- 图像分类任务（Training_process2）；

每个训练过程数据整理成json格式，具体如下：（以包含**60个样本点**、**30个训练轮次**的训练过程1举例）

#### data.json

```json
{
    "1":{
        "projection":[[]], //该epoch下每个样本点二维投影坐标，大小为[60,2]
        "intra_similarity":[[]], //该epoch下每个样本点最相近的6个标签相同的邻居（的下标，包含本身），大小为[60,6]
        "inter_similarity":[[]], //该epoch下每个样本点最相近的6个标签不同的邻居（的下标，包含本身），大小为[60,6]
    },
    "2":{
        ...
    },
    ...  
    "30":{
        ...
    }
}
```

例如，对于样本0来说，其标签为`comment`，且在第一轮中与之最相近的6个`comment`样本分别为[0,1,2,7,4,8]，最相近的6个`code`样本为[12,25,43,14,45,24]，则在第一轮中的intra_similarity第一行为[0,1,2,7,4,8]，inter_similarity的第一行为[12,25,43,14,45,24]，及

```json
{
    "1":{
        "projection":[[]],
        "intra_similarity":[
            [0,1,2,7,4,8], // 第一个样本的邻居
            ...
        ],
        "inter_similarity":[
            [12,25,43,14,45,24], // 第一个样本的邻居
        	...
        ], 
    },
	...
}
```

💡 similarity是为了初步展示样本之间的联系，后续我们可以自行添加更多的样本间联动关系。



#### label.json

```json
{
	"label_index":[], // 每个样本的标签，例:[0,0,0,0,...,1,1,1,1]
	"label_text":[] //每个标签对应的含义，例:[comment, code]
}
```

