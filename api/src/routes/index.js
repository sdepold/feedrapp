const express = require('express');

const router = express.Router();
const { handleFeedRequest } = require('../controllers/api-controller');

router.get('/api', handleFeedRequest);

module.exports = router;
