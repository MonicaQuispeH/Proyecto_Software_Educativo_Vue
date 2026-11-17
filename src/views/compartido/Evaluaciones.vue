<script setup>
import { ref, computed, onMounted } from 'vue'
import Navbar from '../../components/admin/Navbar.vue'
import Sidebar from '../../components/admin/Sidebar.vue'
import AlertaAdmin from '../../components/admin/AlertaAdmin.vue'
import TablaEvaluaciones from '../../components/admin/evaluaciones/TablaEvaluaciones.vue'
import ModalEvaluacion from '../../components/admin/evaluaciones/ModalEvaluacion.vue'
import {api,getSession} from '../../services/api'
import '../../styles/admin/evaluaciones.css'
import '../../styles/admin/alertaAdmin.css'
const alertaAdmin=ref(''),tipoAlertaAdmin=ref('success')
const mostrarAlertaAdmin=(mensaje,tipo='success')=>{alertaAdmin.value=mensaje;tipoAlertaAdmin.value=tipo}
const cerrarAlertaAdmin=()=>alertaAdmin.value=''
const mostrarModal=ref(false),modoModal=ref('nuevo'),evaluacionSeleccionada=ref(null)
const busqueda=ref(''),filtroEstado=ref('Todos'),evaluaciones=ref([]),lecturasDisponibles=ref([]),cursos=ref([])
const seleccionCursos=ref([]),guardando=ref(false)
const session=getSession(),admin=session?.user?.rol==='ADMIN'
const puedeEditar=x=>admin||String(x.autorId)===String(session?.user?.id)
async function cargarDatos(){try{const [items,lecturas,permitidos]=await Promise.all([api('/contenidos/evaluaciones'),api('/contenidos/lecturas'),api('/docente/cursos')]);
 cursos.value=permitidos;lecturasDisponibles.value=lecturas.filter(x=>x.activa).map(x=>({...x,curso:(x.cursos||[]).map(c=>'3° '+c.slice(1)).join(', ')}));
 evaluaciones.value=items.map(x=>({...x,estado:x.activa?'Activo':'Inactivo',preguntas:[],lecturaTitulo:x.lecturaTitulo||'',autorId:x.autorId}));
 await Promise.all(evaluaciones.value.filter(puedeEditar).map(async e=>{try{const p=await api('/contenidos/evaluaciones/'+e.id+'/preguntas');e.preguntas=Array.from({length:p.length},()=>({}))}catch{}}));
 }catch(e){mostrarAlertaAdmin(e.message,'danger')}}
onMounted(cargarDatos)
const evaluacionesFiltradas=computed(()=>evaluaciones.value.filter(e=>(!busqueda.value||String(e.titulo).toLowerCase().includes(busqueda.value.toLowerCase())||String(e.lecturaTitulo).toLowerCase().includes(busqueda.value.toLowerCase()))&&(filtroEstado.value==='Todos'||e.estado===filtroEstado.value)))
function abrirNuevaEvaluacion(){modoModal.value='nuevo';evaluacionSeleccionada.value=null;seleccionCursos.value=[];mostrarModal.value=true}
async function editarEvaluacion(e){if(!puedeEditar(e)){mostrarAlertaAdmin('Solo puedes editar evaluaciones propias','danger');return}try{const preguntas=await api('/contenidos/evaluaciones/'+e.id+'/preguntas');evaluacionSeleccionada.value={...e,preguntas:preguntas.map((p,i)=>({id:p.id||i+1,texto:p.enunciado,opciones:p.opciones.map((o,k)=>({id:k+1,texto:o,correcta:k===Number(p.correcta)}))}))};seleccionCursos.value=[...(e.cursos||[])];modoModal.value='editar';mostrarModal.value=true}catch(err){mostrarAlertaAdmin(err.message,'danger')}}
function cerrarModal(){mostrarModal.value=false;modoModal.value='nuevo';evaluacionSeleccionada.value=null}
async function guardarEvaluacion(datos){if(guardando.value)return;guardando.value=true;try{const preguntas=datos.preguntas.map(p=>({enunciado:p.texto,opciones:p.opciones.map(o=>o.texto),correcta:p.opciones.findIndex(o=>o.correcta)}));await api('/contenidos/evaluaciones'+(evaluacionSeleccionada.value?'/'+evaluacionSeleccionada.value.id:''),{method:evaluacionSeleccionada.value?'PUT':'POST',body:JSON.stringify({titulo:datos.titulo,lecturaId:Number(datos.lecturaId),cursos:seleccionCursos.value,preguntas})});cerrarModal();mostrarAlertaAdmin('Evaluación guardada correctamente');await cargarDatos()}catch(e){mostrarAlertaAdmin(e.message,'danger')}finally{guardando.value=false}}
async function cambiarEstado(e){if(!puedeEditar(e))return mostrarAlertaAdmin('Solo puedes modificar evaluaciones propias','danger');if(e.activa){try{await api('/contenidos/evaluaciones/'+e.id,{method:'DELETE'});mostrarAlertaAdmin('Evaluación desactivada');await cargarDatos()}catch(err){mostrarAlertaAdmin(err.message,'danger')}}else mostrarAlertaAdmin('La reactivación de evaluaciones requiere un control de intentos; crea una nueva evaluación.','warning')}
</script>
<template>
    <Navbar />

    <div class="evaluaciones-layout">
        <Sidebar />

        <main class="contenido">
            <AlertaAdmin :message="alertaAdmin" :type="tipoAlertaAdmin" @close="cerrarAlertaAdmin" />
            <div class="encabezado">
                <div>
                    <h1>Gestión de Evaluaciones</h1>
                    <p>Administre las evaluaciones que responderán los estudiantes.</p>
                </div>

                <button
                    type="button"
                    class="btn-nueva-evaluacion"
                    @click.stop="abrirNuevaEvaluacion"
                >
                    <i class="fas fa-plus"></i>
                    Nueva Evaluación
                </button>
            </div>

            <div class="barra-herramientas-evaluaciones">
                <div class="busqueda-evaluaciones">
                    <i class="fas fa-search"></i>
                    <input
                        v-model="busqueda"
                        type="text"
                        placeholder="Buscar evaluación..."
                    >
                </div>

                <select v-model="filtroEstado" class="filtro-evaluaciones">
                    <option value="Todos">Todos los estados</option>
                    <option value="Activo">Activas</option>
                    <option value="Inactivo">Inactivas</option>
                </select>
            </div>

            <TablaEvaluaciones
                :evaluaciones="evaluacionesFiltradas"
                @editar="editarEvaluacion"
                @cambiar-estado="cambiarEstado"
            />
        </main>
    </div>

    <ModalEvaluacion
        :mostrar="mostrarModal"
        :modo="modoModal"
        :evaluacion="evaluacionSeleccionada"
        :lecturas="lecturasDisponibles"
        :cursos-disponibles="cursos"
        :cursos-asignados="seleccionCursos"
        @cambiar-cursos="(c,marcado)=>seleccionCursos=marcado?[...seleccionCursos,c]:seleccionCursos.filter(x=>x!==c)"
        @cerrar="cerrarModal"
        @guardar="guardarEvaluacion"
    />
</template>
