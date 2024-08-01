//develop branch(just to understand the git)
const calculator = {
    displayValue: '0',
    firstOperand: null,
    typeSecondOperand: false,
    operator: null,
    expression: "",
    history: [],
};

function inputDigit(digit) {
    const { displayValue, typeSecondOperand } = calculator;

    if (typeSecondOperand === true) {
        calculator.displayValue = digit;
        calculator.typeSecondOperand = false;
    } else {
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
}

function inputDecimal(dot) {
    if (calculator.typeSecondOperand === true) {
        calculator.displayValue = '0.';
        calculator.typeSecondOperand = false;
        return;
    }

    if (!calculator.displayValue.includes(dot)) {
       calculator.displayValue += dot;
    }
}

function inputConstant(constant) {
    if (constant === 'pi') {
        calculator.displayValue += Math.PI.toString();
        calculator.expression += Math.PI.toString();
        calculate.displayValue = `${parseFloat(result.toFixed(4))}`
    } else if (constant === 'e') {
        calculator.displayValue += Math.E.toString();
        calculator.expression += Math.E.toString();
        calculate.displayValue = `${parseFloat(result.toFixed(4))}`;
    }
}

function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);

    if (nextOperator === 'sin' || nextOperator === 'cos' || nextOperator === 'tan') {
        const result = calculateTrig(inputValue, nextOperator);
        calculator.displayValue = `${parseFloat(result.toFixed(4))}`;
        calculator.firstOperand = result;
        calculator.typeSecondOperand = false;
        calculator.operator = null;
        return;
    }

    if (operator && calculator.typeSecondOperand) {
        calculator.operator = nextOperator;
        calculator.expression = calculator.expression.slice(0, -1) + nextOperator;
        return;
    }
    if (nextOperator === '√') {
        const result = calculate(inputValue, null, nextOperator);
        calculator.displayValue = `${parseFloat(result.toFixed(4))}`;
        calculator.firstOperand = result;
        calculator.typeSecondOperand = false;
        calculator.operator = null;
        calculator.expression = `${parseFloat(result.toFixed(4))}`;
        return;
    }

    if (firstOperand == null && !isNaN(inputValue)) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);

        calculator.displayValue = `${parseFloat(result.toFixed(4))}`;
        calculator.firstOperand = result;
    }

    calculator.typeSecondOperand = true;
    calculator.operator = nextOperator;
    calculator.expression += nextOperator;
}

function calculate(firstOperand, secondOperand, operator) {
    if (operator === '+') {
        console.log(firstOperand + secondOperand)
        return firstOperand + secondOperand;
    } else if (operator === '-') {
        return firstOperand - secondOperand;
    } else if (operator === '*') {
        return firstOperand * secondOperand;
    }
    else if(operator === '/'){
        if(secondOperand === 0){
            throw newError("Division by zero");
        }
        return firstOperand / secondOperand;
    }
    else if(operator === '**'){
        return firstOperand ** secondOperand;
    }
    else if(operator === '√'){
       return Math.sqrt(firstOperand) ;
    }

    return secondOperand;
}
function handleParenthesis(paren) {
    calculator.expression += paren;
    calculator.displayValue += paren;
}

function calculateTrig(value, operator) {
    if (operator === 'sin') {
        return Math.sin(value);
    } else if (operator === 'cos') {
        return Math.cos(value);
    } else if (operator === 'tan') {
        return Math.tan(value);
    }
}

function evaluateExpression() {
    try {
        if (calculator.expression === '' || /[^0-9+\-*/().]/.test(calculator.expression)) {
            throw new Error("Invalid Expression");
        }
        const result = eval(calculator.expression);
        if (result === Infinity || result === -Infinity) {
            throw new Error("Division by zero");
        }
        const resultStr = `${parseFloat(result.toFixed(4))}`;

        addToHistory(calculator.expression, resultStr);
        calculator.displayValue = resultStr;
        calculator.expression = resultStr;
        calculator.firstOperand = result;
        calculator.operator = null;
        calculator.typeSecondOperand = false;

        calculator.displayValue = `${parseFloat(result.toFixed(4))}`;
        calculator.expression = `${parseFloat(result.toFixed(4))}`;
        calculator.firstOperand = result;
        calculator.operator = null;
        calculator.typeSecondOperand = false;
    } catch (error) {
        calculator.displayValue = error.expression;
        calculator.expression = '';
        calculator.firstOperand = null;
        calculator.operator = null;
        calculator.typeSecondOperand = false;
    }
}

function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.typeSecondOperand = false;
    calculator.operator = null;
}

function addToHistory(expression, result) {
    const historyItem = { expression, result };
    calculator.history.push(historyItem);
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';

    calculator.history.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.expression} = ${item.result}`;
        listItem.dataset.index = index;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-history');
        deleteButton.dataset.index = index;
        listItem.appendChild(deleteButton);
        historyList.appendChild(listItem);
    });
}

function deleteHistoryItem(index) {
    calculator.history.splice(index, 1);
    updateHistoryDisplay();
}

function reuseHistoryItem(index) {
    const historyItem = calculator.history[index];
    calculator.displayValue = historyItem.result;
    calculator.expression = historyItem.result;
    updateDisplay();
}

function updateDisplay() {
    const display = document.querySelector('.calculator-screen');
    display.value = calculator.displayValue;
}

updateDisplay();

const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
    const { target } = event;

    if (!target.matches('button')) {
        return;
    }

    if (target.classList.contains('operator')) {
        handleOperator(target.value);
        updateDisplay();
        return;
    }

    if (target.classList.contains('decimal')) {
        inputDecimal(target.value);
        updateDisplay();
        return;
    }

    if(target.classList.contains('parenthesis')){
        handleParenthesis(target.value);
        updateDisplay();
        return;
    }

    if(target.classList.contains('trig')){
        handleOperator(target.value);
        return;
    }

    if(target.classList.contains('constant')){
        inputConstant(target.value);
        return;
    }

   
    if (target.classList.contains('all-clear')) {
        resetCalculator();
        updateDisplay();
        return;
    }
    if(target.classList.contains('equal-sign')){
        evaluateExpression();
        updateDisplay();
        return;
    }

    inputDigit(target.value);
    updateDisplay();
});

document.getElementById('history-list').addEventListener('click', (event) => {
    const { target } = event;

    if (target.matches('button.delete-history')) {
        const index = target.dataset.index;
        deleteHistoryItem(index);
    } else if (target.matches('li')) {
        const index = target.dataset.index;
        reuseHistoryItem(index);
    }
});
