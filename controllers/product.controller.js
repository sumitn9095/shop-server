const Product = require('../models/products');
const OrderedProducts = require('../models/orderedProducts');
const puppeteer = require('puppeteer');
const excel = require("exceljs");
const XLSX = require("xlsx");
const fs = require("fs");
const moment = require("moment");


const fetchAllProducts = async (req, res, next) => {
    Product.find()
        .then(products => res.send({ products }))
        .catch(err => res.send({ err }))
}

const fetchProduct = (req, res, next) => {
    const { id } = req.params;
    Product.findOne({ id: id })
        .then(product => res.send(product))
        .catch(err => res.send(err))
}

const fetchP = (req, res, next) => {
    return Product.find()
        .then(products => products)
        .catch(err => res.send({ err }))
}

const countDocs = async (email) => {
    return Product.countDocuments(email)
        // return OrderedProducts.aggregate([
        //     {
        //         $match: { email: email }
        //     },
        //     {
        //         $lookup: {
        //             from: 'products',
        //             localField: 'id',
        //             foreignField: 'id',
        //             as: "ww",
        //             pipeline: [
        //                 { $group: { _id: null, myCount: { $sum: 1 } } },
        //                 { $project: { _id: 0 } }
        //             ]
        //         }
        //     }
        // ])
        .then(count => count)
        .catch(err => err)
}

const processfilterProducts = (payload) => {
    const { name, category, instock, priceFrom, priceTo, orderId, date } = payload;
    //console.log("req.body", req.body);


    // ---------- building Query ---- start -----------
    let matchQuery = {};
    if (name) {
        matchQuery = {
            $text: { $search: `\"${name}\"` }
        };
    }
    if ((category !== 'All') && category.length != 0) matchQuery.category = category;
    if ((priceFrom !== undefined && priceFrom !== 0) || (priceTo !== undefined && priceTo !== 0)) matchQuery.price = { $gte: priceFrom, $lt: priceTo };
    if (date !== undefined && date.length !== 0 || (date && date[0])) {
        matchQuery.md = { $gte: new Date(date[0]) };
        matchQuery.ed = { $lt: new Date(date[1]) };
    }
    if (instock !== undefined && typeof instock !== 'object') matchQuery.instock = instock;
    //else matchQuery.instock = true;
    // ---------- building Query ---- end -----------



    console.log("matchQuery", matchQuery);

    // $text: { $search : `\"${name}\"` }

    // console.log("matchQuery",matchQuery);

    // {
    //     $text: {$search: `\"${sQ.Basin}\"`}
    // }

    //Product.createIndex( { name: "text" } )
    //  Product.createIndexes( { name: "text" } )

    return Product.aggregate([

        // $match: { 
        //     $expr: {
        //         $or: [
        //             // {
        //             //     $cond: [ { $eq: [ "$name", name ] }, {$eq: ["$name",name]},  {$ne:["$name","all"]}],
        //             //     // $or: [
        //             //     //     {$eq: ["$name",name]},
        //             //     //     {$ne:["$name","all"]}
        //             //     // ]
        //             // }

        //             // {$eq: ["$name", { $or: [{$eq:[name === undefined || name === null ? '' : name]},{$ne:''}] }]},

        //             matchQuery
        //         ]
        //     }
        // }

        {
            $match:
                // {
                //     $text: { $search : `\"${name}\"` },
                //     category: category
                // }
                // $cond: [ 
                //     { $eq: [ name, name ] }, name,  "all"
                // ],

                //name: name !== undefined ? name : "all"
                matchQuery
        }

    ])
}

const filterProducts = (req, res, next) => {
    processfilterProducts(req.body).then(products => {
        return res.send({ products })
        //return products
        console.log("products.length", products.length)
        // if(products.length === 0) {
        //     fetchAllProducts().then(allProducts => {
        //         return res.send({products:allProducts})
        //     })
        // }
        // return res.send({products:allProducts});
    })
        .catch(err => {
            console.log(err)
            return res.send({ err })
        })
}



const getCategories = (req, res, next) => {
    Product.distinct("category")
        .then(categories => res.send({ categories }))
        .catch(err => res.send({ err }))
}

