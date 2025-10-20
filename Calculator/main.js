const buttonValues = [
    "AC", "+/-", "%", "÷",
    "7", "8", "9", "×",
    "4", "5", "6", "-",
    "1", "2", "3", "+",
    "0", ".", "="
];
const rightSymbols = ["÷", "×", "-", "+", "="];
const topSymbols = ["AC", "+/-", "%"];

const display = document.getElementById("display");

let A = 0;
let operator = null;
let B = null;

for (let i = 0; i < buttonValues.length; i++) {
    let value = buttonValues[i];
    let button = document.createElement("button");
    button.innerText = value;

    if (value === "0") {
        button.style.width = "180px";
        button.style.gridColumn = "span 2";
    }

    if (rightSymbols.includes(value)) {
        button.style.backgroundColor = "#FFA500"; // Orange for right symbols
    } else if (topSymbols.includes(value)) {
        button.style.backgroundColor = "#9F9F9F"; // Light gray for top symbols
    }

    //add event to button
    button.addEventListener("click", function () {
        if (rightSymbols.includes(value)) {

        } else if (topSymbols.includes(value)) {

        } else { //number
            if (value == ".") {
                if (display.value != "" && !display.value.includes(value)) {
                    display.value += value;
                }
            } else if (display.value == "0") {
                display.value = value;
            } else {
                display.value += value;
            }
        }
    });

    document.getElementById("buttons").appendChild(button);
}

