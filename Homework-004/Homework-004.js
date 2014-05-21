//Using Jquery UI Tabs for breadcrumbs: https://jqueryui.com/tabs/
$(function () {
    $("#tabs").tabs();
});

function artistSearch(searchText) {
    if (searchText.toString() != '' && searchText != null) {
        var artistSearchCall = artistModule.searchDeferred(searchText);
        $.when(artistSearchCall).done(function (artists) {
            document.getElementById('artistSearchResultsDiv').innerHTML = '';
            document.getElementById('artistSearchResultsDiv').appendChild(makeArtistSearchResultsUL(artists));
        });
    }
}

function makeArtistSearchResultsUL(artists) {
    var searchResultsDiv = document.createElement('div');

    // Create the list element:)
    var list = document.createElement('ul');

    for (var i = 0; i < artists.length; i++) {
        // Create the list item:
        var item = document.createElement('li');
        var link = document.createElement('a');
        var artistName = artists[i].name.toString();
        var artistId = artists[i].id;

        link.href = '#';
        link.id = artistId;
        link.innerHTML = artistName;
        link.onclick = function () {
            $('#selectedArtistId').val(this.id);
            showArtistDetailsDiv(this.id, 'true');
            return false;
        };
        item.appendChild(link);
        list.appendChild(item);
    }

    searchResultsDiv.appendChild(document.createElement('br'));
    searchResultsDiv.appendChild(document.createTextNode("Artist Search Results"));
    searchResultsDiv.appendChild(list);

    // Finally, return the constructed list:
    return searchResultsDiv;
}

function displayArtistDetails(artistId) {
    var artistName = document.createElement('h3');
    var artistDescription = document.createElement('div');
    var albumList = document.createElement('ul');
        
    var artistGetCall = artistModule.getByIdDeferred(artistId);
    $.when(artistGetCall).done(function (r3) {
        if (r3.length > 0) {
            var name = r3[0].name;
            var description = r3[0].description;
            var artistId = r3[0].id;

            document.getElementById('artistDetailsTab').innerHTML = name;
            artistName.appendChild(document.createTextNode(name));
            artistDescription.appendChild(document.createTextNode(description));
            artistDescription.appendChild(document.createElement('br'));
            artistDescription.appendChild(document.createElement('br'));
            artistDescription.appendChild(document.createTextNode("Albums"));

            var albumsGetCall = albumModule.getByArtistIdDeferred(artistId);
            $.when(albumsGetCall).done(function (r2) {
                for (var i = 0; i < r2.length + 1; i++) {
                    var linkHtml = "";
                    var album = r2[i];
                    var item = document.createElement('li');
                    var link = document.createElement("a");
                    link.href = '#';
                    if (i < r2.length) {
                        link.innerHTML = album.name;
                        link.id = album.id;
                        link.onclick = function () {
                            $('#selectedAlbumId').val(this.id);
                            showAlbumDetailsDiv(this.id, 'true');
                            return false;
                        };
                    }
                    else {
                        link.innerHTML = "Add Album";
                        link.onclick = function () {
                            showAddEditAlbumDiv('true', 'true');
                            return false;
                        };
                    }
                    item.appendChild(link);
                    albumList.appendChild(item);
                }
            });
        }
    });
    document.getElementById('artistDetailsContentDiv').innerHTML = '';
    document.getElementById('artistDetailsContentDiv').appendChild(artistName);
    document.getElementById('artistDetailsContentDiv').appendChild(artistDescription);
    document.getElementById('artistDetailsContentDiv').appendChild(albumList);
}

