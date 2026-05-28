import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import contactRouter from "./routes/contact.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/contact", contactRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is required in .env");
  process.exit(1);
}

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });
