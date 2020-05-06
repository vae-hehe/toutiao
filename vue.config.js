/**
 * VueCLI的配置文件
 * 自定义VueCLI内部的 webpack配置
 */

// 必须导出一个对象(Node.js的语法)
module.exports = {
  configureWebpack: {
    // 告诉webpack 使用script加载的资源,不是node_modules中的第三方包
    externals: {
      // 属性名: 加载的包名
      // 属性值: script 标签暴露的全局变量  一定要写到字符串中
      vue: 'Vue',
      'element-ui': 'ELEMENT',
      echarts: 'echarts'
    }
  }
}