function saveArtistDetails(artistName, artistDescription, addArtist)
{
    if (addArtist == "true") {
        var artist = { name: artistName, description: artistDescription };
        var insertCall = artistModule.insert(artist);
        $.when(insertCall).done(function (result) {
            showArtistDetailsDiv(result.id, 'true');
        });
    }
    else if (addArtist == "false") {
        var selectedArtistId = $('#selectedArtistId').val();

        var getArtistCall = artistModule.getByIdDeferred(selectedArtistId);
        $.when(getArtistCall).done(function (r3) {
            if (r3.length > 0) {
                var name = r3[0].name;
                var description = r3[0].description;
                var artistId = r3[0].id;

                if (name != artistName && artistName != '') {
                    name = artistName;
                }
                if (description != artistDescription && artistDescription != '') {
                    description = artistDescription;
                }

                var artist = { id: artistId, name: name, description: description };

                var updateCall = artistModule.update(artist);
                $.when(updateCall).done(function (result) {
                    showArtistDetailsDiv(result.id, 'true');
                });
            }
        });
    }
}

function displayAlbumDetails(albumId)
{
    var albumName = document.createElement('h3');
    var albumDescription = document.createElement('div');
    var songList = document.createElement('ul');
    var getAlbumCall = albumModule.getByIdDeferred(albumId);
    $.when(getAlbumCall).done(function (r3) {
        if (r3.length > 0) {
            albumId = r3[0].id;
            var name = r3[0].name;
            var description = r3[0].description;
            var artistId = r3[0].artistId;
            var imageUrl = r3[0].imageUrl;

            document.getElementById('albumNameTab').innerHTML = name;            
            albumName.appendChild(document.createTextNode(name));
            albumDescription.appendChild(document.createTextNode(description));
            albumDescription.appendChild(document.createElement('br'));
            albumDescription.appendChild(document.createElement('br'));
            albumDescription.appendChild(document.createTextNode("Songs"));
            
            var getSongsCall = songModule.getByAlbumIdDeferred(albumId);
            $.when(getSongsCall).done(function (r2) {
                for (var i = 0; i < r2.length + 1; i++) {
                    var linkHtml = "";
                    var song = r2[i];
                    var item = document.createElement('li');
                    var link = document.createElement("a");
                    link.href = '#';                    
                    if (i < r2.length) {
                        link.id = song.id;
                        link.innerHTML = song.name;
                        link.onclick = function () {
                            $('#selectedSongId').val(this.id);
                            showSongInfoDiv(this.id, 'true');
                            return false;
                        };
                    }
                    else {
                        link.innerHTML = "Add Song";
                        link.onclick = function () {
                            showAddEditSongInfoDiv('true', 'true');
                            return false;
                        };
                    }
                    item.appendChild(link);
                    songList.appendChild(item);
                }
            });
        }
    });
    document.getElementById('albumNameContentDiv').innerHTML = '';
    document.getElementById('albumNameContentDiv').appendChild(albumName);
    document.getElementById('albumNameContentDiv').appendChild(albumDescription);
    document.getElementById('albumNameContentDiv').appendChild(songList);
}

function saveAlbumDetails(albumName, albumDescription, albumImageUrl, addAlbum) {
    if (addAlbum == "true") {
        var album = { artistId: $('#selectedArtistId').val(), name: albumName, description: albumDescription, imageUrl: albumImageUrl };
        var insertCall = albumModule.insert(album);
        $.when(insertCall).done(function (result) {
            showAlbumDetailsDiv(result.id, 'true');
        });
    }
    else if (addAlbum == "false") {
        var selectedAlbumId = $('#selectedAlbumId').val();
        var getAlbumCall = albumModule.getByIdDeferred(selectedAlbumId);
        $.when(getAlbumCall).done(function (r3) {
            if (r3.length > 0) {
                var id = r3[0].id;
                var artistId = r3[0].artistId;
                var name = r3[0].name;
                var description = r3[0].description;
                var imageUrl = r3[0].imageUrl;
                
                if (name != albumName && albumName != '') {
                    name = albumName;
                }
                if (description != albumDescription && albumDescription != '') {
                    description = albumDescription;
                }
                if (imageUrl != albumImageUrl && albumImageUrl != '') {
                    imageUrl = albumImageUrl;
                }

                var album = { id: id, artistId: artistId, name: name, description: description, imageUrl: imageUrl };

                var updateCall = albumModule.update(album);
                $.when(updateCall).done(function (result) {
                    showAlbumDetailsDiv(result.id, 'true');
                });
            }
        });
    }
}

