const Job = require('../../models/Job');

exports.handleWebhook = async (req, res) => {
  const { requestId, result } = req.body;

  if (!requestId || !result) {
    return res.status(400).json({ error: 'Missing requestId or result' });
  }

  try {
    const job = await Job.findOne({ requestId });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    job.status = 'complete';
    job.result = result;
    await job.save();
    console.log("Webhook logic complete — sending response");

    res.json({ message: 'Webhook processed successfully' });
  } catch (err) {
    console.error('Webhook Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
