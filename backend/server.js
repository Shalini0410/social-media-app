const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: __dirname + "/.env" });

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");   // ✅ ADD THIS

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => {
    console.error("MongoDB Connection Error ❌:", err.message);
    process.exit(1);
  });

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);   // ✅ ADD THIS

app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});