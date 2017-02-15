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
router.get('/categorias', function (req, res, next) {
	res.render('categories', {
		title: 'Categorias',
		css: [
			'/dist/css/pages/categories.css',
			'/plugins/bootstrap-switch/css/bootstrap3/bootstrap-switch.min.css',
			'/plugins/jqwidgets/styles/jqx.base.css',
			'/plugins/bootstrap-fileinput/css/fileinput.min.css'
		],
		script: [
			'/plugins/bootstrap-validator/dist/validator.min.js',
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
