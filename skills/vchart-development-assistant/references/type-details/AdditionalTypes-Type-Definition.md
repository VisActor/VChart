# 补充公开类型声明

本文件由维护工具按实际符号生成，保留类型与继承，不代替已有人工说明。外部声明注明包及版本；类型参数按各调用处实例化。

## 类型索引

- [DataSet](#type-8d2b64638b97)
- [DataView](#type-b26ccd36d8e8)
- [IDsvParserOptions](#type-a39097639f44)
- [IParserOptions](#type-63f1dbc535e0)
- [IFieldsOptions](#type-26812fc33a0c)
- [IFilterOptions](#type-aceaf7172c44)
- [IFoldOptions](#type-46fd81c95ea2)
- [ISimplifyOptions](#type-a4c7726cf624)
- [ITransformOptions](#type-f4b40ca0e8cc)
- [TreemapOptions](#type-5125620c5489)
- [ACustomAnimate](#type-f85debfe2020)
- [AStageAnimate](#type-c0172addd0a4)
- [AxisItem](#type-7666dd9220f0)
- [AxisItemStateStyle](#type-80c23221deb4)
- [AxisLabelOverlap](#type-92b85bf48fbb)
- [Functional](#type-2535a2dd9530)
- [DiscreteLegendAttrs](#type-8f8c60190b3e)
- [LegendItem](#type-1b703f3ae381)
- [LegendItemDatum](#type-75bc5c7a36bf)
- [LegendPagerAttributes](#type-833ac1fb317b)
- [LegendScrollbarAttributes](#type-8dec8f9540ef)
- [LegendTitle](#type-c8f27ac5183b)
- [BaseMarkerAnimation](#type-c807eb5fd121)
- [IMarkAreaLabelPosition](#type-a1709a28c988)
- [IMarkCommonArcLabelPosition](#type-9a828f1ac3c0)
- [IMarkLineLabelPosition](#type-5be4f671bfe4)
- [IMarkPointItemPosition](#type-39230de2ade7)
- [MarkCommonLineAnimationType](#type-681f4999f1eb)
- [MarkPointAnimationType](#type-d28c136a90bb)
- [Datum](#type-8cb45fc9b0d9)
- [HandlerTextStyleContext](#type-589dee7f19a8)
- [IContainerSize](#type-5c34c2234a2c)
- [TooltipRichTextAttrs](#type-3b54c645e6d7)
- [IApp](#type-d176b9e09694)
- [EasingType](#type-6efe56d777d1)
- [ITicker](#type-619b260e190a)
- [IColor](#type-a0aea41aa029)
- [IConicalGradient](#type-d7015f202839)
- [ILinearGradient](#type-d8d5bda2ce95)
- [IRadialGradient](#type-8830ca87d7a0)
- [IGraphic](#type-a766bc91cce3)
- [IGraphicAttribute](#type-463cf72553ce)
- [IGraphicStyle](#type-fe3cb3c3600e)
- [IGroup](#type-8af3ee2f9b73)
- [IGroupGraphicAttribute](#type-2f7220f7ffb4)
- [IImageGraphicAttribute](#type-fcfc702de0ac)
- [IRichTextAttribute](#type-09c9e7b04102)
- [IRichTextCharacter](#type-a486d6a175fe)
- [IRichTextGraphicAttribute](#type-e3b4c4057a4f)
- [SymbolType](#type-4dccce8cd4d7)
- [ITextAttribute](#type-4ecb56643e01)
- [ITextGraphicAttribute](#type-36d5f8ea422d)
- [TextAlignType](#type-5417f1df62a1)
- [TextBaselineType](#type-b47e2c6810a7)
- [ILayer](#type-92d2afdda23a)
- [ICustomPath2D](#type-68cc5b53deb9)
- [IOption3D](#type-f65323c92812)
- [IStage](#type-454a11518dd1)
- [IStageParams](#type-681e3d101563)
- [CustomTicksFunc](#type-a2851eee354b)
- [IBaseScale](#type-f4ea6ab4e67d)
- [IContinuousScale](#type-61b93a04c77c)
- [IBoundsLike](#type-e61ecce4e47c)
- [IPointLike](#type-e25b463f6cfe)
- [IPadding](#type-698f5ded9c9f)
- [Maybe](#type-0f3d51337f61)
- [IBar3dSeriesSpec](#type-e506ece45fdc)
- [IPictogramSeriesSpec](#type-f780ecfd754f)
- [IRangeColumn3dSeriesSpec](#type-de962586184b)
- [IWordCloud3dSeriesSpec](#type-172112d22f72)
- [ChannelAnimationConfig](#type-5d8412d98274)
- [CommonAnimationConfigItem](#type-a27ba00f90e2)
- [GraphicFunctionCallback](#type-2d4e66b882cd)
- [GraphicFunctionValueType](#type-2dfb509d67d0)
- [IAnimationChannelAttrs](#type-f40bfaee5af2)
- [IAnimationChannelFunction](#type-253d0d6a48ba)
- [IAnimationChannelInterpolator](#type-cbb1bcb4a54c)
- [IAnimationControlOptions](#type-727cdb8dd287)
- [IAnimationCustomConstructor](#type-be178b30c81f)
- [IAnimationEffect](#type-2dd72221397d)
- [IAnimationParameters](#type-3fc135bb4f43)
- [IAnimationTimeline](#type-f36951a20ee2)
- [IAnimationTimeSlice](#type-1e49bff211ba)
- [IStageAnimationCallback](#type-3e0ce9607473)
- [IStateAnimationConfig](#type-e4cf848bb846)
- [MarkAnimationSpec](#type-1cf6d57c137c)
- [TypeAnimationConfig](#type-b4e071966992)
- [IAnimationSpec](#type-c2c92c7fb8c3)
- [ICommonStateAnimateSpec](#type-874c3b173f64)
- [IMarkAnimateSpec](#type-f077d8f2c125)
- [IMorphAnimationConfig](#type-6fbb2d1cab32)
- [IMorphConfig](#type-bffef8c15a00)
- [IMorphSeriesSpec](#type-d1defc672c7e)
- [IStateAnimateSpec](#type-c689f8784df3)
- [MorphData](#type-e6ed6ba04d57)
- [MorphElements](#type-3a62a6f9f35a)
- [MorphFunctionCallback](#type-2d18666b391c)
- [MorphFunctionType](#type-953fe2a09d7a)
- [MorphFunctionValueType](#type-e0d294fdac38)
- [IAreaChartSpec](#type-496aab7cbbc3)
- [IBarChartSpec](#type-1b991bebaeb5)
- [IBoxPlotChartSpec](#type-20eb03e0dbfa)
- [ICartesianChartSpec](#type-0ecf9332a2b4)
- [ICirclePackingChartSpec](#type-6e93443171dd)
- [ICommonChartSpec](#type-2e8825d02f34)
- [ICorrelationChartSpec](#type-717abb97a652)
- [IFunnelChartSpec](#type-87520a24cdd6)
- [IGaugeChartSpec](#type-80ddbd318ef0)
- [IHeatmapChartSpec](#type-d5e9ad106fbf)
- [IHistogramChartSpec](#type-50577849394e)
- [DimensionIndexOption](#type-5b5f8e33e6e1)
- [IChart](#type-d27fa13b0c29)
- [IChartData](#type-b326c4e21951)
- [IChartSpecTransformer](#type-664463dc79e8)
- [IChartEvaluateOption](#type-895c62f86a47)
- [IChartLayoutOption](#type-b3fb7b561e3d)
- [IChartOption](#type-cb5d64868d2d)
- [IChartSpecInfo](#type-618e9dfe06cf)
- [IChartSpecTransformerOption](#type-42469e396d0c)
- [ILineChartSpec](#type-de20dddcc338)
- [ILiquidChartSpec](#type-53e84bdd56cd)
- [IMapChartSpec](#type-2cc8eadf4a78)
- [IPieChartSpec](#type-b89687ec6565)
- [IPolarChartSpec](#type-47227db96ff6)
- [ICircularProgressChartSpec](#type-162adbb6da6d)
- [IProgressChartSpec](#type-c981df1ddf60)
- [ILinearProgressChartSpec](#type-aa5844c337ee)
- [IRadarChartSpec](#type-63b572eee0ca)
- [IRangeAreaChartSpec](#type-3a7b7d9563aa)
- [IRangeColumnChartSpec](#type-da04864ad35f)
- [IRoseChartSpec](#type-92bd0cd597bd)
- [ISankeyChartSpec](#type-f326797c9091)
- [IScatterChartSpec](#type-b4c1e7d7be5c)
- [ISequenceChartSpec](#type-93ef189ce720)
- [ISunburstChartSpec](#type-fa66e1c21317)
- [ITreemapChartSpec](#type-f80911626a1e)
- [IWaterfallChartSpec](#type-8f8a21509020)
- [IWordCloudChartSpec](#type-5e23d784e4af)
- [ICompilableData](#type-bac9ca204677)
- [CompilerListenerParameters](#type-9760c8c7fdef)
- [GrammarItemCompileOption](#type-13afff202962)
- [ICompilable](#type-590d0c32ce42)
- [ICompilableInitOption](#type-f33e72c56cee)
- [ICompiler](#type-cbf1a5d7de9b)
- [IGrammarItem](#type-96b4a08944c0)
- [ITransformSpec](#type-e91ac41860ff)
- [StateValueMap](#type-8cab308b2bc7)
- [GestureConfig](#type-6ae14ac920fd)
- [IOptimizeType](#type-4a85608bd0f1)
- [IRenderOption](#type-0f4236fc8d55)
- [LayoutState](#type-4a8b32cef03c)
- [ICompilableMark](#type-fb1ce8327f06)
- [IMarkCompileOption](#type-4c11a0696204)
- [IMarkConfig](#type-589e28ffc9d8)
- [IMarkStateManager](#type-ee48e6df46c2)
- [IModelMarkAttributeContext](#type-b137387c3a9b)
- [ISeriesMarkAttributeContext](#type-57ff7f1e0f2e)
- [IStateInfo](#type-88e39c561dcb)
- [STATE_CUSTOM](#type-77e45e91e9ef)
- [STATE_HOVER](#type-988d7ec528f6)
- [STATE_HOVER_REVERSE](#type-b2903000e622)
- [STATE_NORMAL](#type-d571794e99de)
- [STATE_VALUE_ENUM](#type-05b8969d76ad)
- [StateValue](#type-0848cecfdc96)
- [StateValueNot](#type-166ca5507a1b)
- [StateValueType](#type-17574edeab90)
- [IAxisHelper](#type-a26561e1568e)
- [AxisType](#type-3271a928e402)
- [IAxis](#type-9cbd2aefe72d)
- [IAxisItem](#type-a4970733eae3)
- [IAxisLocationCfg](#type-a2ddebc5e9d7)
- [IBandAxisLayer](#type-840e25edaed7)
- [ITickCalculationCfg](#type-d35c784ee3a7)
- [ITickCallbackOption](#type-41696b783ff0)
- [StyleCallback](#type-9266636e13da)
- [IBandAxisSpec](#type-63185662c008)
- [ICommonAxisSpec](#type-500cf18886a4)
- [IDomainLine](#type-89c12f9d6546)
- [IGrid](#type-1de217f01390)
- [ILabel](#type-f22047f767c3)
- [ISubTick](#type-8a597b4f0966)
- [ITick](#type-ffc51285024b)
- [ITitle](#type-d18262dc39a4)
- [IPolarAxisHelper](#type-2617700989c6)
- [IPolarGrid](#type-9dc0e97c311d)
- [IPolarAxisCommonSpec](#type-b43b48bb37ff)
- [IPolarAxisLabel](#type-fc89a697d2d9)
- [IPolarBandAxisSpec](#type-3621aa2a35eb)
- [IPolarLinearAxisSpec](#type-1ee0a50d0f01)
- [IComponentSpec](#type-d23c51c12154)
- [ICrosshairSpec](#type-2c1a18c2e6b2)
- [IGeoCoordinateHelper](#type-73cca056070b)
- [IComponent](#type-5d7fe81ad96c)
- [IComponentConstructor](#type-897b853a0458)
- [IComponentOption](#type-3aea69e255fe)
- [ComponentTypeEnum](#type-da1c88fe2ca8)
- [ILabelInfo](#type-c5e997daff79)
- [TransformedLabelSpec](#type-cc4522eb0b63)
- [ContinuousLegendTextStyle](#type-002e36355ca4)
- [ContinuousLegendTextStyleCallback](#type-9281e10d6686)
- [HandlerTextAttribute](#type-a72bb8927b69)
- [IColorLegendSpec](#type-8565dc89d142)
- [IContinuousLegendSpec](#type-178043e98fbb)
- [ISizeLegendSpec](#type-19c6d929a8de)
- [Text](#type-960aad16c272)
- [TextAttribute](#type-2a9351a6ae07)
- [DiscreteLegendArrangeCount](#type-fba860215816)
- [formatterCallback](#type-38a35ad3a73f)
- [IDiscreteLegendArrangeContext](#type-b2a5329df03f)
- [IDiscreteLegendPagerCallbackContext](#type-c58e01a94725)
- [IDiscreteLegendSpec](#type-0db130a1ae74)
- [IItem](#type-57549774cd09)
- [ILegendScrollbar](#type-d1127d0675cd)
- [IPager](#type-f566fb09d5b0)
- [LegendItemStyle](#type-643f46f185c3)
- [LegendItemStyleValue](#type-4f178926a3e4)
- [LegendPagerLayout](#type-a73f71981dd9)
- [LegendPagerPosition](#type-f597fa365630)
- [ILegend](#type-a385f1cab926)
- [ILegendCommonSpec](#type-2ad671a416ad)
- [ITitle](#type-22ab2af9147f)
- [NoVisibleMarkStyle](#type-bf107a034542)
- [IAggrType](#type-952d359c9b51)
- [IDataPointSpec](#type-f2db44670f10)
- [IDataPos](#type-4e110ff2986a)
- [IDataPosCallback](#type-1379fa4fc2bc)
- [IMarkerAttributeContext](#type-2598f79dce37)
- [IMarkerCrossSeriesSpec](#type-88cab1c9cdbd)
- [IMarkerLabelSpec](#type-2d979381ccd7)
- [IMarkerLabelWithoutRefSpec](#type-253fe6ea4b96)
- [IMarkerPositionsSpec](#type-53a3e8a64bc1)
- [IMarkerRef](#type-542373c2f97e)
- [IMarkerState](#type-1839dc4b258a)
- [IMarkerSupportSeries](#type-cee3d7685723)
- [IMarkerSymbol](#type-3acb04a4042d)
- [MarkerPositionPoint](#type-99fde6736e73)
- [MarkerStateCallback](#type-6718d706fea0)
- [MarkerStateValue](#type-c42b3a87f060)
- [MarkerStyleCallback](#type-88db8cbea942)
- [OffsetPoint](#type-7815e4367a31)
- [IMarkAreaAngleRadiusSpec](#type-b2457805e643)
- [IMarkAreaAngleSpec](#type-4eea11d6bf8d)
- [IMarkAreaCoordinateSpec](#type-99ea0813e616)
- [IMarkAreaRadiusSpec](#type-d96016d9da72)
- [IMarkAreaXSpec](#type-ed2c343ef812)
- [IMarkAreaXYSpec](#type-23ed00b3b201)
- [IMarkAreaYSpec](#type-19f94791c9c6)
- [IRegressType](#type-0d292ecf19f3)
- [IMarkAreaLabel](#type-4079709b8a02)
- [IMarkAreaTheme](#type-7880c31abf52)
- [IMarkLineAngleSpec](#type-cbf79085c0de)
- [IMarkLineAngRadRad1Spec](#type-3df3d54de17a)
- [IMarkLineAngRadSpec](#type-1818f2e34d58)
- [IMarkLineCoordinateSpec](#type-25e80ef7b42b)
- [IMarkLineRadAngAng1Spec](#type-604e38ee5301)
- [IMarkLineRadiusSpec](#type-a2d55cb80bac)
- [IMarkLineXSpec](#type-7ce1823090a0)
- [IMarkLineXYSpec](#type-f50693a23ba0)
- [IMarkLineXYY1Spec](#type-72d0df8a5295)
- [IMarkLineYSpec](#type-d5755e40af1e)
- [IMarkLineYXX1Spec](#type-9fa06e53cb0e)
- [IMarkLineLabel](#type-e04a2517c735)
- [IMarkLineTheme](#type-1ca140194889)
- [IMarkPointAngleRadiusSpec](#type-0acfdd5b8e06)
- [IMarkPointCoordinateSpec](#type-8c827e1a43c9)
- [IMarkPointGeoNameSpec](#type-fd30b323288a)
- [IMarkPointPositionsSpec](#type-78d1410fa542)
- [IMarkPointXYSpec](#type-c38f0b023570)
- [IItemContent](#type-8262891f07ed)
- [IItemContentStyle](#type-364c9501578d)
- [IItemLine](#type-8dd1e2b302ff)
- [IMarkPointTheme](#type-a26d3a0701c1)
- [IOffsetCallback](#type-db4f6fc17505)
- [ITitleSpecWithoutText](#type-6d4657ffd0d7)
- [ITooltip](#type-b713b3be426c)
- [TooltipHandlerParams](#type-82517d84c2af)
- [TooltipResult](#type-34c5550c97cd)
- [TooltipEventParams](#type-e5c2cb9ed465)
- [ITooltipHandlerSpec](#type-9ead2353606b)
- [ITooltipTextTheme](#type-6f8c16b9dce7)
- [ChartEvent](#type-4c68f24bfcad)
- [Event_Bubble_Level](#type-c7b3d3b6b38f)
- [Event_Source_Type](#type-e0819375e8e5)
- [HOOK_EVENT](#type-f58080efc74b)
- [DataLinkAxis](#type-803024406435)
- [DataLinkSeries](#type-84a00f86d855)
- [IVChart](#type-f6dc633e5201)
- [IVChartRenderOption](#type-88e49d0ebe2f)
- [VChartRenderActionSource](#type-3bb499134256)
- [StatisticOperations](#type-d92fd69b2371)
- [DimensionEventParams](#type-15e7376683b8)
- [IDimensionData](#type-5b72dbd75644)
- [IDimensionInfo](#type-06b8a10af7b9)
- [BaseEventParams](#type-5ccfcc25894f)
- [ComponentType](#type-30b50e7b9294)
- [EventBubbleLevel](#type-3e4576b7a2a4)
- [EventCallback](#type-bc53e0f9fdb2)
- [EventFilter](#type-b46fb265f1d7)
- [EventHandler](#type-9dde9b52a754)
- [EventParams](#type-d0b5c8774949)
- [EventParamsDefinition](#type-bb8c7f815cf1)
- [EventQuery](#type-61ce50950087)
- [EventSourceType](#type-1c63b5fdb81d)
- [EventTargetType](#type-5c354e2dcaad)
- [EventType](#type-a71637b330ab)
- [ExtendEventParam](#type-577e7fff4950)
- [IComposedEvent](#type-4860a71f1f46)
- [IEvent](#type-17583cb7e08d)
- [IEventDispatcher](#type-e3c12fa8de7f)
- [InteractionEventParam](#type-27175d2429ec)
- [LayoutEventParam](#type-e80f4120aa8f)
- [PanEventParam](#type-fd27c5f76824)
- [SuperEvent](#type-6c02331b393a)
- [ZoomEventParam](#type-e212628531e0)
- [IInteraction](#type-8a888a648496)
- [IBaseTriggerOptions](#type-f51a72b7d484)
- [ITrigger](#type-4cc357381c0a)
- [ITriggerEventHandler](#type-f4836a1e3d12)
- [ElementSpec](#type-6b92034e666e)
- [IBaseLayoutSpec](#type-5de1760225a6)
- [IGridLayoutSpec](#type-8c0cc65dc7ab)
- [ILayoutItem](#type-a23ec9ff5239)
- [ILayoutItemSpec](#type-31e5f8b69a13)
- [ILayoutSpecBase](#type-a40f94687b59)
- [LayoutCallBack](#type-0bf7cec9094c)
- [AnimationStateValues](#type-0460768bb02c)
- [DiffStateValues](#type-1352ed6c1d81)
- [IAttrConfig](#type-597b323ab9ea)
- [IAttrs](#type-26f957d91e5c)
- [IDataSamping](#type-e33013d66ce5)
- [IGraphicContext](#type-ff3da46fbc1c)
- [IMark](#type-50aedeb586cf)
- [IMarkGraphic](#type-6b98396ffcb3)
- [IMarkOverlap](#type-bed88451c0c6)
- [IMarkProgressiveConfig](#type-059a3e6127d2)
- [IMarkRaw](#type-8245181df7c4)
- [IMarkStateStyle](#type-103f402e7251)
- [IMarkStyle](#type-574e4d23d491)
- [ISamplingMethod](#type-0ce27198f72d)
- [MarkInputStyle](#type-b04af6888dbd)
- [StyleConvert](#type-f616fecb91f8)
- [VisualScaleType](#type-a7e81495b9fc)
- [IComponentMark](#type-642b39fa286c)
- [IGroupMark](#type-8815337da68f)
- [ILabelMark](#type-e9520a36483b)
- [ISymbolMark](#type-dd0f2569fc22)
- [ITextMark](#type-fef57d2925f9)
- [MarkType](#type-15c62fdeb46b)
- [MarkTypeEnum](#type-f61b3242139b)
- [IBaseModelSpecTransformer](#type-d0389b7c19ac)
- [IBaseModelSpecTransformerOption](#type-a06278aae67d)
- [IBaseModelSpecTransformerResult](#type-9be6c667e373)
- [IEffect](#type-2ef752cff22f)
- [ILayoutModel](#type-b788a1bf7960)
- [IModel](#type-2854a5da67ea)
- [IModelConstructor](#type-b2886ff503c6)
- [IModelEvaluateOption](#type-680368166ca8)
- [IModelInitOption](#type-d5cf5deb27b7)
- [IModelMarkInfo](#type-c6d245a05c0a)
- [IModelOption](#type-f2d5e89f0268)
- [IModelSpec](#type-93f598dd1ef8)
- [IModelSpecInfo](#type-854f78cb6f0a)
- [ITooltipHelper](#type-47faea1d542e)
- [IUpdateSpecEffects](#type-ebdfb7b1febc)
- [IUpdateSpecResult](#type-646a207a21dd)
- [IRegion](#type-a83d28f54f24)
- [IRegionConstructor](#type-4ab33fce2070)
- [IRegionSpec](#type-de53416bbb15)
- [IRegionSpecInfo](#type-dacf9d61a878)
- [ISeriesFilter](#type-547a568e3f15)
- [IGlobalScale](#type-86e42efb33dd)
- [AreaAppearPreset](#type-1632d0cf5560)
- [AreaMarks](#type-6b16760e15b0)
- [IAreaSeriesSpec](#type-3c1aa405c767)
- [BarAppearPreset](#type-2a04d7b5d5bc)
- [BarMarks](#type-d2964854c2a3)
- [IBarBackgroundSpec](#type-659e249e0870)
- [IBarSeriesSpec](#type-e01baddbd8aa)
- [IBoxPlotSeriesSpec](#type-4f696616234f)
- [ICartesianSeriesSpec](#type-3814e1f2a8e7)
- [CirclePackingAppearPreset](#type-b9b1dad57548)
- [CirclePackingMark](#type-c5aa6f08af16)
- [ICirclePackingSeriesSpec](#type-bbcfdbd7ab2b)
- [CorrelationAppearPreset](#type-9e370720e4c3)
- [CorrelationMarks](#type-bdf6cade9a59)
- [ICorrelationSeriesSpec](#type-129af10992bf)
- [IDotSeriesSpec](#type-447586c1422f)
- [ISequenceGrid](#type-06ef4b91a65c)
- [ISequenceLabel](#type-a2f61a3aee80)
- [FunnelAppearPreset](#type-ca0d8e9e8ab0)
- [FunnelMarks](#type-c0065cc5144e)
- [IFunnelSeriesSpec](#type-0291e38eb55c)
- [GaugeMarks](#type-258bf98aa33b)
- [GaugePointerMarks](#type-1acef37a74c3)
- [IGaugeLabelSpec](#type-a11bb56c1a44)
- [IGaugePointerSeriesSpec](#type-9fdd71c680f3)
- [IGaugeSeriesSpec](#type-dfd9dde34e4c)
- [PinMarkSpec](#type-d46655d2cdbe)
- [PointerMarkSpec](#type-f4b734667103)
- [HeatmapAppearPreset](#type-a73edb9100ac)
- [HeatmapMarks](#type-5bfb84e5033a)
- [IHeatmapSeriesSpec](#type-6600af61a1ec)
- [ISeriesConstructor](#type-4d9d86b6e907)
- [ISeriesMarkInfo](#type-2d3d647d41bf)
- [ISeriesOption](#type-12b6b1d47870)
- [ISeriesSeriesInfo](#type-4d7144f1b638)
- [ISeriesSpecInfo](#type-94e8317ff02e)
- [ISeriesSpecTransformerResult](#type-bcafdba3ac92)
- [ISeriesStackData](#type-7770159e04bb)
- [ISeriesStackDataLeaf](#type-17aca4fa17c9)
- [ISeriesStackDataMeta](#type-9aad3a641385)
- [ISeriesStackDataNode](#type-234297d4a62a)
- [SeriesMarkMap](#type-90c30713a8c3)
- [ICartesianSeries](#type-80c7ff644ee5)
- [IGeoSeries](#type-7f5ce0113c45)
- [IPolarSeries](#type-6c82e34ce6af)
- [ISeries](#type-29ca9e871dc0)
- [SeriesTypeForThemeEnum](#type-5683fd6b700a)
- [ISeriesTooltipHelper](#type-bdf90758165d)
- [SeriesMarkNameEnum](#type-df86033a747f)
- [boxPlot](#type-3b9e5d5f1ab0)
- [progress](#type-a5db06e8dac0)
- [track](#type-3720a45bf7f9)
- [word](#type-dcab00960f46)
- [SeriesType](#type-43422e48d197)
- [SeriesTypeEnum](#type-11db701f3ba0)
- [ILineSeriesSpec](#type-c14fbe0b660f)
- [LineAppearPreset](#type-6966f849b7c7)
- [LineMarks](#type-da75180b071f)
- [ILinkSeriesSpec](#type-66b30ce0b9f7)
- [ILinkSeriesSpecFromDot](#type-28f198e9a466)
- [LinkType](#type-875756389aa2)
- [ILiquidPadding](#type-bef15b2fe03b)
- [ILiquidPaddingSpec](#type-a2cf44bad013)
- [ILiquidSeriesSpec](#type-fbf087ad5565)
- [LiquidAppearPreset](#type-e2f6a6a53711)
- [LiquidMarks](#type-3527d2d11421)
- [LiquidShapeType](#type-02af83268c9f)
- [IMapSeriesSpec](#type-f28afaaaf021)
- [LineMarks](#type-7872a83a9a39)
- [IMosaicSeriesSpec](#type-1b11da6c8615)
- [IPieSeriesSpec](#type-71acefc8c120)
- [PieAppearPreset](#type-c560860d2a3d)
- [PieMarks](#type-b04753817bef)
- [IPolarSeriesSpec](#type-1ed415b7c25f)
- [IProgressLikeSeriesSpec](#type-d7ad84462ce9)
- [ITickMaskSpec](#type-ab1fc6a002d4)
- [ProgressLikeAppearPreset](#type-eb112c7e9a22)
- [IRoseLikeSeriesSpec](#type-9e858d8f5809)
- [CircularProgressMarks](#type-26e9a8fad3db)
- [ICircularProgressSeriesSpec](#type-30261f5b0d11)
- [IProgressSeriesSpec](#type-ea6a754e3de0)
- [ILinearProgressSeriesSpec](#type-a272f43e66ef)
- [LinearProgressAppearPreset](#type-1cff2ef63939)
- [IRadarSeriesSpec](#type-702f2f2e90b8)
- [RadarAppearPreset](#type-3ec398b9ec94)
- [RadarMarks](#type-44fb5d824dc0)
- [IRangeAreaSeriesSpec](#type-777c15c57cb1)
- [IRangeColumnSeriesSpec](#type-71611a6326b0)
- [minMaxPositionEnum](#type-e105bd77edce)
- [PositionEnum](#type-febd1be01553)
- [RangeColumnAppearPreset](#type-df0bef8e8bc4)
- [RangeColumnMarks](#type-d32ba1b05901)
- [IRoseSeriesSpec](#type-50a9d844112a)
- [RoseAppearPreset](#type-c671df1145cb)
- [RoseMarks](#type-a5a601985dc4)
- [ISankeySeriesSpec](#type-73ad288a6b3a)
- [SankeyAppearPreset](#type-6997583ca0c0)
- [SankeyLinkDatum](#type-5517b5c19b32)
- [SankeyLinkElement](#type-e49f605dc3e0)
- [SankeyMark](#type-2f12a706e2ad)
- [SankeyNodeDatum](#type-0e7c9dea40ba)
- [SankeyNodeElement](#type-1474c7d432e5)
- [IScatterSeriesSpec](#type-08a7bd218e9e)
- [ScatterAppearPreset](#type-76d1da4aa75e)
- [ScatterMarks](#type-fd1929cd17c5)
- [SunburstAppearPreset](#type-9821e1ad4f86)
- [SunburstMark](#type-97edc6635996)
- [ISunburstSeriesSpec](#type-42998a239bf0)
- [LabelAutoVisibleType](#type-e60547cde037)
- [ITreemapSeriesSpec](#type-6cdfbc0c0174)
- [TreemapAppearPreset](#type-24b5502879db)
- [TreemapMark](#type-a996892adf6f)
- [IVennSeriesSpec](#type-3b900b97c368)
- [VennAppearPreset](#type-1a92a41b84da)
- [VennMark](#type-d1fec4347076)
- [IWaterfallSeriesSpec](#type-312af991e7a8)
- [IWaterfallStackLabelPosition](#type-000580d95d76)
- [IWaterfallStackLabelValueType](#type-bc167196a113)
- [WaterfallAppearPreset](#type-8850f720f897)
- [WaterfallMarks](#type-bb1d273d83e6)
- [IWordCloudSeriesBaseSpec](#type-545e0cd34c67)
- [IWordCloudSeriesSpec](#type-472dc2c97d50)
- [WordcloudAppearPreset](#type-230d77f59707)
- [ColorScheme](#type-56ac75a33cd8)
- [ColorSchemeItem](#type-3b07bb001775)
- [DataSchemeItem](#type-14c76aab7e3f)
- [IColorKey](#type-a3c3eb9876a9)
- [IColorSchemeStruct](#type-aaa1ea372a28)
- [IProgressiveDataSchemeCase](#type-305e40988a2a)
- [IsProgressiveDataSchemeAvailableCallback](#type-759e0317b6ff)
- [IThemeColorScheme](#type-45344180023e)
- [ProgressiveDataScheme](#type-d334d5b74366)
- [ITokenKey](#type-cbbd743bf503)
- [Datum](#type-bf5eb9a79e61)
- [Maybe](#type-644c0bc1509c)
- [MaybeArray](#type-915c1abd7543)
- [StringOrNumber](#type-2f92a26f4727)
- [CoordinateType](#type-f14ee29f7b8b)
- [IPoint](#type-58fdfd9a6a7b)
- [IPolarPoint](#type-d403c828183d)
- [Cursor](#type-05ee2579711f)
- [IInvalidType](#type-5ea94ba3721c)
- [IGroup](#type-7066ab370b9d)
- [ILayoutNumber](#type-9638d3997297)
- [ILayoutOrientPadding](#type-b2bc0ee5203d)
- [ILayoutPoint](#type-6dd6ef1acef0)
- [ILayoutRect](#type-b4324e55ab6b)
- [ILayoutType](#type-7ececfbaa390)
- [IPercentOffset](#type-d014dbe57510)
- [IRegionQuerier](#type-a826f89dd07b)
- [IShowTooltipOption](#type-b4df769a6b46)
- [Direction](#type-0eaca977a05a)
- [DirectionType](#type-244d188586b9)
- [IOrientType](#type-1c1f18d62ff6)
- [IPolarOrientType](#type-ccede16adcb5)
- [IRect](#type-51a55b549762)
- [ChartSpecMap](#type-61e059a17d79)
- [ISpec](#type-c3727b86f632)
- [BuildInTransformOptions](#type-0ad7a402bbdf)
- [CommonParseOptions](#type-fdac4230815f)
- [DataKeyType](#type-4bea0f6c4d4f)
- [EnableMarkType](#type-1fa7d0f6abc4)
- [IBuildinMarkSpec](#type-1de36c1cfcb0)
- [IChartExtendsSeriesSpec](#type-0d38580aaf51)
- [IChartSpec](#type-57e06d38bf09)
- [IDataType](#type-3bf45e5ed347)
- [IDataValues](#type-218b08963b1d)
- [IFieldsMeta](#type-ad6958bb1a0b)
- [IFormatMethod](#type-6375b3333257)
- [IMarkStateFilter](#type-493dcf0721cf)
- [IMarkStateSpec](#type-4d46c5681360)
- [IPerformanceHook](#type-095e16af33ef)
- [IRichTextFormatMethod](#type-3b28c6257cf4)
- [ITextFormatMethod](#type-5a8994f84d7b)
- [RenderMode](#type-875ef0d8fcf4)
- [RenderModeEnum](#type-240f8a4ed23c)
- [SheetParseOptions](#type-dbdce91761d0)
- [TooltipContentCallback](#type-bb854deb9020)
- [TooltipUpdateCallback](#type-58900beb05b3)
- [ITooltipHandler](#type-73b5fb837aea)
- [TooltipActiveType](#type-990c112f10af)
- [TooltipData](#type-2020c8fc6cbe)
- [ITooltipLabelActual](#type-c308b976acfb)
- [ITooltipLineActual](#type-50e4fd39a41a)
- [ITooltipPositionActual](#type-b07cdb853d88)
- [ITooltipShapeActual](#type-641241d7a7b9)
- [ITooltipActual](#type-b6803f56a729)
- [BackgroundMode](#type-335140a3e2b6)
- [BackgroundPosition](#type-79f8ce85abb1)
- [BackgroundPositionHorizontalKeyword](#type-31dac926518d)
- [BackgroundPositionKeyword](#type-d7d952da248e)
- [BackgroundPositionPercent](#type-81363cd19fe5)
- [BackgroundPositionPreset](#type-9b6ac71cd590)
- [BackgroundPositionValue](#type-da20797f386c)
- [BackgroundPositionVerticalKeyword](#type-1c3d2aa1fdc1)
- [BackgroundRepeatMode](#type-6fb8f4404334)
- [BackgroundSizingShorthand](#type-f5dcfb5b7d65)
- [ConvertToMarkStyleSpec](#type-3f4d44a2bad5)
- [GradientPropValue](#type-b9b2288b01f6)
- [GradientStop](#type-105bc3b38706)
- [IBorder](#type-c857646a1dda)
- [ICommonSpec](#type-642c420237a7)
- [IComposedTextMarkSpec](#type-3cdc9715d892)
- [IFillMarkSpec](#type-36e76424276b)
- [IGradient](#type-4cdfc5286411)
- [IGradientConical](#type-6564c798928d)
- [IGradientLinear](#type-a9d5ddd8d42f)
- [IGradientRadial](#type-7c5f562e4fc5)
- [IMarkHtmlSpec](#type-d9ef36a1c319)
- [IPositionedTextMarkSpec](#type-62ea327d0fc7)
- [IRichTextMarkSpec](#type-19e9483035ff)
- [IVisual](#type-9bb9b1b41b53)
- [IVisualScale](#type-d2a6fed8edde)
- [IVisualSpecStyle](#type-ae2e55448a0a)
- [TextAlign](#type-6b2c76bfb154)
- [TextBaseLine](#type-94a26edb6027)
- [TextureType](#type-7dd7d41922bc)
- [ValueType](#type-979efd9d6b47)
- [VisualType](#type-e295ec9bce6b)

<a id="type-8d2b64638b97"></a>
## DataSet

来源：`@visactor/vdataset/es/data-set.d.ts`，@visactor/vdataset@1.0.27

```typescript
export declare class DataSet {
    options?: IDataSetOptions;
    isDataSet: boolean;
    /**
     * 已注册的 Transform（key-value 对）
     */
    transformMap: Record<string, any>;
    /**
     * 已注册的 Parser(key-value 对）
     */
    parserMap: Record<string, any>;
    /**
     * 所有挂在数据集上的数据视图（key-value 对）
     */
    dataViewMap: Record<string | number, DataView>;
    name: string;
    /**
     * 消息的监听与触发
     */
    target: any;
    /**
     * 多 DataView消息监听工具
     */
    _callMap: Map<Function, (...args: any[]) => void>;
    protected _logger: ILogger;
    constructor(options?: IDataSetOptions);
    setLogger(logger: Logger): void;
    /**
     * 根据name 获取 dataView
     * @param name - name
     */
    getDataView(name: string | number): DataView;
    /**
     * 设置 dataView
     * @param name - 名称
     * @param dataView - data dataView
     */
    setDataView(name: string | number, dataView: DataView): void;
    /**
     * 移除 dataview
     * @param name
     */
    removeDataView(name: string | number): void;
    /**
     * 注册一个数据解析器
     * @param name - 类型
     * @param parser - 解析逻辑
     */
    registerParser(name: string, parser: Parser): void;
    /**
     * 移除 parser
     * @param name
     */
    removeParser(name: string): void;
    /**
     * 根据名称获取数据解析器
     * @param name
     * @returns
     */
    getParser(name: string): Parser;
    /**
     * 注册一个数据处理函数
     * @param name
     * @param transform
     */
    registerTransform(name: string, transform: Transform): void;
    /**
     * 移除 transform
     * @param name
     */
    removeTransform(name: string): void;
    /**
     * 根据名称获取数据处理函数
     * @param name
     * @returns
     */
    getTransform(name?: string): Transform;
    multipleDataViewAddListener(list: DataView[], event: string, call: Function): void;
    allDataViewAddListener(event: string, call: () => void): void;
    multipleDataViewRemoveListener(list: DataView[], event: string, call: Function): void;
    multipleDataViewUpdateInParse(newData: {
        name: string;
        data: any;
        options?: IParserOptions;
    }[]): void;
    multipleDataViewUpdateInRawData(newData: {
        name: string;
        data: any;
        options?: IParserOptions;
    }[]): void;
    destroy(): void;
}
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-b26ccd36d8e8"></a>
## DataView

来源：`@visactor/vdataset/es/data-view.d.ts`，@visactor/vdataset@1.0.27

```typescript
export declare class DataView {
    dataSet: DataSet;
    options?: IDataViewOptions;
    isDataView: boolean;
    type: DATAVIEW_TYPE;
    name: string | number;
    target: any;
    /**
     * 当前parser
     */
    parseOption: IParserOptions;
    /**
     * 已应用的 transform
     */
    transformsArr: Array<ITransformOptions>;
    /**
     * 是否正在运行 parse 和 transform
     */
    isRunning: boolean;
    /**
     * 原始数据
     */
    rawData: any;
    history: boolean;
    /**
     * 中间态数据，默认 history false 不存储
     */
    historyData: any[];
    /**
     * parser后的数据
     */
    parserData: any;
    /**
     * 最终数据
     */
    latestData: any;
    /**
     * 数据维度信息
     */
    protected _fields: IFields;
    latestDataAUD: {
        add: any;
        update: any;
        del: any;
    };
    constructor(dataSet: DataSet, options?: IDataViewOptions);
    /**
     * 解析数据
     * todo: parse instanceof DataView
     * todo: parse ['dataview1', 'dataview2']
     * @param data
     * @param options
     * @returns
     */
    parse(data: any, options?: IParserOptions, emit?: boolean): DataView;
    /**
     *  执行数据处理数据
     * @param options
     */
    transform(options: ITransformOptions, execute?: boolean): DataView;
    sortTransform(): void;
    private executeTransform;
    private resetTransformData;
    reRunAllTransform: (opt?: DataViewTransformOptions) => this;
    private cloneParseData;
    parseNewData(data: any, options?: IParserOptions): void;
    updateRawData(data: any, options?: IParserOptions): void;
    markRunning: () => void;
    getFields(): any;
    setFields(f: IFields, foreMerge?: boolean): void;
    destroy(): void;
}
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-a39097639f44"></a>
## IDsvParserOptions

来源：`@visactor/vdataset/es/parser/dsv.d.ts`，@visactor/vdataset@1.0.27

```typescript
export interface IDsvParserOptions {
    delimiter?: string;
}
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-63f1dbc535e0"></a>
## IParserOptions

来源：`@visactor/vdataset/es/parser/index.d.ts`，@visactor/vdataset@1.0.27

```typescript
export interface IParserOptions {
    type: ParserName;
    clone?: boolean;
    options?: any;
    layerType?: string;
}
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-26812fc33a0c"></a>
## IFieldsOptions

来源：`@visactor/vdataset/es/transform/fields.d.ts`，@visactor/vdataset@1.0.27

```typescript
export interface IFieldsOptions {
    fields: IFields;
}
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-aceaf7172c44"></a>
## IFilterOptions

来源：`@visactor/vdataset/es/transform/filter.d.ts`，@visactor/vdataset@1.0.27

```typescript
export interface IFilterOptions {
    callback?: (item: any) => boolean;
}
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-46fd81c95ea2"></a>
## IFoldOptions

来源：`@visactor/vdataset/es/transform/fold.d.ts`，@visactor/vdataset@1.0.27

```typescript
export interface IFoldOptions {
    fields: string[];
    key: string;
    value: string;
    retains?: string[];
}
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-a4c7726cf624"></a>
## ISimplifyOptions

来源：`@visactor/vdataset/es/transform/geo/simplify.d.ts`，@visactor/vdataset@1.0.27

```typescript
export interface ISimplifyOptions {
    tolerance?: number;
}
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-f4b40ca0e8cc"></a>
## ITransformOptions

来源：`@visactor/vdataset/es/transform/index.d.ts`，@visactor/vdataset@1.0.27

```typescript
export interface ITransformOptions {
    type: TransformName;
    options?: any;
    level?: number;
}
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-5125620c5489"></a>
## TreemapOptions

来源：`@visactor/vlayouts/es/treemap/interface.d.ts`，@visactor/vlayouts@1.0.27

```typescript
export interface TreemapOptions {
    /**
     * The gap width between two nodes which has the same depth, two kinds of value are supported
     * 1. number: set the gapWidth for nodes of every depth
     * 2. number[]: number[i] means the gapWidth for node which depth = i;
     */
    gapWidth?: number | number[];
    /**
     * The padding width, two kinds of value are supported
     * 1. number: set the padding for nodes of every depth
     * 2. number[]: number[i] means the padding for node which depth = i;
     */
    padding?: number | number[];
    /**
     * the width / height ratio
     */
    aspectRatio?: number;
    /**
     * The padding for non-leaf node, we can use this space to display a label
     * This pading will only works when the node has enough space
     */
    labelPadding?: number | number[];
    /**
     * The position of label for non-leaf node
     */
    labelPosition?: 'top' | 'bottom' | 'left' | 'right';
    /**
     * the type of algorithm
     */
    splitType?: 'binary' | 'dice' | 'slice' | 'sliceDice' | 'squarify';
    /** parse the key of node */
    nodeKey?: string | number | ((datum: TreemapDatum) => string | number);
    /**
     *  the max depth to be showed, when the node has depth > maxDepth, the node won't be calculated
     */
    maxDepth?: number;
    /**
     * when the area (this unit is px * px) of the node is smaller then this value, this node will be hide
     */
    minVisibleArea?: number | number[];
    /**
     * when the area (this unit is px * px) of the node is smaller then this value, this children of this node will be hide
     */
    minChildrenVisibleArea?: number | number[];
    /**
     * when the width or height of the node is smaller then this value, this node will be hide
     */
    minChildrenVisibleSize?: number | number[];
    /**
     * specify treemap node value field, defaults to `value`
     */
    valueField?: string;
}
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-f85debfe2020"></a>
## ACustomAnimate

来源：`@visactor/vrender-animate/es/custom/custom-animate.d.ts`，@visactor/vrender-animate@1.1.11

```typescript
export declare abstract class ACustomAnimate<T> extends Step implements ICustomAnimate {
    type: IAnimateStepType;
    customFrom: T;
    params?: any;
    props?: T;
    from?: T;
    to?: T;
    constructor(customFrom: T, customTo: T, duration: number, easing: EasingType, params?: any);
    update(end: boolean, ratio: number, out: Record<string, any>): void;
    protected setProps(props: T): void;
}
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-c0172addd0a4"></a>
## AStageAnimate

来源：`@visactor/vrender-animate/es/custom/custom-animate.d.ts`，@visactor/vrender-animate@1.1.11

```typescript
export declare abstract class AStageAnimate<T> extends ACustomAnimate<T> {
    willCallBeforeStageRender: boolean;
    willCallAfterStageRender: boolean;
    checkStatusAfterRender: boolean;
    constructor(customFrom: T, customTo: T, duration: number, easing: EasingType, params?: any);
    protected beforeStageRender(stage: IStage, canvas: HTMLCanvasElement): HTMLCanvasElement | void | null | false;
    protected afterStageRender(stage: IStage, canvas: HTMLCanvasElement): HTMLCanvasElement | void | null | false;
    onFirstRun(): void;
    stop(): void;
    onUpdate(end: boolean, ratio: number, out: Record<string, any>): void;
    protected _beforeStageRender: () => void;
    protected _afterStageRender: () => void;
    protected renderToStage(stage: IStage, canvas: HTMLCanvasElement): HTMLCanvasElement | void | null | false;
}
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-7666dd9220f0"></a>
## AxisItem

来源：`@visactor/vrender-components/es/axis/type.d.ts`，@visactor/vrender-components@1.1.11

```typescript
export type AxisItem = {
    id?: string | number;
    label: string | number;
    value: number;
    rawValue: any;
    [key: string]: any;
};
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-80c23221deb4"></a>
## AxisItemStateStyle

来源：`@visactor/vrender-components/es/axis/type.d.ts`，@visactor/vrender-components@1.1.11

```typescript
export type AxisItemStateStyle<T> = {
    hover?: T;
    hover_reverse?: T;
    selected?: T;
    selected_reverse?: T;
};
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-92b85bf48fbb"></a>
## AxisLabelOverlap

来源：`@visactor/vrender-components/es/axis/type.d.ts`，@visactor/vrender-components@1.1.11

```typescript
export interface AxisLabelOverlap {
    autoRotate?: boolean;
    autoRotateAngle?: number[];
    autoHide?: boolean;
    autoHideMethod?: 'parity' | 'greedy' | CustomMethod;
    autoHideSeparation?: number;
    autoLimit?: boolean;
    limitEllipsis?: string;
    overflowLimitLength?: number | {
        left?: number;
        right?: number;
    };
    layoutFunc?: (labels: IText[], labelData: AxisItem[], layer: number, axis: IGroup) => void;
    autoWrap?: boolean;
}
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-2535a2dd9530"></a>
## Functional

来源：`@visactor/vrender-components/es/label/type.d.ts`，@visactor/vrender-components@1.1.11

```typescript
export type Functional<T> = T | ((data: any) => T);
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-8f8c60190b3e"></a>
## DiscreteLegendAttrs

来源：`@visactor/vrender-components/es/legend/discrete/type.d.ts`，@visactor/vrender-components@1.1.11

```typescript
export type DiscreteLegendAttrs = {
    select?: boolean | {
        trigger?: GraphicEventType;
    };
    hover?: boolean | {
        trigger?: GraphicEventType;
        triggerOff?: GraphicEventType;
    };
    items: LegendItemDatum[];
    defaultSelected?: (string | number)[];
    selectMode?: 'single' | 'multiple' | 'focus';
    allowAllCanceled?: boolean;
    reversed?: boolean;
    item?: LegendItem;
    maxWidth?: number;
    maxHeight?: number;
    maxRow?: number;
    maxCol?: number;
    lazyload?: boolean;
    autoPage?: boolean;
    pager?: LegendPagerAttributes | LegendScrollbarAttributes;
} & LegendBaseAttributes;
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-1b703f3ae381"></a>
## LegendItem

来源：`@visactor/vrender-components/es/legend/discrete/type.d.ts`，@visactor/vrender-components@1.1.11

```typescript
export type LegendItem = {
    visible?: boolean;
    spaceCol?: number;
    spaceRow?: number;
    maxWidth?: number;
    width?: number;
    height?: number;
    padding?: Padding;
    background?: {
        visible?: boolean;
    } & BaseGraphicAttributes<Partial<IGroupGraphicAttribute> | StyleCallback<Partial<IGroupGraphicAttribute>>>;
    shape?: {
        visible?: boolean;
        space?: number;
    } & BaseGraphicAttributes<Partial<ISymbolGraphicAttribute> | StyleCallback<Partial<ISymbolGraphicAttribute>>>;
    autoEllipsisStrategy?: 'labelFirst' | 'valueFirst' | 'none';
    label?: {
        widthRatio?: number;
        space?: number;
        formatMethod?: formatterCallback;
    } & BaseGraphicAttributes<Partial<ITextGraphicAttribute> | StyleCallback<Partial<ITextGraphicAttribute>>>;
    value?: {
        widthRatio?: number;
        space?: number;
        alignRight?: boolean;
        formatMethod?: formatterCallback;
    } & BaseGraphicAttributes<Partial<ITextGraphicAttribute> | StyleCallback<Partial<ITextGraphicAttribute>>>;
    focus?: boolean;
    focusIconStyle?: Partial<ISymbolGraphicAttribute>;
    align?: 'left' | 'right';
    verticalAlign?: 'top' | 'middle' | 'bottom';
};
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-75bc5c7a36bf"></a>
## LegendItemDatum

来源：`@visactor/vrender-components/es/legend/discrete/type.d.ts`，@visactor/vrender-components@1.1.11

```typescript
export type LegendItemDatum = {
    id?: string;
    label: string;
    value?: string | number;
    shape: {
        symbolType?: string;
        fill?: string;
        stroke?: string;
    };
    [key: string]: any;
};
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-833ac1fb317b"></a>
## LegendPagerAttributes

来源：`@visactor/vrender-components/es/legend/discrete/type.d.ts`，@visactor/vrender-components@1.1.11

```typescript
export type LegendPagerAttributes = Omit<PagerAttributes, 'total'> & LegendSwitchComponentAttributes & {
    position?: 'start' | 'middle' | 'end';
    hugContent?: boolean;
};
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-8dec8f9540ef"></a>
## LegendScrollbarAttributes

来源：`@visactor/vrender-components/es/legend/discrete/type.d.ts`，@visactor/vrender-components@1.1.11

```typescript
export type LegendScrollbarAttributes = Omit<ScrollBarAttributes, 'range' | 'limitRange'> & LegendSwitchComponentAttributes & {
    type: 'scrollbar';
    scrollByPosition?: boolean;
    roamScroll?: boolean;
    visible?: boolean;
    scrollMask?: {
        visible?: boolean;
        gradientLength?: number;
        gradientStops: ILinearGradient['stops'];
    };
};
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-c8f27ac5183b"></a>
## LegendTitle

来源：`@visactor/vrender-components/es/legend/type.d.ts`，@visactor/vrender-components@1.1.11

```typescript
export type LegendTitle = {
    visible?: boolean;
    align?: 'start' | 'center' | 'end';
    space?: number;
    padding?: Padding;
    text?: string | string[] | number | number[] | TextContent['text'];
    textStyle?: Partial<ITextGraphicAttribute>;
    shape?: {
        visible?: boolean;
        space?: number;
        style?: Omit<Partial<ISymbolGraphicAttribute>, 'visible'>;
    };
    background?: {
        visible?: boolean;
        style?: Omit<Partial<IRectGraphicAttribute>, 'visible' | 'width' | 'height'>;
    };
    minWidth?: number;
    maxWidth?: number;
};
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-c807eb5fd121"></a>
## BaseMarkerAnimation

来源：`@visactor/vrender-components/es/marker/type.d.ts`，@visactor/vrender-components@1.1.11

```typescript
export type BaseMarkerAnimation<T> = {
    animation?: MarkerAnimation<T> | boolean;
    animationEnter?: MarkerUpdateAnimation<T>;
    animationUpdate?: MarkerUpdateAnimation<T>;
    animationExit?: MarkerExitAnimation;
};
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-a1709a28c988"></a>
## IMarkAreaLabelPosition

来源：`@visactor/vrender-components/es/marker/type.d.ts`，@visactor/vrender-components@1.1.11

```typescript
export declare enum IMarkAreaLabelPosition {
    left = "left",
    right = "right",
    top = "top",
    bottom = "bottom",
    topLeft = "topLeft",
    topRight = "topRight",
    bottomLeft = "bottomLeft",
    bottomRight = "bottomRight",
    middle = "middle",
    insideLeft = "insideLeft",
    insideRight = "insideRight",
    insideTop = "insideTop",
    insideBottom = "insideBottom",
    insideTopLeft = "insideTopLeft",
    insideTopRight = "insideTopRight",
    insideBottomLeft = "insideBottomLeft",
    insideBottomRight = "insideBottomRight"
}
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-9a828f1ac3c0"></a>
## IMarkCommonArcLabelPosition

来源：`@visactor/vrender-components/es/marker/type.d.ts`，@visactor/vrender-components@1.1.11

```typescript
export declare enum IMarkCommonArcLabelPosition {
    arcInnerStart = "arcInnerStart",
    arcInnerEnd = "arcInnerEnd",
    arcInnerMiddle = "arcInnerMiddle",
    arcOuterStart = "arcOuterStart",
    arcOuterEnd = "arcOuterEnd",
    arcOuterMiddle = "arcOuterMiddle",
    center = "center"
}
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-5be4f671bfe4"></a>
## IMarkLineLabelPosition

来源：`@visactor/vrender-components/es/marker/type.d.ts`，@visactor/vrender-components@1.1.11

```typescript
export declare enum IMarkLineLabelPosition {
    start = "start",
    startTop = "startTop",
    startBottom = "startBottom",
    insideStart = "insideStart",
    insideStartTop = "insideStartTop",
    insideStartBottom = "insideStartBottom",
    middle = "middle",
    insideMiddleTop = "insideMiddleTop",
    insideMiddleBottom = "insideMiddleBottom",
    end = "end",
    endTop = "endTop",
    endBottom = "endBottom",
    insideEnd = "insideEnd",
    insideEndTop = "insideEndTop",
    insideEndBottom = "insideEndBottom"
}
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-39230de2ade7"></a>
## IMarkPointItemPosition

来源：`@visactor/vrender-components/es/marker/type.d.ts`，@visactor/vrender-components@1.1.11

```typescript
export declare enum IMarkPointItemPosition {
    top = "top",
    bottom = "bottom",
    middle = "middle",
    insideTop = "insideTop",
    insideBottom = "insideBottom",
    insideMiddle = "insideMiddle"
}
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-681f4999f1eb"></a>
## MarkCommonLineAnimationType

来源：`@visactor/vrender-components/es/marker/type.d.ts`，@visactor/vrender-components@1.1.11

```typescript
export type MarkCommonLineAnimationType = 'clipIn' | 'fadeIn';
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-d28c136a90bb"></a>
## MarkPointAnimationType

来源：`@visactor/vrender-components/es/marker/type.d.ts`，@visactor/vrender-components@1.1.11

```typescript
export type MarkPointAnimationType = 'callIn' | 'fadeIn';
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-8cb45fc9b0d9"></a>
## Datum

来源：`@visactor/vrender-components/es/player/type/base.d.ts`，@visactor/vrender-components@1.1.11

```typescript
export type Datum = any;
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-589dee7f19a8"></a>
## HandlerTextStyleContext

来源：`@visactor/vrender-components/es/slider/type.d.ts`，@visactor/vrender-components@1.1.11

```typescript
export type HandlerTextStyleContext = {
    layout?: SliderLayout;
    align?: SliderAlign;
    railWidth: number;
    railHeight: number;
    handlerSize?: number;
    slidable?: boolean;
};
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-5c34c2234a2c"></a>
## IContainerSize

来源：`@visactor/vrender-components/es/tooltip/type.d.ts`，@visactor/vrender-components@1.1.11

```typescript
export interface IContainerSize {
    width?: number;
    height?: number;
}
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-3b54c645e6d7"></a>
## TooltipRichTextAttrs

来源：`@visactor/vrender-components/es/tooltip/type.d.ts`，@visactor/vrender-components@1.1.11

```typescript
export type TooltipRichTextAttrs = {
    type?: string;
    text?: IRichTextCharacter[] | string;
};
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-d176b9e09694"></a>
## IApp

来源：`@visactor/vrender-core/es/entries/types.d.ts`，@visactor/vrender-core@1.1.11

```typescript
export interface IApp {
    readonly context: IAppContext;
    readonly registry: IAppContext['registry'];
    readonly factory: IAppContext['factory'];
    readonly released: boolean;
    installPlugin: (plugin: IPlugin) => void;
    installPlugins: (plugins: IPlugin[]) => void;
    uninstallPlugin: (name: string) => void;
    createStage: (params?: Partial<IStageParams>) => IStage;
    release: () => void;
}
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-6efe56d777d1"></a>
## EasingType

来源：`@visactor/vrender-core/es/interface/animation/easing.d.ts`，@visactor/vrender-core@1.1.11

```typescript
export type EasingType = EasingTypeStr | EasingTypeFunc;
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-619b260e190a"></a>
## ITicker

来源：`@visactor/vrender-core/es/interface/animation/ticker.d.ts`，@visactor/vrender-core@1.1.11

```typescript
export interface ITicker extends EventEmitter {
    setFPS?: (fps: number) => void;
    setInterval?: (interval: number) => void;
    getFPS?: () => number;
    getInterval?: () => number;
    tick: (interval: number) => void;
    tickAt?: (time: number) => void;
    pause: () => boolean;
    resume: () => boolean;
    start: (force?: boolean) => boolean;
    stop: () => void;
    addTimeline: (timeline: ITimeline) => void;
    remTimeline: (timeline: ITimeline) => void;
    trySyncTickStatus: () => void;
    getTimelines: () => ITimeline[];
    release: () => void;
    bindStage: (stage: IStage) => void;
    autoStop: boolean;
}
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-a0aea41aa029"></a>
## IColor

来源：`@visactor/vrender-core/es/interface/color.d.ts`，@visactor/vrender-core@1.1.11

```typescript
export type IColor = string | ILinearGradient | IRadialGradient | IConicalGradient;
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-d7015f202839"></a>
## IConicalGradient

来源：`@visactor/vrender-core/es/interface/color.d.ts`，@visactor/vrender-core@1.1.11

```typescript
export interface IConicalGradient {
    gradient: 'conical';
    startAngle?: number;
    endAngle?: number;
    x?: number;
    y?: number;
    stops: IGradientStop[];
}
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-d8d5bda2ce95"></a>
## ILinearGradient

来源：`@visactor/vrender-core/es/interface/color.d.ts`，@visactor/vrender-core@1.1.11

```typescript
export interface ILinearGradient {
    gradient: 'linear';
    x0?: number;
    y0?: number;
    x1?: number;
    y1?: number;
    stops: IGradientStop[];
}
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-8830ca87d7a0"></a>
## IRadialGradient

来源：`@visactor/vrender-core/es/interface/color.d.ts`，@visactor/vrender-core@1.1.11

```typescript
export interface IRadialGradient {
    gradient: 'radial';
    x0?: number;
    y0?: number;
    x1?: number;
    y1?: number;
    r0?: number;
    r1?: number;
    stops: IGradientStop[];
}
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-a766bc91cce3"></a>
## IGraphic

来源：`@visactor/vrender-core/es/interface/graphic.d.ts`，@visactor/vrender-core@1.1.11

```typescript
export interface IGraphic<T extends Partial<IGraphicAttribute> = Partial<IGraphicAttribute>> extends INode, IAnimateTarget {
    type?: GraphicType;
    numberType?: number;
    stage?: IStage;
    layer?: ILayer;
    shadowRoot?: IShadowRoot;
    glyphHost?: IGraphic<IGlyphGraphicAttribute>;
    backgroundImg?: boolean;
    attachedThemeGraphic?: IGraphic<any>;
    context?: Record<string, any>;
    bindDom?: Map<string | HTMLElement, {
        container: HTMLElement | string;
        dom: HTMLElement | any;
        wrapGroup: HTMLDivElement | any;
        root?: any;
    }>;
    valid: boolean;
    parent: IGroup | null;
    isContainer?: boolean;
    in3dMode?: boolean;
    widthWithoutTransform?: number;
    heightWithoutTransform?: number;
    stamp?: number;
    animationBackUps?: {
        from: Record<string, any>;
        to: Record<string, any>;
    };
    attribute: Partial<T>;
    pathProxy?: ICustomPath2D | ((attrs: T) => ICustomPath2D);
    incremental?: number;
    incrementalAt?: number;
    states?: StateDefinitionsInput<T>;
    effectiveStates?: string[];
    resolvedStatePatch?: Partial<T>;
    normalAttrs?: Partial<T>;
    baseAttributes?: Partial<T>;
    boundSharedStateScope?: SharedStateScope<T>;
    boundSharedStateRevision?: number;
    sharedStateDirty?: boolean;
    registeredActiveScopes?: Set<SharedStateScope<T>>;
    stateMergeMode?: StateMergeMode;
    findFace?: () => IFace3d;
    toggleState: (stateName: string, hasAnimation?: boolean) => void;
    removeState: (stateName: string | string[], hasAnimation?: boolean) => void;
    clearStates: (hasAnimation?: boolean) => void;
    setStates: {
        (states?: string[] | null, hasAnimation?: boolean): void;
        (states?: string[] | null, options?: ISetStatesOptions): void;
    };
    useStates: (states: string[], hasAnimation?: boolean) => void;
    addState: (stateName: string, keepCurrentStates?: boolean, hasAnimation?: boolean) => void;
    invalidateResolver: () => void;
    hasState: (stateName?: string) => boolean;
    getState: (stateName: string) => Partial<T> | StateDefinition<T>;
    onBeforeAttributeUpdate?: (val: any, attributes: Partial<T>, key: null | string | string[], context?: ISetAttributeContext) => T | undefined;
    applyStateAttrs: (attrs: Partial<T>, stateNames: string[], hasAnimation?: boolean, isClear?: boolean, animateConfig?: IAnimateConfig) => void;
    updateNormalAttrs: (stateAttrs: Partial<T>) => void;
    readonly AABBBounds: IAABBBounds;
    readonly OBBBounds: IOBBBounds;
    readonly globalAABBBounds: IAABBBounds;
    readonly transMatrix: IMatrix;
    readonly globalTransMatrix: IMatrix;
    getOffsetXY: (attr?: ITransform) => IPoint;
    containsPoint: (x: number, y: number, mode?: IContainPointMode, picker?: IPickerService) => boolean;
    setMode: (mode: '3d' | '2d') => void;
    isValid: () => boolean;
    getClipPath: () => ISymbolClass | null;
    translate: (x: number, y: number) => this;
    translateTo: (x: number, y: number) => this;
    scale: (scaleX: number, scaleY: number, scaleCenter?: IPointLike) => this;
    scaleTo: (scaleX: number, scaleY: number) => this;
    rotate: (angle: number, rotateCenter?: IPointLike) => this;
    rotateTo: (angle: number) => this;
    skewTo: (b: number, c: number) => this;
    addUpdateBoundTag: () => void;
    addUpdatePaintTag: () => void;
    addUpdateShapeAndBoundsTag: () => void;
    addUpdateLayoutTag: () => void;
    update: (d?: {
        bounds: boolean;
        trans: boolean;
    }) => void;
    animate?: (params?: IGraphicAnimateParams) => IAnimate;
    name?: string;
    shouldUpdateShape: () => boolean;
    clearUpdateShapeTag: () => void;
    setAttributes: (params: Partial<T>, forceUpdateTag?: boolean, context?: ISetAttributeContext) => void;
    initAttributes: (params: Partial<T>) => void;
    setAttribute: (key: string, value: any, forceUpdateTag?: boolean, context?: ISetAttributeContext) => void;
    setStage: (stage?: IStage, layer?: ILayer, inheritedSharedStateScope?: SharedStateScope<Record<string, any>> | null) => void;
    detachStageForRelease: () => void;
    onSetStage: (cb: (g: IGraphic, stage: IStage) => void) => void;
    shouldUpdateAABBBounds: () => boolean;
    shouldSelfChangeUpdateAABBBounds: () => boolean;
    shouldUpdateGlobalMatrix: () => boolean;
    addUpdatePositionTag: () => void;
    addUpdateGlobalPositionTag: () => void;
    attachShadow: () => IShadowRoot;
    detachShadow: () => void;
    toJson: () => IGraphicJson;
    createPathProxy: (path?: string) => void;
    toCustomPath?: () => ICustomPath2D;
    resources?: Map<string | HTMLImageElement | HTMLCanvasElement | IBackgroundConfig, {
        state: 'init' | 'loading' | 'success' | 'fail';
        data?: HTMLImageElement | HTMLCanvasElement;
    }>;
    imageLoadSuccess: (url: string, data: HTMLImageElement) => void;
    imageLoadFail: (url: string) => void;
    clone: () => IGraphic;
    stopAnimates: (stopChildren?: boolean) => void;
    getNoWorkAnimateAttr: () => Record<string, number>;
    getGraphicTheme: () => T;
    getAttributes: (final?: boolean) => Partial<T>;
    pauseAnimation?: (deep?: boolean) => void;
    resumeAnimation?: (deep?: boolean) => void;
    stopAnimation?: (deep?: boolean) => void;
    reApplyAnimationState?: (state: string, deep?: boolean) => this;
}
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-463cf72553ce"></a>
## IGraphicAttribute

来源：`@visactor/vrender-core/es/interface/graphic.d.ts`，@visactor/vrender-core@1.1.11

```typescript
export type IGraphicAttribute = IDebugType & IGraphicStyle & ITransform & {
    strokeSeg: IStrokeSeg | null;
    boundsPadding: number | number[];
    pickMode: 'accurate' | 'imprecise' | 'custom';
    boundsMode: 'accurate' | 'imprecise' | 'empty';
    customPickShape: () => boolean | null;
    pickable: boolean;
    fillPickable: boolean;
    strokePickable: boolean;
    childrenPickable: boolean;
    visible: boolean;
    zIndex: number;
    layout: any;
    renderable: boolean;
    keepDirIn3d?: boolean;
    shadowRootIdx: number;
    shadowPickMode?: 'full' | 'graphic';
    globalZIndex: number;
    globalCompositeOperation: CanvasRenderingContext2D['globalCompositeOperation'] | '';
    overflow: 'scroll' | 'hidden' | 'scroll-x' | 'scroll-y';
    fillStrokeOrder: number;
    keepStrokeScale: boolean;
    clipConfig: {
        shape: string;
    } | null;
};
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-fe3cb3c3600e"></a>
## IGraphicStyle

来源：`@visactor/vrender-core/es/interface/graphic.d.ts`，@visactor/vrender-core@1.1.11

```typescript
export type IGraphicStyle = ILayout & IFillStyle & IStrokeStyle & IPickStyle & {
    forceBoundsWidth: number | (() => number) | undefined;
    forceBoundsHeight: number | (() => number) | undefined;
    opacity: number;
    shadowGraphic?: IGraphic | undefined;
    backgroundMode: BackgroundMode;
    backgroundFit: boolean;
    backgroundKeepAspectRatio: boolean;
    backgroundScale: number;
    backgroundOffsetX: number;
    backgroundOffsetY: number;
    backgroundPosition: BackgroundPosition;
    backgroundClip: boolean;
    backgroundCornerRadius: number | number[];
    backgroundOpacity: number;
    autoAnimateTexture: boolean;
    textureRatio: number;
    textureOptions: any;
    background: IBackgroundType | {
        background: IBackgroundType;
        dx?: number;
        dy?: number;
        width?: number;
        height?: number;
        x?: number;
        y?: number;
    } | null;
    texture: TextureType | string;
    textureColor: string;
    textureSize: number;
    texturePadding: number;
    blur: number;
    cursor: Cursor | null;
    filter: string;
    renderStyle?: 'default' | 'rough' | any;
    roughStyle?: IRoughStyle | null;
    html: ({
        dom: string | HTMLElement;
    } & SimpleDomStyleOptions & CommonDomOptions) | null;
    react: ({
        element: any;
    } & SimpleDomStyleOptions & CommonDomOptions) | null;
    vue: ({
        element: any;
    } & SimpleDomStyleOptions & CommonDomOptions) | null;
};
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-8af3ee2f9b73"></a>
## IGroup

来源：`@visactor/vrender-core/es/interface/graphic/group.d.ts`，@visactor/vrender-core@1.1.11

```typescript
export interface IGroup extends IGraphic<IGroupGraphicAttribute> {
    childrenPickable?: boolean;
    theme?: ITheme;
    sharedStateDefinitions?: StateDefinitionsInput<Record<string, any>>;
    sharedStateScope?: SharedStateScope<Record<string, any>>;
    createTheme: () => void;
    hideAll: () => void;
    showAll: () => void;
    setTheme: (t: IThemeSpec) => void;
    incrementalAppendChild: (node: INode, highPerformance?: boolean) => INode | null;
    incrementalClearChild: () => void;
    createOrUpdateChild: <T extends keyof GraphicAttributeMap>(graphicName: string, attributes: GraphicAttributeMap[T], graphicType: T) => INode;
}
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-2f7220f7ffb4"></a>
## IGroupGraphicAttribute

来源：`@visactor/vrender-core/es/interface/graphic/group.d.ts`，@visactor/vrender-core@1.1.11

```typescript
export type IGroupGraphicAttribute = Partial<IGraphicAttribute> & Partial<IGroupAttribute>;
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-fcfc702de0ac"></a>
## IImageGraphicAttribute

来源：`@visactor/vrender-core/es/interface/graphic/image.d.ts`，@visactor/vrender-core@1.1.11

```typescript
export type IImageGraphicAttribute = Partial<IGraphicAttribute> & Partial<IImageAttribute>;
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-09c9e7b04102"></a>
## IRichTextAttribute

来源：`@visactor/vrender-core/es/interface/graphic/richText.d.ts`，@visactor/vrender-core@1.1.11

```typescript
export type IRichTextAttribute = {
    upgradeAttrs: {
        lineHeight: true;
        multiBreakLine: true;
    } | null;
    width: number;
    height: number;
    editable: boolean;
    ascentDescentMode?: 'actual' | 'font';
    editOptions: IRichTextEditOptionsType | null;
    ellipsis: boolean | string;
    wordBreak: RichTextWordBreak;
    verticalDirection: RichTextVerticalDirection;
    maxHeight: number;
    maxWidth: number;
    textAlign: RichTextGlobalAlignType;
    textBaseline: RichTextGlobalBaselineType;
    layoutDirection: RichTextLayoutDirectionType;
    textConfig: IRichTextCharacter[];
    disableAutoWrapLine: boolean;
    singleLine: boolean;
};
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-a486d6a175fe"></a>
## IRichTextCharacter

来源：`@visactor/vrender-core/es/interface/graphic/richText.d.ts`，@visactor/vrender-core@1.1.11

```typescript
export type IRichTextCharacter = IRichTextParagraphCharacter | IRichTextImageCharacter;
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-e3b4c4057a4f"></a>
## IRichTextGraphicAttribute

来源：`@visactor/vrender-core/es/interface/graphic/richText.d.ts`，@visactor/vrender-core@1.1.11

```typescript
export type IRichTextGraphicAttribute = Partial<IGraphicAttribute & ITextGraphicAttribute> & Partial<IRichTextAttribute>;
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-4dccce8cd4d7"></a>
## SymbolType

来源：`@visactor/vrender-core/es/interface/graphic/symbol.d.ts`，@visactor/vrender-core@1.1.11

```typescript
export type SymbolType = 'circle' | 'cross' | 'diamond' | 'square' | 'arrow' | 'arrowLeft' | 'arrowRight' | 'arrow2Left' | 'arrow2Right' | 'wedge' | 'thinTriangle' | 'triangle' | 'triangleUp' | 'triangleDown' | 'triangleRight' | 'triangleLeft' | 'stroke' | 'star' | 'wye' | 'rect' | 'rectRound' | 'roundLine' | string;
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-4ecb56643e01"></a>
## ITextAttribute

来源：`@visactor/vrender-core/es/interface/graphic/text.d.ts`，@visactor/vrender-core@1.1.11

```typescript
export type ITextAttribute = {
    text: string | number | string[] | number[];
    maxLineWidth: number;
    maxWidth: number;
    textAlign: TextAlignType;
    textBaseline: TextBaselineType;
    fontSize: number;
    fontFamily: string;
    fontWeight: string | number;
    ellipsis: boolean | string;
    fontVariant: string;
    fontStyle: string;
    lineHeight: number | string;
    underline: number;
    lineThrough: number;
    scaleIn3d: boolean;
    direction: 'horizontal' | 'vertical';
    verticalMode: number;
    wordBreak: 'break-word' | 'break-all' | 'keep-all';
    ignoreBuf: boolean;
    heightLimit: number;
    lineClamp: number;
    wrap: boolean;
    whiteSpace: 'normal' | 'no-wrap';
    suffixPosition: 'start' | 'end' | 'middle';
    underlineDash: number[];
    underlineOffset: number;
    disableAutoClipedPoptip?: boolean;
    measureMode?: MeasureModeEnum;
    keepCenterInLine?: boolean;
};
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-36d5f8ea422d"></a>
## ITextGraphicAttribute

来源：`@visactor/vrender-core/es/interface/graphic/text.d.ts`，@visactor/vrender-core@1.1.11

```typescript
export type ITextGraphicAttribute = Partial<IGraphicAttribute> & Partial<ITextAttribute>;
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-5417f1df62a1"></a>
## TextAlignType

来源：`@visactor/vrender-core/es/interface/graphic/text.d.ts`，@visactor/vrender-core@1.1.11

```typescript
export type TextAlignType = 'left' | 'right' | 'center' | 'start' | 'end';
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-b47e2c6810a7"></a>
## TextBaselineType

来源：`@visactor/vrender-core/es/interface/graphic/text.d.ts`，@visactor/vrender-core@1.1.11

```typescript
export type TextBaselineType = 'top' | 'middle' | 'bottom' | 'alphabetic';
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-92d2afdda23a"></a>
## ILayer

来源：`@visactor/vrender-core/es/interface/layer.d.ts`，@visactor/vrender-core@1.1.11

```typescript
export interface ILayer extends IGroup {
    parent: any;
    main: boolean;
    width: number;
    height: number;
    viewWidth: number;
    viewHeight: number;
    readonly layerMode: LayerMode;
    renderCount: number;
    offscreen: boolean;
    subLayers: Map<number, {
        layer: ILayer;
        group?: IGroup;
        zIndex: number;
        drawContribution?: IDrawContribution;
    }>;
    readonly dirtyBound: IAABBBounds;
    background: string;
    dpr: number;
    opacity: number;
    canvasId?: string;
    imageData?: ImageData;
    blendMode?: string;
    pickable: boolean;
    pick: (x: number, y: number) => {
        graphic?: IGraphic;
        group?: IGroup;
    } | false;
    render: (params: ILayerDrawParams, userParams?: Partial<IDrawContext>) => void;
    afterDraw: (cb: (l: this) => void) => void;
    resize: (w: number, h: number) => void;
    resizeView: (w: number, h: number) => void;
    setDpr: (dpr: number) => void;
    getNativeHandler: () => ILayerHandlerContribution;
    combineSubLayer: (removeIncrementalKey?: boolean) => void;
    startAnimate: (t: number) => void;
    setToFrame: (t: number) => void;
    prepare: (dirtyBounds: IBounds, params: ILayerHandlerDrawParams) => void;
    drawTo: (target: IWindow, params: IDrawToParams) => void;
}
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-68cc5b53deb9"></a>
## ICustomPath2D

来源：`@visactor/vrender-core/es/interface/path.d.ts`，@visactor/vrender-core@1.1.11

```typescript
export interface ICustomPath2D extends ICurvePath<IPoint>, IPath2D, Releaseable {
    commandList: CommandType[];
    toString: () => string;
    transform: (x: number, y: number, sx: number, sy: number) => void;
    fromString: (pathStr: string, x?: number, y?: number, sX?: number, sY?: number) => ICustomPath2D;
    fromCustomPath2D: (path: ICustomPath2D, x?: number, y?: number, sX?: number, sY?: number) => ICustomPath2D;
    addCurve: (curve: ICurve<IPoint>) => void;
    getYAt: (x: number) => number;
    clear: () => void;
    drawWithClipRange: (ctx: IPath2D, size: number, x: number, y: number, clipRange: number) => void;
}
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-f65323c92812"></a>
## IOption3D

来源：`@visactor/vrender-core/es/interface/stage.d.ts`，@visactor/vrender-core@1.1.11

```typescript
export interface IOption3D {
    enableView3dTransform?: boolean;
    alpha?: number;
    beta?: number;
    gama?: number;
    center?: {
        x?: number;
        y?: number;
        z?: number;
        dx?: number;
        dy?: number;
        dz?: number;
    };
    fieldRatio?: number;
    fieldDepth?: number;
    light?: {
        dir?: vec3;
        color?: string;
        ambient?: number;
    };
    camera?: any;
}
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-454a11518dd1"></a>
## IStage

来源：`@visactor/vrender-core/es/interface/stage.d.ts`，@visactor/vrender-core@1.1.11

```typescript
export interface IStage extends INode {
    stage?: IStage;
    parent: IStage | null;
    x: number;
    y: number;
    params: Partial<IStageParams>;
    window: IWindow;
    width: number;
    height: number;
    viewWidth: number;
    viewHeight: number;
    defaultLayer: ILayer;
    dirtyBounds: IBounds | null;
    autoRender: boolean;
    renderCount: number;
    hooks: {
        beforeRender: ISyncHook<[IStage]>;
        afterRender: ISyncHook<[IStage]>;
        afterClearScreen: ISyncHook<[IRenderServiceDrawParams]>;
        afterClearRect: ISyncHook<[IRenderServiceDrawParams]>;
    };
    option3d?: IOption3D;
    set3dOptions: (options: IOption3D) => void;
    light?: IDirectionLight;
    camera?: ICamera;
    dpr: number;
    viewBox: IBoundsLike;
    background: string | IColor;
    ticker: ITicker;
    increaseAutoRender: boolean;
    readonly renderService: IRenderService;
    readonly graphicService: IGraphicService;
    getPickerService: () => IPickerService;
    readonly pluginService: IPluginService;
    readonly layerService: ILayerService;
    rootSharedStateScope?: SharedStateScope<Record<string, any>>;
    createLayer: (canvasId?: string, layerMode?: LayerMode) => ILayer;
    getLayer: (name: string) => ILayer;
    sortLayer: (cb: (layer1: ILayer, layer2: ILayer) => number) => void;
    removeLayer: (layerId: number) => ILayer | false;
    getTimeline: () => ITimeline;
    render: (layers?: ILayer[], params?: Partial<IDrawContext>) => void;
    renderNextFrame: (layers?: ILayer[], force?: boolean) => void;
    tryInitInteractiveLayer: () => void;
    resize: (w: number, h: number, rerender?: boolean) => void;
    resizeWindow: (w: number, h: number, rerender?: boolean) => void;
    resizeView: (w: number, h: number, rerender?: boolean) => void;
    setViewBox: ((viewBox: IBoundsLike, rerender: boolean) => void) | ((x: number, y: number, w: number, h: number, rerender: boolean) => void) | ((x: number | IBoundsLike, y: number | boolean, w?: number, h?: number, rerender?: boolean) => void);
    setDpr: (dpr: number, rerender?: boolean) => void;
    setOrigin: (x: number, y: number) => void;
    export: (type: IExportType) => HTMLCanvasElement | ImageData;
    pick: (x: number, y: number) => PickResult | false;
    startAnimate: (t: number) => void;
    setToFrame: (t: number) => void;
    dirty: (b: IBounds, matrix?: IMatrix) => void;
    renderTo: (window: IWindow, params: {
        x: number;
        y: number;
        width: number;
        height: number;
    }) => void;
    renderToNewWindow: (fullImage?: boolean) => IWindow;
    toCanvas: (fullImage?: boolean, viewBox?: IAABBBounds) => HTMLCanvasElement | null;
    setBeforeRender: (cb: (stage: IStage) => void) => void;
    removeBeforeRender: (cb: (stage: IStage) => void) => void;
    setAfterRender: (cb: (stage: IStage) => void) => void;
    removeAfterRender: (cb: (stage: IStage) => void) => void;
    afterNextRender: (cb: (stage: IStage) => void) => void;
    enableAutoRender: () => void;
    disableAutoRender: () => void;
    enableIncrementalAutoRender: () => void;
    disableIncrementalAutoRender: () => void;
    enableDirtyBounds: () => void;
    disableDirtyBounds: () => void;
    enableView3dTransform: () => void;
    disableView3dTranform: () => void;
    getPluginsByName: (name: string) => IPlugin[];
    clearViewBox: (color?: string) => void;
    release: () => void;
    setStage: (stage?: IStage) => void;
    pauseRender: (sk?: number) => void;
    resumeRender: () => void;
    setCursor: (mode?: string) => void;
    getTheme: () => IFullThemeSpec;
    eventPointTransform: (e: PointerEvent | WheelEvent | TouchEvent) => {
        x: number;
        y: number;
    };
    pauseTriggerEvent: () => void;
    resumeTriggerEvent: () => void;
    pauseAnimation?: (deep?: boolean) => void;
    resumeAnimation?: (deep?: boolean) => void;
    stopAnimation?: (deep?: boolean) => void;
    reApplyAnimationState?: (state: string, deep?: boolean) => this;
}
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-681e3d101563"></a>
## IStageParams

来源：`@visactor/vrender-core/es/interface/stage.d.ts`，@visactor/vrender-core@1.1.11

```typescript
export interface IStageParams {
    viewBox: IBoundsLike;
    width: number;
    height: number;
    dpr: number;
    background: string | IColor;
    canvas: string | HTMLCanvasElement;
    container: string | HTMLElement;
    canvasControled: boolean;
    title: string;
    autoRender: boolean;
    autoRefresh: boolean;
    enableLayout: boolean;
    disableDirtyBounds: boolean;
    interactiveLayer: boolean;
    enableHtmlAttribute: string | boolean | HTMLElement;
    ReactDOM: any;
    enableScroll: boolean;
    poptip: boolean;
    beforeRender: (stage: IStage) => void;
    afterRender: (stage: IStage) => void;
    afterClearScreen: (drawParams: any) => void;
    afterClearRect: (drawParams: any) => void;
    renderStyle?: string;
    ticker?: ITicker;
    pluginList?: string[];
    optimize?: IOptimizeType;
    event?: EventConfig;
    supportsTouchEvents?: boolean;
    supportsPointerEvents?: boolean;
    context?: IStageCreateContext;
    rafId?: number;
}
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-a2851eee354b"></a>
## CustomTicksFunc

来源：`@visactor/vscale/es/interface.d.ts`，@visactor/vscale@1.0.27

```typescript
export type CustomTicksFunc<T extends IBaseScale> = (scale: T, count: number) => number[];
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-f4ea6ab4e67d"></a>
## IBaseScale

来源：`@visactor/vscale/es/interface.d.ts`，@visactor/vscale@1.0.27

```typescript
export interface IBaseScale {
    readonly type: string;
    unknown: (_?: any) => this | any;
    scale: (x: any) => any;
    domain: (_?: any[], slience?: boolean) => this | any;
    range: (_?: any[], slience?: boolean) => this | any;
    invert?: (y: any) => any;
    clone?: () => IBaseScale;
    rescale?: (slience?: boolean) => this;
    tickData?: (count?: number) => TickData[];
}
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-61b93a04c77c"></a>
## IContinuousScale

来源：`@visactor/vscale/es/interface.d.ts`，@visactor/vscale@1.0.27

```typescript
export interface IContinuousScale extends IBaseScale, IRangeFactor {
    readonly type: ContinuousScaleType;
    invert: (y: number) => any;
    rangeRound: (_: any[], slience?: boolean) => this;
    clamp: (_?: boolean, f?: (x: number) => number, slience?: boolean) => this | boolean;
    interpolate: (_?: InterpolateType<any>, slience?: boolean) => this | InterpolateType<any>;
    clone?: () => IContinuousScale;
    rescale: () => this;
    fishEye: (options?: ScaleFishEyeOptions, slience?: boolean, clear?: boolean) => this | ScaleFishEyeOptions;
}
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-e61ecce4e47c"></a>
## IBoundsLike

来源：`@visactor/vutils/es/data-structure/bounds.d.ts`，@visactor/vutils@1.0.27

```typescript
export type IBoundsLike = Pick<IBounds, 'x1' | 'y1' | 'x2' | 'y2'>;
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-e25b463f6cfe"></a>
## IPointLike

来源：`@visactor/vutils/es/data-structure/point.d.ts`，@visactor/vutils@1.0.27

```typescript
export type IPointLike = Pick<IPoint, 'x' | 'y' | 'x1' | 'y1' | 'defined' | 'context'>;
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-698f5ded9c9f"></a>
## IPadding

来源：`@visactor/vutils/es/padding.d.ts`，@visactor/vutils@1.0.27

```typescript
export type IPadding = {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
};
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-0f3d51337f61"></a>
## Maybe

来源：`@visactor/vutils/es/type.d.ts`，@visactor/vutils@1.0.27

```typescript
export type Maybe<T> = T | null | undefined;
```

这是对应包版本的直接声明摘录；嵌套外部类型未递归复制，按该版本包契约查询。常用图表属性优先参考已有组件/图元说明。

<a id="type-e506ece45fdc"></a>
## IBar3dSeriesSpec

来源：`packages/vchart-extension/src/charts/bar-3d/interface.ts`，VChart 2.1.7

```typescript
export type IBar3dSeriesSpec = {
  type: 'bar3d';
} & Omit<IBarSeriesSpec, 'type'> &
  ICartesianSeriesSpec &
  IAnimationSpec<'bar', BarAppearPreset>;
```

相关定义：[IBarSeriesSpec](AdditionalTypes-Type-Definition.md#type-e01baddbd8aa)、[ICartesianSeriesSpec](AdditionalTypes-Type-Definition.md#type-3814e1f2a8e7)、[IAnimationSpec](AdditionalTypes-Type-Definition.md#type-c2c92c7fb8c3)、[BarAppearPreset](AdditionalTypes-Type-Definition.md#type-2a04d7b5d5bc)

<a id="type-f780ecfd754f"></a>
## IPictogramSeriesSpec

来源：`packages/vchart-extension/src/charts/pictogram/series/interface.ts`，VChart 2.1.7

```typescript
export interface IPictogramSeriesSpec extends ISeriesSpec, IAnimationSpec<'pictogram', 'fadeIn'> {
  /**
   *  系列类型
   */
  type: 'pictogram';
  /**
   *  svg 数据源
   */
  svg: string;
  /**
   *  名称维度
   */
  nameField?: string;
  /**
   *  值维度
   */
  valueField?: string;
  /**
   *  图元配置
   */
  pictogram?: IMarkSpec<Omit<IPathMarkSpec, 'smoothScale'>>;

  /** 默认填充颜色 */
  defaultFillColor?: string;
}
```

相关定义：[ISeriesSpec](ISeriesSpec-Type-Definition.md)、[IAnimationSpec](AdditionalTypes-Type-Definition.md#type-c2c92c7fb8c3)、[IMarkSpec](IMarkSpec-Type-Definition.md)、[IPathMarkSpec](IPathMarkSpec-Type-Definition.md)

<a id="type-de962586184b"></a>
## IRangeColumn3dSeriesSpec

来源：`packages/vchart-extension/src/charts/range-column-3d/interface.ts`，VChart 2.1.7

```typescript
export interface IRangeColumn3dSeriesSpec extends Omit<IRangeColumnSeriesSpec, 'type'> {
  type: 'rangeColumn3d';
}
```

相关定义：[IRangeColumnSeriesSpec](AdditionalTypes-Type-Definition.md#type-71611a6326b0)

<a id="type-172112d22f72"></a>
## IWordCloud3dSeriesSpec

来源：`packages/vchart-extension/src/charts/word-cloud-3d/interface.ts`，VChart 2.1.7

```typescript
export interface IWordCloud3dSeriesSpec extends IWordCloudSeriesBaseSpec {
  type: 'wordCloud3d';
  depth_3d?: number; // 词云的半径深度
  postProjection?: 'StereographicProjection'; // 词云投影的算法
}
```

相关定义：[IWordCloudSeriesBaseSpec](AdditionalTypes-Type-Definition.md#type-545e0cd34c67)

<a id="type-5d8412d98274"></a>
## ChannelAnimationConfig

来源：`packages/vchart/src/animation/interface.ts`，VChart 2.1.7

```typescript
export interface ChannelAnimationConfig extends CommonAnimationConfigItem {
  channel: IAnimationChannelAttrs | string[];
}
```

相关定义：[CommonAnimationConfigItem](AdditionalTypes-Type-Definition.md#type-a27ba00f90e2)、[IAnimationChannelAttrs](AdditionalTypes-Type-Definition.md#type-f40bfaee5af2)

<a id="type-a27ba00f90e2"></a>
## CommonAnimationConfigItem

来源：`packages/vchart/src/animation/interface.ts`，VChart 2.1.7

```typescript
export interface CommonAnimationConfigItem {
  custom?: IAnimationChannelInterpolator | IAnimationCustomConstructor;
  customParameters?: GraphicFunctionValueType<any>;

  easing?: EasingType;
  duration?: GraphicFunctionValueType<number>;
  delay?: GraphicFunctionValueType<number>;
  delayAfter?: GraphicFunctionValueType<number>;
  oneByOne?: GraphicFunctionValueType<boolean | number>;
  startTime?: GraphicFunctionValueType<number>;
  totalTime?: GraphicFunctionValueType<number>;
  /** loop: true 无限循环; loop: 正整数，表示循环的次数 */
  loop?: boolean | number;
  /** 动画 effect 配置项 */
  options?: GraphicFunctionValueType<any>;
  /** 动画执行相关控制配置项 */
  controlOptions?: IAnimationControlOptions;
  /** 该动画是否需要忽略子图元 */
  selfOnly?: boolean;
}
```

相关定义：[IAnimationChannelInterpolator](AdditionalTypes-Type-Definition.md#type-cbb1bcb4a54c)、[IAnimationCustomConstructor](AdditionalTypes-Type-Definition.md#type-be178b30c81f)、[GraphicFunctionValueType](AdditionalTypes-Type-Definition.md#type-2dfb509d67d0)、[EasingType](AdditionalTypes-Type-Definition.md#type-6efe56d777d1)、[IAnimationControlOptions](AdditionalTypes-Type-Definition.md#type-727cdb8dd287)

<a id="type-2d4e66b882cd"></a>
## GraphicFunctionCallback

来源：`packages/vchart/src/animation/interface.ts`，VChart 2.1.7

```typescript
export type GraphicFunctionCallback<T> = (datum: any, g: IGraphic, params: any) => T;
```

相关定义：[IGraphic](AdditionalTypes-Type-Definition.md#type-a766bc91cce3)

<a id="type-2dfb509d67d0"></a>
## GraphicFunctionValueType

来源：`packages/vchart/src/animation/interface.ts`，VChart 2.1.7

```typescript
export type GraphicFunctionValueType<T> = GraphicFunctionCallback<T> | T;
```

相关定义：[GraphicFunctionCallback](AdditionalTypes-Type-Definition.md#type-2d4e66b882cd)

<a id="type-f40bfaee5af2"></a>
## IAnimationChannelAttrs

来源：`packages/vchart/src/animation/interface.ts`，VChart 2.1.7

```typescript
export type IAnimationChannelAttrs = Record<
  string,
  {
    from?: any | IAnimationChannelFunction;
    to?: any | IAnimationChannelFunction;
  }
>;
```

相关定义：[IAnimationChannelFunction](AdditionalTypes-Type-Definition.md#type-253d0d6a48ba)

<a id="type-253d0d6a48ba"></a>
## IAnimationChannelFunction

来源：`packages/vchart/src/animation/interface.ts`，VChart 2.1.7

```typescript
export type IAnimationChannelFunction = (datum: any, g: IGraphic, mark: IMark) => any;
```

相关定义：[IGraphic](AdditionalTypes-Type-Definition.md#type-a766bc91cce3)、[IMark](AdditionalTypes-Type-Definition.md#type-50aedeb586cf)

<a id="type-cbb1bcb4a54c"></a>
## IAnimationChannelInterpolator

来源：`packages/vchart/src/animation/interface.ts`，VChart 2.1.7

```typescript
export type IAnimationChannelInterpolator = (
  ratio: number,
  from: any,
  to: any,
  nextAttributes: any,
  datum: any,
  g: IGraphic,
  parameters: IAnimationParameters
) => boolean | void;
```

相关定义：[IGraphic](AdditionalTypes-Type-Definition.md#type-a766bc91cce3)、[IAnimationParameters](AdditionalTypes-Type-Definition.md#type-3fc135bb4f43)

<a id="type-727cdb8dd287"></a>
## IAnimationControlOptions

来源：`packages/vchart/src/animation/interface.ts`，VChart 2.1.7

```typescript
export interface IAnimationControlOptions {
  /** 当动画状态变更时清空动画 */
  stopWhenStateChange?: boolean;
  /** 是否立即应用动画初始状态 */
  immediatelyApply?: boolean;
  /** encode 计算图元最终状态时是否忽略循环动画 */
  ignoreLoopFinalAttributes?: boolean;
}
```

<a id="type-be178b30c81f"></a>
## IAnimationCustomConstructor

来源：`packages/vchart/src/animation/interface.ts`，VChart 2.1.7

```typescript
export interface IAnimationCustomConstructor {
  new (from: any, to: any, duration: number, ease: EasingType, parameters?: any): ACustomAnimate<any>;
}
```

相关定义：[EasingType](AdditionalTypes-Type-Definition.md#type-6efe56d777d1)、[ACustomAnimate](AdditionalTypes-Type-Definition.md#type-f85debfe2020)

<a id="type-2dd72221397d"></a>
## IAnimationEffect

来源：`packages/vchart/src/animation/interface.ts`，VChart 2.1.7

```typescript
export type IAnimationEffect = {
  type?: string;
  channel?: IAnimationChannelAttrs | string[];
  custom?: IAnimationChannelInterpolator | IAnimationCustomConstructor;
  customParameters?: GraphicFunctionValueType<any>;
  easing?: EasingType;
  options?: GraphicFunctionValueType<any>;
};
```

相关定义：[IAnimationChannelAttrs](AdditionalTypes-Type-Definition.md#type-f40bfaee5af2)、[IAnimationChannelInterpolator](AdditionalTypes-Type-Definition.md#type-cbb1bcb4a54c)、[IAnimationCustomConstructor](AdditionalTypes-Type-Definition.md#type-be178b30c81f)、[GraphicFunctionValueType](AdditionalTypes-Type-Definition.md#type-2dfb509d67d0)、[EasingType](AdditionalTypes-Type-Definition.md#type-6efe56d777d1)

<a id="type-3fc135bb4f43"></a>
## IAnimationParameters

来源：`packages/vchart/src/animation/interface.ts`，VChart 2.1.7

```typescript
export interface IAnimationParameters {
  width: number;
  height: number;
  mark: IMark;
  group: IMark | null;
  elementIndex: number;
  elementCount: number;
  view: any;
}
```

相关定义：[IMark](AdditionalTypes-Type-Definition.md#type-50aedeb586cf)

<a id="type-f36951a20ee2"></a>
## IAnimationTimeline

来源：`packages/vchart/src/animation/interface.ts`，VChart 2.1.7

```typescript
export interface IAnimationTimeline {
  /** 为了方便动画编排，用户可以设置 id 用于识别时间线 */
  id?: string;
  /** 时间切片 */
  timeSlices: IAnimationTimeSlice | IAnimationTimeSlice[];
  /** 动画开始的相对时间，可以为负数 */
  startTime?: GraphicFunctionValueType<number>;
  /** 动画时长 */
  totalTime?: GraphicFunctionValueType<number>;
  /** 动画依次执行的延迟 */
  oneByOne?: GraphicFunctionValueType<number | boolean>;
  /** loop: true 无限循环; loop: 正整数，表示循环的次数 */
  loop?: GraphicFunctionValueType<number | boolean>;
  /** 对图元元素进行划分，和过滤类似，但是不同时间线不能同时作用在相同的元素上 */
  partitioner?: GraphicFunctionCallback<boolean>;
  /** 对同一时间线上的元素进行排序 */
  sort?: (datumA: any, datumB: any, graphicA: IGraphic, graphicB: IGraphic) => number;
  /** 动画执行相关控制配置项 */
  controlOptions?: IAnimationControlOptions;
}
```

相关定义：[IAnimationTimeSlice](AdditionalTypes-Type-Definition.md#type-1e49bff211ba)、[GraphicFunctionValueType](AdditionalTypes-Type-Definition.md#type-2dfb509d67d0)、[GraphicFunctionCallback](AdditionalTypes-Type-Definition.md#type-2d4e66b882cd)、[IGraphic](AdditionalTypes-Type-Definition.md#type-a766bc91cce3)、[IAnimationControlOptions](AdditionalTypes-Type-Definition.md#type-727cdb8dd287)

<a id="type-1e49bff211ba"></a>
## IAnimationTimeSlice

来源：`packages/vchart/src/animation/interface.ts`，VChart 2.1.7

```typescript
export interface IAnimationTimeSlice {
  effects: IAnimationEffect | IAnimationEffect[];
  duration?: GraphicFunctionValueType<number>;
  delay?: GraphicFunctionValueType<number>;
  delayAfter?: GraphicFunctionValueType<number>;
}
```

相关定义：[IAnimationEffect](AdditionalTypes-Type-Definition.md#type-2dd72221397d)、[GraphicFunctionValueType](AdditionalTypes-Type-Definition.md#type-2dfb509d67d0)

<a id="type-3e0ce9607473"></a>
## IStageAnimationCallback

来源：`packages/vchart/src/animation/interface.ts`，VChart 2.1.7

```typescript
export type IStageAnimationCallback = (stage: IStage, canvas: HTMLCanvasElement, ratio: number, time: number) => void;
```

相关定义：[IStage](AdditionalTypes-Type-Definition.md#type-454a11518dd1)

<a id="type-e4cf848bb846"></a>
## IStateAnimationConfig

来源：`packages/vchart/src/animation/interface.ts`，VChart 2.1.7

```typescript
export interface IStateAnimationConfig {
  /**
   * 状态动画的动画时长
   */
  duration?: number;
  /**
   * 状态动画的缓动函数类型
   */
  easing?: EasingType;
}
```

相关定义：[EasingType](AdditionalTypes-Type-Definition.md#type-6efe56d777d1)

<a id="type-1cf6d57c137c"></a>
## MarkAnimationSpec

来源：`packages/vchart/src/animation/interface.ts`，VChart 2.1.7

```typescript
export interface MarkAnimationSpec {
  disappear?: IAnimationConfig & {
    callBack?: IStageAnimationCallback | AStageAnimate<any>;
  };
  appear?: IAnimationConfig | IAnimationConfig[];
  enter?: IAnimationConfig | IAnimationConfig[];
  exit?: IAnimationConfig | IAnimationConfig[];
  update?: IAnimationConfig | IAnimationConfig[];
  normal?: IAnimationConfig | IAnimationConfig[];
  state?: IStateAnimationConfig;
}
```

相关定义：[IAnimationConfig](IAnimationConfig-Type-Definition.md)、[IStageAnimationCallback](AdditionalTypes-Type-Definition.md#type-3e0ce9607473)、[AStageAnimate](AdditionalTypes-Type-Definition.md#type-c0172addd0a4)、[IStateAnimationConfig](AdditionalTypes-Type-Definition.md#type-e4cf848bb846)

<a id="type-b4e071966992"></a>
## TypeAnimationConfig

来源：`packages/vchart/src/animation/interface.ts`，VChart 2.1.7

```typescript
export interface TypeAnimationConfig extends CommonAnimationConfigItem {
  type: string;
}
```

相关定义：[CommonAnimationConfigItem](AdditionalTypes-Type-Definition.md#type-a27ba00f90e2)

<a id="type-c2c92c7fb8c3"></a>
## IAnimationSpec

来源：`packages/vchart/src/animation/spec.ts`，VChart 2.1.7

```typescript
export interface IAnimationSpec<MarkName extends string, Preset extends string> {
  /**
   * 图表入场动画
   * 支持配置图表内置不同动画效果
   */
  animationAppear?: boolean | IStateAnimateSpec<Preset> | IMarkAnimateSpec<MarkName>;
  /**
   * 数据更新 - 新增数据动画
   */
  animationEnter?: boolean | ICommonStateAnimateSpec | IMarkAnimateSpec<MarkName>;
  /**
   * 数据更新 - 数据更新动画
   */
  animationUpdate?: boolean | ICommonStateAnimateSpec | IMarkAnimateSpec<MarkName>;
  /**
   * 数据更新 - 数据删除动画
   */
  animationExit?: boolean | ICommonStateAnimateSpec | IMarkAnimateSpec<MarkName>;
  /**
   * 图表退场动画
   */
  animationDisappear?: boolean | ICommonStateAnimateSpec | IMarkAnimateSpec<MarkName>;
  /**
   * 状态切换动画
   * @since 1.12.0
   */
  animationState?: boolean | IStateAnimationConfig;
  /**
   * 循环动画
   */
  animationNormal?: IMarkAnimateSpec<MarkName>;
}
```

相关定义：[IStateAnimateSpec](AdditionalTypes-Type-Definition.md#type-c689f8784df3)、[IMarkAnimateSpec](AdditionalTypes-Type-Definition.md#type-f077d8f2c125)、[ICommonStateAnimateSpec](AdditionalTypes-Type-Definition.md#type-874c3b173f64)、[IStateAnimationConfig](AdditionalTypes-Type-Definition.md#type-e4cf848bb846)

<a id="type-874c3b173f64"></a>
## ICommonStateAnimateSpec

来源：`packages/vchart/src/animation/spec.ts`，VChart 2.1.7

```typescript
export interface ICommonStateAnimateSpec {
  /**
   * 图表动画时长
   */
  duration?: number;
  /**
   * 动画延迟开始的时长
   */
  delay?: number;
  /**
   * 动画缓动效果
   */
  easing?: EasingType;
  /**
   * 是否轮流执行
   */
  oneByOne?: boolean;
}
```

相关定义：[EasingType](AdditionalTypes-Type-Definition.md#type-6efe56d777d1)

<a id="type-f077d8f2c125"></a>
## IMarkAnimateSpec

来源：`packages/vchart/src/animation/spec.ts`，VChart 2.1.7

```typescript
export type IMarkAnimateSpec<MarkName extends string> = Partial<
  Record<MarkName, false | IAnimationConfig | IAnimationConfig[]>
>;
```

相关定义：[IAnimationConfig](IAnimationConfig-Type-Definition.md)

<a id="type-6fbb2d1cab32"></a>
## IMorphAnimationConfig

来源：`packages/vchart/src/animation/spec.ts`，VChart 2.1.7

```typescript
export interface IMorphAnimationConfig {
  easing?: EasingType;
  delay?: MorphFunctionValueType<number>;
  duration?: MorphFunctionValueType<number>;
  oneByOne?: MorphFunctionValueType<boolean | number>;
  splitPath?: MorphFunctionValueType<'clone' | null | undefined>;
}
```

相关定义：[EasingType](AdditionalTypes-Type-Definition.md#type-6efe56d777d1)、[MorphFunctionValueType](AdditionalTypes-Type-Definition.md#type-e0d294fdac38)

<a id="type-bffef8c15a00"></a>
## IMorphConfig

来源：`packages/vchart/src/animation/spec.ts`，VChart 2.1.7

```typescript
export interface IMorphConfig {
  /** whether enable reusing of grammar */
  reuse?: boolean;
  /** whether enable morph */
  morph?: boolean;
  /** force all marks to participate in morphing */
  morphAll?: boolean;
  /** morphing animation config */
  animation?: IMorphAnimationConfig;
  /** whether apply exit animations for released marks */
  enableExitAnimation?: boolean;
}
```

相关定义：[IMorphAnimationConfig](AdditionalTypes-Type-Definition.md#type-6fbb2d1cab32)

<a id="type-d1defc672c7e"></a>
## IMorphSeriesSpec

来源：`packages/vchart/src/animation/spec.ts`，VChart 2.1.7

```typescript
export interface IMorphSeriesSpec {
  /**
   * 系列全局动画是否开启
   * @default true
   */
  enable?: boolean;
  /**
   * 图元匹配字段
   * 系列前后根据 morphKey 配置的内容进行关联
   */
  morphKey?: string;
  /**
   * 数据匹配字段
   * 多数据图元可配置
   */
  morphElementKey?: string;
}
```

<a id="type-c689f8784df3"></a>
## IStateAnimateSpec

来源：`packages/vchart/src/animation/spec.ts`，VChart 2.1.7

```typescript
export interface IStateAnimateSpec<Preset extends string> extends ICommonStateAnimateSpec {
  /**
   * 预设动画效果
   */
  preset?: Preset | false;
}
```

相关定义：[ICommonStateAnimateSpec](AdditionalTypes-Type-Definition.md#type-874c3b173f64)

<a id="type-e6ed6ba04d57"></a>
## MorphData

来源：`packages/vchart/src/animation/spec.ts`，VChart 2.1.7

```typescript
export type MorphData = { prev: any[]; next: any[] };
```

<a id="type-3a62a6f9f35a"></a>
## MorphElements

来源：`packages/vchart/src/animation/spec.ts`，VChart 2.1.7

```typescript
export type MorphElements = { prev: IGraphic[]; next: IGraphic[] };
```

相关定义：[IGraphic](AdditionalTypes-Type-Definition.md#type-a766bc91cce3)

<a id="type-2d18666b391c"></a>
## MorphFunctionCallback

来源：`packages/vchart/src/animation/spec.ts`，VChart 2.1.7

```typescript
export type MorphFunctionCallback<T> = (datum: MorphData, element: MorphElements, parameters: any) => T;
```

相关定义：[MorphData](AdditionalTypes-Type-Definition.md#type-e6ed6ba04d57)、[MorphElements](AdditionalTypes-Type-Definition.md#type-3a62a6f9f35a)

<a id="type-953fe2a09d7a"></a>
## MorphFunctionType

来源：`packages/vchart/src/animation/spec.ts`，VChart 2.1.7

```typescript
export type MorphFunctionType<T> = T | MorphFunctionCallback<T>;
```

相关定义：[MorphFunctionCallback](AdditionalTypes-Type-Definition.md#type-2d18666b391c)

<a id="type-e0d294fdac38"></a>
## MorphFunctionValueType

来源：`packages/vchart/src/animation/spec.ts`，VChart 2.1.7

```typescript
export type MorphFunctionValueType<T> = MorphFunctionType<T> | T;
```

相关定义：[MorphFunctionType](AdditionalTypes-Type-Definition.md#type-953fe2a09d7a)

<a id="type-496aab7cbbc3"></a>
## IAreaChartSpec

来源：`packages/vchart/src/chart/area/interface.ts`，VChart 2.1.7

```typescript
export interface IAreaChartSpec extends ICartesianChartSpec, IChartExtendsSeriesSpec<IAreaSeriesSpec> {
  type: 'area';
  /** 系列配置 */
  series?: IAreaSeriesSpec[];
}
```

相关定义：[ICartesianChartSpec](AdditionalTypes-Type-Definition.md#type-0ecf9332a2b4)、[IChartExtendsSeriesSpec](AdditionalTypes-Type-Definition.md#type-0d38580aaf51)、[IAreaSeriesSpec](AdditionalTypes-Type-Definition.md#type-3c1aa405c767)

<a id="type-1b991bebaeb5"></a>
## IBarChartSpec

来源：`packages/vchart/src/chart/bar/interface.ts`，VChart 2.1.7

```typescript
export interface IBarChartSpec extends ICartesianChartSpec, IChartExtendsSeriesSpec<IBarSeriesSpec> {
  type: 'bar';
  /** 系列配置 */
  series?: IBarSeriesSpec[];
  /**
   * 是否开启自动 bandSize。如果开启，会根据传入的 barWidth 等配置自动计算 bandSize，从而影响轴实际长度
   * @since 1.10.0
   */
  autoBandSize?:
    | boolean
    | {
        /** 设置 bandSize 的在自动计算结果基础上的扩增值，单位为 px */
        extend: number;
      };
}
```

相关定义：[ICartesianChartSpec](AdditionalTypes-Type-Definition.md#type-0ecf9332a2b4)、[IChartExtendsSeriesSpec](AdditionalTypes-Type-Definition.md#type-0d38580aaf51)、[IBarSeriesSpec](AdditionalTypes-Type-Definition.md#type-e01baddbd8aa)

<a id="type-20eb03e0dbfa"></a>
## IBoxPlotChartSpec

来源：`packages/vchart/src/chart/box-plot/interface.ts`，VChart 2.1.7

```typescript
export interface IBoxPlotChartSpec extends ICartesianChartSpec, IChartExtendsSeriesSpec<IBoxPlotSeriesSpec> {
  type: 'boxPlot';
  /** 系列配置 */
  series?: IBoxPlotSeriesSpec[];
}
```

相关定义：[ICartesianChartSpec](AdditionalTypes-Type-Definition.md#type-0ecf9332a2b4)、[IChartExtendsSeriesSpec](AdditionalTypes-Type-Definition.md#type-0d38580aaf51)、[IBoxPlotSeriesSpec](AdditionalTypes-Type-Definition.md#type-4f696616234f)

<a id="type-0ecf9332a2b4"></a>
## ICartesianChartSpec

来源：`packages/vchart/src/chart/cartesian/interface.ts`，VChart 2.1.7

```typescript
export interface ICartesianChartSpec extends IChartSpec {
  /**
   * 图表的方向配置。
   * - 'vertical' 垂直布局，即常见的直角坐标系布局，x 轴位于底部，y 轴位于左侧。
   * - 'horizontal' 水平布局，可理解为 x 轴和 y 轴位置互换。
   */
  direction?: DirectionType;
  /**
   * 笛卡尔坐标系的坐标轴配置
   */
  axes?: ICartesianAxisSpec[];
  /**
   * 十字辅助线配置
   */
  crosshair?: ICartesianCrosshairSpec | ICartesianCrosshairSpec[];
  /**
   * 参考线配置
   */
  markLine?: IMarkLineSpec | IMarkLineSpec[];
  /**
   * 参考区域配置
   */
  markArea?: IMarkAreaSpec | IMarkAreaSpec[];
  /**
   * 参考点配置
   */
  markPoint?: IMarkPointSpec | IMarkPointSpec[];
}
```

相关定义：[IChartSpec](AdditionalTypes-Type-Definition.md#type-57e06d38bf09)、[DirectionType](AdditionalTypes-Type-Definition.md#type-244d188586b9)、[ICartesianAxisSpec](ICartesianAxisSpec-Type-Definition.md)、[ICartesianCrosshairSpec](ICartesianCrosshairSpec-Type-Definition.md)、[IMarkLineSpec](IMarkLineSpec-Type-Definition.md)、[IMarkAreaSpec](IMarkAreaSpec-Type-Definition.md)、[IMarkPointSpec](IMarkPointSpec-Type-Definition.md)

<a id="type-6e93443171dd"></a>
## ICirclePackingChartSpec

来源：`packages/vchart/src/chart/circle-packing/interface.ts`，VChart 2.1.7

```typescript
export interface ICirclePackingChartSpec extends IChartSpec, IChartExtendsSeriesSpec<ICirclePackingSeriesSpec> {
  type: 'circlePacking';
  series?: ICirclePackingSeriesSpec[];
}
```

相关定义：[IChartSpec](AdditionalTypes-Type-Definition.md#type-57e06d38bf09)、[IChartExtendsSeriesSpec](AdditionalTypes-Type-Definition.md#type-0d38580aaf51)、[ICirclePackingSeriesSpec](AdditionalTypes-Type-Definition.md#type-bbcfdbd7ab2b)

<a id="type-2e8825d02f34"></a>
## ICommonChartSpec

来源：`packages/vchart/src/chart/common/interface.ts`，VChart 2.1.7

```typescript
export interface ICommonChartSpec extends Omit<IChartSpec, 'series'> {
  type: 'common';
  /**
   * 分组字段
   */
  seriesField?: string;
  series?: (
    | IAreaSeriesSpec
    | ILineSeriesSpec
    | IBarSeriesSpec
    | IRangeColumnChartSpec
    | IRangeAreaChartSpec
    | IDotSeriesSpec
    | IMapSeriesSpec
    | IPieSeriesSpec
    | ILinkSeriesSpec
    | IRadarSeriesSpec
    | IRoseSeriesSpec
    | IScatterSeriesSpec
    | ICircularProgressSeriesSpec
    | ILinearProgressSeriesSpec
    | IWordCloudSeriesSpec
    | IFunnelSeriesSpec
    | IBoxPlotSeriesSpec
    | IGaugeSeriesSpec
    | ISankeySeriesSpec
    | ITreemapSeriesSpec
    | ISunburstSeriesSpec
    | ICirclePackingSeriesSpec
    | IWaterfallSeriesSpec
    | IHeatmapSeriesSpec
    | IGaugePointerSeriesSpec
    | ICorrelationSeriesSpec
  )[];
  /**
   * 坐标轴配置
   */
  axes?: ICartesianAxisSpec[] | IPolarAxisSpec[];
  /**
   * 十字辅助线配置
   */
  crosshair?: ICartesianCrosshairSpec | ICartesianCrosshairSpec[] | IPolarCrosshairSpec | IPolarCrosshairSpec[];
  /**
   * **仅适用于笛卡尔坐标系**，参考线配置
   */
  markLine?: IMarkLineSpec | IMarkLineSpec[];
  /**
   * **仅适用于笛卡尔坐标系**，参考区域配置
   */
  markArea?: IMarkAreaSpec | IMarkAreaSpec[];
  /**
   * **仅适用于笛卡尔坐标系**，参考点配置
   */
  markPoint?: IMarkPointSpec | IMarkPointSpec[];

  /**
   * 是否开启自动 bandSize。如果开启，会根据传入的 barWidth 等配置自动计算 bandSize，从而影响轴实际长度
   * @since 1.11.2
   */
  autoBandSize?:
    | boolean
    | {
        /** 设置 bandSize 的在自动计算结果基础上的扩增值，单位为 px */
        extend: number;
      };
}
```

相关定义：[IChartSpec](AdditionalTypes-Type-Definition.md#type-57e06d38bf09)、[IAreaSeriesSpec](AdditionalTypes-Type-Definition.md#type-3c1aa405c767)、[ILineSeriesSpec](AdditionalTypes-Type-Definition.md#type-c14fbe0b660f)、[IBarSeriesSpec](AdditionalTypes-Type-Definition.md#type-e01baddbd8aa)、[IRangeColumnChartSpec](AdditionalTypes-Type-Definition.md#type-da04864ad35f)、[IRangeAreaChartSpec](AdditionalTypes-Type-Definition.md#type-3a7b7d9563aa)、[IDotSeriesSpec](AdditionalTypes-Type-Definition.md#type-447586c1422f)、[IMapSeriesSpec](AdditionalTypes-Type-Definition.md#type-f28afaaaf021)、[IPieSeriesSpec](AdditionalTypes-Type-Definition.md#type-71acefc8c120)、[ILinkSeriesSpec](AdditionalTypes-Type-Definition.md#type-66b30ce0b9f7)、[IRadarSeriesSpec](AdditionalTypes-Type-Definition.md#type-702f2f2e90b8)、[IRoseSeriesSpec](AdditionalTypes-Type-Definition.md#type-50a9d844112a)、[IScatterSeriesSpec](AdditionalTypes-Type-Definition.md#type-08a7bd218e9e)、[ICircularProgressSeriesSpec](AdditionalTypes-Type-Definition.md#type-30261f5b0d11)、[ILinearProgressSeriesSpec](AdditionalTypes-Type-Definition.md#type-a272f43e66ef)、[IWordCloudSeriesSpec](AdditionalTypes-Type-Definition.md#type-472dc2c97d50)、[IFunnelSeriesSpec](AdditionalTypes-Type-Definition.md#type-0291e38eb55c)、[IBoxPlotSeriesSpec](AdditionalTypes-Type-Definition.md#type-4f696616234f)、[IGaugeSeriesSpec](AdditionalTypes-Type-Definition.md#type-dfd9dde34e4c)、[ISankeySeriesSpec](AdditionalTypes-Type-Definition.md#type-73ad288a6b3a)、[ITreemapSeriesSpec](AdditionalTypes-Type-Definition.md#type-6cdfbc0c0174)、[ISunburstSeriesSpec](AdditionalTypes-Type-Definition.md#type-42998a239bf0)、[ICirclePackingSeriesSpec](AdditionalTypes-Type-Definition.md#type-bbcfdbd7ab2b)、[IWaterfallSeriesSpec](AdditionalTypes-Type-Definition.md#type-312af991e7a8)、[IHeatmapSeriesSpec](AdditionalTypes-Type-Definition.md#type-6600af61a1ec)、[IGaugePointerSeriesSpec](AdditionalTypes-Type-Definition.md#type-9fdd71c680f3)、[ICorrelationSeriesSpec](AdditionalTypes-Type-Definition.md#type-129af10992bf)、[ICartesianAxisSpec](ICartesianAxisSpec-Type-Definition.md)、[IPolarAxisSpec](IPolarAxisSpec-Type-Definition.md)、[ICartesianCrosshairSpec](ICartesianCrosshairSpec-Type-Definition.md)、[IPolarCrosshairSpec](IPolarCrosshairSpec-Type-Definition.md)、[IMarkLineSpec](IMarkLineSpec-Type-Definition.md)、[IMarkAreaSpec](IMarkAreaSpec-Type-Definition.md)、[IMarkPointSpec](IMarkPointSpec-Type-Definition.md)

<a id="type-717abb97a652"></a>
## ICorrelationChartSpec

来源：`packages/vchart/src/chart/correlation/interface.ts`，VChart 2.1.7

```typescript
export interface ICorrelationChartSpec
  extends Omit<IChartSpec, 'padding'>,
    IChartExtendsSeriesSpec<ICorrelationSeriesSpec> {
  type: 'correlation';
  series?: ICorrelationSeriesSpec[];
}
```

相关定义：[IChartSpec](AdditionalTypes-Type-Definition.md#type-57e06d38bf09)、[IChartExtendsSeriesSpec](AdditionalTypes-Type-Definition.md#type-0d38580aaf51)、[ICorrelationSeriesSpec](AdditionalTypes-Type-Definition.md#type-129af10992bf)

<a id="type-87520a24cdd6"></a>
## IFunnelChartSpec

来源：`packages/vchart/src/chart/funnel/interface.ts`，VChart 2.1.7

```typescript
export interface IFunnelChartSpec extends IChartSpec, IChartExtendsSeriesSpec<IFunnelSeriesSpec> {
  type: 'funnel';
}
```

相关定义：[IChartSpec](AdditionalTypes-Type-Definition.md#type-57e06d38bf09)、[IChartExtendsSeriesSpec](AdditionalTypes-Type-Definition.md#type-0d38580aaf51)、[IFunnelSeriesSpec](AdditionalTypes-Type-Definition.md#type-0291e38eb55c)

<a id="type-80ddbd318ef0"></a>
## IGaugeChartSpec

来源：`packages/vchart/src/chart/gauge/interface.ts`，VChart 2.1.7

```typescript
export interface IGaugeChartSpec
  extends Omit<IPolarChartSpec, 'axes'>,
    Omit<IGaugePointerSeriesSpec, 'data' | 'type' | 'morph' | 'tooltip'> {
  type: 'gauge';

  /** 表盘背景，可选择 gauge 系列或 circularProgress 系列的配置 */
  gauge?: Omit<IGaugeSeriesSpec, 'data'> | Omit<ICircularProgressSeriesSpec, 'data'>;

  /** 轴配置 */
  axes?: (IPolarAxisSpec | ILinearAxisSpec)[];
}
```

相关定义：[IPolarChartSpec](AdditionalTypes-Type-Definition.md#type-47227db96ff6)、[IGaugePointerSeriesSpec](AdditionalTypes-Type-Definition.md#type-9fdd71c680f3)、[IGaugeSeriesSpec](AdditionalTypes-Type-Definition.md#type-dfd9dde34e4c)、[ICircularProgressSeriesSpec](AdditionalTypes-Type-Definition.md#type-30261f5b0d11)、[IPolarAxisSpec](IPolarAxisSpec-Type-Definition.md)、[ILinearAxisSpec](ILinearAxisSpec-Type-Definition.md)

<a id="type-d5e9ad106fbf"></a>
## IHeatmapChartSpec

来源：`packages/vchart/src/chart/heatmap/interface.ts`，VChart 2.1.7

```typescript
export interface IHeatmapChartSpec extends ICartesianChartSpec, IChartExtendsSeriesSpec<IHeatmapSeriesSpec> {
  type: 'heatmap';
  /** 系列配置 */
  series?: IHeatmapSeriesSpec[];
}
```

相关定义：[ICartesianChartSpec](AdditionalTypes-Type-Definition.md#type-0ecf9332a2b4)、[IChartExtendsSeriesSpec](AdditionalTypes-Type-Definition.md#type-0d38580aaf51)、[IHeatmapSeriesSpec](AdditionalTypes-Type-Definition.md#type-6600af61a1ec)

<a id="type-50577849394e"></a>
## IHistogramChartSpec

来源：`packages/vchart/src/chart/histogram/interface.ts`，VChart 2.1.7

```typescript
export interface IHistogramChartSpec
  extends ICartesianChartSpec,
    Omit<IChartExtendsSeriesSpec<IBarSeriesSpec>, 'type'> {
  type: 'histogram';
}
```

相关定义：[ICartesianChartSpec](AdditionalTypes-Type-Definition.md#type-0ecf9332a2b4)、[IChartExtendsSeriesSpec](AdditionalTypes-Type-Definition.md#type-0d38580aaf51)、[IBarSeriesSpec](AdditionalTypes-Type-Definition.md#type-e01baddbd8aa)

<a id="type-5b5f8e33e6e1"></a>
## DimensionIndexOption

来源：`packages/vchart/src/chart/interface/chart.ts`，VChart 2.1.7

```typescript
export type DimensionIndexOption = {
  filter?: (cmp: IComponent) => boolean;
  tooltip?: boolean;
  showTooltipOption?: IShowTooltipOption;
  crosshair?: boolean;
};
```

相关定义：[IComponent](AdditionalTypes-Type-Definition.md#type-5d7fe81ad96c)、[IShowTooltipOption](AdditionalTypes-Type-Definition.md#type-b4df769a6b46)

<a id="type-d27fa13b0c29"></a>
## IChart

来源：`packages/vchart/src/chart/interface/chart.ts`，VChart 2.1.7

```typescript
export interface IChart extends ICompilable {
  padding: IPadding;

  readonly type: string;
  readonly chartData: IChartData;
  readonly transformerConstructor: new (option: IChartSpecTransformerOption) => IChartSpecTransformer;

  getSpec: () => any;
  setSpec: (s: any) => void;

  // data flow
  reDataFlow: () => void;

  setCanvasRect: (width: number, height: number) => void;
  getCanvasRect: () => ILayoutRect;
  getViewRect: () => ILayoutRect;

  getOption: () => IChartOption;

  getModelOption: () => IModelOption;
  /**
   * 图表更新的时候按需调用
   * @since 1.11.0
   */

  /** event */
  getEvent: () => IEvent;

  /**
   * @since 1.10.4
   */
  getGlobalScale: () => IGlobalScale;

  /** layout */
  setLayout: (layout: LayoutCallBack) => void;
  layout: () => void;
  getLayoutTag: () => boolean;
  setLayoutTag: (tag: boolean, morphConfig?: IMorphConfig, renderNextTick?: boolean) => boolean;
  resetLayoutItemTag: () => void;

  // 使用parse前的原始数据结构更新数据
  updateData: (id: StringOrNumber, data: unknown, updateGlobalScale?: boolean, options?: IParserOptions) => void;
  // 使用 IData 更新数据
  updateFullData: (data: IDataValues | IDataValues[]) => void;
  // update scale domain which in GlobalScale
  updateGlobalScaleDomain: () => void;
  //生命周期
  created: (transformer: Maybe<IChartSpecTransformer>) => void;
  init: () => void;
  onLayoutStart: (ctx: IChartLayoutOption) => void;
  onLayoutEnd: (ctx: IChartLayoutOption) => void;
  onEvaluateEnd: (ctx: IChartEvaluateOption) => void;
  onResize: (width: number, height: number, reRender: boolean) => void;
  onLayout: () => void;
  onBeforeRender: () => void;

  /**
   * 图表更新的时候按需调用
   * @since 1.11.0
   */
  reInit: () => void;

  // series
  getAllSeries: () => ISeries[];

  // region
  getRegionsInIndex: (index?: number[]) => IRegion[];
  getRegionsInIds: (ids: number[]) => IRegion[];
  getAllRegions: () => IRegion[];
  getRegionsInUserIdOrIndex: (user_ids?: StringOrNumber[], index?: number[]) => IRegion[];
  getRegionsInQuerier: (query: MaybeArray<IRegionQuerier>) => IRegion[];

  // series
  getSeriesInIndex: (index?: number[]) => ISeries[];
  getSeriesInIds: (ids?: number[]) => ISeries[];
  getSeriesInUserIdOrIndex: (user_ids?: StringOrNumber[], index?: number[]) => ISeries[];
  getSeriesInUserId: (userId: StringOrNumber) => ISeries | undefined;

  // component
  getComponentByIndex: (key: string, index: number) => IComponent | undefined;
  getComponentByUserId: (userId: StringOrNumber) => IComponent | undefined;
  getComponentsByKey: (key: string) => IComponent[];
  getComponentsByType: (type: string) => IComponent[];
  getAllComponents: () => IComponent[];

  // model
  getModelById: (id: number) => IModel | undefined;
  getModelByUserId: (userId: StringOrNumber) => IModel | undefined;
  getModelInFilter: (
    filter: string | { type: string; index: number } | ((model: IModel) => boolean)
  ) => IModel | undefined;
  getAllModels: () => IModel[];

  // mark
  getMarkById: (id: number) => IMark | undefined;
  getAllMarks: () => IMark[];
  getMarkByUserName: (name: string) => IMark[];

  // spec
  updateSpec: (spec: any) => IUpdateSpecResult;

  // state
  /**
   * 更新或设置图元状态
   * @param state 状态筛选器
   * @param filter 筛选器
   */
  updateState: (
    state: Record<string, Omit<IMarkStateSpec<unknown>, 'style'>>,
    filter?: (series: ISeries, mark: IMark, stateKey: string) => boolean //series + mark 筛选
  ) => void;

  /**
   * 更新图元选中状态
   * @param datum hover 图元数据
   * @param filter 筛选器 用来筛选系列与mark
   * @param region region 筛选器
   */
  setSelected: (
    datum: MaybeArray<any> | null,
    filter?: (series: ISeries, mark: IMark) => boolean,
    region?: IRegionQuerier
  ) => void;

  /**
   * 更新图元 hover 状态
   * @param datum hover 图元数据
   * @param filter 筛选器 用来筛选系列与mark
   * @param region region 筛选器
   */
  setHovered: (
    datum: MaybeArray<Datum> | null,
    filter?: (series: ISeries, mark: IMark) => boolean,
    region?: IRegionQuerier
  ) => void;
  /**
   * 清除所有图元的状态
   *
   * @since 1.11.0
   */
  clearState: (state: string) => void;
  /**
   * 清除所有图元的所有状态
   *
   * @since 1.12.4
   */
  clearAllStates: () => void;
  /**
   * 清除所有图元的选中状态
   *
   * @since 1.11.0
   */
  clearSelected: () => void;
  /**
   * 清除所有图元的hover状态
   *
   * @since 1.11.0
   */
  clearHovered: () => void;

  // 更新 viewBox
  updateViewBox: (viewBox: IBoundsLike, reLayout: boolean) => void;

  // 获取实际渲染的 canvas
  getCanvas: () => HTMLCanvasElement | undefined;

  setCurrentTheme: () => void;

  getSeriesData: (id: StringOrNumber | undefined, index: number | undefined) => DataView | undefined;
  // setDimensionIndex
  setDimensionIndex: (value: StringOrNumber, opt: DimensionIndexOption) => void;
  /**
   * 显示交叉线
   * @since 2.0.9
   */
  showCrosshair: (cb: (axis: IAxis) => false | string | number) => void;

  /**
   * 根据数据筛选图元
   * @since 1.13.9
   */
  filterGraphicsByDatum: (
    datum: MaybeArray<Datum> | null,
    opt?: {
      filter?: (series: ISeries, mark: IMark) => boolean;
      region?: IRegionQuerier;
      getDatum?: (el: IMarkGraphic, mark: IMark, s: ISeries, r: IRegion) => Datum;
      callback?: (el: IMarkGraphic, mark: IMark, s: ISeries, r: IRegion) => void;
      regionCallback?: (pickElements: IMarkGraphic[], r: IRegion) => void;
    }
  ) => IMarkGraphic[];
}
```

相关定义：[ICompilable](AdditionalTypes-Type-Definition.md#type-590d0c32ce42)、[IPadding](AdditionalTypes-Type-Definition.md#type-698f5ded9c9f)、[IChartData](AdditionalTypes-Type-Definition.md#type-b326c4e21951)、[IChartSpecTransformerOption](AdditionalTypes-Type-Definition.md#type-42469e396d0c)、[IChartSpecTransformer](AdditionalTypes-Type-Definition.md#type-664463dc79e8)、[ILayoutRect](AdditionalTypes-Type-Definition.md#type-b4324e55ab6b)、[IChartOption](AdditionalTypes-Type-Definition.md#type-cb5d64868d2d)、[IModelOption](AdditionalTypes-Type-Definition.md#type-f2d5e89f0268)、[IEvent](AdditionalTypes-Type-Definition.md#type-17583cb7e08d)、[IGlobalScale](AdditionalTypes-Type-Definition.md#type-86e42efb33dd)、[LayoutCallBack](AdditionalTypes-Type-Definition.md#type-0bf7cec9094c)、[IMorphConfig](AdditionalTypes-Type-Definition.md#type-bffef8c15a00)、[StringOrNumber](AdditionalTypes-Type-Definition.md#type-2f92a26f4727)、[IParserOptions](AdditionalTypes-Type-Definition.md#type-63f1dbc535e0)、[IDataValues](AdditionalTypes-Type-Definition.md#type-218b08963b1d)、[Maybe](AdditionalTypes-Type-Definition.md#type-0f3d51337f61)、[IChartLayoutOption](AdditionalTypes-Type-Definition.md#type-b3fb7b561e3d)、[IChartEvaluateOption](AdditionalTypes-Type-Definition.md#type-895c62f86a47)、[ISeries](AdditionalTypes-Type-Definition.md#type-29ca9e871dc0)、[IRegion](AdditionalTypes-Type-Definition.md#type-a83d28f54f24)、[MaybeArray](AdditionalTypes-Type-Definition.md#type-915c1abd7543)、[IRegionQuerier](AdditionalTypes-Type-Definition.md#type-a826f89dd07b)、[IComponent](AdditionalTypes-Type-Definition.md#type-5d7fe81ad96c)、[IModel](AdditionalTypes-Type-Definition.md#type-2854a5da67ea)、[IMark](AdditionalTypes-Type-Definition.md#type-50aedeb586cf)、[IUpdateSpecResult](AdditionalTypes-Type-Definition.md#type-646a207a21dd)、[IMarkStateSpec](AdditionalTypes-Type-Definition.md#type-4d46c5681360)、[Datum](AdditionalTypes-Type-Definition.md#type-bf5eb9a79e61)、[IBoundsLike](AdditionalTypes-Type-Definition.md#type-e61ecce4e47c)、[DataView](AdditionalTypes-Type-Definition.md#type-b26ccd36d8e8)、[DimensionIndexOption](AdditionalTypes-Type-Definition.md#type-5b5f8e33e6e1)、[IAxis](AdditionalTypes-Type-Definition.md#type-9cbd2aefe72d)、[IMarkGraphic](AdditionalTypes-Type-Definition.md#type-6b98396ffcb3)

<a id="type-b326c4e21951"></a>
## IChartData

来源：`packages/vchart/src/chart/interface/chart.ts`，VChart 2.1.7

```typescript
export interface IChartData {
  parseData: (dataSpec: IData) => void;
  updateData: (dataSpec: IData, fullUp?: boolean, forceMerge?: boolean) => boolean;
  getSeriesData: (id: StringOrNumber | undefined, index: number | undefined) => DataView | undefined;
}
```

相关定义：[IData](IData-Type-Definition.md)、[StringOrNumber](AdditionalTypes-Type-Definition.md#type-2f92a26f4727)、[DataView](AdditionalTypes-Type-Definition.md#type-b26ccd36d8e8)

<a id="type-664463dc79e8"></a>
## IChartSpecTransformer

来源：`packages/vchart/src/chart/interface/chart.ts`，VChart 2.1.7

```typescript
export interface IChartSpecTransformer {
  readonly type: string;
  readonly seriesType: string;

  /** 此方法不建议重写 */
  initChartSpec: (spec: any) => IChartSpecInfo;
  /** 将图表 spec 统一转换为 common chart spec */
  transformSpec: (spec: any) => void;
  /** 转换 model spec，应用主题 */
  transformModelSpec: (spec: any) => IChartSpecInfo;
  /** 根据图表 spec 生成 spec info */
  createSpecInfo: (
    chartSpec: any,
    transform?: (constructor: IModelConstructor, specInfo: IModelSpecInfo, chartSpecInfo?: IChartSpecInfo) => void
  ) => IChartSpecInfo;
  getSeriesRelatedSpecKeys: () => Record<string, true>;
  /** 枚举 spec 中每个有效的 region */
  forEachRegionInSpec: <K>(
    spec: any,
    callbackfn: (constructor: IRegionConstructor, specInfo: IModelSpecInfo, chartSpecInfo?: IChartSpecInfo) => K,
    chartSpecInfo?: IChartSpecInfo
  ) => K[];
  /** 枚举 spec 中每个有效的 series */
  forEachSeriesInSpec: <K>(
    spec: any,
    callbackfn: (constructor: ISeriesConstructor, specInfo: IModelSpecInfo, chartSpecInfo?: IChartSpecInfo) => K,
    chartSpecInfo?: IChartSpecInfo
  ) => K[];
  /** 枚举 spec 中每个有效的 component */
  forEachComponentInSpec: <K>(
    spec: any,
    callbackfn: (constructor: IComponentConstructor, specInfo: IModelSpecInfo, chartSpecInfo?: IChartSpecInfo) => K,
    chartSpecInfo?: IChartSpecInfo
  ) => K[];
}
```

相关定义：[IChartSpecInfo](AdditionalTypes-Type-Definition.md#type-618e9dfe06cf)、[IModelConstructor](AdditionalTypes-Type-Definition.md#type-b2886ff503c6)、[IModelSpecInfo](AdditionalTypes-Type-Definition.md#type-854f78cb6f0a)、[IRegionConstructor](AdditionalTypes-Type-Definition.md#type-4ab33fce2070)、[ISeriesConstructor](AdditionalTypes-Type-Definition.md#type-4d9d86b6e907)、[IComponentConstructor](AdditionalTypes-Type-Definition.md#type-897b853a0458)

<a id="type-895c62f86a47"></a>
## IChartEvaluateOption

来源：`packages/vchart/src/chart/interface/common.ts`，VChart 2.1.7

```typescript
export interface IChartEvaluateOption {}
```

<a id="type-b3fb7b561e3d"></a>
## IChartLayoutOption

来源：`packages/vchart/src/chart/interface/common.ts`，VChart 2.1.7

```typescript
export interface IChartLayoutOption {}
```

<a id="type-cb5d64868d2d"></a>
## IChartOption

来源：`packages/vchart/src/chart/interface/common.ts`，VChart 2.1.7

```typescript
export interface IChartOption
  extends Omit<
    IModelOption,
    'getChartViewRect' | 'getChartLayoutRect' | 'globalScale' | 'getChart' | 'getSeriesData' | 'animation'
  > {
  container: HTMLElement | null;
  canvas?: HTMLCanvasElement | OffscreenCanvas | string;
  modeParams?: IRenderOption['modeParams'];

  /**
   * TODO: 支持百分比
   */
  viewBox?: IBoundsLike;

  /**
   * 自定义布局方法
   */
  layout?: LayoutCallBack;

  /**
   * 是否关闭交互效果
   */
  disableTriggerEvent?: boolean;

  /**
   * 组件内容展示配置
   * @since 2.0.11
   */
  componentShowContent?: {
    /**
     * tooltip 是否关闭内容展示
     * @default false
     */
    tooltip?: boolean | Partial<Record<TooltipActiveType, boolean>>;
    // crosshair 组件是否展示
    crosshair?: boolean;
  };

  /**
   * 性能相关的钩子
   */
  performanceHook?: IPerformanceHook;
}
```

相关定义：[IModelOption](AdditionalTypes-Type-Definition.md#type-f2d5e89f0268)、[IRenderOption](AdditionalTypes-Type-Definition.md#type-0f4236fc8d55)、[IBoundsLike](AdditionalTypes-Type-Definition.md#type-e61ecce4e47c)、[LayoutCallBack](AdditionalTypes-Type-Definition.md#type-0bf7cec9094c)、[TooltipActiveType](AdditionalTypes-Type-Definition.md#type-990c112f10af)、[IPerformanceHook](AdditionalTypes-Type-Definition.md#type-095e16af33ef)

<a id="type-618e9dfe06cf"></a>
## IChartSpecInfo

来源：`packages/vchart/src/chart/interface/common.ts`，VChart 2.1.7

```typescript
export interface IChartSpecInfo {
  region?: IRegionSpecInfo[];
  series?: ISeriesSpecInfo[];
  component?: Record<string, Array<IModelSpecInfo>>;
}
```

相关定义：[IRegionSpecInfo](AdditionalTypes-Type-Definition.md#type-dacf9d61a878)、[ISeriesSpecInfo](AdditionalTypes-Type-Definition.md#type-94e8317ff02e)、[IModelSpecInfo](AdditionalTypes-Type-Definition.md#type-854f78cb6f0a)

<a id="type-42469e396d0c"></a>
## IChartSpecTransformerOption

来源：`packages/vchart/src/chart/interface/common.ts`，VChart 2.1.7

```typescript
export interface IChartSpecTransformerOption extends Partial<IChartOption> {
  seriesType?: string;
}
```

相关定义：[IChartOption](AdditionalTypes-Type-Definition.md#type-cb5d64868d2d)

<a id="type-de20dddcc338"></a>
## ILineChartSpec

来源：`packages/vchart/src/chart/line/interface.ts`，VChart 2.1.7

```typescript
export interface ILineChartSpec extends ICartesianChartSpec, IChartExtendsSeriesSpec<ILineSeriesSpec> {
  type: 'line';
  /** 系列配置 */
  series?: ILineSeriesSpec[];
}
```

相关定义：[ICartesianChartSpec](AdditionalTypes-Type-Definition.md#type-0ecf9332a2b4)、[IChartExtendsSeriesSpec](AdditionalTypes-Type-Definition.md#type-0d38580aaf51)、[ILineSeriesSpec](AdditionalTypes-Type-Definition.md#type-c14fbe0b660f)

<a id="type-53e84bdd56cd"></a>
## ILiquidChartSpec

来源：`packages/vchart/src/chart/liquid/interface.ts`，VChart 2.1.7

```typescript
export interface ILiquidChartSpec extends ICartesianChartSpec, IChartExtendsSeriesSpec<ILiquidSeriesSpec> {
  type: 'liquid';
  /** 系列配置 */
  series?: ILiquidSeriesSpec[];
}
```

相关定义：[ICartesianChartSpec](AdditionalTypes-Type-Definition.md#type-0ecf9332a2b4)、[IChartExtendsSeriesSpec](AdditionalTypes-Type-Definition.md#type-0d38580aaf51)、[ILiquidSeriesSpec](AdditionalTypes-Type-Definition.md#type-fbf087ad5565)

<a id="type-2cc8eadf4a78"></a>
## IMapChartSpec

来源：`packages/vchart/src/chart/map/interface.ts`，VChart 2.1.7

```typescript
export interface IMapChartSpec extends IChartSpec, IChartExtendsSeriesSpec<IMapSeriesSpec> {
  type: 'map';
  series?: IMapSeriesSpec[];
}
```

相关定义：[IChartSpec](AdditionalTypes-Type-Definition.md#type-57e06d38bf09)、[IChartExtendsSeriesSpec](AdditionalTypes-Type-Definition.md#type-0d38580aaf51)、[IMapSeriesSpec](AdditionalTypes-Type-Definition.md#type-f28afaaaf021)

<a id="type-b89687ec6565"></a>
## IPieChartSpec

来源：`packages/vchart/src/chart/pie/interface.ts`，VChart 2.1.7

```typescript
export interface IPieChartSpec extends IChartSpec, IChartExtendsSeriesSpec<IPieSeriesSpec> {
  type: 'pie';
  /** 饼图指标卡 */
  indicator?: IIndicatorSpec | IIndicatorSpec[];
}
```

相关定义：[IChartSpec](AdditionalTypes-Type-Definition.md#type-57e06d38bf09)、[IChartExtendsSeriesSpec](AdditionalTypes-Type-Definition.md#type-0d38580aaf51)、[IPieSeriesSpec](AdditionalTypes-Type-Definition.md#type-71acefc8c120)、[IIndicatorSpec](IIndicatorSpec-Type-Definition.md)

<a id="type-47227db96ff6"></a>
## IPolarChartSpec

来源：`packages/vchart/src/chart/polar/interface.ts`，VChart 2.1.7

```typescript
export interface IPolarChartSpec extends IChartSpec {
  /**
   * 极坐标系下坐标轴配置，支持半径轴和角度轴。
   * * `orient: 'angle'` 角度轴
   * * `orient: 'radius'` 半径轴
   */
  axes?: IPolarAxisSpec[];
  /**
   * 十字辅助线配置
   */
  crosshair?: IPolarCrosshairSpec | IPolarCrosshairSpec[];

  /**
   * @since 1.11.2
   */
  layoutRadius?: 'auto' | number | ((layoutRect: ILayoutRect, center: IPointLike) => number);

  /**
   * 指标卡配置
   */
  indicator?: IIndicatorSpec | IIndicatorSpec[];
}
```

相关定义：[IChartSpec](AdditionalTypes-Type-Definition.md#type-57e06d38bf09)、[IPolarAxisSpec](IPolarAxisSpec-Type-Definition.md)、[IPolarCrosshairSpec](IPolarCrosshairSpec-Type-Definition.md)、[ILayoutRect](AdditionalTypes-Type-Definition.md#type-b4324e55ab6b)、[IPointLike](AdditionalTypes-Type-Definition.md#type-e25b463f6cfe)、[IIndicatorSpec](IIndicatorSpec-Type-Definition.md)

<a id="type-162adbb6da6d"></a>
## ICircularProgressChartSpec

来源：`packages/vchart/src/chart/progress/circular/interface.ts`，VChart 2.1.7

```typescript
export interface ICircularProgressChartSpec
  extends IProgressChartSpec,
    IChartExtendsSeriesSpec<ICircularProgressSeriesSpec> {
  type: 'circularProgress';
  series?: ICircularProgressSeriesSpec[];
}
```

相关定义：[IProgressChartSpec](AdditionalTypes-Type-Definition.md#type-c981df1ddf60)、[IChartExtendsSeriesSpec](AdditionalTypes-Type-Definition.md#type-0d38580aaf51)、[ICircularProgressSeriesSpec](AdditionalTypes-Type-Definition.md#type-30261f5b0d11)

<a id="type-c981df1ddf60"></a>
## IProgressChartSpec

来源：`packages/vchart/src/chart/progress/interface.ts`，VChart 2.1.7

```typescript
export interface IProgressChartSpec extends IChartSpec {
  /**
   * 分组字段
   */
  seriesField?: string;
  /**
   * 进度条圆角半径
   * @default 0
   */
  cornerRadius?: number;
  /** 轴配置 */
  axes?: ICartesianAxisSpec[] | IPolarAxisSpec[];
}
```

相关定义：[IChartSpec](AdditionalTypes-Type-Definition.md#type-57e06d38bf09)、[ICartesianAxisSpec](ICartesianAxisSpec-Type-Definition.md)、[IPolarAxisSpec](IPolarAxisSpec-Type-Definition.md)

<a id="type-aa5844c337ee"></a>
## ILinearProgressChartSpec

来源：`packages/vchart/src/chart/progress/linear/interface.ts`，VChart 2.1.7

```typescript
export interface ILinearProgressChartSpec
  extends IProgressChartSpec,
    IChartExtendsSeriesSpec<ILinearProgressSeriesSpec> {
  type: 'linearProgress';
  /** 轴配置 */
  axes?: ICartesianAxisSpec[];
  series?: ILinearProgressSeriesSpec[];
}
```

相关定义：[IProgressChartSpec](AdditionalTypes-Type-Definition.md#type-c981df1ddf60)、[IChartExtendsSeriesSpec](AdditionalTypes-Type-Definition.md#type-0d38580aaf51)、[ILinearProgressSeriesSpec](AdditionalTypes-Type-Definition.md#type-a272f43e66ef)、[ICartesianAxisSpec](ICartesianAxisSpec-Type-Definition.md)

<a id="type-63b572eee0ca"></a>
## IRadarChartSpec

来源：`packages/vchart/src/chart/radar/interface.ts`，VChart 2.1.7

```typescript
export interface IRadarChartSpec extends IPolarChartSpec, IChartExtendsSeriesSpec<IRadarSeriesSpec> {
  type: 'radar';
  series?: IRadarSeriesSpec[];
}
```

相关定义：[IPolarChartSpec](AdditionalTypes-Type-Definition.md#type-47227db96ff6)、[IChartExtendsSeriesSpec](AdditionalTypes-Type-Definition.md#type-0d38580aaf51)、[IRadarSeriesSpec](AdditionalTypes-Type-Definition.md#type-702f2f2e90b8)

<a id="type-3a7b7d9563aa"></a>
## IRangeAreaChartSpec

来源：`packages/vchart/src/chart/range-area/interface.ts`，VChart 2.1.7

```typescript
export interface IRangeAreaChartSpec extends ICartesianChartSpec, IChartExtendsSeriesSpec<IRangeAreaSeriesSpec> {
  /** 图表类型配置 */
  type: 'rangeArea';
  /** 系列配置 */
  series?: IRangeAreaSeriesSpec[];
}
```

相关定义：[ICartesianChartSpec](AdditionalTypes-Type-Definition.md#type-0ecf9332a2b4)、[IChartExtendsSeriesSpec](AdditionalTypes-Type-Definition.md#type-0d38580aaf51)、[IRangeAreaSeriesSpec](AdditionalTypes-Type-Definition.md#type-777c15c57cb1)

<a id="type-da04864ad35f"></a>
## IRangeColumnChartSpec

来源：`packages/vchart/src/chart/range-column/interface.ts`，VChart 2.1.7

```typescript
export interface IRangeColumnChartSpec extends ICartesianChartSpec, IChartExtendsSeriesSpec<IRangeColumnSeriesSpec> {
  /** 图表类型配置 */
  type: 'rangeColumn';
  /** 系列配置 */
  series?: IRangeColumnSeriesSpec[];
}
```

相关定义：[ICartesianChartSpec](AdditionalTypes-Type-Definition.md#type-0ecf9332a2b4)、[IChartExtendsSeriesSpec](AdditionalTypes-Type-Definition.md#type-0d38580aaf51)、[IRangeColumnSeriesSpec](AdditionalTypes-Type-Definition.md#type-71611a6326b0)

<a id="type-92bd0cd597bd"></a>
## IRoseChartSpec

来源：`packages/vchart/src/chart/rose/interface.ts`，VChart 2.1.7

```typescript
export interface IRoseChartSpec extends IPolarChartSpec, IChartExtendsSeriesSpec<IRoseSeriesSpec> {
  type: 'rose';
  series?: IRoseSeriesSpec[];
}
```

相关定义：[IPolarChartSpec](AdditionalTypes-Type-Definition.md#type-47227db96ff6)、[IChartExtendsSeriesSpec](AdditionalTypes-Type-Definition.md#type-0d38580aaf51)、[IRoseSeriesSpec](AdditionalTypes-Type-Definition.md#type-50a9d844112a)

<a id="type-f326797c9091"></a>
## ISankeyChartSpec

来源：`packages/vchart/src/chart/sankey/interface.ts`，VChart 2.1.7

```typescript
export interface ISankeyChartSpec extends Omit<IChartSpec, 'padding'>, IChartExtendsSeriesSpec<ISankeySeriesSpec> {
  type: 'sankey';
  series?: ISankeySeriesSpec[];
}
```

相关定义：[IChartSpec](AdditionalTypes-Type-Definition.md#type-57e06d38bf09)、[IChartExtendsSeriesSpec](AdditionalTypes-Type-Definition.md#type-0d38580aaf51)、[ISankeySeriesSpec](AdditionalTypes-Type-Definition.md#type-73ad288a6b3a)

<a id="type-b4c1e7d7be5c"></a>
## IScatterChartSpec

来源：`packages/vchart/src/chart/scatter/interface.ts`，VChart 2.1.7

```typescript
export interface IScatterChartSpec extends ICartesianChartSpec, IChartExtendsSeriesSpec<IScatterSeriesSpec> {
  type: 'scatter';
  /** 系列配置 */
  series?: IScatterSeriesSpec[];
}
```

相关定义：[ICartesianChartSpec](AdditionalTypes-Type-Definition.md#type-0ecf9332a2b4)、[IChartExtendsSeriesSpec](AdditionalTypes-Type-Definition.md#type-0d38580aaf51)、[IScatterSeriesSpec](AdditionalTypes-Type-Definition.md#type-08a7bd218e9e)

<a id="type-93ef189ce720"></a>
## ISequenceChartSpec

来源：`packages/vchart/src/chart/sequence/interface.ts`，VChart 2.1.7

```typescript
export interface ISequenceChartSpec extends IChartSpec {
  type: 'sequence';

  /** 可以为左边的title预留padding */
  appendPadding?: IPadding;

  /** 轴配置 */
  axes?: ICartesianAxisSpec[];
  /** 缩略轴配置 */
  dataZooms?: IDataZoomSpec[];
  /** 滚动条配置 */
  scrollBars?: IScrollBarSpec[];
  /** 十字辅助线配置 */
  crosshair?: ICartesianCrosshairSpec | ICartesianCrosshairSpec[];

  layout?: ILayoutSpec;

  region?: RegionSpec[];
}
```

相关定义：[IChartSpec](AdditionalTypes-Type-Definition.md#type-57e06d38bf09)、[IPadding](IPadding-Type-Definition.md)、[ICartesianAxisSpec](ICartesianAxisSpec-Type-Definition.md)、[IDataZoomSpec](IDataZoomSpec-Type-Definition.md)、[IScrollBarSpec](IScrollBarSpec-Type-Definition.md)、[ICartesianCrosshairSpec](ICartesianCrosshairSpec-Type-Definition.md)、[ILayoutSpec](ILayoutSpec-Type-Definition.md)、[RegionSpec](RegionSpec-Type-Definition.md)

<a id="type-fa66e1c21317"></a>
## ISunburstChartSpec

来源：`packages/vchart/src/chart/sunburst/interface.ts`，VChart 2.1.7

```typescript
export interface ISunburstChartSpec extends IChartSpec, IChartExtendsSeriesSpec<ISunburstSeriesSpec> {
  type: 'sunburst';
  series?: ISunburstSeriesSpec[];
}
```

相关定义：[IChartSpec](AdditionalTypes-Type-Definition.md#type-57e06d38bf09)、[IChartExtendsSeriesSpec](AdditionalTypes-Type-Definition.md#type-0d38580aaf51)、[ISunburstSeriesSpec](AdditionalTypes-Type-Definition.md#type-42998a239bf0)

<a id="type-f80911626a1e"></a>
## ITreemapChartSpec

来源：`packages/vchart/src/chart/treemap/interface.ts`，VChart 2.1.7

```typescript
export interface ITreemapChartSpec extends Omit<IChartSpec, 'data' | 'series'>, Omit<ITreemapSeriesSpec, 'tooltip'> {
  type: 'treemap';
  series?: ITreemapSeriesSpec[];
}
```

相关定义：[IChartSpec](AdditionalTypes-Type-Definition.md#type-57e06d38bf09)、[ITreemapSeriesSpec](AdditionalTypes-Type-Definition.md#type-6cdfbc0c0174)

<a id="type-8f8a21509020"></a>
## IWaterfallChartSpec

来源：`packages/vchart/src/chart/waterfall/interface.ts`，VChart 2.1.7

```typescript
export interface IWaterfallChartSpec extends ICartesianChartSpec, IChartExtendsSeriesSpec<IWaterfallSeriesSpec> {
  type: 'waterfall';
  /** 系列配置 */
  series?: IWaterfallSeriesSpec[];
}
```

相关定义：[ICartesianChartSpec](AdditionalTypes-Type-Definition.md#type-0ecf9332a2b4)、[IChartExtendsSeriesSpec](AdditionalTypes-Type-Definition.md#type-0d38580aaf51)、[IWaterfallSeriesSpec](AdditionalTypes-Type-Definition.md#type-312af991e7a8)

<a id="type-5e23d784e4af"></a>
## IWordCloudChartSpec

来源：`packages/vchart/src/chart/word-cloud/interface.ts`，VChart 2.1.7

```typescript
export interface IWordCloudChartSpec extends IChartSpec, IChartExtendsSeriesSpec<IWordCloudSeriesSpec> {
  type: 'wordCloud';
  series?: IWordCloudSeriesSpec[];
}
```

相关定义：[IChartSpec](AdditionalTypes-Type-Definition.md#type-57e06d38bf09)、[IChartExtendsSeriesSpec](AdditionalTypes-Type-Definition.md#type-0d38580aaf51)、[IWordCloudSeriesSpec](AdditionalTypes-Type-Definition.md#type-472dc2c97d50)

<a id="type-bac9ca204677"></a>
## ICompilableData

来源：`packages/vchart/src/compile/data/interface.ts`，VChart 2.1.7

```typescript
export interface ICompilableData extends IGrammarItem {
  getDataView: () => DataView;
  setDataView: (d?: DataView) => void;

  getProduct: () => any;
  updateData: (noRender?: boolean) => void;
  getLatestData: () => any;

  addRelatedMark: (mark: ICompilableMark) => void;
}
```

相关定义：[IGrammarItem](AdditionalTypes-Type-Definition.md#type-96b4a08944c0)、[DataView](AdditionalTypes-Type-Definition.md#type-b26ccd36d8e8)、[ICompilableMark](AdditionalTypes-Type-Definition.md#type-fb1ce8327f06)

<a id="type-9760c8c7fdef"></a>
## CompilerListenerParameters

来源：`packages/vchart/src/compile/interface/compilable-item.ts`，VChart 2.1.7

```typescript
export type CompilerListenerParameters = {
  type: EventType;
  event: Event;
  source: EventSourceType;
  item: IMarkGraphic | null;
  datum: any | null;
  markId: number | null;
  modelId: number | null;
  markUserId: StringOrNumber | null;
  modelUserId: StringOrNumber | null;
};
```

相关定义：[EventType](AdditionalTypes-Type-Definition.md#type-a71637b330ab)、[EventSourceType](AdditionalTypes-Type-Definition.md#type-1c63b5fdb81d)、[IMarkGraphic](AdditionalTypes-Type-Definition.md#type-6b98396ffcb3)、[StringOrNumber](AdditionalTypes-Type-Definition.md#type-2f92a26f4727)

<a id="type-13afff202962"></a>
## GrammarItemCompileOption

来源：`packages/vchart/src/compile/interface/compilable-item.ts`，VChart 2.1.7

```typescript
export type GrammarItemCompileOption = Record<string, any>;
```

<a id="type-590d0c32ce42"></a>
## ICompilable

来源：`packages/vchart/src/compile/interface/compilable-item.ts`，VChart 2.1.7

```typescript
export interface ICompilable {
  /** 获取 compile 对象 */
  getCompiler: () => ICompiler;
  /** 获取 vgrammar view */
  getStage: () => IStage;

  /** 编译总入口 */
  compile: () => void;
  /** 编译所有 mark */
  compileMarks?: (group?: IGroup) => void;
  /** 编译所有 data */
  compileData?: () => void;

  /** 清除compile 内容入口 */
  clear?: () => void;

  /** 全部编译完成 lift circle */
  afterCompile?: () => void;

  /** 释放总入口 */
  release: () => void;
}
```

相关定义：[ICompiler](AdditionalTypes-Type-Definition.md#type-cbf1a5d7de9b)、[IStage](AdditionalTypes-Type-Definition.md#type-454a11518dd1)、[IGroup](AdditionalTypes-Type-Definition.md#type-8af3ee2f9b73)

<a id="type-f33e72c56cee"></a>
## ICompilableInitOption

来源：`packages/vchart/src/compile/interface/compilable-item.ts`，VChart 2.1.7

```typescript
export interface ICompilableInitOption {
  /** 编译对象 应当由外部提供 */
  getCompiler: () => ICompiler;
}
```

相关定义：[ICompiler](AdditionalTypes-Type-Definition.md#type-cbf1a5d7de9b)

<a id="type-cbf1a5d7de9b"></a>
## ICompiler

来源：`packages/vchart/src/compile/interface/compilable-item.ts`，VChart 2.1.7

```typescript
export interface ICompiler {
  getOption: () => IRenderOption;
  isInited?: boolean;
  readonly stateAnimationConfig?: MarkAnimationSpec;
  getCanvas: () => HTMLCanvasElement | undefined;
  getStage: () => IStage | undefined;
  compile: (ctx: { chart: IChart; vChart: IVChart }, option?: IVChartRenderOption) => void;
  clear: (ctx: { chart: IChart; vChart: IVChart }, removeGraphicItems?: boolean) => void;
  renderNextTick: (morphConfig?: IMorphConfig) => void;
  render: (morphConfig?: IMorphConfig) => void;
  setStageAnimationConfig: (config: Partial<MarkAnimationSpec>) => void;
  updateViewBox: (viewBox: IBoundsLike, reRender?: boolean) => void;
  resize: (width: number, height: number, reRender?: boolean) => void;
  setBackground: (color: IColor) => void;
  setSize: (width: number, height: number) => void;
  setViewBox: (viewBox: IBoundsLike, reRender?: boolean) => void;
  addEventListener: (
    source: EventSourceType,
    type: string,
    callback: (params: CompilerListenerParameters) => void
  ) => void;
  removeEventListener: (
    source: EventSourceType,
    type: string,
    callback: (params: CompilerListenerParameters) => void
  ) => void;
  release: () => void;
  releaseGrammar: (removeGraphicItems: boolean) => void;
  // addGrammarItem: (grammarItem: IGrammarItem) => void;
  // removeGrammarItem: (grammarItem: IGrammarItem, reserveVGrammarModel?: boolean) => void;

  addRootMark: (mark: IMark) => any;
  removeRootMark: (mark: IMark) => any;
  getRootMarks: () => IMark[];

  updateLayoutTag: () => void;
  getLayoutState: () => LayoutState;
  getRootGroup: () => IGroup;
  getChart: () => IChart;
}
```

相关定义：[IRenderOption](AdditionalTypes-Type-Definition.md#type-0f4236fc8d55)、[MarkAnimationSpec](AdditionalTypes-Type-Definition.md#type-1cf6d57c137c)、[IStage](AdditionalTypes-Type-Definition.md#type-454a11518dd1)、[IChart](AdditionalTypes-Type-Definition.md#type-d27fa13b0c29)、[IVChart](AdditionalTypes-Type-Definition.md#type-f6dc633e5201)、[IVChartRenderOption](AdditionalTypes-Type-Definition.md#type-88e49d0ebe2f)、[IMorphConfig](AdditionalTypes-Type-Definition.md#type-bffef8c15a00)、[IBoundsLike](AdditionalTypes-Type-Definition.md#type-e61ecce4e47c)、[IColor](AdditionalTypes-Type-Definition.md#type-a0aea41aa029)、[EventSourceType](AdditionalTypes-Type-Definition.md#type-1c63b5fdb81d)、[CompilerListenerParameters](AdditionalTypes-Type-Definition.md#type-9760c8c7fdef)、[IMark](AdditionalTypes-Type-Definition.md#type-50aedeb586cf)、[LayoutState](AdditionalTypes-Type-Definition.md#type-4a8b32cef03c)、[IGroup](AdditionalTypes-Type-Definition.md#type-8af3ee2f9b73)

<a id="type-96b4a08944c0"></a>
## IGrammarItem

来源：`packages/vchart/src/compile/interface/compilable-item.ts`，VChart 2.1.7

```typescript
export interface IGrammarItem extends ICompilable {
  id: number;
  /** 生成语法元素名称 */
  generateProductId: () => string;
  /** 获取语法元素名称 */
  getProductId: () => string;
  /** 删除已编译的语法元素 */
  removeProduct: (releaseDetach?: boolean) => void;
  // transform
  setTransform: (transform: ITransformSpec[]) => void;
}
```

相关定义：[ICompilable](AdditionalTypes-Type-Definition.md#type-590d0c32ce42)、[ITransformSpec](AdditionalTypes-Type-Definition.md#type-e91ac41860ff)

<a id="type-e91ac41860ff"></a>
## ITransformSpec

来源：`packages/vchart/src/compile/interface/compilable-item.ts`，VChart 2.1.7

```typescript
export interface ITransformSpec {
  type: string;
  [key: string]: any;
}
```

<a id="type-8cab308b2bc7"></a>
## StateValueMap

来源：`packages/vchart/src/compile/interface/compilable-item.ts`，VChart 2.1.7

```typescript
export type StateValueMap = Record<string, unknown>;
```

<a id="type-6ae14ac920fd"></a>
## GestureConfig

来源：`packages/vchart/src/compile/interface/compiler.ts`，VChart 2.1.7

```typescript
export interface GestureConfig {
  press?: {
    /**
     * @default 251
     * Minimal press time in ms.
     * @see http://hammerjs.github.io/recognizer-press/
     */
    time?: number;
    /**
     * @default 10
     * Maximal movement that is allowed while pressing.
     * @see http://hammerjs.github.io/recognizer-press/
     */
    threshold?: number;
  };
  swipe?: {
    /**
     * Minimal distance required before recognizing.
     * @default 10
     * @see https://hammerjs.github.io/recognizer-swipe/
     */
    threshold?: number;
    /**
     * Minimal velocity required before recognizing, unit is in px per ms.
     * @default 0.3
     * @see http://hammerjs.github.io/recognizer-swipe/
     */
    velocity?: number;
  };
  tap?: {
    /**
     * max time between the multi-tap taps
     * @default 300
     */
    interval?: number;
  };
}
```

<a id="type-4a85608bd0f1"></a>
## IOptimizeType

来源：`packages/vchart/src/compile/interface/compiler.ts`，VChart 2.1.7

```typescript
export type IOptimizeType = {
  // 视口不在可视区，跳过渲染，默认为true
  skipRenderWithOutRange?: boolean;
  // 跳过图元在区间外的判断
  // 不存在dirtyBounds的时候，根据该配置判断是否关闭图元的超出边界判定
  // 如果有dirtyBounds那么该配置不生效
  disableCheckGraphicWidthOutRange?: boolean;
};
```

<a id="type-0f4236fc8d55"></a>
## IRenderOption

来源：`packages/vchart/src/compile/interface/compiler.ts`，VChart 2.1.7

```typescript
export interface IRenderOption {
  /**
   * 配置渲染环境，默认为 'desktop-browser'，当需要在非浏览器环境渲染 VChart 时，需要配置该属性。
   * - 'desktop-browser': 默认模式，适用于 PC 及 H5
   * - 'mobile-browser': H5 模式
   * - 'node': Node 渲染
   * - 'worker': worker 模式
   * - 'miniApp': 小程序模式
   * - 'lynx': lynx 渲染
   * @default 'desktop-browser'
   */
  mode?: RenderMode;

  gestureConfig?: GestureConfig;
  /**
   * 渲染环境参数配置。
   *
   * app 级 envParams 只应放对整个 VRender app scope 都有效的环境能力；
   * 具体 canvas name/id、width、height、dpr 会随 stage 创建参数传入。
   * Lynx 新接入请优先使用 pixelRatio、lynx/runtime、canvasFactory 等全局能力，
   * 不要把 domref/canvasIdLists/freeCanvasIdx 作为新主路径依赖。
   */
  modeParams?:
    | {
        tooltipCanvasId?: StringOrNumber;
        [key: string]: any;
      }
    | unknown;

  /**
   * 是否自动刷线dpr
   * @since 1.12.14
   */
  autoRefreshDpr?: boolean;
  /**
   * 设置屏幕分辨率
   */
  dpr?: number;
  /**
   * 图表交互全局开关，默认为 `true`，开启。
   * @default true
   */
  interactive?: boolean;
  /**
   * 指定绘制的区域
   */
  viewBox?: IBoundsLike;
  /**
   * 用于告诉底层的渲染引擎 VRender，图表的 Canvas 是否是受控制的canvas，如果不是的话，不会进行resize等操作。
   * @default true
   */
  canvasControled?: boolean;
  /**
   * 外部传入的 VRender stage。普通用户仍应优先使用 dom/renderCanvas；
   * 显式传入 stage 时，stage ownership 属于外部，VChart release 不会释放该 stage。
   */
  stage?: IStage;
  /**
   * 外部传入的 VRender app。VChart 可使用它创建内部 stage，但 app ownership 属于外部，
   * VChart release 只释放自己创建的 stage，不释放该 app。
   */
  app?: IApp;
  /**
   * 外部传入的 VRender layer
   */
  layer?: ILayer;

  /**
   * 绘制之前的钩子函数
   */
  beforeRender?: IStageParams['beforeRender'];
  /**
   * 绘制之后的钩子函数
   */
  afterRender?: IStageParams['afterRender'];

  renderHooks?: {
    /**
     * 渲染层清除屏幕之后的钩子函数，这个钩子在实际渲染之前
     * @since 2.0.1
     */
    afterClearScreen?: IStageParams['afterClearScreen'];
    /**
     * 渲染层清除屏幕之后的钩子函数，这个钩子在实际渲染之前
     * @since 2.0.2
     */
    afterClearRect?: IStageParams['afterClearRect'];
    /**
     * 渲染层钩子 直接透传
     * @since 2.0.2
     */
    [key: string]: any;
  };
  /**
   * 绘图区域背景色设置
   */
  background?: IColor;
  /**
   * 日志类型，用于开发调试
   */
  logLevel?: number;
  /**
   * 错误消息回调函数
   */
  onError?: (...args: any[]) => void;
  /**
   * 是否关闭dirtyBounds
   * @default false
   */
  disableDirtyBounds?: boolean;
  /**
   * 是否开启view3d的变换模式
   */
  enableView3dTransform?: boolean;
  /**
   * vrender 的插件列表
   */
  pluginList?: string[];
  /**
   * stage 创建前需要安装到当前 VRender app 的插件。
   */
  runtimePluginInstallers?: ((app?: IApp) => void)[];
  /**
   * vrender 的 ticker
   */
  ticker?: ITicker;
  /**
   * @since 1.8.0
   */
  optimize?: IOptimizeType;
  /**
   * @since 1.8.3
   */
  enableHtmlAttribute?: boolean;
  /**
   * @since 1.8.9
   * 是否支持touch事件
   */
  supportsTouchEvents?: boolean;
  /**
   * @since 1.8.9
   * 是否支持pointer事件
   */
  supportsPointerEvents?: boolean;
  /**
   * @since 1.11.0
   * 用于vrender渲染react元素，`react-dom`包导出元素
   */
  ReactDOM?: any;
  /**
   * @since 1.13.2
   * @default 200
   * 单位 ms
   * 多次点击之间的最大时间，默认为 200 ms，用于判断点击次数
   */
  clickInterval?: number;
  /**
   * @since 1.13.2
   * @default false
   * VRender 参数 是否自动阻止事件
   */
  autoPreventDefault?: boolean;
  /**
   * @deprecated
   * 请使用 hooks 代替
   */
  performanceHook?: IPerformanceHook;

  /**
   * 3d配置
   */
  options3d?: {
    enable?: boolean;
    /* 是否支持3d视角变换 */
    enableView3dTranform?: boolean;
  } & IOption3D;
}
```

相关定义：[RenderMode](AdditionalTypes-Type-Definition.md#type-875ef0d8fcf4)、[GestureConfig](AdditionalTypes-Type-Definition.md#type-6ae14ac920fd)、[StringOrNumber](AdditionalTypes-Type-Definition.md#type-2f92a26f4727)、[IBoundsLike](AdditionalTypes-Type-Definition.md#type-e61ecce4e47c)、[IStage](AdditionalTypes-Type-Definition.md#type-454a11518dd1)、[IApp](AdditionalTypes-Type-Definition.md#type-d176b9e09694)、[ILayer](AdditionalTypes-Type-Definition.md#type-92d2afdda23a)、[IStageParams](AdditionalTypes-Type-Definition.md#type-681e3d101563)、[IColor](AdditionalTypes-Type-Definition.md#type-a0aea41aa029)、[ITicker](AdditionalTypes-Type-Definition.md#type-619b260e190a)、[IOptimizeType](AdditionalTypes-Type-Definition.md#type-4a85608bd0f1)、[IPerformanceHook](AdditionalTypes-Type-Definition.md#type-095e16af33ef)、[IOption3D](AdditionalTypes-Type-Definition.md#type-f65323c92812)

<a id="type-4a8b32cef03c"></a>
## LayoutState

来源：`packages/vchart/src/compile/interface/compiler.ts`，VChart 2.1.7

```typescript
export enum LayoutState {
  before = 'before',
  layouting = 'layouting',
  reevaluate = 'reevaluate',
  after = 'after'
}
```

<a id="type-fb1ce8327f06"></a>
## ICompilableMark

来源：`packages/vchart/src/compile/mark/interface.ts`，VChart 2.1.7

```typescript
export interface ICompilableMark extends IGrammarItem {
  // 类型
  readonly type: MarkType;
  // id
  readonly id: number;
  // name
  readonly name: string;
  // key field
  readonly key?: string | ((datum: Datum) => string);
  // parent model
  readonly model: IModel;

  /**
   * 上报发生了变更，需要更新
   */
  commit: (render?: boolean, recursion?: boolean) => void;
  uncommit: () => void;
  isCommited: () => boolean;

  // 数据 可以没有
  getData: () => ICompilableData | undefined;
  setData: (d: ICompilableData) => void;
  getDataView: () => DataView | undefined;
  setDataView: (d: DataView) => void;

  // 状态
  state: IMarkStateManager;
  readonly stateStyle: IMarkStateStyle<any>;
  hasState: (state: string) => boolean;
  getState: (state: string) => any;
  updateState: (newState: Record<string, unknown>) => void;
  /** 更新 mark 样式 */
  compileEncode: () => void;

  // 动画配置
  setAnimationConfig: (config: Partial<MarkAnimationSpec>) => void;
  getAnimationConfig: () => Partial<MarkAnimationSpec>;

  // 是否显示
  getVisible: () => boolean;
  setVisible: (visible: boolean) => void;

  // groupKey 配置
  setGroupKey: (groupKey: string) => void;

  // 用户 id
  getUserId: () => StringOrNumber | undefined;
  setUserId: (id: StringOrNumber) => void;

  compile: (option?: IMarkCompileOption) => void;

  getProduct: () => Maybe<IGroup>;

  /** 获取子mark */
  getMarks: () => ICompilableMark[];

  /** 是否跳过布局阶段 */
  setSkipBeforeLayouted: (skip: boolean) => void;

  getMarkConfig: () => IMarkConfig;
  setMarkConfig: (config: IMarkConfig) => void;

  getContext: () => any;

  /** 开始状态动画 */
  // runAnimationByState: (animationState?: string) => IAnimateArranger;
  // /** 停止状态动画*/
  // stopAnimationByState: (animationState?: string) => IAnimate;
  // /** 暂停状态动画*/
  // pauseAnimationByState: (animationState: string) => IAnimate;
  // /** 恢复状态动画*/
  // resumeAnimationByState: (animationState: string) => IAnimate;

  layout: (layoutCallback: () => void) => void;
  setDataLabelType?: () => string;
}
```

相关定义：[IGrammarItem](AdditionalTypes-Type-Definition.md#type-96b4a08944c0)、[MarkType](AdditionalTypes-Type-Definition.md#type-15c62fdeb46b)、[Datum](AdditionalTypes-Type-Definition.md#type-bf5eb9a79e61)、[IModel](AdditionalTypes-Type-Definition.md#type-2854a5da67ea)、[ICompilableData](AdditionalTypes-Type-Definition.md#type-bac9ca204677)、[DataView](AdditionalTypes-Type-Definition.md#type-b26ccd36d8e8)、[IMarkStateManager](AdditionalTypes-Type-Definition.md#type-ee48e6df46c2)、[IMarkStateStyle](AdditionalTypes-Type-Definition.md#type-103f402e7251)、[MarkAnimationSpec](AdditionalTypes-Type-Definition.md#type-1cf6d57c137c)、[StringOrNumber](AdditionalTypes-Type-Definition.md#type-2f92a26f4727)、[IMarkCompileOption](AdditionalTypes-Type-Definition.md#type-4c11a0696204)、[Maybe](AdditionalTypes-Type-Definition.md#type-644c0bc1509c)、[IGroup](AdditionalTypes-Type-Definition.md#type-8af3ee2f9b73)、[IMarkConfig](AdditionalTypes-Type-Definition.md#type-589e28ffc9d8)

<a id="type-4c11a0696204"></a>
## IMarkCompileOption

来源：`packages/vchart/src/compile/mark/interface.ts`，VChart 2.1.7

```typescript
export interface IMarkCompileOption extends GrammarItemCompileOption {
  group?: IGroup;
  context?: any;
}
```

相关定义：[GrammarItemCompileOption](AdditionalTypes-Type-Definition.md#type-13afff202962)、[IGroup](AdditionalTypes-Type-Definition.md#type-8af3ee2f9b73)

<a id="type-589e28ffc9d8"></a>
## IMarkConfig

来源：`packages/vchart/src/compile/mark/interface.ts`，VChart 2.1.7

```typescript
export interface IMarkConfig {
  clipPath?: IGraphic[] | ((graphics: IGraphic[]) => IGraphic[]);
  clip?: boolean;
  zIndex?: number;
  interactive?: boolean;
  /**
   * set customized shape
   */
  setCustomizedShape?: (datum: any[], attrs: any, path: ICustomPath2D) => ICustomPath2D;
  /** 是否开启大数据渲染模式 */
  large?: boolean;
  /** 开启大数据渲染优化的阀值，对应的是data的长度 */
  largeThreshold?: number;
  /** 分片长度 */
  progressiveStep?: number;
  /** 开启分片渲染的阀值，对应的是单系列data的长度 */
  progressiveThreshold?: number;
  /**
   * use 'sequential' for symbol chart
   * use 'mod' for bar/line chart
   */
  // largeChunkMode?: 'sequential' | 'mod';
  support3d?: boolean;
  /**
   * 象形图，给图形设置名称
   */
  graphicName?: string | ((g: IMarkConfig) => string);
  /**
   * enable global morphing animation of the mark
   */
  morph?: boolean;
  /**
   * this key will be used to match the mark to morph
   */
  morphKey?: string;
  /**
   * this key will be used to match the element of two marks to morph
   * If not specified, we'll use the "key" of the mark by default
   */
  morphElementKey?: string;

  overflow?: 'scroll' | 'hidden' | 'scroll-x' | 'scroll-y';
  skipTheme?: boolean;

  /**
   * 是否开启序列动画能力，默认关闭
   */
  useSequentialAnimation?: boolean;
}
```

相关定义：[IGraphic](AdditionalTypes-Type-Definition.md#type-a766bc91cce3)、[ICustomPath2D](AdditionalTypes-Type-Definition.md#type-68cc5b53deb9)

<a id="type-ee48e6df46c2"></a>
## IMarkStateManager

来源：`packages/vchart/src/compile/mark/interface.ts`，VChart 2.1.7

```typescript
export interface IMarkStateManager {
  getStateInfoList: () => IStateInfo[];
  getStateInfo: (stateValue: StateValue) => IStateInfo;
  addStateInfo: (stateInfo: IStateInfo) => void;
  changeStateInfo: (stateInfo: Partial<IStateInfo>) => void;
  clearStateInfo: (stateValues: StateValue[]) => void;
  clearAllStateInfo: () => void;
  checkOneState: (renderNode: IMarkGraphic, datum: Datum[], state: IStateInfo) => 'in' | 'out' | 'skip';
  checkState: (renderNode: IMarkGraphic, datum: Datum[]) => StateValue[];
  getStateMap: () => StateValueMap;
  updateState: (newState: Partial<StateValueMap>, noRender?: boolean) => void;
  release: () => void;
}
```

相关定义：[IStateInfo](AdditionalTypes-Type-Definition.md#type-88e39c561dcb)、[StateValue](AdditionalTypes-Type-Definition.md#type-0848cecfdc96)、[IMarkGraphic](AdditionalTypes-Type-Definition.md#type-6b98396ffcb3)、[Datum](AdditionalTypes-Type-Definition.md#type-bf5eb9a79e61)、[StateValueMap](AdditionalTypes-Type-Definition.md#type-8cab308b2bc7)

<a id="type-b137387c3a9b"></a>
## IModelMarkAttributeContext

来源：`packages/vchart/src/compile/mark/interface.ts`，VChart 2.1.7

```typescript
export interface IModelMarkAttributeContext {
  [key: string]: unknown;
}
```

<a id="type-57ff7f1e0f2e"></a>
## ISeriesMarkAttributeContext

来源：`packages/vchart/src/compile/mark/interface.ts`，VChart 2.1.7

```typescript
export interface ISeriesMarkAttributeContext extends IModelMarkAttributeContext {
  // 通用的默认属性值获取，比如color，如果有散点图有sizeScale，则可以获取 size
  globalScale: (scaleKey: string, value: string | number) => unknown;
  // 传入seriesField值，获取对应的颜色。
  // 如果传入 null ，返回的是当前系列对应的第一个颜色值。
  seriesColor: (seriesValue?: string | number) => string;
  /**
   * 获取当前的 region
   * @returns
   */
  getRegion: () => IRegion;
}
```

相关定义：[IModelMarkAttributeContext](AdditionalTypes-Type-Definition.md#type-b137387c3a9b)、[IRegion](AdditionalTypes-Type-Definition.md#type-a83d28f54f24)

<a id="type-88e39c561dcb"></a>
## IStateInfo

来源：`packages/vchart/src/compile/mark/interface.ts`，VChart 2.1.7

```typescript
export interface IStateInfo {
  /** 状态值 */
  stateValue: StateValue;
  // 对应的数据维度 可以是多维度
  // TODO: fields 是否保留
  fields?: any | null | undefined;
  /** 筛选数据 */
  datums?: any[] | null | undefined;
  /** 筛选数据 */
  datumKeys?: string[] | null | undefined;
  /** 筛选 item */
  items?: any[] | null | undefined;
  /** 筛选函数 */
  filter?:
    | ((
        datum: any,
        options: {
          mark?: IMark;
          type?: string;
          renderNode?: IGraphic;
        }
      ) => boolean)
    | null
    | undefined;
  cache?: {
    [key: string]: {
      [key: string]: boolean;
    };
  };
  /** 状态优先级 */
  level?: number | undefined;
}
```

相关定义：[StateValue](AdditionalTypes-Type-Definition.md#type-0848cecfdc96)、[IMark](AdditionalTypes-Type-Definition.md#type-50aedeb586cf)、[IGraphic](AdditionalTypes-Type-Definition.md#type-a766bc91cce3)

<a id="type-77e45e91e9ef"></a>
## STATE_CUSTOM

来源：`packages/vchart/src/compile/mark/interface.ts`，VChart 2.1.7

```typescript
export type STATE_CUSTOM = string;
```

<a id="type-988d7ec528f6"></a>
## STATE_HOVER

来源：`packages/vchart/src/compile/mark/interface.ts`，VChart 2.1.7

```typescript
export type STATE_HOVER = typeof STATE_VALUE_ENUM.STATE_HOVER;
```

相关定义：[STATE_VALUE_ENUM.STATE_HOVER](AdditionalTypes-Type-Definition.md#type-05b8969d76ad)

<a id="type-b2903000e622"></a>
## STATE_HOVER_REVERSE

来源：`packages/vchart/src/compile/mark/interface.ts`，VChart 2.1.7

```typescript
export type STATE_HOVER_REVERSE = typeof STATE_VALUE_ENUM.STATE_HOVER_REVERSE;
```

相关定义：[STATE_VALUE_ENUM.STATE_HOVER_REVERSE](AdditionalTypes-Type-Definition.md#type-05b8969d76ad)

<a id="type-d571794e99de"></a>
## STATE_NORMAL

来源：`packages/vchart/src/compile/mark/interface.ts`，VChart 2.1.7

```typescript
export type STATE_NORMAL = typeof STATE_VALUE_ENUM.STATE_NORMAL;
```

相关定义：[STATE_VALUE_ENUM.STATE_NORMAL](AdditionalTypes-Type-Definition.md#type-05b8969d76ad)

<a id="type-05b8969d76ad"></a>
## STATE_VALUE_ENUM

来源：`packages/vchart/src/compile/mark/interface.ts`，VChart 2.1.7

```typescript
export enum STATE_VALUE_ENUM {
  STATE_NORMAL = 'normal',

  STATE_HOVER = 'hover',
  STATE_HOVER_REVERSE = 'hover_reverse',

  STATE_DIMENSION_HOVER = 'dimension_hover',
  STATE_DIMENSION_HOVER_REVERSE = 'dimension_hover_reverse',

  STATE_SELECTED = 'selected',
  STATE_SELECTED_REVERSE = 'selected_reverse',

  // todo: 2.0考虑优化
  STATE_SANKEY_EMPHASIS = 'selected',
  STATE_SANKEY_EMPHASIS_REVERSE = 'blur',

  STATE_HIGHLIGHT = 'highlight',
  STATE_BLUR = 'blur',

  STATE_ACTIVE = 'active'
}
```

<a id="type-0848cecfdc96"></a>
## StateValue

来源：`packages/vchart/src/compile/mark/interface.ts`，VChart 2.1.7

```typescript
export type StateValue = STATE_NORMAL | STATE_HOVER | STATE_CUSTOM;
```

相关定义：[STATE_NORMAL](AdditionalTypes-Type-Definition.md#type-d571794e99de)、[STATE_HOVER](AdditionalTypes-Type-Definition.md#type-988d7ec528f6)、[STATE_CUSTOM](AdditionalTypes-Type-Definition.md#type-77e45e91e9ef)

<a id="type-166ca5507a1b"></a>
## StateValueNot

来源：`packages/vchart/src/compile/mark/interface.ts`，VChart 2.1.7

```typescript
export type StateValueNot = STATE_HOVER_REVERSE | STATE_CUSTOM;
```

相关定义：[STATE_HOVER_REVERSE](AdditionalTypes-Type-Definition.md#type-b2903000e622)、[STATE_CUSTOM](AdditionalTypes-Type-Definition.md#type-77e45e91e9ef)

<a id="type-17574edeab90"></a>
## StateValueType

来源：`packages/vchart/src/compile/mark/interface.ts`，VChart 2.1.7

```typescript
export type StateValueType = StateValue | StateValueNot;
```

相关定义：[StateValue](AdditionalTypes-Type-Definition.md#type-0848cecfdc96)、[StateValueNot](AdditionalTypes-Type-Definition.md#type-166ca5507a1b)

<a id="type-a26561e1568e"></a>
## IAxisHelper

来源：`packages/vchart/src/component/axis/cartesian/interface/common.ts`，VChart 2.1.7

```typescript
export interface IAxisHelper {
  isContinuous: boolean;

  dataToPosition: (values: any[], cfg?: IAxisLocationCfg) => number;
  valueToPosition?: (value: any, cfg?: IAxisLocationCfg) => number;
  getScale?: (depth: number) => IBaseScale;
  getBandwidth?: (depth: number) => number | undefined; // band轴特有；连续轴可按关联柱系列返回虚拟 bandwidth

  // 用户其他模块扩充轴scale的区间
  setExtendDomain?: (key: string, value: number | undefined) => void;

  getAxisType: () => string;

  getAxisId: () => number;

  getSpec?: () => ICommonAxisSpec;

  isInverse: () => boolean;

  // 在地理坐标系系列中，传递经纬度配置字段
  getFields?: () => string[];
}
```

相关定义：[IAxisLocationCfg](AdditionalTypes-Type-Definition.md#type-a2ddebc5e9d7)、[IBaseScale](AdditionalTypes-Type-Definition.md#type-f4ea6ab4e67d)、[ICommonAxisSpec](AdditionalTypes-Type-Definition.md#type-500cf18886a4)

<a id="type-3271a928e402"></a>
## AxisType

来源：`packages/vchart/src/component/axis/interface/common.ts`，VChart 2.1.7

```typescript
export type AxisType = 'linear' | 'ordinal' | 'band' | 'point' | 'time' | 'log' | 'symlog';
```

<a id="type-9cbd2aefe72d"></a>
## IAxis

来源：`packages/vchart/src/component/axis/interface/common.ts`，VChart 2.1.7

```typescript
export interface IAxis extends IComponent {
  valueToPosition: (value: any) => number;
  getScale: () => IBaseScale;
  getScales: () => IBaseScale[];
  getOrient: () => ICartesianAxisSpec['orient'] | IPolarOrientType;
  getInverse: () => boolean;
  getCoordinateType: () => CoordinateType;
  visible: boolean;
  // 标记轴的方向，左到右，右到左，上到下，下到上
  directionStr?: 'l2r' | 'r2l' | 't2b' | 'b2t';
  // 更新轴的 scaleRange
  updateScaleRange?: () => void;
}
```

相关定义：[IComponent](AdditionalTypes-Type-Definition.md#type-5d7fe81ad96c)、[IBaseScale](AdditionalTypes-Type-Definition.md#type-f4ea6ab4e67d)、[ICartesianAxisSpec](ICartesianAxisSpec-Type-Definition.md)、[IPolarOrientType](AdditionalTypes-Type-Definition.md#type-ccede16adcb5)、[CoordinateType](AdditionalTypes-Type-Definition.md#type-f14ee29f7b8b)

<a id="type-a4970733eae3"></a>
## IAxisItem

来源：`packages/vchart/src/component/axis/interface/common.ts`，VChart 2.1.7

```typescript
export interface IAxisItem<T> {
  /**
   * 是否显示
   */
  visible?: boolean;
  /**
   * 样式配置
   */
  style?: Omit<T, 'visible'>;
}
```

<a id="type-a2ddebc5e9d7"></a>
## IAxisLocationCfg

来源：`packages/vchart/src/component/axis/interface/common.ts`，VChart 2.1.7

```typescript
export interface IAxisLocationCfg {
  bandPosition?: number;
  datum?: Datum;
}
```

相关定义：[Datum](AdditionalTypes-Type-Definition.md#type-bf5eb9a79e61)

<a id="type-840e25edaed7"></a>
## IBandAxisLayer

来源：`packages/vchart/src/component/axis/interface/common.ts`，VChart 2.1.7

```typescript
export interface IBandAxisLayer extends Omit<ITickCalculationCfg, 'noDecimals' | 'tickMode'> {
  /**
   * 是否显示
   * @default true
   */
  visible?: boolean;
}
```

相关定义：[ITickCalculationCfg](AdditionalTypes-Type-Definition.md#type-d35c784ee3a7)

<a id="type-d35c784ee3a7"></a>
## ITickCalculationCfg

来源：`packages/vchart/src/component/axis/interface/common.ts`，VChart 2.1.7

```typescript
export interface ITickCalculationCfg {
  /** tick步长 */
  tickStep?: number;
  /**
   * 期望的连续轴tick数量
   * The desired number of ticks draw on linear axis.
   * @default 5
   * @description 建议的tick数量，并不保证结果一定是配置值
   * @since 1.4.0 后支持函数回调。
   */
  tickCount?: number | ((option: ITickCallbackOption) => number);
  /**
   * 强制设置tick数量
   * The exact number of ticks draw on linear axis. Might lead to decimal step.
   * @default 5
   * @description 强制设置的tick数量，可能由于数据范围导致tick值为小数
   */
  forceTickCount?: number;
  /**
   * 连续轴 tick 生成算法：
   * 'average': 尽可能均分；
   * 'd3'：与 d3 默认逻辑一致，以 [1, 2, 5] 为基数生成；
   * CustomTicksFunc: 自定义tick生成算法
   * @default 'average'
   * @since 1.3.0
   *
   * @typedef {function} CustomTicksFunc
   * @param {IContinuousScale} scale - 连续轴的比例尺对象
   * @param {number} tickCount - 生成tick的数量
   * @returns {number[]} - 生成的 tick 数组
   * @since 1.12.0
   *
   * @example
   * // 自定义 tick 生成函数示例
   * const customTickFunc: CustomTicksFunc = (scale, tickCount=5) => {
   *   const domain = scale.domain();
   *   const step = (domain[domain.length - 1] - domain[0]) / (tickCount - 1);
   *   return Array.from({ length: tickCount }, (_, i) => domain[0] + i * step);
   * };
   */
  tickMode?: 'average' | 'd3' | CustomTicksFunc<IContinuousScale>;
  /**
   * 连续轴，是否避免小数 tick。
   * @default false
   * @description 当配置了 tickStep 或 forceTickCount 时不生效。
   * @since 1.3.0
   */
  noDecimals?: boolean;
}
```

相关定义：[ITickCallbackOption](AdditionalTypes-Type-Definition.md#type-41696b783ff0)、[CustomTicksFunc](AdditionalTypes-Type-Definition.md#type-a2851eee354b)、[IContinuousScale](AdditionalTypes-Type-Definition.md#type-61b93a04c77c)

<a id="type-41696b783ff0"></a>
## ITickCallbackOption

来源：`packages/vchart/src/component/axis/interface/common.ts`，VChart 2.1.7

```typescript
export type ITickCallbackOption = {
  axisLength?: number;
  labelStyle?: ITextGraphicAttribute;
};
```

相关定义：[ITextGraphicAttribute](AdditionalTypes-Type-Definition.md#type-36d5f8ea422d)

<a id="type-9266636e13da"></a>
## StyleCallback

来源：`packages/vchart/src/component/axis/interface/common.ts`，VChart 2.1.7

```typescript
export type StyleCallback<T> = (value: any, index: number, datum: Datum, data: Datum[]) => T;
```

相关定义：[Datum](AdditionalTypes-Type-Definition.md#type-bf5eb9a79e61)

<a id="type-63185662c008"></a>
## IBandAxisSpec

来源：`packages/vchart/src/component/axis/interface/spec.ts`，VChart 2.1.7

```typescript
export interface IBandAxisSpec {
  /**
   * 是否去除 band 轴两端的留白，如果为 true，则两端的 padding 为 0，
   * **并且 bandPadding、paddingInner 和 paddingOuter 的设置将被忽略**。
   * @default false
   * @since 1.7.0
   */
  trimPadding?: boolean;
  /**
   * 同时设置轴的 paddingInner 和 paddingOuter
   * **因为有可能存在多层 scale( xField 设置成了数组，即分组场景），所以支持了数组类型，用于多层 scale 的 bandPadding 配置**
   */
  bandPadding?: number | number[];
  /**
   * band 轴的内边距
   * ** 因为有可能存在多层 scale( xField 设置成了数组，即分组场景），所以支持了数组类型，用于多层 scale 的 paddingInner 配置**
   * @default 0.1
   */
  paddingInner?: number | number[];
  /**
   * band 轴的外边距
   * ** 因为有可能存在多层 scale( xField 设置成了数组，即分组场景），所以支持了数组类型，用于多层 scale 的 paddingOuter 配置**
   * @default 0.3
   */
  paddingOuter?: number | number[];
  /**
   * 配置离散轴的数值范围
   * @since 1.1.0
   */
  domain?: StringOrNumber[];
  /**
   * `bandPosition` 是一个可选参数，用于指定数据点在 band 轴上的位置。它的含义是确定数据点在 band 轴上的位置偏移量，相对于 band 轴的起始位置。
   * `bandPosition` 的取值范围是从 0 到 1，其中 0 表示数据点位于 band 轴的起始位置，1 表示数据点位于 band 轴的结束位置。
   * @default 0.5
   */
  bandPosition?: number;

  /**
   * 当存在多层分组场景时，是否展示所有的分组轴
   * @default false
   * @since 1.9.0
   */
  showAllGroupLayers?: boolean;
  /**
   * 每一层轴的配置
   * layer[0] 为离坐标轴线最近的轴，当且仅当 `showAllGroupLayers` 配置开启生效。
   * @since 1.9.0
   */
  layers?: IBandAxisLayer[];
}
```

相关定义：[StringOrNumber](AdditionalTypes-Type-Definition.md#type-2f92a26f4727)、[IBandAxisLayer](AdditionalTypes-Type-Definition.md#type-840e25edaed7)

<a id="type-500cf18886a4"></a>
## ICommonAxisSpec

来源：`packages/vchart/src/component/axis/interface/spec.ts`，VChart 2.1.7

```typescript
export interface ICommonAxisSpec extends Omit<IComponentSpec, 'orient' | 'center'>, IAnimationSpec<string, string> {
  /**
   * 轴类型
   */
  type?: AxisType;
  /**
   * 是否显示坐标轴
   * @default true
   */
  visible?: boolean;
  /**
   * 是否开启反向坐标轴。
   * @default false
   */
  inverse?: boolean;
  /**
   * 轴刻度线配置
   */
  tick?: ITick;
  /**
   * 子刻度线配置
   */
  subTick?: ISubTick;

  /**
   * 是否开启动画，默认关闭
   * @default false
   */
  animation?: boolean;

  // 交互相关的配置
  /**
   * 是否开启 select 选中交互，默认关闭
   * @default false
   */
  select?: boolean;
  /**
   * 是否开启 hover 悬浮交互，默认关闭
   * @default false
   */
  hover?: boolean;

  /**
   * 是否开启轴数据采样，默认开启。
   * 轴采样开启之后，会对轴数据进行采样显示，防止轴数据的重叠。
   * 通过配置 `label.minGap` 可以控制轴标签之间的间距。
   * @default true
   * @since 1.1.0
   */
  sampling?: boolean;

  /**
   * 是否强制初始化 tick 数据，仅在 visible 为 false 时生效
   * @default false
   */
  forceInitTick?: boolean;
}
```

相关定义：[IComponentSpec](AdditionalTypes-Type-Definition.md#type-d23c51c12154)、[IAnimationSpec](AdditionalTypes-Type-Definition.md#type-c2c92c7fb8c3)、[AxisType](AdditionalTypes-Type-Definition.md#type-3271a928e402)、[ITick](AdditionalTypes-Type-Definition.md#type-ffc51285024b)、[ISubTick](AdditionalTypes-Type-Definition.md#type-8a597b4f0966)

<a id="type-89c12f9d6546"></a>
## IDomainLine

来源：`packages/vchart/src/component/axis/interface/spec.ts`，VChart 2.1.7

```typescript
export interface IDomainLine extends IAxisItem<IRuleMarkSpec> {
  /**
   * domainLine 在不同交互状态下的样式配置，支持：
   * 1. hover
   * 2. hover_reverse
   * 3. selected
   * 4. selected_reverse
   */
  state?: AxisItemStateStyle<IRuleMarkSpec>;
}
```

相关定义：[IAxisItem](AdditionalTypes-Type-Definition.md#type-a4970733eae3)、[IRuleMarkSpec](IRuleMarkSpec-Type-Definition.md)、[AxisItemStateStyle](AdditionalTypes-Type-Definition.md#type-80c23221deb4)

<a id="type-1de217f01390"></a>
## IGrid

来源：`packages/vchart/src/component/axis/interface/spec.ts`，VChart 2.1.7

```typescript
export interface IGrid extends IAxisItem<IRuleMarkSpec> {
  /**
   * 两个栅格线间的填充色
   */
  alternateColor?: string | string[];
  /**
   * grid 是否与 label 对齐，默认为 true，即对齐，配置为 false 则显示在前后两个刻度中间
   * @default true
   */
  alignWithLabel?: boolean;
  /**
   * 网格线样式，支持回调
   */
  style?: IRuleMarkSpec | StyleCallback<IRuleMarkSpec | undefined>;
  /**
   * 快捷属性，也可以在 `style` 中配置，用于配置网格线的绘制顺序，默认为 50
   * @default 50
   * @since 1.4.0
   */
  zIndex?: number;
}
```

相关定义：[IAxisItem](AdditionalTypes-Type-Definition.md#type-a4970733eae3)、[IRuleMarkSpec](IRuleMarkSpec-Type-Definition.md)、[StyleCallback](AdditionalTypes-Type-Definition.md#type-9266636e13da)

<a id="type-f22047f767c3"></a>
## ILabel

来源：`packages/vchart/src/component/axis/interface/spec.ts`，VChart 2.1.7

```typescript
export interface ILabel extends IAxisItem<ITextMarkSpec> {
  /**
   * 文本类型
   * @deprecated 1.10.0 版本后，在 formatMethod 中返回 { type: 'rich', text: xxx}
   * */
  type?: 'text' | 'rich';
  /**
   * 轴标签内容格式化函数
   * @param text 原始标签文本值
   * @param datum 图形数据
   * @returns 格式化后的文本
   */
  formatMethod?: IFormatMethod<[text: string | string[], datum?: Datum]>;
  /**
   * 格式化模板
   * @description 可以通过类似 `{value:.2f}%` 的形式对指定数据字段进行格式化
   * @since 1.10.0
   */
  formatter?: string | string[];
  /** 标签同 tick 之间的间距 */
  space?: number;
  /**
   * 标签朝向，默认朝外(坐标线包围盒外部)
   * @default false
   */
  inside?: boolean;
  /**
   * 标签之间的最小间距（单位为像素），仅当轴采样开始时生效（`sampling: true`）。
   * 该配置会影响轴采样的结果。
   */
  minGap?: number;
  /**
   * 文本样式设置
   */
  style?: ITextMarkSpec | StyleCallback<ITextMarkSpec | undefined>;
  /**
   * label 不同交互状态下的样式配置，支持：
   * 1. hover
   * 2. hover_reverse
   * 3. selected
   * 4. selected_reverse
   */
  state?: AxisItemStateStyle<ITextMarkSpec>;
  /**
   * 用于 label 的数据过滤
   * @since 1.1.0
   */
  dataFilter?: (data: AxisItem[], layer: number, context: { vchart: IVChart }) => AxisItem[];
}
```

相关定义：[IAxisItem](AdditionalTypes-Type-Definition.md#type-a4970733eae3)、[ITextMarkSpec](ITextMarkSpec-Type-Definition.md)、[IFormatMethod](AdditionalTypes-Type-Definition.md#type-6375b3333257)、[Datum](AdditionalTypes-Type-Definition.md#type-bf5eb9a79e61)、[StyleCallback](AdditionalTypes-Type-Definition.md#type-9266636e13da)、[AxisItemStateStyle](AdditionalTypes-Type-Definition.md#type-80c23221deb4)、[AxisItem](AdditionalTypes-Type-Definition.md#type-7666dd9220f0)、[IVChart](AdditionalTypes-Type-Definition.md#type-f6dc633e5201)

<a id="type-8a597b4f0966"></a>
## ISubTick

来源：`packages/vchart/src/component/axis/interface/spec.ts`，VChart 2.1.7

```typescript
export interface ISubTick extends IAxisItem<IRuleMarkSpec> {
  /**
   * TODO: 考虑下 log 轴，自刻度线之间的间距是不均匀的问题
   * 子刻度个数
   */
  tickCount?: number;
  /**
   * 子刻度线朝向，默认朝外(坐标线包围盒外部)
   * @default false
   */
  inside?: boolean;
  /** 子刻度线的长度 */
  tickSize?: number;
  /**
   * 子刻度线不同交互状态下的样式配置，支持：
   * 1. hover
   * 2. hover_reverse
   * 3. selected
   * 4. selected_reverse
   */
  state?: AxisItemStateStyle<IRuleMarkSpec>;
}
```

相关定义：[IAxisItem](AdditionalTypes-Type-Definition.md#type-a4970733eae3)、[IRuleMarkSpec](IRuleMarkSpec-Type-Definition.md)、[AxisItemStateStyle](AdditionalTypes-Type-Definition.md#type-80c23221deb4)

<a id="type-ffc51285024b"></a>
## ITick

来源：`packages/vchart/src/component/axis/interface/spec.ts`，VChart 2.1.7

```typescript
export interface ITick extends IAxisItem<IRuleMarkSpec>, ITickCalculationCfg {
  /**
   * Length of tick lines
   * 坐标轴刻度线的长度
   * @default 4
   */
  tickSize?: number;
  /**
   * 刻度线朝向，默认朝外(坐标线包围盒外部)
   * @default false
   */
  inside?: boolean;
  /**
   * tick 是否与 label 对齐，默认为 true，即对齐，配置为 false 则显示在前后两个刻度中间
   * @default true
   */
  alignWithLabel?: boolean;
  /**
   * 刻度线样式设置，支持回调
   */
  style?: IRuleMarkSpec | StyleCallback<IRuleMarkSpec | undefined>;
  /**
   * 刻度线不同交互状态下的样式配置，支持：
   * 1. hover
   * 2. hover_reverse
   * 3. selected
   * 4. selected_reverse
   */
  state?: AxisItemStateStyle<IRuleMarkSpec>;
  /**
   * 用于 tick 的数据过滤
   * @since 1.1.0
   */
  dataFilter?: (data: AxisItem[], context: { vchart: IVChart }) => AxisItem[];
}
```

相关定义：[IAxisItem](AdditionalTypes-Type-Definition.md#type-a4970733eae3)、[IRuleMarkSpec](IRuleMarkSpec-Type-Definition.md)、[ITickCalculationCfg](AdditionalTypes-Type-Definition.md#type-d35c784ee3a7)、[StyleCallback](AdditionalTypes-Type-Definition.md#type-9266636e13da)、[AxisItemStateStyle](AdditionalTypes-Type-Definition.md#type-80c23221deb4)、[AxisItem](AdditionalTypes-Type-Definition.md#type-7666dd9220f0)、[IVChart](AdditionalTypes-Type-Definition.md#type-f6dc633e5201)

<a id="type-d18262dc39a4"></a>
## ITitle

来源：`packages/vchart/src/component/axis/interface/spec.ts`，VChart 2.1.7

```typescript
export interface ITitle extends IAxisItem<ITextMarkSpec> {
  /**
   * 文本类型
   * @deprecated 1.10.0 版本后，在 formatMethod 中返回 { type: 'rich', text: xxx}
   * */
  type?: 'text' | 'rich';
  /**
   * 轴标题内容，支持多种格式
   * - 字符串或者数值
   * - 字符串或者数值数组
   */
  text?: ITextMarkSpec['text'] | ReturnType<IRichTextFormatMethod<[]>>;
  /**
   * 标题的显示位置，直角坐标系默认 'middle'；
   * 极坐标系的圆弧轴如果配置了内半径，则默认 'middle'，否则 'end'
   */
  position?: 'start' | 'middle' | 'end';
  /**
   * 标题距离坐标轴(轴线、刻度、标签共同构成的包围盒)的距离
   */
  space?: number;
  /**
   * 标题内边距配置
   */
  padding?: IPadding | number | number[];
  /**
   * 标题背景色设置
   */
  background?: IAxisItem<IRectMarkSpec> & {
    /**
     * 背景的交互状态样式配置
     */
    state?: AxisItemStateStyle<Partial<IRectMarkSpec>>;
  };
  /**
   * TODO: 接入富文本
   * 标题 shape 配置
   */
  shape?: IAxisItem<ISymbolMarkSpec> & {
    /**
     * shape 同标题文本之间的间距
     */
    space?: number;
    /**
     * shape 标记的交互状态样式配置
     */
    state?: AxisItemStateStyle<Partial<ISymbolMarkSpec>>;
  };
  /**
   * 标题整体的旋转角度（如果标题配置了 background、shape 等属性的话，需要使用该属性进行整体的配置旋转）。
   */
  angle?: number;
  /**
   * text 文本的交互状态样式配置
   */
  state?: AxisItemStateStyle<Partial<ITextMarkSpec>>;
}
```

相关定义：[IAxisItem](AdditionalTypes-Type-Definition.md#type-a4970733eae3)、[ITextMarkSpec](ITextMarkSpec-Type-Definition.md)、[IRichTextFormatMethod](AdditionalTypes-Type-Definition.md#type-3b28c6257cf4)、[IPadding](IPadding-Type-Definition.md)、[IRectMarkSpec](IRectMarkSpec-Type-Definition.md)、[AxisItemStateStyle](AdditionalTypes-Type-Definition.md#type-80c23221deb4)、[ISymbolMarkSpec](ISymbolMarkSpec-Type-Definition.md)

<a id="type-2617700989c6"></a>
## IPolarAxisHelper

来源：`packages/vchart/src/component/axis/polar/interface/common.ts`，VChart 2.1.7

```typescript
export interface IPolarAxisHelper {
  // axis is continuous
  isContinuous: boolean;

  dataToPosition: (values: any, cfg?: any) => number;
  coordToPoint: (point: IPolarPoint) => IPoint;
  pointToCoord: (point: IPoint) => IPolarPoint;
  center: () => IPoint;
  layoutRadius: () => number;

  getScale: (depth?: number) => IBaseScale;
  getBandwidth?: (depth?: number) => number; // band轴特有
  getAxisId: () => number;
  // 用户其他模块扩充轴scale的区间
  setExtendDomain?: (key: string, value: number | undefined) => void;
}
```

相关定义：[IPolarPoint](AdditionalTypes-Type-Definition.md#type-d403c828183d)、[IPoint](AdditionalTypes-Type-Definition.md#type-58fdfd9a6a7b)、[IBaseScale](AdditionalTypes-Type-Definition.md#type-f4ea6ab4e67d)

<a id="type-9dc0e97c311d"></a>
## IPolarGrid

来源：`packages/vchart/src/component/axis/polar/interface/common.ts`，VChart 2.1.7

```typescript
export type IPolarGrid = IGrid & {
  /**
   * smooth 为 true 时，为圆形 grid，为 false 则为多边形 grid
   * @default false
   */
  smooth?: boolean;
};
```

相关定义：[IGrid](AdditionalTypes-Type-Definition.md#type-1de217f01390)

<a id="type-b43b48bb37ff"></a>
## IPolarAxisCommonSpec

来源：`packages/vchart/src/component/axis/polar/interface/spec.ts`，VChart 2.1.7

```typescript
export type IPolarAxisCommonSpec = Omit<ICommonAxisSpec, 'center'> & {
  /**
   * 布局半径，相当于计算内径、外径的基准值
   * 默认值为: region宽度、高度最小值的一般
   * @since 1.11.2
   */
  layoutRadius?: 'auto' | number | ((layoutRect: ILayoutRect, center: IPointLike) => number);
  /**
   * 当配置了 innerRadius 时，可以通过设置 inside: true，将坐标轴展示在内圆。
   * @default false
   */
  inside?: boolean;
  /**
   * 轴位置，枚举类型，支持：`'radius'` 和 `'angle'`
   * - `'radius'` 代表半径轴
   * - `'angle'` 代表角度轴
   */
  orient: IPolarOrientType;
  /**
   * 网格线配置
   */
  grid?: IPolarGrid;
  /**
   * 轴的外半径，数值范围 0 -1
   */
  radius?: number;
  /**
   * 子网格线配置
   */
  subGrid?: IPolarGrid;
  /**
   * 轴线配置
   */
  domainLine?: IDomainLine;
  /**
   * 轴标签配置
   */
  label?: IPolarAxisLabel;
  /**
   * 轴标题配置
   */
  title?: ITitle;
  /**
   * 内半径（比例值，取值范围 0~1）
   */
  innerRadius?: number;
  /**
   * 外半径（比例值，取值范围 0~1）
   */
  outerRadius?: number;
  /**
   * 中心点
   * @since 1.11.2 x,y 支持百分比的值，如`50%`
   */
  center?: { x: number | string; y: number | string };
  /**
   * 起始角度
   */
  startAngle?: number;
  /**
   * 终止角度
   */
  endAngle?: number;
};
```

相关定义：[ICommonAxisSpec](AdditionalTypes-Type-Definition.md#type-500cf18886a4)、[ILayoutRect](AdditionalTypes-Type-Definition.md#type-b4324e55ab6b)、[IPointLike](AdditionalTypes-Type-Definition.md#type-e25b463f6cfe)、[IPolarOrientType](AdditionalTypes-Type-Definition.md#type-ccede16adcb5)、[IPolarGrid](AdditionalTypes-Type-Definition.md#type-9dc0e97c311d)、[IDomainLine](AdditionalTypes-Type-Definition.md#type-89c12f9d6546)、[IPolarAxisLabel](AdditionalTypes-Type-Definition.md#type-fc89a697d2d9)、[ITitle](AdditionalTypes-Type-Definition.md#type-d18262dc39a4)

<a id="type-fc89a697d2d9"></a>
## IPolarAxisLabel

来源：`packages/vchart/src/component/axis/polar/interface/spec.ts`，VChart 2.1.7

```typescript
export type IPolarAxisLabel = ILabel &
  Pick<
    AxisLabelOverlap,
    'autoHide' | 'autoHideMethod' | 'autoHideSeparation' | 'autoLimit' | 'limitEllipsis' | 'layoutFunc' | 'autoWrap'
  > & {
    /**
     * 是否自动限制标签最大宽度（开启基于布局的宽度控制）
     * @since 2.0.12
     */
    autoLabelMaxWidth?: boolean;
  };
```

相关定义：[ILabel](AdditionalTypes-Type-Definition.md#type-f22047f767c3)、[AxisLabelOverlap](AdditionalTypes-Type-Definition.md#type-92b85bf48fbb)

<a id="type-3621aa2a35eb"></a>
## IPolarBandAxisSpec

来源：`packages/vchart/src/component/axis/polar/interface/spec.ts`，VChart 2.1.7

```typescript
export type IPolarBandAxisSpec = IPolarAxisCommonSpec & IBandAxisSpec;
```

相关定义：[IPolarAxisCommonSpec](AdditionalTypes-Type-Definition.md#type-b43b48bb37ff)、[IBandAxisSpec](AdditionalTypes-Type-Definition.md#type-63185662c008)

<a id="type-1ee0a50d0f01"></a>
## IPolarLinearAxisSpec

来源：`packages/vchart/src/component/axis/polar/interface/spec.ts`，VChart 2.1.7

```typescript
export type IPolarLinearAxisSpec = IPolarAxisCommonSpec & ILinearAxisSpec;
```

相关定义：[IPolarAxisCommonSpec](AdditionalTypes-Type-Definition.md#type-b43b48bb37ff)、[ILinearAxisSpec](ILinearAxisSpec-Type-Definition.md)

<a id="type-d23c51c12154"></a>
## IComponentSpec

来源：`packages/vchart/src/component/base/interface.ts`，VChart 2.1.7

```typescript
export interface IComponentSpec extends IModelSpec {
  /**
   * 组件关联的region索引
   * @default 0
   */
  regionIndex?: number | number[];
  /**
   * 组件关联的region id
   */
  regionId?: StringOrNumber | StringOrNumber[];
  /**
   * 组件关联的系列索引
   */
  seriesIndex?: number | number[];
  /**
   * 组件关联的系列id
   */
  seriesId?: StringOrNumber | StringOrNumber[];
}
```

相关定义：[IModelSpec](AdditionalTypes-Type-Definition.md#type-93f598dd1ef8)、[StringOrNumber](AdditionalTypes-Type-Definition.md#type-2f92a26f4727)

<a id="type-2c1a18c2e6b2"></a>
## ICrosshairSpec

来源：`packages/vchart/src/component/crosshair/interface/spec.ts`，VChart 2.1.7

```typescript
export type ICrosshairSpec = ICartesianCrosshairSpec | IPolarCrosshairSpec;
```

相关定义：[ICartesianCrosshairSpec](ICartesianCrosshairSpec-Type-Definition.md)、[IPolarCrosshairSpec](IPolarCrosshairSpec-Type-Definition.md)

<a id="type-73cca056070b"></a>
## IGeoCoordinateHelper

来源：`packages/vchart/src/component/geo/interface.ts`，VChart 2.1.7

```typescript
export interface IGeoCoordinateHelper {
  longitudeField?: string;
  latitudeField?: string;

  dataToPosition: (values: [number, number]) => IPoint;
  dataToLatitude: (lat: number) => number;
  dataToLongitude: (lon: number) => number;

  shape: (datum: any) => string;

  getCoordinateId: () => number;
}
```

相关定义：[IPoint](AdditionalTypes-Type-Definition.md#type-58fdfd9a6a7b)

<a id="type-5d7fe81ad96c"></a>
## IComponent

来源：`packages/vchart/src/component/interface/common.ts`，VChart 2.1.7

```typescript
export interface IComponent extends ILayoutModel {
  readonly name: string;

  // 区域
  getRegions: () => IRegion[];
  getBindSeriesFilter?: () => ISeriesFilter;
  getVRenderComponents: () => IGraphic[];

  // 清空，用于更新等场景
  clear: () => void;

  // 数据
  getDatum: (childGraphic?: IGraphic) => any | undefined;
}
```

相关定义：[ILayoutModel](AdditionalTypes-Type-Definition.md#type-b788a1bf7960)、[IRegion](AdditionalTypes-Type-Definition.md#type-a83d28f54f24)、[ISeriesFilter](AdditionalTypes-Type-Definition.md#type-547a568e3f15)、[IGraphic](AdditionalTypes-Type-Definition.md#type-a766bc91cce3)

<a id="type-897b853a0458"></a>
## IComponentConstructor

来源：`packages/vchart/src/component/interface/common.ts`，VChart 2.1.7

```typescript
export interface IComponentConstructor extends IModelConstructor {
  type: string;
  specKey?: string;
  getSpecInfo?: (chartSpec: any, chartSpecInfo?: IChartSpecInfo) => Maybe<IModelSpecInfo[]>;
  createComponent: (specInfo: IModelSpecInfo, options: IComponentOption) => IComponent;
  new (spec: any, options: IComponentOption): IComponent;
}
```

相关定义：[IModelConstructor](AdditionalTypes-Type-Definition.md#type-b2886ff503c6)、[IChartSpecInfo](AdditionalTypes-Type-Definition.md#type-618e9dfe06cf)、[Maybe](AdditionalTypes-Type-Definition.md#type-644c0bc1509c)、[IModelSpecInfo](AdditionalTypes-Type-Definition.md#type-854f78cb6f0a)、[IComponentOption](AdditionalTypes-Type-Definition.md#type-3aea69e255fe)、[IComponent](AdditionalTypes-Type-Definition.md#type-5d7fe81ad96c)

<a id="type-3aea69e255fe"></a>
## IComponentOption

来源：`packages/vchart/src/component/interface/common.ts`，VChart 2.1.7

```typescript
export interface IComponentOption extends IModelOption {
  // 区域
  getAllRegions: () => IRegion[];
  getRegionsInIndex: (index?: number[]) => IRegion[];
  getRegionsInIds: (ids: number[]) => IRegion[];
  getRegionsInUserIdOrIndex: (user_ids?: StringOrNumber[], index?: number[]) => IRegion[];
  // series
  getAllSeries: () => ISeries[];
  getSeriesInIndex: (index?: number[]) => ISeries[];
  getSeriesInIds: (ids?: number[]) => ISeries[];
  getSeriesInUserIdOrIndex: (user_ids?: StringOrNumber[], index?: number[]) => ISeries[];
  // component
  getAllComponents: () => IComponent[];
  getComponentByIndex: (key: string, index: number) => IComponent | undefined;
  getComponentByUserId: (userId: StringOrNumber) => IComponent | undefined;
  getComponentsByKey: (key: string) => IComponent[];
  getComponentsByType: (type: string) => IComponent[];
}
```

相关定义：[IModelOption](AdditionalTypes-Type-Definition.md#type-f2d5e89f0268)、[IRegion](AdditionalTypes-Type-Definition.md#type-a83d28f54f24)、[StringOrNumber](AdditionalTypes-Type-Definition.md#type-2f92a26f4727)、[ISeries](AdditionalTypes-Type-Definition.md#type-29ca9e871dc0)、[IComponent](AdditionalTypes-Type-Definition.md#type-5d7fe81ad96c)

<a id="type-da1c88fe2ca8"></a>
## ComponentTypeEnum

来源：`packages/vchart/src/component/interface/type.ts`，VChart 2.1.7

```typescript
export enum ComponentTypeEnum {
  cartesianAxis = 'cartesianAxis',
  cartesianBandAxis = 'cartesianAxis-band',
  cartesianLinearAxis = 'cartesianAxis-linear',
  cartesianTimeAxis = 'cartesianAxis-time',
  cartesianLogAxis = 'cartesianAxis-log',
  cartesianSymlogAxis = 'cartesianAxis-symlog',
  polarAxis = 'polarAxis',
  polarBandAxis = 'polarAxis-band',
  polarLinearAxis = 'polarAxis-linear',
  crosshair = 'crosshair',
  cartesianCrosshair = 'cartesianCrosshair',
  polarCrosshair = 'polarCrosshair',
  dataZoom = 'dataZoom',
  geoCoordinate = 'geoCoordinate',
  indicator = 'indicator',
  discreteLegend = 'discreteLegend',
  continuousLegend = 'continuousLegend',
  colorLegend = 'colorLegend',
  sizeLegend = 'sizeLegend',
  markLine = 'markLine',
  markArea = 'markArea',
  markPoint = 'markPoint',
  polarMarkLine = 'polarMarkLine',
  polarMarkArea = 'polarMarkArea',
  polarMarkPoint = 'polarMarkPoint',
  geoMarkPoint = 'geoMarkPoint',
  tooltip = 'tooltip',
  title = 'title',
  player = 'player',
  scrollBar = 'scrollBar',
  label = 'label',
  totalLabel = 'totalLabel',

  brush = 'brush',

  poptip = 'poptip',

  customMark = 'customMark'
}
```

<a id="type-c5e997daff79"></a>
## ILabelInfo

来源：`packages/vchart/src/component/label/interface.ts`，VChart 2.1.7

```typescript
export interface ILabelInfo {
  baseMark: IMark;
  labelMark: ILabelMark;
  series: ISeries;
  labelSpec: TransformedLabelSpec;
}
```

相关定义：[IMark](AdditionalTypes-Type-Definition.md#type-50aedeb586cf)、[ILabelMark](AdditionalTypes-Type-Definition.md#type-e9520a36483b)、[ISeries](AdditionalTypes-Type-Definition.md#type-29ca9e871dc0)、[TransformedLabelSpec](AdditionalTypes-Type-Definition.md#type-cc4522eb0b63)

<a id="type-cc4522eb0b63"></a>
## TransformedLabelSpec

来源：`packages/vchart/src/component/label/interface.ts`，VChart 2.1.7

```typescript
export type TransformedLabelSpec = ILabelSpec & {
  getStyleHandler: (series: ISeries) => (mark?: ILabelMark, spec?: any) => void;
};
```

相关定义：[ILabelSpec](ILabelSpec-Type-Definition.md)、[ISeries](AdditionalTypes-Type-Definition.md#type-29ca9e871dc0)、[ILabelMark](AdditionalTypes-Type-Definition.md#type-e9520a36483b)

<a id="type-002e36355ca4"></a>
## ContinuousLegendTextStyle

来源：`packages/vchart/src/component/legend/continuous/interface.ts`，VChart 2.1.7

```typescript
type ContinuousLegendTextStyle = Omit<NoVisibleMarkStyle<ITextMarkSpec>, 'text'>;
```

相关定义：[NoVisibleMarkStyle](AdditionalTypes-Type-Definition.md#type-bf107a034542)、[ITextMarkSpec](ITextMarkSpec-Type-Definition.md)

<a id="type-9281e10d6686"></a>
## ContinuousLegendTextStyleCallback

来源：`packages/vchart/src/component/legend/continuous/interface.ts`，VChart 2.1.7

```typescript
type ContinuousLegendTextStyleCallback = (
  value: Text,
  position: 'start' | 'end',
  context: HandlerTextStyleContext
) => ContinuousLegendTextStyle | undefined;
```

相关定义：[Text](AdditionalTypes-Type-Definition.md#type-960aad16c272)、[HandlerTextStyleContext](AdditionalTypes-Type-Definition.md#type-589dee7f19a8)、[ContinuousLegendTextStyle](AdditionalTypes-Type-Definition.md#type-002e36355ca4)

<a id="type-a72bb8927b69"></a>
## HandlerTextAttribute

来源：`packages/vchart/src/component/legend/continuous/interface.ts`，VChart 2.1.7

```typescript
export type HandlerTextAttribute = {
  /** 是否展示 */
  visible?: boolean;
  /**
   * 数据展示的小数精度，默认为0，无小数点。
   */
  precision?: number;
  /** 文本内容格式化函数 */
  formatter?: (text: Text) => Text;
  /**
   * 文本同滑块的间距，默认为 6
   */
  space?: number;
  /**
   * 文本样式
   */
  style?: ContinuousLegendTextStyle | ContinuousLegendTextStyleCallback;
};
```

相关定义：[Text](AdditionalTypes-Type-Definition.md#type-960aad16c272)、[ContinuousLegendTextStyle](AdditionalTypes-Type-Definition.md#type-002e36355ca4)、[ContinuousLegendTextStyleCallback](AdditionalTypes-Type-Definition.md#type-9281e10d6686)

<a id="type-8565dc89d142"></a>
## IColorLegendSpec

来源：`packages/vchart/src/component/legend/continuous/interface.ts`，VChart 2.1.7

```typescript
export type IColorLegendSpec = IContinuousLegendSpec & {
  /**
   * 声明 color 类型图例
   */
  type: 'color';
};
```

相关定义：[IContinuousLegendSpec](AdditionalTypes-Type-Definition.md#type-178043e98fbb)

<a id="type-178043e98fbb"></a>
## IContinuousLegendSpec

来源：`packages/vchart/src/component/legend/continuous/interface.ts`，VChart 2.1.7

```typescript
export type IContinuousLegendSpec = ILegendCommonSpec & {
  /**
   * 连续图例是否开启反向展示，最小值和最大值会发生反向
   * @default false
   * @since 1.11.0
   */
  inverse?: boolean;
  /**
   * 声明关联的映射字段
   */
  field?: string;
  /**
   * 连续图例关联的映射 scale
   */
  scale?: string;
  /**
   * 默认筛选的数据范围
   */
  defaultSelected?: [number, number];
  /**
   * 是否允许拖动，默认为 true
   */
  slidable?: boolean;
  /**
   * 滑块轨道配置
   */
  rail?: {
    /**
     * 滑块的宽度
     */
    width?: number;
    /**
     * 滑块的高度
     */
    height?: number;
    /**
     * 背景轨道样式配置
     */
    style?: Omit<NoVisibleMarkStyle<IRectMarkSpec>, 'width' | 'height'>;
  };
  /**
   * 滑块手柄配置
   */
  handler?: {
    /**
     * 是否绘制 handler，默认为 true
     */
    visible?: boolean;
    /**
     * 滑块手柄的样式配置
     */
    style?: NoVisibleMarkStyle<ISymbolMarkSpec>;
  };
  /**
   * 选中区域样式配置
   */
  track?: {
    style?: Omit<NoVisibleMarkStyle<IRectMarkSpec>, 'width' | 'height'>;
  };
  /**
   * 滑块首部文本配置
   */
  startText?: TextAttribute;
  /**
   * 滑块尾部文本配置
   */
  endText?: TextAttribute;
  /**
   * 滑块对应的文本配置项
   */
  handlerText?: HandlerTextAttribute;
};
```

相关定义：[ILegendCommonSpec](AdditionalTypes-Type-Definition.md#type-2ad671a416ad)、[NoVisibleMarkStyle](AdditionalTypes-Type-Definition.md#type-bf107a034542)、[IRectMarkSpec](IRectMarkSpec-Type-Definition.md)、[ISymbolMarkSpec](ISymbolMarkSpec-Type-Definition.md)、[TextAttribute](AdditionalTypes-Type-Definition.md#type-2a9351a6ae07)、[HandlerTextAttribute](AdditionalTypes-Type-Definition.md#type-a72bb8927b69)

<a id="type-19c6d929a8de"></a>
## ISizeLegendSpec

来源：`packages/vchart/src/component/legend/continuous/interface.ts`，VChart 2.1.7

```typescript
export type ISizeLegendSpec = IContinuousLegendSpec & {
  /**
   * 声明 size 类型图例
   */
  type: 'size';
  /**
   * size 背景样式配置
   */
  sizeBackground?: Omit<NoVisibleMarkStyle<IRectMarkSpec>, 'visible' | 'width' | 'height'>;
  /**
   * 指定组件中手柄和文字的摆放位置，可选值为：
   * 'left' 手柄和label在滑块左侧，layout 为 vertical 时有效。
   * 'right' 手柄和label在滑块右侧，layout 为 vertical 时有效。
   * 'top' 手柄和label在滑块上侧，layout 为 horizontal 时有效。
   * 'bottom' 手柄和label在滑块下侧，layout 为 horizontal 时有效。
   */
  align?: 'top' | 'bottom' | 'left' | 'right';
};
```

相关定义：[IContinuousLegendSpec](AdditionalTypes-Type-Definition.md#type-178043e98fbb)、[NoVisibleMarkStyle](AdditionalTypes-Type-Definition.md#type-bf107a034542)、[IRectMarkSpec](IRectMarkSpec-Type-Definition.md)

<a id="type-960aad16c272"></a>
## Text

来源：`packages/vchart/src/component/legend/continuous/interface.ts`，VChart 2.1.7

```typescript
type Text = StringOrNumber;
```

相关定义：[StringOrNumber](AdditionalTypes-Type-Definition.md#type-2f92a26f4727)

<a id="type-2a9351a6ae07"></a>
## TextAttribute

来源：`packages/vchart/src/component/legend/continuous/interface.ts`，VChart 2.1.7

```typescript
export type TextAttribute = {
  /** 是否展示 */
  visible?: boolean;
  /** 文本内容 */
  text?: Text;
  /**
   * 文本同滑块的间距，默认为 6
   */
  space?: number;
  /**
   * 文本样式
   */
  style?: ContinuousLegendTextStyle;
};
```

相关定义：[Text](AdditionalTypes-Type-Definition.md#type-960aad16c272)、[ContinuousLegendTextStyle](AdditionalTypes-Type-Definition.md#type-002e36355ca4)

<a id="type-fba860215816"></a>
## DiscreteLegendArrangeCount

来源：`packages/vchart/src/component/legend/discrete/interface.ts`，VChart 2.1.7

```typescript
export type DiscreteLegendArrangeCount = number | ((ctx: IDiscreteLegendArrangeContext) => number);
```

相关定义：[IDiscreteLegendArrangeContext](AdditionalTypes-Type-Definition.md#type-b2a5329df03f)

<a id="type-38a35ad3a73f"></a>
## formatterCallback

来源：`packages/vchart/src/component/legend/discrete/interface.ts`，VChart 2.1.7

```typescript
export type formatterCallback = IFormatMethod<[text: StringOrNumber, item: LegendItemDatum, index: number]>;
```

相关定义：[IFormatMethod](AdditionalTypes-Type-Definition.md#type-6375b3333257)、[StringOrNumber](AdditionalTypes-Type-Definition.md#type-2f92a26f4727)、[LegendItemDatum](AdditionalTypes-Type-Definition.md#type-75bc5c7a36bf)

<a id="type-b2a5329df03f"></a>
## IDiscreteLegendArrangeContext

来源：`packages/vchart/src/component/legend/discrete/interface.ts`，VChart 2.1.7

```typescript
export interface IDiscreteLegendArrangeContext {
  /** the layout rect allocated to the legend in the current layout */
  rect: ILayoutRect;
  /** the resolved orient the legend lays out with (defaults to `'left'` when `spec.orient` is unset) */
  orient: IOrientType;
  /** the id of the legend */
  id?: StringOrNumber;
}
```

相关定义：[ILayoutRect](AdditionalTypes-Type-Definition.md#type-b4324e55ab6b)、[IOrientType](AdditionalTypes-Type-Definition.md#type-1c1f18d62ff6)、[StringOrNumber](AdditionalTypes-Type-Definition.md#type-2f92a26f4727)

<a id="type-c58e01a94725"></a>
## IDiscreteLegendPagerCallbackContext

来源：`packages/vchart/src/component/legend/discrete/interface.ts`，VChart 2.1.7

```typescript
export interface IDiscreteLegendPagerCallbackContext extends IDiscreteLegendArrangeContext {
  /** the resolved maximum row count, when configured */
  maxRow?: number;
  /** the resolved maximum column count, when configured */
  maxCol?: number;
}
```

相关定义：[IDiscreteLegendArrangeContext](AdditionalTypes-Type-Definition.md#type-b2a5329df03f)

<a id="type-0db130a1ae74"></a>
## IDiscreteLegendSpec

来源：`packages/vchart/src/component/legend/discrete/interface.ts`，VChart 2.1.7

```typescript
export type IDiscreteLegendSpec = ILegendCommonSpec & {
  type?: 'discrete';
  /**
   * 在原始图例绘制数据的基础上，进行自定义，比如可以自定义 value 值
   * @param data 图例的绘制数据
   * @param colorScale 全局颜色映射 scale
   * @param globalScale 图表上所有的 scale
   * @returns
   */
  data?: (data: LegendItemDatum[], colorScale: IBaseScale, globalScale: IGlobalScale) => LegendItemDatum[];

  /** 图例项配置 */
  item?: IItem;

  /**
   * 翻页器配置
   */
  pager?: IPager | ILegendScrollbar;
  /**
   * scale must match the id of the scale configured in **scales**
   * 离散图例对应的scale
   * @since 1.10.5
   */
  scale?: string;
  /**
   * 同`scale`，为了和连续图例保持一致，建议统一为`scale`
   */
  scaleName?: string;
  /**
   * After the legend is bound to the scale, the dimension associated with the series data and the legend can be configured through field.
   * If the field is not configured, the first item of fields in the domain of scale is used by default
   * If the domain of the scale is not dependent on data statistics, series.getSeriesField() is used by default
   */
  field?: string;
  /**
   * 默认筛选的数据范围
   */
  defaultSelected?: string[];
  /**
   * The maximum number of rows displayed (for horizontal legend). Besides a fixed number, a
   * callback `(ctx) => number` is also supported, which is evaluated during layout so the row
   * count can adapt to the space allocated to the legend.
   * @since 2.0.23
   */
  maxRow?: DiscreteLegendArrangeCount;
  /**
   * The maximum number of columns displayed (for vertical legend). Besides a fixed number, a
   * callback `(ctx) => number` is also supported (see {@link maxRow}).
   * @since 2.0.23
   */
  maxCol?: DiscreteLegendArrangeCount;
} & Omit<DiscreteLegendAttrs, 'layout' | 'title' | 'items' | 'item' | 'pager' | 'maxRow' | 'maxCol'>;
```

相关定义：[ILegendCommonSpec](AdditionalTypes-Type-Definition.md#type-2ad671a416ad)、[LegendItemDatum](AdditionalTypes-Type-Definition.md#type-75bc5c7a36bf)、[IBaseScale](AdditionalTypes-Type-Definition.md#type-f4ea6ab4e67d)、[IGlobalScale](AdditionalTypes-Type-Definition.md#type-86e42efb33dd)、[IItem](AdditionalTypes-Type-Definition.md#type-57549774cd09)、[IPager](AdditionalTypes-Type-Definition.md#type-f566fb09d5b0)、[ILegendScrollbar](AdditionalTypes-Type-Definition.md#type-d1127d0675cd)、[DiscreteLegendArrangeCount](AdditionalTypes-Type-Definition.md#type-fba860215816)、[DiscreteLegendAttrs](AdditionalTypes-Type-Definition.md#type-8f8c60190b3e)

<a id="type-57549774cd09"></a>
## IItem

来源：`packages/vchart/src/component/legend/discrete/interface.ts`，VChart 2.1.7

```typescript
export type IItem = {
  /**
   * @since 1.10.0
   * 指定图例项中图标和文字的摆放位置，可选值为：
   * 'left' 图标在左侧
   * 'right' 图标在右侧
   * 默认值为： 'left'
   */
  align?: 'left' | 'right';
  /**
   * 图例项背景配置
   */
  background?: {
    /**
     * 是否展示图例项背景
     */
    visible?: boolean;
  } & LegendItemStyle<LegendItemStyleValue<NoVisibleMarkStyle<IRectMarkSpec>>>;
  /**
   * 图例项的 shape 图标的配置
   */
  shape?: {
    /**
     * 图例项的 shape 图标
     */
    visible?: boolean;
    /** shape 同后面 label 的间距 */
    space?: number;
  } & LegendItemStyle<LegendItemStyleValue<Partial<NoVisibleMarkStyle<ISymbolMarkSpec>>>>;
  /**
   * 图例项的 label 文本配置
   */
  label?: {
    /**
     * @since 1.10.0
     * 当 label + value 同时展示，文字超长的时候，label的宽度占比
     */
    widthRatio?: number;
    /**
     * 图例项 label 同后面 value 的间距
     */
    space?: number;
    /**
     * 格式化文本函数
     */
    formatMethod?: formatterCallback;
    /**
     * 格式化模板
     * @description 可以通过类似 `{value:.2f}%` 的形式对指定数据字段进行格式化
     * @since 1.10.0
     */
    formatter?: string;
  } & LegendItemStyle<LegendItemStyleValue<NoVisibleMarkStyle<ITextMarkSpec>>>;
  /**
   * 图例项 value 配置
   */
  value?: {
    /**
     * @since 1.10.0
     * 当 label + value 同时展示，文字超长的时候，label的宽度占比
     */
    widthRatio?: number;
    /** value 同后面元素的间距 */
    space?: number;
    /**
     * 是否右对齐显示，仅当设置图例项宽度 itemWidth 时生效
     * 默认为 false，
     */
    alignRight?: boolean;
    /**
     * 格式化文本函数
     */
    formatMethod?: formatterCallback;
    /**
     * 格式化模板
     * @description 可以通过类似 `{value:.2f}%` 的形式对指定数据字段进行格式化
     * @since 1.10.0
     */
    formatter?: string | string[];
  } & LegendItemStyle<LegendItemStyleValue<NoVisibleMarkStyle<ITextMarkSpec>>>;
  /**
   * 聚焦按钮配置
   */
  focusIconStyle?: NoVisibleMarkStyle<ISymbolMarkSpec>;
  /**
   * 图例项的最大宽度，默认为 null。
   * 可使用百分比，表示显示区域的宽度占比。
   */
  maxWidth?: number | string;
  /**
   * 图例项的宽度, 默认自动计算。
   * 可使用百分比，表示显示区域的宽度占比。
   */
  width?: number | string;
  /**
   * 图例的高度，默认自动计算。
   * 可使用百分比，表示显示区域的高度占比。
   */
  height?: number | string;
  /**
   * @since 1.10.0
   * 当label+ value同时存在的时候，自动省略的策略
   * 'labelFirst' - 尽量保证完整展示`label`
   * 'valueFirst' - 尽量保证完整展示`value`
   * 'none' - 按照`widthRatio`展示label 和 value
   */
  autoEllipsisStrategy?: 'labelFirst' | 'valueFirst' | 'none';
} & Omit<LegendItem, 'background' | 'shape' | 'label' | 'value' | 'focusIconStyle' | 'width' | 'height' | 'maxWidth'>;
```

相关定义：[LegendItemStyle](AdditionalTypes-Type-Definition.md#type-643f46f185c3)、[LegendItemStyleValue](AdditionalTypes-Type-Definition.md#type-4f178926a3e4)、[NoVisibleMarkStyle](AdditionalTypes-Type-Definition.md#type-bf107a034542)、[IRectMarkSpec](IRectMarkSpec-Type-Definition.md)、[ISymbolMarkSpec](ISymbolMarkSpec-Type-Definition.md)、[formatterCallback](AdditionalTypes-Type-Definition.md#type-38a35ad3a73f)、[ITextMarkSpec](ITextMarkSpec-Type-Definition.md)、[LegendItem](AdditionalTypes-Type-Definition.md#type-1b703f3ae381)

<a id="type-d1127d0675cd"></a>
## ILegendScrollbar

来源：`packages/vchart/src/component/legend/discrete/interface.ts`，VChart 2.1.7

```typescript
export type ILegendScrollbar = {
  type: 'scrollbar';
  railStyle?: Omit<Partial<NoVisibleMarkStyle<IRectMarkSpec>>, 'width' | 'height'>;
  sliderStyle?: Omit<Partial<NoVisibleMarkStyle<IRectMarkSpec>>, 'width' | 'height'>;
} & Omit<LegendScrollbarAttributes, 'railStyle' | 'sliderStyle'>;
```

相关定义：[NoVisibleMarkStyle](AdditionalTypes-Type-Definition.md#type-bf107a034542)、[IRectMarkSpec](IRectMarkSpec-Type-Definition.md)、[LegendScrollbarAttributes](AdditionalTypes-Type-Definition.md#type-8dec8f9540ef)

<a id="type-f566fb09d5b0"></a>
## IPager

来源：`packages/vchart/src/component/legend/discrete/interface.ts`，VChart 2.1.7

```typescript
export type IPager = {
  /**
   * 文本样式配置
   */
  textStyle?: Partial<NoVisibleMarkStyle<ITextMarkSpec>>;
  handler?: {
    /**
     * 按钮同文本内容区的间距，默认为 8
     */
    space?: number;
    /**
     * 上一页按钮形状
     */
    preShape?: string;
    /**
     * 下一页按钮形状
     */
    nextShape?: string;
    style?: Omit<NoVisibleMarkStyle<ISymbolMarkSpec>, 'symbolType'>;
    state?: {
      /**
       * hover 状态下的样式
       */
      hover?: Omit<NoVisibleMarkStyle<ISymbolMarkSpec>, 'symbolType'>;
      /**
       * 不可用状态样式
       */
      disable?: Omit<NoVisibleMarkStyle<ISymbolMarkSpec>, 'symbolType'>;
    };
  };
  /**
   * The layout of the pager. A callback is evaluated during layout after `maxRow` / `maxCol`
   * have been resolved, allowing the pager handlers to adapt to a multi-row / multi-column legend.
   * @since 2.2.0
   */
  layout?: LegendPagerLayout | ((ctx: IDiscreteLegendPagerCallbackContext) => LegendPagerLayout);
  /**
   * The cross-axis position of the pager. A callback is evaluated during layout after `maxRow` /
   * `maxCol` have been resolved, allowing the pager alignment to adapt to the resolved page layout.
   * @since 2.2.0
   */
  position?: LegendPagerPosition | ((ctx: IDiscreteLegendPagerCallbackContext) => LegendPagerPosition);
} & Omit<LegendPagerAttributes, 'textStyle' | 'handler' | 'layout' | 'position'>;
```

相关定义：[NoVisibleMarkStyle](AdditionalTypes-Type-Definition.md#type-bf107a034542)、[ITextMarkSpec](ITextMarkSpec-Type-Definition.md)、[ISymbolMarkSpec](ISymbolMarkSpec-Type-Definition.md)、[LegendPagerLayout](AdditionalTypes-Type-Definition.md#type-a73f71981dd9)、[IDiscreteLegendPagerCallbackContext](AdditionalTypes-Type-Definition.md#type-c58e01a94725)、[LegendPagerPosition](AdditionalTypes-Type-Definition.md#type-f597fa365630)、[LegendPagerAttributes](AdditionalTypes-Type-Definition.md#type-833ac1fb317b)

<a id="type-643f46f185c3"></a>
## LegendItemStyle

来源：`packages/vchart/src/component/legend/discrete/interface.ts`，VChart 2.1.7

```typescript
export type LegendItemStyle<T> = {
  /**
   * 样式配置
   */
  style?: T;
  /**
   * 状态样式配置
   */
  state?: {
    /**
     * 选中态
     */
    selected?: T;
    /**
     * 非选中态
     */
    unSelected?: T;
    /**
     * 选中态 hover
     */
    selectedHover?: T;
    /**
     * 非选中态 hover
     */
    unSelectedHover?: T;
  };
};
```

<a id="type-4f178926a3e4"></a>
## LegendItemStyleValue

来源：`packages/vchart/src/component/legend/discrete/interface.ts`，VChart 2.1.7

```typescript
export type LegendItemStyleValue<T> =
  | T
  | ((item: LegendItemDatum, isSelected: boolean, index: number, allItems: LegendItemDatum[]) => T);
```

相关定义：[LegendItemDatum](AdditionalTypes-Type-Definition.md#type-75bc5c7a36bf)

<a id="type-a73f71981dd9"></a>
## LegendPagerLayout

来源：`packages/vchart/src/component/legend/discrete/interface.ts`，VChart 2.1.7

```typescript
export type LegendPagerLayout = 'horizontal' | 'vertical';
```

<a id="type-f597fa365630"></a>
## LegendPagerPosition

来源：`packages/vchart/src/component/legend/discrete/interface.ts`，VChart 2.1.7

```typescript
export type LegendPagerPosition = 'start' | 'middle' | 'end';
```

<a id="type-a385f1cab926"></a>
## ILegend

来源：`packages/vchart/src/component/legend/interface.ts`，VChart 2.1.7

```typescript
export type ILegend = IComponent & {
  getLegendData: () => Datum[];
  getSelectedData: () => StringOrNumber[];
  setSelectedData: (d: StringOrNumber[]) => void;
};
```

相关定义：[IComponent](AdditionalTypes-Type-Definition.md#type-5d7fe81ad96c)、[Datum](AdditionalTypes-Type-Definition.md#type-bf5eb9a79e61)、[StringOrNumber](AdditionalTypes-Type-Definition.md#type-2f92a26f4727)

<a id="type-2ad671a416ad"></a>
## ILegendCommonSpec

来源：`packages/vchart/src/component/legend/interface.ts`，VChart 2.1.7

```typescript
export type ILegendCommonSpec = {
  /**
   * 是否显示图例
   * @default true
   */
  visible?: boolean;
  /**
   * 图例的位置，相对于region区域的四个方位，
   * left - 图例在左侧
   * right - 图例在右侧
   * top - 图例在上方
   * bottom - 图例在下方
   * @default 'left'
   */
  orient?: IOrientType;
  /**
   * 图例在当前行或者列的对齐方式，起始 | 居中 | 末尾，
   * 对于orient为'left'或者'right'的图例，
   * start - 图例在左侧
   * middle - 图例居中
   * end - 图例在右侧
   * 对于orient为'top'或者'bottom'的图例，
   * start - 图例在上方
   * middle - 图例居中
   * end - 图例在下方
   * @default 'middle'
   */
  position?: 'start' | 'middle' | 'end';
  /**
   * 图例组件的布局配置，默认自动跟随显示位置进行调整。
   * 1. `orient` 为 'top' 或者 'bottom' 时，默认为 'horizontal' 水平布局
   * 2. `orient` 为 'left' 或者 'right' 时，默认为 'vertical' 垂直布局
   */
  layout?: 'horizontal' | 'vertical';

  /**
   * 是否进行数据筛选，默认为 true
   */
  filter?: boolean;
  /**
   * 自定义筛选函数
   * @since 1.13.1
   * @param data 当前数据
   * @param selectedRange 选中的数据范围
   * @param datumField 筛选数据对应的字段
   * @returns 最终展示的数据
   */
  customFilter?: (data: any, selectedRange: StringOrNumber[], datumField: string) => any;

  /**
   * 图例标题配置
   */
  title?: ITitle;

  /**
   * 图例背景配置
   */
  background?: {
    /**
     * 是否绘制背景层
     */
    visible?: boolean;
    /**
     * 背景内边距
     */
    padding?: IPadding | number | number[];
    /**
     * 背景层样式
     */
    style?: Omit<NoVisibleMarkStyle<IRectMarkSpec>, 'visible' | 'width' | 'height'>;
  };
  /**
   * 是否允许交互
   * @default true
   */
  interactive?: boolean;
} & Omit<IComponentSpec, 'orient'>;
```

相关定义：[IOrientType](AdditionalTypes-Type-Definition.md#type-1c1f18d62ff6)、[StringOrNumber](AdditionalTypes-Type-Definition.md#type-2f92a26f4727)、[ITitle](AdditionalTypes-Type-Definition.md#type-22ab2af9147f)、[IPadding](IPadding-Type-Definition.md)、[NoVisibleMarkStyle](AdditionalTypes-Type-Definition.md#type-bf107a034542)、[IRectMarkSpec](IRectMarkSpec-Type-Definition.md)、[IComponentSpec](AdditionalTypes-Type-Definition.md#type-d23c51c12154)

<a id="type-22ab2af9147f"></a>
## ITitle

来源：`packages/vchart/src/component/legend/interface.ts`，VChart 2.1.7

```typescript
export type ITitle = {
  /** 标题文本样式 */
  textStyle?: NoVisibleMarkStyle<ITextMarkSpec>;
  /**
   * @deprecated 请使用 textStyle 配置文本样式
   */
  style?: NoVisibleMarkStyle<ITextMarkSpec>;
  /** 文本前 mark 图元 */
  shape?: {
    /**
     * 是否展示 shape
     */
    visible?: boolean;
    /**
     * shape 同 文本的间距
     */
    space?: number;
    style?: NoVisibleMarkStyle<ISymbolMarkSpec>;
  };
  /**
   * 标题的背景面板配置
   */
  background?: {
    /**
     * 是否绘制背景层
     */
    visible?: boolean;
    /**
     * 背景层样式
     */
    style?: Omit<NoVisibleMarkStyle<IRectMarkSpec>, 'visible' | 'width' | 'height'>;
  };
} & Omit<LegendTitle, 'textStyle' | 'style' | 'background'>;
```

相关定义：[NoVisibleMarkStyle](AdditionalTypes-Type-Definition.md#type-bf107a034542)、[ITextMarkSpec](ITextMarkSpec-Type-Definition.md)、[ISymbolMarkSpec](ISymbolMarkSpec-Type-Definition.md)、[IRectMarkSpec](IRectMarkSpec-Type-Definition.md)、[LegendTitle](AdditionalTypes-Type-Definition.md#type-c8f27ac5183b)

<a id="type-bf107a034542"></a>
## NoVisibleMarkStyle

来源：`packages/vchart/src/component/legend/interface.ts`，VChart 2.1.7

```typescript
export type NoVisibleMarkStyle<T> = Omit<T, 'visible'>;
```

<a id="type-952d359c9b51"></a>
## IAggrType

来源：`packages/vchart/src/component/marker/interface.ts`，VChart 2.1.7

```typescript
export type IAggrType = 'sum' | 'average' | 'min' | 'max' | 'variance' | 'standardDeviation' | 'median';
```

<a id="type-f2db44670f10"></a>
## IDataPointSpec

来源：`packages/vchart/src/component/marker/interface.ts`，VChart 2.1.7

```typescript
export type IDataPointSpec = {
  /**
   * 数据字段配置
   */
  [key: string]: IDataPos | IDataPosCallback;
  /**
   * 具体某个数据元素关联的series序号（仅在标注目标：数据元素下有效）
   */
  refRelativeSeriesIndex?: number;
  /**
   * 具体某个数据元素关联的series 的id（仅在标注目标：数据元素下有效）
   */
  refRelativeSeriesId?: StringOrNumber;
  /**
   * 指定使用 xField 上的那个维度索引，因为 xField 字段有可能会包含多个维度，比如分组场景
   * @default 0
   * @since 1.7.0
   */
  xFieldIndex?: number;
  /**
   * 指定使用 xField 上的维度名称，因为 xField 字段有可能会包含多个维度，比如分组场景。
   * `xFieldIndex` 和 `xFieldDim` 声明一个即可，同时声明则 `xFieldDim` 优先级更高。
   * @since 1.7.0
   */
  xFieldDim?: string;
  /**
   * 指定使用 yField 上的那个维度索引，因为 yField 字段有可能会包含多个维度，比如分组场景。
   * @default 0
   * @since 1.7.0
   */
  yFieldIndex?: number;
  /**
   * 指定使用 yField 上的维度名称，因为 yField 字段有可能会包含多个维度，比如分组场景。
   * `yFieldIndex` 和 `yFieldDim` 声明一个即可，同时声明则 `yFieldDim` 优先级更高。
   * @since 1.7.0
   */
  yFieldDim?: string;
  /**
   * 指定使用 angleField 上的那个维度索引，因为 angleField 字段有可能会包含多个维度，比如分组场景
   * @default 0
   * @since 1.11.0
   */
  angleFieldIndex?: number;
  /**
   * 指定使用 angleField 上的维度名称，因为 angleField 字段有可能会包含多个维度，比如分组场景。
   * `angleFieldIndex` 和 `angleFieldDim` 声明一个即可，同时声明则 `angleFieldDim` 优先级更高。
   * @since 1.11.0
   */
  angleFieldDim?: string;
  /**
   * 指定使用 radiusField 上的那个维度索引，因为 radiusField 字段有可能会包含多个维度，比如分组场景
   * @default 0
   * @since 1.11.0
   */
  radiusFieldIndex?: number;
  /**
   * 指定使用 radiusField 上的维度名称，因为 radiusField 字段有可能会包含多个维度，比如分组场景。
   * `radiusFieldIndex` 和 `radiusFieldDim` 声明一个即可，同时声明则 `radiusFieldDim` 优先级更高。
   * @since 1.11.0
   */
  radiusFieldDim?: string;
};
```

相关定义：[IDataPos](AdditionalTypes-Type-Definition.md#type-4e110ff2986a)、[IDataPosCallback](AdditionalTypes-Type-Definition.md#type-1379fa4fc2bc)、[StringOrNumber](AdditionalTypes-Type-Definition.md#type-2f92a26f4727)

<a id="type-4e110ff2986a"></a>
## IDataPos

来源：`packages/vchart/src/component/marker/interface.ts`，VChart 2.1.7

```typescript
export type IDataPos = StringOrNumber | IAggrType;
```

相关定义：[StringOrNumber](AdditionalTypes-Type-Definition.md#type-2f92a26f4727)、[IAggrType](AdditionalTypes-Type-Definition.md#type-952d359c9b51)

<a id="type-1379fa4fc2bc"></a>
## IDataPosCallback

来源：`packages/vchart/src/component/marker/interface.ts`，VChart 2.1.7

```typescript
export type IDataPosCallback = (
  relativeSeriesData: Datum[],
  startRelativeSeriesData: Datum[],
  endRelativeSeriesData: Datum[],
  relativeSeries: IMarkerSupportSeries,
  startRelativeSeries: IMarkerSupportSeries,
  endRelativeSeries: IMarkerSupportSeries
) => StringOrNumber;
```

相关定义：[Datum](AdditionalTypes-Type-Definition.md#type-8cb45fc9b0d9)、[IMarkerSupportSeries](AdditionalTypes-Type-Definition.md#type-cee3d7685723)、[StringOrNumber](AdditionalTypes-Type-Definition.md#type-2f92a26f4727)

<a id="type-2598f79dce37"></a>
## IMarkerAttributeContext

来源：`packages/vchart/src/component/marker/interface.ts`，VChart 2.1.7

```typescript
export type IMarkerAttributeContext = {
  vchart: IVChart;
  relativeSeries: IMarkerSupportSeries;
  startRelativeSeries: IMarkerSupportSeries;
  endRelativeSeries: IMarkerSupportSeries;
};
```

相关定义：[IVChart](AdditionalTypes-Type-Definition.md#type-f6dc633e5201)、[IMarkerSupportSeries](AdditionalTypes-Type-Definition.md#type-cee3d7685723)

<a id="type-88cab1c9cdbd"></a>
## IMarkerCrossSeriesSpec

来源：`packages/vchart/src/component/marker/interface.ts`，VChart 2.1.7

```typescript
export interface IMarkerCrossSeriesSpec {
  /**
   * 设置起点关联的系列，设置该系列的序号（仅在标注目标：坐标空间下有效）
   */
  startRelativeSeriesIndex?: number;
  /**
   * 设置终点关联的系列，设置该序列的序号（仅在标注目标：坐标空间下有效）
   */
  endRelativeSeriesIndex?: number;
  /**
   * 设置起点关联的系列，设置该系列的id（仅在标注目标：坐标空间下有效）
   */
  startRelativeSeriesId?: string;
  /**
   * 设置终点关联的系列，设置该序列的id（仅在标注目标：坐标空间下有效）
   */
  endRelativeSeriesId?: string;
  /**
   * 数据处理需要单独关联系列, 设置序列的序号来进行关联，当配置为'all'时代表关联当前region下所有系列
   * @since 1.11.0
   */
  specifiedDataSeriesIndex?: 'all' | number | number[];
  /**
   * 数据处理需要单独关联系列, 设置序列的id来进行关联，当配置为'all'时代表关联当前region下所有系列
   * @since 1.11.0
   */
  specifiedDataSeriesId?: 'all' | string | string[];
}
```

<a id="type-2d979381ccd7"></a>
## IMarkerLabelSpec

来源：`packages/vchart/src/component/marker/interface.ts`，VChart 2.1.7

```typescript
export type IMarkerLabelSpec = IMarkerLabelWithoutRefSpec & IMarkerRef;
```

相关定义：[IMarkerLabelWithoutRefSpec](AdditionalTypes-Type-Definition.md#type-253fe6ea4b96)、[IMarkerRef](AdditionalTypes-Type-Definition.md#type-542373c2f97e)

<a id="type-253fe6ea4b96"></a>
## IMarkerLabelWithoutRefSpec

来源：`packages/vchart/src/component/marker/interface.ts`，VChart 2.1.7

```typescript
export type IMarkerLabelWithoutRefSpec = {
  /**
   * 是否展示标注标签
   */
  visible?: boolean;
  /**
   * label整体 - 是否自动旋转
   */
  autoRotate?: boolean;
  /**
   * label整体 - 最小宽度，像素值
   * @default 30
   */
  minWidth?: number;
  /**
   * label整体 - 最大宽度，像素值。当文字超过最大宽度时，会自动省略。
   */
  maxWidth?: number;
  /**
   * label整体 - 背景面板配置
   */
  labelBackground?: {
    /**
     * 标签背景是否显示，是否可见
     */
    visible?: boolean;
    /**
     * 标签背景支持自定义path
     * @since 1.11.10
     */
    customShape?: (
      text: ITextGraphicAttribute | IRichTextGraphicAttribute,
      attrs: Partial<IGraphicAttribute>,
      path: ICustomPath2D
    ) => ICustomPath2D;
    /**
     * 内部边距
     */
    padding?: IPadding | number[] | number;
  } & Partial<IMarkerState<Omit<IRectMarkSpec, 'visible'>>>;

  /**
   * @deprecated
   * 设置文本类型为富文本或者普通文本，已废弃
   **/
  type?: 'rich' | 'text';
  /**
   * 文本内容，如果需要进行换行，则使用数组形式，如 ['abc', '123']
   * 支持富文本内容 textConfig，设置富文本时要配置 textType 类型为 'rich'
   */
  text?: string | string[] | number | number[] | ReturnType<IRichTextFormatMethod<[]>>;
  /**
   * label文本 - 文本格式化
   * @param markData 组成标注的数据
   * @param seriesData 标注关联的数据
   * @returns 格式化后的文本
   */
  formatMethod?: IFormatMethod<[markData: Datum[], seriesData: Datum[]]>;

  /**
   * label文本 - 文本前 mark 图元
   */
  shape?: {
    /**
     * 是否显示标签文本前的图形
     */
    visible?: boolean;
    /**
     * 标签文本前的图形对应的样式设置
     */
    style: Omit<ISymbolMarkSpec, 'visible'>;
  };
  /**
   * label文本 - shape 同文本之间的间距
   */
  space?: number;

  /**
   * 是否自动调整 label 使其展示在 marker 可见区域内。
   * @default false
   * @since 1.4.0
   */
  confine?: boolean;
  /**
   * 水平方向的偏移
   */
  dx?: number;
  /**
   * 垂直方向的偏移
   */
  dy?: number;
} & Partial<IMarkerState<Omit<IComposedTextMarkSpec, 'visible'>>>;
```

相关定义：[ITextGraphicAttribute](AdditionalTypes-Type-Definition.md#type-36d5f8ea422d)、[IRichTextGraphicAttribute](AdditionalTypes-Type-Definition.md#type-e3b4c4057a4f)、[IGraphicAttribute](AdditionalTypes-Type-Definition.md#type-463cf72553ce)、[ICustomPath2D](AdditionalTypes-Type-Definition.md#type-68cc5b53deb9)、[IPadding](AdditionalTypes-Type-Definition.md#type-698f5ded9c9f)、[IMarkerState](AdditionalTypes-Type-Definition.md#type-1839dc4b258a)、[IRectMarkSpec](IRectMarkSpec-Type-Definition.md)、[IRichTextFormatMethod](AdditionalTypes-Type-Definition.md#type-3b28c6257cf4)、[IFormatMethod](AdditionalTypes-Type-Definition.md#type-6375b3333257)、[Datum](AdditionalTypes-Type-Definition.md#type-8cb45fc9b0d9)、[ISymbolMarkSpec](ISymbolMarkSpec-Type-Definition.md)、[IComposedTextMarkSpec](AdditionalTypes-Type-Definition.md#type-3cdc9715d892)

<a id="type-53a3e8a64bc1"></a>
## IMarkerPositionsSpec

来源：`packages/vchart/src/component/marker/interface.ts`，VChart 2.1.7

```typescript
export type IMarkerPositionsSpec = {
  /**
   * 画布坐标
   * `positions` 自 1.12.0 版本开始支持回调函数
   */
  positions:
    | MarkerPositionPoint[]
    | ((seriesData: Datum[], relativeSeries: IMarkerSupportSeries) => MarkerPositionPoint[]);
  /**
   * 是否为相对 region 的坐标，默认为 false，即相对画布的坐标
   * @default false
   * @since 1.7.0
   */
  regionRelative?: boolean;
};
```

相关定义：[MarkerPositionPoint](AdditionalTypes-Type-Definition.md#type-99fde6736e73)、[Datum](AdditionalTypes-Type-Definition.md#type-8cb45fc9b0d9)、[IMarkerSupportSeries](AdditionalTypes-Type-Definition.md#type-cee3d7685723)

<a id="type-542373c2f97e"></a>
## IMarkerRef

来源：`packages/vchart/src/component/marker/interface.ts`，VChart 2.1.7

```typescript
export interface IMarkerRef {
  /**
   * label or symbol 相对line平行方向上的偏移
   */
  refX?: number;
  /**
   * label or symbol 相对line正交方向上的偏移
   */
  refY?: number;
  /**
   * label or symbol 相对默认角度的偏移 （label跟随line的角度做自动旋转时，默认按照line的平行向量作为初始角度）
   */
  refAngle?: number;
}
```

<a id="type-1839dc4b258a"></a>
## IMarkerState

来源：`packages/vchart/src/component/marker/interface.ts`，VChart 2.1.7

```typescript
export type IMarkerState<T> = {
  /** 默认样式设置 */
  style?: T | MarkerStyleCallback<T>;
  /** 不同状态下的样式配置 */
  state?: Record<MarkerStateValue, T | MarkerStateCallback<T>>;
};
```

相关定义：[MarkerStyleCallback](AdditionalTypes-Type-Definition.md#type-88db8cbea942)、[MarkerStateValue](AdditionalTypes-Type-Definition.md#type-c42b3a87f060)、[MarkerStateCallback](AdditionalTypes-Type-Definition.md#type-6718d706fea0)

<a id="type-cee3d7685723"></a>
## IMarkerSupportSeries

来源：`packages/vchart/src/component/marker/interface.ts`，VChart 2.1.7

```typescript
export type IMarkerSupportSeries = ICartesianSeries | IPolarSeries | IGeoSeries;
```

相关定义：[ICartesianSeries](AdditionalTypes-Type-Definition.md#type-80c7ff644ee5)、[IPolarSeries](AdditionalTypes-Type-Definition.md#type-6c82e34ce6af)、[IGeoSeries](AdditionalTypes-Type-Definition.md#type-7f5ce0113c45)

<a id="type-3acb04a4042d"></a>
## IMarkerSymbol

来源：`packages/vchart/src/component/marker/interface.ts`，VChart 2.1.7

```typescript
export type IMarkerSymbol = IMarkerRef & {
  /** 是否展示 symbol */
  visible: boolean;
  /**
   * symbol 形状，默认为带左右方向的箭头
   */
  symbolType?: SymbolType;
  /**
   * symbol 大小
   */
  size?: number;
} & Partial<IMarkerState<Omit<ISymbolMarkSpec, 'visible'>>>;
```

相关定义：[IMarkerRef](AdditionalTypes-Type-Definition.md#type-542373c2f97e)、[SymbolType](AdditionalTypes-Type-Definition.md#type-4dccce8cd4d7)、[IMarkerState](AdditionalTypes-Type-Definition.md#type-1839dc4b258a)、[ISymbolMarkSpec](ISymbolMarkSpec-Type-Definition.md)

<a id="type-99fde6736e73"></a>
## MarkerPositionPoint

来源：`packages/vchart/src/component/marker/interface.ts`，VChart 2.1.7

```typescript
export type MarkerPositionPoint = {
  /**
   * x 坐标位置，number 类型表示像素值，string 类型表示相对画布宽度或者 region 宽度的占比（从左往右）
   */
  x: StringOrNumber;
  /**
   * y 坐标位置，number 类型表示像素值，string 类型表示相对画布高度或者 region 高度的占比（从上至下）
   */
  y: StringOrNumber;
};
```

相关定义：[StringOrNumber](AdditionalTypes-Type-Definition.md#type-2f92a26f4727)

<a id="type-6718d706fea0"></a>
## MarkerStateCallback

来源：`packages/vchart/src/component/marker/interface.ts`，VChart 2.1.7

```typescript
export type MarkerStateCallback<T> = (
  /**
   * markerData 标注组件聚合后的数据
   */
  markerData: DataView,
  /**
   * @since 1.13.0
   * context 组件上下文, 包括相对系列，起始相对系列，结束相对系列和图表实例
   */
  context: IMarkerAttributeContext
) => T;
```

相关定义：[DataView](AdditionalTypes-Type-Definition.md#type-b26ccd36d8e8)、[IMarkerAttributeContext](AdditionalTypes-Type-Definition.md#type-2598f79dce37)

<a id="type-c42b3a87f060"></a>
## MarkerStateValue

来源：`packages/vchart/src/component/marker/interface.ts`，VChart 2.1.7

```typescript
export type MarkerStateValue =
  | 'hover'
  | 'hover_reverse'
  | 'dimension_hover'
  | 'dimension_hover_reverse'
  | 'selected'
  | 'selected_reverse';
```

<a id="type-88db8cbea942"></a>
## MarkerStyleCallback

来源：`packages/vchart/src/component/marker/interface.ts`，VChart 2.1.7

```typescript
export type MarkerStyleCallback<T> = (
  /**
   * markerData 标注组件聚合后的数据
   */
  markerData: DataView,
  /**
   * @since 1.13.0
   * context 组件上下文, 包括相对系列，起始相对系列，结束相对系列和图表实例
   */
  context: IMarkerAttributeContext
) => T;
```

相关定义：[DataView](AdditionalTypes-Type-Definition.md#type-b26ccd36d8e8)、[IMarkerAttributeContext](AdditionalTypes-Type-Definition.md#type-2598f79dce37)

<a id="type-7815e4367a31"></a>
## OffsetPoint

来源：`packages/vchart/src/component/marker/interface.ts`，VChart 2.1.7

```typescript
export type OffsetPoint = {
  /**
   * x 方向的偏移
   * 1. number 类型表示像素值，如 12
   * 2. string 类型表示百分比，如 '10%' 表示相对于所在 region 宽度的占比
   */
  x?: number | string;
  /**
   * y 方向的偏移
   * 1. number 类型表示像素值，如 12
   * 2. string 类型表示百分比，如 '10%' 表示相对于所在 region 高度的占比
   */
  y?: number | string;
};
```

<a id="type-b2457805e643"></a>
## IMarkAreaAngleRadiusSpec

来源：`packages/vchart/src/component/marker/mark-area/interface/spec.ts`，VChart 2.1.7

```typescript
export interface IMarkAreaAngleRadiusSpec extends IMarkerCrossSeriesSpec {
  /**
   * 极坐标系下, angle 轴上位置，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * @since 1.11.0
   */
  angle: IDataPos | IDataPosCallback;
  /**
   * 极坐标系下, angle 轴上位置，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * @since 1.11.0
   */
  angle1: IDataPos | IDataPosCallback;
  /**
   * 极坐标系下,  radius 轴上位置， 或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * @since 1.11.0
   */
  radius: IDataPos | IDataPosCallback;
  /**
   * 极坐标系下,  radius 轴上位置， 或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * @since 1.11.0
   */
  radius1: IDataPos | IDataPosCallback;
}
```

相关定义：[IMarkerCrossSeriesSpec](AdditionalTypes-Type-Definition.md#type-88cab1c9cdbd)、[IDataPos](AdditionalTypes-Type-Definition.md#type-4e110ff2986a)、[IDataPosCallback](AdditionalTypes-Type-Definition.md#type-1379fa4fc2bc)

<a id="type-4eea11d6bf8d"></a>
## IMarkAreaAngleSpec

来源：`packages/vchart/src/component/marker/mark-area/interface/spec.ts`，VChart 2.1.7

```typescript
export interface IMarkAreaAngleSpec extends IMarkerCrossSeriesSpec {
  /**
   * 极坐标系下, angle 轴上位置，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * @since 1.11.0
   */
  angle: IDataPos | IDataPosCallback;
  /**
   * 极坐标系下, angle 轴上位置，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * @since 1.11.0
   */
  angle1: IDataPos | IDataPosCallback;
}
```

相关定义：[IMarkerCrossSeriesSpec](AdditionalTypes-Type-Definition.md#type-88cab1c9cdbd)、[IDataPos](AdditionalTypes-Type-Definition.md#type-4e110ff2986a)、[IDataPosCallback](AdditionalTypes-Type-Definition.md#type-1379fa4fc2bc)

<a id="type-99ea0813e616"></a>
## IMarkAreaCoordinateSpec

来源：`packages/vchart/src/component/marker/mark-area/interface/spec.ts`，VChart 2.1.7

```typescript
export type IMarkAreaCoordinateSpec = {
  /**
   * 指定数据点的参考线。基于指定数据点进行参考线的绘制，可以对数据点进行数据处理
   * `coordinates` 自 1.12.0 版本开始支持回调函数
   */
  coordinates: IDataPointSpec[] | ((seriesData: Datum[], relativeSeries: IMarkerSupportSeries) => IDataPointSpec[]);

  /**
   * 对每个数据点转化后的画布坐标点进行偏移，该偏移值可以是像素值，也可以是 string 类型，如 '20%' 代表百分比
   * 每个元素对应一个坐标点的偏移量
   * @since 1.7.3
   */
  coordinatesOffset?: OffsetPoint[];
};
```

相关定义：[IDataPointSpec](AdditionalTypes-Type-Definition.md#type-f2db44670f10)、[Datum](AdditionalTypes-Type-Definition.md#type-bf5eb9a79e61)、[IMarkerSupportSeries](AdditionalTypes-Type-Definition.md#type-cee3d7685723)、[OffsetPoint](AdditionalTypes-Type-Definition.md#type-7815e4367a31)

<a id="type-d96016d9da72"></a>
## IMarkAreaRadiusSpec

来源：`packages/vchart/src/component/marker/mark-area/interface/spec.ts`，VChart 2.1.7

```typescript
export interface IMarkAreaRadiusSpec extends IMarkerCrossSeriesSpec {
  /**
   * 极坐标系下,  radius 轴上位置， 或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * @since 1.11.0
   */
  radius: IDataPos | IDataPosCallback;
  /**
   * 极坐标系下,  radius 轴上位置， 或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * @since 1.11.0
   */
  radius1: IDataPos | IDataPosCallback;
}
```

相关定义：[IMarkerCrossSeriesSpec](AdditionalTypes-Type-Definition.md#type-88cab1c9cdbd)、[IDataPos](AdditionalTypes-Type-Definition.md#type-4e110ff2986a)、[IDataPosCallback](AdditionalTypes-Type-Definition.md#type-1379fa4fc2bc)

<a id="type-ed2c343ef812"></a>
## IMarkAreaXSpec

来源：`packages/vchart/src/component/marker/mark-area/interface/spec.ts`，VChart 2.1.7

```typescript
export interface IMarkAreaXSpec extends IMarkerCrossSeriesSpec {
  /**
   * x轴上的参考线。可以配置参考线在x轴上的值，或者聚合计算类型
   * 可以将 x 配置为 '15%' 百分比的形式，用于表示将 x 绘制在 marker 所在 region 横轴（从左往右）的百分之 15 位置处
   */
  x: IDataPos | IDataPosCallback;
  /**
   * 设置x轴上的第二个值，如果同时设置了x 和 x1，会形成一个范围
   */
  x1: IDataPos | IDataPosCallback;
}
```

相关定义：[IMarkerCrossSeriesSpec](AdditionalTypes-Type-Definition.md#type-88cab1c9cdbd)、[IDataPos](AdditionalTypes-Type-Definition.md#type-4e110ff2986a)、[IDataPosCallback](AdditionalTypes-Type-Definition.md#type-1379fa4fc2bc)

<a id="type-23ed00b3b201"></a>
## IMarkAreaXYSpec

来源：`packages/vchart/src/component/marker/mark-area/interface/spec.ts`，VChart 2.1.7

```typescript
export interface IMarkAreaXYSpec extends IMarkerCrossSeriesSpec {
  /**
   * x轴上的参考线。可以配置参考线在x轴上的值，或者聚合计算类型
   * 可以将 x 配置为 '15%' 百分比的形式，用于表示将 x 绘制在 marker 所在 region 横轴（从左往右）的百分之 15 位置处
   */
  x: IDataPos | IDataPosCallback;
  /**
   * 设置x轴上的第二个值，如果同时设置了x 和 x1，会形成一个范围
   */
  x1: IDataPos | IDataPosCallback;
  /**
   * y轴上的参考线。可以配置参考线在y轴上的值，或者聚合计算类型
   * 可以将 y 配置为 '15%' 百分比的形式，用于表示将 y 绘制在 marker 所在 region 纵轴（从上到下）的百分之 15 位置处
   */
  y: IDataPos | IDataPosCallback;
  /**
   * 设置y轴上的第二个值，如果同时设置了y 和 y1，会形成一个范围
   */
  y1: IDataPos | IDataPosCallback;
}
```

相关定义：[IMarkerCrossSeriesSpec](AdditionalTypes-Type-Definition.md#type-88cab1c9cdbd)、[IDataPos](AdditionalTypes-Type-Definition.md#type-4e110ff2986a)、[IDataPosCallback](AdditionalTypes-Type-Definition.md#type-1379fa4fc2bc)

<a id="type-19f94791c9c6"></a>
## IMarkAreaYSpec

来源：`packages/vchart/src/component/marker/mark-area/interface/spec.ts`，VChart 2.1.7

```typescript
export interface IMarkAreaYSpec extends IMarkerCrossSeriesSpec {
  /**
   * y轴上的参考线。可以配置参考线在y轴上的值，或者聚合计算类型
   * 可以将 y 配置为 '15%' 百分比的形式，用于表示将 y 绘制在 marker 所在 region 纵轴（从上到下）的百分之 15 位置处
   */
  y: IDataPos | IDataPosCallback;
  /**
   * 设置y轴上的第二个值，如果同时设置了y 和 y1，会形成一个范围
   */
  y1: IDataPos | IDataPosCallback;
}
```

相关定义：[IMarkerCrossSeriesSpec](AdditionalTypes-Type-Definition.md#type-88cab1c9cdbd)、[IDataPos](AdditionalTypes-Type-Definition.md#type-4e110ff2986a)、[IDataPosCallback](AdditionalTypes-Type-Definition.md#type-1379fa4fc2bc)

<a id="type-0d292ecf19f3"></a>
## IRegressType

来源：`packages/vchart/src/component/marker/mark-area/interface/spec.ts`，VChart 2.1.7

```typescript
export type IRegressType = 'regression';
```

<a id="type-4079709b8a02"></a>
## IMarkAreaLabel

来源：`packages/vchart/src/component/marker/mark-area/interface/theme.ts`，VChart 2.1.7

```typescript
export type IMarkAreaLabel = {
  /**
   * label整体 - 相对line的位置
   */
  position?: keyof typeof IMarkAreaLabelPosition | IMarkCommonArcLabelPosition;
} & IMarkerLabelWithoutRefSpec;
```

相关定义：[IMarkAreaLabelPosition](AdditionalTypes-Type-Definition.md#type-a1709a28c988)、[IMarkCommonArcLabelPosition](AdditionalTypes-Type-Definition.md#type-9a828f1ac3c0)、[IMarkerLabelWithoutRefSpec](AdditionalTypes-Type-Definition.md#type-253fe6ea4b96)

<a id="type-7880c31abf52"></a>
## IMarkAreaTheme

来源：`packages/vchart/src/component/marker/mark-area/interface/theme.ts`，VChart 2.1.7

```typescript
export interface IMarkAreaTheme {
  /**
   * 标记区域的样式
   */
  area?: Partial<IMarkerState<IPolygonMarkSpec | IArcMarkSpec>>;
  /**
   * 标记区域的标签样式配置。
   * 自 1.13.9 版本开始，支持创建多个标签
   */
  label?: IMarkAreaLabel | IMarkAreaLabel[];
}
```

相关定义：[IMarkerState](AdditionalTypes-Type-Definition.md#type-1839dc4b258a)、[IPolygonMarkSpec](IPolygonMarkSpec-Type-Definition.md)、[IArcMarkSpec](IArcMarkSpec-Type-Definition.md)、[IMarkAreaLabel](AdditionalTypes-Type-Definition.md#type-4079709b8a02)

<a id="type-cbf79085c0de"></a>
## IMarkLineAngleSpec

来源：`packages/vchart/src/component/marker/mark-line/interface/spec.ts`，VChart 2.1.7

```typescript
export interface IMarkLineAngleSpec extends IMarkerCrossSeriesSpec {
  /**
   * 极坐标系下,  参考线在 angle 轴上位置，可以配置参考线在 angle 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * @since 1.11.0
   */
  angle: IDataPos | IDataPosCallback;
}
```

相关定义：[IMarkerCrossSeriesSpec](AdditionalTypes-Type-Definition.md#type-88cab1c9cdbd)、[IDataPos](AdditionalTypes-Type-Definition.md#type-4e110ff2986a)、[IDataPosCallback](AdditionalTypes-Type-Definition.md#type-1379fa4fc2bc)

<a id="type-3df3d54de17a"></a>
## IMarkLineAngRadRad1Spec

来源：`packages/vchart/src/component/marker/mark-line/interface/spec.ts`，VChart 2.1.7

```typescript
export interface IMarkLineAngRadRad1Spec extends IMarkerCrossSeriesSpec {
  /**
   * 极坐标系下,  参考线在 angle 轴上位置，可以配置参考线在 angle 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * @since 1.11.0
   */
  angle: IDataPos | IDataPosCallback;
  /**
   * 极坐标系下,  参考线在 radius 轴上位置，可以配置参考线在 angle 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * @since 1.11.0
   */
  radius: IDataPos | IDataPosCallback;
  /**
   * 极坐标系下,  参考线在 radius 轴上位置，可以配置参考线在 angle 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * @since 1.11.0
   */
  radius1: IDataPos | IDataPosCallback;
}
```

相关定义：[IMarkerCrossSeriesSpec](AdditionalTypes-Type-Definition.md#type-88cab1c9cdbd)、[IDataPos](AdditionalTypes-Type-Definition.md#type-4e110ff2986a)、[IDataPosCallback](AdditionalTypes-Type-Definition.md#type-1379fa4fc2bc)

<a id="type-1818f2e34d58"></a>
## IMarkLineAngRadSpec

来源：`packages/vchart/src/component/marker/mark-line/interface/spec.ts`，VChart 2.1.7

```typescript
export interface IMarkLineAngRadSpec extends IMarkerCrossSeriesSpec {
  /**
   * 极坐标系下,  参考线在 angle 轴上位置，可以配置参考线在 angle 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * @since 1.11.0
   */
  angle: IDataPos | IDataPosCallback;
  /**
   * 极坐标系下,  参考线在 angle 轴上位置，可以配置参考线在 angle 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * @since 1.11.0
   */
  angle1: IDataPos | IDataPosCallback;
  /**
   * 极坐标系下,  参考线在 radius 轴上位置，可以配置参考线在 angle 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * @since 1.11.0
   */
  radius: IDataPos | IDataPosCallback;
  /**
   * 极坐标系下,  参考线在 radius 轴上位置，可以配置参考线在 angle 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * @since 1.11.0
   */
  radius1: IDataPos | IDataPosCallback;
}
```

相关定义：[IMarkerCrossSeriesSpec](AdditionalTypes-Type-Definition.md#type-88cab1c9cdbd)、[IDataPos](AdditionalTypes-Type-Definition.md#type-4e110ff2986a)、[IDataPosCallback](AdditionalTypes-Type-Definition.md#type-1379fa4fc2bc)

<a id="type-25e80ef7b42b"></a>
## IMarkLineCoordinateSpec

来源：`packages/vchart/src/component/marker/mark-line/interface/spec.ts`，VChart 2.1.7

```typescript
export type IMarkLineCoordinateSpec = {
  /**
   * 指定数据点的参考线。基于指定数据点进行参考线的绘制，可以对数据点进行数据处理
   * `coordinates` 自 1.12.0 版本开始支持回调函数
   */
  coordinates: IDataPointSpec[] | ((seriesData: Datum[], relativeSeries: IMarkerSupportSeries) => IDataPointSpec[]);
  /**
   * 对每个数据点转化后的画布坐标点进行偏移，该偏移值可以是像素值，也可以是 string 类型，如 '20%' 代表百分比
   * 每个元素对应一个坐标点的偏移量
   * @since 1.7.3
   */
  coordinatesOffset?: OffsetPoint[];
  /**
   * 数据点的处理方法。 如果不配置则按照coordinate数组直接连接成line。
   */
  process?:
    | {
        x: IAggrType;
      }
    | {
        y: IAggrType;
      }
    | {
        xy: IRegressType; // FIXME: xy属性名称不太合理，可能需调整
      };
};
```

相关定义：[IDataPointSpec](AdditionalTypes-Type-Definition.md#type-f2db44670f10)、[Datum](AdditionalTypes-Type-Definition.md#type-bf5eb9a79e61)、[IMarkerSupportSeries](AdditionalTypes-Type-Definition.md#type-cee3d7685723)、[OffsetPoint](AdditionalTypes-Type-Definition.md#type-7815e4367a31)、[IAggrType](AdditionalTypes-Type-Definition.md#type-952d359c9b51)、[IRegressType](AdditionalTypes-Type-Definition.md#type-0d292ecf19f3)

<a id="type-604e38ee5301"></a>
## IMarkLineRadAngAng1Spec

来源：`packages/vchart/src/component/marker/mark-line/interface/spec.ts`，VChart 2.1.7

```typescript
export interface IMarkLineRadAngAng1Spec extends IMarkerCrossSeriesSpec {
  /**
   * 极坐标系下,  参考线在 angle 轴上位置，可以配置参考线在 angle 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * @since 1.11.0
   */
  angle: IDataPos | IDataPosCallback;
  /**
   * 极坐标系下,  参考线在 angle 轴上位置，可以配置参考线在 angle 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * @since 1.11.0
   */
  angle1: IDataPos | IDataPosCallback;
  /**
   * 极坐标系下,  参考线在 radius 轴上位置，可以配置参考线在 angle 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * @since 1.11.0
   */
  radius: IDataPos | IDataPosCallback;
}
```

相关定义：[IMarkerCrossSeriesSpec](AdditionalTypes-Type-Definition.md#type-88cab1c9cdbd)、[IDataPos](AdditionalTypes-Type-Definition.md#type-4e110ff2986a)、[IDataPosCallback](AdditionalTypes-Type-Definition.md#type-1379fa4fc2bc)

<a id="type-a2d55cb80bac"></a>
## IMarkLineRadiusSpec

来源：`packages/vchart/src/component/marker/mark-line/interface/spec.ts`，VChart 2.1.7

```typescript
export interface IMarkLineRadiusSpec extends IMarkerCrossSeriesSpec {
  /**
   * 极坐标系下,  参考线在 radius 轴上位置，可以配置参考线在 angle 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * @since 1.11.0
   */
  radius: IDataPos | IDataPosCallback;
}
```

相关定义：[IMarkerCrossSeriesSpec](AdditionalTypes-Type-Definition.md#type-88cab1c9cdbd)、[IDataPos](AdditionalTypes-Type-Definition.md#type-4e110ff2986a)、[IDataPosCallback](AdditionalTypes-Type-Definition.md#type-1379fa4fc2bc)

<a id="type-7ce1823090a0"></a>
## IMarkLineXSpec

来源：`packages/vchart/src/component/marker/mark-line/interface/spec.ts`，VChart 2.1.7

```typescript
export interface IMarkLineXSpec extends IMarkerCrossSeriesSpec {
  /**
   * 单独声明 x 属性，可以绘制一条贯穿 y 轴的标注线
   * x 轴上的参考线。可以配置参考线在 x 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * 可以将 x 配置为 '15%' 百分比的形式，用于表示将 x 绘制在 marker 所在 region 横轴（从左往右）的百分之 15 位置处。
   */
  x: IDataPos | IDataPosCallback;
}
```

相关定义：[IMarkerCrossSeriesSpec](AdditionalTypes-Type-Definition.md#type-88cab1c9cdbd)、[IDataPos](AdditionalTypes-Type-Definition.md#type-4e110ff2986a)、[IDataPosCallback](AdditionalTypes-Type-Definition.md#type-1379fa4fc2bc)

<a id="type-f50693a23ba0"></a>
## IMarkLineXYSpec

来源：`packages/vchart/src/component/marker/mark-line/interface/spec.ts`，VChart 2.1.7

```typescript
export interface IMarkLineXYSpec extends IMarkerCrossSeriesSpec {
  /**
   * 参考线起始点在 x 轴上位置，可以配置参考线在 x 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * 可以将 x 配置为 '15%' 百分比的形式，表示该位置位于 region 横轴（从左往右）的百分之 15 位置处。
   */
  x: IDataPos | IDataPosCallback;
  /**
   * 该参考线起始点在 y 轴的起点位置，可以配置 y 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * 可以将 y 配置为 '15%' 百分比的形式，表示该位置位于 region 纵轴（从上到下）的百分之 15 位置处。
   */
  y: IDataPos | IDataPosCallback;
  /**
   * 该参考线终点在 x 轴的终点位置，可以配置 x 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * 可以将 x 配置为 '15%' 百分比的形式，表示该位置位于 region 横轴（从左往右）的百分之 15 位置处。
   * @since 1.7.3
   */
  x1: IDataPos | IDataPosCallback;
  /**
   * 该参考线终点在 y 轴的终点位置，可以配置 y 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * 可以将 y 配置为 '15%' 百分比的形式，表示该位置位于 region 纵轴（从上到下）的百分之 15 位置处。
   * @since 1.7.3
   */
  y1: IDataPos | IDataPosCallback;
}
```

相关定义：[IMarkerCrossSeriesSpec](AdditionalTypes-Type-Definition.md#type-88cab1c9cdbd)、[IDataPos](AdditionalTypes-Type-Definition.md#type-4e110ff2986a)、[IDataPosCallback](AdditionalTypes-Type-Definition.md#type-1379fa4fc2bc)

<a id="type-72d0df8a5295"></a>
## IMarkLineXYY1Spec

来源：`packages/vchart/src/component/marker/mark-line/interface/spec.ts`，VChart 2.1.7

```typescript
export interface IMarkLineXYY1Spec extends IMarkerCrossSeriesSpec {
  /**
   * 参考线在 x 轴上位置，可以配置参考线在 x 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * 可以将 x 配置为 '15%' 百分比的形式，表示该位置位于 region 横轴（从左往右）的百分之 15 位置处。
   */
  x: IDataPos | IDataPosCallback;
  /**
   * 该参考线在 y 轴的起点位置，可以配置 y 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * 可以将 y 配置为 '15%' 百分比的形式，表示该位置位于 region 纵轴（从上到下）的百分之 15 位置处。
   */
  y: IDataPos | IDataPosCallback;
  /**
   * 该参考线在 y 轴的终点位置，可以配置 y 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * 可以将 y 配置为 '15%' 百分比的形式，表示该位置位于 region 纵轴（从上到下）的百分之 15 位置处。
   * @since 1.7.3
   */
  y1: IDataPos | IDataPosCallback;
}
```

相关定义：[IMarkerCrossSeriesSpec](AdditionalTypes-Type-Definition.md#type-88cab1c9cdbd)、[IDataPos](AdditionalTypes-Type-Definition.md#type-4e110ff2986a)、[IDataPosCallback](AdditionalTypes-Type-Definition.md#type-1379fa4fc2bc)

<a id="type-d5755e40af1e"></a>
## IMarkLineYSpec

来源：`packages/vchart/src/component/marker/mark-line/interface/spec.ts`，VChart 2.1.7

```typescript
export interface IMarkLineYSpec extends IMarkerCrossSeriesSpec {
  /**
   * 单独声明 y 属性，可以绘制一条贯穿 x 轴的标注线
   * y轴上的参考线。可以配置参考线在y轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算
   * 可以将 y 配置为 '15%' 百分比的形式，用于表示将 x 绘制在 marker 所在 region 纵轴（从上到下）的百分之 15 位置处
   */
  y: IDataPos | IDataPosCallback;
}
```

相关定义：[IMarkerCrossSeriesSpec](AdditionalTypes-Type-Definition.md#type-88cab1c9cdbd)、[IDataPos](AdditionalTypes-Type-Definition.md#type-4e110ff2986a)、[IDataPosCallback](AdditionalTypes-Type-Definition.md#type-1379fa4fc2bc)

<a id="type-9fa06e53cb0e"></a>
## IMarkLineYXX1Spec

来源：`packages/vchart/src/component/marker/mark-line/interface/spec.ts`，VChart 2.1.7

```typescript
export interface IMarkLineYXX1Spec extends IMarkerCrossSeriesSpec {
  /**
   * 参考线在 y 轴上位置，可以配置参考线在 y 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * 可以将 y 配置为 '15%' 百分比的形式，表示该位置位于  region 纵轴（从上到下）的百分之 15 位置处。
   */
  y: IDataPos | IDataPosCallback;
  /**
   * 该参考线在 x 轴的起点位置，可以配置 x 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * 可以将 x 配置为 '15%' 百分比的形式，表示该位置位于 region 横轴（从左往右）的百分之 15 位置处。
   */
  x: IDataPos | IDataPosCallback;
  /**
   * 该参考线在 x 轴的终点位置，可以配置 x 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * 可以将 x 配置为 '15%' 百分比的形式，表示该位置位于 region 横轴（从左往右）的百分之 15 位置处。
   * @since 1.7.3
   */
  x1: IDataPos | IDataPosCallback;
}
```

相关定义：[IMarkerCrossSeriesSpec](AdditionalTypes-Type-Definition.md#type-88cab1c9cdbd)、[IDataPos](AdditionalTypes-Type-Definition.md#type-4e110ff2986a)、[IDataPosCallback](AdditionalTypes-Type-Definition.md#type-1379fa4fc2bc)

<a id="type-e04a2517c735"></a>
## IMarkLineLabel

来源：`packages/vchart/src/component/marker/mark-line/interface/theme.ts`，VChart 2.1.7

```typescript
export type IMarkLineLabel = {
  /**
   * label整体 - 相对line的位置
   */
  position?: keyof typeof IMarkLineLabelPosition | IMarkCommonArcLabelPosition;
} & IMarkerLabelSpec;
```

相关定义：[IMarkLineLabelPosition](AdditionalTypes-Type-Definition.md#type-5be4f671bfe4)、[IMarkCommonArcLabelPosition](AdditionalTypes-Type-Definition.md#type-9a828f1ac3c0)、[IMarkerLabelSpec](AdditionalTypes-Type-Definition.md#type-2d979381ccd7)

<a id="type-1ca140194889"></a>
## IMarkLineTheme

来源：`packages/vchart/src/component/marker/mark-line/interface/theme.ts`，VChart 2.1.7

```typescript
export interface IMarkLineTheme {
  /**
   * 标注线的线样式
   */
  line?: Partial<IMarkerState<ILineMarkSpec | IArcMarkSpec>>;
  /**
   * 标注线的标签样式。
   * 自 1.13.9 版本开始，支持创建多个标签。
   */
  label?: IMarkLineLabel | IMarkLineLabel[];

  /**
   * 线标注起点symbol样式
   */
  startSymbol?: IMarkerSymbol;
  /**
   * 线标注终点symbol样式
   */
  endSymbol?: IMarkerSymbol;
}
```

相关定义：[IMarkerState](AdditionalTypes-Type-Definition.md#type-1839dc4b258a)、[ILineMarkSpec](ILineMarkSpec-Type-Definition.md)、[IArcMarkSpec](IArcMarkSpec-Type-Definition.md)、[IMarkLineLabel](AdditionalTypes-Type-Definition.md#type-e04a2517c735)、[IMarkerSymbol](AdditionalTypes-Type-Definition.md#type-3acb04a4042d)

<a id="type-0acfdd5b8e06"></a>
## IMarkPointAngleRadiusSpec

来源：`packages/vchart/src/component/marker/mark-point/interface/spec.ts`，VChart 2.1.7

```typescript
export type IMarkPointAngleRadiusSpec = {
  /**
   * 极坐标系下,  angle 轴上位置，可以配置参考线在 angle 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * @since 1.11.0
   */
  angle: IDataPos | IDataPosCallback;
  /**
   * 极坐标系下, radius 轴上位置，可以配置参考线在 angle 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * @since 1.11.0
   */
  radius: IDataPos | IDataPosCallback;
};
```

相关定义：[IDataPos](AdditionalTypes-Type-Definition.md#type-4e110ff2986a)、[IDataPosCallback](AdditionalTypes-Type-Definition.md#type-1379fa4fc2bc)

<a id="type-8c827e1a43c9"></a>
## IMarkPointCoordinateSpec

来源：`packages/vchart/src/component/marker/mark-point/interface/spec.ts`，VChart 2.1.7

```typescript
export type IMarkPointCoordinateSpec = {
  /**
   * 指定数据点的参考线。基于指定数据点进行参考线的绘制，可以对数据点进行数据处理
   * `coordinate` 自 1.12.0 版本开始支持回调函数
   */
  coordinate: IDataPointSpec | ((seriesData: Datum[], relativeSeries: IMarkerSupportSeries) => IDataPointSpec);
  /**
   * 对每个数据点转化后的画布坐标点进行偏移，该偏移值可以是像素值，也可以是 string 类型，如 '20%' 代表百分比
   * 每个元素对应一个坐标点的偏移量
   * @since 1.7.3
   */
  coordinatesOffset?: OffsetPoint;
};
```

相关定义：[IDataPointSpec](AdditionalTypes-Type-Definition.md#type-f2db44670f10)、[Datum](AdditionalTypes-Type-Definition.md#type-bf5eb9a79e61)、[IMarkerSupportSeries](AdditionalTypes-Type-Definition.md#type-cee3d7685723)、[OffsetPoint](AdditionalTypes-Type-Definition.md#type-7815e4367a31)

<a id="type-fd30b323288a"></a>
## IMarkPointGeoNameSpec

来源：`packages/vchart/src/component/marker/mark-point/interface/spec.ts`，VChart 2.1.7

```typescript
export type IMarkPointGeoNameSpec = {
  /**
   * 地理坐标系下, 地理区域的名称。
   * @since 1.11.0
   */
  areaName: string | IDataPosCallback;
};
```

相关定义：[IDataPosCallback](AdditionalTypes-Type-Definition.md#type-1379fa4fc2bc)

<a id="type-78d1410fa542"></a>
## IMarkPointPositionsSpec

来源：`packages/vchart/src/component/marker/mark-point/interface/spec.ts`，VChart 2.1.7

```typescript
export type IMarkPointPositionsSpec = {
  /**
   * `position` 自 1.12.0 版本开始支持回调函数
   */
  position: MarkerPositionPoint | ((seriesData: Datum[], relativeSeries: IMarkerSupportSeries) => MarkerPositionPoint);
  /**
   * 是否为相对 region 的坐标，默认为 false，即相对画布的坐标
   * @default false
   * @since 1.7.0
   */
  regionRelative?: boolean;
};
```

相关定义：[MarkerPositionPoint](AdditionalTypes-Type-Definition.md#type-99fde6736e73)、[Datum](AdditionalTypes-Type-Definition.md#type-bf5eb9a79e61)、[IMarkerSupportSeries](AdditionalTypes-Type-Definition.md#type-cee3d7685723)

<a id="type-c38f0b023570"></a>
## IMarkPointXYSpec

来源：`packages/vchart/src/component/marker/mark-point/interface/spec.ts`，VChart 2.1.7

```typescript
export type IMarkPointXYSpec = {
  /**
   * 参考点在 y 轴上位置，可以配置参考线在 y 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * 可以将 y 配置为 '15%' 百分比的形式，表示该位置位于  region 纵轴（从上到下）的百分之 15 位置处。
   */
  y: IDataPos | IDataPosCallback;
  /**
   * 参考点在 x 轴的起点位置，可以配置 x 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * 可以将 x 配置为 '15%' 百分比的形式，表示该位置位于 region 横轴（从左往右）的百分之 15 位置处。
   */
  x: IDataPos | IDataPosCallback;
};
```

相关定义：[IDataPos](AdditionalTypes-Type-Definition.md#type-4e110ff2986a)、[IDataPosCallback](AdditionalTypes-Type-Definition.md#type-1379fa4fc2bc)

<a id="type-8262891f07ed"></a>
## IItemContent

来源：`packages/vchart/src/component/marker/mark-point/interface/theme.ts`，VChart 2.1.7

```typescript
export interface IItemContent extends IMarkerRef {
  /**
   * 标注内容相对于定位点的位置
   */
  position?: keyof typeof IMarkPointItemPosition;
  /**
   * x 方向偏移量
   */
  offsetX?: number | 'regionRight' | 'regionLeft' | IOffsetCallback;
  /**
   * y 方向偏移量
   */
  offsetY?: number | 'regionTop' | 'regionBottom' | IOffsetCallback;
  /**
   * 是否自动调整 item content 使其展示在 marker 可见区域内。
   * @default false
   * @since 1.8.7
   */
  confine?: boolean;

  /**
   * 标注类型
   */
  // richText 和 text + rich的功能有重叠, 所以去掉richText的配置
  // 为了兼容老配置, 会把用户配的richText转化成text + rich的形式
  // type?: 'symbol' | 'text' | 'image' | 'richText';
  type?: 'symbol' | 'text' | 'image' | 'custom';

  /**
   * 标注内容的样式及状态 等价于 symbol | image | text | richText | customMark
   * @since 2.0.0
   */
  style?: IItemContentStyle | MarkerStyleCallback<IItemContentStyle> | IMarkerLabelSpec;
  state?: Record<MarkerStateValue, IItemContentStyle | MarkerStateCallback<IItemContentStyle>>;

  // 老写法, 先保留
  /**
   * type为symbol时, symbol的样式
   */
  symbol?: Partial<IMarkerState<ISymbolMarkSpec>>;
  /**
   * type为image时, image的样式
   */
  image?: Partial<IMarkerState<IImageGraphicAttribute>>;
  /**
   * type为text时, text的样式
   * 'text'类型的ItemContent新增三种子类型：'text','rich'。配置在textStyle.type上。
   */
  text?: IMarkerLabelSpec;
  /**
   * type为rich text时, rich text的样式
   */
  richText?: Partial<IMarkerState<IRichTextGraphicAttribute>>;
  /**
   * type为custom时, customMark的样式(目前仅在mapLabel内部逻辑中使用到)
   */
  customMark?: Partial<IMarkerState<IGroupGraphicAttribute>>;
}
```

相关定义：[IMarkerRef](AdditionalTypes-Type-Definition.md#type-542373c2f97e)、[IMarkPointItemPosition](AdditionalTypes-Type-Definition.md#type-39230de2ade7)、[IOffsetCallback](AdditionalTypes-Type-Definition.md#type-db4f6fc17505)、[IItemContentStyle](AdditionalTypes-Type-Definition.md#type-364c9501578d)、[MarkerStyleCallback](AdditionalTypes-Type-Definition.md#type-88db8cbea942)、[IMarkerLabelSpec](AdditionalTypes-Type-Definition.md#type-2d979381ccd7)、[MarkerStateValue](AdditionalTypes-Type-Definition.md#type-c42b3a87f060)、[MarkerStateCallback](AdditionalTypes-Type-Definition.md#type-6718d706fea0)、[IMarkerState](AdditionalTypes-Type-Definition.md#type-1839dc4b258a)、[ISymbolMarkSpec](ISymbolMarkSpec-Type-Definition.md)、[IImageGraphicAttribute](AdditionalTypes-Type-Definition.md#type-fcfc702de0ac)、[IRichTextGraphicAttribute](AdditionalTypes-Type-Definition.md#type-e3b4c4057a4f)、[IGroupGraphicAttribute](AdditionalTypes-Type-Definition.md#type-2f7220f7ffb4)

<a id="type-364c9501578d"></a>
## IItemContentStyle

来源：`packages/vchart/src/component/marker/mark-point/interface/theme.ts`，VChart 2.1.7

```typescript
export type IItemContentStyle = ISymbolMarkSpec | IImageGraphicAttribute | IGroupGraphicAttribute;
```

相关定义：[ISymbolMarkSpec](ISymbolMarkSpec-Type-Definition.md)、[IImageGraphicAttribute](AdditionalTypes-Type-Definition.md#type-fcfc702de0ac)、[IGroupGraphicAttribute](AdditionalTypes-Type-Definition.md#type-2f7220f7ffb4)

<a id="type-8dd1e2b302ff"></a>
## IItemLine

来源：`packages/vchart/src/component/marker/mark-point/interface/theme.ts`，VChart 2.1.7

```typescript
export type IItemLine<T extends Partial<IMarkerSymbol> = IMarkerSymbol> = {
  /** TODO：'type-opo' */
  /**
   * 引导线类型
   * 'type-s'表示起点和终点直接连线; 'type-do'表示包含一个折点，且折点x坐标为起点到终点的 1/2 x坐标，折点y坐标为起点y坐标；'type-op' 表示包含一个折点，且折点x坐标为起点x坐标，折点y坐标为终点y坐标；'type-po' 表示包含一个折点，且折点x坐标为终点x坐标，折点y坐标为起点y坐标
   * 引导线类型的具体形式参考：https://journals.sagepub.com/doi/10.1177/1473871618799500
   */
  type?: 'type-s' | 'type-do' | 'type-po' | 'type-op' | 'type-arc';
  /**
   * 当type为type-arc时生效, 数值决定圆心到终点连线的偏移量, 绝对值越小, 曲率越大, 符号决定法向, 不能等于0
   * @since 1.11.1
   * @default 0.8
   */
  arcRatio?: number;
  /**
   * 引导线可见性
   */
  visible?: boolean;
  /**
   * 垂直于引导线的装饰线，参考案例: https://observablehq.com/@mikelotis/edmonton-population-history-line-chart
   */
  decorativeLine?: {
    /**
     * 装饰线可见性
     */
    visible?: boolean;
    /**
     * 装饰线的长度
     */
    length?: number;
  };
  /**
   * 引导线起点symbol样式
   */
  startSymbol?: T;
  /**
   * 引导线终点symbol样式
   */
  endSymbol?: T;
  /**
   * 引导线样式
   */
  line?: Partial<IMarkerState<Omit<ILineMarkSpec, 'visible'>>>;
};
```

相关定义：[IMarkerState](AdditionalTypes-Type-Definition.md#type-1839dc4b258a)、[ILineMarkSpec](ILineMarkSpec-Type-Definition.md)、[IMarkerSymbol](AdditionalTypes-Type-Definition.md#type-3acb04a4042d)

<a id="type-a26d3a0701c1"></a>
## IMarkPointTheme

来源：`packages/vchart/src/component/marker/mark-point/interface/theme.ts`，VChart 2.1.7

```typescript
export interface IMarkPointTheme<T extends Partial<IMarkerSymbol> = Partial<IMarkerSymbol>> {
  /**
   * 标注引导线
   */
  itemLine?: IItemLine<T>;

  /**
   * 标注内容
   */
  itemContent?: IItemContent;
  /**
   * 被标注的内容
   * @since 1.11.1
   */
  targetSymbol?: {
    /**
     * 被标注内容与标记线间的间隙
     * @default 0
     */
    offset?: number;
    /**
     * 是否显示
     * @default false
     */
    visible?: boolean;
    /**
     * 大小
     * @default 20
     */
    size?: number;
  } & Partial<IMarkerState<ISymbolMarkSpec>>;
}
```

相关定义：[IItemLine](AdditionalTypes-Type-Definition.md#type-8dd1e2b302ff)、[IItemContent](AdditionalTypes-Type-Definition.md#type-8262891f07ed)、[IMarkerState](AdditionalTypes-Type-Definition.md#type-1839dc4b258a)、[ISymbolMarkSpec](ISymbolMarkSpec-Type-Definition.md)、[IMarkerSymbol](AdditionalTypes-Type-Definition.md#type-3acb04a4042d)

<a id="type-db4f6fc17505"></a>
## IOffsetCallback

来源：`packages/vchart/src/component/marker/mark-point/interface/theme.ts`，VChart 2.1.7

```typescript
export type IOffsetCallback = (region: IRegion) => number;
```

相关定义：[IRegion](AdditionalTypes-Type-Definition.md#type-a83d28f54f24)

<a id="type-6d4657ffd0d7"></a>
## ITitleSpecWithoutText

来源：`packages/vchart/src/component/title/interface/spec.ts`，VChart 2.1.7

```typescript
interface ITitleSpecWithoutText extends Omit<IComponentSpec, 'orient'> {
  /**
   * 是否显示标题
   */
  visible?: boolean;
  /**
   * Title位置
   * @default 'top'
   */
  orient?: IOrientType;
  /**
   * 标题左上角x坐标像素值
   */
  x?: number;
  /**
   * 标题左上角y坐标像素值
   */
  y?: number;
  /**
   * 标题宽度，支持像素值、百分比与回调，百分比与回调的基准是图表视图区域
   */
  width?: ILayoutNumber;
  /**
   * 标题高度，支持像素值、百分比与回调，百分比与回调的基准是图表视图区域
   */
  height?: ILayoutNumber;
  /**
   * 最小宽度，支持像素值、百分比与回调
   */
  minWidth?: ILayoutNumber;
  /**
   * 最大宽度，支持像素值、百分比与回调。当文字超过最大宽度时，会自动省略。
   */
  maxWidth?: ILayoutNumber;
  /**
   * 最小高度，支持像素值、百分比与回调
   */
  minHeight?: ILayoutNumber;
  /**
   * 最大高度，支持像素值、百分比与回调。当文字超过最大高度时，会自动省略。
   */
  maxHeight?: ILayoutNumber;
  /**
   * 标题的边距留白
   */
  innerPadding?: IPadding | number | number[];
  /**
   * 文字水平对齐方式
   * 'left' | 'center' | 'right'
   */
  align?: string;
  /**
   * 文字垂直对齐方式
   * 'top' | 'middle' | 'bottom'
   */
  verticalAlign?: string;
  /**
   * 主标题样式
   */
  textStyle?: {
    /**
     * 给主标题设置给定的宽度
     */
    width?: number;
    /**
     * 给主标题设置给定的高度
     */
    height?: number;
    /**
     * 文字水平对齐方式
     * 'left' | 'center' | 'right'
     */
    align?: string;
    /**
     * 文字垂直对齐方式
     * 'top' | 'middle' | 'bottom'
     */
    verticalAlign?: string;
    /**
     * 折行方式
     * 'break-word' | 'break-all' | 'keep-all'
     */
    wordBreak?: ITextAttribute['wordBreak'];
    /**
     * 按照宽度限制自动折行或显示省略号(maxLineWidth)
     * 默认设置为title宽度
     */
    maxLineWidth?: number;
    /**
     * 高度限制控制显示内容及省略号(heightLimit)
     */
    heightLimit?: number;
    /**
     * 按照行数限制显示内容及省略号(lineClamp)
     */
    lineClamp?: number;
    /**
     * 富文本配置（暂时保留旧设置）
     * @deprecated use text & textType instead
     */
    character?: IRichTextCharacter[];
  } & Partial<ITextGraphicAttribute>;
  /**
   * 副标题样式
   */
  subtextStyle?: {
    /** 指定宽度 */
    width?: number;
    /** 指定高度 */
    height?: number;
    /**
     * 文字水平对齐方式
     * 'left' | 'center' | 'right'
     */
    align?: string;
    /**
     * 文字垂直对齐方式
     * 'top' | 'middle' | 'bottom'
     */
    verticalAlign?: string;
    /**
     * 折行方式
     * 'break-word' | 'break-all' | 'keep-all
     */
    wordBreak?: ITextAttribute['wordBreak'];
    /**
     * 按照宽度限制自动折行或显示省略号(maxLineWidth)
     * 默认设置为title宽度
     */
    maxLineWidth?: number;
    /**
     * 高度限制控制显示内容及省略号(heightLimit)
     */
    heightLimit?: number;
    /**
     * 按照行数限制显示内容及省略号(lineClamp)
     */
    lineClamp?: number;
    /**
     * 富文本配置（暂时保留旧设置）
     * @deprecated use subtext & subtextType instead
     */
    character?: IRichTextCharacter[];
  } & Partial<ITextGraphicAttribute>;
}
```

相关定义：[IComponentSpec](AdditionalTypes-Type-Definition.md#type-d23c51c12154)、[IOrientType](AdditionalTypes-Type-Definition.md#type-1c1f18d62ff6)、[ILayoutNumber](AdditionalTypes-Type-Definition.md#type-9638d3997297)、[IPadding](IPadding-Type-Definition.md)、[ITextAttribute](AdditionalTypes-Type-Definition.md#type-4ecb56643e01)、[IRichTextCharacter](AdditionalTypes-Type-Definition.md#type-a486d6a175fe)、[ITextGraphicAttribute](AdditionalTypes-Type-Definition.md#type-36d5f8ea422d)

<a id="type-b713b3be426c"></a>
## ITooltip

来源：`packages/vchart/src/component/tooltip/interface/common.ts`，VChart 2.1.7

```typescript
export interface ITooltip extends IComponent {
  tooltipHandler?: ITooltipHandler;
  getVisible: () => boolean;
  showTooltip: (datum: Datum, options: IShowTooltipOption) => void;
  enable?: boolean;
}
```

相关定义：[IComponent](AdditionalTypes-Type-Definition.md#type-5d7fe81ad96c)、[ITooltipHandler](AdditionalTypes-Type-Definition.md#type-73b5fb837aea)、[Datum](AdditionalTypes-Type-Definition.md#type-bf5eb9a79e61)、[IShowTooltipOption](AdditionalTypes-Type-Definition.md#type-b4df769a6b46)

<a id="type-82517d84c2af"></a>
## TooltipHandlerParams

来源：`packages/vchart/src/component/tooltip/interface/common.ts`，VChart 2.1.7

```typescript
export type TooltipHandlerParams = DimensionEventParams & {
  /** 本次触发的 tooltip 是否只改变了位置 */
  changePositionOnly?: boolean;
  /** tooltip 组件实例 */
  tooltip: ITooltip;
  /** tooltip 原始的spec */
  tooltipSpec?: ITooltipSpec;
  /** TODO: 本次触发的tooltip，主要包含pattern数据，待优化 */
  activeTooltipSpec?: ITooltipActual;
  // Pick<ITooltipSpec, 'activeType' | 'dimension' | 'mark' | 'group' | 'visible' | 'handler'>;
  /** 和 datum 同组的数据项 */
  groupDatum?: Datum[];
};
```

相关定义：[DimensionEventParams](AdditionalTypes-Type-Definition.md#type-15e7376683b8)、[ITooltip](AdditionalTypes-Type-Definition.md#type-b713b3be426c)、[ITooltipSpec](ITooltipSpec-Type-Definition.md)、[ITooltipActual](AdditionalTypes-Type-Definition.md#type-b6803f56a729)、[Datum](AdditionalTypes-Type-Definition.md#type-bf5eb9a79e61)

<a id="type-34c5550c97cd"></a>
## TooltipResult

来源：`packages/vchart/src/component/tooltip/interface/common.ts`，VChart 2.1.7

```typescript
export const enum TooltipResult {
  /** tooltip 显示成功 */
  success = 0,
  /** tooltip 未成功显示 */
  failed = 1
}
```

<a id="type-e5c2cb9ed465"></a>
## TooltipEventParams

来源：`packages/vchart/src/component/tooltip/interface/event.ts`，VChart 2.1.7

```typescript
export type TooltipEventParams = TooltipHandlerParams & {
  /** 触发的 tooltip 类型 */
  activeType?: TooltipActiveType;
  /** tooltip 数据 */
  tooltipData?: TooltipData;
  /**
   * tooltip是否为空
   * @since 1.11.1
   */
  isEmptyTooltip?: boolean;
};
```

相关定义：[TooltipHandlerParams](AdditionalTypes-Type-Definition.md#type-82517d84c2af)、[TooltipActiveType](AdditionalTypes-Type-Definition.md#type-990c112f10af)、[TooltipData](AdditionalTypes-Type-Definition.md#type-2020c8fc6cbe)

<a id="type-9ead2353606b"></a>
## ITooltipHandlerSpec

来源：`packages/vchart/src/component/tooltip/interface/spec.ts`，VChart 2.1.7

```typescript
export interface ITooltipHandlerSpec {
  /** 显示 tooltip，可以选择返回是否遇到异常 */
  showTooltip: (
    activeType: TooltipActiveType,
    tooltipData: TooltipData,
    params: TooltipHandlerParams
  ) => Maybe<TooltipResult>;
  /** 隐藏 tooltip，可以选择返回是否遇到异常 */
  hideTooltip: (params: TooltipHandlerParams) => Maybe<TooltipResult>;
  /** 释放 tooltip */
  release: () => void;
  /** 可选，判断 tooltip 是否正在显示 */
  isTooltipShown?: () => boolean;
}
```

相关定义：[TooltipActiveType](AdditionalTypes-Type-Definition.md#type-990c112f10af)、[TooltipData](AdditionalTypes-Type-Definition.md#type-2020c8fc6cbe)、[TooltipHandlerParams](AdditionalTypes-Type-Definition.md#type-82517d84c2af)、[Maybe](AdditionalTypes-Type-Definition.md#type-644c0bc1509c)、[TooltipResult](AdditionalTypes-Type-Definition.md#type-34c5550c97cd)

<a id="type-6f8c16b9dce7"></a>
## ITooltipTextTheme

来源：`packages/vchart/src/component/tooltip/interface/theme.ts`，VChart 2.1.7

```typescript
export interface ITooltipTextTheme<ColorType = string> {
  /**
   * 字体
   */
  fontFamily?: string;
  /**
   * 字体大小
   */
  fontSize?: number | ITokenKey;
  /**
   * 字体颜色
   */
  fill?: ColorType;
  /**
   * 字体颜色（兼容旧版本）
   * @deprecated
   */
  fontColor?: ColorType;
  /**
   * 字重
   */
  fontWeight?: StringOrNumber;
  /**
   * 对齐方式
   */
  textAlign?: TextAlign;
  /**
   * 字体基线
   */
  textBaseline?: TextBaseLine;
  /**
   * 行高
   */
  lineHeight?: number | string | ITokenKey;
  /**
   * 与相邻元素的水平间距
   */
  spacing?: number;
  /**
   * 是否支持换行
   */
  multiLine?: boolean;
  /**
   * 最大宽度
   */
  maxWidth?: number;
  /**
   * 换行模式，默认为'break-word'
   */
  wordBreak?: ITextAttribute['wordBreak'];
  /**
   * 是否开启自动宽度。效果分为以下几种情况：
   * - tooltip 标题：`autoWidth` 默认为 `false`。如果配置为 `true`，则 tooltip 标题会保持和 tooltip 内容一致的宽度
   * - tooltip key 标签：`autoWidth` 不适用
   * - tooltip value 标签：`autoWidth` 默认为 `true`。如果配置为 `true`，则 tooltip value 标签会自动占满 tooltip 整体宽度的剩余部分
   * @since 1.4.2
   */
  autoWidth?: boolean;
}
```

相关定义：[ITokenKey](AdditionalTypes-Type-Definition.md#type-cbbd743bf503)、[StringOrNumber](AdditionalTypes-Type-Definition.md#type-2f92a26f4727)、[TextAlign](AdditionalTypes-Type-Definition.md#type-6b2c76bfb154)、[TextBaseLine](AdditionalTypes-Type-Definition.md#type-94a26edb6027)、[ITextAttribute](AdditionalTypes-Type-Definition.md#type-4ecb56643e01)

<a id="type-4c68f24bfcad"></a>
## ChartEvent

来源：`packages/vchart/src/constant/event.ts`，VChart 2.1.7

```typescript
export enum ChartEvent {
  initialized = 'initialized', // 图表实例初始化完成
  rendered = 'rendered', // 图表渲染方法被调用时触发，表明图表已经执行过渲染逻辑，只会触发一次
  renderFinished = 'renderFinished', // 每次画布渲染完成触发的事件，不包含动画结束
  animationFinished = 'animationFinished', // 图表动画结束时触发的事件
  // region
  regionSeriesDataFilterOver = 'regionSeriesDataFilterOver',
  // series start
  // series.liftCircle
  afterInitData = 'afterInitData',
  afterInitEvent = 'afterInitEvent',
  afterInitMark = 'afterInitMark',
  // series.data
  rawDataUpdate = 'rawDataUpdate',
  viewDataFilterOver = 'viewDataFilterOver',
  viewDataUpdate = 'viewDataUpdate',
  viewDataStatisticsUpdate = 'viewDataStatisticsUpdate',
  // dot series
  markDeltaYUpdate = 'markDeltaYUpdate',
  // pie series
  viewDataLabelUpdate = 'viewDataLabelUpdate',
  /** series end */
  // scale
  scaleDomainUpdate = 'scaleDomainUpdate',
  scaleRawDomainUpdate = 'scaleRawDomainUpdate',
  scaleUpdate = 'scaleUpdate',
  // datazoom
  dataZoomChange = 'dataZoomChange',
  // Hierarchy
  drill = 'drill',
  layoutStart = 'layoutStart',
  layoutEnd = 'layoutEnd',
  layoutRectUpdate = 'layoutRectUpdate',

  // player
  playerPlay = 'playerPlay',
  playerPause = 'playerPause',
  playerEnd = 'playerEnd',
  playerChange = 'playerChange',
  playerForward = 'playerForward',
  playerBackward = 'playerBackward',
  // scrollBar
  scrollBarChange = 'scrollBarChange',
  // brush
  brushStart = 'brushStart',
  brushChange = 'brushChange',
  brushEnd = 'brushEnd',
  brushClear = 'brushClear',
  brushActive = 'brushActive',
  // legend
  legendSelectedDataChange = 'legendSelectedDataChange',
  legendFilter = 'legendFilter',
  legendItemClick = 'legendItemClick',
  legendItemHover = 'legendItemHover',
  legendItemUnHover = 'legendItemUnHover',
  // tooltip
  tooltipShow = 'tooltipShow',
  tooltipHide = 'tooltipHide',
  tooltipRelease = 'tooltipRelease',
  // resize
  afterResize = 'afterResize',
  afterRender = 'afterRender',
  // layout
  afterLayout = 'afterLayout',
  afterMarkLayoutEnd = 'afterMarkLayoutEnd',
  // wordcloud
  afterWordcloudShapeDraw = 'afterWordcloudShapeDraw'
}
```

<a id="type-c7b3d3b6b38f"></a>
## Event_Bubble_Level

来源：`packages/vchart/src/constant/event.ts`，VChart 2.1.7

```typescript
export enum Event_Bubble_Level {
  vchart = 'vchart',
  chart = 'chart',
  model = 'model',
  mark = 'mark'
}
```

<a id="type-e0819375e8e5"></a>
## Event_Source_Type

来源：`packages/vchart/src/constant/event.ts`，VChart 2.1.7

```typescript
export enum Event_Source_Type {
  chart = 'chart',
  window = 'window',
  canvas = 'canvas'
}
```

<a id="type-f58080efc74b"></a>
## HOOK_EVENT

来源：`packages/vchart/src/constant/event.ts`，VChart 2.1.7

```typescript
export enum HOOK_EVENT {
  BEFORE_EVALUATE_DATA = 'beforeEvaluateData',
  AFTER_EVALUATE_DATA = 'afterEvaluateData',

  BEFORE_EVALUATE_SCALE = 'beforeEvaluateScale',
  AFTER_EVALUATE_SCALE = 'afterEvaluateScale',

  BEFORE_PARSE_VIEW = 'beforeParseView',
  AFTER_PARSE_VIEW = 'afterParseView',

  BEFORE_TRANSFORM = 'beforeTransform',
  AFTER_TRANSFORM = 'afterTransform',

  BEFORE_CREATE_VRENDER_STAGE = 'beforeCreateVRenderStage',
  AFTER_CREATE_VRENDER_STAGE = 'afterCreateVRenderStage',

  BEFORE_CREATE_VRENDER_LAYER = 'beforeCreateVRenderLayer',
  AFTER_CREATE_VRENDER_LAYER = 'afterCreateVRenderLayer',

  BEFORE_STAGE_RESIZE = 'beforeStageResize',
  AFTER_STAGE_RESIZE = 'afterStageResize',

  BEFORE_VRENDER_DRAW = 'beforeVRenderDraw',
  AFTER_VRENDER_DRAW = 'afterVRenderDraw',

  BEFORE_MARK_JOIN = 'beforeMarkJoin',
  AFTER_MARK_JOIN = 'afterMarkJoin',
  BEFORE_MARK_UPDATE = 'beforeMarkUpdate',
  AFTER_MARK_UPDATE = 'afterMarkUpdate',
  BEFORE_MARK_STATE = 'beforeMarkState',
  AFTER_MARK_STATE = 'afterMarkState',
  BEFORE_MARK_ENCODE = 'beforeMarkEncode',
  AFTER_MARK_ENCODE = 'afterMarkEncode',

  BEFORE_DO_LAYOUT = 'beforeDoLayout',
  AFTER_DO_LAYOUT = 'afterDoLayout',

  BEFORE_MARK_LAYOUT_END = 'beforeMarkLayoutEnd',
  AFTER_MARK_LAYOUT_END = 'afterMarkLayoutEnd',

  BEFORE_DO_RENDER = 'beforeDoRender',
  AFTER_DO_RENDER = 'afterDoRender',

  BEFORE_MARK_RENDER_END = 'beforeMarkRenderEnd',
  AFTER_MARK_RENDER_END = 'afterMarkRenderEnd',

  BEFORE_CREATE_VRENDER_MARK = 'beforeCreateVRenderMark',
  AFTER_CREATE_VRENDER_MARK = 'afterCreateVRenderMark',

  BEFORE_ADD_VRENDER_MARK = 'beforeAddVRenderMark',
  AFTER_ADD_VRENDER_MARK = 'afterAddVRenderMark',

  AFTER_VRENDER_NEXT_RENDER = 'afterVRenderNextRender',

  BEFORE_ELEMENT_UPDATE_DATA = 'beforeElementUpdateData',
  AFTER_ELEMENT_UPDATE_DATA = 'afterElementUpdateData',

  BEFORE_ELEMENT_STATE = 'beforeElementState',
  AFTER_ELEMENT_STATE = 'afterElementState',

  BEFORE_ELEMENT_ENCODE = 'beforeElementEncode',
  AFTER_ELEMENT_ENCODE = 'afterElementEncode',

  ANIMATION_START = 'animationStart',
  ANIMATION_END = 'animationEnd',

  ELEMENT_ANIMATION_START = 'elementAnimationStart',
  ELEMENT_ANIMATION_END = 'elementAnimationEnd',

  ALL_ANIMATION_START = 'allAnimationStart',
  ALL_ANIMATION_END = 'allAnimationEnd'
}
```

<a id="type-803024406435"></a>
## DataLinkAxis

来源：`packages/vchart/src/core/interface.ts`，VChart 2.1.7

```typescript
export type DataLinkAxis = {
  /**
   * 关联的轴 id，目前仅支持直角坐标轴
   * the binding axis id
   */
  axisId?: StringOrNumber;
  /**
   * 关联的轴索引，目前仅支持直角坐标轴
   * the binding axis index
   */
  axisIndex?: number;
};
```

相关定义：[StringOrNumber](AdditionalTypes-Type-Definition.md#type-2f92a26f4727)

<a id="type-84a00f86d855"></a>
## DataLinkSeries

来源：`packages/vchart/src/core/interface.ts`，VChart 2.1.7

```typescript
export type DataLinkSeries = {
  /**
   * 关联的系列 id
   * the binding series id
   */
  seriesId?: StringOrNumber;
  /**
   * 关联的系列索引
   * the binding series index
   */
  seriesIndex?: number;
};
```

相关定义：[StringOrNumber](AdditionalTypes-Type-Definition.md#type-2f92a26f4727)

<a id="type-f6dc633e5201"></a>
## IVChart

来源：`packages/vchart/src/core/interface.ts`，VChart 2.1.7

```typescript
export interface IVChart {
  readonly id: number;

  /**
   * **同步**渲染图表。
   * @param morphConfig 图表 morph 动画配置，可选
   * @returns VChart 实例
   */
  renderSync: (morphConfig?: IMorphConfig) => IVChart;

  /**
   * **异步**渲染图表。
   * @async
   * @param morphConfig 图表 morph 动画配置，可选
   * @returns VChart 实例
   */
  renderAsync: (morphConfig?: IMorphConfig) => Promise<IVChart>;

  /**
   * **异步**更新数据。
   * @async
   * @param id 数据 id
   * @param data 数据值
   * @param options 数据参数
   * @returns VChart 实例
   */
  updateData: (id: StringOrNumber, data: Datum[] | string, options?: IParserOptions) => Promise<IVChart>;

  /**
   * **异步**批量更新数据。
   * @async
   * @param list 待更新的数据列表
   * @returns VChart 实例
   */
  updateDataInBatches: (list: { id: string; data: Datum[]; options?: IParserOptions }[]) => Promise<IVChart>;

  /**
   * **同步**更新数据。
   * @param id 数据 id
   * @param data 数据值
   * @param options 数据参数
   * @returns VChart 实例
   */
  updateDataSync: (id: StringOrNumber, data: Datum[], options?: IParserOptions) => IVChart;

  /**
   * **同步方法** 更新数据
   * @async
   * @param data 图表配置结构中的数据对象
   * @returns VChart 实例
   */
  updateFullDataSync: (data: IDataValues | IDataValues[], reRender?: boolean) => IVChart;

  /**
   * **同步方法** 更新数据
   * @param data 图表配置结构中的数据对象
   * @returns VChart 实例
   */
  updateFullData: (data: IDataValues | IDataValues[], reRender?: boolean) => Promise<IVChart>;

  /**
   * **异步**spec 更新。
   * @sync
   * @param spec
   * @param forceMerge
   * @returns
   */
  updateSpec: (
    spec: ISpec,
    forceMerge?: boolean,
    morphConfig?: IMorphConfig,
    userUpdateOptions?: IUpdateSpecResult
  ) => Promise<IVChart>;

  /**
   * **同步方法**spec 更新。
   * @param spec
   * @param forceMerge
   * @returns
   */
  updateSpecSync: (
    spec: ISpec,
    forceMerge?: boolean,
    morphConfig?: IMorphConfig,
    userUpdateOptions?: IUpdateSpecResult
  ) => void;

  /**
   * **同步方法** 模块 spec 更新
   * @param filter
   * @param spec
   * @param forceMerge
   * @returns
   * @since 1.4.0
   */
  updateModelSpecSync: (
    filter: string | { type: string; index: number },
    spec: unknown,
    forceMerge?: boolean,
    morphConfig?: IMorphConfig
  ) => IVChart;

  /**
   * **异步方法** 模块 spec 更新
   * @async
   * @param filter
   * @param spec
   * @param forceMerge
   * @returns
   * @since 1.4.0
   */
  updateModelSpec: (
    filter: string | { type: string; index: number },
    spec: unknown,
    forceMerge?: boolean,
    morphConfig?: IMorphConfig
  ) => Promise<IVChart>;

  /** 更新 spec 并重新编译（不渲染），返回是否成功 */
  updateSpecAndRecompile: (spec: ISpec, forceMerge: boolean, option: IVChartRenderOption) => boolean;

  /**
   * 更新绘制区域。
   * @param viewBox 绘制区域
   * @param reRender 是否重新渲染，默认为 true
   * @returns
   */
  updateViewBox: (viewBox: IBoundsLike, reRender?: boolean) => IVChart;

  /**
   * **异步方法**，图表尺寸更新方法。
   * @async
   * @param width 宽度
   * @param height 高度
   * @returns VChart 当前实例
   */
  resize: (width: number, height: number) => Promise<IVChart>;

  /**
   * 销毁图表。
   */
  release: () => void;

  /**
   * 事件监听
   */
  on: ((eType: EventType, handler: EventCallback<ExtendEventParam>) => void) &
    ((eType: EventType, query: EventQuery, handler: EventCallback<ExtendEventParam>) => void);
  off: (eType: EventType, handler?: EventCallback<ExtendEventParam>) => void;

  /**
   * 更新或设置图元状态。
   * @param state 状态筛选器
   * @param filter 筛选器
   */
  updateState: (
    state: Record<string, Omit<IMarkStateSpec<unknown>, 'style'>>,
    filter?: (series: ISeries, mark: IMark, stateKey: string) => boolean //series + mark 筛选
  ) => void;

  /**
   * 更新图元选中状态。
   * @param datum hover 图元数据
   * @param filter 筛选器 用来筛选系列与mark
   * @param region region 筛选器
   */
  setSelected: (
    datum: MaybeArray<any> | null,
    filter?: (series: ISeries, mark: IMark) => boolean,
    region?: IRegionQuerier
  ) => void;

  /**
   * 更新图元 hover 状态
   * @param datum hover 图元数据
   * @param filter 筛选器 用来筛选系列与mark
   * @param region region 筛选器
   */
  setHovered: (
    datum: MaybeArray<Datum> | null,
    filter?: (series: ISeries, mark: IMark) => boolean,
    region?: IRegionQuerier
  ) => void;

  /**
   * 清除所有图元的状态
   * @param state 状态名
   *
   * @since 1.11.0
   */
  clearState: (state: string) => void;

  /**
   * 清除所有图元的选中状态
   *
   * @since 1.11.0
   */
  clearSelected: () => void;

  /**
   * 清除所有图元的hover状态
   *
   * @since 1.11.0
   */
  clearHovered: () => void;

  /**
   * 获取当前主题，会返回完整的主题配置（只能获取用户通过`setCurrentTheme`方法设置过的主题，默认值为`ThemeManager`统一设置的主题）
   * */
  getCurrentTheme: () => ITheme;

  /**
   * 获取当前主题名称（只能获取用户通过`setCurrentTheme`方法设置过的主题，默认值为`ThemeManager`统一设置的主题）
   */
  getCurrentThemeName: () => string;

  /**
   * **异步方法**， 设置当前主题。
   * @param name 主题名称
   * @returns
   */
  setCurrentTheme: (name: string) => Promise<IVChart>;

  /**
   * 自定义 TooltipHandler。
   * @param tooltipHandler
   */
  setTooltipHandler: (tooltipHandler: ITooltipHandler) => void;

  /**
   * 获取用户定义的 TooltipHandler
   * @returns ITooltipHandler
   */
  getTooltipHandlerByUser: () => ITooltipHandler | undefined;

  /**
   * 获取 TooltipHandler
   * @returns
   */
  getTooltipHandler: () => ITooltipHandler | undefined;

  /**
   * 手动调用展示 tooltip
   * @param datum 原始数据
   * @param options
   * @returns
   */
  showTooltip: (datum: Datum, options: IShowTooltipOption) => boolean;

  /**
   * 手动调用，关闭 tooltip
   * @returns
   */
  hideTooltip: () => boolean;

  // 图例相关 api
  /**
   * 根据图例组件 id 获取图例数据
   * @param id 组件 id
   * @returns
   */
  getLegendDataById: (id: string) => Datum[];

  /**
   * 根据图例组件索引获取图例数据
   * @param index 图例索引，默认为 0
   * @returns
   */
  getLegendDataByIndex: (index?: number) => Datum[];

  /**
   * 根据图例组件 id 获取当前图例的选中项
   * @param id 组件 id
   * @returns
   */
  getLegendSelectedDataById: (id: string) => StringOrNumber[];

  /**
   * 根据图例组件索引获取当前图例的选中项
   * @param index 图例索引，默认为 0
   * @returns
   */
  getLegendSelectedDataByIndex: (index?: number) => StringOrNumber[];

  /**
   * 根据图例组件 id 更新图例选中数据
   * @param id
   * @returns
   */
  setLegendSelectedDataById: (id: string, selectedData: StringOrNumber[]) => void;

  /**
   * 根据图例组件索引更新图例选中数据
   * @param index 图例索引，默认为 0
   * @returns
   */
  setLegendSelectedDataByIndex: (index: number, selectedData: StringOrNumber[]) => void;

  /**
   * **异步方法**返回一个包含图片展示的 data URI。
   * @returns data URI
   */
  getDataURL: () => Promise<any>;

  /**
   * **异步方法** 导出图表图片，只支持浏览器端。
   * @param name 保存的图片名称
   * @returns
   */
  exportImg: (name?: string) => Promise<void>;

  /**
   * 导出绘制了图表内容的 canvas
   * @returns HTMLCanvasElement
   * @since 1.5.2
   */
  exportCanvas: () => HTMLCanvasElement | undefined;

  /**
   * 目前仅支持 node 环境，用于 node 端的图片导出
   * @returns
   */
  getImageBuffer: () => void;
  /**
   * 设置自定义布局
   */
  setLayout: (layout: LayoutCallBack) => void;
  /**
   * 强制重新布局
   */
  reLayout: () => void;

  /**
   * 获取编译器实例
   * @returns
   */
  getCompiler: () => ICompiler;

  /**
   * Get the chart instance
   * 获取 Chart 图表实例。
   * @returns Chart 实例
   */
  getChart: () => Maybe<IChart>;

  /**
   * Get the renderer instance.
   * 获取渲染引擎实例。
   * @returns the instance of VRender Stage
   */
  getStage: () => IStage;

  /**
   * 获取 canvas dom
   * @returns HTMLCanvasElement | undefined
   */
  getCanvas: () => HTMLCanvasElement | undefined;

  /**
   * 获取图表的 dom 容器
   * @returns
   */
  getContainer: () => Maybe<HTMLElement>;

  /**
   * 获取图表所有的组件实例
   * @returns 组件实例
   */
  getComponents: () => IComponent[];

  /**
   * 获取图表的 DataSet 实例
   * @returns DataSet 实例
   */
  getDataSet: () => Maybe<DataSet>;

  /**
   * 获取图表的 Scale 实例
   * @param scaleId scale 的id
   * @returns Scale 实例
   * @since 1.10.4
   */
  getScale: (scaleId: string) => IBaseScale | null;

  /**
   * 手动调用触发 dimension 交互效果。
   * @param datum dimension 值
   * @param options 触发配置
   * @returns
   */
  setDimensionIndex: (value: StringOrNumber, options?: DimensionIndexOption) => void;

  /**
   * 如果传入参数, 则禁用/开启 dimension 交互事件
   * 如果不传入参数, 获取当前是否禁用 dimension 交互事件
   */
  disableDimensionHoverEvent: (disabled?: boolean) => void;

  /**
   * 禁用/开启 crosshair
   */
  disableCrossHair: (disabled: boolean) => void;

  /**
   * 禁用/开启 tooltip
   */
  disableTooltip: (disabled: boolean) => void;

  // 数据转换相关的 api
  /**
   * Convert the data to coordinate position
   * @param datum the datum to convert
   * @param dataLinkInfo the data link info, could be seriesId or seriesIndex, default is { seriesIndex: 0 }
   * @param isRelativeToCanvas 是否相对画布坐标，默认为 false Whether relative to canvas coordinates, default is false
   * @param checkInViewData 是否检查数据对应的图元是否在视图中，如果不在视图中，返回 null
   * @returns
   */
  convertDatumToPosition: (
    datum: Datum,
    dataLinkInfo?: DataLinkSeries,
    isRelativeToCanvas?: boolean,
    checkInViewData?: boolean
  ) => IPoint | null;

  /**
   * Convert the value to coordinate position
   * @param value number | [number, number], the value to convert
   * @param dataLinkInfo the data link info, could be seriesId,seriesIndex,axisId,axisIndex
   * @param isRelativeToCanvas 是否相对画布坐标，默认为 false Whether relative to canvas coordinates, default is false
   * returns
   */
  convertValueToPosition: ((
    value: StringOrNumber,
    dataLinkInfo: DataLinkAxis,
    isRelativeToCanvas?: boolean
  ) => number | null) &
    ((
      value: [StringOrNumber, StringOrNumber],
      dataLinkInfo: DataLinkSeries,
      isRelativeToCanvas?: boolean
    ) => IPoint | null);

  /**
   * 根据 indicator 组件 id 更新 indicator 数据
   * @param id spec 中定义的 indicator id
   * @param datum 具体数据项
   * @since 1.11.7
   */
  updateIndicatorDataById: (id: string, datum?: Datum) => void;

  /**
   * 根据 indicator 组件 id 更新 indicator 数据
   * @param index  indicator 索引下标
   * @param datum 具体数据项
   * @since 1.11.7
   */
  updateIndicatorDataByIndex: (index?: number, datum?: Datum) => void;

  /**
   * 地图缩放 API
   * @param [regionIndex=0] 根据索引顺序指定某个 region 区域的地图坐标系进行缩放
   * @param zoom 缩放比例
   * @param center 缩放中心
   * @since 1.11.10
   */
  geoZoomByIndex: (regionIndex: number, zoom: number, center?: { x: number; y: number }) => void;

  /**
   * 地图缩放 API
   * @param 根据 region id 指定某个 region 区域的地图坐标系进行缩放
   * @param zoom 缩放比例
   * @param center 缩放中心
   * @since 1.11.10
   */
  geoZoomById: (regionId: string | number, zoom: number, center?: { x: number; y: number }) => void;
  /**
   * @since 2.0.3
   * 当前图表是否开启了动画功能
   */
  isAnimationEnable: () => boolean;
  /** 停止正在进行的所有动画 */
  stopAnimation: () => void;

  /** 暂停正在进行的所有动画 */
  pauseAnimation: () => void;

  /** 恢复暂停时正在进行的所有动画 */
  resumeAnimation: () => void;

  /** 注册实例函数 */
  registerFunction: (key: string, fun: Function) => void;

  /** 注销实例函数 */
  unregisterFunction: (key: string) => void;

  /** 获取实例函数 */
  getFunction: (key: string) => Function | null;

  /** 获取实例函数列表 */
  getFunctionList: () => string[] | null;

  /** 获取图表 spec 详细信息 */
  getSpecInfo: () => IChartSpecInfo;

  /** 设置运行时 spec */
  setRuntimeSpec: (spec: any) => void;

  /** 获取运行时 spec */
  getSpec: () => any;

  /** 获取当前容器宽高 */
  getCurrentSize: () => IContainerSize;

  /** 旋转图表 需要注册插件 */
  rotate90WithTransform?: (rotateDom: HTMLElement) => void;

  /** 取消图表旋转 */
  cancelTransform?: (rotateDom: HTMLElement) => void;
}
```

相关定义：[IMorphConfig](AdditionalTypes-Type-Definition.md#type-bffef8c15a00)、[StringOrNumber](AdditionalTypes-Type-Definition.md#type-2f92a26f4727)、[Datum](AdditionalTypes-Type-Definition.md#type-bf5eb9a79e61)、[IParserOptions](AdditionalTypes-Type-Definition.md#type-63f1dbc535e0)、[IDataValues](AdditionalTypes-Type-Definition.md#type-218b08963b1d)、[ISpec](AdditionalTypes-Type-Definition.md#type-c3727b86f632)、[IUpdateSpecResult](AdditionalTypes-Type-Definition.md#type-646a207a21dd)、[IVChartRenderOption](AdditionalTypes-Type-Definition.md#type-88e49d0ebe2f)、[IBoundsLike](AdditionalTypes-Type-Definition.md#type-e61ecce4e47c)、[EventType](AdditionalTypes-Type-Definition.md#type-a71637b330ab)、[EventCallback](AdditionalTypes-Type-Definition.md#type-bc53e0f9fdb2)、[ExtendEventParam](AdditionalTypes-Type-Definition.md#type-577e7fff4950)、[EventQuery](AdditionalTypes-Type-Definition.md#type-61ce50950087)、[IMarkStateSpec](AdditionalTypes-Type-Definition.md#type-4d46c5681360)、[ISeries](AdditionalTypes-Type-Definition.md#type-29ca9e871dc0)、[IMark](AdditionalTypes-Type-Definition.md#type-50aedeb586cf)、[MaybeArray](AdditionalTypes-Type-Definition.md#type-915c1abd7543)、[IRegionQuerier](AdditionalTypes-Type-Definition.md#type-a826f89dd07b)、[ITheme](ITheme-Type-Definition.md)、[ITooltipHandler](AdditionalTypes-Type-Definition.md#type-73b5fb837aea)、[IShowTooltipOption](AdditionalTypes-Type-Definition.md#type-b4df769a6b46)、[LayoutCallBack](AdditionalTypes-Type-Definition.md#type-0bf7cec9094c)、[ICompiler](AdditionalTypes-Type-Definition.md#type-cbf1a5d7de9b)、[Maybe](AdditionalTypes-Type-Definition.md#type-644c0bc1509c)、[IChart](AdditionalTypes-Type-Definition.md#type-d27fa13b0c29)、[IStage](AdditionalTypes-Type-Definition.md#type-454a11518dd1)、[IComponent](AdditionalTypes-Type-Definition.md#type-5d7fe81ad96c)、[DataSet](AdditionalTypes-Type-Definition.md#type-8d2b64638b97)、[IBaseScale](AdditionalTypes-Type-Definition.md#type-f4ea6ab4e67d)、[DimensionIndexOption](AdditionalTypes-Type-Definition.md#type-5b5f8e33e6e1)、[DataLinkSeries](AdditionalTypes-Type-Definition.md#type-84a00f86d855)、[IPoint](AdditionalTypes-Type-Definition.md#type-58fdfd9a6a7b)、[DataLinkAxis](AdditionalTypes-Type-Definition.md#type-803024406435)、[IChartSpecInfo](AdditionalTypes-Type-Definition.md#type-618e9dfe06cf)、[IContainerSize](AdditionalTypes-Type-Definition.md#type-5c34c2234a2c)

<a id="type-88e49d0ebe2f"></a>
## IVChartRenderOption

来源：`packages/vchart/src/core/interface.ts`，VChart 2.1.7

```typescript
export interface IVChartRenderOption {
  /** morphing 动画 spec */
  morphConfig?: IMorphConfig;
  /** 是否重新转换图表 spec */
  transformSpec?: boolean;
  actionSource?: VChartRenderActionSource;
}
```

相关定义：[IMorphConfig](AdditionalTypes-Type-Definition.md#type-bffef8c15a00)、[VChartRenderActionSource](AdditionalTypes-Type-Definition.md#type-3bb499134256)

<a id="type-3bb499134256"></a>
## VChartRenderActionSource

来源：`packages/vchart/src/core/interface.ts`，VChart 2.1.7

```typescript
export type VChartRenderActionSource =
  | 'render'
  | 'updateSpec'
  | 'updateModelSpec'
  | 'setCurrentTheme'
  | 'updateSpecAndRecompile';
```

<a id="type-d92fd69b2371"></a>
## StatisticOperations

来源：`packages/vchart/src/data/transforms/interface.ts`，VChart 2.1.7

```typescript
export type StatisticOperations = Array<'max' | 'min' | 'values' | 'array-max' | 'array-min' | 'allValid'>;
```

<a id="type-15e7376683b8"></a>
## DimensionEventParams

来源：`packages/vchart/src/event/events/dimension/interface.ts`，VChart 2.1.7

```typescript
export type DimensionEventParams = BaseEventParams & {
  action: 'enter' | 'leave' | 'move' | 'click';
  dimensionInfo: IDimensionInfo[];
};
```

相关定义：[BaseEventParams](AdditionalTypes-Type-Definition.md#type-5ccfcc25894f)、[IDimensionInfo](AdditionalTypes-Type-Definition.md#type-06b8a10af7b9)

<a id="type-5b72dbd75644"></a>
## IDimensionData

来源：`packages/vchart/src/event/events/dimension/interface.ts`，VChart 2.1.7

```typescript
export interface IDimensionData {
  /** 图元上的原始数据（考虑到有多个图元的情况，实际为数组类型） */
  datum: Datum[];
  /** 图元所在的系列实例 */
  series: ISeries;
  /** 该数据项的 hash 值 */
  key?: string;
}
```

相关定义：[Datum](AdditionalTypes-Type-Definition.md#type-bf5eb9a79e61)、[ISeries](AdditionalTypes-Type-Definition.md#type-29ca9e871dc0)

<a id="type-06b8a10af7b9"></a>
## IDimensionInfo

来源：`packages/vchart/src/event/events/dimension/interface.ts`，VChart 2.1.7

```typescript
export interface IDimensionInfo {
  /** 维度项索引，在连续轴上不存在 */
  index?: number;
  /** 维度项原始值，在离散轴上为维度标签，在连续轴上为数字 */
  value: string | number;
  /** 维度项所在坐标（scale 执行后的值） */
  position?: number;
  /** 维度项所在轴 */
  axis?: IAxis;
  /** 维度项对应数据 */
  data: IDimensionData[];
  /** 维度对应的类型 */
  dimType?: string;
}
```

相关定义：[IAxis](AdditionalTypes-Type-Definition.md#type-9cbd2aefe72d)、[IDimensionData](AdditionalTypes-Type-Definition.md#type-5b72dbd75644)

<a id="type-5ccfcc25894f"></a>
## BaseEventParams

来源：`packages/vchart/src/event/interface.ts`，VChart 2.1.7

```typescript
export type BaseEventParams = EventParams & {
  /**
   * 事件对象
   */
  event: SuperEvent;
  item: IMarkGraphic;
  datum: Datum;
  source: EventSourceType;
};
```

相关定义：[EventParams](AdditionalTypes-Type-Definition.md#type-d0b5c8774949)、[SuperEvent](AdditionalTypes-Type-Definition.md#type-6c02331b393a)、[IMarkGraphic](AdditionalTypes-Type-Definition.md#type-6b98396ffcb3)、[Datum](AdditionalTypes-Type-Definition.md#type-bf5eb9a79e61)、[EventSourceType](AdditionalTypes-Type-Definition.md#type-1c63b5fdb81d)

<a id="type-30b50e7b9294"></a>
## ComponentType

来源：`packages/vchart/src/event/interface.ts`，VChart 2.1.7

```typescript
export type ComponentType =
  | 'axis'
  | 'dataZoom'
  | 'indicator'
  | 'legend'
  | 'markLine'
  | 'markArea'
  | 'markPoint'
  | 'tooltip'
  | 'title'
  | 'label'
  | 'totalLabel'
  | 'customMark';
```

<a id="type-3e4576b7a2a4"></a>
## EventBubbleLevel

来源：`packages/vchart/src/event/interface.ts`，VChart 2.1.7

```typescript
export type EventBubbleLevel = keyof typeof Event_Bubble_Level;
```

相关定义：[Event_Bubble_Level](AdditionalTypes-Type-Definition.md#type-c7b3d3b6b38f)

<a id="type-bc53e0f9fdb2"></a>
## EventCallback

来源：`packages/vchart/src/event/interface.ts`，VChart 2.1.7

```typescript
export type EventCallback<Params extends EventParams> = (params: Params) => boolean | void;
```

相关定义：[EventParams](AdditionalTypes-Type-Definition.md#type-d0b5c8774949)

<a id="type-b46fb265f1d7"></a>
## EventFilter

来源：`packages/vchart/src/event/interface.ts`，VChart 2.1.7

```typescript
export type EventFilter = {
  source: EventSourceType;
  level: EventBubbleLevel;
  type: string | null;
  markName: string | null;
  nodeName: string | null;
  userId: StringOrNumber | null;
  filter: (params: Partial<BaseEventParams>) => boolean | null;
};
```

相关定义：[EventSourceType](AdditionalTypes-Type-Definition.md#type-1c63b5fdb81d)、[EventBubbleLevel](AdditionalTypes-Type-Definition.md#type-3e4576b7a2a4)、[StringOrNumber](AdditionalTypes-Type-Definition.md#type-2f92a26f4727)、[BaseEventParams](AdditionalTypes-Type-Definition.md#type-5ccfcc25894f)

<a id="type-9dde9b52a754"></a>
## EventHandler

来源：`packages/vchart/src/event/interface.ts`，VChart 2.1.7

```typescript
export type EventHandler<Params extends EventParams> = {
  callback: EventCallback<Params>;
  query: EventQuery | null;
  // 如果有 debounce/throttle 配置则需要封装原始回调函数
  wrappedCallback?: EventCallback<Params>;
  // 转换后的事件筛选配置
  filter?: EventFilter;
  // handler 是否被禁止触发
  prevented?: boolean;
};
```

相关定义：[EventCallback](AdditionalTypes-Type-Definition.md#type-bc53e0f9fdb2)、[EventQuery](AdditionalTypes-Type-Definition.md#type-61ce50950087)、[EventFilter](AdditionalTypes-Type-Definition.md#type-b46fb265f1d7)、[EventParams](AdditionalTypes-Type-Definition.md#type-d0b5c8774949)

<a id="type-d0b5c8774949"></a>
## EventParams

来源：`packages/vchart/src/event/interface.ts`，VChart 2.1.7

```typescript
export type EventParams = {
  /**
   * 事件对象
   */
  event?: SuperEvent;
  /**
   * 供不同的事件用于存储期望携带的数据
   */
  value?: any;
  /**
   * 事件来源的 mark
   */
  mark?: IMark;
  /**
   * 事件来源的 model
   */
  model?: IModel;
  /**
   * 事件来源的 chart
   */
  chart?: IChart;
  /**
   * 事件拾取到的图元的数据
   */
  datum?: Datum;
  /**
   * 拾取到的图形节点
   */
  node?: IGraphic;
  /**
   * @since 1.10.4
   * 生命周期相关事件，包括：
   *  - 'rendered'
   *  - 'initialized'
   *  - 'animationFinished'
   *  - 'renderFinished'
   *  - 'layoutStart'
   *  - 'layoutEnd'
   * 会返回vchart实例
   */
  vchart?: IVChart;
};
```

相关定义：[SuperEvent](AdditionalTypes-Type-Definition.md#type-6c02331b393a)、[IMark](AdditionalTypes-Type-Definition.md#type-50aedeb586cf)、[IModel](AdditionalTypes-Type-Definition.md#type-2854a5da67ea)、[IChart](AdditionalTypes-Type-Definition.md#type-d27fa13b0c29)、[Datum](AdditionalTypes-Type-Definition.md#type-bf5eb9a79e61)、[IGraphic](AdditionalTypes-Type-Definition.md#type-a766bc91cce3)、[IVChart](AdditionalTypes-Type-Definition.md#type-f6dc633e5201)

<a id="type-bb8c7f815cf1"></a>
## EventParamsDefinition

来源：`packages/vchart/src/event/interface.ts`，VChart 2.1.7

```typescript
export type EventParamsDefinition = {
  // 基础事件回调参数
  pointerdown: BaseEventParams;
  pointerup: BaseEventParams;
  pointerupoutside: BaseEventParams;
  pointertap: BaseEventParams;
  pointerover: BaseEventParams;
  pointermove: BaseEventParams;
  pointerenter: BaseEventParams;
  pointerleave: BaseEventParams;
  pointerout: BaseEventParams;
  mousedown: BaseEventParams;
  mouseup: BaseEventParams;
  mouseupoutside: BaseEventParams;
  rightdown: BaseEventParams;
  rightup: BaseEventParams;
  rightupoutside: BaseEventParams;
  click: BaseEventParams;
  dblclick: BaseEventParams;
  mousemove: BaseEventParams;
  mouseover: BaseEventParams;
  mouseout: BaseEventParams;
  mouseenter: BaseEventParams;
  mouseleave: BaseEventParams;
  wheel: BaseEventParams;
  touchstart: BaseEventParams;
  touchend: BaseEventParams;
  touchendoutside: BaseEventParams;
  touchmove: BaseEventParams;
  touchcancel: BaseEventParams;

  dragstart: BaseEventParams;
  drag: BaseEventParams;
  dragenter: BaseEventParams;
  dragleave: BaseEventParams;
  dragover: BaseEventParams;
  dragend: BaseEventParams;
  drop: BaseEventParams;

  tap: BaseEventParams;
  pan: BaseEventParams;
  panstart: BaseEventParams;
  panend: BaseEventParams;
  press: BaseEventParams;
  pressup: BaseEventParams;
  pressend: BaseEventParams;
  pinch: BaseEventParams;
  pinchstart: BaseEventParams;
  pinchend: BaseEventParams;
  swipe: BaseEventParams;

  // VChart 内置的扩展组合事件
  dimensionHover: DimensionEventParams;
  dimensionClick: DimensionEventParams;
  tooltipShow: TooltipEventParams;
  tooltipHide: TooltipEventParams;
  tooltipRelease: TooltipEventParams;
  afterLayout: LayoutEventParam;

  // 交互相关事件
  'element-select:start': InteractionEventParam;
  'element-select:reset': InteractionEventParam;
  'element-highlight:start': InteractionEventParam;
  'element-highlight:reset': InteractionEventParam;

  // 扩展事件参数
  [key: string]: ExtendEventParam;
};
```

相关定义：[BaseEventParams](AdditionalTypes-Type-Definition.md#type-5ccfcc25894f)、[DimensionEventParams](AdditionalTypes-Type-Definition.md#type-15e7376683b8)、[TooltipEventParams](AdditionalTypes-Type-Definition.md#type-e5c2cb9ed465)、[LayoutEventParam](AdditionalTypes-Type-Definition.md#type-e80f4120aa8f)、[InteractionEventParam](AdditionalTypes-Type-Definition.md#type-27175d2429ec)、[ExtendEventParam](AdditionalTypes-Type-Definition.md#type-577e7fff4950)

<a id="type-61ce50950087"></a>
## EventQuery

来源：`packages/vchart/src/event/interface.ts`，VChart 2.1.7

```typescript
export type EventQuery = {
  /**
   * 事件的冒泡层级配置，其中 model 指的是图表的内部模型，包括 region、series 以及 component
   */
  level?: EventBubbleLevel;
  /**
   * 事件来源配置。
   * - `window`: window 事件
   * - `chart`: 图表事件
   */
  source?: EventSourceType;

  /**
   * vrender 图形节点名称
   */
  nodeName?: string;
  /**
   * mark 图元名称
   */
  markName?: string;
  /**
   * 仅在 level 为 'mark' 或者 'model' 的场景下使用，用于筛选 mark 类型或者图表组成元素模型类型
   */
  type?: EventTargetType;
  /**
   * 用户在 spec 上配置的 id
   */
  id?: StringOrNumber;
  /**
   * 自定义过滤函数
   * @param params
   * @returns
   */
  filter?: (params: Partial<BaseEventParams>) => boolean;

  throttle?: number;
  debounce?: number;
  /**
   * 是否阻止冒泡
   */
  consume?: boolean;
};
```

相关定义：[EventBubbleLevel](AdditionalTypes-Type-Definition.md#type-3e4576b7a2a4)、[EventSourceType](AdditionalTypes-Type-Definition.md#type-1c63b5fdb81d)、[EventTargetType](AdditionalTypes-Type-Definition.md#type-5c354e2dcaad)、[StringOrNumber](AdditionalTypes-Type-Definition.md#type-2f92a26f4727)、[BaseEventParams](AdditionalTypes-Type-Definition.md#type-5ccfcc25894f)

<a id="type-1c63b5fdb81d"></a>
## EventSourceType

来源：`packages/vchart/src/event/interface.ts`，VChart 2.1.7

```typescript
export type EventSourceType = keyof typeof Event_Source_Type;
```

相关定义：[Event_Source_Type](AdditionalTypes-Type-Definition.md#type-e0819375e8e5)

<a id="type-5c354e2dcaad"></a>
## EventTargetType

来源：`packages/vchart/src/event/interface.ts`，VChart 2.1.7

```typescript
export type EventTargetType = MarkType | ComponentType | SeriesType;
```

相关定义：[MarkType](AdditionalTypes-Type-Definition.md#type-15c62fdeb46b)、[ComponentType](AdditionalTypes-Type-Definition.md#type-30b50e7b9294)、[SeriesType](AdditionalTypes-Type-Definition.md#type-43422e48d197)

<a id="type-a71637b330ab"></a>
## EventType

来源：`packages/vchart/src/event/interface.ts`，VChart 2.1.7

```typescript
export type EventType =
  | 'pointerdown'
  | 'pointerup'
  | 'pointerupoutside'
  | 'pointertap'
  | 'pointerover'
  | 'pointermove'
  | 'pointerenter'
  | 'pointerleave'
  | 'pointerout'
  | 'mousedown'
  | 'mouseup'
  | 'mouseupoutside'
  | 'rightdown'
  | 'rightup'
  | 'rightupoutside'
  | 'click'
  | 'dblclick'
  | 'mousemove'
  | 'mouseover'
  | 'mouseout'
  | 'mouseenter'
  | 'mouseleave'
  | 'wheel'
  | 'touchstart'
  | 'touchend'
  | 'touchendoutside'
  | 'touchmove'
  | 'touchcancel'
  | 'tap'
  | 'dragstart'
  | 'drag'
  | 'dragenter'
  | 'dragleave'
  | 'dragover'
  | 'dragend'
  | 'drop'
  | 'pan'
  | 'panstart'
  | 'panend'
  | 'press'
  | 'pressup'
  | 'pressend'
  | 'pinch'
  | 'pinchstart'
  | 'pinchend'
  | 'swipe'
  | keyof typeof ChartEvent
  | keyof typeof HOOK_EVENT
  | string;
```

相关定义：[ChartEvent](AdditionalTypes-Type-Definition.md#type-4c68f24bfcad)、[HOOK_EVENT](AdditionalTypes-Type-Definition.md#type-f58080efc74b)

<a id="type-577e7fff4950"></a>
## ExtendEventParam

来源：`packages/vchart/src/event/interface.ts`，VChart 2.1.7

```typescript
export type ExtendEventParam = EventParams & {
  event?: Event;
  item?: IMarkGraphic;
  datum?: Datum;
  source?: EventSourceType;
};
```

相关定义：[EventParams](AdditionalTypes-Type-Definition.md#type-d0b5c8774949)、[IMarkGraphic](AdditionalTypes-Type-Definition.md#type-6b98396ffcb3)、[Datum](AdditionalTypes-Type-Definition.md#type-bf5eb9a79e61)、[EventSourceType](AdditionalTypes-Type-Definition.md#type-1c63b5fdb81d)

<a id="type-4860a71f1f46"></a>
## IComposedEvent

来源：`packages/vchart/src/event/interface.ts`，VChart 2.1.7

```typescript
export interface IComposedEvent {
  register: <Evt extends EventType>(eType: Evt, handler: EventHandler<EventParamsDefinition[Evt]>) => void;
  unregister: () => void;
  dispatch: (v: unknown, opt: unknown) => unknown;
}
```

相关定义：[EventType](AdditionalTypes-Type-Definition.md#type-a71637b330ab)、[EventHandler](AdditionalTypes-Type-Definition.md#type-9dde9b52a754)、[EventParamsDefinition](AdditionalTypes-Type-Definition.md#type-bb8c7f815cf1)

<a id="type-17583cb7e08d"></a>
## IEvent

来源：`packages/vchart/src/event/interface.ts`，VChart 2.1.7

```typescript
export interface IEvent {
  on: (<Evt extends EventType>(eType: Evt, callback: EventCallback<EventParamsDefinition[Evt]>) => this) &
    (<Evt extends EventType>(
      eType: Evt,
      query: EventQuery,
      callback: EventCallback<EventParamsDefinition[Evt]>
    ) => this);
  off: (<Evt extends EventType>(eType: Evt, callback?: EventCallback<EventParamsDefinition[Evt]>) => this) &
    (<Evt extends EventType>(
      eType: Evt,
      query: EventQuery,
      callback: EventCallback<EventParamsDefinition[Evt]>
    ) => this);
  emit: <Evt extends EventType>(eType: Evt, params: EventParamsDefinition[Evt], level?: EventBubbleLevel) => void;
  release: () => void;

  getComposedEventMap: () => Map<EventCallback<EventParams>, { eventType: EventType; event: IComposedEvent }>;
  prevent: <Evt extends EventType>(
    eType: Evt,
    except?: {
      handler: EventCallback<EventParamsDefinition[Evt]>;
      level: EventBubbleLevel;
    }
  ) => void;
  allow: <Evt extends EventType>(eType: Evt) => void;
}
```

相关定义：[EventType](AdditionalTypes-Type-Definition.md#type-a71637b330ab)、[EventCallback](AdditionalTypes-Type-Definition.md#type-bc53e0f9fdb2)、[EventParamsDefinition](AdditionalTypes-Type-Definition.md#type-bb8c7f815cf1)、[EventQuery](AdditionalTypes-Type-Definition.md#type-61ce50950087)、[EventBubbleLevel](AdditionalTypes-Type-Definition.md#type-3e4576b7a2a4)、[EventParams](AdditionalTypes-Type-Definition.md#type-d0b5c8774949)、[IComposedEvent](AdditionalTypes-Type-Definition.md#type-4860a71f1f46)

<a id="type-e3c12fa8de7f"></a>
## IEventDispatcher

来源：`packages/vchart/src/event/interface.ts`，VChart 2.1.7

```typescript
export interface IEventDispatcher {
  globalInstance: IVChart;
  register: <Evt extends EventType>(eType: Evt, handler: EventHandler<EventParamsDefinition[Evt]>) => this;
  unregister: <Evt extends EventType>(eType: Evt, handler?: EventHandler<EventParamsDefinition[Evt]>) => this;
  dispatch: <Evt extends EventType>(eType: Evt, params?: EventParamsDefinition[Evt], level?: EventBubbleLevel) => this;
  clear: () => void;
  release: () => void;
  prevent: <Evt extends EventType>(
    eType: Evt,
    except?: {
      handler: EventCallback<EventParamsDefinition[Evt]>;
      level: EventBubbleLevel;
    }
  ) => void;
  allow: <Evt extends EventType>(eType: Evt) => void;
}
```

相关定义：[IVChart](AdditionalTypes-Type-Definition.md#type-f6dc633e5201)、[EventType](AdditionalTypes-Type-Definition.md#type-a71637b330ab)、[EventHandler](AdditionalTypes-Type-Definition.md#type-9dde9b52a754)、[EventParamsDefinition](AdditionalTypes-Type-Definition.md#type-bb8c7f815cf1)、[EventBubbleLevel](AdditionalTypes-Type-Definition.md#type-3e4576b7a2a4)、[EventCallback](AdditionalTypes-Type-Definition.md#type-bc53e0f9fdb2)

<a id="type-27175d2429ec"></a>
## InteractionEventParam

来源：`packages/vchart/src/event/interface.ts`，VChart 2.1.7

```typescript
export type InteractionEventParam = {
  graphics?: IMarkGraphic[];
  datums?: Datum[];
} & Partial<BaseEventParams>;
```

相关定义：[IMarkGraphic](AdditionalTypes-Type-Definition.md#type-6b98396ffcb3)、[Datum](AdditionalTypes-Type-Definition.md#type-bf5eb9a79e61)、[BaseEventParams](AdditionalTypes-Type-Definition.md#type-5ccfcc25894f)

<a id="type-e80f4120aa8f"></a>
## LayoutEventParam

来源：`packages/vchart/src/event/interface.ts`，VChart 2.1.7

```typescript
export type LayoutEventParam = {
  elements: (ILayoutItem & { type: string })[];
} & Partial<BaseEventParams>;
```

相关定义：[ILayoutItem](AdditionalTypes-Type-Definition.md#type-a23ec9ff5239)、[BaseEventParams](AdditionalTypes-Type-Definition.md#type-5ccfcc25894f)

<a id="type-fd27c5f76824"></a>
## PanEventParam

来源：`packages/vchart/src/event/interface.ts`，VChart 2.1.7

```typescript
export type PanEventParam = ExtendEventParam & {
  // x/y方向上的偏移值
  delta: [number, number];
};
```

相关定义：[ExtendEventParam](AdditionalTypes-Type-Definition.md#type-577e7fff4950)

<a id="type-6c02331b393a"></a>
## SuperEvent

来源：`packages/vchart/src/event/interface.ts`，VChart 2.1.7

```typescript
type SuperEvent = Event & {
  [key: string]: any;
};
```

<a id="type-e212628531e0"></a>
## ZoomEventParam

来源：`packages/vchart/src/event/interface.ts`，VChart 2.1.7

```typescript
export type ZoomEventParam = ExtendEventParam & {
  // 缩放值
  scale: number;
  // 缩放中心
  scaleCenter: IPoint;
};
```

相关定义：[ExtendEventParam](AdditionalTypes-Type-Definition.md#type-577e7fff4950)、[IPoint](AdditionalTypes-Type-Definition.md#type-58fdfd9a6a7b)

<a id="type-8a888a648496"></a>
## IInteraction

来源：`packages/vchart/src/interaction/interface/common.ts`，VChart 2.1.7

```typescript
export interface IInteraction {
  setDisableActiveEffect: (disable: boolean) => void;
  addTrigger: (trigger: ITrigger) => void;
  setStatedGraphics: (trigger: ITrigger, graphics: IMarkGraphic[]) => void;
  getStatedGraphics: (trigger: ITrigger) => IMarkGraphic[];
  updateStates: (
    trigger: ITrigger,
    newStatedGraphics: IMarkGraphic[],
    prevStatedGraphics?: IMarkGraphic[],
    state?: string,
    reverseState?: string
  ) => IMarkGraphic[];
  clearAllStates: () => void;
  clearAllStatesOfTrigger: (trigger: ITrigger, state?: string, reverseState?: string) => void;
  clearByState: (stateValue: string) => any;
  updateStateOfGraphics: (stateValue: string, markGraphics: IMarkGraphic[]) => void;
}
```

相关定义：[ITrigger](AdditionalTypes-Type-Definition.md#type-4cc357381c0a)、[IMarkGraphic](AdditionalTypes-Type-Definition.md#type-6b98396ffcb3)

<a id="type-f51a72b7d484"></a>
## IBaseTriggerOptions

来源：`packages/vchart/src/interaction/interface/trigger.ts`，VChart 2.1.7

```typescript
export interface IBaseTriggerOptions {
  type?: string;
  /**
   * 需要处理状态的所有图元
   */
  marks?: IMark[];
  mode?: RenderMode;
  event: {
    on: (eType: string, callback: ITriggerEventHandler) => void;
    off: (eType: string, callback?: ITriggerEventHandler) => void;
    emit: (eType: string, params: any) => void;
  };
  interaction: IInteraction;

  id?: string;

  shouldStart?: (e: any) => boolean;

  shouldUpdate?: (e: any) => boolean;

  shouldEnd?: (e: any) => boolean;

  shouldReset?: (e: any) => boolean;

  onStart?: (e: any) => boolean;

  onUpdate?: (e: any) => boolean;

  onEnd?: (e: any) => boolean;

  onReset?: (e: any) => boolean;
}
```

相关定义：[IMark](AdditionalTypes-Type-Definition.md#type-50aedeb586cf)、[RenderMode](AdditionalTypes-Type-Definition.md#type-875ef0d8fcf4)、[ITriggerEventHandler](AdditionalTypes-Type-Definition.md#type-f4836a1e3d12)、[IInteraction](AdditionalTypes-Type-Definition.md#type-8a888a648496)

<a id="type-4cc357381c0a"></a>
## ITrigger

来源：`packages/vchart/src/interaction/interface/trigger.ts`，VChart 2.1.7

```typescript
export interface ITrigger<TriggerOptions extends IBaseTriggerOptions = any> {
  readonly options: TriggerOptions;
  readonly type: string;
  registerMark: (mark: IMark | IMark[]) => void;
  release: () => void;

  init: () => void;
  start: (g: any, e?: BaseEventParams) => void;
  reset: (g?: IMarkGraphic) => void;
  getStartState: () => string;
  getResetState: () => string;
  updateMarkIdByState: (states: string[]) => void;
  getMarkIdByState: () => Record<string, number[]>;
  getMarks: () => IMark[];
  getMarksByState: (state: string) => IMark[];
}
```

相关定义：[IMark](AdditionalTypes-Type-Definition.md#type-50aedeb586cf)、[BaseEventParams](AdditionalTypes-Type-Definition.md#type-5ccfcc25894f)、[IMarkGraphic](AdditionalTypes-Type-Definition.md#type-6b98396ffcb3)、[IBaseTriggerOptions](AdditionalTypes-Type-Definition.md#type-f51a72b7d484)

<a id="type-f4836a1e3d12"></a>
## ITriggerEventHandler

来源：`packages/vchart/src/interaction/interface/trigger.ts`，VChart 2.1.7

```typescript
export type ITriggerEventHandler = (e: any, markGraphic?: IMarkGraphic) => void;
```

相关定义：[IMarkGraphic](AdditionalTypes-Type-Definition.md#type-6b98396ffcb3)

<a id="type-6b92034e666e"></a>
## ElementSpec

来源：`packages/vchart/src/layout/interface.ts`，VChart 2.1.7

```typescript
export type ElementSpec = (
  | {
      /**
       * 组件对应的spec key，如'legends'表示图例
       */
      modelKey: string;
      /**
       * 组件对应的序号
       */
      modelIndex: number;
    }
  | {
      /**
       * 组件对应的id
       */
      modelId: string;
    }
) & {
  /**
   * 组件在grid布局中所在的列。从左向右，从 0 开始计数
   */
  col: number;
  /**
   * 组件在grid布局中所在的列跨度，即占了几列，默认值为1
   */
  colSpan?: number;
  /**
   * 组件在grid布局中所在的行。从上向下，从 0 开始计数。
   */
  row: number;
  /**
   * 组件在grid布局中所在的行跨度，即占了几行，默认值为1
   */
  rowSpan?: number;
};
```

<a id="type-5de1760225a6"></a>
## IBaseLayoutSpec

来源：`packages/vchart/src/layout/interface.ts`，VChart 2.1.7

```typescript
export interface IBaseLayoutSpec extends ILayoutSpecBase {
  /**
   * 设置布局类型为默认布局
   */
  type: 'base';
  /**
   * 是否在第一次布局完成后，再次布局一次，用于解决第一次布局时，元素宽度或高度为0的问题
   * @since 2.0.7
   */
  secondLayoutLeftRight?: boolean;
}
```

相关定义：[ILayoutSpecBase](AdditionalTypes-Type-Definition.md#type-a40f94687b59)

<a id="type-8c0cc65dc7ab"></a>
## IGridLayoutSpec

来源：`packages/vchart/src/layout/interface.ts`，VChart 2.1.7

```typescript
export interface IGridLayoutSpec extends ILayoutSpecBase {
  /**
   * 设置布局类型为grid布局
   */
  type: 'grid';
  /**
   * grid布局的总列数
   */
  col: number;
  /**
   * grid布局的总行数
   */
  row: number;
  /**
   * 可选配置，指定某几列的宽度
   */
  colWidth?: {
    /**
     * 指定列数，序号从 0 开始
     */
    index: number;
    /**
     * 设置指定列的宽度，单位为像素
     */
    size: number | ((maxSize: number) => number);
  }[];
  /**
   * 可选配置，指定某几行的高度
   */
  rowHeight?: {
    /**
     * 指定行数，序号从 0 开始
     */
    index: number;
    /**
     * 设置指定行的高度，单位为像素
     */
    size: number | ((maxSize: number) => number);
  }[];
  /**
   *
   * 指定所有图表元素所在位置，图表元素的位置起点和占几行几列，可以占多行多列
   * 图表元素位置允许配置重叠。
   */
  elements: ElementSpec[];
}
```

相关定义：[ILayoutSpecBase](AdditionalTypes-Type-Definition.md#type-a40f94687b59)、[ElementSpec](AdditionalTypes-Type-Definition.md#type-6b92034e666e)

<a id="type-a23ec9ff5239"></a>
## ILayoutItem

来源：`packages/vchart/src/layout/interface.ts`，VChart 2.1.7

```typescript
export interface ILayoutItem {
  readonly type: string;
  /**
   * 标记当前布局元素是否需要重新计算布局属性
   * 图表模块可能部分需要重新布局，部分不需要，根据这个tag在布局过程中进行优化
   */
  readonly willLayoutTag: boolean;
  /**
   * 上一次布局的布局尺寸
   */
  readonly lastComputeRect: ILayoutRect;
  /**
   * 标记这个布局Item的方向（left->right, right->left, top->bottom, bottom->top）
   */
  directionStr?: 'l2r' | 'r2l' | 't2b' | 'b2t';
  layoutClip: boolean;
  layoutType: ILayoutType;
  layoutBindRegionID: number | number[];
  layoutOrient: IOrientType;
  /** 是否自动缩进 */
  autoIndent: boolean;

  /**
   * inline元素和其他同行元素的对齐方式
   * 顶部的inline元素，'start' - 顶部对齐；'end' - '底部对齐'; 'middle' - 居中对齐
   * 底部的inline元素，'start' - 底部对齐；'end' - '顶部对齐'; 'middle' - 居中对齐
   * 左侧的inline元素，'start' - 左侧对齐；'end' - '右侧对齐'; 'middle' - 居中对齐
   * 右侧的inline元素，'start' - 右侧对齐；'end' - '左侧对齐'; 'middle' - 居中对齐
   */
  alignSelf?: 'start' | 'end' | 'middle';

  layoutPaddingLeft: number;
  layoutPaddingTop: number;
  layoutPaddingRight: number;
  layoutPaddingBottom: number;

  layoutOffsetX: number;
  layoutOffsetY: number;

  // 越大越先处理
  layoutLevel: number;

  chartLayoutRect: ILayoutRect;

  readonly layoutRectLevelMap: ILayoutRect;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;

  readonly model: ILayoutModel;

  getModelId: () => StringOrNumber;
  getModelVisible: () => boolean;

  getSpec?: () => any;
  setAttrFromSpec: (spec: ILayoutItemSpec, chartViewRect: ILayoutRect) => void;

  setRectInSpec: (rect: ILayoutRect) => ILayoutRect;

  getLayoutStartPoint: () => ILayoutPoint;
  getLayoutRect: () => ILayoutRect;
  getLayout: () => IRect;
  getLastComputeOutBounds: () => IBoundsLike;

  /** 生命周期 */
  onLayoutStart: (layoutRect: IRect, viewRect: ILayoutRect) => void;
  onLayoutEnd: () => void;

  /**
   * 更新元素布局的 layoutRect 大小，用来更新指定布局空间
   */
  setLayoutRect: (rect: Partial<ILayoutRect>, levelMap?: Partial<ILayoutRect>) => void;
  /**
   * 基于元素内部逻辑计算占位空间，rect表示可用空间
   */
  computeBoundsInRect: (rect: ILayoutRect) => ILayoutRect;
  /**
   * 更新元素布局的起始点位置
   */
  setLayoutStartPosition: (pos: Partial<IPoint>) => void;
  /**
   * 更新绝对布局元素的位置信息
   */
  absoluteLayoutInRect: (rect: IRect) => void;
  /**
   * 布局完成后，清楚标记
   */
  clearWillLayoutTag: () => void;
  /**
   * 标记要重新布局
   */
  setWillLayoutTag: () => void;
}
```

相关定义：[ILayoutRect](AdditionalTypes-Type-Definition.md#type-b4324e55ab6b)、[ILayoutType](AdditionalTypes-Type-Definition.md#type-7ececfbaa390)、[IOrientType](AdditionalTypes-Type-Definition.md#type-1c1f18d62ff6)、[ILayoutModel](AdditionalTypes-Type-Definition.md#type-b788a1bf7960)、[StringOrNumber](AdditionalTypes-Type-Definition.md#type-2f92a26f4727)、[ILayoutItemSpec](AdditionalTypes-Type-Definition.md#type-31e5f8b69a13)、[ILayoutPoint](AdditionalTypes-Type-Definition.md#type-6dd6ef1acef0)、[IRect](AdditionalTypes-Type-Definition.md#type-51a55b549762)、[IBoundsLike](AdditionalTypes-Type-Definition.md#type-e61ecce4e47c)、[IPoint](AdditionalTypes-Type-Definition.md#type-58fdfd9a6a7b)

<a id="type-31e5f8b69a13"></a>
## ILayoutItemSpec

来源：`packages/vchart/src/layout/interface.ts`，VChart 2.1.7

```typescript
export interface ILayoutItemSpec {
  /** 当前模块的布局类型，配置为 absolute 的话，当前元素会以图表左上角为原点进行绝对布局 */
  layoutType?: ILayoutType;
  /**
   * 布局顺序等级，等级越大的，越优先布局
   * 比如顶部同时有标题和图例的场景，期望标题先放在顶部，然后放置图例。
   */
  layoutLevel?: number;

  /**
   * inline元素和其他同行元素的对齐方式
   * 顶部的inline元素，'start' - 顶部对齐；'end' - '底部对齐'; 'middle' - 居中对齐
   * 底部的inline元素，'start' - 底部对齐；'end' - '顶部对齐'; 'middle' - 居中对齐
   * 左侧的inline元素，'start' - 左侧对齐；'end' - '右侧对齐'; 'middle' - 居中对齐
   * 右侧的inline元素，'start' - 右侧对齐；'end' - '左侧对齐'; 'middle' - 居中对齐
   */
  alignSelf?: 'start' | 'end' | 'middle';

  // 基础的布局配置
  /** 模块布局位置 */
  orient?: IOrientType;
  /** 模块的布局间距 */
  padding?: ILayoutPaddingSpec;
  /** 是否按照 orient 自动修改 padding，隐藏位于外侧的 padding。目前只在组件上生效 */
  noOuterPadding?: boolean;
  /** 模块的布局大小：宽度 */
  width?: ILayoutNumber;
  /** 模块的布局最大宽度 */
  maxWidth?: ILayoutNumber;
  /** 模块的布局最小宽度 */
  minWidth?: ILayoutNumber;
  /** 模块的布局大小：高度 */
  height?: ILayoutNumber;
  /** 模块的布局最大高度 */
  maxHeight?: ILayoutNumber;
  /** 模块的布局最小高度 */
  minHeight?: ILayoutNumber;
  /** 模块的布局位置偏移：X */
  offsetX?: ILayoutNumber;
  /** 模块的布局位置偏移：Y */
  offsetY?: ILayoutNumber;

  /** 模块的展示层级，当2个模块重叠时，层级较大的展示在上方 */
  zIndex?: number;
  /** 模块是否裁剪超出布局区域外的绘图内容 */
  clip?: boolean;

  // 绝对布局下的对齐设置

  /** 模块绝对布局下，与图表左侧的距离。注意仅在 layoutType === 'absolute' 时生效  */
  left?: ILayoutNumber;
  /** 模块绝对布局下，与图表右侧的距离。注意仅在 layoutType === 'absolute' 时生效  */
  right?: ILayoutNumber;
  /** 模块绝对布局下，与图表顶部的距离。注意仅在 layoutType === 'absolute' 时生效  */
  top?: ILayoutNumber;
  /** 模块绝对布局下，与图表底部的距离。注意仅在 layoutType === 'absolute' 时生效  */
  bottom?: ILayoutNumber;
  /** 模块绝对布局下，元素将放置在图表的正中间。注意仅在 layoutType === 'absolute' 时生效，同时将忽略 padding 属性  */
  center?: boolean;
}
```

相关定义：[ILayoutType](AdditionalTypes-Type-Definition.md#type-7ececfbaa390)、[IOrientType](AdditionalTypes-Type-Definition.md#type-1c1f18d62ff6)、[ILayoutPaddingSpec](ILayoutPaddingSpec-Type-Definition.md)、[ILayoutNumber](AdditionalTypes-Type-Definition.md#type-9638d3997297)

<a id="type-a40f94687b59"></a>
## ILayoutSpecBase

来源：`packages/vchart/src/layout/interface.ts`，VChart 2.1.7

```typescript
export interface ILayoutSpecBase {
  /**
   * 布局的类型，现在支持 grid布局和默认布局（基于占位的布局）
   */
  type: string;
}
```

<a id="type-0bf7cec9094c"></a>
## LayoutCallBack

来源：`packages/vchart/src/layout/interface.ts`，VChart 2.1.7

```typescript
export type LayoutCallBack = (
  chart: any,
  item: ILayoutItem[],
  chartLayoutRect: IRect,
  chartViewBox: IBoundsLike
) => void;
```

相关定义：[ILayoutItem](AdditionalTypes-Type-Definition.md#type-a23ec9ff5239)、[IRect](AdditionalTypes-Type-Definition.md#type-51a55b549762)、[IBoundsLike](AdditionalTypes-Type-Definition.md#type-e61ecce4e47c)

<a id="type-0460768bb02c"></a>
## AnimationStateValues

来源：`packages/vchart/src/mark/interface/common.ts`，VChart 2.1.7

```typescript
export type AnimationStateValues = 'appear' | 'enter' | 'update' | 'exit' | 'disappear' | 'none' | 'state';
```

<a id="type-1352ed6c1d81"></a>
## DiffStateValues

来源：`packages/vchart/src/mark/interface/common.ts`，VChart 2.1.7

```typescript
export type DiffStateValues = 'update' | 'enter' | 'exit';
```

<a id="type-597b323ab9ea"></a>
## IAttrConfig

来源：`packages/vchart/src/mark/interface/common.ts`，VChart 2.1.7

```typescript
export interface IAttrConfig<A, R extends ICommonSpec> {
  level: number;
  style: StyleConvert<A>;
  referer?: IMarkRaw<R>;
  postProcess?: (result: A, ...args: Parameters<FunctionType<A>>) => A;
}
```

相关定义：[StyleConvert](AdditionalTypes-Type-Definition.md#type-f616fecb91f8)、[IMarkRaw](AdditionalTypes-Type-Definition.md#type-8245181df7c4)、[FunctionType](FunctionType-Type-Definition.md)、[ICommonSpec](AdditionalTypes-Type-Definition.md#type-642c420237a7)

<a id="type-26f957d91e5c"></a>
## IAttrs

来源：`packages/vchart/src/mark/interface/common.ts`，VChart 2.1.7

```typescript
export type IAttrs<T extends ICommonSpec> = {
  [K in keyof T]: IAttrConfig<T[K], T>;
};
```

相关定义：[IAttrConfig](AdditionalTypes-Type-Definition.md#type-597b323ab9ea)、[ICommonSpec](AdditionalTypes-Type-Definition.md#type-642c420237a7)

<a id="type-e33013d66ce5"></a>
## IDataSamping

来源：`packages/vchart/src/mark/interface/common.ts`，VChart 2.1.7

```typescript
export interface IDataSamping {
  /**
   * 是否使用额外的 activePoint 显示交互点，可以在点隐藏时显示被交互的点
   * @default false
   * @since 1.3.0
   */
  activePoint?: boolean;
  /**
   * 数据采样 - 采样方法
   * @since 1.6.0
   */
  sampling?: ISamplingMethod;
  /**
   * 数据采样 - 采样系数
   * @since 1.6.0
   * @default 1
   */
  samplingFactor?: number;
}
```

相关定义：[ISamplingMethod](AdditionalTypes-Type-Definition.md#type-0ce27198f72d)

<a id="type-ff3da46fbc1c"></a>
## IGraphicContext

来源：`packages/vchart/src/mark/interface/common.ts`，VChart 2.1.7

```typescript
export interface IGraphicContext {
  /**
   * 编译器
   */
  compiler: ICompiler;
  /**
   * mark的类型
   */
  markType: MarkTypeEnum;
  /**
   * 图形所属mark对应的id，自增id
   */
  markId: number;
  /**
   * 图形所属model对应的id，自增id
   */
  modelId: number;
  /**
   * 图形所属mark对应的用户设置id
   */
  markUserId?: number | string;
  /**
   * 图形所属model对应的用户设置id
   */
  modelUserId?: number | string;
  /**
   * 数据对比状态
   */
  diffState?: DiffStateValues;
  /**
   * 是否正在被复用的图元
   */
  reusing?: boolean;
  /**
   * 复用图元时，保存的上一次的旧属性（用于平滑的过渡动画）
   */
  lastAttrs?: Record<string, any>;
  /**
   * 用于判定这个图元是第几个，在OneByOne动画中控制顺序
   */
  indexKey?: string;
  /**
   * 差异的属性
   */
  diffAttrs?: Record<string, any>;
  /**
   * VChart encode/transform 后、应用到 VRender graphic 前的下一轮属性快照。
   * 用于 VChart 的 afterEncode transform、diffAttrs 与动画参数，不等同于 VRender finalAttribute。
   */
  finalAttrs?: Record<string, any>;
  /**
   * 用于保存mark对应series的fieldX
   */
  fieldX?: string[];
  /**
   * 用于保存mark对应series的fieldX
   */
  originalFieldX?: string[];
  /**
   * 用于保存mark对应series的fieldY
   */
  fieldY?: string[];
  /**
   * 用于保存mark对应series的fieldY
   */
  originalFieldY?: string[];
  /**
   * 动画状态管理: 'appear' / 'enter' / 'update' / 'exit' / 'disappear'
   */
  animationState?: AnimationStateValues;
  /**
   * 数据
   */
  data?: Datum[];
  /**
   * 用于区分图形的唯一key，
   * 对于line/mark而言，和`groupKey` 是一致的
   * 对于其他图元，由 `groupKey` 和 `key` 拼装得到
   */
  uniqueKey?: string;
  /**
   * 唯一key
   */
  key?: string;
  /**
   * 分组key
   */
  groupKey?: string;
  /**
   * 状态
   */
  states?: string[];
  /**
   * 图元总数量
   */
  graphicCount?: number;
  /**
   * 图元索引顺序
   */
  graphicIndex?: number;
  /**
   * 状态动画配置
   */
  stateAnimateConfig?: IAnimationConfig | IAnimationConfig[];
}
```

相关定义：[ICompiler](AdditionalTypes-Type-Definition.md#type-cbf1a5d7de9b)、[MarkTypeEnum](AdditionalTypes-Type-Definition.md#type-f61b3242139b)、[DiffStateValues](AdditionalTypes-Type-Definition.md#type-1352ed6c1d81)、[AnimationStateValues](AdditionalTypes-Type-Definition.md#type-0460768bb02c)、[Datum](AdditionalTypes-Type-Definition.md#type-bf5eb9a79e61)、[IAnimationConfig](IAnimationConfig-Type-Definition.md)

<a id="type-50aedeb586cf"></a>
## IMark

来源：`packages/vchart/src/mark/interface/common.ts`，VChart 2.1.7

```typescript
export type IMark = IMarkRaw<ICommonSpec>;
```

相关定义：[IMarkRaw](AdditionalTypes-Type-Definition.md#type-8245181df7c4)、[ICommonSpec](AdditionalTypes-Type-Definition.md#type-642c420237a7)

<a id="type-6b98396ffcb3"></a>
## IMarkGraphic

来源：`packages/vchart/src/mark/interface/common.ts`，VChart 2.1.7

```typescript
export interface IMarkGraphic extends IGraphic {
  /**
   * 缓存运行时的状态编码数据
   */
  runtimeStateCache?: Record<string, any>;

  /**
   * 上下文数据
   */
  context?: IGraphicContext;

  /**
   * 是否正在退场
   */
  isExiting?: boolean;
}
```

相关定义：[IGraphic](AdditionalTypes-Type-Definition.md#type-a766bc91cce3)、[IGraphicContext](AdditionalTypes-Type-Definition.md#type-ff3da46fbc1c)

<a id="type-bed88451c0c6"></a>
## IMarkOverlap

来源：`packages/vchart/src/mark/interface/common.ts`，VChart 2.1.7

```typescript
export interface IMarkOverlap {
  /**
   * 标记点之间的距离，px
   * @since 1.6.0
   */
  pointDis?: number;
  /**
   * 标记点之间的距离， pointSize 的倍数
   * @since 1.6.0
   * @default 1
   */
  pointDisMul?: number;
  /**
   * 是否允许标记图形相互覆盖
   * @since 1.6.0
   * @default false
   */
  markOverlap?: boolean;
}
```

<a id="type-059a3e6127d2"></a>
## IMarkProgressiveConfig

来源：`packages/vchart/src/mark/interface/common.ts`，VChart 2.1.7

```typescript
export type IMarkProgressiveConfig = {
  /** 是否开启大数据渲染模式，开启后会降低渲染的精度 */
  large?: boolean;
  /** 开启大数据渲染优化的阀值，对应的是data的长度;推荐 largeThreshold < progressiveThreshold  */
  largeThreshold?: number;
  /** 分片长度 */
  progressiveStep?: number;
  /** 开启分片渲染的阀值，对应的是单系列data的长度 */
  progressiveThreshold?: number;
};
```

<a id="type-8245181df7c4"></a>
## IMarkRaw

来源：`packages/vchart/src/mark/interface/common.ts`，VChart 2.1.7

```typescript
export interface IMarkRaw<T extends ICommonSpec> extends ICompilableMark {
  readonly stateStyle: IMarkStateStyle<T>;

  getAttributesOfState: (datum: Datum, state?: StateValueType) => Partial<T>;
  getAttribute: <U extends keyof T>(key: U, datum: any, state?: StateValueType) => unknown;
  setAttribute: <U extends keyof T>(attr: U, style: StyleConvert<T[U]>, state?: StateValueType, level?: number) => void;

  // 需要支持优先级并且可以使用优先级覆盖
  /** @deprecated VChart 层尽量使用 IModel.setMarkStyle() */
  setStyle: (style: Partial<IMarkStyle<T>>, state?: StateValueType, level?: number) => void;
  setSimpleStyle: (s: T) => void;
  getSimpleStyle: () => T;

  setReferer: (mark: IMarkRaw<T>, styleKey?: string, state?: StateValueType) => void;

  /** @deprecated VChart 层尽量使用 IModel.initMarkStyleWithSpec() */
  initStyleWithSpec: (spec: any) => void;

  created: () => void;

  setPostProcess: <U extends keyof T, A>(
    key: U,
    postProcessFunc: IAttrConfig<A, T>['postProcess'],
    state?: StateValueType
  ) => void;

  /** 更新某一个状态 */
  updateMarkState: (key: string) => void;

  render: () => void;
  renderInner: () => void;

  getGraphics: () => IMarkGraphic[];

  reuse: (mark: IMark) => void;
  prepareMorph: (mark: IMark) => void;

  clearExitGraphics: () => void;

  /** 是否启动了增量渲染模式 */
  isProgressive: () => boolean;
  /** 是否正在执行增量渲染 */
  isDoingProgressive: () => boolean;
  /** 清除增量渲染相关状态 */
  clearProgressive: () => void;
  /** 从第一帧开始增量计算 */
  restartProgressive: () => void;
  /** 分片执行 */
  renderProgressive: () => void;
  /** 增量流程后，是否执行动画 */
  canAnimateAfterProgressive: () => boolean;
  /** 执行动画 */
  runAnimation: () => void;
  /** 获取动画状态 */
  getAnimationState: () => AnimationStateValues;
  /** 是否需要清除旧的数据 */
  needClear?: boolean;
  /** 禁用状态动画 */
  disableAnimationByState: (state: string | string[]) => void;
  /** 启用状态动画 */
  enableAnimationByState: (state: string | string[]) => void;
  /** 重新加载前清除缓存 */
  clearBeforeReInit: () => void;
}
```

相关定义：[ICompilableMark](AdditionalTypes-Type-Definition.md#type-fb1ce8327f06)、[IMarkStateStyle](AdditionalTypes-Type-Definition.md#type-103f402e7251)、[Datum](AdditionalTypes-Type-Definition.md#type-bf5eb9a79e61)、[StateValueType](AdditionalTypes-Type-Definition.md#type-17574edeab90)、[StyleConvert](AdditionalTypes-Type-Definition.md#type-f616fecb91f8)、[IMarkStyle](AdditionalTypes-Type-Definition.md#type-574e4d23d491)、[IAttrConfig](AdditionalTypes-Type-Definition.md#type-597b323ab9ea)、[IMarkGraphic](AdditionalTypes-Type-Definition.md#type-6b98396ffcb3)、[IMark](AdditionalTypes-Type-Definition.md#type-50aedeb586cf)、[AnimationStateValues](AdditionalTypes-Type-Definition.md#type-0460768bb02c)、[ICommonSpec](AdditionalTypes-Type-Definition.md#type-642c420237a7)

<a id="type-103f402e7251"></a>
## IMarkStateStyle

来源：`packages/vchart/src/mark/interface/common.ts`，VChart 2.1.7

```typescript
export type IMarkStateStyle<T extends ICommonSpec> = Record<StateValueType, Partial<IAttrs<T>>>;
```

相关定义：[StateValueType](AdditionalTypes-Type-Definition.md#type-17574edeab90)、[IAttrs](AdditionalTypes-Type-Definition.md#type-26f957d91e5c)、[ICommonSpec](AdditionalTypes-Type-Definition.md#type-642c420237a7)

<a id="type-574e4d23d491"></a>
## IMarkStyle

来源：`packages/vchart/src/mark/interface/common.ts`，VChart 2.1.7

```typescript
export type IMarkStyle<T extends ICommonSpec> = {
  [key in keyof T]: MarkInputStyle<T[key]>;
};
```

相关定义：[MarkInputStyle](AdditionalTypes-Type-Definition.md#type-b04af6888dbd)、[ICommonSpec](AdditionalTypes-Type-Definition.md#type-642c420237a7)

<a id="type-0ce27198f72d"></a>
## ISamplingMethod

来源：`packages/vchart/src/mark/interface/common.ts`，VChart 2.1.7

```typescript
export type ISamplingMethod = 'lttb' | 'min' | 'max' | 'sum' | 'average';
```

<a id="type-b04af6888dbd"></a>
## MarkInputStyle

来源：`packages/vchart/src/mark/interface/common.ts`，VChart 2.1.7

```typescript
export type MarkInputStyle<T> = StyleConvert<T> | VisualType<T>;
```

相关定义：[StyleConvert](AdditionalTypes-Type-Definition.md#type-f616fecb91f8)、[VisualType](AdditionalTypes-Type-Definition.md#type-e295ec9bce6b)

<a id="type-f616fecb91f8"></a>
## StyleConvert

来源：`packages/vchart/src/mark/interface/common.ts`，VChart 2.1.7

```typescript
export type StyleConvert<T> = ValueType<T> | FunctionType<T> | VisualScaleType;
```

相关定义：[ValueType](AdditionalTypes-Type-Definition.md#type-979efd9d6b47)、[FunctionType](FunctionType-Type-Definition.md)、[VisualScaleType](AdditionalTypes-Type-Definition.md#type-a7e81495b9fc)

<a id="type-a7e81495b9fc"></a>
## VisualScaleType

来源：`packages/vchart/src/mark/interface/common.ts`，VChart 2.1.7

```typescript
export interface VisualScaleType {
  scale: IBaseScale;
  field: StringOrNumber;
  changeDomain?: 'none' | 'replace' | 'expand'; //default 'none'
}
```

相关定义：[IBaseScale](AdditionalTypes-Type-Definition.md#type-f4ea6ab4e67d)、[StringOrNumber](AdditionalTypes-Type-Definition.md#type-2f92a26f4727)

<a id="type-642b39fa286c"></a>
## IComponentMark

来源：`packages/vchart/src/mark/interface/mark.ts`，VChart 2.1.7

```typescript
export interface IComponentMark extends IMarkRaw<ICommonSpec> {
  getComponent: () => IGraphic;
  clearComponent: () => void;
  releaseWithExitAnimation: () => boolean;
  forceReleaseExitAnimation: () => void;
  setAttributeTransform: (t: (attrs: any) => any) => any;
}
```

相关定义：[IMarkRaw](AdditionalTypes-Type-Definition.md#type-8245181df7c4)、[ICommonSpec](AdditionalTypes-Type-Definition.md#type-642c420237a7)、[IGraphic](AdditionalTypes-Type-Definition.md#type-a766bc91cce3)

<a id="type-8815337da68f"></a>
## IGroupMark

来源：`packages/vchart/src/mark/interface/mark.ts`，VChart 2.1.7

```typescript
export interface IGroupMark extends IMarkRaw<IGroupMarkSpec> {
  // groupMark的zIndex只能配在外层，encode里不生效，且无法写成signal
  // {type:'group', zIndex: 100} ✅
  // {type:'group', encode:{enter:{zIndex:{value:100}}}} ❌
  // {type:'group', zIndex: {signal: }} ❌

  addMark: (m: IMark) => boolean;
  removeMark: (m: IMark) => boolean;
  // TODO: 这里可能会出现mark嵌套的问题
  getMarks: () => IMark[];
  getMarkInType: (type: MarkType) => IMark[];
  getMarkInId: (id: number) => IMark | undefined;
  getMarkInName: (name: string) => IMark[] | undefined;
}
```

相关定义：[IMarkRaw](AdditionalTypes-Type-Definition.md#type-8245181df7c4)、[IGroupMarkSpec](IGroupMarkSpec-Type-Definition.md)、[IMark](AdditionalTypes-Type-Definition.md#type-50aedeb586cf)、[MarkType](AdditionalTypes-Type-Definition.md#type-15c62fdeb46b)

<a id="type-e9520a36483b"></a>
## ILabelMark

来源：`packages/vchart/src/mark/interface/mark.ts`，VChart 2.1.7

```typescript
export interface ILabelMark extends ITextMark {
  skipEncode: boolean;

  getRule: () => string;
  setRule: (rule: string) => void;

  getTarget: () => IMark;
  setTarget: (target: IMark) => void;

  getComponent: () => IComponentMark;
  setComponent: (component: IComponentMark) => void;
}
```

相关定义：[ITextMark](AdditionalTypes-Type-Definition.md#type-fef57d2925f9)、[IMark](AdditionalTypes-Type-Definition.md#type-50aedeb586cf)、[IComponentMark](AdditionalTypes-Type-Definition.md#type-642b39fa286c)

<a id="type-dd0f2569fc22"></a>
## ISymbolMark

来源：`packages/vchart/src/mark/interface/mark.ts`，VChart 2.1.7

```typescript
export type ISymbolMark = IMarkRaw<ISymbolMarkSpec>;
```

相关定义：[IMarkRaw](AdditionalTypes-Type-Definition.md#type-8245181df7c4)、[ISymbolMarkSpec](ISymbolMarkSpec-Type-Definition.md)

<a id="type-fef57d2925f9"></a>
## ITextMark

来源：`packages/vchart/src/mark/interface/mark.ts`，VChart 2.1.7

```typescript
export type ITextMark = IMarkRaw<IComposedTextMarkSpec> & { getTextType: () => 'text' | 'rich' };
```

相关定义：[IMarkRaw](AdditionalTypes-Type-Definition.md#type-8245181df7c4)、[IComposedTextMarkSpec](AdditionalTypes-Type-Definition.md#type-3cdc9715d892)

<a id="type-15c62fdeb46b"></a>
## MarkType

来源：`packages/vchart/src/mark/interface/type.ts`，VChart 2.1.7

```typescript
export type MarkType = keyof typeof MarkTypeEnum | string;
```

相关定义：[MarkTypeEnum](AdditionalTypes-Type-Definition.md#type-f61b3242139b)

<a id="type-f61b3242139b"></a>
## MarkTypeEnum

来源：`packages/vchart/src/mark/interface/type.ts`，VChart 2.1.7

```typescript
export const enum MarkTypeEnum {
  group = 'group',

  symbol = 'symbol',
  rule = 'rule',
  line = 'line',
  text = 'text',
  rect = 'rect',
  image = 'image',
  path = 'path',
  area = 'area',
  arc = 'arc',
  polygon = 'polygon',
  boxPlot = 'boxPlot',
  linkPath = 'linkPath',
  cell = 'cell',
  ripple = 'ripple',
  liquid = 'liquid',

  component = 'component',
  dataLabel = 'dataLabel',
  label = 'label',

  pictogram = 'pictogram'
}
```

<a id="type-d0389b7c19ac"></a>
## IBaseModelSpecTransformer

来源：`packages/vchart/src/model/interface.ts`，VChart 2.1.7

```typescript
export interface IBaseModelSpecTransformer {
  getTheme: (spec: any, chartSpec: any) => any;
  transformSpec: (
    spec: any,
    chartSpec: any,
    chartSpecInfo?: IChartSpecInfo
  ) => IBaseModelSpecTransformerResult<any, any>;
}
```

相关定义：[IChartSpecInfo](AdditionalTypes-Type-Definition.md#type-618e9dfe06cf)、[IBaseModelSpecTransformerResult](AdditionalTypes-Type-Definition.md#type-9be6c667e373)

<a id="type-a06278aae67d"></a>
## IBaseModelSpecTransformerOption

来源：`packages/vchart/src/model/interface.ts`，VChart 2.1.7

```typescript
export type IBaseModelSpecTransformerOption = IChartSpecTransformerOption;
```

相关定义：[IChartSpecTransformerOption](AdditionalTypes-Type-Definition.md#type-42469e396d0c)

<a id="type-9be6c667e373"></a>
## IBaseModelSpecTransformerResult

来源：`packages/vchart/src/model/interface.ts`，VChart 2.1.7

```typescript
export interface IBaseModelSpecTransformerResult<T, K> {
  spec: T;
  theme: K;
}
```

<a id="type-2ef752cff22f"></a>
## IEffect

来源：`packages/vchart/src/model/interface.ts`，VChart 2.1.7

```typescript
export interface IEffect {
  [key: string]: (e?: any) => any;
}
```

<a id="type-b788a1bf7960"></a>
## ILayoutModel

来源：`packages/vchart/src/model/interface.ts`，VChart 2.1.7

```typescript
export interface ILayoutModel extends IModel {
  // 布局相关
  getLayoutStartPoint: () => IPoint;
  setLayoutStartPosition: (pos: Partial<IPoint>) => void;
  getLayoutRect: () => ILayoutRect;
  setLayoutRect: (rect: Partial<ILayoutRect>, levelMap?: Partial<ILayoutRect>) => void;

  getLastComputeOutBounds: () => IBoundsLike;

  getBoundsInRect: (rect: ILayoutRect, fullRect: ILayoutRect) => IBoundsLike;

  //布局周期
  afterSetLayoutStartPoint: (pos: ILayoutPoint) => void;
}
```

相关定义：[IModel](AdditionalTypes-Type-Definition.md#type-2854a5da67ea)、[IPoint](AdditionalTypes-Type-Definition.md#type-58fdfd9a6a7b)、[ILayoutRect](AdditionalTypes-Type-Definition.md#type-b4324e55ab6b)、[IBoundsLike](AdditionalTypes-Type-Definition.md#type-e61ecce4e47c)、[ILayoutPoint](AdditionalTypes-Type-Definition.md#type-6dd6ef1acef0)

<a id="type-2854a5da67ea"></a>
## IModel

来源：`packages/vchart/src/model/interface.ts`，VChart 2.1.7

```typescript
export interface IModel extends ICompilable {
  readonly modelType: string;
  readonly type: string;
  readonly specKey: string;
  readonly transformerConstructor: new (option: IBaseModelSpecTransformerOption) => IBaseModelSpecTransformer;

  readonly id: number;

  readonly userId?: StringOrNumber;

  // 事件
  readonly event: IEvent;

  // 副作用
  readonly effect: IEffect;

  coordinate?: CoordinateType;

  // 布局
  layout?: ILayoutItem;

  /** 是否可见 */
  getVisible: () => boolean;

  // 初始化参数
  getOption: () => IModelOption;

  getMarks: () => IMark[];
  getMarkNameMap: () => Record<string, IMark>;

  getData: () => ICompilableData;

  getChart: () => IChart;

  //生命周期
  // 创建模块自身内容，设置自身属性
  created: () => void;
  // 用来处理与其他图表模块的联系
  init: (option: IModelInitOption) => void;
  /** updateSpec 或者切换主题后，根据新 spec 执行的初始化过程 */
  reInit: (spec?: any) => void;
  beforeRelease: () => void;

  onEvaluateEnd: (ctx: IModelEvaluateOption) => void;
  onDataUpdate: () => void;
  onBeforeRender: () => void;

  updateSpec: (spec: any, totalSpec?: any) => IUpdateSpecResult;
  getSpec?: () => any;
  getSpecIndex: () => number;
  getSpecPath: () => Array<string | number>;

  //布局周期
  onLayoutStart: (layoutRect: IRect, viewRect: ILayoutRect) => void;
  onLayoutEnd: () => void;

  getColorScheme: () => IThemeColorScheme | undefined;

  setMarkStyle: <T extends ICommonSpec>(
    mark?: IMarkRaw<T>,
    style?: Partial<IMarkStyle<T> | ConvertToMarkStyleSpec<T>>,
    state?: StateValueType,
    level?: number
  ) => void;

  initMarkStyleWithSpec: (mark?: IMark, spec?: any) => void;

  getSpecInfo: () => IModelSpecInfo;

  updateAnimateStateCallback: (callback: (graphic: IMarkGraphic) => AnimationStateValues) => void;
  getAnimationStateCallback: () => (graphic: IMarkGraphic) => AnimationStateValues;
}
```

相关定义：[ICompilable](AdditionalTypes-Type-Definition.md#type-590d0c32ce42)、[IBaseModelSpecTransformerOption](AdditionalTypes-Type-Definition.md#type-a06278aae67d)、[IBaseModelSpecTransformer](AdditionalTypes-Type-Definition.md#type-d0389b7c19ac)、[StringOrNumber](AdditionalTypes-Type-Definition.md#type-2f92a26f4727)、[IEvent](AdditionalTypes-Type-Definition.md#type-17583cb7e08d)、[IEffect](AdditionalTypes-Type-Definition.md#type-2ef752cff22f)、[CoordinateType](AdditionalTypes-Type-Definition.md#type-f14ee29f7b8b)、[ILayoutItem](AdditionalTypes-Type-Definition.md#type-a23ec9ff5239)、[IModelOption](AdditionalTypes-Type-Definition.md#type-f2d5e89f0268)、[IMark](AdditionalTypes-Type-Definition.md#type-50aedeb586cf)、[ICompilableData](AdditionalTypes-Type-Definition.md#type-bac9ca204677)、[IChart](AdditionalTypes-Type-Definition.md#type-d27fa13b0c29)、[IModelInitOption](AdditionalTypes-Type-Definition.md#type-d5cf5deb27b7)、[IModelEvaluateOption](AdditionalTypes-Type-Definition.md#type-680368166ca8)、[IUpdateSpecResult](AdditionalTypes-Type-Definition.md#type-646a207a21dd)、[IRect](AdditionalTypes-Type-Definition.md#type-51a55b549762)、[ILayoutRect](AdditionalTypes-Type-Definition.md#type-b4324e55ab6b)、[IThemeColorScheme](AdditionalTypes-Type-Definition.md#type-45344180023e)、[ICommonSpec](AdditionalTypes-Type-Definition.md#type-642c420237a7)、[IMarkRaw](AdditionalTypes-Type-Definition.md#type-8245181df7c4)、[IMarkStyle](AdditionalTypes-Type-Definition.md#type-574e4d23d491)、[ConvertToMarkStyleSpec](AdditionalTypes-Type-Definition.md#type-3f4d44a2bad5)、[StateValueType](AdditionalTypes-Type-Definition.md#type-17574edeab90)、[IModelSpecInfo](AdditionalTypes-Type-Definition.md#type-854f78cb6f0a)、[IMarkGraphic](AdditionalTypes-Type-Definition.md#type-6b98396ffcb3)、[AnimationStateValues](AdditionalTypes-Type-Definition.md#type-0460768bb02c)

<a id="type-b2886ff503c6"></a>
## IModelConstructor

来源：`packages/vchart/src/model/interface.ts`，VChart 2.1.7

```typescript
export interface IModelConstructor {
  readonly builtInTheme?: any;
  readonly transformerConstructor: new (option: IBaseModelSpecTransformerOption) => IBaseModelSpecTransformer;
}
```

相关定义：[IBaseModelSpecTransformerOption](AdditionalTypes-Type-Definition.md#type-a06278aae67d)、[IBaseModelSpecTransformer](AdditionalTypes-Type-Definition.md#type-d0389b7c19ac)

<a id="type-680368166ca8"></a>
## IModelEvaluateOption

来源：`packages/vchart/src/model/interface.ts`，VChart 2.1.7

```typescript
export interface IModelEvaluateOption {}
```

<a id="type-d5cf5deb27b7"></a>
## IModelInitOption

来源：`packages/vchart/src/model/interface.ts`，VChart 2.1.7

```typescript
export interface IModelInitOption {}
```

<a id="type-c6d245a05c0a"></a>
## IModelMarkInfo

来源：`packages/vchart/src/model/interface.ts`，VChart 2.1.7

```typescript
export interface IModelMarkInfo {
  /** mark 类型 */
  type: MarkTypeEnum | string | (MarkTypeEnum | string)[];
  /** mark 名称 */
  name: string;
}
```

相关定义：[MarkTypeEnum](AdditionalTypes-Type-Definition.md#type-f61b3242139b)

<a id="type-f2d5e89f0268"></a>
## IModelOption

来源：`packages/vchart/src/model/interface.ts`，VChart 2.1.7

```typescript
export interface IModelOption extends ICompilableInitOption {
  type: string;
  eventDispatcher: IEventDispatcher;
  dataSet: DataSet;
  map: Map<StringOrNumber, IModel | IMark>;
  mode: RenderMode;
  globalInstance: IVChart;
  regionIndexes?: Array<number>;
  specKey?: string;
  specPath?: Array<string | number>;
  specInfoPath?: Array<string | number>;

  getTheme?: (...keys: string[]) => any;
  getSpecInfo?: () => IChartSpecInfo;
  getChartLayoutRect: () => IRect;
  getChartViewRect: () => ILayoutRect;

  getChart: () => IChart;
  getSeriesData: (id: StringOrNumber | undefined, index: number | undefined) => DataView | undefined;

  globalScale: IGlobalScale;
  animation?: boolean;
  /**
   * 错误消息回调函数
   */
  onError: (...args: any[]) => void;

  /**
   * 是否关闭交互效果
   */
  disableTriggerEvent?: boolean;

  /**
   * 组件内容展示配置
   * @since 2.0.11
   */
  componentShowContent?: {
    /**
     * tooltip 是否关闭内容展示
     * @default false
     */
    tooltip?: boolean | Partial<Record<TooltipActiveType, boolean>>;
    // crosshair 组件是否展示
    crosshair?: boolean;
  };

  getDimensionInfo?: (chart: IChart | undefined, pos: ILayoutPoint, isTooltip?: boolean) => IDimensionInfo[] | null;
  getDimensionInfoByValue?: (axis: IAxis, value: any) => IDimensionInfo | null;
  getRectByDimensionData?: (dimensionData: IDimensionData, layoutStartPoint: ILayoutPoint) => any;

  dispatchEvent?: (key: string, params?: any) => void;
}
```

相关定义：[ICompilableInitOption](AdditionalTypes-Type-Definition.md#type-f33e72c56cee)、[IEventDispatcher](AdditionalTypes-Type-Definition.md#type-e3c12fa8de7f)、[DataSet](AdditionalTypes-Type-Definition.md#type-8d2b64638b97)、[StringOrNumber](AdditionalTypes-Type-Definition.md#type-2f92a26f4727)、[IModel](AdditionalTypes-Type-Definition.md#type-2854a5da67ea)、[IMark](AdditionalTypes-Type-Definition.md#type-50aedeb586cf)、[RenderMode](AdditionalTypes-Type-Definition.md#type-875ef0d8fcf4)、[IVChart](AdditionalTypes-Type-Definition.md#type-f6dc633e5201)、[IChartSpecInfo](AdditionalTypes-Type-Definition.md#type-618e9dfe06cf)、[IRect](AdditionalTypes-Type-Definition.md#type-51a55b549762)、[ILayoutRect](AdditionalTypes-Type-Definition.md#type-b4324e55ab6b)、[IChart](AdditionalTypes-Type-Definition.md#type-d27fa13b0c29)、[DataView](AdditionalTypes-Type-Definition.md#type-b26ccd36d8e8)、[IGlobalScale](AdditionalTypes-Type-Definition.md#type-86e42efb33dd)、[TooltipActiveType](AdditionalTypes-Type-Definition.md#type-990c112f10af)、[ILayoutPoint](AdditionalTypes-Type-Definition.md#type-6dd6ef1acef0)、[IDimensionInfo](AdditionalTypes-Type-Definition.md#type-06b8a10af7b9)、[IAxis](AdditionalTypes-Type-Definition.md#type-9cbd2aefe72d)、[IDimensionData](AdditionalTypes-Type-Definition.md#type-5b72dbd75644)

<a id="type-93f598dd1ef8"></a>
## IModelSpec

来源：`packages/vchart/src/model/interface.ts`，VChart 2.1.7

```typescript
export type IModelSpec = ILayoutItemSpec & { id?: StringOrNumber };
```

相关定义：[ILayoutItemSpec](AdditionalTypes-Type-Definition.md#type-31e5f8b69a13)、[StringOrNumber](AdditionalTypes-Type-Definition.md#type-2f92a26f4727)

<a id="type-854f78cb6f0a"></a>
## IModelSpecInfo

来源：`packages/vchart/src/model/interface.ts`，VChart 2.1.7

```typescript
export interface IModelSpecInfo<T extends Record<string, unknown> = any> {
  /** model 具体类型 */
  type: string | ComponentTypeEnum | SeriesTypeEnum;
  /** model spec */
  spec: T;
  /** 该 spec 在图表 spec 上的路径 */
  specPath?: Array<string | number>;
  /** 该 spec 在图表 spec info 上的路径 */
  specInfoPath?: Array<string | number>;
  /** model 当前主题 */
  theme?: any;
  /** model 对应的 region 索引 */
  regionIndexes?: number[];
  /** model 对应的 series 索引 */
  seriesIndexes?: number[];
}
```

相关定义：[ComponentTypeEnum](AdditionalTypes-Type-Definition.md#type-da1c88fe2ca8)、[SeriesTypeEnum](AdditionalTypes-Type-Definition.md#type-11db701f3ba0)

<a id="type-47faea1d542e"></a>
## ITooltipHelper

来源：`packages/vchart/src/model/interface.ts`，VChart 2.1.7

```typescript
export interface ITooltipHelper {
  /** tooltip对应spec */
  spec: ITooltipSpec | undefined;

  /** 实际生效的tooltip activeType */
  activeType: TooltipActiveType[];

  /** 可以响应mark tooltip或者dimension tooltip的对象 */
  activeTriggerSet: {
    mark?: Set<IMark>;
    group?: Set<IMark>;
  };
  /** 不响应tooltip且不会影响已有tooltip的对象 */
  ignoreTriggerSet: {
    mark?: Set<IMark>;
  };

  /** 更新spec */
  updateTooltipSpec: () => void;
}
```

相关定义：[ITooltipSpec](ITooltipSpec-Type-Definition.md)、[TooltipActiveType](AdditionalTypes-Type-Definition.md#type-990c112f10af)、[IMark](AdditionalTypes-Type-Definition.md#type-50aedeb586cf)

<a id="type-ebdfb7b1febc"></a>
## IUpdateSpecEffects

来源：`packages/vchart/src/model/interface.ts`，VChart 2.1.7

```typescript
export interface IUpdateSpecEffects {
  remake?: boolean;
  compile?: boolean;
  render?: boolean;
  layout?: boolean;
  data?: boolean;
  scaleDomain?: boolean;
  series?: boolean;
  component?: boolean;
  animation?: boolean;
  localOnly?: boolean;
}
```

<a id="type-646a207a21dd"></a>
## IUpdateSpecResult

来源：`packages/vchart/src/model/interface.ts`，VChart 2.1.7

```typescript
export interface IUpdateSpecResult {
  change: boolean;
  reMake: boolean;
  reRender?: boolean;
  reSize?: boolean;
  // TODO: compile 的判断应不应该出现在这里?
  reCompile?: boolean;
  reTransformSpec?: boolean;
  effects?: IUpdateSpecEffects;
  reAnimate?: boolean;
  changeTheme?: boolean;
  changeBackground?: boolean;
}
```

相关定义：[IUpdateSpecEffects](AdditionalTypes-Type-Definition.md#type-ebdfb7b1febc)

<a id="type-a83d28f54f24"></a>
## IRegion

来源：`packages/vchart/src/region/interface.ts`，VChart 2.1.7

```typescript
export interface IRegion extends ILayoutModel {
  //stack
  getStackInverse: () => boolean;
  getStackSort: () => boolean;

  getMaxWidth: () => number | undefined;
  setMaxWidth: (value: number) => void;
  getMaxHeight: () => number | undefined;
  setMaxHeight: (value: number) => void;

  // 系列
  addSeries: (series: ISeries) => void;
  removeSeries: (series: ISeries) => void;

  getSeries: (opt?: ISeriesFilter) => ISeries[];
  getSeriesInName: (name: string) => ISeries;
  getSeriesInUserId: (userId: string) => ISeries;
  getSeriesInId: (id: number) => ISeries;
  getSeriesInType: (type: SeriesType) => ISeries[];
  getSeriesInCoordinateType: (type: CoordinateType) => ISeries[];
  getSeriesInDataName: (dataName: string) => ISeries[];

  getMarks: () => IMark[];
  getGroupMark: () => IGroupMark;
  getInteractionMark: () => IGroupMark;

  getSpecInfo: () => IRegionSpecInfo;
}
```

相关定义：[ILayoutModel](AdditionalTypes-Type-Definition.md#type-b788a1bf7960)、[ISeries](AdditionalTypes-Type-Definition.md#type-29ca9e871dc0)、[ISeriesFilter](AdditionalTypes-Type-Definition.md#type-547a568e3f15)、[SeriesType](AdditionalTypes-Type-Definition.md#type-43422e48d197)、[CoordinateType](AdditionalTypes-Type-Definition.md#type-f14ee29f7b8b)、[IMark](AdditionalTypes-Type-Definition.md#type-50aedeb586cf)、[IGroupMark](AdditionalTypes-Type-Definition.md#type-8815337da68f)、[IRegionSpecInfo](AdditionalTypes-Type-Definition.md#type-dacf9d61a878)

<a id="type-4ab33fce2070"></a>
## IRegionConstructor

来源：`packages/vchart/src/region/interface.ts`，VChart 2.1.7

```typescript
export interface IRegionConstructor extends IModelConstructor {
  new (spec: IRegionSpec, ctx: IModelOption): IRegion;
}
```

相关定义：[IModelConstructor](AdditionalTypes-Type-Definition.md#type-b2886ff503c6)、[IRegionSpec](AdditionalTypes-Type-Definition.md#type-de53416bbb15)、[IModelOption](AdditionalTypes-Type-Definition.md#type-f2d5e89f0268)、[IRegion](AdditionalTypes-Type-Definition.md#type-a83d28f54f24)

<a id="type-de53416bbb15"></a>
## IRegionSpec

来源：`packages/vchart/src/region/interface.ts`，VChart 2.1.7

```typescript
export interface IRegionSpec extends ILayoutItemSpec {
  id?: StringOrNumber;
  coordinate?: CoordinateType;
  style?: ConvertToMarkStyleSpec<IRectMarkSpec>;
  /**
   * 堆积时是否逆序
   * @default false
   * @since 1.4.0
   */
  stackInverse?: boolean;
  /**
   * 堆积时是否排序
   * @default false
   * @since 1.10.4
   */
  stackSort?: boolean;
}
```

相关定义：[ILayoutItemSpec](AdditionalTypes-Type-Definition.md#type-31e5f8b69a13)、[StringOrNumber](AdditionalTypes-Type-Definition.md#type-2f92a26f4727)、[CoordinateType](AdditionalTypes-Type-Definition.md#type-f14ee29f7b8b)、[ConvertToMarkStyleSpec](AdditionalTypes-Type-Definition.md#type-3f4d44a2bad5)、[IRectMarkSpec](IRectMarkSpec-Type-Definition.md)

<a id="type-dacf9d61a878"></a>
## IRegionSpecInfo

来源：`packages/vchart/src/region/interface.ts`，VChart 2.1.7

```typescript
export interface IRegionSpecInfo<T extends RegionSpec = IRegionSpec> extends IModelSpecInfo {
  /** model 具体类型 */
  type: 'region';
  /** model spec */
  spec: T;
}
```

相关定义：[IModelSpecInfo](AdditionalTypes-Type-Definition.md#type-854f78cb6f0a)、[RegionSpec](RegionSpec-Type-Definition.md)、[IRegionSpec](AdditionalTypes-Type-Definition.md#type-de53416bbb15)

<a id="type-547a568e3f15"></a>
## ISeriesFilter

来源：`packages/vchart/src/region/interface.ts`，VChart 2.1.7

```typescript
export type ISeriesFilter = {
  name?: string;
  userId?: StringOrNumber | StringOrNumber[];
  specIndex?: number | number[];
  id?: number;
  type?: string;
  coordinateType?: CoordinateType;
  dataName?: string;
};
```

相关定义：[StringOrNumber](AdditionalTypes-Type-Definition.md#type-2f92a26f4727)、[CoordinateType](AdditionalTypes-Type-Definition.md#type-f14ee29f7b8b)

<a id="type-86e42efb33dd"></a>
## IGlobalScale

来源：`packages/vchart/src/scale/interface.ts`，VChart 2.1.7

```typescript
export interface IGlobalScale {
  color?: any;
  getScale: (user_id: string) => IBaseScale | null;
  getScaleSpec: (user_id: string) => IVisualSpecScale<unknown, unknown> | null;
  getStatisticalFields: (dataId: string) => {
    key: string;
    operations: StatisticOperations;
  }[];
  updateScaleDomain: (string: unknown[]) => void;

  registerMarkAttributeScale: (spec: IVisualScale, seriesId: number) => IBaseScale;

  /**
   * model add & remove global scale
   * 提供给图表模块按照需要添加全局 scale。目前的使用场景有 scatter series 的 sizeField 和 shapeField 配置。
   */
  registerModelScale: (spec: IVisualSpecScale<unknown, unknown>) => void;
  removeModelScale: (filter: (spec: IVisualSpecScale<unknown, unknown>) => boolean) => void;

  updateSpec: (spec: IChartSpec['scales']) => IUpdateSpecResult;
}
```

相关定义：[IBaseScale](AdditionalTypes-Type-Definition.md#type-f4ea6ab4e67d)、[IVisualSpecScale](IVisualSpecScale-Type-Definition.md)、[StatisticOperations](AdditionalTypes-Type-Definition.md#type-d92fd69b2371)、[IVisualScale](AdditionalTypes-Type-Definition.md#type-d2a6fed8edde)、[IChartSpec](AdditionalTypes-Type-Definition.md#type-57e06d38bf09)、[IUpdateSpecResult](AdditionalTypes-Type-Definition.md#type-646a207a21dd)

<a id="type-1632d0cf5560"></a>
## AreaAppearPreset

来源：`packages/vchart/src/series/area/interface.ts`，VChart 2.1.7

```typescript
export type AreaAppearPreset = 'clipIn' | 'fadeIn' | 'grow';
```

<a id="type-6b16760e15b0"></a>
## AreaMarks

来源：`packages/vchart/src/series/area/interface.ts`，VChart 2.1.7

```typescript
type AreaMarks = 'point' | 'line' | 'area';
```

<a id="type-3c1aa405c767"></a>
## IAreaSeriesSpec

来源：`packages/vchart/src/series/area/interface.ts`，VChart 2.1.7

```typescript
export interface IAreaSeriesSpec
  extends ICartesianSeriesSpec,
    IAnimationSpec<AreaMarks, AreaAppearPreset>,
    IMarkProgressiveConfig,
    IDataSamping,
    IMarkOverlap {
  /**
   * 系列类型
   */
  type: 'area';
  /**
   * x轴字段
   */
  xField?: string | string[];
  /**
   * y轴字段
   */
  yField?: string | string[];
  /**
   * 点图元配置
   */
  [SeriesMarkNameEnum.point]?: IMarkSpec<ISymbolMarkSpec>;
  /**
   * 线图元配置
   */
  [SeriesMarkNameEnum.line]?: IMarkSpec<ILineMarkSpec>;
  /**
   * 面积图元配置
   */
  [SeriesMarkNameEnum.area]?: IMarkSpec<IAreaMarkSpec>;
  /**
   * 标签配置
   * @since 1.13.1 新增支持 inside-middle 标签位置
   */
  [SeriesMarkNameEnum.label]?: IMultiLabelSpec<
    Omit<ILineLikeLabelSpec, 'position'> & {
      /**
       * 标签位置，面积图元支持的标签位置
       * */
      position:
        | 'top'
        | 'bottom'
        | 'left'
        | 'right'
        | 'top-right'
        | 'top-left'
        | 'bottom-right'
        | 'bottom-left'
        | 'center'
        | 'inside-middle';
    }
  >;
  /**
   * 面积图元标签配置
   * @since 1.7.0
   */
  [SeriesMarkNameEnum.areaLabel]?: Omit<ILabelSpec, 'position'> & {
    /**
     * 面积图元标签的位置配置，支持两种位置：
     * - start：面积图元的起点
     * - end：面积图元的终点
     */
    position?: 'start' | 'end';
  };
  /**
   * 系列主 mark 类型配置，该配置会影响图例的展示
   * @default 'area'
   * @since 1.2.0
   */
  seriesMark?: 'point' | 'line' | 'area';
  /**
   * 是否使用额外的 activePoint 显示交互点，可以在点隐藏时显示被交互的点
   * @default false
   * @since 1.3.0
   */
  activePoint?: boolean;
}
```

相关定义：[ICartesianSeriesSpec](AdditionalTypes-Type-Definition.md#type-3814e1f2a8e7)、[IAnimationSpec](AdditionalTypes-Type-Definition.md#type-c2c92c7fb8c3)、[AreaMarks](AdditionalTypes-Type-Definition.md#type-6b16760e15b0)、[AreaAppearPreset](AdditionalTypes-Type-Definition.md#type-1632d0cf5560)、[IMarkProgressiveConfig](AdditionalTypes-Type-Definition.md#type-059a3e6127d2)、[IDataSamping](AdditionalTypes-Type-Definition.md#type-e33013d66ce5)、[IMarkOverlap](AdditionalTypes-Type-Definition.md#type-bed88451c0c6)、[IMarkSpec](IMarkSpec-Type-Definition.md)、[ISymbolMarkSpec](ISymbolMarkSpec-Type-Definition.md)、[ILineMarkSpec](ILineMarkSpec-Type-Definition.md)、[IAreaMarkSpec](IAreaMarkSpec-Type-Definition.md)、[IMultiLabelSpec](IMultiLabelSpec-Type-Definition.md)、[ILineLikeLabelSpec](ILineLikeLabelSpec-Type-Definition.md)、[ILabelSpec](ILabelSpec-Type-Definition.md)

<a id="type-2a04d7b5d5bc"></a>
## BarAppearPreset

来源：`packages/vchart/src/series/bar/interface.ts`，VChart 2.1.7

```typescript
export type BarAppearPreset = 'grow' | 'fadeIn' | 'scaleIn';
```

<a id="type-d2964854c2a3"></a>
## BarMarks

来源：`packages/vchart/src/series/bar/interface.ts`，VChart 2.1.7

```typescript
type BarMarks = 'bar';
```

<a id="type-659e249e0870"></a>
## IBarBackgroundSpec

来源：`packages/vchart/src/series/bar/interface.ts`，VChart 2.1.7

```typescript
export interface IBarBackgroundSpec {
  /**
   * 决定柱状背景图元是否显示在组的层级上，以及显示在哪个层级上。
   * 例如：在分组柱状图中，xField 为 `['A', 'B', 'C']`，如果配置为 0，则以 'A' 划分的每个组对应一个整体的 barBackground；如果配置为 1，则以 'B' 划分的每个组对应一个整体的 barBackground；如果配置为 2，则每个柱条对应一个 barBackground。
   * @since 1.9.0
   */
  fieldLevel?: number;
}
```

<a id="type-e01baddbd8aa"></a>
## IBarSeriesSpec

来源：`packages/vchart/src/series/bar/interface.ts`，VChart 2.1.7

```typescript
export interface IBarSeriesSpec
  extends ICartesianSeriesSpec,
    IAnimationSpec<BarMarks, BarAppearPreset>,
    IMarkProgressiveConfig,
    IDataSamping {
  /**
   *  系列类型
   */
  type: 'bar';
  /**
   * x轴字段
   */
  xField?: string | string[];
  /**
   * y轴字段
   */
  yField?: string | string[];
  /**
   * 图元配置
   */
  [SeriesMarkNameEnum.bar]?: IMarkSpec<IRectMarkSpec>;
  /**
   * 柱状背景图元
   * @since 1.6.0
   */
  [SeriesMarkNameEnum.barBackground]?: IMarkSpec<IRectMarkSpec> & IBarBackgroundSpec;
  /** 标签配置*/
  [SeriesMarkNameEnum.label]?: IMultiLabelSpec<
    Omit<ILabelSpec, 'position'> & {
      /**
       * 标签位置
       * @since 1.6.0
       * 支持'top-right' | 'top-left'| 'bottom-right' | 'bottom-left'，以及函数形式配置
       * */
      position?: Functional<
        | 'outside'
        | 'top'
        | 'bottom'
        | 'left'
        | 'right'
        | 'inside'
        | 'inside-top'
        | 'inside-bottom'
        | 'inside-right'
        | 'inside-left'
        | 'top-right'
        | 'top-left'
        | 'bottom-right'
        | 'bottom-left'
      >;
    }
  >;
  /**
   * 柱体宽度，可以设置绝对的像素值，也可以使用百分比（如 '10%'）
   * 1. number 类型，表示像素值
   * 2. string 类型，百分比用法，如 '10%'，该值为对应最后一个分组字段对应的 scale 的 bandWidth 占比(因为柱子是等宽的，所以采用最后一层分组的 scale)
   */
  barWidth?: number | string;
  /**
   * 柱体最小宽度，可以设置绝对的像素值，也可以使用百分比（如 '10%'）
   * 1. number 类型，表示像素值
   * 2. string 类型，百分比用法，如 '10%'，该值为对应最后一个分组字段对应的 scale 的 bandWidth 占比(因为柱子是等宽的，所以采用最后一层分组的 scale)
   */
  barMinWidth?: number | string;
  /**
   * 柱体最大宽度，可以设置绝对的像素值，也可以使用百分比（如 '10%'）
   * 1. number 类型，表示像素值
   * 2. string 类型，百分比用法，如 '10%'，该值为对应最后一个分组字段对应的 scale 的 bandWidth 占比(因为柱子是等宽的，所以采用最后一层分组的 scale)
   */
  barMaxWidth?: number | string;
  /**
   * 分组柱图中各个分组内的柱子间距，可以设置绝对的像素值，也可以使用百分比（如 '10%'）。
   * 当存在多层分组时，可以使用数组来设置不同层级的间距，如 [10, '20%']，表示第一层分组的间距为 10px，第二层分组的间距为 '20%'。
   * 如果 barGapInGroup 的数组个数小于分组层数，则后面的分组间距使用最后一个值。
   * 1. number 类型，表示像素值
   * 2. string 类型，百分比用法，如 '10%'，该值为对应最后一个分组字段对应的 scale 的 bandWidth 占比(因为柱子是等宽的，所以采用最后一层分组的 scale)
   * @since 1.2.0
   */
  barGapInGroup?: number | string | (number | string)[];

  /**
   * 柱条最小高度，可用于防止某数据项的值过小的视觉调整。
   * @since 1.4.0
   */
  barMinHeight?: number;

  /**
   * 堆叠柱整体的圆角 @since 1.10.0
   * 圆角支持回调配置 @since 1.12.4
   */
  stackCornerRadius?: number | number[] | IStackCornerRadiusCallback;

  /**
   * 柱条间 gap 值 @since 1.13.11
   */
  barGap?: number;
}
```

相关定义：[ICartesianSeriesSpec](AdditionalTypes-Type-Definition.md#type-3814e1f2a8e7)、[IAnimationSpec](AdditionalTypes-Type-Definition.md#type-c2c92c7fb8c3)、[BarMarks](AdditionalTypes-Type-Definition.md#type-d2964854c2a3)、[BarAppearPreset](AdditionalTypes-Type-Definition.md#type-2a04d7b5d5bc)、[IMarkProgressiveConfig](AdditionalTypes-Type-Definition.md#type-059a3e6127d2)、[IDataSamping](AdditionalTypes-Type-Definition.md#type-e33013d66ce5)、[IMarkSpec](IMarkSpec-Type-Definition.md)、[IRectMarkSpec](IRectMarkSpec-Type-Definition.md)、[IBarBackgroundSpec](AdditionalTypes-Type-Definition.md#type-659e249e0870)、[IMultiLabelSpec](IMultiLabelSpec-Type-Definition.md)、[ILabelSpec](ILabelSpec-Type-Definition.md)、[Functional](AdditionalTypes-Type-Definition.md#type-2535a2dd9530)、[IStackCornerRadiusCallback](IStackCornerRadiusCallback-Type-Definition.md)

<a id="type-4f696616234f"></a>
## IBoxPlotSeriesSpec

来源：`packages/vchart/src/series/box-plot/interface.ts`，VChart 2.1.7

```typescript
export interface IBoxPlotSeriesSpec
  extends Omit<ICartesianSeriesSpec, 'xField' | 'yField' | 'direction'>,
    // TODO: 补充动画类型 @chengda
    IAnimationSpec<SeriesMarkNameEnum.boxPlot, string>,
    IMarkProgressiveConfig {
  /** 系列类型 */
  type: 'boxPlot';
  direction?: DirectionType;
  /**
   *x轴字段（direction=vertical时生效）
   */
  xField?: string | string[];
  /**
   *y轴字段（direction=horizontal时生效）
   */
  yField?: string | string[];
  /**
   *最小值字段
   */
  minField?: string;
  /**
   *最大值字段
   */
  maxField?: string;
  /**
   *q1字段
   */
  q1Field?: string;
  /**
   *中位数字段
   */
  medianField?: string;
  /**
   *q3字段
   */
  q3Field?: string;
  /**
   * 异常值字段
   */
  outliersField?: string;
  /**
   * 图元配置
   */
  [SeriesMarkNameEnum.boxPlot]?: IMarkSpec<IBoxPlotMarkSpec>;
  /**
   * 异常值图元配置
   * @since 2.0.10
   */
  [SeriesMarkNameEnum.outlier]?: IMarkSpec<ISymbolMarkSpec>;
  /**
   * 异常值样式配置
   * @todo 将在未来版本中废弃，请使用 outlier 配置项代替
   */
  outliersStyle?: IOutlierMarkSpec;

  /**
   * 宽度，可以设置绝对的像素值，也可以使用百分比（如 '10%'）
   * 1. number 类型，表示像素值
   * 2. string 类型，百分比用法，如 '10%'，该值为对应最后一个分组字段对应的 scale 的 bandWidth 占比
   * @since 2.0.10
   */
  boxWidth?: number | string;
  /**
   * 最小宽度，可以设置绝对的像素值，也可以使用百分比（如 '10%'）
   * 1. number 类型，表示像素值
   * 2. string 类型，百分比用法，如 '10%'，该值为对应最后一个分组字段对应的 scale 的 bandWidth 占比
   * @since 2.0.10
   */
  boxMinWidth?: number | string;
  /**
   * 最大宽度，可以设置绝对的像素值，也可以使用百分比（如 '10%'）
   * 1. number 类型，表示像素值
   * 2. string 类型，百分比用法，如 '10%'，该值为对应最后一个分组字段对应的 scale 的 bandWidth 占比
   * @since 2.0.10
   */
  boxMaxWidth?: number | string;

  /**
   * 分组箱线图中各个分组内的间距，可以设置绝对的像素值，也可以使用百分比（如 '10%'）。
   * 1. number 类型，表示像素值
   * 2. string 类型，百分比用法，如 '10%'，该值为对应最后一个分组字段对应的 scale 的 bandWidth 占比
   * @since 2.0.10
   */
  boxGapInGroup?: number | string | (number | string)[];
}
```

相关定义：[ICartesianSeriesSpec](AdditionalTypes-Type-Definition.md#type-3814e1f2a8e7)、[IAnimationSpec](AdditionalTypes-Type-Definition.md#type-c2c92c7fb8c3)、[SeriesMarkNameEnum.boxPlot](AdditionalTypes-Type-Definition.md#type-3b9e5d5f1ab0)、[IMarkProgressiveConfig](AdditionalTypes-Type-Definition.md#type-059a3e6127d2)、[DirectionType](AdditionalTypes-Type-Definition.md#type-244d188586b9)、[IMarkSpec](IMarkSpec-Type-Definition.md)、[IBoxPlotMarkSpec](IBoxPlotMarkSpec-Type-Definition.md)、[ISymbolMarkSpec](ISymbolMarkSpec-Type-Definition.md)、[IOutlierMarkSpec](IOutlierMarkSpec-Type-Definition.md)

<a id="type-3814e1f2a8e7"></a>
## ICartesianSeriesSpec

来源：`packages/vchart/src/series/cartesian/interface.ts`，VChart 2.1.7

```typescript
export interface ICartesianSeriesSpec extends ISeriesSpec {
  /**
   * direction
   * row means layout by rows，col means layout by columns
   */
  direction?: DirectionType;
  /**
   * x轴字段
   */
  xField?: string | string[];
  /**
   * 用于区间数据，声明区间末尾的数据字段。
   */
  x2Field?: string;
  // 因为存在 direction
  /**
   * y轴字段
   * 运行双轴都为离散，连续。所以 yField 也可以像 xField 一样支持多维度
   */
  yField?: string | string[];
  /**
   * 用于区间数据，声明区间末尾的数据字段。
   */
  y2Field?: string;

  /**
   * z轴字段
   * 用于3d散点图等
   */
  zField?: string | string[];

  /** 是否将数据按照数轴排序
   * @default false
   * @since 1.3.0
   */
  sortDataByAxis?: boolean;
}
```

相关定义：[ISeriesSpec](ISeriesSpec-Type-Definition.md)、[DirectionType](AdditionalTypes-Type-Definition.md#type-244d188586b9)

<a id="type-b9b1dad57548"></a>
## CirclePackingAppearPreset

来源：`packages/vchart/src/series/circle-packing/interface.ts`，VChart 2.1.7

```typescript
export type CirclePackingAppearPreset = 'growIn' | 'fadeIn';
```

<a id="type-c5aa6f08af16"></a>
## CirclePackingMark

来源：`packages/vchart/src/series/circle-packing/interface.ts`，VChart 2.1.7

```typescript
export type CirclePackingMark = 'leaf' | 'nonLeaf' | 'label' | 'nonLeafLabel';
```

<a id="type-bbcfdbd7ab2b"></a>
## ICirclePackingSeriesSpec

来源：`packages/vchart/src/series/circle-packing/interface.ts`，VChart 2.1.7

```typescript
export interface ICirclePackingSeriesSpec
  extends ISeriesSpec,
    IAnimationSpec<CirclePackingMark, CirclePackingAppearPreset> {
  type: 'circlePacking';

  /**
   * 分类字段
   * @requires
   */
  categoryField: string;

  /**
   * 权重字段
   * @requires
   */
  valueField: string;

  /**
   * 层内边距
   * @default 5
   * @description 支持传入数组, 单独控制某一层的内边距
   */
  layoutPadding?: number | number[];

  /**
   * 标签配置
   * @description 对所有层生效
   */
  [SeriesMarkNameEnum.label]?: IMarkSpec<ITextMarkSpec>;

  /**
   * 图元配置
   */
  [SeriesMarkNameEnum.circlePacking]?: IMarkSpec<IArcMarkSpec>;

  /**
   * 下钻配置
   * @default false
   * @description 下钻功能开关
   */
  drill?: boolean;
  /**
   * 钻取字段的field
   * @default DEFAULT_DATA_KEY
   * @description 通过API进行钻取, 需要此配置项.
   */
  drillField?: string;
}
```

相关定义：[ISeriesSpec](ISeriesSpec-Type-Definition.md)、[IAnimationSpec](AdditionalTypes-Type-Definition.md#type-c2c92c7fb8c3)、[CirclePackingMark](AdditionalTypes-Type-Definition.md#type-c5aa6f08af16)、[CirclePackingAppearPreset](AdditionalTypes-Type-Definition.md#type-b9b1dad57548)、[IMarkSpec](IMarkSpec-Type-Definition.md)、[ITextMarkSpec](ITextMarkSpec-Type-Definition.md)、[IArcMarkSpec](IArcMarkSpec-Type-Definition.md)

<a id="type-9e370720e4c3"></a>
## CorrelationAppearPreset

来源：`packages/vchart/src/series/correlation/interface.ts`，VChart 2.1.7

```typescript
export type CorrelationAppearPreset = 'scaleIn' | 'fadeIn';
```

<a id="type-bdf6cade9a59"></a>
## CorrelationMarks

来源：`packages/vchart/src/series/correlation/interface.ts`，VChart 2.1.7

```typescript
export type CorrelationMarks = 'point' | 'label';
```

<a id="type-129af10992bf"></a>
## ICorrelationSeriesSpec

来源：`packages/vchart/src/series/correlation/interface.ts`，VChart 2.1.7

```typescript
export interface ICorrelationSeriesSpec
  extends Omit<IPolarSeriesSpec, 'innerRadius' | 'outerRadius'>,
    IAnimationSpec<CorrelationMarks, CorrelationAppearPreset> {
  /**
   * @since 1.5.1
   * 系列类型
   */
  type: 'correlation';

  /**
   * 数据字段配置
   */
  /** 节点名称字段配置 */
  categoryField: string;
  /** 相关性数据字段配置 */
  valueField: string;
  /** 节点系列字段配置 */
  seriesField?: string;
  /** 节点尺寸数据字段配置 */
  sizeField?: string;
  /** 节点尺寸映射范围 */
  sizeRange?: number[];

  /**
   * layout & position
   */
  /** 图表中心点位置X坐标 */
  centerX?: number;
  /** 图表中心点位置Y坐标 */
  centerY?: number;
  /** 节点分布内半径 */
  innerRadius?: string | number;
  /** 节点分布外半径 */
  outerRadius?: string | number;
  /** 图表起始角度 */
  startAngle?: number;
  /** 图表终止角度 */
  endAngle?: number;

  /**
   * 图元配置
   */
  /** 中心点图元属性 **/
  [SeriesMarkNameEnum.centerPoint]?: IMarkSpec<ISymbolMarkSpec>;
  /** 水波纹图元属性 **/
  [SeriesMarkNameEnum.ripplePoint]?: IMarkSpec<IRippleMarkSpec>;
  /** 中心点label属性 **/
  [SeriesMarkNameEnum.centerLabel]?: ILabelSpec & {
    /** 标签位置 */
    position?:
      | 'top'
      | 'bottom'
      | 'left'
      | 'right'
      | 'top-right'
      | 'top-left'
      | 'bottom-right'
      | 'bottom-left'
      | 'center';
  };

  /** 节点图元属性 **/
  [SeriesMarkNameEnum.nodePoint]?: IMarkSpec<ISymbolMarkSpec>;
  /** 标签配置 */
  [SeriesMarkNameEnum.label]?: IMultiLabelSpec<
    ILabelSpec & {
      /** 标签位置 */
      position?:
        | 'top'
        | 'bottom'
        | 'left'
        | 'right'
        | 'top-right'
        | 'top-left'
        | 'bottom-right'
        | 'bottom-left'
        | 'center';
    }
  >;
}
```

相关定义：[IPolarSeriesSpec](AdditionalTypes-Type-Definition.md#type-1ed415b7c25f)、[IAnimationSpec](AdditionalTypes-Type-Definition.md#type-c2c92c7fb8c3)、[CorrelationMarks](AdditionalTypes-Type-Definition.md#type-bdf6cade9a59)、[CorrelationAppearPreset](AdditionalTypes-Type-Definition.md#type-9e370720e4c3)、[IMarkSpec](IMarkSpec-Type-Definition.md)、[ISymbolMarkSpec](ISymbolMarkSpec-Type-Definition.md)、[IRippleMarkSpec](IRippleMarkSpec-Type-Definition.md)、[ILabelSpec](ILabelSpec-Type-Definition.md)、[IMultiLabelSpec](IMultiLabelSpec-Type-Definition.md)

<a id="type-447586c1422f"></a>
## IDotSeriesSpec

来源：`packages/vchart/src/series/dot/interface.ts`，VChart 2.1.7

```typescript
export interface IDotSeriesSpec extends ICartesianSeriesSpec {
  /**
   * 系列类型
   */
  type: 'dot';

  /**
   * dot series group字段配置
   * @description 用于区分grid、symbol的fill和stroke逻辑。如果未配置,默认按照yField字段处理
   */
  seriesGroupField?: string;

  /**
   * dot type 字段配置
   * @description 用于区分dot的fill逻辑。如果未配置，默认按照yField字段处理
   */
  dotTypeField?: string;

  /**
   * title 字段配置
   * @description 用于显示title。如果未配置，默认按照yField字段处理
   */
  titleField?: string;

  /**
   * subTitle 字段配置
   * @description 用于显示subTitle。如果未配置，默认按照yField字段处理
   */
  subTitleField?: string;

  /**
   * @description 高亮series配置
   */
  highLightSeriesGroup?: string;

  /**
   * name 字段配置
   * @description 用于标记node name，便于绘制link。
   */
  name: string;

  /**
   * 是否线性维度展开
   * @default true
   */
  linearMode?: boolean;

  /**
   * 图元配置
   */
  [SeriesMarkNameEnum.dot]?: IMarkSpec<ISymbolMarkSpec>;
  /**
   * 标题
   */
  [SeriesMarkNameEnum.title]?: ISequenceLabel;
  /**
   * 标识符
   */
  [SeriesMarkNameEnum.symbol]?: IMarkSpec<ISymbolMarkSpec>;
  /**
   * 具体信息
   */
  [SeriesMarkNameEnum.subTitle]?: ISequenceLabel;
  /**
   * 时间线
   */
  [SeriesMarkNameEnum.grid]?: ISequenceGrid;
  /**
   * dot 系列的左边距(主要用于放置title和subTitle)
   */
  leftAppendPadding?: number;
  /**
   * dot 系列的可视高度
   */
  clipHeight?: number;
}
```

相关定义：[ICartesianSeriesSpec](AdditionalTypes-Type-Definition.md#type-3814e1f2a8e7)、[IMarkSpec](IMarkSpec-Type-Definition.md)、[ISymbolMarkSpec](ISymbolMarkSpec-Type-Definition.md)、[ISequenceLabel](AdditionalTypes-Type-Definition.md#type-a2f61a3aee80)、[ISequenceGrid](AdditionalTypes-Type-Definition.md#type-06ef4b91a65c)

<a id="type-06ef4b91a65c"></a>
## ISequenceGrid

来源：`packages/vchart/src/series/dot/interface.ts`，VChart 2.1.7

```typescript
interface ISequenceGrid {
  visible?: boolean;
  background?: {
    fill?: string;
    fillOpacity?: number;
  };
  style?: Omit<ConvertToMarkStyleSpec<IRuleMarkSpec>, 'visible'>;
}
```

相关定义：[ConvertToMarkStyleSpec](AdditionalTypes-Type-Definition.md#type-3f4d44a2bad5)、[IRuleMarkSpec](IRuleMarkSpec-Type-Definition.md)

<a id="type-a2f61a3aee80"></a>
## ISequenceLabel

来源：`packages/vchart/src/series/dot/interface.ts`，VChart 2.1.7

```typescript
interface ISequenceLabel {
  visible?: boolean;
  formatMethod?: IFormatMethod<[text: string | string[], datum?: any]>;
  style?: Omit<ConvertToMarkStyleSpec<ITextMarkSpec>, 'visible'>;
}
```

相关定义：[IFormatMethod](AdditionalTypes-Type-Definition.md#type-6375b3333257)、[ConvertToMarkStyleSpec](AdditionalTypes-Type-Definition.md#type-3f4d44a2bad5)、[ITextMarkSpec](ITextMarkSpec-Type-Definition.md)

<a id="type-ca0d8e9e8ab0"></a>
## FunnelAppearPreset

来源：`packages/vchart/src/series/funnel/interface.ts`，VChart 2.1.7

```typescript
export type FunnelAppearPreset = 'clipIn' | 'fadeIn';
```

<a id="type-c0065cc5144e"></a>
## FunnelMarks

来源：`packages/vchart/src/series/funnel/interface.ts`，VChart 2.1.7

```typescript
type FunnelMarks = 'funnel';
```

<a id="type-0291e38eb55c"></a>
## IFunnelSeriesSpec

来源：`packages/vchart/src/series/funnel/interface.ts`，VChart 2.1.7

```typescript
export interface IFunnelSeriesSpec extends ISeriesSpec, IAnimationSpec<FunnelMarks, FunnelAppearPreset> {
  type: 'funnel';
  /**
   * 分类字段
   */
  categoryField: string;
  /**
   * 数值字段
   */
  valueField: string;
  /**
   * 漏斗图朝向。
   * @default 'top'
   */
  funnelOrient?: IOrientType;
  /**
   * 图元形状。转化漏斗图仅支持 'rect'
   * @default 'trapezoid'
   */
  shape?: 'rect' | 'trapezoid';
  /**
   * 是否是转化漏斗图
   * @default false
   */
  isTransform?: boolean;
  /**
   * 漏斗图最下层是否尖角。shape为`rect`时不生效
   * @default true
   */
  isCone?: boolean;
  /**
   * 漏斗图对齐方式。转化漏斗图仅支持'center'
   * @default 'center'
   */
  funnelAlign?: 'left' | 'center' | 'right';
  /**
   * 漏斗层之间的像素间隔。转化漏斗图不支持gap配置。
   * @default 0
   */
  gap?: number;
  /**
   * 指定数值映射范围，range.min 映射到 minSize，range.max 映射到 maxSize。
   * range.min 默认为 0，range.max 默认为数据最大值。
   */
  range?: {
    min?: number;
    max?: number;
  };
  /**
   * 漏斗图最大宽度，支持配置像素值和百分比字符串。
   * @default '80%'
   */
  maxSize?: number | IPercent;
  /**
   * 漏斗图最小宽度，支持配置像素值和百分比字符串。
   * @default 0
   */
  minSize?: number | IPercent;
  /**
   * 漏斗层与转化层的图形高度比例
   * The height ratio between the funnel graphic and the transform graphic
   * @default 0.5
   * @since 1.10.1
   */
  heightRatio?: number;
  /**
   * 漏斗图转化率文案，用于转化层 tooltip key 的显示内容
   *  @since 1.13.6
   * @default '转化率'
   * */
  transformRatioText?: string;
  /**
   * 漏斗层样式
   */
  [SeriesMarkNameEnum.funnel]?: IMarkSpec<IPathMarkSpec>;
  /**
   * 转化层样式
   */
  [SeriesMarkNameEnum.transform]?: IMarkSpec<IPathMarkSpec>;
  /**
   * 漏斗层标签配置
   */
  [SeriesMarkNameEnum.label]?: IFunnelLabelSpec;
  /**
   * 漏斗层外部标签配置
   */
  [SeriesMarkNameEnum.outerLabel]?: IFunnelOuterLabelSpec;
  /**
   * 转化层标签配置
   */
  [SeriesMarkNameEnum.transformLabel]?: IFunnelLabelSpec;
}
```

相关定义：[ISeriesSpec](ISeriesSpec-Type-Definition.md)、[IAnimationSpec](AdditionalTypes-Type-Definition.md#type-c2c92c7fb8c3)、[FunnelMarks](AdditionalTypes-Type-Definition.md#type-c0065cc5144e)、[FunnelAppearPreset](AdditionalTypes-Type-Definition.md#type-ca0d8e9e8ab0)、[IOrientType](AdditionalTypes-Type-Definition.md#type-1c1f18d62ff6)、[IPercent](IPercent-Type-Definition.md)、[IMarkSpec](IMarkSpec-Type-Definition.md)、[IPathMarkSpec](IPathMarkSpec-Type-Definition.md)、[IFunnelLabelSpec](IFunnelLabelSpec-Type-Definition.md)、[IFunnelOuterLabelSpec](IFunnelOuterLabelSpec-Type-Definition.md)

<a id="type-258bf98aa33b"></a>
## GaugeMarks

来源：`packages/vchart/src/series/gauge/interface.ts`，VChart 2.1.7

```typescript
export type GaugeMarks = 'segment' | 'track';
```

<a id="type-1acef37a74c3"></a>
## GaugePointerMarks

来源：`packages/vchart/src/series/gauge/interface.ts`，VChart 2.1.7

```typescript
export type GaugePointerMarks = 'pointer' | 'pin' | 'pinBackground';
```

<a id="type-a11bb56c1a44"></a>
## IGaugeLabelSpec

来源：`packages/vchart/src/series/gauge/interface.ts`，VChart 2.1.7

```typescript
export type IGaugeLabelSpec = ILabelSpec;
```

相关定义：[ILabelSpec](ILabelSpec-Type-Definition.md)

<a id="type-9fdd71c680f3"></a>
## IGaugePointerSeriesSpec

来源：`packages/vchart/src/series/gauge/interface.ts`，VChart 2.1.7

```typescript
export interface IGaugePointerSeriesSpec
  extends IProgressLikeSeriesSpec,
    IAnimationSpec<GaugePointerMarks, ProgressLikeAppearPreset> {
  type: 'gaugePointer';

  /** 数值字段（可影响指针角度） */
  valueField: string | string[];

  /** 半径字段（可影响指针长度，GaugePointerSeries 没有 categoryField） */
  radiusField: string;

  /** 图钉前景样式 */
  [SeriesMarkNameEnum.pin]?: IMarkSpec<IPathMarkSpec> & PinMarkSpec;
  /** 图钉背景样式 */
  [SeriesMarkNameEnum.pinBackground]?: IMarkSpec<IPathMarkSpec> & PinMarkSpec;
  /** 指针样式 */
  [SeriesMarkNameEnum.pointer]?: IMarkSpec<IPathMarkSpec | IRectMarkSpec> & PointerMarkSpec;
}
```

相关定义：[IProgressLikeSeriesSpec](AdditionalTypes-Type-Definition.md#type-d7ad84462ce9)、[IAnimationSpec](AdditionalTypes-Type-Definition.md#type-c2c92c7fb8c3)、[GaugePointerMarks](AdditionalTypes-Type-Definition.md#type-1acef37a74c3)、[ProgressLikeAppearPreset](AdditionalTypes-Type-Definition.md#type-eb112c7e9a22)、[IMarkSpec](IMarkSpec-Type-Definition.md)、[IPathMarkSpec](IPathMarkSpec-Type-Definition.md)、[PinMarkSpec](AdditionalTypes-Type-Definition.md#type-d46655d2cdbe)、[IRectMarkSpec](IRectMarkSpec-Type-Definition.md)、[PointerMarkSpec](AdditionalTypes-Type-Definition.md#type-f4b734667103)

<a id="type-dfd9dde34e4c"></a>
## IGaugeSeriesSpec

来源：`packages/vchart/src/series/gauge/interface.ts`，VChart 2.1.7

```typescript
export interface IGaugeSeriesSpec
  extends IProgressLikeSeriesSpec,
    IAnimationSpec<GaugeMarks, ProgressLikeAppearPreset> {
  type: 'gauge';

  /** 扇区间隔角度 */
  padAngle?: number;

  /** 扇区样式 */
  [SeriesMarkNameEnum.segment]?: IMarkSpec<IArcMarkSpec>;
  /** 背景样式 */
  [SeriesMarkNameEnum.track]?: IMarkSpec<IArcMarkSpec>;
  /** 标签样式 */
  [SeriesMarkNameEnum.label]?: IGaugeLabelSpec;
}
```

相关定义：[IProgressLikeSeriesSpec](AdditionalTypes-Type-Definition.md#type-d7ad84462ce9)、[IAnimationSpec](AdditionalTypes-Type-Definition.md#type-c2c92c7fb8c3)、[GaugeMarks](AdditionalTypes-Type-Definition.md#type-258bf98aa33b)、[ProgressLikeAppearPreset](AdditionalTypes-Type-Definition.md#type-eb112c7e9a22)、[IMarkSpec](IMarkSpec-Type-Definition.md)、[IArcMarkSpec](IArcMarkSpec-Type-Definition.md)、[IGaugeLabelSpec](AdditionalTypes-Type-Definition.md#type-a11bb56c1a44)

<a id="type-d46655d2cdbe"></a>
## PinMarkSpec

来源：`packages/vchart/src/series/gauge/interface.ts`，VChart 2.1.7

```typescript
export type PinMarkSpec = {
  /** 宽度 */
  width?: number;
  /** 高度 */
  height?: number;
  /** 是否定位于极坐标系的中心，默认为 true。如果为 false，则位置受 innerRadius 影响 */
  isOnCenter?: boolean;
};
```

<a id="type-f4b734667103"></a>
## PointerMarkSpec

来源：`packages/vchart/src/series/gauge/interface.ts`，VChart 2.1.7

```typescript
export type PointerMarkSpec = {
  type?: 'path' | 'rect';

  /** 指针宽度比例（0~1） */
  width?: number;
  /** 指针长度比例（0~1）（为空则挂载 radius） */
  height?: number;
  /** 指针靠近圆心的一端离圆心的距离 */
  innerPadding?: number;
  /** 指针靠近边缘的一端离边缘的距离 */
  outerPadding?: number;

  /** 中心点坐标（0~1） */
  center?: [number, number];

  /** 是否定位于极坐标系的中心，默认为 true。如果为 false，则位置受 innerRadius 影响 */
  isOnCenter?: boolean;
};
```

<a id="type-a73edb9100ac"></a>
## HeatmapAppearPreset

来源：`packages/vchart/src/series/heatmap/interface.ts`，VChart 2.1.7

```typescript
export type HeatmapAppearPreset = 'fadeIn';
```

<a id="type-5bfb84e5033a"></a>
## HeatmapMarks

来源：`packages/vchart/src/series/heatmap/interface.ts`，VChart 2.1.7

```typescript
type HeatmapMarks = 'cell' | 'background' | 'label';
```

<a id="type-6600af61a1ec"></a>
## IHeatmapSeriesSpec

来源：`packages/vchart/src/series/heatmap/interface.ts`，VChart 2.1.7

```typescript
export interface IHeatmapSeriesSpec
  extends ICartesianSeriesSpec,
    IAnimationSpec<HeatmapMarks, HeatmapAppearPreset>,
    IMarkProgressiveConfig {
  /**
   *  系列类型
   */
  type: 'heatmap';

  /** 值 field */
  valueField?: string;

  /** 图元配置 */
  [SeriesMarkNameEnum.cell]?: IMarkSpec<IRectMarkSpec>;

  /** 图元背景配置 */
  [SeriesMarkNameEnum.cellBackground]?: IMarkSpec<IRectMarkSpec>;

  /** 标签配置*/
  [SeriesMarkNameEnum.label]?: ILabelSpec & {
    /** 标签位置 */
    position?: 'inside' | 'inside-top' | 'inside-bottom' | 'inside-right' | 'inside-left';
  };
}
```

相关定义：[ICartesianSeriesSpec](AdditionalTypes-Type-Definition.md#type-3814e1f2a8e7)、[IAnimationSpec](AdditionalTypes-Type-Definition.md#type-c2c92c7fb8c3)、[HeatmapMarks](AdditionalTypes-Type-Definition.md#type-5bfb84e5033a)、[HeatmapAppearPreset](AdditionalTypes-Type-Definition.md#type-a73edb9100ac)、[IMarkProgressiveConfig](AdditionalTypes-Type-Definition.md#type-059a3e6127d2)、[IMarkSpec](IMarkSpec-Type-Definition.md)、[IRectMarkSpec](IRectMarkSpec-Type-Definition.md)、[ILabelSpec](ILabelSpec-Type-Definition.md)

<a id="type-4d9d86b6e907"></a>
## ISeriesConstructor

来源：`packages/vchart/src/series/interface/common.ts`，VChart 2.1.7

```typescript
export interface ISeriesConstructor extends IModelConstructor {
  readonly type: string;
  mark?: SeriesMarkMap;
  new (spec: any, options: ISeriesOption): ISeries;
}
```

相关定义：[IModelConstructor](AdditionalTypes-Type-Definition.md#type-b2886ff503c6)、[SeriesMarkMap](AdditionalTypes-Type-Definition.md#type-90c30713a8c3)、[ISeriesOption](AdditionalTypes-Type-Definition.md#type-12b6b1d47870)、[ISeries](AdditionalTypes-Type-Definition.md#type-29ca9e871dc0)

<a id="type-2d3d647d41bf"></a>
## ISeriesMarkInfo

来源：`packages/vchart/src/series/interface/common.ts`，VChart 2.1.7

```typescript
export interface ISeriesMarkInfo extends IModelMarkInfo {
  /** mark 名称 */
  name: SeriesMarkNameEnum | string;
}
```

相关定义：[IModelMarkInfo](AdditionalTypes-Type-Definition.md#type-c6d245a05c0a)、[SeriesMarkNameEnum](AdditionalTypes-Type-Definition.md#type-df86033a747f)

<a id="type-12b6b1d47870"></a>
## ISeriesOption

来源：`packages/vchart/src/series/interface/common.ts`，VChart 2.1.7

```typescript
export interface ISeriesOption extends IModelOption {
  mode: RenderMode;
  region: IRegion;
  sourceDataList: DataView[];
  getSeriesData: (id: StringOrNumber | undefined, index: number | undefined) => DataView | undefined;
}
```

相关定义：[IModelOption](AdditionalTypes-Type-Definition.md#type-f2d5e89f0268)、[RenderMode](AdditionalTypes-Type-Definition.md#type-875ef0d8fcf4)、[IRegion](AdditionalTypes-Type-Definition.md#type-a83d28f54f24)、[DataView](AdditionalTypes-Type-Definition.md#type-b26ccd36d8e8)、[StringOrNumber](AdditionalTypes-Type-Definition.md#type-2f92a26f4727)

<a id="type-4d7144f1b638"></a>
## ISeriesSeriesInfo

来源：`packages/vchart/src/series/interface/common.ts`，VChart 2.1.7

```typescript
export interface ISeriesSeriesInfo {
  key: string;
  /** 直接取 datum 里的原始值 */
  originalKey: any;
  datum?: Datum;
  index?: number;
  // 样式的值类型可能是 StringOrNumber | number[] | xxxx
  style: (attribute: string) => any;
  /** series 对应的缩略图类型 */
  shapeType: string;
}
```

相关定义：[Datum](AdditionalTypes-Type-Definition.md#type-bf5eb9a79e61)

<a id="type-94e8317ff02e"></a>
## ISeriesSpecInfo

来源：`packages/vchart/src/series/interface/common.ts`，VChart 2.1.7

```typescript
export interface ISeriesSpecInfo<T extends ISeriesSpec = ISeriesSpec>
  extends IModelSpecInfo,
    ISeriesSpecTransformerResult<T, any> {
  /** model 具体类型 */
  type: string | SeriesTypeEnum;
  /** model spec */
  spec: T;
  /** model theme */
  theme: any;
}
```

相关定义：[IModelSpecInfo](AdditionalTypes-Type-Definition.md#type-854f78cb6f0a)、[ISeriesSpecTransformerResult](AdditionalTypes-Type-Definition.md#type-bcafdba3ac92)、[SeriesTypeEnum](AdditionalTypes-Type-Definition.md#type-11db701f3ba0)、[ISeriesSpec](ISeriesSpec-Type-Definition.md)

<a id="type-bcafdba3ac92"></a>
## ISeriesSpecTransformerResult

来源：`packages/vchart/src/series/interface/common.ts`，VChart 2.1.7

```typescript
export interface ISeriesSpecTransformerResult<T, K> extends IBaseModelSpecTransformerResult<T, K> {
  /** 当前的 mark 标签 spec */
  markLabelSpec?: Partial<Record<SeriesMarkNameEnum, TransformedLabelSpec[]>>;
  /** 是否堆叠 */
  stack?: boolean;
}
```

相关定义：[IBaseModelSpecTransformerResult](AdditionalTypes-Type-Definition.md#type-9be6c667e373)、[SeriesMarkNameEnum](AdditionalTypes-Type-Definition.md#type-df86033a747f)、[TransformedLabelSpec](AdditionalTypes-Type-Definition.md#type-cc4522eb0b63)

<a id="type-7770159e04bb"></a>
## ISeriesStackData

来源：`packages/vchart/src/series/interface/common.ts`，VChart 2.1.7

```typescript
export type ISeriesStackData = ISeriesStackDataNode;
```

相关定义：[ISeriesStackDataNode](AdditionalTypes-Type-Definition.md#type-234297d4a62a)

<a id="type-17aca4fa17c9"></a>
## ISeriesStackDataLeaf

来源：`packages/vchart/src/series/interface/common.ts`，VChart 2.1.7

```typescript
export interface ISeriesStackDataLeaf {
  groupField?: string;
  values: any[];
  total?: number;
}
```

<a id="type-9aad3a641385"></a>
## ISeriesStackDataMeta

来源：`packages/vchart/src/series/interface/common.ts`，VChart 2.1.7

```typescript
export type ISeriesStackDataMeta = ISeriesStackDataNode | ISeriesStackDataLeaf;
```

相关定义：[ISeriesStackDataNode](AdditionalTypes-Type-Definition.md#type-234297d4a62a)、[ISeriesStackDataLeaf](AdditionalTypes-Type-Definition.md#type-17aca4fa17c9)

<a id="type-234297d4a62a"></a>
## ISeriesStackDataNode

来源：`packages/vchart/src/series/interface/common.ts`，VChart 2.1.7

```typescript
export interface ISeriesStackDataNode {
  groupField?: string;
  nodes: {
    [key: string]: ISeriesStackDataMeta;
  };
}
```

相关定义：[ISeriesStackDataMeta](AdditionalTypes-Type-Definition.md#type-9aad3a641385)

<a id="type-90c30713a8c3"></a>
## SeriesMarkMap

来源：`packages/vchart/src/series/interface/common.ts`，VChart 2.1.7

```typescript
export type SeriesMarkMap = Partial<Record<SeriesMarkNameEnum, ISeriesMarkInfo>>;
```

相关定义：[SeriesMarkNameEnum](AdditionalTypes-Type-Definition.md#type-df86033a747f)、[ISeriesMarkInfo](AdditionalTypes-Type-Definition.md#type-2d3d647d41bf)

<a id="type-80c7ff644ee5"></a>
## ICartesianSeries

来源：`packages/vchart/src/series/interface/series.ts`，VChart 2.1.7

```typescript
export interface ICartesianSeries extends ISeries {
  readonly coordinate: 'cartesian';
  readonly direction: DirectionType;

  scaleX: IBaseScale;
  setScaleX: (s: IBaseScale) => void;
  scaleY: IBaseScale;
  setScaleY: (s: IBaseScale) => void;
  scaleZ?: IBaseScale;
  setScaleZ: (s: IBaseScale) => void;
  // 要考虑基于多个field的场景
  fieldX: string[];
  setFieldX: (field: string | string[], level?: number) => void;
  fieldX2: string;
  setFieldX2: (field: string) => void;
  fieldY: string[];
  setFieldY: (field: string | string[], level?: number) => void;
  fieldY2: string;
  setFieldY2: (field: string) => void;
  fieldZ?: string[];
  setFieldZ: (field: string | string[], level?: number) => void;

  positionToData: (p: IPoint) => any | null;
  positionToDataX: (xPos: number) => any | null;
  positionToDataY: (yPos: number) => any | null;

  // 轴API
  getXAxisHelper: () => IAxisHelper;
  setXAxisHelper: (h: IAxisHelper) => void;
  getYAxisHelper: () => IAxisHelper;
  setYAxisHelper: (h: IAxisHelper) => void;
  getZAxisHelper: () => IAxisHelper | undefined;
  setZAxisHelper: (h: IAxisHelper) => void;

  dataToPositionX1: (datum: Datum) => number | null;
  dataToPositionY1: (datum: Datum) => number | null;

  valueToPosition: (value1: any, value2: any) => IPoint;
  valueToPositionX: (value: StringOrNumber | StringOrNumber[], datum?: any) => any;
  valueToPositionY: (value: StringOrNumber | StringOrNumber[], datum?: any) => any;
}
```

相关定义：[ISeries](AdditionalTypes-Type-Definition.md#type-29ca9e871dc0)、[DirectionType](AdditionalTypes-Type-Definition.md#type-244d188586b9)、[IBaseScale](AdditionalTypes-Type-Definition.md#type-f4ea6ab4e67d)、[IPoint](AdditionalTypes-Type-Definition.md#type-58fdfd9a6a7b)、[IAxisHelper](AdditionalTypes-Type-Definition.md#type-a26561e1568e)、[Datum](AdditionalTypes-Type-Definition.md#type-bf5eb9a79e61)、[StringOrNumber](AdditionalTypes-Type-Definition.md#type-2f92a26f4727)

<a id="type-7f5ce0113c45"></a>
## IGeoSeries

来源：`packages/vchart/src/series/interface/series.ts`，VChart 2.1.7

```typescript
export interface IGeoSeries extends ISeries {
  readonly coordinate: 'geo';

  nameField?: string;
  valueField?: string;

  getMapViewData: () => DataView;
  getNameProperty: () => string;

  dataToPosition: (datum: any, checkInViewData?: boolean) => IPoint | null;
  dataToLatitude: (latValue: any) => number | null;
  dataToLongitude: (lonValue: any) => number | null;
  nameValueToPosition: (name: string) => IPoint | null;

  positionToData: (p: IPoint) => any;
  latitudeToData: (lat: number) => any;
  longitudeToData: (lon: number) => any;

  getCoordinateHelper: () => IGeoCoordinateHelper;
  setCoordinateHelper: (helper: IGeoCoordinateHelper) => void;

  valueToPosition: (value1: any, value2: any) => IPoint;
  getDatumCenter: (datum: any) => [number, number];
}
```

相关定义：[ISeries](AdditionalTypes-Type-Definition.md#type-29ca9e871dc0)、[DataView](AdditionalTypes-Type-Definition.md#type-b26ccd36d8e8)、[IPoint](AdditionalTypes-Type-Definition.md#type-58fdfd9a6a7b)、[IGeoCoordinateHelper](AdditionalTypes-Type-Definition.md#type-73cca056070b)

<a id="type-6c82e34ce6af"></a>
## IPolarSeries

来源：`packages/vchart/src/series/interface/series.ts`，VChart 2.1.7

```typescript
export interface IPolarSeries extends ISeries {
  readonly coordinate: 'polar';

  outerRadius: number;
  innerRadius: number;

  getRadiusField: () => string[];
  setRadiusField: (field: string | string[], level?: number) => void;
  getAngleField: () => string[];
  setAngleField: (field: string | string[], level?: number) => void;

  // 轴将是一个实现了 scale 的组件。这里接收的可以是一个轴
  radiusScale: IBaseScale;
  setRadiusScale: (s: IBaseScale) => void;
  angleScale: IBaseScale;
  setAngleScale: (s: IBaseScale) => void;

  // TODO:
  positionToData: (point: IPolarPoint) => any;
  radiusToData: (radius: number) => any;
  angleToData: (angle: number) => any;

  // 轴
  radiusAxisHelper: IPolarAxisHelper;
  angleAxisHelper: IPolarAxisHelper;

  valueToPosition: (value1: any, value2: any) => IPoint;
}
```

相关定义：[ISeries](AdditionalTypes-Type-Definition.md#type-29ca9e871dc0)、[IBaseScale](AdditionalTypes-Type-Definition.md#type-f4ea6ab4e67d)、[IPolarPoint](AdditionalTypes-Type-Definition.md#type-d403c828183d)、[IPolarAxisHelper](AdditionalTypes-Type-Definition.md#type-2617700989c6)、[IPoint](AdditionalTypes-Type-Definition.md#type-58fdfd9a6a7b)

<a id="type-29ca9e871dc0"></a>
## ISeries

来源：`packages/vchart/src/series/interface/series.ts`，VChart 2.1.7

```typescript
export interface ISeries extends IModel {
  readonly type: string;
  readonly name?: string;

  // tooltip
  tooltipHelper: ISeriesTooltipHelper;

  // 配置
  getSpec: () => any;

  // 坐标系信息
  readonly coordinate: CoordinateType;

  // layout
  onLayoutEnd: () => void;

  // 数据
  getRawData: () => DataView | undefined;
  getViewDataFilter: () => DataView | undefined;
  getViewData: () => DataView | undefined;
  getViewDataProductId: () => string | undefined;
  getRawDataStatisticsByField: (field: string, isNumeric?: boolean) => { values?: any[]; min?: number; max?: number };
  getViewDataStatistics?: () => DataView | undefined;
  getDataSet?: () => DataSet;
  getFieldAlias: (field: string) => string;
  // 更新原始数据
  updateRawData: (d: any) => void;
  setData?: (dv: DataView) => void;
  rawDataUpdate: (d: DataView) => void;
  viewDataUpdate: (d: DataView) => void;
  viewDataStatisticsUpdate: (d: DataView) => void;
  addViewDataFilter: (option: ITransformOptions) => void;
  reFilterViewData: () => void;
  reTransformViewData: () => void;
  fillData: () => void;
  isHierarchyData?: () => boolean;
  getMarkData?: (d: Datum) => Datum;

  /**
   * 常见数据使用问题
   *
   * 一、使用图表最终展示数据
   * 比如 markline，数值轴 这样的组件
   * 需要操作展示数据，做 筛选 ｜ 变换 的
   * 比如图例，datazoom
      series.getViewData().transform({},false)
   * 需要获取展示数据，生成自身数据做自身展示的 使用消息机制。比如 轴
      series.event.on('viewDataStatisticsUpdate' ｜ 'viewDataUpdate', { filter: ({ model }) => model?.id === series.id }, () => {
        this.updateData();
      });
   *
   * 二、使用图表原始数据
   * 比如图例，datazoom
   * 需要使用原始数据信息，生成自身数据
   * 比如图例，datazoom
      series.getRawData().parserData  ｜   latestData    // parserData latestData 区别见下面说明
      series.getRawDataStatistics().latestData

      series.event.on('rawDataUpdate', { filter: ({ model }) => model?.id === series.id }, () => {
        this.updateData();
      });
   * 或者使用系列自身的特殊api 特殊情况外不建议这样用
      series.getSeriesInfoList()

   * 建议：使用数据时需要注意数据更新，使用系列数据更新组件数据的场景，只建议使用消息监听
      series.event.on(
        'viewDataStatisticsUpdate' ｜
        'viewDataUpdate' |
        'rawDataUpdate',
        { filter: ({ model }) => model?.id === series.id })
   */

  // 区域
  getRegion: () => IRegion;

  // mark
  initMark: () => void;
  getMarks: () => IMark[];
  getMarksWithoutRoot: () => IMark[];
  getMarkNameMap: () => Record<string, IMark>;
  getMarksInType: (type: string | string[]) => IMark[];
  getMarkInName: (name: string) => IMark | undefined;
  getMarkInId: (id: number) => IMark | undefined;

  getRootMark: () => IGroupMark;
  getActiveMarks: () => IMark[];
  getSeriesMark: () => IMark;

  // example
  /**
   *  [
   *  {
   *    fields: {
   *       x: '周一',
   *       __VChart_STACK: 'stack'
   *    },
   *    valueField: 'y',
   *    values: [{x: '周一', y: 20}];
   *  },
   *  {
   *    fields: {
   *       x: '周一',
   *       stack: 'stackA'
   *    },
   *    valueField: 'y',
   *    values: [{x: '周一', y: 20, stack: 'stackA'}];
   *  },
   *  {
   *    fields: {
   *       x: '周一',
   *       stack: 'stackB'
   *    },
   *    valueField: 'y',
   *    values: [{x: '周一', y: 20, stack: 'stackB'}];
   *  },
   *  ]
   */
  getStackData: () => ISeriesStackData;

  getStack: () => boolean;
  getStackValue: () => StringOrNumber | undefined;
  getPercent: () => boolean;
  getStackOffsetSilhouette: () => boolean;

  getStackValueField: () => string;
  setValueFieldToStack: () => void;
  setValueFieldToPercent: () => void;
  setValueFieldToStackOffsetSilhouette: () => void;

  getStackGroupFields: () => string[];
  getSeriesField: () => string | undefined;
  getSeriesKeys: () => string[];
  getSeriesStyle: (datum: Datum) => ISeriesSeriesInfo['style'];
  getSeriesInfoInField: (field: string) => ISeriesSeriesInfo[];
  getSeriesInfoList: () => ISeriesSeriesInfo[];
  getGroups: () => IGroup | undefined;
  getDimensionField: () => string[];
  getMeasureField: () => string[];
  getStatisticFields: () => { key: string; operations: StatisticOperations }[];
  getDatumPositionValues: (datum: Datum, fields: string | string[]) => any[];
  getDatumPositionValue: (datum: Datum, field: string) => any;

  setSeriesField: (field: string) => void;
  handleZoom?: (e: ZoomEventParam) => void;
  handlePan?: (e: PanEventParam) => void;

  // 数据映射
  dataToPosition: (datum: Datum, checkInViewData?: boolean) => IPoint | null;
  dataToPositionX: (datum: Datum) => number | null;
  dataToPositionY: (datum: Datum) => number | null;
  dataToPositionZ?: (datum: Datum) => number | null;
  valueToPosition: (value1: any, value2?: any) => IPoint;

  getColorAttribute: () => { scale: IBaseScale; field: string };
  getDefaultColorDomain: () => any[];

  getInvalidType: () => IInvalidType;

  // 交互

  /**
   * 获取系列默认的缩略图形
   * @returns 默认的缩略图形
   */
  getDefaultShapeType: () => string;
  /** 获取系列标签配置 */
  initLabelMarkStyle?: (labelMark: ILabelMark, labelSpec: ILabelSpec) => void;
  /** 设置总计标签配置 */
  initTotalLabelMarkStyle?: (labelMark: ILabelMark) => void;
  getTotalLabelComponentStyle?: (info: Pick<ILabelInfo, 'baseMark' | 'labelMark'>) => any;

  getGroupFields: () => string[];

  getSpecInfo: () => ISeriesSpecInfo;
  getMarkAttributeContext: () => ISeriesMarkAttributeContext;

  getSeriesFieldValue: (datum: Datum, seriesField?: string) => any;

  legendSelectedFilter?: (component: ILegend, selectedKeys: StringOrNumber[]) => StringOrNumber[];
  parseLabelStyle?: (labelStyle: any, labelSpec: any, labelMark?: ILabelMark) => any;

  getInteractionTriggers?: () => { trigger: Partial<IBaseTriggerOptions>; marks: IMark[] }[];
}
```

相关定义：[IModel](AdditionalTypes-Type-Definition.md#type-2854a5da67ea)、[ISeriesTooltipHelper](AdditionalTypes-Type-Definition.md#type-bdf90758165d)、[CoordinateType](AdditionalTypes-Type-Definition.md#type-f14ee29f7b8b)、[DataView](AdditionalTypes-Type-Definition.md#type-b26ccd36d8e8)、[DataSet](AdditionalTypes-Type-Definition.md#type-8d2b64638b97)、[ITransformOptions](AdditionalTypes-Type-Definition.md#type-f4b40ca0e8cc)、[Datum](AdditionalTypes-Type-Definition.md#type-bf5eb9a79e61)、[IRegion](AdditionalTypes-Type-Definition.md#type-a83d28f54f24)、[IMark](AdditionalTypes-Type-Definition.md#type-50aedeb586cf)、[IGroupMark](AdditionalTypes-Type-Definition.md#type-8815337da68f)、[ISeriesStackData](AdditionalTypes-Type-Definition.md#type-7770159e04bb)、[StringOrNumber](AdditionalTypes-Type-Definition.md#type-2f92a26f4727)、[ISeriesSeriesInfo](AdditionalTypes-Type-Definition.md#type-4d7144f1b638)、[IGroup](AdditionalTypes-Type-Definition.md#type-7066ab370b9d)、[StatisticOperations](AdditionalTypes-Type-Definition.md#type-d92fd69b2371)、[ZoomEventParam](AdditionalTypes-Type-Definition.md#type-e212628531e0)、[PanEventParam](AdditionalTypes-Type-Definition.md#type-fd27c5f76824)、[IPoint](AdditionalTypes-Type-Definition.md#type-58fdfd9a6a7b)、[IBaseScale](AdditionalTypes-Type-Definition.md#type-f4ea6ab4e67d)、[IInvalidType](AdditionalTypes-Type-Definition.md#type-5ea94ba3721c)、[ILabelMark](AdditionalTypes-Type-Definition.md#type-e9520a36483b)、[ILabelSpec](ILabelSpec-Type-Definition.md)、[ILabelInfo](AdditionalTypes-Type-Definition.md#type-c5e997daff79)、[ISeriesSpecInfo](AdditionalTypes-Type-Definition.md#type-94e8317ff02e)、[ISeriesMarkAttributeContext](AdditionalTypes-Type-Definition.md#type-57ff7f1e0f2e)、[ILegend](AdditionalTypes-Type-Definition.md#type-a385f1cab926)、[IBaseTriggerOptions](AdditionalTypes-Type-Definition.md#type-f51a72b7d484)

<a id="type-5683fd6b700a"></a>
## SeriesTypeForThemeEnum

来源：`packages/vchart/src/series/interface/theme.ts`，VChart 2.1.7

```typescript
export enum SeriesTypeForThemeEnum {
  area_horizontal = 'area_horizontal',
  area_vertical = 'area_vertical',
  area_stack = 'area_stack',

  line_horizontal = 'line_horizontal',
  line_vertical = 'line_vertical',
  line_stack = 'line_stack',

  bar_horizontal = 'bar_horizontal',
  bar_vertical = 'bar_vertical',
  bar_stack = 'bar_stack',

  rangeColumn_horizontal = 'rangeColumn_horizontal',
  rangeColumn_vertical = 'rangeColumn_vertical',

  rangeArea_horizontal = 'rangeArea_horizontal',
  rangeArea_vertical = 'rangeArea_vertical',

  linearProgress_horizontal = 'linearProgress_horizontal',
  linearProgress_vertical = 'linearProgress_vertical',
  linearProgress_stack = 'linearProgress_stack',

  boxPlot_horizontal = 'boxPlot_horizontal',
  boxPlot_vertical = 'boxPlot_vertical',

  sankey_horizontal = 'sankey_horizontal',
  sankey_vertical = 'sankey_vertical',

  waterfall_horizontal = 'waterfall_horizontal',
  waterfall_vertical = 'waterfall_vertical',

  circularProgress_stack = 'circularProgress_stack',

  radar_stack = 'radar_stack',
  rose_stack = 'rose_stack'
}
```

<a id="type-bdf90758165d"></a>
## ISeriesTooltipHelper

来源：`packages/vchart/src/series/interface/tooltip-helper.ts`，VChart 2.1.7

```typescript
export interface ISeriesTooltipHelper extends ITooltipHelper {
  /** 对应系列 */
  series: ISeries;

  getTooltipData: (
    activeType: TooltipActiveType,
    chartTooltipSpec?: ITooltipSpec,
    allData?: TooltipData,
    datum?: Datum[],
    params?: TooltipHandlerParams
  ) => ITooltipActual | null;

  // 可以继承的原子化回调
  markTooltipKeyCallback: TooltipContentCallback<string>;
  markTooltipValueCallback: TooltipContentCallback<string>;
  shapeTypeCallback: TooltipContentCallback<ShapeType>;
  shapeColorCallback: TooltipContentCallback<string>;
  shapeStrokeCallback: TooltipContentCallback<string>;
  dimensionTooltipTitleCallback: TooltipContentCallback<string>;
  groupTooltipTitleCallback: TooltipContentCallback<string>;
  groupTooltipKeyCallback: TooltipContentCallback<string>;
}
```

相关定义：[ITooltipHelper](AdditionalTypes-Type-Definition.md#type-47faea1d542e)、[ISeries](AdditionalTypes-Type-Definition.md#type-29ca9e871dc0)、[TooltipActiveType](AdditionalTypes-Type-Definition.md#type-990c112f10af)、[ITooltipSpec](ITooltipSpec-Type-Definition.md)、[TooltipData](AdditionalTypes-Type-Definition.md#type-2020c8fc6cbe)、[Datum](AdditionalTypes-Type-Definition.md#type-bf5eb9a79e61)、[TooltipHandlerParams](AdditionalTypes-Type-Definition.md#type-82517d84c2af)、[ITooltipActual](AdditionalTypes-Type-Definition.md#type-b6803f56a729)、[TooltipContentCallback](AdditionalTypes-Type-Definition.md#type-bb854deb9020)、[ShapeType](ShapeType-Type-Definition.md)

<a id="type-df86033a747f"></a>
## SeriesMarkNameEnum

来源：`packages/vchart/src/series/interface/type.ts`，VChart 2.1.7

```typescript
export const enum SeriesMarkNameEnum {
  label = 'label',
  point = 'point',
  line = 'line',
  area = 'area',
  bar = 'bar',
  boxPlot = 'boxPlot',
  outlier = 'outlier',
  circlePacking = 'circlePacking',
  group = 'group',
  gridBackground = 'gridBackground',
  grid = 'grid',
  dot = 'dot',
  title = 'title',
  subTitle = 'subTitle',
  symbol = 'symbol',
  funnel = 'funnel',
  transform = 'transform',
  transformLabel = 'transformLabel',
  outerLabel = 'outerLabel',
  outerLabelLine = 'outerLabelLine',
  pin = 'pin',
  pinBackground = 'pinBackground',
  pointer = 'pointer',
  segment = 'segment',
  track = 'track',
  cell = 'cell',
  cellBackground = 'cellBackground',
  link = 'link',
  curveLink = 'curveLink',
  imageLabel = 'imageLabel',
  arrow = 'arrow',
  pie = 'pie',
  labelLine = 'labelLine',
  progress = 'progress',
  minLabel = 'minLabel',
  maxLabel = 'maxLabel',
  rose = 'rose',
  node = 'node',
  sunburst = 'sunburst',
  nonLeaf = 'nonLeaf',
  leaf = 'leaf',
  nonLeafLabel = 'nonLeafLabel',
  leaderLine = 'leaderLine',
  stackLabel = 'stackLabel',
  word = 'word',
  fillingWord = 'fillingWord',
  wordMask = 'wordMask',
  nodePoint = 'nodePoint',
  ripplePoint = 'ripplePoint',
  centerPoint = 'centerPoint',
  centerLabel = 'centerLabel',
  barBackground = 'barBackground',
  lineLabel = 'lineLabel',
  areaLabel = 'areaLabel',
  liquidGroup = 'liquidGroup',
  liquid = 'liquid',
  liquidBackground = 'liquidBackground',
  liquidOutline = 'liquidOutline',
  circle = 'circle',
  overlap = 'overlap',
  overlapLabel = 'overlapLabel'
}
```

<a id="type-3b9e5d5f1ab0"></a>
## boxPlot

来源：`packages/vchart/src/series/interface/type.ts`，VChart 2.1.7

```typescript
boxPlot = 'boxPlot'
```

<a id="type-a5db06e8dac0"></a>
## progress

来源：`packages/vchart/src/series/interface/type.ts`，VChart 2.1.7

```typescript
progress = 'progress'
```

<a id="type-3720a45bf7f9"></a>
## track

来源：`packages/vchart/src/series/interface/type.ts`，VChart 2.1.7

```typescript
track = 'track'
```

<a id="type-dcab00960f46"></a>
## word

来源：`packages/vchart/src/series/interface/type.ts`，VChart 2.1.7

```typescript
word = 'word'
```

<a id="type-43422e48d197"></a>
## SeriesType

来源：`packages/vchart/src/series/interface/type.ts`，VChart 2.1.7

```typescript
export type SeriesType = keyof typeof SeriesTypeEnum | string;
```

相关定义：[SeriesTypeEnum](AdditionalTypes-Type-Definition.md#type-11db701f3ba0)

<a id="type-11db701f3ba0"></a>
## SeriesTypeEnum

来源：`packages/vchart/src/series/interface/type.ts`，VChart 2.1.7

```typescript
export enum SeriesTypeEnum {
  area = 'area',
  line = 'line',
  bar = 'bar',
  rangeColumn = 'rangeColumn',
  rangeArea = 'rangeArea',
  dot = 'dot',
  geo = 'geo',
  link = 'link',
  curveLink = 'curveLink',
  map = 'map',
  pie = 'pie',
  radar = 'radar',
  rose = 'rose',
  scatter = 'scatter',
  circularProgress = 'circularProgress',
  wordCloud = 'wordCloud',
  funnel = 'funnel',
  linearProgress = 'linearProgress',
  boxPlot = 'boxPlot',
  sankey = 'sankey',
  gaugePointer = 'gaugePointer',
  gauge = 'gauge',
  treemap = 'treemap',
  sunburst = 'sunburst',
  circlePacking = 'circlePacking',
  waterfall = 'waterfall',
  heatmap = 'heatmap',
  correlation = 'correlation',
  liquid = 'liquid',
  venn = 'venn',
  mosaic = 'mosaic',
  pictogram = 'pictogram'
}
```

<a id="type-c14fbe0b660f"></a>
## ILineSeriesSpec

来源：`packages/vchart/src/series/line/interface.ts`，VChart 2.1.7

```typescript
export interface ILineSeriesSpec
  extends ICartesianSeriesSpec,
    IAnimationSpec<LineMarks, LineAppearPreset>,
    IMarkProgressiveConfig,
    IDataSamping,
    IMarkOverlap {
  /** 系列类型 */
  type: 'line';
  /**
   * x轴字段
   */
  xField?: string | string[];
  /**
   * y轴字段
   */
  yField?: string | string[];
  /**
   * 点图元配置
   */
  [SeriesMarkNameEnum.point]?: IMarkSpec<ISymbolMarkSpec>;
  /**
   * 线图元配置
   */
  [SeriesMarkNameEnum.line]?: IMarkSpec<ILineMarkSpec>;
  /**
   * 标签配置
   */
  [SeriesMarkNameEnum.label]?: IMultiLabelSpec<ILineLikeLabelSpec>;
  /**
   * 折线标签配置
   * @since 1.7.0
   */
  [SeriesMarkNameEnum.lineLabel]?: Omit<ILabelSpec, 'position'> & {
    position?: 'start' | 'end';
  };
  /**
   * 系列主 mark 类型配置，该配置会影响图例的展示
   * @default 'line'
   * @since 1.2.0
   */
  seriesMark?: 'line' | 'point';

  /**
   * 是否使用额外的 activePoint 显示交互点，可以在点隐藏时显示被交互的点
   * @default false
   * @since 1.3.0
   */
  activePoint?: boolean;
}
```

相关定义：[ICartesianSeriesSpec](AdditionalTypes-Type-Definition.md#type-3814e1f2a8e7)、[IAnimationSpec](AdditionalTypes-Type-Definition.md#type-c2c92c7fb8c3)、[LineMarks](AdditionalTypes-Type-Definition.md#type-da75180b071f)、[LineAppearPreset](AdditionalTypes-Type-Definition.md#type-6966f849b7c7)、[IMarkProgressiveConfig](AdditionalTypes-Type-Definition.md#type-059a3e6127d2)、[IDataSamping](AdditionalTypes-Type-Definition.md#type-e33013d66ce5)、[IMarkOverlap](AdditionalTypes-Type-Definition.md#type-bed88451c0c6)、[IMarkSpec](IMarkSpec-Type-Definition.md)、[ISymbolMarkSpec](ISymbolMarkSpec-Type-Definition.md)、[ILineMarkSpec](ILineMarkSpec-Type-Definition.md)、[IMultiLabelSpec](IMultiLabelSpec-Type-Definition.md)、[ILineLikeLabelSpec](ILineLikeLabelSpec-Type-Definition.md)、[ILabelSpec](ILabelSpec-Type-Definition.md)

<a id="type-6966f849b7c7"></a>
## LineAppearPreset

来源：`packages/vchart/src/series/line/interface.ts`，VChart 2.1.7

```typescript
export type LineAppearPreset = 'clipIn' | 'fadeIn' | 'grow';
```

<a id="type-da75180b071f"></a>
## LineMarks

来源：`packages/vchart/src/series/line/interface.ts`，VChart 2.1.7

```typescript
type LineMarks = 'point' | 'line';
```

<a id="type-66b30ce0b9f7"></a>
## ILinkSeriesSpec

来源：`packages/vchart/src/series/link/interface.ts`，VChart 2.1.7

```typescript
export interface ILinkSeriesSpec extends ICartesianSeriesSpec, ILinkSeriesSpecFromDot {
  /**
   * 系列类型
   */
  type: 'link';

  /**
   * from 字段配置
   * @description 用于绘制link的起点。
   */
  fromField: string;

  /**
   * to 字段配置
   * @description 用于绘制link的终点。
   */
  toField: string;

  /**
   * 被关联的dot series index
   */
  dotSeriesIndex: number;

  // TODO: 这里的 type 是某种内部定义类型还是一位维度key呢？维度key的话应该用 xxxField 更合理

  /**
   * dot type字段配置
   * @description 用于区分link的stroke逻辑。如果没有配置，则每条link都使用相同的stroke
   */
  dotTypeField?: string;

  /**
   * link类型: 直线 或 曲线
   * @default 'line'
   */
  linkType?: LinkType;

  /**
   * link的image标签字段
   */
  imageLabelField?: string;
  /**
   * 是否允许向左右两侧延伸
   * @default false
   */
  allowExtend?: boolean;
  /**
   * 图元配置
   */
  [SeriesMarkNameEnum.link]?: IMarkSpec<ILineMarkSpec>;
  /**
   * image标签配置
   */
  [SeriesMarkNameEnum.imageLabel]?: IMarkSpec<IImageMarkSpec>;
}
```

相关定义：[ICartesianSeriesSpec](AdditionalTypes-Type-Definition.md#type-3814e1f2a8e7)、[ILinkSeriesSpecFromDot](AdditionalTypes-Type-Definition.md#type-28f198e9a466)、[LinkType](AdditionalTypes-Type-Definition.md#type-875756389aa2)、[IMarkSpec](IMarkSpec-Type-Definition.md)、[ILineMarkSpec](ILineMarkSpec-Type-Definition.md)、[IImageMarkSpec](IImageMarkSpec-Type-Definition.md)

<a id="type-28f198e9a466"></a>
## ILinkSeriesSpecFromDot

来源：`packages/vchart/src/series/link/interface.ts`，VChart 2.1.7

```typescript
type ILinkSeriesSpecFromDot = {
  // 以下属性不对用户开放
  // 原因: 在sequence chart层做了特殊处理，这些属性都从关联的dot series中获得，不开放给用户
  /**
   * 被关联dot series的数据
   */
  dataDot?: DataView;
  /**
   * 被关联的dot series的spec
   */
  dotSeriesSpec?: IDotSeriesSpec;
  /**
   * link 系列的左边距(和dot 系列保持一致，主要用于放置dot 系列的title和subTitle)
   */
  leftAppendPadding?: number;
  /**
   * link 系列的可视高度
   */
  clipHeight?: number;
};
```

相关定义：[DataView](AdditionalTypes-Type-Definition.md#type-b26ccd36d8e8)、[IDotSeriesSpec](AdditionalTypes-Type-Definition.md#type-447586c1422f)

<a id="type-875756389aa2"></a>
## LinkType

来源：`packages/vchart/src/series/link/interface.ts`，VChart 2.1.7

```typescript
export enum LinkType {
  line = 'line',
  curve = 'curve'
}
```

<a id="type-bef15b2fe03b"></a>
## ILiquidPadding

来源：`packages/vchart/src/series/liquid/interface.ts`，VChart 2.1.7

```typescript
export type ILiquidPadding = {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
};
```

<a id="type-a2cf44bad013"></a>
## ILiquidPaddingSpec

来源：`packages/vchart/src/series/liquid/interface.ts`，VChart 2.1.7

```typescript
export type ILiquidPaddingSpec = ILiquidPadding | number | number[];
```

相关定义：[ILiquidPadding](AdditionalTypes-Type-Definition.md#type-bef15b2fe03b)

<a id="type-fbf087ad5565"></a>
## ILiquidSeriesSpec

来源：`packages/vchart/src/series/liquid/interface.ts`，VChart 2.1.7

```typescript
export interface ILiquidSeriesSpec extends IAnimationSpec<LiquidMarks, LiquidAppearPreset> {
  /** 系列类型 */
  type: 'liquid';
  /**
   * value字段
   */
  valueField?: string;
  /**
   * 轮廓形状
   * @default 'circle'
   */
  maskShape?: LiquidShapeType;
  /**
   * 外轮廓与region边界之间的padding
   */
  outlineMargin?: ILiquidPaddingSpec;
  /**
   * 内轮廓与外轮廓之间的padding
   */
  outlinePadding?: ILiquidPaddingSpec;
  /**
   * 是否开启指标智能反色
   * @default false
   */
  indicatorSmartInvert?: boolean;
  /**
   * 是否反向绘制
   * @default false
   * @since 1.11.10
   */
  reverse?: boolean;
  /**
   * 水波图元配置
   */
  [SeriesMarkNameEnum.liquid]?: IMarkSpec<ILiquidMarkSpec>;
  /**
   * 水波背景图元配置
   */
  [SeriesMarkNameEnum.liquidBackground]?: IMarkSpec<IGroupMarkSpec>;
  /**
   * 水波外轮廓配置
   */
  [SeriesMarkNameEnum.liquidOutline]?: IMarkSpec<ISymbolMark>;
}
```

相关定义：[IAnimationSpec](AdditionalTypes-Type-Definition.md#type-c2c92c7fb8c3)、[LiquidMarks](AdditionalTypes-Type-Definition.md#type-3527d2d11421)、[LiquidAppearPreset](AdditionalTypes-Type-Definition.md#type-e2f6a6a53711)、[LiquidShapeType](AdditionalTypes-Type-Definition.md#type-02af83268c9f)、[ILiquidPaddingSpec](AdditionalTypes-Type-Definition.md#type-a2cf44bad013)、[IMarkSpec](IMarkSpec-Type-Definition.md)、[ILiquidMarkSpec](ILiquidMarkSpec-Type-Definition.md)、[IGroupMarkSpec](IGroupMarkSpec-Type-Definition.md)、[ISymbolMark](AdditionalTypes-Type-Definition.md#type-dd0f2569fc22)

<a id="type-e2f6a6a53711"></a>
## LiquidAppearPreset

来源：`packages/vchart/src/series/liquid/interface.ts`，VChart 2.1.7

```typescript
export type LiquidAppearPreset = 'wave' | 'grow' | 'waveGrow';
```

<a id="type-3527d2d11421"></a>
## LiquidMarks

来源：`packages/vchart/src/series/liquid/interface.ts`，VChart 2.1.7

```typescript
type LiquidMarks = 'liquid';
```

<a id="type-02af83268c9f"></a>
## LiquidShapeType

来源：`packages/vchart/src/series/liquid/interface.ts`，VChart 2.1.7

```typescript
export type LiquidShapeType = SymbolType | 'drop';
```

相关定义：[SymbolType](AdditionalTypes-Type-Definition.md#type-4dccce8cd4d7)

<a id="type-f28afaaaf021"></a>
## IMapSeriesSpec

来源：`packages/vchart/src/series/map/interface.ts`，VChart 2.1.7

```typescript
export interface IMapSeriesSpec extends ISeriesSpec, IAnimationSpec<LineMarks, 'fadeIn'> {
  /**
   *  系列类型
   */
  type: 'map';
  /**
   *  地图数据源
   */
  map: string;
  /**
   *  名称维度
   */
  nameField?: string;
  /**
   *  值维度
   */
  valueField?: string;
  /**
   * 名称映射字段
   * @default 'name'
   */
  nameProperty?: string;
  /**
   * 中心坐标映射字段
   * @default  undefined
   * @since 1.5.1
   */
  centroidProperty?: string;
  /**
   *  名称映射表
   */
  nameMap?: { [key: string]: string };
  /**
   *  图元配置
   */
  area?: IMarkSpec<Omit<IPathMarkSpec, 'smoothScale'>>;

  /**
   * 默认填充颜色
   */
  defaultFillColor?: string;

  /**
   * 是否显示数据中没有的地区名称
   * @default false
   * @since 1.10.3
   */
  showDefaultName?: boolean;

  /** 标签配置 */
  label?: Omit<ILabelSpec, 'position'>;
}
```

相关定义：[ISeriesSpec](ISeriesSpec-Type-Definition.md)、[IAnimationSpec](AdditionalTypes-Type-Definition.md#type-c2c92c7fb8c3)、[LineMarks](AdditionalTypes-Type-Definition.md#type-7872a83a9a39)、[IMarkSpec](IMarkSpec-Type-Definition.md)、[IPathMarkSpec](IPathMarkSpec-Type-Definition.md)、[ILabelSpec](ILabelSpec-Type-Definition.md)

<a id="type-7872a83a9a39"></a>
## LineMarks

来源：`packages/vchart/src/series/map/interface.ts`，VChart 2.1.7

```typescript
type LineMarks = 'area';
```

<a id="type-1b11da6c8615"></a>
## IMosaicSeriesSpec

来源：`packages/vchart/src/series/mosaic/interface.ts`，VChart 2.1.7

```typescript
export interface IMosaicSeriesSpec extends Omit<IBarSeriesSpec, 'type' | 'label'> {
  /** 系列类型 */
  type: 'mosaic';
  [SeriesMarkNameEnum.label]?: IMultiLabelSpec<
    Omit<ILabelSpec, 'position'> & {
      /**
       * 是否根据分组字段过滤标签
       */
      filterByGroup?: {
        field: string;
        type?: 'min' | 'max';
        filter?: (d: any) => boolean;
      };

      /**
       * 标签位置
       * @since 1.6.0
       * 支持'top-right' | 'top-left'| 'bottom-right' | 'bottom-left'，以及函数形式配置
       * */
      position?: Functional<
        | 'outside'
        | 'top'
        | 'bottom'
        | 'left'
        | 'right'
        | 'inside'
        | 'inside-top'
        | 'inside-bottom'
        | 'inside-right'
        | 'inside-left'
        | 'top-right'
        | 'top-left'
        | 'bottom-right'
        | 'bottom-left'
      >;
    }
  >;
  /**
   * 柱子尺寸映射字段，如果不声明默认会根据相同维度下的总值占比进行映射
   * - 条形图方向时自动映射高度
   * - 竖形图方向时自动映射宽度
   * @since 1.13.10
   */
  bandWidthField?: string;
}
```

相关定义：[IBarSeriesSpec](AdditionalTypes-Type-Definition.md#type-e01baddbd8aa)、[IMultiLabelSpec](IMultiLabelSpec-Type-Definition.md)、[ILabelSpec](ILabelSpec-Type-Definition.md)、[Functional](AdditionalTypes-Type-Definition.md#type-2535a2dd9530)

<a id="type-71acefc8c120"></a>
## IPieSeriesSpec

来源：`packages/vchart/src/series/pie/interface.ts`，VChart 2.1.7

```typescript
export interface IPieSeriesSpec extends IPolarSeriesSpec, IAnimationSpec<PieMarks, PieAppearPreset> {
  type: 'pie';
  /**
   * 分类字段
   * @description 饼图每个扇区为独立的系列
   */
  categoryField: string;
  /** 数值字段 */
  valueField: string;
  /** 饼图中心点 x 坐标 */
  centerX?: number | IPercent;
  /** 饼图中心点 y 坐标 */
  centerY?: number | IPercent;
  /** 饼图扇区中心偏移 */
  centerOffset?: number;

  /**
   * 饼图扇区半径
   * @default 0.6
   * @deprecated use outerRadius instead
   */
  radius?: number;

  /**
   * 饼图扇区外半径
   * @default 0.6
   */
  outerRadius?: number;

  /**
   * 饼图扇区内半径
   * @default 0
   */
  innerRadius?: number;

  /**
   * 饼图扇区圆角半径
   * @default 0
   */
  cornerRadius?: number;
  /**
   * 饼图的起始角度（0 ~ 360）
   * @default -90
   */
  startAngle?: number;
  /**
   * 饼图的结束角度（0 ~ 360）
   * @default 270
   */
  endAngle?: number;
  /**
   * 扇区之间的间隔角度
   */
  padAngle?: number;

  /**
   * 最小的扇区角度（0 ~ 360），用于防止某个值过小导致扇区太小影响交互。
   * @default 0
   * @since 1.4.0
   */
  minAngle?: number;

  /**
   * @since 1.11.12
   */
  layoutRadius?: 'auto' | number | ((layoutRect: ILayoutRect, center: IPointLike) => number);

  /** 扇区样式 */
  [SeriesMarkNameEnum.pie]?: IMarkSpec<IArcMarkSpec>;
  /** 标签配置 */
  [SeriesMarkNameEnum.label]?: IMultiLabelSpec<IArcLabelSpec>;

  /** 数据为空时显示的占位图形 */
  emptyPlaceholder?: {
    /** 是否显示占位圆
     * @default false
     */
    showEmptyCircle?: boolean;

    /** 占位圆样式 */
    emptyCircle?: IMarkSpec<IArcMarkSpec>;
  };

  /**
   * 是否在数据均为0时显示均分扇区。
   * @default false
   */
  showAllZero?: boolean;

  /**
   * 是否将负数按照绝对值进行处理。
   * @default false
   */
  supportNegative?: boolean;
}
```

相关定义：[IPolarSeriesSpec](AdditionalTypes-Type-Definition.md#type-1ed415b7c25f)、[IAnimationSpec](AdditionalTypes-Type-Definition.md#type-c2c92c7fb8c3)、[PieMarks](AdditionalTypes-Type-Definition.md#type-b04753817bef)、[PieAppearPreset](AdditionalTypes-Type-Definition.md#type-c560860d2a3d)、[IPercent](IPercent-Type-Definition.md)、[ILayoutRect](AdditionalTypes-Type-Definition.md#type-b4324e55ab6b)、[IPointLike](AdditionalTypes-Type-Definition.md#type-e25b463f6cfe)、[IMarkSpec](IMarkSpec-Type-Definition.md)、[IArcMarkSpec](IArcMarkSpec-Type-Definition.md)、[IMultiLabelSpec](IMultiLabelSpec-Type-Definition.md)、[IArcLabelSpec](IArcLabelSpec-Type-Definition.md)

<a id="type-c560860d2a3d"></a>
## PieAppearPreset

来源：`packages/vchart/src/series/pie/interface.ts`，VChart 2.1.7

```typescript
export type PieAppearPreset = 'growAngle' | 'growRadius' | 'fadeIn';
```

<a id="type-b04753817bef"></a>
## PieMarks

来源：`packages/vchart/src/series/pie/interface.ts`，VChart 2.1.7

```typescript
export type PieMarks = 'pie' | 'label' | 'labelLine';
```

<a id="type-1ed415b7c25f"></a>
## IPolarSeriesSpec

来源：`packages/vchart/src/series/polar/interface.ts`，VChart 2.1.7

```typescript
export interface IPolarSeriesSpec extends ISeriesSpec {
  /**
   * 中心点 x 坐标
   * @since 1.11.2 支持百分比字符串
   **/
  centerX?: number | string;
  /**
   * 中心点 y 坐标
   * @since 1.11.2 支持百分比字符串
   **/
  centerY?: number | string;

  /**
   * 扇区外半径
   * @default 0.6
   */
  outerRadius?: number;

  /**
   * 扇区内半径
   */
  innerRadius?: number;

  /** 扇区起始角度 */
  startAngle?: number;
  /** 扇区结束角度 */
  endAngle?: number;

  /** 类别字段 */
  categoryField?: string | string[];

  /** 数值字段 */
  valueField?: string | string[];

  /**
   * @deprecated 请使用 `valueField`
   */
  radiusField?: string | string[];

  /**
   * @deprecated 请使用 `categoryField`
   */
  angleField?: string | string[];

  /**
   * 扇区半径
   * @default 0.6
   * @deprecated use outerRadius instead
   */
  radius?: number;

  /** 是否将数据按照数轴排序
   * @default false
   * @since 1.3.0
   */
  sortDataByAxis?: boolean;
}
```

相关定义：[ISeriesSpec](ISeriesSpec-Type-Definition.md)

<a id="type-d7ad84462ce9"></a>
## IProgressLikeSeriesSpec

来源：`packages/vchart/src/series/polar/progress-like/interface.ts`，VChart 2.1.7

```typescript
export interface IProgressLikeSeriesSpec extends IPolarSeriesSpec {
  /** 圆角部分是否突出（可分别设置左侧和右侧） */
  roundCap?: boolean | [boolean, boolean];

  /** 圆角半径 */
  cornerRadius?: number;

  /**
   * tick 模式显示
   * @since 1.4.0
   */
  tickMask?: Omit<IMarkSpec<IArcMarkSpec>, 'state'> & ITickMaskSpec;

  /**
   * 超出轴范围是否被裁剪（除tick模式外, 因为tick模式自带裁剪）
   * @since 1.13.9
   * @default false
   */
  clamp?: boolean;
}
```

相关定义：[IPolarSeriesSpec](AdditionalTypes-Type-Definition.md#type-1ed415b7c25f)、[IMarkSpec](IMarkSpec-Type-Definition.md)、[IArcMarkSpec](IArcMarkSpec-Type-Definition.md)、[ITickMaskSpec](AdditionalTypes-Type-Definition.md#type-ab1fc6a002d4)

<a id="type-ab1fc6a002d4"></a>
## ITickMaskSpec

来源：`packages/vchart/src/series/polar/progress-like/interface.ts`，VChart 2.1.7

```typescript
export interface ITickMaskSpec {
  /** 单个 tick 的默认宽度，角度值 */
  angle?: number;
  /** 单个 tick 的偏移角度，角度值 */
  offsetAngle?: number;
  /** tick mask 下的图元是否强制和 tick 的边线对齐 */
  forceAlign?: boolean;
}
```

<a id="type-eb112c7e9a22"></a>
## ProgressLikeAppearPreset

来源：`packages/vchart/src/series/polar/progress-like/interface.ts`，VChart 2.1.7

```typescript
export type ProgressLikeAppearPreset = 'grow' | 'fadeIn';
```

<a id="type-9e858d8f5809"></a>
## IRoseLikeSeriesSpec

来源：`packages/vchart/src/series/polar/rose-like/interface.ts`，VChart 2.1.7

```typescript
export type IRoseLikeSeriesSpec = IPolarSeriesSpec;
```

相关定义：[IPolarSeriesSpec](AdditionalTypes-Type-Definition.md#type-1ed415b7c25f)

<a id="type-26e9a8fad3db"></a>
## CircularProgressMarks

来源：`packages/vchart/src/series/progress/circular/interface.ts`，VChart 2.1.7

```typescript
export type CircularProgressMarks = 'progress' | 'track';
```

<a id="type-30261f5b0d11"></a>
## ICircularProgressSeriesSpec

来源：`packages/vchart/src/series/progress/circular/interface.ts`，VChart 2.1.7

```typescript
export interface ICircularProgressSeriesSpec
  extends IProgressSeriesSpec,
    IProgressLikeSeriesSpec,
    IAnimationSpec<CircularProgressMarks, ProgressLikeAppearPreset> {
  type: 'circularProgress';

  /** 分类字段 */
  categoryField?: string | string[];

  radiusField?: string;

  /** 数据最大值，默认为 1 */
  maxValue?: number;

  /** 进度条样式 */
  [SeriesMarkNameEnum.progress]?: IMarkSpec<IArcMarkSpec>;

  /** 背景样式 */
  [SeriesMarkNameEnum.track]?: IMarkSpec<IArcMarkSpec>;
}
```

相关定义：[IProgressSeriesSpec](AdditionalTypes-Type-Definition.md#type-ea6a754e3de0)、[IProgressLikeSeriesSpec](AdditionalTypes-Type-Definition.md#type-d7ad84462ce9)、[IAnimationSpec](AdditionalTypes-Type-Definition.md#type-c2c92c7fb8c3)、[CircularProgressMarks](AdditionalTypes-Type-Definition.md#type-26e9a8fad3db)、[ProgressLikeAppearPreset](AdditionalTypes-Type-Definition.md#type-eb112c7e9a22)、[IMarkSpec](IMarkSpec-Type-Definition.md)、[IArcMarkSpec](IArcMarkSpec-Type-Definition.md)

<a id="type-ea6a754e3de0"></a>
## IProgressSeriesSpec

来源：`packages/vchart/src/series/progress/interface.ts`，VChart 2.1.7

```typescript
export interface IProgressSeriesSpec extends ISeriesSpec {
  /**
   * 进度条圆角半径
   * @default 0
   */
  cornerRadius?: number;

  /** 进度条样式 */
  progress?: IMarkSpec<IArcMarkSpec> | IMarkSpec<IRectMarkSpec>;
  /** 背景样式 */
  track?: IMarkSpec<IArcMarkSpec> | IMarkSpec<IGroupMarkSpec>;
}
```

相关定义：[ISeriesSpec](ISeriesSpec-Type-Definition.md)、[IMarkSpec](IMarkSpec-Type-Definition.md)、[IArcMarkSpec](IArcMarkSpec-Type-Definition.md)、[IRectMarkSpec](IRectMarkSpec-Type-Definition.md)、[IGroupMarkSpec](IGroupMarkSpec-Type-Definition.md)

<a id="type-a272f43e66ef"></a>
## ILinearProgressSeriesSpec

来源：`packages/vchart/src/series/progress/linear/interface.ts`，VChart 2.1.7

```typescript
export interface ILinearProgressSeriesSpec
  extends IProgressSeriesSpec,
    // TODO: 补充MarkName类型 @liupei
    IAnimationSpec<SeriesMarkNameEnum.progress | SeriesMarkNameEnum.track, LinearProgressAppearPreset> {
  type: 'linearProgress';
  /**
   * coordinate: 'cartesian'
   * x轴字段
   */
  xField: string | string[];
  /**
   * y轴字段
   * 因为存在 direction，运行双轴都为离散，连续。所以 yField 也可以像 xField 一样支持多维度
   */
  yField: string | string[];

  /**
   * 方向
   * @default Direction.horizontal
   */
  direction?: DirectionType;

  /**
   * 进度条宽度
   * 以像素值(px)为单位
   */
  bandWidth?: number;

  /**
   * 超出轴范围是否被裁剪
   * @since 1.13.9
   * @default false
   */
  clamp?: boolean;

  /**
   * 进度条样式
   * TODO: 支持百分比作为padding, 类型为string
   */
  [SeriesMarkNameEnum.progress]?: IMarkSpec<IRectMarkSpec> & {
    /** 进度条上侧 padding（水平生效） */
    topPadding?: number;
    /** 进度条下侧 padding（水平生效） */
    bottomPadding?: number;
    /** 进度条左侧 padding（垂直生效） */
    leftPadding?: number;
    /** 进度条右侧 padding（垂直生效） */
    rightPadding?: number;
  };

  /** 背景条样式 */
  [SeriesMarkNameEnum.track]?: IMarkSpec<IRectMarkSpec>;
}
```

相关定义：[IProgressSeriesSpec](AdditionalTypes-Type-Definition.md#type-ea6a754e3de0)、[IAnimationSpec](AdditionalTypes-Type-Definition.md#type-c2c92c7fb8c3)、[SeriesMarkNameEnum.progress](AdditionalTypes-Type-Definition.md#type-a5db06e8dac0)、[SeriesMarkNameEnum.track](AdditionalTypes-Type-Definition.md#type-3720a45bf7f9)、[LinearProgressAppearPreset](AdditionalTypes-Type-Definition.md#type-1cff2ef63939)、[DirectionType](AdditionalTypes-Type-Definition.md#type-244d188586b9)、[IMarkSpec](IMarkSpec-Type-Definition.md)、[IRectMarkSpec](IRectMarkSpec-Type-Definition.md)

<a id="type-1cff2ef63939"></a>
## LinearProgressAppearPreset

来源：`packages/vchart/src/series/progress/linear/interface.ts`，VChart 2.1.7

```typescript
export type LinearProgressAppearPreset = 'grow' | 'fadeIn';
```

<a id="type-702f2f2e90b8"></a>
## IRadarSeriesSpec

来源：`packages/vchart/src/series/radar/interface.ts`，VChart 2.1.7

```typescript
export interface IRadarSeriesSpec
  extends IRoseLikeSeriesSpec,
    IAnimationSpec<RadarMarks, RadarAppearPreset>,
    IMarkProgressiveConfig,
    IMarkOverlap {
  type: 'radar';

  /**
   * 点图元配置
   */
  [SeriesMarkNameEnum.point]?: IMarkSpec<ISymbolMarkSpec>;
  /**
   * 线图元配置
   */
  [SeriesMarkNameEnum.line]?: IMarkSpec<ILineMarkSpec>;
  /**
   * 面积图元配置
   */
  [SeriesMarkNameEnum.area]?: IMarkSpec<IAreaMarkSpec>;
  /**
   * 标签配置
   */
  [SeriesMarkNameEnum.label]?: IMultiLabelSpec<ILineLikeLabelSpec>;
  /**
   * 系列主 mark 类型配置，该配置会影响图例的展示
   * @default 'area'
   * @since 1.2.0
   */
  seriesMark?: 'point' | 'line' | 'area';

  /**
   * 是否使用额外的 activePoint 显示交互点，可以在点隐藏时显示被交互的点
   * @default false
   * @since 1.3.0
   */
  activePoint?: boolean;
}
```

相关定义：[IRoseLikeSeriesSpec](AdditionalTypes-Type-Definition.md#type-9e858d8f5809)、[IAnimationSpec](AdditionalTypes-Type-Definition.md#type-c2c92c7fb8c3)、[RadarMarks](AdditionalTypes-Type-Definition.md#type-44fb5d824dc0)、[RadarAppearPreset](AdditionalTypes-Type-Definition.md#type-3ec398b9ec94)、[IMarkProgressiveConfig](AdditionalTypes-Type-Definition.md#type-059a3e6127d2)、[IMarkOverlap](AdditionalTypes-Type-Definition.md#type-bed88451c0c6)、[IMarkSpec](IMarkSpec-Type-Definition.md)、[ISymbolMarkSpec](ISymbolMarkSpec-Type-Definition.md)、[ILineMarkSpec](ILineMarkSpec-Type-Definition.md)、[IAreaMarkSpec](IAreaMarkSpec-Type-Definition.md)、[IMultiLabelSpec](IMultiLabelSpec-Type-Definition.md)、[ILineLikeLabelSpec](ILineLikeLabelSpec-Type-Definition.md)

<a id="type-3ec398b9ec94"></a>
## RadarAppearPreset

来源：`packages/vchart/src/series/radar/interface.ts`，VChart 2.1.7

```typescript
export type RadarAppearPreset = 'grow' | 'fadeIn' | 'clipIn';
```

<a id="type-44fb5d824dc0"></a>
## RadarMarks

来源：`packages/vchart/src/series/radar/interface.ts`，VChart 2.1.7

```typescript
type RadarMarks = 'point' | 'line' | 'area';
```

<a id="type-777c15c57cb1"></a>
## IRangeAreaSeriesSpec

来源：`packages/vchart/src/series/range-area/interface.ts`，VChart 2.1.7

```typescript
export interface IRangeAreaSeriesSpec extends Omit<IAreaSeriesSpec, 'type'> {
  /**
   * 系列类型
   */
  type: 'rangeArea';

  /**
   * 数据字段配置
   */
  /* 区间最小值字段 */
  minField?: string;
  /* 区间最大值字段 */
  maxField?: string;
}
```

相关定义：[IAreaSeriesSpec](AdditionalTypes-Type-Definition.md#type-3c1aa405c767)

<a id="type-71611a6326b0"></a>
## IRangeColumnSeriesSpec

来源：`packages/vchart/src/series/range-column/interface.ts`，VChart 2.1.7

```typescript
export interface IRangeColumnSeriesSpec
  extends Omit<IBarSeriesSpec, 'type' | 'label' | keyof IAnimationSpec<RangeColumnMarks, RangeColumnAppearPreset>>,
    IAnimationSpec<RangeColumnMarks, RangeColumnAppearPreset> {
  /** 系列类型 */
  type: 'rangeColumn';

  /**
   * 数据字段配置
   */
  /* 区间最小值字段 */
  minField: string;
  /* 区间最大值字段 */
  maxField: string;

  /**
   * 图元配置
   */
  [SeriesMarkNameEnum.bar]?: IMarkSpec<IRectMarkSpec>;

  /**
   * 标签配置
   */
  [SeriesMarkNameEnum.label]?: Partial<ILabelSpec> & {
    /** 标签位置(支持两端显示 bothEnds) */
    position?: PositionEnum;
    [SeriesMarkNameEnum.minLabel]?: IMarkSpec<IPositionedTextMarkSpec> & {
      /** 是否可见 */
      visible?: boolean;
      /** 标签位置 */
      position?: keyof typeof minMaxPositionEnum;
      /** 标签偏移量 */
      offset?: number;
      /**
       * 文本格式化函数
       * @param text 文本内容
       * @param datum 文本对应的数据记录
       * @returns 格式化后的文本
       */
      formatMethod?: IFormatMethod<[text: string | string[], datum?: any]>;
    };
    /** 最大值标签 */
    [SeriesMarkNameEnum.maxLabel]?: IMarkSpec<IPositionedTextMarkSpec> & {
      /** 是否可见 */
      visible?: boolean;
      /** 标签位置 */
      position?: minMaxPositionEnum;
      /** 标签偏移量 */
      offset?: number;
      /**
       * 文本格式化函数
       * @param text 文本内容
       * @param datum 文本对应的数据记录
       * @returns 格式化后的文本
       */
      formatMethod?: IFormatMethod<[text: string | string[], datum?: any]>;
    };
  };
}
```

相关定义：[IBarSeriesSpec](AdditionalTypes-Type-Definition.md#type-e01baddbd8aa)、[IAnimationSpec](AdditionalTypes-Type-Definition.md#type-c2c92c7fb8c3)、[RangeColumnMarks](AdditionalTypes-Type-Definition.md#type-d32ba1b05901)、[RangeColumnAppearPreset](AdditionalTypes-Type-Definition.md#type-df0bef8e8bc4)、[IMarkSpec](IMarkSpec-Type-Definition.md)、[IRectMarkSpec](IRectMarkSpec-Type-Definition.md)、[ILabelSpec](ILabelSpec-Type-Definition.md)、[PositionEnum](AdditionalTypes-Type-Definition.md#type-febd1be01553)、[IPositionedTextMarkSpec](AdditionalTypes-Type-Definition.md#type-62ea327d0fc7)、[minMaxPositionEnum](AdditionalTypes-Type-Definition.md#type-e105bd77edce)、[IFormatMethod](AdditionalTypes-Type-Definition.md#type-6375b3333257)

<a id="type-e105bd77edce"></a>
## minMaxPositionEnum

来源：`packages/vchart/src/series/range-column/interface.ts`，VChart 2.1.7

```typescript
export const enum minMaxPositionEnum {
  middle = 'middle',
  start = 'start',
  end = 'end'
}
```

<a id="type-febd1be01553"></a>
## PositionEnum

来源：`packages/vchart/src/series/range-column/interface.ts`，VChart 2.1.7

```typescript
export const enum PositionEnum {
  middle = 'middle',
  start = 'start',
  end = 'end',
  bothEnd = 'bothEnd'
}
```

<a id="type-df0bef8e8bc4"></a>
## RangeColumnAppearPreset

来源：`packages/vchart/src/series/range-column/interface.ts`，VChart 2.1.7

```typescript
export type RangeColumnAppearPreset = 'fadeIn' | 'grow';
```

<a id="type-d32ba1b05901"></a>
## RangeColumnMarks

来源：`packages/vchart/src/series/range-column/interface.ts`，VChart 2.1.7

```typescript
type RangeColumnMarks = 'rangeColumn';
```

<a id="type-50a9d844112a"></a>
## IRoseSeriesSpec

来源：`packages/vchart/src/series/rose/interface.ts`，VChart 2.1.7

```typescript
export interface IRoseSeriesSpec extends IRoseLikeSeriesSpec, IAnimationSpec<RoseMarks, RoseAppearPreset> {
  type: 'rose';
  /**
   * 分类字段
   */
  categoryField: string | string[];
  /**
   * 数值字段
   */
  valueField: string | string[];
  /** 扇区样式 */
  [SeriesMarkNameEnum.rose]?: IMarkSpec<IArcMarkSpec>;
  /** 标签配置 */
  [SeriesMarkNameEnum.label]?: IMultiLabelSpec<IArcLabelSpec>;
}
```

相关定义：[IRoseLikeSeriesSpec](AdditionalTypes-Type-Definition.md#type-9e858d8f5809)、[IAnimationSpec](AdditionalTypes-Type-Definition.md#type-c2c92c7fb8c3)、[RoseMarks](AdditionalTypes-Type-Definition.md#type-a5a601985dc4)、[RoseAppearPreset](AdditionalTypes-Type-Definition.md#type-c671df1145cb)、[IMarkSpec](IMarkSpec-Type-Definition.md)、[IArcMarkSpec](IArcMarkSpec-Type-Definition.md)、[IMultiLabelSpec](IMultiLabelSpec-Type-Definition.md)、[IArcLabelSpec](IArcLabelSpec-Type-Definition.md)

<a id="type-c671df1145cb"></a>
## RoseAppearPreset

来源：`packages/vchart/src/series/rose/interface.ts`，VChart 2.1.7

```typescript
export type RoseAppearPreset = 'growAngle' | 'growRadius' | 'fadeIn';
```

<a id="type-a5a601985dc4"></a>
## RoseMarks

来源：`packages/vchart/src/series/rose/interface.ts`，VChart 2.1.7

```typescript
export type RoseMarks = 'rose';
```

<a id="type-73ad288a6b3a"></a>
## ISankeySeriesSpec

来源：`packages/vchart/src/series/sankey/interface.ts`，VChart 2.1.7

```typescript
export interface ISankeySeriesSpec extends Omit<ISeriesSpec, 'data'>, IAnimationSpec<SankeyMark, SankeyAppearPreset> {
  type: 'sankey';

  /**
   * 数据字段配置
   */
  /** 节点名称字段配置 */
  categoryField: string;
  /** 节点之间关系的权重字段 */
  valueField: string;
  /** 来源节点数据字段
   *  层级数据不提供
   */
  sourceField?: string;
  /** 目标节点数据字段
   *  层级数据不提供
   */
  targetField?: string;

  /**
   * 图表布局方向
   */
  direction?: DirectionType;
  /**
   * 节点的对齐类型，所有深度相同的节点，采用什么对齐方式，决定了节点在第几层：
   * - 横向布局的桑基图，用于计算节点x坐标
   * - 纵向布局的桑基图，用于计算节点y坐标
   */
  nodeAlign?: 'left' | 'right' | 'center' | 'justify' | 'start' | 'end';
  /**
   * 横向布局的桑基图，设置节点Y坐标的对齐方式：
   * 'start' - '顶部对齐'
   * 'end' - '底部对齐'
   * 'middle' - '居中对齐'
   *
   * 纵向布局的桑基图，设置节点X坐标的对齐方式：
   * 'start' - '左对齐'
   * 'end' - '右对齐'
   * 'middle' - '居中对齐'
   * 'parent' - '父节点'，从1.12.14版本开始支持
   *
   * @since 1.12.4
   */
  crossNodeAlign?: 'start' | 'end' | 'middle' | 'parent';
  /**
   * 是否反向
   * @since 1.12.2
   */
  inverse?: boolean;
  /**
   * 同一层中两个节点之间的间隙大小
   */
  nodeGap?: number;
  /**
   * 每个节点的宽度，支持三种取值
   * 1. 百分比字符串，例如：{ nodeWidth: '12%' }
   * 2. 以'px'为单位的简单数字，eg: { nodeWidth: 20 }
   * 3. function，通过自定义计算指定nodeWidth
   */
  nodeWidth?: string | number | ((node: SankeyNodeElement) => number);
  /**
   * link宽度，单位px
   */
  linkWidth?: number | ((link: SankeyLinkElement) => number);
  /**
   * link + node 的最小宽度
   */
  minStepWidth?: number;
  /**
   * 数据不为零或空时节点的最小大小
   *  - 这个配置可以用来避免数据太小时看不到太细的节点
   *  - 建议小于5px
   */
  minNodeHeight?: number;
  /**
   * 数据不为零或空时边的最小大小
   *  - 这个配置可以用来避免数据太小的时候看不到太细的链接
   *  - 建议小于5px
   *  - 当同时指定 `minNodeHeight` 和 `minLinkHeight` 两个选项时，此选项应小于 `minNodeHeight`
   */
  minLinkHeight?: number;
  /**
   * 数据不为零或空时节点的最大大小
   * @since 1.12.14
   */
  maxNodeHeight?: number;
  /**
   * 数据不为零或空时边的最大大小
   * - 当同时指定 `maxNodeHeight` 和 `maxLinkHeight` 两个选项时，此选项应小于 `maxNodeHeight`
   * @since 1.12.14
   */
  maxLinkHeight?: number;
  /** 布局的迭代次数 */
  iterations?: number;
  /** 解析node的key，defaultValue */
  nodeKey?: string | number | ((datum: SankeyNodeDatum) => string | number);
  /** 按此funtion排序link */
  linkSortBy?: (a: SankeyLinkElement, b: SankeyLinkElement) => number;
  /** 按此funtion排序node */
  nodeSortBy?: (a: SankeyNodeElement, b: SankeyNodeElement) => number;
  /** 自定义指定节点层 */
  setNodeLayer?: (datum: SankeyNodeDatum) => number;
  /**
   * 是否丢弃孤立的节点
   * @since 1.11.0
   */
  dropIsolatedNode?: boolean;
  /**
   * set the height of node
   * @since 1.11.0
   */
  nodeHeight?: number | ((node: SankeyNodeElement) => number);
  /**
   * set the height of link
   * @since 1.11.0
   */
  linkHeight?: number | ((link: SankeyLinkElement, sourceNode: SankeyNodeElement, sourceNodeHeight: number) => number);
  /**
   * each node has same height
   * @since 1.11.0
   */
  equalNodeHeight?: boolean;
  /**
   * the layout type of link
   * @since 1.11.0
   */
  linkOverlap?: 'start' | 'center' | 'end';

  /** 节点配置 */
  [SeriesMarkNameEnum.node]?: IMarkSpec<IRectMarkSpec>;

  /** 边配置 */
  [SeriesMarkNameEnum.link]?: IMarkSpec<ILinkPathMarkSpec>;

  /** 联动交互配置 */
  emphasis?: {
    /** 是否开启交互 */
    enable: boolean;
    /**
     * 交互触发类型
     * 默认为‘click'
     */
    trigger?: 'click' | 'hover';
    /**桑基图提供3种在节点上的交互联动效果
     * self: 仅高亮当前节点。
     * adjacency: 高亮当前节点上下游节点和关联的边，淡化其它图形元素。
     * related： 高亮与当前节点相关的整条路径上的节点和边，淡化其它图形元素。 */
    effect: 'self' | 'adjacency' | 'related';
  };

  /** 标签配置 */
  [SeriesMarkNameEnum.label]?: ISankeyLabelSpec | ISankeyLabelSpec[];

  /**
   * 当制定了节点、边的宽度的时候，可以配置这个属性
   * 当宽度大于图表region的宽度、高度大于图表resion高度的时候是否自动产生滚动条
   * @since 1.13.0
   */
  overflow?: 'scroll' | 'hidden' | 'scroll-x' | 'scroll-y';

  /** 进度条配置 */
  // scroll?: IScrollSpec & {
  //   /** 是否开启进度条 */
  //   enable: boolean;
  // };
}
```

相关定义：[ISeriesSpec](ISeriesSpec-Type-Definition.md)、[IAnimationSpec](AdditionalTypes-Type-Definition.md#type-c2c92c7fb8c3)、[SankeyMark](AdditionalTypes-Type-Definition.md#type-2f12a706e2ad)、[SankeyAppearPreset](AdditionalTypes-Type-Definition.md#type-6997583ca0c0)、[DirectionType](AdditionalTypes-Type-Definition.md#type-244d188586b9)、[SankeyNodeElement](AdditionalTypes-Type-Definition.md#type-1474c7d432e5)、[SankeyLinkElement](AdditionalTypes-Type-Definition.md#type-e49f605dc3e0)、[SankeyNodeDatum](AdditionalTypes-Type-Definition.md#type-0e7c9dea40ba)、[IMarkSpec](IMarkSpec-Type-Definition.md)、[IRectMarkSpec](IRectMarkSpec-Type-Definition.md)、[ILinkPathMarkSpec](ILinkPathMarkSpec-Type-Definition.md)、[ISankeyLabelSpec](ISankeyLabelSpec-Type-Definition.md)

<a id="type-6997583ca0c0"></a>
## SankeyAppearPreset

来源：`packages/vchart/src/series/sankey/interface.ts`，VChart 2.1.7

```typescript
export type SankeyAppearPreset = 'growIn' | 'fadeIn';
```

<a id="type-5517b5c19b32"></a>
## SankeyLinkDatum

来源：`packages/vchart/src/series/sankey/interface.ts`，VChart 2.1.7

```typescript
export interface SankeyLinkDatum {
  source: string | number;
  target: string | number;
  value?: number;
}
```

<a id="type-e49f605dc3e0"></a>
## SankeyLinkElement

来源：`packages/vchart/src/series/sankey/interface.ts`，VChart 2.1.7

```typescript
export interface SankeyLinkElement {
  vertical?: boolean;
  index: number;
  source: string | number;
  target: string | number;
  value: number;
  datum: SankeyLinkDatum | SankeyLinkDatum[];
  thickness?: number;
  sourceRect?: { x0: number; x1: number; y0: number; y1: number };
  targetRect?: { x0: number; x1: number; y0: number; y1: number };
  /** this will only be generate in hierarchy node data*/
  parents?: (string | number)[];
  y0?: number;
  y1?: number;
  x0?: number;
  x1?: number;
}
```

相关定义：[SankeyLinkDatum](AdditionalTypes-Type-Definition.md#type-5517b5c19b32)

<a id="type-2f12a706e2ad"></a>
## SankeyMark

来源：`packages/vchart/src/series/sankey/interface.ts`，VChart 2.1.7

```typescript
export type SankeyMark = 'node' | 'link' | 'label';
```

<a id="type-0e7c9dea40ba"></a>
## SankeyNodeDatum

来源：`packages/vchart/src/series/sankey/interface.ts`，VChart 2.1.7

```typescript
export interface SankeyNodeDatum {
  value?: number;
}
```

<a id="type-1474c7d432e5"></a>
## SankeyNodeElement

来源：`packages/vchart/src/series/sankey/interface.ts`，VChart 2.1.7

```typescript
export interface SankeyNodeElement {
  key: string | number;
  index: number;
  /** the depth of node, from source to target */
  depth: number;

  /** the depth of node, from target to source */
  endDepth?: number;
  /** the final layer index after layout */
  layer?: number;
  isLastLayer?: boolean;
  value: number;
  datum: SankeyNodeDatum;
  sourceLinks: SankeyLinkElement[];
  targetLinks: SankeyLinkElement[];
  x0?: number;
  y0?: number;
  x1?: number;
  y1?: number;
}
```

相关定义：[SankeyNodeDatum](AdditionalTypes-Type-Definition.md#type-0e7c9dea40ba)、[SankeyLinkElement](AdditionalTypes-Type-Definition.md#type-e49f605dc3e0)

<a id="type-08a7bd218e9e"></a>
## IScatterSeriesSpec

来源：`packages/vchart/src/series/scatter/interface.ts`，VChart 2.1.7

```typescript
export interface IScatterSeriesSpec
  extends ICartesianSeriesSpec,
    IAnimationSpec<ScatterMarks, ScatterAppearPreset>,
    IMarkProgressiveConfig {
  /**
   * 系列类型
   */
  type: 'scatter';
  /**
   * x轴字段
   */
  xField?: string | string[];
  /**
   * y轴字段
   */
  yField?: string | string[];
  /**
   * 图元配置
   */
  [SeriesMarkNameEnum.point]?: IMarkSpec<ISymbolMarkSpec>;
  /**
   * 尺寸 对应的数据字段。
   */
  sizeField?: string;
  /**
   * 设置尺寸的可选值，支持多种格式：
   * - 单一数值：如 10，则所有点的大小都为 10
   * - 数组：如 [10, 30]，则根据尺寸数据字段映射到该范围
   * - 回调函数，自定义根据数据计算尺寸的逻辑
   * - scale配置，自定义尺寸对应的scale
   */
  size?: number | number[] | FunctionType<number> | IVisualSpecBase<unknown, number>;
  /**
   * 设置形状对应的数据字段
   */
  shapeField?: string;
  /**
   * 形状配置，设置形状的可选值
   * - 单一形状：如 'circle'，则所有点的形状都为 'circle'
   * - 数组：如 ['circle', 'square']，则根据形状数据字段映射到该范围
   * - 回调函数，自定义根据数据计算形状的逻辑
   * - scale配置，自定义形状对应的scale
   */
  shape?: ShapeType | ShapeType[] | FunctionType<ShapeType> | IVisualSpecBase<unknown, ShapeType>;
  /**
   * 标签配置
   */
  [SeriesMarkNameEnum.label]?: IMultiLabelSpec<ILineLikeLabelSpec>;
}
```

相关定义：[ICartesianSeriesSpec](AdditionalTypes-Type-Definition.md#type-3814e1f2a8e7)、[IAnimationSpec](AdditionalTypes-Type-Definition.md#type-c2c92c7fb8c3)、[ScatterMarks](AdditionalTypes-Type-Definition.md#type-fd1929cd17c5)、[ScatterAppearPreset](AdditionalTypes-Type-Definition.md#type-76d1da4aa75e)、[IMarkProgressiveConfig](AdditionalTypes-Type-Definition.md#type-059a3e6127d2)、[IMarkSpec](IMarkSpec-Type-Definition.md)、[ISymbolMarkSpec](ISymbolMarkSpec-Type-Definition.md)、[FunctionType](FunctionType-Type-Definition.md)、[IVisualSpecBase](IVisualSpecBase-Type-Definition.md)、[ShapeType](ShapeType-Type-Definition.md)、[IMultiLabelSpec](IMultiLabelSpec-Type-Definition.md)、[ILineLikeLabelSpec](ILineLikeLabelSpec-Type-Definition.md)

<a id="type-76d1da4aa75e"></a>
## ScatterAppearPreset

来源：`packages/vchart/src/series/scatter/interface.ts`，VChart 2.1.7

```typescript
export type ScatterAppearPreset = 'scaleIn' | 'fadeIn';
```

<a id="type-fd1929cd17c5"></a>
## ScatterMarks

来源：`packages/vchart/src/series/scatter/interface.ts`，VChart 2.1.7

```typescript
export type ScatterMarks = 'point' | 'label';
```

<a id="type-9821e1ad4f86"></a>
## SunburstAppearPreset

来源：`packages/vchart/src/series/sunburst/animation/interface.ts`，VChart 2.1.7

```typescript
export type SunburstAppearPreset = 'growAngle' | 'growRadius' | 'fadeIn';
```

<a id="type-97edc6635996"></a>
## SunburstMark

来源：`packages/vchart/src/series/sunburst/animation/interface.ts`，VChart 2.1.7

```typescript
export type SunburstMark = 'arc' | 'label';
```

<a id="type-42998a239bf0"></a>
## ISunburstSeriesSpec

来源：`packages/vchart/src/series/sunburst/interface.ts`，VChart 2.1.7

```typescript
export interface ISunburstSeriesSpec
  extends Omit<ISeriesSpec, 'data'>,
    IAnimationSpec<SunburstMark, SunburstAppearPreset> {
  type: 'sunburst';

  /**
   * 分类字段
   * @requires
   */
  categoryField: string;

  /**
   * 权重字段
   * @requires
   */
  valueField: string;

  /**
   * 旭日图中心点, x坐标.
   * @default 正中心
   */
  centerX?: number;

  /**
   * 旭日图中心点, y坐标.
   * @default 正中心
   */
  centerY?: number;

  /**
   * 旭日图中心点, x坐标偏移量.
   * @default 0
   */
  offsetX?: number;

  /**
   * 旭日图中心点, y坐标偏移量.
   * @default 0
   */
  offsetY?: number;

  /**
   * 起始角度
   * @default -90
   */
  startAngle?: number;

  /**
   * 终止角度
   * @default startAngle + 360
   */
  endAngle?: number;

  /**
   * 扇区半径
   * @default 0
   * @description 最内层
   */
  innerRadius?: number | number[];

  /**
   * 扇区外半径
   * @default 1
   * @description 最外层
   */
  outerRadius?: number | number[];

  /**
   * 层级间隔
   * @default 0
   * @description 对所有层生效
   */
  gap?: number | number[];

  /**
   * label布局相关参数
   */
  labelLayout?: SunburstLabelConfig | (SunburstLabelConfig | null)[];

  /**
   * 自动隐藏密集标签
   */
  labelAutoVisible?: LabelAutoVisibleType;

  /**
   * 下钻配置
   * @default false
   * @description 下钻功能开关
   */
  drill?: boolean;

  /**
   * 钻取字段的field
   * @default DEFAULT_DATA_KEY
   * @description 通过API进行钻取, 需要此配置项.
   */
  drillField?: string;

  /**
   * 标签配置
   * @description 对所有层生效
   */
  [SeriesMarkNameEnum.label]?: IMarkSpec<ITextMarkSpec>;

  /**
   * 图元配置
   */
  [SeriesMarkNameEnum.sunburst]?: IMarkSpec<IArcMarkSpec>;
}
```

相关定义：[ISeriesSpec](ISeriesSpec-Type-Definition.md)、[IAnimationSpec](AdditionalTypes-Type-Definition.md#type-c2c92c7fb8c3)、[SunburstMark](AdditionalTypes-Type-Definition.md#type-97edc6635996)、[SunburstAppearPreset](AdditionalTypes-Type-Definition.md#type-9821e1ad4f86)、[SunburstLabelConfig](SunburstLabelConfig-Type-Definition.md)、[LabelAutoVisibleType](AdditionalTypes-Type-Definition.md#type-e60547cde037)、[IMarkSpec](IMarkSpec-Type-Definition.md)、[ITextMarkSpec](ITextMarkSpec-Type-Definition.md)、[IArcMarkSpec](IArcMarkSpec-Type-Definition.md)

<a id="type-e60547cde037"></a>
## LabelAutoVisibleType

来源：`packages/vchart/src/series/sunburst/interface.ts`，VChart 2.1.7

```typescript
export type LabelAutoVisibleType = {
  /**
   * 是否启用
   * @default false
   */
  enable?: boolean;

  /**
   * 周长阈值,扇区周长小于该值时, 则隐藏标签.
   * @default 10
   */
  circumference?: number;
};
```

<a id="type-6cdfbc0c0174"></a>
## ITreemapSeriesSpec

来源：`packages/vchart/src/series/treemap/interface.ts`，VChart 2.1.7

```typescript
export interface ITreemapSeriesSpec
  extends Omit<ISeriesSpec, 'data'>,
    IAnimationSpec<TreemapMark, TreemapAppearPreset> {
  type: 'treemap';
  /**
   * 文本字段
   */
  categoryField: string;
  /**
   * 权重字段
   */
  valueField: string;
  /**
   * 数据
   */
  data: IHierarchyData;
  /**
   * 矩形分割比例
   * @default (1 + Math.sqrt(5)) / 2
   */
  aspectRatio?: number;

  /**
   * 矩形分割算法
   * @default 'binary'
   * @description
   * 'binary':    递归地将指定的节点分割成一个近似平衡的二叉树，对宽的矩形选择水平分割，对高的矩形选择垂直分割。
   *
   * 'dice':      根据指定节点的每个子节点的值水平划分由x0, y0, x1, y1指定的矩形区域。子节点按顺序定位，从给定矩形
   *              的左边缘（x0）开始。如果子节点的值之和小于指定节点的值（即，如果指定节点有一个非零的内部值），剩余的空位将被
   *              定位在给定矩形的右边缘（x1）。
   *
   * 'slice':     和'dice'类似，方向为竖直方向分割。
   *
   * 'sliceDice': 节点奇数深度，用'slice'；节点偶数深度，用'dice'。
   *
   * 'squarify':  尽可能按照一个特定长宽比的分割矩形。
   */
  splitType?: TreemapOptions['splitType'];
  /**
   * 节点间距
   * @default 1
   */
  gapWidth?: TreemapOptions['gapWidth'];
  /**
   * 节点内边距
   * @default [5]
   */
  nodePadding?: TreemapOptions['padding'];
  /**
   * 展示的最大层级
   * @description 当节点在层次数据中的深度大于 maxDepth 时，节点将不会被显示
   */
  maxDepth?: TreemapOptions['maxDepth'];
  /**
   * 当区域面积（px * px）小于设定值后，节点将被隐藏
   * @default 10
   */
  minVisibleArea?: TreemapOptions['minVisibleArea'];
  /**
   * 当区域面积（px * px）小于设定值后，节点的子节点将被隐藏
   */
  minChildrenVisibleArea?: TreemapOptions['minChildrenVisibleArea'];
  /**
   * 当区域宽或高（px）小于设定值后，节点的子节点将被隐藏
   */
  minChildrenVisibleSize?: TreemapOptions['minChildrenVisibleSize'];
  /**
   * 是否开启拖拽和缩放
   * @default false
   */
  roam?: boolean;
  /**
   * 下钻配置
   * @default false
   * @description 下钻功能开关
   */
  drill?: boolean;
  /**
   * 钻取字段的field
   * @default DEFAULT_DATA_KEY
   * @description 通过API进行钻取, 需要此配置项.
   */
  drillField?: string;
  /**
   * 叶子节点样式配置
   */
  [SeriesMarkNameEnum.leaf]?: IMarkSpec<IRectMarkSpec>;
  /**
   * 非叶子节点样式配置
   */
  [SeriesMarkNameEnum.nonLeaf]?: IMarkSpec<IRectMarkSpec>;
  /**
   * 叶子节点标签样式配置，默认不显示
   */
  [SeriesMarkNameEnum.label]?: Omit<ILabelSpec, 'position' | 'overlap'>;
  /**
   * 非叶子节点标签样式配置，默认不显示
   */
  [SeriesMarkNameEnum.nonLeafLabel]?: Omit<ILabelSpec, 'position' | 'overlap'> & {
    position?: TreemapOptions['labelPosition'];
    padding?: TreemapOptions['labelPadding'];
  };
}
```

相关定义：[ISeriesSpec](ISeriesSpec-Type-Definition.md)、[IAnimationSpec](AdditionalTypes-Type-Definition.md#type-c2c92c7fb8c3)、[TreemapMark](AdditionalTypes-Type-Definition.md#type-a996892adf6f)、[TreemapAppearPreset](AdditionalTypes-Type-Definition.md#type-24b5502879db)、[IHierarchyData](IHierarchyData-Type-Definition.md)、[TreemapOptions](AdditionalTypes-Type-Definition.md#type-5125620c5489)、[IMarkSpec](IMarkSpec-Type-Definition.md)、[IRectMarkSpec](IRectMarkSpec-Type-Definition.md)、[ILabelSpec](ILabelSpec-Type-Definition.md)

<a id="type-24b5502879db"></a>
## TreemapAppearPreset

来源：`packages/vchart/src/series/treemap/interface.ts`，VChart 2.1.7

```typescript
export type TreemapAppearPreset = 'growIn' | 'fadeIn';
```

<a id="type-a996892adf6f"></a>
## TreemapMark

来源：`packages/vchart/src/series/treemap/interface.ts`，VChart 2.1.7

```typescript
export type TreemapMark = 'leaf' | 'nonLeaf';
```

<a id="type-3b900b97c368"></a>
## IVennSeriesSpec

来源：`packages/vchart/src/series/venn/interface.ts`，VChart 2.1.7

```typescript
export interface IVennSeriesSpec extends ISeriesSpec, IAnimationSpec<VennMark, VennAppearPreset> {
  type: 'venn';
  /**
   * 类别字段
   */
  categoryField?: string;
  /**
   * 权重字段
   */
  valueField: string;

  /**
   * 圆形图元配置
   */
  [SeriesMarkNameEnum.circle]?: IMarkSpec<IArcMarkSpec>;
  /**
   * 重叠部分图元配置
   */
  [SeriesMarkNameEnum.overlap]?: IMarkSpec<IPathMarkSpec>;
  /**
   * 圆形图元标签配置
   */
  [SeriesMarkNameEnum.label]?: Omit<ILabelSpec, 'position'>;
  /**
   * 重叠部分图元标签配置
   */
  [SeriesMarkNameEnum.overlapLabel]?: Omit<ILabelSpec, 'position'>;
}
```

相关定义：[ISeriesSpec](ISeriesSpec-Type-Definition.md)、[IAnimationSpec](AdditionalTypes-Type-Definition.md#type-c2c92c7fb8c3)、[VennMark](AdditionalTypes-Type-Definition.md#type-d1fec4347076)、[VennAppearPreset](AdditionalTypes-Type-Definition.md#type-1a92a41b84da)、[IMarkSpec](IMarkSpec-Type-Definition.md)、[IArcMarkSpec](IArcMarkSpec-Type-Definition.md)、[IPathMarkSpec](IPathMarkSpec-Type-Definition.md)、[ILabelSpec](ILabelSpec-Type-Definition.md)

<a id="type-1a92a41b84da"></a>
## VennAppearPreset

来源：`packages/vchart/src/series/venn/interface.ts`，VChart 2.1.7

```typescript
export type VennAppearPreset = 'growIn' | 'fadeIn' | 'scaleIn';
```

<a id="type-d1fec4347076"></a>
## VennMark

来源：`packages/vchart/src/series/venn/interface.ts`，VChart 2.1.7

```typescript
export type VennMark = 'circle' | 'overlap';
```

<a id="type-312af991e7a8"></a>
## IWaterfallSeriesSpec

来源：`packages/vchart/src/series/waterfall/interface.ts`，VChart 2.1.7

```typescript
export interface IWaterfallSeriesSpec
  extends Omit<IBarSeriesSpec, 'type' | 'label'>,
    IAnimationSpec<WaterfallMarks, WaterfallAppearPreset> {
  /**
   *  系列类型
   */
  type: 'waterfall';
  /**
   * 总计配置
   */
  total?: IWaterfallTotalEnd | IWaterfallTotalField | IWaterfallTotalCustom;
  /**
   * 引导线配置
   */
  [SeriesMarkNameEnum.leaderLine]?: IMarkSpec<IRuleMarkSpec>;
  /**
   * 堆积值标签配置
   */
  [SeriesMarkNameEnum.stackLabel]?: ILabelSpec & {
    /** 标签位置 */
    position?: IWaterfallStackLabelPosition;
    /** 标签偏移量 */
    offset?: number;
    /** 标签值 */
    valueType?: IWaterfallStackLabelValueType;
  };

  totalLabel?: ITotalLabelSpec & {
    /** 标签位置 */
    position?: IWaterfallStackLabelPosition;
    /** 标签偏移量 */
    offset?: number;
    /** 标签值 */
    valueType?: IWaterfallStackLabelValueType;
  };

  /**
   * 标签配置
   */
  [SeriesMarkNameEnum.label]?: ILabelSpec & {
    /** 是否可见 */
    visible: boolean;
    /** 标签位置(支持两端显示 bothEnds) */
    // position?: PositionEnum;
    /** 标签偏移量 */
    offset?: number;
  };

  /**
   * 瀑布图类型
   * 默认为 increase 增长瀑布图
   * @since 2.0.6
   */
  calculationMode?: 'increase' | 'decrease';
}
```

相关定义：[IBarSeriesSpec](AdditionalTypes-Type-Definition.md#type-e01baddbd8aa)、[IAnimationSpec](AdditionalTypes-Type-Definition.md#type-c2c92c7fb8c3)、[WaterfallMarks](AdditionalTypes-Type-Definition.md#type-bb1d273d83e6)、[WaterfallAppearPreset](AdditionalTypes-Type-Definition.md#type-8850f720f897)、[IWaterfallTotalEnd](IWaterfallTotalEnd-Type-Definition.md)、[IWaterfallTotalField](IWaterfallTotalField-Type-Definition.md)、[IWaterfallTotalCustom](IWaterfallTotalCustom-Type-Definition.md)、[IMarkSpec](IMarkSpec-Type-Definition.md)、[IRuleMarkSpec](IRuleMarkSpec-Type-Definition.md)、[ILabelSpec](ILabelSpec-Type-Definition.md)、[IWaterfallStackLabelPosition](AdditionalTypes-Type-Definition.md#type-000580d95d76)、[IWaterfallStackLabelValueType](AdditionalTypes-Type-Definition.md#type-bc167196a113)、[ITotalLabelSpec](ITotalLabelSpec-Type-Definition.md)

<a id="type-000580d95d76"></a>
## IWaterfallStackLabelPosition

来源：`packages/vchart/src/series/waterfall/interface.ts`，VChart 2.1.7

```typescript
export type IWaterfallStackLabelPosition = 'withChange' | 'middle' | 'max' | 'min';
```

<a id="type-bc167196a113"></a>
## IWaterfallStackLabelValueType

来源：`packages/vchart/src/series/waterfall/interface.ts`，VChart 2.1.7

```typescript
export type IWaterfallStackLabelValueType = 'change' | 'absolute';
```

<a id="type-8850f720f897"></a>
## WaterfallAppearPreset

来源：`packages/vchart/src/series/waterfall/interface.ts`，VChart 2.1.7

```typescript
export type WaterfallAppearPreset = BarAppearPreset;
```

相关定义：[BarAppearPreset](AdditionalTypes-Type-Definition.md#type-2a04d7b5d5bc)

<a id="type-bb1d273d83e6"></a>
## WaterfallMarks

来源：`packages/vchart/src/series/waterfall/interface.ts`，VChart 2.1.7

```typescript
type WaterfallMarks = 'bar';
```

<a id="type-545e0cd34c67"></a>
## IWordCloudSeriesBaseSpec

来源：`packages/vchart/src/series/word-cloud/interface.ts`，VChart 2.1.7

```typescript
export interface IWordCloudSeriesBaseSpec
  extends ISeriesSpec,
    IAnimationSpec<SeriesMarkNameEnum.word, WordcloudAppearPreset> {
  /**
   * 文本字段
   */
  nameField: string;
  /**
   * 权重字段
   */
  valueField?: string;
  /**
   * 字体字段
   */
  fontFamilyField?: string;
  /**
   * 字重字段
   */
  fontWeightField?: string;
  /**
   * 字体样式字段
   */
  fontStyleField?: string;
  /**
   * 直接指定 hex 颜色字段
   */
  colorHexField?: string;
  /**
   * 颜色模式
   * TODO: 'linear' 待支持
   */
  colorMode?: 'ordinal';
  /**
   * 颜色列表
   */
  colorList?: string[];
  /**
   * 可旋转角度 随机取范围
   */
  rotateAngles?: number[];
  /**
   * 字重范围
   * @default [200,500]
   */
  fontWeightRange?: [number, number]; // 需要固定字重大小的话，数组里面的数就配置成一样的
  /**
   * 字体大小范围
   * @description 当valueField存在时，默认值[20,40]; 当valueField不存在时，默认值[10, 10]
   * @since 1.8.7 如果配置为'auto', 则fontSizeRange不传入, 字体大小会随画布大小改变而改变
   */
  fontSizeRange?: [number, number] | 'auto'; // 需要固定字体大小的话，数组里面的数就配置成一样的
  /**
   * 词云形状
   * @default 'circle'
   *
   * 注意，文字类型和几何形状类型的shape自 1.12.0 版本开始支持
   */
  maskShape?: string | WordCloudShapeType | TextShapeMask | GeometricMaskShape; // url 或 svg字符串 或 base64，或shape字符串
  /**
   * TODO: 缩放mask时是否保持比例
   */
  keepAspect?: boolean;
  /**
   * 是否开始随机摆放方向(顺时针｜逆时针), 主要用于spec测试
   */
  random?: boolean;
  /**
   * 词云特殊配置
   */
  wordCloudConfig?: WordCloudConfigType;
  /**
   * 形状词云特殊配置
   */
  wordCloudShapeConfig?: WordCloudShapeConfigType;
  /**
   * 词云文字图元配置 或 形状词云核心词文字图元配置
   * @description hover配置随图元state，此外增加padding: 字体间距 和 formatMethod: 文本格式化
   */
  [SeriesMarkNameEnum.word]?: IMarkSpec<ITextMarkSpec> & {
    padding?: number;
    formatMethod?: ITextFormatMethod<[datum?: any]>;
  };
  /**
   * 形状词云填充词文字图元配置
   * @description hover配置随图元state，此外增加padding: 字体间距
   * @description 不增加formatMethod的原因：形状词云在做布局时，word和fillingWord用的是同一份数据，即text相同，所以fillingWords的format不会生效
   * @deprecated
   */
  [SeriesMarkNameEnum.fillingWord]?: IMarkSpec<ITextMarkSpec> & {
    padding?: number;
  };

  /**
   * 当形状词云的形状为文字类型和几何形状类型的时候，支持绘制形状轮廓
   * @since 1.12.0
   */
  [SeriesMarkNameEnum.wordMask]?: IMarkSpec<IRectMarkSpec>;

  animationAppear?:
    | boolean
    | (IStateAnimateSpec<WordcloudAppearPreset> & {
        /**
         * 默认prest('scaleIn')时，duration为词云中单个词的动画参考时长。当单词数过多，会根据单词总数和总动画时长进行动态调整
         * prest为 'fadeIn' 时，则为总动画时长。
         */
        duration?: number;
        /**
         * 词云入场动画总时长，在默认prest('scaleIn')时生效。
         * @default 1000
         * @since 1.4.0
         */
        totalTime?: number;
      })
    | IMarkAnimateSpec<string>;
}
```

相关定义：[ISeriesSpec](ISeriesSpec-Type-Definition.md)、[IAnimationSpec](AdditionalTypes-Type-Definition.md#type-c2c92c7fb8c3)、[SeriesMarkNameEnum.word](AdditionalTypes-Type-Definition.md#type-dcab00960f46)、[WordcloudAppearPreset](AdditionalTypes-Type-Definition.md#type-230d77f59707)、[WordCloudShapeType](WordCloudShapeType-Type-Definition.md)、[TextShapeMask](TextShapeMask-Type-Definition.md)、[GeometricMaskShape](GeometricMaskShape-Type-Definition.md)、[WordCloudConfigType](WordCloudConfigType-Type-Definition.md)、[WordCloudShapeConfigType](WordCloudShapeConfigType-Type-Definition.md)、[IMarkSpec](IMarkSpec-Type-Definition.md)、[ITextMarkSpec](ITextMarkSpec-Type-Definition.md)、[ITextFormatMethod](AdditionalTypes-Type-Definition.md#type-5a8994f84d7b)、[IRectMarkSpec](IRectMarkSpec-Type-Definition.md)、[IStateAnimateSpec](AdditionalTypes-Type-Definition.md#type-c689f8784df3)、[IMarkAnimateSpec](AdditionalTypes-Type-Definition.md#type-f077d8f2c125)

<a id="type-472dc2c97d50"></a>
## IWordCloudSeriesSpec

来源：`packages/vchart/src/series/word-cloud/interface.ts`，VChart 2.1.7

```typescript
export interface IWordCloudSeriesSpec extends IWordCloudSeriesBaseSpec {
  type: 'wordCloud';
}
```

相关定义：[IWordCloudSeriesBaseSpec](AdditionalTypes-Type-Definition.md#type-545e0cd34c67)

<a id="type-230d77f59707"></a>
## WordcloudAppearPreset

来源：`packages/vchart/src/series/word-cloud/interface.ts`，VChart 2.1.7

```typescript
export type WordcloudAppearPreset = 'scaleIn' | 'fadeIn';
```

<a id="type-56ac75a33cd8"></a>
## ColorScheme

来源：`packages/vchart/src/theme/color-scheme/interface.ts`，VChart 2.1.7

```typescript
export type ColorScheme = Array<string> | ProgressiveDataScheme<string> | IColorSchemeStruct;
```

相关定义：[ProgressiveDataScheme](AdditionalTypes-Type-Definition.md#type-d334d5b74366)、[IColorSchemeStruct](AdditionalTypes-Type-Definition.md#type-aaa1ea372a28)

<a id="type-3b07bb001775"></a>
## ColorSchemeItem

来源：`packages/vchart/src/theme/color-scheme/interface.ts`，VChart 2.1.7

```typescript
export type ColorSchemeItem = string | IGradient;
```

相关定义：[IGradient](AdditionalTypes-Type-Definition.md#type-4cdfc5286411)

<a id="type-14c76aab7e3f"></a>
## DataSchemeItem

来源：`packages/vchart/src/theme/color-scheme/interface.ts`，VChart 2.1.7

```typescript
export type DataSchemeItem = string | IColorKey;
```

相关定义：[IColorKey](AdditionalTypes-Type-Definition.md#type-a3c3eb9876a9)

<a id="type-a3c3eb9876a9"></a>
## IColorKey

来源：`packages/vchart/src/theme/color-scheme/interface.ts`，VChart 2.1.7

```typescript
export interface IColorKey {
  /** 颜色type声明 */
  type: 'palette';

  /** 颜色 token */
  key: string;

  /** 明度系数（可选，0~1） */
  l?: number;

  /** 透明度系数（可选，0~1） */
  a?: number;

  /**
   * 默认色值，在没有取到 key 对应的色值时返回
   * @since 1.3.0
   */
  default?: ColorSchemeItem;
}
```

相关定义：[ColorSchemeItem](AdditionalTypes-Type-Definition.md#type-3b07bb001775)

<a id="type-aaa1ea372a28"></a>
## IColorSchemeStruct

来源：`packages/vchart/src/theme/color-scheme/interface.ts`，VChart 2.1.7

```typescript
export type IColorSchemeStruct = {
  /** 数据色板 */
  dataScheme: Array<DataSchemeItem> | ProgressiveDataScheme<DataSchemeItem>;

  /** 语义色板 */
  palette?: {
    /** 主色调（可选） */
    bandColor?: ColorSchemeItem;
    /** 背景颜色（可选） */
    backgroundColor?: ColorSchemeItem;
    /** 其他的语义化色值 */
    [key: string]: ColorSchemeItem;
  };
};
```

相关定义：[DataSchemeItem](AdditionalTypes-Type-Definition.md#type-14c76aab7e3f)、[ProgressiveDataScheme](AdditionalTypes-Type-Definition.md#type-d334d5b74366)、[ColorSchemeItem](AdditionalTypes-Type-Definition.md#type-3b07bb001775)

<a id="type-305e40988a2a"></a>
## IProgressiveDataSchemeCase

来源：`packages/vchart/src/theme/color-scheme/interface.ts`，VChart 2.1.7

```typescript
export interface IProgressiveDataSchemeCase<T> {
  /** 可选，适合此色板的 domain 数量 */
  maxDomainLength?: number;
  /** 可选，自定义回调，返回是否应用此色板，将覆盖 maxDomainLength 等配置 */
  isAvailable?: boolean | IsProgressiveDataSchemeAvailableCallback;
  /** 色板 */
  scheme: T[];
}
```

相关定义：[IsProgressiveDataSchemeAvailableCallback](AdditionalTypes-Type-Definition.md#type-759e0317b6ff)

<a id="type-759e0317b6ff"></a>
## IsProgressiveDataSchemeAvailableCallback

来源：`packages/vchart/src/theme/color-scheme/interface.ts`，VChart 2.1.7

```typescript
export type IsProgressiveDataSchemeAvailableCallback = (domain: any[]) => boolean;
```

<a id="type-45344180023e"></a>
## IThemeColorScheme

来源：`packages/vchart/src/theme/color-scheme/interface.ts`，VChart 2.1.7

```typescript
export type IThemeColorScheme = {
  /** 必选 */
  default: ColorScheme;
} & Partial<Record<SeriesTypeEnum, ColorScheme>> &
  Partial<Record<SeriesTypeForThemeEnum, ColorScheme>>;
```

相关定义：[ColorScheme](AdditionalTypes-Type-Definition.md#type-56ac75a33cd8)、[SeriesTypeEnum](AdditionalTypes-Type-Definition.md#type-11db701f3ba0)、[SeriesTypeForThemeEnum](AdditionalTypes-Type-Definition.md#type-5683fd6b700a)

<a id="type-d334d5b74366"></a>
## ProgressiveDataScheme

来源：`packages/vchart/src/theme/color-scheme/interface.ts`，VChart 2.1.7

```typescript
export type ProgressiveDataScheme<T> = Array<IProgressiveDataSchemeCase<T>>;
```

相关定义：[IProgressiveDataSchemeCase](AdditionalTypes-Type-Definition.md#type-305e40988a2a)

<a id="type-cbbd743bf503"></a>
## ITokenKey

来源：`packages/vchart/src/theme/token/interface.ts`，VChart 2.1.7

```typescript
export interface ITokenKey<T = any> {
  /** type 声明 */
  type: 'token';
  /** token key */
  key: string;
  /** 默认值，在没有取到 key 对应的值时返回 */
  default?: T;
}
```

<a id="type-bf5eb9a79e61"></a>
## Datum

来源：`packages/vchart/src/typings/common.ts`，VChart 2.1.7

```typescript
export type Datum = {
  [key: string]: any;
};
```

<a id="type-644c0bc1509c"></a>
## Maybe

来源：`packages/vchart/src/typings/common.ts`，VChart 2.1.7

```typescript
export type Maybe<T> = T | undefined | null;
```

<a id="type-915c1abd7543"></a>
## MaybeArray

来源：`packages/vchart/src/typings/common.ts`，VChart 2.1.7

```typescript
export type MaybeArray<T> = T | Array<T>;
```

<a id="type-2f92a26f4727"></a>
## StringOrNumber

来源：`packages/vchart/src/typings/common.ts`，VChart 2.1.7

```typescript
export type StringOrNumber = string | number;
```

<a id="type-f14ee29f7b8b"></a>
## CoordinateType

来源：`packages/vchart/src/typings/coordinate.ts`，VChart 2.1.7

```typescript
export type CoordinateType = 'cartesian' | 'polar' | 'geo' | 'none';
```

<a id="type-58fdfd9a6a7b"></a>
## IPoint

来源：`packages/vchart/src/typings/coordinate.ts`，VChart 2.1.7

```typescript
export interface IPoint {
  x: number;
  y: number;
}
```

<a id="type-d403c828183d"></a>
## IPolarPoint

来源：`packages/vchart/src/typings/coordinate.ts`，VChart 2.1.7

```typescript
export interface IPolarPoint {
  radius: number;
  angle: number;
}
```

<a id="type-05ee2579711f"></a>
## Cursor

来源：`packages/vchart/src/typings/cursor.ts`，VChart 2.1.7

```typescript
export type Cursor =
  | 'auto'
  | 'default'
  | 'none'
  | 'context-menu'
  | 'help'
  | 'pointer'
  | 'progress'
  | 'wait'
  | 'cell'
  | 'crosshair'
  | 'text'
  | 'vertical-text'
  | 'alias'
  | 'copy'
  | 'move'
  | 'no-drop'
  | 'not-allowed'
  | 'e-resize'
  | 'n-resize'
  | 'ne-resize'
  | 'nw-resize'
  | 's-resize'
  | 'se-resize'
  | 'sw-resize'
  | 'w-resize'
  | 'ew-resize'
  | 'ns-resize'
  | 'nesw-resize'
  | 'nwse-resize'
  | 'col-resize'
  | 'row-resize'
  | 'all-scroll'
  | 'zoom-in'
  | 'zoom-out'
  | 'grab'
  | 'grabbing';
```

<a id="type-5ea94ba3721c"></a>
## IInvalidType

来源：`packages/vchart/src/typings/data.ts`，VChart 2.1.7

```typescript
export type IInvalidType = 'zero' | 'ignore' | 'link' | 'break';
```

<a id="type-7066ab370b9d"></a>
## IGroup

来源：`packages/vchart/src/typings/group.ts`，VChart 2.1.7

```typescript
export interface IGroup {
  fields?: string[];
  groupData?: DataView;
  initData?: (viewData: DataView, dataSet: DataSet) => void;
  groupDataUpdate?: () => void;
  getGroupValueInField?: (field: string) => any[];
}
```

相关定义：[DataView](AdditionalTypes-Type-Definition.md#type-b26ccd36d8e8)、[DataSet](AdditionalTypes-Type-Definition.md#type-8d2b64638b97)

<a id="type-9638d3997297"></a>
## ILayoutNumber

来源：`packages/vchart/src/typings/layout.ts`，VChart 2.1.7

```typescript
export type ILayoutNumber = number | IPercent | ((layoutRect: ILayoutRect) => number) | IPercentOffset;
```

相关定义：[IPercent](IPercent-Type-Definition.md)、[ILayoutRect](AdditionalTypes-Type-Definition.md#type-b4324e55ab6b)、[IPercentOffset](AdditionalTypes-Type-Definition.md#type-d014dbe57510)

<a id="type-b2bc0ee5203d"></a>
## ILayoutOrientPadding

来源：`packages/vchart/src/typings/layout.ts`，VChart 2.1.7

```typescript
export type ILayoutOrientPadding = {
  /**
   * 左侧边距配置
   */
  left?: ILayoutNumber;
  /**
   * 右侧边距配置
   */
  right?: ILayoutNumber;
  /**
   * 顶部边距配置
   */
  top?: ILayoutNumber;
  /**
   * 底部边距配置
   */
  bottom?: ILayoutNumber;
};
```

相关定义：[ILayoutNumber](AdditionalTypes-Type-Definition.md#type-9638d3997297)

<a id="type-6dd6ef1acef0"></a>
## ILayoutPoint

来源：`packages/vchart/src/typings/layout.ts`，VChart 2.1.7

```typescript
export interface ILayoutPoint {
  x: number;
  y: number;
}
```

<a id="type-b4324e55ab6b"></a>
## ILayoutRect

来源：`packages/vchart/src/typings/layout.ts`，VChart 2.1.7

```typescript
export interface ILayoutRect {
  width: number;
  height: number;
}
```

<a id="type-7ececfbaa390"></a>
## ILayoutType

来源：`packages/vchart/src/typings/layout.ts`，VChart 2.1.7

```typescript
export type ILayoutType =
  | 'region-relative' // 独立占位，不重合
  | 'region-relative-overlap' // 允许重合放置
  | 'region'
  | 'normal'
  | 'absolute'
  | 'normal-inline';
```

<a id="type-d014dbe57510"></a>
## IPercentOffset

来源：`packages/vchart/src/typings/layout.ts`，VChart 2.1.7

```typescript
export type IPercentOffset = {
  /**
   * 百分比值，取值范围为0-1
   */
  percent?: number;
  /**
   * 偏移量，偏移的像素值
   */
  offset?: number;
};
```

<a id="type-a826f89dd07b"></a>
## IRegionQuerier

来源：`packages/vchart/src/typings/params.ts`，VChart 2.1.7

```typescript
export interface IRegionQuerier {
  regionId?: StringOrNumber;
  regionIndex?: number;
}
```

相关定义：[StringOrNumber](AdditionalTypes-Type-Definition.md#type-2f92a26f4727)

<a id="type-b4df769a6b46"></a>
## IShowTooltipOption

来源：`packages/vchart/src/typings/params.ts`，VChart 2.1.7

```typescript
export interface IShowTooltipOption extends IRegionQuerier {
  /* tooltip预期显示的x坐标（为空则在图元附近） */
  x?: number;
  /* tooltip预期显示的y坐标（为空则在图元附近） */
  y?: number;
  /* 是否常显（如果为false或空的话，手动触发tooltip之后，tooltip可能被自动触发的别的tooltip替代） */
  alwaysShow?: boolean;
  /* tooltip类型（为空则自动判断） */
  activeType?: TooltipActiveType;
}
```

相关定义：[IRegionQuerier](AdditionalTypes-Type-Definition.md#type-a826f89dd07b)、[TooltipActiveType](AdditionalTypes-Type-Definition.md#type-990c112f10af)

<a id="type-0eaca977a05a"></a>
## Direction

来源：`packages/vchart/src/typings/space.ts`，VChart 2.1.7

```typescript
export const enum Direction {
  vertical = 'vertical',
  horizontal = 'horizontal'
}
```

<a id="type-244d188586b9"></a>
## DirectionType

来源：`packages/vchart/src/typings/space.ts`，VChart 2.1.7

```typescript
export type DirectionType = keyof typeof Direction;
```

相关定义：[Direction](AdditionalTypes-Type-Definition.md#type-0eaca977a05a)

<a id="type-1c1f18d62ff6"></a>
## IOrientType

来源：`packages/vchart/src/typings/space.ts`，VChart 2.1.7

```typescript
export type IOrientType = 'left' | 'top' | 'right' | 'bottom' | 'z';
```

<a id="type-ccede16adcb5"></a>
## IPolarOrientType

来源：`packages/vchart/src/typings/space.ts`，VChart 2.1.7

```typescript
export type IPolarOrientType = 'radius' | 'angle';
```

<a id="type-51a55b549762"></a>
## IRect

来源：`packages/vchart/src/typings/space.ts`，VChart 2.1.7

```typescript
export interface IRect {
  x: number;
  y: number;
  width: number;
  height: number;
}
```

<a id="type-61e059a17d79"></a>
## ChartSpecMap

来源：`packages/vchart/src/typings/spec/chart.ts`，VChart 2.1.7

```typescript
export interface ChartSpecMap {
  readonly common: ICommonChartSpec;
  readonly area: IAreaChartSpec;
  readonly line: ILineChartSpec;
  readonly bar: IBarChartSpec;
  readonly histogram: IHistogramChartSpec;
  readonly rangeColumn: IRangeColumnChartSpec;
  readonly rangeArea: IRangeAreaChartSpec;
  readonly map: IMapChartSpec;
  readonly pie: IPieChartSpec;
  readonly radar: IRadarChartSpec;
  readonly rose: IRoseChartSpec;
  readonly scatter: IScatterChartSpec;
  readonly sequence: ISequenceChartSpec;
  readonly circleProgress: ICircularProgressChartSpec;
  readonly linearProgress: ILinearProgressChartSpec;
  readonly wordCloud: IWordCloudChartSpec;
  readonly funnel: IFunnelChartSpec;
  readonly waterfall: IWaterfallChartSpec;
  readonly boxplot: IBoxPlotChartSpec;
  readonly gauge: IGaugeChartSpec;
  readonly sankey: ISankeyChartSpec;
  readonly treemap: ITreemapChartSpec;
  readonly sunburst: ISunburstChartSpec;
  readonly circlePacking: ICirclePackingChartSpec;
  readonly heatmap: IHeatmapChartSpec;
  readonly correlation: ICorrelationChartSpec;
  readonly liquid: ILiquidChartSpec;
}
```

相关定义：[ICommonChartSpec](AdditionalTypes-Type-Definition.md#type-2e8825d02f34)、[IAreaChartSpec](AdditionalTypes-Type-Definition.md#type-496aab7cbbc3)、[ILineChartSpec](AdditionalTypes-Type-Definition.md#type-de20dddcc338)、[IBarChartSpec](AdditionalTypes-Type-Definition.md#type-1b991bebaeb5)、[IHistogramChartSpec](AdditionalTypes-Type-Definition.md#type-50577849394e)、[IRangeColumnChartSpec](AdditionalTypes-Type-Definition.md#type-da04864ad35f)、[IRangeAreaChartSpec](AdditionalTypes-Type-Definition.md#type-3a7b7d9563aa)、[IMapChartSpec](AdditionalTypes-Type-Definition.md#type-2cc8eadf4a78)、[IPieChartSpec](AdditionalTypes-Type-Definition.md#type-b89687ec6565)、[IRadarChartSpec](AdditionalTypes-Type-Definition.md#type-63b572eee0ca)、[IRoseChartSpec](AdditionalTypes-Type-Definition.md#type-92bd0cd597bd)、[IScatterChartSpec](AdditionalTypes-Type-Definition.md#type-b4c1e7d7be5c)、[ISequenceChartSpec](AdditionalTypes-Type-Definition.md#type-93ef189ce720)、[ICircularProgressChartSpec](AdditionalTypes-Type-Definition.md#type-162adbb6da6d)、[ILinearProgressChartSpec](AdditionalTypes-Type-Definition.md#type-aa5844c337ee)、[IWordCloudChartSpec](AdditionalTypes-Type-Definition.md#type-5e23d784e4af)、[IFunnelChartSpec](AdditionalTypes-Type-Definition.md#type-87520a24cdd6)、[IWaterfallChartSpec](AdditionalTypes-Type-Definition.md#type-8f8a21509020)、[IBoxPlotChartSpec](AdditionalTypes-Type-Definition.md#type-20eb03e0dbfa)、[IGaugeChartSpec](AdditionalTypes-Type-Definition.md#type-80ddbd318ef0)、[ISankeyChartSpec](AdditionalTypes-Type-Definition.md#type-f326797c9091)、[ITreemapChartSpec](AdditionalTypes-Type-Definition.md#type-f80911626a1e)、[ISunburstChartSpec](AdditionalTypes-Type-Definition.md#type-fa66e1c21317)、[ICirclePackingChartSpec](AdditionalTypes-Type-Definition.md#type-6e93443171dd)、[IHeatmapChartSpec](AdditionalTypes-Type-Definition.md#type-d5e9ad106fbf)、[ICorrelationChartSpec](AdditionalTypes-Type-Definition.md#type-717abb97a652)、[ILiquidChartSpec](AdditionalTypes-Type-Definition.md#type-53e84bdd56cd)

<a id="type-c3727b86f632"></a>
## ISpec

来源：`packages/vchart/src/typings/spec/chart.ts`，VChart 2.1.7

```typescript
export type ISpec = ChartSpecMap[keyof ChartSpecMap] | IChartSpec;
```

相关定义：[ChartSpecMap](AdditionalTypes-Type-Definition.md#type-61e059a17d79)、[IChartSpec](AdditionalTypes-Type-Definition.md#type-57e06d38bf09)

<a id="type-0ad7a402bbdf"></a>
## BuildInTransformOptions

来源：`packages/vchart/src/typings/spec/common.ts`，VChart 2.1.7

```typescript
export type BuildInTransformOptions =
  | {
      /** 地理数据简化 */
      type: 'simplify';
      options: ISimplifyOptions;
    }
  | {
      /** 数据维度处理，包括排序，逆序，数据筛选能力 */
      type: 'fields';
      options: IFieldsOptions;
    }
  | {
      /** 使用回调的自定义筛选 */
      type: 'filter';
      options: IFilterOptions;
    }
  | {
      /** 数据展开 */
      type: 'fold';
      options: IFoldOptions;
    };
```

相关定义：[ISimplifyOptions](AdditionalTypes-Type-Definition.md#type-a4c7726cf624)、[IFieldsOptions](AdditionalTypes-Type-Definition.md#type-26812fc33a0c)、[IFilterOptions](AdditionalTypes-Type-Definition.md#type-aceaf7172c44)、[IFoldOptions](AdditionalTypes-Type-Definition.md#type-46fd81c95ea2)

<a id="type-fdac4230815f"></a>
## CommonParseOptions

来源：`packages/vchart/src/typings/spec/common.ts`，VChart 2.1.7

```typescript
export interface CommonParseOptions {
  /**
   * 是否需要对数据进行 clone，默认为 true。
   * 如果考虑性能，你可以将其关闭，但是这会带了一些副作用，即我们会对传入的数据进行修改（不会对原有字段及值修改，只会在原有数据基础上添加一些字段）。
   * @default true
   * @since 1.3.0
   */
  clone?: boolean;
}
```

<a id="type-4bea0f6c4d4f"></a>
## DataKeyType

来源：`packages/vchart/src/typings/spec/common.ts`，VChart 2.1.7

```typescript
export type DataKeyType = string | string[] | ((data: Datum, index: number) => string);
```

相关定义：[Datum](AdditionalTypes-Type-Definition.md#type-bf5eb9a79e61)

<a id="type-1fa7d0f6abc4"></a>
## EnableMarkType

来源：`packages/vchart/src/typings/spec/common.ts`，VChart 2.1.7

```typescript
export type EnableMarkType = keyof IBuildinMarkSpec;
```

相关定义：[IBuildinMarkSpec](AdditionalTypes-Type-Definition.md#type-1de36c1cfcb0)

<a id="type-1de36c1cfcb0"></a>
## IBuildinMarkSpec

来源：`packages/vchart/src/typings/spec/common.ts`，VChart 2.1.7

```typescript
export type IBuildinMarkSpec = {
  group: IGroupMarkSpec;
  symbol: ISymbolMarkSpec;
  rule: IRuleMarkSpec;
  line: ILineMarkSpec;
  text: ITextMarkSpec;
  rect: IRectMarkSpec;
  image: IImageMarkSpec;
  path: IPathMarkSpec;
  area: IAreaMarkSpec;
  arc: IArcMarkSpec;
  polygon: IPolygonMarkSpec;
  boxPlot: IBoxPlotMarkSpec;
  linkPath: ILinkPathMarkSpec;
  ripple: IRippleMarkSpec;
};
```

相关定义：[IGroupMarkSpec](IGroupMarkSpec-Type-Definition.md)、[ISymbolMarkSpec](ISymbolMarkSpec-Type-Definition.md)、[IRuleMarkSpec](IRuleMarkSpec-Type-Definition.md)、[ILineMarkSpec](ILineMarkSpec-Type-Definition.md)、[ITextMarkSpec](ITextMarkSpec-Type-Definition.md)、[IRectMarkSpec](IRectMarkSpec-Type-Definition.md)、[IImageMarkSpec](IImageMarkSpec-Type-Definition.md)、[IPathMarkSpec](IPathMarkSpec-Type-Definition.md)、[IAreaMarkSpec](IAreaMarkSpec-Type-Definition.md)、[IArcMarkSpec](IArcMarkSpec-Type-Definition.md)、[IPolygonMarkSpec](IPolygonMarkSpec-Type-Definition.md)、[IBoxPlotMarkSpec](IBoxPlotMarkSpec-Type-Definition.md)、[ILinkPathMarkSpec](ILinkPathMarkSpec-Type-Definition.md)、[IRippleMarkSpec](IRippleMarkSpec-Type-Definition.md)

<a id="type-0d38580aaf51"></a>
## IChartExtendsSeriesSpec

来源：`packages/vchart/src/typings/spec/common.ts`，VChart 2.1.7

```typescript
export type IChartExtendsSeriesSpec<T extends ISeriesSpec> = Omit<T, 'data' | 'morph' | 'stackValue' | 'tooltip'>;
```

相关定义：[ISeriesSpec](ISeriesSpec-Type-Definition.md)

<a id="type-57e06d38bf09"></a>
## IChartSpec

来源：`packages/vchart/src/typings/spec/common.ts`，VChart 2.1.7

```typescript
export interface IChartSpec {
  /** 图表类型 */
  type: string;
  /** 数据 */
  data?: IData;
  /** 画布宽度 */
  width?: number;
  /** 画布高度 */
  height?: number;
  /**
   * 图表宽高是否自适应容器，浏览器环境下默认为 true。
   * 该配置的优先级高于构造函数中的 autoFit 配置。
   * 如果用户配置了 width，则以用户配置的 width 为准，height 同理。
   */
  autoFit?: boolean;
  /**
   * 图表整体 padding 设置
   */
  padding?: ILayoutPaddingSpec;
  /**
   * 图表色系配置
   */
  color?: string[] | Omit<IVisualSpecScale<unknown, string>, 'id'>;
  /**
   * 系列
   * @description 仅在组合图中使用, 文档中除组合图外均未透出该配置
   */
  series?: ISeriesSpec[];
  /**
   * 系列样式
   * @description 仅在图表配置了seriesField时生效
   */
  seriesStyle?: ISeriesStyle;

  /**
   * 自动关闭动画的阀值，对应的是单系列data的长度
   * @since 1.2.0
   */
  animationThreshold?: number;

  /** hover 交互 */
  hover?: boolean | IHoverSpec;
  /** select 交互 */
  select?: boolean | ISelectSpec;

  /** region配置 */
  region?: RegionSpec[];
  /** 图表标题配置 */
  title?: ITitleSpec;
  /** 布局配置 */
  layout?: ILayoutSpec;
  /** 图例配置 */
  legends?: ILegendSpec | ILegendSpec[];
  /** 十字辅助线配置 */
  crosshair?: ICrosshairSpec | ICrosshairSpec[];
  /** tooltip配置 */
  tooltip?: ITooltipSpec;
  /** 播放器配置 */
  player?: IPlayer;
  /** 缩略轴配置 */
  dataZoom?: IDataZoomSpec | IDataZoomSpec[];
  /** 滚动条配置 */
  scrollBar?: IScrollBarSpec | IScrollBarSpec[];
  /** 框选配置 */
  brush?: IBrushSpec;
  /** 全局 scale 配置 */
  scales?: IVisualSpecScale<unknown, unknown>[];
  /** 自定义mark */
  customMark?: ICustomMarkSpec<EnableMarkType>[];
  /** 轴 */
  axes?: ICommonAxisSpec[];
  /**
   * 图表上的主题定义。
   * 可以直接配置主题名，前提是该主题名已经注册
   */
  theme?: Omit<ITheme, 'name'> | string;
  /**
   * 图表背景色配置，优先级高于构造函数中的 background 配置
   * 自1.11.6版本支持渐变色对象的配置
   */
  background?: IBackgroundSpec;

  // TODO：后续开放，现在仍有问题
  // poptip?: PopTipAttributes;
  // TODO: 补充动画配置

  /**
   * 堆积时是否逆序
   * @default false
   * @since 1.4.0
   */
  stackInverse?: boolean;
  /**
   * 堆积时是否排序
   * @default false
   * @since 1.10.4
   */
  stackSort?: boolean;
  /**
   * 媒体查询配置
   * @since 1.8.0
   */
  media?: IMediaQuerySpec;
}
```

相关定义：[IData](IData-Type-Definition.md)、[ILayoutPaddingSpec](ILayoutPaddingSpec-Type-Definition.md)、[IVisualSpecScale](IVisualSpecScale-Type-Definition.md)、[ISeriesSpec](ISeriesSpec-Type-Definition.md)、[ISeriesStyle](ISeriesStyle-Type-Definition.md)、[IHoverSpec](IHoverSpec-Type-Definition.md)、[ISelectSpec](ISelectSpec-Type-Definition.md)、[RegionSpec](RegionSpec-Type-Definition.md)、[ITitleSpec](ITitleSpec-Type-Definition.md)、[ILayoutSpec](ILayoutSpec-Type-Definition.md)、[ILegendSpec](ILegendSpec-Type-Definition.md)、[ICrosshairSpec](AdditionalTypes-Type-Definition.md#type-2c1a18c2e6b2)、[ITooltipSpec](ITooltipSpec-Type-Definition.md)、[IPlayer](IPlayer-Type-Definition.md)、[IDataZoomSpec](IDataZoomSpec-Type-Definition.md)、[IScrollBarSpec](IScrollBarSpec-Type-Definition.md)、[IBrushSpec](IBrushSpec-Type-Definition.md)、[ICustomMarkSpec](ICustomMarkSpec-Type-Definition.md)、[EnableMarkType](AdditionalTypes-Type-Definition.md#type-1fa7d0f6abc4)、[ICommonAxisSpec](AdditionalTypes-Type-Definition.md#type-500cf18886a4)、[ITheme](ITheme-Type-Definition.md)、[IBackgroundSpec](IBackgroundSpec-Type-Definition.md)、[IMediaQuerySpec](IMediaQuerySpec-Type-Definition.md)

<a id="type-3bf45e5ed347"></a>
## IDataType

来源：`packages/vchart/src/typings/spec/common.ts`，VChart 2.1.7

```typescript
export type IDataType = IDataValues | DataView;
```

相关定义：[IDataValues](AdditionalTypes-Type-Definition.md#type-218b08963b1d)、[DataView](AdditionalTypes-Type-Definition.md#type-b26ccd36d8e8)

<a id="type-218b08963b1d"></a>
## IDataValues

来源：`packages/vchart/src/typings/spec/common.ts`，VChart 2.1.7

```typescript
export interface IDataValues {
  /**
   * 数据唯一标识
   */
  id?: StringOrNumber;
  /**
   * 数据
   */
  values: Datum[] | string;
  /**
   * 引用的数据索引
   */
  fromDataIndex?: number;
  /**
   * 引用的数据 id
   */
  fromDataId?: StringOrNumber;
  /**
   * 数据 transform 配置
   */
  transforms?: BuildInTransformOptions[];
  /**
   * 数据字段相关配置
   */
  fields?: Record<
    /** 字段key */
    string,
    IFieldsMeta
  >;
  /**
   * 数据解析器配置
   */
  parser?: SheetParseOptions | CommonParseOptions;
}
```

相关定义：[StringOrNumber](AdditionalTypes-Type-Definition.md#type-2f92a26f4727)、[Datum](AdditionalTypes-Type-Definition.md#type-bf5eb9a79e61)、[BuildInTransformOptions](AdditionalTypes-Type-Definition.md#type-0ad7a402bbdf)、[IFieldsMeta](AdditionalTypes-Type-Definition.md#type-ad6958bb1a0b)、[SheetParseOptions](AdditionalTypes-Type-Definition.md#type-dbdce91761d0)、[CommonParseOptions](AdditionalTypes-Type-Definition.md#type-fdac4230815f)

<a id="type-ad6958bb1a0b"></a>
## IFieldsMeta

来源：`packages/vchart/src/typings/spec/common.ts`，VChart 2.1.7

```typescript
export interface IFieldsMeta {
  /** TODO: 字段通用format, 暂时先不支持 */
  // format?: (datum: Datum, index: number) => unknown;
  /**
   * 字段别名
   */
  alias?: string;
  /** 字段取值范围 */
  domain?: StringOrNumber[];
  /**
   * 是否使用 domain 锁定统计信息。默认为 false
   * true - 在图例交互场景，也固定domain
   * 当设置为 `onlyFull` 时，仅在初始化的展示完整数据的场景锁定domain，在交互触发的筛选场景不锁定
   */
  lockStatisticsByDomain?: boolean | 'onlyFull';
  /** 连续型 还是 离散型 */
  type?: 'ordinal' | 'linear';
  /** 排序顺序 不设置的话当前维度不进行排序 */
  sortIndex?: number;
  /** 排序时是否反转 默认为 false */
  sortReverse?: boolean;
  /**
   * 排序简易配置
   * 当配置了 sort 时，sortIndex 默认为 0 ，sortReverse 跟随 sort 的值，'desc' 时为 true，'asc' 时为 false
   * 当配置了 sortIndex 和 sortReverser 时，优先级会高于 sort 的默认效果
   * @support since 2.0.0
   */
  sort?: 'desc' | 'asc';
}
```

相关定义：[StringOrNumber](AdditionalTypes-Type-Definition.md#type-2f92a26f4727)

<a id="type-6375b3333257"></a>
## IFormatMethod

来源：`packages/vchart/src/typings/spec/common.ts`，VChart 2.1.7

```typescript
export type IFormatMethod<T extends any[]> = (
  ...args: T
) => ReturnType<ITextFormatMethod<T>> | ReturnType<IRichTextFormatMethod<T>>;
```

相关定义：[ITextFormatMethod](AdditionalTypes-Type-Definition.md#type-5a8994f84d7b)、[IRichTextFormatMethod](AdditionalTypes-Type-Definition.md#type-3b28c6257cf4)

<a id="type-493dcf0721cf"></a>
## IMarkStateFilter

来源：`packages/vchart/src/typings/spec/common.ts`，VChart 2.1.7

```typescript
export type IMarkStateFilter =
  | {
      /** 维度筛选 */
      fields: { [key in string]: { type: 'ordinal' | 'linear'; domain: StringOrNumber[] } };
    }
  | {
      /** 筛选数据 */
      datums: Datum[];
      /** 筛选数据 */
      datumKeys: string[];
    }
  | {
      /** 筛选 item */
      items: IGraphic[];
    }
  /** 筛选函数 */
  | ((
      datum: Datum,
      options: {
        mark?: IMark;
        type?: string;
        renderNode?: IGraphic;
      }
    ) => boolean);
```

相关定义：[StringOrNumber](AdditionalTypes-Type-Definition.md#type-2f92a26f4727)、[Datum](AdditionalTypes-Type-Definition.md#type-bf5eb9a79e61)、[IGraphic](AdditionalTypes-Type-Definition.md#type-a766bc91cce3)、[IMark](AdditionalTypes-Type-Definition.md#type-50aedeb586cf)

<a id="type-4d46c5681360"></a>
## IMarkStateSpec

来源：`packages/vchart/src/typings/spec/common.ts`，VChart 2.1.7

```typescript
export interface IMarkStateSpec<T> {
  /** 筛选器 */
  filter?: IMarkStateFilter;
  /** 状态优先级 */
  level?: number | undefined;
  style: ConvertToMarkStyleSpec<T>;
}
```

相关定义：[IMarkStateFilter](AdditionalTypes-Type-Definition.md#type-493dcf0721cf)、[ConvertToMarkStyleSpec](AdditionalTypes-Type-Definition.md#type-3f4d44a2bad5)

<a id="type-095e16af33ef"></a>
## IPerformanceHook

来源：`packages/vchart/src/typings/spec/common.ts`，VChart 2.1.7

```typescript
export interface IPerformanceHook {
  // constructor
  // 创建完成。在使用 vstory 的场景下，图表实例不由业务创建，业务想要获取图表时机非常靠后，因此补充一个钩子
  afterCreateVChart?: (vchart?: IVChart) => void;

  // InitRender
  //   ├── InitializeChart
  //   ├── CompileToVGrammar
  //   ├── ParseView
  //   |  └── ParseExpression
  //   ├── (new View)
  //   |  ├── CreateRuntime
  //   |  └── (view.initialize)
  //   |     └── CreateVRenderStage
  //   └── SrViewEvaluateAsync / SrViewRunAsync
  //      ├── MarkTransform
  //      ├── FacetTransform
  //      ├── CreateVRenderMark
  //      └── VRenderDraw

  // 初始化图表配置
  beforeInitializeChart?: (vchart?: IVChart) => void;
  afterInitializeChart?: (vchart?: IVChart) => void;

  // 编译
  beforeCompileToVGrammar?: (vchart?: IVChart) => void;
  afterCompileToVGrammar?: (vchart?: IVChart) => void;
  // 各个图表模块编译
  beforeRegionCompile?: (vchart?: IVChart) => void;
  afterRegionCompile?: (vchart?: IVChart) => void;
  beforeSeriesCompile?: (vchart?: IVChart) => void;
  afterSeriesCompile?: (vchart?: IVChart) => void;
  beforeComponentCompile?: (vchart?: IVChart) => void;
  afterComponentCompile?: (vchart?: IVChart) => void;

  // resize的时候的钩子
  beforeResizeWithUpdate?: (vchart?: IVChart) => void;
  afterResizeWithUpdate?: (vchart?: IVChart) => void;

  // LayoutWithSceneGraph 二次布局
  beforeLayoutWithSceneGraph?: (vchart?: IVChart) => void;
  afterLayoutWithSceneGraph?: (vchart?: IVChart) => void;

  // VGrammar 解析spec
  beforeParseView?: (vchart?: IVChart) => void;
  afterParseView?: (vchart?: IVChart) => void;

  // 初始化runtime
  beforeCreateRuntime?: (vchart?: IVChart) => void;
  afterCreateRuntime?: (vchart?: IVChart) => void;

  // VGrammar EvaluateAsync 时间
  beforeSrViewEvaluateAsync?: (vchart?: IVChart) => void;
  afterSrViewEvaluateAsync?: (vchart?: IVChart) => void;

  // VGrammar RunAsync 时间
  beforeSrViewRunAsync?: (vchart?: IVChart) => void;
  afterSrViewRunAsync?: (vchart?: IVChart) => void;

  // transform测量
  beforeTransform?: (name: string, vchart?: IVChart) => void;
  afterTransform?: (name: string, vchart?: IVChart) => void;

  // Create VRender Stage 时间
  beforeCreateVRenderStage?: (vchart?: IVChart) => void;
  afterCreateVRenderStage?: (vchart?: IVChart) => void;

  // Create VRender Mark 时间
  beforeCreateVRenderMark?: (vchart?: IVChart) => void;
  afterCreateVRenderMark?: (vchart?: IVChart) => void;

  // VGrammar 创建元素完成，vrender 绘图之前
  beforeDoRender?: (vchart?: IVChart) => void;

  // VRender Draw 时间
  beforeVRenderDraw?: (vchart?: IVChart) => void;
  afterVRenderDraw?: (vchart?: IVChart) => void;

  // 词云
  afterWordcloudShapeDraw?: (vchart?: IVChart) => void;
}
```

相关定义：[IVChart](AdditionalTypes-Type-Definition.md#type-f6dc633e5201)

<a id="type-3b28c6257cf4"></a>
## IRichTextFormatMethod

来源：`packages/vchart/src/typings/spec/common.ts`，VChart 2.1.7

```typescript
export type IRichTextFormatMethod<T extends any[]> = (...args: T) =>
  | {
      /**
       * 设置文本类型为富文本
       */
      type: 'rich';
      /**
       * 当文本类型为富文本的时候，设置文本的内容
       */
      text: IRichTextCharacter[];
    }
  | IRichTextCharacter[];
```

相关定义：[IRichTextCharacter](AdditionalTypes-Type-Definition.md#type-a486d6a175fe)

<a id="type-5a8994f84d7b"></a>
## ITextFormatMethod

来源：`packages/vchart/src/typings/spec/common.ts`，VChart 2.1.7

```typescript
export type ITextFormatMethod<T extends any[]> = (
  ...args: T
) => ITextMarkSpec['text'] | { type: 'text'; text: ITextMarkSpec['text'] };
```

相关定义：[ITextMarkSpec](ITextMarkSpec-Type-Definition.md)

<a id="type-875ef0d8fcf4"></a>
## RenderMode

来源：`packages/vchart/src/typings/spec/common.ts`，VChart 2.1.7

```typescript
export type RenderMode = keyof typeof RenderModeEnum;
```

相关定义：[RenderModeEnum](AdditionalTypes-Type-Definition.md#type-240f8a4ed23c)

<a id="type-240f8a4ed23c"></a>
## RenderModeEnum

来源：`packages/vchart/src/typings/spec/common.ts`，VChart 2.1.7

```typescript
export enum RenderModeEnum {
  'desktop-browser' = 'desktop-browser',
  'mobile-browser' = 'mobile-browser',
  'node' = 'node',
  'worker' = 'worker',
  'miniApp' = 'miniApp',
  'wx' = 'wx',
  'tt' = 'tt',
  'harmony' = 'harmony',
  'desktop-miniApp' = 'desktop-miniApp',
  'lynx' = 'lynx'
}
```

<a id="type-dbdce91761d0"></a>
## SheetParseOptions

来源：`packages/vchart/src/typings/spec/common.ts`，VChart 2.1.7

```typescript
export interface SheetParseOptions extends CommonParseOptions {
  /**
   * 特定类型的数据，支持以下类型：
   * - csv: 逗号分隔值（Comma-Separated Values，CSV，有时也称为字符分隔值，因为分隔字符也可以不是逗号），其文件以纯文本形式存储表格数据（数字和文本）。
   * - dsv: 分隔值（Delimiter-Separated Values，DSV，有时也称为字符分隔值，因为分隔字符也可以不是逗号），其文件以纯文本形式存储表格数据（数字和文本）。
   * - tsv: 制表符分隔值（Tab-Separated Values，TSV，有时也称为字符分隔值，因为分隔字符也可以不是逗号），其文件以纯文本形式存储表格数据（数字和文本）。
   */
  type: 'csv' | 'dsv' | 'tsv';
  /**
   * 具体的解析配置
   */
  options?: IDsvParserOptions;
}
```

相关定义：[CommonParseOptions](AdditionalTypes-Type-Definition.md#type-fdac4230815f)、[IDsvParserOptions](AdditionalTypes-Type-Definition.md#type-a39097639f44)

<a id="type-bb854deb9020"></a>
## TooltipContentCallback

来源：`packages/vchart/src/typings/tooltip/common.ts`，VChart 2.1.7

```typescript
export type TooltipContentCallback<T> = (datum?: Datum, params?: TooltipHandlerParams) => T | undefined;
```

相关定义：[Datum](AdditionalTypes-Type-Definition.md#type-bf5eb9a79e61)、[TooltipHandlerParams](AdditionalTypes-Type-Definition.md#type-82517d84c2af)

<a id="type-58900beb05b3"></a>
## TooltipUpdateCallback

来源：`packages/vchart/src/typings/tooltip/common.ts`，VChart 2.1.7

```typescript
export type TooltipUpdateCallback<T> = (
  prev: T | undefined,
  data?: TooltipData,
  params?: TooltipHandlerParams
) => T | undefined;
```

相关定义：[TooltipData](AdditionalTypes-Type-Definition.md#type-2020c8fc6cbe)、[TooltipHandlerParams](AdditionalTypes-Type-Definition.md#type-82517d84c2af)

<a id="type-73b5fb837aea"></a>
## ITooltipHandler

来源：`packages/vchart/src/typings/tooltip/handler.ts`，VChart 2.1.7

```typescript
export interface ITooltipHandler extends ITooltipHandlerSpec {
  /** 可选，获取 tooltip 所在容器 */
  getTooltipContainer?: () => any;
  /** 可选，更新 tooltip spec 或主题后执行的回调 */
  reInit?: () => any;
  /** dom tooltip 支持改api */
  getRootDom?: () => any;
}
```

相关定义：[ITooltipHandlerSpec](AdditionalTypes-Type-Definition.md#type-9ead2353606b)

<a id="type-990c112f10af"></a>
## TooltipActiveType

来源：`packages/vchart/src/typings/tooltip/handler.ts`，VChart 2.1.7

```typescript
export type TooltipActiveType = 'mark' | 'dimension' | 'group';
```

<a id="type-2020c8fc6cbe"></a>
## TooltipData

来源：`packages/vchart/src/typings/tooltip/handler.ts`，VChart 2.1.7

```typescript
export type TooltipData = IDimensionInfo[] | IDimensionData[];
```

相关定义：[IDimensionInfo](AdditionalTypes-Type-Definition.md#type-06b8a10af7b9)、[IDimensionData](AdditionalTypes-Type-Definition.md#type-5b72dbd75644)

<a id="type-c308b976acfb"></a>
## ITooltipLabelActual

来源：`packages/vchart/src/typings/tooltip/label.ts`，VChart 2.1.7

```typescript
export interface ITooltipLabelActual {
  keyStyle?: ITooltipTextTheme;
  valueStyle?: ITooltipTextTheme;
}
```

相关定义：[ITooltipTextTheme](AdditionalTypes-Type-Definition.md#type-6f8c16b9dce7)

<a id="type-50e4fd39a41a"></a>
## ITooltipLineActual

来源：`packages/vchart/src/typings/tooltip/line.ts`，VChart 2.1.7

```typescript
export interface ITooltipLineActual extends ITooltipShapeActual, ITooltipLabelActual {
  /**
   * tooltip key 值内容
   */
  key?: string;
  /**
   * tooltip value 值内容
   */
  value?: string | TooltipRichTextAttrs;
  /**
   * tooltip value 的格式化模板
   */
  valueFormatter?: string;
  /**
   * 该行是否可见
   */
  visible?: boolean;
  /**
   * key 列是否适应内容
   */
  isKeyAdaptive?: boolean;
  /**
   * 该行行间距
   * @since 1.4.0
   */
  spaceRow?: number;
  /**
   * 该行对应的原始数据
   * @since 1.5.1
   */
  datum?: any;
}
```

相关定义：[ITooltipShapeActual](AdditionalTypes-Type-Definition.md#type-641241d7a7b9)、[ITooltipLabelActual](AdditionalTypes-Type-Definition.md#type-c308b976acfb)、[TooltipRichTextAttrs](AdditionalTypes-Type-Definition.md#type-3b54c645e6d7)

<a id="type-b07cdb853d88"></a>
## ITooltipPositionActual

来源：`packages/vchart/src/typings/tooltip/position.ts`，VChart 2.1.7

```typescript
export interface ITooltipPositionActual {
  x: number;
  y: number;
}
```

<a id="type-641241d7a7b9"></a>
## ITooltipShapeActual

来源：`packages/vchart/src/typings/tooltip/shape.ts`，VChart 2.1.7

```typescript
export interface ITooltipShapeActual {
  /**
   * 是否显示图形
   */
  hasShape?: boolean;
  /**
   * 图形的类型
   */
  shapeType?: ShapeType | string;
  /**
   * 形状填充颜色
   * @since 1.4.0
   */
  shapeFill?: string;
  /**
   * 形状描边颜色
   * @since 1.4.0
   */
  shapeStroke?: string;
  /**
   * 形状描边宽度
   * @since 1.4.0
   */
  shapeLineWidth?: number;
  /**
   * 图形的大小
   */
  shapeSize?: number;
  /**
   * 形状是否空心
   */
  shapeHollow?: boolean;
}
```

相关定义：[ShapeType](ShapeType-Type-Definition.md)

<a id="type-b6803f56a729"></a>
## ITooltipActual

来源：`packages/vchart/src/typings/tooltip/tooltip.ts`，VChart 2.1.7

```typescript
export interface ITooltipActual {
  visible?: boolean;
  title?: ITooltipLineActual;
  content?: ITooltipLineActual[];
  activeType?: TooltipActiveType;
  position?: ITooltipPositionActual;
  data?: TooltipData;
  handler?: Partial<ITooltipHandlerSpec>;
  maxLineCount?: number;
  updateTitle?: TooltipUpdateCallback<ITooltipLineActual>;
  updateContent?: TooltipUpdateCallback<ITooltipLineActual[]>;
  updatePosition?: TooltipUpdateCallback<ITooltipPositionActual>;
  othersLine?: ITooltipLineActual;
}
```

相关定义：[ITooltipLineActual](AdditionalTypes-Type-Definition.md#type-50e4fd39a41a)、[TooltipActiveType](AdditionalTypes-Type-Definition.md#type-990c112f10af)、[ITooltipPositionActual](AdditionalTypes-Type-Definition.md#type-b07cdb853d88)、[TooltipData](AdditionalTypes-Type-Definition.md#type-2020c8fc6cbe)、[ITooltipHandlerSpec](AdditionalTypes-Type-Definition.md#type-9ead2353606b)、[TooltipUpdateCallback](AdditionalTypes-Type-Definition.md#type-58900beb05b3)

<a id="type-335140a3e2b6"></a>
## BackgroundMode

来源：`packages/vchart/src/typings/visual.ts`，VChart 2.1.7

```typescript
export type BackgroundMode = BackgroundRepeatMode | BackgroundSizingShorthand;
```

相关定义：[BackgroundRepeatMode](AdditionalTypes-Type-Definition.md#type-6fb8f4404334)、[BackgroundSizingShorthand](AdditionalTypes-Type-Definition.md#type-f5dcfb5b7d65)

<a id="type-79f8ce85abb1"></a>
## BackgroundPosition

来源：`packages/vchart/src/typings/visual.ts`，VChart 2.1.7

```typescript
export type BackgroundPosition =
  | BackgroundPositionKeyword
  | BackgroundPositionPreset
  | [BackgroundPositionValue, BackgroundPositionValue];
```

相关定义：[BackgroundPositionKeyword](AdditionalTypes-Type-Definition.md#type-d7d952da248e)、[BackgroundPositionPreset](AdditionalTypes-Type-Definition.md#type-9b6ac71cd590)、[BackgroundPositionValue](AdditionalTypes-Type-Definition.md#type-da20797f386c)

<a id="type-31dac926518d"></a>
## BackgroundPositionHorizontalKeyword

来源：`packages/vchart/src/typings/visual.ts`，VChart 2.1.7

```typescript
export type BackgroundPositionHorizontalKeyword = 'left' | 'center' | 'right';
```

<a id="type-d7d952da248e"></a>
## BackgroundPositionKeyword

来源：`packages/vchart/src/typings/visual.ts`，VChart 2.1.7

```typescript
export type BackgroundPositionKeyword = BackgroundPositionHorizontalKeyword | BackgroundPositionVerticalKeyword;
```

相关定义：[BackgroundPositionHorizontalKeyword](AdditionalTypes-Type-Definition.md#type-31dac926518d)、[BackgroundPositionVerticalKeyword](AdditionalTypes-Type-Definition.md#type-1c3d2aa1fdc1)

<a id="type-81363cd19fe5"></a>
## BackgroundPositionPercent

来源：`packages/vchart/src/typings/visual.ts`，VChart 2.1.7

```typescript
export type BackgroundPositionPercent = `${number}%`;
```

<a id="type-9b6ac71cd590"></a>
## BackgroundPositionPreset

来源：`packages/vchart/src/typings/visual.ts`，VChart 2.1.7

```typescript
export type BackgroundPositionPreset =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';
```

<a id="type-da20797f386c"></a>
## BackgroundPositionValue

来源：`packages/vchart/src/typings/visual.ts`，VChart 2.1.7

```typescript
export type BackgroundPositionValue = number | BackgroundPositionKeyword | BackgroundPositionPercent;
```

相关定义：[BackgroundPositionKeyword](AdditionalTypes-Type-Definition.md#type-d7d952da248e)、[BackgroundPositionPercent](AdditionalTypes-Type-Definition.md#type-81363cd19fe5)

<a id="type-1c3d2aa1fdc1"></a>
## BackgroundPositionVerticalKeyword

来源：`packages/vchart/src/typings/visual.ts`，VChart 2.1.7

```typescript
export type BackgroundPositionVerticalKeyword = 'top' | 'center' | 'bottom';
```

<a id="type-6fb8f4404334"></a>
## BackgroundRepeatMode

来源：`packages/vchart/src/typings/visual.ts`，VChart 2.1.7

```typescript
export type BackgroundRepeatMode = 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat';
```

<a id="type-f5dcfb5b7d65"></a>
## BackgroundSizingShorthand

来源：`packages/vchart/src/typings/visual.ts`，VChart 2.1.7

```typescript
export type BackgroundSizingShorthand = 'no-repeat-cover' | 'no-repeat-contain' | 'no-repeat-fill' | 'no-repeat-auto';
```

<a id="type-3f4d44a2bad5"></a>
## ConvertToMarkStyleSpec

来源：`packages/vchart/src/typings/visual.ts`，VChart 2.1.7

```typescript
export type ConvertToMarkStyleSpec<T extends Record<string, any>> = {
  [key in keyof T]: VisualType<T[key]>;
};
```

相关定义：[VisualType](AdditionalTypes-Type-Definition.md#type-e295ec9bce6b)

<a id="type-b9b2288b01f6"></a>
## GradientPropValue

来源：`packages/vchart/src/typings/visual.ts`，VChart 2.1.7

```typescript
export type GradientPropValue<T> = ValueType<T> | FunctionType<T>;
```

相关定义：[ValueType](AdditionalTypes-Type-Definition.md#type-979efd9d6b47)、[FunctionType](FunctionType-Type-Definition.md)

<a id="type-105bc3b38706"></a>
## GradientStop

来源：`packages/vchart/src/typings/visual.ts`，VChart 2.1.7

```typescript
export type GradientStop = {
  /**
   * 渐变色的偏移量，0-1的值
   */
  offset: GradientPropValue<number>;
  /**
   * 渐变色的颜色
   */
  color?: GradientPropValue<string>;
  /**
   * 渐变色的透明度
   */
  opacity?: number;
};
```

相关定义：[GradientPropValue](AdditionalTypes-Type-Definition.md#type-b9b2288b01f6)

<a id="type-c857646a1dda"></a>
## IBorder

来源：`packages/vchart/src/typings/visual.ts`，VChart 2.1.7

```typescript
export interface IBorder {
  /**
   * 边框离图形边缘的距离
   */
  distance: number | string;
  /**
   * 边框的颜色
   */
  stroke?: string | IGradient;
  /**
   * 边框的透明度
   */
  strokeOpacity?: number;
  /**
   * 边框线的宽度
   */
  lineWidth?: number;
  /**
   * 给边框配置虚线模式。它使用一组值来指定描述模式的线和间隙的交替长度
   */
  lineDash?: number[];
  /**
   * 设置边框的虚线偏移量
   */
  lineDashOffset?: number;
}
```

相关定义：[IGradient](AdditionalTypes-Type-Definition.md#type-4cdfc5286411)

<a id="type-642c420237a7"></a>
## ICommonSpec

来源：`packages/vchart/src/typings/visual.ts`，VChart 2.1.7

```typescript
export interface ICommonSpec {
  /**
   * 图形是否可见
   */
  visible?: boolean;
  /**
   * 图形的x坐标
   */
  x?: number;
  /**
   * 图形的y坐标
   */
  y?: number;
  /**
   * 图形的z坐标，仅适用于3D图表
   */
  z?: number;
  /**
   * 图形的描边颜色。
   * 支持使用 'rgb(255,255,255)'，'rgba(255,255,255,1)'，'#fff' 等方式设置为纯色，也支持设置为渐变色描边
   * @todo 隔离主题和 spec 配置
   * IColorKey 类型只适用于主题
   */
  stroke?: string | IGradient | false | (number | boolean)[] | IColorKey | null;
  /**
   * 描边透明度
   */
  strokeOpacity?: number;
  /**
   * 图形的透明度，既影响描边也影响填充
   */
  opacity?: number;
  /**
   * 图形的描边宽度
   */
  lineWidth?: number;
  /**
   * 给描边配置虚线模式。它使用一组值来指定描述模式的线和间隙的交替长度
   */
  lineDash?: number[];
  /**
   * 设置虚线偏移量的属性
   */
  lineDashOffset?: number;
  /**
   * 设置图形的鼠标样式
   */
  cursor?: Cursor;
  /**
   * 设置图形的层级，主意这个是相对层级，图形引擎绘制的时候，会对相同group下的所有图形根据zIndex进行排序，然后从小到大进行渲染
   */
  zIndex?: number;
  /**
   * 图形的旋转角度
   */
  angle?: number;
  /**
   * 基于AABB的锚点位置，用于简单的定位某些path的位置
   */
  anchor?: [number, number];

  /**
   * x方向的缩放比例，默认为1，即不进行缩放
   */
  scaleX?: number;
  /**
   * y方向的缩放比例，默认为1，即不进行缩放
   */
  scaleY?: number;
  /**
   * 图形缩放中心
   * @since 1.4.0
   * 可以配置固定坐标，例如 [100, 100]；或者百分比坐标，例如 ['50%', '50%']，代表以图元中心为缩放中心
   * */
  scaleCenter?: [number | string, number | string];

  // 3d旋转的属性
  /**
   * x方向的旋转角度
   */
  alpha?: number;
  /**
   * y方向的旋转角度
   */
  beta?: number;
  /**
   * 3d的锚点位置
   */
  anchor3d?: [number, number];

  /**
   * 选择模式，精确模式，粗糙模式（包围盒模式），自定义模式
   */
  pickMode?: 'accurate' | 'imprecise' | 'custom';
  /**
   * bounds的计算模式
   */
  boundsMode?: 'accurate' | 'imprecise';

  /**
   * 用于扩展描边的拾取范围，为 0 就是默认线宽，正数就加宽，负数就减宽
   * @default 0
   * @since 1.7.3
   */
  pickStrokeBuffer?: number;

  // 以下是纹理相关的属性
  /**
   * 纹理的类型
   */
  texture?: TextureType | string;
  /**
   * 纹理的颜色
   */
  textureColor?: string;
  /**
   * 纹理单元的大小
   */
  textureSize?: number; // 纹理大小
  /**
   * 纹理之间空隙的大小
   */
  texturePadding?: number;

  /**
   * 外边框，外描边，描边位于图形外侧
   */
  outerBorder?: IBorder;
  /**
   * 内边框，内描边，描边位于图形内侧
   */
  innerBorder?: IBorder;
  /**
   * html 浮层，会将配置的html相关内容，绝对定位到图元的位置
   * @experimental
   * @since 1.10.0
   */
  html?: IMarkHtmlSpec;

  [key: string]: any;
}
```

相关定义：[IGradient](AdditionalTypes-Type-Definition.md#type-4cdfc5286411)、[IColorKey](AdditionalTypes-Type-Definition.md#type-a3c3eb9876a9)、[Cursor](AdditionalTypes-Type-Definition.md#type-05ee2579711f)、[TextureType](AdditionalTypes-Type-Definition.md#type-7dd7d41922bc)、[IBorder](AdditionalTypes-Type-Definition.md#type-c857646a1dda)、[IMarkHtmlSpec](AdditionalTypes-Type-Definition.md#type-d9ef36a1c319)

<a id="type-3cdc9715d892"></a>
## IComposedTextMarkSpec

来源：`packages/vchart/src/typings/visual.ts`，VChart 2.1.7

```typescript
export type IComposedTextMarkSpec = ITextMarkSpec | IRichTextMarkSpec;
```

相关定义：[ITextMarkSpec](ITextMarkSpec-Type-Definition.md)、[IRichTextMarkSpec](AdditionalTypes-Type-Definition.md#type-19e9483035ff)

<a id="type-36e76424276b"></a>
## IFillMarkSpec

来源：`packages/vchart/src/typings/visual.ts`，VChart 2.1.7

```typescript
export interface IFillMarkSpec extends ICommonSpec {
  /**
   * 图形的填充颜色
   * @todo 隔离主题和 spec 配置
   * IColorKey 类型只适用于主题
   */
  fill?: VisualType<string> | IGradient | false | IColorKey;
  /**
   * 图形模糊效果程度
   */
  shadowBlur?: number;
  /**
   * 图形的阴影颜色
   */
  shadowColor?: string;
  /**
   * 阴影水平偏移距离
   */
  shadowOffsetX?: number;
  /**
   * 阴影垂直偏移距离
   */
  shadowOffsetY?: number;
  /**
   * 填充的透明度
   */
  fillOpacity?: number;

  /**
   * 图形的背景色，支持纯色、image元素、canvas元素
   */
  background?: IColor | HTMLImageElement | HTMLCanvasElement | null;
  /**
   * 背景图绘制模式（与具体图元有关）。
   * 原有平铺模式为：`repeat` / `repeat-x` / `repeat-y` / `no-repeat`；
   * 自 `2.0.21` 版本开始，支持 `no-repeat-cover` / `no-repeat-contain` /
   * `no-repeat-fill` / `no-repeat-auto` 这几个 `no-repeat` 下的尺寸简写。
   */
  backgroundMode?: BackgroundMode;
  /**
   * 是否正好填充，只在repeat-x或者repeat-y以及no-repeat的时候生效
   */
  backgroundFit?: boolean;
  /**
   * 是否保持背景图的宽高比
   */
  backgroundKeepAspectRatio?: boolean;
  /**
   * 背景图缩放，只在no-repeat的时候生效
   */
  backgroundScale?: number;
  /**
   * 背景图偏移，只在no-repeat的时候生效
   */
  backgroundOffsetX?: number;
  /**
   * 背景图偏移，只在no-repeat的时候生效
   */
  backgroundOffsetY?: number;
  /**
   * 背景图锚定位置，语义类似 CSS `background-position`。
   * 仅在图片背景且最终为 `no-repeat` 时生效。
   * @since 2.0.21
   */
  backgroundPosition?: BackgroundPosition;
  /**
   * 背景图是否裁切，是否调用clip避免绘制到图元外部
   */
  backgroundClip?: boolean;
  /**
   * 背景圆角半径
   */
  backgroundCornerRadius?: number | number[];
  /**
   * 背景透明度
   */
  backgroundOpacity?: number;
}
```

相关定义：[ICommonSpec](AdditionalTypes-Type-Definition.md#type-642c420237a7)、[VisualType](AdditionalTypes-Type-Definition.md#type-e295ec9bce6b)、[IGradient](AdditionalTypes-Type-Definition.md#type-4cdfc5286411)、[IColorKey](AdditionalTypes-Type-Definition.md#type-a3c3eb9876a9)、[IColor](AdditionalTypes-Type-Definition.md#type-a0aea41aa029)、[BackgroundMode](AdditionalTypes-Type-Definition.md#type-335140a3e2b6)、[BackgroundPosition](AdditionalTypes-Type-Definition.md#type-79f8ce85abb1)

<a id="type-4cdfc5286411"></a>
## IGradient

来源：`packages/vchart/src/typings/visual.ts`，VChart 2.1.7

```typescript
export type IGradient = IGradientLinear | IGradientRadial | IGradientConical;
```

相关定义：[IGradientLinear](AdditionalTypes-Type-Definition.md#type-a9d5ddd8d42f)、[IGradientRadial](AdditionalTypes-Type-Definition.md#type-7c5f562e4fc5)、[IGradientConical](AdditionalTypes-Type-Definition.md#type-6564c798928d)

<a id="type-6564c798928d"></a>
## IGradientConical

来源：`packages/vchart/src/typings/visual.ts`，VChart 2.1.7

```typescript
export interface IGradientConical {
  /**
   * 锥形渐变的中心点x坐标
   */
  x?: GradientPropValue<number>;
  /**
   * 锥形渐变的中心点y坐标
   */
  y?: GradientPropValue<number>;
  /**
   * 锥形渐变的开始角度
   */
  startAngle?: GradientPropValue<number>;
  /**
   * 锥形渐变的结束角度
   */
  endAngle?: GradientPropValue<number>;
  /**
   * 锥形渐变的颜色
   */
  stops: GradientStop[];
  /**
   * 渐变色的类型设置为 'conical'，即锥形渐变
   */
  gradient: 'conical';
}
```

相关定义：[GradientPropValue](AdditionalTypes-Type-Definition.md#type-b9b2288b01f6)、[GradientStop](AdditionalTypes-Type-Definition.md#type-105bc3b38706)

<a id="type-a9d5ddd8d42f"></a>
## IGradientLinear

来源：`packages/vchart/src/typings/visual.ts`，VChart 2.1.7

```typescript
export interface IGradientLinear {
  /**
   * 渐变色的起点x坐标，0-1的值，相对于图形包围盒x方向取值的比例值
   */
  x0?: GradientPropValue<number>;
  /**
   * 渐变色的起点y坐标，0-1的值，相对于图形包围盒y方向取值的比例值
   */
  y0?: GradientPropValue<number>;
  /**
   * 渐变色的终点x坐标，0-1的值，相对于图形包围盒x方向取值的比例值
   */
  x1?: GradientPropValue<number>;
  /**
   * 渐变色的终点y坐标，0-1的值，相对于图形包围盒y方向取值的比例值
   */
  y1?: GradientPropValue<number>;
  /**
   * 渐变色的颜色
   */
  stops: GradientStop[];
  /**
   * 渐变色的类型设置为 'linear'，即线形渐变
   */
  gradient: 'linear';
}
```

相关定义：[GradientPropValue](AdditionalTypes-Type-Definition.md#type-b9b2288b01f6)、[GradientStop](AdditionalTypes-Type-Definition.md#type-105bc3b38706)

<a id="type-7c5f562e4fc5"></a>
## IGradientRadial

来源：`packages/vchart/src/typings/visual.ts`，VChart 2.1.7

```typescript
export interface IGradientRadial {
  /**
   * 径向渐变的起点的半径
   */
  r0?: GradientPropValue<number>;
  /**
   * 径向渐变的起点的x坐标
   */
  x0?: GradientPropValue<number>;
  /**
   * 径向渐变的起点的y坐标
   */
  y0?: GradientPropValue<number>;
  /**
   * 径向渐变的终点的x坐标
   */
  x1?: GradientPropValue<number>;
  /**
   * 径向渐变的终点的y坐标
   */
  y1?: GradientPropValue<number>;
  /**
   * 径向渐变的终点的半径
   */
  r1?: GradientPropValue<number>;
  /**
   * 渐变色的颜色
   */
  stops: GradientStop[];
  /**
   * 渐变色的类型设置为 'radial'，即径向渐变
   */
  gradient: 'radial';
}
```

相关定义：[GradientPropValue](AdditionalTypes-Type-Definition.md#type-b9b2288b01f6)、[GradientStop](AdditionalTypes-Type-Definition.md#type-105bc3b38706)

<a id="type-d9ef36a1c319"></a>
## IMarkHtmlSpec

来源：`packages/vchart/src/typings/visual.ts`，VChart 2.1.7

```typescript
export type IMarkHtmlSpec = Partial<IGraphicStyle['html']>;
```

相关定义：[IGraphicStyle](AdditionalTypes-Type-Definition.md#type-fe3cb3c3600e)

<a id="type-62ea327d0fc7"></a>
## IPositionedTextMarkSpec

来源：`packages/vchart/src/typings/visual.ts`，VChart 2.1.7

```typescript
export type IPositionedTextMarkSpec = Omit<ITextMarkSpec, 'align' | 'textAlign' | 'baseline' | 'textBaseline'>;
```

相关定义：[ITextMarkSpec](ITextMarkSpec-Type-Definition.md)

<a id="type-19e9483035ff"></a>
## IRichTextMarkSpec

来源：`packages/vchart/src/typings/visual.ts`，VChart 2.1.7

```typescript
export type IRichTextMarkSpec = IRichTextAttribute &
  IFillMarkSpec & { type: 'rich'; text: IRichTextAttribute['textConfig'] };
```

相关定义：[IRichTextAttribute](AdditionalTypes-Type-Definition.md#type-09c9e7b04102)、[IFillMarkSpec](AdditionalTypes-Type-Definition.md#type-36e76424276b)

<a id="type-9bb9b1b41b53"></a>
## IVisual

来源：`packages/vchart/src/typings/visual.ts`，VChart 2.1.7

```typescript
export type IVisual<D = any, R = any> = IVisualSpecStyle<D, R> | IVisualScale;
```

相关定义：[IVisualSpecStyle](AdditionalTypes-Type-Definition.md#type-ae2e55448a0a)、[IVisualScale](AdditionalTypes-Type-Definition.md#type-d2a6fed8edde)

<a id="type-d2a6fed8edde"></a>
## IVisualScale

来源：`packages/vchart/src/typings/visual.ts`，VChart 2.1.7

```typescript
export interface IVisualScale {
  /**
   * 对应 IVisualSpecScale 的用户配置 scale-id
   */
  scale: string;
  /**
   * 指定参与映射的数据字段
   */
  field?: string;
  /**
   * 当用户指定 field 后，用该属性来控制值域。
   * @default 'none'
   */
  changeDomain?: 'none' | 'replace' | 'expand';
}
```

<a id="type-ae2e55448a0a"></a>
## IVisualSpecStyle

来源：`packages/vchart/src/typings/visual.ts`，VChart 2.1.7

```typescript
export interface IVisualSpecStyle<D, T> extends IVisualSpecBase<D, T> {
  /**
   * 指定映射对应的数据字段
   */
  field?: string;
}
```

相关定义：[IVisualSpecBase](IVisualSpecBase-Type-Definition.md)

<a id="type-6b2c76bfb154"></a>
## TextAlign

来源：`packages/vchart/src/typings/visual.ts`，VChart 2.1.7

```typescript
export type TextAlign = TextAlignType;
```

相关定义：[TextAlignType](AdditionalTypes-Type-Definition.md#type-5417f1df62a1)

<a id="type-94a26edb6027"></a>
## TextBaseLine

来源：`packages/vchart/src/typings/visual.ts`，VChart 2.1.7

```typescript
export type TextBaseLine = TextBaselineType;
```

相关定义：[TextBaselineType](AdditionalTypes-Type-Definition.md#type-b47e2c6810a7)

<a id="type-7dd7d41922bc"></a>
## TextureType

来源：`packages/vchart/src/typings/visual.ts`，VChart 2.1.7

```typescript
export type TextureType =
  | 'circle'
  | 'dimond'
  | 'rect'
  | 'vertical-line'
  | 'horizontal-line'
  | 'bias-lr'
  | 'bias-rl'
  | 'grid';
```

<a id="type-979efd9d6b47"></a>
## ValueType

来源：`packages/vchart/src/typings/visual.ts`，VChart 2.1.7

```typescript
export type ValueType<T> = T;
```

<a id="type-e295ec9bce6b"></a>
## VisualType

来源：`packages/vchart/src/typings/visual.ts`，VChart 2.1.7

```typescript
export type VisualType<T> = ValueType<T> | FunctionType<T> | IVisual<unknown, T>;
```

相关定义：[ValueType](AdditionalTypes-Type-Definition.md#type-979efd9d6b47)、[FunctionType](FunctionType-Type-Definition.md)、[IVisual](AdditionalTypes-Type-Definition.md#type-9bb9b1b41b53)
