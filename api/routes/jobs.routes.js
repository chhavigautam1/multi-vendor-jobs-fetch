const express = require('express');
const router = express.Router();
const { createJob,getJobStatus } = require('../controllers/jobController');

router.post('/', createJob);
router.get('/:id', getJobStatus);

module.exports = router;
