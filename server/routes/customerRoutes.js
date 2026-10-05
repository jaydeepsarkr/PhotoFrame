const express = require('express')
const router = express.Router()
const customerController = require('../controllers/customerController')

router.route('/')
  .get(customerController.getCustomers)

router.route('/send-email')
  .post(customerController.sendCustomerEmail)

// Deleted items and bulk operations (Must be before /:id)
router.route('/deleted')
  .get(customerController.getDeletedCustomers)

router.route('/bulk-delete')
  .post(customerController.bulkDeleteCustomers)

router.route('/bulk-restore')
  .post(customerController.bulkRestoreCustomers)

router.route('/bulk-permanent-delete')
  .post(customerController.bulkPermanentDeleteCustomers)

// Single item routes
router.route('/:id')
  .delete(customerController.deleteCustomer)

router.route('/:id/restore')
  .patch(customerController.restoreCustomer)

router.route('/:id/permanent')
  .delete(customerController.permanentDeleteCustomer)

module.exports = router
