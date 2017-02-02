var express = require('express');
var router = express.Router();

router.use(function (req, res, next) {
	if (req.user.IsSuperUser) {
		next();
		return;
	}
	res.redirect("/login");
});

/* GET admin home page. */
router.get('/', function (req, res, next) {
	res.render('admin/index', {
		title: 'Início'
	});
});

/* GET categories page. */
router.get('/categorias', function (req, res, next) {
	res.render('admin/categories', {
		title: 'Categoria'
	});
});

module.exports = router;
