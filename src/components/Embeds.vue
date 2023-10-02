<template>
  <div v-if="embed.type === 'image'">
    <img
      :src="embed.mediaProxyLink"
      class="embed"
      alt="Embedded image"
      @load="scroll()"
    />
  </div>
</template>

<script setup>
defineProps(["embed", "scroll"])
</script>

<style scoped>
.embed {
  border-radius: 2px;
}
</style>
