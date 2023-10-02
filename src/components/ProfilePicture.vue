<template>
  <img
    :style="{
      marginTop: small === true ? '2px' : ''
    }"
    class="image"
    :width="size"
    :height="size"
    v-if="avatar"
    :src="avatar"
    alt="Profile icon"
  />
  <Icons style="cursor: pointer" v-else :size="size" icon="account" />
</template>

<script setup>
import Icons from "@/components/Icons.vue"

defineProps(["avatar", "size", "small"])
</script>

<style scoped>
.image {
  border-radius: 40px;
  object-fit: cover;
  cursor: pointer;
}
</style>
