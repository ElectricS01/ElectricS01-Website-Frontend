<template>
  <div class="container scroll-bar">
    <h2>Welcome to ElectricS01's website</h2>
    <p class="text-main">
      Hi, I'm ElectricS01, I make things in Vue, Javascript, Python and
      GameMaker Studio
    </p>
    <div class="grid-home">
      <div class="box grid-item">
        <router-link class="border" to="/tonkgame">
          <img
            src="../assets/tonkgame.webp"
            alt="TonkGame By ElectricS01"
            class="grid-image"
          />
          <div class="small-container">
            <p class="text-medium">TonkGame (WIP)</p>
            <div class="spacer" />
            <p class="message-text-medium-gray">
              My first ever coding project, a simple 2D Top Down Shooter made
              with GameMaker Studio
            </p>
          </div>
        </router-link>
      </div>
      <div class="box grid-item">
        <router-link class="border" to="/chat">
          <img
            src="../assets/comms.webp"
            alt="BetterCommunications"
            class="grid-image"
          />
          <div class="small-container">
            <p class="text-medium">BetterCommunications</p>
            <div class="spacer" />
            <p class="message-text-medium-gray">
              BetterCommunications is free and open-source chatting platform
              available to all
            </p>
          </div>
        </router-link>
      </div>
      <div class="box grid-item">
        <router-link class="border" to="/tetris">
          <img
            src="../assets/tetris.webp"
            alt="Tetris By ElectricS01"
            class="grid-image"
          />
          <div class="small-container">
            <p class="text-medium">Tetris By ElectricS01</p>
            <div class="spacer" />
            <p class="message-text-medium-gray">
              My own rendition of the popular game Tetris made with GameMaker
              Studio
            </p>
          </div>
        </router-link>
      </div>
      <div class="box grid-item">
        <a class="border" href="https://mapit.electrics01.com">
          <img
            src="../assets/mapit.webp"
            alt="Mapit By ElectricS01"
            class="grid-image"
          />
          <div class="small-container">
            <p class="text-medium">Mapit (Demo)</p>
            <div class="spacer" />
            <p class="message-text-medium-gray">
              Mapit is an interactive school map program to make it easier for
              all people to navigate school
            </p>
          </div>
        </a>
      </div>
      <div class="box grid-item">
        <a class="border" href="https://scheduler.electrics01.com">
          <img
            src="../assets/scheduler.webp"
            alt="BetterScheduler By ElectricS01"
            class="grid-image"
          />
          <div class="small-container">
            <p class="text-medium">BetterScheduler (Demo)</p>
            <div class="spacer" />
            <p class="message-text-medium-gray">
              BetterScheduler is an interactive and simple tool to build
              schedules for school, work, and home
            </p>
          </div>
        </a>
      </div>
      <div class="box grid-item">
        <a class="border" href="https://bettercompassclub.netlify.app">
          <img
            src="../assets/bettercompassclub.webp"
            alt="BetterCompass Club By ElectricS01"
            class="grid-image"
          />
          <div class="small-container">
            <p class="text-medium">BetterCompass Club</p>
            <div class="spacer" />
            <p class="message-text-medium-gray">
              A Club/Tutorial page for BetterCompass made with HTML (No longer
              available)
            </p>
          </div>
        </a>
      </div>
      <div class="box grid-item">
        <a class="border" href="https://compass.electrics01.com">
          <img
            src="../assets/bettercompass.webp"
            alt="BetterCompass Maintained By ElectricS01"
            class="grid-image"
          />
          <div class="small-container">
            <p class="text-medium">BetterCompass By ElectricS01</p>
            <div class="spacer" />
            <p class="message-text-medium-gray">
              BetterCompass maintained by me (No longer available)
            </p>
          </div>
        </a>
      </div>
    </div>
    <div class="icon-text">
      <a
        class="message-text-large"
        href="https://www.youtube.com/electrics01"
        title="Go to My Youtube"
      >
        <img src="../assets/youtube.webp" alt="My Youtube" class="icon-image" />
        Electric S01
      </a>
      <a
        class="message-text-large"
        href="https://twitter.com/S01Electric"
        title="Go to My Discord"
      >
        <img src="../assets/twitter.webp" alt="My Discord" class="icon-image" />
        Electric S01
      </a>
      <a
        class="message-text-large"
        href="https://electrics01.itch.io"
        title="Go to My Itch.io"
      >
        <img src="../assets/itch-io.webp" alt="My Itch.io" class="icon-image" />
        ElectricS01
      </a>
      <a
        class="message-text-large"
        href="https://github.com/ElectricS01"
        title="Go to My GitHub"
      >
        <img src="../assets/github.webp" alt="My GitHub" class="icon-image" />
        ElectricS01
      </a>
      <a
        class="message-text-large"
        href="https://discord.com/users/691540630907781171"
        title="Go to My Discord"
      >
        <img src="../assets/discord.webp" alt="My Discord" class="icon-image" />
        ElectricS01
      </a>
    </div>
  </div>
</template>

<script setup>
document.getElementById("favicon").href = "/icons/favicon.ico"
</script>
