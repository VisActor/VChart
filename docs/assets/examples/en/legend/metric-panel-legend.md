---
category: demo
group: legend
title: Metric Panel Legend
keywords: lineChart,comparison,trend,line,legend
order: 27-10
cover: /vchart/preview/legend-with-metric-panel_1.13.11.jpg
option: lineChart#legends
---

# Metric Panel Legend

## Key option

## Demo source

```javascript livedemo
const leastData = {
  values: [
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 583.8357076505616,
      time: '11:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 413.99094799015154,
      time: '11:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 442.480296005283,
      time: '11:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 563.9225931303649,
      time: '11:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 452.4430035162852,
      time: '11:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 457.33859753363623,
      time: '11:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 543.3563325505742,
      time: '11:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 552.0867849414408,
      time: '11:01:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 479.36468025616307,
      time: '11:01:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 466.78189294024753,
      time: '11:01:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 509.55495340099515,
      time: '11:01:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 452.0295845601941,
      time: '11:01:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 514.8193723728358,
      time: '11:01:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 555.4362511614967,
      time: '11:01:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 591.3844269050346,
      time: '11:02:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 472.5185132716732,
      time: '11:02:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 419.6717451611851,
      time: '11:02:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 502.32182740780746,
      time: '11:02:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 414.9004156096622,
      time: '11:02:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 527.7652604285255,
      time: '11:02:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 450.9404648983933,
      time: '11:02:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 635.1514928204012,
      time: '11:03:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 440.9549203017926,
      time: '11:03:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 492.8397906279033,
      time: '11:03:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 432.0071929510041,
      time: '11:03:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 416.85495412245257,
      time: '11:03:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 484.42034431459234,
      time: '11:03:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 574.7519157038058,
      time: '11:03:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 547.2923312638331,
      time: '11:04:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 447.8663691654391,
      time: '11:04:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 360.3105400448213,
      time: '11:04:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 537.3126783013611,
      time: '11:04:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 379.8697364100153,
      time: '11:04:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 553.876504052763,
      time: '11:04:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 505.846947415828,
      time: '11:04:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 547.293152152541,
      time: '11:05:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 505.88324478942127,
      time: '11:05:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 336.76726483442917,
      time: '11:05:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 532.2742090570538,
      time: '11:05:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 537.478837159347,
      time: '11:05:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 422.91554429332473,
      time: '11:05:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 537.3396505992774,
      time: '11:05:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 637.9606407753696,
      time: '11:06:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 412.4214305582085,
      time: '11:06:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 310.0639875547861,
      time: '11:06:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 608.162736165273,
      time: '11:06:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 387.80683823043574,
      time: '11:06:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 470.3170270360141,
      time: '11:06:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 610.6110314127712,
      time: '11:06:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 597.3717364576454,
      time: '11:07:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 469.3548690585019,
      time: '11:07:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 473.8022155744592,
      time: '11:07:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 484.61108825235,
      time: '11:07:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 415.3547401102046,
      time: '11:07:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 444.15888396985974,
      time: '11:07:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 574.8419657932766,
      time: '11:07:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 535.5262807032524,
      time: '11:08:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 431.8903673783053,
      time: '11:08:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 431.71828281770286,
      time: '11:08:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 510.95751638319695,
      time: '11:08:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 414.0796367215401,
      time: '11:08:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 386.673169146347,
      time: '11:08:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 516.5734676047084,
      time: '11:08:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 586.1280021792983,
      time: '11:09:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 431.115939838639,
      time: '11:09:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 396.22076645447726,
      time: '11:09:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 512.4691841855378,
      time: '11:09:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 494.74621884722205,
      time: '11:09:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 475.86596570786503,
      time: '11:09:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 485.4403887292356,
      time: '11:09:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 535.8291153593768,
      time: '11:10:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 496.93884259935953,
      time: '11:10:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 412.998431315991,
      time: '11:10:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 578.8726639881737,
      time: '11:10:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 435.2525160853986,
      time: '11:10:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 473.9126245808358,
      time: '11:10:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 422.4092299335348,
      time: '11:10:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 535.7135123214872,
      time: '11:11:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 483.2708174494015,
      time: '11:11:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 342.72554763508117,
      time: '11:11:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 495.23522338065237,
      time: '11:11:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 512.3871036336867,
      time: '11:11:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 555.6724871621066,
      time: '11:11:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 494.042334037879,
      time: '11:11:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 571.0981135783018,
      time: '11:12:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 482.67548180003195,
      time: '11:12:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 521.2875989808413,
      time: '11:12:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 513.951076288517,
      time: '11:12:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 416.3254687878066,
      time: '11:12:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 511.54058422773886,
      time: '11:12:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 519.4434880586152,
      time: '11:12:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 463.3359877671101,
      time: '11:13:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 507.27394035771647,
      time: '11:13:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 405.4610590987614,
      time: '11:13:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 530.3948254858269,
      time: '11:13:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 463.9497081111901,
      time: '11:13:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 428.79065878353975,
      time: '11:13:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 480.6410236424408,
      time: '11:13:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 472.75410837434833,
      time: '11:14:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 443.05019208163793,
      time: '11:14:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 404.46973973024467,
      time: '11:14:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 509.33045615781793,
      time: '11:14:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 408.2326473370121,
      time: '11:14:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 572.7046283167094,
      time: '11:14:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 523.4371516453848,
      time: '11:14:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 530.8856235379513,
      time: '11:15:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 476.09764856474817,
      time: '11:15:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 435.2883311949346,
      time: '11:15:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 477.6783192724736,
      time: '11:15:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 557.2574563886694,
      time: '11:15:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 541.0516847762676,
      time: '11:15:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 533.8425941479384,
      time: '11:15:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 508.3584439832788,
      time: '11:16:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 426.4866621703272,
      time: '11:16:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 423.05046158683564,
      time: '11:16:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 509.70449964491536,
      time: '11:16:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 390.62007904852436,
      time: '11:16:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 509.1048851734308,
      time: '11:16:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 518.7572009095961,
      time: '11:16:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 574.7123666297637,
      time: '11:17:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 458.2083176244221,
      time: '11:17:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 410.19420121395655,
      time: '11:17:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 553.6815874929886,
      time: '11:17:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 465.49103551135136,
      time: '11:17:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 468.6757950575084,
      time: '11:17:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 497.499870958827,
      time: '11:17:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 513.5987962239394,
      time: '11:18:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 435.49284728161575,
      time: '11:18:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 359.4762772277344,
      time: '11:18:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 448.674235029447,
      time: '11:18:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 481.6888440466049,
      time: '11:18:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 432.028038163826,
      time: '11:18:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 538.4327335983364,
      time: '11:18:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 488.3848149332354,
      time: '11:19:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 446.8497982496359,
      time: '11:19:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 422.5734178567998,
      time: '11:19:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 506.6484837073438,
      time: '11:19:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 470.6899548725749,
      time: '11:19:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 461.3896611964474,
      time: '11:19:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 552.0970324784705,
      time: '11:19:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 632.2824384460777,
      time: '11:20:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 471.75785127184565,
      time: '11:20:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 493.1012248237517,
      time: '11:20:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 464.99395925304134,
      time: '11:20:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 440.73561705611456,
      time: '11:20:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 534.4374309852093,
      time: '11:20:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 475.4800461278577,
      time: '11:20:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 547.7111849756732,
      time: '11:21:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 401.0889658383264,
      time: '11:21:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 466.27100230774886,
      time: '11:21:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 559.7523314462421,
      time: '11:21:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 443.5089650133287,
      time: '11:21:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 574.2293152967304,
      time: '11:21:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 600.5466189873135,
      time: '11:21:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 562.3764102343962,
      time: '11:22:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 546.619363784273,
      time: '11:22:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 478.65933133196984,
      time: '11:22:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 423.8406547608113,
      time: '11:22:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 452.1905735989555,
      time: '11:22:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 557.1621764136095,
      time: '11:22:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 525.0705933857869,
      time: '11:22:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 487.76259068932717,
      time: '11:23:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 391.6991309250149,
      time: '11:23:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 373.43921617844074,
      time: '11:23:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 472.0539076364206,
      time: '11:23:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 442.64989991857556,
      time: '11:23:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 455.5575289106863,
      time: '11:23:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 530.9424811472423,
      time: '11:23:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 531.7808637737409,
      time: '11:24:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 381.2905693606134,
      time: '11:24:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 349.519758987071,
      time: '11:24:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 518.860593753226,
      time: '11:24:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 498.1939558397455,
      time: '11:24:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 424.01912833554945,
      time: '11:24:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 565.4107211628278,
      time: '11:24:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 564.5461294854933,
      time: '11:25:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 499.9055436750034,
      time: '11:25:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 392.7106539950176,
      time: '11:25:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 578.276201461717,
      time: '11:25:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 560.5261500795675,
      time: '11:25:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 487.0443123455602,
      time: '11:25:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 541.6608065631751,
      time: '11:25:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 501.45032112888487,
      time: '11:26:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 481.5831346981468,
      time: '11:26:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 401.78624561443473,
      time: '11:26:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 496.7124869463506,
      time: '11:26:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 422.1254107496083,
      time: '11:26:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 391.5780317218574,
      time: '11:26:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 577.6568316956623,
      time: '11:26:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 577.7849009172836,
      time: '11:27:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 473.2059908526078,
      time: '11:27:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 453.70957592354745,
      time: '11:27:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 472.24002366534006,
      time: '11:27:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 381.5098510210461,
      time: '11:27:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 496.1583857092391,
      time: '11:27:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 544.3562082600912,
      time: '11:27:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 528.9680655040597,
      time: '11:28:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 473.41727546321397,
      time: '11:28:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 314.376768514259,
      time: '11:28:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 594.0578534720295,
      time: '11:28:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 445.58589758243727,
      time: '11:28:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 472.6198706850666,
      time: '11:28:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 499.3781312679781,
      time: '11:28:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 544.4153125103362,
      time: '11:29:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 441.3876613576543,
      time: '11:29:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 475.4775159730307,
      time: '11:29:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 427.5993049791878,
      time: '11:29:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 578.985466882716,
      time: '11:29:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 456.6981749065879,
      time: '11:29:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 548.075176260305,
      time: '11:29:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 528.9146693885301,
      time: '11:30:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 397.1372814257084,
      time: '11:30:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 391.0996050710505,
      time: '11:30:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 390.0597021689959,
      time: '11:30:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 409.81627160151345,
      time: '11:30:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 400.2648466366602,
      time: '11:30:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 472.81368963396693,
      time: '11:30:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 651.6139092254468,
      time: '11:31:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 445.79022790968634,
      time: '11:31:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 377.655946502629,
      time: '11:31:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 522.0007225026666,
      time: '11:31:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 531.9558402722034,
      time: '11:31:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 505.68000532848583,
      time: '11:31:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 535.4279852888261,
      time: '11:31:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 558.3251387631033,
      time: '11:32:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 408.14191442439443,
      time: '11:32:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 348.3947812369916,
      time: '11:32:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 474.89728878236946,
      time: '11:32:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 533.885040703822,
      time: '11:32:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 453.36495801690444,
      time: '11:32:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 528.338500467777,
      time: '11:32:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 506.11445355220496,
      time: '11:33:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 490.7559866708876,
      time: '11:33:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 316.2571664067115,
      time: '11:33:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 448.93835914346437,
      time: '11:33:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 422.32058791460025,
      time: '11:33:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 421.5041582144856,
      time: '11:33:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 519.594157136373,
      time: '11:33:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 600.1272456051595,
      time: '11:34:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 434.6471309248931,
      time: '11:34:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 440.1585291980957,
      time: '11:34:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 535.4178223649676,
      time: '11:34:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 478.44915395926375,
      time: '11:34:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 336.38688933591754,
      time: '11:34:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 523.5731244280535,
      time: '11:34:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 497.95781750144886,
      time: '11:35:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 400.7251401603744,
      time: '11:35:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 402.66589835942017,
      time: '11:35:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 512.19003568856,
      time: '11:35:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 531.4198311564269,
      time: '11:35:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 478.62425474746817,
      time: '11:35:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 435.90754772511804,
      time: '11:35:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 569.4431797502377,
      time: '11:36:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 425.93070791735033,
      time: '11:36:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 334.5019550129473,
      time: '11:36:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 471.7960684631636,
      time: '11:36:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 431.04361295062563,
      time: '11:36:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 568.6125798334872,
      time: '11:36:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 502.5637546129519,
      time: '11:36:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 461.0164938060112,
      time: '11:37:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 462.6465727137812,
      time: '11:37:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 334.2460613968192,
      time: '11:37:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 435.9847800664553,
      time: '11:37:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 439.8209819948819,
      time: '11:37:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 563.0629607273935,
      time: '11:37:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 534.6422450570558,
      time: '11:37:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 492.59069755507846,
      time: '11:38:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 413.81377235980125,
      time: '11:38:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 382.2107650354936,
      time: '11:38:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 543.6228664140073,
      time: '11:38:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 420.9159543025678,
      time: '11:38:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 457.1451871706864,
      time: '11:38:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 537.99281959987,
      time: '11:38:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 568.8430617934562,
      time: '11:39:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 400.8889802216784,
      time: '11:39:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 482.45107626446963,
      time: '11:39:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 532.510058897933,
      time: '11:39:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 399.26216346535665,
      time: '11:39:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 449.889396981911,
      time: '11:39:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 478.6162429537021,
      time: '11:39:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 595.9233289997705,
      time: '11:40:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 454.18436057459564,
      time: '11:40:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 386.02043243181976,
      time: '11:40:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 495.04120681103086,
      time: '11:40:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 417.5361227466997,
      time: '11:40:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 503.4387128037512,
      time: '11:40:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 593.285392043235,
      time: '11:40:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 567.5684140594985,
      time: '11:41:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 454.24832855543616,
      time: '11:41:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 323.8428523440947,
      time: '11:41:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 592.3318498023833,
      time: '11:41:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 388.8029866618872,
      time: '11:41:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 430.0807280405854,
      time: '11:41:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 486.691257589275,
      time: '11:41:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 553.217585880588,
      time: '11:42:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 416.6528412314435,
      time: '11:42:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 386.7128467957028,
      time: '11:42:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 446.49576168369236,
      time: '11:42:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 451.7041734129613,
      time: '11:42:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 495.0895949909733,
      time: '11:42:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 578.4728600263369,
      time: '11:42:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 543.9448152205356,
      time: '11:43:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 418.44808471908385,
      time: '11:43:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 385.3638215126165,
      time: '11:43:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 423.72374145376307,
      time: '11:43:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 411.5013384470679,
      time: '11:43:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 518.3040139192345,
      time: '11:43:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 551.3597180935842,
      time: '11:43:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 485.07390048162864,
      time: '11:44:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 453.6024968678818,
      time: '11:44:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 264.1556678529214,
      time: '11:44:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 465.4045965059378,
      time: '11:44:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 461.6892955895374,
      time: '11:44:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 541.3466611942154,
      time: '11:44:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 497.68863450780987,
      time: '11:44:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 523.0077895802646,
      time: '11:45:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 369.5957829251338,
      time: '11:45:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 396.2852566741094,
      time: '11:45:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 497.72069918222513,
      time: '11:45:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 372.20521768981865,
      time: '11:45:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 474.99229617600236,
      time: '11:45:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 618.7655446304756,
      time: '11:45:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 535.9680614520106,
      time: '11:46:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 371.62681128117225,
      time: '11:46:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 387.45327348956613,
      time: '11:46:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 512.1669724661346,
      time: '11:46:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 466.54401161072286,
      time: '11:46:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 469.81631249115173,
      time: '11:46:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 470.318158412176,
      time: '11:46:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 611.8561113109458,
      time: '11:47:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 406.0777889373782,
      time: '11:47:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 433.81031824067094,
      time: '11:47:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 487.9381971071835,
      time: '11:47:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 491.6764480804462,
      time: '11:47:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 436.1008706621719,
      time: '11:47:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 575.9577086805001,
      time: '11:47:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 576.1809144784231,
      time: '11:48:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 431.32764241440765,
      time: '11:48:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 491.44780474726724,
      time: '11:48:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 517.6027698257149,
      time: '11:48:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 350.31321787142724,
      time: '11:48:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 438.655982298007,
      time: '11:48:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 580.0291159021489,
      time: '11:48:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 470.8479922318633,
      time: '11:49:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 457.5453782799002,
      time: '11:49:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 455.3282514773879,
      time: '11:49:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 437.4230287904778,
      time: '11:49:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 468.7028284923786,
      time: '11:49:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 468.67605540492366,
      time: '11:49:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 496.46898954616773,
      time: '11:49:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 575.2041984697397,
      time: '11:50:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 515.7678108474776,
      time: '11:50:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 385.5555654722585,
      time: '11:50:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 572.188230203663,
      time: '11:50:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 511.3834496236646,
      time: '11:50:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 498.3682753408089,
      time: '11:50:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 599.6232650032165,
      time: '11:50:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 539.7458859791842,
      time: '11:51:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 484.88298116010094,
      time: '11:51:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 343.6737045629165,
      time: '11:51:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 495.89244108037155,
      time: '11:51:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 389.5179490654397,
      time: '11:51:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 525.6792313116624,
      time: '11:51:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 517.4976742700524,
      time: '11:51:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 525.1538999847021,
      time: '11:52:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 434.0030735018286,
      time: '11:52:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 527.667990162493,
      time: '11:52:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 555.8647915794064,
      time: '11:52:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 533.6286193418852,
      time: '11:52:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 439.8410524659828,
      time: '11:52:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 544.4346814639929,
      time: '11:52:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 589.5838144420434,
      time: '11:53:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 441.04918960486555,
      time: '11:53:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 401.96092170072444,
      time: '11:53:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 517.1362673188852,
      time: '11:53:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 470.95095046830227,
      time: '11:53:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 554.6344284479761,
      time: '11:53:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 543.0160919385611,
      time: '11:53:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 610.5499761247976,
      time: '11:54:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 391.87353176810956,
      time: '11:54:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 399.6964645956473,
      time: '11:54:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 522.8376609576892,
      time: '11:54:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 414.7494072120796,
      time: '11:54:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 466.4438199478716,
      time: '11:54:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 523.2845629264726,
      time: '11:54:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 605.5640059558099,
      time: '11:55:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 441.0743432003805,
      time: '11:55:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 397.79374564449984,
      time: '11:55:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 528.4883640116102,
      time: '11:55:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 447.2115461171147,
      time: '11:55:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 478.9316352825782,
      time: '11:55:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 570.5404136579891,
      time: '11:55:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 517.039123838868,
      time: '11:56:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 427.56706805399307,
      time: '11:56:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 408.90423803839275,
      time: '11:56:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 522.3854280008658,
      time: '11:56:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 477.9163456260861,
      time: '11:56:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 442.63941604260884,
      time: '11:56:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 569.6744360276107,
      time: '11:56:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 543.5393812074393,
      time: '11:57:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 458.1359280169045,
      time: '11:57:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 391.7819794038029,
      time: '11:57:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 532.1361379933772,
      time: '11:57:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 453.80026957062057,
      time: '11:57:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 358.7879869863529,
      time: '11:57:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 442.57340133809095,
      time: '11:57:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 575.5631715701782,
      time: '11:58:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 400.63845282238384,
      time: '11:58:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 370.3168996559882,
      time: '11:58:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 566.4576265066215,
      time: '11:58:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 476.93779962231844,
      time: '11:58:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 524.2022698180525,
      time: '11:58:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 595.2170121439076,
      time: '11:58:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 607.777256356118,
      time: '11:59:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 467.9673257120586,
      time: '11:59:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 371.6570529379804,
      time: '11:59:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 509.82605848507353,
      time: '11:59:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 403.9663203460317,
      time: '11:59:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 516.8421948546217,
      time: '11:59:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 446.8754005982163,
      time: '11:59:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 535.0412881077355,
      time: '12:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 518.6369456501288,
      time: '12:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 397.36233648920006,
      time: '12:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 535.4501878794256,
      time: '12:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 458.4680412018039,
      time: '12:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 465.9336221440893,
      time: '12:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 581.6273102170828,
      time: '12:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 549.7170511668091,
      time: '12:01:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 436.5619925771571,
      time: '12:01:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 371.82876144331175,
      time: '12:01:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 495.51321528563864,
      time: '12:01:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 379.314275154751,
      time: '12:01:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 483.3495358612436,
      time: '12:01:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 586.3352568413792,
      time: '12:01:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 503.6832512996986,
      time: '12:02:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 462.0855861049471,
      time: '12:02:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 363.35771086614176,
      time: '12:02:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 572.0058607724736,
      time: '12:02:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 444.438696932565,
      time: '12:02:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 505.79696088520495,
      time: '12:02:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 475.45167848924007,
      time: '12:02:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 499.18966879596644,
      time: '12:03:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 476.5071995855556,
      time: '12:03:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 404.3215113845948,
      time: '12:03:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 466.1803848970365,
      time: '12:03:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 404.8046179267605,
      time: '12:03:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 401.87270715567286,
      time: '12:03:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 509.45928560227077,
      time: '12:03:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 599.6262911197099,
      time: '12:04:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 421.93897640570816,
      time: '12:04:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 386.2511391289572,
      time: '12:04:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 590.0470216455408,
      time: '12:04:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 413.22350287051165,
      time: '12:04:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 453.5473661326853,
      time: '12:04:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 474.7147665757032,
      time: '12:04:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 626.8120014285412,
      time: '12:05:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 453.20462409052084,
      time: '12:05:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 474.1996494291344,
      time: '12:05:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 497.99210246778284,
      time: '12:05:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 511.8046587605219,
      time: '12:05:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 519.7132339810913,
      time: '12:05:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 519.2539484855632,
      time: '12:05:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 555.3994939209833,
      time: '12:06:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 442.62962003908973,
      time: '12:06:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 266.4515095803494,
      time: '12:06:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 428.4612448940976,
      time: '12:06:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 504.56550602971345,
      time: '12:06:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 417.28552884153754,
      time: '12:06:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 514.5982857907129,
      time: '12:06:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 609.1766448946012,
      time: '12:07:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 446.8838049274416,
      time: '12:07:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 453.5753425961231,
      time: '12:07:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 506.40522074553945,
      time: '12:07:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 480.45690604535883,
      time: '12:07:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 494.6778966083315,
      time: '12:07:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 568.983026613467,
      time: '12:07:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 577.0818012523818,
      time: '12:08:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 403.3495108072267,
      time: '12:08:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 461.30425962488147,
      time: '12:08:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 465.94741712625597,
      time: '12:08:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 395.38436176637106,
      time: '12:08:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 412.17090976882974,
      time: '12:08:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 595.5154373059804,
      time: '12:08:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 526.7440122697437,
      time: '12:09:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 443.22550871294715,
      time: '12:09:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 295.3304883795925,
      time: '12:09:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 542.0321774494362,
      time: '12:09:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 434.1795775152599,
      time: '12:09:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 503.3214991216763,
      time: '12:09:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 599.7841905394978,
      time: '12:09:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 577.0697802754207,
      time: '12:10:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 466.8999145622725,
      time: '12:10:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 381.8656202959826,
      time: '12:10:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 467.36880103488045,
      time: '12:10:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 510.6548849989592,
      time: '12:10:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 478.2179258851258,
      time: '12:10:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 501.8915986710849,
      time: '12:10:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 635.9018283232984,
      time: '12:11:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 514.5571803897521,
      time: '12:11:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 380.4279567002104,
      time: '12:11:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 477.69082833926103,
      time: '12:11:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 457.08584568199524,
      time: '12:11:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 399.2434092047245,
      time: '12:11:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 519.5389063127736,
      time: '12:11:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 557.2086980445024,
      time: '12:12:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 489.96354130426033,
      time: '12:12:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 328.62441526410896,
      time: '12:12:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 405.52296345272345,
      time: '12:12:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 565.9664769990848,
      time: '12:12:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 538.2369677228586,
      time: '12:12:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 445.8280903889525,
      time: '12:12:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 637.2321827907003,
      time: '12:13:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 549.6591228755779,
      time: '12:13:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 360.1091656204562,
      time: '12:13:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 477.38468403754615,
      time: '12:13:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 469.6658919697186,
      time: '12:13:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 443.27042116009756,
      time: '12:13:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 489.7064966751906,
      time: '12:13:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 428.0127447955128,
      time: '12:14:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 403.6326218555975,
      time: '12:14:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 343.47120772670854,
      time: '12:14:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 378.8060336685522,
      time: '12:14:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 459.6024558245016,
      time: '12:14:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 439.48737814928097,
      time: '12:14:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 578.2425816548729,
      time: '12:14:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 600.0951252187612,
      time: '12:15:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 485.6160318360339,
      time: '12:15:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 486.6135221711811,
      time: '12:15:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 420.80485882571384,
      time: '12:15:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 434.54417678987494,
      time: '12:15:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 490.02845986154716,
      time: '12:15:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 610.7791411774116,
      time: '12:15:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 563.3523534119086,
      time: '12:16:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 451.1671002869176,
      time: '12:16:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 445.7839196573731,
      time: '12:16:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 538.0207328072149,
      time: '12:16:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 456.67704523911414,
      time: '12:16:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 537.4318674714358,
      time: '12:16:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 468.2825564060039,
      time: '12:16:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 544.0496324767066,
      time: '12:17:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 551.4901466608836,
      time: '12:17:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 462.57775474970794,
      time: '12:17:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 539.2900079325416,
      time: '12:17:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 442.3765081809728,
      time: '12:17:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 429.2089090510801,
      time: '12:17:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 500.3767870423553,
      time: '12:17:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 563.5880388267751,
      time: '12:18:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 401.5850857322424,
      time: '12:18:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 435.0836032021617,
      time: '12:18:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 521.2728780892483,
      time: '12:18:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 485.4054338344295,
      time: '12:18:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 483.0839924923986,
      time: '12:18:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 528.6797121520536,
      time: '12:18:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 459.62155426995537,
      time: '12:19:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 400.0139078909612,
      time: '12:19:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 342.54741143913856,
      time: '12:19:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 451.6511928435393,
      time: '12:19:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 497.8351158397292,
      time: '12:19:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 501.44082501652866,
      time: '12:19:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 544.0080579409804,
      time: '12:19:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 548.0164056081244,
      time: '12:20:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 412.0303677277989,
      time: '12:20:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 372.7739866860113,
      time: '12:20:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 497.614432192901,
      time: '12:20:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 410.70052697460255,
      time: '12:20:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 514.6552803631572,
      time: '12:20:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 489.5198240039177,
      time: '12:20:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 576.8556285755873,
      time: '12:21:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 335.80521378450965,
      time: '12:21:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 423.4687280613959,
      time: '12:21:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 499.8198730454716,
      time: '12:21:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 383.4383523221111,
      time: '12:21:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 488.8220777638613,
      time: '12:21:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 551.2030522232045,
      time: '12:21:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 632.8947022370758,
      time: '12:22:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 415.71224891596194,
      time: '12:22:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 337.89360955540275,
      time: '12:22:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 442.0817655403729,
      time: '12:22:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 358.1897313448352,
      time: '12:22:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 461.6486080458339,
      time: '12:22:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 506.3080326464542,
      time: '12:22:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 533.0864890863177,
      time: '12:23:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 404.0433669223151,
      time: '12:23:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 434.6499215086194,
      time: '12:23:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 575.1699150883576,
      time: '12:23:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 475.3995663456272,
      time: '12:23:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 438.62048896756403,
      time: '12:23:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 529.277386456086,
      time: '12:23:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 518.5753198553406,
      time: '12:24:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 449.5196893238104,
      time: '12:24:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 386.98373009209325,
      time: '12:24:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 543.8681145287836,
      time: '12:24:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 394.83166969130633,
      time: '12:24:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 484.30719415231874,
      time: '12:24:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 557.3142124001849,
      time: '12:24:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 533.9121478207732,
      time: '12:25:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 459.087798788858,
      time: '12:25:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 380.25895962252014,
      time: '12:25:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 488.9517913085168,
      time: '12:25:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 342.35547035237585,
      time: '12:25:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 426.39304940071963,
      time: '12:25:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 530.3211134905468,
      time: '12:25:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 604.7701058851037,
      time: '12:26:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 535.8085419607943,
      time: '12:26:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 434.54799841017456,
      time: '12:26:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 501.34429194972654,
      time: '12:26:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 469.42893022654823,
      time: '12:26:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 333.93247582526965,
      time: '12:26:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 508.1807054736716,
      time: '12:26:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 575.4375554829842,
      time: '12:27:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 489.5211919093025,
      time: '12:27:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 421.21316557430197,
      time: '12:27:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 510.41914039737765,
      time: '12:27:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 574.6499758716395,
      time: '12:27:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 501.8279902078834,
      time: '12:27:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 524.5195098037085,
      time: '12:27:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 532.511989811648,
      time: '12:28:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 413.15481721687985,
      time: '12:28:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 380.95169170904603,
      time: '12:28:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 397.9132565787855,
      time: '12:28:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 449.6964544230053,
      time: '12:28:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 525.1967420543098,
      time: '12:28:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 525.5818520397332,
      time: '12:28:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 584.6633716556678,
      time: '12:29:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 397.07926643258213,
      time: '12:29:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 456.96649016821243,
      time: '12:29:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 487.64113087397016,
      time: '12:29:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 491.9245387225821,
      time: '12:29:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 361.8533782229081,
      time: '12:29:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 511.4994485058936,
      time: '12:29:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 563.8538774674021,
      time: '12:30:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 466.5959585753253,
      time: '12:30:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 344.9468336200051,
      time: '12:30:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 465.90078760011005,
      time: '12:30:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 454.09146792737823,
      time: '12:30:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 429.5134647645031,
      time: '12:30:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 517.0601968666449,
      time: '12:30:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 607.4322495266445,
      time: '12:31:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 375.9883396489679,
      time: '12:31:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 429.7967803472132,
      time: '12:31:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 449.91899950525425,
      time: '12:31:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 445.05551734044286,
      time: '12:31:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 510.9577130502599,
      time: '12:31:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 609.9323585252358,
      time: '12:31:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 523.8973453061324,
      time: '12:32:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 533.5729382927177,
      time: '12:32:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 428.6550628984192,
      time: '12:32:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 485.9449853557023,
      time: '12:32:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 495.9538241493884,
      time: '12:32:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 582.8747734855849,
      time: '12:32:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 558.045972397062,
      time: '12:32:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 542.6168926701116,
      time: '12:33:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 500.97200603606433,
      time: '12:33:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 383.5226780343005,
      time: '12:33:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 589.8843263424761,
      time: '12:33:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 435.48627279056745,
      time: '12:33:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 481.0396853837704,
      time: '12:33:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 515.225984098542,
      time: '12:33:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 539.3945923433921,
      time: '12:34:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 418.5412173947648,
      time: '12:34:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 415.3066511121059,
      time: '12:34:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 532.0421430633505,
      time: '12:34:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 463.3696157035952,
      time: '12:34:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 443.5998529385433,
      time: '12:34:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 564.8477202255368,
      time: '12:34:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 485.8242525933941,
      time: '12:35:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 356.3432735454561,
      time: '12:35:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 336.44432118073485,
      time: '12:35:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 471.4410505108602,
      time: '12:35:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 466.0848903098007,
      time: '12:35:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 470.855177944758,
      time: '12:35:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 513.3090255121995,
      time: '12:35:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 573.8060138532288,
      time: '12:36:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 509.69361870827066,
      time: '12:36:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 445.20135096034505,
      time: '12:36:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 528.629139067808,
      time: '12:36:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 416.59547731784755,
      time: '12:36:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 548.7438209574093,
      time: '12:36:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 588.656231879332,
      time: '12:36:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 572.0527636089945,
      time: '12:37:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 436.2730077373691,
      time: '12:37:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 389.75489317785053,
      time: '12:37:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 569.9677718293001,
      time: '12:37:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 499.60211747682615,
      time: '12:37:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 447.70179104377326,
      time: '12:37:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 548.4821096099047,
      time: '12:37:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 559.2556728321231,
      time: '12:38:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 503.8908155986731,
      time: '12:38:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 372.86384897404804,
      time: '12:38:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 546.2316841456384,
      time: '12:38:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 441.2520121652296,
      time: '12:38:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 440.04039966748735,
      time: '12:38:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 524.6348927997885,
      time: '12:38:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 547.2706433312427,
      time: '12:39:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 362.27861706028165,
      time: '12:39:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 451.4504612918445,
      time: '12:39:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 502.98151849600873,
      time: '12:39:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 412.2127420253578,
      time: '12:39:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 455.86282389089837,
      time: '12:39:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 552.3858462905139,
      time: '12:39:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 488.2314628974793,
      time: '12:40:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 412.03124885231136,
      time: '12:40:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 363.782815472862,
      time: '12:40:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 467.6531611147213,
      time: '12:40:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 476.82549217852016,
      time: '12:40:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 432.3335695870644,
      time: '12:40:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 451.45619239657503,
      time: '12:40:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 537.9677338617321,
      time: '12:41:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 442.26218498590913,
      time: '12:41:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 328.576935181822,
      time: '12:41:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 534.9111656806795,
      time: '12:41:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 405.0766009104481,
      time: '12:41:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 486.13351579973977,
      time: '12:41:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 473.6616265545097,
      time: '12:41:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 541.8642741736616,
      time: '12:42:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 444.3490296882371,
      time: '12:42:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 321.1685413238048,
      time: '12:42:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 519.6742692710875,
      time: '12:42:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 451.4090578684564,
      time: '12:42:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 561.2339229234781,
      time: '12:42:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 470.30374968004725,
      time: '12:42:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 518.886136538919,
      time: '12:43:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 419.4967264260378,
      time: '12:43:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 429.300497567282,
      time: '12:43:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 544.7596610013866,
      time: '12:43:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 449.5440501677898,
      time: '12:43:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 496.1539636558015,
      time: '12:43:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 537.1471547381853,
      time: '12:43:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 550.9357144166995,
      time: '12:44:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 473.14249661737495,
      time: '12:44:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 334.97853237518586,
      time: '12:44:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 531.7585900840985,
      time: '12:44:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 504.2947782915789,
      time: '12:44:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 467.3823248936856,
      time: '12:44:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 616.6257499742546,
      time: '12:44:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 579.2025428407269,
      time: '12:45:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 388.61897853087027,
      time: '12:45:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 486.7397090992182,
      time: '12:45:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 552.4776357659667,
      time: '12:45:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 473.73491164399763,
      time: '12:45:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 465.4094365542228,
      time: '12:45:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 641.5650073096316,
      time: '12:45:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 653.3092950605266,
      time: '12:46:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 434.8810257489353,
      time: '12:46:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 294.9035296058139,
      time: '12:46:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 473.2382394219716,
      time: '12:46:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 448.7486520627428,
      time: '12:46:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 401.8404595651672,
      time: '12:46:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 561.9025550720379,
      time: '12:46:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 567.728890641592,
      time: '12:47:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 448.01478158559496,
      time: '12:47:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 483.8228184145019,
      time: '12:47:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 565.8697032817163,
      time: '12:47:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 490.8883149600143,
      time: '12:47:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 524.1554888573579,
      time: '12:47:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 555.0422237472228,
      time: '12:47:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 571.8775195361383,
      time: '12:48:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 467.72194170293744,
      time: '12:48:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 409.55087336013094,
      time: '12:48:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 509.87998023462,
      time: '12:48:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 519.5103774508657,
      time: '12:48:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 476.1081401493599,
      time: '12:48:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 439.94711329236304,
      time: '12:48:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 555.2777042116917,
      time: '12:49:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 477.5807439044445,
      time: '12:49:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 394.1643444064804,
      time: '12:49:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 603.7630436312633,
      time: '12:49:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 477.8905153175931,
      time: '12:49:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 470.97600432046875,
      time: '12:49:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 502.8663100132989,
      time: '12:49:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 463.06143923504794,
      time: '12:50:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 385.76789540810654,
      time: '12:50:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 371.7540456595525,
      time: '12:50:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 465.54060909552163,
      time: '12:50:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 450.517630992169,
      time: '12:50:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 639.655378392243,
      time: '12:50:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 490.61081240458805,
      time: '12:50:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 557.6743062275392,
      time: '12:51:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 365.2942914632189,
      time: '12:51:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 418.9568057176035,
      time: '12:51:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 586.7981901582625,
      time: '12:51:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 384.408188382492,
      time: '12:51:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 494.9376454182843,
      time: '12:51:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 498.9576200874442,
      time: '12:51:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 562.0115104970513,
      time: '12:52:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 505.88384109492546,
      time: '12:52:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 397.1182648787576,
      time: '12:52:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 509.89553917313236,
      time: '12:52:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 396.74431684623136,
      time: '12:52:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 442.41044749524076,
      time: '12:52:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 521.5928090707605,
      time: '12:52:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 682.1621056242643,
      time: '12:53:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 458.6157005989796,
      time: '12:53:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 454.1650941008261,
      time: '12:53:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 467.42909981927755,
      time: '12:53:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 434.7387647822666,
      time: '12:53:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 458.6821201897228,
      time: '12:53:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 506.3954711151436,
      time: '12:53:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 549.3819517609438,
      time: '12:54:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 404.5756731721723,
      time: '12:54:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 404.71138243310196,
      time: '12:54:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 475.8057082972839,
      time: '12:54:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 419.52438989203586,
      time: '12:54:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 537.4222854598378,
      time: '12:54:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 431.03500948121064,
      time: '12:54:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 574.0773671166806,
      time: '12:55:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 519.5575987761262,
      time: '12:55:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 406.51508807309386,
      time: '12:55:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 483.98263459028396,
      time: '12:55:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 440.6514348507277,
      time: '12:55:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 485.66352052688825,
      time: '12:55:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 567.3955128058767,
      time: '12:55:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 557.2644115147378,
      time: '12:56:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 447.78373171464295,
      time: '12:56:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 380.8193893893072,
      time: '12:56:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 521.2082973200958,
      time: '12:56:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 452.83249624485535,
      time: '12:56:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 408.08610108413166,
      time: '12:56:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 476.36284871300967,
      time: '12:56:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 500.5660981190234,
      time: '12:57:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 500.96485920319134,
      time: '12:57:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 396.15271881394665,
      time: '12:57:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 526.141774401775,
      time: '12:57:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 476.48463771783656,
      time: '12:57:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 525.9614467287602,
      time: '12:57:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 541.9623432055574,
      time: '12:57:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 616.141140725751,
      time: '12:58:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 445.37592407050545,
      time: '12:58:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 414.39008844460295,
      time: '12:58:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 471.31499980307103,
      time: '12:58:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 446.47506109704545,
      time: '12:58:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 446.5927957230503,
      time: '12:58:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 633.7041334874987,
      time: '12:58:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 596.5966516343387,
      time: '12:59:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 545.0373962440993,
      time: '12:59:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 313.4915803671687,
      time: '12:59:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 498.78227038695087,
      time: '12:59:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 474.3250821913101,
      time: '12:59:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 573.6648888108773,
      time: '12:59:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 484.03077042067883,
      time: '12:59:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 598.5515973521524,
      time: '13:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 529.7670421221602,
      time: '13:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 331.59072889471435,
      time: '13:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 607.1135179305932,
      time: '13:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 453.223720740506,
      time: '13:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 534.0024032857324,
      time: '13:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 403.4856238626835,
      time: '13:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 513.530627260263,
      time: '13:01:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 429.5517925760463,
      time: '13:01:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 436.1632047011357,
      time: '13:01:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 586.3771585050356,
      time: '13:01:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 351.22667168230646,
      time: '13:01:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 457.6339052170624,
      time: '13:01:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 515.6997889059944,
      time: '13:01:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 629.139715546805,
      time: '13:02:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 490.5785475477178,
      time: '13:02:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 407.5432719063971,
      time: '13:02:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 521.8161834837016,
      time: '13:02:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 403.0332303090623,
      time: '13:02:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 544.0508180867556,
      time: '13:02:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 585.0479817499286,
      time: '13:02:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 488.90744686038596,
      time: '13:03:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 474.2687974792574,
      time: '13:03:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 389.80083318236603,
      time: '13:03:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 501.90017390841,
      time: '13:03:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 442.7956222139192,
      time: '13:03:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 483.39277552637014,
      time: '13:03:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 627.9173727110297,
      time: '13:03:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 588.3428546900135,
      time: '13:04:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 510.43157787661744,
      time: '13:04:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 399.92169665326963,
      time: '13:04:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 506.0015663359131,
      time: '13:04:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 389.5152628579446,
      time: '13:04:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 522.6386837561109,
      time: '13:04:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 468.52252027737916,
      time: '13:04:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 668.5227812904989,
      time: '13:05:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 393.7538269709948,
      time: '13:05:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 416.37908526808354,
      time: '13:05:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 530.6758986365209,
      time: '13:05:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 479.9964364998102,
      time: '13:05:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 504.23664086472377,
      time: '13:05:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 554.8349611618261,
      time: '13:05:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 509.4731837434656,
      time: '13:06:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 476.30257299992195,
      time: '13:06:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 372.0120159845319,
      time: '13:06:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 448.8603717400797,
      time: '13:06:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 526.5375416171848,
      time: '13:06:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 437.6821672504563,
      time: '13:06:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 506.73447716099736,
      time: '13:06:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 530.6851135198614,
      time: '13:07:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 494.9212243424794,
      time: '13:07:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 360.08476372988434,
      time: '13:07:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 487.13117312883276,
      time: '13:07:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 510.93809258486584,
      time: '13:07:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 447.8225083841269,
      time: '13:07:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 524.7025822847933,
      time: '13:07:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 563.982568254382,
      time: '13:08:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 354.06302567884427,
      time: '13:08:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 408.79226275488406,
      time: '13:08:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 416.57079630612054,
      time: '13:08:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 439.3278564534896,
      time: '13:08:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 531.4980408790581,
      time: '13:08:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 662.2171673508517,
      time: '13:08:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 533.8262172941901,
      time: '13:09:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 382.83707436671125,
      time: '13:09:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 350.0813611192484,
      time: '13:09:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 519.9611561302639,
      time: '13:09:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 524.5363068424977,
      time: '13:09:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 463.26123339467296,
      time: '13:09:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 454.85148358024236,
      time: '13:09:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 481.4668284466934,
      time: '13:10:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 340.038391111995,
      time: '13:10:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 419.4126377857236,
      time: '13:10:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 532.3597969851371,
      time: '13:10:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 457.4333728601056,
      time: '13:10:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 459.81757683790016,
      time: '13:10:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 542.6869830747287,
      time: '13:10:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 562.4281487403014,
      time: '13:11:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 428.5296582777721,
      time: '13:11:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 313.87081978810795,
      time: '13:11:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 475.8406768850313,
      time: '13:11:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 433.14570144409805,
      time: '13:11:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 432.24387103253235,
      time: '13:11:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 553.3846585882717,
      time: '13:11:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 505.88481431369473,
      time: '13:12:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 477.8771127897981,
      time: '13:12:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 450.4577818662822,
      time: '13:12:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 578.6993381645017,
      time: '13:12:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 419.329866822953,
      time: '13:12:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 501.17995327967304,
      time: '13:12:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 584.2893162469674,
      time: '13:12:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 582.679621531759,
      time: '13:13:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 517.1178526048014,
      time: '13:13:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 422.6298741206522,
      time: '13:13:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 438.7117168498829,
      time: '13:13:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 434.87651567559357,
      time: '13:13:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 583.1262459621572,
      time: '13:13:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 534.8991576735448,
      time: '13:13:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 513.0287882883099,
      time: '13:14:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 445.70473902098877,
      time: '13:14:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 411.8014867156938,
      time: '13:14:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 426.78125598950896,
      time: '13:14:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 430.5911590729386,
      time: '13:14:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 426.62335428728636,
      time: '13:14:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 545.4025269752051,
      time: '13:14:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 636.4967202508769,
      time: '13:15:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 523.4307772785646,
      time: '13:15:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 448.1345491972757,
      time: '13:15:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 511.2225909279986,
      time: '13:15:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 458.52081111877436,
      time: '13:15:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 481.2109728336379,
      time: '13:15:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 510.4175716289104,
      time: '13:15:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 519.8373353831881,
      time: '13:16:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 372.99492708925544,
      time: '13:16:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 482.27372222312886,
      time: '13:16:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 552.3549151306078,
      time: '13:16:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 458.0286990524932,
      time: '13:16:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 550.6110277707714,
      time: '13:16:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 543.4563470622554,
      time: '13:16:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 542.8969241897162,
      time: '13:17:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 356.83087803224225,
      time: '13:17:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 449.7185032509065,
      time: '13:17:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 584.1963845728934,
      time: '13:17:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 450.1523010076707,
      time: '13:17:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 476.01793043771426,
      time: '13:17:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 512.8403862251295,
      time: '13:17:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 599.6758608684835,
      time: '13:18:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 439.22261505516906,
      time: '13:18:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 306.95628843341774,
      time: '13:18:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 477.055786856553,
      time: '13:18:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 471.8469084873175,
      time: '13:18:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 502.6185898124867,
      time: '13:18:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 561.0785944928025,
      time: '13:18:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 497.45678417830226,
      time: '13:19:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 461.20327244696534,
      time: '13:19:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 335.02115166321494,
      time: '13:19:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 553.9340416715647,
      time: '13:19:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 509.5323137393171,
      time: '13:19:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 426.880323592656,
      time: '13:19:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 511.5194831978183,
      time: '13:19:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 570.3729967302065,
      time: '13:20:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 440.36526259529535,
      time: '13:20:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 367.75907111521605,
      time: '13:20:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 498.07457652496464,
      time: '13:20:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 497.4777067720662,
      time: '13:20:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 501.4153548603824,
      time: '13:20:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 548.8550196951094,
      time: '13:20:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 624.3571377141214,
      time: '13:21:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 338.6278949980062,
      time: '13:21:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 400.30455251054167,
      time: '13:21:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 491.368635002959,
      time: '13:21:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 375.75510157750483,
      time: '13:21:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 470.64278674977254,
      time: '13:21:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 528.536859315751,
      time: '13:21:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 478.6258382719386,
      time: '13:22:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 437.5439980243606,
      time: '13:22:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 424.88295102345614,
      time: '13:22:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 544.1829968743336,
      time: '13:22:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 322.30394325490226,
      time: '13:22:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 529.2864997839931,
      time: '13:22:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 586.3025125386084,
      time: '13:22:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 568.2316929266152,
      time: '13:23:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 376.7765249747573,
      time: '13:23:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 362.71280934232675,
      time: '13:23:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 532.616143920671,
      time: '13:23:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 496.71599556196367,
      time: '13:23:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 539.3693025782376,
      time: '13:23:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 527.4303138205756,
      time: '13:23:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 571.9941397124212,
      time: '13:24:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 475.48362744150194,
      time: '13:24:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 408.3383382238539,
      time: '13:24:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 421.1803921507875,
      time: '13:24:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 381.65606507922894,
      time: '13:24:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 609.4781821009307,
      time: '13:24:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 441.3483765896559,
      time: '13:24:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 598.0911435888655,
      time: '13:25:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 460.3299123048424,
      time: '13:25:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 361.23085338233386,
      time: '13:25:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 573.8270174862948,
      time: '13:25:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 438.7617299053658,
      time: '13:25:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 508.98165866067876,
      time: '13:25:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 593.0960750356996,
      time: '13:25:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 497.1524644560959,
      time: '13:26:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 395.0060106836322,
      time: '13:26:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 368.4241098504026,
      time: '13:26:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 569.0045677073725,
      time: '13:26:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 391.494348697032,
      time: '13:26:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 496.2898158291083,
      time: '13:26:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 484.71338495686905,
      time: '13:26:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 492.9771693457862,
      time: '13:27:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 416.30665413316535,
      time: '13:27:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 328.6669451575889,
      time: '13:27:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 468.7218649245235,
      time: '13:27:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 359.900978120999,
      time: '13:27:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 489.7192150788668,
      time: '13:27:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 497.311683067559,
      time: '13:27:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 585.0970782808449,
      time: '13:28:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 389.0393239055524,
      time: '13:28:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 352.83833769445476,
      time: '13:28:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 519.7901766718704,
      time: '13:28:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 477.0731364102394,
      time: '13:28:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 462.3416853594656,
      time: '13:28:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 500.2169352978254,
      time: '13:28:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 573.8492336616594,
      time: '13:29:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 438.8660451363414,
      time: '13:29:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 331.41576971918334,
      time: '13:29:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 524.701509314137,
      time: '13:29:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 487.95775801513236,
      time: '13:29:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 496.9241921730846,
      time: '13:29:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 598.7219046585409,
      time: '13:29:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 571.5246425172938,
      time: '13:30:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 489.7571160250619,
      time: '13:30:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 350.20633735113336,
      time: '13:30:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 513.0336882911954,
      time: '13:30:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 421.174479963664,
      time: '13:30:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 465.22992949304853,
      time: '13:30:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 423.2162893010652,
      time: '13:30:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 576.3224104748488,
      time: '13:31:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 392.7136976832228,
      time: '13:31:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 451.682089830392,
      time: '13:31:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 472.484742307729,
      time: '13:31:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 320.44788539275453,
      time: '13:31:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 488.4230488134807,
      time: '13:31:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 686.8874266829997,
      time: '13:31:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 524.9987639210755,
      time: '13:32:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 467.20232577589223,
      time: '13:32:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 351.53005555840286,
      time: '13:32:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 466.41883160309743,
      time: '13:32:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 422.6877775873759,
      time: '13:32:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 545.879876780398,
      time: '13:32:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 582.8028404533026,
      time: '13:32:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 570.6126848580502,
      time: '13:33:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 415.48711908137795,
      time: '13:33:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 530.6191032418695,
      time: '13:33:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 498.72229645042773,
      time: '13:33:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 469.5902002701273,
      time: '13:33:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 429.67287173601795,
      time: '13:33:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 541.161945706458,
      time: '13:33:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 573.6536236649341,
      time: '13:34:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 402.3563583868828,
      time: '13:34:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 423.6658950440445,
      time: '13:34:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 558.6364509629682,
      time: '13:34:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 376.05442156129357,
      time: '13:34:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 536.9939280564523,
      time: '13:34:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 527.2552999691857,
      time: '13:34:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 523.2824290986816,
      time: '13:35:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 436.6484820022721,
      time: '13:35:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 408.2418061847437,
      time: '13:35:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 527.1800077297216,
      time: '13:35:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 459.1679959889578,
      time: '13:35:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 545.8557533669932,
      time: '13:35:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 544.2777037428829,
      time: '13:35:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 652.2887255572379,
      time: '13:36:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 390.2378838790313,
      time: '13:36:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 356.0821109909393,
      time: '13:36:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 481.4692833956947,
      time: '13:36:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 449.23450754135024,
      time: '13:36:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 474.0965736504461,
      time: '13:36:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 556.0561214189669,
      time: '13:36:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 582.6916460455893,
      time: '13:37:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 414.3175347326409,
      time: '13:37:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 434.0154939704496,
      time: '13:37:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 538.5849355324173,
      time: '13:37:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 478.9645749800544,
      time: '13:37:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 373.90725504957027,
      time: '13:37:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 562.2607792975028,
      time: '13:37:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 499.4348251398676,
      time: '13:38:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 382.1061053705576,
      time: '13:38:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 370.21810868811133,
      time: '13:38:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 357.5728689684962,
      time: '13:38:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 455.9790184207077,
      time: '13:38:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 449.60890064527837,
      time: '13:38:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 557.7802233001725,
      time: '13:38:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 591.8276804316915,
      time: '13:39:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 540.2362566458195,
      time: '13:39:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 405.1004907322681,
      time: '13:39:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 557.4382850186051,
      time: '13:39:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 401.3465529559222,
      time: '13:39:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 544.8497273280555,
      time: '13:39:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 534.4790340627625,
      time: '13:39:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 510.26591648863393,
      time: '13:40:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 443.7631775985864,
      time: '13:40:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 527.0042269134398,
      time: '13:40:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 413.014311061095,
      time: '13:40:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 509.82857508322456,
      time: '13:40:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 478.8565968850559,
      time: '13:40:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 520.1330789846337,
      time: '13:40:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 598.3542301871227,
      time: '13:41:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 407.0137246003707,
      time: '13:41:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 394.1970050137675,
      time: '13:41:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 481.8779529298434,
      time: '13:41:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 442.0735213486515,
      time: '13:41:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 430.0348883852545,
      time: '13:41:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 522.4363358173244,
      time: '13:41:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 616.9297789503702,
      time: '13:42:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 452.6989955367111,
      time: '13:42:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 456.4636663142838,
      time: '13:42:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 444.0165052686928,
      time: '13:42:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 448.63477302450343,
      time: '13:42:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 454.7612539385891,
      time: '13:42:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 520.2545859823659,
      time: '13:42:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 517.9658840824145,
      time: '13:43:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 436.3835975154585,
      time: '13:43:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 363.84117874370565,
      time: '13:43:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 435.2659262139547,
      time: '13:43:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 403.3366020463402,
      time: '13:43:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 522.0310013252276,
      time: '13:43:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 586.6885048433533,
      time: '13:43:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 607.1688064622161,
      time: '13:44:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 430.95152002333884,
      time: '13:44:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 397.2505754751519,
      time: '13:44:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 558.041339368926,
      time: '13:44:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 427.8358874404245,
      time: '13:44:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 507.33667841006894,
      time: '13:44:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 559.6778361140431,
      time: '13:44:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 579.6390463468249,
      time: '13:45:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 472.7083350021713,
      time: '13:45:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 487.5400317817755,
      time: '13:45:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 476.6149399344054,
      time: '13:45:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 405.759864298655,
      time: '13:45:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 468.0533950415153,
      time: '13:45:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 382.980568266786,
      time: '13:45:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 600.1030079997245,
      time: '13:46:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 479.87538550236525,
      time: '13:46:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 367.65164711061163,
      time: '13:46:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 517.3251940865358,
      time: '13:46:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 441.35269700382884,
      time: '13:46:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 461.6587794092656,
      time: '13:46:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 562.795038826488,
      time: '13:46:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 653.8396491326973,
      time: '13:47:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 415.4749426194736,
      time: '13:47:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 489.62242789984646,
      time: '13:47:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 497.6539710560408,
      time: '13:47:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 535.5854240071171,
      time: '13:47:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 460.4120925478089,
      time: '13:47:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 539.7368097359388,
      time: '13:47:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 546.7305941998565,
      time: '13:48:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 413.209087967766,
      time: '13:48:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 434.38759677277375,
      time: '13:48:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 523.8520413611561,
      time: '13:48:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 381.4049428534322,
      time: '13:48:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 433.8794907750749,
      time: '13:48:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 529.0645621777052,
      time: '13:48:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 521.3131917821255,
      time: '13:49:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 428.2474151424178,
      time: '13:49:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 370.8766612052866,
      time: '13:49:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 503.8410945530128,
      time: '13:49:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 369.32193010616294,
      time: '13:49:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 560.7687844734721,
      time: '13:49:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 510.5740773455557,
      time: '13:49:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 514.5242785187238,
      time: '13:50:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 326.90394176322076,
      time: '13:50:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 430.6203869527761,
      time: '13:50:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 435.8503887905715,
      time: '13:50:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 523.5585163746804,
      time: '13:50:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 463.883976539433,
      time: '13:50:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 586.2056359993006,
      time: '13:50:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 518.209485751728,
      time: '13:51:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 366.2404468900724,
      time: '13:51:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 447.6277224813365,
      time: '13:51:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 549.813340972357,
      time: '13:51:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 439.5338161424067,
      time: '13:51:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 540.8579260412748,
      time: '13:51:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 577.3763231061429,
      time: '13:51:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 555.1449145292947,
      time: '13:52:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 510.34371337222626,
      time: '13:52:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 430.0904981108598,
      time: '13:52:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 475.3121708419344,
      time: '13:52:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 416.54636306700417,
      time: '13:52:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 556.0658025961226,
      time: '13:52:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 491.35611660881955,
      time: '13:52:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 576.0575987408322,
      time: '13:53:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 524.2483856750641,
      time: '13:53:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 320.48876400547715,
      time: '13:53:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 422.1709050670124,
      time: '13:53:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 501.9952343698038,
      time: '13:53:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 529.915544907398,
      time: '13:53:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 550.3526143562268,
      time: '13:53:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 572.834539966501,
      time: '13:54:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 429.5481980221811,
      time: '13:54:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 362.64314120875656,
      time: '13:54:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 478.59424195170436,
      time: '13:54:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 419.7192230131568,
      time: '13:54:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 458.4189843640976,
      time: '13:54:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 481.4171632729357,
      time: '13:54:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 600.3591624518012,
      time: '13:55:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 470.8278481527883,
      time: '13:55:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 386.62406822242474,
      time: '13:55:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 575.0379895317155,
      time: '13:55:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 541.3004856773468,
      time: '13:55:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 500.1865045168305,
      time: '13:55:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 461.01909176055347,
      time: '13:55:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 559.6500945938953,
      time: '13:56:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 457.5625077271768,
      time: '13:56:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 395.2783285449977,
      time: '13:56:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 542.5110871056746,
      time: '13:56:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 483.89629356696344,
      time: '13:56:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 478.7902196804542,
      time: '13:56:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 498.6641387705017,
      time: '13:56:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 631.6767038578658,
      time: '13:57:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 595.9440404227619,
      time: '13:57:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 430.0336048775339,
      time: '13:57:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 482.567393279607,
      time: '13:57:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 425.60442959271484,
      time: '13:57:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 434.81490696349357,
      time: '13:57:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 573.119673619138,
      time: '13:57:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 545.7671583381021,
      time: '13:58:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 497.97874557172884,
      time: '13:58:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 407.8850500466627,
      time: '13:58:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 482.53711478407854,
      time: '13:58:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 557.8654106632752,
      time: '13:58:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 496.21796408608014,
      time: '13:58:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 577.6562522688043,
      time: '13:58:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 695.008458329481,
      time: '13:59:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 435.6041204259617,
      time: '13:59:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 332.2327820644949,
      time: '13:59:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 483.9182474391309,
      time: '13:59:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 419.7142538498331,
      time: '13:59:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 421.04801044200985,
      time: '13:59:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 555.6542710048647,
      time: '13:59:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 590.2833673882503,
      time: '14:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 394.22297796997873,
      time: '14:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 418.00989255029816,
      time: '14:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 603.837399178042,
      time: '14:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 487.1047686004654,
      time: '14:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 539.3839694230782,
      time: '14:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 566.2547893423998,
      time: '14:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 516.1421221791859,
      time: '14:01:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 361.6776839871214,
      time: '14:01:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 429.52928726419117,
      time: '14:01:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 519.0967726115776,
      time: '14:01:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 464.9646290203246,
      time: '14:01:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 456.7691351350803,
      time: '14:01:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 555.8089143557479,
      time: '14:01:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 505.4553750969444,
      time: '14:02:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 452.17318179336115,
      time: '14:02:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 426.989522396552,
      time: '14:02:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 521.5020823595535,
      time: '14:02:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 515.08706446994,
      time: '14:02:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 490.05798279364194,
      time: '14:02:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 497.92592023885237,
      time: '14:02:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 583.1236207621592,
      time: '14:03:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 404.18246273578484,
      time: '14:03:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 453.0390362777311,
      time: '14:03:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 551.5141727015921,
      time: '14:03:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 528.0755598363427,
      time: '14:03:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 494.1643935773071,
      time: '14:03:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 551.5961272336971,
      time: '14:03:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 547.8268607337075,
      time: '14:04:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 370.8873145201163,
      time: '14:04:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 440.6961077274452,
      time: '14:04:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 511.93945795132566,
      time: '14:04:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 451.6002074532883,
      time: '14:04:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 467.05475131479614,
      time: '14:04:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 570.0204762613841,
      time: '14:04:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 594.7000247046046,
      time: '14:05:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 409.67135578787367,
      time: '14:05:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 421.95900396142184,
      time: '14:05:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 487.04789270896487,
      time: '14:05:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 412.3291064826908,
      time: '14:05:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 509.33469007376374,
      time: '14:05:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 567.7145664906787,
      time: '14:05:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 582.6618812286772,
      time: '14:06:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 387.92259981928026,
      time: '14:06:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 395.4917144270677,
      time: '14:06:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 490.1825075457511,
      time: '14:06:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 472.9986071469558,
      time: '14:06:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 456.2548171688738,
      time: '14:06:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 589.4456685737322,
      time: '14:06:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 555.3585543671563,
      time: '14:07:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 526.3570817536282,
      time: '14:07:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 315.9519533242004,
      time: '14:07:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 496.4199370292968,
      time: '14:07:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 416.11423151239467,
      time: '14:07:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 523.5648648728622,
      time: '14:07:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 565.4151923600532,
      time: '14:07:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 516.6603140965798,
      time: '14:08:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 486.08198784747253,
      time: '14:08:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 420.4809109566293,
      time: '14:08:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 498.13888817450794,
      time: '14:08:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 550.6693623763312,
      time: '14:08:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 412.7010159876626,
      time: '14:08:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 547.5724103770791,
      time: '14:08:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 483.25763876570676,
      time: '14:09:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 441.6013679341691,
      time: '14:09:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 409.38438435815556,
      time: '14:09:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 536.381477181849,
      time: '14:09:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 456.8267665541369,
      time: '14:09:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 486.31897897732057,
      time: '14:09:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 583.5075119158214,
      time: '14:09:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 536.674252396649,
      time: '14:10:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 515.9972069445013,
      time: '14:10:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 412.5789418597687,
      time: '14:10:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 502.59729429036497,
      time: '14:10:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 431.7339224343946,
      time: '14:10:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 576.9464499529142,
      time: '14:10:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 528.673937037547,
      time: '14:10:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 601.8199397161736,
      time: '14:11:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 445.86841538238093,
      time: '14:11:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 335.16257120898456,
      time: '14:11:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 536.6320038607789,
      time: '14:11:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 459.2340152932454,
      time: '14:11:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 429.9834337697213,
      time: '14:11:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 485.9062674386141,
      time: '14:11:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 569.7046872065102,
      time: '14:12:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 398.9357899335868,
      time: '14:12:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 344.94717297958687,
      time: '14:12:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 495.9641709945709,
      time: '14:12:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 382.64368552351516,
      time: '14:12:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 446.11275147375744,
      time: '14:12:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 521.8466518028118,
      time: '14:12:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 496.7130610644006,
      time: '14:13:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 518.1562038634829,
      time: '14:13:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 451.6576426666452,
      time: '14:13:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 503.9317595158045,
      time: '14:13:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 401.4192980744674,
      time: '14:13:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 505.69539248294575,
      time: '14:13:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 492.75486775967755,
      time: '14:13:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 567.6590462925591,
      time: '14:14:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 468.9455021842329,
      time: '14:14:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 397.02224230716723,
      time: '14:14:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 400.0899657733946,
      time: '14:14:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 510.0206953972213,
      time: '14:14:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 488.9790890969799,
      time: '14:14:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 496.24108625128093,
      time: '14:14:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 578.2658689864419,
      time: '14:15:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 390.1376922836772,
      time: '14:15:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 433.07503486863123,
      time: '14:15:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 545.8163837351241,
      time: '14:15:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 417.1552860514302,
      time: '14:15:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 497.53150496367795,
      time: '14:15:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 522.7740664642241,
      time: '14:15:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 514.8071281899433,
      time: '14:16:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 432.4830660958196,
      time: '14:16:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 400.41591880652305,
      time: '14:16:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 517.3244237948996,
      time: '14:16:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 397.654450865903,
      time: '14:16:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 504.4593565073832,
      time: '14:16:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 490.37900395000196,
      time: '14:16:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 566.6862552972764,
      time: '14:17:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 398.21908733076214,
      time: '14:17:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 400.48780697478725,
      time: '14:17:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 549.9005054929826,
      time: '14:17:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 476.8326376263643,
      time: '14:17:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 511.7360734280885,
      time: '14:17:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 514.601923518048,
      time: '14:17:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 561.9104359222999,
      time: '14:18:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 372.8600134517832,
      time: '14:18:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 445.9141902987999,
      time: '14:18:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 355.18723109031555,
      time: '14:18:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 509.28520773314983,
      time: '14:18:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 535.4849920978112,
      time: '14:18:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 435.3192666523107,
      time: '14:18:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 501.85148510846886,
      time: '14:19:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 488.3088773765821,
      time: '14:19:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 373.1977635891313,
      time: '14:19:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 604.4187352390363,
      time: '14:19:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 485.9476655332533,
      time: '14:19:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 500.4909328464256,
      time: '14:19:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 540.6646853686469,
      time: '14:19:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 576.8893680174142,
      time: '14:20:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 537.4708320235065,
      time: '14:20:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 403.8060388470492,
      time: '14:20:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 493.02051859224133,
      time: '14:20:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 499.80238429029083,
      time: '14:20:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 467.93711726907287,
      time: '14:20:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 530.0602737681112,
      time: '14:20:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 587.0392263184117,
      time: '14:21:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 372.07162130904294,
      time: '14:21:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 375.8862355647479,
      time: '14:21:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 555.4091408368758,
      time: '14:21:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 412.16024557152696,
      time: '14:21:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 513.6286850601366,
      time: '14:21:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 489.14556844659046,
      time: '14:21:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 613.1525621587639,
      time: '14:22:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 470.1484618345285,
      time: '14:22:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 377.2751886283842,
      time: '14:22:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 448.0047036437235,
      time: '14:22:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 378.9094666629078,
      time: '14:22:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 574.9940967447608,
      time: '14:22:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 562.9622834216202,
      time: '14:22:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 611.6901026017451,
      time: '14:23:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 409.46787154390864,
      time: '14:23:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 383.541393826568,
      time: '14:23:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 530.6386952531285,
      time: '14:23:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 525.0666825977744,
      time: '14:23:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 473.3683126808713,
      time: '14:23:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 576.8785068813279,
      time: '14:23:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 490.1165316021454,
      time: '14:24:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 417.6437308117652,
      time: '14:24:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 410.10668858168566,
      time: '14:24:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 447.3292218413172,
      time: '14:24:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 433.8660080578932,
      time: '14:24:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 431.27353476646795,
      time: '14:24:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 449.6220067815513,
      time: '14:24:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 512.1087480042438,
      time: '14:25:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 412.38030378805655,
      time: '14:25:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 375.06256891682614,
      time: '14:25:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 468.81155196520973,
      time: '14:25:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 437.4583491772476,
      time: '14:25:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 535.3540334643486,
      time: '14:25:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 491.8637610716893,
      time: '14:25:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 584.751763360433,
      time: '14:26:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 398.8004615160092,
      time: '14:26:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 461.78780627867604,
      time: '14:26:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 595.7015676933393,
      time: '14:26:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 516.4097070924529,
      time: '14:26:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 473.9809418023201,
      time: '14:26:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 491.5428825106351,
      time: '14:26:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 584.6892975456104,
      time: '14:27:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 444.4260813972414,
      time: '14:27:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 354.2696348890248,
      time: '14:27:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 490.4658799618327,
      time: '14:27:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 477.811500470033,
      time: '14:27:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 371.3665226992982,
      time: '14:27:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 483.0048449445568,
      time: '14:27:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 584.7523843153024,
      time: '14:28:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 400.4524941794481,
      time: '14:28:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 389.65641779193203,
      time: '14:28:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 510.87164365898616,
      time: '14:28:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 472.7943886040804,
      time: '14:28:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 522.3710838575211,
      time: '14:28:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 571.4737420965874,
      time: '14:28:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 751.6365745327361,
      time: '14:29:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 455.5228412889919,
      time: '14:29:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 377.01344708629125,
      time: '14:29:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 543.5033865344377,
      time: '14:29:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 558.2501172450542,
      time: '14:29:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 453.23359070230384,
      time: '14:29:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 520.3086930613598,
      time: '14:29:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 587.5445255346583,
      time: '14:30:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 439.4880945275431,
      time: '14:30:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 471.3488942176866,
      time: '14:30:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 524.7840943986303,
      time: '14:30:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 417.8240884809928,
      time: '14:30:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 475.47333588479194,
      time: '14:30:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 516.7742579344695,
      time: '14:30:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 615.7782820090299,
      time: '14:31:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 430.0525976566795,
      time: '14:31:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 408.8277388255787,
      time: '14:31:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 507.5209452571788,
      time: '14:31:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 496.3920064040619,
      time: '14:31:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 496.5990165284507,
      time: '14:31:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 429.8068817796623,
      time: '14:31:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 606.7000881746601,
      time: '14:32:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 396.6218168979201,
      time: '14:32:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 450.59222697343176,
      time: '14:32:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 518.2480501233113,
      time: '14:32:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 452.85065624485424,
      time: '14:32:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 489.5249839889533,
      time: '14:32:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 561.7709015104613,
      time: '14:32:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 591.5695625652899,
      time: '14:33:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 413.16143347158334,
      time: '14:33:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 324.7219813481514,
      time: '14:33:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 620.1707792619137,
      time: '14:33:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 463.42961394316285,
      time: '14:33:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 515.472590856952,
      time: '14:33:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 468.03708025732635,
      time: '14:33:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 543.2365377679827,
      time: '14:34:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 479.7695612912878,
      time: '14:34:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 412.35251329346295,
      time: '14:34:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 497.1190601483207,
      time: '14:34:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 526.4234213206266,
      time: '14:34:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 458.2256814715078,
      time: '14:34:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 532.9966315133164,
      time: '14:34:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 596.9484610246634,
      time: '14:35:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 467.04585938121903,
      time: '14:35:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 443.4815397811719,
      time: '14:35:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 510.0549523357484,
      time: '14:35:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 475.3917878144812,
      time: '14:35:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 505.65528990880415,
      time: '14:35:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 543.8688468979096,
      time: '14:35:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 520.3587392731214,
      time: '14:36:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 393.12223776007244,
      time: '14:36:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 403.11419946377123,
      time: '14:36:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 552.5327198003806,
      time: '14:36:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 476.91480395248163,
      time: '14:36:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 467.02266612080416,
      time: '14:36:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 598.0329297919326,
      time: '14:36:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 547.1590696629995,
      time: '14:37:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 446.9666152714613,
      time: '14:37:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 452.27401875326757,
      time: '14:37:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 555.2762966478992,
      time: '14:37:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 503.6253668654901,
      time: '14:37:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 516.9405240443751,
      time: '14:37:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 464.5589800440444,
      time: '14:37:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 534.7318226085448,
      time: '14:38:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 479.5693561685895,
      time: '14:38:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 373.13557749498136,
      time: '14:38:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 559.351515278019,
      time: '14:38:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 431.7523635228557,
      time: '14:38:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 510.76837420065266,
      time: '14:38:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 379.0243922089587,
      time: '14:38:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 563.0937069693161,
      time: '14:39:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 358.5297359439314,
      time: '14:39:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 469.46737200927896,
      time: '14:39:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 531.9365111014592,
      time: '14:39:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 408.0395166330497,
      time: '14:39:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 433.22806489777025,
      time: '14:39:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 539.1924772376848,
      time: '14:39:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 674.7329283336754,
      time: '14:40:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 469.16800961899673,
      time: '14:40:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 513.9449061809626,
      time: '14:40:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 442.8497543634758,
      time: '14:40:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 397.7595402989483,
      time: '14:40:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 534.2991058087516,
      time: '14:40:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 620.0255590755427,
      time: '14:40:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 465.6367403704126,
      time: '14:41:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 408.86881205270765,
      time: '14:41:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 380.85807197801705,
      time: '14:41:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 581.6715766150548,
      time: '14:41:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 351.6821705311999,
      time: '14:41:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 453.2018277442976,
      time: '14:41:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 591.9473176469719,
      time: '14:41:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 593.3130095187257,
      time: '14:42:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 470.52993342965794,
      time: '14:42:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 376.7248739299614,
      time: '14:42:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 442.6827303490656,
      time: '14:42:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 552.8103564970161,
      time: '14:42:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 520.4028899140573,
      time: '14:42:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 540.4829707637313,
      time: '14:42:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 478.3642064405174,
      time: '14:43:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 403.83704217287413,
      time: '14:43:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 471.66922385588504,
      time: '14:43:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 515.1317732619517,
      time: '14:43:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 394.83958171391583,
      time: '14:43:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 498.36436567006706,
      time: '14:43:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 505.4181907183976,
      time: '14:43:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 535.4034067105283,
      time: '14:44:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 351.75589496677406,
      time: '14:44:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 477.97860728653563,
      time: '14:44:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 462.2862074990321,
      time: '14:44:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 438.9373188207114,
      time: '14:44:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 571.9091838397561,
      time: '14:44:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 570.3561298318655,
      time: '14:44:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 613.4475298483683,
      time: '14:45:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 360.6228781058419,
      time: '14:45:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 372.8569986423366,
      time: '14:45:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 496.7930826703504,
      time: '14:45:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 436.15933500555394,
      time: '14:45:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 468.8267008814074,
      time: '14:45:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 481.3226900147766,
      time: '14:45:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 562.2140009547732,
      time: '14:46:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 444.4042473330691,
      time: '14:46:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 377.99065914520713,
      time: '14:46:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 516.438120515174,
      time: '14:46:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 465.370334890455,
      time: '14:46:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 462.53416019409013,
      time: '14:46:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 553.8178884678109,
      time: '14:46:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 505.1127611035347,
      time: '14:47:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 454.9861250860741,
      time: '14:47:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 384.9107695569746,
      time: '14:47:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 516.0678607725137,
      time: '14:47:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 490.7868606269648,
      time: '14:47:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 479.0290197056134,
      time: '14:47:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 555.2735079583314,
      time: '14:47:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 523.2348145370016,
      time: '14:48:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 396.78416874477955,
      time: '14:48:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 331.77747444828617,
      time: '14:48:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 521.0960377117642,
      time: '14:48:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 493.02367441798725,
      time: '14:48:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 464.8410108582862,
      time: '14:48:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 583.010495374944,
      time: '14:48:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 592.9798874467338,
      time: '14:49:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 473.9296229388687,
      time: '14:49:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 353.0674026757901,
      time: '14:49:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 580.6855634529323,
      time: '14:49:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 420.8461280715531,
      time: '14:49:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 519.9970950971025,
      time: '14:49:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 667.983001945554,
      time: '14:49:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 522.4816684141432,
      time: '14:50:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 358.923996886552,
      time: '14:50:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 348.7929616623966,
      time: '14:50:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 522.676715075699,
      time: '14:50:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 441.6439143106794,
      time: '14:50:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 399.1844695781706,
      time: '14:50:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 549.6207983589384,
      time: '14:50:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 569.8229294790988,
      time: '14:51:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 438.6960100676342,
      time: '14:51:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 360.61012174479356,
      time: '14:51:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 487.79216823546756,
      time: '14:51:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 464.12899752441496,
      time: '14:51:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 427.3158790426823,
      time: '14:51:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 504.5518187146251,
      time: '14:51:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 561.2785919951907,
      time: '14:52:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 381.44919001187714,
      time: '14:52:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 397.2657556306609,
      time: '14:52:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 548.2043584144178,
      time: '14:52:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 437.56544369082263,
      time: '14:52:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 426.6098539210403,
      time: '14:52:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 528.7212843904002,
      time: '14:52:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 526.4199826197091,
      time: '14:53:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 409.40819460989206,
      time: '14:53:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 410.710736626826,
      time: '14:53:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 559.473524446232,
      time: '14:53:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 530.3672788009997,
      time: '14:53:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 527.5153795986788,
      time: '14:53:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 441.54620475554407,
      time: '14:53:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 666.1972044662663,
      time: '14:54:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 444.3699335658207,
      time: '14:54:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 476.52502464070386,
      time: '14:54:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 438.61960924315036,
      time: '14:54:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 474.54874758191255,
      time: '14:54:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 565.5306686290962,
      time: '14:54:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 495.26434344554707,
      time: '14:54:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 590.6959511159006,
      time: '14:55:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 398.97933173580236,
      time: '14:55:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 349.08229796306046,
      time: '14:55:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 529.8700034924929,
      time: '14:55:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 486.74388930249086,
      time: '14:55:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 474.77753907312643,
      time: '14:55:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 509.5358780943448,
      time: '14:55:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 457.74287066711963,
      time: '14:56:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 422.7722227885087,
      time: '14:56:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 448.2161199238292,
      time: '14:56:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 535.0586371155449,
      time: '14:56:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 483.14406343337066,
      time: '14:56:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 471.5589138404995,
      time: '14:56:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 503.79558010327037,
      time: '14:56:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 568.3227157384714,
      time: '14:57:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 492.31464046072205,
      time: '14:57:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 388.3005577887246,
      time: '14:57:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 485.1218248320004,
      time: '14:57:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 508.67369287426624,
      time: '14:57:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 483.50260815565906,
      time: '14:57:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 537.6177436016861,
      time: '14:57:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 525.9106767615806,
      time: '14:58:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 413.15540652384254,
      time: '14:58:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 396.52681451737834,
      time: '14:58:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 568.785340665581,
      time: '14:58:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 459.05107793518533,
      time: '14:58:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 538.0939151304095,
      time: '14:58:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 488.87900338088997,
      time: '14:58:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 601.6216667398112,
      time: '14:59:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 483.7846056032571,
      time: '14:59:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 432.7409746083302,
      time: '14:59:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 492.4972206483737,
      time: '14:59:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 385.1584026022077,
      time: '14:59:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 433.6323432904713,
      time: '14:59:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 586.0515333662236,
      time: '14:59:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 519.373963078365,
      time: '15:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 385.5146572671191,
      time: '15:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 342.86389892188504,
      time: '15:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 506.2788226735771,
      time: '15:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 469.9843975876321,
      time: '15:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 491.91844913673924,
      time: '15:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 530.0103532459099,
      time: '15:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 553.2631779266551,
      time: '15:01:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 468.4902088957641,
      time: '15:01:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 418.12048730920253,
      time: '15:01:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 491.34640878580655,
      time: '15:01:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 417.4321553104086,
      time: '15:01:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 528.7598814891215,
      time: '15:01:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 529.5349839430693,
      time: '15:01:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 584.2493639490228,
      time: '15:02:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 514.078431032895,
      time: '15:02:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 407.3226104106528,
      time: '15:02:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 500.77895237907336,
      time: '15:02:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 423.5691659125122,
      time: '15:02:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 505.05470849699225,
      time: '15:02:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 513.6052641743541,
      time: '15:02:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 602.2877597085061,
      time: '15:03:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 318.41777499363553,
      time: '15:03:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 423.62256320040746,
      time: '15:03:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 445.18624565523993,
      time: '15:03:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 479.3182009377547,
      time: '15:03:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 489.4790808299372,
      time: '15:03:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 537.759534192949,
      time: '15:03:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 498.98517964721117,
      time: '15:04:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 402.1552372264762,
      time: '15:04:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 413.4584321953909,
      time: '15:04:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 427.9974558702853,
      time: '15:04:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 511.91415357168177,
      time: '15:04:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 530.0523046283571,
      time: '15:04:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 571.2549132333818,
      time: '15:04:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 542.2749382079526,
      time: '15:05:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 470.853606359027,
      time: '15:05:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 521.7650069955447,
      time: '15:05:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 579.7252531612486,
      time: '15:05:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 451.06357883680306,
      time: '15:05:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 344.83838535003815,
      time: '15:05:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 486.643489214455,
      time: '15:05:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 535.2527344419522,
      time: '15:06:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 431.84773069785035,
      time: '15:06:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 367.1130007874342,
      time: '15:06:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 457.6519325840836,
      time: '15:06:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 465.4416506299482,
      time: '15:06:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 513.8937659765454,
      time: '15:06:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 497.0941755462372,
      time: '15:06:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 526.3335383713144,
      time: '15:07:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 460.5572936685654,
      time: '15:07:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 372.45015224990914,
      time: '15:07:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 450.43038252718463,
      time: '15:07:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 535.1107472317619,
      time: '15:07:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 447.29621584362883,
      time: '15:07:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 514.8136985611668,
      time: '15:07:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 647.2727120140548,
      time: '15:08:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 411.80074066420894,
      time: '15:08:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 367.8429736787618,
      time: '15:08:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 392.33049431981425,
      time: '15:08:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 462.03765897442844,
      time: '15:08:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 388.46835515717714,
      time: '15:08:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 462.70645382633927,
      time: '15:08:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 579.2490855480478,
      time: '15:09:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 446.329489373645,
      time: '15:09:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 371.22614404198725,
      time: '15:09:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 468.0519126155249,
      time: '15:09:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 580.0841557090198,
      time: '15:09:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 505.560129976249,
      time: '15:09:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 489.0371070139251,
      time: '15:09:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 495.95580228324775,
      time: '15:10:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 434.21613823039604,
      time: '15:10:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 367.13064363467413,
      time: '15:10:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 433.8455103296251,
      time: '15:10:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 478.2754822815772,
      time: '15:10:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 548.6829272581479,
      time: '15:10:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 506.18895632276707,
      time: '15:10:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 604.8930973527388,
      time: '15:11:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 500.38910308299035,
      time: '15:11:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 458.4508265553776,
      time: '15:11:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 582.1007580068184,
      time: '15:11:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 361.96186204220913,
      time: '15:11:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 473.12757426861543,
      time: '15:11:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 573.7194590356364,
      time: '15:11:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 665.1078098506316,
      time: '15:12:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 454.7210421650607,
      time: '15:12:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 470.0252123994927,
      time: '15:12:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 550.4908544671317,
      time: '15:12:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 487.6670810552266,
      time: '15:12:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 527.643727360147,
      time: '15:12:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 543.1280664500963,
      time: '15:12:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 610.6232630275573,
      time: '15:13:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 458.8801331037601,
      time: '15:13:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 370.46268531252616,
      time: '15:13:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 465.5924827411138,
      time: '15:13:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 469.0579192441389,
      time: '15:13:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 560.6139128994323,
      time: '15:13:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 539.6794955683772,
      time: '15:13:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 483.03150170229935,
      time: '15:14:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 421.4061516938766,
      time: '15:14:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 357.38222134478855,
      time: '15:14:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 612.6217902672154,
      time: '15:14:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 514.4876377041373,
      time: '15:14:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 545.7457226792023,
      time: '15:14:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 572.5448981083986,
      time: '15:14:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 534.7882963566874,
      time: '15:15:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 417.6196887963753,
      time: '15:15:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 422.5707778193202,
      time: '15:15:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 549.0882743495797,
      time: '15:15:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 483.6590675634979,
      time: '15:15:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 561.9982264685697,
      time: '15:15:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 523.1314105800302,
      time: '15:15:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 622.3455574593312,
      time: '15:16:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 420.372090609019,
      time: '15:16:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 371.38884778595144,
      time: '15:16:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 483.7584308245689,
      time: '15:16:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 443.0772008008113,
      time: '15:16:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 517.1063745535946,
      time: '15:16:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 549.5232424964445,
      time: '15:16:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 523.616526719061,
      time: '15:17:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 461.7226071189148,
      time: '15:17:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 430.6465908877755,
      time: '15:17:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 375.0297142563213,
      time: '15:17:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 388.7850881855317,
      time: '15:17:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 483.77168194507965,
      time: '15:17:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 524.8389123533752,
      time: '15:17:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 581.1909714073114,
      time: '15:18:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 420.95077595898687,
      time: '15:18:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 409.146151042565,
      time: '15:18:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 614.547128629537,
      time: '15:18:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 439.54883713569876,
      time: '15:18:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 399.90170940514156,
      time: '15:18:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 543.2681174699815,
      time: '15:18:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 597.7317026714668,
      time: '15:19:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 456.48874284482065,
      time: '15:19:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 323.2127942501384,
      time: '15:19:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 430.5213766618202,
      time: '15:19:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 407.473977289535,
      time: '15:19:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 467.69687559350257,
      time: '15:19:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 500.8620671194209,
      time: '15:19:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 512.6534764210959,
      time: '15:20:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 545.770039932272,
      time: '15:20:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 476.3752600665031,
      time: '15:20:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 417.7300626521554,
      time: '15:20:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 420.97382750976385,
      time: '15:20:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 437.8376702341904,
      time: '15:20:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 408.05914208617855,
      time: '15:20:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 556.02373219691,
      time: '15:21:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 485.5562351715846,
      time: '15:21:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 488.7938836547761,
      time: '15:21:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 551.128521600482,
      time: '15:21:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 479.42892022103047,
      time: '15:21:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 588.5471358748907,
      time: '15:21:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 523.2860418906848,
      time: '15:21:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 396.93663299654634,
      time: '15:22:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 425.69882339160796,
      time: '15:22:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 368.3605654757807,
      time: '15:22:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 621.9876203169637,
      time: '15:22:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 533.4952252175704,
      time: '15:22:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 471.2057093783832,
      time: '15:22:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 601.137406804997,
      time: '15:22:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 507.7806179332855,
      time: '15:23:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 502.06069610819725,
      time: '15:23:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 379.6149220032008,
      time: '15:23:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 569.2136409255259,
      time: '15:23:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 469.73357649114905,
      time: '15:23:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 486.1602403392243,
      time: '15:23:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 576.3107701120796,
      time: '15:23:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 546.3715924303419,
      time: '15:24:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 421.5962313489224,
      time: '15:24:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 413.29326953624525,
      time: '15:24:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 528.195456002618,
      time: '15:24:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 390.2058468982408,
      time: '15:24:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 507.57426880202337,
      time: '15:24:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 578.2698742295586,
      time: '15:24:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 496.6108409017575,
      time: '15:25:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 340.09377324110733,
      time: '15:25:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 415.72283949935127,
      time: '15:25:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 529.7377170832643,
      time: '15:25:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 472.23013341100705,
      time: '15:25:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 482.1801223186227,
      time: '15:25:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 591.8065360903109,
      time: '15:25:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 640.6205651965818,
      time: '15:26:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 391.5956844541298,
      time: '15:26:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 431.92721363364154,
      time: '15:26:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 542.6707779390154,
      time: '15:26:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 509.83157433228257,
      time: '15:26:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 564.7525520215377,
      time: '15:26:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 534.4328795480719,
      time: '15:26:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 487.49293110196834,
      time: '15:27:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 348.4604039487072,
      time: '15:27:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 499.5102269383175,
      time: '15:27:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 537.9464294893382,
      time: '15:27:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 419.51085478403087,
      time: '15:27:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 448.8675319132774,
      time: '15:27:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 539.8657853702798,
      time: '15:27:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 536.9977756651508,
      time: '15:28:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 424.42432579793456,
      time: '15:28:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 390.1526386252975,
      time: '15:28:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 514.0595711984688,
      time: '15:28:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 443.2991416663541,
      time: '15:28:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 489.73037276186216,
      time: '15:28:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 499.1174052282825,
      time: '15:28:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 565.5370288643046,
      time: '15:29:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 442.9209189594776,
      time: '15:29:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 359.0851377730773,
      time: '15:29:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 505.2100551975938,
      time: '15:29:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 450.73440973645984,
      time: '15:29:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 442.8764707150976,
      time: '15:29:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 514.1963571986475,
      time: '15:29:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 631.0636644533058,
      time: '15:30:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 525.8218656137641,
      time: '15:30:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 330.03403859927363,
      time: '15:30:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 496.8703436050239,
      time: '15:30:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 410.755084345888,
      time: '15:30:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 413.9988744389647,
      time: '15:30:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 560.7885574885571,
      time: '15:30:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 487.206892441028,
      time: '15:31:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 458.34636868820814,
      time: '15:31:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 362.45349800290404,
      time: '15:31:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 462.30177055666616,
      time: '15:31:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 482.41402169219293,
      time: '15:31:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 449.41154545473574,
      time: '15:31:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 590.1942218584409,
      time: '15:31:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 617.158187607748,
      time: '15:32:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 431.0449735595568,
      time: '15:32:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 397.34365135631015,
      time: '15:32:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 485.96624615666127,
      time: '15:32:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 443.95259256961094,
      time: '15:32:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 478.1481601475794,
      time: '15:32:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 523.02768621595,
      time: '15:32:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 559.5116530509794,
      time: '15:33:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 483.47027905917446,
      time: '15:33:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 488.7278931758894,
      time: '15:33:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 415.3521592902307,
      time: '15:33:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 470.9766221953514,
      time: '15:33:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 458.534888774137,
      time: '15:33:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 507.4905367574294,
      time: '15:33:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 509.92456744760244,
      time: '15:34:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 331.44323454960573,
      time: '15:34:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 373.1194350481914,
      time: '15:34:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 495.0830186602625,
      time: '15:34:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 405.62539110989496,
      time: '15:34:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 445.3789510063072,
      time: '15:34:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 530.0263979428298,
      time: '15:34:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 582.1051737131636,
      time: '15:35:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 453.7807279054283,
      time: '15:35:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 410.18939758194495,
      time: '15:35:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 450.5704446424541,
      time: '15:35:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 428.1270849838295,
      time: '15:35:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 409.6841268164083,
      time: '15:35:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 560.0603374464557,
      time: '15:35:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 568.9529847786735,
      time: '15:36:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 480.54325969434836,
      time: '15:36:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 398.1788551963624,
      time: '15:36:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 444.8205341392115,
      time: '15:36:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 486.11906789138857,
      time: '15:36:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 475.8447213685653,
      time: '15:36:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 457.8072591933229,
      time: '15:36:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 528.9891561420602,
      time: '15:37:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 368.0706877110079,
      time: '15:37:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 458.4196636724042,
      time: '15:37:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 508.9947075576739,
      time: '15:37:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 431.3583423954116,
      time: '15:37:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 404.7639812984499,
      time: '15:37:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 415.19095234313806,
      time: '15:37:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 562.490104249501,
      time: '15:38:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 499.1877021603465,
      time: '15:38:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 525.3466212936811,
      time: '15:38:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 569.60011431723,
      time: '15:38:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 536.3481925616702,
      time: '15:38:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 518.0027981844801,
      time: '15:38:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 502.47315752542085,
      time: '15:38:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 539.734320156912,
      time: '15:39:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 458.9248203747207,
      time: '15:39:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 372.45656135398394,
      time: '15:39:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 545.9158303001157,
      time: '15:39:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 430.0181907192699,
      time: '15:39:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 484.1219876467252,
      time: '15:39:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 468.9643787042921,
      time: '15:39:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 564.6758672625624,
      time: '15:40:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 421.2356043049599,
      time: '15:40:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 374.5280278740889,
      time: '15:40:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 421.47496981884115,
      time: '15:40:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 461.2342362875943,
      time: '15:40:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 407.1224250267535,
      time: '15:40:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 504.5929901176345,
      time: '15:40:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 592.1065337260524,
      time: '15:41:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 473.63909330531425,
      time: '15:41:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 451.2080438534536,
      time: '15:41:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 450.51859317148313,
      time: '15:41:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 496.6295415936545,
      time: '15:41:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 464.5395461475068,
      time: '15:41:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 522.6109840591264,
      time: '15:41:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 638.3008408072676,
      time: '15:42:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 555.5346428902199,
      time: '15:42:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 433.0945744813156,
      time: '15:42:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 547.0385593994108,
      time: '15:42:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 379.0817133533484,
      time: '15:42:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 442.39217972047084,
      time: '15:42:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 507.3375795488493,
      time: '15:42:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 497.10922505865756,
      time: '15:43:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 451.09331275292476,
      time: '15:43:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 491.3353662868017,
      time: '15:43:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 450.8756303230845,
      time: '15:43:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 361.9595594009612,
      time: '15:43:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 495.95872552095904,
      time: '15:43:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 602.6233767235373,
      time: '15:43:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 665.6516687328133,
      time: '15:44:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 454.4110293150168,
      time: '15:44:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 428.1964092662982,
      time: '15:44:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 488.7683425001488,
      time: '15:44:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 373.7171842714953,
      time: '15:44:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 547.0225223011572,
      time: '15:44:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 546.337238230116,
      time: '15:44:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 461.3956100238749,
      time: '15:45:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 419.0319550229878,
      time: '15:45:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 381.035395460647,
      time: '15:45:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 527.5026049512276,
      time: '15:45:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 513.1292051713591,
      time: '15:45:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 386.24137651771275,
      time: '15:45:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 545.0237179805414,
      time: '15:45:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 551.4107452482208,
      time: '15:46:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 399.5077815267604,
      time: '15:46:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 428.53274153461547,
      time: '15:46:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 451.58277725681825,
      time: '15:46:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 422.40709270537764,
      time: '15:46:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 485.75130395737085,
      time: '15:46:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 561.1103572021701,
      time: '15:46:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 588.4158603242288,
      time: '15:47:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 483.5167908272123,
      time: '15:47:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 454.4351790291454,
      time: '15:47:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 505.268775307298,
      time: '15:47:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 577.9099642834126,
      time: '15:47:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 471.99336022166796,
      time: '15:47:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 473.05834411096157,
      time: '15:47:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 573.0495933867517,
      time: '15:48:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 399.1958087045566,
      time: '15:48:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 440.0241090598682,
      time: '15:48:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 433.2987252540898,
      time: '15:48:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 421.78762006713055,
      time: '15:48:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 513.5670038225232,
      time: '15:48:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 581.9555893710134,
      time: '15:48:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 527.8650240089703,
      time: '15:49:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 445.5783118609696,
      time: '15:49:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 424.3637015553649,
      time: '15:49:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 469.9316178024393,
      time: '15:49:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 459.22756515985185,
      time: '15:49:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 490.65983141188445,
      time: '15:49:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 526.211785673227,
      time: '15:49:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 548.5938874821362,
      time: '15:50:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 418.1171276617442,
      time: '15:50:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 452.3337344794577,
      time: '15:50:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 515.9890967071268,
      time: '15:50:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 527.1054976283938,
      time: '15:50:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 442.40153341305904,
      time: '15:50:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 563.5240308620606,
      time: '15:50:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 534.3499532670584,
      time: '15:51:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 465.9489912873196,
      time: '15:51:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 457.4647795222836,
      time: '15:51:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 420.3503133234165,
      time: '15:51:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 550.3046444079562,
      time: '15:51:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 464.0473032166691,
      time: '15:51:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 476.40713834799226,
      time: '15:51:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 529.5317621527894,
      time: '15:52:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 458.68310526434743,
      time: '15:52:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 468.10794955187635,
      time: '15:52:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 522.0237368980199,
      time: '15:52:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 553.0751788318199,
      time: '15:52:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 440.1987071598255,
      time: '15:52:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 452.31206169919676,
      time: '15:52:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 601.4801048510512,
      time: '15:53:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 493.87699721289493,
      time: '15:53:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 431.4354943794821,
      time: '15:53:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 499.01811005366596,
      time: '15:53:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 510.4183115296571,
      time: '15:53:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 533.8003569299299,
      time: '15:53:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 570.8944829012514,
      time: '15:53:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 576.8507742982524,
      time: '15:54:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 416.49918005726266,
      time: '15:54:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 390.6440959841573,
      time: '15:54:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 527.6244977208573,
      time: '15:54:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 501.2031262905731,
      time: '15:54:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 481.0655824335971,
      time: '15:54:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 548.8204763048758,
      time: '15:54:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 524.3545202369673,
      time: '15:55:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 428.5062532353314,
      time: '15:55:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 406.3356843216661,
      time: '15:55:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 511.1957067032331,
      time: '15:55:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 479.62634746005915,
      time: '15:55:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 575.0595342876504,
      time: '15:55:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 484.89742228212447,
      time: '15:55:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 603.9799937716625,
      time: '15:56:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 393.0618142108846,
      time: '15:56:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 459.3254483254178,
      time: '15:56:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 568.2070214986923,
      time: '15:56:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 488.9180538083319,
      time: '15:56:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 476.966959309269,
      time: '15:56:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 486.51684593626527,
      time: '15:56:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 574.3649760438304,
      time: '15:57:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 419.7853369961944,
      time: '15:57:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 358.1532164506382,
      time: '15:57:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 506.26122513239534,
      time: '15:57:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 422.44071418357333,
      time: '15:57:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 444.57966165447687,
      time: '15:57:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 586.2717392207385,
      time: '15:57:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 599.643105941948,
      time: '15:58:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 460.8650246522426,
      time: '15:58:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 417.43366544364505,
      time: '15:58:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 478.52972294373734,
      time: '15:58:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 409.09005582888466,
      time: '15:58:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 404.31428036935864,
      time: '15:58:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 470.5294053566336,
      time: '15:58:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 590.4814420961806,
      time: '15:59:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 479.8494308322676,
      time: '15:59:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 379.33305938363196,
      time: '15:59:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 506.11487515161417,
      time: '15:59:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 449.8312771294524,
      time: '15:59:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 389.84301618720275,
      time: '15:59:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 612.1336476627981,
      time: '15:59:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockLocations',
      count: 517.5502494538964,
      time: '16:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-renewLease',
      count: 395.8917337911187,
      time: '16:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getFileInfo',
      count: 400.43724114674086,
      time: '16:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-updateBlockInfo',
      count: 527.1649014518194,
      time: '16:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-deleteBlock',
      count: 441.49076887375355,
      time: '16:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-addNewBlock',
      count: 400.7932028497255,
      time: '16:00:00'
    },
    {
      timeType: 'LatencyInHandlerCounter-getBlockStats',
      count: 484.96896326760657,
      time: '16:00:00'
    }
  ]
};

  const formatMilliseconds = (value: number) => {
    if (value === 0) {
      return '0 μs';
    } else if (value < 1000) {
      return `${value} ms`;
    } else if (value === 1000) {
      return '1 s';
    }
    return `${value / 1000} s`;
  };

  const spec = {
    type: 'area',
    data: leastData,
    point: {
      style: {
        size: 0
      }
    },
    stack: false,
    seriesField: 'timeType',
    xField: 'time',
    yField: 'count',
    axes: [
      {
        orient: 'bottom',
        type: 'band',
        label: {
          visible: true,
          formatMethod: value => {
            // Format X-axis label as hour:minute (e.g., 11:00)
            // Assume value is a string in "HH:MM:SS" format
            return value.substring(0, 5); // Extract "HH:MM"
          }
        },
        tick: {
          tickStep: 60
        },
        grid: {
          visible: true,
          style: {
            lineDash: [5, 5],
            stroke: 'grey'
          }
        }
      },
      {
        orient: 'left',
        type: 'linear',
        min: 0,
        // max: 1000,
        label: {
          visible: true,
          formatMethod: formatMilliseconds
        },
        tick: {
          values: [0, 250, 500, 750, 1000]
        },
        grid: {
          visible: true,
          style: {
            lineDash: [5, 5],
            stroke: 'grey'
          }
        }
      }
    ],
    area: {
      style: {
        fillOpacity: 0.05
      }
    },
    legends: {
      visible: false
    }
  };

  const cs = document.getElementById(CONTAINER_ID) as HTMLElement;

  const chartDiv = document.createElement('div');
  cs.appendChild(chartDiv);

  const vchart = new VChart(spec, {
    dom: chartDiv,
    mode: isMobile ? 'mobile-browser' : 'desktop-browser'
  });

  const metricsMap = {};
  leastData.values.forEach(item => {
    const key = item.timeType;
    if (!metricsMap[key]) metricsMap[key] = { countList: [], current: 0 };
    metricsMap[key].countList.push(item.count);
    metricsMap[key].current = formatMilliseconds(Math.round(item.count));
  });
  Object.keys(metricsMap).forEach(key => {
    const arr = metricsMap[key].countList;
    const sum = arr.reduce((s, v) => s + v, 0);
    metricsMap[key].avg = formatMilliseconds(Math.round(sum / arr.length));
    metricsMap[key].max = formatMilliseconds(Math.round(Math.max(...arr)));
  });

  console.time('renderTime');

  vchart.renderAsync().then(() => {
    console.timeEnd('renderTime');

    const legendItems = vchart.getLegendDataByIndex(0);
    let selectedNames = vchart.getLegendSelectedDataByIndex(0);

    function buildLegendTable() {
      const wrapper = document.createElement('div');
      wrapper.className = 'legend-table-wrapper';
      wrapper.style.marginTop = '8px';

      const table = document.createElement('table');
      table.style.width = '100%';
      table.style.borderCollapse = 'collapse';

      const thead = document.createElement('thead');
      thead.innerHTML = `
    <tr style="border-bottom:1px solid #ccc; text-align:right;">
      <th style="text-align:left; padding:4px 8px;">Metrics</th>
      <th style="text-align:center; padding:4px 8px;">Max</th>
      <th style="text-align:center; padding:4px 8px;">Avg</th>
      <th style="text-align:center; padding:4px 8px;">Current</th>
    </tr>`;
      table.appendChild(thead);

      const tbody = document.createElement('tbody');
      legendItems.forEach((item, index) => {
        const seriesName = item.key;
        const color = item.style('fill');
        const visible = item.style('visible');
        const { max, avg, current } = metricsMap[seriesName] || { max: '-', avg: '-', current: '-' };

        const tr = document.createElement('tr');
        if (index % 2 === 1) {
          tr.style.backgroundColor = '#f9f9f9';
        }
        tr.style.borderBottom = '1px solid #eee';
        tr.style.cursor = 'pointer';

        tr.setAttribute('data-series', seriesName);
        if (!visible) tr.classList.add('legend-disabled');
        tr.innerHTML = `
      <td style="padding:4px 8px; text-align:left; display:flex; align-items:center;">
        <span
          style="
            display:inline-block;
            width:16px;
            height:5px;
            background-color:${color};
            border-radius:5px;
            margin-right:6px;
            ${visible ? '' : 'opacity:0.3;'}
          "
        ></span>
        <span style="${visible ? '' : 'color:#aaa;'}">${seriesName}</span>
      </td>
      <td style="text-align:center; padding:4px 8px; ${visible ? '' : 'color:#aaa;'}">${max}</td>
      <td style="text-align:center; padding:4px 8px; ${visible ? '' : 'color:#aaa;'}">${avg}</td>
      <td style="text-align:center; padding:4px 8px; ${visible ? '' : 'color:#aaa;'}">${current}</td>
    `;
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      wrapper.appendChild(table);

      tbody.querySelectorAll('tr').forEach(tr => {
        tr.addEventListener('mouseover', () => {
          const series = tr.getAttribute('data-series');
          if (series) {
            const idx = selectedNames.indexOf(series);
            const isSelected = idx >= 0;
            // Set the highlighted state of the corresponding series in the chart
            vchart.setHovered({
              series: [series]
            });
            // Set the style of the corresponding row in the legend
            tr.style.backgroundColor = '#f0f0f0';
            tr.style.transition = 'background-color 0.2s';
          }
        });

        tr.addEventListener('mouseout', () => {
          vchart.clearHovered();

          // Reset the background color of the row
          const index = Array.from(tbody.children).indexOf(tr);
          tr.style.backgroundColor = index % 2 === 1 ? '#f9f9f9' : 'transparent';
        });

        tr.addEventListener('click', () => {
          const series = tr.getAttribute('data-series');
          if (!series) return;
          const idx = selectedNames.indexOf(series);
          const isSelected = idx >= 0;

          // if current selected count is 1 and want to unselect, not allow
          if (isSelected && selectedNames.length === 1) {
            return;
          }

          const newSelectedNames = isSelected
            ? selectedNames.filter(name => name !== series)
            : [...selectedNames, series];

          // update style of row and series in chart
          const spans = tr.querySelectorAll('td span');
          spans.forEach(span => {
            if (span instanceof HTMLElement) {
              span.style.opacity = isSelected ? '0.3' : '1';
            }
          });
          const textSpans = tr.querySelectorAll('td span + span');
          textSpans.forEach(span => {
            if (span instanceof HTMLElement) {
              span.style.color = isSelected ? '#aaa' : '#000';
            }
          });

          selectedNames = newSelectedNames;
          // update legend in chart
          vchart.setLegendSelectedDataByIndex(0, newSelectedNames);
        });
      });
      return wrapper;
    }

    const wrapper = buildLegendTable();
    const existing = cs.querySelector('.legend-table-wrapper');
    if (!existing) {
      cs.appendChild(wrapper);
    }
  });
```

## Related Tutorials

[Legend](https://visactor.com/vchart/guide/tutorial_docs/Chart_Concepts/Legend)
