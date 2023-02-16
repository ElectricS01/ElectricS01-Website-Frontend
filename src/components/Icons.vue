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
      d="M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z"
    />
  </svg>
</template>

<script>
export default {
  name: "Icons",
  props: ["color", "width", "height"]
}
</script>

<style scoped></style>
