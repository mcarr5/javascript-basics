// Problem #1
// Reference http://www.programming-challenges.com/pg.php?page=downloadproblem&probid=110101&format=html
function threeNPlusOne(input) {
    var threeNPlusOneResult = [];

    for (var j = 0; j < input.length; j++) {
        // Split each input pair string into an array of the numbers as strings
        var arrayOfInputPair = input[j].split(" ");
        for (var k = 0; k < arrayOfInputPair.length; k++) {
            // Get the second number from the input pair
            if (k == 1) {

                // Find the max cycle length between and including k - 1 and k
                var nkMinusOne = parseInt(arrayOfInputPair[k - 1]);
                var numbers = [];
                var nk = parseInt(arrayOfInputPair[k]);
                var maxCycleLength = 0;

                for (var l = nk; l >= nkMinusOne; l--) {
                    var initl = l;
                    numbers = [];
                    while (l > 1) {
                        numbers.push(l);
                        if (l % 2 == 0) {
                            l = l / 2;
                        }
                        else {
                            l = l * 3 + 1;
                        }
                    }
                    if (l == 1)
                    {
                        numbers.push(l);
                        l = initl;
                    }
                    if (numbers.length > maxCycleLength) {
                        maxCycleLength = numbers.length;
                    }
                }

                var resultStringArrayValue = arrayOfInputPair[k - 1].concat(" ", arrayOfInputPair[k], " ", maxCycleLength.toString());
                threeNPlusOneResult.push(resultStringArrayValue);
            }
        }
    }
    return threeNPlusOneResult;
}

// Problem #2
// The goal of this problem is to understand the relationship between an object and a dictionary
// Ensure that you can delete the properties you want to delete and ensure that you add the property
// It is looking to add during runtime.
// prototype javascript
// javascript delete keyword to remove property
function playingWithDictionaries(resultDictionary) {
    var config = {
        writable: true,
        configurable: true
    };

    var defineProperty = function (obj, name, value) {
        config.value = value;
        Object.defineProperty(obj, name, config);
    };

    defineProperty(resultDictionary, 'dogSound', "bark");
    for (var index = 0; index < 100; index++) {
        defineProperty(resultDictionary, 'property' + index, "value-" + index);
    }
    delete resultDictionary.fooBar;

    defineProperty(resultDictionary, 'birdSound', "chirp");

    return resultDictionary;
}

// Problem #3
// Reference http://ejohn.org/blog/simple-javascript-inheritance/
var Mammal = Class.extend({
    init: function (isBarking) {
        this.barking = isBarking;
    },
    bark: function () {
        return this.barking;
    }
});

var Cat = Mammal.extend({
    init: function () {
        this._super(false);
    },
    meow: function () {
        return true;
    }
});

