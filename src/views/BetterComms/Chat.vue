<template>
  <user-preview
    :show-user="showUser"
    :editing="editing"
    :add-friend="addFriend"
    @show-user="showUser = false"
    @editing="editing = $event"
    @status-message="
      ((showUser.statusMessage = $event),
      (currentChat.users.find(
        (user) => user.id === store.userData.id
      ).statusMessage = $event))
    "
    @dm-created="onDmCreated($event)"
  />
  <transition>
    <modal-simple
      v-if="embed && !store.quickSwitcherShown"
      :is-active="embed && !store.quickSwitcherShown"
      @close="embed = false"
    >
      <img :src="embed" class="message-embed" alt="Embedded image" />
    </modal-simple>
  </transition>
  <create-chat
    ref="createChatRef"
    :create-chat-shown="createChatShown"
    @hide-create-chat="createChatShown = false"
    @chat-created="handleChatCreated($event)"
    @dm-created="onDmCreated($event)"
  />
  <edit-chat
    ref="editChatRef"
    :editing-chat="chatEdit"
    @hide-editing-chat="chatEdit = null"
    @chat-edited="handleChatEdited"
  />
  <div class="chat-container">
    <chats-list
      v-if="store.chatBarOpen === 'true'"
      :chats="store.userData.chatsList"
      :loading="store.loadingChats"
      :current-id="store.showFriends ? undefined : currentChat.id"
      :user-id="store.userData.id"
      @open-chat="getChat($event)"
      @open-create-chat="openCreateChat"
      @show-edit-chat="showEditChat($event)"
      @show-friends="store.showFriends = true"
    />
    <friends
      v-if="store.showFriends"
      :add-friend="addFriend"
      @dm-created="onDmCreated($event)"
    />
    <div v-else style="flex-grow: 1; display: flex; width: calc(100% - 700px)">
      <div
        style="
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          height: 100%;
          width: calc(100% - 700px);
        "
      >
        <div
          id="messages-div"
          style="overflow-y: auto; flex-grow: 1; padding: 8px 4px 8px 4px"
          class="scroll-bar"
        >
          <div v-if="loadingMessages" class="center">
            <div class="loader" />
          </div>
          <div v-else>
            <div style="padding: 12px 16px">
              <h1 v-if="currentChat.type !== 1" class="chat-title">
                Welcome to {{ currentChat.name }}
              </h1>
              <h1
                v-else-if="currentChat.owner !== store.userData.id"
                class="chat-title"
              >
                Welcome to your Direct Message with
                {{ currentChat?.ownerDetails.username }}
              </h1>
              <h1 v-else class="chat-title">
                Welcome to your Direct Message with {{ currentChat.name }}
              </h1>
              <b style="display: block; overflow-wrap: break-word">
                {{ currentChat.description }}
              </b>
              <b
                v-if="
                  !currentChat.requireVerification && currentChat.type !== 1
                "
                class="message-text-medium-gray"
              >
                This chat does not require email verification
              </b>
              <b
                v-else-if="currentChat.type !== 1"
                class="message-text-medium-gray"
              >
                This chat requires email verification
              </b>
            </div>
            <div
              v-for="(message, index) in currentChat.messages"
              :id="'message-' + index"
              :key="message.id"
            >
              <div
                v-if="currentChat.lastRead === index"
                style="
                  padding: 0 4px;
                  height: 12px;
                  display: flex;
                  align-items: center;
                "
              >
                <div style="border-bottom: 1px solid #ff2f2f; width: 50%" />
                <p
                  style="padding: 0 4px; white-space: nowrap; color: #ff2f2f"
                  class="message-text-small"
                >
                  New messages
                </p>
                <div style="border-bottom: 1px solid #ff2f2f; width: 50%" />
              </div>
              <chat-spacer
                :message="message"
                :previous-message="currentChat.messages[index - 1]"
              />
              <div
                v-if="message.reply && findMessage(message.reply)"
                class="reply-preview"
              >
                <icons size="16" icon="reply" style="margin-right: 4px" />
                <profile-picture
                  size="16"
                  :avatar="findMessage(message.reply)?.user?.avatar"
                  :small="true"
                  @click="openUser(findMessage(message.reply)?.user?.id)"
                />
                <b
                  class="message-text-medium"
                  style="margin: 4px 4px 0 4px"
                  @click="openUser(findMessage(message.reply)?.user?.id)"
                >
                  {{
                    findMessage(message.reply)?.user?.username
                      ? "@" + findMessage(message.reply)?.user?.username
                      : "@Deleted user"
                  }}
                </b>
                <p
                  class="message-text-medium-gray-hover"
                  style="margin-top: 4px; margin-bottom: 0"
                  @click="goToMessage(message.reply)"
                >
                  {{ findMessage(message.reply)?.messageContents }}
                </p>
              </div>
              <div v-else-if="message.reply" class="reply-preview">
                <icons
                  colour="darkgrey"
                  size="16"
                  icon="reply"
                  style="margin-right: 4px"
                />
                <icons colour="darkgrey" size="16" icon="user" />
                <b
                  class="message-text-medium-gray"
                  style="margin: 4px 4px 0 4px"
                >
                  Message has been deleted
                </b>
              </div>
              <div
                class="message-grid"
                style="position: relative; width: 100%; margin: 8px 4px 4px"
                :style="{
                  backgroundColor: editing === message.id ? '#212425' : ''
                }"
              >
                <div
                  v-if="!merge(message, currentChat.messages[index - 1])"
                  style="margin: 0 4px; cursor: pointer; border-radius: 16px"
                  class="message-item"
                  @click="openUser(message.user.id)"
                >
                  <profile-picture
                    style="margin: 4px"
                    size="32"
                    :avatar="message.user?.avatar"
                  />
                </div>
                <div v-else class="message-time">
                  <b class="message-text-small">
                    {{ dayjsShort(message.createdAt) }}
                  </b>
                </div>
                <div
                  class="message-item"
                  style="width: calc(100% - 96px); overflow-wrap: break-word"
                >
                  <div
                    v-if="!merge(message, currentChat.messages[index - 1])"
                    class="message-header"
                  >
                    <b
                      class="message-text-medium"
                      @click="openUser(message.user.id)"
                    >
                      {{
                        message.user?.username
                          ? message.user.username
                          : "Deleted user"
                      }}
                    </b>
                    <b class="message-text-small">
                      {{ " " + dayjsLong(message.createdAt) }}
                    </b>
                  </div>
                  <textarea
                    v-if="editing === message.id"
                    id="edit"
                    v-model="editText"
                    style="resize: none"
                    placeholder="Edit your message"
                    autocomplete="off"
                    @keydown.enter.exact.prevent="editMessage(message.id)"
                  />
                  <custom-message
                    v-show="editing !== message.id"
                    :message="message"
                    :find-user="findUser"
                    :open-user="openUser"
                    :scroll="scrollDown"
                    @embed="embed = $event"
                  />
                  <message-emoji
                    :reactions="message.reactions"
                    :user-id="store.userData.id"
                    @reaction-selected="addReaction(message.id, $event)"
                    @reaction-removed="removeReaction(message.id, $event)"
                  />
                </div>
                <div
                  v-show="editing !== message.id"
                  class="message-icons"
                  :style="{
                    display: reactingTo === message.id ? 'flex' : ''
                  }"
                >
                  <icons
                    style="cursor: pointer"
                    size="20"
                    icon="emoji"
                    @click="reactPressed(message.id)"
                  />
                  <emoji-picker
                    v-if="reactingTo === message.id"
                    @emoji-selected="addReaction(message.id, $event)"
                  />
                  <icons
                    v-show="
                      store.userData?.admin ||
                      message.user?.id === store.userData?.id
                    "
                    style="cursor: pointer"
                    size="20"
                    :icon="message.pinned ? 'unpin' : 'pin'"
                    @click="pinMessage(message.id, message.pinned)"
                  />
                  <icons
                    v-if="message.user?.id === store.userData?.id"
                    style="cursor: pointer"
                    size="20"
                    icon="edit"
                    @click="
                      ;((editing = message.id),
                        (editText = message.messageContents),
                        scrollDown(true))
                    "
                  />
                  <icons
                    style="cursor: pointer"
                    size="20"
                    icon="reply"
                    @click="replyToMessage(message.id)"
                  />
                  <icons
                    v-show="
                      store.userData?.admin ||
                      message.user?.id === store.userData?.id
                    "
                    style="cursor: pointer"
                    size="20"
                    icon="delete"
                    @click="deleteMessage(message.id)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <transition>
            <div
              v-if="replyTo || scrolledUp"
              style="position: relative; margin-right: 6px"
            >
              <transition>
                <div
                  v-if="scrolledUp"
                  :style="{
                    height: replyTo ? '36px' : ''
                  }"
                  style="
                    position: absolute;
                    z-index: 1;
                    bottom: 0;
                    cursor: pointer;
                  "
                  class="scroll-button"
                  @click="scrollDown"
                >
                  <icons size="12" icon="down-arrow" />
                  <p class="message-text-medium">Scroll to bottom</p>
                </div>
              </transition>
              <div
                v-if="replyTo"
                class="scroll-button"
                style="
                  display: flex;
                  overflow-wrap: break-word;
                  z-index: 2;
                  position: relative;
                "
              >
                <icons size="12" icon="reply" style="margin-right: 4px" />
                <profile-picture
                  size="12"
                  :avatar="findMessage(replyTo).user?.avatar"
                  :small="true"
                  @click="openUser(findMessage(replyTo).user.id)"
                />
                <b
                  class="message-text-medium"
                  style="margin: 0 4px 0 4px"
                  @click="openUser(findMessage(replyTo).user.id)"
                >
                  {{
                    findMessage(replyTo).user?.username
                      ? "@" + findMessage(replyTo).user?.username
                      : "@Deleted user"
                  }}
                </b>
                <p
                  class="message-text-medium-gray"
                  style="margin: 0"
                  @click="goToMessage(replyTo)"
                >
                  {{ findMessage(replyTo).messageContents }}
                </p>
              </div>
            </div>
          </transition>
          <div class="message-send">
            <div
              v-if="matchingEmoji.length && !emojiPickerVisible"
              class="emoji-picker"
            >
              <div class="emoji-picker-inner scroll-bar">
                <div
                  v-for="(emoji, index) in matchingEmoji"
                  :id="'picker-emoji-' + index"
                  :key="emoji[0]"
                  :class="{ selected: index == emojiPickerIndex }"
                  @click="handleEmojiClick(emoji[0])"
                >
                  {{ emoji[0] }}
                  {{ emoji[1][0] }}
                </div>
              </div>
            </div>
            <textarea
              id="input"
              v-model="inputText"
              :disabled="inputDisabled"
              :placeholder="
                inputDisabled
                  ? 'This chat requires email address verification'
                  : 'Send a message'
              "
              autofocus
              class="message-input"
              autocomplete="off"
              @keydown.enter.exact.prevent="
                matchingEmoji.length > 0 ? selectCurrentEmoji() : sendMessage()
              "
              @keydown.up.prevent="handleUpKey"
              @keydown.down.prevent="handleDownKey"
              @keydown.tab.prevent="
                matchingEmoji.length > 0 ? selectCurrentEmoji() : null
              "
              @keydown.escape.prevent="override = true"
            />
            <button
              :disabled="inputDisabled"
              style="cursor: pointer; width: 40px"
              @click="showEmojiPicker"
            >
              <icons
                icon="emoji"
                size="24"
                :colour="inputDisabled ? 'grey' : undefined"
              />
            </button>
            <button
              :disabled="inputDisabled"
              style="cursor: pointer; width: 40px"
              @click="sendMessage"
            >
              <icons
                icon="send"
                size="24"
                :colour="inputDisabled ? 'grey' : undefined"
              />
            </button>
            <emoji-picker
              v-if="emojiPickerVisible"
              @emoji-selected="handleEmojiSelected"
            />
          </div>
        </div>
      </div>
    </div>
    <sidebar
      v-if="
        ((store.sidebarOpen === 'true' || store.search || store.pins) &&
          !store.showFriends) ||
        store.notifications
      "
      :style="{
        width: store.search || store.pins || store.notifications ? '342px' : ''
      }"
    >
      <div
        v-if="
          !loadingMessages &&
          !store.search &&
          !store.pins &&
          !store.notifications
        "
      >
        <div class="filter-button" @click="userSortPress()">
          <p v-if="store.sortUsers === 'id'">Sort: Id</p>
          <p v-else-if="store.sortUsers === 'username'">Sort: Username</p>
          <p v-else-if="store.sortUsers === 'status'">Sort: Status</p>
          <p v-else-if="store.sortUsers === 'statusMessage'">
            Sort: Status Message
          </p>
        </div>
        <div
          v-if="currentChat.users?.some((user) => user?.status !== 'offline')"
          class="sidebar-spacer"
        >
          <p class="message-text-small">Online</p>
          <div />
        </div>
        <user-row
          v-for="user in onlineUsers"
          :key="user.id"
          :user="user"
          @contextmenu.prevent="showContextMenu($event, user)"
          @click="openUser(user.id)"
        />
        <div
          v-if="currentChat.users?.some((user) => user?.status === 'offline')"
          class="sidebar-spacer"
        >
          <p class="message-text-small">Offline</p>
          <div />
        </div>
        <user-row
          v-for="user in offlineUsers"
          :key="user.id"
          :user="user"
          @contextmenu.prevent="showContextMenu($event, user)"
          @click="openUser(user.id)"
        />
        <context-menu
          v-if="contextMenuVisible"
          :position="contextMenuPosition"
          @close="contextMenuVisible = false"
        >
          <div
            class="context-menu-item"
            @click="openUser(contextMenuItemUser.id)"
          >
            Profile
          </div>
          <div
            v-if="contextMenuItemUser.id !== store.userData.id"
            class="context-menu-item"
            @click="contextMenuSendDm(contextMenuItemUser.id)"
          >
            Message {{ contextMenuItemUser.username }}
          </div>
          <div
            v-if="
              contextMenuItemUser.id !== store.userData.id &&
              contextMenuItemUser.friendRequests &&
              !contextMenuItemUser.friend?.status
            "
            class="context-menu-item"
            @click="addFriend(contextMenuItemUser.id, true)"
          >
            Friend {{ contextMenuItemUser.username }}
          </div>
          <div
            v-else-if="
              contextMenuItemUser.id !== store.userData.id &&
              contextMenuItemUser.friend?.status === 'accepted'
            "
            class="context-menu-item"
            @click="addFriend(contextMenuItemUser.id, true)"
          >
            Unfriend {{ contextMenuItemUser.username }}
          </div>
          <div
            v-else-if="
              contextMenuItemUser.id !== store.userData.id &&
              contextMenuItemUser.friend?.status === 'pending'
            "
            class="context-menu-item"
            @click="addFriend(contextMenuItemUser.id, true)"
          >
            Cancel {{ contextMenuItemUser.username }}
          </div>
          <div
            v-else-if="
              contextMenuItemUser.id !== store.userData.id &&
              contextMenuItemUser.friend?.status === 'incoming'
            "
            class="context-menu-item"
            @click="addFriend(contextMenuItemUser.id, true)"
          >
            Accept {{ contextMenuItemUser.username }}
          </div>
          <div
            v-if="
              currentChat.owner === store.userData.id &&
              contextMenuItemUser.id !== store.userData.id &&
              currentChat.type === 0
            "
            class="context-menu-item"
            @click="removeUser(contextMenuItemUser.id)"
          >
            Remove {{ contextMenuItemUser.username }}
          </div>
          <div
            class="context-menu-item"
            @click="copyText(contextMenuItemUser.id)"
          >
            Copy User ID
          </div>
        </context-menu>
      </div>
      <search-sidebar
        v-else-if="store.search"
        :chat-messages="currentChat.messages"
        :find-message="findMessage"
        :find-user="findUser"
        :go-to-message="goToMessage"
        :open-user="openUser"
        :scroll="scrollDown"
      />
      <pins-sidebar
        v-else-if="store.pins"
        :pins="currentChat.pins"
        :find-message="findMessage"
        :find-user="findUser"
        :go-to-message="goToMessage"
        :open-user="openUser"
        :scroll="scrollDown"
      />
      <notifications-sidebar
        v-else-if="store.notifications"
        :notifications="store.userData.notifications"
        :open-user="openUser"
        :open-chat="getChat"
      />
      <div v-else class="center">
        <div style="text-align: center" class="loader" />
      </div>
    </sidebar>
  </div>
