import './styles/admin/validacionesCompartidas.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './styles/base/reset.css'
import './styles/base/variables.css'
import './styles/base/global.css'
import './styles/admin/validacionesFormularios.css'

import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './styles/base/botones.css'
import './styles/base/botonesJuegos.css'

createApp(App)
  .use(router)
  .mount('#app')