<script setup>

import { ref, watch } from 'vue'

import '../../../styles/admin/modalDocente.css'

const props = defineProps({

    mostrar: {
        type: Boolean,
        default: false
    },

    modo: {
        type: String,
        default: 'nuevo'
    },

    docente: {
        type: Object,
        default: null
    },
    errorServidor: { type: String, default: '' },
    guardando: { type: Boolean, default: false }

})

const errores = ref({})
const errorFormulario = ref('')
function avisar(mensaje) { errorFormulario.value = mensaje }

const emit = defineEmits([

    'cerrar',

    'guardar'

])

const nombre = ref('')

const apellidoPaterno = ref('')

const apellidoMaterno = ref('')

const ci = ref('')

const celular = ref('')

const cursos = ref([])

watch(

    () => props.mostrar,

    (visible) => {

        if (visible) { errorFormulario.value = ''; errores.value = {} }
        if (!visible) {
            return
        }

        if (
            props.modo === 'editar' &&
            props.docente
        ) {

            nombre.value = props.docente.nombre

            apellidoPaterno.value =
                props.docente.apellidoPaterno

            apellidoMaterno.value =
                props.docente.apellidoMaterno

            ci.value = props.docente.ci

            celular.value = props.docente.celular || ''

            cursos.value = [...(props.docente.cursos || [])]

        }

        else {

            limpiarFormulario()

        }

    }

)

function limpiarFormulario() {

    nombre.value = ''

    apellidoPaterno.value = ''

    apellidoMaterno.value = ''

    ci.value = ''

    celular.value = ''

    cursos.value = ['3A', '3B', '3C', '3D']

}

