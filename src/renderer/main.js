import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/store'
import http from 'api/axios.config'
import 'common/element-theme/element-theme.scss'
import 'common/stylus/index.styl'
import 'common/font/iconfont.css'
import { env as NODEENV } from 'api/config'
import ElementUi from 'element-ui'
import formarts from 'common/js/formart'
import VueClipboard from 'vue-clipboard2'
import {getFirstPageList, setFirstPageList} from 'api/fs.config'
import directives from 'common/js/directives.js'
// import VueVirtualScroller from 'vue-virtual-scroller'

// 无限滚动，性能优化组件 https://github.com/Akryum/vue-virtual-scroller
// Vue.use(VueVirtualScroller)

// 读取、保存列表第一页数据，优化用户体验
Vue.prototype.$getFirstPageList = getFirstPageList
Vue.prototype.$setFirstPageList = setFirstPageList

// 剪切板 https://github.com/Inndy/vue-clipboard2#readme
Vue.use(VueClipboard)

window.console.log = window.console.info

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.use(ElementUi)
Vue.http = Vue.prototype.$http = http

// 处理静态资源文件
Vue.prototype.__static = url => {
  if (!url || NODEENV === 'development') {
    // 无url为空 或者 开发爱环境不做出处理
    return url
  } else {
    return url.replace(/^static/, __static)
  }
}
// 注册全局formart方法
for (let key in formarts) {
  if (formarts.hasOwnProperty(key)) {
    Vue.prototype[`__${key}`] = formarts[key]
  }
}
// 注册全局指令
for (let key in directives) {
  if (directives.hasOwnProperty(key)) {
    Vue.directive(key, directives[key])
  }
}
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
