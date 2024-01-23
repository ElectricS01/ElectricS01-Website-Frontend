<template>
  <div class="container scroll-bar">
    <h2>Making a blog</h2>
    <p class="text-main">My first blog post on my new blog</p>
    <p>23/1/2024</p>
    <br />
    <h3>Why I did it?</h3>
    <p class="text-main">
      Today I made my blog, I've been wanting to make a blog for a long time and
      it's the reason I switched to using Vue.js for my website in the first
      place.
    </p>
    <p class="text-main">
      The main thing that finally got me to make my blog was wanting to log my
      learning of Rust. (coming soon)
    </p>
    <h3>How I did it?</h3>
    <p class="text-main">
      So how did I make my blog? Well all of the code is on the
      <a href="https://github.com/ElectricS01/ElectricS01-website-Frontend">
        github repo
      </a>
      but really it's not that pretty, I basically just copy and pasted my home
      page, removed a few things and renamed the file.
    </p>
    <p class="text-main">
      My really basic system which is not permanent is to just link to files in
      the Vue Router manually so every time I make a new blog post I will need
      to update the router. Just for now at least!
    </p>
    <p class="text-main">
      Also this page is really ugly for now until I can bother to style it :)
    </p>
    <h3>Other stuff!</h3>
    <p class="text-main">
      So this is version 1.200.0 of my website which sounds like a lot but back
      in the early days of this site I would increment the minor version
      multiple times a day, anyway the Vue.js version of my website is over a
      year old now which is crazy but I don't think I'll be hitting version
      1.400.0 or even 1.300.0 in a year from now but you never know.
    </p>
    <h3>It's over!</h3>
    <p class="text-main">
      Anyway, that's the end of my amazing first blog article, I probably will
      come back end make edits to it in the future but no one will know, the
      formatting definitely needs to be updated 💀. So I plan on my next post
      being about Rust and maybe more on updating my blog to actually look
      decent.
    </p>
  </div>
</template>

<script setup>
document.getElementById("favicon").href = "/icons/favicon.ico"
</script>
