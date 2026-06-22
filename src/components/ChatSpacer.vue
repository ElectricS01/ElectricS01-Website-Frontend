<template>
  <div
    v-if="
      dayjsDate(message.createdAt) !== dayjsDate(previousMessage?.createdAt)
    "
    class="chat-spacer"
  >
    <div />
    <p>
      {{ dayjsDate(message.createdAt) }}
    </p>
    <div />
  </div>
</template>

<script setup>
import { dayjsDate } from "@/helpers/dates"

defineProps({
  message: {
    required: true,
    type: Object
  },
  previousMessage: Object
})
</script>
