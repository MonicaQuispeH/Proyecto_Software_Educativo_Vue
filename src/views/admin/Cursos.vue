<script setup>

import { ref, computed } from 'vue'

import Navbar from '../../components/admin/Navbar.vue'
import AlertaAdmin from '../../components/admin/AlertaAdmin.vue'
import '../../styles/admin/alertaAdmin.css'
import Sidebar from '../../components/admin/Sidebar.vue'
import TablaCursos from '../../components/admin/cursos/TablaCursos.vue'
import ModalCurso from '../../components/admin/cursos/ModalCurso.vue'

const alertaAdmin = ref('')
const tipoAlertaAdmin = ref('success')
function mostrarAlertaAdmin(mensaje, tipo = 'success') { tipoAlertaAdmin.value = tipo; alertaAdmin.value = mensaje }
function cerrarAlertaAdmin() { alertaAdmin.value = '' }

import '../../styles/admin/cursos.css'

const mostrarModal = ref(false)

const modoModal = ref('nuevo')

const cursoSeleccionado = ref(null)

const busqueda = ref('')

const filtroEstado = ref('Todos')

const cursos = ref([

    {
        id: 1,
        nombre: '3° A',
        estado: 'Activo'
    },

    {
        id: 2,
        nombre: '3° B',
        estado: 'Activo'
    },

    {
        id: 3,
        nombre: '3° C',
        estado: 'Activo'
    }

])

const cursosFiltrados = computed(() => {

    return cursos.value.filter(curso => {

        const coincideBusqueda =
            curso.nombre
                .toLowerCase()
                .includes(busqueda.value.toLowerCase())

        const coincideEstado =
            filtroEstado.value === 'Todos' ||
            curso.estado === filtroEstado.value

        return coincideBusqueda && coincideEstado

    })

})

function guardarCurso(curso) {

    if (
        modoModal.value === 'editar' &&
        cursoSeleccionado.value
    ) {

        const indice = cursos.value.findIndex(
            c => c.id === cursoSeleccionado.value.id
        )

        if (indice !== -1) {

            cursos.value[indice] = {

                id: cursoSeleccionado.value.id,

                nombre: curso.nombre,

                estado: cursoSeleccionado.value.estado

            }

        }

    }

    else {

        const nuevoCurso = {

            id: cursos.value.length > 0
                ? Math.max(...cursos.value.map(c => c.id)) + 1
                : 1,

            nombre: curso.nombre,

            estado: 'Activo'

        }

        cursos.value.push(nuevoCurso)

    }

    mostrarAlertaAdmin(modoModal.value === 'editar' ? 'Curso actualizado correctamente.' : 'Curso guardado correctamente.');
mostrarModal.value = false

    cursoSeleccionado.value = null

    modoModal.value = 'nuevo'

}

function editarCurso(curso) {

    cursoSeleccionado.value = curso

    modoModal.value = 'editar'

    mostrarModal.value = true

}

function cambiarEstado(curso) {

    curso.estado =
        curso.estado === 'Activo'
            ? 'Inactivo'
            : 'Activo'

    mostrarAlertaAdmin('Estado del curso actualizado correctamente.');

}

function abrirNuevoCurso() {

    modoModal.value = 'nuevo'

    cursoSeleccionado.value = null

    mostrarModal.value = true

}

</script>

<template>

    <Navbar />

    <div class="cursos-layout">

        <Sidebar />

        <main class="contenido">
            <AlertaAdmin :message="alertaAdmin" :type="tipoAlertaAdmin" @close="cerrarAlertaAdmin" />

            <div class="encabezado">

                <div>

                    <h1>
                        Gestión de Cursos
                    </h1>

                    <p>
                        Administre los cursos registrados en el sistema.
                    </p>

                </div>

                <button
                    class="btn-nuevo"
                    @click="abrirNuevoCurso"
                >

                    <i class="fas fa-plus"></i>

                    Nuevo Curso

                </button>

            </div>

            <div class="barra-herramientas">

                <div class="busqueda">

                    <i class="fas fa-search"></i>

                    <input
                        v-model="busqueda"
                        type="text"
                        placeholder="Buscar curso..."
                    >

                </div>

                <select v-model="filtroEstado">

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

            </div>

            <TablaCursos
                :cursos="cursosFiltrados"
                @editar="editarCurso"
                @cambiar-estado="cambiarEstado"
            />

            <ModalCurso
                :mostrar="mostrarModal"
                :modo="modoModal"
                :curso="cursoSeleccionado"
                @cerrar="mostrarModal = false"
                @guardar="guardarCurso"
            />

        </main>

    </div>

</template>