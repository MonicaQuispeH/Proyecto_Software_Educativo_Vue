<script setup>

defineProps({

    titulo:String,
    cantidad:Number,
    icono:String,
    color:String

})

import '../../styles/admin/cards.css'

</script>

<template>

<div class="card">

    <div
        class="icono"
        :style="{background:color}"
    >

        <i :class="icono"></i>

    </div>

    <h3>{{ titulo }}</h3>

    <p>Total registrados</p>

    <h1>{{ cantidad }}</h1>

    <hr>

    <button>

        Ver detalles

    </button>

</div>

</template>