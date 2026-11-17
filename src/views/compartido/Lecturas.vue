<script setup>
import {ref,computed,onMounted} from 'vue'
import Navbar from '../../components/admin/Navbar.vue'
import Sidebar from '../../components/admin/Sidebar.vue'
import AlertaAdmin from '../../components/admin/AlertaAdmin.vue'
import TablaLecturas from '../../components/admin/lecturas/TablaLecturas.vue'
import {api,getSession,API_URL} from '../../services/api'
import '../../styles/admin/alertaAdmin.css'
import '../../styles/admin/lecturas.css'
import '../../styles/admin/modalLectura.css'
const alertaAdmin=ref(''),tipoAlertaAdmin=ref('success')
const mostrarAlertaAdmin=(s,t='success')=>{alertaAdmin.value=s;tipoAlertaAdmin.value=t}
const cerrarAlertaAdmin=()=>alertaAdmin.value=''
const mostrarModal=ref(false),modoModal=ref('nuevo'),lecturaSeleccionada=ref(null),mostrarVisor=ref(false),lecturaVisor=ref(null)
const busqueda=ref(''),filtroCurso=ref('Todos'),filtroTrimestre=ref('Todos'),filtroTipoArchivo=ref('Todos'),filtroEstado=ref('Todos')
const cursos=['3° A','3° B','3° C','3° D'],cursosPermitidos=ref([]),lecturas=ref([]),errorFormulario=ref(''),guardando=ref(false)
const session=getSession(),admin=session?.user?.rol==='ADMIN'
const form=ref({titulo:'',contenido:'',descripcion:'',trimestre:'',archivo:null,cursos:[]});const nombreArchivo=ref(''),archivoVista=ref(''),cargandoArchivo=ref(false)
const puedeEditar=x=>admin||String(x.autorId)===String(session?.user?.id)
async function cargarLecturas(){try{const [data,permitidos]=await Promise.all([api('/contenidos/lecturas'),api('/docente/cursos')]);cursosPermitidos.value=permitidos;lecturas.value=data.map(x=>({...x,curso:(x.cursos||[]).map(c=>'3° '+c.slice(1)).join(', '),trimestre:x.trimestre||'—',tipoArchivo:x.archivoTipo?(x.archivoTipo==='application/pdf'?'PDF':'Imagen'):'Texto',archivo:x.archivoNombre||'Texto en PostgreSQL',estado:x.activa?'Activo':'Inactivo'}))}catch(e){mostrarAlertaAdmin(e.message,'danger')}}
onMounted(cargarLecturas)
const lecturasFiltradas=computed(()=>lecturas.value.filter(l=>{const q=busqueda.value.toLowerCase().trim();return(!q||l.titulo.toLowerCase().includes(q))&&(filtroCurso.value==='Todos'||l.cursos.includes('3'+filtroCurso.value.slice(-1)))&&(filtroTrimestre.value==='Todos'||l.trimestre===filtroTrimestre.value)&&(filtroTipoArchivo.value==='Todos'||l.tipoArchivo===filtroTipoArchivo.value)&&(filtroEstado.value==='Todos'||l.estado===filtroEstado.value)}))
function abrirNuevaLectura(){modoModal.value='nuevo';lecturaSeleccionada.value=null;form.value={titulo:'',contenido:'',descripcion:'',trimestre:'',archivo:null,cursos:[]};nombreArchivo.value='';errorFormulario.value='';mostrarModal.value=true}
function editarLectura(x){if(!puedeEditar(x))return mostrarAlertaAdmin('Solo puedes modificar tus lecturas','danger');modoModal.value='editar';lecturaSeleccionada.value=x;form.value={titulo:x.titulo,contenido:x.contenido||'',descripcion:x.descripcion||'',trimestre:x.trimestre||'',archivo:null,cursos:[...x.cursos]};nombreArchivo.value=x.archivoNombre||'';errorFormulario.value='';mostrarModal.value=true}
function cerrarModal(){mostrarModal.value=false;lecturaSeleccionada.value=null}
async function elegirArchivo(e){
 const f=e.target.files?.[0];if(!f)return;
 if(!['application/pdf','image/jpeg','image/png'].includes(f.type)||f.size>10*1024*1024){errorFormulario.value='Selecciona PDF, JPG o PNG de hasta 10 MB';e.target.value='';return}
 errorFormulario.value='';cargandoArchivo.value=true;
 try{const data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]);reader.onerror=()=>reject(new Error('No se pudo leer el archivo'));reader.readAsDataURL(f)});form.value.archivo={nombre:f.name,tipo:f.type,base64:data};nombreArchivo.value=f.name}
 catch(err){errorFormulario.value=err.message}finally{cargandoArchivo.value=false;e.target.value=''}
}
function quitarArchivo(){form.value.archivo=null;nombreArchivo.value=''}
async function guardarLectura(){
 if(guardando.value||cargandoArchivo.value)return;errorFormulario.value='';
 if(!form.value.titulo.trim()||!form.value.trimestre||!form.value.cursos.length){errorFormulario.value='Completa el título, trimestre y al menos un paralelo';return}
 if(!lecturaSeleccionada.value&&!form.value.archivo){errorFormulario.value='Adjunta un PDF o una imagen JPG/PNG';return}
 guardando.value=true;
 try{const x=lecturaSeleccionada.value;await api('/contenidos/lecturas'+(x?'/'+x.id:''),{method:x?'PUT':'POST',body:JSON.stringify({...form.value,activa:x?x.activa:true})});cerrarModal();mostrarAlertaAdmin('Lectura guardada correctamente en PostgreSQL');await cargarLecturas()}
 catch(e){errorFormulario.value=e.message}finally{guardando.value=false}
}
async function cargarVistaArchivo(x){if(archivoVista.value){URL.revokeObjectURL(archivoVista.value);archivoVista.value=''}if(!x?.archivoTipo)return;try{const r=await fetch(API_URL+'/contenidos/lecturas/'+x.id+'/archivo',{headers:{Authorization:'Bearer '+getSession()?.token}});if(!r.ok)throw Error('No se pudo abrir el archivo');archivoVista.value=URL.createObjectURL(await r.blob())}catch(e){mostrarAlertaAdmin(e.message,'danger')}}
async function cambiarEstado(x){if(!puedeEditar(x))return mostrarAlertaAdmin('No tienes permiso para modificar esta lectura','danger');if(!x.activa)return mostrarAlertaAdmin('Esta lectura está desactivada. Para reactivarla se requiere revisar las asignaciones.','warning');try{await api('/contenidos/lecturas/'+x.id,{method:'DELETE'});mostrarAlertaAdmin('Lectura desactivada');await cargarLecturas()}catch(e){mostrarAlertaAdmin(e.message,'danger')}}
function verLectura(x){lecturaVisor.value=x;mostrarVisor.value=true;cargarVistaArchivo(x)}
function cerrarVisor(){mostrarVisor.value=false;if(archivoVista.value)URL.revokeObjectURL(archivoVista.value);archivoVista.value=''}
</script>
<template>

    <Navbar />

    <div class="lecturas-layout">

        <Sidebar />

        <main class="contenido">
            <AlertaAdmin :message="alertaAdmin" :type="tipoAlertaAdmin" @close="cerrarAlertaAdmin" />

            <div class="encabezado">

                <div>

                    <h1>
                        Gestión de Lecturas
                    </h1>

                    <p>
                        Administre las lecturas disponibles para los estudiantes.
                    </p>

                </div>

                <button
                    type="button"
                    class="btn-nuevo"
                    @click="abrirNuevaLectura"
                >

                    <i class="fas fa-plus"></i>

                    Nueva Lectura

                </button>

            </div>

            <div class="barra-herramientas-lecturas">

                <div class="busqueda-lecturas">

                    <i class="fas fa-search"></i>

                    <input
                        v-model="busqueda"
                        type="text"
                        placeholder="Buscar lectura..."
                    >

                </div>

                <select
                    v-model="filtroCurso"
                    class="filtro-lecturas"
                >

                    <option value="Todos">
                        Todos los cursos
                    </option>

                    <option
                        v-for="curso in cursos"
                        :key="curso"
                        :value="curso"
                    >

                        {{ curso }}

                    </option>

                </select>

                <select
                    v-model="filtroTrimestre"
                    class="filtro-lecturas"
                >

                    <option value="Todos">
                        Todos los trimestres
                    </option>

                    <option value="Primer trimestre">
                        Primer trimestre
                    </option>

                    <option value="Segundo trimestre">
                        Segundo trimestre
                    </option>

                    <option value="Tercer trimestre">
                        Tercer trimestre
                    </option>

                </select>

                <select
                    v-model="filtroTipoArchivo"
                    class="filtro-lecturas"
                >

                    <option value="Todos">
                        Todos los archivos
                    </option>

                    <option value="PDF">
                        PDF
                    </option>

                    <option value="Imagen">
                        Imagen
                    </option>
                    <option value="Texto">Texto</option>

                </select>

                <select
                    v-model="filtroEstado"
                    class="filtro-lecturas"
                >

                    <option value="Todos">
                        Todos los estados
                    </option>

                    <option value="Activo">
                        Activas
                    </option>

                    <option value="Inactivo">
                        Inactivas
                    </option>

                </select>

            </div>

            <TablaLecturas

                :lecturas="lecturasFiltradas"

                @ver="verLectura"

                @editar="editarLectura"

                @cambiar-estado="cambiarEstado"

            />

        </main>

    </div>

    <div v-if="mostrarModal" class="modal-fondo-lectura" @click.self="cerrarModal">
      <div class="modal-lectura" role="dialog" aria-modal="true" aria-label="Formulario de lectura">
        <div class="modal-lectura-encabezado"><div><h2>{{modoModal==='editar'?'Editar Lectura':'Nueva Lectura'}}</h2><p>Registre una lectura y asígnela a los paralelos.</p></div><button type="button" class="btn-cerrar-lectura" @click="cerrarModal"><i class="fas fa-times"></i></button></div>
        <div class="modal-lectura-contenido lectura-formal">
          <div class="lectura-fila"><div class="campo-lectura"><label>Título de la lectura <span class="requerido">*</span></label><input v-model="form.titulo" maxlength="160" placeholder="Ej. El león y el ratón" /></div>
            <div class="campo-lectura"><label>Trimestre <span class="requerido">*</span></label><select v-model="form.trimestre" class="lectura-select"><option disabled value="">Seleccione el trimestre</option><option>Primer trimestre</option><option>Segundo trimestre</option><option>Tercer trimestre</option></select></div></div>
          <div class="campo-lectura"><label>Descripción (opcional)</label><textarea v-model="form.descripcion" rows="3" maxlength="600" class="lectura-descripcion" placeholder="Breve resumen de la lectura..."></textarea></div>
          <div class="lectura-fila archivo-fila"><div class="campo-lectura"><label>Archivo de la lectura <span v-if="modoModal==='nuevo'" class="requerido">*</span></label>
             <label class="lectura-subida"><i class="fas fa-cloud-arrow-up"></i><strong>Seleccionar archivo</strong><span>PDF, JPG o PNG · Máximo 10 MB</span><input type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" @change="elegirArchivo"/></label></div>
            <div class="campo-lectura"><label>Vista previa del archivo</label><div class="lectura-preview"><i :class="nombreArchivo.toLowerCase().endsWith('.pdf')?'fas fa-file-pdf':'fas fa-file-image'"></i><span>{{nombreArchivo||'Sin archivo seleccionado'}}</span><button v-if="form.archivo" type="button" class="btn-quitar-archivo" @click="quitarArchivo">Quitar archivo</button><small v-else-if="modoModal==='editar'&&nombreArchivo">Archivo actual conservado</small></div></div></div>
          <div class="campo-lectura"><label>Paralelos asignados <span class="requerido">*</span></label><div class="d-flex gap-3 flex-wrap py-2"><label v-for="c in cursosPermitidos" :key="c" class="d-flex gap-2 align-items-center"><input type="checkbox" :value="c" v-model="form.cursos">3° {{c.slice(1)}}</label></div></div>
          <div v-if="errorFormulario" class="alert alert-danger">{{errorFormulario}}</div>
        </div>
        <div class="modal-lectura-pie"><button type="button" class="btn-cancelar-lectura" @click="cerrarModal">Cancelar</button><button type="button" class="btn-guardar-lectura" :disabled="guardando||cargandoArchivo" @click="guardarLectura"><i class="fas fa-save"></i> Guardar</button></div>
      </div>
    </div>
    <div v-if="mostrarVisor" class="visor-lectura-fondo" @click.self="cerrarVisor">
      <div class="visor-lectura-modal"><div class="visor-lectura-encabezado"><div><h2>{{lecturaVisor?.titulo}}</h2><span>{{lecturaVisor?.archivoNombre||'Lectura de texto'}}</span></div><button type="button" class="btn-cerrar-visor-lectura" @click="cerrarVisor"><i class="fas fa-times"></i></button></div>
        <div class="visor-lectura-contenido" style="padding:20px;overflow:auto;max-height:75vh"><iframe v-if="archivoVista&&lecturaVisor?.archivoTipo==='application/pdf'" :src="archivoVista" title="PDF de la lectura" style="width:100%;height:65vh;border:0"></iframe><img v-else-if="archivoVista" :src="archivoVista" :alt="lecturaVisor?.titulo" style="display:block;max-width:100%;margin:auto"/><p v-else style="white-space:pre-wrap">{{lecturaVisor?.contenido||'Cargando archivo...'}}</p></div>
      </div>
    </div>
