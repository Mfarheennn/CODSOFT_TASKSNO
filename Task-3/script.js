// Select the display elements
const result = document.getElementById("result");
const previous = document.getElementById("previous");

const buttons = document.querySelectorAll(".buttons button");

// Variables to store calculation details
let firstNumber = null;
let operator = null;
let waitingForSecondNumber = false;

// Add event listeners to all buttons
buttons.forEach(function (button) {

    button.addEventListener("click", function () {

        const value = button.dataset.value;
        const action = button.dataset.action;

        // Clear everything
        if (action === "clear") {

            result.value = "0";
            previous.textContent = "";

            firstNumber = null;
            operator = null;
            waitingForSecondNumber = false;

        }

        // Delete the last digit
        else if (action === "delete") {

            if (waitingForSecondNumber) {
                return;
            }

            if (result.value === "Error") {
                result.value = "0";
            } else if (result.value.length > 1) {
                result.value = result.value.slice(0, -1);
            } else {
                result.value = "0";
            }

        }

        // Calculate percentage
        else if (action === "percent") {

            const number = Number(result.value);

            if (Number.isFinite(number)) {
                result.value = formatNumber(number / 100);
            }

        }

        // Perform calculation
        else if (action === "calculate") {

            if (operator === null || firstNumber === null) {
                return;
            }

            const secondNumber = Number(result.value);
            let answer;

            if (operator === "+") {
                answer = firstNumber + secondNumber;
            }

            else if (operator === "-") {
                answer = firstNumber - secondNumber;
            }

            else if (operator === "*") {
                answer = firstNumber * secondNumber;
            }

            else if (operator === "/") {

                if (secondNumber === 0) {
                    result.value = "Error";
                    previous.textContent = "Cannot divide by zero";

                    firstNumber = null;
                    operator = null;
                    waitingForSecondNumber = true;

                    return;
                }

                answer = firstNumber / secondNumber;
            }

            if (Number.isFinite(answer)) {

                previous.textContent =
                    firstNumber + " " + operator + " " + secondNumber + " =";

                result.value = formatNumber(answer);

            } else {
                result.value = "Error";
                previous.textContent = "Result is too large";
            }

            firstNumber = null;
            operator = null;
            waitingForSecondNumber = true;

        }

        // Select an arithmetic operator
        else if (["+", "-", "*", "/"].includes(value)) {

            const currentNumber = Number(result.value);

            if (!Number.isFinite(currentNumber)) {
                return;
            }

            // Calculate the previous operation first
            if (operator !== null &&
                firstNumber !== null &&
                !waitingForSecondNumber) {

                const secondNumber = currentNumber;
                let answer;

                if (operator === "+") {
                    answer = firstNumber + secondNumber;
                } else if (operator === "-") {
                    answer = firstNumber - secondNumber;
                } else if (operator === "*") {
                    answer = firstNumber * secondNumber;
                } else if (operator === "/") {
                    answer = secondNumber === 0
                        ? NaN
                        : firstNumber / secondNumber;
                }

                if (!Number.isFinite(answer)) {
                    result.value = "Error";
                    previous.textContent = "Invalid calculation";
                    firstNumber = null;
                    operator = null;
                    waitingForSecondNumber = true;
                    return;
                }

                result.value = formatNumber(answer);
                firstNumber = answer;

            } else {
                firstNumber = currentNumber;
            }

            operator = value;

            previous.textContent =
                formatNumber(firstNumber) + " " + operator;

            waitingForSecondNumber = true;

        }

        // Enter numbers and decimal points
        else if (value !== undefined) {

            if (waitingForSecondNumber) {

                result.value = value === "." ? "0." : value;
                waitingForSecondNumber = false;

            } else if (value === ".") {

                if (!result.value.includes(".")) {
                    result.value += ".";
                }

            } else if (result.value === "0" ||
                       result.value === "Error") {

                result.value = value;

            } else if (result.value.replace("-", "").length < 15) {

                result.value += value;

            }
        }

    });

});

// Format numbers and reduce floating-point display errors
function formatNumber(number) {

    if (!Number.isFinite(number)) {
        return "Error";
    }

    return String(Number(number.toPrecision(12)));
}
