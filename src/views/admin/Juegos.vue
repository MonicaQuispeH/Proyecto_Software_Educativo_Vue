<script setup>
import { computed, ref } from 'vue'
import Navbar from '../../components/admin/Navbar.vue'
import Sidebar from '../../components/admin/Sidebar.vue'
import JuegoInteractivo from '../../components/admin/JuegoInteractivo.vue'
import LecturaGuiada from '../../components/juegos/LecturaGuiada.vue'
import JuegosDinamicos from '../../components/admin/JuegosDinamicos.vue'

import '../../styles/admin/juegos.css'
import logoGatoLecturas from '../../assets/gato-lectura/logo-gato-lecturas.png'
import {getSession} from '../../services/api.js'
const esDocente=getSession()?.user?.rol==='DOCENTE'

const categorias = [
    'Comprensión lectora',
    'Vocabulario',
    'Ortografía',
    'Gramática',
    'Sílabas',
    'Escritura',
    'Secuencias'
]

const cursos = ['Todos', '3° A', '3° B', '3° C', '3° D']

const juegosIniciales = [
    { id: 8, titulo: 'Lectura Mágica: Fábulas de Esopo', categoria: 'Comprensión lectora', descripcion: 'Escucha fábulas cortas y sigue cada palabra iluminada.', nivel: 'Fácil', curso: 'Todos', estado: 'Activo', icono: 'fa-book-open', color: 'morado', tipo: 'lectura-guiada' },
    {
        id: 1,
        titulo: 'Detectives de la lectura',
        categoria: 'Comprensión lectora',
        descripcion: 'Lee una pequeña historia y descubre la respuesta correcta.',
        nivel: 'Fácil',
        curso: 'Todos',
        estado: 'Activo',
        icono: 'fa-magnifying-glass',
        color: 'azul',
        tipo: 'comprension'
    },
    {
        id: 2,
        titulo: 'La palabra escondida',
        categoria: 'Vocabulario',
        descripcion: 'Encuentra la palabra que tiene un significado parecido.',
        nivel: 'Fácil',
        curso: 'Todos',
        estado: 'Activo',
        icono: 'fa-lightbulb',
        color: 'amarillo',
        tipo: 'vocabulario'
    },
    {
        id: 3,
        titulo: 'Detective ortográfico',
        categoria: 'Ortografía',
        descripcion: 'Elige la palabra escrita correctamente y gana estrellas.',
        nivel: 'Medio',
        curso: 'Todos',
        estado: 'Activo',
        icono: 'fa-spell-check',
        color: 'verde',
        tipo: 'ortografia'
    },
    {
        id: 4,
        titulo: 'Ordena la oración',
        categoria: 'Gramática',
        descripcion: 'Organiza las palabras para formar una oración con sentido.',
        nivel: 'Medio',
        curso: 'Todos',
        estado: 'Activo',
        icono: 'fa-puzzle-piece',
        color: 'morado',
        tipo: 'oracion'
    },
    {
        id: 5,
        titulo: 'Construye la palabra',
        categoria: 'Sílabas',
        descripcion: 'Une las sílabas correctas y descubre la palabra.',
        nivel: 'Fácil',
        curso: 'Todos',
        estado: 'Activo',
        icono: 'fa-cubes',
        color: 'naranja',
        tipo: 'silabas'
    },
    {
        id: 6,
        titulo: 'Completa la aventura',
        categoria: 'Escritura',
        descripcion: 'Completa la oración con la palabra que mejor encaja.',
        nivel: 'Medio',
        curso: 'Todos',
        estado: 'Activo',
        icono: 'fa-pen',
        color: 'rosa',
        tipo: 'escritura'
    },
    {
        id: 7,
        titulo: 'Ordena la historia',
        categoria: 'Secuencias',
        descripcion: 'Pon en orden los acontecimientos de una historia.',
        nivel: 'Medio',
        curso: 'Todos',
        estado: 'Activo',
        icono: 'fa-list-ol',
        color: 'celeste',
        tipo: 'secuencia'
    }
]

const juegos = ref([])
const busqueda = ref('')
const filtroCategoria = ref('Todas')
const filtroNivel = ref('Todos')
const filtroEstado = ref('Todos')
const filtroCurso = ref('Todos')

