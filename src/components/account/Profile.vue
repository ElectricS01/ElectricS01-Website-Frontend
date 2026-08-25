<template>
  <h2 class="settings-text">Profile</h2>
  Change your profile settings
  <div class="settings-spacer" />
  <div style="display: flex">
    <div style="width: min(500px, 100%)">
      <img
        :src="
          store.userData.banner ||
          'https://i.electrics01.com/i/d81dabf74c88.png'
        "
        width="500"
        height="100"
        alt="Profile banner"
        class="profile-banner"
      />
      <input
        id="banner"
        v-model="editBanner"
        placeholder="Edit your banner"
        style="margin: 1px; height: fit-content; width: calc(100% - 2px)"
        autocomplete="off"
        @keydown.enter="changeProperty('banner', editBanner)"
      />
      <div class="profile-page">
        <div class="profile-grid">
          <div class="profile-picture-large">
            <profile-picture size="80" :avatar="store.userData.avatar" />
            <svg class="online-indicator" width="20" height="20">
              <status-indicator size="8" :status="store.userData.status" />
            </svg>
          </div>
          <div
            style="
              flex: 1 1 auto;
              word-wrap: break-word;
              overflow: hidden;
              text-overflow: ellipsis;
            "
            class="message-item"
          >
            <h4 style="word-wrap: break-word">
              {{ store.userData.username }}
            </h4>
            <p
              v-if="editing !== 'status'"
              class="message-text-large"
              style="word-wrap: break-word"
            >
              {{ store.userData.statusMessage }}
              <icons
                style="cursor: pointer"
                size="16"
                icon="edit"
                @click="showEditStatus()"
              />
            </p>
            <input
              v-else
              id="status"
              ref="status"
              v-model="editStatus"
              placeholder="Edit your status"
              style="margin: 1px; width: calc(100% - 2px)"
              autocomplete="off"
              @keydown.escape="editing = ''"
              @keydown.enter="editStatusMessage()"
            />
          </div>
        </div>
        <input
          id="avatar"
          v-model="editAvatar"
          placeholder="Edit your profile picture"
          style="margin: 1px; height: fit-content"
          autocomplete="off"
          @keydown.enter="changeProperty('avatar', editAvatar)"
        />
        <div style="height: 332px; overflow-y: auto" class="scroll-bar">
          <div v-if="store.userData.createdAt">
            <div class="profile-spacer">
              <p>Date Created</p>
              <div />
            </div>
            <p class="message-text-large">
              {{ dayjsDate(store.userData.createdAt) }}
            </p>
          </div>
          <div>
            <div class="profile-spacer">
              <p>Description</p>
              <div />
            </div>
            <p
              v-if="editing !== 'description'"
              class="message-text-large"
              style="word-wrap: break-word; white-space: pre-wrap"
            >
              {{
                store.userData.description ||
                `Hi, I'm ${store.userData.username}!`
              }}
              <icons
                style="cursor: pointer"
                size="16"
                icon="edit"
                @click="showEditDescription()"
              />
            </p>
            <textarea
              v-else
              id="description"
              ref="description"
              v-model="editDescription"
              placeholder="Edit your description"
              style="margin: 1px; width: calc(100% - 2px); resize: none"
              autocomplete="off"
              @keydown.escape="editing = ''"
              @keydown.enter.exact.prevent="saveDescription()"
            />
          </div>
          <div v-if="store.userData.tetris?.length">
            <div class="profile-spacer">
              <p>Tetris Scores</p>
              <div />
            </div>
            <p style="margin-top: 0">
              Easy mode: {{ store.userData.tetris[0]?.value }} lines
            </p>
            <p>
              Medium mode:
              {{ store.userData.tetris[1]?.value }} lines
            </p>
            <p>Hard mode: {{ store.userData.tetris[2]?.value }} lines</p>
            <p>God mode: {{ store.userData.tetris[3]?.value }} lines</p>
            <p style="margin-bottom: 0">
              Ultra Nightmare mode:
              {{ store.userData.tetris[4]?.value }} lines
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { changeProperty } from "@/helpers/settings"
import { useDataStore } from "@/store"
import axios from "axios"
import { nextTick, ref, useTemplateRef } from "vue"
import ProfilePicture from "../ProfilePicture.vue"
import StatusIndicator from "../StatusIndicator.vue"
import Icons from "../core/Icons.vue"
import { dayjsDate } from "@/helpers/dates"

const store = useDataStore()

const descriptionRef = useTemplateRef("description")
const statusRef = useTemplateRef("status")

const editing = ref("")
const editStatus = ref("")
const editDescription = ref("")
const editBanner = ref("")
const editAvatar = ref("")

const showEditStatus = async () => {
  editing.value = "status"
  editStatus.value = store.userData.statusMessage ?? ""
  await nextTick()
  statusRef.value?.focus()
}

const editStatusMessage = () => {
  if (
    editStatus.value.trim() === store.userData.statusMessage ||
    editStatus.value.trim().length > 50
  ) {
    editing.value = ""
  }
  axios
    .patch("/api/edit-status-message", {
      statusMessage: editStatus.value.trim()
    })
    .then((res) => {
      store.userData.statusMessage = res.data.statusMessage
      editing.value = ""
    })
    .catch((e) => {
      store.handleAxiosError(e)
    })
}

const showEditDescription = async () => {
  editing.value = "description"
  editDescription.value = store.userData.description ?? ""
  await nextTick()
  descriptionRef.value?.focus()
}

const saveDescription = async () => {
  await changeProperty("description", editDescription.value)
  editing.value = ""
}
</script>
