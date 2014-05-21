//use strict';

// Google Analytics Collection APIs Reference:
// https://developers.google.com/analytics/devguides/collection/analyticsjs/

angular.module('app.controllers', [])
    .factory('AzureMobileClient', function () {

        var azureMobileClient = {};
        var MobileServiceClient = WindowsAzure.MobileServiceClient;
        var client = new MobileServiceClient('https://magenicmasters.azure-mobile.net/', 'RzogwiXjcgelcBlWVcqRRTCAfIWJEs17');

        // Get all data using the read method of the Azure service. Take a string (tableName) indicating the table to get data from
        azureMobileClient.getAllData = function (tableName, callback) {
            client.getTable(tableName).read().then(function (items) {
                callback(items);
            });
        };

        azureMobileClient.getDataByName = function (tableName, searchText, callback) {
            client.getTable(tableName).where(function (searchText) {
                return this.name.indexOf(searchText) >= 0;
            }, searchText).read().then(function (items) {
                callback(items);
            });
        };

        // Adds a data row (data) to the specified table (tableName). 
        // If success, returns the new object that was created.
        // If failure, returns the error text on failure.
        azureMobileClient.addData = function (tableName, data, callback) {
            client.getTable(tableName).insert(data).then(function (items) {
                callback(items);
            });
        };

        azureMobileClient.updateData = function (tableName, data, callback) {
            client.getTable(tableName).update(data).then(function (items) {
                callback(items);
            });
        };

        azureMobileClient.deleteData = function (tableName, data, callback) {
            client.getTable(tableName).del(data).then(function (items) {
                callback(items);
            });
        };

        return azureMobileClient;
    })

    // Path: /
    .controller('HomeCtrl', ['$scope', '$location', '$window', function ($scope, $location, $window) {
        $scope.$root.title = 'AngularJS SPA Template for Visual Studio';
        $scope.$on('$viewContentLoaded', function () {
            $window.ga('send', 'pageview', { 'page': $location.path(), 'title': $scope.$root.title });
        });
    }])

    .controller('TracksCtrl', ['$scope', '$location', '$window', 'AzureMobileClient', function ($scope, $location, $window, AzureMobileClient) {
        $scope.$root.title = 'AngularJS SPA | Tracks';

        $scope.search = function () {
            AzureMobileClient.getDataByName('Track', $scope.trackKeyword, function (items) {
                $scope.$apply($scope.tracks = items);
            });
        };

        $scope.createTrack = function () {
            var newTrack = { name : $scope.newTrackName, songUrl : $scope.newTrackSongUrl, length : $scope.newTrackLength };
            AzureMobileClient.addData('Track', newTrack, function (item) {
                $scope.$apply($scope.tracks.push(item));
            });
        };

        $scope.updateTrack = function (data) {
            var updateTrack = { id : data.id, albumId : data.albumId, name: data.name, songUrl: data.songUrl, length: data.length };
            AzureMobileClient.updateData('Track', updateTrack, function (item) {
                //$scope.$apply($scope.tracks.push(item));
            });
        };

        $scope.deleteTrack = function (data) {
            var deleteTrack = { id: data.id, albumId: data.albumId, name: data.name, songUrl: data.songUrl, length: data.length };
            AzureMobileClient.deleteData('Track', deleteTrack, function (item) {
                AzureMobileClient.getDataByName('Track', $scope.trackKeyword, function (items) {
                    $scope.$apply($scope.tracks = items);
                });
            });
        };

        $scope.$on('$viewContentLoaded', function () {
            $window.ga('send', 'pageview', { 'page': $location.path(), 'title': $scope.$root.title });
        });
    }])

    // Path: /about
    .controller('AboutCtrl', ['$scope', '$location', '$window', function ($scope, $location, $window) {
        $scope.$root.title = 'AngularJS SPA | About';
        $scope.$on('$viewContentLoaded', function () {
            $window.ga('send', 'pageview', { 'page': $location.path(), 'title': $scope.$root.title });
        });
    }])

    // Path: /login
    .controller('LoginCtrl', ['$scope', '$location', '$window', function ($scope, $location, $window) {
        $scope.$root.title = 'AngularJS SPA | Sign In';
        // TODO: Authorize a user
        $scope.login = function () {
            $location.path('/');
            return false;
        };
        $scope.$on('$viewContentLoaded', function () {
            $window.ga('send', 'pageview', { 'page': $location.path(), 'title': $scope.$root.title });
        });
    }])

    // Path: /error/404
    .controller('Error404Ctrl', ['$scope', '$location', '$window', function ($scope, $location, $window) {
        $scope.$root.title = 'Error 404: Page Not Found';
        $scope.$on('$viewContentLoaded', function () {
            $window.ga('send', 'pageview', { 'page': $location.path(), 'title': $scope.$root.title });
        });
    }]);