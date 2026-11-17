<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '../../services/api.js'
import Navbar from '../../components/admin/Navbar.vue'
import AlertaAdmin from '../../components/admin/AlertaAdmin.vue'
import Sidebar from '../../components/admin/Sidebar.vue'
import TablaDocentes from '../../components/admin/docentes/TablaDocentes.vue'
import ModalDocente from '../../components/admin/docentes/ModalDocente.vue'
import '../../styles/admin/alertaAdmin.css'
import '../../styles/admin/docentes.css'

const alertaAdmin = ref('')
const tipoAlertaAdmin = ref('success')
const mostrarAlertaAdmin = (mensaje, tipo = 'success') => { alertaAdmin.value = mensaje; tipoAlertaAdmin.value = tipo }
const cerrarAlertaAdmin = () => { alertaAdmin.value = '' }
const docentes = ref([])
const cargando = ref(false)
const mostrandoCredenciales = ref(null)
const mostrarModal = ref(false)
const errorModal = ref('')
const modoModal = ref('nuevo')
const docenteSeleccionado = ref(null)
const mostrarModalPassword = ref(false)
const docentePassword = ref(null)
const nuevaPassword = ref('')
const textoBusqueda = ref('')
const cursoSeleccionado = ref('Todos los cursos')
const cursoLegible = c => c.replace('3', '3° ')
const normalizar = d => ({ ...d, cursos: d.cursos || [], curso: (d.cursos || []).map(cursoLegible).join(', ') || 'Sin asignar', estado: d.activo ? 'Activo' : 'Inactivo' })
async function cargarDocentes() {
  cargando.value = true
  try { docentes.value = (await api('/admin/docentes')).map(normalizar) }
  catch (e) { mostrarAlertaAdmin(e.message, 'danger') }
  finally { cargando.value = false }
}
onMounted(cargarDocentes)
const docentesFiltrados = computed(() => docentes.value.filter(d => {
  const t = textoBusqueda.value.toLowerCase().trim()
  const coincide = [d.nombre, d.apellidoPaterno, d.apellidoMaterno, d.ci, d.usuario].some(x => String(x || '').toLowerCase().includes(t))
  const curso = cursoSeleccionado.value === 'Todos los cursos' || d.cursos.includes(cursoSeleccionado.value.replace('° ', ''))
  return coincide && curso
}))
async function guardarDocente(datos) {
  if (cargando.value) return
  cargando.value = true
  errorModal.value = ''
  try {
    if (modoModal.value === 'editar') {
      await api(`/admin/docentes/${docenteSeleccionado.value.id}`, { method: 'PUT', body: JSON.stringify(datos) })
      mostrarAlertaAdmin('Docente actualizado correctamente.')
    } else {
      const creado = await api('/admin/docentes', { method: 'POST', body: JSON.stringify(datos) })
      mostrandoCredenciales.value = { usuario: creado.usuario, passwordTemporal: creado.passwordTemporal }
      mostrarAlertaAdmin('Docente registrado. Guarda sus credenciales temporales.')
    }
    cerrarModal(); await cargarDocentes()
  } catch(e) { errorModal.value = e.message; mostrarAlertaAdmin(e.message, 'danger') }
  finally { cargando.value = false }
}
function editarDocente(d) { errorModal.value = ''; docenteSeleccionado.value = d; modoModal.value = 'editar'; mostrarModal.value = true }
async function cambiarEstado(d) {
  if (cargando.value) return
  if (!window.confirm(`¿${d.activo ? 'Desactivar' : 'Activar'} a ${d.nombre}?`)) return
  cargando.value = true
  try {
    await api(`/admin/docentes/${d.id}/estado`, { method:'PATCH', body:JSON.stringify({ activo: !d.activo }) })
    mostrarAlertaAdmin('Estado actualizado correctamente.')
    await cargarDocentes()
  } catch(e) { mostrarAlertaAdmin(e.message, 'danger') }
  finally { cargando.value = false }
}
function cambiarPassword(d) { docentePassword.value = d; nuevaPassword.value = ''; mostrarModalPassword.value = true }
async function guardarPassword() {
  if (cargando.value) return
  cargando.value = true
  try {
    const dato = await api(`/admin/docentes/${docentePassword.value.id}/password`, { method:'PATCH', body:JSON.stringify({}) })
    mostrandoCredenciales.value={usuario:docentePassword.value.usuario,passwordTemporal:dato.passwordTemporal}
    mostrarAlertaAdmin('Contraseña temporal generada. Compártela de forma privada; el docente deberá cambiarla al ingresar.')
    cerrarModalPassword()
  } catch(e) { mostrarAlertaAdmin(e.message, 'danger') }
  finally { cargando.value = false }
}
function cerrarModal() { mostrarModal.value = false; docenteSeleccionado.value = null; modoModal.value = 'nuevo' }
function cerrarModalPassword() { mostrarModalPassword.value = false; docentePassword.value = null; nuevaPassword.value = '' }
function abrirNuevoDocente() { errorModal.value = ''; modoModal.value = 'nuevo'; docenteSeleccionado.value = null; mostrarModal.value = true }
</script>
<template>

    <Navbar />

    <div class="docentes-layout">

        <Sidebar />

        <main class="contenido">
            <AlertaAdmin :message="alertaAdmin" :type="tipoAlertaAdmin" @close="cerrarAlertaAdmin" />
            <div v-if="mostrandoCredenciales" class="alert alert-warning mt-3" role="status">
                <strong>Credenciales temporales del docente (se muestran una sola vez)</strong>
                <p class="mb-1">Usuario: <code>{{ mostrandoCredenciales.usuario }}</code></p>
                <p class="mb-2">Contraseña: <code>{{ mostrandoCredenciales.passwordTemporal }}</code></p>
                <button type="button" class="btn btn-primary" @click="mostrandoCredenciales = null">Ya las guardé</button>
            </div>
            <div v-if="cargando" class="alert alert-info">Procesando solicitud...</div>

            <div class="encabezado">

                <div>

                    <h1>
                        Gestión de Docentes
                    </h1>

                    <p>
                        Administre los docentes registrados en el sistema.
                    </p>

                </div>

                <button
                    class="btn-nuevo"
                    @click="abrirNuevoDocente"
                >

                    <i class="fas fa-plus"></i>

                    Nuevo Docente

                </button>

            </div>

            <div class="barra-herramientas">

                <div class="busqueda">

                    <i class="fas fa-search"></i>

                    <input
                        v-model="textoBusqueda"
                        type="text"
                        placeholder="Buscar docente..."
                    >

                </div>

                <select v-model="cursoSeleccionado">

                    <option value="Todos los cursos">
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

            </div>

            <TablaDocentes
                :docentes="docentesFiltrados"
                @editar="editarDocente"
                @cambiar-estado="cambiarEstado"
                @cambiar-password="cambiarPassword"
            />

            <ModalDocente
                :mostrar="mostrarModal"
                :modo="modoModal"
                :docente="docenteSeleccionado"
                :error-servidor="errorModal"
                :guardando="cargando"
                @cerrar="cerrarModal"
                @guardar="guardarDocente"
            />

            <div
                v-if="mostrarModalPassword"
                class="password-modal-fondo"
                @click.self="cerrarModalPassword"
            >

                <div class="password-modal">

                    <div class="password-modal-encabezado">

                        <div>

                            <h2>
                                Restablecer contraseña
                            </h2>

                            <p>
                                {{ docentePassword?.nombre }}
                                {{ docentePassword?.apellidoPaterno }}
                            </p>

                        </div>

                        <button
                            class="btn-cerrar-password"
                            @click="cerrarModalPassword"
                        >

                            <i class="fas fa-times"></i>

                        </button>

                    </div>

                    <div class="password-modal-contenido">

                        <div class="campo-password">

                            <p>Se generará una contraseña temporal segura para este docente. Deberá establecer su contraseña personal en el siguiente ingreso.</p>

                        </div>

                    </div>

                    <div class="password-modal-pie">

                        <button
                            class="btn-cancelar-password"
                            @click="cerrarModalPassword"
                        >
                            Cancelar
                        </button>

                        <button
                            class="btn-guardar-password"
                            @click="guardarPassword"
                        >

                            <i class="fas fa-key"></i>

                            Generar contraseña temporal

                        </button>

                    </div>

                </div>

            </div>

        </main>

    </div>

</template>