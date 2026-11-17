<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import Navbar from '../../components/admin/Navbar.vue'
import Sidebar from '../../components/admin/Sidebar.vue'
import { api } from '../../services/api.js'
import '../../styles/admin/dashboard.css'

const cursos = ref([])
const datos = ref([])
const error = ref('')
const cargando = ref(true)
const etiqueta = c => '3° ' + String(c).slice(1)

async function cargar() {
  cargando.value = true
  error.value = ''
  try {
    cursos.value = await api('/docente/cursos')
    datos.value = await Promise.all(cursos.value.map(async curso => {
      const [estudiantes, solicitudes] = await Promise.all([
        api('/docente/estudiantes?curso=' + encodeURIComponent(curso)),
        api('/docente/solicitudes?curso=' + encodeURIComponent(curso))
      ])
      return { curso, estudiantes: estudiantes.length, habilitados: estudiantes.filter(x => x.habilitado).length, solicitudes: solicitudes.length }
    }))
  } catch (e) { error.value = e.message || 'No se pudieron cargar tus paralelos.' }
  finally { cargando.value = false }
}

onMounted(cargar)
</script>

<template>
  <Navbar />
  <div class="dashboard docente-paralelos-layout">
    <Sidebar />
    <main class="contenido">
      <div class="bienvenida">
        <h1>Mis paralelos</h1>
        <p>Consulta los cursos que tienes asignados y el estado de sus estudiantes.</p>
      </div>
      <p v-if="cargando" class="text-muted">Cargando tus paralelos...</p>
      <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
      <div v-if="!cargando && !datos.length && !error" class="alert alert-warning">No tienes paralelos asignados actualmente.</div>
      <section class="paralelos-grid">
        <article v-for="item in datos" :key="item.curso" class="paralelo-card">
          <header><span class="paralelo-icono"><i class="fas fa-school"></i></span><div><small>TERCER GRADO</small><h2>{{ etiqueta(item.curso) }}</h2></div></header>
          <div class="paralelo-metricas">
            <div><strong>{{ item.estudiantes }}</strong><span>Estudiantes</span></div>
            <div><strong>{{ item.habilitados }}</strong><span>Habilitados</span></div>
            <div><strong>{{ item.solicitudes }}</strong><span>Solicitudes pendientes</span></div>
          </div>
          <RouterLink :to="{ path: '/docente/listas', query: { curso: item.curso } }" class="btn btn-primary">Ver lista del paralelo</RouterLink>
        </article>
      </section>
    </main>
  </div>
</template>

<style scoped>
.paralelos-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;margin-top:20px}
.paralelo-card{background:#fff;border:1px solid #dbe5f4;border-radius:16px;padding:22px;box-shadow:0 5px 18px rgba(30,58,138,.06)}
.paralelo-card header{display:flex;align-items:center;gap:14px;padding-bottom:18px;border-bottom:1px solid #e8edf5}
.paralelo-icono{width:52px;height:52px;border-radius:14px;background:#e8efff;color:#2563eb;display:grid;place-items:center;font-size:22px}
.paralelo-card header small{font-size:10px;letter-spacing:1px;color:#64748b;font-weight:700}
.paralelo-card h2{font-size:23px;color:#1e3a8a;margin:2px 0 0}
.paralelo-metricas{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:20px 0}
.paralelo-metricas div{display:flex;flex-direction:column;gap:4px}
.paralelo-metricas strong{font-size:25px;color:#172554}
.paralelo-metricas span{font-size:12px;color:#64748b;line-height:1.25}
.paralelo-card .btn{width:100%}
</style>