function displaySongDetails(songId) {
    var songName = document.createElement('h3');
    var songInfoUrl = document.createElement('div');
    var songInfoDuration = document.createElement('div');

    var getSongCall = songModule.getByIdDeferred(songId);
    $.when(getSongCall).done(function (r3) {
        if (r3.length > 0) {
            var songId = r3[0].id;
            var albumId = r3[0].albumId;
            var name = r3[0].name;
            var songUrl = r3[0].songUrl;
            var length = r3[0].length;

            document.getElementById('songInfoTab').innerHTML = name;
            songName.appendChild(document.createTextNode(name));
            var link = document.createElement("a");
            link.href = songUrl;
            link.innerHTML = songUrl;

            songInfoUrl.appendChild(document.createTextNode("Link: "));
            songInfoUrl.appendChild(link);
            songInfoDuration.appendChild(document.createTextNode("Duration: " + length));
        }
    });
    document.getElementById('songInfoContentDiv').innerHTML = '';
    document.getElementById('songInfoContentDiv').appendChild(songName);
    document.getElementById('songInfoContentDiv').appendChild(songInfoUrl);
    document.getElementById('songInfoContentDiv').appendChild(songInfoDuration);
    document.getElementById('songInfoContentDiv').appendChild(document.createElement('br'));
}

function saveSongDetails(songName, songUrl, songDuration, addSong) {
    if (addSong == "true") {
        var song = { albumId: $('#selectedAlbumId').val(), name: songName, songUrl: songUrl, length: songDuration};
        var insertCall = songModule.insert(song);
        $.when(insertCall).done(function (result) {
            showSongInfoDiv(result.id, 'true');
        });
    }
    else if (addSong == "false") {
        var selectedSongId = $('#selectedSongId').val();
        var getSongCall = songModule.getByIdDeferred(selectedSongId);
        $.when(getSongCall).done(function (r3) {
            if (r3.length > 0) {
                var id = r3[0].id;
                var albumId = r3[0].albumId;
                var name = r3[0].name;
                var url = r3[0].songUrl;
                var length = r3[0].length;

                if (name != songName && songName != '') {
                    name = songName;
                }
                if (url != songUrl && songUrl != '') {
                    url = songUrl;
                }
                if (length != songDuration && songDuration != '') {
                    length = songDuration;
                }

                var song = { id: id, albumId: albumId, name: name, songUrl: url, length: length };

                var updateCall = songModule.update(song);
                $.when(updateCall).done(function (result) {
                    showSongInfoDiv(result.id, 'true');
                });
            }
        });
    }
}

// #1
function showHomeDiv() {
    $('#selectedArtistId').val('');
    $('#selectedAlbumId').val('');
    $('#selectedSongId').val('');
    $("#editSongInfoDiv").hide();
    $("#songInfoDiv").hide();
    $("#addEditAlbumDiv").hide();
    $("#albumNameDiv").hide();
    $("#artistAddEditDiv").hide();
    $("#artistDetailsDiv").hide();
    // tabs
    $("#artistDetailsTab").hide();
    $("#artistAddEditTab").hide();
    $("#albumNameTab").hide();
    $("#addEditAlbumTab").hide();
    $("#songInfoTab").hide();
    $("#editSongInfoTab").hide();    
    $("#homeTab").show();
    $("#homeDiv").show();
    artistSearch($('#artistInput').val());
}

// #2
function showArtistDetailsDiv(artistId, triggerTabClick) {
    $("#homeDiv").hide();
    $("#editSongInfoDiv").hide();
    $("#songInfoDiv").hide();
    $("#addEditAlbumDiv").hide();
    $("#albumNameDiv").hide();
    $("#artistAddEditDiv").hide();
    $("#artistDetailsDiv").show();
    // tabs
    $("#artistAddEditTab").hide();
    $("#albumNameTab").hide();
    $("#addEditAlbumTab").hide();
    $("#songInfoTab").hide();
    $("#editSongInfoTab").hide();
    $("#homeTab").show();
    $("#artistDetailsTab").show();
    if (triggerTabClick == "true") {
        $("#artistDetailsTab").trigger("click");
    }
    displayArtistDetails(artistId);
}

