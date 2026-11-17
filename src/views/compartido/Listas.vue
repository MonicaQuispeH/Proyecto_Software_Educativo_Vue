<script setup>
import {ref,computed,onMounted,watch} from 'vue'
import {useRoute} from 'vue-router'
import Navbar from '../../components/admin/Navbar.vue'
import Sidebar from '../../components/admin/Sidebar.vue'
import {api} from '../../services/api'
import '../../styles/admin/listas.css'
const route=useRoute()
const cursos=ref([]),filtroCurso=ref('Todos'),filtroEstado=ref('Todos'),busqueda=ref(''),estudiantes=ref([]),fecha=ref(new Date().toLocaleDateString('en-CA')),error=ref(''),aviso=ref('')
const etiqueta=c=>'3° '+String(c).slice(1)
async function cargar(){error.value='';try{if(filtroCurso.value==='Todos'){
 const r=await Promise.all(cursos.value.map(c=>api('/asistencia?curso='+c+'&fecha='+fecha.value)));estudiantes.value=r.flatMap((arr,i)=>arr.map(x=>({...x,curso:cursos.value[i],estado:'Activo',asistencia:x.estado||''})))
 }else{const r=await api('/asistencia?curso='+filtroCurso.value+'&fecha='+fecha.value);estudiantes.value=r.map(x=>({...x,curso:filtroCurso.value,estado:'Activo',asistencia:x.estado||''}))}}
 catch(e){error.value=e.message}}
onMounted(async()=>{try{cursos.value=await api('/docente/cursos');const solicitado=String(route.query.curso||'');filtroCurso.value=cursos.value.includes(solicitado)?solicitado:'Todos';await cargar()}catch(e){error.value=e.message}})
watch([filtroCurso,fecha],()=>cargar())
const estudiantesFiltrados=computed(()=>estudiantes.value.filter(x=>{const q=busqueda.value.toLowerCase(),txt=`${x.nombre} ${x.apellidoPaterno} ${x.apellidoMaterno} ${x.ci||''}`.toLowerCase();return(!q||txt.includes(q))&&(filtroCurso.value==='Todos'||x.curso===filtroCurso.value)&&(filtroEstado.value==='Todos'||x.estado===filtroEstado.value)}))
const cursoSeleccionado=computed(()=>filtroCurso.value==='Todos'?'Todos los cursos':etiqueta(filtroCurso.value))
function limpiarFiltros(){busqueda.value='';filtroEstado.value='Todos';filtroCurso.value='Todos'}
function formatearFecha(v){if(!v)return '—';const a=String(v).split('-');return a.length===3?a.reverse().join('/'):v}
function imprimirLista(){window.print()}
async function guardarAsistencia(){if(filtroCurso.value==='Todos'){error.value='Selecciona un paralelo para guardar su asistencia.';return}try{await api('/asistencia',{method:'PUT',body:JSON.stringify({curso:filtroCurso.value,fecha:fecha.value,registros:estudiantes.value.filter(x=>x.asistencia).map(x=>({id:x.id,estado:x.asistencia}))})});aviso.value='Asistencia guardada en PostgreSQL';await cargar()}catch(e){error.value=e.message}}
</script>
<template>
    <Navbar />
    <div class="listas-layout">
        <Sidebar />
        <main class="contenido">
            <div v-if="error" class="alert alert-danger" role="alert">{{error}}</div>
            <div v-if="aviso" class="alert alert-success">{{aviso}}</div>
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
                    <span>{{ etiqueta(curso) }}</span>
                    <strong>{{ estudiantes.filter(e => e.curso === curso).length }}</strong>
                    <small>estudiantes</small>
                </div>
            </div>

            <div class="barra-listas">
                <input v-model="fecha" type="date" class="filtro-listas" aria-label="Fecha de asistencia">
                <button type="button" class="btn-imprimir-lista" :disabled="filtroCurso==='Todos'" @click="guardarAsistencia">Guardar asistencia</button>
                <div class="busqueda-listas">
                    <i class="fas fa-search"></i>
                    <input v-model="busqueda" type="text" placeholder="Buscar por nombre, apellido o CI...">
                </div>
                <select v-model="filtroCurso" class="filtro-listas">
                    <option value="Todos">Todos los cursos</option>
                    <option v-for="curso in cursos" :key="curso" :value="curso">{{ etiqueta(curso) }}</option>
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
                    <thead><tr><th>N°</th><th>Nombre</th><th>Apellidos</th><th>CI</th><th>Fecha de nacimiento</th><th>Celular padre/madre</th><th>Curso</th><th>Estado</th><th>Asistencia</th></tr></thead>
                    <tbody>
                        <tr v-for="(estudiante, index) in estudiantesFiltrados" :key="estudiante.id">
                            <td>{{ index + 1 }}</td><td>{{ estudiante.nombre }}</td>
                            <td>{{ estudiante.apellidoPaterno }} {{ estudiante.apellidoMaterno }}</td>
                            <td>{{ estudiante.ci }}</td><td>{{ formatearFecha(estudiante.fechaNacimiento) }}</td>
                            <td>{{ estudiante.celularPadreMadre || '—' }}</td>
                            <td>{{ estudiante.curso }}</td>
                            <td><span :class="estudiante.estado === 'Activo' ? 'estado-lista-activo' : 'estado-lista-inactivo'">{{ estudiante.estado }}</span></td>
                            <td><select v-model="estudiante.asistencia" class="filtro-listas" :disabled="filtroCurso==='Todos'" aria-label="Asistencia"><option value="">Sin marcar</option><option value="P">Presente</option><option value="F">Falta</option><option value="L">Licencia</option></select></td>
                        </tr>
                        <tr v-if="estudiantesFiltrados.length === 0"><td colspan="9" class="sin-listas">No se encontraron estudiantes.</td></tr>
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
