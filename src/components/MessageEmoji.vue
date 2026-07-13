<template>
  <div class="reaction-section">
    <div
      v-for="(count, emoji) in emojiCounts"
      :key="emoji"
      class="reaction"
      @click="handleReact(emoji)"
    >
      {{ emoji }} {{ count }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { Reaction } from "@/types/message"
import { computed } from "vue"

const props = defineProps<{ reactions: Reaction[]; userId: number }>()

const emit = defineEmits<{
  reactionSelected: [emoji: string]
  reactionRemoved: [emoji: string]
}>()

const emojiCounts = computed(() => {
  const counts: Record<string, number> = {}

  for (const { emoji } of props.reactions) {
    counts[emoji] = (counts[emoji] ?? 0) + 1
  }

  return counts
})

const handleReact = (emoji: string) => {
  const reaction = props.reactions.find(
    (r) => r.emoji === emoji && r.userId === props.userId
  )
  if (reaction) {
    emit("reactionRemoved", emoji)
  } else {
    emit("reactionSelected", emoji)
  }
}
</script>

<style>
.reaction-section {
  display: flex;
}

.reaction {
  background-color: #1e90ff80;
  padding: 0 2px;
  border-radius: 4px;
  margin: 0 2px 0 0;
}
</style>
