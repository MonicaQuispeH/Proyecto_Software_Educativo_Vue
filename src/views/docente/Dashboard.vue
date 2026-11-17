<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { api, getSession } from '../../services/api.js'
import Navbar from '../../components/admin/Navbar.vue'
import Sidebar from '../../components/admin/Sidebar.vue'
import '../../styles/admin/dashboard.css'

const cargando = ref(true)
const error = ref('')
const cursos = ref([])
const resumen = ref({ estudiantes: 0, habilitados: 0, solicitudes: 0, lecturas: 0, evaluaciones: 0 })
const nombre = computed(() => getSession()?.user?.nombre || 'Docente')
const tarjetas = computed(() => [
  { titulo: 'Mis paralelos', cantidad: cursos.value.length, detalle: 'Cursos asignados', icono: 'fas fa-school', color: '#f59e0b', ruta: '/docente/paralelos' },
  { titulo: 'Mis estudiantes', cantidad: resumen.value.estudiantes, detalle: `${resumen.value.habilitados} habilitados para ingresar`, icono: 'fas fa-user-graduate', color: '#16a34a', ruta: '/docente/estudiantes' },
  { titulo: 'Lecturas asignadas', cantidad: resumen.value.lecturas, detalle: 'Lecturas disponibles en tus cursos', icono: 'fas fa-book-open', color: '#2563eb', ruta: '/docente/lecturas' },
  { titulo: 'Evaluaciones', cantidad: resumen.value.evaluaciones, detalle: 'Evaluaciones de tus cursos', icono: 'fas fa-clipboard-check', color: '#9333ea', ruta: '/docente/evaluaciones' },
])

async function cargarResumen() {
  cargando.value = true
  error.value = ''
  try {
    cursos.value = await api('/docente/cursos')
    const porCurso = await Promise.all(cursos.value.map(async curso => {
      const [estudiantes, solicitudes] = await Promise.all([
        api('/docente/estudiantes?curso=' + encodeURIComponent(curso)),
        api('/docente/solicitudes?curso=' + encodeURIComponent(curso))
      ])
      return { estudiantes, solicitudes }
    }))
    resumen.value.estudiantes = porCurso.reduce((n, x) => n + x.estudiantes.length, 0)
    resumen.value.habilitados = porCurso.reduce((n, x) => n + x.estudiantes.filter(e => e.habilitado).length, 0)
    resumen.value.solicitudes = porCurso.reduce((n, x) => n + x.solicitudes.length, 0)
    const [lecturas, evaluaciones] = await Promise.all([
      api('/contenidos/lecturas'), api('/contenidos/evaluaciones')
    ])
    const asignados = new Set(cursos.value)
    resumen.value.lecturas = lecturas.filter(x => x.activa && (x.cursos || []).some(c => asignados.has(c))).length
    resumen.value.evaluaciones = evaluaciones.filter(x => x.activa && (x.cursos || []).some(c => asignados.has(c))).length
  } catch (e) {
    error.value = e.message || 'No se pudo cargar el resumen del docente.'
  } finally {
    cargando.value = false
  }
}

onMounted(cargarResumen)
</script>

<template>
  <Navbar />
  <div class="dashboard docente-dashboard">
    <Sidebar />
    <main class="contenido">
      <div class="bienvenida">
        <h1>¡Bienvenido, {{ nombre }}!</h1>
        <p>Este es el resumen de tus paralelos, estudiantes y actividades educativas.</p>
      </div>

      <p v-if="cargando" class="text-muted">Consultando la información de tus cursos...</p>
      <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
      <div v-if="!cargando && !cursos.length" class="alert alert-warning">Todavía no tienes paralelos asignados. Solicita al administrador que te asigne tus cursos.</div>

      <section class="docente-tarjetas" aria-label="Resumen del docente">
        <RouterLink v-for="item in tarjetas" :key="item.titulo" :to="item.ruta" class="docente-stat-card">
          <span class="docente-stat-icono" :style="{ background: item.color }"><i :class="item.icono"></i></span>
          <span class="docente-stat-info"><strong>{{ item.cantidad }}</strong><b>{{ item.titulo }}</b><small>{{ item.detalle }}</small></span>
          <i class="fas fa-chevron-right docente-stat-flecha"></i>
        </RouterLink>
      </section>

      <section class="docente-resumen-extra">
        <div>
          <h2>Solicitudes de acceso pendientes</h2>
          <p>{{ resumen.solicitudes }} solicitud(es) esperan tu revisión. Comprueba la identidad del estudiante antes de aprobar.</p>
        </div>
        <RouterLink to="/docente/estudiantes" class="btn btn-primary">Revisar solicitudes</RouterLink>
      </section>
    </main>
  </div>
</template>

<style scoped>
.docente-dashboard .contenido { min-width: 0; }
.docente-tarjetas { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:20px; margin-top:26px; }
.docente-stat-card { min-height:142px; display:flex; align-items:center; gap:16px; padding:22px; background:#fff; border:1px solid #e4eaf3; border-radius:16px; color:#172554; text-decoration:none; box-shadow:0 5px 18px rgba(30,58,138,.06); transition:transform .2s,box-shadow .2s; }
.docente-stat-card:hover { transform:translateY(-3px); box-shadow:0 10px 24px rgba(30,58,138,.12); color:#172554; }
.docente-stat-icono { width:54px;height:54px;flex:0 0 54px;border-radius:15px;display:grid;place-items:center;color:#fff;font-size:22px; }
.docente-stat-info { display:flex; flex-direction:column; min-width:0; gap:3px; }
.docente-stat-info strong { font-size:30px; line-height:1.1; }
.docente-stat-info b { font-size:16px; }
.docente-stat-info small { color:#64748b; line-height:1.35; }
.docente-stat-flecha { margin-left:auto; color:#94a3b8; }
.docente-resumen-extra { margin-top:24px; padding:22px 24px; border:1px solid #dbe5f4; border-radius:16px; background:#fff; display:flex; justify-content:space-between; align-items:center; gap:20px; }
.docente-resumen-extra h2 { font-size:19px; margin:0 0 7px; color:#1e3a8a; }
.docente-resumen-extra p { margin:0; color:#64748b; }
@media(max-width:1100px){.docente-tarjetas{grid-template-columns:repeat(2,minmax(0,1fr));}}
@media(max-width:650px){.docente-tarjetas{grid-template-columns:1fr}.docente-resumen-extra{align-items:flex-start;flex-direction:column}}
</style>
