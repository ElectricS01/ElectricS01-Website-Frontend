<template>
  <div style="flex-grow: 1; display: flex; flex-direction: column">
    <h1 style="margin: 16px">Friends</h1>
    <div
      v-for="friend in friends"
      :key="friend.id"
      style="
        display: flex;
        background-color: #282a2b;
        margin: 8px 16px;
        align-items: center;
        justify-content: space-between;
      "
    >
      <div
        style="display: flex; align-items: center; cursor: pointer"
        @click="sendUserDm(friend.user.id)"
      >
        <profile-picture
          size="32"
          :avatar="friend.user.avatar"
          :small="true"
          style="margin: 8px"
        />
        <div style="padding: 8px">
          {{ friend.user.username }}
        </div>
      </div>
      <div style="display: flex; align-items: center">
        <button
          v-if="!friend.status"
          class="profile-button-add"
          style="color: #47bf4c; width: fit-content"
          @click="add(friend.user.id)"
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
          v-else-if="friend.status === 'accepted'"
          class="profile-button-remove"
          style="color: #ff2f2f; width: fit-content"
          @click="add(friend.user.id)"
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
          v-else-if="friend.status === 'incoming'"
          class="profile-button-pending"
          style="color: #808080; width: fit-content"
          @click="add(friend.user.id)"
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
          v-else-if="friend.status === 'pending'"
          class="profile-button-pending"
          style="color: #47bf4c; width: fit-content"
          @click="add(friend.user.id)"
        >
          <icons
            style="padding-right: 4px"
            colour="#47bf4c"
            size="16"
            icon="add-user"
          />
          Accept Friend
        </button>
        <div style="padding: 8px">{{ dayjsSince(friend.createdAt) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ProfilePicture from "@/components/ProfilePicture.vue"
import Icons from "@/components/core/Icons.vue"

import { ref } from "vue"

import { useDataStore } from "@/store"
import axios from "axios"
import { sendDm } from "@/helpers/chatUsers"
import { dayjsSince } from "@/helpers/dates"

const store = useDataStore()
const props = defineProps({
  addFriend: Function
})

const emits = defineEmits(["dmCreated"])

const friends = ref({})

let creating = false

const getFriends = () => {
  axios
    .get("/api/friends")
    .then((res) => {
      friends.value = res.data
    })
    .catch((e) => {
      store.handleAxiosError(e)
    })
}
async function add(id) {
  await props.addFriend(id).then(() => {
    getFriends()
  })
}

const sendUserDm = async (id) => {
  if (creating) return
  creating = true

  try {
    const data = await sendDm(id)
    emits("dmCreated", data)

    creating = false
  } catch (e) {
    store.handleAxiosError(e || "Something went wrong")
    creating = false
  }
}

getFriends()
</script>
