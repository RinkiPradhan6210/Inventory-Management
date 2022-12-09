const grnModel = require("../models/grnModel.js")

const creatGrn = async function(req,res){
    try{
        let data = req.body;
        let { vendorName, vendorFullAddress, street, city, pincode, invoiceNumber, grnLineItems, status, date  } = data;

        const grnData = await userModel.create(data);
        return res.status(201).send({ status: true, message: "grn created successfully", data: grnData });

    }catch(error){
        return res.status(500).send({ status: false, message: error.message });
    }
};


module.exports = { creatGrn }