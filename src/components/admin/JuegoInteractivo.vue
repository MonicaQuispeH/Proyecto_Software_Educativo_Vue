<script setup>
import { computed, ref, watch } from 'vue'
import gatoAlegre from '../../assets/gato-lectura/gato-alegre.png'
import gatoConfundido from '../../assets/gato-lectura/gato-confundido.png'
import gatoTriste from '../../assets/gato-lectura/gato-triste.png'
import gatoAdmirado from '../../assets/gato-lectura/gato-admirado.png'
import gatoMiraDerecha from '../../assets/gato-lectura/gato-mira-derecha.png'
import logoGatoLecturas from '../../assets/gato-lectura/logo-gato-lecturas.png'

const props = defineProps({
    juego: { type: Object, required: true }
})

const emit = defineEmits(['cerrar'])

const ronda = ref(0)
const puntaje = ref(0)
const respondido = ref(false)
const correcta = ref(false)
const seleccion = ref('')
const respuestaTexto = ref('')
const ordenSeleccionado = ref([])
const palabrasDisponibles = ref([])
const arrastrando = ref(null)
const parejaSeleccionada = ref(null)
const parejasEncontradas = ref([])
const mostrarResultado = ref(false)
const celebracion = ref(false)

const bancos = {
    comprension: [
        {
            texto: 'Marta salió temprano de casa porque quería visitar la biblioteca del barrio. Llevó su cuaderno para anotar palabras nuevas.',
            pregunta: '¿Por qué Marta salió temprano de casa?',
            opciones: ['Para visitar la biblioteca', 'Para jugar fútbol', 'Para ir al mercado'],
            correcta: 'Para visitar la biblioteca'
        },
        {
            texto: 'Tomás encontró una semilla en el patio. La sembró, la regó cada día y después de varias semanas apareció una pequeña planta.',
            pregunta: '¿Qué hizo Tomás después de sembrar la semilla?',
            opciones: ['La regó cada día', 'La guardó en una caja', 'La llevó a la escuela'],
            correcta: 'La regó cada día'
        },
        {
            texto: 'Lucía preparó una mochila con agua, fruta y una gorra. Su familia caminó hasta un parque cercano para pasar la mañana.',
            pregunta: '¿Qué llevó Lucía en su mochila?',
            opciones: ['Agua, fruta y una gorra', 'Libros y lápices', 'Una pelota y una cometa'],
            correcta: 'Agua, fruta y una gorra'
        },
        {
            texto: 'El perro Bruno escuchó un ruido detrás de la puerta. Se acercó con curiosidad y descubrió que era su dueño regresando a casa.',
            pregunta: '¿Qué descubrió Bruno?',
            opciones: ['Que su dueño regresaba', 'Que había un gato', 'Que la puerta estaba rota'],
            correcta: 'Que su dueño regresaba'
        },
        {
            texto: 'Ana leyó un cuento sobre una niña que ayudaba a sus vecinos. Al terminar, pensó que una pequeña ayuda puede alegrar el día de otra persona.',
            pregunta: '¿Qué idea aprendió Ana?',
            opciones: ['Que ayudar puede alegrar a otros', 'Que leer es aburrido', 'Que siempre debe trabajar sola'],
            correcta: 'Que ayudar puede alegrar a otros'
        }
    ],
    vocabulario: [
        { pregunta: 'Une cada palabra con su significado parecido.', pares: [['Feliz', 'Contento'], ['Rápido', 'Veloz'], ['Bonito', 'Hermoso']] },
        { pregunta: 'Une cada palabra con su contrario.', pares: [['Grande', 'Pequeño'], ['Frío', 'Caliente'], ['Alto', 'Bajo']] },
        { pregunta: 'Une cada palabra con una palabra de significado parecido.', pares: [['Comenzar', 'Empezar'], ['Mirar', 'Observar'], ['Ayudar', 'Colaborar']] },
        { pregunta: 'Une cada palabra con su contrario.', pares: [['Día', 'Noche'], ['Cerca', 'Lejos'], ['Limpio', 'Sucio']] },
        { pregunta: 'Une cada palabra con su significado parecido.', pares: [['Casa', 'Hogar'], ['Maestro', 'Profesor'], ['Camino', 'Sendero']] }
    ],
    ortografia: [
        { pregunta: 'Elige la palabra escrita correctamente.', opciones: ['Biblioteca', 'Bivlioteca', 'Biblioteka'], correcta: 'Biblioteca' },
        { pregunta: 'Elige la palabra escrita correctamente.', opciones: ['Avión', 'Avion', 'Havión'], correcta: 'Avión' },
        { pregunta: 'Elige la palabra escrita correctamente.', opciones: ['Árbol', 'Arvol', 'Harbol'], correcta: 'Árbol' },
        { pregunta: 'Elige la palabra escrita correctamente.', opciones: ['Canción', 'Cansión', 'Kanción'], correcta: 'Canción' },
        { pregunta: 'Elige la palabra escrita correctamente.', opciones: ['Escuela', 'Hescuela', 'Escuella'], correcta: 'Escuela' }
    ],
    oracion: [
        { pregunta: 'Ordena las palabras para formar una oración.', palabras: ['El', 'niño', 'lee', 'un', 'cuento'], correcta: ['El', 'niño', 'lee', 'un', 'cuento'] },
        { pregunta: 'Ordena las palabras para formar una oración.', palabras: ['La', 'mariposa', 'vuela', 'alto'], correcta: ['La', 'mariposa', 'vuela', 'alto'] },
        { pregunta: 'Ordena las palabras para formar una oración.', palabras: ['Mi', 'mamá', 'prepara', 'una', 'torta'], correcta: ['Mi', 'mamá', 'prepara', 'una', 'torta'] },
        { pregunta: 'Ordena las palabras para formar una oración.', palabras: ['Los', 'niños', 'juegan', 'en', 'el', 'patio'], correcta: ['Los', 'niños', 'juegan', 'en', 'el', 'patio'] },
        { pregunta: 'Ordena las palabras para formar una oración.', palabras: ['El', 'sol', 'brilla', 'por', 'la', 'mañana'], correcta: ['El', 'sol', 'brilla', 'por', 'la', 'mañana'] }
    ],
    silabas: [
        { pregunta: 'Forma la palabra “mariposa”.', opciones: ['ma', 'ri', 'po', 'sa'], correcta: ['ma', 'ri', 'po', 'sa'] },
        { pregunta: 'Forma la palabra “camino”.', opciones: ['ca', 'mi', 'no'], correcta: ['ca', 'mi', 'no'] },
        { pregunta: 'Forma la palabra “escuela”.', opciones: ['es', 'cue', 'la'], correcta: ['es', 'cue', 'la'] },
        { pregunta: 'Forma la palabra “pelota”.', opciones: ['pe', 'lo', 'ta'], correcta: ['pe', 'lo', 'ta'] },
        { pregunta: 'Forma la palabra “familia”.', opciones: ['fa', 'mi', 'lia'], correcta: ['fa', 'mi', 'lia'] }
    ],
    escritura: [
        { pregunta: 'Gato Lectura encontró un ____ de cuentos en la biblioteca.', opciones: ['libro', 'zapato', 'avión'], correcta: 'libro' },
        { pregunta: 'La abeja visita las flores y produce ____.', opciones: ['miel', 'arena', 'nieve'], correcta: 'miel' },
        { pregunta: 'El pez necesita ____ para poder vivir.', opciones: ['agua', 'tierra', 'cielo'], correcta: 'agua' },
        { pregunta: 'Antes de ir a clases, Ana guarda sus cuadernos en la ____.', opciones: ['mochila', 'nevera', 'almohada'], correcta: 'mochila' },
        { pregunta: 'Para leer una historia, necesitamos abrir el ____.', opciones: ['libro', 'balón', 'paraguas'], correcta: 'libro' }
    ],
    secuencia: [
        { pregunta: 'Ordena los pasos para sembrar una semilla.', opciones: ['Regar la semilla', 'Poner la semilla en la tierra', 'Observar cómo crece'], correcta: ['Poner la semilla en la tierra', 'Regar la semilla', 'Observar cómo crece'] },
        { pregunta: 'Ordena una visita a la biblioteca.', opciones: ['Elegir un libro', 'Entrar a la biblioteca', 'Leer el libro'], correcta: ['Entrar a la biblioteca', 'Elegir un libro', 'Leer el libro'] },
        { pregunta: 'Ordena la preparación de una limonada.', opciones: ['Mezclar los ingredientes', 'Exprimir los limones', 'Servir la limonada'], correcta: ['Exprimir los limones', 'Mezclar los ingredientes', 'Servir la limonada'] },
        { pregunta: 'Ordena una mañana antes de ir a clases.', opciones: ['Llegar a la escuela', 'Desayunar', 'Preparar la mochila'], correcta: ['Desayunar', 'Preparar la mochila', 'Llegar a la escuela'] },
        { pregunta: 'Ordena una historia sencilla.', opciones: ['Resolver el problema', 'Aparece un problema', 'Celebrar el final'], correcta: ['Aparece un problema', 'Resolver el problema', 'Celebrar el final'] }
    ]
}

