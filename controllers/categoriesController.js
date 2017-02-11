var db = require("../core/db");
var util = require("util");

exports.getCategories = function (req, res, portalId, lang, parentCategoryId, filter, archived, includeIsArchived) {
    try {
        var sqlInst = "";

        if (parentCategoryId) {
            sqlInst = "select c.*, cl.Lang, cl.CategoryName, cl.CategoryDesc, cl.Message, cl.SeoPageTitle, cl.SeoName, cl.MetaDescription, cl.MetaKeywords, ";
            sqlInst += "(select count(pc.productid) from productcategory pc where pc.categoryid = c.categoryid) as ProductCount, ";
            sqlInst += "pcl.CategoryName as ParentName from categories c ";
            sqlInst += " left outer join categorylang cl on cl.categoryid = c.categoryid and cl.lang = '" + lang + "' ";
            sqlInst += " left outer join categories pc on pc.parentcategoryid = c.categoryid ";
            sqlInst += " left outer join categorylang pcl on pcl.categoryid = pc.categoryid and pcl.lang = '" + lang + "' ";
            sqlInst += " where c.portalid = " + portalId + " and (c.archived = " + archived + " or " + includeIsArchived + " = 1) ";
            sqlInst += " and (isnull(c.hidden, 0) = 0 or " + includeIsArchived + " = 1) ";
            sqlInst += " and c.parentcategoryid = " + parentCategoryId;
            sqlInst += " order by pc.listorder, pcl.categoryname, c.listorder, cl.categoryname";
        } else {
            sqlInst = "select c.*, cl.Lang, cl.CategoryName, cl.CategoryDesc, cl.Message, cl.SeoPageTitle, cl.SeoName, cl.MetaDescription, cl.MetaKeywords, ";
            sqlInst += "(select count(pc.productid) from productcategory pc where pc.categoryid = c.categoryid) as ProductCount, ";
            sqlInst += "pcl.CategoryName as ParentName from categories c ";
            sqlInst += " left outer join categorylang cl on cl.categoryid = c.categoryid and cl.lang = '" + lang + "' ";
            sqlInst += " left outer join categories pc on pc.parentcategoryid = c.categoryid ";
            sqlInst += " left outer join categorylang pcl on pcl.categoryid = pc.categoryid and pcl.lang = '" + lang + "' ";
            sqlInst += " where c.portalid = " + portalId + " and (c.archived = " + archived + " or " + includeIsArchived + " = 1) ";
            sqlInst += " and (isnull(c.hidden, 0) = 0 or " + includeIsArchived + " = 1) ";
            sqlInst += " order by pc.listorder, pcl.categoryname, c.listorder, cl.categoryname";
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
    } catch (ex) {
        res.writeHead(500, "Internal Server Error", {
            "Content-Type": "text/html"
        });
        res.write("<html><title>500</title><body>500: Internal Server Error. Details: " + ex + "</body></html>");
        res.end();
    }
};

exports.getCategoriesPermissions = function (req, res, categoryId) {
    try {
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
    } catch (ex) {
        res.writeHead(500, "Internal Server Error", {
            "Content-Type": "text/html"
        });
        res.write("<html><title>500</title><body>500: Internal Server Error. Details: " + ex + "</body></html>");
        res.end();
    }
};

exports.getCategory = function (req, res, categoryId, lang) {
    try {
        var sqlInst = "select c.*, cl.Lang, cl.CategoryName, cl.CategoryDesc, cl.Message, cl.SeoPageTitle, cl.SeoName, ";
        sqlInst += "cl.MetaDescription, cl.MetaKeywords, (select count(pc.productid) from productcategory pc where pc.categoryid = c.categoryid) as ProductCount, ";
        sqlInst += "pcl.categoryname as ParentName from categories c inner join categorylang cl on cl.categoryid = c.categoryid and cl.lang = '" + lang + "' ";
        sqlInst += "left outer join categories pc on c.parentcategoryid = pc.categoryid left outer join categorylang pcl on pcl.categoryid = pc.categoryid and pcl.lang = '" + lang + "' ";
        sqlInst += "where c.categoryid = " + categoryId;

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
    } catch (ex) {
        res.writeHead(500, "Internal Server Error", {
            "Content-Type": "text/html"
        });
        res.write("<html><title>500</title><body>500: Internal Server Error. Details: " + ex + "</body></html>");
        res.end();
    }
};

exports.addCategory = function (req, res, reqBody) {
    try {
        if (!reqBody) throw new Error("Input not valid");
        var data = reqBody;
        if (data) {
            var sqlInst = "declare @id int insert into categories (portalid, archived, createdbyuser, createdondate, parentcategoryid, listorder) ";
            sqlInst += util.format("values (%d, '%s', %d, '%s', %d, %d) set @id = scope_identity() ",
                data.portalId, data.archived, data.createdByUser, data.createdOnDate, data.parentCategoryId, data.listOrder);
            sqlInst += "insert into categorylang (categoryid, lang, categoryname, categorydesc, seoname, seopagetitle) ";
            sqlInst += util.format("values (@id, '%s', '%s', '%s', '%s', '%s') ", data.lang, data.categoryName, data.categoryDesc, +
                data.categoryName, data.categoryName);
            sqlInst += "insert into categoryPermission (categoryid, permissionid, roleid, allowaccess) values (@id, 1, 1, 0) ";
            sqlInst += "select @id as CategoryId";

            db.querySql(sqlInst, function (data, err) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(JSON.stringify(data[0]));
                }
            });
        } else {
            throw new Error("Input not valid");
        }
    } catch (ex) {
        res.send(ex);
    }
};

