const mongoose = require('mongoose')

const grnLineItemSchema = new mongoose.Schema({

    productName:{ type:String, require:true, trim:true },

    quantity:{ type:Number, required:true },

    stockPrice:{ type:Number, required:true},

    deleted:{ type :Boolean, default: false}

},{timestamp:true})

module.exports = mongoose.model("GrnLineItem",grnLineItemSchema)


//{id,createdAt, updatedAt,deleted,  productName, quantity, stockPrice }
