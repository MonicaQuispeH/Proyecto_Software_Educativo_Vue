<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api, setSession } from '../services/api'
import logo from '../assets/gato-lectura/logo-gato-lecturas.png'
import '../styles/auth.css'
import '../styles/login.css'

const router = useRouter()
const usuario = ref('')
const password = ref('')
const error = ref('')
const cargando = ref(false)

function mensajeEnEspanol(mensaje) {
  const texto = String(mensaje || '').toLowerCase()
  if (/failed to fetch|networkerror|network request failed|load failed/.test(texto)) {
    return 'No se pudo conectar con el servidor. Verifica que el backend esté encendido en el puerto 3000.'
  }
  if (/credencial|incorrect|inválid|invalid|contraseña|password|unauthorized/.test(texto)) {
    return 'Usuario o contraseña incorrectos. Revisa tus datos e inténtalo nuevamente.'
  }
  if (/fetch|timeout|connection|servidor|conexión|conexion/.test(texto)) {
    return 'No se pudo completar la conexión. Inténtalo nuevamente.'
  }
  return mensaje || 'Ocurrió un problema al ingresar. Inténtalo nuevamente.'
}

async function entrar() {
  error.value = ''
  cargando.value = true
  try {
    const data = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ usuario: usuario.value, password: password.value })
    })
    setSession(data)
    router.push(data.user.rol === 'ADMIN' ? '/admin' : data.user.debeCambiarClave ? '/docente/perfil' : '/docente')
  } catch (e) {
    error.value = mensajeEnEspanol(e.message)
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <main class="gato-auth login-infantil">
    <section class="gato-card login-infantil-tarjeta" aria-labelledby="login-titulo">
      <div class="login-infantil-imagenes">
        <img :src="logo" alt="Gato Lecturas" class="login-infantil-logo" />
      </div>
      <h1 id="login-titulo">¡Bienvenidos a Gato Lecturas!</h1>
      <p class="login-infantil-subtitulo">Ingreso de administradores y docentes</p>
      <div class="login-infantil-saludo">¡Vamos a seguir aprendiendo juntos!</div>
      <form @submit.prevent="entrar">
        <label class="form-label" for="usuario">Usuario</label>
        <input id="usuario" v-model.trim="usuario" class="form-control login-infantil-campo" required autocomplete="username" placeholder="Escribe tu usuario" />
        <label class="form-label" for="clave">Contraseña</label>
        <input id="clave" v-model="password" type="password" class="form-control login-infantil-campo" required autocomplete="current-password" placeholder="Escribe tu contraseña" />
        <div v-if="error" class="gato-error" role="alert" aria-live="polite">{{ error }}</div>
        <button type="submit" class="gato-boton gato-boton-azul login-infantil-entrar" :disabled="cargando">{{ cargando ? 'Ingresando...' : 'Ingresar' }}</button>
      </form>
      <div class="login-infantil-separador"><span>¿Eres estudiante?</span></div>
      <p class="login-infantil-ayuda">Puedes ingresar con permiso de tu docente, sin recordar una contraseña.</p>
      <router-link to="/ingreso-estudiante" class="gato-boton gato-boton-verde login-infantil-estudiante">Soy estudiante</router-link>
      <router-link to="/" class="gato-boton gato-boton-naranja login-infantil-volver">Volver al inicio</router-link>
    </section>
  </main>
</template>
