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
      "http://127.0.0.1:5500",
      "http://8.231.124.167"
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

app.use("/api/forms", formRoutes);

// Rest of your code (PORT, app.listen, etc.) remains exactly the same.