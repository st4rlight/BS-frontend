// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import ElementUI from 'element-ui';
import 'font-awesome/css/font-awesome.css';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/icon/iconfont.css';
import Vue from 'vue';
import VCharts from 'v-charts';

import App from './App';
import router from './router';
import store from './store';

Vue.use(ElementUI);
Vue.use(VCharts);
Vue.config.productionTip = false;

/* eslint-disable no-new */

new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
  components: { App },
  template: '<App/>'
});
