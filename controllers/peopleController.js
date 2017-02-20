var db = require("../core/db");
var util = require("util");

exports.getPeople = function (req, res, draw, start, length, order, search) {
    try {
        var searchFor = search.value,
            orderBy = '',
            orderDir = order[0].dir;

        switch (order[0].column) {
            case '1':
                orderBy = 'firstname';
                break;
            default:
                orderBy = 'personid';
                break;
        }

        var sqlInst = "select top (" + length + ") * from (select rowid = row_number() over (order by " + orderBy + " " + orderDir + "), p.*, ";
        sqlInst += "(case when p.[userid] > 0 then 1 else 0 end) as haslogin, st.[statustitle], ";
        sqlInst += "(case when not p.[telephone] = '' then '(' + substring(p.[telephone], 1, 2) + ') ' + substring(p.[telephone], 3, 4) + '-' + substring(p.[telephone], 7, 4) else '' end) as phone, ";
        sqlInst += "(case when not p.[cell] = '' then '(' + substring(p.[cell], 1, 2) + ') ' + substring(p.[cell], 3, 4) + '-' + substring(p.[cell], 7, 4) else '' end) as cellphone, ";
        sqlInst += "(case when not p.[fax] = '' then '(' + substring(p.[fax], 1, 2) + ') ' + substring(p.[fax], 3, 4) + '-' + substring(p.[fax], 7, 4) else '' end) as faxphone, ";
        sqlInst += "(case when not p.[zero800s] = '' then '(' + substring(p.[zero800s], 1, 2) + ') ' + substring(p.[zero800s], 4, 4) + '-' + substring(p.[zero800s], 7, 4) else '' end) as zero800phone, ";
        sqlInst += "(select top 1 ca.[street] from dbo.[peopleaddresses] ca where ca.[personid] = p.[personid] order by ca.[vieworder]) as street, ";
        sqlInst += "(select top 1 ca.[unit] from dbo.[peopleaddresses] ca where ca.[personid] = p.[personid] order by ca.[vieworder]) as unit, ";
        sqlInst += "(select top 1 ca.[complement] from dbo.[peopleaddresses] ca where ca.[personid] = p.[personid] order by ca.[vieworder]) as complement, ";
        sqlInst += "(select top 1 ca.[district] from dbo.[peopleaddresses] ca where ca.[personid] = p.[personid] order by ca.[vieworder]) as district, ";
        sqlInst += "(select top 1 ca.[city] from dbo.[peopleaddresses] ca where ca.[personid] = p.[personid] order by ca.[vieworder]) as city, ";
        sqlInst += "(select top 1 ca.[region] from dbo.[peopleaddresses] ca where ca.[personid] = p.[personid] order by ca.[vieworder]) as region, ";
        sqlInst += "(select top 1 ca.[postalcode] from dbo.[peopleaddresses] ca where ca.[personid] = p.[personid] order by ca.[vieworder]) as postalcode, ";
        sqlInst += "(case when (select top 1 [personid] from dbo.[estimates] where [personid] = p.[personid]) > 0 then 1 else 0 end) as locked, ";
        sqlInst += "(stuff((select ', ' + i.[industrytitle] from dbo.[industries] i inner join dbo.[peopleindustries] ci on ci.[industryid] = i.[industryid] where ci.[personid] = p.[personid] for xml path ('')), 1, 2, '')) as activities, ";
        sqlInst += "su.[displayname] as salesrepname, su.[email] as salesrepemail, count(*) over () as totalcount ";
        sqlInst += "from people p left outer join statuses st on p.statusid = st.[statusid] ";
        sqlInst += "left outer join users su on p.salesrep = su.[userid] where p.portalid = 0 ";
        sqlInst += "and ('" + searchFor + "' = '' ";
        sqlInst += "or (p.personid like '%" +  searchFor + "%') or (p.firstname like '%" +  searchFor + "%') ";
        sqlInst += "or (p.lastname like '%" +  searchFor + "%') or (p.companyname like '%" +  searchFor + "%') ";
        sqlInst += "or (p.telephone like '%" +  searchFor + "%') or (p.cell like '%" +  searchFor + "%'))";
        sqlInst += ") a where a.rowid > ((" + draw + " - 1) * " + length + ")";
        sqlInst += "select count(*) as recordstotal from people;";

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

                    var result = { 'recordsTotal': data[1][0].recordstotal, 'recordsFiltered': data[0][0].totalcount, 'data': data[0] };

                    res.write(JSON.stringify(result));
                    res.end();
                }
            }, true);
    } catch (ex) {
        res.writeHead(500, "Internal Server Error", {
            "Content-Type": "text/html"
        });
        res.write("<html><title>500</title><body>500: Internal Server Error. Details: " + ex + "</body></html>");
        res.end();
    }
};

exports.getPeoplesPermissions = function (req, res, categoryId) {
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
        sqlInst += "c.[imageurl], c.[listaltitemtemplate], cl.[seopagetitle], cl.[seoname], cl.[metadescription], cl.[metakeywords] from dbo.[Peoples] as c "
        sqlInst += "inner join dbo.[categorylang] as cl on cl.[categoryid] = c.[categoryid] and cl.[lang] = '" + lang + "' ";
        sqlInst += "left outer join dbo.[Peoples] as pc on c.[parentcategoryid] = pc.[categoryid] ";
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
            var sqlInst = "declare @id int insert into Peoples ([portalid], [archived], [createdbyuser], [createdondate], [parentcategoryid], [listorder], [hidden], [imagefile]) ";
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
            var sqlInst = util.format("update Peoples set portalid = %d, archived = '%s', parentcategoryid = %d, listorder = %d, " +
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
        sqlInst += " delete from Peoples where categoryid = " + categoryId;

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
