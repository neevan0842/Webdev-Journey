import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import cors from "cors";
import cookieParser from "cookie-parser";
import healthRoute from "./routes/health.route.js";
// import xss from "xss-clean"; // Not compatible with Express v5
// import mongoSanitize from "express-mongo-sanitize"; // Not compatible with Express v5

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Global Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

// Security Middleware
app.use(helmet()); // Set security HTTP headers
// app.use(mongoSanitize()); // Not compatible with Express v5 - removed
// app.use(xss()); // Not compatible with Express v5 - removed
app.use("/api", limiter); // Apply rate limiting to all routes
app.use(hpp()); // Prevent HTTP Parameter Pollution

// logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Body Parser Middleware
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// CORS Configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "device-remember-token",
      "Access-Control-Allow-Origin",
      "Origin",
      "Accept",
    ],
  })
);

// API Routes
app.use("/health", healthRoute);

//404 Route
app.use((req, res, next) => {
  res.status(404).json({
    status: "Error",
    message: "Route not found",
  });
});

// Global error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: "Error",
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT} in ${process.env.NODE_ENV} mode`);
});
