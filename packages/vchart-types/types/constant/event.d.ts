export { HOOK_EVENT as VGRAMMAR_HOOK_EVENT } from '@visactor/vgrammar-core';
export declare const BASE_EVENTS: string[];
export declare enum ChartEvent {
    initialized = "initialized",
    rendered = "rendered",
    renderFinished = "renderFinished",
    animationFinished = "animationFinished",
    regionSeriesDataFilterOver = "regionSeriesDataFilterOver",
    afterInitData = "afterInitData",
    afterInitEvent = "afterInitEvent",
    afterInitMark = "afterInitMark",
    rawDataUpdate = "rawDataUpdate",
    rawDataStatisticsUpdate = "rawDataStatisticsUpdate",
    viewDataFilterOver = "viewDataFilterOver",
    viewDataUpdate = "viewDataUpdate",
    viewDataStatisticsUpdate = "viewDataStatisticsUpdate",
    markDeltaYUpdate = "markDeltaYUpdate",
    viewDataLabelUpdate = "viewDataLabelUpdate",
    scaleDomainUpdate = "scaleDomainUpdate",
    scaleUpdate = "scaleUpdate",
    dataZoomChange = "dataZoomChange",
    drill = "drill",
    layoutStart = "layoutStart",
    layoutEnd = "layoutEnd",
    layoutRectUpdate = "layoutRectUpdate",
    playerPlay = "playerPlay",
    playerPause = "playerPause",
    playerEnd = "playerEnd",
    playerChange = "playerChange",
    playerForward = "playerForward",
    playerBackward = "playerBackward",
    scrollBarChange = "scrollBarChange",
    brushStart = "brushStart",
    brushChange = "brushChange",
    brushEnd = "brushEnd",
    legendSelectedDataChange = "legendSelectedDataChange",
    legendFilter = "legendFilter",
    legendItemClick = "legendItemClick",
    legendItemHover = "legendItemHover",
    legendItemUnHover = "legendItemUnHover",
    tooltipShow = "tooltipShow",
    tooltipHide = "tooltipHide",
    tooltipRelease = "tooltipRelease",
    afterResize = "afterResize",
    afterRender = "afterRender",
    afterLayout = "afterLayout"
}
export declare enum Event_Source_Type {
    chart = "chart",
    window = "window",
    canvas = "canvas"
}
export declare enum Event_Bubble_Level {
    vchart = "vchart",
    chart = "chart",
    model = "model",
    mark = "mark"
}
