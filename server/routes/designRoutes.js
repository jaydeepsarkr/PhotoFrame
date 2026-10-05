const express = require('express')
const router = express.Router()
const designController = require('../controllers/designController')
const upload = require('../middleware/upload')

router.route('/')
  .get(designController.getDesigns)
  .post(upload.single('imageFile'), designController.createDesign)

// Trash Bin and Bulk Operations (must be before /:id)
router.route('/deleted')
  .get(designController.getDeletedDesigns)

router.route('/bulk-delete')
  .post(designController.bulkDeleteDesigns)

router.route('/bulk-restore')
  .post(designController.bulkRestoreDesigns)

router.route('/bulk-permanent-delete')
  .post(designController.bulkPermanentDeleteDesigns)

router.route('/:id')
  .get(designController.getDesignById)
  .put(upload.single('imageFile'), designController.updateDesign)
  .delete(designController.deleteDesign)

router.route('/:id/restore')
  .patch(designController.restoreDesign)

router.route('/:id/permanent')
  .delete(designController.permanentDeleteDesign)

module.exports = router
