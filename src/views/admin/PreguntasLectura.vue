<script setup>

import { useRoute } from 'vue-router'

import Navbar from '../../components/admin/Navbar.vue'
import Sidebar from '../../components/admin/Sidebar.vue'

const route = useRoute()

const lecturaId = route.params.id

</script>

<template>

    <Navbar />

    <div class="lecturas-layout">

        <Sidebar />

        <main class="contenido">

            <div class="encabezado">

                <div>

                    <h1>
                        Gestión de Preguntas
                    </h1>

                    <p>
                        Administrar las preguntas de la lectura seleccionada.
                    </p>

                </div>

            </div>

            <div
                style="
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                "
            >

                <h2>
                    Preguntas de la lectura
                </h2>

                <p>
                    ID de lectura:
                    <strong>
                        {{ lecturaId }}
                    </strong>
                </p>

                <button>

                    <i class="fas fa-plus"></i>

                    Nueva Pregunta

                </button>

            </div>

        </main>

    </div>

</template>