<script setup>
import '../../../styles/admin/tablaEvaluaciones.css'

defineProps({
    evaluaciones: {
        type: Array,
        required: true
    }
})

const emit = defineEmits(['editar', 'cambiar-estado'])
</script>

<template>
    <div class="tabla-evaluaciones-contenedor">
        <table class="tabla-evaluaciones">
            <thead>
                <tr>
                    <th>N°</th>
                    <th>Evaluación</th>
                    <th>Lectura</th>
                    <th>Preguntas</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="evaluacion in evaluaciones" :key="evaluacion.id">
                    <td>{{ evaluacion.id }}</td>

                    <td>
                        <div class="evaluacion-info">
                            <strong>{{ evaluacion.titulo }}</strong>
                            <small>{{ evaluacion.descripcion || 'Sin descripción' }}</small>
                        </div>
                    </td>

                    <td>{{ evaluacion.lecturaTitulo || 'Sin lectura asignada' }}</td>

                    <td>{{ Array.isArray(evaluacion.preguntas) ? evaluacion.preguntas.length : 0 }}</td>

                    <td>
                        <span
                            class="estado-evaluacion"
                            :class="evaluacion.estado === 'Activo'
                                ? 'estado-evaluacion-activo'
                                : 'estado-evaluacion-inactivo'"
                        >
                            {{ evaluacion.estado }}
                        </span>
                    </td>

                    <td>
                        <div class="acciones-evaluacion">
                            <button
                                type="button"
                                class="btn-evaluacion-editar"
                                title="Editar evaluación"
                                @click="emit('editar', evaluacion)"
                            >
                                <i class="fas fa-pen"></i>
                            </button>

                            <button
                                v-if="evaluacion.estado === 'Activo'"
                                type="button"
                                class="btn-evaluacion-desactivar"
                                @click="emit('cambiar-estado', evaluacion)"
                            >
                                Desactivar
                            </button>

                            <button
                                v-else
                                type="button"
                                class="btn-evaluacion-activar"
                                @click="emit('cambiar-estado', evaluacion)"
                            >
                                Activar
                            </button>
                        </div>
                    </td>
                </tr>

                <tr v-if="evaluaciones.length === 0">
                    <td colspan="6" class="sin-resultados-evaluaciones">
                        <i class="fas fa-clipboard-list"></i>
                        <div>No se encontraron evaluaciones.</div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
