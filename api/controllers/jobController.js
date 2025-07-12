const { v4: uuidv4 } = require('uuid');
const Job = require('../../models/Job');
const Redis = require('ioredis');
const redis = new Redis({ host: 'redis', port: 6379 }); // docker ho to host: 'redis'

exports.createJob = async (req, res) => {
  try {
    const requestId = uuidv4();
    const payload = req.body;
    const vendor = Math.random() < 0.5 ? 'sync' : 'async';

    const job = new Job({ requestId, vendor, payload });
    await job.save();

    await redis.xadd('jobStream', '*', 'requestId', requestId, 'vendor', vendor);

    res.json({ request_id: requestId });
  } catch (err) {
    console.error('Error creating job:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getJobStatus=async (req,res) => {
  try {
    const {id}=req.params
    const job=await Job.findOne({requestId:id})

    if(!job){
      return res.status(404).json({
        error:"Job not found!"
      })
    }

    res.status(200).json({
      status:job.status,
      result:job.result,
      createdAt:job.createdAt,
      updatedAt:job.updatedAt
    })
    
  } catch (error) {
    console.log("error in get job staus: ", error)
    res.status(500).json({
      error:'Server error'
    })
    
  }
  
}
