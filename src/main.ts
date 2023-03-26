import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';

import '@theme/mapbox.scss';
import '@theme/datatable.scss';

const pinia = createPinia();
createApp(App).use(pinia).mount('#app');
