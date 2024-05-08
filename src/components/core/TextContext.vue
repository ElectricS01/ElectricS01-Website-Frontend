<template>
  <div class="parent" :style="menuStyle">
    <div popover class="context-menu text-small">
      {{ props.text }}
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({ position: Object, text: String })

const menuStyle = computed(() => {
  const adjustedX = props.position.x + window.scrollX
  const adjustedY = props.position.y + window.scrollY
  return {
    left: `${adjustedX}px`,
    top: `${adjustedY}px`
  }
})
</script>

<style scoped>
.parent {
  position: fixed;
  z-index: 3;
}
.context-menu {
  translate: -50% -100%;
  inset: unset;
  display: block;
  color: white;
  border-radius: 2px;
  background-color: #181a1b;
  border: none;
  padding: 2px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  width: max-content;
}
</style>