// #3
function showArtistAddEditDiv(addArtist, triggerTabClick) {
    $("#addArtist").val(addArtist);
    $("#homeDiv").hide();
    $("#artistDetailsDiv").hide();
    $("#editSongInfoDiv").hide();
    $("#songInfoDiv").hide();
    $("#addEditAlbumDiv").hide();
    $("#albumNameDiv").hide();
    // tabs
    $("#artistDetailsTab").hide();
    $("#albumNameTab").hide();
    $("#addEditAlbumTab").hide();
    $("#songInfoTab").hide();
    $("#editSongInfoTab").hide();
    $("#homeTab").show();
    $("#artistAddEditTab").show();
    if (triggerTabClick == "true") {
        $("#artistAddEditTab").trigger("click");
    }
    $("#artistAddEditDiv").show();
}

// #4
function showAlbumDetailsDiv(albumId, triggerTabClick) {
    $("#homeDiv").hide();
    $("#artistDetailsDiv").hide();
    $("#artistAddEditDiv").hide();
    $("#editSongInfoDiv").hide();
    $("#songInfoDiv").hide();
    $("#addEditAlbumDiv").hide();
    // tabs
    $("#artistDetailsTab").hide();
    $("#artistAddEditTab").hide();
    $("#addEditAlbumTab").hide();
    $("#songInfoTab").hide();
    $("#editSongInfoTab").hide();
    $("#homeTab").show();
    $("#albumNameTab").show();
    if (triggerTabClick == "true") {
        $("#albumNameTab").trigger("click");
    }
    $("#albumNameDiv").show();
    displayAlbumDetails(albumId);
}

// #5
function showAddEditAlbumDiv(addAlbum, triggerTabClick) {
    $("#addAlbum").val(addAlbum);
    $("#homeDiv").hide();
    $("#artistDetailsDiv").hide();
    $("#artistAddEditDiv").hide();
    $("#albumNameDiv").hide();
    $("#editSongInfoDiv").hide();
    $("#songInfoDiv").hide();
    // tabs
    $("#artistDetailsTab").hide();
    $("#artistAddEditTab").hide();
    $("#albumNameTab").hide();
    $("#songInfoTab").hide();
    $("#editSongInfoTab").hide();
    $("#homeTab").show();
    $("#addEditAlbumTab").show();
    if (triggerTabClick == "true") {
        $("#addEditAlbumTab").trigger("click");
    }
    $("#addEditAlbumDiv").show();
}

// #6
function showSongInfoDiv(songId, triggerTabClick) {
    $("#homeDiv").hide();
    $("#artistDetailsDiv").hide();
    $("#artistAddEditDiv").hide();
    $("#albumNameDiv").hide();
    $("#addEditAlbumDiv").hide();
    $("#editSongInfoDiv").hide();
    // tabs
    $("#artistDetailsTab").hide();
    $("#artistAddEditTab").hide();   
    $("#addEditAlbumTab").hide();
    $("#editSongInfoTab").hide();
    $("#albumNameTab").show();
    $("#homeTab").show();    
    $("#songInfoTab").show();
    if (triggerTabClick == "true") {
        $("#songInfoTab").trigger("click");
    }
    $("#songInfoDiv").show();
    displaySongDetails(songId);
}

// #7
function showAddEditSongInfoDiv(addSong, triggerTabClick) {
    $("#addSong").val(addSong);
    $("#homeDiv").hide();
    $("#artistDetailsDiv").hide();
    $("#artistAddEditDiv").hide();
    $("#albumNameDiv").hide();
    $("#addEditAlbumDiv").hide();
    $("#songInfoDiv").hide();
    //tabs
    $("#artistDetailsTab").hide();
    $("#artistAddEditTab").hide();
    $("#albumNameTab").hide();
    $("#addEditAlbumTab").hide();
    $("#songInfoTab").hide();
    $("#homeTab").show();
    $("#editSongInfoTab").show();
    if (triggerTabClick == "true") {
        $("#editSongInfoTab").trigger("click");
    }
    $("#editSongInfoDiv").show();
}

