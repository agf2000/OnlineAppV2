var db = require("../core/db");
var util = require("util");

exports.getCategories = function (req, res, portalId, lang, parentCategoryId, filter, archived, includeIsArchived) {
    try {
        var sqlInst = "";

        sqlInst = "select c.[categoryid], cl.[lang], cl.[categoryname], cl.[categorydesc], cl.[message], c.[portalid], c.[archived], c.[hidden], c.[createdbyuser], ";
        sqlInst += "c.[createdondate], c.[modifiedbyuser], c.[modifiedondate], c.[parentcategoryid],pcl.[categoryname] as parentname, c.[listorder], c.[producttemplate], ";
        sqlInst += "c.[listitemtemplate], c.[listaltitemtemplate], c.[imageurl], cl.[seopagetitle], cl.[seoname], cl.[metadescription], cl.[metakeywords], ";
        sqlInst += "(select count(pc.[productid]) from dbo.[productcategory] as pc where pc.[categoryid] = c.[categoryid]) as productcount ";
        sqlInst += "from dbo.[categories] as c left outer join dbo.[categorylang] as cl on cl.[categoryid] = c.[categoryid] and cl.[lang] = 'pt-br' ";
        sqlInst += "left outer join dbo.[categories] as pc on c.[parentcategoryid] = pc.[categoryid] ";
        sqlInst += "left outer join dbo.[categorylang] as pcl on pcl.[categoryid] = pc.[categoryid] and pcl.[lang] = 'pt-br' where c.[portalid] = " + portalId;
        sqlInst += " and (c.[archived] = " + archived + " or " + includeIsArchived + " = 1) and (isnull(c.[hidden], 0) = 0 or " + includeIsArchived + " = 1) ";
        if (parentCategoryId) {
            sqlInst += " and c.parentcategoryid = " + parentCategoryId;
        }
        sqlInst += "order by pc.[listorder], pcl.[categoryname], c.[listorder], cl.[categoryname]";

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
        var sqlInst = "select c.[categoryid], cl.[lang], cl.[categoryname], cl.[categorydesc], cl.[message], c.[portalid], c.[archived], c.[hidden], c.[createdbyuser], ";
        sqlInst += "c.[createdondate], c.[modifiedbyuser], c.[modifiedondate], c.[parentcategoryid], pcl.[categoryname] as parentname, c.[listorder], c.[producttemplate], ";
        sqlInst += "(select count(pc.[productid]) from dbo.[productcategory] as pc where  pc.[categoryid] = c.[categoryid]) as productcount, c.[listitemtemplate], ";
        sqlInst += "c.[imageurl], c.[listaltitemtemplate], cl.[seopagetitle], cl.[seoname], cl.[metadescription], cl.[metakeywords] from dbo.[categories] as c "
        sqlInst += "inner join dbo.[categorylang] as cl on cl.[categoryid] = c.[categoryid] and cl.[lang] = '" + lang + "' ";
        sqlInst += "left outer join dbo.[categories] as pc on c.[parentcategoryid] = pc.[categoryid] ";
        sqlInst += "left outer join dbo.[categorylang] as pcl on pcl.[categoryid] = pc.[categoryid] and pcl.[lang] = '" + lang + "' where  c.[categoryid] = " + categoryId;

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

exports.addCategory = function (req, res, reqBody, fileName) {
    try {
        if (!reqBody) throw new Error("Input not valid");
        var data = reqBody;
        if (data) {
            var sqlInst = "declare @id int insert into categories ([portalid], [archived], [createdbyuser], [createdondate], [parentcategoryid], [listorder], [hidden], [imagefile]) ";
            sqlInst += util.format("values (%d, '%s', %d, '%s', %d, %d, '%s', '%s') set @id = scope_identity() ",
                data.portalId, data.archived, data.createdByUser, data.createdOnDate, data.parentCategoryId, data.listOrder, data.hidden, fileName);
            sqlInst += "insert into categorylang ([categoryid], [lang], [categoryname], [categorydesc], [seoname], [metadescription], [metakeywords], [seopagetitle]) ";
            sqlInst += util.format("values (@id, '%s', '%s', '%s', '%s', '%s', '%s', '%s') ", data.lang, data.categoryName, data.categoryDesc,
                data.seoName, data.metaDescription, data.metaKeywords, data.seoPageTitle);
            if (data.categorySecurityData) {
                var permissions = JSON.parse(data.categorySecurityData);
                permissions.forEach(function (perm) {
                    sqlInst += util.format("insert into categoryPermission (categoryid, permissionid, roleid, canedit) values (@id, %d, %d, '%s') ",
                        perm.PermissionId, perm.RoleID, perm.CanEdit);
                });
            }
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

exports.updateCategory = function (req, res, reqBody, fileName) {
    try {
        if (!reqBody) throw new Error("Input not valid");
        var data = reqBody;
        if (data) {
            var sqlInst = util.format("update categories set portalid = %d, archived = '%s', parentcategoryid = %d, listorder = %d, " +
                "[hidden] = '%s', imageFile = '%s', modifiedbyuser = %d, modifiedondate = '%s' where categoryid = %d ", data.portalId,
                data.archived, data.parentCategoryId, data.listOrder, data.hidden, fileName, data.modifiedByUser, data.modifiedOnDate, data.categoryId);
            sqlInst += util.format("update categorylang set lang = '%s', categoryname = '%s', categorydesc = '%s', seoname = '%s', " +
                "metadescription = '%s', metakeywords = '%s', seopagetitle = '%s' where categoryid = %d ", data.lang, data.categoryName, data.categoryDesc,
                (data.seoName || data.categoryName), data.metaDescription, data.metaKeywords, (data.seoPageTitle || data.categoryName), data.categoryId);

            if (data.categorySecurityData) {
                var permissions = JSON.parse(data.categorySecurityData);
                sqlInst += "delete from categoryPermission where categoryid = " + data.categoryId;
                permissions.forEach(function (perm) {
                    sqlInst += util.format("insert into categoryPermission (categoryid, permissionid, roleid, canedit) values (%d, %d, %d, '%s') ",
                        data.categoryId, perm.PermissionId, perm.RoleID, perm.CanEdit);
                });
            }

            db.querySql(sqlInst, function (data, err) {
                if (err) {
                    res.send(err);
                } else {
                    res.send('{ "Result": "success" }');
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
        var sqlInst = "delete from categoryPermission where categoryid = " + categoryId;
        sqlInst += " delete from categorylang where categoryid = " + categoryId;
        sqlInst += " delete from productcategory where categoryid = " + categoryId;
        sqlInst += " delete from categories where categoryid = " + categoryId;

        db.querySql(sqlInst, function (data, err) {
            if (err) {
                res.send(err);
            } else {
                res.send('{ "Result": "success" }');
            }
        });
    } catch (ex) {
        res.send(ex);
    }
};
