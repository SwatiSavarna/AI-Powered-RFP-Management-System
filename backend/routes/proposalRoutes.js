const express = require('express');
const router = express.Router();
const proposalController = require('../controllers/proposalController');

router.get('/:id', proposalController.getProposalById);//done

module.exports = router;

