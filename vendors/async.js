const axios = require("axios");

module.exports = (req, res) => {
  const { requestId } = req.body;

  res.json({ message: "Async job received and will be processed soon" });

  setTimeout(async () => {
    const result = {
      vendor: "async",
      success: true,
      data: {
        processed: true,
        info: "Delayed async processing complete",
      },
    };

    try {
     const response= await axios.post(
        "http://localhost:8080/webhook",
        {
          requestId,
          result,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(`Webhook sent for ${requestId}`);
      console.log("Webhook response:", response.data);
    } catch (err) {
      console.error("Webhook failed:", err.message);
    }
  }, 30000);
};