const actividad = computed(() => bancos[props.juego?.tipo] || bancos.comprension)
const actual = computed(() => actividad.value[ronda.value])
const esResultadoFinal = computed(() => mostrarResultado.value)
const progreso = computed(() => Math.round(((ronda.value + (respondido.value ? 1 : 0)) / actividad.value.length) * 100))
const estrellas = computed(() => {
    if (!actividad.value.length) return 0
    return Math.round((puntaje.value / (actividad.value.length * 10)) * 5)
})

const mensajeGato = computed(() => {
    if (mostrarResultado.value) {
        if (puntaje.value >= 40) return '¡Qué gran aventura! Lo hiciste muy bien. Estoy orgulloso de tu esfuerzo.'
        if (puntaje.value >= 20) return '¡Muy bien! Ya aprendiste varias cosas. Si practicas un poquito más, serás increíble.'
        return 'Vaya, hoy no nos fue tan bien. No te preocupes, ¡para la próxima nos irá mucho mejor!'
    }
    if (!respondido.value) {
        const mensajes = {
            comprension: 'Lee la historia con mucha atención. Después piensa: ¿qué ocurrió y por qué?',
            vocabulario: '¡Vamos a unir las palabras! Busca las parejas que tengan relación.',
            ortografia: 'Activa tu lupa de detective y encuentra la palabra que está bien escrita.',
            oracion: '¡Construyamos una oración! Puedes tocar o arrastrar las palabras para ordenarlas.',
            silabas: 'Junta las sílabas, una por una. ¡Al final aparecerá una palabra!',
            escritura: 'Lee la oración con atención y elige la palabra que mejor completa la aventura.',
            secuencia: 'Piensa qué ocurre primero, qué sucede después y cómo termina.'
        }
        return mensajes[props.juego?.tipo] || mensajes.comprension
    }
    return correcta.value
        ? '¡Sí! ¡Encontramos la respuesta! Vamos por la siguiente aventura.'
        : '¡Casi! Mira la pista y aprende del intento. ¡Puedes hacerlo!'
})

