<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import gatoMiraDerecha from '../../assets/gato-lectura/gato-mira-derecha.png'
import gatoAlegre from '../../assets/gato-lectura/gato-alegre.png'
import gatoConfundido from '../../assets/gato-lectura/gato-confundido.png'
import gatoTriste from '../../assets/gato-lectura/gato-triste.png'
import logoGatoLecturas from '../../assets/gato-lectura/logo-gato-lecturas.png'
import imgAna from '../../assets/gato-lectura/cuentos/el-regalo-de-ana.jpg'
import imgMateo from '../../assets/gato-lectura/cuentos/la-aventura-de-mateo.jpg'
import imgLuna from '../../assets/gato-lectura/cuentos/la-merienda-de-luna.jpg'
import imgExplorador from '../../assets/gato-lectura/cuentos/el-pequeno-explorador.jpg'
import imgBiblioteca from '../../assets/gato-lectura/cuentos/la-biblioteca-magica.jpg'
import imgPerrito from '../../assets/gato-lectura/cuentos/el-perrito-perdido.jpg'
import imgAnaAbuela from '../../assets/gato-lectura/cuentos/el-album-de-la-abuela.jpg'
import imgRuletaHuerto from '../../assets/gato-lectura/cuentos/el-huerto-de-samuel.jpg'
import imgRuletaFaro from '../../assets/gato-lectura/cuentos/el-faro-de-la-costa.jpg'
import imgRuletaExcursion from '../../assets/gato-lectura/cuentos/la-excursioo-de-julia.jpg'
import imgCajaTesoro from '../../assets/gato-lectura/cuentos/el-tesoro-de-bruno.jpg'
import imgCajaCometa from '../../assets/gato-lectura/cuentos/la-cometa-de-elena.jpg'
import imgCajaHuella from '../../assets/gato-lectura/cuentos/la-huella-misteriosa.jpg'
import imgMariposa from '../../assets/gato-lectura/globo-mariposa.svg'
import imgCasa from '../../assets/gato-lectura/globo-casa.svg'
import imgPerro from '../../assets/gato-lectura/globo-perro.svg'
import imgLibro from '../../assets/gato-lectura/globo-libro.svg'
import imgSol from '../../assets/gato-lectura/globo-sol.svg'

import imgOpcionAbuela from '../../assets/gato-lectura/cuentos/a-su-abuela.jpg'
import imgOpcionHermana from '../../assets/gato-lectura/cuentos/a-su-hermana.jpg'
import imgOpcionMaestra from '../../assets/gato-lectura/cuentos/a-su-maestra.jpg'
import imgOpcionMama from '../../assets/gato-lectura/cuentos/a-su-mama.jpg'
import imgOpcionVecina from '../../assets/gato-lectura/cuentos/a-su-vecina.jpg'
import imgOpcionCanciones from '../../assets/gato-lectura/cuentos/canciones-de-un-grupo.jpg'
import imgOpcionFamilia from '../../assets/gato-lectura/cuentos/historias-de-la-familia.jpg'
import imgOpcionRecetas from '../../assets/gato-lectura/cuentos/libro-de-recetas.jpg'
import imgOpcionNoticias from '../../assets/gato-lectura/cuentos/noticias-de-la-escuela.jpg'
import imgOpcionAlbum from '../../assets/gato-lectura/cuentos/un-album-de-fotografias.jpg'
import imgOpcionLibroRecetas from '../../assets/gato-lectura/cuentos/un-libro-de-recetas.jpg'
import imgOpcionJuguetes from '../../assets/gato-lectura/cuentos/una-caja-de-juguetes.jpg'
import '../../styles/admin/juegosDinamicos.css'

const emit = defineEmits(['cerrar'])

const pantalla = ref('lista')
const juegoActivo = ref(null)
const vozPreferida = ref('dama')
const vocesDisponibles = ref([])

const ruletaGirando = ref(false)
const ruletaPaso = ref('inicio')
const ruletaResultado = ref(null)
const ruletaRespuesta = ref(null)
const ruletaIndicePregunta = ref(0)
const ruletaAciertos = ref(0)

const cajaPaso = ref('seleccion')
const cajaAbierta = ref(null)
const cajaRespuesta = ref(null)
const cajaIndicePregunta = ref(0)
const cajaAciertos = ref(0)

const concursoPaso = ref('inicio')
const concursoIndicePregunta = ref(0)
const concursoRespuesta = ref(null)
const concursoAciertos = ref(0)

const globosIndice = ref(0)
const globosRespuesta = ref(null)
const globosAciertos = ref(0)
const globosTerminados = ref(false)

const historiasRuleta = [
    {
        id: 'r1', titulo: 'El pequeño explorador', color: 'naranja', imagen: imgExplorador,
        texto: 'Tomás caminó por el bosque con una lupa. Cerca de un tronco encontró un pequeño caracol. Lo observó con cuidado y luego lo dejó continuar su camino entre las hojas.',
        preguntas: [
            ['¿Qué llevaba Tomás?', ['Una lupa', 'Una mochila', 'Una cámara'], 0],
            ['¿Qué animal encontró?', ['Un caracol', 'Un conejo', 'Un pájaro'], 0],
            ['¿Qué hizo Tomás después?', ['Lo dejó continuar', 'Lo llevó a casa', 'Lo escondió'], 0]
        ]
    },
    {
        id: 'r2', titulo: 'La merienda de Luna', color: 'morado', imagen: imgLuna,
        texto: 'Luna ayudó a su mamá a preparar una merienda. Pusieron pan, queso y frutas en una canasta. Cuando terminaron, salieron al jardín y compartieron la merienda bajo un árbol grande.',
        preguntas: [
            ['¿Qué prepararon Luna y su mamá?', ['Una merienda', 'Una torta', 'Una sopa'], 0],
            ['¿Qué pusieron en la canasta?', ['Pan, queso y frutas', 'Arroz y sopa', 'Galletas y leche'], 0],
            ['¿Dónde compartieron la merienda?', ['Bajo un árbol', 'En la escuela', 'En la cocina'], 0]
        ]
    },
    {
        id: 'r3', titulo: 'La biblioteca mágica', color: 'celeste', imagen: imgBiblioteca,
        texto: 'Sofía encontró en la biblioteca un libro sobre animales. Al abrirlo, descubrió la historia de un oso que vivía cerca de un río y luego compartió lo aprendido con sus compañeros.',
        preguntas: [
            ['¿Dónde encontró Sofía el libro?', ['En la biblioteca', 'En el parque', 'En su casa'], 0],
            ['¿Qué animal aparecía en la historia?', ['Un oso', 'Un caballo', 'Un pez'], 0],
            ['¿Con quién compartió lo aprendido?', ['Con sus compañeros', 'Con su mascota', 'Con un vecino'], 0]
        ]
    },
    {
        id: 'r4', titulo: 'El huerto de Samuel', color: 'verde', imagen: imgRuletaHuerto,
        texto: 'Samuel visitó el huerto de su escuela con su maestra. Vio tomates rojos, zanahorias y pequeñas plantas de lechuga. Antes de volver al aula, regó las plantas con mucho cuidado.',
        preguntas: [
            ['¿Dónde estaba Samuel?', ['En el huerto de la escuela', 'En una tienda', 'En una plaza'], 0],
            ['¿Qué fruta u hortaliza vio de color rojo?', ['Tomates', 'Zanahorias', 'Lechugas'], 0],
            ['¿Qué hizo antes de volver al aula?', ['Regó las plantas', 'Cortó los árboles', 'Guardó los libros'], 0]
        ]
    },
    {
        id: 'r5', titulo: 'La excursión de Julia', color: 'rosa', imagen: imgRuletaExcursion,
        texto: 'Julia salió de excursión con su curso. En el camino observó una cascada y escuchó a los pájaros. Su maestra pidió al grupo que cuidara la naturaleza y no dejara basura.',
        preguntas: [
            ['¿Con quién salió Julia?', ['Con su curso', 'Con su familia', 'Con sus vecinos'], 0],
            ['¿Qué observó en el camino?', ['Una cascada', 'Un castillo', 'Un avión'], 0],
            ['¿Qué pidió la maestra?', ['Cuidar la naturaleza', 'Correr más rápido', 'Recolectar flores'], 0]
        ]
    },
    {
        id: 'r6', titulo: 'El faro de la costa', color: 'azul', imagen: imgRuletaFaro,
        texto: 'Pedro llegó con su familia a un pueblo junto al mar. Desde lejos vio un faro blanco que ayudaba a orientar a los barcos durante la noche. Pedro quedó sorprendido por su gran luz.',
        preguntas: [
            ['¿Dónde llegó Pedro?', ['A un pueblo junto al mar', 'A una montaña', 'A una ciudad nevada'], 0],
            ['¿Qué vio desde lejos?', ['Un faro', 'Un tren', 'Un molino'], 0],
            ['¿Para qué servía el faro?', ['Para orientar a los barcos', 'Para vender pescado', 'Para guardar bicicletas'], 0]
        ]
    }
]

