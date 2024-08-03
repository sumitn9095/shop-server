const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dbConfig = require("./database/db")
const helmet = require("helmet");
const path = require('path');
const { orderRoute } = require('./routes/order.route');
const { productRoute } = require('./routes/product.route')
const { userRoute } = require('./routes/user.route')
const {get500} = require('./controllers/error.controller');
const { eventNames } = require('./models/users');


const app = express();


mongoose.Promise = global.Promise;

mongoose
  .connect(dbConfig)
  .then((client) => {
  })
  .catch(console.error);

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials',true);
    next();
});
app.use(helmet({crossOriginResourcePolicy: false}));
app.use(cors());
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({ extended : true }));
app.use(express.json());

app.use("/api",orderRoute);
app.use("/api",productRoute);
app.use("/api",userRoute);
app.use("/500",get500);

// app.use((error,req,res,next)=>{
//   //res.redirect('/500')
//   res.send({error, error:true})
// })
// const orderRoute = require(orderRoute)

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`Our app is running on port ${port}`);
})



