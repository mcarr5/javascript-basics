// Class for displaying calculator UI in display
var CalculatorUI = (function () {
    function CalculatorUI() {
    }
    CalculatorUI.prototype.pageLoad = function () {
        var inputs = document.getElementsByTagName("input");
        for (var i = 0; i < inputs.length; i++) {
            var inputTag = inputs[i];
            if (inputTag.type == "button") {
                inputs[i].onclick = function () {
                    var calculatorDisplay = document.getElementById("calculatorDisplay").getAttribute("value");
                    var buttonValue = this.value;
                    switch (buttonValue) {
                        case "MC":
                        case "MR":
                        case "MS":
                        case "M+":
                        case "M-":
                        case "<-":
                        case "±":
                        case "√":
                        case "%":
                        case null:
                            break;
                        case "CE":
                        case "C":
                            // clear display and history
                            document.getElementById("calculatorDisplay").setAttribute("value", "");
                            CalculatorHistoryData.previousButtonPress = "";
                            CalculatorHistoryData.previousResult = 0;
                            CalculatorHistoryData.clearCalculatorHistoryDiv();
                            break;
                        case "1":
                        case "2":
                        case "3":
                        case "4":
                        case "5":
                        case "6":
                        case "7":
                        case "8":
                        case "9":
                        case ".":
                        case "0":
                            if (calculatorDisplay != "NaN") {
                                // set result display
                                CalculatorUI.setCalculatorDisplay(calculatorDisplay, buttonValue);

                                // store number in calculator history state
                                CalculatorHistoryData.previousButtonPress = buttonValue;
                            }
                            break;
                        case "/":
                        case "*":
                        case "^":
                        case "-":
                        case "+":
                        case "=":
                            if (calculatorDisplay != "NaN") {
                                // set result display
                                CalculatorUI.setCalculatorDisplay(calculatorDisplay, buttonValue);
                                calculatorDisplay = document.getElementById("calculatorDisplay").getAttribute("value");

                                // if last press was also an operation, then overwrite it with the new operation
                                CalculatorHistoryData.operationAction(calculatorDisplay);

                                // store operation in calculator history state
                                CalculatorHistoryData.previousButtonPress = buttonValue;
                            }
                            break;
                        default:
                            break;
                    }
                };
            }
        }
    };

    // set calculator display based on current display and button value
    // don't allow leading operations
    // don't allow one operation followed directly by another
    CalculatorUI.setCalculatorDisplay = function (calculatorDisplay, buttonValue) {
        var display = "";
        switch (buttonValue) {
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
            case "0":
                if (calculatorDisplay == null || calculatorDisplay == "0") {
                    calculatorDisplay = "";
                }
                display = calculatorDisplay.concat(buttonValue);

                // if last button pressed was an operation, then only display new number after operation is pressed
                if (CalculatorHistoryData.isOperation(CalculatorHistoryData.previousButtonPress)) {
                    display = buttonValue;
                }
                document.getElementById("calculatorDisplay").setAttribute("value", display);
                break;
            case ".":
                if (calculatorDisplay != null) {
                    display = calculatorDisplay.concat(buttonValue);

                    // if decimal already exists, don't display it
                    if (calculatorDisplay.search(/\./) != -1) {
                        display = display.substring(0, display.length - 1);
                    }

                    // if previous button press is an operation, then don't display it
                    if (CalculatorHistoryData.isOperation(CalculatorHistoryData.previousButtonPress)) {
                        display = buttonValue;
                    }
                    document.getElementById("calculatorDisplay").setAttribute("value", display);
                } else {
                    document.getElementById("calculatorDisplay").setAttribute("value", buttonValue);
                }
                break;
            case "/":
            case "*":
            case "^":
            case "-":
            case "+":
            case "=":
                // if math operations
                if (calculatorDisplay != null && calculatorDisplay != "" && calculatorDisplay.charAt(calculatorDisplay.length - 1) != buttonValue) {
                    display = calculatorDisplay.concat(buttonValue);
                    document.getElementById("calculatorDisplay").setAttribute("value", display);
                }
                break;
        }
    };
    return CalculatorUI;
})();
;