</template>

<script setup>
import CustomMessage from "@/components/CustomMessage.vue"
import Icons from "@/components/core/Icons.vue"
import ProfilePicture from "@/components/ProfilePicture.vue"
import Sidebar from "@/components/core/Sidebar.vue"
import ContextMenu from "@/components/core/ContextMenu.vue"
import UserPreview from "@/components/modals/UserPreview.vue"
import CreateChat from "@/components/modals/CreateChat.vue"
import EditChat from "@/components/modals/EditChat.vue"
import ModalSimple from "@/components/core/ModalSimple.vue"
import Friends from "@/components/Friends.vue"
import PinsSidebar from "@/components/sidebars/PinsSidebar.vue"
import ChatSpacer from "@/components/ChatSpacer.vue"
import SearchSidebar from "@/components/sidebars/SearchSidebar.vue"
import NotificationsSidebar from "@/components/sidebars/NotificationsSidebar.vue"
import UserRow from "@/components/UserRow.vue"
import EmojiPicker from "@/components/EmojiPicker.vue"
import MessageEmoji from "@/components/MessageEmoji.vue"
import ChatsList from "@/components/sidebars/ChatsList.vue"

import { useDataStore } from "@/store"
import axios from "axios"
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { sendDm } from "@/helpers/chatUsers"
import { dayjsLong, dayjsShort } from "@/helpers/dates"
import { merge } from "@/helpers/messages"
import { normalizedEmojis } from "@/helpers/emoji"