// Problem #4
// Battleship game
// Build a minesweeper game that returns the results in a list of hit or miss
// If it's a miss, you also need to say how many squares away. 
// So if a ship is at 1,3 and a move is at 2,4 it would be a "miss, 1 square away"
// So if a ship is at 1,3 and a move is at 3,3 it would be a "miss, 3 squares away"
// If all of the ships are destroyed, you will output "You win!"
// If all of the moves are done and there is a ship left, you will output "You lose"
// A ship will be the letter 's'
// Water will be the letter 'w'
function mineSweeper(boardArray, movesArray) {
    var actualResults = [];

    // Code to figure out if it's a hit or a miss
    // I will look at this method, so if you just return 
    // expected results from the tests.js I will return this to you.
    var boardArrayLength = boardArray.length;

    // Iterate over board to hit or miss battleships
    // This could probably be tweaked for better performance
    for (var i = 0; i < movesArray.length; i++) {
        var move = movesArray[i].split(" ");
        for (var j = 0; j < move.length; j++) {
            var moveX = 0;
            var moveY = 0;
            if (j == 1)
            {
                moveX = move[j - 1];
                moveY = move[j];
                if (boardArray[moveX][moveY] == 's')
                {
                    actualResults.push("hit");
                    boardArray[moveX][moveY] = 'w';
                }
                else
                {
                    var miss = "";
                    var minSpacesX = 0;
                    var minSpacesY = 0;
                    var minSpaces = 0;
                    // Iterate over board to find out how close you are to the nearest battleship
                    for (var k = 0; k < boardArrayLength; k++) {
                        for (var l = 0; l < boardArrayLength; l++) {
                            if (boardArray[k][l] == 's') {
                                var spacesX = Math.abs(moveX - k);
                                var spacesY = Math.abs(moveY - l);
                                if (minSpacesX == 0)
                                {
                                    minSpacesX = spacesX;
                                }
                                else if (spacesX < minSpacesX)
                                {
                                    minSpacesX = spacesX;
                                }
                                if (minSpacesY == 0)
                                {
                                    minSpacesY = spacesY;
                                }
                                else if (spacesY < minSpacesY)
                                {
                                    minSpacesY = spacesY;
                                }
                            }
                        }
                    }
                    minSpaces = ((minSpacesX < minSpacesY) ? minSpacesX : minSpacesY);
                    if (minSpaces == 1)
                    {
                        minSpaces = minSpaces.toString().concat(" square away");
                    }
                    else
                    {
                        minSpaces = minSpaces.toString().concat(" squares away");
                    }
                    miss = "miss, ".concat(minSpaces.toString());
                    actualResults.push(miss);
                }
            }
        }
    }

    // Search the board to find any remaining ships
    var shipsPresent = false;
    var i = 0;
    while (!shipsPresent && i < boardArrayLength)
    {
        var j = 0;
        while (!shipsPresent && j < boardArrayLength)
        {            
            if (boardArray[i][j] == 's')
            {
                shipsPresent = true;
                break;
            }
            j++;
        }
        i++;
    }
    // If we still have ships on the board - You lose
    if (shipsPresent)
    {
        actualResults.push("You lose");
    }
    else
    {
        actualResults.push("You win!");
    }

    return actualResults;
}

// Problem #5
// We will use http://services.odata.org/northwind/northwind.svc/ as an oData service
// Look at this for an example http://stackoverflow.com/questions/1268673/set-a-request-header-in-javascript
// Use JSON it'll be easier to parse out the object
// Request header set to application/json
function getDataFromOData(oDataValues) {
    var request = new XMLHttpRequest();
    var numberOfEmployeesInSeattleQuery = "http://services.odata.org/northwind/northwind.svc/Employees/$count/?$filter=City eq 'Seattle'";
    var numberOfProductsCostingMoreThanTenDollarsQuery = "http://services.odata.org/northwind/northwind.svc/Products()/$count?$filter=UnitPrice gt 10M";
    var numberOfInvoicesInOctoberOfNinetySevenQuery = "http://services.odata.org/northwind/northwind.svc/Invoices()/$count?$filter=month(OrderDate) eq 10 and year(OrderDate) eq 1997";

    request.open("GET", numberOfEmployeesInSeattleQuery, false);
    request.send();
    oDataValues.numberOfEmployeesInSeattle = request.responseText;
    request.open("GET", numberOfProductsCostingMoreThanTenDollarsQuery, false);
    request.send();
    oDataValues.numberOfProductsCostingMoreThanTenDollars = request.responseText;
    request.open("GET", numberOfInvoicesInOctoberOfNinetySevenQuery, false);
    request.send();
    oDataValues.numberOfInvoicesInOctoberOfNinetySeven = request.responseText;

    return oDataValues;
}

// Problem #6
function Calculator() {
    this.runningTotal = 0;
    this.add = function (value) {
        this.runningTotal = this.runningTotal + value;
    };

    this.subtract = function (value) {
        this.runningTotal = this.runningTotal - value;
    };

    this.multiply = function (value) {
        this.runningTotal = this.runningTotal * value;
    };

    this.divide = function (value) {
        this.runningTotal = this.runningTotal / value;
    };
}