function loadAlbumGrid() {
    $("#artistGrid").hide();
    $("#songGrid").hide();
    $("#albumGrid").show();

    var baseUrl = "http://musicapp.jwendl.net/odata/Albums",
        expandStatement = "?$expand=Artist";

    $("#albumGrid").kendoGrid({
        dataSource: {
            type: "odata",
            transport: {
                read: {
                    url: baseUrl + expandStatement,
                    dataType: "json"
                },
                create: {
                    url: baseUrl + expandStatement,
                    dataType: "json"
                },
                update: {
                    url: function (data) {
                        return baseUrl + "(" + data.Id + ")";
                    },
                    dataType: "json"
                },
                destroy: {
                    url: function (data) {
                        return baseUrl + "(" + data.Id + ")";
                    },
                    dataType: "json"
                }
            },
            schema: {
                data: function (data) {
                    if (data.value) {
                        return data.value;
                    }

                    delete data["odata.metadata"];
                    return [data];
                },
                total: function (data) {
                    return data["odata.count"];
                },
                model: {
                    id: "Id",
                    fields: {
                        Id: { type: "number", nullable: false },
                        Name: { type: "string", validation: { required: true } },
                        Description: { type: "string" },
                        ArtistId: { type: "number", defaultValue: 1, validation: { required: true } },
                        ImageUrl: { type: "string" },
                    }
                }
            },
            requestEnd: function (e) {
                if (e.type === 'update' || e.type === 'create') {
                    this.read();
                }
            },
            error: function (e) {
                var message = e.xhr.responseText;
                var innerMessage = e.xhr.statusText;
                if (e.xhr.responseJSON != null) {
                    message = e.xhr.responseJSON["odata.error"].message.value;
                    innerMessage = e.xhr.responseJSON["odata.error"].innererror.message;
                }
                alert(message + "\n\n" + innerMessage);
            },
            batch: false,
            pageSize: 10,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true
        },
        save: function (e) {
            var dropDownList = $("#ArtistIdDropDownList").data("kendoDropDownList");
            e.model.ArtistId = dropDownList.value();
        },
        filterable: {
            extra: false,
            operators: {
                string: {
                    startswith: "Starts with",
                    eq: "Is equal to",
                    neq: "Is not equal to"
                }
            }
        },
        height: 430,
        toolbar: kendo.template($("#albumGridToolbarTemplate").html()),
        editable: "inline",
        sortable: true,
        pageable: true,
        columns: [
        {
            field: "Name",
            filterable: true,
            title: "Name"
        },
        {
            field: "Description",
            filterable: true,
            title: "Description"
        },
        {
            field: "ImageUrl",
            filterable: true,
            title: "ImageUrl"
        },
        {
            field: "ArtistId",
            editor: artistIdEditor,
            template: "#if (data.Artist !== undefined) {# #= Artist.Name # #} else {# #= '' # #}#",
            title: "Artist"
        },
        {
            command: ["edit", "destroy"], title: "&nbsp;",
            attributes: { style: "white-space:nowrap;" },
            width: "182px"
        }]
    });
}

function artistIdEditor(container, options) {
    var foreignKeyUrl = "http://musicapp.jwendl.net/odata/Artists";

    $('<input required id="ArtistIdDropDownList" data-text-field="Name" data-value-field="Id" data-bind="value:' + options.field + '" />')
        .appendTo(container)
        .kendoDropDownList({
            autoBind: false,
            dataSource: {
                type: "odata",
                transport: {
                    read: {
                        url: foreignKeyUrl,
                        dataType: "json"
                    }
                },
                schema: {
                    data: function (data) {
                        return data.value;
                    },
                    total: function (data) {
                        return data["odata.count"];
                    }
                }
            }
        });
}