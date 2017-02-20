var express = require('express');
var router = express.Router();

router.use(function (req, res, next) {
	if (req.user.IsAdmin) {
		next();
		return;
	}
	res.redirect("/login");
});

/* GET admin home page. */
router.get('/', function (req, res, next) {
	res.render('index', {
		title: 'Início'
	});
});

/* GET categories page. */
router.get('/clientes', function (req, res, next) {
	res.render('people', {
		title: 'Clientes',
		css: [
			'/plugins/datatables/dataTables.bootstrap.css',
			'/plugins/datatables/extensions/select-1.2.0/css/select.dataTables.min.css',
			'/plugins/datatables/extensions/select-1.2.0/css/select.bootstrap.min.css',
			'/plugins/datatables/extensions/Scroller-1.4.2/css/scroller.dataTables.min.css',
			'/plugins/datatables/extensions/Scroller-1.4.2/css/scroller.bootstrap.min.css',
			'/plugins/datatables/extensions/buttons-1.2.4/css/buttons.dataTables.min.css',
			'/plugins/datatables/extensions/buttons-1.2.4/css/buttons.bootstrap.min.css',
			'/dist/css/pages/people.css'
		],
		script: [
			'/plugins/datatables/jquery.dataTables.min.js',
			'/plugins/datatables/dataTables.bootstrap.min.js',
			'/plugins/datatables/extensions/select-1.2.0/js/dataTables.select.min.js',
			'/plugins/datatables/extensions/Scroller-1.4.2/js/dataTables.scroller.min.js',
			'/plugins/datatables/extensions/buttons-1.2.4/js/dataTables.buttons.min.js',
			'/plugins/datatables/extensions/buttons-1.2.4/js/buttons.bootstrap.min.js',
			'/plugins/datatables/extensions/buttons-1.2.4/js/buttons.html5.min.js',
			'/plugins/datatables/extensions/jszip-2.5.0/jszip.min.js',
			'/plugins/datatables/extensions/pdfmake-0.1.18/build/pdfmake.min.js',
			'/plugins/datatables/extensions/pdfmake-0.1.18/build/vfs_fonts.js',
			'/plugins/datatables/extensions/buttons-1.2.4/js/buttons.print.min.js',
			'/plugins/datatables/extensions/buttons-1.2.4/js/buttons.colVis.min.js',
			'/dist/js/pages/people.js'
		]
	});
});

/* GET categories page. */
router.get('/categorias', function (req, res, next) {
	res.render('categories', {
		title: 'Categorias',
		css: [
			'/plugins/kendo/2017.1.118/styles/kendo.common.min.css',
			'/plugins/kendo/2017.1.118/styles/kendo.uniform.min.css',
			'/plugins/bootstrap-switch/css/bootstrap3/bootstrap-switch.min.css',
			'/plugins/jqwidgets/styles/jqx.base.css',
			'/plugins/bootstrap-fileinput/css/fileinput.min.css',
			'/plugins/bootstrap-validator/dist/css/bootstrapValidator.min.css',
			'/dist/css/pages/categories.css',
		],
		script: [
			'/plugins/kendo/2017.1.118/js/kendo.web.min.js',
			'/plugins/bootstrap-validator/dist/js/bootstrapValidator.min.js',
			'/plugins/bootstrap-validator/dist/js/language/pt_BR.js',
			'/plugins/jqwidgets/jqxcore.js',
			'/plugins/jqwidgets/jqxdropdownbutton.js',
			'/plugins/jqwidgets/jqxtree.js',
			'/plugins/jqwidgets/jqxmenu.js',
			'/plugins/jqwidgets/jqxpanel.js',
			'/plugins/jqwidgets/jqxscrollbar.js',
			'/plugins/jqwidgets/jqxbuttons.js',
			'/plugins/knockout/knockout-3.4.0.js',
			'/plugins/tristate-checkbox/js/tristate.min.js',
			'/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
			'/plugins/bootstrap-fileinput/js/plugins/canvas-to-blob.min.js',
			'/plugins/bootstrap-fileinput/js/plugins/sortable.min.js',
			'/plugins/bootstrap-fileinput/js/plugins/purify.min.js',
			'/plugins/bootstrap-fileinput/js/plugins/sortable.min.js',
			'/plugins/bootstrap-fileinput/js/fileinput.min.js',
			'/plugins/bootstrap-fileinput/js/locales/pt-BR.js',
			'/dist/js/app/utilities.js',
			'/dist/js/pages/categoriesViewModel.js',
			'/dist/js/pages/categories.js'
		]
	});
});

module.exports = router;