const historiasCajas = [
    {
        id: 'c1', titulo: 'El regalo de Ana', color: 'azul', imagen: imgAna,
        texto: 'Ana llegó a casa y encontró una caja pequeña sobre la mesa. Dentro había un libro de cuentos que su abuela le regaló. Ana se sentó junto a la ventana y comenzó a leer.',
        preguntas: [
            ['¿Qué encontró Ana dentro de la caja?', ['Un libro de cuentos', 'Una pelota', 'Un paraguas'], 0],
            ['¿Quién le regaló el libro?', ['Su abuela', 'Su vecino', 'Su maestro'], 0],
            ['¿Dónde comenzó a leer Ana?', ['Junto a la ventana', 'En el patio', 'En la cocina'], 0]
        ]
    },
    {
        id: 'c2', titulo: 'La aventura de Mateo', color: 'verde', imagen: imgMateo,
        texto: 'Mateo salió al parque con su cometa. El viento comenzó a soplar y la cometa subió muy alto. De pronto, Mateo vio una mariposa amarilla sobre una flor y decidió acercarse para observarla.',
        preguntas: [
            ['¿Qué llevó Mateo al parque?', ['Una cometa', 'Una bicicleta', 'Un balón'], 0],
            ['¿De qué color era la mariposa?', ['Amarilla', 'Azul', 'Roja'], 0],
            ['¿Dónde estaba la mariposa?', ['Sobre una flor', 'En un árbol', 'En una banca'], 0]
        ]
    },
    {
        id: 'c3', titulo: 'El perrito perdido', color: 'rosa', imagen: imgPerrito,
        texto: 'Camila caminaba por la plaza cuando escuchó un pequeño ladrido. Cerca de una banca encontró un perrito que parecía estar perdido. Camila miró su placa y ayudó a encontrar a su familia.',
        preguntas: [
            ['¿Dónde estaba Camila?', ['En la plaza', 'En la biblioteca', 'En la escuela'], 0],
            ['¿Qué animal encontró?', ['Un perrito', 'Un gatito', 'Un conejo'], 0],
            ['¿Qué hizo Camila?', ['Ayudó a encontrar a su familia', 'Se llevó al perrito', 'Lo escondió'], 0]
        ]
    },
    {
        id: 'c4', titulo: 'El tesoro de Bruno', color: 'naranja', imagen: imgCajaTesoro,
        texto: 'Bruno encontró un mapa viejo dentro de un cajón. Siguió las pistas hasta el jardín y descubrió una pequeña caja enterrada. Dentro había semillas que su abuelo quería plantar.',
        preguntas: [
            ['¿Qué encontró Bruno?', ['Un mapa', 'Una pelota', 'Una carta'], 0],
            ['¿Dónde estaba la caja?', ['En el jardín', 'En la cocina', 'En la escuela'], 0],
            ['¿Qué había dentro?', ['Semillas', 'Monedas de oro', 'Juguetes'], 0]
        ]
    },
    {
        id: 'c5', titulo: 'La cometa de Elena', color: 'morado', imagen: imgCajaCometa,
        texto: 'Elena construyó una cometa con papel de colores. Salió al campo con su hermano y la hizo volar cuando empezó a soplar el viento. Los dos se alegraron al verla subir.',
        preguntas: [
            ['¿Qué construyó Elena?', ['Una cometa', 'Una caja', 'Un barco'], 0],
            ['¿Con quién salió al campo?', ['Con su hermano', 'Con su maestra', 'Con su vecina'], 0],
            ['¿Qué hizo que la cometa subiera?', ['El viento', 'La lluvia', 'La nieve'], 0]
        ]
    },
    {
        id: 'c6', titulo: 'La huella misteriosa', color: 'celeste', imagen: imgCajaHuella,
        texto: 'Martín encontró una huella grande junto al camino. La siguió con curiosidad y descubrió que pertenecía a un perro que estaba jugando cerca de una casa. Martín sonrió al resolver el misterio.',
        preguntas: [
            ['¿Qué encontró Martín?', ['Una huella', 'Una llave', 'Una flor'], 0],
            ['¿A quién pertenecía la huella?', ['A un perro', 'A un gato', 'A un caballo'], 0],
            ['¿Cómo se sintió Martín?', ['Contento', 'Asustado', 'Enojado'], 0]
        ]
    }
]

const concursoActual = {
    titulo: 'El álbum de la abuela', personaje: 'fa-person-dress', color: 'amarillo', imagen: imgAnaAbuela,
    texto: 'Clara visitó a su abuela una tarde de domingo. Juntas abrieron un viejo álbum de fotografías. Clara reconoció a su mamá cuando era niña y escuchó muchas historias de la familia.',
    preguntas: [
        ['¿A quién visitó Clara?', ['A su abuela', 'A su maestra', 'A su vecina'], 0],
        ['¿Qué abrieron juntas?', ['Un álbum de fotografías', 'Una caja de juguetes', 'Un libro de recetas'], 0],
        ['¿A quién reconoció Clara en una fotografía?', ['A su mamá', 'A su hermana', 'A su profesora'], 0],
        ['¿Qué escuchó Clara?', ['Historias de la familia', 'Canciones de un grupo', 'Noticias de la escuela'], 0]
    ]
}

const globos = [
    { letra: 'MA', palabra: 'MARIPOSA', imagen: imgMariposa, opciones: ['MA', 'ME', 'MI'], correcta: 0 },
    { letra: 'CA', palabra: 'CASA', imagen: imgCasa, opciones: ['CA', 'CO', 'CU'], correcta: 0 },
    { letra: 'PE', palabra: 'PERRO', imagen: imgPerro, opciones: ['PA', 'PE', 'PI'], correcta: 1 },
    { letra: 'LI', palabra: 'LIBRO', imagen: imgLibro, opciones: ['LA', 'LE', 'LI'], correcta: 2 },
    { letra: 'SO', palabra: 'SOL', imagen: imgSol, opciones: ['SA', 'SE', 'SO'], correcta: 2 }
]

const cajas = historiasCajas.map((historia, index) => ({
    id: index + 1, numero: index + 1, color: historia.color, icono: 'fa-box-open', historia
}))

const juegosDinamicos = [
    { id: 'ruleta', titulo: 'Ruleta Comprensiva', descripcion: 'Gira la ruleta, descubre una historia y responde sus preguntas.', icono: 'fa-spinner', color: 'azul', etiqueta: 'Lectura + azar' },
    { id: 'cajas', titulo: 'Abre Cajas', descripcion: 'Elige una caja sorpresa y descubre qué historia se esconde dentro.', icono: 'fa-box-open', color: 'rosa', etiqueta: 'Sorpresa visual' },
    { id: 'concurso', titulo: 'Concurso de Preguntas', descripcion: 'Lee una historia con su personaje y participa en un gran concurso.', icono: 'fa-trophy', color: 'amarillo', etiqueta: 'Preguntas + imágenes' },
    { id: 'globos', titulo: 'Globos de Palabras', descripcion: 'Revienta el globo correcto y completa la palabra con su sílaba.', icono: 'fa-balloon', color: 'verde', etiqueta: 'Fonética en español' }
]