/*
    AzureClientService_Music.js
    This whole section extracted from a file and put here to make a single page demo
*/

// Module: mobileClient
// re-used for all of the query modeules
var mobileClientModule = (function () {
    var clientUrl = "https://magenicmasters.azure-mobile.net/";
    var clientCreds = "RzogwiXjcgelcBlWVcqRRTCAfIWJEs17";

    return {
        makeClient: function () {
            return new WindowsAzure.MobileServiceClient(clientUrl, clientCreds);
        }

        /* Mobile Client Helper to make query into a jQuery promise (deferred) */
        // From http://stackoverflow.com/questions/21510214/when-with-multiple-promises-not-working-as-expected by carlosfigueira
     , tableReadDeferred: function (query) {
         var deferred = $.Deferred(function () {
             query.read().done(function (result) {
                 deferred.resolve(result);
             }, function (err) {
                 deferred.reject(err);
             });
         });
         return deferred;
     }

        , tableUpdateDeferred: function (query) {
            var deferred = $.Deferred(function () {
                query.done(function (result) {
                    deferred.resolve(result);
                }, function (err) {
                    deferred.reject(err);
                });
            });
            return deferred;
        }

        , tableInsertDeferred: function (query) {
            var deferred = $.Deferred(function () {
                query.done(function (result) {
                    deferred.resolve(result);
                }, function (err) {
                    deferred.reject(err);
                });
            });
            return deferred;
        }
    } // return 
}());

// Module: Artist Queries
// Artist: id, name, description
var artistModule = (function () {
    return {
        getAllDeferred: function () {
            var client = mobileClientModule.makeClient();
            var artistTable = client.getTable('Artist');
            var query = artistTable;
            var d1 = mobileClientModule.tableReadDeferred(query);
            return d1;
        } // getAll

      , getByIdDeferred: function (id) {
          var client = mobileClientModule.makeClient();
          var aTable = client.getTable('Artist');
          var query = aTable
              .where(
                  { id: id }
              );
          var d1 = mobileClientModule.tableReadDeferred(query);
          return d1;
      } // getById

      , searchDeferred: function (artistText) {
          var client = mobileClientModule.makeClient();
          var artistTable = client.getTable('Artist');
          var query = artistTable
              // where takes N arguments of the form filtering_f(x), args...
              .where(
                  function (artistText) {
                      return this.name.indexOf(artistText) >= 0;
                  }, artistText
              );
          var d1 = mobileClientModule.tableReadDeferred(query);
          return d1;
      } // search

        , update: function (artist) {
            var client = mobileClientModule.makeClient();
            var artistTable = client.getTable('Artist');
            // name, description
            var query = artistTable.update(artist);
            var d1 = mobileClientModule.tableUpdateDeferred(query);
            return d1;
            //var query = artistTable.update(artist).done(function (result) {
            //    // Code here to get the artist id to pass along.                
            //});
        } // update

        , insert: function (artist) {
            var client = mobileClientModule.makeClient();
            var artistTable = client.getTable('Artist');
            // name, description
            var query = artistTable.insert(artist);
            var d1 = mobileClientModule.tableInsertDeferred(query);
            return d1;
            //var query = artistTable.insert(artist).done(function (result) {
            //    // Code here to get the artist id to pass along.                
            //});
        } // insert
    }
}());

