'use strict';

$(function () {

    my.personId = my.getParameterByName('itemId');
    my.cats = null;
    my.returnUrl = my.getParameterByName('return');
    var menuItems = null;

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
                        .AllowAccess(per.AllowAccess));
                });
            }
        });
    };

    $('.dnnFormHelp').tooltip({ placement: 'right' });

    var menu = $('#editCategoryMenu').kendoMenu({
        select: function (e) {
            $("#editCategoryMenu").find(".k-state-selected").removeClass("k-state-selected");
            switch (e.item.id) {
                case 'menu_3':
                    $('#basicEdit').fadeOut();
                    $('#extraEdit').fadeOut();
                    $('#productsEdit').fadeOut();
                    $('#seoEdit').delay(400).fadeIn();
                    $('#permissionEdit').fadeOut();
                    $(e.item).addClass("k-state-selected");
                    break;
                case 'menu_4':
                    $('#seoEdit').fadeOut();
                    $('#basicEdit').fadeOut();
                    $('#productsEdit').fadeOut();
                    $('#extraEdit').delay(400).fadeIn();
                    $('#permissionEdit').fadeOut();
                    $(e.item).addClass("k-state-selected");
                    break;
                case 'menu_5':
                    $('#seoEdit').fadeOut();
                    $('#basicEdit').fadeOut();
                    $('#extraEdit').fadeOut();
                    $('#permissionEdit').fadeOut();
                    $('#productsEdit').delay(400).fadeIn();
                    $(e.item).addClass("k-state-selected");
                    break;
                case 'menu_6':
                    $('#seoEdit').fadeOut();
                    $('#basicEdit').fadeOut();
                    $('#extraEdit').fadeOut();
                    $('#productsEdit').fadeOut();
                    $('#permissionEdit').delay(400).fadeIn();
                    $(e.item).addClass("k-state-selected");
                    break;
                case "menu_1":
                    document.location.href = _editItemURL + '?SkinSrc=[G]Skins/riw/popUpSkin&ContainerSrc=[G]Containers/riw/popUpContainer&itemId/' + my.personId;
                    break;
                default:
                    $('#seoEdit').fadeOut();
                    $('#extraEdit').fadeOut();
                    $('#productsEdit').fadeOut();
                    $('#permissionEdit').fadeOut();
                    $('#basicEdit').delay(400).fadeIn();
                    $(e.item).addClass("k-state-selected");
            }

        }
    }).data("kendoMenu");

    if (my.vm.categoryId() === 0) {
        menuItems = $('#editCategoryMenu').find(':gt(2)');
        menu.enable(menuItems, menuItems.hasClass('k-state-disabled'));
    }

    //if (my.returnUrl === 0) {
    //    menuItems = $('#editCategoryMenu').find('.k-first');
    //    menu.enable(menuItems, menuItems.hasClass('k-state-disabled'));
    //}

    $('#orderTextBox').kendoNumericTextBox({
        format: '',
        value: 1
    });

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
            var text = item.CategoryName;
            var id = item.CategoryId;
            var desc = item.CategoryDesc;
            var parentid = item.ParentCategoryId;
            var code = item.CategoryId;

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
        }
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
        $.each(items, function (cat) {
            if (cat.text) {
                // create LI element and append it to the parent element.
                li = $("<li id='" + cat.item.CategoryId + "'>" + cat.text + "</li>");
                li.appendTo(parent);
                // if there are sub items, call the buildUL function.
                if (cat.items && cat.items.length > 0) {
                    var ul = $("<ul></ul>");
                    ul.appendTo(li);
                    my.buildMenuUL(ul, cat.items);
                }
            }
        });
    };
    my.ulMenu = $("<ul></ul>");

    my.ulMenu.appendTo("#treeViewCategories");
    my.buildMenuUL(my.ulMenu, my.sourceMenu);

    $('#treeViewCategories').jqxTree();
    $('#treeViewCategories').on('select', function (event) {
        var args = event.args;
        var item = $('#treeViewCategories').jqxTree('getItem', args.element);
        if (item.id !== '0999999999') {
            my.vm.categoryId(item.id);
            my.loadCatPermissions();
            $.getJSON('/api/categories/' + item.id + '/pt-BR', function (data) {
                my.vm.hidden(data.Hidden);
                my.vm.message(data.Message);
                my.vm.lang(data.Lang);
                my.vm.archived(data.Archived);
                my.vm.listOrder(data.ListOrder);
                my.vm.categoryName(data.CategoryName);
                my.vm.categoryDesc(data.CategoryDesc);
                my.vm.seoName(data.SEOName);
                my.vm.seoPageTitle(data.SEOPageTitle);
                my.vm.metaDesc(data.MetaDescription);
                my.vm.metaKeywords(data.MetaKeywords);
                my.vm.productCount(data.ProductCount);
                if (data.ParentCategoryId > 0) {
                    $('.jqx-dropdownlist-content').removeClass('jqx-dropdownlist-state-normal-placeholder');
                    my.vm.parentId(data.ParentCategoryId);
                    $('#mainCategories').jqxTree('selectItem', $('#ddl_' + my.vm.parentId() + '')[0]);
                } else {
                    my.vm.parentId(0);
                    my.dropDownContent = '<div style="position: relative; margin-left: 5px; margin-top: 6px; color: #999; font-style: italic;"> Selecionar</div>';
                    $('#availCategoriesButton').jqxDropDownButton('setContent', my.dropDownContent);
                }
            });
            my.categoryProductsData.read();

            var menuItems = $('#editCategoryMenu').find('.k-state-disabled');
            menu.enable(menuItems, menuItems.hasClass('k-state-disabled'));

            $('#groupsGrid').data('kendoGrid').dataSource.read();
            //setTimeout(function () {
            $('#nameTextBox').focus();
            //}, 1000);
        }
    });
    
    var countDDMenu = 1;
    my.buildDDMenuUL = function (parent, items) {
        var li = $('<li>Nenhuma</li>');
        if (countDDMenu <= 1) {
            li.appendTo(parent);
            countDDMenu = countDDMenu + 1;
        }
        $.each(items, function (cat) {
            if (cat.text) {
                // create LI element and append it to the parent element.
                li = $("<li id='ddl_" + cat.item.CategoryId + "'>" + cat.text + "</li>");
                li.appendTo(parent);
                // if there are sub items, call the buildUL function.
                if (cat.items && cat.items.length > 0) {
                    var ul = $("<ul></ul>");
                    ul.appendTo(li);
                    my.buildDDMenuUL(ul, cat.items);
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

    $('#files').kendoUpload({
        async: {
            saveUrl: "/desktopmodules/riw/api/store/SaveFile",
            removeUrl: "/desktopmodules/riw/api/store/RemovePortalFile",
            autoUpload: false,
            multiple: false
        },
        //showFileList: false,
        localization: {
            cancel: 'Cancelar',
            dropFilesHere: 'Arraste arquivos aqui para envia-los',
            remove: 'Remover',
            select: 'Anexar Imagem',
            statusUploading: 'Enviando Arquivo(s)',
            uploadSelectedFiles: 'Enviar Arquivo(s)'
        },
        select: function (e) {
            $.each(e.files, function (index, value) {
                if (value.extension.toUpperCase() !== '.JPG' && value.extension.toUpperCase() !== '.PNG' && value.extension.toUpperCase() !== '.DOC' && value.extension.toUpperCase() !== '.PDF' && value.extension.toUpperCase() !== '.DOCX' && value.extension.toUpperCase() !== '.GIF' && value.extension.toUpperCase() !== '.ZIP' && value.extension.toUpperCase() !== '.RAR') {
                    e.preventDefault();
                    //$().toastmessage('showWarningToast', 'É permitido enviar somente arquivos com formato jpg e png.');
                    $.pnotify({
                        title: 'Aten&#231;&#227;o!',
                        text: '&#201; permitido enviar somente arquivos com formato jpg e png.',
                        type: 'warning',
                        icon: 'fa fa-warning fa-lg',
                        addclass: "stack-bottomright",
                        stack: my.stack_bottomright
                    });
                }
            });
        },
        upload: function (e) {
            e.data = {
                portalId: 0,
                maxWidth: 0,
                maxHeight: 0,
                folderPath: $('#folderPathTextBox').val()
            };
        },
        success: function (e) {
            var _fileInfo = e.response.fileInfo;
            //$.each(e.files, function (index, value) {
            my.vm.portalFiles.unshift(new my.PortalFile()
                .fileId(_fileInfo.FileId)
                .fileName(_fileInfo.FileName)
                .contenType(_fileInfo.ContentType)
                .extension(_fileInfo.Extension)
                .fileSize('Tamanho: ' + my.size_format(_fileInfo.Size))
                .height(_fileInfo.Height)
                .relativePath(_fileInfo.Extension === 'jpg' || _fileInfo.Extension === 'png' || _fileInfo.Extension === 'gif' ? '/portals/0/' + _fileInfo.RelativePath : '/desktopmodules/riw/webapi/content/images/spacer.gif')
                .width(_fileInfo.Width));
            //});
            //});
            $(".k-widget.k-upload").find("ul").remove();
        },
        remove: function (e) {

        },
        error: function (e) {
            //$().toastmessage('showErrorToast', 'Não foi possível o envio do arquivo.');
            $.pnotify({
                title: 'Erro!',
                text: 'N&#227;o foi possível o envio do arquivo.',
                type: 'error',
                icon: 'fa fa-times-circle fa-lg',
                addclass: "stack-bottomright",
                stack: my.stack_bottomright
            });
        }
    });

    $('#editorTextArea').kendoEditor({
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
    });

    $('#btnUpload').click(function (e) {
        e.preventDefault();

        $('#files').click();
    });

    $("#productSearch").kendoAutoComplete({
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
    });

    $("#groupsGrid").kendoGrid({
        dataSource: new kendo.data.DataSource({
            transport: {
                read: {
                    url: '/api/store/GetPublicRoles?portalId=0'
                }
            },
            sort: {
                field: "RoleName",
                dir: "ASC"
            },
            schema: {
                model: {
                    id: 'RoleId'
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
            template: '<span id="spanView_#= RoleId #" style="cursor: default;"><input type="hidden" id="view_#= RoleId #" name="view_#= RoleId #" value="0" /></span>'
        }, {
            field: 'Edit',
            title: 'Editar',
            width: '10%',
            template: '<span id="spanEdit_#= RoleId #" style="cursor: default;"><input type="hidden" id="edit_#= RoleId #" name="edit_#= RoleId #" value="0" /></span>'
        }],
        dataBound: function () {
            if (this.dataSource.view().length > 0) {
                var grid = this;
                //my.pers = ko.utils.arrayFirst(my.vm.catPermissions(), function (item) {
                //    return item;
                //});
                $.each(grid.tbody.find('tr'), function () {
                    var model = grid.dataItem(this);
                    switch (model.RoleId) {
                        case 0:
                            $('[data-uid=' + model.uid + ']').css({ 'display': 'none' });
                            break;
                        case 1:
                            $('[data-uid=' + model.uid + ']').css({ 'display': 'none' });
                            break;
                        case 2:
                            $('[data-uid=' + model.uid + ']').css({ 'display': 'none' });
                            break;
                        case 4:
                            $('[data-uid=' + model.uid + ']').css({ 'display': 'none' });
                            break;
                    }
                    if (my.vm.catPermissions().length > 0) {
                        ko.utils.arrayFirst(my.vm.catPermissions(), function (item) {
                            if (item.RoleId() === model.RoleId) {
                                if (item.AllowAccess()) {
                                    $('#view_' + model.RoleId).val(item.PermissionId());
                                } else {
                                    $('#edit_' + model.RoleId).val(item.PermissionId());
                                }
                                if (model.RoleId === 9999) $('#edit_' + model.RoleId).val(0);
                            }
                        });
                    } else {
                        $('#view_9999').val(1);
                    }
                    if (model.RoleName === 'Gerentes') $('#edit_' + model.RoleId).val(1);
                    initTriStateCheckBox('spanView_' + model.RoleId, 'view_' + model.RoleId, true);
                    initTriStateCheckBox('spanEdit_' + model.RoleId, 'edit_' + model.RoleId, true);
                });
                $('#spanEdit_9999').css({
                    'visibility': 'hidden'
                });
            }
        }
    });

    $('#btnUpdateCategory').click(function (e) {
        e.preventDefault();

        var selectedMainCategory = $('#mainCategories').jqxTree('selectedItem');
        //my.vm.parentId(selectedNode.element.id);

        var categoryData = {
            Lang: 'pt-BR',
            CategoryName: my.vm.categoryName(),
            CategoryId: kendo.parseInt(my.vm.categoryId()),
            ParentCategoryId: my.vm.parentId().toString().replace('ddl_', ''),
            ProductTemplate: '',
            ListItemTemplate: '',
            ListAltItemTemplate: '',
            SEOPageTitle: my.vm.seoPageTitle(),
            SEOName: my.vm.seoName(),
            MetaDescription: my.vm.metaDesc(),
            MetaKeywords: my.vm.metaKeywords(),
            ListOrder: my.vm.listOrder(),
            CategoryDesc: my.vm.categoryDesc(),
            Message: my.vm.message(),
            Archived: my.vm.archived(),
            Hidden: my.vm.hidden(),
            PortalId: 0,
            CreatedByUser: _userID,
            CreatedOnDate: moment().format()
        };

        $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/api/categories/update',
            data: categoryData
        }).done(function (data) {
            if (data.Result.indexOf("success") !== -1) {
                if (my.vm.categoryId()) {
                                        
                    if (selectedMainCategory) {
                        $('#mainCategories').jqxTree('updateItem', selectedMainCategory, { label: $('#nameTextBox').val() });
                    }

                    var selectedElement = $("#treeViewCategories").jqxTree('getSelectedItem').element;
                    $('#treeViewCategories').jqxTree('updateItem', selectedElement, { label: $('#nameTextBox').val() });

                    setTimeout(function () {
                        selectedElement.scrollIntoView();
                    }, 500);

                    var addCategorySecurity = function (args) {
                        $.ajax({
                            type: 'POST',
                            url: '/api/categories/updateSecurity',
                            data: args
                        }).fail(function (jqXHR, textStatus) {
                            console.log(jqXHR.responseText);
                        });
                    };

                    var categorySecurityData = {
                        CategoryId: my.vm.categoryId()
                    };

                    var grid = $('#groupsGrid').data('kendoGrid');
                    $.each(grid.dataSource.data(), function (i, item) {

                        if ($('#view_' + item.RoleId).val() !== '0') {

                            categorySecurityData.RoleId = item.RoleId;
                            categorySecurityData.PermissionId = $('#view_' + item.RoleId).val();
                            categorySecurityData.AllowAccess = true;

                            addCategorySecurity(categorySecurityData);
                        }

                        if ($('#edit_' + item.RoleId).val() !== '0') {

                            categorySecurityData.RoleId = item.RoleId;
                            categorySecurityData.PermissionId = $('#edit_' + item.RoleId).val();
                            categorySecurityData.AllowAccess = false;

                            addCategorySecurity(categorySecurityData);
                        }
                    });

                    //$().toastmessage('showSuccessToast', 'Categoria ' + my.vm.categoryName() + ' atualizada com sucesso.');
                    $.pnotify({
                        title: 'Sucesso!',
                        text: 'Categoria <strong>' + my.vm.categoryName() + '</strong> atualizada.',
                        type: 'success',
                        icon: 'fa fa-check fa-lg',
                        addclass: "stack-bottomright",
                        stack: my.stack_bottomright
                    });
                } else {
                    my.vm.categoryId(data.CategoryId);

                    if (selectedMainCategory !== null) {

                        var selectedItem = null;
                        if (my.vm.parentId().toString().replace('ddl_', '')) {
                            selectedItem = $('#treeViewCategories').find('#' + my.vm.parentId().toString().replace('ddl_', '') + '')[0];
                        }
                        $('#treeViewCategories').jqxTree('addTo', {
                            label: my.vm.categoryName(),
                            id: my.vm.categoryId()
                        }, selectedItem, false);

                        //    var selectedMainItem = null;
                        //    selectedMainItem = $('#mainCategories').find('#' + my.vm.parentId() + '')[0];
                        $('#mainCategories').jqxTree('addTo', {
                            label: my.vm.categoryName(),
                            id: 'ddl_' + my.vm.categoryId()
                        }, selectedMainCategory, false);

                        //$('#mainCategories').jqxTree('render');
                        
                    } else {

                        $('#mainCategories').jqxTree('addTo', {
                            label: my.vm.categoryName(),
                            id: 'ddl_' + my.vm.categoryId()
                        }, null, false);

                        $('#treeViewCategories').jqxTree('addTo', {
                            label: my.vm.categoryName(),
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

                    //$().toastmessage('showSuccessToast', 'Categoria <strong>' + my.vm.categoryName() + '</strong><br />inserida com sucesso.');
                    $.pnotify({
                        title: 'Sucesso!',
                        text: 'Categoria <strong>' + my.vm.categoryName() + '</strong><br />inserida.',
                        type: 'success',
                        icon: 'fa fa-check fa-lg',
                        addclass: "stack-bottomright",
                        stack: my.stack_bottomright
                    });
                }

                var menuItems = $('#editCategoryMenu').find('.k-state-disabled');
                menu.enable(menuItems, menuItems.hasClass('k-state-disabled'));

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
    });

    $('#btnRemove').click(function (e) {
        e.preventDefault();

        var $dialog = $('<div></div>')
                        .html('<div class="confirmDialog">Tem Certeza?</div>')
                        .dialog({
                            autoOpen: false,
                            modal: true,
                            resizable: false,
                            dialogClass: 'dnnFormPopup',
                            open: function () {
                                $(".ui-dialog-title").append('Aviso de Exclus&#227;o');
                            },
                            buttons: {
                                'ok': {
                                    text: 'Sim',
                                    //priority: 'primary',
                                    "class": 'dnnPrimaryAction',
                                    click: function () {
                                        $.ajax({
                                            type: 'DELETE',
                                            url: '/api/categories/removeCategory?catId=' + my.vm.categoryId()
                                        }).done(function (data) {
                                            if (data.Result.indexOf("success") !== -1) {

                                                var selectedElement = $("#treeViewCategories").jqxTree('getSelectedItem').element;
                                                $('#treeViewCategories').jqxTree('removeItem', selectedElement, true);

                                                //setTimeout(function () {
                                                //$('#treeViewCategories').jqxTree('refresh');
                                                //$('#treeViewCategories').jqxTree('render');
                                                //}, 500);

                                                var selectedNode = $('#mainCategories').find('#ddl_' + my.vm.categoryId())[0];
                                                $('#mainCategories').jqxTree('removeItem', selectedNode, true);

                                                //setTimeout(function () {
                                                //    $('#treeViewCategories').jqxTree('render');
                                                //    $('#mainCategories').jqxTree('render');
                                                //}, 500);

                                                //$().toastmessage('showSuccessToast', 'Categoria excluida com sucesso');
                                                $.pnotify({
                                                    title: 'Sucesso!',
                                                    text: 'Categoria <strong>' + $('#nameTextBox').val() + '</strong> excluida.',
                                                    type: 'success',
                                                    icon: 'fa fa-check fa-lg',
                                                    addclass: "stack-bottomright",
                                                    stack: my.stack_bottomright
                                                });

                                                $('#btnCancel').click();

                                                $dialog.dialog('close');
                                                $dialog.dialog('destroy');
                                            } else {
                                                $.pnotify({
                                                    title: 'Erro!',
                                                    text: data.Result,
                                                    type: 'error',
                                                    icon: 'fa fa-times-circle fa-lg',
                                                    addclass: "stack-bottomright",
                                                    stack: my.stack_bottomright
                                                });
                                                //$().toastmessage('showErrorToast', data.Msg);
                                            }
                                        }).fail(function (jqXHR, textStatus) {
                                            console.log(jqXHR.responseText);
                                        });
                                    }
                                },
                                'cancel': {
                                    html: 'N&#227;o',
                                    //priority: 'secondary',
                                    "class": 'dnnSecondaryAction',
                                    click: function () {
                                        $dialog.dialog('close');
                                        $dialog.dialog('destroy');
                                    }
                                }
                            }
                        });

        $dialog.dialog('open');
    });

    $('#btnAdddProductCategory').click(function (e) {
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
    });

    $('#btnRemoveProductsCategory').click(function (e) {
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
    });

    $('#btnCancel').click(function (e) {
        e.preventDefault();

        $('#btnCancel').hide();
        $('#btnRemove').hide();
        my.vm.hidden(false);
        my.vm.message('');
        my.vm.lang('pt-BR');
        my.vm.archived(false);
        my.vm.listOrder(1);
        my.vm.categoryId(0);
        my.vm.categoryName('');
        my.vm.categoryDesc('');
        my.vm.parentId(0);
        my.vm.seoName('');
        my.vm.seoPageTitle('');
        my.vm.metaDesc('');
        my.vm.metaKeywords('');
        my.vm.productCount(0);
        my.vm.catPermissions.removeAll();
        my.dropDownContent = '<div style="position: relative; margin-left: 5px; margin-top: 6px; color: #999; font-style: italic;"> Selecionar</div>';
        $('#availCategoriesButton').jqxDropDownButton('setContent', my.dropDownContent);
        var categoryMenuItems = $('#editCategoryMenu').find(':not(.k-first)');
        menu.enable(categoryMenuItems, categoryMenuItems.hasClass('k-state-disabled'));
        $('#treeViewCategories').jqxTree('selectItem', $('#tvCategories').find('#0999999999')[0]);
        $('#nameTextBox').focus();
    });

});
