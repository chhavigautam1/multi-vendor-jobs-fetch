const express = require('express');
const router = express.Router();
const syncHandler=require('../../vendors/sync')
const asyncHandler=require('../../vendors/async')

router.post('/sync', syncHandler);
router.post('/async', asyncHandler);

module.exports = router;
