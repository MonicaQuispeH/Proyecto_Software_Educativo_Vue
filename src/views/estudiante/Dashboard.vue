<script setup>
import {ref,onMounted,onUnmounted,computed,watch} from 'vue'
import {api,getSession,API_URL} from '../../services/api'
import {useRouter,useRoute} from 'vue-router'
import Navbar from '../../components/admin/Navbar.vue'
import Sidebar from '../../components/admin/Sidebar.vue'
import '../../styles/admin/dashboard.css'
import '../../styles/admin/juegos.css'
import JuegoInteractivo from '../../components/admin/JuegoInteractivo.vue'
import JuegosDinamicos from '../../components/admin/JuegosDinamicos.vue'
import LecturaGuiada from '../../components/juegos/LecturaGuiada.vue'
import LecturaEnVozAlta from '../../components/juegos/LecturaEnVozAlta.vue'
import logo from '../../assets/gato-lectura/logo-gato-lecturas.png'
import gatoAlegre from '../../assets/gato-lectura/gato-alegre.png'
import gatoAdmirado from '../../assets/gato-lectura/estudiante-gato-audifonos.png'
import '../../styles/auth.css'
import '../../styles/estudiante/dashboard.css'
import '../../styles/estudiante/juegosOriginales.css'
const router=useRouter(),route=useRoute(),archivoLectura=ref(''),cargandoDocumento=ref(false),curso=ref(''),lecturas=ref([]),evaluaciones=ref([]),vista=ref('inicio'),lectura=ref(null),examen=ref(null),respuestas=ref([]),error=ref(''),aviso=ref(''),juego=ref(null)
const categoriaJuegos=ref('inicio')
const juegosBase=[
  {id:8,tipo:'lectura-guiada',titulo:'Lectura Mágica: fábulas de Esopo',icono:'fa-book-open',categoria:'Comprensión lectora',descripcion:'Escucha fábulas cortas y sigue cada palabra iluminada.',nivel:'Fácil',color:'morado',estado:'Activo'},
  {id:1,tipo:'comprension',titulo:'Detectives de la lectura',icono:'fa-magnifying-glass',categoria:'Comprensión lectora',descripcion:'Lee una pequeña historia y descubre la respuesta correcta.',nivel:'Fácil',color:'azul',estado:'Activo'},
  {id:2,tipo:'vocabulario',titulo:'La palabra escondida',icono:'fa-lightbulb',categoria:'Vocabulario',descripcion:'Encuentra la palabra que tiene un significado parecido.',nivel:'Fácil',color:'amarillo',estado:'Activo'},
  {id:3,tipo:'ortografia',titulo:'Detective ortográfico',icono:'fa-spell-check',categoria:'Ortografía',descripcion:'Elige la palabra escrita correctamente y gana estrellas.',nivel:'Medio',color:'verde',estado:'Activo'},
  {id:4,tipo:'oracion',titulo:'Ordena la oración',icono:'fa-puzzle-piece',categoria:'Gramática',descripcion:'Organiza las palabras para formar una oración con sentido.',nivel:'Medio',color:'morado',estado:'Activo'},
  {id:5,tipo:'silabas',titulo:'Construye la palabra',icono:'fa-cubes',categoria:'Sílabas',descripcion:'Une las sílabas correctas y descubre la palabra.',nivel:'Fácil',color:'naranja',estado:'Activo'},
  {id:6,tipo:'escritura',titulo:'Completa la aventura',icono:'fa-pen',categoria:'Escritura',descripcion:'Completa la oración con la palabra que mejor encaja.',nivel:'Medio',color:'rosa',estado:'Activo'},
  {id:7,tipo:'secuencia',titulo:'Ordena la historia',icono:'fa-list-ol',categoria:'Secuencias',descripcion:'Pon en orden los acontecimientos de una historia.',nivel:'Medio',color:'celeste',estado:'Activo'}
]
const juegos=ref(juegosBase.map(j=>({...j})))
function cargarJuegosEstudiante(){
  juegos.value=juegosBase.map(j=>({...j}))
}
function iniciarJuegoLectura(j){
  juego.value={...j}
}
function cerrarJuegoLectura(){
  juego.value=null
}

