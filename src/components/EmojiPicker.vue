<template>
  <div class="emoji-container">
    <div class="emoji-menu">
      <input
        id="emoji-input"
        ref="searchInput"
        v-model="filterText"
        placeholder="Search for an emoji"
        type="text"
        @keydown.enter.prevent="onEnter"
        @keydown.down.prevent="handleDownKey"
        @keydown.up.prevent="handleUpKey"
        @keydown.left.prevent="handleLeftKey"
        @keydown.right.prevent="handleRightKey"
      />
      <div class="items scroll-bar-dark">
        <div
          v-for="(emoji, index) in filteredKeys"
          :id="'emoji-' + index"
          :key="emoji"
          class="emoji-text"
          :class="{ selected: index === selectedIndex }"
          @click="emit('emojiSelected', emoji)"
        >
          {{ emoji }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { normalizedEmojis } from "@/helpers/emoji"
import { computed, nextTick, onMounted, ref, watch } from "vue"

const emit = defineEmits<{
  emojiSelected: [string]
}>()

const filterText = ref("")
const selectedIndex = ref(0)

const filteredKeys = computed(() => {
  const text = filterText.value.toLowerCase()
  return normalizedEmojis
    .filter(([, descriptions]) => descriptions.some((e) => e.includes(text)))
    .map(([key]) => key)
})

watch(filterText, () => {
  selectedIndex.value = 0
})

onMounted(async () => {
  await nextTick()
  const input = document.getElementById("emoji-input")
  input?.focus()
})

const onEnter = () => {
  if (filteredKeys.value[selectedIndex.value]) {
    emit("emojiSelected", filteredKeys.value[selectedIndex.value])
  }
}

const scrollToSelected = () => {
  const selected = document.getElementById(`emoji-${selectedIndex.value}`)
  selected?.scrollIntoView({
    block: "nearest",
    inline: "nearest"
  })
}

const handleUpKey = () => {
  if (selectedIndex.value < 8) {
    selectedIndex.value = 0
  } else {
    selectedIndex.value -= 8
  }
  scrollToSelected()
}

const handleDownKey = () => {
  if (selectedIndex.value + 8 >= filteredKeys.value.length) {
    selectedIndex.value = filteredKeys.value.length - 1
  } else {
    selectedIndex.value += 8
  }
  scrollToSelected()
}

const handleLeftKey = () => {
  if (selectedIndex.value !== 0) {
    selectedIndex.value--
    scrollToSelected()
  }
}

const handleRightKey = () => {
  if (selectedIndex.value !== filteredKeys.value.length - 1) {
    selectedIndex.value++
    scrollToSelected()
  }
}
</script>

<style scoped>
.emoji-container {
  position: relative;
}

.emoji-menu {
  position: absolute;
  bottom: 48px;
  right: 0;
  padding: 0 8px 8px;
  margin: 8px;
  border-radius: 4px;
  background-color: var(--grey);
}

.items {
  height: 240px;
  width: 280px;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(8, 28px);
  grid-auto-rows: 28px;
  gap: 6px;
}

.emoji-text {
  font-size: 28px;
  width: 32px;
  height: 32px;
  margin: 4px;
  border-radius: 4px;
  line-height: 34px;
  cursor: pointer;

  &:hover {
    background-color: var(--light);
  }

  &.selected {
    background-color: var(--light);
  }
}
</style>
