<template>
  <div class="container scroll-bar">
    <h2>Welcome to ElectricS01's website</h2>
    <p class="text-main">
      Hi, I'm ElectricS01, I'm a passionate programmer with experince in
      Full-Stack Web Application, Desktop, and CLI development.
    </p>
    I develop projects with Vue, Javascript, Python, C#/.NET, SwiftUI, Rust, and
    GameMaker Studio.
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
        <a class="border" href="https://github.com/ElectricS01/TPU-Mac">
          <img src="../assets/tpumac.webp" alt="TPU Mac" class="grid-image" />
          <div class="small-container">
            <p class="text-medium">TPU Mac</p>
            <div class="spacer" />
            <p class="message-text-medium-gray">
              A native macOS App for Troplo's TPU file hoster made with SwiftUI
            </p>
          </div>
        </a>
      </div>
      <div class="box grid-item">
        <router-link class="border" to="/tetris">
          <img
            style="object-fit: contain; background-color: #000"
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
        <a class="border" href="https://planit.electrics01.com">
          <img
            src="../assets/planit.png"
            alt="Planit By ElectricS01"
            class="grid-image"
          />
          <div class="small-container">
            <p class="text-medium">Planit</p>
            <div class="spacer" />
            <p class="message-text-medium-gray">
              Planit is a modern and advanced project management software
              solution
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
        <a class="border" href="https://flowinity.com">
          <img
            src="https://troplo.com/images/proj01.png"
            alt="TPU"
            class="grid-image"
          />
          <div class="small-container">
            <p class="text-medium">TPU</p>
            <div class="spacer" />
            <p class="message-text-medium-gray">
              I've contributed changes and bug fixes to the open source file
              hoster TPU
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
    <div style="display: flex; justify-content: center">
      <div class="contact-menu">
        <h2>Contact Me</h2>
        <div class="contact-grid">
          <router-link
            class="message-text-large"
            to="/user/1"
            title="Go to My Youtube"
          >
            <icons size="32" style="padding-right: 6px" icon="message"></icons>
            BetterCommunications
          </router-link>
          <a
            class="message-text-large"
            href="https://twitter.com/S01Electric"
            title="Go to My Discord"
          >
            <icons size="32" style="padding-right: 6px" icon="twitter"></icons>
            Xwitter
          </a>
          <a
            class="message-text-large"
            href="https://discord.com/users/691540630907781171"
            title="Go to My Discord"
          >
            <icons size="32" style="padding-right: 6px" icon="discord"></icons>
            Discord
          </a>
          <a
            class="message-text-large"
            href="mailto:electrics01@electrics01.com"
            title="Go to My Discord"
          >
            <icons size="32" style="padding-right: 6px" icon="mail"></icons>
            Email
          </a>
          <a
            class="message-text-large"
            href="https://electrics01.itch.io"
            title="Go to My Itch.io"
          >
            <icons size="32" style="padding-right: 6px" icon="itchio"></icons>
            Itch.io
          </a>
          <a
            class="message-text-large"
            href="https://github.com/ElectricS01"
            title="Go to My GitHub"
          >
            <icons size="32" style="padding-right: 6px" icon="github"></icons>
            Github
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Icons from "@/components/core/Icons.vue"

document.getElementById("favicon").href = "/icons/favicon.ico"
</script>
