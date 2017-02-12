var express = require("express");
var categoriesController = require("../controllers/categoriesController.js");
var productsController = require("../controllers/productsController.js");
var storeController = require("../controllers/storeController.js");

var router = express.Router();

router.get("/getUserInfo", function (req, res) {
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

router.get('/products/getProducts', function (req, res) {
	productsController.getProducts(req, res, req.query.portalId, req.query.categoryId, req.query.lang, req.query.pageIndex, req.query.pageSize, req.query.orderBy, req.query.orderDir);
});

router.get('/store/roles/:portalId', function (req, res) {
	storeController.getRoles(req, res, req.params.portalId);
});

router.post('/categories/add', function (req, res) {
	return categoriesController.addCategory(req, res, req.body);	
});

router.put('/categories/update', function (req, res) {
	return categoriesController.updateCategory(req, res, req.body);	
});

router.delete('/categories/remove/:id', function (req, res) {
	return categoriesController.removeCategory(req, res, req.params.id);	
});

module.exports = router;