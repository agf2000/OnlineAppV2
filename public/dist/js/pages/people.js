$(function() {

    PNotify.prototype.options.styling = "bootstrap3";
    kendo.culture("pt-BR");
    kendo.culture().calendar.firstDay = 1;
    my.today = new Date();

    $('#kddlConditions').kendoDropDownList();

    // Clients transport
    var clientsTransport = {
        read: {
            url: '/api/people/getClients'
        },
        parameterMap: function(data, type) {
            var strSearch = $('.tbSearchFor input:first').val().length > 0 ? ' and ' +
                $('.selectSearchFor select:first option:selected').val() + ' ' +
                $('.selectConditions select:first option:selected').val() + " '" +
                ($('.selectConditions select:first option:selected').val() == 'like' ?
                    "%" + $('.tbSearchFor input:first').val() + "%'" :
                    $('.tbSearchFor input:first').val() + "'") : '';
            if ($('.tbSearchFor input:first').val().length > 0 && $('.tbSearchFor2 input:first').val().length > 0) {
                strSearch = ' and ' + $('.selectSearchFor select:first option:selected').val() + ' ' +
                    $('.selectConditions select:first option:selected').val() + " '" +
                    $('.tbSearchFor input:first').val() + "' and '" + $('.tbSearchFor2 input:first').val() + "'";
            }
            if ($('.selectSearchFor select.cloned').length > 0) {
                $.each($('.tbSearchFor input.cloned'), function(i, item) {
                    if ($('.tbSearchFor input.cloned')[i].value.length > 0 && $('.tbSearchFor2 input.cloned')[i].value.length > 0) {
                        strSearch += ($('input[type=checkbox].cloned').eq(i).is(':checked') ? ' and ' : ' or ') +
                            $('.selectSearchFor select.cloned option:selected')[i].value + ' ' +
                            $('.selectConditions select.cloned option:selected')[i].value + ' ' + "'" +
                            $('.tbSearchFor input.cloned')[i].value + "' and '" + $('.tbSearchFor2 input.cloned')[i].value + "'";
                    } else if ($('.tbSearchFor input')[i].value.length > 0) {
                        strSearch += ($('input[type=checkbox].cloned').eq(i).is(':checked') ? ' and ' : ' or ') +
                            $('.selectSearchFor select.cloned option:selected')[i].value + ' ' +
                            $('.selectConditions select.cloned option:selected')[i].value + ' ' + "'" +
                            ($('.selectConditions select.cloned option:selected')[i].value == 'like' ? "%" +
                                $('.tbSearchFor input.cloned')[i].value + "%'" : $('.tbSearchFor input.cloned')[i].value + "'");
                    }
                });
            }
            return {
                portalId: 0,
                searchFor: strSearch,
                pageIndex: data.page,
                pageSize: data.pageSize,
                orderBy: data.sort[0] ? data.sort[0].field : 'personid',
                orderDir: data.sort[0] ? data.sort[0].dir : 'desc'
            };
        }
    };

    // clients datasource
    var clientsDataSource = new kendo.data.DataSource({
        transport: clientsTransport,
        pageSize: 10,
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        sort: {
            field: "personid",
            dir: "desc"
        },
        schema: {
            model: {
                id: 'personid',
                fields: {
                    personid: {
                        editable: false,
                        nullable: false
                    },
                    modifiedondate: {
                        type: "date",
                        format: "{0:MM/dd/yyyy}"
                    },
                    createdondate: {
                        type: "date",
                        format: "{0:dd/MM/yyyy}"
                    }
                }
            },
            data: 'data',
            total: 'total_count'
        }
    });

    var clientsGrid = $('#clientsGrid').kendoGrid({
        //autoBind: false,
        dataSource: clientsDataSource,
        //height: 380,
        selectable: "row",
        change: function(e) {
            var row = this.select();
            var id = row.data("uid");
            my.uId = id;
            var dataItem = this.dataItem(row);
            if (dataItem) {
                $('#btnEditSelected').attr({
                    'disabled': false
                });
                $('#btnDeleteSelected').attr({
                    'disabled': false
                });
            }

            // if (my.admin || (dataItem.Cod_Funcionario == 0 || dataItem.Cod_Funcionario == my.userInfo.sgiid)) {
            //     $('#btnDeleteSelected').attr({
            //         'disabled': false
            //     });
            // } else {
            //     $('#btnDeleteSelected').attr({
            //         'disabled': true
            //     });
            // }
        },
        toolbar: kendo.template($("#tollbarTmpl").html()),
        navigatable: true,
        columns: [{
                field: "personid",
                title: "Cód.",
                width: 75,
                template: '#= my.padLeft(personid, 6) #'
            },
            {
                field: "displayname",
                title: "Fantasia / Apelido",
                width: 200
            },
            {
                field: "phone",
                title: "Tel. Principal",
                width: 120
            },
            {
                field: "cellphone",
                title: "Tel. Principal",
                width: 120,
                hidden: true
            },
            {
                field: "faxphone",
                title: "Tel. Principal",
                width: 120,
                hidden: true
            },
            {
                field: "contact",
                title: "Contato",
                width: 100
            },
            {
                field: "cpf_cnpj",
                title: "CPF/CNPJ",
                width: 130
            },
            {
                field: "companyname",
                title: "Razão Social",
                width: 200
            },
            {
                field: "completeaddress",
                title: "Endereço",
                width: 450,
                sortable: false
            }
        ],
        sortable: {
            allowUnsort: true
        },
        reorderable: true,
        resizable: true,
        //navigatable: true,
        //scrollable: true,
        //pdf: {
        //    fileName: 'Tarefas_Grid.pdf',
        //    allPages: true
        //},
        pageable: {
            pageSizes: [10, 40, 70, 100],
            refresh: true,
            numeric: false,
            input: true,
            messages: {
                display: "{0} - {1} de {2} clientes",
                empty: "Sem Registro.",
                page: "Página",
                of: "de {0}",
                itemsPerPage: "Clientes por vez",
                first: "Ir para primeira página",
                previous: "Ir para página anterior",
                next: "Ir para próxima página",
                last: "Ir para última página",
                refresh: "Recarregar"
            }
        },
        dataBound: function() {
            $('#btnEditSelected').attr({
                'disabled': true
            });
            $('#btnDeleteSelected').attr({
                'disabled': true
            });

            var grid = this;
            grid.element.find('tbody tr:first').addClass('k-state-selected');
            var selectedItem = grid.dataItem(grid.select());

            if (selectedItem) {
                var row = this.select();
                var id = row.data("uid");
                my.uId = id;

                // if (my.admin || (selectedItem.Cod_Funcionario == 0 || selectedItem.Cod_Funcionario == my.userInfo.sgiid)) {
                //     $('#btnEditSelected').attr({
                //         'disabled': false
                //     });
                //     $('#btnDeleteSelected').attr({
                //         'disabled': false
                //     });
                // }
            }

            /*$.each(grid.dataSource.data(), function (i, item) {
                var rowSelector = ">tr:nth-child(" + (i + 1) + ")";
                var row = grid.tbody.find(rowSelector);

                if (item.Cod_Funcionario > 0 && item.Cod_Funcionario != my.userInfo.sgiid) {
                    row.css({ 'display': 'none' });
                }
            });*/

            $('#spanDateDisplay').html(moment(my.today).format('DD/MM/YYYY'));
            $('.overlay').remove();
        },
        columnMenu: {
            messages: {
                sortAscending: "Ordenar A-Z",
                sortDescending: "Ordenar Z-A",
                filter: "Filtro",
                columns: "Colunas"
            }
        }
        //editable: true
    }).data('kendoGrid');

    $(document.body).keydown(function(e) {
        if (e.altKey && e.keyCode == 71) {
            $("#clientsGrid").data("kendoGrid").table.focus();
        }
    });

    var arrows = [37, 38, 39, 40];
    clientsGrid.table.on("keydown", function(e) {
        if (arrows.indexOf(e.keyCode) >= 0) {
            if (e.keyCode == 38) {
                setTimeout(function() {
                    clientsGrid.select($('#clientsGrid').data('kendoGrid').select().prev());
                }, 1);
            }
            if (e.keyCode == 40) {
                setTimeout(function() {
                    clientsGrid.select($('#clientsGrid').data('kendoGrid').select().next());
                }, 1);
            }
        }
    });

    $('#btnEditSelected').click(function(e) {
        if (e.clientX === 0) {
            return false;
        }
        e.preventDefault();

        var grid = $('#clientsGrid').data("kendoGrid");
        var dataItem = grid.dataSource.getByUid(my.uId);

        window.location.href = '/admin/clientes/' + dataItem.personid; // + '/' + orderBy + '/' + orderDir;
    });

    $('#btnAdd').click(function(e) {
        if (e.clientX === 0) {
            return false;
        }
        e.preventDefault();

        window.location.href = '/admin/clientes/novo';
    });

    $("#clientsGrid").delegate("tbody > tr", "dblclick", function(e) {
        if (e.clientX === 0) {
            return false;
        }
        e.preventDefault();

        $('#btnEditSelected').click();
    });

    $('#tbSearchFor').keyup(function(e) {
        if (e.keyCode === 13) {
            $('#btnRecarregar').click();
        }
    });

    $('#btnDoSearch').click(function(e) {
        if (e.clientX === 0) {
            return false;
        }
        e.preventDefault();

        clientsGrid.dataSource.read();
    });

    $('#btnAddFilter').click(function(e) {
        if (e.clientX === 0) {
            return false;
        }
        e.preventDefault();

        $('.selectSearchFor select:first').clone().addClass('cloned').appendTo('.selectSearchFor');
        $('.selectConditions select:first').clone().addClass('cloned').appendTo('.selectConditions');
        $('.tbSearchFor input:first').clone().addClass('cloned').appendTo('.tbSearchFor').parent().find("input:last").val('');
        $('.tbSearchFor2 input:first').clone().addClass('cloned').appendTo('.tbSearchFor2').parent().find("input:last").val('');
        $('.condition input:first').clone().addClass('cloned').appendTo('.filterButtons .form-group');
        $('.filterButtons input.cloned').bootstrapSwitch();
        $('.filterButtons .bootstrap-switch-small:last').css({
            'margin-bottom': '10px'
        });
        $('.filterButtons .bootstrap-switch-small:last').addClass('cloned');
        $('#btnRemoveFilter').removeClass('hidden');
    });

    $('#btnRemoveFilter').click(function(e) {
        if (e.clientX === 0) {
            return false;
        }
        e.preventDefault();

        $('.selectSearchFor select:last').remove();
        $('.selectConditions select:last').remove();
        $('.tbSearchFor input:last').remove();
        $('.tbSearchFor2 input:last').remove();
        $('.bootstrap-switch.cloned:last').remove();

        if ($('.selectSearchFor select').length == 1) {
            $('#btnRemoveFilter').addClass('hidden');
        }
    });

    $('#btnRemoveFilters').click(function(e) {
        if (e.clientX === 0) {
            return false;
        }
        e.preventDefault();

        $('.tbSearchFor input, .tbSearchFor2 input').val('');
        $('.selectSearchFor select.cloned').remove();
        $('.selectConditions select.cloned').remove();
        $('.tbSearchFor input.cloned').remove();
        $('.tbSearchFor2 input.cloned').remove();
        $('.bootstrap-switch.cloned').remove();
        clientsGrid.dataSource.read();
    });

    $.each(clientsGrid.columns, function(key, value) {
        if (value.field == 'codigo') {
            value.title = 'Código';
        }
        if (value.field.toLowerCase() == 'data_cadastro') {
            value.field = 'dbo.removehora(c.data_cadastro)';
        }
        if (value.field.toLowerCase() == 'cpf_cnpj') {
            value.field = 'dbo.removeformato(cpf_cnpj)';
        }
        $('.selectSearchFor select')
            .append($("<option></option>")
                .attr("value", value.field)
                .text(value.title));
    });

    $('.selectSearchFor select')
        .append($("<option></option>")
            .attr("value", 'dbo.removehora(c.data_cadastro)')
            .text('Data Cadastrado'));

}());