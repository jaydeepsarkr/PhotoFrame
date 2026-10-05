const express = require('express')
const router = express.Router()
const frameController = require('../controllers/frameController')
const upload = require('../middleware/upload')

router.route('/')
  .get(frameController.getFrames)
  .post(upload.single('imageFile'), frameController.createFrame)

// Trash Bin and Bulk Operations (must be before /:id)
router.route('/deleted')
  .get(frameController.getDeletedFrames)

router.route('/bulk-delete')
  .post(frameController.bulkDeleteFrames)

router.route('/bulk-restore')
  .post(frameController.bulkRestoreFrames)

router.route('/bulk-permanent-delete')
  .post(frameController.bulkPermanentDeleteFrames)

router.route('/:id')
  .get(frameController.getFrameById)
  .put(upload.single('imageFile'), frameController.updateFrame)
  .delete(frameController.deleteFrame)

router.route('/:id/restore')
  .patch(frameController.restoreFrame)

router.route('/:id/permanent')
  .delete(frameController.permanentDeleteFrame)

module.exports = router
