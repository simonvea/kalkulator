

const numbers = document.querySelectorAll(".numbers");
const operators = document.querySelectorAll(".operators");
const display = document.getElementById("display")

let temp = 0;
let presentValue;
let oldValue;
let sum = 0;
let action;

display.textContent = temp;

//math functions below
function add(a,b) {
    return a + b;
};

function sub(a,b) {
    return a - b;
};

function multiply(a,b) {
    return a*b;
};

function divide(a,b) {
    return a/b;
};

function operator(operation, a, b) {
    return operation(a,b);
}

//faktisk funksjonalitet
function useNumber(n) {

    if(n == "backspace") {
        if(temp.toString().length <= 1) {temp = 0}
        else {temp = temp.slice(0, -1)};
        display.textContent = temp;

    } else {
        //viser tallene på displayet og lagrer verdiene i temp.
        if (temp == 0) {temp = n}
        else if (temp % 1 != 0) {parseFloat(temp,10).toFixed(1)} //hvis det er decimaler i input får de bare lov å bruke ett.
        else if(temp.length >= 6) {temp} //forhindrer display overflow
        else {temp += n};
        display.textContent = temp;
    };  
}

function actions(id) {

    if (id == "sum") {
        //det som ble trykket på før =
        presentValue = parseFloat(temp,10);

        //sjekker om luringen prøver å dele på 0

        if (action == "divide" && temp == 0) {

            clearVariables();
            
            display.textContent = "TULLING";

        } else { //summer, og vis

            sum = operator(window[action], oldValue, presentValue);
            if(sum.toString().length > 6) {sum = sum.toExponential(3)};
            oldValue = sum;
            display.textContent = sum;
        };
        

    } else if (id == "clear") {
        clearVariables()
    } else { //hvis det blir klikket på noen av operatorene..
        
        presentValue = parseFloat(temp,10); //lagrer input

        //hvis det allerede finnes en gammel verdi, summer verdiene basert på forrige operator
        if(oldValue !== undefined) {sum = operator(window[action], oldValue, presentValue)}

        //arkiverer input eller gammel verdi
        oldValue !== undefined ? oldValue = sum : oldValue = presentValue;  

        action = id;  //lagrer hva som ble trykket på
    };

    temp = 0; //nullstiller display
};

function clearVariables() {
    temp = 0;
    presentValue = undefined;
    oldValue = undefined;
    sum = 0;
    display.textContent = temp;
};

//do stuff
//MUSEKLIKK
//legger til klikkmuligheter på tall
numbers.forEach((number) => {
    number.addEventListener('click', (e) => {
        const nmbr = document.querySelector(`div[id="${number.id}"]`)
        useNumber(number.id)
        nmbr.classList.add('press');
    });
}); 

//legger til klikkmuligheter på operatorene
operators.forEach((op) => {
    op.addEventListener('click', (e) => {
        const nmbr = document.querySelector(`div[id="${op.id}"]`)
        actions(op.id)
        nmbr.classList.add('press');
    });
}); 

//TASTATUR
// sjekker om symboler blir trykket på og utførerer evt. handlinger. (tastatur)
window.addEventListener("keypress", (e) => {
    const key = document.querySelector(`div[data-char="${e.charCode}"]`);
    if(!key) {
        const enterKey = document.querySelector(`div[data-char2="${e.charCode}"]`);
        if (!enterKey) return;
        actions(enterKey.id);
        return;
    };

    actions(key.id);

    key.classList.add('press');
});

//sjekker om tall blir trykket og utfører evt. handlinger (tastatur)
window.addEventListener("keydown", (e) => {
    if(e.keyCode == 8) {e.preventDefault()};
    const key = document.querySelector(`div[data-key="${e.keyCode}"]`);
    if(e.shiftKey) return; //i tilfelle det blir trykket "=", som innebærer shift, så ikke gjør noe..
    if(!key) return;
    useNumber(key.id);

    key.classList.add('press');
});

//transition effects
function removeTransition(e) {
    if (e.propertyName !== 'transform') return;
    e.target.classList.remove('press');
  }


const knapper = Array.from(document.querySelectorAll('#body > div'));
knapper.forEach(key => key.addEventListener('transitionend', removeTransition));