const imagenHistoria = (historia) => historia?.imagen || logoGatoLecturas
const historiaRuletaActual = computed(() => historiasRuleta.find(h => h.id === ruletaResultado.value) || null)
const preguntaRuletaActual = computed(() => historiaRuletaActual.value?.preguntas[ruletaIndicePregunta.value] || null)
const historiaCajaActual = computed(() => cajaAbierta.value?.historia || null)
const preguntaCajaActual = computed(() => historiaCajaActual.value?.preguntas[cajaIndicePregunta.value] || null)
const preguntaConcursoActual = computed(() => concursoActual?.preguntas[concursoIndicePregunta.value] || null)
const globoActual = computed(() => globos[globosIndice.value] || null)
const estrellasRuleta = computed(() => Math.round((ruletaAciertos.value / 3) * 5))
const estrellasCajas = computed(() => Math.round((cajaAciertos.value / 3) * 5))
const estrellasConcurso = computed(() => Math.round((concursoAciertos.value / concursoActual.preguntas.length) * 5))
const estrellasGlobos = computed(() => Math.round((globosAciertos.value / globos.length) * 5))

function cargarVoces() {
    if (!('speechSynthesis' in window)) return
    vocesDisponibles.value = window.speechSynthesis.getVoices().filter(v => v.lang?.toLowerCase().startsWith('es'))
}

if ('speechSynthesis' in window) {
    cargarVoces()
    window.speechSynthesis.onvoiceschanged = cargarVoces
}

function vozElegida() {
    const voces = vocesDisponibles.value
    if (!voces.length) return null
    const puntuar = (voz) => {
        const nombre = `${voz.name} ${voz.voiceURI}`.toLowerCase()
        let puntos = 0
        if (voz.lang?.toLowerCase().startsWith('es')) puntos += 5
        if (voz.localService) puntos += 1
        if (vozPreferida.value === 'dama' && /(female|mujer|woman|monica|paulina|helena|luciana|soledad|elena|carmen|sara|sabina|laura|maria|paloma|valentina|victoria|isabel|consuelo|rosa|teresa)/i.test(nombre)) puntos += 18
        if (vozPreferida.value === 'nina' && /(child|girl|niña|infant|kid|menor|joven)/i.test(nombre)) puntos += 18
        if (vozPreferida.value === 'nino' && /(child|boy|niño|infant|kid|menor|joven)/i.test(nombre)) puntos += 18
        if (vozPreferida.value !== 'dama' && /(female|mujer|woman)/i.test(nombre)) puntos += 4
        return puntos
    }
    return [...voces].sort((a, b) => puntuar(b) - puntuar(a))[0]
}

let vozActiva = null
let vozRescate = null
const errorVoz = ref('')
function hablar(texto) {
    errorVoz.value = ''
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
        errorVoz.value = 'Este navegador no admite lectura en voz alta. Prueba Chrome o Edge con una voz española instalada.'
        return
    }
    const sintetizador = window.speechSynthesis
    clearTimeout(vozRescate)
    sintetizador.cancel()
    cargarVoces()
    const mensaje = String(texto || '').trim()
    if (!mensaje) return
    const reproducir = (usarVoz, reintento = false) => {
        const utterance = new SpeechSynthesisUtterance(mensaje)
        utterance.lang = usarVoz?.lang || 'es-ES'
        utterance.rate = 0.88
        utterance.pitch = vozPreferida.value === 'nino' ? 1.16 : vozPreferida.value === 'nina' ? 1.25 : 1.04
        utterance.volume = 1
        if (usarVoz) utterance.voice = usarVoz
        vozActiva = utterance
        utterance.onstart = () => { errorVoz.value = ''; clearTimeout(vozRescate) }
        utterance.onend = () => { clearTimeout(vozRescate); if (vozActiva === utterance) vozActiva = null }
        utterance.onerror = (evento) => {
            clearTimeout(vozRescate)
            if (vozActiva !== utterance) return
            vozActiva = null
            if (!reintento && evento.error !== 'canceled' && evento.error !== 'interrupted') {
                sintetizador.cancel()
                reproducir(null, true) // Voz predeterminada del sistema si falla la voz elegida
            } else if (evento.error !== 'canceled' && evento.error !== 'interrupted') {
                errorVoz.value = 'No se pudo reproducir la voz. Revisa el volumen, las voces en español de Windows y prueba nuevamente.'
            }
        }
        sintetizador.speak(utterance)
        if (sintetizador.paused) sintetizador.resume()
        vozRescate = setTimeout(() => {
            if (vozActiva === utterance && !sintetizador.speaking) {
                sintetizador.cancel()
                if (!reintento) reproducir(null, true)
                else errorVoz.value = 'La voz no se inició. Comprueba que Windows tenga una voz en español y que el sitio pueda reproducir sonido.'
            }
        }, 2500)
    }
    reproducir(vozElegida())
}

function leerHistoria(historia) {
    hablar(historia.texto)
}

function detenerAudio() {
    clearTimeout(vozRescate)
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
}

function abrirJuego(id) {
    detenerAudio()
    juegoActivo.value = id
    pantalla.value = 'juego'
    if (id === 'ruleta') reiniciarRuleta()
    if (id === 'cajas') reiniciarCajas()
    if (id === 'concurso') reiniciarConcurso()
    if (id === 'globos') reiniciarGlobos()
}

function cerrarJuego() {
    detenerAudio()
    juegoActivo.value = null
    pantalla.value = 'lista'
}

function volverALista() {
    cerrarJuego()
    pantalla.value = 'lista'
}

function girarRuleta() {
    if (ruletaGirando.value) return
    ruletaGirando.value = true
    ruletaPaso.value = 'girando'
    ruletaResultado.value = null
    ruletaRespuesta.value = null
    hablar('¡Vamos a girar la ruleta! Prepárate para descubrir una historia.')
    setTimeout(() => {
        const indice = Math.floor(Math.random() * historiasRuleta.length)
        ruletaResultado.value = historiasRuleta[indice].id
        ruletaPaso.value = 'historia'
        ruletaGirando.value = false
        hablar(`¡La ruleta eligió ${historiasRuleta[indice].titulo}! Ahora vamos a leer.`)
    }, 1500)
}

function comenzarPreguntasRuleta() {
    ruletaPaso.value = 'pregunta'
    ruletaIndicePregunta.value = 0
    ruletaRespuesta.value = null
    hablar('Muy bien. Ahora responde las preguntas sobre la historia.')
}

function responderRuleta(indice) {
    if (ruletaRespuesta.value !== null || !preguntaRuletaActual.value) return
    const correcta = indice === preguntaRuletaActual.value[2]
    ruletaRespuesta.value = correcta
    if (correcta) { ruletaAciertos.value++; hablar('¡Muy bien! Respuesta correcta.') }
    else hablar('Casi. Mira la respuesta correcta y sigamos aprendiendo.')
}

function siguientePreguntaRuleta() {
    if (ruletaIndicePregunta.value < 2) {
        ruletaIndicePregunta.value++
        ruletaRespuesta.value = null
    } else ruletaPaso.value = 'resultado'
}

function reiniciarRuleta() {
    ruletaPaso.value = 'inicio'; ruletaResultado.value = null; ruletaRespuesta.value = null; ruletaIndicePregunta.value = 0; ruletaAciertos.value = 0
}