async function cargar(){try{const a=await api('/alumno/actividades');curso.value=a.curso;lecturas.value=a.lecturas;evaluaciones.value=a.evaluaciones}catch(e){error.value=e.message}}
async function mostrarLectura(l){lectura.value=l;vista.value='lecturas';router.replace({path:'/alumno',query:{vista:'lecturas'}});await abrirDocumento(l)}
function limpiarDocumento(){if(archivoLectura.value){URL.revokeObjectURL(archivoLectura.value);archivoLectura.value=''}}
async function abrirDocumento(l){limpiarDocumento();if(!l?.archivoTipo)return;cargandoDocumento.value=true;try{const r=await fetch(API_URL+'/contenidos/lecturas/'+l.id+'/archivo',{headers:{Authorization:'Bearer '+getSession()?.token}});if(!r.ok)throw Error('No se pudo abrir el archivo');archivoLectura.value=URL.createObjectURL(await r.blob())}catch(e){error.value=e.message}finally{cargandoDocumento.value=false}}
function cerrarLectura(){limpiarDocumento();lectura.value=null}
async function abrirEvaluacion(e){error.value='';aviso.value='';try{examen.value=await api('/alumno/evaluaciones/'+e.id);respuestas.value=examen.value.preguntas.map(p=>({preguntaId:Number(p.id),opcion:null}));vista.value='evaluaciones';router.replace({path:'/alumno',query:{vista:'evaluaciones'}})}catch(err){error.value=err.message}}
async function enviar(){if(respuestas.value.some(x=>x.opcion===null)){error.value='Responde todas las preguntas antes de enviar';return}if(!confirm('¿Enviar la evaluación? No podrás modificar tus respuestas.'))return;try{const r=await api('/alumno/evaluaciones/'+examen.value.id+'/responder',{method:'POST',body:JSON.stringify({respuestas:respuestas.value})});aviso.value=`¡Terminaste! Obtuviste ${r.aciertos} de ${r.total} respuestas correctas.`;examen.value=null;await cargar()}catch(e){error.value=e.message}}
function cambiar(v){router.replace({path:'/alumno',query:{vista:v}})}
watch(()=>route.query.vista,v=>{
  const siguiente=['inicio','lecturas','evaluaciones','juegos','resultados'].includes(v)?v:'inicio'
  if(vista.value!==siguiente){error.value='';limpiarDocumento();lectura.value=null;examen.value=null;juego.value=null;categoriaJuegos.value='inicio'}
  vista.value=siguiente
},{immediate:true})
onMounted(()=>{cargarJuegosEstudiante();cargar()});onUnmounted(limpiarDocumento)
</script>
<template>
  <Navbar/>
  <div class="alumno-layout-institucional">
    <Sidebar/>
    <main class="gato-content alumno-contenido">
      <header class="alumno-bienvenida">
        <div class="alumno-bienvenida-textos"><h1>¡Hola, {{getSession()?.user?.nombre}}!</h1><p>Lee, aprende, juega y descubre nuevas aventuras.</p><div class="alumno-etiquetas"><span>Rol: Estudiante</span><span v-if="curso">Mi paralelo: 3° {{curso.slice(1)}}</span></div></div>
        <img class="alumno-gato-hero" :src="gatoAlegre" alt="Mascota Gato Lecturas" />
      </header>
      <div v-if="error" class="alert alert-danger" role="alert">{{error}}</div><div v-if="aviso" class="alert alert-success">{{aviso}}</div>
      <template v-if="vista==='inicio'">
        <div class="alumno-grid-resumen">
          <button class="alumno-resumen-card tipo-lectura" @click="cambiar('lecturas')"><i class="fas fa-book-open"></i><strong>Mis lecturas</strong><span>{{lecturas.length}} asignadas</span><b>Ver lecturas →</b></button>
          <button class="alumno-resumen-card tipo-evaluacion" @click="cambiar('evaluaciones')"><i class="fas fa-clipboard-check"></i><strong>Mis evaluaciones</strong><span>{{evaluaciones.filter(e=>!e.realizada).length}} pendientes</span><b>Ver evaluaciones →</b></button>
          <button class="alumno-resumen-card tipo-juegos" @click="cambiar('juegos')"><i class="fas fa-gamepad"></i><strong>Juegos</strong><span>{{juegos.length}} aventuras</span><b>¡A jugar! →</b></button>
          <button class="alumno-resumen-card tipo-resultados" @click="cambiar('resultados')"><i class="fas fa-chart-column"></i><strong>Mis resultados</strong><span>Tu progreso</span><b>Ver resultados →</b></button>
        </div>
        <section class="alumno-seccion"><h2><i class="fas fa-star"></i> Tus actividades</h2><p class="alumno-intro">Elige una aventura para seguir aprendiendo.</p>
          <div class="alumno-grid-tareas"><article class="alumno-actividad tipo-lectura"><i class="fas fa-book-open"></i><h3>Descubre una lectura</h3><p>{{lecturas.length ? lecturas[0].titulo : 'Aquí aparecerán las lecturas de tu paralelo.'}}</p><button class="gato-boton gato-boton-azul" @click="lecturas.length?mostrarLectura(lecturas[0]):cambiar('lecturas')">Ir a lecturas</button></article>
            <article class="alumno-actividad tipo-evaluacion"><i class="fas fa-clipboard-check"></i><h3>Demuestra lo aprendido</h3><p>{{evaluaciones.some(e=>!e.realizada)?'Tienes una evaluación por resolver.':'Cuando te asignen una evaluación, aparecerá aquí.'}}</p><button class="gato-boton gato-boton-naranja" @click="cambiar('evaluaciones')">Mis evaluaciones</button></article>
            <article class="alumno-actividad tipo-juegos"><img :src="gatoAdmirado" alt="Gatito animado de Gato Lecturas"/><h3>Juega y aprende</h3><p>Diviértete con tus juegos de lectura y palabras.</p><button class="gato-boton gato-boton-azul" @click="cambiar('juegos')">Ir a juegos</button></article></div>
        </section>
      </template>
      <section v-else-if="vista==='lecturas'" class="alumno-seccion alumno-listados">
        <template v-if="lectura"><button class="gato-boton gato-boton-azul mb-3" @click="cerrarLectura">Volver a mis lecturas</button><article class="alumno-panel-documento"><h2>{{lectura.titulo}}</h2><p v-if="lectura.descripcion">{{lectura.descripcion}}</p><div v-if="lectura.archivoTipo"><p v-if="cargandoDocumento">Abriendo lectura...</p><iframe v-if="archivoLectura&&lectura.archivoTipo==='application/pdf'" :src="archivoLectura" title="Documento PDF" class="alumno-pdf"></iframe><img v-else-if="archivoLectura" :src="archivoLectura" :alt="lectura.titulo" class="alumno-imagen"/></div><LecturaEnVozAlta v-else-if="lectura.contenido" :texto="lectura.contenido"/></article></template>
        <template v-else><div class="alumno-titulo-seccion"><i class="fas fa-book-open"></i><div><h2>Mis lecturas</h2><p>Abre las historias que tu docente preparó para ti.</p></div></div><p v-if="!lecturas.length" class="alumno-mensaje">Todavía no tienes lecturas asignadas.</p><div class="alumno-grid-listados"><article v-for="l in lecturas" :key="l.id" class="alumno-tarjeta-actividad tipo-lectura"><i :class="l.archivoTipo==='application/pdf'?'fas fa-file-pdf':'fas fa-book-open'"></i><h3>{{l.titulo}}</h3><p>{{l.descripcion||'¡Descubre una nueva historia!'}}</p><span v-if="l.trimestre" class="alumno-chip">{{l.trimestre}}</span><button class="gato-boton gato-boton-azul" @click="mostrarLectura(l)">Abrir lectura</button></article></div></template>
      </section>
      <section v-else-if="vista==='evaluaciones'" class="alumno-seccion alumno-listados">
        <template v-if="examen"><h2>{{examen.titulo}}</h2><p>Lectura: {{examen.lecturaTitulo}}</p><details v-if="examen.lecturaContenido" class="alumno-panel-documento mb-3"><summary>Consultar el texto de la lectura</summary><p style="white-space:pre-wrap">{{examen.lecturaContenido}}</p></details><form @submit.prevent="enviar"><div v-for="(p,i) in examen.preguntas" :key="p.id" class="alumno-pregunta mb-3"><h3>{{i+1}}. {{p.enunciado}}</h3><label v-for="(op,k) in p.opciones" :key="k" class="alumno-opcion"><input v-model.number="respuestas[i].opcion" type="radio" :value="k" :name="'p'+p.id" required> {{String.fromCharCode(65+k)}}. {{op}}</label></div><button type="submit" class="gato-boton gato-boton-verde">Enviar evaluación</button></form></template>
        <template v-else><div class="alumno-titulo-seccion"><i class="fas fa-clipboard-check"></i><div><h2>Mis evaluaciones</h2><p>Responde con calma, lee bien cada pregunta.</p></div></div><p v-if="!evaluaciones.length" class="alumno-mensaje">Tu docente aún no asignó evaluaciones.</p><div class="alumno-grid-listados"><article v-for="e in evaluaciones" :key="e.id" class="alumno-tarjeta-actividad tipo-evaluacion"><i class="fas fa-clipboard-check"></i><h3>{{e.titulo}}</h3><p v-if="e.realizada">Terminada: {{e.puntaje}} de {{e.total}}</p><p v-else>¡Tú puedes hacerlo!</p><button v-if="!e.realizada" class="gato-boton gato-boton-verde" @click="abrirEvaluacion(e)">Resolver ahora</button><span v-else class="alumno-chip">Completada</span></article></div></template>
      </section>
      <section v-else-if="vista==='resultados'" class="alumno-seccion alumno-listados"><div class="alumno-titulo-seccion"><i class="fas fa-trophy"></i><div><h2>Mis resultados</h2><p>¡Mira todo lo que has aprendido!</p></div></div><div class="alumno-grid-listados"><article v-for="e in evaluaciones.filter(x=>x.realizada)" :key="e.id" class="alumno-tarjeta-actividad tipo-resultados"><i class="fas fa-medal"></i><h3>{{e.titulo}}</h3><p>Calificación: <strong>{{e.puntaje}} / {{e.total}}</strong></p><div class="alumno-progreso"><span :style="{width:(e.total>0?Math.min(100,100*e.puntaje/e.total):0)+'%'}"></span></div></article></div><p v-if="!evaluaciones.some(x=>x.realizada)" class="alumno-mensaje">Todavía no tienes evaluaciones realizadas.</p></section>
      
      <section v-else class="alumno-seccion alumno-listados alumno-juegos-pantalla">
        <template v-if="categoriaJuegos==='dinamicos'">
          <button type="button" class="gato-boton gato-boton-azul mb-3" @click="categoriaJuegos='inicio'">
            <i class="fas fa-arrow-left"></i> Volver a Juegos
          </button>
          <JuegosDinamicos @cerrar="categoriaJuegos='inicio'" />
        </template>
        <template v-else-if="categoriaJuegos==='inicio'">
          <div class="bienvenida-juegos-principal">
            <div class="bienvenida-juegos-cabecera">
              <div>
                <span class="etiqueta-juegos">GATO LECTURAS</span>
                <h2>¡Bienvenida a Juegos!</h2>
                <p>Elige una aventura y aprende jugando, leyendo, escuchando y descubriendo.</p>
              </div>
              <div class="bienvenida-gato-grande"><img :src="logo" alt="Gato Lecturas" /></div>
            </div>
            <div class="seleccion-tipos-juegos">
              <button type="button" class="tipo-juego-card tipo-juego-lectura" @click="categoriaJuegos='lectura'">
                <div class="tipo-juego-icono"><i class="fas fa-book-open-reader"></i></div>
                <div class="tipo-juego-texto">
                  <span>AVENTURAS PARA APRENDER</span>
                  <h2>Juegos de Lectura</h2>
                  <p>Historias, palabras, ortografía, sílabas, oraciones y secuencias.</p>
                  <strong class="boton-aventura-visible">Ver juegos <i class="fas fa-arrow-right"></i></strong>
                </div>
              </button>
              <button type="button" class="tipo-juego-card tipo-juego-dinamico" @click="categoriaJuegos='dinamicos'">
                <div class="tipo-juego-icono"><i class="fas fa-wand-magic-sparkles"></i></div>
                <div class="tipo-juego-texto">
                  <span>GRANDES AVENTURAS</span>
                  <h2>Juegos Dinámicos</h2>
                  <p>Ruletas, cajas sorpresa, concursos, globos y nuevos retos interactivos.</p>
                  <strong class="boton-aventura-visible">Entrar a la aventura <i class="fas fa-arrow-right"></i></strong>
                </div>
              </button>
            </div>
          </div>
        </template>
        <template v-else>
          <button type="button" class="gato-boton gato-boton-azul mb-3" @click="categoriaJuegos='inicio'">
            <i class="fas fa-arrow-left"></i> Volver a categorías
          </button>
          <div class="alumno-titulo-seccion"><i class="fas fa-book-open"></i><div>
            <h2>Juegos de Lectura</h2><p>Explora los juegos de lectura, vocabulario, ortografía y más.</p>
          </div></div>
          <div class="grid-juegos alumno-juegos-originales">
            <article v-for="(g,i) in juegos" :key="g.tipo" class="juego-card">
              <div :class="['juego-ilustracion','juego-'+(['morado','azul','amarillo','verde','morado','naranja','rosa','celeste'][i]||'azul')]">
                <i :class="['fas',g.icono]"></i>
              </div>
              <div class="juego-contenido">
                <h2>{{g.titulo}}</h2>
                <p>¡Juega, aprende y diviértete con Gato Lecturas!</p>
                <div class="acciones-juego">
                  <button type="button" class="gato-boton gato-boton-azul" @click="iniciarJuegoLectura(g)"><i class="fas fa-play"></i> Jugar</button>
                </div>
              </div>
            </article>
          </div>
        </template>
      </section>
    </main>
  </div>
  
  <Teleport to="body">
    <section v-if="vista==='juegos' && juego" class="pantalla-juego-lectura alumno-juego-pantalla-original" role="dialog" aria-modal="true" :aria-label="juego.titulo">
      <header class="prueba-header">
        <div class="marca-gato-lecturas">
          <img :src="logo" alt="Gato Lecturas" />
          <div><span>AVENTURA INTERACTIVA</span><h2>{{juego.titulo}}</h2></div>
        </div>
        <button type="button" class="btn-volver-juego-grande gato-boton-juego gato-juego-azul" @click="cerrarJuegoLectura">
          <i class="fas fa-arrow-left"></i> Volver a Juegos
        </button>
      </header>
      <LecturaGuiada v-if="juego.tipo==='lectura-guiada'" @cerrar="cerrarJuegoLectura" />
      <JuegoInteractivo v-else :key="juego.tipo" :juego="juego" @cerrar="cerrarJuegoLectura" />
    </section>
  </Teleport>
</template>
