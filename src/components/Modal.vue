<template>
  <div class="background">
    <div class="modal" :class="{ 'is-active': isActive }" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeModal">
          <icons
            color="white"
            width="32"
            height="32"
            icon="close"
            style="padding: 4px; cursor: pointer"
          ></icons>
        </button>
        <slot></slot>
      </div>
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
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
}

.modal {
  width: 100%;
  height: calc(100% - 48px);
  margin-top: 48px;
  display: none;
  overflow-y: auto;
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
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-height: 648px) {
  .is-active {
    align-items: normal;
  }
}

.modal-content {
  position: relative;
  background-color: #282a2b;
  width: min(500px, calc(100% - 20px));
  height: 600px;
  overflow-y: auto;
  border-radius: 24px;
}
</style>
