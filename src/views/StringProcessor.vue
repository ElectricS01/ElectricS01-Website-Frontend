<template>
  <div
    class="container scroll-bar string-processor"
    style="padding: 0 16px; text-align: left; width: calc(100% - 32px)"
  >
    <h2>ElectricS01's String Processor</h2>
    <p>Process multiline text</p>
    <label for="string-input">Enter your text:</label>
    <textarea
      id="string-input"
      v-model="text"
      class="scroll-bar"
      placeholder="Enter one value per row"
    />
    <div class="row-summary">
      <span>Total rows: {{ rows.length }}</span>
      <span>Unique rows: {{ uniqueRowCount }}</span>
      <span>Duplicate rows: {{ duplicateRowCount }}</span>
    </div>
    <button v-if="duplicateRowCount !== 0" @click="removeDuplicateRows">
      Remove duplicate rows
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"

const text = ref("")

const rows = computed(() => {
  if (text.value === "") return []
  return text.value.split(/\r?\n/)
})
const uniqueRowCount = computed(() => new Set(rows.value).size)
const duplicateRowCount = computed(
  () => rows.value.length - uniqueRowCount.value
)

const removeDuplicateRows = () => {
  text.value = [...new Set(rows.value)].join("\n")
}
</script>

<style scoped>
.string-processor textarea {
  box-sizing: border-box;
  display: block;
  min-height: 240px;
  padding: 8px;
  resize: vertical;
  width: 100%;
}

.row-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 24px;
  margin: 16px 0;
}
</style>
