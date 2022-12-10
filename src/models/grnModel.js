const mongoose = require('mongoose')

const grnSchema = new mongoose.Schema({

    vendorName: { type: String, required: true, trim:true },

    vendorFullAddress: {
        street: { type: String, required: true, trim: true },

        city: { type: String, required: true, trim: true },

        pincode: { type: Number, required: true }
    },
    invoiceNumber: { type: String, trim:true },

    grnLineItems: { type: [], required: true },

    status: { type: String, enum:["GENERATED", "COMPLETED", "CANCELLED"], default:"GENERATED"},

    date: { type:String },

    deleted: { type: Boolean, default: false }

}, { timestamp: true });

module.exports = mongoose.model("Grn", grnSchema)



//{id,createdAt, updatedAt, deleted, status(GENERATED,COMPLETED, CANCELLED),  invoiceNumber, vendorName, vendorFullAddress, grnLineItems: grnLineItem[] , date }
