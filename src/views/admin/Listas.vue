<script setup>

import { ref, computed, onMounted, watch } from 'vue'

import Navbar from '../../components/admin/Navbar.vue'
import Sidebar from '../../components/admin/Sidebar.vue'

import '../../styles/admin/listas.css'

const cursos = ['3° A', '3° B', '3° C', '3° D']

const filtroCurso = ref('Todos')
const filtroEstado = ref('Todos')
const busqueda = ref('')

const estudiantes = ref([
    { id: 1, nombre: 'María', apellidoPaterno: 'Torres', apellidoMaterno: 'García', ci: '8523691', fechaNacimiento: '2012-03-15', curso: '3° A', estado: 'Activo' },
    { id: 2, nombre: 'Juan', apellidoPaterno: 'Flores', apellidoMaterno: 'Mamani', ci: '7412589', fechaNacimiento: '2012-07-22', curso: '3° B', estado: 'Activo' },
    { id: 3, nombre: 'Sofía', apellidoPaterno: 'Quispe', apellidoMaterno: 'López', ci: '9638527', fechaNacimiento: '2011-11-10', curso: '3° A', estado: 'Inactivo' }
])

function cargarEstudiantes() {
    try {
        const guardados = localStorage.getItem('estudiantes')
        if (guardados) estudiantes.value = JSON.parse(guardados)
    } catch (error) {
        console.error('No se pudieron cargar los estudiantes:', error)
    }
}

onMounted(cargarEstudiantes)

watch(estudiantes, valor => {
    localStorage.setItem('estudiantes', JSON.stringify(valor))
}, { deep: true })

const estudiantesFiltrados = computed(() => {
    const texto = busqueda.value.toLowerCase().trim()
    return estudiantes.value.filter(estudiante => {
        const nombreCompleto = `${estudiante.nombre} ${estudiante.apellidoPaterno} ${estudiante.apellidoMaterno}`.toLowerCase()
        const coincideBusqueda = !texto || nombreCompleto.includes(texto) || String(estudiante.ci).includes(texto)
        const coincideCurso = filtroCurso.value === 'Todos' || estudiante.curso === filtroCurso.value
        const coincideEstado = filtroEstado.value === 'Todos' || estudiante.estado === filtroEstado.value
        return coincideBusqueda && coincideCurso && coincideEstado
    })
})

const cursoSeleccionado = computed(() => filtroCurso.value === 'Todos' ? 'Todos los cursos' : filtroCurso.value)

function limpiarFiltros() {
    busqueda.value = ''
    filtroCurso.value = 'Todos'
    filtroEstado.value = 'Todos'
}

function formatearFecha(fecha) {
    if (!fecha) return ''
    const partes = String(fecha).split('-')
    return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : fecha
}

function imprimirLista() {
    window.print()
}
</script>

<template>
    <Navbar />
    <div class="listas-layout">
        <Sidebar />
        <main class="contenido">
            <div class="encabezado-listas">
                <div>
                    <h1>Listas de Estudiantes</h1>
                    <p>Consulte las listas de estudiantes organizadas por curso.</p>
                </div>
                <button type="button" class="btn-imprimir-lista" @click="imprimirLista">
                    <i class="fas fa-print"></i> Imprimir lista
                </button>
            </div>

            <div class="resumen-listas">
                <div v-for="curso in cursos" :key="curso" class="tarjeta-curso-lista" @click="filtroCurso = curso">
                    <span>{{ curso }}</span>
                    <strong>{{ estudiantes.filter(e => e.curso === curso).length }}</strong>
                    <small>estudiantes</small>
                </div>
            </div>

            <div class="barra-listas">
                <div class="busqueda-listas">
                    <i class="fas fa-search"></i>
                    <input v-model="busqueda" type="text" placeholder="Buscar por nombre, apellido o CI...">
                </div>
                <select v-model="filtroCurso" class="filtro-listas">
                    <option value="Todos">Todos los cursos</option>
                    <option v-for="curso in cursos" :key="curso" :value="curso">{{ curso }}</option>
                </select>
                <select v-model="filtroEstado" class="filtro-listas">
                    <option value="Todos">Todos los estados</option>
                    <option value="Activo">Activos</option>
                    <option value="Inactivo">Inactivos</option>
                </select>
                <button type="button" class="btn-limpiar-listas" @click="limpiarFiltros">Limpiar</button>
            </div>

            <div class="cabecera-tabla-listas">
                <div><strong>{{ cursoSeleccionado }}</strong><span>{{ estudiantesFiltrados.length }} estudiante(s)</span></div>
            </div>

            <div class="tabla-listas-contenedor">
                <table>
                    <thead><tr><th>N°</th><th>Nombre</th><th>Apellidos</th><th>CI</th><th>Fecha de nacimiento</th><th>Celular padre/madre</th><th>Curso</th><th>Estado</th></tr></thead>
                    <tbody>
                        <tr v-for="(estudiante, index) in estudiantesFiltrados" :key="estudiante.id">
                            <td>{{ index + 1 }}</td><td>{{ estudiante.nombre }}</td>
                            <td>{{ estudiante.apellidoPaterno }} {{ estudiante.apellidoMaterno }}</td>
                            <td>{{ estudiante.ci }}</td><td>{{ formatearFecha(estudiante.fechaNacimiento) }}</td>
                            <td>{{ estudiante.celularPadreMadre || '—' }}</td>
                            <td>{{ estudiante.curso }}</td>
                            <td><span :class="estudiante.estado === 'Activo' ? 'estado-lista-activo' : 'estado-lista-inactivo'">{{ estudiante.estado }}</span></td>
                        </tr>
                        <tr v-if="estudiantesFiltrados.length === 0"><td colspan="8" class="sin-listas">No se encontraron estudiantes.</td></tr>
                    </tbody>
                </table>
            </div>
        </main>
    </div>

    <section class="lista-para-imprimir">
        <h1>Lista de estudiantes - {{ cursoSeleccionado }}</h1>
        <p>Fecha de impresión: {{ new Date().toLocaleDateString('es-BO') }}</p>
        <table>
            <thead>
                <tr>
                    <th>N°</th>
                    <th>Nombre</th>
                    <th>Apellidos</th>
                    <th>CI</th>
                    <th>Celular padre/madre</th>
                    <th>Curso</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(estudiante, index) in estudiantesFiltrados" :key="`imp-${estudiante.id}`">
                    <td>{{ index + 1 }}</td>
                    <td>{{ estudiante.nombre }}</td>
                    <td>{{ estudiante.apellidoPaterno }} {{ estudiante.apellidoMaterno }}</td>
                    <td>{{ estudiante.ci }}</td>
                    <td>{{ estudiante.celularPadreMadre || '—' }}</td>
                    <td>{{ estudiante.curso }}</td>
                    <td>{{ estudiante.estado }}</td>
                </tr>
                <tr v-if="estudiantesFiltrados.length === 0">
                    <td colspan="7">No hay estudiantes para los filtros seleccionados.</td>
                </tr>
            </tbody>
        </table>
        <p class="total-impresion">Total de estudiantes: {{ estudiantesFiltrados.length }}</p>
    </section>
</template>
