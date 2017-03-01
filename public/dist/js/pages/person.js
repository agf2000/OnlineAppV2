$(function() {

    PNotify.prototype.options.styling = "bootstrap3";
    my.personId = my.getParameterByName('personId');
    var status = $(".status");
    my.retSel = my.getParameterByName('retSel');
    my.editProduct = my.getParameterByName('itemId');
    my.vendor = my.getQuerystring('vendor', my.getParameterByName('vendor'));
    my.userInfo = Cookies.getJSON('OnlineUser');
    $(":input").inputmask();

    my.viewModel();

    $.ajax({
        url: '/api/store/getSettings'
    }).done(function(data) {
        if (data.length) {
            my.userInfo.storeSettings = data;
            initializer();
        }
    }).fail(function(jqXHR, textStatus) {
        console.log(jqXHR.responseText);
    });

    $('#chkBoxBlocked').bootstrapSwitch();

    $('#selectRegisterTypes').kendoMultiSelect({
        autoBind: false,
        dataSource: {
            transport: {
                read: {
                    url: "/api/store/getRolesByRoleGroup/0/''entidades''"
                }
            }
        },
        dataTextField: 'rolename',
        dataValueField: 'roleid'
    });

    if (my.personId) {
        my.getPerson(my.personId);
    } else {
        setTimeout(function() {
            $('#selectRegisterTypes').data('kendoMultiSelect').value(my.vendor === '1' ? parseInt(my.getSettingValue('vendorRoleId')) : parseInt(my.getSettingValue('clientsRoleId')));
            my.selectedSalesRepId = parseInt(my.getSettingValue('salesPerson'));
        }, 500);
    }

    $('#select2SalesPeople').select2({
        placeholder: "VENDEDOR",
        width: '100%',
        language: "pt-BR",
        ajax: {
            url: "/api/people/getSalesPeople",
            dataType: 'json',
            delay: 250,
            data: function(params) {
                return {
                    search: params.term || "",
                    pageIndex: params.page || 1,
                    pageSize: 10
                };
            },
            processResults: function(data, params) {

                params.page = params.page || 1;

                var results = [];

                $.each(data, function(i, v) {
                    var o = {};
                    o.id = v.personid;
                    o.name = v.firstname + ' ' + v.lastname;
                    //o.description = v.Descricao;
                    //o.value = v.codigo;
                    results.push(o);
                });

                return {
                    results: results,
                    pagination: {
                        more: (params.page * 10) < data[0].totalcount
                    }
                };
            },
            cache: true
        },
        escapeMarkup: function(markup) {
            return markup;
        },
        minimumInputLength: -1,
        templateResult: function(repo) {
            if (repo.loading) return repo.text;
            var markup = '<option value="' + repo.id + '">' + repo.name + '</option>'
            return markup;
        },
        templateSelection: function(repo) {
            return repo.name || repo.text;
        }
    });

    $("a[href='#personMenu']").on('shown.bs.tab', function(e) {
        console.log('shown - after the tab has been shown');
    });

    // or even this one if we want the earlier event
    $("a[href='#personMenu']").on('show.bs.tab', function(e) {
        document.location.hash = 'personId/' + my.personInfo.personId + '/sel/7/subSel/' + event.args.id;
        var targetTab = $(e.target).attr("href");
        initializer();
        console.log('show - before the new tab has been shown');
    });

    $('#enableLoginChk').click(function() {
        if ($(this).prop(":checked")) {
            $('#emailTextBox').attr({ 'required': true });
        } else {
            $('#emailTextBox').removeAttr('required');
        }
    });

    var industries = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace('industrytitle'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: '/api/store/getIndustries/%QUERY',
            wildcard: '%QUERY'
        }
    });

    $('#industriesTextBox').typeahead({
        hint: true,
        highlight: true,
        minLength: 2
    }, {
        name: 'industries',
        source: industries,
        limit: 100,
        display: 'industrytitle',
        displayKey: 'industryid',
        templates: {
            empty: '<div class="empty-message"><i> Se a profissão não existe! Uma nova será cadastrada.</i></div>'
        },
        suggestion: function(data) {
            return '<p>' + data.industrytitle + '</p>';
        }
    });

    $('#industriesTextBox').bind('typeahead:select', function(ev, suggestion) {
        my.industryId = suggestion.industryid;
    });

    $(":input").css({
        'text-transform': 'uppercase'
    });

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

});

