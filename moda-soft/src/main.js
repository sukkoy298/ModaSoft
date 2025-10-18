import { createApp } from 'vue'
import App from './App.vue'
// Import our custom CSS
import './scss/styles.scss'
// Import all of Bootstrap’s JS
import * as bootstrap from 'bootstrap'
import router from './router'

createApp(App).mount('#app')
app.use(router)
app.mount('#app')
