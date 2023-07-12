//引入Vue
import Vue from 'vue'
//引入App
import App from './App.vue'
//引入VueRouter
import VueRouter from 'vue-router'
//引入路由器
import router from './router'
//引入store
import store from './store'
//引入Element UI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/display.css';
//引入VueCropper
import VueCropper from 'vue-cropper'
//关闭Vue的生产提示
Vue.config.productionTip = false
//应用插件Element UI
Vue.use(VueRouter)
//启用
Vue.use(ElementUI)
Vue.use(VueCropper)
new Vue({
  render: h => h(App),
  router:router,
	store,
  beforeCreate() {
		Vue.prototype.$bus = this //安装全局事件总线
	},
}).$mount('#app')