function abrirCaja(caja) {
    cajaAbierta.value = caja
    cajaPaso.value = 'historia'
    cajaIndicePregunta.value = 0
    cajaRespuesta.value = null
    cajaAciertos.value = 0
    hablar(`¡Abriste la caja número ${caja.numero}! Descubriste ${caja.historia.titulo}.`)
}

function comenzarPreguntasCaja() {
    cajaPaso.value = 'pregunta'
    cajaIndicePregunta.value = 0
    cajaRespuesta.value = null
    hablar('Ahora elige la imagen que responde correctamente.')
}

function responderCaja(indice) {
    if (cajaRespuesta.value !== null || !preguntaCajaActual.value) return
    const correcta = indice === preguntaCajaActual.value[2]
    cajaRespuesta.value = correcta
    if (correcta) { cajaAciertos.value++; hablar('¡Excelente! Elegiste la imagen correcta.') }
    else hablar('Casi. Observa la respuesta marcada y vuelve a intentarlo en la siguiente pregunta.')
}

function siguientePreguntaCaja() {
    if (cajaIndicePregunta.value < 2) { cajaIndicePregunta.value++; cajaRespuesta.value = null }
    else cajaPaso.value = 'resultado'
}

function reiniciarCajas() {
    cajaPaso.value = 'seleccion'; cajaAbierta.value = null; cajaRespuesta.value = null; cajaIndicePregunta.value = 0; cajaAciertos.value = 0
}

function comenzarConcurso() {
    concursoPaso.value = 'lectura'
    hablar('Lee con atención el cuento. Después comenzará el concurso.')
}

function comenzarPreguntasConcurso() {
    concursoPaso.value = 'pregunta'; concursoIndicePregunta.value = 0; concursoRespuesta.value = null
    hablar('¡Comienza el concurso! Elige la imagen correcta.')
}

function responderConcurso(indice) {
    if (concursoRespuesta.value !== null || !preguntaConcursoActual.value) return
    const correcta = indice === preguntaConcursoActual.value[2]
    concursoRespuesta.value = correcta
    if (correcta) { concursoAciertos.value++; hablar('¡Respuesta correcta! ¡Vas muy bien!') }
    else hablar('No pasa nada. Mira la respuesta correcta y continúa el concurso.')
}

function siguienteConcurso() {
    if (concursoIndicePregunta.value < concursoActual.preguntas.length - 1) { concursoIndicePregunta.value++; concursoRespuesta.value = null }
    else concursoPaso.value = 'resultado'
}

function reiniciarConcurso() {
    concursoPaso.value = 'inicio'; concursoIndicePregunta.value = 0; concursoRespuesta.value = null; concursoAciertos.value = 0
}

function responderGlobo(indice) {
    if (globosRespuesta.value !== null || !globoActual.value) return
    const correcta = indice === globoActual.value.correcta
    globosRespuesta.value = correcta
    if (correcta) { globosAciertos.value++; hablar('¡Pum! ¡Globo correcto! Esa sílaba completa la palabra.') }
    else hablar('Ese globo no era. Busca la sílaba que forma la palabra indicada.')
}

function siguienteGlobo() {
    if (globosIndice.value < globos.length - 1) { globosIndice.value++; globosRespuesta.value = null }
    else globosTerminados.value = true
}

function reiniciarGlobos() {
    globosIndice.value = 0; globosRespuesta.value = null; globosAciertos.value = 0; globosTerminados.value = false
}

