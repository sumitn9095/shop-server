const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dbConfig = require("./database/db")
const helmet = require("helmet");
const path = require('path');
const { orderRoute } = require('./routes/order.route');
const { productRoute } = require('./routes/product.route')
const { userRoute } = require('./routes/user.route')
const { cartRoute } = require('./routes/cart.route');
const { get500 } = require('./controllers/error.controller');
const { eventNames } = require('./models/users');

const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();

mongoose.Promise = global.Promise;

mongoose
  .connect(dbConfig)
  .then((client) => {
  })
  .catch(console.error);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public/images")));
app.use(express.static(path.join(__dirname, "public/xlsx")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve Swagger documentation
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.get('/api/resource/:id', (req, res) => {
  // Your route logic goes here
});

app.use("/api", orderRoute);
app.use("/api", productRoute);
app.use("/api", userRoute);
app.use("/api", cartRoute);
app.use("/500", get500);

// app.use((error,req,res,next)=>{
//   //res.redirect('/500')
//   res.send({error, error:true})
// })
// const orderRoute = require(orderRoute)

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Our app is running on port ${port}`);
})



