<template>
  <user-preview
    :show-user="showUser"
    :editing="editing"
    :add-friend="addFriend"
    @show-user="showUser = null"
    @editing="editing = $event"
    @status-message="
      ((showUser.statusMessage = $event),
      (currentChat.users.find(
        (user) => user.id === store.userData.id
      ).statusMessage = $event))
    "
    @dm-created="onDmCreated($event)"
  />
  <modal-simple
    :is-active="embed !== null && !store.quickSwitcherShown"
    @close="embed = null"
  >
    <img :src="embed" class="message-embed" alt="Embedded image" />
  </modal-simple>
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
      v-if="store.chatBarOpen === true"
      v-model:context-menu="chatsSidebarContext"
      :chats="store.userData.chatsList"
      :loading="store.loadingChats"
      :current-id="store.showFriends ? undefined : currentChat.id"
      :user-id="store.userData.id"
      @open-chat="getChat($event)"
      @open-create-chat="openCreateChat"
      @show-edit-chat="showEditChat($event)"
      @show-friends="store.showFriends = true"
      @remove-user="removeUser($event, store.userData.id)"
      @read-chat="readChat($event)"
    />
    <friends
      v-if="store.showFriends"
      :add-friend="addFriend"
      @dm-created="onDmCreated($event)"
    />
    <div
      v-else
      style="
        flex-grow: 1;
        display: flex;
        flex-direction: column;
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
              v-if="!currentChat.requireVerification && currentChat.type !== 1"
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
            <b v-if="currentChat.type === 1" class="message-text-medium-gray">
              {{ encryptionRequirement }}
            </b>
          </div>
          <div
            v-for="(message, index) in currentChat.messages"
            :id="'message-' + index"
            :key="message.id"
          >
            <chat-spacer
              :message="message"
              :previous-message="currentChat.messages[index - 1]"
            />
            <reply
              v-if="message.reply"
              :message="findMessage(message.reply)"
              :open-user="openUser"
              :go-to-message="goToMessage"
            />
            <div
              class="message-grid"
              style="position: relative; width: 100%; margin: 6px 4px 4px"
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
                  :find-username="findUsername"
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
                    store.userData.admin ||
                    message.user?.id === store.userData.id
                  "
                  style="cursor: pointer"
                  size="20"
                  :icon="message.pinned ? 'unpin' : 'pin'"
                  @click="pinMessage(message.id, message.pinned)"
                />
                <icons
                  v-if="
                    message.user?.id === store.userData.id &&
                    !message.encrypted &&
                    !message.deleted &&
                    !message.ciphertext
                  "
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
                    store.userData.admin ||
                    message.user?.id === store.userData.id
                  "
                  style="cursor: pointer"
                  size="20"
                  icon="delete"
                  @click="deleteMessage(message.id)"
                />
              </div>
            </div>
            <div
              v-if="
                currentChat.association.lastRead === message.id &&
                index !== currentChat.messages.length - 1
              "
              class="red-chat-spacer"
            >
              <div />
              <p>New messages</p>
              <div />
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
              v-if="replyMessage"
              class="scroll-button"
              style="overflow-wrap: break-word; z-index: 2; position: relative"
            >
              <icons size="12" icon="right" style="margin-right: 4px" />
              <profile-picture
                size="12"
                :avatar="replyMessage.user?.avatar"
                :small="true"
                @click="openUser(replyMessage.user.id)"
              />
              <b
                class="message-text-medium"
                style="margin: 0 4px 0 4px"
                @click="openUser(replyMessage.user.id)"
              >
                {{
                  replyMessage.user?.username
                    ? "@" + replyMessage.user?.username
                    : "@Deleted user"
                }}
              </b>
              <p
                class="message-text-medium-gray"
                style="margin: 0"
                @click="goToMessage(replyTo)"
              >
                {{ replyMessage.messageContents }}
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
                ? requiresEncryption
                  ? encryptionRequirement
                  : 'This chat requires email address verification'
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
    <chat-sidebar
      v-model:users-sidebar-context="usersSidebarContext"
      :loading-messages="loadingMessages"
      :current-chat="currentChat"
      :add-friend="addFriend"
      :find-message="findMessage"
      :find-username="findUsername"
      :go-to-message="goToMessage"
      :open-user="openUser"
      :open-chat="getChat"
      :scroll="scrollDown"
      @remove-user="removeUser(currentChat.id, $event)"
      @dm-created="onDmCreated($event)"
    />
  </div>
