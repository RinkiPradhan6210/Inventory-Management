const grnModel = require("../models/grnModel.js")
const grnLineItemModel = require("../models/grnLineItemModel");
const itemModel = require("../models/itemModel.js");
const mongoose = require("mongoose")

const createGrn = async function(req,res){
    try{
        let body = req.body;
        let { vendorName, vendorFullAddress, invoiceNumber,product,grnLineItems } = body;

        if(!vendorName){return res.status(400).send({status:false, msg:"vendorName is required"})}
        let nameReg = /^[a-zA-Z]+/;
        if(!nameReg.test(vendorName)){return res.status(400).send({status:false, msg:"vendorName is invalid"})}
        if(!invoiceNumber){return res.status(400).send({status:false, msg:"invoice nubmer is required"})}
        if (!(/^[1-9]{1}[0-9]{5}$/).test(vendorFullAddress.pincode)) return res.status(400).send({ status: false, message: "invalid Pincode in customerFullAdress" })

        body.grnLineItems =[]
       
        for (let i=0;i<body.product.length;i++) {
            const product = body.product[i];

            const productName = product.name
            if(!product.name || !product.quantity){return res.status(400).send({status:false, msg:"name and quantity is required"})}
            const item = await itemModel.findOne({productName : productName})

            if(!item || item.quantity < product.quantity){return res.status(404).send({status:false, msg:"product is out of stock"})}

            const grn = await grnLineItemModel.create({ productName: product.name, stockPrice: item.stockPrice, quantity:product.quantity})
            body.grnLineItems.push(grn._id)
            
          }
        


        const grnData = await grnModel.create(body);
        return res.status(201).send({ status: true, message: "grn created successfully", data: grnData });
        

    }catch(error){
        return res.status(500).send({ status: false, message: error.message });
    }
};

const getGrn = async function(req,res){
    try{
        let grnExist = await grnModel.find({deleted:false})
        
        if(grnExist.length == 0){return res.status(404).send({status:false, msg:"grn not found"})}
        
        res.status(200).send({status:true,data:grnExist})
    }catch(error){
        return res.status(500).send({status:false,messsage:error.message})
    }
};

const updateGrn = async function(req,res){
    try{
        let grnId = req.query.grnId
      
        let body = req.body
        
        let{vendorName, vendorFullAddress, invoiceNumber,product,grnLineItems } = body;


         if(!grnId){return res.status(400).send({status:false,msg:"grnId is required"})}

        if(!mongoose.Types.ObjectId.isValid(grnId)){return res.status(400).send({status:false,msg:"grnId is invalid"})}

        let nameReg = /^[a-zA-Z]+/;
        if(vendorName && !nameReg.test(vendorName)){return res.status(400).send({status:false, msg:"vendorName is invalid"})}
        let existId = await grnModel.findById({_id:grnId,deleted:false})
        if(!existId){return res.status(400).send({status:false,msg:"grnid is not found"})}
        
          if(vendorName) existId.vendorName = vendorName;
         let {city,street,pincode} = vendorFullAddress
         if(city) existId.vendorFullAddress.city = city;
        if(street) existId.vendorFullAddress.street = street;
        if (!(/^[1-9]{1}[0-9]{5}$/).test(pincode)) return res.status(400).send({ status: false, message: "invalid Pincode in vendorFullAdress" })

        if(pincode) existId.vendorFullAddress.pincode = pincode;
        
        if(invoiceNumber) existId.invoiceNumber = invoiceNumber;
        
          let updateData = await grnModel.findByIdAndUpdate(grnId,existId,{new:true})
          return res.status(201).send({status:true, data:updateData})
    }catch(error){
        return res.status(500).send({status:false,messsage:error.message})
    }
};

const deleteGrn = async function(req,res){
    try{
        let grnId = req.query.grnId
        if(!grnId){return res.status(400).send({status:false,msg:"grnId is required"})}

        if(!mongoose.Types.ObjectId.isValid(grnId)){return res.status(400).send({status:false,msg:"grnId is invalid"})}

        let grnExist = await grnModel.findById({_id:grnId, deleted:false})
        
        if(!grnExist || grnExist.deleted == true){return res.status(404).send({status:false, msg:"grn not found"})}
        

        let deleteData = await grnModel.findByIdAndUpdate(grnId,{deleted:true},{new:true})

        res.status(200).send({status:true,msg:"grn is successfully deleted"})
    }catch(error){
        return res.status(500).send({status:false,messsage:error.message})
    }
};

const updateGrnStatus = async function(req,res){
    try{
        let grnItemId = req.query.grnItemId
        let {status,productName}= req.body
        if(!grnItemId){return res.status(400).send({status:false,msg:"grnItemId is required"})}
 
         if(!mongoose.Types.ObjectId.isValid(grnItemId)){return res.status(400).send({status:false,msg:"grnItemId is invalid"})}
 
         let grnItemExist = await grnLineItemModel.findById({_id:grnItemId},{deleted:false})
 
         if(!grnItemExist){return res.status(404).send({status:false,msg:"grnItem is not found"})}
         let itemInGrn = grnItemExist.productName
         
         let quantityInGrn= grnItemExist.quantity
         
         let itemExist = await itemModel.findOne({productName:itemInGrn},{deleted:false})
         if(!itemExist){return res.status(404).send({status:false,msg:"grnItemId is not found in db"})}
         let item = grnItemExist.productName
     
         let quantity = itemExist.quantity
        if(quantity < quantityInGrn){return res.status(404).send({status:false,msg:"items are not available"})}
         if(status == "COMPLETED"){
             itemExist.quantity = quantity - quantityInGrn 
         }
 
         let update = await itemModel.findOneAndUpdate({productName:itemInGrn},{quantity:itemExist.quantity},{new:true})
         
      return res.status(200).send({status:true,items:itemExist})
    }catch(error){
        return res.status(500).send({status:false,messsage:error.message})
    }
};
module.exports = { createGrn ,getGrn, updateGrn, deleteGrn, updateGrnStatus}