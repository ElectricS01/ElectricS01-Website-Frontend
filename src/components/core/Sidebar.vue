<template>
  <div class="sidebar">
    <div class="sidebar-border scroll-bar">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.sidebar-border {
  overflow-y: auto;
  padding: 8px;
  border-left: 1px solid #212425;
  width: calc(100% - 16px);
  height: 100%;
}
</style>
