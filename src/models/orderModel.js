const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({

    customerName:{ type:String, required:true, trim:true },

    customerFullAddress: {street: { type: String, required: true, trim: true },

    city: { type: String, required: true, trim: true },

    pincode: { type: Number, required: true }},

    orderLineItems: { type: [], required: true },

    invoiceNumber: { type: String ,required:true, trim:true},

    status: { type: String, enum: ["GENERATED", "COMPLETED", "CANCELLED"], default:"GENERATED" },

    date: { typr:String },

    deleted: { type: Boolean, default: false }

},{timestamp:true});

module.exports = mongoose.model("Order", orderSchema)

//{id,createdAt, updatedAt,deleted,status(GENERATED, COMPLETED,CANCELLED),  invoiceNumber, customerName, 
//customerFullAddress, orderLineItems: orderLIneItem[], date}