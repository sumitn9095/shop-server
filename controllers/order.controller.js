const Product = require("../models/products");
const User = require("../models/users");
const Order = require("../models/orders");
const Cart = require("../models/cart");
const OrderedProducts = require("../models/orderedProducts");
// --------------------- Order Collection ---------------------------------------
const fetchAll = async (req, res, next) => {
  // try {
  const { username } = req.body;
  console.log("username", username);
  User.aggregate([
    {
      $match: { name: username },
    },
    {
      $lookup: {
        from: "order",
        let: { uname: "$name" },
        //foreignField: 'userName',
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$username", "$$uname"] },
            },
          },
          {
            $lookup: {
              from: "products",
              // localField: 'products',
              // foreignField: 'id',
              let: { prod: "$products" },
              pipeline: [
                {
                  $match: {
                    $expr: { $in: ["$id", "$$prod"] },
                  },
                },
                {
                  $project: {
                    name: 1,
                    category: 1,
                    inStock: 1,
                    price: 1,
                  },
                },
              ],
              as: "newOrders",
            },
          },

          // ---- Unwind : create Each Document for Each array index -------
          { $unwind: "$products" },

          {
            $project: {
              userName: 1,
              products: 1,
              newOrders: 1,
            },
          },
        ],
        as: "userOrders123",
      },
    },
    {
      $project: {
        _id: 0,
        name: 1,
        userOrders123: 1,
      },
    },
  ])
    // res.json(result[0] || {})
    // } catch (error) {

    // }
    .then((resp) => {
      res.send({ resp });
    })
    .catch((err) => {
      //----throw err;

      //res.json({error: error.message});
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
const fetchOrders = (req, res, next) => {
  // Product.find().then(products => {
  //     res.status(200).send({products})
  // })

  let query = "pronto";

  Order.aggregate([
    {
      $lookup: {
        from: "products",
        //localField: "products",
        let: { productId: "$products" },
        //foreignField: "id",
        pipeline: [
          {
            // ------- wrong --------
            //$match: { $expr: { $eq: ["$id", "$$productId" ] } } ,

            //  $match : { parents: { $in: "$$productId"} }

            // ------ works ---------
            $match: {
              category: "fan",
              $expr: { $in: ["$id", "$$productId"] },
            },
          },
        ],
        as: "productsForOrder",
      },
    },

    // ---------- FILTER (not working)
    // {
    //     $project: {
    //     userName:1,
    //     products:1,
    //     productsForOrder: {
    //        $filter: {
    //            input: '$productsForOrder',
    //            as: 'productsForOrdr',
    //            cond: { $ne: [ '$$productsForOrdr.userName', 'zene' ] }
    //        }
    //     }
    // }}

    // { $match:
    //     {
    //        "md": { $gte: new Date( "2024-04-30" ), $lt: new Date( "2024-09-30" ) }
    //     }
    // }

    // { $match: {"productsForOrder.name" :  query}}

    // --------- works ---------
    // { $match: {$or:[ {id:{$eq:5}}, {id:{$eq:7}} ]} }
  ])
    .then((resp) => {
      res.send({ resp });
    })
    .catch((err) => {
      throw err;
    });
};
const fetchArtOrders = (req, res, next) => {
  // try{

  // } catch(err => {

  // })
  Order.aggregate([
    // -- need to 'unwind' Array Object, here.
    {
      $unwind: { path: "$art" },
    },
    {
      $lookup: {
        from: "arts",
        // -- after 'unwind' Array Object, create 'artid' variable from EACH document 'art.aid' here
        let: { artid: "$art.aid" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$id", "$$artid"] },
            },
          },
        ],
        as: "artOrders",
      },
    },
  ])
    .then((resp) => {
      res.send({ resp });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
const fetchUsers = (req, res, next) => {
  User.aggregate([
    {
      $lookup: {
        from: "order",
        localField: "name",
        foreignField: "username",
        as: "orderDetails",
      },
    },
  ])
    .then((resp) => {
      return res.send({ resp });
    })
    .catch((err) => {
      return send.status(500).send({ err });

      // // --------
      // const error = new Error(error);
      // error.httpStatusCode = 500;
      // return next(error);
    });
};

// ---------------------- Cart Collection ----------------------------------------
const fetch_cartUserOrders = async (req, res, next) => {
  // try {
  const { email } = req.body;
  console.log("email", email);
  User.aggregate([
    {
      $match: { email: email },
    },
    {
      $lookup: {
        from: "cart",
        let: { email: "$email" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$email", "$$email"] },
            },
          },
          {
            $unwind: { path: "$products" },
          },
          {
            $lookup: {
              from: "products",
              let: { prod: "$products.id" },
              //let: {artid: "$art.aid"},
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$id", "$$prod"] },
                  },
                },
                {
                  $project: {
                    _id: 0,
                    id: 1,
                    name: 1,
                    category: 1,
                    inStock: 1,
                    price: 1,
                    ed: 1,
                    md: 1,
                  },
                },
              ],
              as: "products",
            },
          },

          // ---- Unwind : create Each Document for Each array index -------
          //{ $unwind : "$products" },

          {
            $project: {
              email: 1,
              products: 1,
              products: 1,
            },
          },
        ],
        as: "cart",
      },
    },
    {
      $project: {
        _id: 0,
        name: 1,
        email: 1,
        cart: 1,
      },
    },
  ])
    // res.json(result[0] || {})
    // } catch (error) {

    // }
    .then((resp) => {
      res.send({ resp });
    })
    .catch((err) => {
      //----throw err;
      //res.json({error: error.message});
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
const addProductToOrder = (req, res, next) => {
  const { email, productId } = req.body;
  Cart.findOneAndUpdate(
    { email: email },
    { $push: { products: { id: productId } } },
    { new: true, upsert: true }
  )
    .then((products) => {
      res.send({ products });
    })
    .catch((err) => res.send({ err }));
};


const filter_orderedProducts = (req, res, next) => {
  const {email, orderId} = req.body;

}


// ---------------------- OrderedProducts Collection ----------------------------------------
const fetch_orderedProducts = async (req, res, next) => {
  const { email, orderId } = req.body;
  const { name, category, instock, priceFrom, priceTo, date } = req.body.payload;
  //console.log("req.body.payload", req.body.payload);
    // ---------- Query building --- started ----------------------
    var matchQueryArr = [{$eq: ["$id", "$$productId"]}];
    if(req.body.payload !== false) {
       // - category
      if((category !== 'All') && category.length != 0) matchQueryArr.push({$eq: ["$category", category]});
      // - instock
      if(instock.length != 0) matchQueryArr.push({$eq: ["$instock", instock]});
      // - Date
      if((date && date[0]) || date !== undefined) {
        matchQueryArr.push({$gte: ["$md",new Date(date[0])]});
        matchQueryArr.push({$lt: ["$ed",new Date(date[1])]});
      }
      // - Price
      if(priceTo !== 0) matchQueryArr.push({ $and:[ {$gte: ["$price", priceFrom]}, {$lt: ["$price", priceTo]} ] });
    }
    // ---------- Query building --- end -------------------------

  User.aggregate([
    {
      $match: { email: email },
    },
    {
      $lookup: {
        from: "orderedProducts",
        let: { email: "$email" },
        // let: { order_id: "$orderId" },
        pipeline: [
          {
            $match: {
              $and:[ {email:{$eq:email}}, {orderId:{$eq:orderId}} ]
              // $expr: { 
              //   //$eq: ["$email", "$$email"]
              //   $and:[ {$eq: ["$email", "$$email"]}, {$eq: ["$orderId", orderId]} ],
              //   { $match: {$or:[ {id:{$eq:5}}, {id:{$eq:7}} ]} }
              // }
            },
          },
          {
            $lookup: {
              from: "products",
              let: { productId: "$id" },
              //let: {artid: "$art.aid"},
              pipeline: [
                
                {
                  $match: {
                    //$and: [ {eq:{id: "$productId"}},{eq:{category: category}} ]
                    // $expr: { $eq: ["$id", "$$productId"] },

                    $expr: {
                      $and: matchQueryArr
                    },
                  },
                },
                
                // {
                //   $project: {
                //     _id: 0,
                //     id: 1,
                //     name: 1,
                //     category: 1,
                //     inStock: 1,
                //     price: 1,
                //     ed: 1,
                //     md: 1,
                //     amount: 1
                //   },
                //},
              ],
              as: "products",
            },
          },

          // ---- Unwind : create Each Document for Each array index -------
          //{ $unwind : "$products" },

          {
            $project: {
              email: 1,
              orderId: 1,
              id: 1,
              qty: 1,
              products: { $first: "$products" },
            },
          },
        ],
        as: "cart",
      },
    },
    {
      $project: {
        _id: 0,
        name: 1,
        email: 1,
        cart: 1,
        // cart: {$arrayToObject: "$cart"}
      },
    },
  ])
    .then((order) => {
      res.send({ order: order[0] , matchQueryArr});
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
const fetch_orderId = (req, res, next) => {
  const { email } = req.body;
  OrderedProducts.find({ email, order: "inProgress" })
    .limit(1)
    .then((order) => {
      // console.log("order >> is >>", order);
      return res.send({ order });
    })
    .catch((err) => res.send({ err }));
};
const addProductToOrderedProducts = (req, res, next) => {
  const { email, orderId, id, qty, order } = req.body;
  OrderedProducts.findOneAndUpdate(
    { email: email, orderId: orderId, id: id },
    { $set: { email, id, qty, order:"inProgress" } },
    { new: true, upsert: true }
  )
    .then((products) => {
      res.send({ products });
    })
    .catch((err) => res.send({ err }));
};


module.exports = {
  fetchAll,
  fetchOrders,
  fetchArtOrders,
  fetchUsers,
  fetch_cartUserOrders,
  addProductToOrder,
  addProductToOrderedProducts,
  fetch_orderedProducts,
  fetch_orderId,
};
