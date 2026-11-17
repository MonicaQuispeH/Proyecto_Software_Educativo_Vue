<script setup>
import { useRouter } from 'vue-router'
import logo from '../assets/gato-lectura/logo-gato-lecturas.png'
import '../styles/inicio.css'

const router = useRouter()
</script>

<template>
  <main class="inicio-infantil">
    <span class="inicio-forma inicio-forma-uno" aria-hidden="true"></span>
    <span class="inicio-forma inicio-forma-dos" aria-hidden="true"></span>
    <section class="inicio-infantil-tarjeta">
      <img :src="logo" alt="Logo de Gato Lecturas" class="inicio-infantil-logo" />
      <div class="inicio-infantil-grid">
        <div class="inicio-infantil-texto">
          <span class="inicio-infantil-etiqueta">¡Hola, exploradores de historias!</span>
          <h1>¡Aprendamos a <span>leer!</span></h1>
          <p>Descubre cuentos, aventuras y juegos para aprender mientras te diviertes.</p>
          <button type="button" class="gato-boton gato-boton-morado inicio-infantil-boton" @click="router.push('/login')">
            Comenzar
          </button>
          <small>¡Cada lectura es una aventura!</small>
        </div>
        <div class="inicio-infantil-ilustracion" aria-hidden="true">
          <div class="inicio-infantil-halo"></div>
          <div class="inicio-infantil-mensaje">¡Cada historia es una nueva aventura!</div>
        </div>
      </div>
    </section>
  </main>
</template>
