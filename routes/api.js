var express = require("express");
var categoriesController = require("../controllers/categoriesController.js")

var router = express.Router();

router.get("/getUserInfo", function(req, res){
	res.json(res.locals.user);
});

router.get('/categories/getCategories', function (req, res) {
	categoriesController.getCategories(req, res, req.query.portalId, req.query.lang, req.query.parentCategoryId, req.query.filter, req.query.archived, req.query.includeIsArchived);
});

router.get('/categories/getCategoryPermissions', function (req, res) {
	categoriesController.getCategoriesPermissions(req, res, req.query.categoryId);
});

router.get('/categories/:id/:lang', function (req, res) {
	categoriesController.getCategory(req, res, req.params.id, req.params.lang);
});

module.exports = router;