// Class for calculator history data operations below
var CalculatorHistoryData = (function () {
    function CalculatorHistoryData() {
    }
    CalculatorHistoryData.clearCalculatorHistoryDiv = function () {
        for (var i = CalculatorHistoryData.elements.length - 1; i >= 0; i--) {
            document.getElementById('calculatorHistoryDiv').removeChild(CalculatorHistoryData.elements[i]);
            CalculatorHistoryData.elements.pop();
            CalculatorHistoryData.historyStack.pop();
        }
    };

    // when an operation is pressed take all preceeding text, and the operation, and put it in a history stack
    // when an operation is pressed clear the display
    // when an operation is pressed perform logic for operation if there is a preceeding element in the elements array
    CalculatorHistoryData.operationAction = function (calculatorDisplay) {
        // when an operation is pressed take all preceeding text, and the operation, and put it in a history stack
        if (calculatorDisplay != null && calculatorDisplay != "") {
            var div = document.createElement("div");
            var button = document.createElement("input");
            button.setAttribute("type", "button");
            button.setAttribute("class", "calculatorButton");
            button.setAttribute("style", "width: 224px");

            // don't display the operation in the result window
            var resultString = calculatorDisplay.substring(0, calculatorDisplay.length - 1);
            var resultCalculation = CalculatorHistoryData.parseToDecimal(resultString);
            document.getElementById('calculatorDisplay').setAttribute('value', resultCalculation.toString());

            // if operations are pressed in succession, overwrite the previous operation with the new operation
            if (CalculatorHistoryData.isOperation(CalculatorHistoryData.previousButtonPress)) {
                document.getElementById('calculatorHistoryDiv').removeChild(CalculatorHistoryData.elements[CalculatorHistoryData.elements.length - 1]);
                CalculatorHistoryData.elements.pop();
                CalculatorHistoryData.historyStack.pop();
            } else {
                resultCalculation = CalculatorHistoryData.performCalculation(+document.getElementById('calculatorDisplay').getAttribute('value'));

                // set calculation result in calculatorDisplay
                document.getElementById('calculatorDisplay').setAttribute('value', resultCalculation.toString());
            }

            button.value = calculatorDisplay;
            button.onclick = function () {
                // bring calculator display back to the state that it was at the time history button was generated
                // set calculatoion result in calculatorDisplay
                document.getElementById('calculatorDisplay').setAttribute('value', resultCalculation.toString());

                // rebuild history stack based on current position clicked
                var historyStackPosition = CalculatorHistoryData.historyStack.indexOf(this.value);
                for (var i = CalculatorHistoryData.elements.length - 1; i > historyStackPosition; i--) {
                    document.getElementById('calculatorHistoryDiv').removeChild(CalculatorHistoryData.elements[i]);
                    CalculatorHistoryData.elements.pop();
                    CalculatorHistoryData.historyStack.pop();
                }

                // store number in calculator history state
                CalculatorHistoryData.previousResult = CalculatorHistoryData.parseToDecimal(document.getElementById("calculatorDisplay").getAttribute("value"));
            };

            div.appendChild(button);
            CalculatorHistoryData.elements.push(div);
            CalculatorHistoryData.historyStack.push(calculatorDisplay);
            for (var i = CalculatorHistoryData.elements.length - 1; i >= 0; i--) {
                document.getElementById('calculatorHistoryDiv').appendChild(CalculatorHistoryData.elements[i]);
            }

            // store number in calculator history state
            CalculatorHistoryData.previousResult = CalculatorHistoryData.parseToDecimal(document.getElementById("calculatorDisplay").getAttribute("value"));
        }
    };

    // check if button press is an operation
    CalculatorHistoryData.isOperation = function (buttonPress) {
        var result = false;

        if (buttonPress == "/" || buttonPress == "*" || buttonPress == "^" || buttonPress == "-" || buttonPress == "+" || buttonPress == "=") {
            result = true;
        }

        return result;
    };

    // convert string to decimal with a fixed number of digits equal to the string length - 1 if there is a decimal point
    CalculatorHistoryData.parseToDecimal = function (stringToParse) {
        var result = 0;
        var resultNumberOfDigits = stringToParse.length;
        if (stringToParse.indexOf(".") != -1) {
            // decimal point is in string, so numberOfDigits is length - 1
            resultNumberOfDigits = resultNumberOfDigits - 1;
        }

        // can't parse a decimal point
        if (stringToParse != ".") {
            result = +parseFloat(stringToParse);
        }
        return result;
    };

    // perform calculation on the current number using the last operation in the calculator history stack
    CalculatorHistoryData.performCalculation = function (currentNumber) {
        var result = currentNumber;

        // since we already pushed the current value we use length - 1, for our historyStack
        var historyStackLength = CalculatorHistoryData.historyStack.length;
        var previousOperation = "";
        for (var i = 0; i < historyStackLength; i++) {
            if (CalculatorHistoryData.historyStack[i].indexOf("*") != -1) {
                previousOperation = "*";
            }
            if (CalculatorHistoryData.historyStack[i].indexOf("/") != -1) {
                previousOperation = "/";
            }
            if (CalculatorHistoryData.historyStack[i].indexOf("+") != -1) {
                previousOperation = "+";
            }
            if (CalculatorHistoryData.historyStack[i].indexOf("-") != -1) {
                previousOperation = "-";
            }
            if (CalculatorHistoryData.historyStack[i].indexOf("^") != -1) {
                previousOperation = "^";
            }
            if (CalculatorHistoryData.historyStack[i].indexOf("=") != -1) {
                previousOperation = "=";
            }
            var previousValueString = CalculatorHistoryData.historyStack[i].substring(0, CalculatorHistoryData.historyStack[i].length - 1);
            var previousValueNumber = 0;
            if (previousValueString != null) {
                previousValueNumber = CalculatorHistoryData.parseToDecimal(previousValueString);
            }
            switch (previousOperation) {
                case "^":
                    if (CalculatorHistoryData.previousResult == null) {
                        result = Math.pow(previousValueNumber, currentNumber);
                    } else {
                        result = Math.pow(CalculatorHistoryData.previousResult, currentNumber);
                    }
                    break;
                case "-":
                    if (CalculatorHistoryData.previousResult == null) {
                        result = (previousValueNumber - currentNumber);
                    } else {
                        result = (CalculatorHistoryData.previousResult - currentNumber);
                    }
                    break;
                case "+":
                    if (CalculatorHistoryData.previousResult == null) {
                        result = (previousValueNumber + currentNumber);
                    } else {
                        result = (CalculatorHistoryData.previousResult + currentNumber);
                    }
                    break;
                case "/":
                    if (CalculatorHistoryData.previousResult == null) {
                        result = (previousValueNumber / currentNumber);
                    } else {
                        result = (CalculatorHistoryData.previousResult / currentNumber);
                    }
                    break;
                case "*":
                    if (CalculatorHistoryData.previousResult == null) {
                        result = (previousValueNumber * currentNumber);
                    } else {
                        result = (CalculatorHistoryData.previousResult * currentNumber);
                    }
                    break;
                default:
                    break;
            }
        }
        return result;
    };
    CalculatorHistoryData.elements = new Array();
    CalculatorHistoryData.historyStack = new Array();
    return CalculatorHistoryData;
})();
;

window.onload = function () {
    var calculatorUI = new CalculatorUI();
    calculatorUI.pageLoad();
};
