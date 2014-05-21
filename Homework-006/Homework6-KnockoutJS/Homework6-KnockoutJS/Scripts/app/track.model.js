(function (ko, datacontext) {
    datacontext.trackList = trackList;
    datacontext.track = track;

    function trackList(data) {
        var self = this;
        data = data || {};

        // Persisted properties
        ko.mapping.fromJS(data, {}, self);

        self.tracks = ko.observableArray(importTracks(data));

        // Non-persisted properties
        self.errorMessage = ko.observable();
    };

    function track(data) {
        var self = this;
        data = data || {};

        // Persisted properties
        self.id = data.id;
        self.albumId = data.albumId;
        self.name = ko.observable(data.name);
        self.songUrl = ko.observable(data.songUrl);
        self.length = ko.observable(data.length);

        // Non-persisted properties
        self.errorMessage = ko.observable();
    };

    function importTracks(tracks) {
        return $.map(tracks || [],
                function (trackData) {
                    return datacontext.createTrack(trackData);
                });
    };

})(ko, trackApp.datacontext);