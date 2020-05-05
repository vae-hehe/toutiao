// 全局通信总线
// 实现任何组件之间的相互通信

import Vue from 'vue'
export default new Vue()

// a向b发送数据
/**
 * b注册事件
 * import globalBus from '@/utils/global-bus'
 * global-bus.$on('自定义事件名称', (data) => {
 *  处理函数
 * })
 * a发布事件
 * import globalBus from '@/utils/global-bus'
 * globalBus.$emit('自定义事件名称', 可选的数据)
 */

// 名称相同