const store = useDataStore()
const route = useRoute()
const router = useRouter()

const embed = ref()
const currentChat = ref({})
const replyTo = ref()
const editing = ref("")
const createChatRef = ref(null)
const editChatRef = ref(null)
const createChatShown = ref(false)
const loadingMessages = ref(true)
const scrolledUp = ref(false)
const showUser = ref(false)
const chatEdit = ref(null)
const reactingTo = ref(-1)
const emojiPickerIndex = ref(0)
const emojiPickerVisible = ref(false)
const contextMenuVisible = ref(false)
const contextMenuItemUser = ref({})
const contextMenuPosition = ref({ x: 0, y: 0 })
const inputText = ref("")
const override = ref(false)

let editText

if (!localStorage.getItem("token")) {
  router.push("/login?redirect=" + route.path)
} else {
  store.ws.onmessage = (event) => {
    console.log(event)
    const socketMessage = JSON.parse(event.data)
    if (socketMessage.authFail) {
      store.handleError(`Error 401, ${socketMessage.authFail}`)
      router.push("/login?redirect=" + route.path)
    } else if (socketMessage.newMessage) {
      const chatIndex = store.userData.chatsList.findIndex(
        (chat) => chat.id === socketMessage.newMessage.chatId
      )

      if (chatIndex !== -1) {
        store.userData.chatsList[chatIndex].latest =
          socketMessage.newMessage.createdAt
        store.userData.chatsList[chatIndex].association.notifications += 1
        updatePageTitle()
      }
      store.chatSort()
      if (socketMessage.newMessage.chatId === currentChat.value.id) {
        socketMessage.newMessage.focus = false
        socketMessage.newMessage.reactions = []
        currentChat.value.messages.push(socketMessage.newMessage)
        scrollDown()
      }
    } else if (socketMessage.deleteMessage) {
      const messageIndex = currentChat.value.messages.findIndex(
        (message) => message.id === socketMessage.deleteMessage.id
      )
      if (messageIndex !== -1) {
        currentChat.value.messages[messageIndex].deleted = true
      }
    } else if (socketMessage.changeUser) {
      if (socketMessage.changeUser.id === showUser.value.id) {
        showUser.value = socketMessage.changeUser
      }
      const userToUpdate = currentChat.value.users.findIndex(
        (user) => user.id === socketMessage.changeUser.id
      )
      if (userToUpdate != -1) {
        currentChat.value.users[userToUpdate] = socketMessage.changeUser
        // } else {
        // currentChat.value.users.push(socketMessage.changeUser)
      }
    } else if (socketMessage.newUser) {
      if (parseInt(socketMessage.newUser.chatId) === currentChat.value.id) {
        currentChat.value.users.push(socketMessage.newUser)
      }
    } else if (socketMessage.newChat) {
      socketMessage.newChat.association = { notifications: 0 }
      store.userData.chatsList.push(socketMessage.newChat)
      store.chatSort()
    }
    console.log("Data received from websocket")
  }
}

