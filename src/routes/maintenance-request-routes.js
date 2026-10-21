const express = require('express');
const controller = require('../controllers/maintenance-request-controller');
const { authenticate } = require('../middleware/authenticate');

const router = express.Router();
router.use(authenticate);
router.get('/', controller.list);
router.post('/', controller.create);
router.get('/:id/assignments', controller.listAssignments);
router.get('/:id', controller.getById);
router.patch('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
