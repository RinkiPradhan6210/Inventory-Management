const orderModel =require('../models/orderModel')
const itemModel = require('../models/itemModel')
const orderLineItemsModel = require('../models/orderLIneItemModel');
const { default: mongoose } = require('mongoose');

const createOrder = async function(req,res){
     try{
        let body = req.body
        let{customerName, customerFullAddress, invoiceNumber}= body

        if(!customerName){return res.status(400).send({status:false, msg:"customerName is required"})}

        let nameReg = /^[a-zA-Z]+/;
        if(!nameReg.test(customerName)){return res.status(400).send({status:false, msg:"customerName is invalid"})}
        if(!invoiceNumber){return res.status(400).send({status:false, msg:"invoice nubmer is required"})}
        if (!(/^[1-9]{1}[0-9]{5}$/).test(customerFullAddress.pincode)) return res.status(400).send({ status: false, message: "invalid Pincode in customerFullAdress" })

        body.orderLineItems =[]
       
        if(body.product){
    
        for (let i=0;i<body.product.length;i++) {
            const product = body.product[i];

            const productName = product.name
            if(!product.name || !product.quantity){return res.status(400).send({status:false, msg:"name and quantity is required"})}
            const item = await itemModel.findOne({productName : productName})

            if(!item || item.quantity < product.quantity){return res.status(404).send({status:false, msg:"product is out of stock"})}

            const order = await orderLineItemsModel.create({ productName: product.name, sellPrice: item.sellPrice, quantity:product.quantity})
            body.orderLineItems.push(order._id)
            
          }
        }
          let data = await orderModel.create(body)
          console.log(data._id)
          return res.status(201).send({status:true, data:data})

     }catch(error){
          return res.status(500).send({status:false,messsage:error.message})
      }
};

const getOrder = async function(req,res){
    try{
        let orderExist = await orderModel.find({deleted:false})
        
        if(orderExist.length == 0){return res.status(404).send({status:false, msg:"order not found"})}
        
        res.status(200).send({status:true,data:orderExist})
    }catch(error){
        return res.status(500).send({status:false,messsage:error.message})
    }
};

const updateOrder = async function(req,res){
    try{
        let orderId = req.query.orderId
      
        let body = req.body
        
        let{customerName, customerFullAddress, invoiceNumber}= body

         if(!orderId){return res.status(400).send({status:false,msg:"orderId is required"})}

        if(!mongoose.Types.ObjectId.isValid(orderId)){return res.status(400).send({status:false,msg:"orderId is invalid"})}

        let nameReg = /^[a-zA-Z]+/;
        if(customerName && !nameReg.test(customerName)){return res.status(400).send({status:false, msg:"customerName is invalid"})}
        let existId = await orderModel.findById({_id:orderId,deleted:false})
        if(!existId){return res.status(400).send({status:false,msg:"orderis not found"})}
        
          if(customerName) existId.customerName = customerName;
         let {city,street,pincode} = customerFullAddress
         if(city) existId.customerFullAddress.city = city;
        if(street) existId.customerFullAddress.street = street;
        if (!(/^[1-9]{1}[0-9]{5}$/).test(pincode)) return res.status(400).send({ status: false, message: "invalid Pincode in customerFullAdress" })

        if(pincode) existId.customerFullAddress.pincode = pincode;
        
        if(invoiceNumber) existId.invoiceNumber = invoiceNumber;
        
          let updateData = await orderModel.findByIdAndUpdate(orderId,existId,{new:true})
          return res.status(201).send({status:true, data:updateData})


    }catch(error){
        return res.status(500).send({status:false,messsage:error.message})
    }
};

const deleteOrder = async function(req,res){
    try{
        let orderId = req.query.orderId

        if(!orderId){return res.status(400).send({status:false,msg:"orderId is required"})}

        if(!mongoose.Types.ObjectId.isValid(orderId)){return res.status(400).send({status:false,msg:"orderId is invalid"})}
       
        let existOrder = await orderModel.findById({_id:orderId,deleted:false})
        if(!existOrder || existOrder.deleted ==true){return res.status(404).send({status:false,msg:"order not found"})}
        
        let deleteData = await orderModel.findByIdAndUpdate({_id:orderId},{deleted:true},{new:true})
        return res.status(200).send({status:true,msg:"order is successfully deleted"})


    }catch(error){
        return res.status(500).send({status:false,messsage:error.message})
    }
};
const updateOrderStatus = async function(req,res){
    try{
       let orderItemId = req.query.orderItemId
       let {status,productName}= req.body
       if(!orderItemId){return res.status(400).send({status:false,msg:"orderItemId is required"})}

        if(!mongoose.Types.ObjectId.isValid(orderItemId)){return res.status(400).send({status:false,msg:"orderItemId is invalid"})}

        let orderItemExist = await orderLineItemsModel.findById({_id:orderItemId},{deleted:false})

        if(!orderItemExist){return res.status(404).send({status:false,msg:"orderItem is not found"})}
        let itemInOrder = orderItemExist.productName
        
        let quantityInOrder= orderItemExist.quantity
        
        let itemExist = await itemModel.findOne({productName:itemInOrder},{deleted:false})
        if(!itemExist){return res.status(404).send({status:false,msg:"grnItemId is not found in db"})}
        let item = orderItemExist.productName
    
        let quantity = itemExist.quantity
       if(quantity < quantityInOrder){return res.status(404).send({status:false,msg:"items are not available"})}
        if(status == "COMPLETED"){
            itemExist.quantity = quantity - quantityInOrder 
        }

        let update = await itemModel.findOneAndUpdate({productName:itemInOrder},{quantity:itemExist.quantity},{new:true})
        
     return res.status(200).send({status:true,items:itemExist})
    }catch(error){
        return res.status(500).send({status:false,messsage:error.message})
    }
};

module.exports ={createOrder,getOrder, updateOrder, deleteOrder, deleteOrder, updateOrderStatus}