exports.updateCategory = function (req, res, reqBody) {
    try {
        if (!reqBody) throw new Error("Input not valid");
        var data = reqBody;
        if (data) {
            var sqlInst = util.format("update categories set portalid = %d, archived = '%s', parentcategoryid = %d, " +
                "listorder = %d, [hidden] = '%s', modifiedbyuser = %d, modifiedondate = '%s' where categoryid = %d ", data.portalId,
                data.archived, data.parentCategoryId, data.listOrder, data.hidden, data.modifiedByUser, data.modifiedOnDate, data.categoryId);
            sqlInst += util.format("update categorylang set lang = '%s', categoryname = '%s', categorydesc = '%s', [message] = '%s', seoname = '%s', " +
                "metadescription = '%s', metakeywords = '%s', seopagetitle = '%s' where categoryid = %d ", data.lang, data.categoryName, data.categoryDesc, 
                data.message, (data.seoName || data.categoryName), data.metaDescription, data.metaKeywords, (data.seoPageTitle || data.categoryName), data.categoryId);

            if (data.categorySecurityData) {
                var permissions = JSON.parse(data.categorySecurityData);
                sqlInst += "delete from categoryPermission where categoryid = " + data.categoryId;
                permissions.forEach(function (perm) {
                    sqlInst += util.format("insert into categoryPermission (categoryid, permissionid, roleid, allowaccess) values (%d, %d, %d, '%s') ",
                        data.categoryId, perm.PermissionId, perm.RoleID, perm.AllowAccess);
                });
            }

            db.querySql(sqlInst, function (data, err) {
                if (err) {
                    res.send(err);
                } else {
                    res.send('[{ "result": "success" }]');
                }
            });
        } else {
            throw new Error("Input not valid");
        }
    } catch (ex) {
        res.send(ex);
    }
};

exports.removeCategory = function (req, res, categoryId) {
    try {
        var sqlInst = "delete from categoryPermission where categoryid = " + data.categoryId;
        sqlInst += "delete from categorylang where categoryid = " + data.categoryId;
        sqlInst += "delete from productcategory where categoryid = " + data.categoryId;
        sqlInst += "delete from categories where categoryid = " + data.categoryId;

        db.querySql(sqlInst, function (data, err) {
            if (err) {
                res.send(err);
            } else {
                res.send('[{ "result": "success" }]');
            }
        });
    } catch (ex) {
        res.send(ex);
    }
};
