<template>
  <div
    class="container scroll-bar"
    style="padding: 0 16px; text-align: left; width: calc(100% - 32px)"
  >
    <h2>ElectricS01's Calculator</h2>
    <label for="equation">Enter your equation:</label>
    <input id="equation" v-model="equation" type="text" autocomplete="off" />
    <p class="text-main" id="result">{{ result }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      equation: "",
      result: null
    }
  },
  methods: {
    calculate(operator, operand1, operand2) {
      switch (operator) {
        case "+":
          return operand1 + operand2
        case "-":
          return operand1 - operand2
        case "*":
          return operand1 * operand2
        case "/":
          return operand1 / operand2
        case "^":
          return Math.pow(operand1, operand2)
        default:
          throw new Error("Invalid operator")
      }
    },
    evaluateExpression(tokens) {
      const precedence = {
        "+": 1,
        "-": 1,
        "*": 2,
        "/": 2,
        "^": 3
      }

      const values = []
      const operators = []

      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i]

        if (!isNaN(token)) {
          values.push(parseFloat(token))
        } else if (token in precedence) {
          while (
            operators.length > 0 &&
            operators[operators.length - 1] in precedence &&
            precedence[operators[operators.length - 1]] >= precedence[token]
          ) {
            const operator = operators.pop()
            const operand2 = values.pop()
            const operand1 = values.pop()
            const result = this.calculate(operator, operand1, operand2)
            values.push(result)
          }
          operators.push(token)
        } else if (token === "(") {
          operators.push(token)
        } else if (token === ")") {
          while (
            operators.length > 0 &&
            operators[operators.length - 1] !== "("
          ) {
            const operator = operators.pop()
            const operand2 = values.pop()
            const operand1 = values.pop()
            const result = this.calculate(operator, operand1, operand2)
            values.push(result)
          }
          if (
            operators.length === 0 ||
            operators[operators.length - 1] !== "("
          ) {
            throw new Error("Mismatched parentheses")
          }
          operators.pop()
        } else {
          throw new Error("Invalid token: " + token)
        }
      }
      while (operators.length > 0) {
        const operator = operators.pop()
        const operand2 = values.pop()
        const operand1 = values.pop()
        const result = this.calculate(operator, operand1, operand2)
        values.push(result)
      }

      if (values.length !== 1 || operators.length !== 0) {
        throw new Error("Invalid expression")
      }

      return values[0]
    },
    calculateResult() {
      try {
        const regex = /(\d*\.?\d+)|(.)|([\+\-\*\/\(\)])/g
        const tokens = this.equation.match(regex)

        if (tokens === null) {
          this.result = "0"
          return
        }
        let result = []
        let addMultiplication = false
        for (let i = 0; i < tokens.length; i++) {
          if (tokens[i] === "-" && i > 0 && tokens[i - 1] === "^") {
            let merged = tokens[i] + tokens[i + 1]
            result.pop()
            result.push("^", merged)
            i++
          } else if (tokens[i] === "(" && i > 0) {
            if (!isNaN(tokens[i - 1]) || tokens[i - 1] === ")") {
              if (!addMultiplication && result[result.length - 1] !== "*") {
                result.push("*", tokens[i])
                addMultiplication = false
              } else {
                result.push(tokens[i])
              }
            } else {
              result.push(tokens[i])
            }
          } else if (tokens[i] === ")" && i < tokens.length - 1) {
            if (!isNaN(tokens[i + 1]) || tokens[i + 1] === "(") {
              if (!addMultiplication && result[result.length - 1] !== "*") {
                result.push(tokens[i], "*")
                addMultiplication = false
              } else {
                result.push(tokens[i])
              }
            } else {
              result.push(tokens[i])
            }
          } else {
            result.push(tokens[i])
          }
        }
        this.result = this.evaluateExpression(result)
      } catch (error) {
        this.result = error.message
      }
    }
  },
  watch: {
    equation: {
      handler: "calculateResult",
      deep: true
    }
  },
  mounted() {
    const favicon = document.getElementById("favicon")
    favicon.href = "/icons/favicon.ico"
  }
}
</script>
