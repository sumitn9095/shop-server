const Product = require('../models/products');

const fetchAllProducts = (req,res,next) => {
    Product.find()
    .then(products=>res.send({products}))
    .catch(err=>res.send({err}))
}

const filterProducts = (req,res,next) => {
    const {name, category, instock,priceFrom, priceTo, date} = req.body;

    console.log("req.body",req.body);
    
    let matchQuery = {};
    if(name) {
        matchQuery = {
            $text: { $search : `\"${name}\"` }
        };
    }
    if(category && category !== 'All') matchQuery.category = category;
    matchQuery.price = {$gte: priceFrom, $lt: priceTo};
    if(date && date[0]) {
        matchQuery.md = {$gte: new Date(date[0])};
        matchQuery.ed = {$lt: new Date(date[1])};
    }
    if(!instock) {
        matchQuery.instock = false;
    } else {
        matchQuery.instock = true;
    }

    console.log("matchQuery",matchQuery);

   // $text: { $search : `\"${name}\"` }

    // console.log("matchQuery",matchQuery);

    // {
    //     $text: {$search: `\"${sQ.Basin}\"`}
    // }

    //Product.createIndex( { name: "text" } )
  //  Product.createIndexes( { name: "text" } )

    Product.aggregate([
        {
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

           $match : 
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
    .then(products=>{
        return res.send({products})
        console.log("products.length",products.length)
        // if(products.length === 0) {
        //     fetchAllProducts().then(allProducts => {
        //         return res.send({products:allProducts})
        //     })
        // }
        // return res.send({products:allProducts});
    })
    .catch(err => {
        console.log(err)
        return res.send({err})
    })
}


const getCategories = (req, res, next) => {
    Product.distinct("category")
    .then(categories=>res.send({categories}))
    .catch(err=>res.send({err}))
}


const getMaxProductPrice = (req, res, next) => {
    Product.aggregate([
        {
            $sort: {
                price:-1
            }
        },
        {
            $project: {
                name:1,
                id:1,
                price:1
            }
        },
        {
            $limit:1
        }
    ])
    .then(product=>res.send({product}))
    .catch(err=>res.send({err}))
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
    .then(exp=>res.send({exp}))
    .catch(err=>res.send({err}))
}




module.exports = {fetchAllProducts, filterProducts, getCategories, exp, getMaxProductPrice};