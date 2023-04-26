<template>
  <div class="container">
    <div style="padding: 0 8px 8px 8px">
      <h2>Welcome to ElectricS01's website</h2>
      <p class="text-main">
        Hi, I'm ElectricS01, I make random things in Vue, Javascript, Python and
        GameMaker
      </p>
      <div class="grid">
        <div class="box grid-item">
          <router-link class="border" to="/tonkgame">
            <img
              src="../assets/tonkgame.webp"
              alt="TonkGame By ElectricS01"
              class="grid-image"
            />
            <p style="margin-top: 12px">TonkGame(WIP)</p>
          </router-link>
        </div>
        <div class="box grid-item">
          <router-link class="border" to="/tetris">
            <img
              src="../assets/tetris.webp"
              alt="Tetris By ElectricS01"
              class="grid-image"
            />
            <p style="margin-top: 12px">Tetris By ElectricS01</p>
          </router-link>
        </div>
        <div class="box grid-item">
          <a class="border" href="https://bettercompassclub.netlify.app">
            <img
              src="../assets/bettercompassclub.webp"
              alt="BetterCompass Club By ElectricS01"
              class="grid-image"
            />
            <p style="margin-top: 12px">BetterCompass Club</p>
          </a>
        </div>
      </div>
      <div class="icon-text">
        <a
          class="message-text-large"
          href="https://www.youtube.com/electrics01"
          title="Go to My Youtube"
        >
          <img
            src="../assets/youtube.webp"
            alt="My Youtube"
            class="icon-image"
          />
          Electric S01
        </a>
        <a
          class="message-text-large"
          href="https://twitter.com/S01Electric"
          title="Go to My Discord"
        >
          <img
            src="../assets/twitter.webp"
            alt="My Discord"
            class="icon-image"
          />
          Electric S01
        </a>
        <a
          class="message-text-large"
          href="https://electrics01.itch.io"
          title="Go to My Itch.io"
        >
          <img
            src="../assets/itch-io.webp"
            alt="My Itch.io"
            class="icon-image"
          />
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
          <img
            src="../assets/discord.webp"
            alt="My Discord"
            class="icon-image"
          />
          ElectricS01
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    const favicon = document.getElementById("favicon")
    favicon.href = "/icons/favicon.ico"
  }
}
</script>