const userSort = (property) => {
  if (property !== "id") {
    currentChat.value.users
      .sort((a, b) => {
        if (a && b) {
          if (a.username === null && b.username === null) {
            return 0
          } else if (a.username === null) {
            return 1
          } else if (b.username === null) {
            return -1
          }
          return a.username.localeCompare(b.username)
        }
      })
      .sort((a, b) => {
        if (a && b) {
          if (a[property] === null && b[property] === null) {
            return 0
          } else if (a[property] === null) {
            return 1
          } else if (b[property] === null) {
            return -1
          }
          return a[property].localeCompare(b[property])
        }
      })
  } else {
    currentChat.value.users.sort((a, b) => a?.id - b?.id)
  }
}
const userSortPress = () => {
  if (store.sortUsers === "id") {
    localStorage.setItem("sortUsers", "username")
  } else if (store.sortUsers === "username") {
    localStorage.setItem("sortUsers", "status")
  } else if (store.sortUsers === "status") {
    localStorage.setItem("sortUsers", "statusMessage")
  } else {
    localStorage.setItem("sortUsers", "id")
  }
  if (localStorage.getItem("sortUsers")) {
    store.sortUsers = localStorage.getItem("sortUsers")
  }
  userSort(store.sortUsers)
}

const focusInput = () => {
  const input = document.getElementById("input")
  input?.focus()
}

