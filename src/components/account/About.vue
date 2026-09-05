<template>
  <h2 class="settings-text">About BetterCommunications</h2>
  <div>
    BetterCommunications is free and open-source chatting platform available to
    all
  </div>
  <div class="settings-spacer" />
  <div>
    Made by
    <router-link to="/">ElectricS01</router-link>
  </div>
  <div class="settings-spacer" />
  <div>Version: 1.250.0</div>
  <div class="settings-spacer" />
  <div>Backend name: {{ serverName }}</div>
  <div class="settings-spacer" />
  <div>Build date: {{ dayjsLong(buildDate) }}</div>
</template>

<script setup lang="ts">
import { dayjsLong } from "@/helpers/dates"

const serverName = import.meta.env.VITE_SERVER_NAME || "Unknown"
const buildDate = __VITE_BUILD_DATE__ || "Unknown"
</script>
