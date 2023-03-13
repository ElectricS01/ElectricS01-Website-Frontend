<template>
  <transition>
    <modal
      v-if="profileShown"
      :is-active="profileShown"
      @close="profileShown = false"
    >
      <img
        :src="showUser.banner || 'https://i.troplo.com/i/d81dabf74c88.png'"
        width="500"
        height="100"
        style="object-fit: cover"
        alt="Profile banner"
      />
      <div class="profile-grid" style="padding: 24px">
        <div class="profile-picture" style="margin-right: 16px">
          <Icons
            v-if="!showUser.avatar"
            class="message-item"
            color="white"
            width="80"
            height="80"
            icon="account"
            style="margin: 0"
          />
          <img
            style="border-radius: 40px; object-fit: cover; margin: 0"
            class="message-item"
            width="80"
            height="80"
            v-else
            :src="showUser.avatar"
            alt="Profile icon"
          />
          <svg class="online-indicator" width="20" height="20">
            <circle cx="8" cy="8" r="8" fill="#47bf4c" />
          </svg>
        </div>
        <div style="flex-grow: 1; margin: 0" class="message-item">
          <h4>{{ showUser.username }}</h4>
          <p class="message-text-large" style="margin: 0">
            {{ showUser.statusMessage }}
          </p>
        </div>
        <div>
          <button
            v-if="showUser.directMessages && showUser.id !== loggedIn.id"
            class="profile-button-message"
            style="width: 100%"
          >
            <Icons
              style="top: 0; padding-right: 4px"
              color="#1e90ff"
              width="16"
              height="16"
              icon="message"
            />
            Send Message
          </button>
          <button
            v-if="
              showUser.friendRequests &&
              showUser.id !== loggedIn.id &&
              !showUser.friendStatus
            "
            class="profile-button-add"
            style="color: #47bf4c; width: 100%"
            @click="addFriend(showUser.id)"
          >
            <Icons
              style="top: 0; padding-right: 4px"
              color="#47bf4c"
              width="16"
              height="16"
              icon="add-user"
            />
            Add Friend
          </button>
          <button
            v-if="
              showUser.id !== loggedIn.id &&
              showUser.friendStatus === 'accepted'
            "
            class="profile-button-remove"
            style="color: #ff2f2f; width: 100%"
            @click="addFriend(showUser.id)"
          >
            <Icons
              style="top: 0; padding-right: 4px"
              color="#FF2F2F"
              width="16"
              height="16"
              icon="remove-user"
            />
            Remove Friend
          </button>
          <button
            v-if="
              showUser.friendRequests && showUser.friendStatus === 'pending'
            "
            class="profile-button-pending"
            style="color: #808080; width: 100%"
            @click="addFriend(showUser.id)"
          >
            <Icons
              style="top: 0; padding-right: 4px"
              color="#808080"
              width="16"
              height="16"
              icon="remove-user"
            />
            Pending
          </button>
          <button
            v-if="
              showUser.id !== loggedIn.id &&
              showUser.friendStatus === 'incoming'
            "
            class="profile-button-pending"
            style="color: #47bf4c; width: 100%"
            @click="addFriend(showUser.id)"
          >
            <Icons
              style="top: 0; padding-right: 4px"
              color="#47bf4c"
              width="16"
              height="16"
              icon="add-user"
            />
            Accept Friend
          </button>
        </div>
      </div>
      <div style="padding: 24px">
        <p>Description</p>
        <p class="message-text-large" style="margin: 0">
          {{ showUser.description || `Hi, I'm ${showUser.username}!` }}
        </p>
      </div>
    </modal>
  </transition>
  <div class="topnav" id="mobile-topnav">
    <router-link to="/test">Better Test</router-link>
    <router-link v-if="loggedIn" class="right" to="/account">
      Account
    </router-link>
    <router-link v-else class="right" to="/login">Login</router-link>
    <router-link class="right" to="/">Home</router-link>
    <a class="icon" @click="responsive_topnav()">☰</a>
  </div>
  <transition>
    <p v-if="error" class="error-button">
      {{ error }}
    </p>
  </transition>
  <div
    style="
      text-align: left;
      padding-left: 8px;
      padding-top: 8px;
      padding-right: 8px;
    "
  >
    <div class="center">
      <div
        style="text-align: center"
        v-if="loadingMessages"
        class="loader"
      ></div>
    </div>
    <div
      :style="{ backgroundColor: editing === message.id ? '#282A2B' : '' }"
      v-for="(message, index) in messages"
      :key="message.id"
      :id="'message-' + index"
      class="message-grid"
      style="padding: 4px; position: relative"
      @mouseover="message.focus = true"
      @mouseleave="message.focus = false"
    >
      <Icons
        style="margin-right: 8px; cursor: grab"
        v-if="!message.user.avatar"
        @click="openUser(message.user?.id)"
        class="message-item"
        color="white"
        width="32"
        height="32"
        icon="account"
      />
      <img
        style="
          border-radius: 16px;
          object-fit: cover;
          margin-right: 8px;
          cursor: grab;
        "
        class="message-item"
        @click="openUser(message.user?.id)"
        width="32"
        height="32"
        v-else
        :src="message.user.avatar"
        alt="Profile icon"
      />
      <div
        class="message-item"
        style="
          max-width: calc(100% - 25px);
          overflow-wrap: break-word;
          padding-right: 16px;
        "
        :style="{ width: editing === message.id ? '100%' : '' }"
      >
        <div style="line-height: 11.5px">
          <b
            class="message-text-medium"
            style="font-size: 12px"
            @click="openUser(message.user?.id)"
          >
            {{ message.user?.username }}
          </b>
          <b class="message-text-small">
            {{ " " + dayjs(message.createdAt) }}
          </b>
        </div>
        <div v-if="editing !== message.id">
          <b class="message-text-large">
            {{ message.messageContents }}
          </b>
          <Embeds
            v-for="(embed, index) in message.embeds"
            :key="index"
            :embed="embed"
          ></Embeds>
        </div>
        <div v-if="editing === message.id">
          <input
            placeholder="Edit your message"
            autofocus
            @keydown.enter="editMessage(message.id)"
            class="responder"
            v-model="editText"
            type="text"
            style="width: 100%"
          />
        </div>
      </div>
      <div
        v-if="editing !== message.id"
        style="
          position: absolute;
          right: 0;
          top: 0;
          display: flex;
          align-items: center;
          height: 100%;
        "
        v-show="
          message.focus && (loggedIn.admin || message.user.id === loggedIn.id)
        "
      >
        <Icons
          style="cursor: pointer"
          class="message-item"
          color="white"
          width="20"
          height="20"
          icon="edit"
          @click=";(editing = message.id), (editText = message.messageContents)"
        />
        <Icons
          style="cursor: pointer"
          class="message-item"
          color="white"
          width="20"
          height="20"
          icon="delete"
          @click="deleteMessage(message.id)"
        />
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
      <button @click="submit" style="cursor: grab">Send</button>
      <br />
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs"
import Embeds from "@/components/Embeds.vue"
import Icons from "@/components/Icons.vue"
import Modal from "@/components/Modal.vue"
;``
export default {
  components: { Icons, Embeds, Modal },
  data() {
    return {
      messages: [],
      inputText: "",
      editText: "",
      editing: false,
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
          this.messages.focus = false
          this.loadingMessages = false
          this.scroll()
        })
        .catch(() => {
          this.error = "Error 503 Cannot Connect to Server"
        })
    },
    submit() {
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
      return dayjs(date).format("DD/MM/YYYY HH:mm:ss")
    },
    user() {
      this.axios
        .get("/api/user")
        .then((res) => {
          this.loggedIn = res.data
        })
        .catch((e) => {
          this.error = "Error 503 Cannot Connect to Server"
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
    deleteMessage(messageId) {
      this.axios.delete(`/api/delete/${messageId}`).then(() => {
        this.getMessages()
      })
    },
    editMessage(messageId) {
      this.axios.patch(`/api/edit/${messageId}`).then(() => {
        this.getMessages()
        this.editing = false
      })
    },
    addFriend(userId) {
      this.axios
        .post(`/api/friend/${userId}`)
        .then(() => {
          this.openUser(userId)
        })
        .catch((e) => {
          this.error = e.response.data.message
          setTimeout(this.errorFalse, 5000)
        })
    },
    escPressed(event) {
      if (event.key === "Escape" && this.profileShown) {
        this.profileShown = false
      } else if (event.key === "Escape" && this.editing) {
        this.editing = false
      } else if (event.key === "Escape" && !this.profileShown) {
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
    },
    responsive_topnav() {
      const responsive_topnav = document.getElementById("mobile-topnav")
      if (responsive_topnav.className === "topnav") {
        responsive_topnav.className += " responsive"
      } else {
        responsive_topnav.className = "topnav"
      }
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
