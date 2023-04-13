<template>
  <div class="sidebar">
    <div class="sidebar-border">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Icons from "@/components/Icons.vue"

export default {
  name: "Sidebar",
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

<style>
.sidebar {
  position: fixed;
  right: 0;
  top: 48px;
  overflow-y: auto;
  height: calc(100% - 48px);
  width: 242px;
  padding: 4px 8px 8px 0;
}

.sidebar-border {
  border-left: 1px solid #212425;
  width: calc(100% - 8px);
}
</style>
