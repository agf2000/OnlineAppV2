$(function() {

    my.personId = my.getParameterByName('personId');
    var status = $(".status");
    my.retSel = my.getParameterByName('retSel');
    my.editProduct = my.getParameterByName('itemId');
    my.vendor = my.getQuerystring('vendor', my.getParameterByName('vendor'));

    my.viewModel();

    //my.vm.loadEntitiesRoles();

    $('#chkBoxBlocked').bootstrapSwitch();

    $('#btnSyncPersonAddress').kendoButton();

    $('#selectRegisterTypes').kendoMultiSelect({
        autoBind: false,
        dataSource: {
            transport: {
                read: {
                    url: '/desktopmodules/riw/api/store/getRolesByRoleGroup?portalId=' + portalID + '&roleGroupName=Entidades,Descontos'
                }
            }
        },
        dataTextField: 'RoleName',
        dataValueField: 'RoleId'
    });

    my.checkPersonEmail = function(username) {
        if (my.personId > 0) {
            $.ajax({
                async: false,
                url: '/desktopmodules/riw/api/people/ValidateUser?vTerm=' + username
            }).done(function(data) {
                if (data > 0) {
                    return true;
                }
            }).fail(function(jqXHR, textStatus) {
                console.log(jqXHR.responseText);
            });
        } else {
            $.ajax({
                async: false,
                url: '/desktopmodules/riw/api/people/ValidatePerson?email=' + username
            }).done(function(data) {
                if (data > 0) {
                    return true;
                }
            }).fail(function(jqXHR, textStatus) {
                console.log(jqXHR.responseText);
            });
        }
        return false;
    };

    $("#actionsMenu").jqxMenu();

    my.getPerson = function() {
        if (my.personId !== 0) {
            $.ajax({
                url: '/desktopmodules/riw/api/people/GetPerson?personId=' + my.personId,
                async: false
            }).done(function(data) {
                if (data) {
                    $('#actionsMenu').show();
                    $('#btnUpdatePerson').html('<i class="fa fa-check"></i>&nbsp; Atualizar');
                    $('#btnUpdatePerson').show();
                    //$('#btnAssist').show();
                    //$('#btnFinance').show();
                    //$('#btnHistory').show();

                    if (data.PersonType) {
                        my.vm.personType('1');
                    } else {
                        my.vm.personType('0');
                    }

                    my.vm.personId(data.PersonId);
                    if (data.UserId > 0) {
                        my.vm.personUserId(data.UserId);
                        //$('#enableLoginChk').hide();
                        //$('#spanCreateLogin').text('');
                        $('#liLogin').hide();
                    } else {
                        $('#personMenu #5').hide();
                        $('#personMenu #6').hide();
                        $('#personMenu #7').hide();
                    }

                    my.vm.displayName(data.DisplayName);
                    my.vm.firstName(data.FirstName);
                    my.vm.lastName(data.LastName);
                    my.vm.cpf(data.CPF);
                    my.vm.ident(data.Ident);
                    my.vm.telephone(data.Telephone);
                    my.vm.cell(data.Cell);
                    my.vm.fax(data.Fax);
                    my.vm.originalEmail(data.Email);
                    if (data.Email) {
                        if (data.Email.length > 2) {
                            my.vm.email(data.Email);
                            $('#actionsMenu li:nth-child(5)').show();
                        }
                    }
                    my.vm.companyName(data.CompanyName);
                    my.vm.zero800(data.Zero800s);
                    my.vm.dateFound(data.DateFound);
                    my.vm.dateRegistered(data.DateRegistered);
                    my.vm.ein(data.EIN);
                    my.vm.stateTax(data.StateTax);
                    my.vm.cityTax(data.CityTax);
                    my.vm.comments(data.Comments);
                    $('#chkBoxBlocked').bootstrapSwitch('setState', data.Blocked),
                        my.vm.reasonBlocked(data.ReasonBlocked),
                        my.vm.bio(data.Biography);
                    my.vm.locked(data.Locked);
                    if (data.MonthlyIncome > 0) my.vm.income(data.MonthlyIncome);
                    my.vm.selectedFinanAddress(data.PersonAddressId);
                    my.vm.website(data.Website);

                    my.vm.createdByUser(data.CreatedByUser);
                    my.vm.createdOnDate(data.CreatedOnDate);

                    $('#postalCodeTextBox').val(data.PostalCode);
                    $('#streetTextBox').val(data.Street);
                    $('#unitTextBox').val(data.Unit);
                    $('#complementTextBox').val(data.Complement);
                    $('#districtTextBox').val(data.District);
                    $('#cityTextBox').val(data.City);
                    my.vm.selectedRegion(data.Region);
                    my.vm.selectedCountry(data.Country);

                    //var rTypes = [];
                    //$.each(data.RegisterTypes.split(','), function (i, value) {
                    //    //$('input[value='rTypes']').attr({ 'checked': true})
                    //    rTypes.push(value);
                    //});

                    //my.vm.selectedType(rTypes);

                    $('#selectRegisterTypes').data('kendoMultiSelect').value(data.RegisterTypes);

                    //$('#moduleTitle').html('Cliente: ' + data.DisplayName + ' (ID: ' + data.PersonId + ')');

                    if (data.IsDeleted) {
                        $('#btnRestorePerson').show();
                        if (!data.Locked) {
                            $('#btnRemovePerson').show();
                        } else {
                            $('#btnDeletePerson').show();
                        }
                    } else {
                        $('#btnRestorePerson').hide();
                        $('#btnDeletePerson').show();
                        if (data.Locked) {
                            $('#btnDeletePerson').show();
                        } else {
                            $('#btnRemovePerson').show();
                        }
                    }

                    if (authorized < 3) {
                        $('#btnRemovePerson').hide();
                        //} else {
                        //    if (my.vm.personId() === 1) {
                        //        $('#btnDeletePerson').hide();
                        //        $('#btnUpdatePerson').hide();
                        //        $('#btnUpdateLogin').hide();
                        //        $('#btnUpdatePassword').hide();
                        //        $('#btnRandomPassword').hide();
                        //    }
                    }

                    setTimeout(function() {
                        my.vm.selectedSalesRepId(data.SalesRep > 0 ? data.SalesRep : parseInt(amplify.store.sessionStorage('salesPerson')));
                        $.ajax({
                            url: '/desktopmodules/riw/api/people/GetPersonIndustries?personId=' + my.personId,
                            async: false
                        }).done(function(data) {
                            if (data) {
                                my.vm.selectedIndustries.removeAll();
                                $.each(data, function(i, item) {
                                    my.vm.selectedIndustries.push(item.IndustryId);
                                });
                            }
                        });
                    }, 500);

                    $('#personMenu').show();
                    $('#personMenu').jqxMenu({
                        width: '120',
                        mode: 'vertical'
                    });
                    //$('#ddlRegions').data('kendoDropDownList').value(my.vm.selectedRegion());
                    //my.setPerson();

                    $('#editPerson .pull-left').css({ 'width': '14%' });
                    $('#editPerson .pull-right').css({ 'width': '85%' });
                }
            });
        } else {
            $('#actionsMenu').hide();
            $('#editPerson .pull-right').css({ 'width': '100%' });
            $('#personForm .pull-left').css({ 'width': '50%' });
            $('#personForm .pull-right').css({ 'width': '50%' });

            setTimeout(function() {
                $('#selectRegisterTypes').data('kendoMultiSelect').value(my.vendor === '1' ? providerRoleId : clientsRoleId);
                // my.vm.selectedType(my.vendor === '1' ? providerRoleId : clientsRoleId);
                my.vm.selectedSalesRepId(parseInt(amplify.store.sessionStorage('salesPerson')));
                $('#ddlCountries').data('kendoDropDownList').value(my.vm.selectedCountry());
            }, 500);
        }
    };

    my.getPerson();

    my.validator = new ValidationUtility();

    $("#bDayTextBox").kendoDatePicker({
        format: "m",
        parseFormats: ["m"]
    });

    $('#bDayTextBox').prop('placeholder', 'ex.: ' + kendo.toString(new Date(), 'm'));

    my.initializer = function() {
        if (my.personId !== 0) {
            if (my.vm.personType() === '1') {

                if (my.vm.askLastName()) {
                    $('#lastNameTextBox').show();
                    if (my.vm.reqLastName()) {
                        $('#lastNameTextBox').attr({ 'required': 'required', 'data-role': 'validate' });
                        $('label[for="lastNameTextBox"]').addClass('required');
                    }
                }
                if (my.vm.askTelephone()) {
                    $('#liPhone').show();
                    $('#liCell').show();
                    if (my.vm.reqTelephone()) {
                        $('#phoneTextBox').attr({ 'required': 'required', 'data-role': 'validate' });
                        $('label[for="phoneTextBox"]').addClass('required');
                    }
                }
                if (my.vm.askSSN()) {
                    $('#liCPF').show();
                    if (my.vm.reqSSN()) {
                        $('#cpfTextBox').attr({ 'required': 'required', 'data-role': 'validate' });
                        $('label[for="cpfTextBox"]').addClass('required');
                    }
                }
                if (my.vm.askIdent()) {
                    $('#liIdent').show();
                    if (my.vm.reqIdent()) {
                        $('#identTextBox').attr({ 'required': 'required', 'data-role': 'validate' });
                        $('label[for="identTextBox"]').addClass('required');
                    }
                }

                //$('#companyTextBox').removeClass('required').attr({ 'required': false });
                //$('#einTextBox').removeClass('required').attr({ 'required': false });
                //$('#stateTaxTextBox').removeClass('required').attr({ 'required': false });
                //$('#cityTaxTextBox').removeClass('required').attr({ 'required': false });
                //$('#ddlIndustries').removeClass('required').attr({ 'required': false });
                //$('#websiteTextBox').removeClass('required').attr({ 'required': false });
            } else {
                //$('#cpfTextBox').removeClass('required').attr({ 'required': false });
                //$('#identTextBox').removeClass('required').attr({ 'required': false });
                //if (my.vm.askTelephone()) $('#liCell').show();
                $('#liCompanyName').show();

                $('#companyTextBox').attr({ 'required': 'required', 'data-role': 'validate' });
                my.vm.reqCompanyName(true);
                if (my.vm.askTelephone()) {
                    $('#liPhone').show();
                    //$('#liCell').show();
                    $('#liFax').show();
                    $('#liZero0800').show();
                    if (my.vm.reqTelephone()) {
                        $('#phoneTextBox').attr({ 'required': 'required', 'data-role': 'validate' });
                        $('label[for="phoneTextBox"]').addClass('required');
                    }
                }
                if (my.vm.askWebsite()) {
                    $('#liWebsite').show();
                    if (my.vm.reqWebsite()) {
                        $('#websiteTextBox').attr({ 'required': 'required', 'data-role': 'validate' });
                        $('label[for="websiteTextBox"]').addClass('required');
                    }
                }
                if (my.vm.askEIN()) {
                    $('#liEIN').show();
                    if (my.vm.reqEIN()) {
                        $('#einTextBox').attr({ 'required': 'required', 'data-role': 'validate' });
                        $('label[for="einTextBox"]').addClass('required');
                    }
                }
                if (my.vm.askST()) {
                    $('#liST').show();
                    if (my.vm.reqST()) {
                        $('#stateTaxTextBox').attr({ 'required': 'required', 'data-role': 'validate' });
                        $('label[for="stateTaxTextBox"]').addClass('required');
                    }
                }
                if (my.vm.askCT()) {
                    $('#liCT').show();
                    if (my.vm.reqCT()) {
                        $('#cityTaxTextBox').attr({ 'required': 'required', 'data-role': 'validate' });
                        $('label[for="cityTaxTextBox"]').addClass('required');
                    }
                }
                if (my.vm.askIndustry()) {
                    my.vm.loadIndustries();
                    $('#liIndustries').show();
                    if (my.vm.reqIndustry()) {
                        $('#ddlIndustries').attr({ 'required': 'required', 'data-role': 'validate' });
                        $('label[for="ddlIndustries"]').addClass('required');
                    }
                }
            }
        }

        switch (my.getParameterByName('subSel')) {
            case 2: // Person Addresses

                my.editPersonAddress = function(value) {
                    $.ajax({
                        url: '/desktopmodules/riw/api/people/GetPersonAddress?personAddressId=' + value + '&personId=' + my.personId
                    }).done(function(data) {
                        my.vm.personAddressId(data.PersonAddressId);
                        $('#addressNameTextBox').val(data.AddressName);
                        $('#addressPhoneTextBox').val(data.Telephone);
                        $('#addressCellTextBox').val(data.Cell);
                        $('#addressFaxTextBox').val(data.Fax);
                        $('#addressViewOrderTextBox').val(data.ViewOrder);
                        $('#addressPostalCodeTextBox').val(data.PostalCode);
                        $('#addressStreetTextBox').val(data.Street);
                        $('#addressUnitTextBox').val(data.Unit);
                        $('#addressComplementTextBox').val(data.Complement);
                        $('#addressDistrictTextBox').val(data.District);
                        $('#addressCityTextBox').val(data.City);
                        my.vm.selectedRegion(data.Region);
                        $('#addressCommentTextArea').text(data.Comment);
                        $("#addressPostalCodeTextBox").inputmask("99.999-999");
                        $("#addressPhoneTextBox").inputmask("(99) 9999-9999");
                        $("#addressCellTextBox").inputmask("(99) 9999-9999");
                        $("#addressFaxTextBox").inputmask("(99) 9999-9999");
                        $('#btnUpdatePersonAddress').html('<i class="fa fa-check"></i>&nbsp; Atualizar Endere&ccedil;o');
                        if (data.IsDeleted) {
                            $('#btnRestorePersonAddress').show();
                            $('#btnDeletePersonAddress').hide();
                        } else {
                            $('#btnRestorePersonAddress').hide();
                            $('#btnDeletePersonAddress').show();
                        }
                        //$('#collapseAddress').addClass('toggle');
                        if (!$('#collapseAddress').hasClass('in')) {
                            $('#collapseAddress').addClass('in');
                        }
                        $.scrollTo($('#collapseAddress'), 1000, { easing: 'swing' });
                    });
                    return false;
                };

                $('#btnUpdatePersonAddress').click(function(e) {
                    e.preventDefault();
                    $('#personAddresses').wrap('<form id="temp_form_id" />');
                    if (!my.validator.validate('#temp_form_id')) {
                        $.pnotify({
                            title: 'Aten&#231;&#227;o!',
                            text: 'Favor preenchar todos os campos obrigat&#243;rios.',
                            type: 'warning',
                            icon: 'fa fa-warning fa-lg',
                            addclass: "stack-bottomright",
                            stack: my.stack_bottomright
                        });
                        $('#personAddresses').unwrap();
                    } else {

                        var $this = $(this);
                        $this.button('loading');

                        var params = {
                            PersonAddressId: my.vm.personAddressId(),
                            PersonId: my.personId,
                            AddressName: $('#addressNameTextBox').val().trim(),
                            Street: $('#addressStreetTextBox').val().trim(),
                            Unit: $('#addressUnitTextBox').val().trim(),
                            Complement: $('#addressComplementTextBox').val().trim(),
                            District: $('#addressDistrictTextBox').val().trim(),
                            City: $('#addressCityTextBox').val().trim(),
                            Region: my.vm.selectedRegion(),
                            Country: my.vm.selectedCountry(),
                            PostalCode: $('#addressPostalCodeTextBox').val(),
                            Telephone: $('#addressPhoneTextBox').val().replace(/\D/g, ''),
                            Cell: $('#addressCellTextBox').val().replace(/\D/g, ''),
                            Fax: $('#addressFaxTextBox').val().replace(/\D/g, ''),
                            ViewOrder: $('#addressViewOrderTextBox').val(),
                            CreatedByUser: userID,
                            CreatedOnDate: moment().format(),
                            SyncEnabled: amplify.store.sessionStorage('syncEnabled').toLowerCase()
                        };

                        $.ajax({
                            type: 'POST',
                            url: '/desktopmodules/riw/api/people/updatePersonAddress',
                            data: params
                        }).done(function(data) {
                            if (data.Result.indexOf("success") !== -1) {
                                my.vm.personAddressId(0);
                                my.personAddressesData.read();
                                $('#personAddresses input').val('');
                                $('#addressViewOrderTextBox').val(1);
                                $('#btnDeletePersonAddress').hide();
                                $('#btnUpdatePersonAddress').html('<i class="icon-plus icon-white"></i>&nbsp; Adicionar Endere&ccedil;o').attr({ 'disabled': false });
                                //$().toastmessage('showSuccessToast', 'Endere&#231;o gravado com sucesso.');
                                $.pnotify({
                                    title: 'Sucesso!',
                                    text: 'Endere&#231;o salvo.',
                                    type: 'success',
                                    icon: 'fa fa-check fa-lg',
                                    addclass: "stack-bottomright",
                                    stack: my.stack_bottomright
                                });
                                $('#collapseAddress').addClass('toggle');
                                $.scrollTo($('#personAddresses'), 1000, { easing: 'swing' });
                            } else {
                                $.pnotify({
                                    title: 'Erro!',
                                    text: data.Result,
                                    type: 'error',
                                    icon: 'fa fa-times-circle fa-lg',
                                    addclass: "stack-bottomright",
                                    stack: my.stack_bottomright
                                });
                                //$().toastmessage('showErrorToast', data.Meg);
                            }
                        }).fail(function(jqXHR, textStatus) {
                            console.log(jqXHR.responseText);
                        }).always(function() {
                            $this.button('reset');
                        });
                    }
                });

                $('#btnDeletePersonAddress').click(function(e) {
                    if (e.clientX === 0) {
                        return false;
                    }
                    e.preventDefault();

                    var $this = $(this);

                    var params = {
                        PersonId: my.personId,
                        PersonAddressId: my.vm.personAddressId(),
                        ModifiedByUser: userID,
                        ModifiedOnDate: moment().format()
                    };

                    var $dialog = $('<div></div>')
                        .html('<div class="confirmDialog">Tem Certeza?</div>')
                        .dialog({
                            autoOpen: false,
                            modal: true,
                            resizable: false,
                            dialogClass: 'dnnFormPopup',
                            open: function() {
                                $(".ui-dialog-title").append('Aviso de Exclus&#227;o');
                            },
                            buttons: {
                                'ok': {
                                    text: 'Sim',
                                    //priority: 'primary',
                                    "class": 'dnnPrimaryAction',
                                    click: function() {
                                        if (my.vm.personAddressId() !== 0) {

                                            $this.button('loading');

                                            $.ajax({
                                                type: 'PUT',
                                                url: '/desktopmodules/riw/api/people/DeletePersonAddress',
                                                data: params
                                            }).done(function(data) {
                                                if (data.Result.indexOf("success") !== -1) {
                                                    my.vm.personAddressId(0);
                                                    my.personAddressesData.read();
                                                    $('#btnUpdateAddress').html('<i class="icon-plus icon-white"></i>&nbsp; Adicionar Endere&ccedil;o').attr({ 'disabled': false });
                                                    $('#personAddresses input').val('');
                                                    $('#btnDeletePersonAddress').hide();
                                                    //$().toastmessage('showSuccessToast', 'Endere&ccedil;o desativado com sucesso.');
                                                    $.pnotify({
                                                        title: 'Sucesso!',
                                                        text: 'Endere&ccedil;o desativado.',
                                                        type: 'success',
                                                        icon: 'fa fa-check fa-lg',
                                                        addclass: "stack-bottomright",
                                                        stack: my.stack_bottomright
                                                    });
                                                    $('#collapseAddress').addClass('toggle');
                                                } else {
                                                    $.pnotify({
                                                        title: 'Erro!',
                                                        text: data.Result,
                                                        type: 'error',
                                                        icon: 'fa fa-times-circle fa-lg',
                                                        addclass: "stack-bottomright",
                                                        stack: my.stack_bottomright
                                                    });
                                                    //$().toastmessage('showErrorToast', data.Meg);
                                                }
                                            }).fail(function(jqXHR, textStatus) {
                                                console.log(jqXHR.responseText);
                                            }).always(function() {
                                                $this.button('reset');
                                            });

                                            $dialog.dialog('close');
                                            $dialog.dialog('destroy');
                                        }
                                    }
                                },
                                'cancel': {
                                    html: 'N&#227;o',
                                    //priority: 'secondary',
                                    "class": 'dnnSecondaryAction',
                                    click: function() {
                                        $dialog.dialog('close');
                                        $dialog.dialog('destroy');
                                    }
                                }
                            }
                        });

                    $dialog.dialog('open');
                });

                $('#btnRestorePersonAddress').click(function(e) {
                    if (e.clientX === 0) {
                        return false;
                    }
                    e.preventDefault();

                    var $this = $(this);
                    $this.button('loading');

                    var params = {
                        PersonId: my.personId,
                        PersonAddressId: my.vm.personAddressId(),
                        ModifiedByUser: userID,
                        ModifiedOnDate: moment().format()
                    };
                    $.ajax({
                        type: 'PUT',
                        url: '/desktopmodules/riw/api/people/RestorePersonAddress',
                        data: params
                    }).done(function(data) {
                        if (data.Result.indexOf("success") !== -1) {
                            my.vm.personAddressId(0);
                            my.personAddressesData.read();
                            $('#btnUpdatePersonAddress').html('<i class="icon-plus icon-white"></i>&nbsp; Adicionar Endere&ccedil;o').attr({ 'disabled': false });
                            $('#personAddresses input').val('');
                            $('#btnRestorePersonAddress').hide();
                            $('#btnDeletePersonAddress').hide();
                            //$().toastmessage('showSuccessToast', 'Endere&ccedil;o ativado com sucesso.');
                            $.pnotify({
                                title: 'Sucesso!',
                                text: 'Endere&ccedil;o ativado.',
                                type: 'success',
                                icon: 'fa fa-check fa-lg',
                                addclass: "stack-bottomright",
                                stack: my.stack_bottomright
                            });
                            $.scrollTo($('#personAddresses'), 1000, { easing: 'swing' });
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
                    }).fail(function(jqXHR, textStatus) {
                        console.log(jqXHR.responseText);
                    }).always(function() {
                        $this.button('reset');
                    });
                });

                $('#btnSyncPersonAddress').click(function(e) {
                    e.preventDefault();

                    var $this = $(this);
                    $this.button('loading');

                    $.ajax({
                        type: 'POST',
                        url: '/desktopmodules/riw/api/people/SyncSGIPersonAddress?codigo=' + my.personId
                    }).done(function(data) {
                        if (data.Result.indexOf("success") !== -1) {
                            my.vm.personAddressId(0);
                            my.personAddressesData.read();
                            $.pnotify({
                                title: 'Sucesso!',
                                text: 'Endere&#231;o salvo.',
                                type: 'success',
                                icon: 'fa fa-check fa-lg',
                                addclass: "stack-bottomright",
                                stack: my.stack_bottomright
                            });
                            $.scrollTo($('#personAddresses'), 1000, { easing: 'swing' });
                        } else {
                            $.pnotify({
                                title: 'Erro!',
                                text: data.Result,
                                type: 'error',
                                icon: 'fa fa-times-circle fa-lg',
                                addclass: "stack-bottomright",
                                stack: my.stack_bottomright
                            });
                        }
                    }).fail(function(jqXHR, textStatus) {
                        console.log(jqXHR.responseText);
                    }).always(function() {
                        $this.button('reset');
                    });
                });

                my.personAddressesTransport = {
                    read: {
                        url: '/desktopmodules/riw/api/people/GetPersonAddresses?personId=' + my.personId
                    }
                };

                my.personAddressesData = new kendo.data.DataSource({
                    transport: my.personAddressesTransport,
                    sort: { field: "AddressName", dir: "ASC" },
                    schema: {
                        model: {
                            id: 'PersonAddressId'
                        }
                    }
                });

                my.createAddressesLV = function() {
                    $("#lvPersonAddresses").kendoListView({
                        dataSource: my.personAddressesData,
                        template: kendo.template($("#tmplPersonAddresses").html()),
                        dataBound: function() {
                            if (this.dataSource.view().length === 0) $('#collapseAddress').addClass('in');
                        }
                    });
                };

                my.createAddressesLV();
                //        //$('#clientAddresses').load('' + _addressesURL + '?SkinSrc=[G]Skins/riw/popUpSkin&ContainerSrc=[G]Containers/riw/popUpContainer&cinfo=True', function () {

                // $('#btnUpdatePersonAddress').html('<i class="icon-plus"></i>Adicionar Endere&ccedil;o');
                $("#addressPostalCodeTextBox").inputmask("99-999-999");
                $("#addressPhoneTextBox").inputmask("(99) 9999-9999");
                $("#addressCellTextBox").inputmask("(99) 9999-9999");
                $("#addressFaxTextBox").inputmask("(99) 9999-9999");
                //$("#ddlAddressCountries").css('width', '200px');
                //$("#ddlRegions").css('width', '200px');
                var ddlAddressCountries = $('#ddlAddressCountries').data('kendoDropDownList');
                ddlAddressCountries.wrapper.find(".k-dropdown-wrap").css({ 'width': '160px' });
                ddlAddressCountries.list.width(180);
                var ddlRegions = $('#ddlRegions').data('kendoDropDownList');
                ddlRegions.wrapper.find(".k-dropdown-wrap").css({ 'width': '160px' });
                ddlRegions.list.width(180);
                //$('#addressNameTextBox').attr({ 'required': true });
                //$('#contactNameTextBox').attr({ 'required': false });

                $('#personAddresses .pull-left').css({ 'width': '45%' });
                $('#personAddresses .pull-right').css({ 'width': '55%' });

                $('#btnCancelAddress').click(function(e) {
                    if (e.clientX === 0) {
                        return false;
                    }
                    e.preventDefault();

                    $('#btnUpdateAddress').html('<i class="icon-plus icon-white"></i>&nbsp; Adicionar Endere&ccedil;o').attr({ 'disabled': false });
                    $('#personAddresses input').val('');
                    $('#btnDeletePersonAddress').hide();
                    $('#collapseAddress').collapse('toggle');
                    my.vm.personAddressId(null);
                });

                $('#personAddresses').delay(100).show();

                break;
            case 3: // Person Contacts

                my.personContactsTransport = {
                    read: {
                        url: '/desktopmodules/riw/api/people/GetPersonContacts?personId=' + my.personId
                    }
                };

                my.personContactsData = new kendo.data.DataSource({
                    transport: my.personContactsTransport,
                    sort: { field: "ContactName", dir: "ASC" },
                    schema: {
                        model: {
                            id: 'PersonContactId',
                            fields: {
                                DateBirth: { field: "DateBirth", type: "date", format: "{0:m}" }
                            }
                        }
                    }
                });

                //my.createContactsLV = function () {
                $("#lvPersonContacts").kendoListView({
                    dataSource: my.personContactsData,
                    template: kendo.template($("#tmplPersonContacts").html()),
                    dataBound: function() {
                        if (this.dataSource.view().length === 0) $('#collapseContact').addClass('in');
                        //var ds = this.dataSource;
                        //var contact = 1
                        //if (contact === 1) {
                        //    ds.add({ ContactName: my.vm.displayName(), PersonContactId: '0', ContactPhone1: my.vm.telephone(), ContactEmail1: my.vm.email(), ContactEmail2: null, PhoneExt1: null, ContactPhone2: null, PhoneExt2: null, Dept: null, DateBirth: null, AddressName: null, Comments: null });
                        //    contact = contact + 1
                        //}
                        //$('#edit_0').html('(Informa&#231;&#227;o vinda do cadastro)').css({ 'disabled': true }).attr({ 'title': 'Esta informa&#231;&#227;o pode ser editada no cadastro.' });
                    }
                });
                //};

                //my.createContactsLV();
                my.vm.loadAddresses();

                //setTimeout(function () {
                //    my.personContactsData.add({ ContactName: my.vm.displayName(), PersonContactId: '0', ContactPhone1: my.vm.telephone(), ContactEmail1: my.vm.email(), ContactEmail2: null, PhoneExt1: null, ContactPhone2: null, PhoneExt2: null, Dept: null, DateBirth: null, AddressName: null, Comments: null });
                //    // $("#lvPersonContacts").data('kendoListView').dataSource.add({ ContactName: my.vm.displayName(), PersonContactId: '0', ContactPhone1: my.vm.telephone(), ContactEmail1: my.vm.email(), ContactEmail2: null, PhoneExt1: null, ContactPhone2: null, PhoneExt2: null, Dept: null, DateBirth: null, AddressName: null, Comments: null });
                //    $("#lvPersonContacts").data('kendoListView').dataSource.sync();
                //}, 1000);

                //$('#btnUpdatePersonContact').html('<i class="icon-plus"></i> Adicionar Contato');
                $("#phone1TextBox").inputmask("(99) 9999-9999");
                $("#phone2TextBox").inputmask("(99) 9999-9999");
                //$("#ddlContactAddresses").css('width', '200px');
                //var ddlContactAddresses = $('#ddlContactAddresses').data('kendoDropDownList');
                //ddlContactAddresses.wrapper.find(".k-dropdown-wrap").css({ 'width': '130px' });
                //ddlContactAddresses.list.width(150);
                //var numeric1 = $("#phone1ExtTextBox").kendoNumericTextBox().data("kendoNumericTextBox");
                //numeric1.wrapper.find(".k-numeric-wrap").addClass("expand-padding").find(".k-select").hide();
                //var numeric2 = $("#phone2ExtTextBox").kendoNumericTextBox().data("kendoNumericTextBox");
                //numeric2.wrapper.find(".k-numeric-wrap").addClass("expand-padding").find(".k-select").hide();
                //$('#addressNameTextBox').attr({ 'required': false });
                //$('#contactNameTextBox').attr({ 'required': true });

                $('#personContacts .pull-left').css({ 'width': '54%' });
                $('#personContacts .pull-right').css({ 'width': '46%' });

                my.editPersonContact = function(value) {
                    $.ajax({
                        url: '/desktopmodules/riw/api/people/GetPersonContact?personContactId=' + value + '&personId=' + my.personId
                    }).done(function(data) {
                        my.vm.personContactId(data.PersonContactId);
                        $('#contactNameTextBox').val(data.ContactName);
                        $('#email1NameTextBox').val(data.ContactEmail1);
                        $('#email2NameTextBox').val(data.ContactEmail2);
                        $('#phone1TextBox').val(data.ContactPhone1);
                        $('#phone2TextBox').val(data.ContactPhone2);
                        $('#phone1ExtTextBox').val(data.PhoneExt1);
                        $('#phone2ExtTextBox').val(data.PhoneExt2);
                        $('#deptTextBox').val(data.Dept);
                        if (kendo.parseDate(data.DateBirth) > kendo.parseDate(new Date('01/01/1900'))) {
                            $('#bDayTextBox').data('kendoDatePicker').value(data.DateBirth);
                        }
                        $('#commentsContactTextArea').val(data.Comments);
                        my.vm.selectedContactAddress(data.PersonAddressId);
                        $("#phone1TextBox").inputmask("(99) 9999-9999");
                        $("#phone2TextBox").inputmask("(99) 9999-9999");
                        $('#btnUpdatePersonContact').html('<i class="fa fa-check"></i>&nbsp; Atualizar Contato');
                        $('#btnRemovePersonContact').show();
                        //if ($('#collapseContact.in').length === 0) {
                        //    $('#collapseContact').collapse('toggle');
                        //}
                        if (!$('#collapseContact').hasClass('in')) {
                            $('#collapseContact').addClass('in')
                        }
                        $.scrollTo($('#collapseContact'), 1000, { easing: 'swing' });
                    });
                    return false;
                };

                $('#btnUpdatePersonContact').click(function(e) {
                    e.preventDefault();
                    $('#personContacts').wrap('<form id="temp_form_id" />');
                    if (!my.validator.validate('#temp_form_id')) {
                        $.pnotify({
                            title: 'Aten&#231;&#227;o!',
                            text: 'Favor preenchar todos os campos obrigat&#243;rios.',
                            type: 'warning',
                            icon: 'fa fa-warning fa-lg',
                            addclass: "stack-bottomright",
                            stack: my.stack_bottomright
                        });
                        $('#personContacts').unwrap();
                    } else {

                        var $this = $(this);
                        $this.button('loading');

                        var params = {
                            PersonContactId: my.vm.personContactId(),
                            PersonId: my.personId,
                            ContactName: $('#contactNameTextBox').val().trim(),
                            DateBirth: $('#bDayTextBox').val().length > 0 ? moment($('#bDayTextBox').data('kendoDatePicker').value()).format() : moment(new Date('01/01/1900')).format(),
                            Dept: $('#deptTextBox').val().trim(),
                            ContactEmail1: $('#email1NameTextBox').val().trim(),
                            ContactEmail2: $('#email2NameTextBox').val().trim(),
                            ContactPhone1: $('#phone1TextBox').val().replace(/\D/g, ''),
                            ContactPhone2: $('#phone2TextBox').val().replace(/\D/g, ''),
                            PhoneExt1: $('#phone1ExtTextBox').val().replace(/\D/g, ''),
                            PhoneExt2: $('#phone2ExtTextBox').val().replace(/\D/g, ''),
                            Comments: $('#commentsContactTextArea').val(),
                            PersonAddressId: my.vm.selectedContactAddress(),
                            CreatedByUser: userID,
                            CreatedOnDate: moment().format()
                        };

                        $.ajax({
                            type: 'POST',
                            url: '/desktopmodules/riw/api/people/updatePersonContact',
                            data: params
                        }).done(function(data) {
                            if (data.Result.indexOf("success") !== -1) {
                                my.vm.personContactId(0);
                                my.personContactsData.read();
                                $('#personContacts input').val('');
                                $('#btnRemovePersonContact').hide();
                                $('#btnUpdatePersonContact').html('<i class="icon-plus icon-white"></i>&nbsp; Adicionar Contato').attr({ 'disabled': false });
                                //$().toastmessage('showSuccessToast', 'Contato gravado com sucesso.');
                                $.pnotify({
                                    title: 'Sucesso!',
                                    text: 'Contato salvo.',
                                    type: 'success',
                                    icon: 'fa fa-check fa-lg',
                                    addclass: "stack-bottomright",
                                    stack: my.stack_bottomright
                                });
                                //$('#lvPersonContacts').data('kendoListView').dataSource.add({ ContactName: my.vm.displayName(), PersonContactId: '0', ContactPhone1: my.vm.telephone(), ContactEmail1: my.vm.email(), ContactEmail2: null, PhoneExt1: null, ContactPhone2: null, PhoneExt2: null, Dept: null, DateBirth: null, AddressName: null, Comments: null });
                                $('#collapseContact').addClass('toggle');
                                $.scrollTo($('#personContacts'), 1000, { easing: 'swing' });
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
                        }).fail(function(jqXHR, textStatus) {
                            console.log(jqXHR.responseText);
                        }).always(function() {
                            $this.button('reset');
                        });
                    }
                });

                $('#btnRemovePersonContact').click(function(e) {
                    if (e.clientX === 0) {
                        return false;
                    }
                    e.preventDefault();

                    var $this = $(this);

                    var $dialog = $('<div></div>')
                        .html('<div class="confirmDialog">Tem Certeza?</div>')
                        .dialog({
                            autoOpen: false,
                            modal: true,
                            resizable: false,
                            dialogClass: 'dnnFormPopup',
                            open: function() {
                                $(".ui-dialog-title").append('Aviso de Exclus&#227;o');
                            },
                            buttons: {
                                'ok': {
                                    text: 'Sim',
                                    //priority: 'primary',
                                    "class": 'dnnPrimaryAction',
                                    click: function() {
                                        if (my.vm.personContactId() !== 0) {
                                            $this.button('loading');

                                            $dialog.dialog('close');
                                            $dialog.dialog('destroy');

                                            $.ajax({
                                                type: 'DELETE',
                                                url: '/desktopmodules/riw/api/people/RemovePersonContact?personContactId=' + my.vm.personContactId() + '&personId=' + my.personId
                                            }).done(function(data) {
                                                if (data.Result.indexOf("success") !== -1) {
                                                    my.vm.personContactId(0);
                                                    my.personContactsData.read();
                                                    $('#btnUpdatePersonContact').html('<i class="icon-plus icon-white"></i>&nbsp; Adicionar Contato').attr({ 'disabled': false });
                                                    $('#personContacts input').val('');
                                                    $('#btnRemovePersonContact').hide();
                                                    my.vm.selectedContactAddress(0);
                                                    //$().toastmessage('showSuccessToast', 'Contato excluido com sucesso.');
                                                    $.pnotify({
                                                        title: 'Sucesso!',
                                                        text: 'Contato excluido.',
                                                        type: 'success',
                                                        icon: 'fa fa-check fa-lg',
                                                        addclass: "stack-bottomright",
                                                        stack: my.stack_bottomright
                                                    });
                                                    $('#collapseContact').addClass('toggle');
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
                                            }).fail(function(jqXHR, textStatus) {
                                                console.log(jqXHR.responseText);
                                            }).always(function() {
                                                $this.button('reset');
                                            });
                                        }
                                    }
                                },
                                'cancel': {
                                    html: 'N&#227;o',
                                    //priority: 'secondary',
                                    "class": 'dnnSecondaryAction',
                                    click: function() {
                                        $dialog.dialog('close');
                                        $dialog.dialog('destroy');
                                    }
                                }
                            }
                        });

                    $dialog.dialog('open');
                });

                $('#btnCancelContact').click(function(e) {
                    if (e.clientX === 0) {
                        return false;
                    }
                    e.preventDefault();

                    $('#collapseContact').collapse('toggle');
                    $('#btnUpdatePersonContact').html('<i class="icon-plus icon-white"></i>&nbsp; Adicionar Contato').attr({ 'disabled': false });
                    $('#personContacts input').val('');
                    $('#btnRemovePersonContact').hide();
                    my.vm.personContactId(null);
                    my.vm.selectedContactAddress(null);
                });

                $('#personContacts').delay(100).show();

                break;
            case 4: // Person Docs

                my.personDocsTransport = {
                    read: {
                        url: '/desktopmodules/riw/api/people/GetPersonDocs?personId=' + my.personId
                    }
                };

                my.personDocsData = new kendo.data.DataSource({
                    transport: my.personDocsTransport,
                    sort: { field: "DocName", dir: "ASC" },
                    schema: {
                        model: {
                            id: 'PersonDocsId',
                            fields: {
                                //DateBirth: { field: "DateBirth", type: "date", format: "{0:m}" }
                            }
                        }
                    }
                });

                my.createDocsLV = function() {
                    $("#lvPersonDocs").kendoListView({
                        dataSource: my.personDocsData,
                        template: kendo.template($("#tmplPersonDocs").html()),
                        change: function() {
                            var row = this.select();
                            var id = row.data("uid");
                            my.uId = id;
                        },
                        dataBound: function() {
                            //$('.photo').colorbox();
                            //$('.nailthumb-container').nailthumb({ width: 120, height: 120 });
                            //if (this.dataSource.total() === 0) $('#docsFormSectionHeader').hide();
                            if (this.dataSource.view().length === 0) $('#collapseDocument').addClass('in');
                        }
                    });
                };

                my.createDocsLV();

                $('#files').kendoUpload({
                    async: {
                        saveUrl: '/desktopmodules/riw/api/people/PostFile',
                        removeUrl: "remove",
                        autoUpload: false
                    },
                    multiple: false,
                    //showFileList: false,
                    localization: {
                        cancel: 'Cancelar',
                        dropFilesHere: 'Arraste o arquivo aqui para envia-lo',
                        remove: 'Remover',
                        select: 'Selecionar Arquivo',
                        statusUploading: 'Enviando Arquivo',
                        uploadSelectedFiles: 'Enviar',
                        headerStatusUploaded: 'Completo',
                        //headerStatusUploading: "customHeaderStatusUploading",
                        retry: "Tente Novamente",
                        statusFailed: "Falha no Envio",
                        statusUploaded: "statusUploaded"
                    },
                    select: function(e) {
                        if ($('#docNameTextBox').val().length === 0) {
                            e.preventDefault();
                            $('#docNameTextBox').focus();
                            //$().toastmessage('showErrorToast', 'Favor inserir o nome do documento.');
                            $.pnotify({
                                title: 'Erro!',
                                text: 'Favor inserir o nome do documento',
                                type: 'error',
                                icon: 'fa fa-times-circle fa-lg',
                                addclass: "stack-bottomright",
                                stack: my.stack_bottomright
                            });
                        }
                        $.each(e.files, function(index, value) {
                            if (value.extension.toUpperCase() !== '.JPG' && value.extension.toUpperCase() !== '.PNG' && value.extension.toUpperCase() !== '.ZIP' && value.extension.toUpperCase() !== '.DOC' && value.extension.toUpperCase() !== '.DOCX' && value.extension.toUpperCase() !== '.PDF') {
                                e.preventDefault();
                                //$().toastmessage('showErrorToast', '&#201; permitido enviar somente arquivos com formato jpg, png, zip, doc, docx e pdf.');
                                $.pnotify({
                                    title: 'Erro!',
                                    text: '&#201; permitido enviar somente arquivos com formato jpg, png, zip, doc, docx e pdf.',
                                    type: 'error',
                                    icon: 'fa fa-times-circle fa-lg',
                                    addclass: "stack-bottomright",
                                    stack: my.stack_bottomright
                                });
                            }
                            //$('.k-upload-button').hide();
                            //var fileSize = 0;
                            //if (value.size > 1024 * 1024)
                            //    fileSize = (Math.round(value.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
                            //else
                            //    fileSize = (Math.round(value.size * 100 / 1024) / 100).toString() + 'KB';

                            //document.getElementById('fileName').innerHTML = 'Arquivo: ' + value.name;
                            //document.getElementById('fileSize').innerHTML = 'Tamanho: ' + fileSize;
                            //document.getElementById('fileType').innerHTML = 'Tipo: ' + value.rawFile.type;
                        });
                        setTimeout(function() {
                            $('.k-upload').css({ 'max-width': '80%' }); // ($('.k-filename').width() * 2) });
                        });
                    },
                    upload: function(e) {
                        e.data = {
                            PortalId: portalID,
                            PersonId: my.personId,
                            DocName: $('#docNameTextBox').val(),
                            DocDesc: $('#docDescTextArea').val(),
                            DocUrl: '',
                            //MaxWidth: 0,
                            //MaxHeight: 0,
                            FolderPath: 'Docs/' + my.personId,
                            CreatedByUser: userID,
                            CreatedOnDate: moment().format()
                        };
                    },
                    success: function(e) {
                        my.personDocsData.read();
                        $('#personDocuments input').val('');
                        $('#personDocuments textarea').val('');
                        $('.k-upload-files').remove();
                        //$().toastmessage('showSuccessToast', 'Arquivo enviado com sucesso.');
                        $.pnotify({
                            title: 'Sucesso!',
                            text: 'Arquivo enviado.',
                            type: 'success',
                            icon: 'fa fa-check fa-lg',
                            addclass: "stack-bottomright",
                            stack: my.stack_bottomright
                        });
                        $('#docNameTextBox').focus();
                    },
                    remove: function(e) {
                        //$('.k-upload-button').show();
                    },
                    error: function(e) {
                        $.pnotify({
                            title: 'Erro!',
                            text: 'N&#227;o foi poss&#237;vel o envio do arquivo.',
                            type: 'error',
                            icon: 'fa fa-times-circle fa-lg',
                            addclass: "stack-bottomright",
                            stack: my.stack_bottomright
                        });
                        //$().toastmessage('showErrorToast', 'N&#227;o foi possível o envio do arquivo.');
                    }
                });

                my.removeClientDoc = function(value) {
                    var $dialog = $('<div></div>')
                        .html('<div class="confirmDialog">Tem Certeza?</div>')
                        .dialog({
                            autoOpen: false,
                            modal: true,
                            resizable: false,
                            dialogClass: 'dnnFormPopup',
                            open: function() {
                                $(".ui-dialog-title").append('Aviso de Exclus&#227;o');
                            },
                            buttons: {
                                'ok': {
                                    text: 'Sim',
                                    //priority: 'primary',
                                    "class": 'dnnPrimaryAction',
                                    click: function() {
                                        $.ajax({
                                            type: 'DELETE',
                                            url: '/desktopmodules/riw/api/people/RemovePersonDoc?personDocId=' + value + '&personId=' + my.personId
                                        }).done(function(data) {
                                            if (data.Result.indexOf("success") !== -1) {
                                                //my.vm.personContactId(0);
                                                my.personDocsData.read();
                                                //$().toastmessage('showSuccessToast', 'Documento excluido com sucesso.');
                                                $.pnotify({
                                                    title: 'Sucesso!',
                                                    text: 'Documento excluido.',
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
                                                //$().toastmessage('showErrorToast', data.Msg);
                                            }
                                        }).fail(function(jqXHR, textStatus) {
                                            console.log(jqXHR.responseText);
                                        });

                                        $dialog.dialog('close');
                                        $dialog.dialog('destroy');
                                    }
                                },
                                'cancel': {
                                    html: 'N&#227;o',
                                    //priority: 'secondary',
                                    "class": 'dnnSecondaryAction',
                                    click: function() {
                                        $dialog.dialog('close');
                                        $dialog.dialog('destroy');
                                    }
                                }
                            }
                        });

                    $dialog.dialog('open');
                };

                $('#personDocuments').delay(100).show();

                setTimeout(function() {
                    $('#docNameTextBox').focus();
                });

                break;
            case 5: // Edit Login

                $.ajax({
                    url: '/desktopmodules/riw/api/people/GetUser?portalId=' + portalID + '&userId=' + my.vm.personUserId()
                }).done(function(data) {
                    $.each(data, function(i, userInfo) {
                        var _date = kendo.parseDate(userInfo.LastPasswordChangeDate);
                        $('#lastPasswordChangedDate').text(kendo.toString(_date, 'F')).css({ 'text-transform': 'capitalize' });
                        $('#loginTextBox').val(userInfo.UserName);
                        //my.vm.username(data.Username);
                        my.vm.originalUsername(userInfo.UserName);
                    });
                });

                $('#btnUpdateLogin').click(function(e) {
                    if (e.clientX === 0) {
                        return false;
                    }
                    e.preventDefault();

                    var $this = $(this);
                    $this.button('loading');

                    var params = {
                        // portalId As Integer, ByVal personId As Integer, ByVal cUId As Integer, ByVal newUsername As String, ByVal subject As String, ByVal body As String, ByVal mUId As Integer, ByVal md
                        PortalId: portalID,
                        PersonId: my.personId,
                        UserId: my.vm.personUserId(),
                        Email: $('#loginTextBox').val(),
                        //oldUsername: my.vm.originalUsername(),
                        Subject: my.vm.passwordSubject(),
                        MessageBody: my.vm.passwordBody(),
                        ModifiedByUser: userID,
                        ModifiedOnDate: moment().format()
                    };
                    $.ajax({
                        type: 'PUT',
                        url: '/desktopmodules/riw/api/people/updatePersonUserLogin',
                        data: params
                    }).done(function(data) {
                        if (data.Result.indexOf("success") !== -1) {
                            $('#usernameCheck').html('');
                            //$('#btnUpdateLogin').html('Alterar Login').attr({ 'disabled': true });
                            //$().toastmessage('showSuccessToast', 'Login alterado com sucesso.');
                            $.pnotify({
                                title: 'Sucesso!',
                                text: 'Login alterado.',
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
                            //$().toastmessage('showErrorToast', data.Msg);
                        }
                    }).fail(function(jqXHR, textStatus) {
                        console.log(jqXHR.responseText);
                    }).always(function() {
                        $this.button('reset');
                    });

                });

                //$('#newPasswordTextBox').keyup(function () {
                //    $('#passMetter').text(my.checkPassStrength($(this).val()));
                //});

                $('#confirmPasswordTextBox').on('keyup', function(e) {

                    if ($('#newPasswordTextBox').val() != $('#confirmPasswordTextBox').val()) {
                        $('#passConfirm').removeClass().addClass('alert alert-error').html('Senhas N&#227;o Coincidem!');
                    } else {
                        $('#passConfirm').removeClass().addClass('alert alert-success').html('Senhas Coincidem!');
                    }

                    return false;

                });

                $('#newPasswordTextBox').on('keyup', function(e) {

                    if ($('#newPasswordTextBox').val() == '') {
                        $('#passMetter').removeClass().html('');

                        return false;
                    }

                    // Must have capital letter, numbers and lowercase letters
                    var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");

                    // Must have either capitals and lowercase letters or lowercase and numbers
                    var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");

                    // Must be at least 6 characters long
                    var okRegex = new RegExp("(?=.{7,}).*", "g");

                    if (okRegex.test($(this).val()) === false) {
                        // If ok regex doesn't match the password
                        $('#passMetter').removeClass().addClass('alert alert-error').html('Senha deve cont&#234;r no m&#237;nimo 7 caracteres.');

                    } else if (strongRegex.test($(this).val())) {
                        // If reg ex matches strong password
                        $('#passMetter').removeClass().addClass('alert alert-success').html('Boa Senha!');
                    } else if (mediumRegex.test($(this).val())) {
                        // If medium password matches the reg ex
                        $('#passMetter').removeClass().addClass('alert alert-info').html('Senha Ok! Mas sugerimos incluir letras mai&#250;sculas e min&#250sculas, n&#250;meros e pontua&#231;&#245;es!');
                    } else {
                        // If password is ok
                        $('#passMetter').removeClass().addClass('alert alert-warning').html('Senha Ok! Recomendamos incluir letras mai&#250;sculas e min&#250;sculas, n&#250;meros e pontua&#231;&#245;es.');
                    }

                    return true;
                });

                $('#btnUpdatePassword').click(function(e) {
                    if (e.clientX === 0) {
                        return false;
                    }
                    e.preventDefault();

                    var $this = $(this);

                    $('#editLogin').wrap('<form id="temp_form_id" />');
                    if (!my.validator.validate('#temp_form_id')) {
                        $.pnotify({
                            title: 'Aten&#231;&#227;o!',
                            text: 'Favor preenchar todos os campos obrigat&#243;rios.',
                            type: 'warning',
                            icon: 'fa fa-warning fa-lg',
                            addclass: "stack-bottomright",
                            stack: my.stack_bottomright
                        });
                        $('#editLogin').unwrap();
                    } else {
                        $('#editLogin').unwrap();

                        $this.button('loading');

                        var params = {
                            PortalId: portalID,
                            UserId: my.vm.personUserId(),
                            CurrentPassword: $('#currentPasswordTextBox').val().length > 0 ? $('#currentPasswordTextBox').val() : '',
                            NewPassword: $('#newPasswordTextBox').val(),
                            Subject: my.vm.passwordSubject(),
                            MessageBody: my.vm.passwordBody()
                        };
                        $.ajax({
                            type: 'PUT',
                            url: '/desktopmodules/riw/api/people/updateUserPassword',
                            data: params
                        }).done(function(data) {
                            if (data.Result.indexOf("success") !== -1) {
                                //$('#btnUpdatePassword').attr({ 'disabled': true });
                                $('#editLogin input').val('');
                                $('#passMetter').text('');
                                $('#passConfirm').text('');
                                //$().toastmessage('showSuccessToast', 'Senha alterada com sucesso.');
                                $.pnotify({
                                    title: 'Sucesso!',
                                    text: 'Senha alterada.',
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
                                //$().toastmessage('showErrorToast', data.Msg);
                            }
                        }).fail(function(jqXHR, textStatus) {
                            console.log(jqXHR.responseText);
                        }).always(function() {
                            $this.button('reset');
                        });
                    }
                });

                $('#btnRandomPassword').click(function(e) {
                    if (e.clientX === 0) {
                        return false;
                    }
                    e.preventDefault();

                    var $this = $(this);

                    var params = {
                        PortalId: portalID,
                        UserId: my.vm.personUserId(),
                        Subject: my.vm.passwordSubject(),
                        MessageBody: my.vm.passwordBody()
                    };

                    var $dialog = $('<div></div>')
                        .html('<div class="confirmDialog">Tem Certeza? Uma nova senha ser&#225; gerada e enviada para o email cadastrado!</div>')
                        .dialog({
                            autoOpen: false,
                            modal: true,
                            resizable: false,
                            dialogClass: 'dnnFormPopup',
                            open: function() {
                                $(".ui-dialog-title").append('Aviso de Exclus&#227;o');
                            },
                            buttons: {
                                'ok': {
                                    text: 'Sim',
                                    //priority: 'primary',
                                    "class": 'dnnPrimaryAction',
                                    click: function() {

                                        $this.button('loading');

                                        $.ajax({
                                            type: 'PUT',
                                            url: '/desktopmodules/riw/api/people/generateUserPassword',
                                            data: params
                                        }).done(function(data) {
                                            if (data.Result.indexOf("success") !== -1) {
                                                //$().toastmessage('showSuccessToast', 'Uma nova senha gerada e enviada com sucesso.');
                                                $.pnotify({
                                                    title: 'Sucesso!',
                                                    text: 'Uma nova senha gerada e trnasmitida para o email cadastrado.',
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
                                                //$().toastmessage('showErrorToast', data.Msg);
                                            }
                                        }).fail(function(jqXHR, textStatus) {
                                            console.log(jqXHR.responseText);
                                        }).always(function() {
                                            $this.button('reset');
                                        });

                                        $dialog.dialog('close');
                                        $dialog.dialog('destroy');
                                    }
                                },
                                'cancel': {
                                    html: 'N&#227;o',
                                    //priority: 'secondary',
                                    "class": 'dnnSecondaryAction',
                                    click: function() {
                                        $dialog.dialog('close');
                                        $dialog.dialog('destroy');
                                    }
                                }
                            }
                        });

                    $dialog.dialog('open');
                });

                $('#btnCheckLogin').click(function(e) {
                    if (e.clientX === 0) {
                        return false;
                    }
                    e.preventDefault();

                    var $this = $(this);
                    $this.button('loading');

                    if ($('#loginTextBox').val() !== my.vm.originalUsername()) {
                        if ($('#loginTextBox').val() !== '') {
                            if (my.isValidEmailAddress($('#loginTextBox').val())) {
                                if (my.checkPersonEmail($('#loginTextBox').val())) {
                                    $('#usernameCheck').html('<span class="NormalRed"><i title="Email existente!" class="fa fa-times-circle fa-lg" /> Email existente!</span>');
                                    $('#btnUpdateLogin').attr({ 'disabled': true });
                                } else {
                                    $('#usernameCheck').html('<span class="NormalRed"><i title="Este email pode ser usado como login!" class="fa fa-check fa-lg" /> Este email pode ser usado como login!</span>');
                                    $('#btnUpdateLogin').attr({ 'disabled': false });
                                }
                            } else {
                                $('#usernameCheck').html('<span class="NormalRed"><i title="Email existente!" class="fa fa-times-circle fa-lg" /> Email com formato inv&#225;lido!</span>');
                                $('#btnUpdateLogin').attr({ 'disabled': true });
                                setTimeout(function() {
                                    $('#usernameCheck').html('');
                                }, 3000);
                            }
                        } else {
                            $('#usernameCheck').html('<span class="NormalRed"><i title="Email existente!" class="fa fa-times-circle fa-lg" /> Email com formato inv&#225;lido!</span>');
                            $('#btnUpdateLogin').attr({ 'disabled': true });
                            setTimeout(function() {
                                $('#usernameCheck').html('');
                            }, 3000);
                        }
                    } else {
                        $('#usernameCheck').html('<span class="NormalRed"><i title="Email existente!" class="fa fa-times-circle fa-lg" /> Email existente!</span>');
                        $('#btnUpdateLogin').attr({ 'disabled': true });
                        setTimeout(function() {
                            $('#usernameCheck').html('');
                        }, 3000);
                    }

                    $this.button('reset');

                });

                $('#editLogin').delay(100).show();

                break;
            case 6:

                //if (my.personId === 1) {
                //    $('#btnUpdateLogin').hide();
                //    $('#btnUpdatePassword').hide();
                //    $('#btnRandomPassword').hide();
                //}

                $('#userPhoto .pull-left').css({ 'width': '50%' });
                $('#userPhoto .pull-right').css({ 'width': '50%' });

                $('#photos').kendoUpload({
                    async: {
                        saveUrl: "/desktopmodules/riw/api/people/SaveUserPhoto",
                        removeUrl: "remove",
                        multiple: false
                    },
                    //showFileList: false,
                    localization: {
                        cancel: 'Cancelar',
                        dropFilesHere: 'Arraste o arquivo aqui para envia-lo',
                        remove: 'Remover',
                        select: 'Selecionar',
                        statusUploading: 'Enviando Arquivo',
                        uploadSelectedFiles: 'Enviar',
                        headerStatusUploaded: 'Completo',
                        //headerStatusUploading: "customHeaderStatusUploading",
                        retry: "Tente Novamente",
                        statusFailed: "Falha no Envio",
                        statusUploaded: "statusUploaded"
                    },
                    select: function(e) {
                        $.each(e.files, function(index, value) {
                            if (value.extension.toUpperCase() !== '.JPG' && value.extension.toUpperCase() !== '.PNG') {
                                e.preventDefault();
                                //$().toastmessage('showWarningToast', 'É permitido enviar somente arquivos com formato jpg e png.');
                                $.pnotify({
                                    title: 'Aten&#231;&#227;o!',
                                    text: '&#201; permitido enviar somente arquivos com formato jpg e png.',
                                    type: 'erro',
                                    icon: 'fa fa-times-circle fa-lg',
                                    addclass: "stack-bottomright",
                                    stack: my.stack_bottomright
                                });
                            }
                        });
                    },
                    upload: function(e) {
                        e.data = {
                            PortalId: portalID,
                            UserId: my.vm.personUserId()
                                //maxWidth: 0,
                                //maxHeight: 0
                        };
                    },
                    success: function(e) {
                        $('#btnRemoveAvatar').off('click');
                        $.each(e.files, function(index, value) {
                            my.vm.userAvatar(e.response.fileName);
                            $('#aImg').html('<img alt="" src="/portals/' + portalID + '/' + e.response.filePath + '?maxwidth=120" />');
                            $('#btnRemoveAvatar').html('&times; Remover');
                            $(".k-widget.k-upload").hide();
                            //$().toastmessage('showSuccessToast', 'Arquivo enviado com sucesso.');
                            $.pnotify({
                                title: 'Sucesso!',
                                text: 'Arquivo enviado.',
                                type: 'sucesso',
                                icon: 'fa fa-check fa-lg',
                                addclass: "stack-bottomright",
                                stack: my.stack_bottomright
                            });
                            $(".k-widget.k-upload").find("ul").remove();
                        });
                    },
                    remove: function(e) {},
                    error: function(e) {
                        //$().toastmessage('showErrorToast', 'N&#227;o foi possível o envio do arquivo.');
                        $.pnotify({
                            title: 'Erro!',
                            text: 'N&#227;o foi poss&#237;vel o envio do arquivo.',
                            type: 'error',
                            icon: 'fa fa-times-circle fa-lg',
                            addclass: "stack-bottomright",
                            stack: my.stack_bottomright
                        });
                    }
                });

                $.ajax({
                    async: false,
                    url: '/desktopmodules/riw/api/people/GetUserPhoto?portalId=' + portalID + '&userId=' + my.vm.personUserId()
                }).done(function(data) {
                    if (data.Result.indexOf("success") !== -1) {
                        // $('#files').data('kendoUpload').disabled();
                        $(".k-widget.k-upload").hide();
                        my.vm.userAvatar(data.fileName);
                        var photoUrl = ('/portals/' + portalID + '/' + data.filePath).trim();
                        $('#aImg').html('<img alt="" src="' + photoUrl + '?maxwidth=100" />');
                        $('#btnRemoveAvatar').html('&times; Remover');
                    } else {
                        $('#btnRemoveAvatar').html('');
                    }
                });

                $('#btnRemoveAvatar').click(function(e) {
                    if (e.clientX === 0) {
                        return false;
                    }
                    e.preventDefault();

                    var $this = $(this);

                    var params = {
                        portalId: portalID,
                        userId: my.vm.personUserId(),
                        fileName: my.vm.userAvatar()
                    };

                    var $dialog = $('<div></div>')
                        .html('<div class="confirmDialog">Tem Certeza?</div>')
                        .dialog({
                            autoOpen: false,
                            modal: true,
                            resizable: false,
                            dialogClass: 'dnnFormPopup',
                            open: function() {
                                $(".ui-dialog-title").append('Aviso de Exclus&#227;o');
                            },
                            buttons: {
                                'ok': {
                                    text: 'Sim',
                                    //priority: 'primary',
                                    "class": 'dnnPrimaryAction',
                                    click: function() {

                                        $this.button('loading');

                                        $.ajax({
                                            type: 'PUT',
                                            url: '/desktopmodules/riw/api/people/RemoveUserPhoto',
                                            data: params
                                        }).done(function(data) {
                                            if (data.Result.indexOf("success") !== -1) {
                                                $('#aImg').html('');
                                                //$('#files').data('kendoUpload').enable();
                                                $(".k-widget.k-upload").show();
                                                $('#btnRemoveAvatar').html('');
                                                //$().toastmessage('showSuccessToast', 'Arquivo excluido com sucesso.');
                                                $.pnotify({
                                                    title: 'Sucesso!',
                                                    text: 'Arquivo excluido.',
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
                                                //$().toastmessage('showErrorToast', data.Msg);
                                            }
                                        }).fail(function(jqXHR, textStatus) {
                                            console.log(jqXHR.responseText);
                                        }).always(function() {
                                            $this.button('reset');
                                        });

                                        $dialog.dialog('close');
                                        $dialog.dialog('destroy');
                                    }
                                },
                                'cancel': {
                                    html: 'N&#227;o',
                                    //priority: 'secondary',
                                    "class": 'dnnSecondaryAction',
                                    click: function() {
                                        $dialog.dialog('close');
                                        $dialog.dialog('destroy');
                                    }
                                }
                            }
                        });

                    $dialog.dialog('open');
                });

                $('#userPhoto').delay(100).show();

                break;
            default:

                $('#radioPerson').click(function(e) {
                    my.setPerson();
                });

                $('#radioBusiness').click(function(e) {
                    my.setPerson();
                });

                $('#emailTextBox').on('paste', function() {
                    $('#btnCheckEmail').show();
                });

                $('#emailTextBox').keyup(function() {
                    if (this.value.length) {
                        $('#btnCheckEmail').show();
                        $('#btnUpdatePerson').attr({ 'disabled': true, 'title': 'Desativado' });
                    } else {
                        $('#btnCheckEmail').hide();
                        $('#btnUpdatePerson').attr({ 'disabled': false, 'title': 'Clique para adicionar um novo cadastro' });
                        $('#btnCheckEmail').button('reset');
                    }
                });

                $('#btnCheckEmail').click(function(e) {
                    if (e.clientX === 0) {
                        return false;
                    }
                    e.preventDefault();

                    var $this = $(this);
                    $this.button('loading');

                    if (my.vm.email() !== my.vm.originalEmail()) {
                        if (my.vm.email() !== '' && my.isValidEmailAddress(my.vm.email())) {
                            if (my.checkPersonEmail($('#emailTextBox').val())) {
                                $('#btnCheckEmail').attr({ 'disabled': false });
                                $('#btnUpdatePerson').attr({ 'disabled': true, 'title': 'Desativado' });
                                $.dnnAlert({
                                    title: 'Aviso',
                                    okText: 'Ok',
                                    text: 'Email existente! Insira um novo endere&#231;o de email ou n&#227;o insira email algum.'
                                });
                                $('#btnCheckEmail').html('<i class="fa fa-check"></i>').attr({ 'title': 'Verificar!' }).fadeIn(1000);
                            } else {
                                $('#btnCheckEmail').html('<img alt="Ok" src="/images/success-icn.png" style="vertical-align: middle;" />').attr({ 'title': 'Email pode ser validado!' }).attr({ 'disabled': false });
                                $('#btnUpdatePerson').attr({ 'disabled': false, 'title': 'Clique para adicionar um novo cadastro' });
                                my.vm.reqEmail(true);
                            }
                        } else {
                            //if (self.clientId() > 0)
                            //    $('#emailTextBox').attr({ 'class': 'required', 'required': true });
                            //$('#emailCheck').html('');
                            $('#btnCheckEmail').attr({ 'disabled': false }).hide();
                            $('#btnUpdatePerson').attr({ 'disabled': false, 'title': '' });
                        }
                    } else {
                        //$('#emailCheck').html('');
                        $('#btnCheckEmail').attr({ 'disabled': false }).hide();
                        $('#btnUpdatePerson').attr({ 'disabled': false, 'title': '' });
                    }
                });

                $('#btnUpdatePerson').click(function(e) {
                    e.preventDefault();
                    $('#personForm').wrap('<form id="temp_form_id" />');
                    if (!my.validator.validate('#temp_form_id')) {
                        $.pnotify({
                            title: 'Aten&#231;&#227;o!',
                            text: 'Favor preenchar todos os campos obrigat&#243;rios.',
                            type: 'warning',
                            icon: 'fa fa-warning fa-lg',
                            addclass: "stack-bottomright",
                            stack: my.stack_bottomright
                        });
                        $('#personForm').unwrap();
                    } else {
                        //if (my.vm.selectedType().length > 0) {
                        var $this = $(this);
                        $this.button('loading');

                        var params = {
                            PersonId: my.personId,
                            PortalId: portalID,
                            PersonType: $('#radioPerson').is(':checked'),
                            CompanyName: my.vm.companyName().trim(),
                            FirstName: my.vm.firstName().trim(),
                            LastName: my.vm.lastName().trim(),
                            DisplayName: my.vm.displayName(),
                            Telephone: my.vm.telephone().replace(/\D/g, ''),
                            Cell: my.vm.cell().replace(/\D/g, ''),
                            Fax: my.vm.fax().replace(/\D/g, ''),
                            Zero800s: my.vm.zero800().replace(/\D/g, ''),
                            Email: my.vm.email().trim(),
                            Website: my.vm.website().trim(),
                            RegisterTypes: $('#selectRegisterTypes').data('kendoMultiSelect').value().toString(), // JSON.stringify($("input[name='rTypes']:checked").getCheckboxVal()),
                            DateFounded: moment(new Date('01/01/1900 00:00:00')).format(),
                            DateRegistered: moment(new Date('01/01/1900 00:00:00')).format(),
                            EIN: my.vm.ein(),
                            CPF: my.vm.cpf(),
                            Ident: my.vm.ident().trim(),
                            StateTax: my.vm.stateTax().trim(),
                            CityTax: my.vm.cityTax().trim(),
                            Comments: my.vm.comments().trim(),
                            Biography: my.vm.bio().trim(),
                            SalesRep: my.vm.selectedSalesRepId(),
                            Industries: JSON.stringify(my.vm.selectedIndustries()),
                            PostalCode: my.vm.postalCode().replace(/\D/g, ''),
                            Street: my.vm.street().trim(),
                            Unit: my.vm.unit().trim(),
                            Complement: my.vm.complement().trim(),
                            District: my.vm.district().trim(),
                            City: my.vm.city().trim(),
                            Region: my.vm.selectedRegion(),
                            Country: my.vm.selectedCountry(),
                            Blocked: $('#chkBoxBlocked').prop('checked'),
                            ReasonBlocked: my.vm.reasonBlocked(),
                            CreateLogin: my.vm.personUserId() ? false : $('#enableLoginChk').prop(':checked'),
                            CreatedByUser: userID,
                            CreatedOnDate: moment().format(),
                            ModifiedByUser: userID,
                            ModifiedOnDate: moment().format(),
                            SyncEnabled: amplify.store.sessionStorage('syncEnabled').toLowerCase()
                        };

                        $.ajax({
                            type: 'POST',
                            url: '/desktopmodules/riw/api/people/updatePerson',
                            data: params
                        }).done(function(data) {
                            if (data.PersonId) {
                                my.personId = data.PersonId;
                                my.vm.personId(data.PersonId);
                                document.location.hash = 'personId/' + data.PersonId + '/sel/7/subSel/1';
                                $('#personMenu').show();
                                $('#personMenu').jqxMenu({
                                    width: '120',
                                    mode: 'vertical'
                                });
                                $('#actionsMenu ul li[id=7]').addClass('jqx-menu-item-selected');
                                $('#personMenu ul li[id=1]').addClass('jqx-menu-item-selected');
                                $('#editPerson .pull-left').css({ 'width': '14%' });
                                $('#editPerson .pull-right').css({ 'width': '86%' });
                                $('#personForm .pull-left').css({ 'width': '48%' });
                                $('#personForm .pull-right').css({ 'width': '52%' });
                                $('#btnAssist').show();
                                $('#btnFinance').show();
                                $('#btnHistory').show();
                                $('#actionsMenu').show();
                                //$('#btnDeletePerson').show();
                                //$('#btnRemovePerson').show();
                                $('#btnCheckEmail').hide();
                                //$('#liAddress').hide();

                                $this.html('<i class="fa fa-check"></i>&nbsp; Atualizar');
                                //$().toastmessage('showSuccessToast', 'Cadastro gravado com sucesso.');
                                $.pnotify({
                                    title: 'Sucesso!',
                                    text: 'Cadastro salvo.',
                                    type: 'success',
                                    icon: 'fa fa-check fa-lg',
                                    addclass: "stack-bottomright",
                                    stack: my.stack_bottomright
                                });

                                if (params.CreateLogin) {
                                    if (data.UserId) {
                                        my.vm.personUserId(data.UserId);
                                        $('#liEmail').hide();
                                        //$('#btnCheckEmail').hide();
                                        $('#5').show();
                                        $('#6').show();
                                        //$('#7').show();
                                        //$('#enableLoginChk').hide();
                                        //$('#spanCreateLogin').text('');
                                        $('#liLogin').hide();
                                        $.pnotify({
                                            title: 'Aten&#231;&#227;o',
                                            text: 'O campo de email agora se encontra em "Login".',
                                            type: 'info',
                                            icon: 'fa fa-info-circle fa-lg',
                                            addclass: "stack-bottomright",
                                            stack: my.stack_bottomright
                                        });
                                    } else {
                                        //$().toastmessage('showErrorToast', data.Result);
                                        $.pnotify({
                                            title: 'Erro!',
                                            text: data.Result,
                                            type: 'error',
                                            icon: 'fa fa-times-circle fa-lg',
                                            addclass: "stack-bottomright",
                                            stack: my.stack_bottomright
                                        });
                                        $('#5').hide();
                                        $('#6').hide();
                                        $('#enableLoginChk').attr({ 'checked': false });
                                    }
                                    //} else {
                                    //    $('#5').hide();
                                    //    $('#6').hide();
                                    //    $('#enableLoginChk').attr({ 'checked': false });
                                }

                                if (parent.$('#windowOR').data('kendoWindow')) {
                                    if (my.getTopParameterByName('estimateId') > 0) {
                                        var personParams = {
                                            PersonId: data.PersonId,
                                            EstimateId: my.getTopParameterByName('estimateId'),
                                            ModifiedByUser: userID,
                                            ModifiedOnDate: moment().format()
                                        };

                                        $.ajax({
                                            type: 'PUT',
                                            url: '/desktopmodules/riw/api/estimates/updateEstimateClient',
                                            data: personParams
                                        }).done(function(returnedData) {
                                            if (returnedData.Result.indexOf("success") !== -1) {
                                                window.top.location.hash = 'estimateId/' + my.getTopParameterByName('estimateId') + '/personId/' + data.PersonId;
                                                parent.my.loadClient();
                                                parent.$("#windowOR").data("kendoWindow").close();
                                            } else {
                                                $.pnotify({
                                                    title: 'Erro!',
                                                    text: data.Result,
                                                    type: 'error',
                                                    icon: 'fa fa-times-circle fa-lg',
                                                    addclass: "stack-bottomright",
                                                    stack: my.stack_bottomright
                                                });
                                            }
                                        }).fail(function(jqXHR, textStatus) {
                                            console.log(jqXHR.responseText);
                                        });
                                    } else {
                                        window.top.location.hash = 'personId/' + data.PersonId;
                                        parent.my.loadClient();
                                        parent.$("#windowOR").data("kendoWindow").close();
                                    }
                                }

                                if (parent.$('#window').data('kendoWindow')) {
                                    parent.$('#window').data('kendoWindow').title(data.DisplayName + ' (ID: ' + data.PersonId + ')');
                                }
                            }
                        }).fail(function(jqXHR, textStatus) {
                            console.log(jqXHR.responseText);
                        }).always(function() {
                            $this.button('reset');
                        });
                        //} else {
                        //    $.pnotify({
                        //        title: 'Aten&#231;&#227;o',
                        //        text: 'Favor escolher o tipo de entidade. Opera&#231;&#227;o n&#227;o concluida!',
                        //        type: 'warning',
                        //        icon: 'fa fa-info-circle fa-lg',
                        //        addclass: "stack-bottomright",
                        //        stack: my.stack_bottomright
                        //    });
                        //}
                    }
                });

                //$('#btnDeletePerson').dnnConfirm({
                //    text: '<p class="delete-message">Tem Certeza?</p>',
                //    title: 'Aviso',
                //    yesText: 'Sim',
                //    noText: 'Cancelar',
                //    isButton: true
                //});

                $('#btnDeletePerson').click(function(e) {
                    if (e.clientX === 0) {
                        return false;
                    }
                    e.preventDefault();

                    var $this = $(this);

                    var params = {
                        PersonId: my.personId,
                        PortalId: portalID,
                        UserId: my.vm.personUserId(),
                        ModifiedByUser: userID,
                        ModifiedOnDate: moment().format()
                    };

                    var $dialog = $('<div></div>')
                        .html('<div class="confirmDialog">Tem Certeza?</div>')
                        .dialog({
                            autoOpen: false,
                            modal: true,
                            resizable: false,
                            dialogClass: 'dnnFormPopup',
                            open: function() {
                                $(".ui-dialog-title").append('Aviso de Exclus&#227;o');
                            },
                            buttons: {
                                'ok': {
                                    text: 'Sim',
                                    //priority: 'primary',
                                    "class": 'dnnPrimaryAction',
                                    click: function() {

                                        $this.button('loading');

                                        $.ajax({
                                            type: 'PUT',
                                            url: '/desktopmodules/riw/api/people/DeletePerson',
                                            data: params
                                        }).done(function(data) {
                                            if (data.Result.indexOf("success") !== -1) {
                                                parent.my.peopleData.read();
                                                //$().toastmessage('showSuccessToast', 'Conta desativada com sucesso.');
                                                $.pnotify({
                                                    title: 'Sucesso!',
                                                    text: 'Conta desativada.',
                                                    type: 'success',
                                                    icon: 'fa fa-check fa-lg',
                                                    addclass: "stack-bottomright",
                                                    stack: my.stack_bottomright
                                                });
                                                //setTimeout(function () {
                                                //    $('.btnReturn').click();
                                                //}, 2000);
                                                if (parent.$('#window').data('kendoWindow')) {
                                                    parent.$('#window').data('kendoWindow').close();
                                                }
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
                                        }).fail(function(jqXHR, textStatus) {
                                            console.log(jqXHR.responseText);
                                        }).always(function() {
                                            $this.button('reset');
                                        });

                                        $dialog.dialog('close');
                                        $dialog.dialog('destroy');
                                    }
                                },
                                'cancel': {
                                    html: 'N&#227;o',
                                    //priority: 'secondary',
                                    "class": 'dnnSecondaryAction',
                                    click: function() {
                                        $dialog.dialog('close');
                                        $dialog.dialog('destroy');
                                    }
                                }
                            }
                        });

                    $dialog.dialog('open');
                });

                $('#btnRestorePerson').click(function(e) {
                    if (e.clientX === 0) {
                        return false;
                    }
                    e.preventDefault();

                    var $this = $(this);
                    $this.button('loading');

                    var params = {
                        PersonId: my.personId,
                        PortalId: portalID,
                        UserId: my.vm.personUserId(),
                        ModifiedByUser: userID,
                        ModifiedOnDate: moment().format()
                    };

                    $.ajax({
                        type: 'PUT',
                        url: '/desktopmodules/riw/api/people/RestorePerson',
                        data: params
                    }).done(function(data) {
                        if (data.Result.indexOf("success") !== -1) {
                            parent.my.peopleData.read();
                            $('#btnRestorePerson').hide();
                            $('#btnDeletePerson').show();
                            if (my.vm.locked) {
                                $('#btnDeletePerson').show();
                            } else {
                                if (authorized > 2) {
                                    $('#btnRemovePerson').show();
                                }
                            }
                            //$().toastmessage('showSuccessToast', 'Conta ativada com sucesso.');
                            $.pnotify({
                                title: 'Sucesso!',
                                text: 'Conta ativada.',
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
                            //$().toastmessage('showErrorToast', data.Msg);
                        }
                    }).fail(function(jqXHR, textStatus) {
                        console.log(jqXHR.responseText);
                    }).always(function() {
                        $this.button('reset');
                    });
                });

                $('#btnRemovePerson').click(function(e) {
                    if (e.clientX === 0) {
                        return false;
                    }
                    e.preventDefault();

                    var $this = $(this);

                    var $dialog = $('<div></div>')
                        .html('<div class="confirmDialog">Tem Certeza? Todas as informa&#231;&#245;es referente &#224; esta conta ser&#227;o excluidas. Esta a&#231;&#227;o n&#227;o poder&#225; ser revertida.</div>')
                        .dialog({
                            autoOpen: false,
                            modal: true,
                            resizable: false,
                            dialogClass: 'dnnFormPopup',
                            open: function() {
                                $(".ui-dialog-title").append('Aviso de Exclus&#227;o');
                            },
                            buttons: {
                                'ok': {
                                    text: 'Sim',
                                    //priority: 'primary',
                                    "class": 'dnnPrimaryAction',
                                    click: function() {

                                        $this.button('loading');

                                        $.ajax({
                                            type: 'DELETE',
                                            url: '/desktopmodules/riw/api/people/RemovePerson?personId=' + my.personId + '&portalId=' + portalID + '&userId=' + my.vm.personUserId()
                                        }).done(function(data) {
                                            if (data.Result.indexOf("success") !== -1) {
                                                parent.my.peopleData.read();
                                                //$().toastmessage('showSuccessToast', 'Conta excluida com sucesso.');
                                                $.pnotify({
                                                    title: 'Sucesso!',
                                                    text: 'Conta excluida.',
                                                    type: 'success',
                                                    icon: 'fa fa-check fa-lg',
                                                    addclass: "stack-bottomright",
                                                    stack: my.stack_bottomright
                                                });
                                                //setTimeout(function () {
                                                //    $('.btnReturn').click();
                                                //}, 2000);
                                                if (parent.$('#window').data('kendoWindow')) {
                                                    parent.$('#window').data('kendoWindow').close();
                                                }
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
                                        }).fail(function(jqXHR, textStatus) {
                                            console.log(jqXHR.responseText);
                                        }).always(function() {
                                            $this.button('reset');
                                        });

                                        $dialog.dialog('close');
                                        $dialog.dialog('destroy');
                                    }
                                },
                                'cancel': {
                                    html: 'N&#227;o',
                                    //priority: 'secondary',
                                    "class": 'dnnSecondaryAction',
                                    click: function() {
                                        $dialog.dialog('close');
                                        $dialog.dialog('destroy');
                                    }
                                }
                            }
                        });

                    $dialog.dialog('open');
                });

                my.vm.loadSaleReps();
                my.vm.loadCountries();
                my.vm.loadRegions();

                if (my.vm.askLastName()) {
                    $('#lastNameTextBox').show();
                    if (my.vm.reqLastName()) {
                        $('#lastNameTextBox').attr({ 'required': 'required', 'data-role': 'validate' });
                        $('label[for="lastNameTextBox"]').addClass('required');
                    }
                }
                if (my.vm.askTelephone()) {
                    $('#liPhone').show();
                    $('#liCell').show();
                    if (my.vm.reqTelephone()) {
                        $('#phoneTextBox').attr({ 'required': 'required', 'data-role': 'validate' });
                        $('label[for="phoneTextBox"]').addClass('required');
                    }
                }
                if (my.vm.askSSN()) {
                    $('#liCPF').show();
                    if (my.vm.reqSSN()) {
                        $('#cpfTextBox').attr({ 'required': 'required', 'data-role': 'validate' });
                        $('label[for="cpfTextBox"]').addClass('required');
                    }
                }
                if (my.vm.askIdent()) {
                    $('#liIdent').show();
                    if (my.vm.reqIdent()) {
                        $('#identTextBox').attr({ 'required': 'required', 'data-role': 'validate' });
                        $('label[for="identTextBox"]').addClass('required');
                    }
                }

                $("#postalCodeTextBox").inputmask("99-999-999");
                $("#phoneTextBox").inputmask("(99) 9999-9999");
                $("#cellTextBox").inputmask("(99) 9999-9999");
                $("#faxTextBox").inputmask("(99) 9999-9999");
                $("#cpfTextBox").inputmask("999.999.999-99");
                $("#einTextBox").inputmask("99.999.999/9999-99");
                //$("#ddlCountries").css('width', '200px');
                //$("#ddlRegions").css('width', '200px');
                //var ddlCountries = $('#ddlCountries').data('kendoDropDownList');
                //ddlCountries.wrapper.find(".k-dropdown-wrap").css({ 'width': '190px' });
                //ddlCountries.list.width(210);
                //var ddlRegions = $('#ddlRegions').data('kendoDropDownList');
                //ddlRegions.wrapper.find(".k-dropdown-wrap").css({ 'width': '190px' });
                //ddlRegions.list.width(210);
                $('#personForm .pull-left').css({ 'width': '48%' });
                $('#personForm .pull-right').css({ 'width': '52%' });
                //$('#addressNameTextBox').attr({ 'required': false });
                //$('#contactNameTextBox').attr({ 'required': false });

                $('#personForm').show();
                $('#firstNameTextBox').focus();
        }
    };

    my.setPerson = function() {
        if ($('#radioPerson').is(':checked')) {
            $('#liIndustries').fadeOut();
            $('#liCompanyName').fadeOut();
            $('#liFax').fadeOut();
            $('#liEIN').fadeOut();
            $('#liST').fadeOut();
            $('#liCT').fadeOut();
            $('#liZero0800').fadeOut();
            $('#liWebsite').fadeOut();
            if (my.vm.askLastName()) $('#lastNameTextBox').fadeIn();
            if (my.vm.reqLastName() && my.vm.askLastName()) $('#lastNameTextBox').fadeIn();
            if (my.vm.askTelephone()) {
                $('#liPhone').fadeIn();
                $('#liCell').fadeIn();
                if (my.vm.reqTelephone()) {
                    $('#phoneTextBox').attr({ 'required': 'required', 'data-role': 'validate' });
                    $('label[for="phoneTextBox"]').addClass('required');
                }
            }
            if (my.vm.askSSN()) $('#liCPF').fadeIn();
            if (my.vm.reqSSN() && my.vm.askSSN()) $('#cpfTextBox').attr({ 'required': 'required', 'data-role': 'validate' });
            if (my.vm.askIdent()) $('#liIdent').fadeIn();
            if (my.vm.reqIdent() && my.vm.askIdent()) $('#identTextBox').attr({ 'required': 'required', 'data-role': 'validate' });
            $('#companyTextBox').removeClass('required').removeAttr('required');
            $('#companyTextBox').removeClass('required').removeAttr('data-role');
            $('#einTextBox').removeClass('required').removeAttr('required');
            $('#einTextBox').removeClass('required').removeAttr('data-role');
            $('#stateTaxTextBox').removeClass('required').removeAttr('required');
            $('#stateTaxTextBox').removeClass('required').removeAttr('data-role');
            $('#cityTaxTextBox').removeClass('required').removeAttr('required');
            $('#cityTaxTextBox').removeClass('required').removeAttr('data-role');
            $('#ddlIndustries').removeClass('required').removeAttr('required');
            $('#ddlIndustries').removeClass('required').removeAttr('data-role');
        } else {
            $('#cpfTextBox').removeClass('required').removeAttr('required');
            $('#cpfTextBox').removeClass('required').removeAttr('data-role');
            $('#identTextBox').removeClass('required').removeAttr('required');
            $('#identTextBox').removeClass('required').removeAttr('data-role');
            if (my.vm.askIndustry()) {
                my.vm.loadIndustries();
                $('#liIndustries').fadeIn();
            }
            $('#liCompanyName').fadeIn();
            $('#companyTextBox').attr({ 'required': 'required', 'data-role': 'validate' });
            if (my.vm.askEIN()) $('#liEIN').fadeIn();
            if (my.vm.askST()) $('#liST').fadeIn();
            if (my.vm.askCT()) $('#liCT').fadeIn();
            if (my.vm.askTelephone()) {
                $('#liZero0800').fadeIn();
                $('#liFax').fadeIn();
                $('#liPhone').show();
                if (my.vm.reqTelephone()) {
                    $('#phoneTextBox').attr({ 'required': 'required', 'data-role': 'validate' });
                    $('label[for="phoneTextBox"]').addClass('required');
                }
            }
            $('#liCPF').fadeOut();
            $('#liIdent').fadeOut();
            $('#liCell').fadeOut();
            if (my.vm.askWebsite()) $('#liWebsite').fadeIn();
            if (my.vm.askWebsite() && my.vm.reqWebsite()) $('#websiteTextBox').attr({ 'required': 'required', 'data-role': 'validate' });
            my.vm.reqCompanyName(true);
            if (my.vm.askEIN() && my.vm.reqEIN()) $('#einTextBox').attr({ 'required': 'required', 'data-role': 'validate' });
            if (my.vm.askST() && my.vm.reqST()) $('#stateTaxTextBox').attr({ 'required': 'required', 'data-role': 'validate' });
            if (my.vm.askCT() && my.vm.reqCT()) $('#cityTaxTextBox').attr({ 'required': 'required', 'data-role': 'validate' });
            if (my.vm.askIndustry() && my.vm.reqIndustry()) $('#s2id_ddlIndustries').attr({ 'required': 'required', 'data-role': 'validate' });
        }
    };

    $('input.enterastab, select.enterastab, textarea.enterastab').on('keydown', function(e) {
        if (e.keyCode === 13) {
            var focusable = $('input,a,select,textarea').filter(':visible');
            if (this.name === 'streetTextBox') {
                focusable.eq(focusable.index(this) + 1).focus().select();
            } else {
                focusable.eq(focusable.index(this) + 2).focus().select();
            }
            return false;
        }
    });

    //if (my.vm.personId() !== 0) {
    //    $('#btnAssist').show();
    //    $('#btnFinance').show();
    //    $('#btnCommunicate').show();
    //    $('#btnHistory').show();
    //    $('#btnEdit').show();
    //    $('#personMenu').show();
    //    $('#personMenu').jqxMenu({
    //        width: '120',
    //        mode: 'vertical'
    //    });
    //    //$('#ddlRegions').data('kendoDropDownList').value(my.vm.selectedRegion());
    //    //my.setPerson();

    //    $('#editPerson .pull-left').css({ 'width': '14%' });
    //    $('#editPerson .pull-right').css({ 'width': '85%' });
    //} else {
    //    $('#editPerson .pull-right').css({ 'width': '99%' });
    //    $('#personForm .pull-left').css({ 'width': '48%' });
    //    $('#personForm .pull-right').css({ 'width': '52%' });
    //}

    my.initializer();

    my.vm.loadRegions();

    if (my.getParameterByName('sel')) {
        var sel = my.getParameterByName('sel');
        $('#actionsMenu ul li[id=' + sel + ']').addClass('jqx-menu-item-selected');
        //if (sel <= 7) {
        //    $('#personMenu ul li:first-child').addClass('jqx-menu-item-selected');
        //    //} else {
        //}
        if (my.getParameterByName('subSel')) {
            //$('#personMenu ul li').removeClass('jqx-menu-item-selected');
            var subSel = my.getParameterByName('subSel');
            $('#personMenu ul li[id=' + subSel + ']').addClass('jqx-menu-item-selected');
        } else {
            $('#personMenu ul li:first-child').addClass('jqx-menu-item-selected');
        }
    }

    $('#personMenu').on('itemclick', function(event) {
        document.location.hash = 'personId/' + my.personId + '/sel/7/subSel/' + event.args.id;
        $('#personMenu ul li').removeClass('jqx-menu-item-selected');
        $('#personMenu ul li[id=' + event.args.id + ']').addClass('jqx-menu-item-selected');
        //$('#actionsMenu ul li').removeClass('jqx-menu-item-selected');
        my.initializer();
        switch (event.args.id) {
            case '1':

                $('#personForm').hide();
                $('#personDocuments').fadeOut();
                $('#editMsg').fadeOut();
                $('#userPhoto').fadeOut();
                $('#editLogin').fadeOut();
                $('#personAddresses').fadeOut();
                $('#clientFinances').fadeOut();
                $('#personContacts').fadeOut();
                $('#personForm').delay(300).fadeIn();

                break;
            case '2':

                $('#personAddresses').hide();
                $('#personDocuments').fadeOut();
                $('#editMsg').fadeOut();
                $('#userPhoto').fadeOut();
                $('#editLogin').fadeOut();
                $('#clientFinances').fadeOut();
                $('#personForm').fadeOut();
                $('#personContacts').fadeOut();
                $('#personAddresses').delay(300).fadeIn();

                break;
            case '3':

                $('#personContacts').hide();
                $('#personDocuments').fadeOut();
                $('#editMsg').fadeOut();
                $('#userPhoto').fadeOut();
                $('#editLogin').fadeOut();
                $('#clientFinances').fadeOut();
                $('#personForm').fadeOut();
                $('#personAddresses').fadeOut();
                $('#personContacts').delay(300).fadeIn();

                break;
            case '4':

                $('#personDocuments').hide();
                $('#editMsg').fadeOut();
                $('#userPhoto').fadeOut();
                $('#editLogin').fadeOut();
                $('#clientFinances').fadeOut();
                $('#personContacts').fadeOut();
                $('#personForm').fadeOut();
                $('#personAddresses').fadeOut();
                $('#personDocuments').delay(300).fadeIn();

                break;
            case '5':

                $('#editLogin').hide();
                $('#editMsg').fadeOut();
                $('#userPhoto').fadeOut();
                $('#personDocuments').fadeOut();
                $('#personForm').fadeOut();
                $('#personAddresses').fadeOut();
                $('#clientFinances').fadeOut();
                $('#personContacts').fadeOut();
                $('#editLogin').delay(300).fadeIn();

                break;
            case '6':

                $('#userPhoto').hide();
                $('#editMsg').fadeOut();
                $('#editLogin').fadeOut();
                $('#personForm').fadeOut();
                $('#personAddresses').fadeOut();
                $('#clientFinances').fadeOut();
                $('#personContacts').fadeOut();
                $('#personDocuments').fadeOut();
                $('#userPhoto').delay(300).fadeIn();

                break;
                //case '7':

                //    $('#editMsg').hide();
                //    $('#userPhoto').fadeOut();
                //    $('#editLogin').fadeOut();
                //    $('#personForm').fadeOut();
                //    $('#personAddresses').fadeOut();
                //    $('#clientFinances').fadeOut();
                //    $('#personContacts').fadeOut();
                //    $('#personDocuments').fadeOut();
                //    $('#editMsg').delay(300).fadeIn();

                //    break;
        }
    });

    //var validator = new ValidationUtility();

    $('#actionsMenu').on('itemclick', function(event) {
        //event.args.textContent = 'Um momento...';
        switch (event.args.id) {
            case '7':
                document.location.href = editURL + '?SkinSrc=[G]Skins/riw/popUpSkin&ContainerSrc=[G]Containers/riw/popUpContainer#personId/' + my.personId + '/sel/7';
                break;
            case '8':
                document.location.href = historyURL + '?SkinSrc=[G]Skins/riw/popUpSkin&ContainerSrc=[G]Containers/riw/popUpContainer#personId/' + my.personId + '/sel/8';
                break;
            case '9':
                document.location.href = finanURL + '?SkinSrc=[G]Skins/riw/popUpSkin&ContainerSrc=[G]Containers/riw/popUpContainer#personId/' + my.personId + '/sel/9';
                break;
            case '10':
                document.location.href = assistURL + '?SkinSrc=[G]Skins/riw/popUpSkin&ContainerSrc=[G]Containers/riw/popUpContainer#personId/' + my.personId + '/sel/10';
                break;
            case '11':
                document.location.href = commURL + '?SkinSrc=[G]Skins/riw/popUpSkin&ContainerSrc=[G]Containers/riw/popUpContainer#personId/' + my.personId + '/sel/11';
                break;
            default:
                var urlAddress = '';
                if (my.retSel > 0) {
                    switch (my.retSel) {
                        case 7:
                            urlAddress = editURL + '?SkinSrc=[G]Skins/riw/popUpSkin&ContainerSrc=[G]Containers/riw/popUpContainer#personId/' + my.personId + '/sel/7';
                            break;
                        case 8:
                            urlAddress = historyURL + '?SkinSrc=[G]Skins/riw/popUpSkin&ContainerSrc=[G]Containers/riw/popUpContainer#personId/' + my.personId + '/sel/8';
                            break;
                        case 9:
                            urlAddress = finanURL + '?SkinSrc=[G]Skins/riw/popUpSkin&ContainerSrc=[G]Containers/riw/popUpContainer#personId/' + my.personId + '/sel/9';
                            break;
                        case 10:
                            urlAddress = assistURL + '?SkinSrc=[G]Skins/riw/popUpSkin&ContainerSrc=[G]Containers/riw/popUpContainer#personId/' + my.personId + '/sel/10';
                            break;
                        case 11:
                            urlAddress = commURL + '?SkinSrc=[G]Skins/riw/popUpSkin&ContainerSrc=[G]Containers/riw/popUpContainer#personId/' + my.personId + '/sel/11';
                            break;
                    }
                    document.location.href = urlAddress;
                } else if (my.editProduct > 0) {
                    urlAddress = editProductURL + '?SkinSrc=[G]Skins/riw/popUpSkin&ContainerSrc=[G]Containers/riw/popUpContainer&itemId/' + my.editProduct;
                    document.location.href = urlAddress;
                } else {
                    //parent.$(".k-window-content").each(function (i, win) {
                    parent.$('#window').data("kendoWindow").close();
                    //});
                    //$(".k-window .k-window-content").each(function (index, element) {
                    //    setTimeout(function () {
                    //        $(element).data('kendoWindow').close();
                    //    }, 1000);
                    //});
                    //if (parent.$('#clientFinanWindow').data('kendoWindow')) {
                    //    parent.$('#clientFinanWindow').data('kendoWindow').close();
                    //}
                    //if (parent.$('#clientEditWindow').data('kendoWindow')) {
                    //    parent.$('#clientEditWindow').data('kendoWindow').close();
                    //}
                    //if (parent.$('#clientAssistWindow').data('kendoWindow')) {
                    //    parent.$('#clientAssistWindow').data('kendoWindow').close();
                    //}
                    //if (parent.$('#clientCommWindow').data('kendoWindow')) {
                    //    parent.$('#clientCommWindow').data('kendoWindow').close();
                    //}
                    //if (parent.$('#clientHistoryWindow').data('kendoWindow')) {
                    //    parent.$('#clientHistoryWindow').data('kendoWindow').close();
                    //}
                }
        }
    });

    $('#enableLoginChk').click(function() {
        if ($(this).prop(":checked")) {
            my.vm.reqEmail(true);
            $('#emailTextBox').attr({ 'required': true });
        } else {
            my.vm.reqEmail(false);
            $('#emailTextBox').removeAttr('required');
            $('#emailTextBox').removeAttr('data-role');
        }
    });

    $.fn.dnnFileInput = function(options) {

    };

    $('.btnReturn').click(function(e) {
        if (e.clientX === 0) {
            return false;
        }
        e.preventDefault();

        var $this = $(this);
        $this.button('loading');

        var urlAddress = '';
        if (my.editProduct) {
            urlAddress = editProductURL + '?SkinSrc=[G]Skins/riw/popUpSkin&ContainerSrc=[G]Containers/riw/popUpContainer&itemId/' + my.editProduct;
            document.location.href = urlAddress;
        } else {
            //parent.$(".k-window-content").each(function (i, win) {
            parent.$('#window').data("kendoWindow").close();
            //});
            //$(".k-window .k-window-content").each(function (index, element) {
            //    setTimeout(function () {
            //        $(element).data('kendoWindow').close();
            //    }, 1000);
            //});
            //if (parent.$('#clientFinanWindow').data('kendoWindow')) {
            //    parent.$('#clientFinanWindow').data('kendoWindow').close();
            //}
            //if (parent.$('#clientEditWindow').data('kendoWindow')) {
            //    parent.$('#clientEditWindow').data('kendoWindow').close();
            //}
            //if (parent.$('#clientAssistWindow').data('kendoWindow')) {
            //    parent.$('#clientAssistWindow').data('kendoWindow').close();
            //}
            //if (parent.$('#clientCommWindow').data('kendoWindow')) {
            //    parent.$('#clientCommWindow').data('kendoWindow').close();
            //}
            //if (parent.$('#clientHistoryWindow').data('kendoWindow')) {
            //    parent.$('#clientHistoryWindow').data('kendoWindow').close();
            //}
        }
    });

});