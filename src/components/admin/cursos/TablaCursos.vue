<script setup>

import '../../../styles/admin/tablaCursos.css'

defineProps({

    cursos: {

        type: Array,

        required: true

    }

})

const emit = defineEmits([

    'editar',
    'cambiar-estado'

])

</script>

<template>

    <div class="tabla-cursos-contenedor">

        <table class="tabla-cursos">

            <thead>

                <tr>

                    <th class="curso-col-numero">
                        N°
                    </th>

                    <th class="curso-col-nombre">
                        Curso
                    </th>

                    <th class="curso-col-estado">
                        Estado
                    </th>

                    <th class="curso-col-acciones">
                        Acciones
                    </th>

                </tr>

            </thead>

            <tbody>

                <tr
                    v-for="curso in cursos"
                    :key="curso.id"
                >

                    <td>

                        {{ curso.id }}

                    </td>

                    <td>

                        {{ curso.nombre }}

                    </td>

                    <td>

                        <span
                            class="estado-curso"
                            :class="
                                curso.estado === 'Activo'
                                    ? 'estado-curso-activo'
                                    : 'estado-curso-inactivo'
                            "
                        >

                            {{ curso.estado }}

                        </span>

                    </td>

                    <td>

                        <div class="acciones-curso">

                            <button
                                class="btn-curso-editar"
                                title="Editar curso"
                                @click="emit('editar', curso)"
                            >

                                <i class="fas fa-pen"></i>

                            </button>

                            <button
                                v-if="curso.estado === 'Activo'"
                                class="btn-curso-desactivar"
                                title="Desactivar curso"
                                @click="emit('cambiar-estado', curso)"
                            >

                                Desactivar

                            </button>

                            <button
                                v-else
                                class="btn-curso-activar"
                                title="Activar curso"
                                @click="emit('cambiar-estado', curso)"
                            >

                                Activar

                            </button>

                        </div>

                    </td>

                </tr>

                <tr v-if="cursos.length === 0">

                    <td
                        colspan="4"
                        class="sin-resultados-cursos"
                    >

                        No se encontraron cursos.

                    </td>

                </tr>

            </tbody>

        </table>

    </div>

</template>