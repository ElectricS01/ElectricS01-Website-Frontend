<template>
  <div class="modal" :class="{ 'is-active': isActive }" @click="closeModal">
    <div class="modal-content" @click.stop>
      <slot></slot>
    </div>
    <button class="modal-close" aria-label="close" @click="closeModal"></button>
  </div>
</template>

<script>
export default {
  name: "Modal",
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
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: none;
  z-index: 2;
}

.modal-close {
  position: absolute;
}

.is-active {
  display: flex !important;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #282a2b;
  padding: 24px;
  width: 500px;
  height: 600px;
  overflow-y: auto;
  border-radius: 24px;
}
</style>
