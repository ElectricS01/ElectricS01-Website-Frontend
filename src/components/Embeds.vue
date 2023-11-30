<template>
  <div v-if="embed.type === 'image'" class="embed-container">
    <img
      :src="embed.mediaProxyLink"
      class="embed"
      alt="Embedded image"
      @load="scroll()"
      @click="emit('embed')"
    />
  </div>
</template>

<script setup>
defineProps({ embed: Object, scroll: Function })
const emit = defineEmits(["embed"])
</script>

<style scoped>
.embed {
  cursor: pointer;
  border-radius: 2px;
  max-width: min(400px, 100%);
  max-height: 300px;
}

.embed-container {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}
</style>
