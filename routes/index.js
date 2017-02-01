var express = require('express');
var router = express.Router();

router.use(function (req, res, next) {
	if (req.user.admin) {
		next();
		return;
	}
	res.redirect("/login");
});

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', {
		title: 'Express'
	});
});

module.exports = router;