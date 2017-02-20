'use strict';

$(function () {

    // $(".treeViewCategories").LoadingOverlay("show", {
    //     image       : "",
    //     fontawesome : "fa fa-spinner fa-spin"
    // });
    PNotify.prototype.options.styling = "bootstrap3";
    my.personId = my.getParameterByName('itemId');
    my.cats = null;
    my.returnUrl = my.getParameterByName('return');
    var menuItems = null;
    // $.fn.validator.Constructor.INPUT_SELECTOR = ':input([type="file"]);'
    my.userInfo = JSON.parse(Cookies.getJSON('OnlineUser').replace('j:', ''));

    // VIEW MODEL
    my.viewModel();

    /*var buttons = '<ul class="inline">';
    buttons += '<li><a href="' + _productsManagerURL + '" class="btn btn-primary btn-medium" title="Produtos"><i class="fa fa-barcode fa-lg"></i></a></li>';
    buttons += '<li><a href="' + _peopleManagerURL + '" class="btn btn-primary btn-medium" title="Entidades"><i class="fa fa-group fa-lg"></i></a></li>';
    buttons += '<li><a href="' + _usersManagerURL + '" class="btn btn-primary btn-medium" title="Colaboradores"><i class="fa fa-suitcase fa-lg"></i></a></li>';
    buttons += '<li><a href="' + _invoicesManagerURL + '" class="btn btn-primary btn-medium" title="Lançamentos"><i class="fa fa-money fa-lg"></i></a></li>';
    buttons += '<li><a href="' + _accountsManagerURL + '" class="btn btn-primary btn-medium" title="Contas"><i class="fa fa-book fa-lg"></i></a></li>';
    buttons += '<li><a href="' + _agendaURL + '" class="btn btn-primary btn-medium" title="Agenda"><i class="fa fa-calendar fa-lg"></i></a></li>';
    buttons += '<li><a href="' + _orURL + '" class="btn btn-primary btn-medium" title="Website"><i class="fa fa-shopping-cart fa-lg"></i></a></li>';
    buttons += '<li><a href="' + _reportsManagerURL + '" class="btn btn-primary btn-medium" title="Relatórios"><i class="fa fa-bar-chart-o fa-lg"></i></a></li>';
    buttons += '<li><a href="' + _storeManagerURL + '" class="btn btn-primary btn-medium" title="Loja"><i class="fa fa-cogs fa-lg"></i></a></li>';
    buttons += '</ul>';
    $('#buttons').html(buttons);*/

    $('#archivedCheckBox').bootstrapSwitch();
    $('#hiddenCheckBox').bootstrapSwitch();

    $("#files").fileinput({
        // uploadUrl: "/api/file", // server upload action
        uploadAsync: false,
        minFileCount: 0,
        maxFileCount: 1,
        initialPreviewAsData: true, // identify if you are sending preview data only and not the markup
        language: "pt-BR",
        allowedFileExtensions: ["jpg", "png"],
        uploadExtraData: {
            createdByUserId: my.userInfo.UserId,
            createdOnDate: moment().format()
        }
    });

    $('#files').on('filepreajax', function (event, previewId, index) {
        console.log('File pre ajax triggered');
    });

    $('#files').on('filepreupload', function (event, data, previewId, index) {
        var form = data.form, files = data.files, extra = data.extra,
            response = data.response, reader = data.reader;
        console.log('File pre upload triggered');
    });

    // $('#files').on('filepredelete', function (event, key) {
    //     console.log('Key = ' + key);
    // });

    // $('#files').on('filedeleted', function (event, key) {
    //     console.log('Key = ' + key);
    // });

    // $('#files').on('filesuccessremove', function (event, id) {
    //     console.log('Uploaded thumbnail successfully removed');
    // });

    my.loadCatPermissions = function () {
        $.getJSON('/api/categories/getCategoryPermissions?categoryId=' + my.vm.categoryId(), function (data) {
            if (data) {
                my.vm.catPermissions.removeAll();
                $.each(data, function (i, per) {
                    my.vm.catPermissions.push(new my.permission()
                        .CatPermissionId(per.CatPermissionId)
                        .CategoryId(per.CategoryId)
                        .PermissionId(per.PermissionId)
                        .RoleId(per.RoleId)
                        .CanEdit(per.CanEdit));
                });
            }
        });
    };

    $('#menuTabs a').click(function (e) {
        e.preventDefault()
        $(this).tab('show')
    });

    if (my.vm.categoryId() === 0) {
        /*menuItems = $('#editCategoryMenu').find(':gt(2)');
        menu.enable(menuItems, menuItems.hasClass('k-state-disabled'));*/
    }

    my.loadCategories = function () {
        if (!my.cats) {
            var result = null;
            $.ajax({
                url: '/api/categories/getCategories?portalId=0&lang=pt-BR&parentCategoryId=&filter=&archived=0&includeIsArchived=0',
                async: false,
                success: function (data) {
                    result = data;
                }
            });
            my.cats = result;
            // $(".treeViewCategories").LoadingOverlay("hide", true);
        } else {
            return my.cats;
        }
    };

    my.loadCategories();
    my.buildMenudata = function () {
        var source = [];
        var categoryItems = [];
        for (var i = 0; i < my.cats.length; i++) {
            var item = my.cats[i];
            var text = item.categoryname;
            var id = item.categoryid;
            var desc = item.categorydesc;
            var parentid = item.parentcategoryid;
            var code = item.categoryid;

            if (categoryItems[parentid]) {
                item = {
                    parentid: parentid,
                    text: text,
                    id: id,
                    desc: desc,
                    item: item
                };
                if (!categoryItems[parentid].items) {
                    categoryItems[parentid].items = [];
                }
                categoryItems[parentid].items[categoryItems[parentid].items.length] = item;
                categoryItems[code] = item;
            } else {
                categoryItems[code] = {
                    parentid: parentid,
                    text: text,
                    id: id,
                    desc: desc,
                    item: item
                };
                source[code] = categoryItems[code];
            }
        };
        $('.overlay').remove();
        return source;
    };
    my.sourceMenu = my.buildMenudata();

    var countMenu = 1;
    my.buildMenuUL = function (parent, items) {
        var li = $('<li id="0999999999" style="display: none">hidden</li>');
        if (countMenu <= 1) {
            li.appendTo(parent);
            countMenu = countMenu + 1;
        }
        items.forEach(function (item) {
            if (item.text) {
                // create LI element and append it to the parent element.
                li = $("<li id='" + item.id + "'>" + item.text + "</li>");
                li.appendTo(parent);
                // if there are sub items, call the buildUL function.
                if (item.items && item.items.length > 0) {
                    var ul = $("<ul></ul>");
                    ul.appendTo(li);
                    my.buildMenuUL(ul, item.items);
                }
            }
        });
    };
    my.ulMenu = $("<ul></ul>");

    my.ulMenu.appendTo("#treeViewCategories");
    my.buildMenuUL(my.ulMenu, my.sourceMenu);

    $('#treeViewCategories').jqxTree();
    $('#treeViewCategories').on('select', function (event) {
        Pace.restart();
        var args = event.args;
        var item = $('#treeViewCategories').jqxTree('getItem', args.element);
        if (item.id !== '0999999999') {
            my.vm.categoryId(item.id);
            my.loadCatPermissions();
            $.getJSON('/api/categories/' + item.id + '/pt-BR', function (data) {
                var category = data[0];
                // my.vm.hidden(category.Hidden);
                // my.vm.lang(category.Lang);
                // my.vm.archived(category.Archived);
                // my.vm.listOrder(category.ListOrder);
                // my.vm.categoryName(category.CategoryName);
                // my.vm.categoryDesc(category.CategoryDesc);
                // my.vm.seoName(category.SeoName);
                // my.vm.seoPageTitle(category.SeoPageTitle);
                // my.vm.metaDesc(category.MetaDescription);
                // my.vm.metaKeywords(category.MetaKeywords);
                // my.vm.productCount(category.ProductCount);
                $('#hiddenCheckBox').bootstrapSwitch('state', category.hidden);
                $('#archivedCheckBox').bootstrapSwitch('state', category.archived);
                $('#nameTextBox').val(category.categoryname);
                $('#descTextArea').val(category.categorydesc);
                $('#orderTextBox').val(category.listorder);
                $('#seoNameTextBox').val(category.seoname);
                $('#titlePageTextBox').val(category.seopagetitle);
                $('#metaDescTextArea').val(category.metadescription);
                $('#keywordsTextArea').val(category.metakeywords);
                if (category.parentcategoryid > 0) {
                    $('.jqx-dropdownlist-content').removeClass('jqx-dropdownlist-state-normal-placeholder');
                    my.vm.parentId(category.parentcategoryid);
                    $('#mainCategories').jqxTree('selectItem', $('#ddl_' + my.vm.parentId() + '')[0]);
                } else {
                    my.vm.parentId(0);
                    my.dropDownContent = '<div style="position: relative; margin-left: 5px; margin-top: 6px; color: #999; font-style: italic;"> Selecionar</div>';
                    $('#availCategoriesButton').jqxDropDownButton('setContent', my.dropDownContent);
                }
                // Pace.done();
            });
            //my.categoryProductsData.read();

            /*var menuItems = $('#editCategoryMenu').find('.k-state-disabled');
            menu.enable(menuItems, menuItems.hasClass('k-state-disabled'));*/

            $('#groupsGrid').data('kendoGrid').dataSource.read();
            //setTimeout(function () {
            // $('#nameTextBox').focus();
            //}, 1000);
        }
    });

    var countDDMenu = 1;
    my.buildDDMenuUL = function (parent, items) {
        var li = $("<li id='ddl_0'>Nenhuma</li>");
        if (countDDMenu <= 1) {
            li.appendTo(parent);
            countDDMenu = countDDMenu + 1;
        }
        items.forEach(function (item) {
            if (item.text) {
                // create LI element and append it to the parent element.
                li = $("<li id='ddl_" + item.id + "'>" + item.text + "</li>");
                li.appendTo(parent);
                // if there are sub items, call the buildUL function.
                if (item.items && item.items.length > 0) {
                    var ul = $("<ul></ul>");
                    ul.appendTo(li);
                    my.buildDDMenuUL(ul, item.items);
                }
            }
        });
    };
    my.ulDDMenu = $("<ul></ul>");
    my.ulDDMenu.appendTo("#mainCategories");
    my.buildDDMenuUL(my.ulDDMenu, my.sourceMenu);

    $('#availCategoriesButton').jqxDropDownButton({
        height: 32
    });

    my.dropDownContent = '<div style="position: relative; margin-left: 5px; margin-top: 6px; color: #999; font-style: italic;"> Selecionar </div>';
    $('#availCategoriesButton').jqxDropDownButton('setContent', my.dropDownContent);

    $('#mainCategories').on('select', function (event) {
        var args = event.args;
        var item = $('#mainCategories').jqxTree('getItem', args.element);
        my.dropDownContent = '<div style="position: relative; margin-left: 5px; margin-top: 6px;">' + item.label + '</div>';
        $('#availCategoriesButton').jqxDropDownButton('setContent', my.dropDownContent);
        my.vm.parentId(item.id.toString().replace('ddl_', ''));
        $('#availCategoriesButton').jqxDropDownButton('close');
    });

    $('#mainCategories').jqxTree({
        width: $('#availCategoriesButton').width()
        //height: 300
    });

    $('.jqx-dropdownlist-content').addClass('jqx-dropdownlist-state-normal-placeholder');

    /*$('#editorTextArea').kendoEditor({
        messages: {
            bold: "Bold",
            italic: "Italic",
            underline: "Underline",
            strikethrough: "Strikethrough",
            superscript: "Superscript",
            subscript: "Subscript",
            justifyCenter: "Center text",
            justifyLeft: "Align text left",
            justifyRight: "Align text right",
            justifyFull: "Justify",
            insertUnorderedList: "Insert unordered list",
            insertOrderedList: "Insert ordered list",
            indent: "Indent",
            outdent: "Outdent",
            createLink: "Insert hyperlink",
            unlink: "Remove hyperlink",
            insertImage: "Insert image",
            insertHtml: "Insert HTML",
            fontName: "Select font family",
            fontNameInherit: "(inherited font)",
            fontSize: "Select font size",
            fontSizeInherit: "(inherited size)",
            formatBlock: "Format",
            style: "Styles",
            emptyFolder: "Empty Folder",
            uploadFile: "Upload",
            orderBy: "Arrange by:",
            orderBySize: "Size",
            orderByName: "Name",
            invalidFileType: "The selected file \"{0}\" is not valid. Supported file types are {1}.",
            deleteFile: "Are you sure you want to delete \"{0}\"?",
            overwriteFile: "A file with name \"{0}\" already exists in the current directory. Do you want to overwrite it?",
            directoryNotFound: "A directory with this name was not found.",
            imageWebAddress: "Web address",
            imageAltText: "Alternate text",
            linkWebAddress: "Web address",
            linkText: "Text",
            linkToolTip: "ToolTip",
            linkOpenInNewWindow: "Open link in new window",
            dialogInsert: "Insert",
            dialogButtonSeparator: "or",
            dialogCancel: "Cancel"
        },
        tools: [
            "bold",
            "italic",
            "underline",
            "separator",
            "strikethrough",
            "justifyLeft",
            "justifyCenter",
            "justifyRight",
            "justifyFull",
            "insertUnorderedList",
            "insertOrderedList",
            "indent",
            "outdent",
            "createLink",
            "unlink",
            "viewHtml"
        ]
    });*/

    /*$('#btnUpload').click(function (e) {
        e.preventDefault();

        $('#files').click();
    });*/

    /*$("#productSearch").kendoAutoComplete({
        delay: 500,
        minLength: 5,
        dataValueField: 'ProductId',
        dataTextField: 'ProductName',
        placeholder: "Insira Nome, Referência ou Código.",
        template: '<strong>Produto: </strong><span>${ data.ProductName }</span><br /><strong>Ref: </strong><span>${ data.ProductRef }</span>',
        dataSource: {
            transport: {
                read: '/desktopmodules/riw/api/products/getProducts'
            },
            serverFiltering: true,
            pageSize: 50,
            sort: {
                field: "",
                dir: "ASC"
            },
            schema: {
                model: {
                    id: 'ProductId'
                },
                data: 'data',
                total: 'total'
            }
        },
        highlightFirst: true,
        filter: "contains",
        dataBound: function () {
            var autocomplete = this;
            switch (true) {
                case (this.dataSource.total() > 20):
                    //if (!$('.toast-item-wrapper').length) $().toastmessage('showNoticeToast', 'Dezenas de itens encontrados... refina sua busca.');
                    $.pnotify({
                        title: 'Aten&#231;&#227;o!',
                        text: 'Dezenas de itens encontrados...<br />...refina sua busca.',
                        type: 'info',
                        icon: 'fa fa-exclamation-circle fa-lg',
                        addclass: "stack-bottomright",
                        stack: my.stack_bottomright
                    });
                    break;
                case (this.dataSource.total() === 0):
                    autocomplete.value('');
                    //if (!$('.toast-item-wrapper').length) $().toastmessage('showWarningToast', 'Sua busca não trouxe resultado algum.');
                    $.pnotify({
                        title: 'Aten&#231;&#227;o!',
                        text: 'Sua busca n&#227;o trouxe resultado algum.',
                        type: 'warning',
                        icon: 'fa fa-warning fa-lg',
                        addclass: "stack-bottomright",
                        stack: my.stack_bottomright
                    });
                    break;
                default:
            }
        },
        select: function (e) {
            e.preventDefault();
            var dataItem = this.dataItem(e.item.index());
            if (dataItem) {
                my.vm.productId(dataItem.ProductId);
                this.value(dataItem.ProductName);
                my.vm.productName(dataItem.ProductName);
                my.vm.productRef(dataItem.ProductRef);
            }
        }
    });

    my.categoryProductsTransport = {
        read: {
            url: '/api/categories/getProductsCategory'
        },
        parameterMap: function (data, type) {
            return {
                portalId: 0,
                categoryId: my.vm.categoryId(),
                pageNumber: data.page,
                pageSize: data.pageSize,
                orderBy: my.convertSortingParameters(data.sort)
            };
        }
    };

    my.categoryProductsData = new kendo.data.DataSource({
        transport: my.categoryProductsTransport,
        pageSize: 10,
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        sort: {
            field: "",
            dir: "ASC"
        },
        schema: {
            model: {
                id: 'ProdId'
            },
            data: 'data',
            total: 'total'
        }
    });

    $('#categoryProductsGrid').kendoGrid({
        dataSource: my.categoryProductsData,
        columns: [
            {
                field: 'ProductId',
                title: 'ID',
                width: 60
            },
            {
                field: 'ProductRef',
                title: 'Referência',
                width: 100
            },
            {
                field: 'ProductName',
                title: 'Nome'
            },
            {
                command: {
                    name: 'remove',
                    text: '',
                    imageClass: 'k-icon k-i-close',
                    click: function (e) {
                        e.preventDefault();
                        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                        $.ajax({
                            type: 'DELETE',
                            url: '/api/products/removeProductCategory?productId=' + dataItem.ProductId
                        }).done(function (data) {
                            if (data.Result.indexOf("success") !== -1) {
                                my.categoryProductsData.remove(dataItem);
                                //$().toastmessage('showSuccessToast', 'O item ' + dataItem.ProductName + ' foi removido da categoria!');
                                $.pnotify({
                                    title: 'Sucesso!',
                                    text: 'O item ' + dataItem.ProductName + ' foi removido da categoria.',
                                    type: 'success',
                                    icon: 'fa fa-check fa-lg',
                                    addclass: "stack-bottomright",
                                    stack: my.stack_bottomright
                                });
                            } else {
                                $.pnotify({
                                    title: 'Erro!',
                                    text: data.Result,
                                    type: 'error',
                                    icon: 'fa fa-times-circle fa-lg',
                                    addclass: "stack-bottomright",
                                    stack: my.stack_bottomright
                                });
                                //$().toastmessage('showErrorToast', data.Result);
                            }
                        }).fail(function (jqXHR, textStatus) {
                            console.log(jqXHR.responseText);
                        });
                    }
                },
                width: 50
            }
        ]
    });*/

    $("#groupsGrid").kendoGrid({
        dataSource: new kendo.data.DataSource({
            transport: {
                read: {
                    url: '/api/store/roles/0'
                }
            },
            sort: {
                field: "RoleName",
                dir: "ASC"
            },
            schema: {
                model: {
                    id: 'RoleID'
                }
            }
        }),
        sortable: true,
        dataBinding: function () {
            my.record = 0;
        },
        columns: [{
            field: 'RoleName',
            title: 'Grupo',
            width: '79%'
        }, {
            field: 'View',
            title: 'Vêr',
            width: '10%',
            template: '<span id="spanView_#= RoleID #" style="cursor: default;"><input type="hidden" id="view_#= RoleID #" name="view_#= RoleID #" value="0" /></span>'
        }, {
            field: 'Edit',
            title: 'Editar',
            width: '10%',
            template: '<span id="spanEdit_#= RoleID #" style="cursor: default;"><input type="hidden" id="edit_#= RoleID #" name="edit_#= RoleID #" value="0" /></span>'
        }],
        dataBound: function () {
            if (this.dataSource.view().length > 0) {
                var grid = this;
                //my.pers = ko.utils.arrayFirst(my.vm.catPermissions(), function (item) {
                //    return item;
                //});
                $.each(grid.tbody.find('tr'), function () {
                    var model = grid.dataItem(this);
                    switch (model.RoleName) {
                        case "Administrators":
                            $('[data-uid=' + model.uid + ']').css({
                                'display': 'none'
                            });
                            break;
                        case "Caixas":
                            $('[data-uid=' + model.uid + ']').css({
                                'display': 'none'
                            });
                            break;
                        case "Unverified Users":
                            $('[data-uid=' + model.uid + ']').css({
                                'display': 'none'
                            });
                            break;
                        case "Superusers":
                            $('[data-uid=' + model.uid + ']').css({
                                'display': 'none'
                            });
                            break;
                        case "Editores":
                            $('[data-uid=' + model.uid + ']').css({
                                'display': 'none'
                            });
                            break;
                    }
                    if (my.vm.catPermissions().length > 0) {
                        ko.utils.arrayFirst(my.vm.catPermissions(), function (item) {
                            if (item.RoleId() === model.RoleID) {
                                if (item.CanEdit()) {
                                    $('#edit_' + model.RoleID).val(item.PermissionId());
                                } else {
                                    $('#view_' + model.RoleID).val(item.PermissionId());
                                }
                                if (model.RoleID === -1) $('#edit_' + model.RoleID).val(0);
                            }
                        });
                    } else {
                        $('#view_-1').val(1);
                    }
                    if ((model.RoleName === 'Editores') || (model.RoleName === 'Gerentes')) {
                         $('#view_' + model.RoleID).val(2);
                         $('#edit_' + model.RoleID).val(2);
                    }
                    initTriStateCheckBox('spanView_' + model.RoleID, 'view_' + model.RoleID, true);
                    initTriStateCheckBox('spanEdit_' + model.RoleID, 'edit_' + model.RoleID, true);
                });
                $('#spanEdit_-1').css({
                    'visibility': 'hidden'
                });
            }
        }
    });

    $('#categoryForm')
        .bootstrapValidator({
            message: 'This value is not valid',
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                categoryName: {
                    message: 'O Nome da categoria é obrigatório',
                    validators: {
                        notEmpty: {
                            message: 'O Nome da categoria é obrigatório'
                        },
                        // stringLength: {
                        //     min: 6,
                        //     max: 30,
                        //     message: 'The username must be more than 6 and less than 30 characters long'
                        // },
                        /*remote: {
                            url: 'remote.php',
                            message: 'The username is not available'
                        },*/
                        // regexp: {
                        //     regexp: /^[a-zA-Z0-9_\.]+$/,
                        //     message: 'The username can only consist of alphabetical, number, dot and underscore'
                        // }
                    }
                }
            }
        })
        .on('success.form.bv', function (e) {
            // Prevent form submission
            e.preventDefault();

            var selectedMainCategory = $('#mainCategories').jqxTree('selectedItem');
            //my.vm.parentId(selectedNode.element.id);

            var categorySecurityData = [];

            var grid = $('#groupsGrid').data('kendoGrid');
            $.each(grid.dataSource.data(), function (i, item) {

                if ($('#view_' + item.RoleID).val() !== '0') {
                    var perm = {};
                    perm.RoleID = item.RoleID;
                    perm.PermissionId = $('#view_' + item.RoleID).val();
                    perm.CanEdit = false; // $('#view_' + item.RoleID).val() === '1' ? false : true;
                    categorySecurityData.push(perm);
                }

                if ($('#edit_' + item.RoleID).val() !== '0') {
                    var perm = {};
                    perm.RoleID = item.RoleID;
                    perm.PermissionId = $('#edit_' + item.RoleID).val(),
                    perm.CanEdit = $('#edit_' + item.RoleID).val() === '2' ? true : false;
                    categorySecurityData.push(perm);
                }
            });

            // var categoryData = new FormData();

            // categoryData.append('lang', 'pt-BR');
            // categoryData.append('categoryName', my.vm.categoryName());
            // categoryData.append('categoryId', kendo.parseInt(my.vm.categoryId()));
            // categoryData.append('parentCategoryId', my.vm.parentId().toString().replace('ddl_', ''));
            // categoryData.append('productTemplate', '');
            // categoryData.append('listItemTemplate', '');
            // categoryData.append('listAltItemTemplate', '');
            // categoryData.append('seoPageTitle', my.vm.seoPageTitle());
            // categoryData.append('seoName', my.vm.seoName());
            // categoryData.append('metaDescription', $('#metaDescTextArea').val());
            // categoryData.append('metaKeywords', $('#keywordsTextArea').val());
            // categoryData.append('listOrder', my.vm.listOrder());
            // categoryData.append('categoryDesc', $('#descTextArea').val());
            // categoryData.append('archived', my.vm.archived());
            // categoryData.append('hidden', my.vm.hidden());
            // categoryData.append('portalId', 0);
            // categoryData.append('categorySecurityData', JSON.stringify(categorySecurityData));
            // categoryData.append('createdByUser', my.userInfo.UserId);
            // categoryData.append('createdOnDate', moment().format('YYYY-MM-DD HH:mm:ss'));
            // categoryData.append('modifiedByUser', my.userInfo.UserId);
            // categoryData.append('modifiedOnDate', moment().format('YYYY-MM-DD HH:mm:ss'));

            // $.each($('#files')[0].files, function (i, file) {
            //     categoryData.append('files', file);
            // });

            // var categoryData = {
            //     'lang': 'pt-BR',
            //     'categoryName': my.vm.categoryName(),
            //     'categoryId': kendo.parseInt(my.vm.categoryId()),
            //     'parentCategoryId': my.vm.parentId().toString().replace('ddl_', ''),
            //     'productTemplate': '',
            //     'listItemTemplate': '',
            //     'listAltItemTemplate': '',
            //     'seoPageTitle': my.vm.seoPageTitle(),
            //     'seoName': my.vm.seoName(),
            //     'metaDescription': $('#metaDescTextArea').val(),
            //     'metaKeywords': $('#keywordsTextArea').val(),
            //     'listOrder': my.vm.listOrder(),
            //     'categoryDesc': $('#descTextArea').val(),
            //     'archived': my.vm.archived(),
            //     'hidden': my.vm.hidden(),
            //     'portalId': 0,
            //     'categorySecurityData': JSON.stringify(categorySecurityData),
            //     'createdByUser': my.userInfo.UserId,
            //     'createdOnDate': moment().format('YYYY-MM-DD HH:mm:ss'),
            //     'modifiedByUser': my.userInfo.UserId,
            //     'modifiedOnDate': moment().format('YYYY-MM-DD HH:mm:ss')
            // }

            // $.each($('#files')[0].files, function (i, file) {
            //     categoryData.files  = file;
            // });

            var categoryData = new FormData($('#categoryForm')[0]);

            categoryData.append('categoryId', my.vm.categoryId());
            categoryData.append('categorySecurityData', JSON.stringify(categorySecurityData));
            categoryData.append('lang', 'pt-BR');
            categoryData.append('portalId', 0);
            categoryData.append('parentCategoryId', my.vm.parentId());
            categoryData.append('hidden', $('#hiddenCheckBox').bootstrapSwitch('state'));
            categoryData.append('archived', $('#archivedCheckBox').bootstrapSwitch('state'));
            categoryData.append('createdByUser', my.userInfo.UserId);
            categoryData.append('createdOnDate', moment().format('YYYY-MM-DD HH:mm:ss'));
            categoryData.append('modifiedByUser', my.userInfo.UserId);
            categoryData.append('modifiedOnDate', moment().format('YYYY-MM-DD HH:mm:ss'));

            $.ajax({
                type: my.vm.categoryId() ? 'PUT' : 'POST',
                // contentType: 'application/json; charset=utf-8',
                // contentType: "multipart/form-data; ",
                // cache: false,
                contentType: false,
                processData: false,
                dataType: 'json',
                url: my.vm.categoryId() ? '/api/categories/update' : '/api/categories/add',
                data: categoryData
            }).done(function (data) {
                if (!data.message) {
                    if (my.vm.categoryId()) {

                        if (selectedMainCategory) {
                            $('#mainCategories').jqxTree('updateItem', selectedMainCategory, {
                                label: $('#nameTextBox').val()
                            });
                        }

                        var selectedElement = $("#treeViewCategories").jqxTree('getSelectedItem').element;
                        $('#treeViewCategories').jqxTree('updateItem', selectedElement, {
                            label: $('#nameTextBox').val()
                        });

                        setTimeout(function () {
                            selectedElement.scrollIntoView();
                        }, 500);

                        var notice = new PNotify({
                            title: 'Sucesso!',
                            text: 'Categoria <strong>' + $('#nameTextBox').val() + '</strong> atualizada.',
                            type: 'success',
                            animation: 'none',
                            addclass: 'stack-bottomright',
                            stack: my.stack_bottomright
                        });
                        notice.get().click(function () {
                            notice.remove();
                        });
                    } else {
                        my.vm.categoryId(Object.values(data).toString());

                        if (selectedMainCategory !== null) {

                            var selectedItem = null;
                            if (my.vm.parentId().toString().replace('ddl_', '')) {
                                selectedItem = $('#treeViewCategories').find('#' + my.vm.parentId().toString().replace('ddl_', '') + '')[0];
                            }
                            $('#treeViewCategories').jqxTree('addTo', {
                                label: $('#nameTextBox').val(),
                                id: my.vm.categoryId()
                            }, selectedItem, false);

                            //    var selectedMainItem = null;
                            //    selectedMainItem = $('#mainCategories').find('#' + my.vm.parentId() + '')[0];
                            $('#mainCategories').jqxTree('addTo', {
                                label: $('#nameTextBox').val(),
                                id: 'ddl_' + my.vm.categoryId()
                            }, selectedMainCategory, false);

                            //$('#mainCategories').jqxTree('render');

                        } else {

                            $('#mainCategories').jqxTree('addTo', {
                                label: $('#nameTextBox').val(),
                                id: 'ddl_' + my.vm.categoryId()
                            }, null, false);

                            $('#treeViewCategories').jqxTree('addTo', {
                                label: $('#nameTextBox').val(),
                                id: my.vm.categoryId()
                            }, null, false);
                        }

                        $('#mainCategories').jqxTree('render');

                        $('#treeViewCategories').jqxTree('render');

                        //setTimeout(function () {
                        var itemToExpand = $('#treeViewCategories').jqxTree('getItem', $('#' + my.vm.parentId() + '')[0]);
                        if (itemToExpand !== null) {
                            $('#treeViewCategories').jqxTree('expandItem', itemToExpand.element);
                        };
                        //}, 1000);

                        $('#treeViewCategories').jqxTree('selectItem', $('#' + my.vm.categoryId() + '')[0]);

                        var notice = new PNotify({
                            title: 'Sucesso!',
                            text: 'Categoria <strong>' + $('#nameTextBox').val() + '</strong> inserida.',
                            type: 'success',
                            animation: 'none',
                            addclass: 'stack-bottomright',
                            stack: my.stack_bottomright
                        });
                        notice.get().click(function () {
                            notice.remove();
                        });
                    }

                    /*var menuItems = $('#editCategoryMenu').find('.k-state-disabled');
                    menu.enable(menuItems, menuItems.hasClass('k-state-disabled'));*/

                } else {
                    var notice = new PNotify({
                        title: 'Erro!',
                        text: data.message,
                        type: 'error',
                        animation: 'none',
                        addclass: 'stack-bottomright',
                        stack: my.stack_bottomright
                    });
                    notice.get().click(function () {
                        notice.remove();
                    });
                }
            }).fail(function (jqXHR, textStatus) {
                console.log(jqXHR.responseText);
            });
        });

    // $('#categoryForm').validator().on('submit', function (e) {
    // $('#btnUpdateCategory').click(function (e) {
    //     // if (e.isDefaultPrevented()) {
    //     // } else {
    //         e.preventDefault();

    //         var selectedMainCategory = $('#mainCategories').jqxTree('selectedItem');
    //         //my.vm.parentId(selectedNode.element.id);

    //         var categorySecurityData = [];

    //         var grid = $('#groupsGrid').data('kendoGrid');
    //         $.each(grid.dataSource.data(), function (i, item) {

    //             if ($('#view_' + item.RoleID).val() !== '0') {
    //                 var perm = {};
    //                 perm.RoleID = item.RoleID;
    //                 perm.PermissionId = $('#view_' + item.RoleID).val();
    //                 perm.AllowAccess = $('#view_' + item.RoleID).val() === '1' ? false : true;
    //                 categorySecurityData.push(perm);
    //             }

    //             if ($('#edit_' + item.RoleID).val() !== '0') {
    //                 var perm = {};
    //                 perm.RoleID = item.RoleID;
    //                 perm.PermissionId = $('#edit_' + item.RoleID).val(),
    //                     perm.AllowAccess = $('#edit_' + item.RoleID).val() === '1' ? false : true;
    //                 categorySecurityData.push(perm);
    //             }
    //         });

    //         // var categoryData = new FormData();

    //         // categoryData.append('lang', 'pt-BR');
    //         // categoryData.append('categoryName', my.vm.categoryName());
    //         // categoryData.append('categoryId', kendo.parseInt(my.vm.categoryId()));
    //         // categoryData.append('parentCategoryId', my.vm.parentId().toString().replace('ddl_', ''));
    //         // categoryData.append('productTemplate', '');
    //         // categoryData.append('listItemTemplate', '');
    //         // categoryData.append('listAltItemTemplate', '');
    //         // categoryData.append('seoPageTitle', my.vm.seoPageTitle());
    //         // categoryData.append('seoName', my.vm.seoName());
    //         // categoryData.append('metaDescription', $('#metaDescTextArea').val());
    //         // categoryData.append('metaKeywords', $('#keywordsTextArea').val());
    //         // categoryData.append('listOrder', my.vm.listOrder());
    //         // categoryData.append('categoryDesc', $('#descTextArea').val());
    //         // categoryData.append('archived', my.vm.archived());
    //         // categoryData.append('hidden', my.vm.hidden());
    //         // categoryData.append('portalId', 0);
    //         // categoryData.append('categorySecurityData', JSON.stringify(categorySecurityData));
    //         // categoryData.append('createdByUser', my.userInfo.UserId);
    //         // categoryData.append('createdOnDate', moment().format('YYYY-MM-DD HH:mm:ss'));
    //         // categoryData.append('modifiedByUser', my.userInfo.UserId);
    //         // categoryData.append('modifiedOnDate', moment().format('YYYY-MM-DD HH:mm:ss'));

    //         // $.each($('#files')[0].files, function (i, file) {
    //         //     categoryData.append('files', file);
    //         // });

    //         // var categoryData = {
    //         //     'lang': 'pt-BR',
    //         //     'categoryName': my.vm.categoryName(),
    //         //     'categoryId': kendo.parseInt(my.vm.categoryId()),
    //         //     'parentCategoryId': my.vm.parentId().toString().replace('ddl_', ''),
    //         //     'productTemplate': '',
    //         //     'listItemTemplate': '',
    //         //     'listAltItemTemplate': '',
    //         //     'seoPageTitle': my.vm.seoPageTitle(),
    //         //     'seoName': my.vm.seoName(),
    //         //     'metaDescription': $('#metaDescTextArea').val(),
    //         //     'metaKeywords': $('#keywordsTextArea').val(),
    //         //     'listOrder': my.vm.listOrder(),
    //         //     'categoryDesc': $('#descTextArea').val(),
    //         //     'archived': my.vm.archived(),
    //         //     'hidden': my.vm.hidden(),
    //         //     'portalId': 0,
    //         //     'categorySecurityData': JSON.stringify(categorySecurityData),
    //         //     'createdByUser': my.userInfo.UserId,
    //         //     'createdOnDate': moment().format('YYYY-MM-DD HH:mm:ss'),
    //         //     'modifiedByUser': my.userInfo.UserId,
    //         //     'modifiedOnDate': moment().format('YYYY-MM-DD HH:mm:ss')
    //         // }

    //         // $.each($('#files')[0].files, function (i, file) {
    //         //     categoryData.files  = file;
    //         // });

    //         var categoryData = new FormData($('#categoryForm')[0]);

    //         categoryData.append('categoryId', my.vm.categoryId());
    //         categoryData.append('categorySecurityData', JSON.stringify(categorySecurityData));
    //         categoryData.append('lang', 'pt-BR');
    //         categoryData.append('portalId', 0);
    //         categoryData.append('parentCategoryId', my.vm.parentId());
    //         categoryData.append('hidden', $('#hiddenCheckBox').bootstrapSwitch('state'));
    //         categoryData.append('archived', $('#archivedCheckBox').bootstrapSwitch('state'));
    //         categoryData.append('createdByUser', my.userInfo.UserId);
    //         categoryData.append('createdOnDate', moment().format('YYYY-MM-DD HH:mm:ss'));
    //         categoryData.append('modifiedByUser', my.userInfo.UserId);
    //         categoryData.append('modifiedOnDate', moment().format('YYYY-MM-DD HH:mm:ss'));

    //         $.ajax({
    //             type: my.vm.categoryId() ? 'PUT' : 'POST',
    //             // contentType: 'application/json; charset=utf-8',
    //             // contentType: "multipart/form-data; ",
    //             // cache: false,
    //             contentType: false,
    //             processData: false,
    //             dataType: 'json',
    //             url: my.vm.categoryId() ? '/api/categories/update' : '/api/categories/add',
    //             data: categoryData
    //         }).done(function (data) {
    //             if (!data.message) {
    //                 if (my.vm.categoryId()) {

    //                     if (selectedMainCategory) {
    //                         $('#mainCategories').jqxTree('updateItem', selectedMainCategory, {
    //                             label: $('#nameTextBox').val()
    //                         });
    //                     }

    //                     var selectedElement = $("#treeViewCategories").jqxTree('getSelectedItem').element;
    //                     $('#treeViewCategories').jqxTree('updateItem', selectedElement, {
    //                         label: $('#nameTextBox').val()
    //                     });

    //                     setTimeout(function () {
    //                         selectedElement.scrollIntoView();
    //                     }, 500);

    //                     var notice = new PNotify({
    //                         title: 'Sucesso!',
    //                         text: 'Categoria <strong>' + $('#nameTextBox').text() + '</strong> atualizada.',
    //                         type: 'success',
    //                         animation: 'none',
    //                         addclass: 'stack-bottomright',
    //                         stack: my.stack_bottomright
    //                     });
    //                     notice.get().click(function () {
    //                         notice.remove();
    //                     });
    //                 } else {
    //                     my.vm.categoryId(Object.values(data).toString());

    //                     if (selectedMainCategory !== null) {

    //                         var selectedItem = null;
    //                         if (my.vm.parentId().toString().replace('ddl_', '')) {
    //                             selectedItem = $('#treeViewCategories').find('#' + my.vm.parentId().toString().replace('ddl_', '') + '')[0];
    //                         }
    //                         $('#treeViewCategories').jqxTree('addTo', {
    //                             label: $('#nameTextBox').val(),
    //                             id: my.vm.categoryId()
    //                         }, selectedItem, false);

    //                         //    var selectedMainItem = null;
    //                         //    selectedMainItem = $('#mainCategories').find('#' + my.vm.parentId() + '')[0];
    //                         $('#mainCategories').jqxTree('addTo', {
    //                             label: $('#nameTextBox').val(),
    //                             id: 'ddl_' + my.vm.categoryId()
    //                         }, selectedMainCategory, false);

    //                         //$('#mainCategories').jqxTree('render');

    //                     } else {

    //                         $('#mainCategories').jqxTree('addTo', {
    //                             label: $('#nameTextBox').val(),
    //                             id: 'ddl_' + my.vm.categoryId()
    //                         }, null, false);

    //                         $('#treeViewCategories').jqxTree('addTo', {
    //                             label: $('#nameTextBox').val(),
    //                             id: my.vm.categoryId()
    //                         }, null, false);
    //                     }

    //                     $('#mainCategories').jqxTree('render');

    //                     $('#treeViewCategories').jqxTree('render');

    //                     //setTimeout(function () {
    //                     var itemToExpand = $('#treeViewCategories').jqxTree('getItem', $('#' + my.vm.parentId() + '')[0]);
    //                     if (itemToExpand !== null) {
    //                         $('#treeViewCategories').jqxTree('expandItem', itemToExpand.element);
    //                     };
    //                     //}, 1000);

    //                     $('#treeViewCategories').jqxTree('selectItem', $('#' + my.vm.categoryId() + '')[0]);

    //                     var notice = new PNotify({
    //                         title: 'Sucesso!',
    //                         text: 'Categoria <strong>' + $('#nameTextBox').val() + '</strong><br />inserida.',
    //                         type: 'success',
    //                         animation: 'none',
    //                         addclass: 'stack-bottomright',
    //                         stack: my.stack_bottomright
    //                     });
    //                     notice.get().click(function () {
    //                         notice.remove();
    //                     });
    //                 }

    //                 /*var menuItems = $('#editCategoryMenu').find('.k-state-disabled');
    //                 menu.enable(menuItems, menuItems.hasClass('k-state-disabled'));*/

    //             } else {
    //                 var notice = new PNotify({
    //                     title: 'Erro!',
    //                     text: data.message,
    //                     type: 'error',
    //                     animation: 'none',
    //                     addclass: 'stack-bottomright',
    //                     stack: my.stack_bottomright
    //                 });
    //                 notice.get().click(function () {
    //                     notice.remove();
    //                 });
    //             }
    //         }).fail(function (jqXHR, textStatus) {
    //             console.log(jqXHR.responseText);
    //         });
    //     // }
    // });

    $('#btnRemove').click(function (e) {
        e.preventDefault();

        swal({
            title: "Atenção!",
            html: "Tem certeza que deseja excluir esta categoria?",
            type: "warning",
            cancelButtonText: "Cancelar",
            showCancelButton: true,
            // reverseButtons: true,
            confirmButtonText: "Sim, excluir"
        }).then(function (isConfirm) {
            if (isConfirm) {
                $.ajax({
                    type: 'DELETE',
                    url: '/api/categories/remove/' + my.vm.categoryId()
                }).done(function (data) {
                    if (!data.message) {

                        var selectedElement = $("#treeViewCategories").jqxTree('getSelectedItem').element;
                        $('#treeViewCategories').jqxTree('removeItem', selectedElement, true);

                        var selectedNode = $('#mainCategories').find('#ddl_' + my.vm.categoryId())[0];
                        $('#mainCategories').jqxTree('removeItem', selectedNode, true);

                        var notice = new PNotify({
                            title: 'Sucesso!',
                            text: 'Categoria <strong>' + $('#nameTextBox').val() + '</strong> excluida.',
                            type: 'success',
                            animation: 'none',
                            addclass: 'stack-bottomright',
                            stack: my.stack_bottomright
                        });
                        notice.get().click(function () {
                            notice.remove();
                        });

                        $('#btnCancel').click();

                    } else {
                        var notice = new PNotify({
                            title: 'Erro!',
                            text: data,
                            type: 'error',
                            animation: 'none',
                            addclass: 'stack-bottomright',
                            stack: my.stack_bottomright
                        });
                        notice.get().click(function () {
                            notice.remove();
                        });
                    }
                }).fail(function (jqXHR, textStatus) {
                    console.log(jqXHR.responseText);
                });
            }
        }, function (dismiss) {
            // dismiss can be 'cancel', 'overlay',
            // 'close', and 'timer'
            if (dismiss === 'cancel') {
                var notice = new PNotify({
                    title: 'Atenção!',
                    text: 'Nada foi excluido',
                    type: 'info',
                    animation: 'none',
                    addclass: 'stack-bottomright',
                    stack: my.stack_bottomright
                });
                notice.get().click(function () {
                    notice.remove();
                });
            }
        });
    });

    /*$('#btnAdddProductCategory').click(function (e) {
        e.preventDefault();

        var params = {
            ProductId: my.vm.productId(),
            CategoryId: my.vm.categoryId(),
        };

        $.ajax({
            type: 'POST',
            url: '/api/products/addProductCategory',
            data: params
        }).done(function (data) {
            if (data.Result.indexOf("success") !== -1) {
                my.categoryProductsData.add({ ProductId: params.ProductId, ProductName: my.vm.productName(), ProductRef: my.vm.productRef() });
                //$().toastmessage('showSuccessToast', 'O item ' + my.vm.productName() + ' foi adicionado à categoria!');
                $.pnotify({
                    title: 'Sucesso!',
                    text: 'O item ' + my.vm.productName() + ' foi adicionado à categoria.',
                    type: 'success',
                    icon: 'fa fa-check fa-lg',
                    addclass: "stack-bottomright",
                    stack: my.stack_bottomright
                });
            } else {
                $.pnotify({
                    title: 'Erro!',
                    text: data.Result,
                    type: 'error',
                    icon: 'fa fa-times-circle fa-lg',
                    addclass: "stack-bottomright",
                    stack: my.stack_bottomright
                });
                //$().toastmessage('showErrorToast', data.Result);
            }
        }).fail(function (jqXHR, textStatus) {
            console.log(jqXHR.responseText);
        });
    });*/

    /*$('#btnRemoveProductsCategory').click(function (e) {
        e.preventDefault();

        $.ajax({
            type: 'DELETE',
            url: '/api/products/removeProductsCategory?categoryId=' + my.vm.categoryId()
        }).done(function (data) {
            if (data.Result.indexOf("success") !== -1) {
                my.categoryProductsData.data([]);
                //$().toastmessage('showSuccessToast', 'Não há mais item algum<br /> relacionado à esta categoria.');
                $.pnotify({
                    title: 'Sucesso!',
                    text: 'N&#227;o h&#225; mais item algum relacionado &#224; esta categoria.',
                    type: 'success',
                    icon: 'fa fa-check fa-lg',
                    addclass: "stack-bottomright",
                    stack: my.stack_bottomright
                });
            } else {
                $.pnotify({
                    title: 'Erro!',
                    text: data.Result,
                    type: 'error',
                    icon: 'fa fa-times-circle fa-lg',
                    addclass: "stack-bottomright",
                    stack: my.stack_bottomright
                });
                //$().toastmessage('showErrorToast', data.Result);
            }
        }).fail(function (jqXHR, textStatus) {
            console.log(jqXHR.responseText);
        });
    });*/

    $('#btnCancel').click(function (e) {
        e.preventDefault();

        $('#btnCancel').hide();
        $('#btnRemove').hide();
        $('#hiddenCheckBox').bootstrapSwitch('state', false);
        $('#archivedCheckBox').bootstrapSwitch('state', false);
        $('#nameTextBox').val('');
        $('#descTextArea').val('');
        $('#orderTextBox').val('');
        $('#seoNameTextBox').val('');
        $('#titlePageTextBox').val('');
        $('#metaDescTextArea').val('');
        $('#keywordsTextArea').val('');
        my.vm.categoryId(0);
        my.vm.parentId(0);
        my.vm.productCount(0);
        my.vm.catPermissions.removeAll();
        my.dropDownContent = '<div style="position: relative; margin-left: 5px; margin-top: 6px; color: #999; font-style: italic;"> Selecionar</div>';
        $('#availCategoriesButton').jqxDropDownButton('setContent', my.dropDownContent);
        // var categoryMenuItems = $('#editCategoryMenu').find(':not(.k-first)');
        // menu.enable(categoryMenuItems, categoryMenuItems.hasClass('k-state-disabled'));
        $('#treeViewCategories').jqxTree('selectItem', $('#tvCategories').find('#0')[0]);
        // $('#nameTextBox').focus();
    });

});