const showEmojiPicker = () => {
  reactingTo.value = -1
  emojiPickerVisible.value = !emojiPickerVisible.value
}

const handleEmojiSelected = (emoji) => {
  inputText.value = inputText.value + emoji
  emojiPickerVisible.value = false
  focusInput()
}

const reactPressed = (messageId) => {
  if (reactingTo.value === messageId) {
    reactingTo.value = -1
  } else {
    reactingTo.value = messageId
    emojiPickerVisible.value = false
  }
}

const addReaction = async (messageId, emoji) => {
  try {
    if (
      !currentChat.value.messages
        .find((m) => m.id === messageId)
        .reactions.some(
          (r) => r.emoji === emoji && r.userId === store.userData.id
        )
    ) {
      await axios.post("/api/react", {
        emoji,
        messageId
      })
      currentChat.value.messages
        .find((m) => m.id === messageId)
        .reactions.push({ emoji, userId: store.userData.id })
      scrollDown()
    }
    reactingTo.value = -1
  } catch (error) {
    store.handleAxiosError(error)
    return -1
  }
}

const removeReaction = async (messageId, emoji) => {
  try {
    await axios.post("/api/unreact", {
      emoji,
      messageId
    })
    reactingTo.value = -1
    currentChat.value.messages.find((m) => m.id === messageId).reactions =
      currentChat.value.messages
        .find((m) => m.id === messageId)
        .reactions.filter(
          (r) => r.emoji !== emoji || r.userId !== store.userData.id
        )
  } catch (error) {
    store.handleAxiosError(error)
    return -1
  }
}

