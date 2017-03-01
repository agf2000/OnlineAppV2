var express = require("express");
var multer = require("multer");
var uuid = require("uuid");
var fs = require("fs");
var categoriesController = require("../controllers/categoriesController.js");
var productsController = require("../controllers/productsController.js");
var storeController = require("../controllers/storeController.js");
var peopleController = require("../controllers/peopleController.js");

var router = express.Router();

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function(req, file, cb) {
        var ext = file.originalname.substr(file.originalname.lastIndexOf('.') + 1);
        cb(null, uuid.v4() + '.' + ext);
    }
});

var upload = multer({
    storage: storage
});

router.get("/getUserInfo", function(req, res) {
    res.json(res.locals.user);
});

router.get('/categories/getCategories', function(req, res) {
    categoriesController.getCategories(req, res, req.query.portalId, req.query.lang, req.query.parentCategoryId, req.query.filter, req.query.archived, req.query.includeIsArchived);
});

router.get('/categories/getCategoryPermissions', function(req, res) {
    categoriesController.getCategoriesPermissions(req, res, req.query.categoryId);
});

router.get('/categories/:id/:lang', function(req, res) {
    categoriesController.getCategory(req, res, req.params.id, req.params.lang);
});

router.get('/products/getProducts', function(req, res) {
    productsController.getProducts(req, res, req.query.portalId, req.query.categoryId, req.query.lang, req.query.pageIndex, req.query.pageSize, req.query.orderBy, req.query.orderDir);
});

router.get('/store/roles/:portalId', function(req, res) {
    storeController.getRoles(req, res, req.params.portalId);
});

router.post('/categories/add', upload.single('files'), function(req, res) {
    categoriesController.addCategory(req, res, req.body, (req.file ? req.file.filename : null));
});

router.post('/file', upload.single('files'), function(req, res, next) {
    return storeController.saveFile(req, res, req.file);
});

router.put('/categories/update', upload.single('files'), function(req, res, next) {
    return categoriesController.updateCategory(req, res, req.body, (req.file ? req.file.filename : ""));
});

router.delete('/categories/remove/:id', function(req, res) {
    return categoriesController.removeCategory(req, res, req.params.id);
});

router.get('/people/getPeople', function(req, res) {
    peopleController.getPeople(req, res, req.query.draw, req.query.start, req.query.length, req.query.order, req.query.search);
});

router.get('/store/getSettings', function(req, res) {
    storeController.getSettings(req, res, req.query.portalId);
});

router.get('/store/getIndustries/:filter', function(req, res) {
    storeController.getIndustries(req, res, req.params.filter);
});

router.get('/people/getSalesPeople', function(req, res) {
    peopleController.getSalesPeople(req, res, (req.query.filter || ""), req.query.pageIndex, req.query.pageSize);
});

router.get('/store/getRolesByRoleGroup/:portalId/:filter', function(req, res) {
    storeController.getRolesByRoleGroup(req, res, req.params.portalId, req.params.filter);
});

router.post('/people/add', upload.single('files'), function(req, res) {
    peopleController.addPerson(req, res, req.body);
});

module.exports = router;