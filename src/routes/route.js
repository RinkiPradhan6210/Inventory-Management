const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController')
const orderController = require('../controllers/orderController')
const grnController = require('../controllers/grnController')

router.post('/order',orderController.createOrder)
router.get('/order',orderController.getOrder)
router.put('/order',orderController.updateOrder)
router.delete('/order',orderController.deleteOrder)
router.post('/order/update-status', orderController.updateOrderStatus)

router.post('/grn',grnController.createGrn)
router.get('/grn',grnController.getGrn)
router.put('/grn',grnController.updateGrn)
router.delete('/grn',grnController.deleteGrn)
router.post('/grn/update-status',grnController.updateGrnStatus)

router.post('/item', itemController.createItem)
router.get('/item',itemController.getItems)

module.exports=router;