const sendMessage = () => {
  emojiPickerVisible.value = false
  if (inputText.value?.trim()) {
    axios
      .post("/api/message", {
        chatId: currentChat.value.id,
        messageContents: inputText.value.trim(),
        reply: replyTo.value
      })
      .then((res) => {
        store.userData.chatsList = res.data.chats
        store.chatSort()
        inputText.value = ""
        replyTo.value = null
        res.data.lastMessage.focus = false
        currentChat.value.messages.push(res.data.lastMessage)
        currentChat.value.lastRead = currentChat.value.messages.length
        updatePageTitle()
        scrollDown()
      })
      .catch((e) => {
        store.handleAxiosError(e)
      })
  }
}
const deleteMessage = (messageId) => {
  axios
    .delete(`/api/delete/${messageId}`)
    .then(() => {
      currentChat.value.messages = currentChat.value.messages.filter(
        (message) => message.id !== messageId
      )
      scrollDown()
    })
    .catch((e) => {
      store.handleAxiosError(e)
    })
}
const pinMessage = (messageId, pinned) => {
  axios
    .patch(`/api/pin/${messageId}`)
    .then(() => {
      currentChat.value.messages = currentChat.value.messages.map((message) => {
        if (message.id === messageId) {
          return {
            ...message,
            pinned: !message.pinned
          }
        }
        return message
      })
      if (!pinned) {
        currentChat.value.pins.push(
          currentChat.value.messages.findLast(
            (message) => message.id === messageId
          )
        )
        currentChat.value.pins.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        )
      } else {
        currentChat.value.pins.splice(
          currentChat.value.pins.indexOf(
            currentChat.value.pins.findLast(
              (message) => message.id === messageId
            )
          ),
          1
        )
      }
      scrollDown()
    })
    .catch((e) => {
      store.handleAxiosError(e)
    })
}

const showEditChat = (chat) => {
  editChatRef.value?.loadChat?.(chat)
  chatEdit.value = chat
}

const openCreateChat = () => {
  createChatRef.value?.clearInputs?.()
  createChatShown.value = true
}

const editMessage = (messageId) => {
  if (editText.trim() === findMessage(messageId).messageContents) {
    editing.value = ""
  }
  axios
    .patch(`/api/edit/${messageId}`, {
      messageContents: editText.trim()
    })
    .then((res) => {
      editing.value = ""
      currentChat.value.messages[
        currentChat.value.messages.findIndex((e) => e.id === messageId)
      ] = res.data
    })
    .catch((e) => {
      store.handleAxiosError(e)
    })
}

const replyToMessage = (messageId) => {
  replyTo.value = messageId
  focusInput()
}

const handleChatCreated = (chat) => {
  createChatShown.value = false
  currentChat.value = chat
  router.push(`/chat/${currentChat.value.id}`)
  replyTo.value = null
  if (currentChat.value.messages) {
    currentChat.value.messages.focus = false
    scrollDown()
  }
}

const handleChatEdited = (chat) => {
  chatEdit.value = null
  currentChat.value = chat
  router.push(`/chat/${currentChat.value.id}`)
  replyTo.value = null
  if (currentChat.value.messages) {
    currentChat.value.messages.focus = false
    scrollDown()
  }
}

const openUser = (userId) => {
  contextMenuVisible.value = false
  axios
    .post("/api/get-user", {
      userId
    })
    .then((res) => {
      showUser.value = res.data
    })
    .catch((e) => {
      store.handleAxiosError(e)
    })
}

const getEmojiText = () => {
  const lastColon = inputText.value.indexOf(":")
  if (
    lastColon === -1 ||
    (lastColon != 0 && inputText.value[lastColon - 1] !== " ")
  )
    return null

  return inputText.value.substring(lastColon + 1).toLowerCase()
}
const handleEmojiClick = (emoji) => {
  const lastColon = inputText.value.lastIndexOf(":")
  if (lastColon !== -1) {
    inputText.value = inputText.value.substring(0, lastColon) + emoji + " "
  }
  emojiPickerIndex.value = 0
}
const selectCurrentEmoji = () => {
  if (matchingEmoji.value.length > emojiPickerIndex.value) {
    handleEmojiClick(matchingEmoji.value[emojiPickerIndex.value][0])
  }
}
const findUser = (userId) => {
  const user = currentChat.value.users.find(
    (user) => user.id === parseInt(userId)
  )
  if (user) {
    return user
  }
  return { username: userId }
}
const removeUser = (userId) => {
  contextMenuVisible.value = false
  axios
    .post(`/api/remove/${currentChat.value.id}/${userId}`)
    .then((res) => {
      store.userData.chatsList = res.data.chats
      store.chatSort()
      currentChat.value = res.data.chat
      if (currentChat.value.messages) {
        currentChat.value.messages.focus = false
        scrollDown()
      }
    })
    .catch((e) => {
      store.handleAxiosError(e)
    })
}
const copyText = (text) => {
  contextMenuVisible.value = false
  navigator.clipboard.writeText(text)
}
const scrollDown = (override) => {
  nextTick(() => {
    try {
      if ((!scrolledUp.value || override) && currentChat.value.messages) {
        const lastMessage = document.querySelector(
          `#message-${currentChat.value.messages.length - 1}`
        )
        if (editing.value) {
          scrolledUp.value = false
          lastMessage.scrollIntoView()
        } else if (lastMessage) {
          lastMessage.scrollIntoView()
          scrolledUp.value = false
          store.editFocus()
        }
      }
    } catch (e) {
      console.log(e)
    }
  })
}

