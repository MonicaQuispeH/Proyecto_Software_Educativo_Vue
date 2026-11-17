<script setup>

import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

import Navbar from '../../components/admin/Navbar.vue'
import AlertaAdmin from '../../components/admin/AlertaAdmin.vue'
import '../../styles/admin/alertaAdmin.css'
import Sidebar from '../../components/admin/Sidebar.vue'

const alertaAdmin = ref('')
const tipoAlertaAdmin = ref('success')
function mostrarAlertaAdmin(mensaje, tipo = 'success') { tipoAlertaAdmin.value = tipo; alertaAdmin.value = mensaje }
function cerrarAlertaAdmin() { alertaAdmin.value = '' }

import TablaLecturas from '../../components/admin/lecturas/TablaLecturas.vue'
import ModalLectura from '../../components/admin/lecturas/ModalLectura.vue'

import '../../styles/admin/lecturas.css'

const mostrarModal = ref(false)

const modoModal = ref('nuevo')

const lecturaSeleccionada = ref(null)

const mostrarVisor = ref(false)
const lecturaVisor = ref(null)
const visorUrl = ref('')

const busqueda = ref('')

const filtroCurso = ref('Todos')

const filtroTrimestre = ref('Todos')

const filtroTipoArchivo = ref('Todos')

const filtroEstado = ref('Todos')

const lecturas = ref([])

function cargarLecturas() {
    try {
        const guardadas = localStorage.getItem('lecturas')
        lecturas.value = guardadas ? JSON.parse(guardadas) : []
    } catch (error) {
        console.error('No se pudieron cargar las lecturas:', error)
        lecturas.value = []
    }
}

onMounted(cargarLecturas)

watch(lecturas, (valor) => {
    try { localStorage.setItem('lecturas', JSON.stringify(valor.map(({ archivoObjeto, ...resto }) => resto))) } catch (error) { console.warn('No hay espacio suficiente en almacenamiento local para guardar los archivos PDF.', error); mostrarAlertaAdmin('El PDF es demasiado grande para guardarse en el navegador. La carga definitiva se realizará con el backend.', 'warning') }
}, { deep: true })

const cursos = [

    '3° A',
    '3° B',
    '3° C',
    '3° D'

]

const lecturasFiltradas = computed(() => {

    return lecturas.value.filter((lectura) => {

        const textoBusqueda =
            busqueda.value
                .toLowerCase()
                .trim()

        const coincideBusqueda =

            !textoBusqueda ||

            lectura.titulo
                .toLowerCase()
                .includes(textoBusqueda)

        const coincideCurso =

            filtroCurso.value === 'Todos' ||

            lectura.curso ===
            filtroCurso.value

        const coincideTrimestre =

            filtroTrimestre.value === 'Todos' ||

            lectura.trimestre ===
            filtroTrimestre.value

        const coincideTipoArchivo =

            filtroTipoArchivo.value === 'Todos' ||

            lectura.tipoArchivo ===
            filtroTipoArchivo.value

        const coincideEstado =

            filtroEstado.value === 'Todos' ||

            lectura.estado ===
            filtroEstado.value

        return (

            coincideBusqueda &&

            coincideCurso &&

            coincideTrimestre &&

            coincideTipoArchivo &&

            coincideEstado

        )

    })

})

function abrirNuevaLectura() {

    modoModal.value = 'nuevo'

    lecturaSeleccionada.value = null

    mostrarModal.value = true

}

function editarLectura(lectura) {

    modoModal.value = 'editar'

    lecturaSeleccionada.value = lectura

    mostrarModal.value = true

}

function cerrarModal() {

    mostrarModal.value = false

    modoModal.value = 'nuevo'

    lecturaSeleccionada.value = null

}

function archivoADataURL(archivo) {
    return new Promise((resolve, reject) => {
        const lector = new FileReader()
        lector.onload = () => resolve(lector.result)
        lector.onerror = () => reject(lector.error)
        lector.readAsDataURL(archivo)
    })
}

