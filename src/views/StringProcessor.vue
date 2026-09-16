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
      <span>Sorted: {{ sortStatus }}</span>
    </div>
    <div class="row-actions">
      <button :disabled="rows.length < 2" @click="sortRows('ascending')">
        Sort ascending
      </button>
      <button :disabled="rows.length < 2" @click="sortRows('descending')">
        Sort descending
      </button>
      <button v-if="duplicateRowCount !== 0" @click="removeDuplicateRows">
        Remove duplicate rows
      </button>
    </div>
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

const compareRows = (a: string, b: string) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })

const sortStatus = computed(() => {
  if (rows.value.length < 2) return "N/A"

  const ascending = rows.value.every(
    (row, index) => index === 0 || compareRows(rows.value[index - 1], row) <= 0
  )
  if (ascending) return "Ascending"

  const descending = rows.value.every(
    (row, index) => index === 0 || compareRows(rows.value[index - 1], row) >= 0
  )
  return descending ? "Descending" : "No"
})

const sortRows = (direction: "ascending" | "descending") => {
  const sortedRows = [...rows.value].sort(compareRows)

  if (direction === "descending") {
    sortedRows.reverse()
  }

  text.value = sortedRows.join("\n")
}

const removeDuplicateRows = () => {
  text.value = [...new Set(rows.value)].join("\n")
}
</script>

<style scoped>
.string-processor textarea {
  box-sizing: border-box;
  display: block;
  min-height: 240px;
  height: 45vh;
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

.row-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
