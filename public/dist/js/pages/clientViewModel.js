my.viewModel = function() {

    my.Country = function(data) {
        this.CountryCode = ko.observable(data.Value);
        this.CountryName = ko.observable(data.Text);
    };

    my.Region = function(data) {
        this.RegionCode = ko.observable(data.Value);
        this.RegionName = ko.observable(data.Text);
    };

    my.SalesPerson = function(data) {
        this.DisplayName = ko.observable(data.DisplayName);
        this.UserID = ko.observable(data.UserID);
    };

    my.PersonHistory = function(data) {
        var self = this;
        data = data || {};

        self.historyByAvatar = data.Avatar ? '/portals/0/' + data.Avatar + '?w=45&h=45&mode=crop' : '/desktopmodules/rildoinfo/webapi/content/images/user.png?w=45&h=45';
        self.historyByName = data.DisplayName || 'Sistema';
        self.historyId = data.PersonHistoryId;
        self.historyText = data.HistoryText;
        self.createdOnDate = moment(data.CreatedOnDate).fromNow();
        self.allowed = data.Allowed;
        self.historyComments = ko.observableArray([]);

        self.newCommentHistory = ko.observable();
        self.addHistoryComment = function(index, data, e) {

            e.currentTarget.value = 'Um momento...';
            e.currentTarget.disabled = true;

            var PersonHistoryComment = {
                PortalId: portalID,
                PersonHistoryId: self.historyId,
                CommentText: my.converter.makeHtml(self.newCommentHistory().trim()),
                Locked: false,
                CreatedByUser: userID,
                CreatedOnDate: moment().format()
            };

            $.ajax({
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                url: '/desktopmodules/riw/api/people/updateHistoryComment',
                data: JSON.stringify({
                    dto: PersonHistoryComment,
                    messageIndex: index,
                    connId: my.hub.connection.id
                })
            }).done(function(commentData) {
                if (commentData.Result.indexOf("success") !== -1) {
                    my.vm.filteredHistories()[index].historyComments.unshift(new my.HistoryComment(commentData.PersonHistoryComment));
                    self.newCommentHistory(null);
                    //$().toastmessage('showSuccessToast', 'Comentário adicionado &#226; mensagem com successo!');
                    $.pnotify({
                        title: 'Sucesso!',
                        text: 'Coment&#225;rio adicionado.',
                        type: 'success',
                        icon: 'fa fa-check fa-lg',
                        addclass: "stack-bottomright",
                        stack: my.stack_bottomright
                    });
                } else {
                    //$().toastmessage('showErrorToast', data.Result);
                    $.pnotify({
                        title: 'Erro!',
                        text: commentData.Result,
                        type: 'error',
                        icon: 'fa fa-times-circle fa-lg',
                        addclass: "stack-bottomright",
                        stack: my.stack_bottomright
                    });
                }
            }).fail(function(jqXHR, textStatus) {
                console.log(jqXHR.responseText);
            }).always(function() {
                e.currentTarget.value = 'Comentar';
                e.currentTarget.disabled = false;
                //my.getMoreComments();
            });
        };
        if (data.HistoryComments) {
            var mappedPosts = $.map(data.HistoryComments, function(item) { return new my.HistoryComment(item); });
            self.historyComments(mappedPosts);
        }
        self.toggleComment = function(item, event) {
            $(event.target).next().find('.publishComment').toggle();
            $(event.target).next().find('.commentTextArea').focus();
        }
    };

    my.HistoryComment = function(data) {
        var self = this;
        data = data || {};

        self.commentedByAvatar = data.Avatar ? '/portals/0/' + data.Avatar + '?w=45&h=45&mode=crop' : '/desktopmodules/rildoinfo/webapi/content/images/user.png?w=45&h=45';
        self.commentedByName = data.DisplayName;
        self.historyId = data.PersonHistoryId;
        self.commentId = data.CommentId;
        self.commentText = data.CommentText;
        self.createdOnDate = moment(data.CreatedOnDate).fromNow();
    };

    my.PersonContact = function() {
        this.contactEmail = ko.observable();
        this.contactName = ko.observable();
        this.contactPhone = ko.observable();
    };

    my.PortalFile = function() {
        this.fileId = ko.observable();
        this.fileName = ko.observable();
        this.fileSize = ko.observable();
        this.contenType = ko.observable();
        this.extension = ko.observable();
        this.relativePath = ko.observable();
        this.width = ko.observable();
        this.height = ko.observable();
    };

    my.Product = function() {
        this.prodId = ko.observable();
        this.prodRef = ko.observable();
        this.prodBarCode = ko.observable();
        this.prodName = ko.observable();
        this.displayName = ko.observable();
        this.prodIntro = ko.observable();
        this.prodImageId = ko.observable();
        this.extension = ko.observable();
        this.unitValue = ko.observable();
    };

    // VIEW MODEL
    my.vm = function() {
        var self = this;

        self.sortJsonName = function(field, reverse, primer) {
                var key = primer ? function(x) { return primer(x[field]); } : function(x) { return x[field]; };
                return function(b, a) {
                    var A = key(a),
                        B = key(b);
                    return ((A < B) ? -1 : (A > B) ? +1 : 0) * [-1, 1][+!!reverse];
                };
            },

            self.industries = ko.observableArray([]),
            self.selectedIndustries = ko.observableArray([]),
            self.loadIndustries = function() {
                $.ajax({
                    url: '/desktopmodules/riw/api/industries/GetIndustries?portalId=' + portalID + '&isDeleted=False',
                    async: false
                }).done(function(data) {
                    self.industries.removeAll();
                    $.each(data, function(i, ind) {
                        self.industries.push(ko.mapping.fromJS(ind));
                    });
                });
            };

        return {
            sortJsonName: sortJsonName,
            loadIndustries: loadIndustries
        };

    }();

    ko.applyBindings(my.vm);

};