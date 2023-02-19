<template>
  <div style="text-align: center">
    <h2>Welcome to ElectricS01's website</h2>
    <p>
      Hi, I'm ElectricS01, I make random things in Vue, Javascript, Python and
      GameMaker
    </p>
    <br />

    <div class="grid">
      <div class="box grid-item">
        <router-link to="/tonkgame">
          <div class="border">
            <img
              src="../assets/tonkgame.png"
              alt="TonkGame By ElectricS01"
              style="width: 300px; height: 300px"
            />
            <p>TonkGame(WIP)</p>
          </div>
        </router-link>
      </div>
      <div class="box grid-item">
        <router-link to="/tetris">
          <div class="border">
            <img
              src="../assets/tetris.png"
              alt="Tetris By ElectricS01"
              style="width: 300px; height: 300px"
            />
            <p>Tetris By ElectricS01(WIP)</p>
          </div>
        </router-link>
      </div>
      <div class="box grid-item">
        <a href="https://bettercompassclub.netlify.app">
          <div class="border">
            <img
              src="../assets/bettercompassclub.png"
              alt="BetterCompass Club By ElectricS01"
              style="width: 300px; height: 300px"
            />
            <p>BetterCompass Club</p>
          </div>
        </a>
      </div>
    </div>
    <br />
    <a href="https://www.youtube.com/electrics01" title="Go to My Youtube">
      <img
        src="../assets/youtube.png"
        alt="My Youtube"
        style="width: 18px; height: 12px"
      />
      Electric S01
    </a>
    <br />
    <br />
    <a href="https://electrics01.itch.io" title="Go to My Itch.io">
      <img
        src="../assets/itch-io.png"
        alt="My Itch.io"
        style="width: 18px; height: 12px"
      />
      ElectricS01
    </a>
    <br />
    <br />
    <a href="https://github.com/ElectricS01" title="Go to My GitHub">
      <img
        src="../assets/github.png"
        alt="My GitHub"
        style="width: 18px; height: 12px"
      />
      ElectricS01
    </a>
    <br />
    <br />
    <a
      href="https://discord.com/users/691540630907781171"
      title="Go to My Discord"
    >
      <img
        src="../assets/discord.png"
        alt="My Discord"
        style="width: 18px; height: 12px"
      />
      ElectricS01
    </a>
  </div>
</template>

<script>
export default {
  mounted() {
    const favicon = document.getElementById("favicon")
    favicon.href = "/icons/mainicon.ico"
  }
}
</script>
