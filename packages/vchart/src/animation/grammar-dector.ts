/**
 * 检测语法变化，注册策略针对不同的语法变化，创建不同的planner去依次执行
 * 可以注册的策略有：
 * 1. 如果有数据删除，分为两个planner，先走exit动画，再走其他的动画
 * 2. 如果有数据添加，分为两个planner，先走其他的动画，最后走Enter动画
 * 3. 如果是一般的更新，那么正常走update，也就是一个planner就行
 * 4. 如果有数据维度变化
 *    -   1. 堆积变分组，先执行band方向的插值，在进行value方向的插值
 *    -   2. 分组变堆积，先执行value方向的插值，再执行band方向的插值
 */
export class GrammarDetector {}
