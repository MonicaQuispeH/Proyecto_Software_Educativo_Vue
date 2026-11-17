<script setup>

import '../../../styles/admin/tablaLecturas.css'

defineProps({

    lecturas: {

        type: Array,

        required: true

    }

})

const emit = defineEmits([

    'ver',

    'editar',

    'cambiar-estado'

])

</script>

<template>

    <div class="tabla-lecturas-contenedor">

        <table class="tabla-lecturas">

            <thead>

                <tr>

                    <th>N°</th>

                    <th>Lectura</th>

                    <th>Curso</th>

                    <th>Trimestre</th>

                    <th>Archivo</th>

                    <th>Estado</th>

                    <th>Acciones</th>

                </tr>

            </thead>

            <tbody>

                <tr
                    v-for="lectura in lecturas"
                    :key="lectura.id"
                >

                    <td>

                        {{ lectura.id }}

                    </td>

                    <td>

                        <div class="lectura-info">

                            <strong>

                                {{ lectura.titulo }}

                            </strong>

                            <small>

                                {{ lectura.archivo }}

                            </small>

                        </div>

                    </td>

                    <td>

                        {{ lectura.curso }}

                    </td>

                    <td>

                        {{ lectura.trimestre }}

                    </td>

                    <td>

                        <span
                            class="tipo-archivo"
                            :class="
                                lectura.tipoArchivo === 'PDF'
                                    ? 'archivo-pdf'
                                    : 'archivo-imagen'
                            "
                        >

                            <i
                                :class="
                                    lectura.tipoArchivo === 'PDF'
                                        ? 'fas fa-file-pdf'
                                        : 'fas fa-image'
                                "
                            ></i>

                            {{ lectura.tipoArchivo }}

                        </span>

                    </td>

                    <td>

                        <span
                            class="estado-lectura"
                            :class="
                                lectura.estado === 'Activo'
                                    ? 'estado-lectura-activo'
                                    : 'estado-lectura-inactivo'
                            "
                        >

                            {{ lectura.estado }}

                        </span>

                    </td>

                    <td>

                        <div class="acciones-lectura">

                            <button
                                type="button"
                                class="btn-lectura-ver"
                                title="Ver lectura"
                                @click="emit('ver', lectura)"
                            >

                                <i class="fas fa-eye"></i>

                            </button>

                            <button
                                type="button"
                                class="btn-lectura-editar"
                                title="Editar lectura"
                                @click="emit('editar', lectura)"
                            >

                                <i class="fas fa-pen"></i>

                            </button>

                            <button
                                v-if="lectura.estado === 'Activo'"
                                type="button"
                                class="btn-lectura-desactivar"
                                title="Desactivar lectura"
                                @click="
                                    emit(
                                        'cambiar-estado',
                                        lectura
                                    )
                                "
                            >

                                Desactivar

                            </button>

                            <button
                                v-else
                                type="button"
                                class="btn-lectura-activar"
                                title="Activar lectura"
                                @click="
                                    emit(
                                        'cambiar-estado',
                                        lectura
                                    )
                                "
                            >

                                Activar

                            </button>

                        </div>

                    </td>

                </tr>

                <tr v-if="lecturas.length === 0">

                    <td
                        colspan="7"
                        class="sin-resultados-lecturas"
                    >

                        <i class="fas fa-book-open"></i>

                        <div>

                            No se encontraron lecturas.

                        </div>

                    </td>

                </tr>

            </tbody>

        </table>

    </div>

</template>