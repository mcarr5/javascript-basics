window.trackApp = window.tracksApp || {};

window.trackApp.datacontext = (function () {
    var client = new WindowsAzure.MobileServiceClient('https://magenicmasters.azure-mobile.net/', 'RzogwiXjcgelcBlWVcqRRTCAfIWJEs17');

    function createTrack(data) {
        return new datacontext.track(data); // track is injected by track.model.js
    }

    function createTracks(data) {
        return new datacontext.tracks(data); // tracks is injected by track.model.js
    }

    // Get all data using the read method of the Azure service. Take a string (tableName) indicating the table to get data from
    function getAllAzureRecords(tableName, tracksObservable) {
        client.getTable(tableName).read().then(function (items) {            
            ko.mapping.fromJS(items, {}, tracksObservable);
        });
    }

    function getAzureRecordsByName(tableName, searchText, tracksObservable) {
        client.getTable(tableName).where(function (searchText) {
            return this.name.indexOf(searchText) >= 0;
        }, searchText).read().then(function (items) {
            ko.mapping.fromJS(items, {}, tracksObservable);
        });
    }

    // Adds a data row (record) to the specified table (tableName).
    function addAzureRecord(tableName, record, tracksObservable) {
        client.getTable(tableName).insert(record).then(function (item) {
            var newTrack = ko.observable();
            newTrack = {
                id: item.id,
                albumId: item.albumId,
                name: item.name,
                songUrl: item.songUrl,
                length: item.length
            };
            tracksObservable.push(newTrack);
        });
    }
    
    function updateAzureRecord(tableName, record, tracksObservable) {
        client.getTable(tableName).update(record).then(function (item) {

        });
    }

    function deleteAzureRecord(tableName, track, tracksObservable, searchText) {
        client.getTable(tableName).del(track).then(function () {
            // remove from observable array
            tracksObservable.remove(function (item) {
                var trackId = item.id._latestValue == null ? item.id : item.id._latestValue;
                return trackId == track.id;
            });
        });
    }

    var datacontext = {
        createTrack: createTrack,
        createTracks: createTracks,
        getAllAzureRecords: getAllAzureRecords,
        getAzureRecordsByName: getAzureRecordsByName,
        addAzureRecord: addAzureRecord,
        updateAzureRecord: updateAzureRecord,
        deleteAzureRecord: deleteAzureRecord
    };

    return datacontext;
})();