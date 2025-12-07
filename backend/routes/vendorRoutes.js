const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');

router.post('/', vendorController.createVendor);//done
router.get('/', vendorController.listVendors);//done
router.post('/send', vendorController.sendRFP);//done
router.get('/:id', vendorController.getVendor);//done
module.exports = router;
