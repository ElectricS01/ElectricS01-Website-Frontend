<template>
  <div class="container-no-padding scroll-bar">
    <div class="blog-header"></div>
    <div class="blog-text">
      <h2>What's Been Happening</h2>
      <p class="text-main">
        Where have I been and what's happened since the last blog
      </p>
      <p>4/10/2024</p>
      <router-link to="/blog" class="message-text-large">Back</router-link>
    </div>
    <div class="blog-body">
      <h3>Where did I go?</h3>
      <p class="text-main">
        Hi again everyone so my last blog post was on the 11th of February,
        which is more than 7 months ago now, after my first two blog posts I
        kind of lost interest in the project and forgot about it. In the time
        since I released my last blog post I've worked on and started many new
        projects and released 17 new minor versions of my main website so let's
        get into what I've been up to.
      </p>
      <h3>Rust</h3>
      <p class="text-main">
        I intended on releasing more blog posts following my learnings of Rust,
        however I never did so, in the meantime I learnt a lot about Rust and
        applied my knowledge to my first Rust project,
        <a href="https://github.com/ElectricS01/WalterLang">WalterLang.</a>
      </p>
      <p class="text-main">
        Hopefully I find time to make more blog posts about Rust and WalterLang
        as I find it really fun to learn though I haven't really tried to make a
        larger scale project in Rust yet, maybe sometime soon?
      </p>
      <h3>Swift</h3>
      <p class="text-main">
        Before my first two blog posts I started learning Swift and SwiftUI to
        make a macOS and iOS client for
        <a href="https://github.com/Flowinity/Flowinity">Troplo's TPU.</a>
        Since then I've developed the client into a mostly functional client
        capable of all the core functionality required for viewing images and
        messaging other users. I've learnt a lot about Swift and SwiftUI and
        other technologies like Apollo GraphQL. I will definitely be making more
        blog posts about the development of TPU for macOS and iOS so stay tuned.
      </p>
      <imMygt
        style="width: 100%"
        src="https://i.electrics01.com/i/6b6447a94901.png"
      />
      <h3>My personal website</h3>
      <p class="text-main">
        So there's been 17 minor versions released to my website since the last
        blog post, these releases included loads of bug fixes to
        <router-link to="/chat">BetterCommunications,</router-link>
        more new features like WebSockets on the users list, multi-line inputs,
        the new Friends List, and Game Status which lets other users know when
        you're playing games on ElectricS01.com. I also implemented my New UI
        into my main website which I first developed last year for Mapit, after
        implementing New UI I also modernised my
        <router-link to="/">Home Page</router-link>
        to show off more projects that I developed throughout this year.
      </p>
      <h3>And that's the end</h3>
      <p class="text-main">
        So this is the end of my third and long awaited blog post, I hope to
        release many more in the future recounting the projects I developed and
        new skills I learned throughout this year. I hope to finally write that
        post on NCSS which I attended almost 7 months ago now and report on new
        updates to TPU Mac.
      </p>
      <p class="text-main">
        I also took the time to make my blog publicly accessible now so anyone
        checking out my website can see what I've been doing recently. Anyway,
        thanks again for reading if you made it this far and I'll see you very
        soon for another blog post (I promise this time).
      </p>
    </div>
  </div>
</template>

<script setup>
document.getElementById("favicon").href = "/icons/favicon.ico"
</script>
