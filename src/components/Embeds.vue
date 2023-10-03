<template>
  <div v-if="embed.type === 'image'">
    <img
      :src="embed.mediaProxyLink"
      class="embed"
      alt="Embedded image"
      @load="scroll()"
      @click="emits('embed')"
    />
  </div>
</template>

<script setup>
defineProps(["embed", "scroll"])
const emits = defineEmits(["embed"])
</script>

<style scoped>
.embed {
  cursor: pointer;
  border-radius: 2px;
  max-width: min(400px, 100%);
  max-height: 300px;
}
</style>
