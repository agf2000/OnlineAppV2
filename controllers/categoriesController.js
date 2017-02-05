var db = require("../core/db");

exports.getCategories = function (req, res, portalId, lang, parentCategoryId, filter, archived, includeIsArchived) {

    var sqlInst = "";
    
    if (parentCategoryId) {
        sqlInst = "select c.*, cl.Lang, cl.CategoryDesc, cl.Message, cl.SEOPageTitle, cl.SEOName, cl.MetaDescription, cl.MetaKeywords, " +
            "(select count(pc.productid) from productcategory pc where pc.categoryid = c.categoryid) as ProductCount, " +    
            "pcl.CategoryName as ParentName from categories c " +
            " left outer join categorylang cl on cl.categoryid = c.categoryid and cl.lang = '" + lang + "'" +
            " left outer join categories pc on pc.parentcategoryid = c.categoryid" +
            " left outer join categorylang pcl on pcl.categoryid = pc.categoryid and pcl.lang = '" + lang + "'" +
            " where c.portalid = " + portalId + " and (c.archived = " + archived + " or " + includeIsArchived + " = 1)" +
            " and (isnull(c.hidden, 0) = 0 or " + includeIsArchived + " = 1) " +
            " and c.parentcategoryid = " + parentCategoryId +
            " order by pc.listorder, pcl.categoryname, c.listorder, cl.categoryname";
    } else {
        sqlInst = "select c.*, cl.Lang, cl.CategoryDesc, cl.Message, cl.SEOPageTitle, cl.SEOName, cl.MetaDescription, cl.MetaKeywords, " +
            "(select count(pc.productid) from productcategory pc where pc.categoryid = c.categoryid) as ProductCount, " +    
            "pcl.CategoryName as ParentName from categories c " +
            " left outer join categorylang cl on cl.categoryid = c.categoryid and cl.lang = '" + lang + "'" +
            " left outer join categories pc on pc.parentcategoryid = c.categoryid" +
            " left outer join categorylang pcl on pcl.categoryid = pc.categoryid and pcl.lang = '" + lang + "'" +
            " where c.portalid = " + portalId + " and (c.archived = " + archived + " or " + includeIsArchived + " = 1)" +
            " and (isnull(c.hidden, 0) = 0 or " + includeIsArchived + " = 1) " +
            " order by pc.listorder, pcl.categoryname, c.listorder, cl.categoryname";
    }

    db.querySql(sqlInst,
        function (data, err) {
            if (err) {
                res.writeHead(500, "Internal Server Error", {
                    "Content-Type": "text/html"
                });
                res.write("<html><title>500</title><body>500: Internal Server Error. Details: " + err + "</body></html>");

                res.end();
            } else {
                res.writeHead(200, {
                    "Content-Type": "application/json"
                });
                res.write(JSON.stringify(data));

                res.end();
            }
        });
};

exports.getCategoriesPermissions = function (req, res, categoryId) {

    var sqlInst = "select * from categorypermission where categoryid = " + categoryId;

    db.querySql(sqlInst,
        function (data, err) {
            if (err) {
                res.writeHead(500, "Internal Server Error", {
                    "Content-Type": "text/html"
                });
                res.write("<html><title>500</title><body>500: Internal Server Error. Details: " + err + "</body></html>");

                res.end();
            } else {
                res.writeHead(200, {
                    "Content-Type": "application/json"
                });
                res.write(JSON.stringify(data));

                res.end();
            }
        });
};

exports.getCategory = function (req, res, categoryId, lang) {

    var sqlInst = "select c.*, cl.Lang, cl.CategoryDesc, cl.Message, cl.SEOPageTitle, cl.SEOName, cl.MetaDescription, cl.MetaKeywords, " +
            "(select count(pc.productid) from productcategory pc where pc.categoryid = c.categoryid) as ProductCount, " +    
            "pcl.CategoryName as ParentName from categories c " +
            " left outer join categorylang cl on cl.categoryid = c.categoryid and cl.lang = '" + lang + "'" +
            " left outer join categories pc on pc.parentcategoryid = c.categoryid" +
            " left outer join categorylang pcl on pcl.categoryid = pc.categoryid and pcl.lang = '" + lang + "'" +
            " where c.categoryid = " + categoryId;

    db.querySql(sqlInst,
        function (data, err) {
            if (err) {
                res.writeHead(500, "Internal Server Error", {
                    "Content-Type": "text/html"
                });
                res.write("<html><title>500</title><body>500: Internal Server Error. Details: " + err + "</body></html>");

                res.end();
            } else {
                res.writeHead(200, {
                    "Content-Type": "application/json"
                });
                res.write(JSON.stringify(data));

                res.end();
            }
        });
};