<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { api, setSession } from '../../services/api'
import { useRouter } from 'vue-router'
import logo from '../../assets/gato-lectura/logo-gato-lecturas.png'
import '../../styles/auth.css'
import '../../styles/estudiante/ingreso.css'

const router = useRouter()
const curso = ref('3A')
const alumnos = ref([])
const estudianteId = ref('')
const solicitud = ref(null)
const error = ref('')
const mensaje = ref('')
const cargando = ref(false)
let timer

function errorEnEspanol(e) {
  const texto = String(e?.message || '')
  if (/failed to fetch|networkerror|load failed/i.test(texto)) return 'No podemos conectar con el servidor. Pide ayuda a tu docente.'
  return texto || 'Ocurrió un problema. Pide ayuda a tu docente.'
}
async function cargar() {
  error.value = ''
  try { alumnos.value = await api('/public/estudiantes?curso=' + curso.value) }
  catch (e) { alumnos.value = []; error.value = errorEnEspanol(e) }
}
async function solicitar() {
  if (!estudianteId.value || cargando.value) return
  error.value = ''
  cargando.value = true
  try {
    solicitud.value = await api('/acceso/solicitudes', {
      method: 'POST',
      body: JSON.stringify({ estudianteId: Number(estudianteId.value) })
    })
    mensaje.value = '¡Solicitud enviada! Espera mientras tu docente verifica tu identidad y autoriza tu ingreso.'
  } catch (e) { error.value = errorEnEspanol(e) }
  finally { cargando.value = false }
}
async function consultar() {
  if (!solicitud.value) return
  try {
    const d = await api('/acceso/solicitudes/' + solicitud.value.id + '?clave=' + encodeURIComponent(solicitud.value.clave))
    if (d.estado === 'APROBADA' && d.token) {
      setSession({ token: d.token, user: d.user })
      clearInterval(timer)
      router.push('/alumno')
    } else if (d.estado === 'RECHAZADA' || d.estado === 'EXPIRADA') {
      mensaje.value = d.estado === 'RECHAZADA' ? 'Tu docente no aprobó esta solicitud. Pídele ayuda.' : 'Tu solicitud venció. Puedes intentarlo otra vez.'
      solicitud.value = null
    }
  } catch (e) { error.value = errorEnEspanol(e) }
}
function cambiarCurso() { estudianteId.value = ''; mensaje.value = ''; cargar() }
async function cancelar() {
  const pendiente = solicitud.value
  solicitud.value = null
  mensaje.value = ''
  if (pendiente) {
    try { await api('/acceso/solicitudes/' + pendiente.id + '/cancelar', { method: 'POST', body: JSON.stringify({ clave: pendiente.clave }) }) }
    catch (e) { error.value = errorEnEspanol(e) }
  }
}
onMounted(() => { cargar(); timer = setInterval(consultar, 2500) })
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <main class="gato-auth ingreso-infantil">
    <section class="gato-card ingreso-infantil-tarjeta">
      <img :src="logo" alt="Logo de Gato Lecturas" class="ingreso-infantil-gato" />
      <h1>¡Hola, explorador!</h1>
      <p class="ingreso-infantil-instruccion">Elige tu curso y tu nombre. Después, tu docente te ayudará a entrar.</p>
      <template v-if="!solicitud">
        <label class="form-label" for="curso-nino">Mi curso</label>
        <select id="curso-nino" v-model="curso" class="form-select ingreso-infantil-campo" @change="cambiarCurso">
          <option value="3A">3° A</option><option value="3B">3° B</option>
          <option value="3C">3° C</option><option value="3D">3° D</option>
        </select>
        <label class="form-label" for="nombre-nino">Mi nombre</label>
        <select id="nombre-nino" v-model="estudianteId" class="form-select ingreso-infantil-campo">
          <option value="">Selecciona tu nombre</option>
          <option v-for="a in alumnos" :key="a.id" :value="a.id">{{ a.nombre }}</option>
        </select>
        <button type="button" class="gato-boton gato-boton-verde ingreso-infantil-boton" :disabled="!estudianteId || cargando" @click="solicitar">
          {{ cargando ? 'Enviando solicitud...' : 'Pedir permiso para ingresar' }}
        </button>
      </template>
      <div v-else class="ingreso-infantil-espera" aria-live="polite">
        <i class="fas fa-hourglass-half ingreso-espera-icono" aria-hidden="true"></i>
        <p class="ingreso-espera-titulo">¡Tu solicitud está en camino!</p>
        <p>Tu docente comprobará tu identidad en el aula y aprobará tu acceso. No necesitas ningún código.</p>
        <button type="button" class="gato-boton gato-boton-rojo ingreso-infantil-cancelar" @click="cancelar">Cancelar solicitud</button>
      </div>
      <div v-if="mensaje" class="gato-ok" role="status">{{ mensaje }}</div>
      <div v-if="error" class="gato-error" role="alert">{{ error }}</div>
      <router-link to="/login" class="gato-boton gato-boton-naranja ingreso-infantil-volver">Volver al inicio de sesión</router-link>
    </section>
  </main>
</template>
