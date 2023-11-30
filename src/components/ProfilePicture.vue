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
  <Icons v-else style="cursor: pointer" :size="size" icon="account" />
</template>

<script setup>
import Icons from "@/components/core/Icons.vue"

defineProps({ avatar: String, size: String, small: Boolean })
</script>

<style scoped>
.image {
  border-radius: 40px;
  object-fit: cover;
  cursor: pointer;
}
</style>
