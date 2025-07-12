const express = require("express");
const app = express();
app.use(express.json());


require("dotenv").config();

const connectDB = require("./config/db");
const jobRoutes = require("./routes/jobs.routes");
const vendorRoutes = require("./routes/vendors.routes");
const webhookRoutes = require('./routes/webhook.routes');

connectDB();

app.use("/jobs", jobRoutes);
app.use("/vendors", vendorRoutes);
app.use('/webhook', webhookRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
