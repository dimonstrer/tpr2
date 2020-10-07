import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/ru-RU'
import App from './App.vue'
import Vuex from 'vuex';
import store from "@/store";
import VueLodash from 'vue-lodash'
import lodash from 'lodash'

Vue.config.productionTip = false;

Vue.use(ElementUI, {locale});
Vue.use(VueLodash, { lodash });
Vue.use(Vuex);

new Vue({
  render: h => h(App),
  store
}).$mount('#app');
