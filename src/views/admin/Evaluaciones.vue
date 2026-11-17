<script setup>
import { ref, computed, onMounted } from 'vue'

import Navbar from '../../components/admin/Navbar.vue'
import AlertaAdmin from '../../components/admin/AlertaAdmin.vue'
import '../../styles/admin/alertaAdmin.css'
import Sidebar from '../../components/admin/Sidebar.vue'
import TablaEvaluaciones from '../../components/admin/evaluaciones/TablaEvaluaciones.vue'
import ModalEvaluacion from '../../components/admin/evaluaciones/ModalEvaluacion.vue'
import '../../styles/admin/evaluaciones.css'

const alertaAdmin = ref('')
const tipoAlertaAdmin = ref('success')
function mostrarAlertaAdmin(mensaje, tipo = 'success') { tipoAlertaAdmin.value = tipo; alertaAdmin.value = mensaje }
function cerrarAlertaAdmin() { alertaAdmin.value = '' }

const mostrarModal = ref(false)
const modoModal = ref('nuevo')
const evaluacionSeleccionada = ref(null)

const busqueda = ref('')
const filtroEstado = ref('Todos')

const evaluaciones = ref([])
const lecturasDisponibles = ref([])

function cargarDatos() {
    try {
        const evaluacionesGuardadas = localStorage.getItem('evaluaciones')
        const lecturasGuardadas = localStorage.getItem('lecturas')

        evaluaciones.value = evaluacionesGuardadas
            ? JSON.parse(evaluacionesGuardadas)
            : []

        lecturasDisponibles.value = lecturasGuardadas
            ? JSON.parse(lecturasGuardadas)
            : []
    } catch (error) {
        console.error('No se pudieron cargar las evaluaciones:', error)
        evaluaciones.value = []
        lecturasDisponibles.value = []
    }
}

function guardarDatos() {
    localStorage.setItem('evaluaciones', JSON.stringify(evaluaciones.value))
}

onMounted(cargarDatos)

const evaluacionesFiltradas = computed(() => {
    const texto = busqueda.value.toLowerCase().trim()

    return evaluaciones.value.filter((evaluacion) => {
        const coincideBusqueda =
            !texto ||
            String(evaluacion.titulo || '').toLowerCase().includes(texto) ||
            String(evaluacion.lecturaTitulo || '').toLowerCase().includes(texto)

        const coincideEstado =
            filtroEstado.value === 'Todos' ||
            evaluacion.estado === filtroEstado.value

        return coincideBusqueda && coincideEstado
    })
})

function abrirNuevaEvaluacion() {
    cargarDatos()
    modoModal.value = 'nuevo'
    evaluacionSeleccionada.value = null
    mostrarModal.value = true
}

function editarEvaluacion(evaluacion) {
    modoModal.value = 'editar'
    evaluacionSeleccionada.value = evaluacion
    mostrarModal.value = true
}

function cerrarModal() {
    mostrarModal.value = false
    modoModal.value = 'nuevo'
    evaluacionSeleccionada.value = null
}

function guardarEvaluacion(datos) {
    if (modoModal.value === 'editar' && evaluacionSeleccionada.value) {
        const indice = evaluaciones.value.findIndex(
            item => item.id === evaluacionSeleccionada.value.id
        )

        if (indice !== -1) {
            evaluaciones.value[indice] = {
                ...evaluaciones.value[indice],
                ...datos
            }
        }
    } else {
        const nuevoId = evaluaciones.value.length === 0
            ? 1
            : Math.max(...evaluaciones.value.map(item => Number(item.id) || 0)) + 1

        evaluaciones.value.push({
            id: nuevoId,
            ...datos,
            estado: 'Activo'
        })
    }

    guardarDatos()
    
    mostrarAlertaAdmin(modoModal.value === 'editar' ? 'Evaluación actualizada correctamente.' : 'Evaluación creada correctamente.');
cerrarModal()
}

function cambiarEstado(evaluacion) {
    evaluacion.estado =
        evaluacion.estado === 'Activo'
            ? 'Inactivo'
            : 'Activo'

    guardarDatos()
    mostrarAlertaAdmin('Estado de la evaluación actualizado correctamente.');

}
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
        @cerrar="cerrarModal"
        @guardar="guardarEvaluacion"
    />
</template>
