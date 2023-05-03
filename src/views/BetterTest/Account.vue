<template>
  <div class="container" style="height: calc(100% - 96px)">
    <div class="chat-navbar">
      <router-link to="/test">Better Test</router-link>
      <router-link v-if="loggedIn" class="right" to="/account">
        Account
      </router-link>
      <router-link v-else class="right" to="/login">Login</router-link>
      <router-link class="right" to="/">Home</router-link>
    </div>
    <transition>
      <p v-if="error" class="error-banner">
        {{ error }}
      </p>
    </transition>
    <div style="text-align: left; padding: 16px">
      <div v-for="message in messages" :key="message.id">
        <b class="message-text-large">
          {{ message.messageContents }}
        </b>

        <b class="message-text-small">
          {{ message.userName }} {{ dayjs(message.createdAt) }}
        </b>
      </div>
    </div>
    <div
      class="message-send"
      style="text-align: center; position: fixed; bottom: 0; right: 0; left: 0"
    >
      <div>
        <input
          @keydown.enter="submit"
          id="nameField"
          class="responder"
          v-model="inputUser"
          type="text"
        />

        <input
          @keydown.enter="submit"
          id="nameField"
          class="responder"
          v-model="inputText"
          type="text"
        />

        <button @click="submit">Submit</button>

        <div class="error-message">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs"
export default {
  data() {
    return {
      messages: [],
      inputUser: "",
      inputText: "",
      error: "",
      loggedIn: false
    }
  },
  methods: {
    getMessages() {
      this.axios
        .get("/api/messages")
        .then((res) => {
          this.messages = res.data
        })
        .catch(() => {
          this.error = "Error 503 Cannot Connect to Server"
        })
    },
    submit() {
      this.error = ""
      this.axios
        .post("/api/message", {
          userName: this.inputUser,
          messageContents: this.inputText
        })
        .then(() => {
          this.getMessages()
          this.inputUser = ""
          this.inputText = ""
        })
        .catch((e) => {
          this.error = e.response.data.message
        })
    },
    dayjs(date) {
      return dayjs(date).format("HH:mm:ss DD/MM/YYYY")
    },
    getUser() {
      this.axios
        .get("/api/user")
        .then((res) => {
          this.loggedIn = res.data
        })
        .catch((e) => {
          this.error = "Error 503 Cannot Connect to Server " + e
        })
    }
  },
  mounted() {
    const favicon = document.getElementById("favicon")
    favicon.href = "/icons/favicon.ico"

    this.getUser()
    this.getMessages()
  }
}
</script>
