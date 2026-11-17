<script setup>

import '../../../styles/admin/tablaEstudiantes.css'

defineProps({
    estudiantes: {
        type: Array,
        required: true
    }
})

const emit = defineEmits([
    'editar',
    'cambiar-password',
    'cambiar-estado'
])

</script>

<template>

    <div class="tabla-estudiantes-contenedor">

        <table>

            <thead>

                <tr>

                    <th>N°</th>

                    <th>Nombre</th>

                    <th>Apellidos</th>

                    <th>CI</th>

                    <th>Fecha de nacimiento</th>

                    <th>Celular padre/madre</th>

                    <th>Curso</th>

                    <th>Estado</th>

                    <th>Acciones</th>

                </tr>

            </thead>

            <tbody>

                <tr
                    v-for="estudiante in estudiantes"
                    :key="estudiante.id"
                >

                    <td>
                        {{ estudiante.id }}
                    </td>

                    <td>
                        {{ estudiante.nombre }}
                    </td>

                    <td>
                        {{ estudiante.apellidoPaterno }}
                        {{ estudiante.apellidoMaterno }}
                    </td>

                    <td>
                        {{ estudiante.ci }}
                    </td>

                    <td>
                        {{ estudiante.fechaNacimiento }}
                    </td>

                    <td>
                        {{ estudiante.celularPadreMadre || '—' }}
                    </td>

                    <td>
                        {{ estudiante.curso }}
                    </td>

                    <td>

                        <span
                            class="estado"
                            :class="
                                estudiante.estado === 'Activo'
                                    ? 'activo'
                                    : 'inactivo'
                            "
                        >

                            {{ estudiante.estado }}

                        </span>

                    </td>

                    <td>

                        <div class="acciones">

                            <button
                                class="btn-editar"
                                title="Editar estudiante"
                                @click="emit('editar', estudiante)"
                            >

                                <i class="fas fa-pen"></i>

                            </button>

                            <button
                                v-if="estudiante.estado === 'Activo'"
                                class="btn-desactivar"
                                title="Desactivar estudiante"
                                @click="emit('cambiar-estado', estudiante)"
                            >

                                Desactivar

                            </button>

                            <button
                                v-else
                                class="btn-activar"
                                title="Activar estudiante"
                                @click="emit('cambiar-estado', estudiante)"
                            >

                                Activar

                            </button>

                        </div>

                    </td>

                </tr>

                <tr v-if="estudiantes.length === 0">

                    <td
                        colspan="9"
                        class="sin-resultados"
                    >

                        No se encontraron estudiantes.

                    </td>

                </tr>

            </tbody>

        </table>

    </div>

</template>