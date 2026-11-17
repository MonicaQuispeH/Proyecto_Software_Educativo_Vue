<script setup>

import '../../../styles/admin/tablaDocentes.css'

defineProps({

    docentes: {
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

    <div class="tabla-docentes-contenedor">

        <table class="tabla-docentes">

            <thead>

                <tr>

                    <th class="col-numero">
                        N°
                    </th>

                    <th class="col-nombre">
                        Nombre
                    </th>

                    <th class="col-apellido">
                        Apellido
                    </th>

                    <th class="col-ci">
                        CI
                    </th>

                    <th class="col-celular">
                        Celular
                    </th>

                    <th class="col-curso">
                        Curso
                    </th>

                    <th class="col-estado">
                        Estado
                    </th>

                    <th class="col-acciones">
                        Acciones
                    </th>

                </tr>

            </thead>

            <tbody>

                <tr
                    v-for="docente in docentes"
                    :key="docente.id"
                >

                    <td>
                        {{ docente.id }}
                    </td>

                    <td>
                        {{ docente.nombre }}
                    </td>

                    <td>

                        {{ docente.apellidoPaterno }}
                        {{ docente.apellidoMaterno }}

                    </td>

                    <td>
                        {{ docente.ci }}
                    </td>

                    <td>
                        {{ docente.celular || '—' }}
                    </td>

                    <td>
                        {{ docente.curso }}
                    </td>

                    <td>

                        <span
                            class="estado-docente"
                            :class="
                                docente.estado === 'Activo'
                                    ? 'estado-activo'
                                    : 'estado-inactivo'
                            "
                        >

                            {{ docente.estado }}

                        </span>

                    </td>

                    <td>

                        <div class="acciones-docente">

                            <button
                                class="btn-accion btn-editar"
                                title="Editar docente"
                                @click="emit('editar', docente)"
                            >

                                <i class="fas fa-pen"></i>

                            </button>

                            <button
                                class="btn-accion btn-password"
                                title="Cambiar contraseña"
                                @click="emit('cambiar-password', docente)"
                            >

                                <i class="fas fa-key"></i>

                            </button>

                            <button
                                v-if="docente.estado === 'Activo'"
                                class="btn-estado btn-desactivar"
                                title="Desactivar docente"
                                @click="emit('cambiar-estado', docente)"
                            >

                                Desactivar

                            </button>

                            <button
                                v-else
                                class="btn-estado btn-activar"
                                title="Activar docente"
                                @click="emit('cambiar-estado', docente)"
                            >

                                Activar

                            </button>

                        </div>

                    </td>

                </tr>

                <tr v-if="docentes.length === 0">

                    <td
                        colspan="8"
                        class="sin-resultados"
                    >

                        No se encontraron docentes.

                    </td>

                </tr>

            </tbody>

        </table>

    </div>

</template>