const findMessage = (messageId) =>
  currentChat.value.messages.findLast((message) => message.id === messageId)

const goToMessage = (messageId) => {
  const index = currentChat.value.messages.findIndex(
    (message) => message.id === messageId
  )

  const div = document.getElementById("messages-div")
  const element = document.getElementById(`message-${index}`)

  if (!div || !element) {
    return
  }

  const elementRect = element.getBoundingClientRect()
  const absoluteElementTop = elementRect.top + div.scrollTop
  const middleOfScreen = div.clientHeight / 2
  const scrollTo = absoluteElementTop - middleOfScreen

  div.scrollTo({
    behavior: "smooth",
    top: scrollTo
  })
  element.classList.add("highlight")
  setTimeout(() => {
    element.classList.remove("highlight")
  }, 1500)
}
const editLast = () => {
  const messageEdit = currentChat.value.messages.filter(
    (message) => message.userId === store.userData.id
  )
  if (messageEdit.length > 0) {
    editText = messageEdit.slice(-1)[0].messageContents
    editing.value = messageEdit.slice(-1)[0].id
  }
}
async function addFriend(userId, notOpen) {
  await axios
    .post(`/api/friend/${userId}`)
    .then(async () => {
      if (notOpen === false) {
        openUser(userId)
      } else if (notOpen) {
        await getChat(currentChat.value.id)
        contextMenuItemUser.value = await findUser(contextMenuItemUser.value.id)
      }
    })
    .catch((e) => {
      store.handleAxiosError(e)
    })
}

const contextMenuSendDm = async (id) => {
  try {
    contextMenuVisible.value = false
    const data = await sendDm(id)
    onDmCreated(data)
  } catch (e) {
    store.handleAxiosError(e)
  }
}

const onDmCreated = (data) => {
  showUser.value = false
  createChatShown.value = false
  store.showFriends = false
  editing.value = ""
  store.userData.chatsList = data.chats
  store.chatSort()
  inputText.value = ""
  currentChat.value = data.chat
  currentChat.value.messages.focus = false
  router.push(`/chat/${currentChat.value.id}`)
  scrollDown()
}

const showContextMenu = (event, user) => {
  event.preventDefault()
  contextMenuPosition.value = { x: event.clientX, y: event.clientY }
  contextMenuVisible.value = true
  contextMenuItemUser.value = user
}
const keyPressed = ({ key, altKey }) => {
  if (key === "Escape") {
    if (contextMenuVisible.value) {
      contextMenuVisible.value = false
    } else if (editing.value === "status") {
      editing.value = ""
    } else if (showUser.value) {
      showUser.value = false
    } else if (embed.value) {
      embed.value = false
    } else if (createChatShown.value) {
      createChatShown.value = false
    } else if (chatEdit.value !== null) {
      chatEdit.value = null
    } else if (reactingTo.value !== -1) {
      reactingTo.value = -1
      focusInput()
    } else if (emojiPickerVisible.value) {
      emojiPickerVisible.value = false
      focusInput()
    } else if (editing.value) {
      editing.value = ""
    } else if (replyTo.value) {
      replyTo.value = null
    } else if (
      !showUser.value &&
      currentChat.value.lastRead === currentChat.value.messages.length
    ) {
      scrollDown(true)
    } else if (
      currentChat.value.lastRead !== currentChat.value.messages.length
    ) {
      currentChat.value.lastRead = currentChat.value.messages.length
      axios.post(`/api/read-new/${currentChat.value.id}`)
      store.userData.chatsList[
        store.userData.chatsList.findIndex(
          (chat) => chat.id === parseInt(route.params.chatId)
        )
      ].association.notifications = 0
      updatePageTitle()
    }
  } else if (altKey) {
    if (key == "ArrowDown") {
      const chatIndex = store.userData.chatsList.findIndex(
        (chat) => chat.id === currentChat.value.id
      )
      getChat(
        store.userData.chatsList[
          (chatIndex + 1) % store.userData.chatsList.length
        ].id
      )
    } else if (key == "ArrowUp") {
      const chatIndex = store.userData.chatsList.findIndex(
        (chat) => chat.id === currentChat.value.id
      )
      getChat(
        store.userData.chatsList[
          (chatIndex + store.userData.chatsList.length - 1) %
            store.userData.chatsList.length
        ].id
      )
    }
  }
}
const scrollEvent = () => {
  const div = document.getElementById("messages-div")
  const { scrollHeight } = div
  const { scrollTop } = div
  const { clientHeight } = div
  scrolledUp.value =
    scrollTop + clientHeight <=
    scrollHeight - (clientHeight / 2 > 200 ? 200 : clientHeight / 2)
}
const onlineUsers = computed(() =>
  currentChat.value.users.filter((user) => user?.status === "online")
)
const offlineUsers = computed(() =>
  currentChat.value.users.filter((user) => user?.status === "offline")
)
const matchingEmoji = computed(() => {
  const text = getEmojiText()
  if (text == null || override.value) return []

  return normalizedEmojis
    .filter(([, descriptions]) => descriptions.some((e) => e.includes(text)))
    .slice(0, 30)
})
const inputDisabled = computed(() => {
  return !store.userData.emailVerified && currentChat.value.requireVerification
})

