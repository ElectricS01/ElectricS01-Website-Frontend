<template>
  <h2 class="settings-text">Admin panel</h2>
  Admin info
  <div class="settings-spacer" />
  Feedback
  <div class="settings-spacer" />
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>UserID</th>
        <th>Content</th>
        <th>Created Date</th>
      </tr>
    </thead>
    <tr v-for="feedback in adminData?.feedback" :key="feedback.id">
      <td>{{ feedback.id }}</td>
      <td>{{ feedback.userId }}</td>
      <td>{{ feedback.feedback }}</td>
      <td>{{ dayjsLong(feedback.createdAt) }}</td>
      <td>
        <icons
          size="16"
          icon="delete"
          style="cursor: pointer"
          @click="deleteFeedback(feedback.id)"
        />
      </td>
    </tr>
  </table>
  <div class="settings-spacer" />
  Users
  <div class="settings-spacer" />
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Username</th>
        <th>Admin</th>
        <th>Created Date</th>
      </tr>
    </thead>
    <tr v-for="user in adminData?.users" :key="user.id">
      <td>{{ user.id }}</td>
      <td>{{ user.username }}</td>
      <td>{{ user.admin }}</td>
      <td>{{ dayjsLong(user.createdAt) }}</td>
      <td>
        <icons
          size="16"
          icon="delete"
          style="cursor: pointer"
          @click="deleteFeedback(user.id)"
        />
      </td>
    </tr>
  </table>
</template>

<script setup lang="ts">
import { dayjsLong } from "@/helpers/dates"
import { useDataStore } from "@/store"
import { AdminData } from "@/types/admin"
import axios from "axios"
import { ref } from "vue"

const store = useDataStore()

const adminData = ref<AdminData>()

const getAdmin = async () => {
  if (localStorage.getItem("token")) {
    try {
      const res = await axios.get<AdminData>("/api/admin")
      adminData.value = res.data
    } catch (e) {
      store.handleAxiosError(e)
    }
  }
}

getAdmin()

const deleteFeedback = async (id: number) => {
  try {
    await axios.delete(`/api/delete-feedback/${id}`)
    getAdmin()
  } catch (e) {
    store.handleAxiosError(e)
  }
}
</script>
