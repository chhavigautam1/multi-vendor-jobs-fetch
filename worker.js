const Redis = require('ioredis');
const mongoose = require('mongoose');
const axios = require('axios');
const Job = require('./models/Job');
require('dotenv').config();

//Redis connect
const redis = new Redis({ host: 'redis', port: 6379 });

//Mongo URI from .env
const MONGO_URI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

//MongoDB Connection
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Worker connected to MongoDB');
    startWorker(); 
  })
  .catch((err) => {
    console.error('MongoDB connection failed in worker:', err);
  });

//Worker function — wait for jobs
async function startWorker() {
  console.log('Worker started... Waiting for jobs');

  while (true) {
    try {
      const response = await redis.xread(
        'BLOCK', 0,
        'STREAMS', 'jobStream', '$'
      );

      const [stream, messages] = response[0];

      for (const [id, fields] of messages) {
        const data = parseFields(fields);
        console.log('New Job from Redis:', data);

        await processJob(data); 
      }

    } catch (err) {
      console.error('Worker error:', err);
    }
  }
}

// Parse Redis job fields
function parseFields(fields) {
  const data = {};
  for (let i = 0; i < fields.length; i += 2) {
    data[fields[i]] = fields[i + 1];
  }
  return data;
}

//Job Processor
async function processJob({ requestId, vendor }) {
  const job = await Job.findOne({ requestId });

  if (!job) {
    console.log("Job not found in DB:", requestId);
    return;
  }

  job.status = 'processing';
  await job.save();

  const url = `http://server:8080/vendors/${vendor}`;

  try {
    // send the payload along with requestId
    const response = await axios.post(url, {
      ...job.payload,
      requestId, //pass requestId to vendor
    });

    if (vendor === 'sync') {
      // Only mark complete if sync
      job.status = 'complete';
      job.result = response.data;
      await job.save();
      console.log(`Job ${requestId} (sync) processed & saved`);
    } else {
      // For async, wait for webhook to complete it
      console.log(`Async job ${requestId} acknowledged — waiting for webhook`);
    }

  } catch (err) {
    console.error(`Vendor API failed for ${vendor}:`, err.message);
    job.status = 'failed';
    await job.save();
  }
}
