<template>
  <div class="modal" :class="{ 'is-active': isActive }" @click="closeModal">
    <div class="modal-content" @click.stop>
      <button class="modal-close" @click="closeModal">
        <icons
          color="white"
          width="40"
          height="40"
          icon="close"
          style="padding: 4px; cursor: grab"
        ></icons>
      </button>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Icons from "@/components/Icons.vue"

export default {
  name: "Modal",
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
  font-size: 0;
  position: absolute;
  top: 24px;
  right: 24px;
  padding: 0;
  border-radius: 24px;
}

.is-active {
  display: flex !important;
  justify-content: center;
  align-items: center;
}

.modal-content {
  position: relative;
  background-color: #282a2b;
  width: 500px;
  height: 600px;
  overflow-y: auto;
  border-radius: 24px;
}
</style>
