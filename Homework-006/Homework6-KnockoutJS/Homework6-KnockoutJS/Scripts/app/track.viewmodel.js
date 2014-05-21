window.trackApp.todoListViewModel = (function (ko, datacontext) {
    var searchText = ko.observable();
    var newTrackName = ko.observable();
    var newTrackSongUrl = ko.observable();
    var newTrackLength = ko.observable();

    var tracks = ko.observableArray();   

    var createTrack = function () {
        var newTrack = { name: this.newTrackName._latestValue, songUrl: this.newTrackSongUrl._latestValue, length: this.newTrackLength._latestValue };
        datacontext.addAzureRecord('Track', newTrack, tracks);
    };

    var search = function () {
        datacontext.getAzureRecordsByName('Track', searchText._latestValue, tracks);
    };

    var updateTrack = function (track) {
        var updateTrack = mapTrackToJson(track);
        datacontext.updateAzureRecord('Track', updateTrack, tracks);
    };

    var deleteTrack = function (track) {
        var deleteTrack = mapTrackToJson(track);
        datacontext.deleteAzureRecord('Track', deleteTrack, tracks, searchText._latestValue);
    };
    
    

    // map knockout observable / json track to pure json
    var mapTrackToJson = function (track) {
        var trackId = track.id._latestValue == null ? track.id : track.id._latestValue;
        var trackName = track.name._latestValue == null ? track.name : track.name._latestValue;
        var trackSongUrl = track.songUrl._latestValue == null ? track.songUrl : track.songUrl._latestValue;
        var trackLength = track.length._latestValue == null ? track.length : track.length._latestValue;
        var jsonTrack = {
            id: trackId, name: trackName,
            songUrl: trackSongUrl, length: trackLength
        };
        return jsonTrack;
    }

    return {
        searchText: searchText,
        newTrackName: newTrackName,
        newTrackSongUrl: newTrackSongUrl,
        newTrackLength: newTrackLength,
        tracks: tracks,       
        createTrack: createTrack,
        search: search,
        updateTrack: updateTrack,
        deleteTrack: deleteTrack
    };

})(ko, trackApp.datacontext);

// Initiate the Knockout bindings
ko.applyBindings(window.trackApp.todoListViewModel);
