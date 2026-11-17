<script setup>
import Navbar from '../../components/admin/Navbar.vue'
import Sidebar from '../../components/admin/Sidebar.vue'
import StatCard from '../../components/admin/StatCard.vue'
import { ref,onMounted } from 'vue'
import {api} from '../../services/api.js'
const cifras=ref({docentes:0,estudiantes:0,cursos:0,lecturas:0}),error=ref(''),cargando=ref(true)
onMounted(async()=>{try{cifras.value=await api('/admin/resumen')}catch(e){error.value=e.message}finally{cargando.value=false}})

import '../../styles/admin/dashboard.css'
</script>

<template>

  <Navbar />

  <div class="dashboard">

    <Sidebar />

    <main class="contenido">

      <div class="bienvenida">

        <h1>¡Bienvenido, Administrador!</h1>

        <p>
          Administra el software educativo desde este panel.
        </p>

      </div>

      <p v-if="error" class="alert alert-danger" role="alert">No se pudieron cargar las cifras: {{error}}</p>
      <p v-if="cargando">Consultando PostgreSQL...</p>
      <div class="tarjetas">

        <StatCard
          titulo="Docentes"
          :cantidad="cifras.docentes"
          icono="fas fa-chalkboard-teacher"
          color="#2563eb"
        />

        <StatCard
          titulo="Estudiantes"
          :cantidad="cifras.estudiantes"
          icono="fas fa-user-graduate"
          color="#16a34a"
        />

        <StatCard
          titulo="Cursos"
          :cantidad="cifras.cursos"
          icono="fas fa-school"
          color="#f59e0b"
        />

        <StatCard
          titulo="Lecturas"
          :cantidad="cifras.lecturas"
          icono="fas fa-book-open"
          color="#dc2626"
        />

      </div>

    </main>

  </div>

</template>