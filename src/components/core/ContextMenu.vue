<template>
  <div class="parent" :style="menuStyle">
    <div popover class="context-menu">
      <slot></slot>
    </div>
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
.parent {
  anchor-name: --i-btn;
}
.context-menu {
  inset: unset;
  anchor-default: --i-btn;
  position-fallback: --top-to-bottom;
  display: block;
  color: white;
  border-radius: 2px;
  background-color: #181a1b;
  border: 1px solid #212425;
  padding: 2px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  width: max-content;
}
@position-fallback --top-to-bottom {
  @try {
    left: anchor(left);
  }
  @try {
    right: anchor(right);
  }
}
</style>