var getPerson = function(id) {
    $.ajax({
        url: '/desktopmodules/riw/api/people/GetPerson?personId=' + id,
        async: false
    }).done(function(data) {
        if (data) {
            // $('#actionsMenu').show();
            $('#btnUpdatePerson').html('<i class="fa fa-check"></i>&nbsp; Atualizar');
            $('#btnUpdatePerson').show();

            if (data.persontype) {
                $('input[name=person]:eq(0)').attr('checked', 'checked');
            } else {
                $('input[name=person]:eq(1)').attr('checked', 'checked');
            }

            my.personId(data.personid);
            if (data.userid > 0) {
                my.personUserId(data.userid);
                $('#liLogin').addClass('hidden');
            } else {
                $('#personMenu #5').addClass('hidden');
                $('#personMenu #6').addClass('hidden');
                $('#personMenu #7').addClass('hidden');
            }

            $('#displayNameTextBox').val(data.displayname);
            $('#firstNameTextBox').val(data.firstname);
            $('#lastNameTextBox').val(data.lastname);
            $('#cpfTextBox').val(data.cpf);
            $('#identTextBox').val(data.ident);
            $('#phoneTextBox').val(data.telephone);
            $('#cellTextBox').val(data.cell);
            $('#faxTextBox').val(data.fax);
            my.originalEmail(data.email);
            if (data.email) {
                if (data.email.length > 2) {
                    $('#').val(data.email);
                    // $('#actionsMenu li:nth-child(5)').show();
                }
            }
            $('#companyTextBox').val(data.companyname);
            $('#0800TextBox').val(data.zero800s);
            // $('#').val(data.datefound);
            // $('#').val(data.dateregistered);
            $('#einTextBox').val(data.ein);
            $('#stateTaxTextBox').val(data.statetax);
            $('#cityTaxTextBox').val(data.citytax);
            $('#commentsTextArea').val(data.comments);
            $('#chkBoxBlocked').bootstrapSwitch('state', data.blocked),
                my.reasonBlocked(data.reasonblocked),
                $('#bioTextArea').val(data.biography);
            my.locked(data.Locked);
            // if (data.monthlyincome > 0) $('#').val(data.monthlyincome);
            my.selectedFinanAddress(data.personaddressid);
            $('#websiteTextBox').val(data.website);

            my.createdByUser(data.createdbyuser);
            my.createdOnDate(data.createdondate);

            $('#unitTextBox').val(data.unit);

            $('#selectRegisterTypes').data('kendoMultiSelect').value(data.registertypes);

            if (data.isdeleted) {
                $('#btnRestorePerson').show();
                if (!data.locked) {
                    $('#btnRemovePerson').show();
                } else {
                    $('#btnDeletePerson').show();
                }
            } else {
                $('#btnRestorePerson').addClass('hidden');
                $('#btnDeletePerson').show();
                if (data.locked) {
                    $('#btnDeletePerson').show();
                } else {
                    $('#btnRemovePerson').show();
                }
            }

            if (my.userInfo.admin < 3) {
                $('#btnRemovePerson').addClass('hidden');
            }

            setTimeout(function() {
                my.selectedSalesRepId = (data.salesrep > 0 ? data.salesrep : parseInt(my.getSettingValue('salesperson')));
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

            $('#editPerson .pull-left').css({ 'width': '14%' });
            $('#editPerson .pull-right').css({ 'width': '85%' });
        }
    });

};

var checkPersonEmail = function(username) {
    if (my.personInfo.personId > 0) {
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

var initializer = function() {
    $('#radioPerson').click(function(e) {
        setPerson();
    });

    $('#radioBusiness').click(function(e) {
        setPerson();
    });

    $('#emailTextBox').on('paste', function() {
        $('#btnCheckEmail').show();
    });

    $('#emailTextBox').keyup(function() {
        if (this.value.length) {
            $('#btnCheckEmail').show();
            $('#btnUpdatePerson').attr({ 'disabled': true, 'title': 'Desativado' });
        } else {
            $('#btnCheckEmail').addClass('hidden');
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

        if (my.userInfo.email !== my.originalEmail) {
            if (my.unserInfo.email !== '' && my.isValidEmailAddress(my.userInfo.email)) {
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
                    my.reqEmail(true);
                }
            } else {
                //if (self.clientId() > 0)
                //    $('#emailTextBox').attr({ 'class': 'required', 'required': true });
                //$('#emailCheck').html('');
                $('#btnCheckEmail').attr({ 'disabled': false }).addClass('hidden');
                $('#btnUpdatePerson').attr({ 'disabled': false, 'title': '' });
            }
        } else {
            //$('#emailCheck').html('');
            $('#btnCheckEmail').attr({ 'disabled': false }).addClass('hidden');
            $('#btnUpdatePerson').attr({ 'disabled': false, 'title': '' });
        }
    });

    $('#personForm').validator().on('submit', function(e) {
        if (e.isDefaultPrevented()) {

        } else {
            // Prevent form submission
            e.preventDefault();
            var personData = new FormData($(this)[0]);

            $('#btnUpdatePerson').html("<i class='fa fa-spinner fa-spin'></i>&nbsp; Um momento...").attr('disabled', true);

            personData.append('portalId', 0);
            personData.append('personId', my.personId);
            personData.append('personType', $('#radioPerson').is(':checked'));
            personData.append('statusId', 1);
            personData.append('registerTypes', $('#selectRegisterTypes').data('kendoMultiSelect').value().toString());
            personData.append('salesRepId', my.selectedSalesRepId);
            personData.append('industries', my.industryId);
            // personData.append('blocked', $('#chkBoxBlocked').prop('checked'));
            personData.append('createdByUser', my.userInfo.userid);
            personData.append('createdOnDate', moment().format('YYYY-MM-DD HH:mm'));
            personData.append('modifiedByUser', my.userInfo.userid);
            personData.append('modifiedOnDate', moment().format('YYYY-MM-DD HH:mm'));
            personData.append('SyncEnabled', true);

            if ($('#phoneTextBox').val().length > 1) {
                personData.append('telephone', $('#phoneTextBox').val().replace(/\D/g, ''));
            }

            if ($('#cellTextBox').val().length > 1) {
                personData.append('cell', $('#cellTextBox').val().replace(/\D/g, ''));
            }

            if ($('#faxTextBox').val().length > 1) {
                personData.append('fax', $('#faxTextBox').val().replace(/\D/g, ''));
            }

            if ($('#emailTextBox').val().length > 1) {
                personData.append('email', $('#emailTextBox').val().toLowerCase());
            }

            if ($('#websiteTextBox').val().length > 1) {
                personData.append('website', $('#websiteTextBox').val().toLowerCase());
            }

            if ($('#einTextBox').val().length > 1) {
                personData.append('ein', $('#einTextBox').val().replace(/\D/g, ''));
            }

            if (my.personId) {
                personData.append('createLogin', false);
            } else if ($('#enableLoginChk').prop(':checked')) {
                personData.append('createLogin', true);
            }

            $.ajax({
                type: (my.personId ? 'PUT' : 'POST'),
                contentType: false,
                processData: false,
                data: personData,
                url: (my.personId ? '/api/people/update' : '/api/people/add')
            }).done(function(data) {
                if (!data.message) {
                    my.personId = data.personid;
                    history.replaceState("", document.title, data.personid);

                    $('#btnCheckEmail').addClass('hidden');

                    $('#btnUpdatePerson').html("<i class='fa fa-check'></i>&nbsp; Adicionar").removeAttr('disabled');

                    var notice = new PNotify({
                        title: 'Sucesso!',
                        text: 'Cadastro <strong>' + $('#nameTextBox').val() + '</strong> inserido.',
                        type: 'success',
                        animation: 'none',
                        addclass: 'stack-bottomright',
                        stack: my.stack_bottomright
                    });
                    notice.get().click(function() {
                        notice.remove();
                    });

                    if (params.CreateLogin) {
                        if (data.UserId) {
                            my.userInfo.personuserid = data.userid;
                            var notice1 = new PNotify({
                                title: 'Atenção',
                                text: 'O campo de email agora se encontra em "Login".',
                                type: 'info',
                                animation: 'none',
                                addclass: 'stack-bottomright',
                                stack: my.stack_bottomright
                            });
                            notice1.get().click(function() {
                                notice.remove();
                            });
                        } else {
                            var notice2 = new PNotify({
                                title: 'Erro!',
                                text: data.message,
                                type: 'info',
                                animation: 'none',
                                addclass: 'stack-bottomright',
                                stack: my.stack_bottomright
                            });
                            notice2.get().click(function() {
                                notice.remove();
                            });
                            $('#enableLoginChk').attr({ 'checked': false });
                        }
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
                        }
                    }
                }
            }).fail(function(jqXHR, textStatus) {
                console.log(jqXHR.responseText);
            }).always(function() {
                $('#btnUpdatePerson').html("<i class='fa fa-check'></i>&nbsp; Atualizar").removeAttr('disabled');
            });
        }
    });

    $('#btnDeletePerson').click(function(e) {
        if (e.clientX === 0) {
            return false;
        }
        e.preventDefault();

        var $this = $(this);

        var params = {
            PersonId: my.personId,
            PortalId: 0,
            UserId: my.unserInfo.personuserid,
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
            PortalId: 0,
            UserId: my.userInfo.personuserid,
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
                $('#btnRestorePerson').addClass('hidden');
                $('#btnDeletePerson').show();
                if (my.vm.locked) {
                    $('#btnDeletePerson').show();
                } else {
                    if (authorized > 2) {
                        $('#btnRemovePerson').show();
                    }
                }

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
                                url: '/desktopmodules/riw/api/people/RemovePerson?personId=' + my.personId + '&portalId=0&userId=' + my.vm.personUserId()
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

    if (JSON.parse(my.getSettingValue('askLastName'))) {
        $('#lastNameTextBox').show();
        if (JSON.parse(my.getSettingValue('reqLastName'))) {
            $('#lastNameTextBox').attr({ 'required': true });
            $('label[for="lastNameTextBox"]').addClass('required');
        }
    }
    if (JSON.parse(my.getSettingValue('askTelephone'))) {
        $('#liPhone').show();
        $('#liCell').show();
        if (JSON.parse(my.getSettingValue('reqTelephone'))) {
            $('#phoneTextBox').attr({ 'required': true });
            $('label[for="phoneTextBox"]').addClass('required');
        }
    }
    if (JSON.parse(my.getSettingValue('askSSN'))) {
        $('#liCPF').show();
        if (JSON.parse(my.getSettingValue('reqSSN'))) {
            $('#cpfTextBox').attr({ 'required': true });
            $('label[for="cpfTextBox"]').addClass('required');
        }
    }
    if (JSON.parse(my.getSettingValue('askIdent'))) {
        $('#liIdent').show();
        if (JSON.parse(my.getSettingValue('reqIdent'))) {
            $('#identTextBox').attr({ 'required': true });
            $('label[for="identTextBox"]').addClass('required');
        }
    }

    $('.overlay').remove();
};

var setPerson = function() {
    if ($('#radioPerson').is(':checked')) {
        $('#liIndustries').addClass('hidden');
        $('#liCompanyName').addClass('hidden');
        $('#liFax').addClass('hidden');
        $('#liEIN').addClass('hidden');
        $('#liST').addClass('hidden');
        $('#liCT').addClass('hidden');
        $('#liZero0800').addClass('hidden');
        $('#liWebsite').addClass('hidden');
        if (JSON.parse(my.getSettingValue('askLastName'))) $('#lastNameTextBox').removeClass('hidden');
        if (JSON.parse(my.getSettingValue('reqLastName')) && JSON.parse(my.getSettingValue('askLastName'))) $('#lastNameTextBox').removeClass('hidden');
        if (JSON.parse(my.getSettingValue('askTelephone'))) {
            $('#liPhone').removeClass('hidden');
            $('#liCell').removeClass('hidden');
            if (JSON.parse(my.getSettingValue('reqTelephone'))) {
                $('#phoneTextBox').attr({ 'required': true });
                $('label[for="phoneTextBox"]').addClass('required');
            }
        }
        if (JSON.parse(my.getSettingValue('askSSN'))) $('#liCPF').removeClass('hidden');
        if (JSON.parse(my.getSettingValue('reqSSN')) && JSON.parse(my.getSettingValue('askSSN'))) $('#cpfTextBox').attr({ 'required': true });
        if (JSON.parse(my.getSettingValue('askIdent'))) $('#liIdent').removeClass('hidden');
        if (JSON.parse(my.getSettingValue('reqIdent')) && JSON.parse(my.getSettingValue('askIdent'))) $('#identTextBox').attr({ 'required': true });
        $('#companyTextBox').removeClass('required').removeAttr('required');
        $('#einTextBox').removeClass('required').removeAttr('required');
        $('#stateTaxTextBox').removeClass('required').removeAttr('required');
        $('#stateTaxTextBox').removeClass('required').removeAttr('required');
        $('#cityTaxTextBox').removeClass('required').removeAttr('required');
        $('#ddlIndustries').removeClass('required').removeAttr('required');
    } else {
        $('#cpfTextBox').removeClass('required').removeAttr('required');
        $('#identTextBox').removeClass('required').removeAttr('required');
        if (JSON.parse(my.getSettingValue('askIndustry'))) {
            // my.vm.loadIndustries();
            $('#liIndustries').removeClass('hidden');
        }
        $('#liCompanyName').removeClass('hidden');
        $('#companyTextBox').attr({ 'required': true });
        if (JSON.parse(my.getSettingValue('askEIN'))) $('#liEIN').removeClass('hidden');
        if (JSON.parse(my.getSettingValue('askST'))) $('#liST').removeClass('hidden');
        if (JSON.parse(my.getSettingValue('askCT'))) $('#liCT').removeClass('hidden');
        if (JSON.parse(my.getSettingValue('askTelephone'))) {
            $('#liZero0800').removeClass('hidden');
            $('#liFax').removeClass('hidden');
            $('#liPhone').show();
            if (JSON.parse(my.getSettingValue('reqTelephone'))) {
                $('#phoneTextBox').attr({ 'required': true });
                $('label[for="phoneTextBox"]').addClass('required');
            }
        }
        $('#liCPF').addClass('hidden');
        $('#liIdent').addClass('hidden');
        $('#liCell').addClass('hidden');
        if (JSON.parse(my.getSettingValue('askWebsite'))) $('#liWebsite').removeClass('hidden');
        if (JSON.parse(my.getSettingValue('askWebsite')) && JSON.parse(my.getSettingValue('reqWebsite'))) $('#websiteTextBox').attr({ 'required': true });
        if (JSON.parse(my.getSettingValue('askEIN')) && JSON.parse(my.getSettingValue('reqEIN'))) $('#einTextBox').attr({ 'required': true });
        if (JSON.parse(my.getSettingValue('askST')) && JSON.parse(my.getSettingValue('reqST'))) $('#stateTaxTextBox').attr({ 'required': true });
        if (JSON.parse(my.getSettingValue('askCT')) && JSON.parse(my.getSettingValue('reqCT'))) $('#cityTaxTextBox').attr({ 'required': true });
        if (JSON.parse(my.getSettingValue('askIndustry')) && JSON.parse(my.getSettingValue('reqIndustry'))) $('#s2id_ddlIndustries').attr({ 'required': true });
    }

    $('#personForm').validator('update');
};