<template>
  <div class="container scroll-bar">
    <h2>Welcome to ElectricS01's blog</h2>
    <p class="text-main">
      Hi, I'm ElectricS01, I make things in Vue, Javascript, Python and
      GameMaker Studio
    </p>
    <div class="grid-home">
      <div class="box grid-item">
        <router-link class="border" to="/blog/first-post">
          <div class="small-container">
            <p class="text-medium">Making a blog</p>
            <div class="spacer" />
            <p class="message-text-medium-gray">
              My first blog post on my new blog
            </p>
          </div>
        </router-link>
      </div>
      <div class="box grid-item">
        <router-link class="border" to="/blog/learning-rust">
          <div class="small-container">
            <p class="text-medium">Learning Rust</p>
            <div class="spacer" />
            <p class="message-text-medium-gray">
              My first experiences learning Rust
            </p>
          </div>
        </router-link>
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
document.getElementById("favicon").href = "/icons/favicon.ico"
</script>
