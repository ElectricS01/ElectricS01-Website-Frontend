<template>
  <svg
    :fill="color"
    :width="width"
    :height="height"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    style="position: relative; top: 0.15em"
  >
    <path
      v-if="icon === 'down-arrow'"
      d="M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z"
    />
    <path
      v-if="icon === 'account'"
      d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"
    />
  </svg>
</template>

<script>
export default {
  name: "Icons",
  props: ["color", "width", "height", "icon"]
}
</script>

<style scoped></style>
