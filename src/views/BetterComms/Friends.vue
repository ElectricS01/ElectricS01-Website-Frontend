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
      "
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
      <div style="padding: 8px">{{ store.dayjsSince(friend.createdAt) }}</div>
    </div>
  </div>
</template>

<script setup>
import ProfilePicture from "@/components/ProfilePicture.vue"
import Icons from "@/components/core/Icons.vue"

import { ref } from "vue"

import { useDataStore } from "@/store"
import axios from "axios"

const store = useDataStore()
const props = defineProps({
  addFriend: Function
})

const friends = ref({})

const getFriends = () => {
  axios
    .get("/api/friends")
    .then((res) => {
      friends.value = res.data
    })
    .catch((e) => {
      store.error = `Error 503, Cannot Connect to Server ${e}`
      setTimeout(store.errorFalse, 5000)
    })
}
async function add(id) {
  await props.addFriend(id).then(() => {
    getFriends()
  })
}

getFriends()
</script>