watch(inputText, () => {
  override.value = false
  emojiPickerIndex.value = 0
  scrollToSelected()
})

const scrollToSelected = () => {
  const selected = document.getElementById(
    `picker-emoji-${emojiPickerIndex.value}`
  )
  selected?.scrollIntoView({
    block: "nearest",
    inline: "nearest"
  })
}

const handleUpKey = () => {
  if (matchingEmoji.value.length > 0) {
    emojiPickerIndex.value = Math.max(0, emojiPickerIndex.value - 1)
    scrollToSelected()
  } else {
    editLast()
    scrollDown(true)
  }
}

const handleDownKey = () => {
  if (matchingEmoji.value.length > 0) {
    emojiPickerIndex.value = Math.min(
      matchingEmoji.value.length - 1,
      emojiPickerIndex.value + 1
    )
    scrollToSelected()
  }
}

const updateFavicon = (notificationCount) => {
  if (notificationCount < 1) {
    document.getElementById("favicon").href = "/icons/favicon.ico"
    return
  }

  const favicon = document.getElementById("favicon")
  const size = 64
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")

  const img = new Image()
  img.src = favicon.href
  img.onload = () => {
    ctx.drawImage(img, 0, 0, size, size)

    const radius = 20
    ctx.fillStyle = "red"
    ctx.beginPath()
    ctx.arc(size - radius, size - radius, radius, 0, 2 * Math.PI)
    ctx.fill()

    ctx.fillStyle = "white"
    ctx.font = "bold 32px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(
      notificationCount > 9 ? "9+" : notificationCount,
      size - radius,
      size - radius
    )

    favicon.href = canvas.toDataURL("image/png")
  }
}

const updatePageTitle = () => {
  let notificationCount =
    store.userData.chatsList?.reduce((sum, chat) => {
      return sum + (chat.association?.notifications || 0)
    }, 0) ?? 0

  document.title = `${notificationCount !== 0 ? "(" + notificationCount + ") " : ""}BetterComms | ${currentChat.value.name}`
  updateFavicon(notificationCount)
}

async function getChat(id) {
  if (!id) {
    if (!store.userData.chatsList) {
      watch(
        () => store.userData.chatsList,
        (newValue) => {
          if (newValue) {
            getChat(id)
          }
        },
        {
          once: true
        }
      )
      return
    }
    id = store.userData.chatsList[0].id
  }
  if (id !== currentChat.value.id) {
    loadingMessages.value = true
  }
  store.showFriends = false
  await axios
    .get(`/api/chat/${id}`)
    .then((res) => {
      currentChat.value = res.data
      currentChat.value.messages.focus = false
      router.push(`/chat/${currentChat.value.id}`)
      userSort(store.sortUsers)
      replyTo.value = null
      loadingMessages.value = false
      scrollDown(true)
      updatePageTitle()
      if (!store.userData.chatsList) {
        watch(
          () => store.userData.chatsList,
          (newValue) => {
            if (newValue) {
              updatePageTitle()
            }
          },
          {
            once: true
          }
        )
        return
      }
    })
    .catch((e) => {
      if (e.response?.status === 403 && store.userData.chatsList[0].id !== id) {
        getChat(store.userData.chatsList[0].id)
      } else if (e.response?.status !== 403) {
        store.handleAxiosError(e)
      }
    })
}

onMounted(async () => {
  document.addEventListener("keydown", keyPressed)
  const messagesDiv = document.getElementById("messages-div")
  if (messagesDiv) messagesDiv.addEventListener("scroll", scrollEvent)
  if (route.path.startsWith("/user")) {
    openUser(route.params.id)
  }
  getChat(route.params.chatId)
})
onUnmounted(() => {
  document.removeEventListener("keydown", keyPressed)
  const messagesDiv = document.getElementById("messages-div")
  if (messagesDiv) messagesDiv.removeEventListener("scroll", scrollEvent)
})
watch(editing, () => {
  store.editFocus()
})
</script>
