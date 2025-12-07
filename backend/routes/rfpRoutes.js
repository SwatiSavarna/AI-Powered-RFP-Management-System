const express = require('express');
const router = express.Router();
const rfpController = require('../controllers/rfpController');
const compareController = require('../controllers/compareController');


router.post("/analyze-rfp", rfpController.createRFP);//done
router.get('/', rfpController.listAllRFPs)//done
router.get('/:id', rfpController.getRFP);//done
router.get('/:id/proposals', compareController.listProposalsForRFP);//done
router.post('/:id/compare', compareController.evaluateVendors);//done

module.exports = router;
