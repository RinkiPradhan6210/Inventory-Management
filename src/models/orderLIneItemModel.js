const mongoose = require('mongoose')

const orderLineItemSchema = new mongoose.Schema({

    productName:{ type:String, require:true, trim:true },

    quantity:{ type:Number, required:true },

    sellPrice:{ type:Number, required:true},

    deleted:{ type :Boolean, default: false}

},{timestamp:true});

module.exports = mongoose.model("OrderLineItem", orderLineItemSchema);

//{id,createdAt, updatedAt,deleted,  productName, quantity, sellPrice }
