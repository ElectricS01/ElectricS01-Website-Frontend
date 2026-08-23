<template>
  <h2 class="settings-text">Privacy</h2>
  Change your privacy settings
  <div class="settings-spacer" />
  Allow direct messages from
  <div>
    <div class="dropdown">
      <div class="dropdown-toggle" @click="dmOpen = !dmOpen">
        {{ store.userData.directMessages }}
      </div>
      <ul v-if="dmOpen" class="dropdown-menu">
        <li v-for="option in dmOptions" :key="option" @click="selectDm(option)">
          {{ option }}
        </li>
      </ul>
    </div>
  </div>
  <div class="settings-spacer" />
  Allow friend requests from new people
  <toggle
    :value="store.userData.friendRequests"
    @switch="toggleProp('friendRequests')"
  />
  <div class="settings-spacer" />
  Show the date of your accounts creation on your profile
  <toggle
    :value="store.userData.showCreated"
    @switch="toggleProp('showCreated')"
  />
  <div class="settings-spacer" />
  Save Quick Switcher history online
  <toggle
    :value="store.userData.saveSwitcher"
    @switch="toggleProp('saveSwitcher')"
  />
  <div class="settings-spacer" />
  Clear your Quick Switcher history
  <div class="settings-button" @click="clearHistory()">Clear history</div>
</template>

<script setup lang="ts">
import { useDataStore } from "@/store"
import axios from "axios"
import { ref } from "vue"
import { Dms } from "@/types/user"
import { changeProperty, toggleProp } from "@/helpers/settings"
import Toggle from "../core/Toggle.vue"

const store = useDataStore()

const dmOptions = Object.values(Dms)

const dmOpen = ref(false)

const clearHistory = () => {
  localStorage.removeItem("switcherHistory")
  axios.delete("/api/clear-history").catch((e) => {
    store.handleAxiosError(e)
  })
}
const selectDm = async (option: Dms) => {
  await changeProperty("directMessages", option)
  dmOpen.value = false
}
</script>
