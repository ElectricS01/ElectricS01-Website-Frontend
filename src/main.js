import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./App.vue"
import router from "./router"
import MarkdownIt from "markdown-it"

const md = new MarkdownIt({
  linkify: true
})

const pinia = createPinia()
const app = createApp(App).use(router)

// Modify the 'p' rule to return an empty string
md.renderer.rules.paragraph_open = () => ""

app.directive("markdown", {
  mounted(el) {
    // Extract the message contents and (edited) status
    // Copy the b element out of the container element
    const bElement = el.querySelector("b.message-text-small")
    let editedText = ""
    if (bElement) {
      editedText = bElement.outerHTML
      bElement.parentNode.removeChild(bElement)
    }

    // Add the "(edited)" text back to the container element
    if (el.contains(bElement)) {
      editedText += "(edited)"
    }

    // Create a new element to contain the processed content
    const container = document.createElement("div")

    // Process the text content with the Markdown library then set it as the innerHTML of the container element
    container.innerHTML = md.render(el.textContent)

    // Append the "(edited)" text after the processed content
    if (editedText) {
      container.insertAdjacentHTML("beforeend", editedText)
    }

    // Remove all 'p' elements from the container
    const paragraphs = container.querySelectorAll("p")
    paragraphs.forEach((paragraph) => paragraph.remove())

    // Replace the content of the original div element with the processed content
    el.innerHTML = container.innerHTML
  }
})

app.use(pinia)
app.mount("#app")
