<script setup>
import { RouterLink } from 'vue-router'
import { getSession } from '../../services/api.js'
import '../../styles/admin/sidebar.css'
const rol = getSession()?.user?.rol
const esDocente = rol === 'DOCENTE'
const esEstudiante = rol === 'ESTUDIANTE'
</script>

<template>
  <nav class="sidebar" aria-label="Menú principal">
    <template v-if="esEstudiante">
      <a v-for="item in [
        {vista:'inicio',titulo:'Inicio',icono:'fa-house'},
        {vista:'lecturas',titulo:'Mis lecturas',icono:'fa-book-open'},
        {vista:'evaluaciones',titulo:'Mis evaluaciones',icono:'fa-clipboard-check'},
        {vista:'juegos',titulo:'Juegos',icono:'fa-gamepad'},
        {vista:'resultados',titulo:'Mis resultados',icono:'fa-chart-column'}
      ]" :key="item.vista" href="#" class="menu-item" :class="{'router-link-exact-active': $route.query.vista === item.vista || (!$route.query.vista && item.vista === 'inicio')}" @click.prevent="$router.replace({path:'/alumno',query:{vista:item.vista}})"><i :class="['fas',item.icono]"></i><span>{{item.titulo}}</span></a>
    </template>
    <template v-else>
    <RouterLink :to="esDocente ? '/docente' : '/admin'" class="menu-item" exact-active-class="router-link-exact-active"><i class="fas fa-house"></i><span>Inicio</span></RouterLink>
    <RouterLink v-if="!esDocente" to="/docentes" class="menu-item" exact-active-class="router-link-exact-active"><i class="fas fa-chalkboard-teacher"></i><span>Docentes</span></RouterLink>
    <RouterLink :to="esDocente ? '/docente/estudiantes' : '/estudiantes'" class="menu-item" exact-active-class="router-link-exact-active"><i class="fas fa-user-graduate"></i><span>{{ esDocente ? 'Mis estudiantes' : 'Estudiantes' }}</span></RouterLink>
    <RouterLink :to="esDocente ? '/docente/listas' : '/listas'" class="menu-item" exact-active-class="router-link-exact-active"><i class="fas fa-list"></i><span>Listas</span></RouterLink>
    <RouterLink :to="esDocente ? '/docente/paralelos' : '/cursos'" class="menu-item" exact-active-class="router-link-exact-active"><i class="fas fa-school"></i><span>{{ esDocente ? 'Mis paralelos' : 'Cursos' }}</span></RouterLink>
    <RouterLink :to="esDocente ? '/docente/lecturas' : '/lecturas'" class="menu-item" exact-active-class="router-link-exact-active"><i class="fas fa-book-open"></i><span>Lecturas</span></RouterLink>
    <RouterLink :to="esDocente ? '/docente/evaluaciones' : '/evaluaciones'" class="menu-item" exact-active-class="router-link-exact-active"><i class="fas fa-clipboard-check"></i><span>Evaluaciones</span></RouterLink>
    <RouterLink :to="esDocente ? '/docente/juegos' : '/juegos'" class="menu-item" exact-active-class="router-link-exact-active"><i class="fas fa-gamepad"></i><span>Juegos</span></RouterLink>
    <RouterLink :to="esDocente ? '/docente/resultados' : '/reportes'" class="menu-item" exact-active-class="router-link-exact-active"><i class="fas fa-chart-column"></i><span>{{ esDocente ? 'Resultados' : 'Reportes' }}</span></RouterLink>
    <RouterLink v-if="!esDocente" to="/admin/perfil" class="menu-item" exact-active-class="router-link-exact-active"><i class="fas fa-user-gear"></i><span>Mi perfil</span></RouterLink>
    </template>
  </nav>
</template>
