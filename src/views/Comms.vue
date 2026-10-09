<template>
  <div class="container scroll-bar">
    <h1>Welcome to BetterComms</h1>
    <p class="text-main">
      BetterComms is free and open-source chatting platform available to all
    </p>
    <router-link class="button" to="/register" title="Register to BetterComms">
      Get started for free
    </router-link>
    <router-link class="button" to="/login" title="Login to BetterComms">
      or Login
    </router-link>
    <h3 style="margin-top: 50px">Why BetterComms?</h3>
    <div class="grid-home">
      <div class="grid-item">
        <div class="border">
          <div class="small-container">
            <h2>Free</h2>
            <p class="text-main">BetterComms is completely free forever</p>
          </div>
        </div>
      </div>
      <div class="grid-item">
        <div class="border">
          <div class="small-container">
            <h2>Secure</h2>
            <p class="text-main">
              End-to-end encryption ensures your messages are only visible to
              you and the recipient
            </p>
          </div>
        </div>
      </div>
      <div class="grid-item">
        <div class="border">
          <div class="small-container">
            <h2>Open source</h2>
            <p class="text-main">
              Our source-code is available for free on GitHub
            </p>
            <a
              class="button"
              href="https://github.com/ElectricS01/electrics01-website-frontend"
              title="GitHub repository"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>
      <div class="grid-item">
        <div class="border">
          <div class="small-container">
            <h2>Easy to get started</h2>
            <p class="text-main">
              Sign up for free and start chatting in minutes
            </p>
            <router-link
              class="button"
              to="/register"
              title="Register to BetterComms"
            >
              Get started for free
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"

const router = useRouter()

if (localStorage.getItem("token")) {
  router.push("/chat")
}
</script>
