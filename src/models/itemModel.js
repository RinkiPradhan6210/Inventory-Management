const mongoose = require('mongoose')

const itemSchma = new mongoose.Schema({

    productName:{ type:String, unique:true, required:true, trim:true },

    quantity:{ type:Number, required:true },

    stockPrice:{ type: Number, required:true },

    sellPrice:{ type: Number, required:true },

    deleted:{ type:Boolean, default:false}
    
},{timestamp:true});

module.exports = mongoose.model("Item", itemSchma);

//{ id,createdAt, updatedAt,deleted, productName(unique), quantity, stockPrice, sellPrice }