function normalizarTextoOpcion(texto) {
    return String(texto || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
}

const imagenesCuentosPorNombre = {
  "azul": "/imagenes/cuentos/azul.jpg",
  "en una banca": "/imagenes/cuentos/en-una-banca.jpg",
  "semillas": "/imagenes/cuentos/semillas.jpg",
  "enojado": "/imagenes/cuentos/enojado.jpg",
  "canciones de un grupo": "/imagenes/cuentos/canciones-de-un-grupo.jpg",
  "en el jardin": "/imagenes/cuentos/en-el-jardin.jpg",
  "un oso": "/imagenes/cuentos/un-oso.jpg",
  "una cascada": "/imagenes/cuentos/una-cascada.jpg",
  "un faro": "/imagenes/cuentos/un-faro.jpg",
  "para guardar bicicletas": "/imagenes/cuentos/para-guardar-bicicletas.jpg",
  "un gatito": "/imagenes/cuentos/un-gatito.jpg",
  "a su hermana": "/imagenes/cuentos/a-su-hermana.jpg",
  "la aventura de mateo": "/imagenes/cuentos/la-aventura-de-mateo.jpg",
  "una torta": "/imagenes/cuentos/una-torta.jpg",
  "con su curso": "/imagenes/cuentos/con-su-curso.jpg",
  "en la cocina": "/imagenes/cuentos/en-la-cocina.jpg",
  "a un pueblo junto al mar": "/imagenes/cuentos/a-un-pueblo-junto-al-mar.jpg",
  "un libro de recetas": "/imagenes/cuentos/un-libro-de-recetas.jpg",
  "la excursioo de julia": "/imagenes/cuentos/la-excursioo-de-julia.jpg",
  "en el huerto de la escuela": "/imagenes/cuentos/en-el-huerto-de-la-escuela.jpg",
  "un avion": "/imagenes/cuentos/un-avion.jpg",
  "la lluvia": "/imagenes/cuentos/la-lluvia.avif",
  "una flor": "/imagenes/cuentos/una-flor.jpg",
  "corto los arboles": "/imagenes/cuentos/corto-los-arboles.jpg",
  "el huerto de samuel": "/imagenes/cuentos/el-huerto-de-samuel.jpg",
  "un caballo": "/imagenes/cuentos/un-caballo.jpg",
  "a su abuela": "/imagenes/cuentos/a-su-abuela.jpg",
  "guardo los libros": "/imagenes/cuentos/guardo-los-libros.jpg",
  "ayudo a encontrar a su familia": "/imagenes/cuentos/ayudo-a-encontrar-a-su-familia.jpg",
  "una lupa": "/imagenes/cuentos/una-lupa.jpg",
  "se llevo al perrito": "/imagenes/cuentos/se-llevo-al-perrito.jpg",
  "en la plaza": "/imagenes/cuentos/en-la-plaza.jpg",
  "con sus companeros": "/imagenes/cuentos/con-sus-companeros.jpg",
  "en la biblioteca 2": "/imagenes/cuentos/en-la-biblioteca-2.jpg",
  "junto a la ventana": "/imagenes/cuentos/junto-a-la-ventana.jpg",
  "un molino": "/imagenes/cuentos/un-molino.jpg",
  "juguetes": "/imagenes/cuentos/juguetes.jpg",
  "el tesoro de bruno": "/imagenes/cuentos/el-tesoro-de-bruno.jpg",
  "a su vecina": "/imagenes/cuentos/a-su-vecina.jpg",
  "galletas y leche": "/imagenes/cuentos/galletas-y-leche.jpg",
  "una mochila": "/imagenes/cuentos/una-mochila.jpg",
  "una bicicleta": "/imagenes/cuentos/una-bicicleta.jpg",
  "en una plaza": "/imagenes/cuentos/en-una-plaza.jpg",
  "un barco": "/imagenes/cuentos/un-barco.jpg",
  "en una tienda": "/imagenes/cuentos/en-una-tienda.jpg",
  "con un vecino": "/imagenes/cuentos/con-un-vecino.jpg",
  "una caja de juguetes": "/imagenes/cuentos/una-caja-de-juguetes.jpg",
  "una pelota": "/imagenes/cuentos/una-pelota.jpg",
  "lo escondio 2": "/imagenes/cuentos/lo-escondio-2.jpg",
  "la cometa de elena": "/imagenes/cuentos/la-cometa-de-elena.jpg",
  "amarilla": "/imagenes/cuentos/amarilla.jpg",
  "la merienda de luna": "/imagenes/cuentos/la-merienda-de-luna.jpg",
  "a un perro": "/imagenes/cuentos/a-un-perro.jpg",
  "una merienda": "/imagenes/cuentos/una-merienda.jpg",
  "con su hermano": "/imagenes/cuentos/con-su-hermano.avif",
  "en su casa": "/imagenes/cuentos/en-su-casa.png",
  "zanahorias": "/imagenes/cuentos/zanahorias.jpg",
  "una huella": "/imagenes/cuentos/una-huella.jpg",
  "un paraguas": "/imagenes/cuentos/un-paraguas.jpg",
  "lo dejo continuar": "/imagenes/cuentos/lo-dejo-continuar.jpg",
  "correr mas rapido": "/imagenes/cuentos/correr-mas-rapido.jpg",
  "un pajaro": "/imagenes/cuentos/un-pajaro.jpg",
  "una carta": "/imagenes/cuentos/una-carta.jpg",
  "en un arbol": "/imagenes/cuentos/en-un-arbol.jpg",
  "arroz y sopa": "/imagenes/cuentos/arroz-y-sopa.png",
  "su maestro": "/imagenes/cuentos/su-maestro.jpg",
  "lo escondio": "/imagenes/cuentos/lo-escondio.jpg",
  "el pequeno explorador": "/imagenes/cuentos/el-pequeno-explorador.jpg",
  "un mapa": "/imagenes/cuentos/un-mapa.jpg",
  "lechugas": "/imagenes/cuentos/lechugas.jpg",
  "un album de fotografias": "/imagenes/cuentos/un-album-de-fotografias.jpg",
  "recolectar flores": "/imagenes/cuentos/recolectar-flores.jpg",
  "a una ciudad nevada": "/imagenes/cuentos/a-una-ciudad-nevada.jpg",
  "un pez": "/imagenes/cuentos/un-pez.jpg",
  "con su mascota": "/imagenes/cuentos/con-su-mascota.jpg",
  "sobre una flor": "/imagenes/cuentos/sobre-una-flor.jpg",
  "contento": "/imagenes/cuentos/contento.jpg",
  "con sus vecinos": "/imagenes/cuentos/con-sus-vecinos.png",
  "un tren": "/imagenes/cuentos/un-tren.jpg",
  "una caja": "/imagenes/cuentos/una-caja.jpg",
  "un libro de cuentos": "/imagenes/cuentos/un-libro-de-cuentos.jpg",
  "a un caballo": "/imagenes/cuentos/a-un-caballo.jpg",
  "una sopa": "/imagenes/cuentos/una-sopa.jpg",
  "un perrito": "/imagenes/cuentos/un-perrito.jpg",
  "en la biblioteca": "/imagenes/cuentos/en-la-biblioteca.jpg",
  "asustado": "/imagenes/cuentos/asustado.jpg",
  "un castillo": "/imagenes/cuentos/un-castillo.jpg",
  "una camara": "/imagenes/cuentos/una-camara.jpg",
  "cuidar la naturaleza": "/imagenes/cuentos/cuidar-la-naturaleza.jpg",
  "en el parque": "/imagenes/cuentos/en-el-parque.jpg",
  "lo llevo a su casa": "/imagenes/cuentos/lo-llevo-a-su-casa.jpg",
  "en la escuela": "/imagenes/cuentos/en-la-escuela.jpg",
  "el viento": "/imagenes/cuentos/el-viento.avif",
  "la nieve": "/imagenes/cuentos/la-nieve.avif",
  "rego las plantas": "/imagenes/cuentos/rego-las-plantas.jpg",
  "para orientar a los barcos": "/imagenes/cuentos/para-orientar-a-los-barcos.jpg",
  "la huella misteriosa": "/imagenes/cuentos/la-huella-misteriosa.jpg",
  "un conejo": "/imagenes/cuentos/un-conejo.jpg",
  "el album de la abuela": "/imagenes/cuentos/el-album-de-la-abuela.jpg",
  "el perrito perdido": "/imagenes/cuentos/el-perrito-perdido.jpg",
  "el faro de la costa": "/imagenes/cuentos/el-faro-de-la-costa.jpg",
  "noticias de la escuela": "/imagenes/cuentos/noticias-de-la-escuela.jpg",
  "para vender pescado": "/imagenes/cuentos/para-vender-pescado.jpg",
  "con su familia": "/imagenes/cuentos/con-su-familia.jpg",
  "un caracol": "/imagenes/cuentos/un-caracol.jpg",
  "su vecino": "/imagenes/cuentos/su-vecino.jpg",
  "pan queso y frutas": "/imagenes/cuentos/pan-queso-y-frutas.png",
  "a un gato": "/imagenes/cuentos/a-un-gato.jpg",
  "una llave": "/imagenes/cuentos/una-llave.jpg",
  "libro de recetas": "/imagenes/cuentos/libro-de-recetas.jpg",
  "monedas de oro": "/imagenes/cuentos/monedas-de-oro.jpg",
  "la biblioteca magica": "/imagenes/cuentos/la-biblioteca-magica.jpg",
  "a una montana": "/imagenes/cuentos/a-una-montana.jpg",
  "el regalo de ana": "/imagenes/cuentos/el-regalo-de-ana.jpg",
  "una cometa": "/imagenes/cuentos/una-cometa.jpg",
  "en el patio": "/imagenes/cuentos/en-el-patio.jpg",
  "bajo un arbol": "/imagenes/cuentos/bajo-un-arbol.jpg",
  "historias de la familia": "/imagenes/cuentos/historias-de-la-familia.jpg",
  "tomates": "/imagenes/cuentos/tomates.jpg",
  "a su mama": "/imagenes/cuentos/a-su-mama.jpg",
  "roja": "/imagenes/cuentos/roja.jpg",
  "a su maestra": "/imagenes/cuentos/a-su-maestra.jpg"
}

const imagenesPorHistoria = {
  r1: { 'lo escondio': '/imagenes/cuentos/lo-escondio.jpg', 'lo llevo a casa': '/imagenes/cuentos/lo-llevo-a-casa.jpg' },
  c3: { 'lo escondio': '/imagenes/cuentos/lo-escondio-2.jpg' }
}
function imagenDeOpcionContextual(historia, texto) {
  const id = historia?.id || ''
  const clave = normalizarTextoOpcion(texto)
  const imagen = imagenesPorHistoria[id]?.[clave]
  return imagen ? encodeURI(imagen) : imagenDeOpcion(texto)
}

function imagenDeOpcion(texto) {
    if (imagenesCuentosPorNombre[normalizarTextoOpcion(texto)]) return encodeURI(imagenesCuentosPorNombre[normalizarTextoOpcion(texto)])
    const opcion = normalizarTextoOpcion(texto)
    if (opcion.includes('abuela')) return imgOpcionAbuela
    if (opcion.includes('hermana')) return imgOpcionHermana
    if (opcion.includes('maestra') || opcion.includes('profesora')) return imgOpcionMaestra
    if (opcion.includes('mama')) return imgOpcionMama
    if (opcion.includes('vecina')) return imgOpcionVecina
    if (opcion.includes('album de fotografias') || opcion.includes('album de fotos')) return imgOpcionAlbum
    if (opcion.includes('caja de juguetes')) return imgOpcionJuguetes
    if (opcion.includes('un libro de recetas')) return imgOpcionLibroRecetas
    if (opcion.includes('libro de recetas')) return imgOpcionRecetas
    if (opcion.includes('historias de la familia')) return imgOpcionFamilia
    if (opcion.includes('canciones de un grupo')) return imgOpcionCanciones
    if (opcion.includes('noticias de la escuela')) return imgOpcionNoticias
    return null
}

function imagenParaOpcion(texto) {
    const t = texto.toLowerCase()
    if (t.includes('libro')) return 'fa-book-open'
    if (t.includes('pelota') || t.includes('balón')) return 'fa-futbol'
    if (t.includes('paraguas')) return 'fa-umbrella'
    if (t.includes('abuela')) return 'fa-person-dress'
    if (t.includes('maestro') || t.includes('maestra')) return 'fa-person-chalkboard'
    if (t.includes('vecino')) return 'fa-person'
    if (t.includes('cometa')) return 'fa-paper-plane'
    if (t.includes('bicicleta')) return 'fa-bicycle'
    if (t.includes('mariposa')) return 'fa-bug'
    if (t.includes('flor')) return 'fa-seedling'
    if (t.includes('árbol')) return 'fa-tree'
    if (t.includes('merienda')) return 'fa-basket-shopping'
    if (t.includes('oso')) return 'fa-paw'
    if (t.includes('perrito')) return 'fa-dog'
    if (t.includes('plaza')) return 'fa-tree-city'
    if (t.includes('lupa')) return 'fa-magnifying-glass'
    if (t.includes('caracol')) return 'fa-bug'
    if (t.includes('casa')) return 'fa-house'
    if (t.includes('leer') || t.includes('lectura')) return 'fa-book-open-reader'
    if (t.includes('compañeros')) return 'fa-people-group'
    return 'fa-image'
}

onBeforeUnmount(() => detenerAudio())
</script>

<template>
    <section class="dinamicos-pantalla">
        <template v-if="pantalla === 'lista'">
        <div class="encabezado-dinamicos-pantalla">
            <div>
                <button class="btn btn-primary btn-volver-juegos gato-boton-juego gato-juego-azul" @click="emit('cerrar')"><i class="fas fa-arrow-left"></i> Volver a Juegos</button>
                <h1>Juegos Dinámicos</h1>
                <p>Elige una aventura y aprende con historias, imágenes, sonidos y retos.</p>
            </div>
            <div class="marca-dinamicos-pantalla"><img :src="logoGatoLecturas" alt="Gato Lecturas" /></div>
        </div>

        <div class="panel-voz">
            <div><i class="fas fa-volume-high"></i><strong>Voz para la aventura</strong><small>El navegador usará la voz en español que más se parezca a tu elección.</small></div>
            <div class="selector-voces">
                <button :class="{ seleccionado: vozPreferida === 'dama' }" @click="vozPreferida = 'dama'"><i class="fas fa-person-dress"></i> Dama</button>
                <button :class="{ seleccionado: vozPreferida === 'nina' }" @click="vozPreferida = 'nina'"><i class="fas fa-child-dress"></i> Niña</button>
                <button :class="{ seleccionado: vozPreferida === 'nino' }" @click="vozPreferida = 'nino'"><i class="fas fa-child"></i> Niño</button>
                <button class="btn-probar-voz gato-boton-juego gato-juego-verde" @click="hablar('Hola, soy tu voz de Gato Lecturas. Vamos a aprender jugando.')"><i class="fas fa-play"></i> Probar voz</button>
            </div>
        </div>

        <p v-if="errorVoz" class="alert alert-warning aviso-voz-juego" role="alert">{{ errorVoz }}</p>
        <div class="grid-dinamicos-pantalla">
            <button v-for="juego in juegosDinamicos" :key="juego.id" :class="['card-dinamico-grande', `card-${juego.color}`]" @click="abrirJuego(juego.id)">
                <div class="card-dinamico-arte"><i :class="['fas', juego.icono]"></i><span>{{ juego.etiqueta }}</span></div>
                <div class="card-dinamico-info"><h2>{{ juego.titulo }}</h2><p>{{ juego.descripcion }}</p><span class="btn btn-primary btn-entrar-juego"><i class="fas fa-play"></i> Jugar ahora</span></div>
            </button>
        </div>

        <div class="mensaje-gato-dinamicos">
            <img :src="gatoMiraDerecha" alt="Gato Lectura" />
            <div><strong>¡Hola! Soy Gato Lectura</strong><p>En estas aventuras podrás escuchar cuentos, elegir imágenes, abrir sorpresas y jugar con las palabras.</p></div>
        </div>
        </template>

        <div v-else class="pantalla-dinamica-juego">
            <section class="juego-dinamico-completo">
                <header class="juego-dinamico-header">
                    <div class="marca-dinamica"><img :src="logoGatoLecturas" alt="Logo Gato Lecturas" /><div><span>GATO LECTURAS</span><h2>{{ juegosDinamicos.find(j => j.id === juegoActivo)?.titulo }}</h2></div></div>
                    <button class="btn btn-light btn-volver-juego-dinamico gato-boton-juego gato-juego-azul" @click="volverALista"><i class="fas fa-arrow-left"></i> Volver a Juegos</button>
                </header>

                <div class="dinamico-juego-cuerpo juego-dinamico-cuerpo-grande">
                    <p v-if="errorVoz" class="alert alert-warning aviso-voz-juego" role="alert">{{ errorVoz }}</p>
                    <template v-if="juegoActivo === 'ruleta'">
                        <div class="gato-dialogo-dinamico"><img :src="ruletaPaso === 'resultado' ? gatoAlegre : gatoMiraDerecha" alt="Gato Lectura" /><div><strong>Gato Lectura</strong><p>{{ ruletaPaso === 'inicio' ? 'Gira la ruleta y veremos qué cuento nos toca hoy.' : ruletaPaso === 'historia' ? '¡Ya tenemos una historia! Léela con atención.' : '¡Tú puedes! Piensa bien antes de responder.' }}</p></div><button class="btn-audio-dinamico" @click="hablar('Gira la ruleta y descubre una historia.')"><i class="fas fa-volume-high"></i></button></div>
                        <div v-if="ruletaPaso === 'inicio' || ruletaPaso === 'girando'" class="ruleta-juego-centro"><div :class="['ruleta-grande', { girando: ruletaGirando }]" aria-label="Ruleta de historias"><div v-for="n in 6" :key="n" class="ruleta-segmento" :style="{ '--i': n - 1 }"></div><div class="ruleta-centro"><i class="fas fa-book-open"></i></div></div><div class="punta-ruleta"><i class="fas fa-caret-down"></i></div><h3>{{ ruletaGirando ? '¡Girando!' : '¿Qué historia nos tocará?' }}</h3><button class="btn-accion-dinamica btn-accion-azul gato-boton-juego gato-juego-azul" :disabled="ruletaGirando" @click="girarRuleta"><i class="fas fa-rotate"></i> {{ ruletaGirando ? 'Girando...' : 'Girar ruleta' }}</button></div>
                        <div v-else-if="ruletaPaso === 'historia' && historiaRuletaActual" class="historia-dinamica"><div :class="['historia-portada', `fondo-${historiaRuletaActual.color}`]"><img :src="imagenHistoria(historiaRuletaActual)" :alt="historiaRuletaActual.titulo" /><span>Historia elegida</span></div><div class="historia-texto"><h3>{{ historiaRuletaActual.titulo }}</h3><p>{{ historiaRuletaActual.texto }}</p><div class="acciones-audio"><button class="btn-audio-grande gato-boton-juego gato-juego-morado" @click="leerHistoria(historiaRuletaActual)"><i class="fas fa-volume-high"></i> Escuchar historia</button><button class="btn-accion-dinamica btn-accion-azul gato-boton-juego gato-juego-azul" @click="comenzarPreguntasRuleta">Responder preguntas <i class="fas fa-arrow-right"></i></button></div></div></div>
                        <div v-else-if="ruletaPaso === 'pregunta' && preguntaRuletaActual" class="pregunta-dinamica"><div class="progreso-dinamico"><span>Pregunta {{ ruletaIndicePregunta + 1 }} de 3</span><div><span :style="{ width: `${((ruletaIndicePregunta + 1) / 3) * 100}%` }"></span></div></div><div class="pregunta-titulo"><h3>{{ preguntaRuletaActual[0] }}</h3><button class="btn-audio-pregunta" @click="hablar(preguntaRuletaActual[0])"><i class="fas fa-volume-high"></i></button></div><div class="opciones-visuales"><button v-for="(opcion, index) in preguntaRuletaActual[1]" :key="opcion" :class="['opcion-visual', { correcta: ruletaRespuesta !== null && index === preguntaRuletaActual[2], incorrecta: ruletaRespuesta === false && index !== preguntaRuletaActual[2] }]" @click="responderRuleta(index)"><span class="visual-icono"><img v-if="imagenDeOpcionContextual(historiaRuletaActual, opcion)" :src="imagenDeOpcionContextual(historiaRuletaActual, opcion)" :alt="opcion" /><i v-else :class="['fas', imagenParaOpcion(opcion)]"></i></span><strong>{{ opcion }}</strong></button></div><div v-if="ruletaRespuesta !== null" :class="['feedback-dinamico', ruletaRespuesta ? 'feedback-correcto' : 'feedback-incorrecto']">{{ ruletaRespuesta ? '¡Muy bien! Esa es la respuesta correcta.' : 'Casi. Observa la opción marcada y aprende de ella.' }}</div><button v-if="ruletaRespuesta !== null" class="btn-accion-dinamica btn-accion-azul gato-boton-juego gato-juego-azul" @click="siguientePreguntaRuleta">{{ ruletaIndicePregunta === 2 ? 'Ver resultado' : 'Siguiente pregunta' }} <i class="fas fa-arrow-right"></i></button></div>
                        <div v-else class="resultado-dinamico"><img :src="ruletaAciertos >= 2 ? gatoAlegre : gatoTriste" alt="Gato Lectura" /><span>¡AVENTURA COMPLETADA!</span><h3>Terminaste la historia</h3><div class="estrellas-dinamicas"><i v-for="n in 5" :key="n" :class="['fas', n <= estrellasRuleta ? 'fa-star estrella-activa' : 'fa-star estrella-inactiva']"></i></div><p>Lograste <strong>{{ ruletaAciertos }} de 3</strong> respuestas correctas.</p><button class="btn-accion-dinamica btn-accion-azul gato-boton-juego gato-juego-azul" @click="reiniciarRuleta">Jugar otra historia</button></div>
                    </template>

                    <template v-else-if="juegoActivo === 'cajas'">
                        <div class="gato-dialogo-dinamico"><img :src="cajaPaso === 'resultado' ? gatoAlegre : gatoMiraDerecha" alt="Gato Lectura" /><div><strong>Gato Lectura</strong><p>{{ cajaPaso === 'seleccion' ? 'Elige una caja sorpresa. ¡Puede esconderse una historia increíble!' : 'Lee con atención y busca la imagen que responde la pregunta.' }}</p></div><button class="btn-audio-dinamico" @click="hablar(cajaPaso === 'seleccion' ? 'Elige una caja sorpresa.' : 'Lee con atención y busca la imagen correcta.')"><i class="fas fa-volume-high"></i></button></div>
                        <div v-if="cajaPaso === 'seleccion'" class="seleccion-cajas"><h3>Elige una caja sorpresa</h3><p>Cada caja guarda una historia diferente.</p><div class="grid-cajas"> <button v-for="caja in cajas" :key="caja.id" :class="['caja-juego', `caja-${caja.color}`]" @click="abrirCaja(caja)"><span class="caja-tapa"></span><img class="caja-portada-mini" :src="imagenHistoria(caja.historia)" :alt="caja.historia.titulo" /><strong>{{ caja.historia.titulo }}</strong><small>Abrir cuento</small></button></div></div>
                        <div v-else-if="cajaPaso === 'historia' && historiaCajaActual" class="historia-dinamica"><div :class="['historia-portada', `fondo-${historiaCajaActual.color}`]"><img :src="imagenHistoria(historiaCajaActual)" :alt="historiaCajaActual.titulo" /><span>Historia sorpresa</span></div><div class="historia-texto"><h3>{{ historiaCajaActual.titulo }}</h3><p>{{ historiaCajaActual.texto }}</p><div class="acciones-audio"><button class="btn-audio-grande gato-boton-juego gato-juego-morado" @click="hablar(historiaCajaActual.texto)"><i class="fas fa-volume-high"></i> Escuchar historia</button><button class="btn-accion-dinamica btn-accion-rosa gato-boton-juego gato-juego-morado" @click="comenzarPreguntasCaja">Ver preguntas <i class="fas fa-arrow-right"></i></button></div></div></div>
                        <div v-else-if="cajaPaso === 'pregunta' && preguntaCajaActual" class="pregunta-dinamica"><div class="progreso-dinamico"><span>Pregunta {{ cajaIndicePregunta + 1 }} de 3</span><div><span :style="{ width: `${((cajaIndicePregunta + 1) / 3) * 100}%` }"></span></div></div><div class="pregunta-titulo"><h3>{{ preguntaCajaActual[0] }}</h3><button class="btn-audio-pregunta" @click="hablar(preguntaCajaActual[0])"><i class="fas fa-volume-high"></i></button></div><p class="ayuda-visual">Elige la imagen que representa la respuesta correcta.</p><div class="opciones-visuales"><button v-for="(opcion, index) in preguntaCajaActual[1]" :key="opcion" :class="['opcion-visual', { correcta: cajaRespuesta !== null && index === preguntaCajaActual[2], incorrecta: cajaRespuesta === false && index !== preguntaCajaActual[2] }]" @click="responderCaja(index)"><span class="visual-icono"><img v-if="imagenDeOpcionContextual(historiaCajaActual, opcion)" :src="imagenDeOpcionContextual(historiaCajaActual, opcion)" :alt="opcion" /><i v-else :class="['fas', imagenParaOpcion(opcion)]"></i></span><strong>{{ opcion }}</strong></button></div><div v-if="cajaRespuesta !== null" :class="['feedback-dinamico', cajaRespuesta ? 'feedback-correcto' : 'feedback-incorrecto']">{{ cajaRespuesta ? '¡Muy bien! Elegiste la imagen correcta.' : 'Casi. La respuesta correcta está marcada.' }}</div><button v-if="cajaRespuesta !== null" class="btn-accion-dinamica btn-accion-rosa gato-boton-juego gato-juego-morado" @click="siguientePreguntaCaja">{{ cajaIndicePregunta === 2 ? 'Ver resultado' : 'Siguiente pregunta' }} <i class="fas fa-arrow-right"></i></button></div>
                        <div v-else class="resultado-dinamico"><img :src="cajaAciertos >= 2 ? gatoAlegre : gatoTriste" alt="Gato Lectura" /><span>¡CAJA COMPLETADA!</span><h3>Descubriste la historia</h3><div class="estrellas-dinamicas"><i v-for="n in 5" :key="n" :class="['fas', n <= estrellasCajas ? 'fa-star estrella-activa' : 'fa-star estrella-inactiva']"></i></div><p>Lograste <strong>{{ cajaAciertos }} de 3</strong> respuestas correctas.</p><button class="btn-accion-dinamica btn-accion-rosa gato-boton-juego gato-juego-morado" @click="reiniciarCajas">Elegir otra caja</button></div>
                    </template>

                    <template v-else-if="juegoActivo === 'concurso'">
                        <div class="gato-dialogo-dinamico"><img :src="concursoPaso === 'resultado' ? gatoAlegre : gatoMiraDerecha" alt="Gato Lectura" /><div><strong>Gato Lectura</strong><p>Lee el cuento y luego demuestra cuánto comprendiste.</p></div><button class="btn-audio-dinamico" @click="hablar('Lee el cuento y luego demuestra cuánto comprendiste.')"><i class="fas fa-volume-high"></i></button></div>
                        <div v-if="concursoPaso === 'inicio'" class="concurso-portada"><div class="concurso-personaje"><img :src="concursoActual.imagen" :alt="concursoActual.titulo" /></div><div><span>CONCURSO DE PREGUNTAS</span><h3>{{ concursoActual.titulo }}</h3><p>Lee la historia, observa al personaje y prepárate para responder.</p><button class="btn-audio-grande gato-boton-juego gato-juego-morado" @click="hablar(concursoActual.texto)"><i class="fas fa-volume-high"></i> Escuchar cuento</button><button class="btn-accion-dinamica btn-accion-amarillo gato-boton-juego gato-juego-naranja" @click="comenzarConcurso">Comenzar lectura <i class="fas fa-arrow-right"></i></button></div></div>
                        <div v-else-if="concursoPaso === 'lectura'" class="concurso-lectura"><div class="concurso-personaje grande"><img :src="concursoActual.imagen" :alt="concursoActual.titulo" /><span>Personajes del cuento</span></div><article><span>LEE CON ATENCIÓN</span><h3>{{ concursoActual.titulo }}</h3><p>{{ concursoActual.texto }}</p><div class="acciones-audio"><button class="btn-audio-grande gato-boton-juego gato-juego-morado" @click="hablar(concursoActual.texto)"><i class="fas fa-volume-high"></i> Escuchar cuento</button><button class="btn-accion-dinamica btn-accion-amarillo gato-boton-juego gato-juego-naranja" @click="comenzarPreguntasConcurso">Ir al concurso <i class="fas fa-trophy"></i></button></div></article></div>
                        <div v-else-if="concursoPaso === 'pregunta' && preguntaConcursoActual" class="concurso-pregunta"><div class="concurso-lateral"><div class="concurso-personaje"><img :src="concursoActual.imagen" :alt="concursoActual.titulo" /></div><strong>{{ concursoActual.titulo }}</strong><button @click="hablar(concursoActual.texto)"><i class="fas fa-volume-high"></i> Escuchar cuento</button></div><div class="pregunta-dinamica"><div class="progreso-dinamico"><span>Pregunta {{ concursoIndicePregunta + 1 }} de {{ concursoActual.preguntas.length }}</span><div><span :style="{ width: `${((concursoIndicePregunta + 1) / concursoActual.preguntas.length) * 100}%` }"></span></div></div><div class="pregunta-titulo"><h3>{{ preguntaConcursoActual[0] }}</h3><button class="btn-audio-pregunta" @click="hablar(preguntaConcursoActual[0])"><i class="fas fa-volume-high"></i></button></div><div class="opciones-visuales concurso-opciones"><button v-for="(opcion, index) in preguntaConcursoActual[1]" :key="opcion" :class="['opcion-visual', { correcta: concursoRespuesta !== null && index === preguntaConcursoActual[2], incorrecta: concursoRespuesta === false && index !== preguntaConcursoActual[2] }]" @click="responderConcurso(index)"><span class="visual-icono"><img v-if="imagenDeOpcionContextual(concursoActual, opcion)" :src="imagenDeOpcionContextual(concursoActual, opcion)" :alt="opcion" /><i v-else :class="['fas', imagenParaOpcion(opcion)]"></i></span><strong>{{ opcion }}</strong></button></div><div v-if="concursoRespuesta !== null" :class="['feedback-dinamico', concursoRespuesta ? 'feedback-correcto' : 'feedback-incorrecto']">{{ concursoRespuesta ? '¡Correcto! Sigue con el concurso.' : 'Casi. Aprende de la opción marcada.' }}</div><button v-if="concursoRespuesta !== null" class="btn-accion-dinamica btn-accion-amarillo gato-boton-juego gato-juego-naranja" @click="siguienteConcurso">{{ concursoIndicePregunta === concursoActual.preguntas.length - 1 ? 'Ver resultado' : 'Siguiente pregunta' }} <i class="fas fa-arrow-right"></i></button></div></div>
                        <div v-else class="resultado-dinamico"><img :src="concursoAciertos >= 3 ? gatoAlegre : gatoTriste" alt="Gato Lectura" /><span>¡CONCURSO TERMINADO!</span><h3>Tu resultado</h3><div class="estrellas-dinamicas"><i v-for="n in 5" :key="n" :class="['fas', n <= estrellasConcurso ? 'fa-star estrella-activa' : 'fa-star estrella-inactiva']"></i></div><p>Lograste <strong>{{ concursoAciertos }} de 4</strong> respuestas correctas.</p><button class="btn-accion-dinamica btn-accion-amarillo gato-boton-juego gato-juego-naranja" @click="reiniciarConcurso">Volver a jugar</button></div>
                    </template>

                    <template v-else>
                        <div class="gato-dialogo-dinamico"><img :src="globosTerminados ? (globosAciertos >= 3 ? gatoAlegre : gatoTriste) : gatoMiraDerecha" alt="Gato Lectura" /><div><strong>Gato Lectura</strong><p>{{ globosTerminados ? '¡Terminaste los globos! Mira cuántas palabras lograste formar.' : 'Revienta el globo con la sílaba que completa la palabra.' }}</p></div><button class="btn-audio-dinamico" @click="hablar('Revienta el globo con la sílaba correcta.')"><i class="fas fa-volume-high"></i></button></div>
                        <div v-if="!globosTerminados && globoActual" class="globos-juego"><div class="globo-imagen-pista"><img :src="globoActual.imagen" :alt="`Imagen de ${globoActual.palabra.toLowerCase()}`" /><button class="btn-audio-pregunta" @click="hablar(`Completa la palabra ${globoActual.palabra}.`)" ><i class="fas fa-volume-high"></i><span>Escuchar</span></button></div><div class="palabra-construccion"><span class="silaba-fija">__{{ globoActual.palabra.slice(2) }}</span></div><div class="globos-opciones"><button v-for="(opcion,index) in globoActual.opciones" :key="opcion" :class="['globo', `globo-${index + 1}`, { correcta: globosRespuesta !== null && index === globoActual.correcta, incorrecta: globosRespuesta === false && index !== globoActual.correcta }]" @click="responderGlobo(index)"><strong>{{ opcion }}</strong></button></div><div v-if="globosRespuesta !== null" :class="['feedback-dinamico', globosRespuesta ? 'feedback-correcto' : 'feedback-incorrecto']">{{ globosRespuesta ? `¡Muy bien! Formaste ${globoActual.palabra}.` : `Casi. La sílaba correcta es ${globoActual.letra}.` }}</div><button v-if="globosRespuesta !== null" class="btn-accion-dinamica btn-accion-verde gato-boton-juego gato-juego-verde" @click="siguienteGlobo">{{ globosIndice === globos.length - 1 ? 'Ver resultado' : 'Siguiente palabra' }} <i class="fas fa-arrow-right"></i></button></div><div v-else class="resultado-dinamico"><img :src="globosAciertos >= 3 ? gatoAlegre : gatoTriste" alt="Gato Lectura" /><span>¡GLOBOS COMPLETADOS!</span><h3>Jugaste con las sílabas</h3><div class="estrellas-dinamicas"><i v-for="n in 5" :key="n" :class="['fas', n <= estrellasGlobos ? 'fa-star estrella-activa' : 'fa-star estrella-inactiva']"></i></div><p>Formaste correctamente <strong>{{ globosAciertos }} de {{ globos.length }}</strong> palabras.</p><button class="btn-accion-dinamica btn-accion-verde gato-boton-juego gato-juego-verde" @click="reiniciarGlobos">Jugar otra vez</button></div>
                    </template>
                </div>

                <footer class="modal-dinamico-footer"><button class="btn btn-primary btn-cerrar-dinamico-footer btn-salir-grande gato-boton-juego gato-juego-azul" @click="volverALista"><i class="fas fa-arrow-left"></i> Volver a Juegos</button><button class="btn-detener-audio gato-boton-juego gato-juego-rojo" @click="detenerAudio"><i class="fas fa-volume-xmark"></i> Detener audio</button></footer>
            </section>
        </div>
    </section>
</template>
