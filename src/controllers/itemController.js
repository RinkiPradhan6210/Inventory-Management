const mongoose = require('mongoose');
const itemModel = require('../models/itemModel')
const createItem = async function(req,res){
    try{
        let bodyData = req.body
        let{ productName, quantity, stockPrice, sellPrice } = bodyData

        if(!productName ){return res.status(400).send({status:false, msg:"productName is required"})}

        if(typeof(productName) != "string"){return res.status(400).send({status:false, msg:" invalid name"})}

        if(!stockPrice){ return res.status(400).send({status:false, msg:"stockPrice is required"})}

        if(typeof(stockPrice) != "number"){return res.status(400).send({status:false,msg:"invalid stock price"})}

        if(!quantity){return res.status(400).send({status:false, msg:"quantity is required"})}

        if(typeof(quantity) != "number"){return res.status(400).send({status:false, msg:"invalid quantity"})}

        if(!sellPrice){return res.status(400).send({status:false, msg:"sellPrice is required"})}

        if(typeof(sellPrice) != "number"){return res.status(400).send({status:false, msg:"invalid sellPrice"})}

        let productNameIsExist = await itemModel.findOne({productName})

        if(productNameIsExist)return res.status(409).send({status:false,msg:"this product is aleady present in db"})

        let createSave = await itemModel.create(bodyData)

        return res.status(201).send({status:true,data:createSave})

        
    }catch(error){
        return res.status(500).send({ status: false, message: error.message });
    }

};

const getItems = async function(req,res){
    try{

        let itemExist = await itemModel.find({deleted:false})
        
        if(itemExist.length == 0){return res.status(404).send({status:false, msg:"item not found"})}
        
        res.status(200).send({status:true,data:itemExist})

    }catch(error){
        res.status(500).send({status:false, message:error.message})
    }
}
module.exports = { createItem, getItems }