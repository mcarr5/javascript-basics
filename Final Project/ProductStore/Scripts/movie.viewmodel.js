function ViewModel() {
	var self = this;

	self.movies = ko.observableArray();   // Contains the list of movies
	self.movie = ko.observable();
	self.status = ko.observable();

	// A nested view model that represents a single movie.
	function ViewModel(movie) {
		var self = this;

		self.Id = movie.Id;
		self.Title = movie.Title;
		self.Genre = movie.Genre;
		self.Duration = movie.Duration;
		self.Rating = movie.Rating;
		self.PosterUrl = movie.PosterUrl;
	}

	// Call to Web Api to get all movies
	self.getAllCall = function () {
		self.movies.removeAll();
		$.getJSON("/api/moviesapi", function (movies) {
			$.each(movies, function (index, movie) {
				self.movies.push(new ViewModel(movie));
			})
		});
	}

	// Call to Web Api to get a movie by Id
	self.getByIdCall = function (id) {
		$.getJSON(
			'/api/moviesapi/' + id,
			function (data) {
				self.movie(new ViewModel(data));
			})
			// Handler for error response:
			.fail(
				function (xhr, textStatus, err) {
					self.movie(null);
					self.status(err);
				});
	}

	// Call to Web Api to get a movie by Title
	self.getByTitleCall = function (movieSearch) {
		$.getJSON("/api/moviesapi?title=" + movieSearch, function (movies) {
			$.each(movies, function (index, movie) {
				self.movies.push(new ViewModel(movie));
			})
		});
	}

	// Call to Web Api to get a movie by Genre
	self.getByGenreCall = function (movieSearch) {
		$.getJSON("/api/moviesapi?genre=" + movieSearch, function (movies) {
			$.each(movies, function (index, movie) {
				self.movies.push(new ViewModel(movie));
			})
		});
	}

	// Call to Web Api to get a update a movie by id
	self.updateCall = function (movie, id) {
		$.ajax({
			url: '/api/moviesapi/' + id,
			cache: false,
			type: 'PUT',
			contentType: 'application/json; charset=utf-8',
			data: JSON.stringify(movie),
			success: self.getAllCall()
		})
		.fail(
		function (xhr, textStatus, err) {
			self.status(err);
		});
	}

	// Call to Web Api to get a create a new movie
	self.createCall = function (movie) {
		$.ajax({
			url: '/api/moviesapi',
			cache: false,
			type: 'POST',
			contentType: 'application/json; charset=utf-8',
			data: JSON.stringify(movie),
			statusCode: {
				201 /*Created*/: function (data) {
					self.movies.push(data);
				}
			}
		})
		.fail(
		function (xhr, textStatus, err) {
			self.status(err);
		});
	}

	// Call to Web Api to delete/remove a movie
	self.deleteCall = function (id) {
		$.ajax({
			url: '/api/moviesapi/' + id,
			cache: false,
			type: 'DELETE',
			contentType: 'application/json; charset=utf-8',
			statusCode: {
				204 /* No Content */: function (data) {
					self.movies.remove(function (movie) { return movie.Id == id; });
				}
			}
		})
		.fail(
		function (xhr, textStatus, err) {
			self.status(err);
		});
	}

	// Search for a movie by title or genre
	self.getByTitleGenre = function () {
		$("#moviesGridSection").show();
		$("#addEditMovieSection").hide();

		self.status("");
		var movieSearch = $('#movieSearch').val();

		self.movies.removeAll();
		if (!movieSearch.length) {
			self.getAllCall();
			return;
		}

		self.getByTitleCall(movieSearch);

		self.getByGenreCall(movieSearch);
	}

	// Update movie details
	self.update = function () {
		self.status("");
		var id = $('#movieId').val();

		var movie = {
			Title: $('#title').val(),
			Genre: $('#genre').val(),
			Duration: $('#duration').val(),
			Rating: $('#rating').val(),
			PosterUrl: $('#posterUrl').val()
		};

		if (movie.Title == "") {
			self.status("Please enter Movie Title");
		}
		else {
			// avoid broken img urls
			if (movie.PosterUrl == "") {
				movie.PosterUrl = null;
			}

			self.updateCall(movie, id);

			$("#moviesGridSection").show();
			$("#addEditMovieSection").hide();
		}
	}

	// Create movie
	self.create = function () {
		self.status("");

		var movie = {
			Title: $('#title2').val(),
			Genre: $('#genre2').val(),
			Duration: $('#duration2').val(),
			Rating: $('#rating2').val(),
			PosterUrl: $('#posterUrl2').val()
		};

		if (movie.Title == "") {
			self.status("Please enter Movie Title");
		}
		else {
			if (movie.PosterUrl == "") {
				movie.PosterUrl = null;
			}

			self.createCall(movie);

			$("#moviesGridSection").show();
			$("#addEditMovieSection").hide();
		}
	}

	// Delete/remove movie
	self.remove = function (movie) {
		self.status("");

		var id = movie.Id;

		self.deleteCall(id);
	}

	self.editMovieDetails = function (movie) {
		$("#moviesGridSection").hide();
		$("#addEditMovieSection").show();
		$("#editMovie").show();
		$("#addMovie").hide();

		self.status("");
		var id = movie.Id;

		self.getByIdCall(id);

		$("#movieId").val(id);
	}
}

var viewModel = new ViewModel();
// initialize data
viewModel.getAllCall();
ko.applyBindings(viewModel);

function clearStatus() {
	$('#status').html('');
}

function displayAddNewMovie() {
	$("#moviesGridSection").hide();
	$("#addEditMovieSection").show();
	$("#addMovie").show();
	$("#editMovie").hide();
}

function displayTests() {
	viewModel = new ViewModel();
	viewModel.movies.removeAll();
	$("#movieSearchSection").hide();
	$("#moviesGridSection").hide();
	$("#displayTests").show();
	$("#testsButton").hide();
	$("#yomdbButton").show();
	QUnit.start();
}

function displayYOMDB() {
	viewModel = new ViewModel();
	viewModel.movies.removeAll();
	viewModel.getAllCall();
	$("#movieSearchSection").show();
	$("#moviesGridSection").show();
	$("#displayTests").hide();
	$("#testsButton").show();
	$("#yomdbButton").hide();
}

$("#addEditMovieSection").hide();
$("#displayTests").hide();
$("#yomdbButton").hide();

// Initialize jQuery tab widget
//$("#tabs").tabs();