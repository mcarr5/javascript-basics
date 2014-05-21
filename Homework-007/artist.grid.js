$(document).ready(loadArtistGrid);

function loadArtistGrid() {
    $("#albumGrid").hide();
    $("#songGrid").hide();
    $("#artistGrid").show();

    var baseUrl = "http://musicapp.jwendl.net/odata/Artists";
    $("#artistGrid").kendoGrid({
        dataSource: {
            type: "odata",
            transport: {
                read: {
                    url: baseUrl,
                    dataType: "json"
                },
                create: {
                    url: baseUrl,
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
                        Description: { type: "string" }
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
        toolbar: kendo.template($("#artistGridToolbarTemplate").html()),
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
            command: ["edit", "destroy"], title: "&nbsp;",
            attributes: { style: "white-space:nowrap;" },
            width: "182px"
        }]
    });
}