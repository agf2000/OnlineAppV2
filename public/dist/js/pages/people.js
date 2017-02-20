$(function () {

    $(".box-body").LoadingOverlay("show");

    $.fn.dataTableExt.oApi.fnSetFilteringDelay = function (oSettings, iDelay) {
        var _that = this;

        if (iDelay === undefined) {
            iDelay = 500;
        }

        this.each(function (i) {
            if (typeof _that.fnSettings().aanFeatures.f !== 'undefined') {
                $.fn.dataTableExt.iApiIndex = i;
                var
                    oTimerId = null,
                    sPreviousSearch = null,
                    anControl = $('input', _that.fnSettings().aanFeatures.f);

                anControl.unbind('keyup search input').bind('keyup search input', function () {

                    if (sPreviousSearch === null || sPreviousSearch != anControl.val()) {
                        window.clearTimeout(oTimerId);
                        sPreviousSearch = anControl.val();
                        oTimerId = window.setTimeout(function () {
                            $.fn.dataTableExt.iApiIndex = i;
                            _that.fnFilter(anControl.val());
                        }, iDelay);
                    }
                });

                return this;
            }
        });
        return this;
    };

    // $.ajax({
    //     url: '/api/people/getPeople?portalId=0&pageIndex=1&pageSize=1000&orderBy=personId&orderDir=asc&searchfor=',
    //     method: 'get',
    //     dataType: 'json',
    //     success: function (data) {
    //         // var test = data[0];
    //         $('#example2').dataTable({
    //             data: data,
    //             columns: [
    //                 { 'data': 'PersonId' },
    //                 { 'data': 'DisplayName' },
    //                 { 'data': 'FirstName' },
    //                 { 'data': 'LastName' }
    //             ]
    //         });
    //     }
    // });

    var events = $('#events');

    var table = $('#people').DataTable({
        select: {
            style: 'single',
            blurable: true
        },
        // select: true,
        // autoFill: true,
        dom: 'Bfrtip',
        stateSave: true,
        buttons: [
            // 'selected',
            // 'selectedSingle',
            // 'selectAll',
            // 'selectNone',
            // 'selectRows',
            // 'selectColumns',
            {
                action: function (e, dt, node, config) {
                    dt.ajax.reload();
                },
                text: '<i class="fa fa-refresh"></i>',
                titleAttr: 'Recarregar'
            },
            {
                extend: 'excelHtml5',
                text: '<i class="fa fa-file-excel-o"></i>',
                titleAttr: 'Expotar p/ Excel'
            },
            {
                extend: 'pdfHtml5',
                text: '<i class="fa fa-file-pdf-o"></i>',
                titleAttr: 'Salvar em PDF'
            },
            {
                extend: 'print',
                text: '<i class="fa fa-print"></i>',
                titleAttr: 'Imprimir'
            },
            {
                extend: 'colvis',
                text: '<i class="fa fa-eye"></i>',
                titleAttr: 'Colunas'
            },
            // {
            //     action: function (e, dt, type, indexes) {
            //         var tableData = $('#people tr.selected').children("td").map(function () {
            //             return $(this).text();
            //         }).get();

            //         alert("Your data is: " + $.trim(tableData[0]));
            //     },
            //     text: '<i class="fa fa-edit"></i>',
            //     titleAttr: 'Editar'
            // }
        ],
        columns: [
            { 'data': 'PersonId' },
            { 'data': 'CompanyName' },
            { 'data': 'FirstName' },
            { 'data': 'LastName' },
            { 'data': 'DisplayName' },
            {
                'data': 'Telephone', 'render': function (value) {
                    return (value !== null ? value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3') : '')
                }
            },
            { 'data': 'statustitle' },
            { 'data': 'haslogin', 'sortable': false, 'render': function (value) { return (value == 1 ? 'Sim' : 'Não') } }
        ],
        "language": {
            "sEmptyTable": "Nenhum registro encontrado",
            "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
            "sInfoFiltered": "(Filtrados de _MAX_ registros)",
            "sInfoPostFix": "",
            "sInfoThousands": ".",
            "sLengthMenu": "_MENU_ resultados por página",
            "sLoadingRecords": "Carregando...",
            "sProcessing": "Processando...",
            "sZeroRecords": "Nenhum registro encontrado",
            "sSearch": "Pesquisar",
            "oPaginate": {
                "sNext": "Próximo",
                "sPrevious": "Anterior",
                "sFirst": "Primeiro",
                "sLast": "Último"
            },
            "oAria": {
                "sSortAscending": ": Ordenar colunas de forma ascendente",
                "sSortDescending": ": Ordenar colunas de forma descendente"
            }
        },
        "processing": true,
        "serverSide": true,
        "ajax": "/api/people/getPeople"
    });

    table.on('draw.dt', function () {
        $(".box-body").LoadingOverlay("hide", true);
    });

    table.on('select', function (e, dt, type, indexes) {
        var rowData = table.rows(indexes).data().toArray();
        console.log("data---" + rowData);
    })
        .on('deselect', function (e, dt, type, indexes) {
            var rowData = table.rows(indexes).data().toArray();
            console.log("data---" + rowData);
        });

    // $('#people tbody').on('click', 'tr', function () {
    //     if ($(this).hasClass('selected')) {
    //         $(this).removeClass('selected');
    //     }
    //     else {
    //         table.$('tr.selected').removeClass('selected');
    //         $(this).addClass('selected');
    //     }
    // });

}());