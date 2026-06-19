<template>
  <div>
    <div class="text-small">
      <label class="text-small" for="chat-name">Chat name</label>
    </div>
    <input
      id="chat-name"
      v-model="chatName"
      placeholder="Chat name"
      class="modal-input"
      @keydown.enter="$emit('submit')"
    />
    <div class="text-small">
      <label for="chat-description">Chat description</label>
    </div>
    <input
      id="chat-description"
      v-model="chatDescription"
      placeholder="Chat description"
      class="modal-input"
      @keydown.enter="$emit('submit')"
    />
    <div class="text-small">
      <label for="chat-icon">Chat icon</label>
    </div>
    <input
      id="chat-icon"
      v-model="chatIcon"
      placeholder="Chat icon"
      class="modal-input"
      @keydown.enter="$emit('submit')"
    />
    <div v-if="emailVerified">
      <div class="text-small">
        <label for="requireVerification">Require verification</label>
      </div>
      <div class="switch" @click="requireVerification = !requireVerification">
        <input
          id="requireVerification"
          type="checkbox"
          :checked="requireVerification"
        />
        <span class="slider" />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  emailVerified: {
    default: false,
    type: Boolean
  }
})

defineEmits(["submit"])

const chatName = defineModel("chatName", {
  default: "",
  type: String
})
const chatDescription = defineModel("chatDescription", {
  default: "",
  type: String
})
const chatIcon = defineModel("chatIcon", {
  default: "",
  type: String
})
const requireVerification = defineModel("requireVerification", {
  default: true,
  type: Boolean
})
</script>