</template>
<style scoped>
.lectura-formal .lectura-fila{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.lectura-formal .campo-lectura{min-width:0;margin-bottom:20px}
.lectura-formal .campo-lectura>label:first-child{display:block;font-weight:700;color:#283750;margin-bottom:8px}
.lectura-formal .requerido{color:#e11d48}
.lectura-formal .lectura-select,.lectura-formal .lectura-descripcion{width:100%;border:1px solid #cad5e4;border-radius:7px;padding:10px;color:#263754;background:#fff}
.lectura-formal .lectura-subida{min-height:145px;border:2px dashed #91b8f6;border-radius:10px;display:flex!important;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:#234680;cursor:pointer;background:#f7faff;padding:18px}
.lectura-subida i{font-size:30px;color:#2563eb}.lectura-subida input{position:absolute;width:1px;height:1px;opacity:0}
.lectura-subida span{font-size:12px;color:#5c7190}.lectura-formal .lectura-preview{min-height:145px;border:1px solid #d5deed;border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:14px;overflow-wrap:anywhere;text-align:center}
.lectura-preview i{font-size:29px;color:#2358aa}.lectura-preview span{font-size:13px;color:#31445c}.btn-quitar-archivo{border:0;border-radius:8px;background:#fff0f0;color:#b42332;padding:6px 14px}
@media(max-width:640px){.lectura-formal .lectura-fila{grid-template-columns:1fr}}
</style>