const pantallaJuegos = ref('inicio')

const juegosFiltrados = computed(() => {
    const texto = busqueda.value.trim().toLowerCase()
    return juegos.value.filter((juego) => {
        if (esDocente && juego.estado !== 'Activo') return false
        const coincideBusqueda = !texto ||
            juego.titulo.toLowerCase().includes(texto) ||
            juego.descripcion.toLowerCase().includes(texto)
        const coincideCategoria = filtroCategoria.value === 'Todas' || juego.categoria === filtroCategoria.value
        const coincideNivel = filtroNivel.value === 'Todos' || juego.nivel === filtroNivel.value
        const coincideEstado = filtroEstado.value === 'Todos' || juego.estado === filtroEstado.value
        const coincideCurso = filtroCurso.value === 'Todos' || juego.curso === filtroCurso.value
        return coincideBusqueda && coincideCategoria && coincideNivel && coincideEstado && coincideCurso
    })
})

const juegosActivos = computed(() => juegos.value.filter(juego => juego.estado === 'Activo').length)
const juegosInactivos = computed(() => juegos.value.filter(juego => juego.estado === 'Inactivo').length)

const mostrarJuego = ref(false)
const juegoActual = ref(null)

function iniciarJuego(juego) {
    juegoActual.value = juego
    mostrarJuego.value = true
}

function cerrarJuego() {
    mostrarJuego.value = false
    juegoActual.value = null
}

function cambiarEstado(juego) {
    juego.estado = juego.estado === 'Activo' ? 'Inactivo' : 'Activo'
    guardarEnLocalStorage()
}

function eliminarJuego(juego) {
    const confirmado = window.confirm(`¿Deseas eliminar el juego "${juego.titulo}"?`)
    if (!confirmado) return

    juegos.value = juegos.value.filter((item) => item.id !== juego.id)
    guardarEnLocalStorage()
}

function cargarJuegos() {
    try {
        const guardados = JSON.parse(localStorage.getItem('juegos') || 'null')

        juegos.value = Array.isArray(guardados) && guardados.length
            ? [...guardados.filter(j => j && j.tipo !== 'lectura-guiada'), { ...juegosIniciales[0] }]
            : juegosIniciales.map((juego) => ({ ...juego }))
    } catch (error) {
        console.warn('No se pudieron cargar los juegos guardados. Se usarán los juegos iniciales.', error)
        juegos.value = juegosIniciales.map((juego) => ({ ...juego }))
    }
}

function guardarEnLocalStorage() {
    try {
        localStorage.setItem('juegos', JSON.stringify(juegos.value))
    } catch (error) {
        console.warn('No se pudieron guardar los juegos en el navegador.', error)
    }
}

cargarJuegos()

</script>

