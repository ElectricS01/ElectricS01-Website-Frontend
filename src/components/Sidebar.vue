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
  height: calc(100% - 8px);
  width: 242px;
  padding: 4px 4px 4px 0;
}

.sidebar-border {
  overflow-y: auto;
  padding: 4px 0;
  border-left: 1px solid #212425;
  width: calc(100% - 4px);
  height: 100%;
}
</style>
