var db = require("../core/db");
var _ = require("lodash");

exports.getProducts = function (req, res, PortalId, CategoryId, Lang, PageIndex, PageSize, OrderBy, OrderDir) { //, SearchField, SearchString, GetArchived, FeaturedOnly, OnSale, ReturnLimit, SearchDescription, IsDealer, GetDeleted, ProviderList, StartingDate, EndingDate, FilterDates, CategoryList, ExcludeFeatured) {

    /*var defaults =
        {
            portalId: "0",
            categoryId: "null",
            lang: "pt-br",
            pageIndex: "1",
            pageSize: "10",
            orderBy: "productname",
            orderDir: "asc",
            searchfor: ""
        };*/
    // { SearchField: "All"},
    // { SearchString: ""},
    // { GetArchived: "null"},
    // { FeaturedOnly: "null"},
    // { ReturnLimit: ""},
    // { OnSale: "null"},
    // { SearchDescription: 0},
    // { IsDealer: "null"},
    // { GetDeleted: "null"},
    // { ProviderList: ""},
    // { StartingDate: "null"},
    // { EndingDate: ""},
    // { FilterDates: "All"},
    // { CategoryList: ""},
    // { ExcludeFeatured: "" }

    var defaults = {
        portalId: "0",
        categoryId: "null",
        lang: "pt-br",
        pageIndex: "1",
        pageSize: "10",
        orderBy: "productname",
        orderDir: "asc",
        searchfor: ""
    };

    var options = {
        portalId: PortalId,
        categoryId: CategoryId,
        lang: Lang,
        pageIndex: PageIndex,
        pageSize: PageSize,
        orderBy: OrderBy,
        orderDir: OrderDir
    };

    function replaceUndefinedOrNull(key, value) {
        if (value === null || value === undefined || value === "") {
            return undefined;
        }

        return value;
    };

    options = JSON.stringify(options, replaceUndefinedOrNull);
    options = JSON.parse(options);

    var params = _.assign(defaults, options);

    switch (params.orderBy) {
        case 'productname':
            if (params.orderDir === 'desc') {
                params.orderBy = "pl.productname desc, p.productref desc";
            } else {
                params.orderBy = "pl.productname, p.productref";
            }
            break;
        case 'unitvalue':
            if (params.orderDir === 'desc') {
                params.orderBy = "dbo.fgetproductbaseprice(p.productid) desc, pl.productname desc, p.productref desc";
            } else {
                params.orderBy = "dbo.fgetproductbaseprice(p.productid), pl.productname, p.productref";
            }
            break;
        default:
            params.orderBy = "pl.productname, p.productref";
            break;
    };

    var sqlInst = "select top (" + params.pageSize + ") * from (select rowid = row_number() over (order by " + params.orderBy + " " + params.orderDir + "), p.*, " +
        "isnull((select count(pi.[productid]) from productimage as pi where pi.[productid] = p.[productid]), 0) as ProductImagesCount, " +
        "isnull((select count(po.[optionid]) from productoption as po where po.[productid] = p.[productid]), 0) as ProductOptionsCount, " +
        "isnull((select count(pr.[relatedid]) from productrelated as pr where pr.[productid] = p.[productid]), 0) as ProductsRelatedCount, " +
        "isnull((stuff((select '', 'c_' + convert(varchar, pc.[categoryid]) + ':' + cl.[categoryname] from productcategory pc inner join categorylang as cl on pc.[categoryid] = cl.[categoryid] where pc.[productid] = p.productid for xml path('')), 1, 2, '') ), '') as CategoriesNames, " +
        "(case when getdate() between p.[saleenddate] and p.[salestartdate] then isnull(pf.[finan_special_price], 0) else isnull(pf.[finan_sale_price], 0) end) as UnitValue, " +
        "(case when exists (select 1 from productoption po where p.[productid] = po.[productid]) then isnull((select sum(pov.[qtystockset]) from productoption pov where  pov.[productid] = p.[productid]), 0) + [qtystockset] else [qtystockset] end) as Stock, " +
        "(select top 1 productimageid from productimage where [productid] = p.[productid] order by [listorder]) as ProductImageid, " +
        "(select top 1 extension from productimage where [productid] = p.[productid] order by [listorder]) as Extension, " +
        "(case when (select count(*) from estimateitems where [productid] = p.[productid]) > 0 then 1 else 0 end) as Locked, " +
        "isnull(pf.[finan_icms], 18) as Finan_ICMS, isnull(pf.[finan_cst], '060') as Finan_CST, pf.[Finan_Manager], pf.[Finan_Cost], pf.[Finan_Salesperson], " +
        "pf.[Finan_Rep], pf.[Finan_Tech], pf.[Finan_Telemarketing], pf.[Finan_Special_Price], pf.[Finan_Sale_Price], TotalRows = count(*) over() " +
        "from products p inner join productfinance as pf on p.productid = pf.productid left outer join unittypes as ut on p.productunit = ut.unittypeid " +
        "inner join productlang as pl on p.productid = pl.productid and pl.lang = '" + params.lang + "' where p.portalid = " + params.portalId + params.searchfor + ") " +
        "a where a.rowid > ((" + params.pageIndex + " - 1) * " + params.pageSize + ")";

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

exports.getProduct = function (req, res, productId, orderBy, orderDir) {

    if (orderBy == "referencia") {
        orderBy = "p.referência";
    }

    var sqlInst = "select p.codigo, p.nome, p.cod_barras, p.estoque, p.tipo, p.preco, p.desc_compl, p.estoquereservado, p.precoatacado, p.descrevenda, " +
        "cast(dbo.isnegative(cast(isnull(preco - (select descontoporquant from dbo.parametros_produto as pp where (codproduto = p.codigo)) * dbo.fc_divisao_por_zero(preco) / 100, 0) as decimal(18, 6)), 0) as decimal(18, 6)) as precoatacado, " +
        "isnull((select sum(er.reservado) from dbo.estoquereservado er where (er.codproduto = p.codigo)), 0) as estoquereservado, p.promocaoativo, " +
        "(select top (1) nome from unidade where codigo = p.unidade) as nomeunidade, p.referência as referencia, p.promocaoqtderestante, " +
        "(select top 1 codigo from Produto where " + orderBy + " " + (orderDir == "asc" ? "<" : ">") + " p." + orderBy + " order by " + orderBy + (orderDir == "desc" ? "" : " desc") + ") as anterior, " +
        "(select top 1 codigo from Produto where " + orderBy + " " + (orderDir == "asc" ? ">" : "<") + " p." + orderBy + " order by " + orderBy + (orderDir == "desc" ? " desc" : "") + ") as proximo " +
        "from view_produto p where codigo = " + productId;

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