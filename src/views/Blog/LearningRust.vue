<template>
  <div class="container-no-padding scroll-bar">
    <div class="blog-header"></div>
    <div class="blog-text">
      <h2>Learning Rust</h2>
      <p class="text-main">My first experiences learning Rust</p>
      <p>11/2/2024</p>
      <router-link to="/blog" class="message-text-large">Back</router-link>
    </div>
    <div class="blog-body">
      <h3>Why did I do it?</h3>
      <p class="text-main">
        I've been interested in learning
        <a href="https://www.rust-lang.org/">Rust</a>
        for a long time now but the thing that finally did it for me was going
        to
        <a href="https://groklearning.com/ncss/">the NCSS</a>
        (NCSS blog post coming soon). At NCSS I met loads of people who already
        were doing Rust and this finally pushed me over the edge on learning it.
      </p>
      <p class="text-main">
        So as soon as I got home I knew I wanted to learn Rust and here's how I
        went.
      </p>
      <h3>How I did it?</h3>
      <p class="text-main">
        So how did I manage to learn Rust all by myself? Well it was quite easy
        to learn the basics, I spent a few hours reading the first few chapters
        of
        <a href="https://doc.rust-lang.org/book/">
          The Rust Programming Language "Book"
        </a>
        which taught me all of the basics like defining variables, taking user
        input, manipulating data, and how data types work in Rust.
      </p>
      <p class="text-main">
        The "Book" also explains how to use Rust's built in package manager,
        compiler, and package distributor called
        <a href="https://doc.rust-lang.org/cargo/">Cargo</a>
        which you use to set up projects, install dependencies, and compile the
        project.
      </p>
      <p class="text-main">
        If you are interested I even came up with some quick Zsh aliases for my
        <a
          href="https://github.com/ElectricS01/Runcom-config-files/blob/main/.zshrc"
        >
          .zshrc
        </a>
        file hosted on my GitHub.
      </p>
      <h3>What I made</h3>
      <p class="text-main" v-markdown>
        So my first project in Rust was "Hello, world!" which is the most
        important project for anyone to do when programming, this was simple
        enough teaching me to use the main function and Rust macros.
      </p>
      <pre>
        fn main() {
          println!("Hello,__ world!");
        }
      </pre>
      <p class="text-main">
        So next I got to excepting input which was slightly more complex, this
        was the next project in
        <a href="https://doc.rust-lang.org/book/">
          The Rust Programming Language "Book"
        </a>
        which was a guessing game where you had to except an input and return a
        message saying weather the number guessed was too low, too high, or
        correct. Full code for the
        <a
          href="https://github.com/ElectricS01/Rust-Projects/blob/main/guessing_game/src/main.rs"
        >
          guessing game is here.
        </a>
      </p>
      <h3>Before we go</h3>
      <p class="text-main" v-markdown>
        So this is version 1.201.0 now of my website which is only 1 version
        higher
        <router-link to="/blog/first-post">than the last blog post</router-link>
        about making this blog. In the 1.200.0 version of the blog there wasn't
        really much custom CSS and I pretty much just reused my home page
        however in this version I've added the header with a banner which is a
        temporary image, and I've moved the text to the left rather than being
        centred. Additionally, in this post I've tried the `&#60;code>` html
        element to be a bit more unique than just a wall of text.
      </p>
      <h3>It's over again!</h3>
      <p class="text-main">
        So this is the end of my second blog post and probably my first blog
        post on Rust! Next I want to write a post about NCSS, then probably
        another one about my Rust adventures, I also want to add more features
        to my blog and maybe even make it public at some point. The last thing I
        added to 1.201.0 was a link to
        <a href="https://scheduler.electrics01.com/">BetterScheduler</a>
        which is my new scheduling app made with Vue.js and Vite.js to help me
        keep track of my school schedule, hope it's interesting and maybe even
        useful to you. Anyway thanks for reading, bye!
      </p>
    </div>
  </div>
</template>

<script setup>
document.getElementById("favicon").href = "/icons/favicon.ico"
</script>
