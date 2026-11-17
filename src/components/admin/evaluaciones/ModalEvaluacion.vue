<script setup>
import { ref, watch } from 'vue'
import '../../../styles/admin/modalEvaluacion.css'

const props = defineProps({
    mostrar: { type: Boolean, default: false },
    modo: { type: String, default: 'nuevo' },
    evaluacion: { type: Object, default: null },
    lecturas: { type: Array, default: () => [] },
    cursosDisponibles: { type: Array, default: () => [] },
    cursosAsignados: { type: Array, default: () => [] }
})

const errorFormulario = ref('')
function avisar(mensaje) { errorFormulario.value = mensaje }

const emit = defineEmits(['cerrar', 'guardar','cambiar-cursos'])

const titulo = ref('')
const descripcion = ref('')
const lecturaId = ref('')
const preguntas = ref([])

function crearPregunta() {
    return {
        id: `${Date.now()}-${Math.random()}`,
        texto: '',
        imagen: '',
        opciones: [
            { id: 1, texto: '', correcta: false },
            { id: 2, texto: '', correcta: false },
            { id: 3, texto: '', correcta: false },
            { id: 4, texto: '', correcta: false }
        ]
    }
}

function nuevaPregunta() {
    preguntas.value.push(crearPregunta())
}

function eliminarPregunta(indice) {
    preguntas.value.splice(indice, 1)
}

function marcarCorrecta(pregunta, opcion) {
    pregunta.opciones.forEach(item => {
        item.correcta = item.id === opcion.id
    })
}

function cargarImagen(event, pregunta) {
    const archivo = event.target.files?.[0]
    if (!archivo) return

    if (!archivo.type.startsWith('image/')) {
        avisar('Seleccione una imagen válida.')
        event.target.value = ''
        return
    }

    const lector = new FileReader()
    lector.onload = () => {
        pregunta.imagen = lector.result
    }
    lector.readAsDataURL(archivo)
}

function quitarImagen(pregunta) {
    pregunta.imagen = ''
}

function cerrar() {
    emit('cerrar')
}

function guardar() {
    if (!titulo.value.trim()) {
        avisar('Ingrese el título de la evaluación.')
        return
    }

    if (!lecturaId.value) {
        avisar('Seleccione la lectura a la que pertenece la evaluación.')
        return
    }

    if (preguntas.value.length === 0) {
        avisar('Agregue al menos una pregunta.')
        return
    }

    for (const pregunta of preguntas.value) {
        if (!pregunta.texto.trim()) {
            avisar('Todas las preguntas deben tener un enunciado.')
            return
        }

        if (pregunta.opciones.some(opcion => !opcion.texto.trim())) {
            avisar('Complete todas las opciones de cada pregunta.')
            return
        }

        if (!pregunta.opciones.some(opcion => opcion.correcta)) {
            avisar('Seleccione una respuesta correcta en cada pregunta.')
            return
        }
    }

    const lectura = props.lecturas.find(
        item => String(item.id) === String(lecturaId.value)
    )

    errorFormulario.value = ''
    emit('guardar', {
        titulo: titulo.value.trim(),
        descripcion: descripcion.value.trim(),
        lecturaId: lectura ? lectura.id : lecturaId.value,
        lecturaTitulo: lectura ? lectura.titulo : '',
        preguntas: JSON.parse(JSON.stringify(preguntas.value))
    })
}

function cargarFormulario() {
    if (!props.mostrar) return
    errorFormulario.value = ''

    if (props.modo === 'editar' && props.evaluacion) {
        titulo.value = props.evaluacion.titulo || ''
        descripcion.value = props.evaluacion.descripcion || ''
        lecturaId.value = props.evaluacion.lecturaId ?? ''
        preguntas.value = JSON.parse(
            JSON.stringify(props.evaluacion.preguntas || [])
        )
    } else {
        titulo.value = ''
        descripcion.value = ''
        lecturaId.value = ''
        preguntas.value = []
    }
}

watch(
    () => [props.mostrar, props.modo, props.evaluacion],
    cargarFormulario,
    { immediate: true }
)
</script>

