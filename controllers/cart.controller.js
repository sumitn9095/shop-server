const Cart = require("../models/cart");
const User = require("../models/users");

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
                    instock: 1,
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

const cartItems = (req, res, next) => {
  const { email } = req.body;
  Cart.aggregate([
    {
      $match: { email: email }
    },
    {
      $unwind: { path: "$products" }
    }
  ])
    .then(response => res.send({ response }))
    .catch(err => res.send({ err }))
}
const updateQuantity = (req, res, next) => {
  const { email, productId, quantity } = req.body;
  Cart.findOneAndUpdate({ email, "products.id": productId }, { $inc: { "products.$.quantity": quantity } })
    .then(response => res.send({ response }))
    .catch(err => res.send({ err }))
}

const countProductsMoreThanOnce = (req, res, next) => {
  const { email } = req.body;
  User.aggregate([
    {
      $match: { email: email }
    },
    {
      $lookup: {
        from: "cart",
        localField: "email",
        foreignField: "email",
        pipeline: [
          {
            $match: {
              $expr: { $gt: ["products.$.quantity", 2] }
            }
          },
          {
            $count: "more than the same product"
          }
        ],
        as: "eeeeff"
      }
    }
  ])
    .then(response => res.send({ response }))
    .catch(err => res.send({ err }))
}

module.exports = { fetch_cartUserOrders, addProductToOrder, cartItems, updateQuantity, countProductsMoreThanOnce };