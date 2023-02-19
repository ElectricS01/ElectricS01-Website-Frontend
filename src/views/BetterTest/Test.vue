<template>
  <modal
    v-if="showUser"
    :is-active="profileShown"
    @close="profileShown = false"
  >
    <div class="message-grid">
      <Icons
        v-if="!showUser.avatar"
        class="message-item"
        color="white"
        width="64"
        height="64"
        icon="account"
        style="margin-right: 8px"
      />
      <img
        style="border-radius: 32px; object-fit: cover; margin-right: 8px"
        class="message-item"
        width="64"
        height="64"
        v-else
        :src="showUser.avatar"
      />
      <div class="message-item">
        <h4>{{ showUser.username }}</h4>
        <p>{{ showUser.description || `Hi, I'm ${showUser.username}!` }}</p>
      </div>
    </div>
  </modal>
  <div class="topnav" id="mobile-topnav">
    <router-link to="/test">Better Test</router-link>
    <router-link v-if="loggedIn" class="right" to="/account">
      Account
    </router-link>
    <router-link v-else class="right" to="/login">Login</router-link>
    <router-link class="right" to="/">Home</router-link>
  </div>
  <transition>
    <p v-if="error" class="error-button">
      {{ error }}
    </p>
  </transition>
  <div style="text-align: left; padding-left: 16px; padding-top: 16px">
    <div class="center">
      <div
        style="text-align: center"
        v-if="loadingMessages"
        class="loader"
      ></div>
    </div>
    <div
      v-for="(message, index) in messages"
      :key="message.id"
      :id="'message-' + index"
      class="message-grid"
    >
      <Icons
        v-if="!message.user.avatar"
        @click="openUser(message.user?.id)"
        class="message-item"
        color="white"
        width="32"
        height="32"
        icon="account"
        style="margin-right: 8px"
      />
      <img
        style="border-radius: 16px; object-fit: cover; margin-right: 8px"
        class="message-item"
        @click="openUser(message.user?.id)"
        width="32"
        height="32"
        v-else
        :src="message.user.avatar"
      />
      <div class="message-item">
        <b class="message-text-large">
          {{ message.messageContents }}
        </b>
        <Embed
          v-for="(embed, index) in message.embeds"
          :key="index"
          :embed="embed"
        ></Embed>
        <b class="message-text-small">
          {{ message.user?.username }} {{ dayjs(message.createdAt) }}
        </b>
      </div>
    </div>
  </div>
  <div>
    <transition>
      <button v-if="scrolledUp" class="scroll-button" @click="scroll">
        <Icons color="white" width="12" height="12" icon="down-arrow" />
        Scroll to bottom
      </button>
    </transition>
    <div class="message-send" style="text-align: center">
      <input
        placeholder="Send a message"
        autofocus
        @keydown.enter="submit"
        class="responder"
        v-model="inputText"
        type="text"
      />
      <button @click="submit">Send</button>
      <br />
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs"
import Embed from "@/components/Embed.vue"
import Icons from "@/components/Icons.vue"
import Modal from "@/components/Modal.vue"
;``
export default {
  components: { Icons, Embed, Modal },
  data() {
    return {
      messages: [],
      inputText: "",
      error: "",
      loggedIn: false,
      profileShown: false,
      loadingMessages: true,
      scrolledUp: false,
      showUser: false
    }
  },
  methods: {
    async getMessages() {
      await this.axios
        .get("/api/messages")
        .then((res) => {
          this.messages = res.data
          this.loadingMessages = false
          this.scroll()
        })
        .catch(() => {
          this.error = "Error 503 Cannot Connect to Server"
        })
    },
    submit() {
      this.error = ""
      this.axios
        .post("/api/message", {
          messageContents: this.inputText
        })
        .then(() => {
          this.getMessages()
          this.inputText = ""
        })
        .catch((e) => {
          this.error = e.response.data.message
          setTimeout(this.errorFalse, 5000)
        })
    },
    errorFalse() {
      this.error = false
    },
    dayjs(date) {
      return dayjs(date).format("HH:mm:ss DD/MM/YYYY")
    },
    user() {
      this.axios.get("/api/user").then((res) => {
        this.loggedIn = res.data
      })
    },
    scroll(override) {
      this.$nextTick(() => {
        try {
          if (!this.scrolledUp || override) {
            const lastIndex = this.messages.length - 1
            const lastMessage = document.querySelector(`#message-${lastIndex}`)
            if (lastMessage) {
              lastMessage.scrollIntoView()
              this.scrolledUp = false
            }
          }
        } catch (e) {
          console.log(e)
        }
      })
    },
    openUser(userId) {
      this.axios.get("/api/user/" + userId).then((res) => {
        this.showUser = res.data
        this.profileShown = true
      })
    },
    escPressed(event) {
      if (event.key === "Escape") {
        this.scroll(true)
      }
    },
    scrollEvent() {
      const scrollHeight = document.documentElement.scrollHeight
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop
      const clientHeight = document.documentElement.clientHeight

      this.scrolledUp =
        scrollTop + clientHeight <= scrollHeight - clientHeight / 10
    }
  },
  async mounted() {
    const favicon = document.getElementById("favicon")
    favicon.href = "/icons/mainicon.ico"

    document.addEventListener("keydown", this.escPressed)
    document.addEventListener("scroll", this.scrollEvent)

    this.user()
    await this.getMessages()
    this.scroll(true)
  },
  beforeRouteLeave(to, from, next) {
    document.removeEventListener("keydown", this.escPressed)
    document.removeEventListener("scroll", this.scrollEvent)
    next()
  },
  unmounted() {
    document.removeEventListener("keydown", this.escPressed)
    document.removeEventListener("scroll", this.scrollEvent)
  }
}
</script>