const getMaxProductPrice = (req, res, next) => {
    Product.aggregate([
        {
            $sort: {
                price: -1
            }
        },
        {
            $project: {
                name: 1,
                id: 1,
                price: 1
            }
        },
        {
            $limit: 1
        }
    ])
        .then(product => res.send({ product }))
        .catch(err => res.send({ err }))
}

const exp = (req, res, next) => {
    Product.aggregate([
        {
            $group: {
                _id: "$category",
                amt: { $sum: "$price" }
            }
        }
    ])
        .then(exp => res.send({ exp }))
        .catch(err => res.send({ err }))
}

const editProduct = (req, res, next) => {
    const data_body = JSON.parse(JSON.stringify(req.body));
    const { id, name, category, md, ed, price, instock } = data_body;
    console.log("FILE---", req.files);
    let flArr = [];
    let updatePayload = {}
    if (req.files.length) {
        req.files.map(fl => {
            flArr.push(fl.filename);
        })
        updatePayload = { name, category, md, ed, price, instock, imagePath: flArr }
    } else {
        updatePayload = { name, category, md, ed, price, instock }
    }
    Product.findOneAndUpdate({ id }, { $set: { ...updatePayload } })
        .then(product => res.send({ product }))
        .catch(err => res.send({ err }))
}

const removeProduct = (req, res, next) => {
    const { id } = req.params;
    console.log('prd', id)
    Product.findByIdAndDelete(id)
        .then(product => res.send({ product }))
        .catch(err => res.send({ err }))
}

const removeProductImg = (req, res, next) => {
    const { productId, productImg } = req.body.payload;
    console.log("req.body;", req.body)
    Product.findOneAndUpdate({ id: productId }, { $pull: { imagePath: { $in: [productImg] } } })
        .then(product => res.send({ product }))
        .catch(err => res.send({ err }))
}

const addNewProduct = async (req, res, next) => {
    const data_body = JSON.parse(JSON.stringify(req.body));
    let incnum = Math.random() * 7888888;
    let incnum2 = Math.floor(incnum)
    const { email, name, category, md, ed, price, instock } = data_body;
    console.log("data_body---", data_body)
    let countDoc = await countDocs(email);
    console.log("countDoc", countDoc);
    Product.create({ id: incnum2, name, category, md, ed, price, instock })
        .then(product => res.send({ product }))
        .catch(err => res.send({ err }))
}

