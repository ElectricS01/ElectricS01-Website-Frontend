<template>
  <img
    v-if="avatar"
    :style="{
      marginTop: small === true ? '2px' : ''
    }"
    class="image"
    :width="size"
    :height="size"
    :src="avatar"
    alt="Profile icon"
  />
  <icons v-else style="cursor: pointer" :size="size" icon="user" />
</template>

<script setup lang="ts">
import Icons from "@/components/core/Icons.vue"

defineProps<{
  avatar?: string
  size: string
  small?: boolean
}>()
</script>

<style scoped>
.image {
  border-radius: 40px;
  object-fit: cover;
  cursor: pointer;
}
</style>
