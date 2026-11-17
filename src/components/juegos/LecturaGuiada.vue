<script setup>
import { ref, computed, onBeforeUnmount, watch } from 'vue'
import '../../styles/juegos/lecturaGuiada.css'
const emit = defineEmits(['cerrar'])
const fabulas = [
  { titulo:'La liebre y la tortuga', texto:'La liebre se burlaba de la tortuga porque caminaba despacio. Decidieron correr una carrera. La liebre se durmió durante el camino. La tortuga siguió avanzando sin detenerse y llegó primero. La constancia vence a la confianza excesiva.' },
  { titulo:'El león y el ratón', texto:'Un león atrapó a un ratoncito. El ratón le pidió libertad y prometió ayudarlo algún día. El león lo dejó ir. Tiempo después, el león cayó en una red. El ratón mordió las cuerdas y lo liberó. Hasta el más pequeño puede ayudar.' },
  { titulo:'La zorra y las uvas', texto:'Una zorra vio unas uvas que colgaban muy alto. Saltó varias veces para alcanzarlas, pero no pudo. Al alejarse dijo que seguramente estaban verdes. A veces despreciamos lo que no conseguimos.' },
  { titulo:'El pastor mentiroso', texto:'Un pastor gritó que venía el lobo, aunque era mentira. Los vecinos fueron a ayudarlo y él se rio. Repitió la broma varias veces. Cuando el lobo apareció de verdad, nadie creyó sus gritos. Decir la verdad es importante.' },
  { titulo:'La hormiga y la cigarra', texto:'Durante el verano, la hormiga guardaba comida y la cigarra cantaba. Al llegar el frío, la cigarra no tenía alimento. Entonces comprendió que debía prepararse para los días difíciles. Trabajar con tiempo nos ayuda a estar listos.' }
]
const elegido=ref(0), velocidad=ref('0.85'), indice=ref(-1), estado=ref('Selecciona una fábula y presiona Escuchar.'), reproduciendo=ref(false), pausado=ref(false)
const fabula=computed(()=>fabulas[elegido.value]);const partes=computed(()=>Array.from(fabula.value.texto.matchAll(/\S+/g)).map(m=>({palabra:m[0],inicio:m.index,fin:m.index+m[0].length})))
let utterance=null,contador=0
const soportado=typeof window!=='undefined' && !!window.speechSynthesis
function detener(){ contador++; if(soportado)window.speechSynthesis.cancel(); utterance=null;reproduciendo.value=false;pausado.value=false;indice.value=-1 }
function leer(){detener();if(!soportado){estado.value='Este navegador no tiene lectura en voz alta.';return}const turno=++contador;const u=new SpeechSynthesisUtterance(fabula.value.texto);utterance=u;u.lang='es-ES';u.rate=Number(velocidad.value);const voces=window.speechSynthesis.getVoices();const voz=voces.find(v=>v.lang?.toLowerCase().startsWith('es'));if(voz)u.voice=voz;
 u.onstart=()=>{if(turno!==contador)return;reproduciendo.value=true;estado.value='Escuchando la fábula...'};
 u.onboundary=e=>{if(turno!==contador)return;const pos=e.charIndex;const i=partes.value.findIndex((p,j)=>pos>=p.inicio && (pos<p.fin || (j===partes.value.length-1 && pos<=p.fin)));if(i>=0)indice.value=i;};
 u.onend=()=>{if(turno!==contador)return;reproduciendo.value=false;pausado.value=false;indice.value=-1;estado.value='¡Terminaste la lectura! Puedes escucharla otra vez.'};
 u.onerror=e=>{if(turno!==contador || e.error==='canceled' || e.error==='interrupted')return;reproduciendo.value=false;pausado.value=false;estado.value='No se pudo reproducir la voz. Comprueba el audio del navegador.'};
 window.speechSynthesis.speak(u);
 setTimeout(()=>{if(turno===contador && reproduciendo.value && indice.value<0)estado.value='Escuchando. Esta voz no informa la posición exacta de cada palabra; prueba otra voz de tu navegador.'},1800)
}
function pausar(){if(!soportado || !reproduciendo.value)return;if(pausado.value){window.speechSynthesis.resume();pausado.value=false;estado.value='Escuchando la fábula...'}else{window.speechSynthesis.pause();pausado.value=true;estado.value='Lectura en pausa.'}}
function cambiar(){detener();estado.value='Presiona Escuchar para iniciar esta fábula.'}
function salir(){detener();emit('cerrar')}
watch(elegido,cambiar);onBeforeUnmount(detener)
</script>
<template>
  <section class="lectura-guiada" aria-label="Lectura guiada de fábulas de Esopo">
    <h3><i class="fas fa-book-open me-2" aria-hidden="true"></i> Fábulas cortas de Esopo</h3>
    <p class="guia-ayuda">Escucha el cuento y sigue las palabras resaltadas en amarillo.</p>
    <div class="d-flex justify-content-center align-items-center flex-wrap gap-3 mb-4">
      <label for="fabula" class="fw-bold">Elige una fábula</label>
      <select id="fabula" v-model.number="elegido" class="guia-selector"><option v-for="(f,i) in fabulas" :key="i" :value="i">{{f.titulo}}</option></select>
      <label for="velocidad" class="fw-bold">Velocidad</label>
      <select id="velocidad" v-model="velocidad" class="guia-selector" @change="cambiar"><option value="0.7">Lenta</option><option value="0.85">Suave</option><option value="1">Normal</option></select>
    </div>
    <div class="guia-cuento" aria-live="off"><span v-for="(p,i) in partes" :key="i" class="guia-palabra" :class="{activa:i===indice}">{{p.palabra}} </span></div>
    <div class="guia-acciones">
      <button type="button" class="verde" @click="leer"><i class="fas fa-volume-high" aria-hidden="true"></i> {{reproduciendo?'Reiniciar':'Escuchar'}}</button>
      <button type="button" class="morado" :disabled="!reproduciendo" @click="pausar"><i :class="['fas',pausado?'fa-play':'fa-pause']" aria-hidden="true"></i> {{pausado?'Continuar':'Pausar'}}</button>
      <button type="button" class="naranja" @click="detener();estado='Lectura detenida.'"><i class="fas fa-stop" aria-hidden="true"></i> Detener</button>
      <button type="button" @click="salir"><i class="fas fa-arrow-left" aria-hidden="true"></i> Volver a juegos</button>
    </div>
    <p class="guia-estado" role="status">{{estado}}</p>
  </section>
</template>
