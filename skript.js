
const display = document.getElementById("display");
const numbers = document.querySelectorAll(".numbers");
const operators = document.querySelectorAll(".operators");
const backspaceButton = document.getElementById("backspace");
const clearButton = document.getElementById("clear");
const sumButton = document.getElementById("sum");

let screenValue = 0;
let oldValue;
let action = false;

numbers.forEach((number) => {
    number.addEventListener('click', (e) => {
        e.target.classList.add('press');
        setScreenValue(number.id);
    });
}); 

function setScreenValue(inputNumber) {
    const maxDisplayLength = 6;
 
    if (screenValue == 0) {screenValue = inputNumber}
    else if (screenValue % 1 != 0) {parseFloat(screenValue, 10).toFixed(1)} //hvis det er decimaler i input får de bare lov å bruke ett.
    else if(screenValue.length >= maxDisplayLength) {screenValue}
    else {screenValue += inputNumber};

    display.textContent = screenValue;
}

operators.forEach((operator) => {
    operator.addEventListener('click', (e) => {
        e.target.classList.add('press');
        saveAction(operator.id);
    });
}); 

function saveAction(operation) {
    const presentValue = parseFloat(screenValue,10);

    if(action) {
        oldValue = operator(action, oldValue, presentValue);
        action = operation;
    } else {
        oldValue = presentValue;
        action = operation;
    }
    
    screenValue = 0;
};

function operator(operation, a, b) {
    switch(operation) {
        case "add":
            return a+b;
        case "sub":
            return a-b;
        case "multiply":
            return a*b;
        case "divide":
            return a/b
    }
}

sumButton.addEventListener("click", (e) => {
    e.target.classList.add('press');
    calculateSum();
});

function calculateSum() { 
    if (action == "divide" && screenValue == 0) { // om luringen prøver å dele på 0..
        clearVariables();
        display.textContent = "TULLING";
    } else { //summer, og vis
        const newValue = parseFloat(screenValue, 10);
        let sum = operator(action, oldValue, newValue);
        if(sum.toString().length > 6) {sum = sum.toExponential(3)};
        display.textContent = sum;
        screenValue = 0;
        action = false;
    };
}

backspaceButton.addEventListener("click", (e) => {
    e.target.classList.add('press');
    removeLastNumber();
});

function removeLastNumber() {
    if(screenValue.toString().length <= 1) {screenValue = 0}
    else {screenValue = screenValue.slice(0, -1)};
    display.textContent = screenValue;
}

clearButton.addEventListener("click", (e) => {
    e.target.classList.add('press');
    clearVariables();
});

function clearVariables() {
    screenValue = 0;
    oldValue = 0;
    action = false;
    display.textContent = screenValue;
};

/* 
=================================
==== Keyboard EventListeners ====
=================================
 */

window.addEventListener("keypress", (e) => {
    if(e.charCode == 47) {e.preventDefault()}
    const number = document.getElementById(`${e.key}`);
    const operation = document.querySelector(`div[data-key="${e.key}"]`);
    if(e.key == "Enter" || e.key == "=") {
        calculateSum();
        sumButton.classList.add("press");
    } else if(number) {
        setScreenValue(e.key);
        number.classList.add("press");
    } else if(operation){
        saveAction(operation.id);
        operation.classList.add("press");
    } else {return};
});

window.addEventListener("keydown", (e) => {
    if(e.key == "Backspace") {
        e.preventDefault();
        removeLastNumber();
        backspaceButton.classList.add("press");
    } else {return};
});

//Transition events
const buttons = document.querySelectorAll('.button');
buttons.forEach(button => button.addEventListener('transitionend', removeTransition));

function removeTransition(e) {
    if (e.propertyName !== 'transform') return;
    e.target.classList.remove('press');
  }