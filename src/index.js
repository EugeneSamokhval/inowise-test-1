import './index.css'

class CalculateExpression {
  infixToRPN(expression) {
    const outputQueue = []
    const operatorStack = []
    const operators = {
      '+': { precedence: 2, associativity: 'Left' },
      '-': { precedence: 2, associativity: 'Left' },
      '*': { precedence: 3, associativity: 'Left' },
      '/': { precedence: 3, associativity: 'Left' },
      '%': { precedence: 3, associativity: 'Left' },
    }

    const tokens = expression.match(/\d+|\%|\+|\-|\*|\/|\(|\)/g)

    for (const token of tokens) {
      if (!isNaN(token)) {
        outputQueue.push(token)
      } else if (token in operators) {
        const operator1 = token
        let operator2 = operatorStack[operatorStack.length - 1]
        while (
          operator2 in operators &&
          ((operators[operator1].associativity === 'Left' &&
            operators[operator1].precedence <=
              operators[operator2].precedence) ||
            (operators[operator1].associativity === 'Right' &&
              operators[operator1].precedence <
                operators[operator2].precedence))
        ) {
          outputQueue.push(operatorStack.pop())
          operator2 = operatorStack[operatorStack.length - 1]
        }
        operatorStack.push(operator1)
      } else if (token === '(') {
        operatorStack.push(token)
      } else if (token === ')') {
        while (operatorStack[operatorStack.length - 1] !== '(') {
          outputQueue.push(operatorStack.pop())
        }
        operatorStack.pop()
      }
    }

    while (operatorStack.length > 0) {
      outputQueue.push(operatorStack.pop())
    }
    return outputQueue.join(' ')
  }
  evaluateRPN(tokens) {
    const stack = []

    for (const token of tokens.split(' ')) {
      if (!isNaN(token)) {
        stack.push(Number(token))
      } else {
        const b = stack.pop()
        const a = stack.pop()
        switch (token) {
          case '+':
            stack.push(a + b)
            break
          case '-':
            stack.push(a - b)
            break
          case '*':
            stack.push(a * b)
            break
          case '/':
            stack.push(a / b)
            break
          case '%':
            stack.push((a / 100) * b)
            break
          default:
            throw new Error('Invalid operator')
        }
      }
    }
    return stack.pop()
  }
  constructor(solvableString) {
    this.string_content = solvableString
    this.rpn_content = this.infixToRPN(solvableString)
    return this
  }
  getSolved() {
    return this.evaluateRPN(this.rpn_content)
  }
}

function changeSign(expression) {
  if (expression.startsWith('-(') && expression.endsWith(')')) {
    return expression.slice(2, -1)
  } else if (expression.startsWith('-')) {
    return '+' + expression.slice(1)
  } else if (expression.startsWith('+(') && expression.endsWith(')')) {
    return '-(' + expression.slice(2, -1) + ')'
  } else if (expression.startsWith('+')) {
    return '-' + expression.slice(1)
  } else {
    return '-(' + expression + ')'
  }
}

const numeric_buttons = document.getElementsByClassName('Numeric')
const operations = document.getElementsByClassName('Operations')
const textInputField = document.getElementById('inOutField')
const percent = document.getElementById('btn_percent')
const delete_button = document.getElementById('clear')
const solve_button = document.getElementById('btn_equals')
const reverse_sign = document.getElementById('change_sign')
const color_pickers = document.getElementsByClassName('colorPicker')

solve_button.addEventListener('mousedown', () => {
  const solution = new CalculateExpression(textInputField.value)
  const solved = solution.getSolved()
  if (solved) {
    textInputField.value = solved
  } else {
    textInputField.value = 'ERROR'
  }
})
delete_button.addEventListener('mousedown', () => {
  textInputField.textContent = ''
  textInputField.value = ''
})
for (let button of numeric_buttons) {
  button.addEventListener('mousedown', () => {
    textInputField.value += button.textContent
  })
}
for (let button of operations) {
  button.addEventListener('mousedown', () => {
    if (button.textContent !== '=') textInputField.value += button.textContent
  })
}
percent.addEventListener('mousedown', () => {
  textInputField.value += percent.textContent
})
reverse_sign.addEventListener('mousedown', () => {
  textInputField.value = changeSign(textInputField.value)
})
for (let picker of color_pickers) {
  let targets = ''
  switch (picker.id) {
    case 'backgroundColorInput':
      targets = document.getElementsByTagName('body')
      break
    case 'bordersColorInput':
      targets = document.getElementsByClassName('Calculator')
      break
    case 'numericColorInput':
      targets = document.getElementsByClassName('Numeric')
      break
    case 'operationsColorInput':
      targets = document.getElementsByClassName('Operations')
      break
    case 'toolsColorInput':
      targets = document.getElementsByClassName('Tools')
      break
    case 'textBackgroundColorInput':
      targets = document.getElementsByClassName('numberInputField')
      break
    default:
      continue
  }
  picker.addEventListener('input', function () {
    for (let target of targets) {
      console.log(target, picker, picker.value)
      target.style.backgroundColor = picker.value
    }
  })
}
document
  .getElementById('buttonsFontColorInput')
  .addEventListener('input', function (event) {
    document.getElementById('inOutField').style.color = this.value
    for (let button of document.getElementsByClassName('Button'))
      button.style.color = this.value
  })
