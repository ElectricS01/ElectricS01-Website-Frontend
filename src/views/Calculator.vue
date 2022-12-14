<template>
  <div style="padding-left:16px; padding-right:16px">
    <h2>ElectricS01's Calculator</h2>
    <div class='wrapper'>
      <div class='form-uname'>
        <label id='nameLabel' for='nameField'>Calculate: </label>
        <input id='nameField' v-model='input' type='text' size = '100'>
      </div>
      <div>
        <p id='result'>{{calculate}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
name: "Calculator",
  data(){
    return{
      input: ''
    }
  },
  computed:{


    calculate() {
  let nameField = this.input
  let equation
  if(Number(nameField)) {
    equation = parseFloat(nameField)
  } else {
    equation = nameField
  }
  let solution = ''
  let op = ''
  let times = ['*', 'X', 'x']

  if(equation === '9+10' || equation === '9 + 10') {
    solution = 21

  } else if(Number(equation) || equation === '0') {
    solution = equation

  } else {
    let num0 = ''
    let num1 = ''
    for (let digit in equation) {
      if(equation[digit] === '-' && !Number(equation[digit-1])){
        if(num0 === '') {
          num0 += equation[digit].toString()
          console.log('yeet1')
        } else {
          num1 += equation[digit].toString()
          console.log('yeet2')
        }
      } else if(Number(equation[digit]) || equation[digit] === '.' || equation[digit] === '0') {
        num1 += equation[digit].toString()
        console.log(num1 + 'num1')
      } else {
        num0 = num1.toString()
        num1 = ''
        op = equation[digit].toString()
        console.log('num0=num1')
      }
    }
    if (equation[0] === '-') {
      num0 = '-' + num0
    }

    try {
      console.log(num0)
      console.log(num1)
      if (equation.includes('^')) {
        solution = Math.pow(parseFloat(num0), parseFloat(num1))
      } else if (times.includes(op)) {
        solution = parseFloat(num0) * parseFloat(num1)
      } else if (equation.includes('/')) {
        solution = parseFloat(num0) / parseFloat(num1)
      } else if (equation.includes('+')) {
        solution = parseFloat(num0) + parseFloat(num1)
      } else if (equation.includes('-')) {
        solution = parseFloat(num0) - parseFloat(num1)
      }
    } catch {
      solution = 'Number is to large'
    }
  }

  return solution
}
  },
  mounted() {
    const favicon = document.getElementById("favicon");
    favicon.href = "/icons/mainicon.ico";
  }
}
</script>


