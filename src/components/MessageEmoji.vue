<template>
  <div v-if="Object.keys(emojiCounts).length > 0" class="reaction-section">
    <div
      v-for="(count, emoji) in emojiCounts"
      :key="emoji"
      class="reaction"
      :class="{ mine: count[1] }"
      @click="handleReact(emoji)"
    >
      {{ emoji }} {{ count[0] }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { Reaction } from "@/types/message"
import { computed } from "vue"

const props = defineProps<{ reactions: Reaction[]; userId?: number }>()

const emit = defineEmits<{
  reactionSelected: [emoji: string]
  reactionRemoved: [emoji: string]
}>()

const emojiCounts = computed(() => {
  const counts: Record<string, [number, boolean]> = {}

  for (const { emoji, userId } of props.reactions) {
    counts[emoji] = [
      (counts[emoji]?.[0] ?? 0) + 1,
      (counts[emoji]?.[1] || userId === props.userId) ?? false
    ]
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
  margin-top: 4px;
  display: flex;
}

.reaction {
  cursor: pointer;
  background-color: var(--light);
  padding: 0 2px;
  border-radius: 4px;
  margin: 0 2px 0 0;

  &:hover {
    background-color: var(--lightest);
  }

  &.mine {
    background-color: var(--blue-transparent);

    &:hover {
      background-color: var(--blue-hover);
    }
  }
}
</style>
