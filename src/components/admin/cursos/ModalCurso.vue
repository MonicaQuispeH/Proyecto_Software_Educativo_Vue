<script setup>

import { ref, watch } from 'vue'

import '../../../styles/admin/modalCurso.css'

const props = defineProps({

    mostrar: {
        type: Boolean,
        default: false
    },

    modo: {
        type: String,
        default: 'nuevo'
    },

    curso: {
        type: Object,
        default: null
    }

})

const emit = defineEmits([
    'cerrar',
    'guardar'
])

const nombre = ref('')

watch(
    () => props.mostrar,

    (visible) => {

        if (!visible) {
            return
        }

        if (
            props.modo === 'editar' &&
            props.curso
        ) {

            nombre.value = props.curso.nombre

        } else {

            limpiarFormulario()

        }

    }
)

function limpiarFormulario() {

    nombre.value = ''

}

const errorNombre = ref('')
function guardar() {

    if (!nombre.value.trim()) {
        errorNombre.value = 'Ingrese el nombre del curso.'
        return
    }

    errorNombre.value = ''
    emit('guardar', {
        nombre: nombre.value.trim()
    })

}

</script>

<template>

    <div
        v-if="mostrar"
        class="modal-curso-fondo"
        @click.self="emit('cerrar')"
    >

        <div class="modal-curso">

            <div class="modal-curso-encabezado">

                <div>

                    <h2>

                        {{
                            modo === 'editar'
                                ? 'Editar Curso'
                                : 'Nuevo Curso'
                        }}

                    </h2>

                    <p>

                        {{
                            modo === 'editar'
                                ? 'Modifique el nombre del curso.'
                                : 'Registre un nuevo curso en el sistema.'
                        }}

                    </p>

                </div>

                <button
                    type="button"
                    class="btn-cerrar-curso"
                    @click="emit('cerrar')"
                    title="Cerrar"
                >

                    <i class="fas fa-times"></i>

                </button>

            </div>

            <div class="modal-curso-contenido">

                <div class="campo-curso">

                    <label>
                        Nombre del curso
                    </label>

                    <input
                        v-model="nombre"
                        type="text"
                        placeholder="Ej. 4° A"
                        @keyup.enter="guardar"
                    >
                    <div v-if="errorNombre" class="invalid-feedback d-block">{{ errorNombre }}</div>

                </div>

            </div>

            <div class="modal-curso-pie">

                <button
                    type="button"
                    class="btn-cancelar-curso"
                    @click="emit('cerrar')"
                >

                    Cancelar

                </button>

                <button
                    type="button"
                    class="btn-guardar-curso"
                    @click="guardar"
                >

                    <i class="fas fa-save"></i>

                    Guardar

                </button>

            </div>

        </div>

    </div>

</template>