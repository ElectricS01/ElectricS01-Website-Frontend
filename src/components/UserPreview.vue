<template>
  <transition>
    <modal
      v-if="showUser && !store.quickSwitcherShown"
      :is-active="typeof showUser === 'object' && !store.quickSwitcherShown"
      @close="emits('showUser'), emits('editing', '')"
    >
      <img
        :src="showUser.banner || 'https://i.electrics01.com/i/d81dabf74c88.png'"
        height="100"
        alt="Profile banner"
        class="profile-banner"
      />
      <div class="profile-page">
        <div class="profile-grid">
          <div class="profile-picture-large">
            <profile-picture size="80" :avatar="showUser.avatar" />
            <svg class="online-indicator" width="20" height="20">
              <status-indicator size="8" :status="showUser.status" />
            </svg>
          </div>
          <div class="profile-user">
            <h4 style="word-wrap: break-word">
              {{ showUser.username }}
            </h4>
            <div v-if="editing !== 'status'">
              <p class="message-text-large" style="word-wrap: break-word">
                {{
                  showUser.gameName
                    ? "Playing " + showUser.gameName
                    : showUser.statusMessage
                }}
                <icons
                  v-if="showUser.id === store.userData.id"
                  style="cursor: pointer"
                  size="16"
                  icon="edit"
                  @click="editStatusShow()"
                />
              </p>
            </div>
            <input
              v-else
              id="status"
              v-model="editStatus"
              placeholder="Edit your status"
              class="profile-input"
              autocomplete="off"
              @keydown.enter="editStatusMessage()"
            />
          </div>
          <div class="profile-buttons">
            <button
              v-if="
                (showUser.id !== store.userData.id &&
                  showUser.directMessages !== 'no one') ||
                (showUser.directMessages !== 'no one' &&
                  showUser.friend?.status)
              "
              class="profile-button-message"
              @click="sendDm(showUser.id)"
            >
              <icons
                style="padding-right: 4px"
                colour="#1e90ff"
                size="16"
                icon="message"
              />
              Send Message
            </button>
            <button
              v-if="
                showUser.friendRequests &&
                showUser.id !== store.userData.id &&
                !showUser.friend?.status
              "
              class="profile-button-add"
              style="color: #47bf4c"
              @click="addFriend(showUser.id, false)"
            >
              <icons
                style="padding-right: 4px"
                colour="#47bf4c"
                size="16"
                icon="add-user"
              />
              Add Friend
            </button>
            <button
              v-else-if="
                showUser.id !== store.userData.id &&
                showUser.friend?.status === 'accepted'
              "
              class="profile-button-remove"
              style="color: #ff2f2f"
              @click="addFriend(showUser.id, false)"
            >
              <icons
                style="padding-right: 4px"
                colour="#FF2F2F"
                size="16"
                icon="remove-user"
              />
              Remove Friend
            </button>
            <button
              v-else-if="
                showUser.friendRequests && showUser.friend?.status === 'pending'
              "
              class="profile-button-pending"
              style="color: #808080"
              @click="addFriend(showUser.id, false)"
            >
              <icons
                style="padding-right: 4px"
                colour="#808080"
                size="16"
                icon="remove-user"
              />
              Pending
            </button>
            <button
              v-else-if="
                showUser.id !== store.userData.id &&
                showUser.friend?.status === 'incoming'
              "
              class="profile-button-pending"
              style="color: #47bf4c"
              @click="addFriend(showUser.id, false)"
            >
              <icons
                style="padding-right: 4px"
                colour="#47bf4c"
                size="16"
                icon="add-user"
              />
              Accept Friend
            </button>
          </div>
        </div>
        <div class="profile-info scroll-bar">
          <div v-if="showUser.gameName">
            <div class="profile-spacer">
              <p>Playing</p>
              <div />
            </div>
            <div style="display: flex">
              <div style="padding-right: 8px">
                <img
                  width="32"
                  height="32"
                  :src="`/icons/${showUser.gameName === 'Tetris' ? 'tetris.ico' : showUser.gameName === 'TonkGame' ? 'tonkgameIcon.ico' : 'favicon.ico'}`"
                />
              </div>
              <div>
                <p class="message-text-large">
                  {{ showUser.gameName }} -
                  {{ showUser.gameStatus }}
                </p>
                <p class="message-text-medium-gray">
                  {{ dayjsOngoing }}
                </p>
              </div>
            </div>
          </div>
          <div v-if="showUser.createdAt">
            <div class="profile-spacer">
              <p>Date Created</p>
              <div />
            </div>
            <p class="message-text-large">
              {{ store.dayjsDate(showUser.createdAt) }}
            </p>
          </div>
          <div>
            <div class="profile-spacer">
              <p>Description</p>
              <div />
            </div>
            <p
              class="message-text-large"
              style="word-wrap: break-word; white-space: pre-wrap"
            >
              {{ showUser.description || `Hi, I'm ${showUser.username}!` }}
            </p>
          </div>
          <div v-if="showUser.tetris?.length">
            <div class="profile-spacer">
              <p>Tetris Scores</p>
              <div />
            </div>
            <p style="margin-top: 0">
              Easy mode: {{ showUser.tetris[0]?.value }} lines
            </p>
            <p>Medium mode: {{ showUser.tetris[1]?.value }} lines</p>
            <p>Hard mode: {{ showUser.tetris[2]?.value }} lines</p>
            <p>God mode: {{ showUser.tetris[3]?.value }} lines</p>
            <p style="margin-bottom: 0">
              Ultra Nightmare mode: {{ showUser.tetris[4]?.value }} lines
            </p>
          </div>
        </div>
      </div>
    </modal>
  </transition>
</template>
<script setup>
import Icons from "@/components/core/Icons.vue"
import Modal from "@/components/core/Modal.vue"
import StatusIndicator from "@/components/StatusIndicator.vue"
import ProfilePicture from "@/components/ProfilePicture.vue"
import { useDataStore } from "@/store"
import axios from "axios"
import duration from "dayjs/plugin/duration"
import dayjs from "dayjs"
import { ref, onMounted, onUnmounted } from "vue"

dayjs.extend(duration)

const store = useDataStore()
const props = defineProps({
  addFriend: Function,
  editing: [Number, String],
  sendDm: Function,
  showUser: [Boolean, Object]
})
const emits = defineEmits(["showUser", "editing", "statusMessage"])

let editStatus

const dayjsOngoing = ref(
  dayjs
    .duration(dayjs().diff(props.showUser.playingSince || dayjs()))
    .format("HH:mm:ss")
)

const updateCounter = () => {
  dayjsOngoing.value = dayjs
    .duration(dayjs().diff(props.showUser.playingSince || dayjs()))
    .format("HH:mm:ss")
}

let interval

onMounted(() => {
  interval = setInterval(updateCounter, 1000)
})

onUnmounted(() => {
  clearInterval(interval)
})

const editStatusShow = () => {
  emits("editing", "status")
  editStatus = props.showUser.statusMessage
  store.editFocus()
}
const editStatusMessage = () => {
  if (
    editStatus.trim() === props.showUser.statusMessage ||
    editStatus.trim().length > 50
  ) {
    return emits("editing", "")
  }
  axios
    .patch("/api/edit-status-message", {
      statusMessage: editStatus.trim()
    })
    .then((res) => {
      emits("statusMessage", res.data.statusMessage)
      emits("editing", "")
    })
    .catch((e) => {
      store.error = e
      setTimeout(store.errorFalse, 5000)
    })
}
</script>
