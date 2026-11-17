import { createRouter, createWebHistory } from 'vue-router'

import Inicio from '../views/Inicio.vue'
import DocenteDashboard from '../views/docente/Dashboard.vue'
import DocenteMisEstudiantes from '../views/docente/MisEstudiantes.vue'
import DocenteMisParalelos from '../views/docente/MisParalelos.vue'
import AlumnoDashboard from '../views/estudiante/Dashboard.vue'
import IngresoEstudiante from '../views/estudiante/Ingreso.vue'
import {getSession} from '../services/api'
import Login from '../views/Login.vue'

import Dashboard from '../views/admin/Dashboard.vue'
import Docentes from '../views/admin/Docentes.vue'
import Estudiantes from '../views/admin/Estudiantes.vue'
import Cursos from '../views/admin/Cursos.vue'
import Lecturas from '../views/compartido/Lecturas.vue'
import Evaluaciones from '../views/compartido/Evaluaciones.vue'
import Listas from '../views/compartido/Listas.vue'
import Resultados from '../views/compartido/Resultados.vue'
import Perfil from '../views/compartido/Perfil.vue'
import Juegos from '../views/admin/Juegos.vue'

const routes = [

    {
        path: '/',
        component: Inicio
    },

    {
        path: '/login',
        component: Login
    },

    {path:'/ingreso-estudiante',component:IngresoEstudiante},
    {path:'/docente',component:DocenteDashboard,meta:{rol:'DOCENTE'}},
    {path:'/docente/juegos',component:Juegos,meta:{rol:'DOCENTE'}},
    {path:'/docente/estudiantes',component:DocenteMisEstudiantes,meta:{rol:'DOCENTE'}},
    {path:'/docente/paralelos',component:DocenteMisParalelos,meta:{rol:'DOCENTE'}},
    {path:'/docente/listas',component:Listas,meta:{rol:'DOCENTE'}},
    {path:'/docente/lecturas',component:Lecturas,meta:{rol:'DOCENTE'}},
    {path:'/docente/evaluaciones',component:Evaluaciones,meta:{rol:'DOCENTE'}},
    {path:'/docente/resultados',component:Resultados,meta:{rol:'DOCENTE'}},
    {path:'/docente/perfil',component:Perfil,meta:{rol:'DOCENTE'}},
    {path:'/admin/perfil',component:Perfil,meta:{rol:'ADMIN'}},
    {path:'/alumno',component:AlumnoDashboard,meta:{rol:'ESTUDIANTE'}},
    {
        path: '/admin',
        meta:{rol:'ADMIN'},
        component: Dashboard
    },

    {
        path: '/docentes',
        meta:{rol:'ADMIN'},
        name: 'Docentes',
        component: Docentes
    },

    {
        path: '/estudiantes',
        meta:{rol:'ADMIN'},
        name: 'Estudiantes',
        component: Estudiantes
    },

    {
        path: '/cursos',
        meta:{rol:'ADMIN'},
        name: 'Cursos',
        component: Cursos
    },

    {
        path: '/listas',
        meta:{rol:'ADMIN'},
        name: 'Listas',
        component: Listas
    },

    {
        path: '/lecturas',
        meta:{rol:'ADMIN'},
        name: 'Lecturas',
        component: Lecturas
    },

    {
        path: '/evaluaciones',
        meta:{rol:'ADMIN'},
        name: 'Evaluaciones',
        component: Evaluaciones
    },

    {
        path: '/juegos',
        meta:{rol:'ADMIN'},
        name: 'Juegos',
        component: Juegos
    },

    {path:'/reportes',meta:{rol:'ADMIN'},name:'Reportes',component:Resultados}

]

const router = createRouter({

    history: createWebHistory(),

    routes

})

router.beforeEach((to)=>{if(!to.meta.rol)return true;const s=getSession();if(!s?.token)return to.meta.rol==='ESTUDIANTE'?'/ingreso-estudiante':'/login';if(s.user?.rol==='DOCENTE' && s.user?.debeCambiarClave && to.path!=='/docente/perfil')return '/docente/perfil';if(s.user?.rol==='DOCENTE' && !s.user?.debeCambiarClave && to.path==='/docente/perfil')return '/docente';if(s.user?.rol!==to.meta.rol)return s.user?.rol==='ADMIN'?'/admin':s.user?.rol==='DOCENTE'?'/docente':'/alumno';return true})
export default router