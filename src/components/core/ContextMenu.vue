<template>
  <div class="parent" :style="menuStyle">
    <div popover class="context-menu">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  position: Object
})

const menuStyle = computed(() => {
  const adjustedX = props.position.x + window.scrollX
  const adjustedY = props.position.y + window.scrollY
  return {
    left: `${adjustedX}px`,
    top: `${adjustedY - 48}px`
  }
})
</script>

<style scoped>
.parent {
  anchor-name: --i-btn;
  position: absolute;
  z-index: 3;
}
.context-menu {
  inset: unset;
  anchor-default: --i-btn;
  position-fallback: --right-to-left;
  display: block;
  color: white;
  border-radius: 2px;
  background-color: #181a1b;
  border: 1px solid #212425;
  padding: 2px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  width: max-content;
}
@position-fallback --right-to-left {
  @try {
    left: anchor(left);
    top: anchor(top);
  }
  @try {
    right: anchor(right);
    top: anchor(top);
  }
  @try {
    left: anchor(left);
    bottom: anchor(bottom);
  }
  @try {
    right: anchor(right);
    bottom: anchor(bottom);
  }
}
</style>
