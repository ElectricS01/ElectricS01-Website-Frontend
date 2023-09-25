<template>
  <div :style="menuStyle" class="context-menu">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    position: Object
  },
  computed: {
    menuStyle() {
      const adjustedX = this.position.x + window.scrollX
      const adjustedY = this.position.y + window.scrollY

      return {
        position: "absolute",
        left: `${adjustedX}px`,
        top: `${adjustedY - 48}px`,
        zIndex: 3
      }
    }
  },
  mounted() {
    document.addEventListener("click", this.handleDocumentClick)
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleDocumentClick)
  },
  methods: {
    handleDocumentClick(event) {
      const contextMenuElement = this.$el
      if (!contextMenuElement.contains(event.target)) {
        this.$emit("close")
      }
    }
  }
}
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