const tituloGato = computed(() => {
    if (mostrarResultado.value) return puntaje.value >= 40 ? '¡Misión cumplida!' : '¡Seguimos practicando!'
    if (!respondido.value) return '¡Hola, aventurero!'
    return correcta.value ? '¡Lo lograste!' : '¡No te rindas!'
})

const imagenGato = computed(() => {
    if (mostrarResultado.value) {
        return puntaje.value >= 40 ? gatoAdmirado : gatoTriste
    }
    if (!respondido.value) return gatoMiraDerecha
    return correcta.value ? gatoAlegre : gatoConfundido
})

function normalizar(texto) {
    return String(texto || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function reiniciarJuego() {
    ronda.value = 0
    puntaje.value = 0
    respondido.value = false
    correcta.value = false
    seleccion.value = ''
    respuestaTexto.value = ''
    ordenSeleccionado.value = []
    palabrasDisponibles.value = []
    arrastrando.value = null
    parejaSeleccionada.value = null
    parejasEncontradas.value = []
    mostrarResultado.value = false
    celebracion.value = false
    prepararRonda()
}

function prepararRonda() {
    const item = actual.value
    seleccion.value = ''
    respuestaTexto.value = ''
    respondido.value = false
    correcta.value = false
    ordenSeleccionado.value = []
    palabrasDisponibles.value = item?.palabras
        ? [...item.palabras].sort(() => Math.random() - 0.5)
        : item?.opciones
            ? [...item.opciones].sort(() => Math.random() - 0.5)
            : []
    arrastrando.value = null
    parejaSeleccionada.value = null
    parejasEncontradas.value = []
    celebracion.value = false
}

watch(() => props.juego, reiniciarJuego, { immediate: true })

function finalizarRespuesta(esCorrecta) {
    if (respondido.value) return
    correcta.value = esCorrecta
    respondido.value = true
    if (esCorrecta) {
        puntaje.value += 10
        celebracion.value = true
        window.setTimeout(() => { celebracion.value = false }, 900)
    }
}

function seleccionarOpcion(opcion) {
    if (respondido.value) return
    seleccion.value = opcion
    finalizarRespuesta(opcion === actual.value.correcta)
}

function comprobarEscritura() {
    if (respondido.value || !respuestaTexto.value.trim()) return
    finalizarRespuesta(normalizar(respuestaTexto.value) === normalizar(actual.value.correcta))
}

function seleccionarElemento(elemento) {
    if (respondido.value || ordenSeleccionado.value.includes(elemento)) return
    ordenSeleccionado.value.push(elemento)
    palabrasDisponibles.value = palabrasDisponibles.value.filter((item) => item !== elemento)
    if (ordenSeleccionado.value.length === actual.value.correcta.length) {
        finalizarRespuesta(JSON.stringify(ordenSeleccionado.value) === JSON.stringify(actual.value.correcta))
    }
}

function quitarElemento(indice) {
    if (respondido.value) return
    const [elemento] = ordenSeleccionado.value.splice(indice, 1)
    if (elemento) palabrasDisponibles.value.push(elemento)
}

function iniciarArrastre(elemento) {
    if (respondido.value) return
    arrastrando.value = elemento
}

function soltarEnOrden(indice) {
    if (respondido.value || !arrastrando.value) return
    const origen = ordenSeleccionado.value.indexOf(arrastrando.value)
    if (origen !== -1) ordenSeleccionado.value.splice(origen, 1)
    ordenSeleccionado.value.splice(indice, 0, arrastrando.value)
    arrastrando.value = null
}

function soltarNuevo() {
    if (respondido.value || !arrastrando.value) return
    const elemento = arrastrando.value
    if (!ordenSeleccionado.value.includes(elemento)) ordenSeleccionado.value.push(elemento)
    palabrasDisponibles.value = palabrasDisponibles.value.filter((item) => item !== elemento)
    arrastrando.value = null
    if (ordenSeleccionado.value.length === actual.value.correcta.length) {
        finalizarRespuesta(JSON.stringify(ordenSeleccionado.value) === JSON.stringify(actual.value.correcta))
    }
}

function elegirParejaIzquierda(valor) {
    if (respondido.value || parejasEncontradas.value.includes(valor)) return
    parejaSeleccionada.value = valor
}

function elegirParejaDerecha(valor) {
    if (respondido.value || !parejaSeleccionada.value || parejasEncontradas.value.includes(valor)) return
    const pareja = actual.value.pares.find((item) => item[0] === parejaSeleccionada.value)
    if (pareja && pareja[1] === valor) {
        parejasEncontradas.value.push(valor)
        if (parejasEncontradas.value.length === actual.value.pares.length) finalizarRespuesta(true)
    } else {
        correcta.value = false
        celebracion.value = false
        parejaSeleccionada.value = null
    }
}

function siguiente() {
    if (ronda.value >= actividad.value.length - 1) {
        mostrarResultado.value = true
        return
    }
    ronda.value += 1
    prepararRonda()
}

function volverAIntentar() {
    reiniciarJuego()
}
</script>

<template>
    <section :class="['juego-interactivo', `juego-tipo-${juego.tipo}`, { 'juego-celebra': celebracion }]">
        <div class="decoracion-juego decoracion-uno">★</div>
        <div class="decoracion-juego decoracion-dos">●</div>
        <div class="decoracion-juego decoracion-tres">✦</div>

        <div class="juego-guia">
            <div :class="['juego-gato', { 'gato-salta': celebracion, 'gato-reacciona': respondido }]">
                <img :src="imagenGato" alt="Gato Lectura" />
            </div>
            <div class="juego-dialogo">
                <span class="dialogo-nombre">Gato Lectura</span>
                <strong>{{ tituloGato }}</strong>
                <p>{{ mensajeGato }}</p>
            </div>
        </div>

        <div v-if="!esResultadoFinal" class="juego-area">
            <div class="juego-cabecera-nino">
                <div>
                    <span class="etiqueta-aventura">AVENTURA {{ ronda + 1 }}</span>
                    <h3>{{ juego.titulo }}</h3>
                </div>
                <div class="marcador-puntos">
                    <i class="fas fa-star"></i>
                    <strong>{{ puntaje }}</strong>
                    <span>puntos</span>
                </div>
            </div>

            <div class="juego-progreso">
                <span>Reto {{ ronda + 1 }} de {{ actividad.length }}</span>
                <strong>{{ progreso }}%</strong>
            </div>
            <div class="juego-barra-progreso">
                <span :style="{ width: `${progreso}%` }"></span>
            </div>

            <div class="juego-pregunta">
                <div v-if="actual.texto" class="lectura-mini">
                    <div class="lectura-icono"><i class="fas fa-book-open"></i></div>
                    <div>
                        <strong>Lee con atención</strong>
                        <p>{{ actual.texto }}</p>
                    </div>
                </div>

                <div class="pregunta-titulo">
                    <span class="numero-ronda">{{ ronda + 1 }}</span>
                    <h2>{{ actual.pregunta }}</h2>
                </div>

                <div v-if="['comprension', 'ortografia'].includes(juego.tipo)" class="opciones-interactivas">
                    <button
                        v-for="(opcion, indice) in actual.opciones"
                        :key="opcion"
                        :class="['opcion-interactiva', `opcion-${indice + 1}`, { seleccionada: seleccion === opcion, correcta: respondido && opcion === actual.correcta, incorrecta: respondido && seleccion === opcion && opcion !== actual.correcta }]"
                        @click="seleccionarOpcion(opcion)"
                    >
                        <span class="letra-opcion">{{ String.fromCharCode(65 + indice) }}</span>
                        <span class="texto-opcion">{{ opcion }}</span>
                        <i v-if="respondido && opcion === actual.correcta" class="fas fa-check-circle"></i>
                        <i v-else-if="respondido && seleccion === opcion" class="fas fa-times-circle"></i>
                    </button>
                </div>

                <div v-else-if="juego.tipo === 'vocabulario'" class="parejas-juego">
                    <p class="ayuda-juego">Primero toca una palabra de la izquierda y luego su pareja.</p>
                    <div class="parejas-columnas">
                        <div class="parejas-columna">
                            <button
                                v-for="pareja in actual.pares"
                                :key="pareja[0]"
                                :class="['tarjeta-pareja', 'pareja-izquierda', { elegida: parejaSeleccionada === pareja[0], encontrada: parejasEncontradas.includes(pareja[1]) }]"
                                @click="elegirParejaIzquierda(pareja[0])"
                            >
                                <span>{{ pareja[0] }}</span>
                                <i v-if="parejasEncontradas.includes(pareja[1])" class="fas fa-check"></i>
                            </button>
                        </div>
                        <div class="parejas-columna">
                            <button
                                v-for="pareja in [...actual.pares].reverse()"
                                :key="pareja[1]"
                                :class="['tarjeta-pareja', 'pareja-derecha', { encontrada: parejasEncontradas.includes(pareja[1]) }]"
                                @click="elegirParejaDerecha(pareja[1])"
                            >
                                <span>{{ pareja[1] }}</span>
                                <i v-if="parejasEncontradas.includes(pareja[1])" class="fas fa-check"></i>
                            </button>
                        </div>
                    </div>
                    <div class="contador-parejas">Parejas encontradas: <strong>{{ parejasEncontradas.length }} / {{ actual.pares.length }}</strong></div>
                </div>

                <div v-else-if="juego.tipo === 'oracion'" class="constructor-juego constructor-arrastrar">
                    <p class="ayuda-juego">Arrastra las palabras a la oración o tócalas para agregarlas.</p>
                    <div class="respuesta-construida zona-destino" @dragover.prevent @drop="soltarNuevo">
                        <button
                            v-for="(palabra, indice) in ordenSeleccionado"
                            :key="`${palabra}-${indice}`"
                            class="palabra-seleccionada palabra-arrastrable"
                            draggable="true"
                            @dragstart="iniciarArrastre(palabra)"
                            @dragover.prevent
                            @drop.stop="soltarEnOrden(indice)"
                            @click="quitarElemento(indice)"
                        >{{ palabra }}</button>
                        <span v-if="!ordenSeleccionado.length"><i class="fas fa-hand-pointer"></i> Suelta las palabras aquí...</span>
                    </div>
                    <div class="palabras-disponibles">
                        <button
                            v-for="palabra in palabrasDisponibles"
                            :key="palabra"
                            class="palabra-boton palabra-grande"
                            draggable="true"
                            @dragstart="iniciarArrastre(palabra)"
                            @click="seleccionarElemento(palabra)"
                        >{{ palabra }}</button>
                    </div>
                </div>

                <div v-else-if="juego.tipo === 'silabas'" class="constructor-juego silabas-juego">
                    <p class="ayuda-juego">Toca las sílabas en el orden correcto para construir la palabra.</p>
                    <div class="palabra-construida-grande">
                        <span v-if="!ordenSeleccionado.length">?</span>
                        <button
                            v-for="(silaba, indice) in ordenSeleccionado"
                            :key="`${silaba}-${indice}`"
                            class="silaba-seleccionada"
                            @click="quitarElemento(indice)"
                        >{{ silaba }}</button>
                    </div>
                    <div class="silabas-disponibles">
                        <button
                            v-for="silaba in palabrasDisponibles"
                            :key="silaba"
                            class="silaba-boton-grande"
                            @click="seleccionarElemento(silaba)"
                        >{{ silaba }}</button>
                    </div>
                </div>

                <div v-else-if="juego.tipo === 'escritura'" class="escritura-interactiva completar-aventura">
                    <div class="cuaderno-falso">
                        <i class="fas fa-pencil-alt"></i>
                        <span>Elige la palabra que completa mejor la oración</span>
                    </div>
                    <div class="opciones-interactivas">
                        <button
                            v-for="(opcion, indice) in actual.opciones"
                            :key="opcion"
                            :class="['opcion-interactiva', `opcion-${indice + 1}`, { seleccionada: seleccion === opcion, correcta: respondido && opcion === actual.correcta, incorrecta: respondido && seleccion === opcion && opcion !== actual.correcta }]"
                            @click="seleccionarOpcion(opcion)"
                        >
                            <span class="letra-opcion">{{ String.fromCharCode(65 + indice) }}</span>
                            <span class="texto-opcion">{{ opcion }}</span>
                            <i v-if="respondido && opcion === actual.correcta" class="fas fa-circle-check"></i>
                            <i v-else-if="respondido && seleccion === opcion" class="fas fa-circle-xmark"></i>
                        </button>
                    </div>
                </div>

                <div v-else-if="juego.tipo === 'secuencia'" class="constructor-juego constructor-secuencia">
                    <p class="ayuda-juego">Arrastra las tarjetas o tócalas para colocarlas en orden.</p>
                    <div class="secuencia-destino" @dragover.prevent @drop="soltarNuevo">
                        <div v-if="!ordenSeleccionado.length" class="secuencia-vacia"><i class="fas fa-arrow-down"></i> Coloca aquí la primera tarjeta</div>
                        <button
                            v-for="(paso, indice) in ordenSeleccionado"
                            :key="`${paso}-${indice}`"
                            class="tarjeta-secuencia elegida"
                            draggable="true"
                            @dragstart="iniciarArrastre(paso)"
                            @dragover.prevent
                            @drop.stop="soltarEnOrden(indice)"
                            @click="quitarElemento(indice)"
                        >
                            <span class="numero-paso">{{ indice + 1 }}</span>
                            <span>{{ paso }}</span>
                        </button>
                    </div>
                    <div class="secuencia-opciones">
                        <button
                            v-for="paso in palabrasDisponibles"
                            :key="paso"
                            class="tarjeta-secuencia"
                            draggable="true"
                            @dragstart="iniciarArrastre(paso)"
                            @click="seleccionarElemento(paso)"
                        >
                            <i class="fas fa-arrows-up-down"></i>
                            <span>{{ paso }}</span>
                        </button>
                    </div>
                </div>

                <div v-if="respondido" :class="['mensaje-validacion', correcta ? 'bien' : 'mal']">
                    <i :class="['fas', correcta ? 'fa-circle-check' : 'fa-lightbulb']"></i>
                    <span>{{ correcta ? '¡Excelente! Tu respuesta es correcta.' : 'Casi. Observa la pista de Gato Lectura y sigue practicando.' }}</span>
                </div>
            </div>

            <div class="juego-acciones">
                <button class="btn-salir-juego gato-boton-juego gato-juego-rojo" @click="emit('cerrar')"><i class="fas fa-door-open"></i> Salir</button>
                <button v-if="respondido" class="btn-siguiente-juego btn-grande gato-boton-juego gato-juego-azul" @click="siguiente">
                    {{ ronda === actividad.length - 1 ? 'Ver mi resultado' : 'Siguiente reto' }}
                    <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>

        <div v-else class="resultado-juego">
            <div class="resultado-confeti">★</div>
            <div class="resultado-icono"><i class="fas fa-trophy"></i></div>
            <span>¡AVENTURA TERMINADA!</span>
            <h2>{{ puntaje }} puntos</h2>
            <div class="estrellas-resultado" aria-label="Estrellas obtenidas">
                <i
                    v-for="estrella in 5"
                    :key="estrella"
                    :class="['fas', estrella <= estrellas ? 'fa-star' : 'fa-star', estrella <= estrellas ? 'estrella-activa' : 'estrella-inactiva']"
                ></i>
            </div>
            <p>Lograste <strong>{{ puntaje / 10 }} de {{ actividad.length }}</strong> retos correctamente.</p>
            <div class="resultado-botones">
                <button class="btn-reintentar-juego btn-grande gato-boton-juego gato-juego-verde" @click="volverAIntentar">
                    <i class="fas fa-rotate-right"></i> Jugar nuevamente
                </button>
                <button class="btn-salir-juego btn-grande gato-boton-juego gato-juego-rojo" @click="emit('cerrar')"><i class="fas fa-check"></i> Terminar</button>
            </div>
        </div>
    </section>
</template>
