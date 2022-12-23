<template>
  <div style="padding-left: 16px; padding-right: 16px">
    <h2>ElectricS01's Calculator</h2>
    <div className="wrapper">
      <div className="form-uname">
        <label id="nameLabel" htmlFor="nameField">Calculate: </label>
        <input id="nameField" v-model="expression" type="text" size="100" />
      </div>
      <div>
        <p id="result">{{ result }}</p>
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
      // Split the expression into an array of numbers and operators
      const tokens = this.expression.split(/\s*([+-/*^])\s*(?=\d)/)

      // Initialize the result to the first number
      let result = Number(tokens[0])

      // Iterate through the array and perform the indicated operation on the result
      // and the next number in the array
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

      // Update the result in the component's data
      this.result = result
    }
  },
  watch: {
    expression: {
      handler: "calculate",
      deep: true
    }
  }
}
</script>
