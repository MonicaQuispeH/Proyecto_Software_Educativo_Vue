export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
export function getSession(){try{return JSON.parse(sessionStorage.getItem('gato_session')||'null')}catch{return null}}
export function setSession(value){sessionStorage.setItem('gato_session',JSON.stringify(value))}
export function clearSession(){sessionStorage.removeItem('gato_session')}
export async function api(path, options={}){const session=getSession();const headers={'Content-Type':'application/json',...(session?.token?{Authorization:`Bearer ${session.token}`}:{}) ,...options.headers};const res=await fetch(API_URL+path,{...options,headers});const data=await res.json().catch(()=>({}));if(!res.ok)throw new Error(data.error||'No se pudo completar la solicitud');return data}
