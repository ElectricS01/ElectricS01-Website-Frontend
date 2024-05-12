<template>
  <div style="flex-grow: 1; display: flex; flex-direction: column">
    <div
      v-for="friend in friends"
      :key="friend.id"
      style="display: flex; background-color: #282a2b; margin: 8px"
    >
      <div style="padding: 8px">
        {{ friend.user.username }}
      </div>
      <button
        v-if="!friend.status"
        class="profile-button-add"
        style="color: #47bf4c; width: fit-content"
        @click="addFriend(friend.user.id)"
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
        @click="addFriend(friend.user.id)"
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
        @click="addFriend(friend.user.id)"
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
        @click="addFriend(friend.user.id)"
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
import Icons from "@/components/core/Icons.vue"

import { defineProps, ref } from "vue"

import { useDataStore } from "@/stores/main"
import axios from "axios"

const store = useDataStore()
defineProps({
  addFriend: Function
})

const friends = ref({})

axios
  .get(`/api/friends`)
  .then((res) => {
    friends.value = res.data
  })
  .catch((e) => {
    store.error = `Error 503, Cannot Connect to Server ${e}`
    setTimeout(store.errorFalse, 5000)
  })
</script>
