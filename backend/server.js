const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");

const connectDatabase = require("./config/db");
const formRoutes = require("./routes/formRoutes");

dotenv.config();

const app = express();

connectDatabase();

app.use(helmet());

app.use(
  cors({
    origin: [
      "http://localhost:5500",
      "http://127.0.0.1:5500"
    ],
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type"]
  })
);

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Form API is running"
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy"
  });
});

app.use("/api/forms", formRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route nahi mila"
  });
});

app.use((error, req, res, next) => {
  console.error("Server error:", error);

  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server port ${PORT} par running hai`);
});