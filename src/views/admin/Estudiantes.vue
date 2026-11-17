<script setup>
import {ref,computed,onMounted} from 'vue'
import {api} from '../../services/api.js'
import Navbar from '../../components/admin/Navbar.vue'
import Sidebar from '../../components/admin/Sidebar.vue'
import TablaEstudiantes from '../../components/admin/estudiantes/TablaEstudiantes.vue'
import AlertaAdmin from '../../components/admin/AlertaAdmin.vue'
import '../../styles/admin/alertaAdmin.css'
import '../../styles/admin/estudiantes.css'
const alertaAdmin=ref(''),tipoAlertaAdmin=ref('success'),erroresEstudiante=ref({}),cargando=ref(false)
const mostrarAlertaAdmin=(mensaje,tipo='success')=>{alertaAdmin.value=mensaje;tipoAlertaAdmin.value=tipo}
const cerrarAlertaAdmin=()=>alertaAdmin.value=''
const estudiantes=ref([]),mostrarModal=ref(false),modoModal=ref('nuevo'),estudianteSeleccionado=ref(null)
const busquedaNombre=ref(''),busquedaCI=ref(''),filtroCurso=ref('Todos'),filtroEstado=ref('Todos')
const cursoLegible=c=>'3° '+String(c||'').replace('3','')
const norm=d=>({...d,curso:cursoLegible(d.curso),estado:d.activo?'Activo':'Inactivo'})
async function cargarEstudiantes(){cargando.value=true;try{estudiantes.value=(await api('/admin/estudiantes')).map(norm)}catch(e){mostrarAlertaAdmin(e.message,'danger')}finally{cargando.value=false}}
onMounted(cargarEstudiantes)
const estudiantesFiltrados=computed(()=>estudiantes.value.filter(e=>`${e.nombre} ${e.apellidoPaterno} ${e.apellidoMaterno}`.toLowerCase().includes(busquedaNombre.value.toLowerCase())&&String(e.ci||'').includes(busquedaCI.value)&&(filtroCurso.value==='Todos'||filtroCurso.value===e.curso)&&(filtroEstado.value==='Todos'||filtroEstado.value===e.estado)))
const soloLetras=/^[\p{L}]+(?:[ '\-][\p{L}]+)*$/u
function limpiarErrorEstudiante(c){if(erroresEstudiante.value[c]){let e={...erroresEstudiante.value};delete e[c];erroresEstudiante.value=e}}
function validarEstudiante(d){const e={};for(const [c,l] of [['nombre','El nombre'],['apellidoPaterno','El apellido paterno'],['apellidoMaterno','El apellido materno']]){if(!soloLetras.test(String(d[c]||'').trim()))e[c]=`${l} debe contener solamente letras.`}
 if(!/^\d{5,10}$/.test(d.ci||''))e.ci='El CI debe tener entre 5 y 10 dígitos.';
 if(!/^\d{8}$/.test(d.celularPadreMadre||''))e.celularPadreMadre='El celular debe tener 8 dígitos.';
 if(!/^\d{4}-\d{2}-\d{2}$/.test(d.fechaNacimiento||'')||d.fechaNacimiento>new Date().toISOString().slice(0,10))e.fechaNacimiento='La fecha no puede ser futura.';
 if(!['3A','3B','3C','3D','3° A','3° B','3° C','3° D'].includes(d.curso))e.curso='Seleccione un curso.';
 erroresEstudiante.value=e;return !Object.keys(e).length}
async function enviarFormularioEstudiante(evento){const datos=Object.fromEntries(new FormData(evento.currentTarget).entries());if(!validarEstudiante(datos)||cargando.value)return;await guardarEstudiante(datos)}
function abrirNuevoEstudiante(){modoModal.value='nuevo';estudianteSeleccionado.value=null;erroresEstudiante.value={};mostrarModal.value=true}
function editarEstudiante(e){modoModal.value='editar';estudianteSeleccionado.value=e;erroresEstudiante.value={};mostrarModal.value=true}
async function cambiarEstado(e){if(!confirm(`¿${e.activo?'Desactivar':'Activar'} a ${e.nombre}?`))return;try{await api(`/admin/estudiantes/${e.id}/estado`,{method:'PATCH',body:JSON.stringify({activo:!e.activo})});mostrarAlertaAdmin('Estado actualizado.');await cargarEstudiantes()}catch(err){mostrarAlertaAdmin(err.message,'danger')}}
function cambiarPassword(){mostrarAlertaAdmin('Los estudiantes no usan contraseña. El docente autoriza su acceso desde su panel.','warning')}
async function guardarEstudiante(d){cargando.value=true;try{await api(modoModal.value==='editar'?`/admin/estudiantes/${estudianteSeleccionado.value.id}`:'/admin/estudiantes',{method:modoModal.value==='editar'?'PUT':'POST',body:JSON.stringify(d)});mostrarAlertaAdmin(modoModal.value==='editar'?'Estudiante actualizado.':'Estudiante registrado.');cerrarModal();await cargarEstudiantes()}catch(e){mostrarAlertaAdmin(e.message,'danger')}finally{cargando.value=false}}
function cerrarModal(){mostrarModal.value=false;estudianteSeleccionado.value=null;erroresEstudiante.value={};modoModal.value='nuevo'}
function limpiarFiltros(){busquedaNombre.value='';busquedaCI.value='';filtroCurso.value='Todos';filtroEstado.value='Todos'}
</script>

<template>

    <Navbar />

    <div class="estudiantes-layout">

        <Sidebar />

        <main class="contenido">
            <AlertaAdmin :message="alertaAdmin" :type="tipoAlertaAdmin" @close="cerrarAlertaAdmin" />

            <div class="encabezado">

                <div>

                    <h1>
                        Gestión de Estudiantes
                    </h1>

                    <p>
                        Administre los estudiantes registrados en el sistema.
                    </p>

                </div>

                <button
                    class="btn-nuevo"
                    @click="abrirNuevoEstudiante"
                >

                    <i class="fas fa-plus"></i>

                    Nuevo Estudiante

                </button>

            </div>

            <div class="barra-herramientas">

                <div class="busqueda">

                    <i class="fas fa-search"></i>

                    <input
                        v-model="busquedaNombre"
                        type="text"
                        placeholder="Buscar por nombre..."
                    >

                </div>

                <div class="busqueda busqueda-ci">

                    <i class="fas fa-id-card"></i>

                    <input
                        v-model="busquedaCI"
                        type="text"
                        placeholder="Buscar por CI..."
                    >

                </div>

                <select
                    v-model="filtroCurso"
                >

                    <option value="Todos">
                        Todos los cursos
                    </option>

                    <option value="3° A">
                        3° A
                    </option>

                    <option value="3° B">
                        3° B
                    </option>

                    <option value="3° C">
                        3° C
                    </option>

                    <option value="3° D">
                        3° D
                    </option>

                </select>

                <select
                    v-model="filtroEstado"
                >

                    <option value="Todos">
                        Todos los estados
                    </option>

                    <option value="Activo">
                        Activos
                    </option>

                    <option value="Inactivo">
                        Inactivos
                    </option>

                </select>

                <button
                    class="btn-limpiar"
                    @click="limpiarFiltros"
                    title="Limpiar filtros"
                >

                    <i class="fas fa-rotate-left"></i>

                </button>

            </div>

            <TablaEstudiantes
                :estudiantes="estudiantesFiltrados"
                @editar="editarEstudiante"
                
                @cambiar-estado="cambiarEstado"
            />

            <div
                v-if="mostrarModal"
                class="modal-fondo"
                @click.self="cerrarModal"
            >

                <div class="modal-contenido">

                    <div class="modal-encabezado">

                        <h2>

                            {{
                                modoModal === 'nuevo'
                                    ? 'Nuevo Estudiante'
                                    : 'Editar Estudiante'
                            }}

                        </h2>

                        <button
                            class="btn-cerrar"
                            @click="cerrarModal"
                        >

                            <i class="fas fa-times"></i>

                        </button>

                    </div>

                    <form novalidate @submit.prevent="enviarFormularioEstudiante" @input="limpiarErrorEstudiante($event.target.name)" @change="limpiarErrorEstudiante($event.target.name)">

                        <div class="campo">

                            <label>
                                Nombre
                            </label>

                            <input
                                name="nombre"
                                type="text"
                                required
                                :value="
                                    estudianteSeleccionado?.nombre || ''
                                "
                                placeholder="Ingrese el nombre"
                            >
                            <p v-if="erroresEstudiante.nombre" class="error-campo-estudiante" role="alert">{{ erroresEstudiante.nombre }}</p>

                        </div>

                        <div class="campo">

                            <label>
                                Apellido paterno
                            </label>

                            <input
                                name="apellidoPaterno"
                                type="text"
                                required
                                :value="
                                    estudianteSeleccionado?.apellidoPaterno || ''
                                "
                                placeholder="Ingrese el apellido paterno"
                            >
                            <p v-if="erroresEstudiante.apellidoPaterno" class="error-campo-estudiante" role="alert">{{ erroresEstudiante.apellidoPaterno }}</p>

                        </div>

                        <div class="campo">

                            <label>
                                Apellido materno
                            </label>

                            <input
                                name="apellidoMaterno"
                                type="text"
                                required
                                :value="
                                    estudianteSeleccionado?.apellidoMaterno || ''
                                "
                                placeholder="Ingrese el apellido materno"
                            >
                            <p v-if="erroresEstudiante.apellidoMaterno" class="error-campo-estudiante" role="alert">{{ erroresEstudiante.apellidoMaterno }}</p>

                        </div>

                        <div class="campo">

                            <label>
                                CI
                            </label>

                            <input
                                name="ci"
                                type="text"
                                required
                                :value="
                                    estudianteSeleccionado?.ci || ''
                                "
                                placeholder="Ingrese el CI"
                            >
                            <p v-if="erroresEstudiante.ci" class="error-campo-estudiante" role="alert">{{ erroresEstudiante.ci }}</p>

                        </div>

                        <div class="campo">

                            <label>
                                Fecha de nacimiento
                            </label>

                            <input
                                name="fechaNacimiento"
                                type="date"
                                required
                                :value="
                                    estudianteSeleccionado?.fechaNacimiento || ''
                                "
                            >
                            <p v-if="erroresEstudiante.fechaNacimiento" class="error-campo-estudiante" role="alert">{{ erroresEstudiante.fechaNacimiento }}</p>

                        </div>

                        <div class="campo">

                            <label>
                                Celular del padre o madre
                            </label>

                            <input
                                name="celularPadreMadre"
                                type="tel"
                                required
                                :value="
                                    estudianteSeleccionado?.celularPadreMadre || ''
                                "
                                placeholder="Ej. 72412345"
                                maxlength="15"
                            >
                            <p v-if="erroresEstudiante.celularPadreMadre" class="error-campo-estudiante" role="alert">{{ erroresEstudiante.celularPadreMadre }}</p>

                        </div>

                        <div class="campo">

                            <label>
                                Curso
                            </label>

                            <select
                                name="curso"
                                required
                            >

                                <option value="">
                                    Seleccione un curso
                                </option>

                                <option
                                    value="3A"
                                    :selected="
                                        estudianteSeleccionado?.curso === '3° A'
                                    "
                                >
                                    3° A
                                </option>

                                <option
                                    value="3B"
                                    :selected="
                                        estudianteSeleccionado?.curso === '3° B'
                                    "
                                >
                                    3° B
                                </option>

                                <option
                                    value="3C"
                                    :selected="
                                        estudianteSeleccionado?.curso === '3° C'
                                    "
                                >
                                    3° C
                                </option>

                                <option
                                    value="3D"
                                    :selected="
                                        estudianteSeleccionado?.curso === '3° D'
                                    "
                                >
                                    3° D
                                </option>

                            </select>

                            <p v-if="erroresEstudiante.curso" class="error-campo-estudiante" role="alert">{{ erroresEstudiante.curso }}</p>
                        </div>

                        <div class="modal-acciones">

                            <button
                                type="button"
                                class="btn-cancelar"
                                @click="cerrarModal"
                            >

                                Cancelar

                            </button>

                            <button
                                type="submit"
                                class="btn-guardar"
                            >

                                <i class="fas fa-save"></i>

                                Guardar

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </main>

    </div>

</template>