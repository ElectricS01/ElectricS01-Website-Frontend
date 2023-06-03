<template>
  <div class="sidebar">
    <div class="sidebar-border scroll-bar">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Icons from "@/components/Icons.vue"

export default {
  name: "sidebarLeft",
  components: { Icons },
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeModal() {
      this.$emit("close")
    }
  }
}
</script>

<style scoped>
.sidebar-border {
  overflow-y: auto;
  padding: 8px;
  border-right: 1px solid #212425;
  width: calc(100% - 16px);
  height: 100%;
}
</style>