<template>
    <div
        v-if="mostrar"
        class="modal-evaluacion-fondo"
        @click.self="cerrar"
    >
        <div class="modal-evaluacion">
            <div class="modal-evaluacion-header">
                <div>
                    <h2>{{ modo === 'editar' ? 'Editar Evaluación' : 'Nueva Evaluación' }}</h2>
                    <p>Configure la evaluación y sus preguntas.</p>
                </div>

                <button type="button" class="btn-cerrar-evaluacion" @click="cerrar">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="modal-evaluacion-body">
                
                <div class="campo-evaluacion">
                    <label>Título de la evaluación</label>
                    <input v-model="titulo" type="text" :class="{ 'is-invalid': errorFormulario.includes('título') }" @input="errorFormulario = ''" placeholder="Ej. Evaluación de comprensión lectora">
                    <div v-if="errorFormulario.includes('título')" class="invalid-feedback d-block">{{ errorFormulario }}</div>
                </div>

                <div class="campo-evaluacion">
                    <label>Lectura asociada</label>
                    <select v-model="lecturaId" :class="{ 'is-invalid': errorFormulario.includes('lectura') }" @change="errorFormulario = ''">
                        <option value="">Seleccione una lectura</option>
                        <option
                            v-for="lectura in lecturas"
                            :key="lectura.id"
                            :value="lectura.id"
                        >
                            {{ lectura.titulo }} - {{ lectura.curso }}
                        </option>
                    </select>
                    <div v-if="errorFormulario.includes('lectura')" class="invalid-feedback d-block">{{ errorFormulario }}</div>

                    <small v-if="lecturas.length === 0" class="ayuda-evaluacion">
                        Primero registre una lectura en Gestión de Lecturas.
                    </small>
                </div>

                <div class="campo-evaluacion">
                    <label>Descripción</label>
                    <textarea v-model="descripcion" rows="3" placeholder="Descripción opcional..."></textarea>
                </div>

                <div class="campo-evaluacion">
                    <label>Asignar evaluación a paralelos</label>
                    <div class="d-flex flex-wrap gap-3 py-2">
                      <label v-for="curso in cursosDisponibles" :key="curso" class="d-flex align-items-center gap-2">
                        <input type="checkbox" :checked="cursosAsignados.includes(curso)" @change="emit('cambiar-cursos', curso, $event.target.checked)">
                        3° {{curso.slice(1)}}
                      </label>
                    </div>
                </div>
                <div v-if="errorFormulario && !errorFormulario.includes('título') && !errorFormulario.includes('lectura')" class="invalid-feedback d-block" role="alert">{{ errorFormulario }}</div>
                <div class="preguntas-header">
                    <div>
                        <h3>Preguntas</h3>
                        <p>Puede agregar una imagen al enunciado, como en Moodle.</p>
                    </div>

                    <button type="button" class="btn-agregar-pregunta" @click="nuevaPregunta">
                        <i class="fas fa-plus"></i>
                        Agregar pregunta
                    </button>
                </div>

                <div v-if="preguntas.length === 0" class="sin-preguntas">
                    Aún no agregó preguntas.
                </div>

                <div
                    v-for="(pregunta, indicePregunta) in preguntas"
                    :key="pregunta.id"
                    class="pregunta-card"
                >
                    <div class="pregunta-card-header">
                        <strong>Pregunta {{ indicePregunta + 1 }}</strong>

                        <button
                            type="button"
                            class="btn-eliminar-pregunta"
                            title="Eliminar pregunta"
                            @click="eliminarPregunta(indicePregunta)"
                        >
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>

                    <input
                        v-model="pregunta.texto"
                        type="text"
                        class="input-pregunta"
                        placeholder="Escriba el enunciado de la pregunta..."
                    >

                    <div class="imagen-pregunta">
                        <label class="btn-imagen-pregunta">
                            <i class="fas fa-image"></i>
                            {{ pregunta.imagen ? 'Cambiar imagen' : 'Agregar imagen' }}
                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/webp,image/gif"
                                @change="cargarImagen($event, pregunta)"
                            >
                        </label>

                        <button
                            v-if="pregunta.imagen"
                            type="button"
                            class="btn-quitar-imagen"
                            @click="quitarImagen(pregunta)"
                        >
                            Quitar imagen
                        </button>

                        <div v-if="pregunta.imagen" class="vista-imagen-pregunta">
                            <img :src="pregunta.imagen" alt="Imagen de la pregunta">
                        </div>
                    </div>

                    <div class="opciones-pregunta">
                        <div
                            v-for="(opcion, indiceOpcion) in pregunta.opciones"
                            :key="opcion.id"
                            class="opcion-pregunta"
                        >
                            <input
                                type="radio"
                                :name="'pregunta-' + pregunta.id"
                                :checked="opcion.correcta"
                                @change="marcarCorrecta(pregunta, opcion)"
                            >

                            <input
                                v-model="opcion.texto"
                                type="text"
                                :placeholder="'Opción ' + (indiceOpcion + 1)"
                            >

                            <span v-if="opcion.correcta" class="respuesta-correcta">
                                Correcta
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-evaluacion-footer">
                <button type="button" class="btn-cancelar-evaluacion" @click="cerrar">
                    Cancelar
                </button>

                <button type="button" class="btn-guardar-evaluacion" @click="guardar">
                    <i class="fas fa-save"></i>
                    Guardar evaluación
                </button>
            </div>
        </div>
    </div>
</template>
