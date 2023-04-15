<template>
  <div
    style="
      position: fixed;
      top: 48px;
      width: 100%;
      height: calc(100% - 48px);
      overflow-y: auto;
    "
  >
    <div style="padding-left: 16px; padding-right: 16px">
      <h2>ElectricS01's Calculator</h2>
      <div>
        <div>
          <label id="nameLabel">Calculate:</label>
          <input id="nameField" v-model="expression" type="text" class="text" />
        </div>
        <div>
          <p id="result">{{ result }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      expression: "",
      result: 0
    }
  },
  methods: {
    calculate() {
      const tokens = this.expression.split(/\s*([+-/*^])\s*(?=\d)/)

      let result = Number(tokens[0])

      for (let i = 1; i < tokens.length; i += 2) {
        const operator = tokens[i]
        const operand = Number(tokens[i + 1])
        if (operator === "+") {
          result += operand
        } else if (operator === "-") {
          result -= operand
        } else if (operator === "*") {
          result *= operand
        } else if (operator === "/") {
          result /= operand
        } else if (operator === "^") {
          result = Math.pow(result, operand)
        }
      }

      this.result = result
    }
  },
  watch: {
    expression: {
      handler: "calculate",
      deep: true
    }
  },
  mounted() {
    const favicon = document.getElementById("favicon")
    favicon.href = "/icons/favicon.ico"
  }
}
</script>
