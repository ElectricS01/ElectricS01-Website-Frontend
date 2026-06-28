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

<script setup lang="ts">
import { dayjsDate } from "@/helpers/dates"
import { Message } from "@/types/message"

defineProps<{
  message: Message
  previousMessage?: Message
}>()
</script>
