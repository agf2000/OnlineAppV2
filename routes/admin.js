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
			'/plugins/bootstrap-switch/bootstrap-switch.min.css',
			'/plugins/jqwidgets/styles/jqx.base.css'
		],
		script: [
			'/dist/js/app/utilities.js',
			'/plugins/jqwidgets/jqxcore.js',
			'/plugins/jqwidgets/jqxdropdownbutton.js',
			'/plugins/jqwidgets/jqxtree.js',
			'/plugins/jqwidgets/jqxmenu.js',
			'/plugins/jqwidgets/jqxpanel.js',
			'/plugins/jqwidgets/jqxscrollbar.js',
			'/plugins/jqwidgets/jqxbuttons.js',
			'/plugins/knockout/knockout-3.4.0.js',
			'/plugins/tristate-checkbox/js/tristate.min.js',
			'/plugins/bootstrap-switch/bootstrap-switch.min.js',
			'/dist/js/pages/categoriesViewModel.js',
			'/dist/js/pages/categories.js'
		]
	});
});

module.exports = router;
