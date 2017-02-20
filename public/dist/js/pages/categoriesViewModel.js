
my.viewModel = function () {

    my.permission = function () {
        this.CatPermissionId = ko.observable();
        this.CategoryId = ko.observable();
        this.PermissionId = ko.observable();
        this.RoleId = ko.observable();
        this.CanEdit = ko.observable();
    };

    // knockout js view model
    my.vm = function () {
        // this is knockout view model
        var self = this;

        // view models
        self.categories = ko.observableArray([]),
        self.selectedCategories = ko.observableArray([]),
        self.selectedCatId = ko.observable(0),
        self.roles = ko.observableArray([]),
        self.permissions = ko.observableArray([]),
        
        self.productId = ko.observable(0),
        self.productName = ko.observable(''),
        self.productRef = ko.observable(''),
        self.lang = ko.observable('pt-BR'),
        self.categoryId = ko.observable(0),
        self.parentId = ko.observable(0),
        self.productCount = ko.observable(0),

        self.catPermissions = ko.observableArray([]),
        self.setButton = ko.computed(function () {
            var btnLabel = '<i class="fa fa-plus fa-white"></i>&nbsp; Inserir';
            if (self.categoryId()) {
                btnLabel = '<i class="fa fa-check"></i>&nbsp; Atualizar';
                $('#btnCancel').show();
                $('#btnRemove').show();
            }

            return btnLabel;
        });

        // make view models available for apps
        return {
            categories: categories,
            selectedCategories: selectedCategories,
            selectedCatId: selectedCatId,
            roles: roles,
            permissions: permissions,
            productId: productId,
            productName: productName,
            productRef: productRef,
            lang: lang,
            categoryId: categoryId,
            parentId: parentId,
            productCount: productCount,
            catPermissions: catPermissions
        };

    }();

    ko.applyBindings(my.vm);
};