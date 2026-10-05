const express = require('express')
const router = express.Router()
const orderController = require('../controllers/orderController')

router.route('/')
  .get(orderController.getOrders)
  .post(orderController.createOrder)

// Deleted items and bulk operations (Must be before /:id)
router.route('/deleted')
  .get(orderController.getDeletedOrders)

router.route('/bulk-delete')
  .post(orderController.bulkDeleteOrders)

router.route('/bulk-restore')
  .post(orderController.bulkRestoreOrders)

router.route('/bulk-permanent-delete')
  .post(orderController.bulkPermanentDeleteOrders)

// Single item routes
router.route('/:id')
  .get(orderController.getOrderById)
  .delete(orderController.deleteOrder)

router.route('/:id/status')
  .patch(orderController.updateOrderStatus)

router.route('/:id/restore')
  .patch(orderController.restoreOrder)

router.route('/:id/permanent')
  .delete(orderController.permanentDeleteOrder)

module.exports = router
