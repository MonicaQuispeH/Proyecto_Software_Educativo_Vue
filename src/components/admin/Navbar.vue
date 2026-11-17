<script setup>
import '../../styles/admin/navbar.css'
import {useRouter} from 'vue-router'
import {api,clearSession,getSession} from '../../services/api.js'
const router=useRouter()
async function cerrarSesion(){
  const estudiante=getSession()?.user?.rol==='ESTUDIANTE'
  if(estudiante){try{await api('/alumno/salir',{method:'POST'})}catch(e){}}
  clearSession()
  router.push(estudiante?'/ingreso-estudiante':'/login')
}
import logoGatoLecturas from '../../assets/gato-lectura/logo-gato-lecturas.png'
</script>

<template>
  <header class="navbar">
    <div class="navbar-marca">
      <img
        class="navbar-marca-logo"
        :src="logoGatoLecturas"
        alt="Logo Gato Lecturas"
      />
      <span class="navbar-marca-titulo" aria-label="GATO LECTURAS"><span class="titulo-gato">GATO</span> <span class="titulo-lecturas">LECTURAS</span></span>
    </div>

    <div class="navbar-user">
      <span>{{getSession()?.user?.rol === 'ESTUDIANTE' ? 'Estudiante' : getSession()?.user?.rol === 'DOCENTE' ? 'Docente' : 'Administrador'}}</span>

      <button class="btn-salir" type="button" @click="cerrarSesion">
        Cerrar sesión
      </button>
    </div>
  </header>
</template>
