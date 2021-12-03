import Vue from "vue";
import axios from "axios";
import VTooltip from "v-tooltip";
import vSelect from "vue-select";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import VueHtml2Canvas from "vue-html2canvas";
import "regenerator-runtime/runtime.js";
import "./assets/styles/globals.scss";

import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.component("v-select", vSelect);
Vue.use(VTooltip);
Vue.use(VueHtml2Canvas);

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// eslint-disable-next-line
export const eventEmitter = new Vue();
/* Експортируем шину событий для обмена событиями между компонентами */

// if (!process.env.IS_WEB) Vue.use(require("vue-electron"));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  // components: { App },
  render: (h) => h(App),
  router,
  store,
  // template: "<App/>",
}).$mount("#app");
