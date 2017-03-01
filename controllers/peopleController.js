var db = require("../core/db");
var util = require("util");

exports.getPeople = function(req, res, draw, start, length, order, search) {
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
        sqlInst += "or (p.personid like '%" + searchFor + "%') or (p.firstname like '%" + searchFor + "%') ";
        sqlInst += "or (p.lastname like '%" + searchFor + "%') or (p.companyname like '%" + searchFor + "%') ";
        sqlInst += "or (p.telephone like '%" + searchFor + "%') or (p.cell like '%" + searchFor + "%'))";
        sqlInst += ") a where a.rowid > ((" + draw + " - 1) * " + length + ")";
        sqlInst += "select count(*) as recordstotal from people;";

        db.querySql(sqlInst,
            function(data, err) {
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

exports.getPeoplesPermissions = function(req, res, categoryId) {
    try {
        var sqlInst = "select * from categorypermission where categoryid = " + categoryId;

        db.querySql(sqlInst,
            function(data, err) {
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

exports.getSalesPeople = function(req, res, filter, pageIndex, pageSize) {
    try {
        var searchFor = filter;

        var sqlInst = "select top (" + pageSize + ") * from (select rowid = row_number() over (order by p.displayname asc), p.*, ";
        sqlInst += "(case when not p.[telephone] = '' then '(' + substring(p.[telephone], 1, 2) + ') ' + substring(p.[telephone], 3, 4) + '-' + substring(p.[telephone], 7, 4) else '' end) as phone, ";
        sqlInst += "(case when not p.[cell] = '' then '(' + substring(p.[cell], 1, 2) + ') ' + substring(p.[cell], 3, 4) + '-' + substring(p.[cell], 7, 4) else '' end) as cellphone, ";
        sqlInst += "(case when not p.[fax] = '' then '(' + substring(p.[fax], 1, 2) + ') ' + substring(p.[fax], 3, 4) + '-' + substring(p.[fax], 7, 4) else '' end) as faxphone, ";
        sqlInst += "(case when not p.[zero800s] = '' then '(' + substring(p.[zero800s], 1, 2) + ') ' + substring(p.[zero800s], 4, 4) + '-' + substring(p.[zero800s], 7, 4) else '' end) as zero800phone, ";
        sqlInst += "count(*) over () as totalcount ";
        sqlInst += "from people p where p.portalid = 0 ";
        sqlInst += "and p.salesperson = 1 and ('" + searchFor + "' = '' ";
        sqlInst += "or (p.personid like '%" + searchFor + "%') or (p.firstname like '%" + searchFor + "%') ";
        sqlInst += "or (p.lastname like '%" + searchFor + "%') or (p.displayname like '%" + searchFor + "%')) ";
        sqlInst += ") a where a.rowid > ((" + pageIndex + " - 1) * " + pageSize + ")";

        db.querySql(sqlInst,
            function(data, err) {
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

                    res.write(JSON.stringify(data).replace(/"([\w]+)":/g, function($0, $1) {
                        return ('"' + $1.toLowerCase() + '":');
                    }));

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

exports.addPerson = function(req, res, reqBody) {
    try {
        if (!reqBody) throw new Error("Input not valid");
        var data = reqBody;
        if (data) {
            var sqlInst = "declare @id int insert into people (portalid, persontype, statusid, displayname, firstname, registertypes, createdbyuser, createdondate ";

            if (data.salesRep) sqlInst += ", salesrep";
            if (data.comments !== '') sqlInst += ", comments";
            if (data.telephone) sqlInst += ", telephone";
            if (data.cell) sqlInst += ", cell";
            if (data.fax) sqlInst += ", fax";
            if (data.zero0800s !== '') sqlInst += ", zero800s";
            if (data.email) sqlInst += ", email";
            if (data.ein) sqlInst += ", ein";
            if (data.cpf !== '') sqlInst += ", cpf";
            if (data.ident !== '') sqlInst += ", ident";
            if (data.stateTax !== '') sqlInst += ", statetax";
            if (data.cityTax !== '') sqlInst += ", citytax";
            if (data.website) sqlInst += ", website";
            if (data.lastName !== '') sqlInst += ", lastname";
            if (data.companyName !== '') sqlInst += ", companyname";
            if (data.salesPerson) sqlInst += ", salesperson";

            sqlInst += util.format(") values (%d, '%s', %d, '%s', '%s', '%s', %d, '%s' ",
                data.portalId, data.personType, data.statusId, (data.displayName || (data.firstName + ' ' + data.lastName).trim()), data.firstName, data.registerTypes, data.createdByUser, data.createdOnDate);

            if (data.salesRep) sqlInst += ", '" + data.salesRep + "'";
            if (data.comments !== '') sqlInst += ", '" + data.comments + "'";
            if (data.telephone) sqlInst += ", '" + data.telephone + "'";
            if (data.cell) sqlInst += ", '" + data.cell + "'";
            if (data.fax) sqlInst += ", '" + data.fax + "'";
            if (data.zero0800s !== '') sqlInst += ", '" + data.zero800s + "'";
            if (data.email) sqlInst += ", '" + data.email + "'";
            if (data.ein) sqlInst += ", '" + data.ein + "'";
            if (data.cpf !== '') sqlInst += ", '" + data.cpf + "'";
            if (data.ident !== '') sqlInst += ", '" + data.ident + "'";
            if (data.stateTax !== '') sqlInst += ", '" + data.statetax + "'";
            if (data.cityTax !== '') sqlInst += ", '" + data.citytax + "'";
            if (data.website) sqlInst += ", '" + data.website + "'";
            if (data.lastName !== '') sqlInst += ", '" + data.lastname + "'";
            if (data.companyName !== '') sqlInst += ", '" + data.companyname + "'";
            if (data.salesPerson) sqlInst += ", " + data.salesperson;

            sqlInst += ") set @id = scope_identity() ";
            sqlInst += "select @id as personid";

            db.querySql(sqlInst, function(data, err) {
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

                    res.write('{ "personid": ' + data[0].personid + ' }');

                    res.end();
                }
            });
        } else {
            throw new Error("Input not valid");
        }
    } catch (ex) {
        res.send(ex);
    }
};

exports.updateCategory = function(req, res, reqBody, fileName) {
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
                permissions.forEach(function(perm) {
                    sqlInst += util.format("insert into categoryPermission (categoryid, permissionid, roleid, canedit) values (%d, %d, %d, '%s') ",
                        data.categoryId, perm.PermissionId, perm.RoleID, perm.CanEdit);
                });
            }

            db.querySql(sqlInst, function(data, err) {
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

exports.removeCategory = function(req, res, categoryId) {
    try {
        var sqlInst = "delete from categoryPermission where categoryid = " + categoryId;
        sqlInst += " delete from categorylang where categoryid = " + categoryId;
        sqlInst += " delete from productcategory where categoryid = " + categoryId;
        sqlInst += " delete from Peoples where categoryid = " + categoryId;

        db.querySql(sqlInst, function(data, err) {
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