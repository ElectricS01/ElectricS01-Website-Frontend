<template>
  <div class="container">
    <transition>
      <p v-if="error" class="error-banner">
        {{ error }}
      </p>
    </transition>
    <div class="grid-menu">
      <div class="settings-menu">
        <div style="display: flex">
          <div style="width: 200px; border-right: 1px solid #212425">
            <div
              @click="page = 'account'"
              class="settings-item"
              style="border-top-left-radius: 25px"
            >
              Account
            </div>
            <div @click="page = 'privacy'" class="settings-item">Privacy</div>
            <div @click="page = 'appearance'" class="settings-item">
              Appearance
            </div>
          </div>
          <div v-if="page === 'account'" class="settings-page">
            <p class="settings-text">Account</p>
            Coming soon™
          </div>
          <div v-else-if="page === 'privacy'" class="settings-page">
            <p class="settings-text">Privacy</p>
            Coming soon™
          </div>
          <div v-else-if="page === 'appearance'" class="settings-page">
            <p class="settings-text">Appearance</p>
            Coming soon™
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: "account",
      error: ""
    }
  },
  mounted() {
    const favicon = document.getElementById("favicon")
    favicon.href = "/icons/favicon.ico"
  }
}
</script>
