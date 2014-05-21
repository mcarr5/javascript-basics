// Helper Functions
function arrays_equal(a, b) { return !(a < b || b < a); }

// Three N Plus One
test("Problem #1", function () {
    var threeNPlusOneData = [];
    threeNPlusOneData.push("1 10");
    threeNPlusOneData.push("100 200");
    threeNPlusOneData.push("201 210");
    threeNPlusOneData.push("900 1000");

    var threeNPlusOneActual = [];
    threeNPlusOneActual.push("1 10 20");
    threeNPlusOneActual.push("100 200 125");
    threeNPlusOneActual.push("201 210 89");
    threeNPlusOneActual.push("900 1000 174");

    var threeNPlusOneResult = threeNPlusOne(threeNPlusOneData);
    ok(arrays_equal(threeNPlusOneActual, threeNPlusOneResult));
});

test("Problem #2", function () {
    function AwesomeDictionary() {
        this.getSound = function (animal) {
            return this[animal];
        };

        this.fooBar = "FooBar";
    };

    AwesomeDictionary.prototype.dogSound;

    var dictionaryResult = playingWithDictionaries(new AwesomeDictionary());
    equal(dictionaryResult.dogSound, "bark");
    equal(dictionaryResult.getSound("birdSound"), "chirp");

    for (var index = 0; index < 100; index++) {
        equal(dictionaryResult["property" + index], "value-" + index);
    }

    notEqual(dictionaryResult.fooBar, "FooBar");
});

test("Problem #3", function () {
    var mammal = new Mammal(true);
    ok(mammal.bark());

    var cat = new Cat();
    ok(!cat.bark());
    ok(cat.meow());

    ok(mammal instanceof Mammal);
    ok(mammal instanceof Class);
    ok(cat instanceof Cat);
    ok(cat instanceof Mammal);
    //ok(cat instanceof Cat);
});

test("Problem #4", function () {
    function createArray(length) {
        var arr = new Array(length || 0),
            i = length;

        if (arguments.length > 1) {
            var args = Array.prototype.slice.call(arguments, 1);
            while (i--) arr[length - 1 - i] = createArray.apply(this, args);
        }

        return arr;
    }

    var boardArray = createArray(8, 8);
    for (var x = 0; x < 8; x++) {
        for (var y = 0; y < 8; y++) {
            boardArray[x][y] = 'w';
        }
    }

    boardArray[2][2] = 's';
    boardArray[2][3] = 's';
    boardArray[2][4] = 's';

    boardArray[2][5] = 's';
    boardArray[3][5] = 's';
    boardArray[4][5] = 's';

    var moves = [];
    moves.push("2 2");
    moves.push("1 2");
    moves.push("2 3");
    moves.push("2 5");
    moves.push("2 6");
    moves.push("2 4");
    moves.push("6 7");
    moves.push("3 5");
    moves.push("4 5");

    var expectedResults = [];
    expectedResults.push("hit");
    expectedResults.push("miss, 1 square away");
    expectedResults.push("hit");
    expectedResults.push("hit");
    expectedResults.push("miss, 1 square away");
    expectedResults.push("hit");
    expectedResults.push("miss, 2 squares away");
    expectedResults.push("hit");
    expectedResults.push("hit");
    expectedResults.push("You win!");

    var actualResults = mineSweeper(boardArray, moves);
    ok(arrays_equal(expectedResults, actualResults));
});

test("Problem #5", function () {
    function oDataValues() {
        this.numberOfEmployeesInSeattle = 0;
        this.numberOfProductsCostingMoreThanTenDollars = 0;
        this.numberOfInvoicesInOctoberOfNinetySeven = 0;
    };

    var odataResults = getDataFromOData(oDataValues);
    equal(odataResults.numberOfEmployeesInSeattle, 2);
    equal(odataResults.numberOfProductsCostingMoreThanTenDollars, 63);
    equal(odataResults.numberOfInvoicesInOctoberOfNinetySeven, 106);
});

test("Problem #6", function () {
    var calculator = new Calculator();
    calculator.add(5);
    calculator.subtract(4);
    calculator.multiply(15);
    calculator.divide(5);
    equal(calculator.runningTotal, 3);
});