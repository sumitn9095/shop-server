const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let Product = new Schema(
    {
        id: {
            type: Number,
            default: 0,
            unique: true,
            required: true
        },
        name: {
            type: String,
        },
        category: {
            type: String,
        },
        instock: {
            type: Boolean,
        },
        price: {
            type: Number,
        },
        md: {
            type: Date
        },
        ed: {
            type: Date
        },
        imagePath: {
            type: Array
        }
    },
    {
        collection: "products",
    }
);
Product.index({ name: 'text', 'name': 'text' });
// Product.index({ 'id': 1 }, { unique: true });

// var counter = mongoose.model('counter', Product);
// var entitySchema = mongoose.Schema({
//     testvalue: { type: String }
// });
// entitySchema.pre('save', function (next) {
//     var doc = this;
//     counter.findByIdAndUpdate({ _id: 'entityId' }, { $inc: { seq: 1 } }, function (error, counter) {
//         if (error)
//             return next(error);
//         doc.testvalue = counter.seq;
//         next();
//     });
// });


module.exports = mongoose.model("Product", Product);