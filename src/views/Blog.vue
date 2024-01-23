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