<template>
    <Navbar />

    <div class="juegos-layout">
        <Sidebar />

        <main class="contenido-juegos">
            <section v-if="pantallaJuegos === 'inicio'" class="bienvenida-juegos-principal">
                <div class="bienvenida-juegos-cabecera">
                    <div>
                        <span class="etiqueta-juegos">GATO LECTURAS</span>
                        <h1>¡Bienvenida a Juegos!</h1>
                        <p>Elige una aventura y aprende jugando, leyendo, escuchando y descubriendo.</p>
                    </div>
                    <div class="bienvenida-gato-grande">
                        <img :src="logoGatoLecturas" alt="Gato Lecturas" />
                    </div>
                </div>

                <div class="seleccion-tipos-juegos">
                    <button class="tipo-juego-card tipo-juego-lectura" @click="pantallaJuegos = 'lectura'">
                        <div class="tipo-juego-icono"><i class="fas fa-book-open-reader"></i></div>
                        <div class="tipo-juego-texto">
                            <span>AVENTURAS PARA APRENDER</span>
                            <h2>Juegos de Lectura</h2>
                            <p>Historias, palabras, ortografía, sílabas, oraciones y secuencias.</p>
                            <strong class="boton-aventura-visible">Ver juegos <i class="fas fa-arrow-right"></i></strong>
                        </div>
                    </button>

                    <button class="tipo-juego-card tipo-juego-dinamico" @click="pantallaJuegos = 'dinamicos'">
                        <div class="tipo-juego-icono"><i class="fas fa-wand-magic-sparkles"></i></div>
                        <div class="tipo-juego-texto">
                            <span>GRANDES AVENTURAS</span>
                            <h2>Juegos Dinámicos</h2>
                            <p>Ruletas, cajas sorpresa, concursos, globos y nuevos retos interactivos.</p>
                            <strong class="boton-aventura-visible">Entrar a la aventura <i class="fas fa-arrow-right"></i></strong>
                        </div>
                    </button>
                </div>
            </section>

            <section v-else-if="pantallaJuegos === 'lectura'" class="pantalla-categoria-juegos">
                <div class="encabezado-juegos">
                    <div>
                        <button class="btn-volver-juegos gato-boton-juego gato-juego-azul" @click="pantallaJuegos = 'inicio'"><i class="fas fa-arrow-left"></i> Volver</button>
                        <h1>Juegos de Lectura</h1>
                        <p>Explora los juegos que ya construimos para practicar lectura, vocabulario, ortografía y más.</p>
                    </div>
                </div>

                <section class="zona-mascota">
                    <div class="mascota-imagen"><img :src="logoGatoLecturas" alt="Logo Gato Lecturas" /></div>
                    <div class="mascota-mensaje"><strong>¡Hola! Soy Gato Lectura</strong><p>Estos son nuestros juegos de lectura. Puedes probarlos para ver cómo los vivirá un estudiante.</p></div>
                </section>

                <section class="grid-juegos">
                    <article v-for="juego in juegosFiltrados" :key="juego.id" class="juego-card">
                        <div :class="['juego-ilustracion', `juego-${juego.color}`]"><div class="burbuja-juego">{{ juego.nivel }}</div><i :class="['fas', juego.icono]"></i></div>
                        <div class="juego-contenido">
                            <div class="juego-meta"><span class="categoria-juego">{{ juego.categoria }}</span><span :class="['estado-juego', juego.estado === 'Activo' ? 'activo' : 'inactivo']">{{ juego.estado }}</span></div>
                            <h2>{{ juego.titulo }}</h2><p>{{ juego.descripcion }}</p>
                            <div class="juego-pie"><span><i class="fas fa-school"></i> {{ juego.curso }}</span><span><i class="fas fa-star"></i> Interactivo</span></div>
                            <div class="acciones-juego">
                                <button class="btn-probar gato-boton-juego gato-juego-verde" @click="iniciarJuego(juego)"><i class="fas fa-play"></i> Probar</button>
                                <button v-if="!esDocente" class="btn-estado" @click="cambiarEstado(juego)" :title="juego.estado === 'Activo' ? 'Desactivar' : 'Activar'"><i :class="['fas', juego.estado === 'Activo' ? 'fa-toggle-on' : 'fa-toggle-off']"></i></button>
                                <button v-if="!esDocente" class="btn-eliminar" @click="eliminarJuego(juego)" title="Eliminar"><i class="fas fa-trash"></i></button>
                            </div>
                        </div>
                    </article>
                    <div v-if="!juegosFiltrados.length" class="sin-juegos"><i class="fas fa-gamepad"></i><h3>No encontramos juegos</h3><p>Prueba con otro filtro.</p></div>
                </section>
            </section>

            <JuegosDinamicos v-else @cerrar="pantallaJuegos = 'inicio'" />
        </main>
    </div>

    <section v-if="mostrarJuego && juegoActual" class="pantalla-juego-lectura">
            <header class="prueba-header">
                <div class="marca-gato-lecturas">
                    <img :src="logoGatoLecturas" alt="Gato Lecturas" />
                    <div>
                        <span>AVENTURA INTERACTIVA</span>
                        <h2>{{ juegoActual.titulo }}</h2>
                    </div>
                </div>
                <button class="btn-volver-juego-grande gato-boton-juego gato-juego-azul" @click="cerrarJuego"><i class="fas fa-arrow-left"></i> Volver a Juegos</button>
            </header>
            <LecturaGuiada v-if="juegoActual.tipo === 'lectura-guiada'" @cerrar="cerrarJuego" />
            <JuegoInteractivo v-else :juego="juegoActual" @cerrar="cerrarJuego" />
    </section>

</template>
