<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
const props = defineProps({ message: { type: String, default: '' }, type: { type: String, default: 'success' } })
const emit = defineEmits(['close'])
const visible = ref(false)
let timer
watch(() => props.message, (value) => {
  visible.value = Boolean(value)
  clearTimeout(timer)
  if (value) timer = setTimeout(() => emit('close'), 5000)
}, { immediate: true })
onBeforeUnmount(() => clearTimeout(timer))
const icon = computed(() => ({ success: 'fa-circle-check', danger: 'fa-circle-exclamation', warning: 'fa-triangle-exclamation', info: 'fa-circle-info' }[props.type] || 'fa-circle-info'))
</script>

<template>
  <div v-if="visible && message" class="alerta-admin alert" :class="`alert-${type}`" role="status" aria-live="polite">
    <i class="fas" :class="icon" aria-hidden="true"></i>
    <span>{{ message }}</span>
    <button type="button" class="alerta-admin-cerrar" aria-label="Cerrar aviso" @click="$emit('close')">&times;</button>
  </div>
</template>
