<template>
  <div :style="menuStyle" class="context-menu">
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps(["position"])

const menuStyle = computed(() => {
  const adjustedX = props.position.x + window.scrollX
  const adjustedY = props.position.y + window.scrollY
  return {
    position: "absolute",
    left: `${adjustedX}px`,
    top: `${adjustedY - 48}px`,
    zIndex: 3
  }
})
</script>

<style scoped>
.context-menu {
  border-radius: 2px;
  background-color: #181a1b;
  border: 1px solid #212425;
  padding: 2px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  width: max-content;
}
</style>