</template>

<script setup>
import CustomMessage from "@/components/CustomMessage.vue"
import Icons from "@/components/core/Icons.vue"
import ProfilePicture from "@/components/ProfilePicture.vue"
import UserPreview from "@/components/modals/UserPreview.vue"
import CreateChat from "@/components/modals/CreateChat.vue"
import EditChat from "@/components/modals/EditChat.vue"
import ModalSimple from "@/components/core/ModalSimple.vue"
import Friends from "@/components/Friends.vue"
import ChatSpacer from "@/components/ChatSpacer.vue"
import EmojiPicker from "@/components/EmojiPicker.vue"
import MessageEmoji from "@/components/MessageEmoji.vue"
import ChatsList from "@/components/sidebars/ChatsList.vue"
import ChatSidebar from "@/components/sidebars/ChatSidebar.vue"
import Reply from "@/components/Reply.vue"

import { useDataStore } from "@/store"
import axios from "axios"
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  useTemplateRef,
  watch
} from "vue"
import { useRoute, useRouter } from "vue-router"
import { dayjsLong, dayjsShort } from "@/helpers/dates"
import { merge } from "@/helpers/messages"
import { normalizedEmojis } from "@/helpers/emoji"
import {
  encryptMessage,
  decryptMessage,
  importPublicKey
} from "@/helpers/encryption"
import sodium from "libsodium-wrappers-sumo"

const store = useDataStore()
const route = useRoute()
const router = useRouter()

const embed = ref(null)
const currentChat = ref({})
const replyTo = ref()
const editing = ref("")
const createChatRef = useTemplateRef("createChatRef")
const editChatRef = useTemplateRef("editChatRef")
const createChatShown = ref(false)
const loadingMessages = ref(true)
const scrolledUp = ref(false)
const showUser = ref(null)
const chatEdit = ref(null)
const reactingTo = ref(-1)
const emojiPickerIndex = ref(0)
const emojiPickerVisible = ref(false)
const inputText = ref("")
const override = ref(false)

const usersSidebarContext = ref(false)
const chatsSidebarContext = ref(false)

let editText

if (!localStorage.getItem("token")) {
  router.push("/login?redirect=" + route.path)
} else {
  store.ws.onmessage = async (event) => {
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
        await decrypt(socketMessage.newMessage)
        if (socketMessage.newMessage.chatId === currentChat.value.id) {
          currentChat.value.messages.push(socketMessage.newMessage)
          scrollDown()
        }
      }
    } else if (socketMessage.deleteMessage) {
      const messageIndex = currentChat.value.messages.findIndex(
        (message) => message.id === socketMessage.deleteMessage.id
      )
      if (messageIndex !== -1) {
        currentChat.value.messages[messageIndex].deleted = true
      }
    } else if (socketMessage.changeUser) {
      if (showUser.value && socketMessage.changeUser.id === showUser.value.id) {
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
    } else if (socketMessage.editChat) {
      const chatIndex = store.userData.chatsList.findIndex(
        (chat) => chat.id === socketMessage.editChat.id
      )

      socketMessage.editChat.association = {
        notifications:
          store.userData.chatsList[chatIndex].association.notifications
      }

      if (chatIndex !== -1) {
        store.userData.chatsList[chatIndex] = socketMessage.editChat
      }
    }
    console.log("Data received from websocket")
  }
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