async function guardarLectura(datos) {

    if (

        modoModal.value === 'editar' &&

        lecturaSeleccionada.value

    ) {

        const indice =
            lecturas.value.findIndex(

                (lectura) =>

                    lectura.id ===
                    lecturaSeleccionada.value.id

            )

        if (indice !== -1) {

            const lecturaAnterior =
                lecturas.value[indice]

            let archivoNombre =
                lecturaAnterior.archivo

            let archivoObjeto =
                lecturaAnterior.archivoObjeto

            let tipoArchivo =
                lecturaAnterior.tipoArchivo

            let archivoDataUrl =
                lecturaAnterior.archivoDataUrl || ''

            if (datos.archivo) {

                archivoNombre =
                    datos.archivo.name

                archivoObjeto =
                    datos.archivo

                archivoDataUrl =
                    await archivoADataURL(datos.archivo)

                tipoArchivo =
                    datos.archivo.type ===
                    'application/pdf'

                        ? 'PDF'

                        : 'Imagen'

            }

            lecturas.value[indice] = {

                ...lecturaAnterior,

                titulo:
                    datos.titulo,

                curso:
                    datos.curso,

                trimestre:
                    datos.trimestre,

                archivo:
                    archivoNombre,

                archivoObjeto:
                    archivoObjeto,

                archivoDataUrl:
                    archivoDataUrl,

                tipoArchivo:
                    tipoArchivo

            }

        }

        cerrarModal()

        return

    }

    if (!datos.archivo) {

        mostrarAlertaAdmin('Seleccione un archivo PDF o imagen antes de guardar la lectura.', 'warning')

        return

    }

    const nuevoId =

        lecturas.value.length === 0

            ? 1

            : Math.max(

                ...lecturas.value.map(
                    lectura => lectura.id
                )

            ) + 1

    const tipoArchivo =

        datos.archivo.type ===
        'application/pdf'

            ? 'PDF'

            : 'Imagen'

    const archivoDataUrl =
        await archivoADataURL(datos.archivo)

    const nuevaLectura = {

        id:
            nuevoId,

        titulo:
            datos.titulo,

        curso:
            datos.curso,

        trimestre:
            datos.trimestre,

        archivo:
            datos.archivo.name,

        archivoObjeto:
            datos.archivo,

        archivoDataUrl:
            archivoDataUrl,

        tipoArchivo:
            tipoArchivo,

        estado:
            'Activo'

    }

    lecturas.value.push(
        nuevaLectura
    )

    mostrarAlertaAdmin(modoModal.value === 'editar' ? 'Lectura actualizada correctamente.' : 'Lectura registrada correctamente.');
cerrarModal()

}

function cambiarEstado(lectura) {

    lectura.estado =

        lectura.estado === 'Activo'

            ? 'Inactivo'

            : 'Activo'

    mostrarAlertaAdmin('Estado de la lectura actualizado correctamente.');

}

function dataUrlABlobUrl(dataUrl) {
    const partes = dataUrl.split(',')

    if (partes.length !== 2) {
        return ''
    }

    const encabezado = partes[0]
    const base64 = partes[1]
    const coincidencia = encabezado.match(/data:(.*?);base64/)
    const tipo = coincidencia ? coincidencia[1] : 'application/octet-stream'
    const binario = atob(base64)
    const bytes = new Uint8Array(binario.length)

    for (let i = 0; i < binario.length; i++) {
        bytes[i] = binario.charCodeAt(i)
    }

    return URL.createObjectURL(
        new Blob([bytes], { type: tipo })
    )
}

function liberarVisorUrl() {
    if (visorUrl.value) {
        URL.revokeObjectURL(visorUrl.value)
        visorUrl.value = ''
    }
}

function verLectura(lectura) {
    if (!lectura.archivoDataUrl) {
        mostrarAlertaAdmin('El archivo no está disponible. Edite la lectura y seleccione el archivo nuevamente.', 'warning')
        return
    }

    liberarVisorUrl()

    try {
        visorUrl.value = dataUrlABlobUrl(lectura.archivoDataUrl)

        if (!visorUrl.value) {
            throw new Error('No se pudo crear la URL del archivo.')
        }

        lecturaVisor.value = lectura
        mostrarVisor.value = true
    } catch (error) {
        console.error('No se pudo preparar el archivo para visualizarlo:', error)
        mostrarAlertaAdmin('No se pudo abrir el archivo. Selecciónelo de nuevo.', 'danger')
    }
}

