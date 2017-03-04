var express = require('express');
var cookieParser = require('cookie-parser');
var db = require("../core/db");

var app = express();
app.use(cookieParser());

exports.getRoles = function(req, res, portalId) {

    var sqlInst = "select * from roles";

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
};

exports.getRolesByRoleGroup = function(req, res, portalId, roleNames) {

    var sqlInst = "declare @rolenames nvarchar(50) set @rolenames = '" + roleNames + "' ";
    sqlInst += "create table #t (rolegroup nvarchar(50)) ";
    sqlInst += "declare @str varchar(50) select @str = @rolenames ";
    sqlInst += "declare @sql varchar(8000) select @sql = 'insert into #t select ' + replace(@str, ',', ' union all select ') exec(@sql) ";
    sqlInst += "select r.* from	roles r inner join rolegroups rg on r.rolegroupid = rg.rolegroupid ";
    if (isNaN(roleNames.replace(/''/g, "").split(',')[0])) {
        sqlInst += "inner join #t on rg.rolegroupname = #t.rolegroup";
    } else {
        sqlInst += "inner join #t on rg.rolegroupid = #t.rolegroup";
    }

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
};

exports.getSettings = function(req, res, portalId) {

    var sqlInst = "select * from settings";

    db.querySql(sqlInst,
        function(data, err) {
            if (err) {
                res.writeHead(500, "Internal Server Error", {
                    "Content-Type": "text/html"
                });
                res.write("<html><title>500</title><body>500: Internal Server Error. Details: " + err + "</body></html>");

                res.end();
            } else {
                /*res.writeHead(200, {
                    "Content-Type": "application/json"
                });*/

                res.cookie('StoreSettings', JSON.stringify(data).replace(/"([\w]+)":/g, function($0, $1) {
                    return ('"' + $1.toLowerCase() + '":');
                }));

                /*res.write(JSON.stringify(data).replace(/"([\w]+)":/g, function($0, $1) {
                    return ('"' + $1.toLowerCase() + '":');
                }));*/

                res.end();
            }
        });
};

exports.getIndustries = function(req, res, filter) {

    var sqlInst = "select * from industries where industrytitle like '" + filter + "%'";

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
};

exports.saveFile = function(req, res, file) {
    try {
        if (!file) throw new Error("There is no file to save.");
        var ext = file.originalname.substr(file.originalname.lastIndexOf('.') + 1);

        var sqlInst = "insert into files (portalid, filename, extension, size, width, height, contenttype, " +
            "createdbyuserid, createdondate, folder, title) ";
        sqlInst += util.format("values (%d, '%s', '%s', %d, %d, %d, '%s', %d, '%s', '%s', '%s') select scope_identity() ",
            0, file.filename, ext, file.size, 0, 0, file.mimetype, file.createdByUserId,
            file.createdOnDate, file.path, file.originalname);

        db.querySql(sqlInst, function(data, err) {
            if (err) {
                res.send(err);
            } else {
                var result = {
                    initialPreview: [
                        // 	"<img src='/uploads/" + req.file.filename + "' class='file-preview-image' alt='" + req.file.originalname + "' title='" + req.file.originalname + "'>",
                        "/uploads/" + req.file.filename
                    ],
                    // initial preview configuration
                    initialPreviewConfig: [{
                            caption: req.file.originalname,
                            width: '120px',
                            url: '/api/file/delete',
                            size: req.file.size,
                            key: data,
                            extra: { id: data }
                        }
                        // {
                        // 	caption: 'jellyfish.jpg',
                        // 	width: '120px',
                        // 	url: '/localhost/avatar/delete',
                        // 	key: 101,
                        // 	frameClass: 'my-custom-frame-css',
                        // 	frameAttr: {
                        // 		style: 'height:80px',
                        // 		title: 'My Custom Title',
                        // 	},
                        // 	extra: function () {
                        // 		return { id: $("#id").val() };
                        // 	},
                        // }
                    ],
                    append: true
                };
                res.send(result);
            }
        });
    } catch (ex) {
        res.send(ex);
    }
};