const sendMessage = async () => {
  emojiPickerVisible.value = false
  const messageContents = inputText.value.trim()
  const chatId = currentChat.value.id
  if (!messageContents) return
  try {
    let res
    if (sendEncrypted.value) {
      if (otherUser.value.publicKey.length !== 44) {
        store.handleError("Receiving user has invalid public key")
        return
      }
      const publicKey = await importPublicKey(otherUser.value.publicKey)
      const encrypted = await encryptMessage(
        messageContents,
        store.userData.privateKey,
        publicKey,
        store.userData.publicKey,
        otherUser.value.id,
        store.userData.id
      )
      res = await axios.post("/api/message-encrypted", {
        chatId,
        ciphertext: sodium.to_base64(
          encrypted.ciphertext,
          sodium.base64_variants.ORIGINAL
        ),
        keys: encrypted.keys,
        nonce: sodium.to_base64(
          encrypted.nonce,
          sodium.base64_variants.ORIGINAL
        ),
        reply: replyTo.value
      })
    } else {
      res = await axios.post("/api/message", {
        chatId,
        messageContents,
        reply: replyTo.value
      })
    }
    store.userData.chatsList = res.data.chats
    store.chatSort()
    inputText.value = ""
    replyTo.value = null
    res.data.lastMessage.focus = false
    await decrypt(res.data.lastMessage)
    if (chatId === currentChat.value.id) {
      currentChat.value.messages.push(res.data.lastMessage)
      currentChat.value.association.lastRead =
        currentChat.value.messages.at(-1).id
      updatePageTitle()
      scrollDown()
    }
  } catch (e) {
    store.handleAxiosError(e)
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
  chatsSidebarContext.value = false
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

const decrypt = async (message) => {
  try {
    if (message.messageContents) return message
    const publicKey =
      message.userId === store.userData.id
        ? store.userData.publicKey
        : await importPublicKey(otherUser.value.publicKey)

    message.messageContents = await decryptMessage(
      message,
      store.userData.privateKey,
      publicKey
    )
  } catch (e) {
    console.log(e)
    message.encrypted = true
    message.messageContents = "Could not decrypt message"
  }
}

const handleChatChange = async (chat) => {
  const association = currentChat.value.association
  currentChat.value = chat
  currentChat.value.association = association
  router.push(`/chat/${currentChat.value.id}`)
  updatePageTitle()
  replyTo.value = null
  if (currentChat.value.messages) {
    currentChat.value.messages.focus = false
    await Promise.all([
      ...currentChat.value.messages.map((message) => decrypt(message)),
      ...currentChat.value.pins.map((pin) => decrypt(pin))
    ])
    scrollDown()
  }
}

const handleChatCreated = async (chat) => {
  createChatShown.value = false
  await handleChatChange(chat)
}

const handleChatEdited = async (chat) => {
  chatEdit.value = null
  await handleChatChange(chat)
}

const openUser = (userId) => {
  usersSidebarContext.value = false
  chatsSidebarContext.value = false

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
const findUsername = (userId) => {
  const user = currentChat.value.users.find(
    (user) => user.id === parseInt(userId)
  )
  return user?.username ?? userId
}
const removeUser = async (chatId, userId) => {
  usersSidebarContext.value = false
  try {
    const res = await axios.post(`/api/remove/${chatId}/${userId}`)
    store.userData.chatsList = res.data.chats
    store.chatSort()
    await handleChatChange(res.data.chat)
  } catch (e) {
    store.handleAxiosError(e)
  }
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
    .then(async (res) => {
      if (notOpen === false) {
        showUser.value.friend = {
          status: res.data.status
        }
      } else if (notOpen) {
        currentChat.value.users.find((user) => user.id === userId).friend = {
          status: res.data.status
        }
      }
    })
    .catch((e) => {
      store.handleAxiosError(e)
    })
}

const onDmCreated = async (data) => {
  showUser.value = null
  createChatShown.value = false
  store.showFriends = false
  editing.value = ""
  store.userData.chatsList = data.chats
  store.chatSort()
  inputText.value = ""
  await handleChatChange(data.chat)
}

const readChat = async (chatId) => {
  try {
    chatsSidebarContext.value = false
    await axios.post(`/api/read-new/${chatId}`)
    if (currentChat.value.id === chatId) {
      currentChat.value.association.lastRead =
        currentChat.value.messages.at(-1).id
    }
    store.userData.chatsList[
      store.userData.chatsList.findIndex((chat) => chat.id === chatId)
    ].association.notifications = 0
    updatePageTitle()
  } catch (e) {
    store.handleAxiosError(e)
  }
}

const keyPressed = ({ key, altKey }) => {
  if (key === "Escape") {
    if (usersSidebarContext.value) {
      usersSidebarContext.value = false
    } else if (chatsSidebarContext.value) {
      chatsSidebarContext.value = false
    } else if (editing.value === "status") {
      editing.value = ""
    } else if (showUser.value) {
      showUser.value = null
    } else if (embed.value) {
      embed.value = null
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
      currentChat.value.association.lastRead ===
        currentChat.value.messages.at(-1).id
    ) {
      scrollDown(true)
    } else if (
      currentChat.value.association.lastRead !==
      currentChat.value.messages.at(-1).id
    ) {
      readChat(currentChat.value.id)
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

const replyMessage = computed(() =>
  replyTo.value ? findMessage(replyTo.value) : null
)

const matchingEmoji = computed(() => {
  const text = getEmojiText()
  if (text == null || override.value) return []

  return normalizedEmojis
    .filter(([, descriptions]) => descriptions.some((e) => e.includes(text)))
    .slice(0, 30)
})

const otherUser = computed(() =>
  currentChat.value.users?.find((u) => u.id !== store.userData.id)
)

const sendEncrypted = computed(() => {
  return (
    currentChat.value.type === 1 &&
    ((store.userData.encryption === "on" &&
      otherUser.value.encryption === "always") ||
      (store.userData.encryption === "always" &&
        otherUser.value.encryption === "on") ||
      (store.userData.encryption === "on" &&
        otherUser.value.encryption === "on") ||
      (store.userData.encryption === "off" &&
        otherUser.value.encryption === "always") ||
      (store.userData.encryption === "always" &&
        otherUser.value.encryption === "off") ||
      (store.userData.encryption === "always" &&
        otherUser.value.encryption === "always"))
  )
})
const requiresEncryption = computed(() => {
  return (
    currentChat.value.type === 1 &&
    ((store.userData.encryption === "always" &&
      otherUser.value.encryption === "never") ||
      (store.userData.encryption === "never" &&
        otherUser.value.encryption === "always"))
  )
})
const inputDisabled = computed(() => {
  return (
    requiresEncryption.value ||
    (!store.userData.emailVerified && currentChat.value.requireVerification)
  )
})
const encryptionRequirement = computed(() => {
  if (currentChat.value.type !== 1) return
  const encryption = currentChat.value.users.find(
    (u) => u.id !== store.userData.id
  ).encryption
  switch (encryption) {
    case "never":
      return "This user does not allow encrypted direct messages"
    case "off":
      return "This user prefers unencrypted direct messages"
    case "on":
      return "This user prefers encrypted direct messages"
    case "always":
      return "This user requires encrypted direct messages"
    default:
      return ""
  }
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

  const chatName =
    currentChat.value.type === 1 &&
    currentChat.value.owner !== store.userData.id
      ? currentChat.value.ownerDetails.username
      : currentChat.value.name

  document.title = `${notificationCount !== 0 ? "(" + notificationCount + ") " : ""}BetterComms | ${chatName}`
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
    .then(async (res) => {
      currentChat.value = res.data
      currentChat.value.messages.focus = false
      await Promise.all([
        ...currentChat.value.messages.map((message) => decrypt(message)),
        ...currentChat.value.pins.map((pin) => decrypt(pin))
      ])
      router.push(`/chat/${currentChat.value.id}`)
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
