<template>
  <div class="parent" :style="menuStyle">
    <div ref="popover" popover class="context-menu">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, type CSSProperties } from "vue"
import type { Position } from "@/types/position"

const props = defineProps<{
  position: Position
}>()

const emit = defineEmits<{
  close: []
}>()

const popover = ref<HTMLElement | null>(null)

const menuStyle = computed<CSSProperties>(() => {
  const adjustedX = props.position.x + window.scrollX
  const adjustedY = props.position.y + window.scrollY

  return {
    left: `${adjustedX}px`,
    top: `${adjustedY - 48}px`
  }
})

const toggle = (event: ToggleEvent) => {
  if (event.newState === "closed") {
    if (popover.value) {
      popover.value.removeEventListener("beforetoggle", toggle)
    }

    emit("close")
  }
}

onMounted(() => {
  if (popover.value) {
    popover.value.showPopover()
    popover.value.addEventListener("beforetoggle", toggle)
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
  position-anchor: --i-btn;
  top: calc(anchor(top) - 2px);
  left: calc(anchor(left) - 2px);
  position-try-fallbacks: --right-top, --left-bottom, --right-bottom;
  color: white;
  border-radius: 2px;
  background-color: #181a1b;
  border: 1px solid #212425;
  padding: 2px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  width: max-content;
}

@position-try --right-top {
  right: calc(anchor(right) - 2px);
  top: calc(anchor(top) - 2px);
  left: unset;
}

@position-try --left-bottom {
  left: calc(anchor(left) - 2px);
  bottom: calc(anchor(bottom) - 2px);
  top: unset;
}

@position-try --right-bottom {
  right: calc(anchor(right) - 2px);
  bottom: calc(anchor(bottom) - 2px);
  left: unset;
  top: unset;
}
</style>