var albumModule = (function () {
    return {
        getAllDeferred: function () {
            var client = mobileClientModule.makeClient();
            var albumTable = client.getTable('Album');
            var query = albumTable;
            var d1 = mobileClientModule.tableReadDeferred(query);
            return d1;
        } // getAll

        , getByIdDeferred: function (id) {
            var client = mobileClientModule.makeClient();
            var aTable = client.getTable('Album');
            var query = aTable
                .where(
                    { id: id }
                );
            var d1 = mobileClientModule.tableReadDeferred(query);
            return d1;
        } // getById

      , getByArtistIdDeferred: function (artistId) {
          var client = mobileClientModule.makeClient();
          var aTable = client.getTable('Album');
          var query = aTable
              .where(
                  { artistId: artistId }
              );
          var d1 = mobileClientModule.tableReadDeferred(query);
          return d1;
      } // getByArtistId

      , searchDeferred: function (artistText) {
          var client = mobileClientModule.makeClient();
          var albumTable = client.getTable('Album');
          var query = albumTable
              // where takes N arguments of the form filtering_f(x), args...
              .where(
                  function (artistText) {
                      return this.name.indexOf(artistText) >= 0;
                  }, artistText
              );
          var d1 = mobileClientModule.tableReadDeferred(query);
          return d1;
      } // search

        , update: function (album) {
            var client = mobileClientModule.makeClient();
            var albumTable = client.getTable('Album');
            var query = albumTable.update(album);
            var d1 = mobileClientModule.tableUpdateDeferred(query);
            return d1;
            //var query = albumTable.update(album).done(function (result) {
            //    // Code here to get the album id to pass along.
            //    // artistId, name, description, imageUrl
            //});
        } // update

        , insert: function (album) {
            var client = mobileClientModule.makeClient();
            var albumTable = client.getTable('Album');
            // artistId, name, description, imageUrl
            var query = albumTable.insert(album);
            var d1 = mobileClientModule.tableInsertDeferred(query);
            return d1;
            //var query = albumTable.insert(album).done(function (result) {
            //    // Code here to get the album id to pass along.                
            //});
        } // insert
    }
}());

var songModule = (function () {
    return {
        getAllDeferred: function () {
            var client = mobileClientModule.makeClient();
            var trackTable = client.getTable('Track');
            var query = trackTable;
            var d1 = mobileClientModule.tableReadDeferred(query);
            return d1;
        } // getAll

        , getByIdDeferred: function (id) {
            var client = mobileClientModule.makeClient();
            var aTable = client.getTable('Track');
            var query = aTable
                .where(
                    { id: id }
                );
            var d1 = mobileClientModule.tableReadDeferred(query);
            return d1;
        } // getById

      , getByAlbumIdDeferred: function (albumId) {
          var client = mobileClientModule.makeClient();
          var aTable = client.getTable('Track');
          var query = aTable
              .where(
                  { albumId: albumId }
              );
          var d1 = mobileClientModule.tableReadDeferred(query);
          return d1;
      } // getByAlbumId

      , searchDeferred: function (trackText) {
          var client = mobileClientModule.makeClient();
          var trackTable = client.getTable('Track');
          var query = trackTable
              // where takes N arguments of the form filtering_f(x), args...
              .where(
                  function (trackText) {
                      return this.name.indexOf(trackText) >= 0;
                  }, trackText
              );
          var d1 = mobileClientModule.tableReadDeferred(query);
          return d1;
      } // search

        , update: function (track) {
            var client = mobileClientModule.makeClient();
            var trackTable = client.getTable('Track');
            var query = trackTable.update(track);
            var d1 = mobileClientModule.tableUpdateDeferred(query);
            return d1;
            //var query = trackTable.update(track).done(function (result) {
            //    // Code here to get the track id to pass along.
            //    // artistId, name, description, imageUrl
            //});
        } // update

        , insert: function (track) {
            var client = mobileClientModule.makeClient();
            var trackTable = client.getTable('Track');
            // artistId, name, description, imageUrl
            var query = trackTable.insert(track);
            var d1 = mobileClientModule.tableInsertDeferred(query);
            return d1;
            //var query = trackTable.insert(track).done(function (result) {
            //    // Code here to get the track id to pass along.                
            //});
        } // insert
    }
}());