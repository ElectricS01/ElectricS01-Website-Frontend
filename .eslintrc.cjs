module.exports = {
  root: true,
  env: {
    node: true
  },
  plugins: ["prettier"],
  extends: ["plugin:vue/vue3-recommended", "eslint:recommended", "prettier"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "vue/multi-word-component-names": "off",
    "vue/require-default-prop": "off",
    "vue/no-v-html": "off"
  }
}