async function downloadPDF(req, res, next) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('http://localhost:4200/signin', { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4', path: 'public/images/products.pdf' });
    await browser.close().then(g => res.send(pdf)).catch(err => res.send(err));
}

// const downloadPDF = (req, res, next) => {
//     generateProductsPDF().then(pdf => {
//         // res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length })
//         //const ui8 = new Uint8Array(pdf);
//         //let hjk = pdf.arraybuffer();
//         res.setHeader("Access-Control-Expose-Headers", "Content-Disposition"); //IMPORTANT FOR React.js content-disposition get Name
//         res.setHeader("Content-Type", "application/pdf");
//         res.setHeader("Content-Disposition", `attachment; filename=ff-pp.pdf`);

//         res.send(pdf)
//     })
// }

downloadProductExcel = async (req, res, next) => {
    const { email, category, query } = req.body;

    try {
        // countDocs(email).then(countDoc => console.log("countDoc", countDoc))

        var taskList = [];

        //taskList = await fetchP();
        taskList = await processfilterProducts(req.body);

        if (!taskList.length) return res.status(500).send({ error: true, message: 'No products match filter' })

        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("data", {
            views: [{ state: "frozen", xSplit: 1, ySplit: 1 }],
        });
        let columnJSON = JSON.parse(JSON.stringify(taskList[0]));

        delete columnJSON._id;
        delete columnJSON.id;
        delete columnJSON.imagePath;

        worksheet.columns = Object.keys(columnJSON).map((column, index) => {
            return { header: column, key: column, width: 30 };
        });

        //------//------- console.log("worksheet.columns", worksheet.columns);

        worksheet.addRows(taskList);

        ["A1", "B1", "C1", "D1", "E1", "F1"].forEach(cell => {
            worksheet.getCell(cell).fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "ff1e232f" }
            };
            worksheet.getCell(cell).font = {
                bold: true,
                color: { argb: "ffffffff" }
            }
        });

        res.setHeader("Access-Control-Expose-Headers", "Content-Disposition"); //IMPORTANT FOR React.js content-disposition get Name
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename=aaa-chart-data.xlsx`);

        return workbook.xlsx.write(res).then(function (workbook_write_res) {
            res.end();
        });

    } catch (error) {
        if (req.fileValidationError) {
            res.status(500).send({ message: req.fileValidationError });
        } else {
            res.send({ error: error.message });
        }
    }
}

uploadProductExcel = async (req, res, next) => {
    const { email, admin, replace } = req.body;
    try {
        if (!admin) return res.status(500).send({ message: "Only Admin can Upload Produts", error: true });
        let countDoc = 0;
        if (replace !== 'replace') {
            let remainingDocsToInsert = 0;
            countDoc = await countDocs(email);
        }

        //console.log("countDoc", countDoc);

        let fileName = req.file.filename;

        let workbook = XLSX.readFile(`./public/xlsx/${fileName}`);
        let sheetNames = workbook.SheetNames;

        data = {
            data: XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]], { raw: false, defval: "" }),
        };

        if (data.data.length === 0) {
            res.status(422).send({ message: 'Invalid File, please check and upload correct file', error: 'INVALID_FILE' });
            /** Delete Upload Temp File */
            fs.unlink(`public/xlsx/${fileName}`, function (err) {
                if (err) throw err;
                // if no error, file has been deleted successfully
                // console.log("File deleted!","data.data.length === 0");
            });
            //saveTask(uniqueTaskId, 'FG-SLOB', 'upload', 'error', '');
            return;
        }

        data.data.map(s => {
            console.log("excel data", s);
            if (s.md) {
                let tt = moment(s?.md).format("YYYY-MM-DD");
                s.md = tt
            }
            if (s.ed) {
                let tt = moment(s?.ed).format("YYYY-MM-DD");
                s.ed = tt
            }
            let incnum = Math.random() * 7888888;
            s.id = incnum;

            // s.md = moment(s?.md).format("YYYY-MM-DD");
            // s.ed = moment(s?.ed).format("YYYY-MM-DD");
            // let isOverBoolean = (/true/).test(s.isOver);
            // s.isOver = isOverBoolean;
            // s.priority = Number(s.priority);
            // s.subTasks = JSON.parse(s.subTasks);
            // s.category = JSON.parse(s.category);
            // s.email = req.body.email;

            if (s.__v) delete s.__v;
            if (s.instock === undefined || s.instock === '' || !s.instock) s.instock = false;
        });


        //console.log("data.data", data.data);
        console.log("data.data --- UPLOADED DATA", data.data, replace);

        if (replace !== 'replace') remainingDocsToInsert = 10 - countDoc;
        else {
            remainingDocsToInsert = 10;
            Product.deleteMany({})
                .then(products => {
                    console.log("delete many", products)
                })
        }

        if (remainingDocsToInsert <= 0) res.status(500).send({ message: 'Showroom Products are already full.' });
        else {
            let insertManyReq = Product.insertMany(data.data, { limit: remainingDocsToInsert });
            insertManyReq.then((response) => {
                res.status(200).send({ message: "Upload request initiated successfully", data: data.data });
            }).catch((error) => {
                res.status(500).send({ message: error });
            });
            //console.log("insertMany",jhk)
            fs.unlink(`public/xlsx/${fileName}`, function (err) {
                if (err) throw err;
                // if no error, file has been deleted successfully
                //console.log("File deleted!");
            });
        }
    } catch (err) {
        if (req.fileValidationError) {
            res.status(500).send({ message: req.fileValidationError });
        } else {
            // console.log("Error /uploadTasks ", err);
            res.status(500).send({ err, message: 'ssome error', error: true, });
        }
    }
}

module.exports = { fetchAllProducts, fetchProduct, filterProducts, getCategories, exp, getMaxProductPrice, addNewProduct, removeProduct, editProduct, removeProductImg, downloadPDF, downloadProductExcel, uploadProductExcel };