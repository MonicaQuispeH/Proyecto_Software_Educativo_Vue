<script setup>

import { ref, watch } from 'vue'

import '../../../styles/admin/modalLectura.css'

const props = defineProps({

    mostrar: {
        type: Boolean,
        default: false
    },

    modo: {
        type: String,
        default: 'nuevo'
    },

    lectura: {
        type: Object,
        default: null
    }

})

const errorFormulario = ref('')
function avisar(mensaje) { errorFormulario.value = mensaje }

const emit = defineEmits([
    'cerrar',
    'guardar'
])

const titulo = ref('')

const curso = ref('')

const trimestre = ref('')

const archivo = ref(null)

const nombreArchivo = ref('')

const cursos = [
    
    '3° A',
    '3° B',
    '3° C',
    '3° D'
]

watch(

    () => props.mostrar,

    (visible) => {

        if (visible) errorFormulario.value = ''
        if (!visible) {
            return
        }

        if (
            props.modo === 'editar' &&
            props.lectura
        ) {

            titulo.value =
                props.lectura.titulo

            curso.value =
                props.lectura.curso || ''

            trimestre.value =
                props.lectura.trimestre

            archivo.value = null

            nombreArchivo.value =
                props.lectura.archivo || ''

        }

        else {

            limpiarFormulario()

        }

    }

)

function limpiarFormulario() {

    titulo.value = ''

    curso.value = ''

    trimestre.value = ''

    archivo.value = null

    nombreArchivo.value = ''

}

function seleccionarArchivo(event) {

    const archivoSeleccionado =
        event.target.files[0]

    if (!archivoSeleccionado) {

        archivo.value = null

        nombreArchivo.value = ''

        return

    }

    const tiposPermitidos = [

        'application/pdf',

        'image/jpeg',

        'image/png',

        'image/webp'

    ]

    if (
        !tiposPermitidos.includes(
            archivoSeleccionado.type
        )
    ) {

        avisar(
            'Solo se permiten archivos PDF o imágenes.'
        )

        event.target.value = ''

        archivo.value = null

        nombreArchivo.value = ''

        return

    }

    if (archivoSeleccionado.size > 3 * 1024 * 1024) {
        avisar('El archivo supera 3 MB. Para archivos más grandes se necesita almacenamiento en el backend.');
        event.target.value = ''; archivo.value = null; nombreArchivo.value = ''; return
    }
    errorFormulario.value = ''
    archivo.value =
        archivoSeleccionado

    nombreArchivo.value =
        archivoSeleccionado.name

}

function guardar() {

    if (!titulo.value.trim()) {

        avisar(
            'Ingrese el título de la lectura.'
        )

        return

    }

    if (!curso.value) {

        avisar(
            'Seleccione un curso.'
        )

        return

    }

    if (!trimestre.value) {

        avisar(
            'Seleccione un trimestre.'
        )

        return

    }

    if (
        props.modo === 'nuevo' &&
        !archivo.value
    ) {

        avisar(
            'Seleccione un archivo PDF o imagen.'
        )

        return

    }

    errorFormulario.value = ''
    emit('guardar', {

        titulo:
            titulo.value.trim(),

        curso:
            curso.value,

        trimestre:
            trimestre.value,

        archivo:
            archivo.value

    })

}

</script>

<template>

    <div
        v-if="mostrar"
        class="modal-fondo-lectura"
        @click.self="emit('cerrar')"
    >

        <div class="modal-lectura">

            <div class="modal-lectura-encabezado">

                <div>

                    <h2>

                        {{
                            modo === 'editar'
                                ? 'Editar Lectura'
                                : 'Nueva Lectura'
                        }}

                    </h2>

                    <p>

                        {{
                            modo === 'editar'
                                ? 'Modifique los datos de la lectura.'
                                : 'Registre una nueva lectura para los estudiantes.'
                        }}

                    </p>

                </div>

                <button
                    type="button"
                    class="btn-cerrar-lectura"
                    @click="emit('cerrar')"
                >

                    <i class="fas fa-times"></i>

                </button>

            </div>

            <div class="modal-lectura-contenido">

                <div class="campo-lectura">

                    <label>
                        Título de la lectura
                    </label>

                    <input
                        v-model="titulo"
                        type="text"
                        placeholder="Ej. El principito"
                        :class="{ 'is-invalid': errorFormulario.includes('título') }"
                        @input="errorFormulario = ''"
                    >
                    <div v-if="errorFormulario.includes('título')" class="invalid-feedback d-block">{{ errorFormulario }}</div>

                </div>

                <div class="campo-lectura">

                    <label>
                        Curso
                    </label>

                    <select v-model="curso" :class="{ 'is-invalid': errorFormulario.includes('curso') }" @change="errorFormulario = ''">

                        <option value="">
                            Seleccione un curso
                        </option>

                        <option
                            v-for="item in cursos"
                            :key="item"
                            :value="item"
                        >

                            {{ item }}

                        </option>

                    </select>
                    <div v-if="errorFormulario.includes('curso')" class="invalid-feedback d-block">{{ errorFormulario }}</div>

                </div>

                <div class="campo-lectura">

                    <label>
                        Trimestre
                    </label>

                    <select v-model="trimestre" :class="{ 'is-invalid': errorFormulario.includes('trimestre') }" @change="errorFormulario = ''">

                        <option value="">
                            Seleccione un trimestre
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
                    <div v-if="errorFormulario.includes('trimestre')" class="invalid-feedback d-block">{{ errorFormulario }}</div>

                </div>

                <div class="campo-lectura">

                    <label>
                        Archivo de lectura
                    </label>

                    <div class="archivo-lectura">

                        <input
                            id="archivo-lectura"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,.webp"
                            @change="seleccionarArchivo"
                        >

                        <label
                            for="archivo-lectura"
                            class="btn-seleccionar-archivo"
                        >

                            <i class="fas fa-upload"></i>

                            Seleccionar archivo

                        </label>

                        <span
                            v-if="nombreArchivo"
                            class="nombre-archivo"
                        >

                            {{ nombreArchivo }}

                        </span>

                        <span
                            v-else
                            class="archivo-ayuda"
                        >

                            PDF, JPG, PNG o WEBP

                        </span>

                    </div>
                    <div v-if="errorFormulario && !/título|curso|trimestre/.test(errorFormulario)" class="invalid-feedback d-block">{{ errorFormulario }}</div>

                </div>

            </div>

            <div class="modal-lectura-pie">

                <button
                    type="button"
                    class="btn-cancelar-lectura"
                    @click="emit('cerrar')"
                >

                    Cancelar

                </button>

                <button
                    type="button"
                    class="btn-guardar-lectura"
                    @click="guardar"
                >

                    <i class="fas fa-save"></i>

                    Guardar

                </button>

            </div>

        </div>

    </div>

</template>