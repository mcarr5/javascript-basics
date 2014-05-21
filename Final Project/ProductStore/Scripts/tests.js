///<reference path="movie.viewmodel.js"/>
QUnit.config.autostart = false;
var addedMovieId = 0;

asyncTest("ViewModel Add Test", function () {
    expect(5);

    var newMovie = {
        "Title": "Fight Club",
        "Genre": "Action", "Duration": "1:51", "Rating": 4, "PosterUrl": null
    };

    var viewModel = new ViewModel();
    viewModel.getAllCall();
    viewModel.createCall(newMovie);

    setTimeout(function () {
        var movieIndex = viewModel.movies._latestValue.length - 1;
        console.log("Add - Movies Length: " + viewModel.movies._latestValue.length);
        equal(viewModel.movies._latestValue[movieIndex].Title, newMovie.Title);
        equal(viewModel.movies._latestValue[movieIndex].Genre, newMovie.Genre);
        equal(viewModel.movies._latestValue[movieIndex].Duration, newMovie.Duration);
        equal(viewModel.movies._latestValue[movieIndex].Rating, newMovie.Rating);
        equal(viewModel.movies._latestValue[movieIndex].PosterUrl, newMovie.PosterUrl);
        var addedMovieId = movieIndex;
        console.log("Add - Movie Id: " + addedMovieId);
        start();
    }, 1000);
});

asyncTest("ViewModel Update Test", function () {
    expect(5);

    var expectedMovie = {
        "Title": "Flight",
        "Genre": "Drama", "Duration": "1:49", "Rating": 4, "PosterUrl": null
    };

    var viewModel = new ViewModel();
    var movieIndex = 0;
    viewModel.updateCall(expectedMovie, 1);

    setTimeout(function () {
        console.log("Update - Movies Length: " + viewModel.movies._latestValue.length);
        equal(viewModel.movies._latestValue[movieIndex].Title, expectedMovie.Title);
        equal(viewModel.movies._latestValue[movieIndex].Genre, expectedMovie.Genre);
        equal(viewModel.movies._latestValue[movieIndex].Duration, expectedMovie.Duration);
        equal(viewModel.movies._latestValue[movieIndex].Rating, expectedMovie.Rating);
        equal(viewModel.movies._latestValue[movieIndex].PosterUrl, expectedMovie.PosterUrl);
        start();
    }, 1000);
});

asyncTest("ViewModel Get Test", function () {
    expect(5);

    var expectedMovie = {
        "Id": 1, "Title": "Flight",
        "Genre": "Drama", "Duration": "1:49", "Rating": 4, "PosterUrl": null
    };

    var viewModel = new ViewModel();
    var movieIndex = 0;
    viewModel.getByTitleCall("Flight");

    setTimeout(function () {
        console.log("Get - Movies Length: " + viewModel.movies._latestValue.length);
        equal(viewModel.movies._latestValue[movieIndex].Title, expectedMovie.Title);
        equal(viewModel.movies._latestValue[movieIndex].Genre, expectedMovie.Genre);
        equal(viewModel.movies._latestValue[movieIndex].Duration, expectedMovie.Duration);
        equal(viewModel.movies._latestValue[movieIndex].Rating, expectedMovie.Rating);
        equal(viewModel.movies._latestValue[movieIndex].PosterUrl, expectedMovie.PosterUrl);
        start();
    }, 1000);
});

asyncTest("ViewModel Delete Test", function () {
    expect(1);

    // Delete last movie that was added
    var viewModel = new ViewModel();

    // Should really use something like moq here so I'm not directly modifying
    // the repository data...
    viewModel.getAllCall();
    viewModel.deleteCall(2);

    setTimeout(function () {
        console.log("Delete - Movies Length: " + viewModel.movies._latestValue.length);
        notEqual(viewModel.movies._latestValue[1].Title, "Captain Phillips");
        start();
    }, 1000);
});