function cerrarVisor() {
    mostrarVisor.value = false
    lecturaVisor.value = null
    liberarVisorUrl()
}

onBeforeUnmount(() => {
    liberarVisorUrl()
})

</script>

<template>

    <Navbar />

    <div class="lecturas-layout">

        <Sidebar />

        <main class="contenido">
            <AlertaAdmin :message="alertaAdmin" :type="tipoAlertaAdmin" @close="cerrarAlertaAdmin" />

            <div class="encabezado">

                <div>

                    <h1>
                        Gestión de Lecturas
                    </h1>

                    <p>
                        Administre las lecturas disponibles para los estudiantes.
                    </p>

                </div>

                <button
                    type="button"
                    class="btn-nuevo"
                    @click="abrirNuevaLectura"
                >

                    <i class="fas fa-plus"></i>

                    Nueva Lectura

                </button>

            </div>

            <div class="barra-herramientas-lecturas">

                <div class="busqueda-lecturas">

                    <i class="fas fa-search"></i>

                    <input
                        v-model="busqueda"
                        type="text"
                        placeholder="Buscar lectura..."
                    >

                </div>

                <select
                    v-model="filtroCurso"
                    class="filtro-lecturas"
                >

                    <option value="Todos">
                        Todos los cursos
                    </option>

                    <option
                        v-for="curso in cursos"
                        :key="curso"
                        :value="curso"
                    >

                        {{ curso }}

                    </option>

                </select>

                <select
                    v-model="filtroTrimestre"
                    class="filtro-lecturas"
                >

                    <option value="Todos">
                        Todos los trimestres
                    </option>

                    <option value="Primer trimestre">
                        Primer trimestre
                    </option>

                    <option value="Segundo trimestre">
                        Segundo trimestre
                    </option>

                    <option value="Tercer trimestre">
                        Tercer trimestre
                    </option>

                </select>

                <select
                    v-model="filtroTipoArchivo"
                    class="filtro-lecturas"
                >

                    <option value="Todos">
                        Todos los archivos
                    </option>

                    <option value="PDF">
                        PDF
                    </option>

                    <option value="Imagen">
                        Imagen
                    </option>

                </select>

                <select
                    v-model="filtroEstado"
                    class="filtro-lecturas"
                >

                    <option value="Todos">
                        Todos los estados
                    </option>

                    <option value="Activo">
                        Activas
                    </option>

                    <option value="Inactivo">
                        Inactivas
                    </option>

                </select>

            </div>

            <TablaLecturas

                :lecturas="lecturasFiltradas"

                @ver="verLectura"

                @editar="editarLectura"

                @cambiar-estado="cambiarEstado"

            />

        </main>

    </div>

    <ModalLectura

        :mostrar="mostrarModal"

        :modo="modoModal"

        :lectura="lecturaSeleccionada"

        @cerrar="cerrarModal"

        @guardar="guardarLectura"

    />

    <div
        v-if="mostrarVisor"
        class="visor-lectura-fondo"
        @click.self="cerrarVisor"
    >

        <div class="visor-lectura-modal">

            <div class="visor-lectura-encabezado">

                <div>
                    <h2>{{ lecturaVisor?.titulo }}</h2>
                    <span>{{ lecturaVisor?.archivo }}</span>
                </div>

                <button
                    type="button"
                    class="btn-cerrar-visor-lectura"
                    title="Cerrar visor"
                    @click="cerrarVisor"
                >
                    <i class="fas fa-times"></i>
                </button>

            </div>

            <div class="visor-lectura-contenido">

                <iframe
                    v-if="lecturaVisor?.tipoArchivo === 'PDF'"
                    :src="visorUrl + '#toolbar=1&navpanes=0'"
                    title="Visor PDF"
                ></iframe>

                <img
                    v-else
                    :src="visorUrl"
                    :alt="lecturaVisor?.titulo"
                >

            </div>

        </div>

    </div>

</template>