function guardar() {
    const e = {}
    if (!nombre.value.trim()) e.nombre = 'Ingrese el nombre.'
    else if (!/^[\p{L}]+(?:[ '\-][\p{L}]+)*$/u.test(nombre.value.trim())) e.nombre = 'El nombre solo debe contener letras, espacios o guiones; no números.'
    if (!apellidoPaterno.value.trim()) e.apellidoPaterno = 'Ingrese el apellido paterno.'
    else if (!/^[\p{L}]+(?:[ '\-][\p{L}]+)*$/u.test(apellidoPaterno.value.trim())) e.apellidoPaterno = 'El apellido solo debe contener letras; no números.'
    if (!apellidoMaterno.value.trim()) e.apellidoMaterno = 'Ingrese el apellido materno.'
    else if (!/^[\p{L}]+(?:[ '\-][\p{L}]+)*$/u.test(apellidoMaterno.value.trim())) e.apellidoMaterno = 'El apellido solo debe contener letras; no números.'
    if (!ci.value.trim()) e.ci = 'Ingrese el carnet de identidad.'
    else if (!/^\d+$/.test(ci.value.trim())) e.ci = 'El CI solo admite números, sin letras ni símbolos.'
    else if (!/^\d{5,12}$/.test(ci.value.trim())) e.ci = 'El CI debe tener entre 5 y 12 dígitos.'
    if (!celular.value.trim()) e.celular = 'Ingrese el número de celular.'
    else if (!/^\d+$/.test(celular.value.trim())) e.celular = 'El celular solo admite números, sin letras ni símbolos.'
    else if (!/^\d{7,8}$/.test(celular.value.trim())) e.celular = 'El celular debe tener 7 u 8 dígitos.'
    if (!cursos.value.every(c => ['3A','3B','3C','3D'].includes(c))) e.curso = 'Seleccione paralelos válidos.'
    errores.value = e
    if (Object.keys(e).length) return
    emit('guardar', {
        nombre: nombre.value.trim(), apellidoPaterno: apellidoPaterno.value.trim(),
        apellidoMaterno: apellidoMaterno.value.trim(), ci: ci.value.trim(),
        celular: celular.value.trim(), cursos: [...cursos.value]
    })
}

</script>

<template>

    <div
        v-if="mostrar"
        class="modal-fondo"
        @click.self="emit('cerrar')"
    >

        <div class="modal-docente">

            <div class="modal-encabezado">

                <div>

                    <h2>

                        {{
                            modo === 'editar'
                                ? 'Editar Docente'
                                : 'Nuevo Docente'
                        }}

                    </h2>

                    <p>

                        {{
                            modo === 'editar'
                                ? 'Modifique los datos del docente.'
                                : 'Registre un nuevo docente en el sistema.'
                        }}

                    </p>

                </div>

                <button
                    class="btn-cerrar"
                    @click="emit('cerrar')"
                >

                    <i class="fas fa-times"></i>

                </button>

            </div>

            <div class="modal-contenido">

                <div class="fila">

                    <div class="campo">

                        <label>
                            Nombre
                        </label>

                        <input
                            v-model="nombre"
                            :class="{ 'is-invalid': errores.nombre }"
                            @input="delete errores.nombre"
                            type="text"
                            placeholder="Ingrese el nombre"
                        >
                        <div v-if="errores.nombre" class="invalid-feedback d-block">{{ errores.nombre }}</div>

                    </div>

                    <div class="campo">

                        <label>
                            Apellido paterno
                        </label>

                        <input
                            v-model="apellidoPaterno"
                            :class="{ 'is-invalid': errores.apellidoPaterno }"
                            @input="delete errores.apellidoPaterno"
                            type="text"
                            placeholder="Ingrese apellido paterno"
                        >
                        <div v-if="errores.apellidoPaterno" class="invalid-feedback d-block">{{ errores.apellidoPaterno }}</div>

                    </div>

                </div>

                <div class="fila">

                    <div class="campo">

                        <label>
                            Apellido materno
                        </label>

                        <input
                            v-model="apellidoMaterno"
                            :class="{ 'is-invalid': errores.apellidoMaterno }"
                            @input="delete errores.apellidoMaterno"
                            type="text"
                            placeholder="Ingrese apellido materno"
                        >
                        <div v-if="errores.apellidoMaterno" class="invalid-feedback d-block">{{ errores.apellidoMaterno }}</div>

                    </div>

                    <div class="campo">

                        <label>
                            CI
                        </label>

                        <input
                            v-model="ci"
                            :class="{ 'is-invalid': errores.ci }"
                            @input="delete errores.ci"
                            type="text"
                            placeholder="Ingrese CI"
                        >
                        <div v-if="errores.ci" class="invalid-feedback d-block">{{ errores.ci }}</div>

                    </div>

                </div>

                <div class="campo">

                    <label>
                        Celular del docente
                    </label>

                    <input
                        v-model="celular"
                            :class="{ 'is-invalid': errores.celular }"
                            @input="delete errores.celular"
                        type="tel"
                        required
                        maxlength="8"
                        inputmode="numeric"
                        placeholder="Ej. 72456789"
                    >
                        <div v-if="errores.celular" class="invalid-feedback d-block">{{ errores.celular }}</div>

                </div>

                <div class="campo">

                    <label>Paralelos asignados</label>
                    <p class="small text-muted">Puedes seleccionar varios paralelos o dejar todos sin asignar.</p>
                    <div class="d-flex flex-wrap gap-3" role="group" aria-label="Paralelos">
                      <label v-for="c in ['3A','3B','3C','3D']" :key="c" class="d-flex align-items-center gap-2">
                        <input type="checkbox" :value="c" v-model="cursos">
                        {{ c.replace('3', '3° ') }}
                      </label>
                    </div>
                    <div v-if="errores.curso" class="invalid-feedback d-block">{{ errores.curso }}</div>
                </div>

            </div>

            <div class="modal-pie" style="flex-wrap:wrap">
                <div v-if="errorServidor" class="alert alert-danger w-100 mb-2" role="alert" aria-live="assertive">{{ errorServidor }}</div>

                <button
                    class="btn-cancelar"
                    @click="emit('cerrar')"
                >
                    Cancelar
                </button>

                <button
                    class="btn-guardar"
                    @click="guardar"
                    :disabled="guardando"
                >

                    <i class="fas fa-save"></i>

                    {{ guardando ? 'Guardando...' : 'Guardar' }}

                </button>

            </div>

        </div>

    </div>

</template>